using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using DACN_QLPK_1150070050_NguyenNgocTuVy.Data;
using DACN_QLPK_1150070050_NguyenNgocTuVy.Models;
using DACN_QLPK_1150070050_NguyenNgocTuVy.Dtos;
using DACN_QLPK_1150070050_NguyenNgocTuVy.Services;
using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace DACN_QLPK_1150070050_NguyenNgocTuVy.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly DACNDbContext _db;
        private readonly IPasswordHasher _hasher;
        private readonly IHttpContextAccessor _http;
        private readonly IConfiguration _config;


        public AuthController(
            DACNDbContext db,
            IPasswordHasher hasher,
            IHttpContextAccessor http,
            IConfiguration config)
        {
            _db = db;
            _hasher = hasher;
            _http = http;
            _config = config;
        }

        // ============================
        // POST api/auth/register
        // ============================
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest req)
        {
            if (string.IsNullOrWhiteSpace(req.TenDangNhap) || string.IsNullOrWhiteSpace(req.MatKhau))
                return BadRequest("Thiếu thông tin đăng ký.");

            var existed = await _db.NguoiDungs.AnyAsync(x => x.TenDangNhap == req.TenDangNhap);
            if (existed) return Conflict("Tài khoản đã tồn tại.");

            var (hash, salt) = _hasher.Hash(req.MatKhau);

            var user = new NguoiDung
            {
                TenDangNhap = req.TenDangNhap,
                MatKhau = hash,
                Salt = salt,
                HoatDong = true,
                Email = req.Email,
                SoDienThoai = req.SoDienThoai,
                HoTen = req.HoTen ?? req.TenDangNhap,
                SoLanSai = 0,
                SoLanKhoa = 0,
                CreatedAt = DateTime.UtcNow,
                MaNv = "NV" + DateTime.UtcNow.ToString("yyyyMMddHHmmss")
            };

            _db.NguoiDungs.Add(user);
            await _db.SaveChangesAsync();

            // Gán vai trò nếu có
            if (req.VaiTroIds != null && req.VaiTroIds.Length > 0)
            {
                foreach (var rid in req.VaiTroIds.Distinct())
                {
                    _db.NguoiDungVaiTros.Add(new NguoiDungVaiTro
                    {
                        IdNguoiDung = user.Id,
                        IdVaiTro = rid
                    });
                }
                await _db.SaveChangesAsync();
            }

            return Ok(new { message = "Đăng ký thành công", userId = user.Id });
        }

        // ============================
        // GET api/auth/roles
        // ============================
        [HttpGet("roles")]
        public async Task<IActionResult> GetRoles()
        {
            var roles = await _db.VaiTros
                .Select(v => new
                {
                    v.Id,
                    v.Ten,
                    v.MoTa
                })
                .ToListAsync();

            return Ok(roles);
        }

        // ============================
        // POST api/auth/login
        // ============================
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest req)
        {
            var user = await _db.NguoiDungs
                .Include(u => u.NguoiDungVaiTros)
                    .ThenInclude(m => m.IdVaiTroNavigation)
                .FirstOrDefaultAsync(x => x.TenDangNhap == req.TenDangNhap);

            var ip = _http.HttpContext?.Connection?.RemoteIpAddress?.ToString() ?? "unknown";
            var now = DateTime.UtcNow;

            if (user == null)
                return Unauthorized("Sai tài khoản hoặc mật khẩu.");

            if (user.HoatDong == false)
            {
                await LogHistory(user.Id, now, ip, "ThatBai_BiKhoa");
                return Forbid("Tài khoản đã bị khoá.");
            }

            // ===========================================
            // KIỂM TRA MẬT KHẨU (PBKDF2 + SHA256 cũ)
            // ===========================================
            bool ok = false;

            // 1️⃣ PBKDF2
            if (!string.IsNullOrEmpty(user.Salt))
                ok = _hasher.Verify(req.MatKhau, user.MatKhau, user.Salt);

            // 2️⃣ SHA256 (legacy)
            if (!ok)
            {
                try
                {
                    using var sha256 = SHA256.Create();
                    var bytes = Encoding.UTF8.GetBytes(req.MatKhau + user.Salt);
                    var hash = Convert.ToBase64String(sha256.ComputeHash(bytes));

                    if (hash == user.MatKhau)
                    {
                        ok = true;

                        // Nâng cấp lên PBKDF2
                        var (newHash, newSalt) = _hasher.Hash(req.MatKhau);
                        user.MatKhau = newHash;
                        user.Salt = newSalt;
                        await _db.SaveChangesAsync();
                    }
                }
                catch { }
            }

            if (!ok)
            {
                user.SoLanSai = (user.SoLanSai ?? 0) + 1;
                if (user.SoLanSai >= 5)
                {
                    user.HoatDong = false;
                    user.SoLanKhoa = (user.SoLanKhoa ?? 0) + 1;
                }
                await _db.SaveChangesAsync();
                await LogHistory(user.Id, now, ip, "ThatBai");

                return Unauthorized(user.HoatDong == true
                    ? "Sai mật khẩu"
                    : "Sai 5 lần – tài khoản tạm khoá");
            }

            // ===========================================
            // LOGIN OK → RESET TRẠNG THÁI
            // ===========================================
            user.SoLanSai = 0;
            user.LanDangNhapCuoi = now;
            await _db.SaveChangesAsync();
            await LogHistory(user.Id, now, ip, "ThanhCong");

            var roles = user.NguoiDungVaiTros
                .Where(x => x.IdVaiTroNavigation != null)
                .Select(x => x.IdVaiTroNavigation!.Ten)
                .ToArray();

            // ===========================================
            //  🚀 TẠO JWT TOKEN
            // ===========================================
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
    {
        new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
        new Claim("username", user.TenDangNhap)
    };

            foreach (var r in roles)
                claims.Add(new Claim(ClaimTypes.Role, r));

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(8),
                signingCredentials: creds
            );

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            // ===========================================
            // TRẢ VỀ CLIENT
            // ===========================================
            return Ok(new
            {
                message = "Đăng nhập thành công",
                token = jwt,
                userId = user.Id,
                tenDangNhap = user.TenDangNhap,
                roles
            });
        }


        // ============================
        // GET api/auth/me?id=4
        // ============================
        [HttpGet("me")]
        public async Task<IActionResult> Me([FromQuery] long id)
        {
            if (id <= 0) return BadRequest("Thiếu id.");

            var user = await _db.NguoiDungs
                .Include(u => u.NguoiDungVaiTros)
                    .ThenInclude(m => m.IdVaiTroNavigation)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (user == null) return NotFound();

            return Ok(new
            {
                user.Id,
                user.TenDangNhap,
                user.Email,
                user.SoDienThoai,
                user.HoTen,
                user.HoatDong,
                roles = user.NguoiDungVaiTros.Select(x => x.IdVaiTroNavigation!.Ten)
            });
        }

        // ============================
        // Ghi lịch sử đăng nhập
        // ============================
        private async Task LogHistory(long userId, DateTime time, string ip, string result)
        {
            _db.LichSuDangNhaps.Add(new LichSuDangNhap
            {
                IdNguoiDung = userId,
                ThoiGian = time,
                Ip = ip,
                KetQua = result
            });
            await _db.SaveChangesAsync();
        }
    }
}

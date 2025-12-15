using DACN_QLPK_1150070050_NguyenNgocTuVy.Data;
using DACN_QLPK_1150070050_NguyenNgocTuVy.Dtos;
using DACN_QLPK_1150070050_NguyenNgocTuVy.Models;
using DACN_QLPK_1150070050_NguyenNgocTuVy.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;

namespace DACN_QLPK_1150070050_NguyenNgocTuVy.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class AdminAuthController : ControllerBase
    {
        private readonly DACNDbContext _db;
        private readonly IPasswordHasher _hasher;

        public AdminAuthController(DACNDbContext db, IPasswordHasher hasher)
        {
            _db = db;
            _hasher = hasher;

        }

        // ============================
        // 1️⃣ GET /api/users?keyword=&role=&status=
        // ============================
        [HttpGet]
        public async Task<IActionResult> GetUsers(
            [FromQuery] string? keyword,
            [FromQuery] string? role,
            [FromQuery] bool? active)
        {
            var query = _db.NguoiDungs.AsQueryable();

            if (!string.IsNullOrEmpty(keyword))
            {
                keyword = keyword.ToLower();
                query = query.Where(x =>
                    x.HoTen.ToLower().Contains(keyword) ||
                    x.TenDangNhap.ToLower().Contains(keyword) ||
                    (x.Email != null && x.Email.ToLower().Contains(keyword)) ||
                    (x.SoDienThoai != null && x.SoDienThoai.Contains(keyword))
                );
            }

            if (!string.IsNullOrEmpty(role))
            {
                query = query.Where(x =>
                    _db.NguoiDungVaiTros
                    .Any(r => r.IdNguoiDung == x.Id &&
                              _db.VaiTros.Any(v => v.Id == r.IdVaiTro && v.Ten == role))
                );
            }

            if (active.HasValue)
                query = query.Where(x => x.HoatDong == active.Value);

            var list = await query
                .OrderByDescending(x => x.Id)
                .Select(x => new UserListDto
                {
                    Id = x.Id,
                    TenDangNhap = x.TenDangNhap,
                    HoTen = x.HoTen,
                    Email = x.Email,
                    SoDienThoai = x.SoDienThoai,
                    HoatDong = x.HoatDong,
                    ChucDanh = x.ChucDanh,
                    VaiTro = string.Join(", ",
                        _db.NguoiDungVaiTros
                        .Where(nr => nr.IdNguoiDung == x.Id)
                        .Select(nr => nr.IdVaiTroNavigation.Ten))
                })
                .ToListAsync();

            return Ok(list);
        }

        // ============================
        // 2️⃣ POST /api/users
        // ============================
        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] UserCreateDto dto)
        {
            if (await _db.NguoiDungs.AnyAsync(x => x.TenDangNhap == dto.TenDangNhap))
                return Conflict(new { message = "Tên đăng nhập đã tồn tại." });

            var salt = Guid.NewGuid().ToString("N");
            var hashedPassword = HashPassword(dto.MatKhau, salt);
            var maNv = "NV" + DateTime.Now.ToString("yyyyMMddHHmmss");

            var user = new NguoiDung
            {
                TenDangNhap = dto.TenDangNhap,
                MatKhau = hashedPassword,
                Salt = salt,
                MaNv = maNv,
                HoTen = dto.HoTen,
                ChucDanh = dto.ChucDanh,
                KhoaPhong = dto.KhoaPhong,
                Email = dto.Email,
                SoDienThoai = dto.SoDienThoai,
                HoatDong = true,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };

            _db.NguoiDungs.Add(user);
            await _db.SaveChangesAsync();

            // Nếu có vai trò, gán luôn
            if (dto.VaiTro != null)
            {
                var roles = dto.VaiTro.Split(',')
                    .Select(r => r.Trim())
                    .Where(r => !string.IsNullOrWhiteSpace(r))
                    .ToList();

                foreach (var roleName in roles)
                {
                    var role = await _db.VaiTros.FirstOrDefaultAsync(v => v.Ten == roleName);
                    if (role != null)
                    {
                        _db.NguoiDungVaiTros.Add(new NguoiDungVaiTro
                        {
                            IdNguoiDung = user.Id,
                            IdVaiTro = role.Id
                        });
                    }
                }
                await _db.SaveChangesAsync();
            }

            return Ok(new
            {
                message = "Tạo người dùng thành công.",
                user.Id,
                user.TenDangNhap,
                user.HoTen
            });
        }

        // ============================
        // 3️⃣ PUT /api/users/{id}
        // ============================
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(long id, [FromBody] UserUpdateDto dto)
        {
            var user = await _db.NguoiDungs.FindAsync(id);
            if (user == null)
                return NotFound(new { message = "Không tìm thấy người dùng." });

            if (!string.IsNullOrWhiteSpace(dto.HoTen)) user.HoTen = dto.HoTen;
            if (!string.IsNullOrWhiteSpace(dto.Email)) user.Email = dto.Email;
            if (!string.IsNullOrWhiteSpace(dto.SoDienThoai)) user.SoDienThoai = dto.SoDienThoai;
            if (!string.IsNullOrWhiteSpace(dto.ChucDanh)) user.ChucDanh = dto.ChucDanh;
            if (!string.IsNullOrWhiteSpace(dto.KhoaPhong)) user.KhoaPhong = dto.KhoaPhong;
            if (dto.HoatDong.HasValue) user.HoatDong = dto.HoatDong.Value;
            user.UpdatedAt = DateTime.Now;

            await _db.SaveChangesAsync();
            return Ok(new { message = "Cập nhật người dùng thành công." });
        }

        // ============================
        // 4️⃣ PATCH /api/users/{id}/lock
        // ============================
        [HttpPatch("{id}/lock")]
        public async Task<IActionResult> LockUser(long id, [FromBody] UserLockDto dto)
        {
            var user = await _db.NguoiDungs.FindAsync(id);
            if (user == null)
                return NotFound(new { message = "Không tìm thấy người dùng." });

            user.HoatDong = !dto.Khoa;
            user.UpdatedAt = DateTime.Now;
            await _db.SaveChangesAsync();

            return Ok(new { message = dto.Khoa ? "Đã khoá tài khoản." : "Đã mở khoá tài khoản." });
        }

        // ============================
        // 5️⃣ PATCH /api/users/{id}/reset-password
        // ============================
        [HttpPatch("{id}/reset-password")]
        public async Task<IActionResult> ResetPassword(long id)
        {
            var user = await _db.NguoiDungs.FindAsync(id);
            if (user == null)
                return NotFound(new { message = "Không tìm thấy người dùng." });

            string newPassword = "Abcd@1234";

            // ✅ Dùng đúng PasswordHasher để sinh hash + salt Base64
            var (hash, salt) = _hasher.Hash(newPassword);

            user.MatKhau = hash;
            user.Salt = salt;
            user.SoLanSai = 0;
            user.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();

            return Ok(new
            {
                message = "Đặt lại mật khẩu thành công.",
                mat_khau_mac_dinh = newPassword
            });
        }

        // ============================
        // 6️⃣ PATCH /api/users/{id}/roles
        // ============================
        [HttpPatch("{id}/roles")]
        public async Task<IActionResult> UpdateUserRoles(long id, [FromBody] List<string> roles)
        {
            var user = await _db.NguoiDungs.FindAsync(id);
            if (user == null)
                return NotFound(new { message = "Không tìm thấy người dùng." });

            // Xoá toàn bộ vai trò cũ
            var oldRoles = _db.NguoiDungVaiTros.Where(r => r.IdNguoiDung == id);
            _db.NguoiDungVaiTros.RemoveRange(oldRoles);

            // Gán lại các vai trò mới (nếu tồn tại)
            foreach (var roleName in roles)
            {
                var role = await _db.VaiTros.FirstOrDefaultAsync(v => v.Ten == roleName);
                if (role != null)
                {
                    _db.NguoiDungVaiTros.Add(new NguoiDungVaiTro
                    {
                        IdNguoiDung = id,
                        IdVaiTro = role.Id
                    });
                }
            }

            await _db.SaveChangesAsync();
            return Ok(new { message = "Cập nhật vai trò người dùng thành công." });
        }

        // ============================
        // 7️⃣ DELETE /api/users/{id}
        // ============================
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(long id)
        {
            var user = await _db.NguoiDungs.FindAsync(id);
            if (user == null)
                return NotFound(new { message = "Không tìm thấy người dùng." });

            var roles = _db.NguoiDungVaiTros.Where(r => r.IdNguoiDung == id);
            _db.NguoiDungVaiTros.RemoveRange(roles);

            _db.NguoiDungs.Remove(user);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Xoá người dùng thành công." });
        }

        // ============================
        // Helper: Hash mật khẩu
        // ============================
        private static string HashPassword(string password, string salt)
        {
            using var sha256 = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(password + salt);
            var hash = sha256.ComputeHash(bytes);
            return Convert.ToBase64String(hash);
        }
    }
}

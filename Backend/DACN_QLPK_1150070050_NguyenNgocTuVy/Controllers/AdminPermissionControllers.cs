using DACN_QLPK_1150070050_NguyenNgocTuVy.Data;
using DACN_QLPK_1150070050_NguyenNgocTuVy.Dtos;
using DACN_QLPK_1150070050_NguyenNgocTuVy.Models;
using DACN_QLPK_1150070050_NguyenNgocTuVy.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace DACN_QLPK_1150070050_NguyenNgocTuVy.Controllers
{
    // ============================================================
    // 1️⃣ VaiTrò Controller
    // ============================================================
    [ApiController]
    [Route("api/vaitro")]
    public class VaiTroController : ControllerBase
    {
        private readonly DACNDbContext _db;
        public VaiTroController(DACNDbContext db) => _db = db;

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var list = await _db.VaiTros.OrderBy(x => x.Id)
                .Select(x => new VaiTroDto { Id = x.Id, Ten = x.Ten, MoTa = x.MoTa })
                .ToListAsync();
            return Ok(list);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] VaiTroDto dto)
        {
            if (await _db.VaiTros.AnyAsync(x => x.Ten == dto.Ten))
                return Conflict(new { message = "Vai trò đã tồn tại." });

            _db.VaiTros.Add(new VaiTro { Ten = dto.Ten, MoTa = dto.MoTa });
            await _db.SaveChangesAsync();
            return Ok(new { message = "Tạo vai trò thành công." });
        }

        [HttpPut("{id:long}")]
        public async Task<IActionResult> Update(long id, [FromBody] VaiTroDto dto)
        {
            var vt = await _db.VaiTros.FindAsync(id);
            if (vt == null) return NotFound();

            vt.Ten = dto.Ten;
            vt.MoTa = dto.MoTa;
            await _db.SaveChangesAsync();
            return Ok(new { message = "Cập nhật thành công." });
        }

        [HttpDelete("{id:long}")]
        public async Task<IActionResult> Delete(long id)
        {
            var vt = await _db.VaiTros.FindAsync(id);
            if (vt == null) return NotFound();
            _db.VaiTros.Remove(vt);
            await _db.SaveChangesAsync();
            return Ok(new { message = "Xóa vai trò thành công." });
        }
    }

    // ============================================================
    // 2️⃣ ChứcNăng Controller
    // ============================================================
    [ApiController]
    [Route("api/chucnang")]
    public class ChucNangController : ControllerBase
    {
        private readonly DACNDbContext _db;
        public ChucNangController(DACNDbContext db) => _db = db;

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var list = await _db.ChucNangs.OrderBy(x => x.Id)
                .Select(x => new ChucNangDto { Id = x.Id, MaChucNang = x.MaChucNang, Ten = x.Ten, MoTa = x.MoTa })
                .ToListAsync();
            return Ok(list);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ChucNangDto dto)
        {
            if (await _db.ChucNangs.AnyAsync(x => x.MaChucNang == dto.MaChucNang))
                return Conflict(new { message = "Mã chức năng đã tồn tại." });

            _db.ChucNangs.Add(new ChucNang { MaChucNang = dto.MaChucNang, Ten = dto.Ten, MoTa = dto.MoTa });
            await _db.SaveChangesAsync();
            return Ok(new { message = "Thêm chức năng thành công." });
        }

        [HttpPut("{id:long}")]
        public async Task<IActionResult> Update(long id, [FromBody] ChucNangDto dto)
        {
            var cn = await _db.ChucNangs.FindAsync(id);
            if (cn == null) return NotFound();

            cn.Ten = dto.Ten;
            cn.MoTa = dto.MoTa;
            await _db.SaveChangesAsync();
            return Ok(new { message = "Cập nhật chức năng thành công." });
        }

        [HttpDelete("{id:long}")]
        public async Task<IActionResult> Delete(long id)
        {
            var cn = await _db.ChucNangs.FindAsync(id);
            if (cn == null) return NotFound();
            _db.ChucNangs.Remove(cn);
            await _db.SaveChangesAsync();
            return Ok(new { message = "Xóa chức năng thành công." });
        }
    }

    // ============================================================
    // 3️⃣ Quyền Controller
    // ============================================================
    [ApiController]
    [Route("api/quyen")]
    public class QuyenController : ControllerBase
    {
        private readonly DACNDbContext _db;
        public QuyenController(DACNDbContext db) => _db = db;

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var list = await _db.Quyens
                .Include(q => q.IdChucNangNavigation)
                .OrderBy(x => x.Id)
                .Select(q => new
                {
                    q.Id,
                    q.MaQuyen,
                    q.IdChucNang,
                    ChucNang = q.IdChucNangNavigation.Ten,
                    q.Xem,
                    q.Them,
                    q.Sua,
                    q.Xoa,
                    q.Xuat
                })
                .ToListAsync();
            return Ok(list);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] QuyenDto dto)
        {
            if (await _db.Quyens.AnyAsync(x => x.MaQuyen == dto.MaQuyen))
                return Conflict(new { message = "Mã quyền đã tồn tại." });

            _db.Quyens.Add(new Quyen
            {
                IdChucNang = dto.IdChucNang,
                MaQuyen = dto.MaQuyen,
                Xem = dto.Xem,
                Them = dto.Them,
                Sua = dto.Sua,
                Xoa = dto.Xoa,
                Xuat = dto.Xuat
            });
            await _db.SaveChangesAsync();
            return Ok(new { message = "Thêm quyền thành công." });
        }

        [HttpPut("{id:long}")]
        public async Task<IActionResult> Update(long id, [FromBody] QuyenDto dto)
        {
            var q = await _db.Quyens.FindAsync(id);
            if (q == null) return NotFound();

            q.IdChucNang = dto.IdChucNang;
            q.MaQuyen = dto.MaQuyen;
            q.Xem = dto.Xem; q.Them = dto.Them; q.Sua = dto.Sua; q.Xoa = dto.Xoa; q.Xuat = dto.Xuat;
            await _db.SaveChangesAsync();
            return Ok(new { message = "Cập nhật quyền thành công." });
        }

        [HttpDelete("{id:long}")]
        public async Task<IActionResult> Delete(long id)
        {
            var q = await _db.Quyens.FindAsync(id);
            if (q == null) return NotFound();
            _db.Quyens.Remove(q);
            await _db.SaveChangesAsync();
            return Ok(new { message = "Xóa quyền thành công." });
        }
    }

    // ============================================================
    // 4️⃣ VaiTrò - Quyền Controller
    // ============================================================
    [ApiController]
    [Route("api/vaitroquyen")]
    public class VaiTroQuyenController : ControllerBase
    {
        private readonly DACNDbContext _db;
        public VaiTroQuyenController(DACNDbContext db) => _db = db;

        [HttpGet]
        public async Task<IActionResult> GetByRole([FromQuery] int roleId)
        {
            var data = await _db.VaiTroQuyens
                .Include(v => v.IdQuyenNavigation).ThenInclude(q => q.IdChucNangNavigation)
                .Where(v => v.IdVaiTro == roleId)
                .Select(v => new VaiTroQuyenDto
                {
                    Id = v.Id,
                    IdVaiTro = v.IdVaiTro,
                    IdQuyen = v.IdQuyen,
                    ChucNang = v.IdQuyenNavigation.IdChucNangNavigation.Ten,
                    MaQuyen = v.IdQuyenNavigation.MaQuyen
                })
                .ToListAsync();
            return Ok(data);
        }

        [HttpPatch("{roleId:int}")]
        public async Task<IActionResult> UpdateRolePermissions(int roleId, [FromBody] List<int> quyenIds)
        {
            var role = await _db.VaiTros.FindAsync(roleId);
            if (role == null) return NotFound(new { message = "Không tìm thấy vai trò." });

            var old = _db.VaiTroQuyens.Where(v => v.IdVaiTro == roleId);
            _db.VaiTroQuyens.RemoveRange(old);

            foreach (var id in quyenIds)
            {
                _db.VaiTroQuyens.Add(new VaiTroQuyen { IdVaiTro = roleId, IdQuyen = id });
            }

            await _db.SaveChangesAsync();
            return Ok(new { message = "Cập nhật quyền cho vai trò thành công." });
        }
    }

    // ============================================================
    // 5️⃣ Lịch sử đăng nhập Controller
    // ============================================================
    [ApiController]
    [Route("api/lichsu")]
    public class LichSuDangNhapController : ControllerBase
    {
        private readonly DACNDbContext _db;
        public LichSuDangNhapController(DACNDbContext db) => _db = db;

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var list = await _db.LichSuDangNhaps
                .Include(l => l.IdNguoiDungNavigation)
                .OrderByDescending(l => l.ThoiGian)
                .Select(l => new
                {
                    l.Id,
                    l.IdNguoiDung,
                    HoTen = l.IdNguoiDungNavigation.HoTen,
                    l.ThoiGian,
                    l.Ip,
                    l.ThietBi,
                    l.KetQua
                })
                .ToListAsync();
            return Ok(list);
        }
    }

    // ============================================================
    // 6️⃣ Người dùng Controller (CRUD + vô hiệu hóa / kích hoạt / reset)
    // ============================================================
    [ApiController]
    [Route("api/nguoidung")]
    public class NguoiDungController : ControllerBase
    {
        private readonly DACNDbContext _db;
        private readonly IPasswordHasher _passwordHasher;

        public NguoiDungController(DACNDbContext db, IPasswordHasher passwordHasher)
        {
            _db = db;
            _passwordHasher = passwordHasher;   // ✅ DI
        }

        // ✅ Lấy DS người dùng + filter cho FE (?keyword=&role=&active=)
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? keyword, [FromQuery] string? role, [FromQuery] string? active)
        {
            var query = _db.NguoiDungs
                .Include(u => u.NguoiDungVaiTros).ThenInclude(vt => vt.IdVaiTroNavigation)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(keyword))
            {
                var k = keyword.Trim().ToLower();
                query = query.Where(u =>
                    u.TenDangNhap.ToLower().Contains(k) ||
                    u.HoTen.ToLower().Contains(k) ||
                    (u.Email ?? "").ToLower().Contains(k));
            }

            if (!string.IsNullOrWhiteSpace(role))
            {
                var r = role.Trim().ToUpper();
                query = query.Where(u => u.NguoiDungVaiTros.Any(v => v.IdVaiTroNavigation.Ten.ToUpper() == r));
            }

            if (!string.IsNullOrWhiteSpace(active) && bool.TryParse(active, out var isActive))
            {
                query = query.Where(u => u.HoatDong == isActive);
            }

            var list = await query
                .OrderBy(u => u.Id)
                .Select(u => new
                {
                    u.Id,
                    u.HoTen,
                    u.TenDangNhap,
                    u.Email,
                    u.SoDienThoai,
                    VaiTro = u.NguoiDungVaiTros.Select(vt => vt.IdVaiTroNavigation.Ten).ToList(),
                    u.HoatDong
                })
                .ToListAsync();

            return Ok(list);
        }

        // ✅ Thêm người dùng mới
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] NguoiDungDto dto)
        {
            if (await _db.NguoiDungs.AnyAsync(x => x.TenDangNhap == dto.TenDangNhap))
                return Conflict(new { message = "Tên đăng nhập đã tồn tại." });

            // Hash mật khẩu
            var rawPassword = string.IsNullOrWhiteSpace(dto.MatKhau) ? "Abcd@1234" : dto.MatKhau!;
            var hs = _passwordHasher.Hash(rawPassword);

            var user = new NguoiDung
            {
                HoTen = dto.HoTen,
                TenDangNhap = dto.TenDangNhap,
                MatKhau = hs.hash,  // ✅ dùng đúng property hiện có
                Salt = hs.salt,
                Email = dto.Email,
                SoDienThoai = dto.SoDienThoai,
                MaNv = "NV" + DateTime.Now.Ticks,
                HoatDong = true
            };

            _db.NguoiDungs.Add(user);
            await _db.SaveChangesAsync();

            // Gán vai trò (nếu có)
            if (dto.VaiTroIds != null && dto.VaiTroIds.Any())
            {
                foreach (var roleId in dto.VaiTroIds)
                    _db.NguoiDungVaiTros.Add(new NguoiDungVaiTro { IdNguoiDung = user.Id, IdVaiTro = roleId });
                await _db.SaveChangesAsync();
            }

            return Ok(new { message = "Tạo người dùng thành công." });
        }

        // ✅ Cập nhật người dùng
        [HttpPut("{id:long}")]
        public async Task<IActionResult> Update(long id, [FromBody] NguoiDungDto dto)
        {
            var user = await _db.NguoiDungs
                .Include(u => u.NguoiDungVaiTros)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null) return NotFound(new { message = "Không tìm thấy người dùng." });

            user.HoTen = dto.HoTen;
            user.Email = dto.Email;
            user.SoDienThoai = dto.SoDienThoai;
            user.HoatDong = dto.HoatDong ?? user.HoatDong;

            if (dto.VaiTroIds != null)
            {
                _db.NguoiDungVaiTros.RemoveRange(user.NguoiDungVaiTros);
                foreach (var roleId in dto.VaiTroIds)
                    _db.NguoiDungVaiTros.Add(new NguoiDungVaiTro { IdNguoiDung = user.Id, IdVaiTro = roleId });
            }

            await _db.SaveChangesAsync();
            return Ok(new { message = "Cập nhật người dùng thành công." });
        }

        // ✅ Vô hiệu hóa tài khoản
        [HttpDelete("{id:long}")]
        public async Task<IActionResult> DisableAccount(long id)
        {
            var user = await _db.NguoiDungs.FindAsync(id);
            if (user == null) return NotFound(new { message = "Không tìm thấy người dùng." });

            user.HoatDong = false;
            await _db.SaveChangesAsync();
            return Ok(new { message = "Tài khoản đã được vô hiệu hóa." });
        }

        // ✅ Kích hoạt lại tài khoản
        [HttpPatch("{id:long}/kich-hoat")]
        public async Task<IActionResult> EnableAccount(long id)
        {
            var user = await _db.NguoiDungs.FindAsync(id);
            if (user == null) return NotFound(new { message = "Không tìm thấy người dùng." });

            user.HoatDong = true;
            await _db.SaveChangesAsync();
            return Ok(new { message = "Tài khoản đã được kích hoạt lại." });
        }

        // ✅ Đặt lại mật khẩu (reset)
        [HttpPatch("{id:long}/reset-password")]
        public async Task<IActionResult> ResetPassword(long id)
        {
            var user = await _db.NguoiDungs.FindAsync(id);
            if (user == null) return NotFound("Không tìm thấy người dùng");

            var newPassword = "Abcd@1234";
            var hs = _passwordHasher.Hash(newPassword);

            user.MatKhau = hs.hash;  // ✅ lưu lại vào MatKhau
            user.Salt = hs.salt;

            await _db.SaveChangesAsync();
            return Ok(new { message = "Đã đặt lại mật khẩu", mat_khau_mac_dinh = newPassword });
        }
    }
}

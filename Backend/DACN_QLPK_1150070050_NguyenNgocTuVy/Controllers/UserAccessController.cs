using DACN_QLPK_1150070050_NguyenNgocTuVy.Data;
using DACN_QLPK_1150070050_NguyenNgocTuVy.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DACN_QLPK_1150070050_NguyenNgocTuVy.Controllers
{
    // ============================================================
    // DTOs
    // ============================================================
    public class RoleSimpleDto
    {
        public int Id { get; set; }
        public string Ten { get; set; } = "";
    }

    public class PermissionDetailDto
    {
        public int IdQuyen { get; set; }
        public int IdChucNang { get; set; }
        public string MaChucNang { get; set; } = "";
        public string TenChucNang { get; set; } = "";
        public string MaQuyen { get; set; } = "";
        public bool Xem { get; set; }
        public bool Them { get; set; }
        public bool Sua { get; set; }
        public bool Xoa { get; set; }
        public bool Xuat { get; set; }
    }

    public class UserPermissionsResponse
    {
        public long Id { get; set; }
        public string TenDangNhap { get; set; } = "";
        public string? HoTen { get; set; }
        public List<RoleSimpleDto> Roles { get; set; } = new();
        public List<PermissionDetailDto> Permissions { get; set; } = new();
    }

    // ============================================================
    // Controller: UserAccess
    // ============================================================
    [ApiController]
    [Route("api/users")]
    public class UserAccessController : ControllerBase
    {
        private readonly DACNDbContext _db;
        public UserAccessController(DACNDbContext db) => _db = db;


        [HttpGet("vaitro")]
        public async Task<IActionResult> GetRoles()
        {
            var roles = await _db.VaiTros
                .Select(v => new { v.Id, v.Ten, v.MoTa })
                .ToListAsync();
            return Ok(roles);
        }

        // 2️⃣ Lấy danh sách quyền
        [HttpGet("quyen")]
        public async Task<IActionResult> GetPermissions()
        {
            var perms = await _db.Quyens
                .Include(q => q.IdChucNangNavigation)
                .Select(q => new
                {
                    q.Id,
                    q.MaQuyen,
                    q.IdChucNang,
                    TenChucNang = q.IdChucNangNavigation.Ten,
                    q.Xem,
                    q.Them,
                    q.Sua,
                    q.Xoa,
                    q.Xuat
                })
                .ToListAsync();
            return Ok(perms);
        }

        [HttpGet("vaitroquyen")]
        public async Task<IActionResult> GetRolePermissions([FromQuery] int roleId)
        {
            var rolePerms = await (
                from vtq in _db.VaiTroQuyens
                join q in _db.Quyens on vtq.IdQuyen equals q.Id
                join cn in _db.ChucNangs on q.IdChucNang equals cn.Id
                where vtq.IdVaiTro == roleId
                select new
                {
                    vtq.Id,
                    vtq.IdVaiTro,
                    IdQuyen = q.Id,
                    q.MaQuyen,
                    TenChucNang = cn.Ten,

                    // ✅ Dữ liệu quyền lấy từ bảng VaiTroQuyen
                    Xem = vtq.Xem,
                    Them = vtq.Them,
                    Sua = vtq.Sua,
                    Xoa = vtq.Xoa,
                    Xuat = vtq.Xuat
                }).ToListAsync();

            return Ok(rolePerms);
        }

        public class RolePermissionUpdateDto
        {
            public int IdQuyen { get; set; }
            public bool Xem { get; set; }
            public bool Them { get; set; }
            public bool Sua { get; set; }
            public bool Xoa { get; set; }
            public bool Xuat { get; set; }
        }

        [HttpPatch("vaitroquyen/{roleId}")]
        public async Task<IActionResult> UpdateRolePermissions(int roleId, [FromBody] List<RolePermissionUpdateDto> updates)
        {
            // Xoá quyền cũ
            var existing = _db.VaiTroQuyens.Where(x => x.IdVaiTro == roleId);
            _db.VaiTroQuyens.RemoveRange(existing);

            // Thêm mới
            foreach (var item in updates)
            {
                _db.VaiTroQuyens.Add(new VaiTroQuyen
                {
                    IdVaiTro = roleId,
                    IdQuyen = item.IdQuyen,
                    Xem = item.Xem,
                    Them = item.Them,
                    Sua = item.Sua,
                    Xoa = item.Xoa,
                    Xuat = item.Xuat
                });
            }

            await _db.SaveChangesAsync();
            return Ok(new { message = "Cập nhật quyền chi tiết cho vai trò thành công!" });
        }


        // --------------------------------------------------------
        // 1) GET /api/users/{id}/permissions
        //    -> trả về vai trò và danh sách quyền chi tiết của user
        // --------------------------------------------------------
        [HttpGet("{id:long}/permissions")]
        public async Task<IActionResult> GetUserPermissions(long id)
        {
            // Lấy user + danh sách role
            var user = await _db.NguoiDungs
                .Where(u => u.Id == id)
                .Select(u => new
                {
                    u.Id,
                    u.TenDangNhap,
                    u.HoTen,
                    Roles = u.NguoiDungVaiTros
                        .Select(r => new RoleSimpleDto
                        {
                            Id = r.IdVaiTro.GetValueOrDefault(),
                            Ten = r.IdVaiTroNavigation.Ten
                        })
                        .ToList()
                })
                .FirstOrDefaultAsync();

            if (user == null)
                return NotFound(new { message = "Không tìm thấy người dùng." });

            var roleIds = user.Roles.Select(r => r.Id).Distinct().ToList();
            if (roleIds.Count == 0)
            {
                return Ok(new UserPermissionsResponse
                {
                    Id = user.Id,
                    TenDangNhap = user.TenDangNhap,
                    HoTen = user.HoTen,
                    Roles = new List<RoleSimpleDto>(),
                    Permissions = new List<PermissionDetailDto>()
                });
            }

            // Lấy toàn bộ quyền của các vai trò đó (distinct theo IdQuyen)
            var perms = await (
                from vtq in _db.VaiTroQuyens
                join q in _db.Quyens on vtq.IdQuyen equals q.Id
                join cn in _db.ChucNangs on q.IdChucNang equals cn.Id
                where roleIds.Contains(vtq.IdVaiTro.GetValueOrDefault())
                select new PermissionDetailDto
                {
                    IdQuyen = q.Id,
                    IdChucNang = cn.Id,
                    MaChucNang = cn.MaChucNang,
                    TenChucNang = cn.Ten,
                    MaQuyen = q.MaQuyen ?? "",
                    Xem = q.Xem ?? false,
                    Them = q.Them ?? false,
                    Sua = q.Sua ?? false,
                    Xoa = q.Xoa ?? false,
                    Xuat = q.Xuat ?? false
                })
                .ToListAsync();

            // distinct theo IdQuyen (tránh trùng khi user có nhiều vai trò cùng chứa 1 quyền)
            var distinctPerms = perms
                .GroupBy(p => p.IdQuyen)
                .Select(g => g.First())
                .OrderBy(p => p.IdChucNang)
                .ThenBy(p => p.MaQuyen)
                .ToList();

            var payload = new UserPermissionsResponse
            {
                Id = user.Id,
                TenDangNhap = user.TenDangNhap,
                HoTen = user.HoTen,
                Roles = user.Roles
                    .GroupBy(r => r.Id)
                    .Select(g => g.First())
                    .OrderBy(r => r.Id)
                    .ToList(),
                Permissions = distinctPerms
            };

            return Ok(payload);
        }
        
        [HttpGet("{id:long}/can")]
        public async Task<IActionResult> Can(long id, [FromQuery] string feature, [FromQuery] string action)
        {
            if (string.IsNullOrWhiteSpace(feature) || string.IsNullOrWhiteSpace(action))
                return BadRequest(new { message = "Thiếu feature hoặc action." });

            feature = feature.Trim().ToUpper();      // ví dụ: KHAM_BENH
            var act = action.Trim().ToLower();       // ví dụ: xoa

            // Lấy role của user
            var roleIds = await _db.NguoiDungVaiTros
                .Where(x => x.IdNguoiDung == id)
                .Select(x => x.IdVaiTro.GetValueOrDefault())
                .Distinct()
                .ToListAsync();

            if (roleIds.Count == 0)
                return Ok(new { allowed = false });

            // Lấy quyền theo chức năng (feature)
            var query = from vtq in _db.VaiTroQuyens
                        join q in _db.Quyens on vtq.IdQuyen equals q.Id
                        join cn in _db.ChucNangs on q.IdChucNang equals cn.Id
                        where roleIds.Contains(vtq.IdVaiTro.GetValueOrDefault())
                              && cn.MaChucNang.ToUpper() == feature
                        select q;

            bool allowed = false;

            switch (act)
            {
                case "xem":
                    allowed = await query.AnyAsync(q => q.Xem == true);
                    break;
                case "them":
                    allowed = await query.AnyAsync(q => q.Them == true);
                    break;
                case "sua":
                    allowed = await query.AnyAsync(q => q.Sua == true);
                    break;
                case "xoa":
                    allowed = await query.AnyAsync(q => q.Xoa == true);
                    break;
                case "xuat":
                    allowed = await query.AnyAsync(q => q.Xuat == true);
                    break;
                default:
                    return BadRequest(new { message = "Action không hợp lệ. Hợp lệ: xem, them, sua, xoa, xuat." });
            }

            return Ok(new { allowed });
        }
    }
}

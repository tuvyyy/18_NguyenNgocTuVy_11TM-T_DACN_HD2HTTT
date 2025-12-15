using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DACN_QLPK_1150070050_NguyenNgocTuVy.Data;
using DACN_QLPK_1150070050_NguyenNgocTuVy.Models;
using DACN_QLPK_1150070050_NguyenNgocTuVy.Dtos;

namespace DACN_QLPK_1150070050_NguyenNgocTuVy.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DanhMucThuocController : ControllerBase
    {
        private readonly DACNDbContext _db;
        public DanhMucThuocController(DACNDbContext db) => _db = db;

        // =====================================================
        // =============== NHÓM THUỐC ==========================
        // =====================================================
        [HttpGet("nhom-thuoc")]
        public async Task<IActionResult> GetAllNhomThuoc([FromQuery] string? keyword)
        {
            var q = _db.NhomThuocs.AsNoTracking();

            if (!string.IsNullOrWhiteSpace(keyword))
            {
                var kw = keyword.Trim().ToLower();
                q = q.Where(x => x.Ten.ToLower().Contains(kw) || (x.MoTa ?? "").ToLower().Contains(kw));
            }

            var data = await q
                .OrderBy(x => x.Ten)
                .Select(x => new NhomThuocDto
                {
                    Id = x.Id,
                    Ten = x.Ten,
                    MoTa = x.MoTa
                })
                .ToListAsync();

            return Ok(data);
        }

        // =====================================================
        // =============== THUỐC ===============================
        // =====================================================
        [HttpGet("thuoc")]
        public async Task<IActionResult> GetThuocList(
            [FromQuery] int? idNhom,
            [FromQuery] string? keyword,
            [FromQuery] bool? hoatDong,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            var q = _db.Thuocs
                .Include(t => t.IdNhomNavigation)
                .AsNoTracking()
                .AsQueryable();

            if (idNhom.HasValue)
                q = q.Where(x => x.IdNhom == idNhom.Value);
            if (hoatDong.HasValue)
                q = q.Where(x => x.HoatDong == hoatDong.Value);

            if (!string.IsNullOrWhiteSpace(keyword))
            {
                var kw = keyword.Trim().ToLower();
                q = q.Where(x => x.Ma.ToLower().Contains(kw) || x.Ten.ToLower().Contains(kw));
            }

            var total = await q.CountAsync();
            var items = await q
                .OrderBy(x => x.Ten)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(x => new ThuocDto
                {
                    Id = x.Id,
                    IdNhom = x.IdNhom,
                    Ma = x.Ma,
                    Ten = x.Ten,
                    DonViTinh = x.DonVi,
                    MoTa = x.MoTa,
                    HoatDong = x.HoatDong,
                    TenNhom = x.IdNhomNavigation != null ? x.IdNhomNavigation.Ten : null
                })
                .ToListAsync();

            return Ok(new PagedResult<ThuocDto>
            {
                TotalItems = total,
                Page = page,
                PageSize = pageSize,
                Items = items
            });
        }

        [HttpGet("thuoc/dropdown")]
        public async Task<IActionResult> GetThuocDropdown([FromQuery] bool includeInactive = false)
        {
            var query = _db.Thuocs.AsNoTracking();
            if (!includeInactive) query = query.Where(x => x.HoatDong == true);

            var list = await query
                .OrderBy(x => x.Ten)
                .Select(x => new { x.Id, x.Ma, x.Ten })
                .ToListAsync();

            return Ok(list);
        }


        [HttpGet("thuoc/{id}")]
        public async Task<IActionResult> GetThuocById(long id)
        {
            var t = await _db.Thuocs
                .Include(x => x.IdNhomNavigation)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (t == null) return NotFound(new { message = "Không tìm thấy thuốc." });

            return Ok(new ThuocDto
            {
                Id = t.Id,
                IdNhom = t.IdNhom,
                Ma = t.Ma,
                Ten = t.Ten,
                DonViTinh = t.DonVi,
                MoTa = t.MoTa,
                HoatDong = t.HoatDong,
                TenNhom = t.IdNhomNavigation?.Ten
            });
        }


        // ✅ POST: Tạo thuốc mới
        [HttpPost("thuoc")]
        public async Task<IActionResult> CreateThuoc([FromBody] ThuocDto dto)
        {
            var entity = new Thuoc
            {
                IdNhom = dto.IdNhom,
                Ma = dto.Ma,
                Ten = dto.Ten,
                DonVi = dto.DonViTinh,
                MoTa = dto.MoTa,
                HoatDong = dto.HoatDong
            };

            _db.Thuocs.Add(entity);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Thêm thuốc thành công!", id = entity.Id });
        }

        // ✅ PUT: Cập nhật thuốc
        [HttpPut("thuoc/{id}")]
        public async Task<IActionResult> UpdateThuoc(long id, [FromBody] ThuocDto dto)
        {
            if (await _db.Thuocs.AnyAsync(x => x.Ma == dto.Ma && x.Id != id))
                return BadRequest(new { message = $"Mã thuốc '{dto.Ma}' đã được sử dụng cho thuốc khác." });

            var entity = await _db.Thuocs.FindAsync(id);
            if (entity == null) return NotFound("Không tìm thấy thuốc.");

            entity.IdNhom = dto.IdNhom;
            entity.Ma = dto.Ma;
            entity.Ten = dto.Ten;
            entity.DonVi = dto.DonViTinh;
            entity.MoTa = dto.MoTa;
            entity.HoatDong = dto.HoatDong;

            await _db.SaveChangesAsync();
            return Ok(new { message = "Cập nhật thuốc thành công!" });
        }

        // ✅ DELETE: Chỉ vô hiệu hóa thuốc (soft delete)
        [HttpDelete("thuoc/{id}")]
        public async Task<IActionResult> SoftDeleteThuoc(long id)
        {
            var entity = await _db.Thuocs.FindAsync(id);
            if (entity == null) return NotFound("Không tìm thấy thuốc.");

            entity.HoatDong = false;
            await _db.SaveChangesAsync();

            return Ok(new { message = "Đã vô hiệu hóa thuốc thành công." });
        }

        // 🔄 MỞ LẠI THUỐC (PHỤC HỒI SAU KHI VÔ HIỆU)
        [HttpPut("thuoc/kich-hoat/{id}")]
        public async Task<IActionResult> RestoreThuoc(long id)
        {
            var entity = await _db.Thuocs.FindAsync(id);
            if (entity == null)
                return NotFound("Không tìm thấy thuốc cần kích hoạt.");

            entity.HoatDong = true;
            await _db.SaveChangesAsync();

            return Ok(new { message = "Đã kích hoạt lại thuốc thành công!" });
        }


        // =====================================================
        // =============== THUỐC GIÁ ===========================
        // =====================================================
        [HttpGet("thuoc-gia")]
        public async Task<IActionResult> GetThuocGiaList(
            [FromQuery] long? idThuoc,
            [FromQuery] DateTime? atDate,
            [FromQuery] bool activeOnly = false)
        {
            var q = _db.ThuocGia
                .Include(g => g.IdThuocNavigation)
                .AsNoTracking()
                .AsQueryable();

            if (idThuoc.HasValue)
                q = q.Where(x => x.IdThuoc == idThuoc.Value);

            if (activeOnly)
            {
                var d = DateOnly.FromDateTime(atDate?.Date ?? DateTime.Today);
                q = q.Where(x =>
                    x.HoatDong == true &&
                    x.NgayApDung <= d &&
                    (x.NgayHetHan == null || x.NgayHetHan >= d));
            }

            var list = await q
                .OrderByDescending(x => x.NgayApDung)
                .Select(x => new ThuocGiaDto
                {
                    Id = x.Id,
                    DonGia = x.DonGia,
                    NgayApDung = new DateTime(x.NgayApDung.Year, x.NgayApDung.Month, x.NgayApDung.Day),
                    NgayHetHan = x.NgayHetHan != null
                        ? new DateTime(x.NgayHetHan.Value.Year, x.NgayHetHan.Value.Month, x.NgayHetHan.Value.Day)
                        : (DateTime?)null,
                    DoiTuongApDung = x.DoiTuongApDung,
                    GhiChu = x.GhiChu,
                    HoatDong = x.HoatDong,
                    TenThuoc = x.IdThuocNavigation != null ? x.IdThuocNavigation.Ten : null,
                    MaThuoc = x.IdThuocNavigation != null ? x.IdThuocNavigation.Ma : null
                })
                .ToListAsync();

            return Ok(list);
        }

        [HttpPost("thuoc-gia")]
        public async Task<IActionResult> CreateThuocGia([FromBody] ThuocGiaCreateUpdateDto dto)
        {
            var entity = new ThuocGium
            {
                IdThuoc = dto.IdThuoc,
                DonGia = dto.DonGia,
                NgayApDung = DateOnly.FromDateTime(dto.NgayApDung),
                NgayHetHan = dto.NgayHetHan.HasValue ? DateOnly.FromDateTime(dto.NgayHetHan.Value) : null,
                DoiTuongApDung = dto.DoiTuongApDung,
                GhiChu = dto.GhiChu,
                HoatDong = dto.HoatDong ?? true
            };

            _db.ThuocGia.Add(entity);
            await _db.SaveChangesAsync();
            return Ok(new { message = "Thêm giá thuốc thành công!", id = entity.Id });
        }

        [HttpPut("thuoc-gia/{id}")]
        public async Task<IActionResult> UpdateThuocGia(long id, [FromBody] ThuocGiaCreateUpdateDto dto)
        {
            var entity = await _db.ThuocGia.FindAsync(id);
            if (entity == null)
                return NotFound("Không tìm thấy giá thuốc.");

            entity.IdThuoc = dto.IdThuoc;
            entity.DonGia = dto.DonGia;
            entity.NgayApDung = DateOnly.FromDateTime(dto.NgayApDung);
            entity.NgayHetHan = dto.NgayHetHan.HasValue
                ? DateOnly.FromDateTime(dto.NgayHetHan.Value)
                : entity.NgayHetHan;
            entity.DoiTuongApDung = dto.DoiTuongApDung;
            entity.GhiChu = dto.GhiChu;
            entity.HoatDong = dto.HoatDong ?? entity.HoatDong;

            await _db.SaveChangesAsync();
            return Ok(new { message = "Cập nhật giá thuốc thành công!" });
        }

        [HttpDelete("thuoc-gia/{id}")]
        public async Task<IActionResult> SoftDeleteThuocGia(long id)
        {
            var entity = await _db.ThuocGia.FindAsync(id);
            if (entity == null)
                return NotFound("Không tìm thấy giá thuốc.");

            entity.HoatDong = false;
            await _db.SaveChangesAsync();

            return Ok(new { message = "Đã vô hiệu hóa giá thuốc (soft delete)." });
        }

        // 🔄 MỞ LẠI GIÁ THUỐC
        [HttpPut("thuoc-gia/kich-hoat/{id}")]
        public async Task<IActionResult> RestoreThuocGia(long id)
        {
            var entity = await _db.ThuocGia.FindAsync(id);
            if (entity == null)
                return NotFound("Không tìm thấy giá thuốc cần kích hoạt.");

            entity.HoatDong = true;
            await _db.SaveChangesAsync();

            return Ok(new { message = "Đã kích hoạt lại giá thuốc thành công!" });
        }

    }
}

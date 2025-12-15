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
    public class DanhMucDichVuController : ControllerBase
    {
        private readonly DACNDbContext _db;
        public DanhMucDichVuController(DACNDbContext db) => _db = db;

        // =====================================================
        // =============== NHÓM DỊCH VỤ ========================
        // =====================================================
        [HttpGet("nhom-dich-vu")]
        public async Task<IActionResult> GetAllNhomDichVu([FromQuery] string? keyword)
        {
            var query = _db.NhomDichVus.AsNoTracking();

            if (!string.IsNullOrWhiteSpace(keyword))
            {
                var kw = keyword.Trim().ToLower();
                query = query.Where(x =>
                    x.Ten.ToLower().Contains(kw) ||
                    (x.MoTa ?? "").ToLower().Contains(kw));
            }

            var result = await query
                .OrderBy(x => x.Ten)
                .Select(x => new NhomDichVuDto
                {
                    Id = x.Id,
                    Ten = x.Ten,
                    MoTa = x.MoTa
                })
                .ToListAsync();

            return Ok(result);
        }

        // =====================================================
        // =============== DỊCH VỤ =============================
        // =====================================================
        [HttpGet("dich-vu")]
        public async Task<IActionResult> GetDichVuList(
            [FromQuery] int? idNhom,
            [FromQuery] int? idPhong,
            [FromQuery] string? keyword,
            [FromQuery] bool? hoatDong,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            var q = _db.DichVus
                .Include(d => d.IdNhomNavigation)
                .Include(d => d.IdPhongNavigation)
                .AsNoTracking()
                .AsQueryable();

            if (idNhom.HasValue) q = q.Where(x => x.IdNhom == idNhom.Value);
            if (idPhong.HasValue) q = q.Where(x => x.IdPhong == idPhong.Value);
            if (hoatDong.HasValue) q = q.Where(x => x.HoatDong == hoatDong.Value);

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
                .Select(x => new DichVuDto
                {
                    Id = x.Id,
                    //IdNhom = x.IdNhom,
                    IdPhong = x.IdPhong,
                    Ma = x.Ma,
                    Ten = x.Ten,
                    DonViTinh = x.DonViTinh,
                    MoTa = x.MoTa,
                    HoatDong = x.HoatDong,
                    TenNhom = x.IdNhomNavigation.Ten,
                    TenPhong = x.IdPhongNavigation != null ? x.IdPhongNavigation.TenPhong : null
                })
                .ToListAsync();

            return Ok(new PagedResult<DichVuDto>
            {
                TotalItems = total,
                Page = page,
                PageSize = pageSize,
                Items = items
            });
        }

        [HttpGet("dich-vu/dropdown")]
        public async Task<IActionResult> GetDichVuDropdown()
        {
            var list = await _db.DichVus
                .Where(x => x.HoatDong == true)
                .OrderBy(x => x.Ten)
                .Select(x => new { x.Id, x.Ma, x.Ten })
                .ToListAsync();

            return Ok(list);
        }


        // =============== DỊCH VỤ GIÁ =========================
        [HttpGet("dich-vu-gia")]
        public async Task<IActionResult> GetDichVuGiaList(
            [FromQuery] long? idDichVu,
            [FromQuery] int? idPhong,
            [FromQuery] DateTime? atDate,
            [FromQuery] bool activeOnly = false)
        {
            var q = _db.DichVuGia
                .Include(g => g.IdDichVuNavigation)
                .Include(g => g.IdPhongNavigation)
                .AsNoTracking()
                .AsQueryable();

            if (idDichVu.HasValue)
                q = q.Where(x => x.IdDichVu == idDichVu.Value);
            if (idPhong.HasValue)
                q = q.Where(x => x.IdPhong == idPhong.Value);

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
                .Select(x => new DichVuGiaDto
                {
                    Id = x.Id,
                    IdDichVu = x.IdDichVu ?? 0,
                    IdPhong = x.IdPhong ?? 0,
                    DonGia = x.DonGia,
                    // ✅ DateOnly => DateTime
                    NgayApDung = new DateTime(x.NgayApDung.Year, x.NgayApDung.Month, x.NgayApDung.Day),
                    NgayHetHan = x.NgayHetHan != null
                        ? new DateTime(x.NgayHetHan.Value.Year, x.NgayHetHan.Value.Month, x.NgayHetHan.Value.Day)
                        : (DateTime?)null,
                    DoiTuongApDung = x.DoiTuongApDung,
                    GhiChu = x.GhiChu,
                    HoatDong = x.HoatDong,
                    TenDichVu = x.IdDichVuNavigation != null ? x.IdDichVuNavigation.Ten : null,
                    MaDichVu = x.IdDichVuNavigation != null ? x.IdDichVuNavigation.Ma : null,
                    TenPhong = x.IdPhongNavigation != null ? x.IdPhongNavigation.TenPhong : null
                })
                .ToListAsync();

            return Ok(list);
        }
        [HttpGet("dich-vu-gia/{id}")]
        public async Task<IActionResult> GetDichVuGiaById(long id)
        {
            var x = await _db.DichVuGia
                .Include(d => d.IdDichVuNavigation)
                .Include(d => d.IdPhongNavigation)
                .FirstOrDefaultAsync(d => d.Id == id);
            if (x == null) return NotFound();
            return Ok(new DichVuGiaDto
            {
                Id = x.Id,
                IdDichVu = x.IdDichVu ?? 0,
                IdPhong = x.IdPhong ?? 0,
                DonGia = x.DonGia,
                NgayApDung = new DateTime(x.NgayApDung.Year, x.NgayApDung.Month, x.NgayApDung.Day),
                NgayHetHan = x.NgayHetHan.HasValue
                    ? new DateTime(x.NgayHetHan.Value.Year, x.NgayHetHan.Value.Month, x.NgayHetHan.Value.Day)
                    : null,
                DoiTuongApDung = x.DoiTuongApDung,
                GhiChu = x.GhiChu,
                HoatDong = x.HoatDong,
                TenDichVu = x.IdDichVuNavigation?.Ten,
                MaDichVu = x.IdDichVuNavigation?.Ma,
                TenPhong = x.IdPhongNavigation?.TenPhong
            });
        }

        [HttpPost("dich-vu-gia")]
        public async Task<IActionResult> CreateDichVuGia([FromBody] DichVuGiaCreateUpdateDto dto)
        {
            var entity = new DichVuGium
            {
                IdDichVu = dto.IdDichVu,
                IdPhong = dto.IdPhong,
                DonGia = dto.DonGia,
                NgayApDung = DateOnly.FromDateTime(dto.NgayApDung),
                NgayHetHan = dto.NgayHetHan.HasValue ? DateOnly.FromDateTime(dto.NgayHetHan.Value) : null,
                DoiTuongApDung = dto.DoiTuongApDung,
                GhiChu = dto.GhiChu,
                HoatDong = dto.HoatDong ?? true
            };

            _db.DichVuGia.Add(entity);
            await _db.SaveChangesAsync();
            return Ok(new { message = "Thêm giá dịch vụ thành công!", id = entity.Id });
        }

        [HttpPut("dich-vu-gia/{id}")]
        public async Task<IActionResult> UpdateDichVuGia(long id, [FromBody] DichVuGiaCreateUpdateDto dto)
        {
            var entity = await _db.DichVuGia.FindAsync(id);
            if (entity == null)
                return NotFound("Không tìm thấy giá dịch vụ.");

            entity.IdDichVu = dto.IdDichVu;
            entity.IdPhong = dto.IdPhong;
            entity.DonGia = dto.DonGia;
            entity.NgayApDung = DateOnly.FromDateTime(dto.NgayApDung);
            entity.NgayHetHan = dto.NgayHetHan.HasValue
                ? DateOnly.FromDateTime(dto.NgayHetHan.Value)
                : entity.NgayHetHan;
            entity.DoiTuongApDung = dto.DoiTuongApDung;
            entity.GhiChu = dto.GhiChu;
            entity.HoatDong = dto.HoatDong ?? entity.HoatDong;

            await _db.SaveChangesAsync();
            return Ok(new { message = "Cập nhật giá dịch vụ thành công!" });
        }

        [HttpDelete("dich-vu-gia/{id}")]
        public async Task<IActionResult> SoftDeleteDichVuGia(long id)
        {
            var entity = await _db.DichVuGia.FindAsync(id);
            if (entity == null)
                return NotFound("Không tìm thấy giá dịch vụ.");

            entity.HoatDong = false;
            await _db.SaveChangesAsync();

            return Ok(new { message = "Đã vô hiệu hóa giá dịch vụ (soft delete)." });
        }

        [HttpGet("dich-vu-gia/hien-hanh")]
        public async Task<IActionResult> GetGiaHienHanh()
        {
            var today = DateOnly.FromDateTime(DateTime.Today);

            var result = await _db.DichVuGia
                .Include(x => x.IdDichVuNavigation)
                .Where(x => x.HoatDong == true &&
                            x.NgayApDung <= today &&
                            (x.NgayHetHan == null || x.NgayHetHan >= today))
                .GroupBy(x => x.IdDichVu)
                .Select(g => g.OrderByDescending(x => x.NgayApDung).FirstOrDefault())
                .Select(x => new
                {
                    IdDichVu = x.IdDichVu,
                    TenDichVu = x.IdDichVuNavigation.Ten,
                    DonGia = x.DonGia,
                    NgayApDung = x.NgayApDung
                })
                .ToListAsync();

            return Ok(result);
        }


        [HttpGet("phong-kham/dropdown")]
        public async Task<IActionResult> GetPhongKhamDropdown()
        {
            var data = await _db.PhongKhams
                .Where(x => x.HoatDong == true)
                .OrderBy(x => x.TenPhong)
                .Select(x => new { x.Id, x.MaPhong, x.TenPhong })
                .ToListAsync();

            return Ok(data);
        }

    }
}

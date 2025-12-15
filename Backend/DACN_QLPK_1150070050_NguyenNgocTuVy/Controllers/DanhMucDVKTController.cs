using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DACN_QLPK_1150070050_NguyenNgocTuVy.Data;
using DACN_QLPK_1150070050_NguyenNgocTuVy.Models;
using DACN_QLPK_1150070050_NguyenNgocTuVy.Dtos;

namespace DACN.Controllers
{
    [ApiController]
    [Route("api/admin/dvkt")]
    public class DanhMucDVKTController : ControllerBase
    {
        private readonly DACNDbContext _db;

        public DanhMucDVKTController(DACNDbContext db)
        {
            _db = db;
        }

        // ==================== NHÓM DVKT ====================

        [HttpGet("nhom")]
        public async Task<IActionResult> GetNhom()
        {
            var data = await _db.NhomDvkts.ToListAsync();
            return Ok(data);
        }

        [HttpPost("nhom")]
        public async Task<IActionResult> CreateNhom(CreateNhomDVKTDto dto)
        {
            var n = new NhomDvkt
            {
                TenNhom = dto.TenNhom,
                MoTa = dto.MoTa,
                HoatDong = true
            };

            _db.NhomDvkts.Add(n);
            await _db.SaveChangesAsync();
            return Ok(n);
        }

        [HttpPut("nhom/{id}")]
        public async Task<IActionResult> UpdateNhom(int id, UpdateNhomDVKTDto dto)
        {
            var n = await _db.NhomDvkts.FindAsync(id);
            if (n == null) return NotFound();

            n.TenNhom = dto.TenNhom;
            n.MoTa = dto.MoTa;
            n.HoatDong = dto.HoatDong;

            await _db.SaveChangesAsync();
            return Ok(n);
        }

        // ==================== DANH MỤC DVKT ====================

        [HttpGet]
        public IActionResult GetDVKT()
        {
            var data = (from d in _db.Dvkts
                        join n in _db.NhomDvkts on d.IdNhom equals n.Id
                        select new
                        {
                            d.Id,
                            d.MaDvkt,
                            d.TenDvkt,
                            d.DonVi,
                            d.ThoiGianDuKien,
                            d.HoatDong,
                            d.IdNhom,
                            d.MoTa,
                            Nhom = n.TenNhom
                        }).ToList();

            return Ok(data);
        }

        [HttpPost]
        public async Task<IActionResult> CreateDVKT([FromBody] CreateDVKTDto dto)
        {
            var dv = new Dvkt
            {
                MaDvkt = dto.MaDVKT,
                TenDvkt = dto.TenDVKT,
                DonVi = dto.DonVi,
                IdNhom = dto.IdNhom,
                ThoiGianDuKien = dto.ThoiGianDuKien,
                MoTa = dto.MoTa,
                HoatDong = true
            };

            _db.Dvkts.Add(dv);
            await _db.SaveChangesAsync();

            return Ok(dv);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDVKT(int id, [FromBody] UpdateDVKTDto dto)
        {
            var dv = await _db.Dvkts.FindAsync(id);
            if (dv == null) return NotFound();

            dv.TenDvkt = dto.TenDVKT;
            dv.DonVi = dto.DonVi;
            dv.IdNhom = dto.IdNhom;
            dv.ThoiGianDuKien = dto.ThoiGianDuKien;
            dv.MoTa = dto.MoTa;
            dv.HoatDong = dto.HoatDong;

            await _db.SaveChangesAsync();
            return Ok(dv);
        }

        // ================================
        // 2.b TOGGLE DVKT (Khóa / Mở lại)
        // ================================
        [HttpPatch("{id}/toggle")]
        public IActionResult ToggleDVKT(int id)
        {
            var dv = _db.Dvkts.Find(id);
            if (dv == null) return NotFound();

            dv.HoatDong = !dv.HoatDong;
            _db.SaveChanges();

            return Ok(new
            {
                dv.Id,
                dv.HoatDong,
                Message = dv.HoatDong ? "Đã mở khóa DVKT" : "Đã khóa DVKT"
            });
        }

        // ================================
        // 1.b TOGGLE NHÓM DVKT (tuỳ Dâu dùng hay không)
        // ================================
        [HttpPatch("nhom/{id}/toggle")]
        public IActionResult ToggleNhomDVKT(int id)
        {
            var n = _db.NhomDvkts.Find(id);
            if (n == null) return NotFound();

            n.HoatDong = !n.HoatDong;
            _db.SaveChanges();

            return Ok(new
            {
                n.Id,
                n.HoatDong,
                Message = n.HoatDong ? "Đã mở khóa nhóm DVKT" : "Đã khóa nhóm DVKT"
            });
        }


        // ==================== GIÁ DVKT ====================

        [HttpGet("{id}/gia")]
        public async Task<IActionResult> GetGia(int id)
        {
            var data = await _db.DvktGia
                .Where(x => x.IdDvkt == id)
                .ToListAsync();

            return Ok(data);
        }

        [HttpPost("gia")]
        public async Task<IActionResult> CreateGia(CreateDVKTGiaDto dto)
        {
            var g = new DvktGium
            {
                IdDvkt = dto.IdDVKT,
                DonGia = dto.DonGia,
                TuNgay = DateOnly.FromDateTime(dto.TuNgay.Date),
                GhiChu = dto.GhiChu
            };

            _db.DvktGia.Add(g);
            await _db.SaveChangesAsync();

            return Ok(g);
        }

        [HttpPut("gia/{id}")]
        public async Task<IActionResult> UpdateGia(int id, UpdateDVKTGiaDto dto)
        {
            var g = await _db.DvktGia.FindAsync(id);
            if (g == null) return NotFound();

            g.DonGia = dto.DonGia;
            // ❗ FIX: convert DateTime? -> DateOnly?
            g.DenNgay = dto.DenNgay.HasValue
                ? DateOnly.FromDateTime(dto.DenNgay.Value.Date)
                : null;

            g.GhiChu = dto.GhiChu;

            await _db.SaveChangesAsync();
            return Ok(g);
        }
    }
}

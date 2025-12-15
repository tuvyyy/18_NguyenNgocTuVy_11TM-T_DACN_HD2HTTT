using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DACN_QLPK_1150070050_NguyenNgocTuVy.Data;
using DACN_QLPK_1150070050_NguyenNgocTuVy.Models;
using DACN_QLPK_1150070050_NguyenNgocTuVy.Dtos;

namespace DACN.Controllers
{
    [ApiController]
    [Route("api/sinhhieu")]
    public class SinhHieuController : ControllerBase
    {
        private readonly DACNDbContext _db;

        public SinhHieuController(DACNDbContext db)
        {
            _db = db;
        }

        // =========================================================
        // 1️⃣ LẤY SINH HIỆU MỚI NHẤT CHO 1 LẦN KHÁM
        // =========================================================
        [HttpGet("lankham/{idLanKham}")]
        public async Task<IActionResult> GetByLanKham(long idLanKham)
        {
            var latest = await _db.SinhHieus
                .Where(x => x.IdLanKham == idLanKham)
                .OrderByDescending(x => x.ThoiGianDo)
                .FirstOrDefaultAsync();

            return Ok(new { data = latest });
        }


        // =========================================================
        // 2️⃣ TẠO MỚI SINH HIỆU + GÁN VÀO LẦN KHÁM
        // =========================================================
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] SinhHieuDtos dto)
        {
            if (dto == null)
                return BadRequest(new { message = "Dữ liệu không hợp lệ" });

            var lanKham = await _db.LanKhams.FindAsync(dto.IdLanKham);
            if (lanKham == null)
                return NotFound(new { message = "Không tìm thấy lượt khám" });

            // Tạo bản ghi sinh hiệu
            var sh = new SinhHieu
            {
                IdLanKham = dto.IdLanKham,
                NhietDo = dto.NhietDo,
                HuyetApTamThu = dto.HuyetApTamThu,
                HuyetApTamTruong = dto.HuyetApTamTruong,
                NhipTim = dto.NhipTim,
                NhipTho = dto.NhipTho,
                SpO2 = dto.SpO2,
                CanNang = dto.CanNang,
                ChieuCao = dto.ChieuCao,
                ThoiGianDo = DateTime.Now
            };

            await _db.SinhHieus.AddAsync(sh);
            await _db.SaveChangesAsync();

            // Gán vào LanKham
            lanKham.IdSinhHieu = sh.Id;
            await _db.SaveChangesAsync();

            return Ok(new { message = "Đã lưu sinh hiệu", data = sh });
        }
    }
}

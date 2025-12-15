using DACN_QLPK_1150070050_NguyenNgocTuVy.Data;
using DACN_QLPK_1150070050_NguyenNgocTuVy.Dtos;
using DACN_QLPK_1150070050_NguyenNgocTuVy.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DACN_QLPK_1150070050_NguyenNgocTuVy.Controllers;

[ApiController]
[Route("api/chidinh")]
public class ChiDinhKhamController : ControllerBase
{
    private readonly DACNDbContext _db;
    private readonly PricingService _pricing;
    private readonly ICodeGenerator _code; 

    public ChiDinhKhamController(DACNDbContext db, PricingService pricing, ICodeGenerator code)
    {
        _db = db;
        _pricing = pricing;
        _code = code;
    }

    /// <summary>
    /// Lấy danh sách phòng khám đang hoạt động kèm dịch vụ & giá hiện hành (nếu có).
    /// </summary>
    [HttpGet("clinics/prices")]
    public async Task<IActionResult> GetClinicsWithCurrentPrice()
    {
        var query =
            from p in _db.PhongKhams
            where p.HoatDong == true
            join dv in _db.DichVus on p.Id equals dv.IdPhong
            where dv.HoatDong == true
            select new { p.Id, p.TenPhong, IdDichVu = dv.Id, dv.Ten };

        var baseList = await query.ToListAsync();
        var result = new List<ClinicWithPriceDto>();

        foreach (var item in baseList)
        {
            var price = await _pricing.GetCurrentPriceAsync(item.IdDichVu, item.Id);
            if (price.HasValue)
            {
                result.Add(new ClinicWithPriceDto
                {
                    IdPhong = item.Id,
                    TenPhong = item.TenPhong,
                    IdDichVu = item.IdDichVu,
                    TenDichVu = item.Ten,
                    DonGia = price.Value
                });
            }
        }
        return Ok(result);
    }

    /// <summary>
    /// Chỉ định khám: tạo các lần khám theo phòng đã chọn + tạo hóa đơn & chi tiết tiền khám.
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> CreateChiDinh([FromBody] ChiDinhKhamRequest req)
    {
        // ✅ Validate căn bản
        if (req.IdBenhNhan <= 0) return BadRequest("IdBenhNhan không hợp lệ.");
        if (req.IdHoSo <= 0) return BadRequest("IdHoSo không hợp lệ.");
        if (req.IdPhongChon == null || req.IdPhongChon.Count == 0)
            return BadRequest("Vui lòng chọn ít nhất một phòng.");

        // ✅ Đảm bảo hồ sơ tồn tại
        var hoSo = await _db.HoSoBenhAns.AsNoTracking().FirstOrDefaultAsync(h => h.Id == req.IdHoSo && h.IdBenhNhan == req.IdBenhNhan);
        if (hoSo == null) return NotFound("Không tìm thấy hồ sơ bệnh án phù hợp.");

        // ✅ Lấy DV thuộc các phòng đã chọn (đang hoạt động)
        var dichVus = await _db.DichVus
            .Where(d => d.HoatDong == true && d.IdPhong != null && req.IdPhongChon.Contains(d.IdPhong.Value))
            .ToListAsync();

        var now = DateTime.Now;
        var lanKhams = new List<Models.LanKham>();

        // ✅ Tạo lần khám theo từng phòng
        foreach (var idPhong in req.IdPhongChon.Distinct())
        {
            // Bỏ qua phòng không tồn tại / đã ngưng
            var phongExist = await _db.PhongKhams.AnyAsync(p => p.Id == idPhong && p.HoatDong == true);
            if (!phongExist) continue;

            // Tìm bác sĩ đang phụ trách phòng này trong bảng trung gian BAC_SI_PHONG
            long? idBacSiTrongPhong = await _db.BacSiPhongs
                .Where(x => x.IdPhong == idPhong)
                .Select(x => (long?)x.IdBacSi)
                .FirstOrDefaultAsync();

            // Nếu không tìm thấy mà request có IdBacSi thì xài tạm IdBacSi trong request
            if (!idBacSiTrongPhong.HasValue && req.IdBacSi > 0)
            {
                idBacSiTrongPhong = req.IdBacSi;
            }

            // Tạo lần khám
            var lk = new Models.LanKham
            {
                IdHoSo = req.IdHoSo,
                IdBenhNhan = req.IdBenhNhan,
                IdPhong = idPhong,
                IdBacSi = idBacSiTrongPhong,     // ⭐ GÁN TỰ ĐỘNG THEO PHÒNG
                TrangThai = "CHO_KHAM",
                CreatedAt = now,
                UpdatedAt = now,
                LyDo = string.IsNullOrWhiteSpace(req.GhiChu) ? "CHIDINH" : req.GhiChu
            };

            _db.LanKhams.Add(lk);
            lanKhams.Add(lk);
        }


        await _db.SaveChangesAsync(); // cần để có Id lan_kham

        // Nếu không tạo được lần khám nào
        if (lanKhams.Count == 0) return BadRequest("Không tạo được lần khám nào (kiểm tra phòng đang chọn).");

        // ✅ Tạo hóa đơn khung
        var hd = new Models.HoaDon
        {
            MaHd = _code.GenMa("HD"),
            IdBenhNhan = req.IdBenhNhan,
            LoaiHoaDon = "KHAM",
            HinhThucTt = "TIEN_MAT",
            TongTienTruoc = 0,
            GiamGia = 0,
            ThueVat = 0,
            TongTien = 0,
            TrangThai = "TAO",
            NgayTao = now,
            IdThuNgan = req.IdThuNgan,
            GhiChu = req.GhiChu
        };
        _db.HoaDons.Add(hd);
        await _db.SaveChangesAsync();

        // ✅ Tạo chi tiết hóa đơn theo từng lần khám/phòng
        decimal tong = 0m;
        var chiTiet = new List<ChiTietPhongKhamItem>();

        foreach (var lk in lanKhams)
        {
            var dv = dichVus.FirstOrDefault(d => d.IdPhong == lk.IdPhong);
            if (dv == null) continue;

            var donGia = await _pricing.GetCurrentPriceAsync(dv.Id, lk.IdPhong);
            if (!donGia.HasValue) continue;

            var ct = new Models.ChiTietHoaDon
            {
                IdHoaDon = hd.Id,
                LoaiThamChieu = "PHONG_KHAM",
                IdThamChieu = lk.Id, // tham chiếu lần khám
                MoTa = $"Khám tại phòng: {lk.IdPhong} - {dv.Ten}",
                SoLuong = 1,
                DonGia = donGia.Value,
                ThanhTien = donGia.Value,
                ThueVat = 0
            };
            _db.ChiTietHoaDons.Add(ct);
            tong += donGia.Value;

            var tenPhong = await _db.PhongKhams
                .Where(p => p.Id == lk.IdPhong)
                .Select(p => p.TenPhong)
                .FirstAsync();

            chiTiet.Add(new ChiTietPhongKhamItem
            {
                IdPhong = lk.IdPhong ?? 0,
                TenPhong = tenPhong,
                TenDichVu = dv.Ten,
                DonGia = donGia.Value,
                IdLanKham = lk.Id
            });
        }

        // ✅ Cập nhật tổng tiền
        hd.TongTienTruoc = tong;
        hd.TongTien = tong;
        await _db.SaveChangesAsync();

        return Ok(new
        {
            hd.Id,
            hd.MaHd,
            hd.TongTien,
            ChiTiet = chiTiet
        });
    }
}

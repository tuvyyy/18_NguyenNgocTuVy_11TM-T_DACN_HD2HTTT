using DACN_QLPK_1150070050_NguyenNgocTuVy.Data;
using DACN_QLPK_1150070050_NguyenNgocTuVy.Models;
using DACN_QLPK_1150070050_NguyenNgocTuVy.Dtos;
using DACN_QLPK_1150070050_NguyenNgocTuVy.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DACN_QLPK_1150070050_NguyenNgocTuVy.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HoaDonController : ControllerBase
    {
        private readonly DACNDbContext _db;
        private readonly ICodeGenerator _code;
        private readonly PricingService _pricing;

        public HoaDonController(DACNDbContext db, ICodeGenerator code, PricingService pricing)
        {
            _db = db;
            _code = code;
            _pricing = pricing;
        }

        // ===========================================================
        // ✅ LẤY HÓA ĐƠN THEO MÃ (Dành cho frontend Thu Ngân)
        // ===========================================================
        [HttpGet("ma/{maHoaDon}")]
        public async Task<IActionResult> GetByMaHoaDon(string maHoaDon)
        {
            if (string.IsNullOrWhiteSpace(maHoaDon))
                return BadRequest("Thiếu mã hóa đơn.");

            var hoaDon = await _db.HoaDons
                .Include(h => h.ChiTietHoaDons)
                .Include(h => h.IdBenhNhanNavigation)
                .FirstOrDefaultAsync(h => h.MaHd == maHoaDon);

            if (hoaDon == null)
                return NotFound("Không tìm thấy hóa đơn.");

            var result = new HoaDonDetailDto
            {
                Id = hoaDon.Id,
                MaHd = hoaDon.MaHd,
                LoaiHoaDon = hoaDon.LoaiHoaDon,
                TongTien = hoaDon.TongTien,
                TrangThai = hoaDon.TrangThai,
                NgayTao = hoaDon.NgayTao,
                NgayThanhToan = hoaDon.NgayThanhToan,
                BenhNhan = hoaDon.IdBenhNhanNavigation?.HoTen,
                ChiTiet = hoaDon.ChiTietHoaDons.Select(c => new HoaDonItemDto
                {
                    MoTa = c.MoTa,
                    SoLuong = c.SoLuong,
                    DonGia = c.DonGia,
                    ThanhTien = c.ThanhTien
                }).ToList()
            };

            return Ok(result);
        }

        // ===========================================================
        // 0️⃣ DANH SÁCH BỆNH NHÂN CHỜ THANH TOÁN (lọc theo loại)
        // ===========================================================
        [HttpGet("benh-nhan-cho-thanh-toan")]
        public async Task<IActionResult> GetPatientsWaitingForPayment([FromQuery] string? loai = null)
        {
            var query = _db.HoaDons
                .Include(h => h.IdBenhNhanNavigation)
                .Where(h =>
    h.TrangThai == "CHUA_THANH_TOAN" ||
    h.TrangThai == "TAO" ||
    h.TrangThai == "DA_THANH_TOAN"
);


            if (!string.IsNullOrEmpty(loai))
                query = query.Where(h => h.LoaiHoaDon == loai.ToUpper());

            var rawData = await (
                from h in query
                join b in _db.BenhNhans on h.IdBenhNhan equals b.Id
                join lk in _db.LanKhams on b.Id equals lk.IdBenhNhan into lkGroup
                from lk in lkGroup.DefaultIfEmpty()
                join pk in _db.PhongKhams on lk.IdPhong equals pk.Id into pkJoin
                from pk in pkJoin.DefaultIfEmpty()
                select new
                {
                    BenhNhanId = b.Id,
                    HoTen = b.HoTen,
                    SoDienThoai = b.SoDienThoai,
                    MaHoaDon = h.MaHd,
                    TongTien = h.TongTien,
                    TrangThai = h.TrangThai,
                    NgayTao = h.NgayTao,
                    LoaiHoaDon = h.LoaiHoaDon,
                    TenPhong = pk != null ? pk.TenPhong : "(Chưa xác định)"
                }
            ).ToListAsync();

            var data = rawData
                .GroupBy(x => new
                {
                    x.BenhNhanId,
                    x.HoTen,
                    x.SoDienThoai,
                    x.MaHoaDon,
                    x.TongTien,
                    x.TrangThai,
                    x.NgayTao,
                    x.LoaiHoaDon
                })
                .Select(g => new
                {
                    g.Key.BenhNhanId,
                    g.Key.HoTen,
                    g.Key.SoDienThoai,
                    g.Key.MaHoaDon,
                    g.Key.TongTien,
                    g.Key.TrangThai,
                    g.Key.NgayTao,
                    g.Key.LoaiHoaDon,
                    PhongKham = string.Join(", ",
                        g.Select(x => x.TenPhong).Where(t => !string.IsNullOrEmpty(t)).Distinct())
                })
                .OrderByDescending(x => x.NgayTao)
                .ToList();

            if (data.Count == 0)
                return Ok(new { Message = "Không có bệnh nhân nào đang chờ thanh toán." });

            return Ok(data);
        }

        // ===========================================================
        // 1️⃣ DANH SÁCH HÓA ĐƠN CHƯA THANH TOÁN (mọi loại)
        // ===========================================================
        [HttpGet("cho-thanh-toan")]
        public async Task<IActionResult> GetWaitingBills([FromQuery] DateTime? tuNgay = null, [FromQuery] DateTime? denNgay = null)
        {
            var query = _db.HoaDons
                .Include(h => h.IdBenhNhanNavigation)
                .Where(h => h.TrangThai == "CHUA_THANH_TOAN" || h.TrangThai == "TAO");

            if (tuNgay.HasValue) query = query.Where(h => h.NgayTao >= tuNgay.Value);
            if (denNgay.HasValue) query = query.Where(h => h.NgayTao <= denNgay.Value);

            var result = await query
                .OrderByDescending(h => h.NgayTao)
                .Select(h => new HoaDonListDto
                {
                    Id = h.Id,
                    MaHd = h.MaHd,
                    LoaiHoaDon = h.LoaiHoaDon,
                    BenhNhan = h.IdBenhNhanNavigation != null ? h.IdBenhNhanNavigation.HoTen : "",
                    TongTien = h.TongTien,
                    NgayTao = h.NgayTao,
                    TrangThai = h.TrangThai
                })
                .ToListAsync();

            return Ok(result);
        }

        // ===========================================================
        // 2️⃣ XEM CHI TIẾT HÓA ĐƠN THEO ID
        // ===========================================================
        [HttpGet("{id:long}")]
        public async Task<IActionResult> GetBillDetail(long id)
        {
            var hoaDon = await _db.HoaDons
                .Include(h => h.IdBenhNhanNavigation)
                .FirstOrDefaultAsync(h => h.Id == id);

            if (hoaDon == null) return NotFound("Không tìm thấy hóa đơn.");

            var chiTiet = await _db.ChiTietHoaDons
                .Where(ct => ct.IdHoaDon == id)
                .ToListAsync();

            var result = new HoaDonDetailDto
            {
                Id = hoaDon.Id,
                MaHd = hoaDon.MaHd,
                LoaiHoaDon = hoaDon.LoaiHoaDon,
                TongTien = hoaDon.TongTien,
                TrangThai = hoaDon.TrangThai,
                NgayTao = hoaDon.NgayTao,
                NgayThanhToan = hoaDon.NgayThanhToan,
                BenhNhan = hoaDon.IdBenhNhanNavigation?.HoTen,
                ChiTiet = chiTiet.Select(c => new HoaDonItemDto
                {
                    MoTa = c.MoTa,
                    SoLuong = c.SoLuong,
                    DonGia = c.DonGia,
                    ThanhTien = c.ThanhTien
                }).ToList()
            };

            return Ok(result);
        }

        // ===========================================================
        // 3️⃣ XÁC NHẬN THANH TOÁN
        // ===========================================================

        // ✅ Xác nhận thanh toán bằng ID (long)
        [HttpPut("xac-nhan-thanh-toan/{id:long}")]
        public async Task<IActionResult> ConfirmPayment(long id, [FromBody] long idThuNgan)
        {
            var hd = await _db.HoaDons.FirstOrDefaultAsync(x => x.Id == id);
            if (hd == null)
                return NotFound("Không tìm thấy hóa đơn.");

            if (hd.TrangThai == "DA_THANH_TOAN")
                return BadRequest("Hóa đơn này đã được thanh toán rồi.");

            hd.TrangThai = "DA_THANH_TOAN";
            hd.IdThuNgan = idThuNgan;
            hd.NgayThanhToan = DateTime.Now;

            await _db.SaveChangesAsync();
            return Ok(new { Message = "✅ Thanh toán thành công!", hd.MaHd });
        }

        // ✅ Xác nhận thanh toán bằng MÃ HÓA ĐƠN (chuỗi)
        [HttpPut("xac-nhan-thanh-toan/ma/{maHd}")]
        public async Task<IActionResult> ConfirmPaymentByCode(string maHd, [FromBody] ConfirmPaymentRequest req)
        {
            if (string.IsNullOrWhiteSpace(maHd))
                return BadRequest("Thiếu mã hóa đơn.");

            if (req == null || req.IdThuNgan <= 0)
                return BadRequest("Thiếu idThuNgan hợp lệ.");

            var hd = await _db.HoaDons.FirstOrDefaultAsync(x => x.MaHd == maHd);
            if (hd == null)
                return NotFound("Không tìm thấy hóa đơn.");

            if (hd.TrangThai == "DA_THANH_TOAN")
                return BadRequest("Hóa đơn này đã được thanh toán rồi.");

            hd.TrangThai = "DA_THANH_TOAN";
            hd.IdThuNgan = req.IdThuNgan;
            hd.NgayThanhToan = DateTime.Now;

            await _db.SaveChangesAsync();
            return Ok(new { Message = "✅ Thanh toán thành công!", hd.MaHd });
        }

        // ===========================================================
        // 4️⃣ IN PHIẾU THU
        // ===========================================================
        [HttpGet("phieu-thu/{id}")]
        public async Task<IActionResult> PrintReceipt(long id)
        {
            var hoaDon = await _db.HoaDons
                .Include(h => h.IdBenhNhanNavigation)
                .FirstOrDefaultAsync(h => h.Id == id);

            if (hoaDon == null) return NotFound("Không tìm thấy hóa đơn.");

            var chiTiet = await _db.ChiTietHoaDons
                .Where(ct => ct.IdHoaDon == id)
                .ToListAsync();

            var data = new
            {
                hoaDon.MaHd,
                TenBenhNhan = hoaDon.IdBenhNhanNavigation?.HoTen,
                NgayThu = hoaDon.NgayThanhToan,
                LoaiHoaDon = hoaDon.LoaiHoaDon,
                TongTien = hoaDon.TongTien,
                ChiTiet = chiTiet.Select(x => new
                {
                    x.MoTa,
                    x.SoLuong,
                    x.DonGia,
                    x.ThanhTien
                })
            };

            return Ok(data);
        }
        [HttpPost("fix-dvkt-invoices")]
        public async Task<IActionResult> FixDvktInvoices()
        {
            var dvkts = await _db.HoaDons
                .Where(h => h.LoaiHoaDon == "DVKT")
                .ToListAsync();

            int count = 0;

            foreach (var hd in dvkts)
            {
                // lấy các DVKT thuộc lần khám hoặc bệnh nhân
                var cds = await _db.ChiDinhDvkts
    .Join(
        _db.LanKhams,
        cd => cd.IdLanKham,
        lk => lk.Id,
        (cd, lk) => new { cd, lk }
    )
    .Where(x => x.lk.IdBenhNhan == hd.IdBenhNhan)
    .Select(x => x.cd)
    .ToListAsync();


                foreach (var cd in cds)
                {
                    // lấy giá
                    var gia = await _db.DvktGia
                        .Where(g => g.IdDvkt == cd.IdDvkt)
                        .OrderByDescending(g => g.TuNgay)
                        .Select(g => g.DonGia)
                        .FirstOrDefaultAsync();

                    if (gia <= 0) continue;

                    // tạo chi tiết
                    _db.ChiTietHoaDons.Add(new ChiTietHoaDon
                    {
                        IdHoaDon = hd.Id,
                        LoaiThamChieu = "DVKT",
                        IdThamChieu = cd.IdDvkt,
                        SoLuong = cd.SoLuong,
                        DonGia = gia,
                        ThanhTien = gia * cd.SoLuong,
                        MoTa = "DVKT - AutoFix"
                    });

                    // cập nhật tổng tiền
                    hd.TongTienTruoc += gia * cd.SoLuong;
                    hd.TongTien = hd.TongTienTruoc;

                    count++;
                }
            }

            await _db.SaveChangesAsync();

            return Ok(new { success = true, message = "Đã bổ sung chi tiết DVKT", created = count });
        }

        // ===========================================================
        // 5️⃣ TẠO HÓA ĐƠN KHÁM
        // ===========================================================
        [HttpPost("tao-hoa-don-kham")]
        public async Task<IActionResult> CreateKhamBill([FromBody] CLSRequest req)
        {
            if (req == null || req.DichVus == null || req.DichVus.Count == 0)
                return BadRequest("Thiếu danh sách dịch vụ khám.");

            var now = DateTime.Now;
            var maHd = _code.GenMa("HDKHAM");

            var hd = new HoaDon
            {
                MaHd = maHd,
                IdBenhNhan = req.IdBenhNhan,
                LoaiHoaDon = "KHAM",
                HinhThucTt = "TIEN_MAT",
                TrangThai = "CHUA_THANH_TOAN",
                NgayTao = now
            };
            _db.HoaDons.Add(hd);
            await _db.SaveChangesAsync();

            decimal tong = 0;
            foreach (var dv in req.DichVus)
            {
                var donGia = await _pricing.GetCurrentPriceAsync(dv.IdDichVu, dv.IdPhong);
                if (!donGia.HasValue) continue;

                _db.ChiTietHoaDons.Add(new ChiTietHoaDon
                {
                    IdHoaDon = hd.Id,
                    LoaiThamChieu = "PHONG_KHAM",
                    IdThamChieu = dv.IdDichVu,
                    MoTa = $"Khám: {dv.TenDichVu}",
                    SoLuong = dv.SoLuong,
                    DonGia = donGia.Value,
                    ThanhTien = donGia.Value * dv.SoLuong
                });
                tong += donGia.Value * dv.SoLuong;
            }

            hd.TongTienTruoc = tong;
            hd.TongTien = tong;
            await _db.SaveChangesAsync();

            return Ok(new { Message = "✅ Tạo hóa đơn khám thành công", hd.MaHd, hd.TongTien, hd.Id });
        }

        // ===========================================================
        // 6️⃣ TẠO HÓA ĐƠN CLS (DỊCH VỤ KỸ THUẬT)
        // ===========================================================
        [HttpPost("tao-hoa-don-cls")]
        public async Task<IActionResult> CreateCLSBill([FromBody] CLSRequest req)
        {
            var hoaDonKham = await _db.HoaDons
                .Where(h => h.IdBenhNhan == req.IdBenhNhan && h.LoaiHoaDon == "KHAM")
                .OrderByDescending(h => h.NgayTao)
                .FirstOrDefaultAsync();

            if (hoaDonKham == null)
                return BadRequest("Bệnh nhân chưa có hóa đơn khám.");
            if (hoaDonKham.TrangThai != "DA_THANH_TOAN")
                return BadRequest("Chưa thanh toán tiền khám, không thể tạo hóa đơn CLS.");

            var now = DateTime.Now;
            var maHd = _code.GenMa("HDCLS");

            var hd = new HoaDon
            {
                MaHd = maHd,
                IdBenhNhan = req.IdBenhNhan,
                LoaiHoaDon = "DVKT",
                HinhThucTt = "TIEN_MAT",
                TrangThai = "CHUA_THANH_TOAN",
                NgayTao = now
            };
            _db.HoaDons.Add(hd);
            await _db.SaveChangesAsync();

            decimal tong = 0;
            foreach (var dv in req.DichVus)
            {
                var gia = await _pricing.GetCurrentPriceAsync(dv.IdDichVu, dv.IdPhong);
                if (!gia.HasValue) continue;

                _db.ChiTietHoaDons.Add(new ChiTietHoaDon
                {
                    IdHoaDon = hd.Id,
                    LoaiThamChieu = "DVKT",
                    IdThamChieu = dv.IdDichVu,
                    MoTa = $"CLS: {dv.TenDichVu}",
                    SoLuong = dv.SoLuong,
                    DonGia = gia.Value,
                    ThanhTien = gia.Value * dv.SoLuong
                });
                tong += gia.Value * dv.SoLuong;
            }

            hd.TongTienTruoc = tong;
            hd.TongTien = tong;
            await _db.SaveChangesAsync();

            return Ok(new { Message = "✅ Tạo hóa đơn CLS thành công", hd.MaHd, hd.TongTien, hd.Id });
        }

        // ===========================================================
        // 7️⃣ TẠO HÓA ĐƠN THUỐC
        // ===========================================================
        [HttpPost("tao-hoa-don-thuoc")]
        public async Task<IActionResult> CreateMedicineBill([FromBody] TaoHoaDonThuocRequest req)
        {
            var don = await _db.DonThuocs
                .Include(x => x.IdBenhNhanNavigation)
                .FirstOrDefaultAsync(x => x.Id == req.IdDonThuoc);

            if (don == null) return NotFound("Không tìm thấy đơn thuốc.");

            var chiTietThuoc = await _db.ChiTietDonThuocs
                .Include(x => x.IdThuocNavigation)
                .Where(x => x.IdDonThuoc == req.IdDonThuoc)
                .ToListAsync();

            var maHd = _code.GenMa("HDTHUOC");
            decimal tong = chiTietThuoc.Sum(x => x.SoLuong.GetValueOrDefault() * (decimal)(x.IdThuocNavigation?.DonGia ?? 0));

            var hd = new HoaDon
            {
                MaHd = maHd,
                IdBenhNhan = don.IdBenhNhan,
                LoaiHoaDon = "THUOC",
                HinhThucTt = "TIEN_MAT",
                TrangThai = "CHUA_THANH_TOAN",
                NgayTao = DateTime.Now,
                TongTienTruoc = tong,
                TongTien = tong,
                GhiChu = "Thanh toán thuốc"
            };
            _db.HoaDons.Add(hd);
            await _db.SaveChangesAsync();

            foreach (var ct in chiTietThuoc)
            {
                _db.ChiTietHoaDons.Add(new ChiTietHoaDon
                {
                    IdHoaDon = hd.Id,
                    LoaiThamChieu = "THUOC",
                    IdThamChieu = ct.Id,
                    MoTa = $"Thuốc: {ct.IdThuocNavigation?.Ten}",
                    SoLuong = ct.SoLuong,
                    DonGia = (decimal)(ct.IdThuocNavigation?.DonGia ?? 0),
                    ThanhTien = ct.SoLuong.GetValueOrDefault() * (decimal)(ct.IdThuocNavigation?.DonGia ?? 0)
                });
            }

            await _db.SaveChangesAsync();
            return Ok(new { Message = "✅ Tạo hóa đơn thuốc thành công", hd.MaHd, hd.TongTien, hd.Id });
        }
    }
}

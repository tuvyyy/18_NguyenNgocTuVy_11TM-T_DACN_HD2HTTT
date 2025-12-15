using DACN_QLPK_1150070050_NguyenNgocTuVy.Controllers.PDF;
using DACN_QLPK_1150070050_NguyenNgocTuVy.Data;
using DACN_QLPK_1150070050_NguyenNgocTuVy.Dtos;
using DACN_QLPK_1150070050_NguyenNgocTuVy.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DACN_QLPK_1150070050_NguyenNgocTuVy.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LanKhamController : ControllerBase
    {
        private readonly DACNDbContext _db;
        public LanKhamController(DACNDbContext db) => _db = db;

        // ------------------ ENUM TRẠNG THÁI ------------------
        public static class TrangThai
        {
            public const string ChoKham = "CHO_KHAM";
            public const string DangKham = "DANG_KHAM";
            public const string DaKham = "DA_KHAM";
            public const string ChoThucHien = "CHO_THUC_HIEN";
            public const string ChoThanhToan = "CHO_THANH_TOAN";
            public const string DaThanhToan = "DA_THANH_TOAN";
            public const string Huy = "DA_HUY";
        }
        [HttpGet("lan-kham/{id}/detail")]
        public async Task<IActionResult> GetLanKhamDetail(long id)
        {
            // 1) Lấy lần khám
            var lk = await _db.LanKhams.FirstOrDefaultAsync(x => x.Id == id);
            if (lk == null)
                return NotFound();

            // 2) Lấy hồ sơ bệnh án
            var hs = await _db.HoSoBenhAns.FirstOrDefaultAsync(x => x.Id == lk.IdHoSo);

            // 3) Lấy bệnh nhân
            var bn = await _db.BenhNhans.FirstOrDefaultAsync(x => x.Id == lk.IdBenhNhan);

            // 4) Lấy sinh hiệu
            var sh = await _db.SinhHieus
                .Where(x => x.IdLanKham == id)
.OrderByDescending(x => x.ThoiGianDo)
                .FirstOrDefaultAsync();

            return Ok(new
            {
                idLanKham = lk.Id,
                maHoSo = hs?.MaHs,

                benhNhan = bn == null ? null : new
                {
                    id = bn.Id,               // ⭐ THÊM DÒNG NÀY
                    hoTen = bn.HoTen,
                    ngaySinh = bn.NgaySinh,
                    soDienThoai = bn.SoDienThoai,
                    diaChi = $"{bn.DiaChiDuong}, {bn.DiaChiXa}, {bn.DiaChiHuyen}, {bn.DiaChiTinh}",

                    // ⭐⭐ THÊM TẠI ĐÂY ⭐⭐
                    maBenhNhan = bn.MaBn,
                    gioiTinh = bn.GioiTinh,
                    cccd = bn.Cccd
                },


                sinhHieu = sh == null ? null : new
                {
                    nhietDo = sh.NhietDo,
                    mach = sh.NhipTim,                           // ⭐ NhipTim = Mạch
                    huyetAp = $"{sh.HuyetApTamThu}/{sh.HuyetApTamTruong}",   // ⭐ Ghép thành 120/80
                    nhipTho = sh.NhipTho,                        // đúng
                    spo2 = sh.SpO2,                              // chữ o viết thường mới đúng
                    canNang = sh.CanNang,
                    chieuCao = sh.ChieuCao
                },
                trangThai = lk.TrangThai
            });
        }


        // ======================================================
        // 1️⃣ DANH SÁCH CHỜ KHÁM
        // ======================================================
        [HttpGet("cho-kham")]
        public async Task<IActionResult> GetChoKham([FromQuery] long idBacSi, [FromQuery] int idPhong)
        {
            // 1) Kiểm tra đúng là bác sĩ
            var bacSi = await _db.NguoiDungs
                .Include(u => u.NguoiDungVaiTros)
                .ThenInclude(v => v.IdVaiTroNavigation)
                .FirstOrDefaultAsync(u => u.Id == idBacSi);

            if (bacSi == null || !bacSi.NguoiDungVaiTros.Any(v => v.IdVaiTroNavigation.Ten == "BAC_SI"))
                return NotFound(new { success = false, message = "Không tìm thấy bác sĩ hoặc không có quyền." });

            // 2) Kiểm tra bác sĩ có được phân vào phòng này không (bảng bac_si_phong)
            var phanCong = await _db.BacSiPhongs
                .AnyAsync(x => x.IdBacSi == idBacSi && x.IdPhong == idPhong);
            if (!phanCong)
                return Ok(new { success = true, count = 0, data = new object[0] });

            // 3) Lấy danh sách CHỜ KHÁM theo phòng (không cần IdBacSi trong lan_kham)
            var list = await _db.LanKhams
                .Include(x => x.IdBenhNhanNavigation)
                .Include(x => x.IdHoSoNavigation)
                .Where(x => x.TrangThai == TrangThai.ChoKham
                            && x.IdPhong == idPhong
                            && x.IdHoSoNavigation.TrangThai != "HUY_TIEP_DON")
                .OrderBy(x => x.ThoiGianBatDau)
                .Select(x => new
                {
                    x.Id,
                    IdBenhNhan = x.IdBenhNhan,
                    BenhNhan = x.IdBenhNhanNavigation.HoTen,
                    MaBenhNhan = x.IdBenhNhanNavigation.MaBn,
                    x.ThoiGianBatDau,
                    x.TrangThai
                })
                .ToListAsync();

            return Ok(new { success = true, count = list.Count, data = list });
        }

        [HttpGet("da-kham")]
        public async Task<IActionResult> GetDaKham([FromQuery] long idBacSi, [FromQuery] int idPhong)
        {
            var list = await _db.LanKhams
                .Include(x => x.IdBenhNhanNavigation)
                .Where(x => x.IdPhong == idPhong
                            && x.TrangThai == TrangThai.DaKham)
                .OrderByDescending(x => x.ThoiGianKetThuc)
                .Select(x => new {
                    x.Id,
                    BenhNhan = x.IdBenhNhanNavigation.HoTen,
                    x.ThoiGianKetThuc,
                    x.ChanDoanCuoi,
                    x.HuongXuTri,
                    TrangThai = "DA_KHAM"   // ⭐ FIX QUAN TRỌNG
                })
                .ToListAsync();

            return Ok(new { success = true, data = list });
        }

        // 2️⃣ DANH SÁCH KHÁM HÔM NAY
        [HttpGet("hom-nay")]
        public async Task<IActionResult> GetHomNay([FromQuery] long idBacSi, [FromQuery] int idPhong)
        {
            var today = DateTime.Today;

            var phanCong = await _db.BacSiPhongs
                .AnyAsync(x => x.IdBacSi == idBacSi && x.IdPhong == idPhong);
            if (!phanCong)
                return Ok(new { success = true, data = new object[0] });

            var list = await _db.LanKhams
                .Include(x => x.IdBenhNhanNavigation)
                .Where(x =>
                    x.IdPhong == idPhong &&
                    (
                        // 1️⃣ Các lượt khám tạo trong ngày
                        (x.CreatedAt.HasValue && x.CreatedAt.Value.Date == today)

                        // 2️⃣ ⭐ Các lượt khám được MỞ HỒ SƠ
                        || x.TrangThai == TrangThai.DangKham
                    )
                )
                .OrderBy(x => x.ThoiGianBatDau)
                .Select(x => new
                {
                    x.Id,
                    BenhNhan = x.IdBenhNhanNavigation.HoTen,
                    x.TrangThai,
                    x.ThoiGianBatDau
                })
                .ToListAsync();

            return Ok(new { success = true, data = list });
        }



        // ======================================================
        // 3️⃣ CẬP NHẬT KẾT QUẢ KHÁM
        // ======================================================
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateKetQua(long id, [FromBody] LanKhamUpdateDto dto)
        {
            var kham = await _db.LanKhams.FindAsync(id);
            if (kham == null)
                return NotFound(new { success = false, message = "Không tìm thấy lượt khám." });

            // ⭐⭐⭐ CHẶN SỬA NẾU HỒ SƠ ĐÃ ĐÓNG
            if (kham.TrangThai == TrangThai.DaKham ||
                kham.TrangThai == TrangThai.ChoThanhToan ||
                kham.TrangThai == TrangThai.DaThanhToan ||
                kham.TrangThai == TrangThai.Huy)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Hồ sơ đã khóa, không thể chỉnh sửa kết quả khám."
                });
            }

            // ❗ Nếu không khóa -> cho phép cập nhật
            kham.ChanDoanSoBo = dto.ChanDoanSoBo;
            kham.ChanDoanCuoi = dto.ChanDoanCuoi;
            kham.KetQuaKham = dto.KetQuaKham;
            kham.HuongXuTri = dto.HuongXuTri;
            kham.GhiChu = dto.GhiChu;

            kham.ThoiGianKetThuc = DateTime.Now;
            kham.TrangThai = TrangThai.DaKham;
            kham.UpdatedAt = DateTime.Now;

            var hoSo = await _db.HoSoBenhAns.FindAsync(kham.IdHoSo);
            if (hoSo != null)
            {
                hoSo.TrangThai = TrangThai.DaKham;
                hoSo.UpdatedAt = DateTime.Now;
            }

            await _db.SaveChangesAsync();
            return Ok(new { success = true, message = "Cập nhật kết quả khám thành công." });
        }

        // 🔓 5️⃣ MỞ LẠI HỒ SƠ (CHO PHÉP SỬA LẠI KẾT QUẢ KHÁM)
        [HttpPatch("{id}/reopen")]
        public async Task<IActionResult> Reopen(long id)
        {
            var kham = await _db.LanKhams.FindAsync(id);
            if (kham == null)
                return NotFound(new { success = false, message = "Không tìm thấy lượt khám." });

            // ❗ Chỉ chặn khi hồ sơ đã THANH TOÁN hoặc ĐÃ HỦY
            if (kham.TrangThai == TrangThai.DaThanhToan ||
                kham.TrangThai == TrangThai.Huy)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Hồ sơ đã khóa hoàn toàn, không thể mở lại."
                });
            }


            // ⭐ Cho phép sửa lại
            kham.TrangThai = TrangThai.DangKham;
            kham.UpdatedAt = DateTime.Now;

            var hoSo = await _db.HoSoBenhAns.FindAsync(kham.IdHoSo);
            if (hoSo != null)
            {
                hoSo.TrangThai = TrangThai.DangKham;
                hoSo.UpdatedAt = DateTime.Now;
            }

            await _db.SaveChangesAsync();
            return Ok(new { success = true, message = "Đã mở hồ sơ, cho phép chỉnh sửa!" });
        }

        // 4️⃣ CHỈ ĐỊNH DVKT
        [HttpPost("{id}/dichVu")]
        public async Task<IActionResult> ChiDinhDichVu(long id, [FromBody] List<ChiDinhDichVuDto> ds)
        {
            if (ds == null || ds.Count == 0)
                return BadRequest(new { success = false, message = "Danh sách dịch vụ trống." });

            using var tran = await _db.Database.BeginTransactionAsync();
            try
            {
                var kham = await _db.LanKhams.FindAsync(id);
                if (kham == null)
                    return NotFound(new { success = false, message = "Không tìm thấy lượt khám." });

                foreach (var item in ds)
                {
                    var gia = await _db.DichVuGia
                        .Where(x => x.IdDichVu == item.IdDichVu && (x.HoatDong ?? false))
                        .OrderByDescending(x => x.NgayApDung)
                        .Select(x => x.DonGia)
                        .FirstOrDefaultAsync();

                    _db.LanKhamDichVus.Add(new LanKhamDichVu
                    {
                        IdLanKham = id,
                        IdDichVu = item.IdDichVu,
                        SoLuong = item.SoLuong,
                        DonGia = gia,
                        TrangThaiThucHien = TrangThai.ChoThucHien,
                        GhiChu = item.GhiChu
                    });
                }

                kham.TrangThai = TrangThai.ChoThucHien;
                kham.UpdatedAt = DateTime.Now;

                var hoaDon = new HoaDon
                {
                    MaHd = "HDCLS_" + DateTime.Now.Ticks,
                    IdLanKham = id,
                    IdBenhNhan = kham.IdBenhNhan,
                    LoaiHoaDon = "DVKT",
                    TrangThai = "CHUA_THANH_TOAN",
                    NgayTao = DateTime.Now
                };
                _db.HoaDons.Add(hoaDon);

                await _db.SaveChangesAsync();
                await tran.CommitAsync();

                return Ok(new { success = true, message = "Chỉ định DVKT thành công." });
            }
            catch (Exception ex)
            {
                await tran.RollbackAsync();
                return BadRequest(new { success = false, message = "Lỗi khi chỉ định DVKT", error = ex.Message });
            }
        }

        // 6️⃣ HỦY LƯỢT KHÁM
        [HttpPatch("{id}/cancel")]
        public async Task<IActionResult> Cancel(long id, [FromBody] string? reason)
        {
            var kham = await _db.LanKhams.FindAsync(id);
            if (kham == null)
                return NotFound(new { success = false, message = "Không tìm thấy lượt khám." });

            kham.TrangThai = TrangThai.Huy;
            kham.GhiChu = $"[Hủy] {reason ?? "Không rõ lý do"}";
            kham.UpdatedAt = DateTime.Now;

            await _db.SaveChangesAsync();
            return Ok(new { success = true, message = "Đã hủy lượt khám." });
        }

        // 7️⃣ LỊCH SỬ KHÁM
        [HttpGet("~/api/benhNhan/{id}/lichSuKham")]
        public async Task<IActionResult> GetLichSuKham(long id)
        {
            var list = await _db.LanKhams
                .Include(x => x.IdPhongNavigation)
                .Where(x => x.IdBenhNhan == id)
                .OrderByDescending(x => x.CreatedAt)
                .Select(x => new
                {
                    x.Id,
                    x.ThoiGianBatDau,
                    x.ThoiGianKetThuc,
                    x.ChanDoanCuoi,
                    x.HuongXuTri,
                    PhongKham = x.IdPhongNavigation.TenPhong,
                    x.TrangThai
                })
                .ToListAsync();

            return Ok(new { success = true, data = list });
        }

        // ======================================================
        // 🔍 0️⃣ LẤY DANH SÁCH PHÒNG MÀ BÁC SĨ ĐANG PHỤ TRÁCH
        // ======================================================
        [HttpGet("phong-cua-bac-si")]
        public async Task<IActionResult> GetPhongCuaBacSi([FromQuery] long idBacSi)
        {
            // kiểm tra tồn tại người dùng & vai trò
            var user = await _db.NguoiDungs
                .Include(x => x.NguoiDungVaiTros)
                .ThenInclude(v => v.IdVaiTroNavigation)
                .FirstOrDefaultAsync(x => x.Id == idBacSi);

            if (user == null)
                return NotFound(new { success = false, message = "Không tìm thấy người dùng." });

            if (!user.NguoiDungVaiTros.Any(v => v.IdVaiTroNavigation.Ten == "BAC_SI"))
                return BadRequest(new { success = false, message = "Người dùng không phải bác sĩ." });

            // lấy danh sách phòng từ bảng trung gian
            var list = await _db.BacSiPhongs
                .Include(x => x.IdPhongNavigation)
                .Where(x => x.IdBacSi == idBacSi)
                .Select(x => new {
                    x.IdPhong,
                    TenPhong = x.IdPhongNavigation.TenPhong,
                    Khoa = x.IdPhongNavigation.KhoaPhong
                })
                .ToListAsync();

            return Ok(new { success = true, data = list });
        }

        [HttpGet("~/api/bacsi/{id}/phong")]
        public async Task<IActionResult> GetPhongByBacSi(long id)
        {
            var phong = await _db.BacSiPhongs
                .Include(x => x.IdPhongNavigation)   // ⭐ ĐÚNG TÊN NÈ
                .Where(x => x.IdBacSi == id)
                .Select(x => new {
                    x.IdPhong,
                    TenPhong = x.IdPhongNavigation.TenPhong,
                    IdKhoa = x.IdPhongNavigation.KhoaPhong
                })
                .FirstOrDefaultAsync();

            if (phong == null)
                return NotFound(new { message = "Bác sĩ chưa được phân vào phòng nào." });

            return Ok(phong);
        }

    }
}

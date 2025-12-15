using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DACN_QLPK_1150070050_NguyenNgocTuVy.Data;
using DACN_QLPK_1150070050_NguyenNgocTuVy.Models;
using DACN_QLPK_1150070050_NguyenNgocTuVy.Dtos;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using DACN_QLPK_1150070050_NguyenNgocTuVy.Services;
using DACN_QLPK_1150070050_NguyenNgocTuVy.Controllers.PDF;

namespace DACN.Controllers
{
    [ApiController]
    [Route("api/bacsi/dvkt")]
    public class ChiDinhDVKTController : ControllerBase
    {
        private readonly DACNDbContext _db;
        private readonly ICodeGenerator _code;   // ⭐ THÊM DÒNG NÀY
        private readonly IWebHostEnvironment _env;


        public ChiDinhDVKTController(DACNDbContext db, ICodeGenerator code, IWebHostEnvironment env )
        {
            _db = db;
            _code = code;   // ⭐ THÊM DÒNG NÀY
            _env = env;
        }

        // ==========================================================
        // 0. HÀM LẤY ID BÁC SĨ TỪ TOKEN (ĐỌC TRỰC TIẾP HEADER)
        // ==========================================================
        private long GetBacSiId()
        {
            // Ưu tiên đọc từ claim "sub" (vì em set NameClaimType = "sub")
            var id =
                User?.Claims?.FirstOrDefault(c =>
                    c.Type == "sub" ||
                    c.Type == ClaimTypes.NameIdentifier ||
                    c.Type == "nameid")?.Value;

            Console.WriteLine("===== GetBacSiId() =====");
            Console.WriteLine("Claim ID bác sĩ lấy được = " + id);

            if (string.IsNullOrEmpty(id))
                throw new Exception("Token không chứa claim ID (sub / nameid).");

            return long.Parse(id);
        }


        // ==========================================================
        // 1. CHECK LẦN KHÁM CÓ THUỘC BÁC SĨ + ĐANG HOẠT ĐỘNG
        // ==========================================================
        private async Task<(bool ok, IActionResult? error, LanKham? lk)>
            CheckLanKham(long idLanKham, long idBacSi)
        {
            var lk = await _db.LanKhams.FirstOrDefaultAsync(x => x.Id == idLanKham);

            if (lk.IdBacSi == null)
            {
                lk.IdBacSi = idBacSi;
                await _db.SaveChangesAsync();
            }


            Console.WriteLine("===== CheckLanKham() =====");
            Console.WriteLine($"IdLanKham = {idLanKham}");
            Console.WriteLine($"IdBacSi từ token = {idBacSi}");
            Console.WriteLine($"IdBacSi trong DB = {lk.IdBacSi}");
            Console.WriteLine($"TrangThai trong DB = {lk.TrangThai}");

            if (lk.IdBacSi == null)
                return (false, Unauthorized($"Lần khám {idLanKham} chưa gán id_bac_si (NULL)."), null);

            if (lk.IdBacSi != idBacSi)
                return (false,
                    Unauthorized($"Lần khám {idLanKham} thuộc bác sĩ {lk.IdBacSi}, khác với ID trong token {idBacSi}."),
                    null);

            if (lk.TrangThai == "hoan_thanh" || lk.TrangThai == "ket_thuc")
                return (false, BadRequest("Lần khám đã hoàn tất, không thể chỉ định DVKT."), null);


            return (true, null, lk);
        }

        // ==========================================================
        // 2. BÁC SĨ CHỈ ĐỊNH DVKT
        // ==========================================================
        [Authorize]
        [HttpPost("chidinh")]
        public async Task<IActionResult> ChiDinh(CreateChiDinhDVKTDto dto)
        {
            // ===========================
            // 🔥 DEBUG TOKEN TRONG BE
            // ===========================
            Console.WriteLine("===== HEADER AUTHORIZATION =====");
            Console.WriteLine(Request.Headers["Authorization"].ToString());

            Console.WriteLine("===== CLAIMS NHẬN ĐƯỢC =====");
            if (User?.Identity?.IsAuthenticated == true)
            {
                foreach (var c in User.Claims)
                    Console.WriteLine($"{c.Type} = {c.Value}");
            }
            else
            {
                Console.WriteLine("❌ User.Identity == NULL (BE KHÔNG NHẬN TOKEN)");
            }
            if (dto.SoLuong <= 0)
                return BadRequest("Số lượng phải >= 1");

            long idBacSi = GetBacSiId();

            var check = await CheckLanKham(dto.IdLanKham, idBacSi);
            if (!check.ok) return check.error!;

            var dvkt = await _db.Dvkts
                .Include(x => x.DvktGia)
                .FirstOrDefaultAsync(x => x.Id == dto.IdDVKT);

            if (dvkt == null)
                return BadRequest("DVKT không tồn tại.");

            if (!dvkt.HoatDong)
                return BadRequest("DVKT đang tạm ngưng sử dụng.");

            var today = DateOnly.FromDateTime(DateTime.Now);

            var giaHieuLuc = dvkt.DvktGia
                .Where(g =>
                    g.TuNgay <= today &&
                    (g.DenNgay == null || g.DenNgay >= today)
                )
                .OrderByDescending(g => g.TuNgay)
                .FirstOrDefault();

            if (giaHieuLuc == null)
                return BadRequest("DVKT này không có giá đang hiệu lực.");

            var exists = await _db.ChiDinhDvkts.AnyAsync(x =>
                x.IdLanKham == dto.IdLanKham &&
                x.IdDvkt == dto.IdDVKT &&
                x.TrangThai == "pending");

            if (exists)
                return BadRequest("DVKT này đã được chỉ định và đang chờ thực hiện.");

            var cd = new ChiDinhDvkt
            {
                IdLanKham = dto.IdLanKham,
                IdDvkt = (int)dto.IdDVKT,
                SoLuong = dto.SoLuong,
                GhiChu = dto.GhiChu,
                TrangThai = "pending",
                CreatedAt = DateTime.Now
            };

            _db.ChiDinhDvkts.Add(cd);
            await _db.SaveChangesAsync();
            // ======================================================
            // 🧾  TẠO / CẬP NHẬT HÓA ĐƠN DVKT SAU KHI CHỈ ĐỊNH
            // ======================================================

            // 🔍 Kiếm hóa đơn CLS gắn với đúng lần khám
            var hoaDonCls = await _db.HoaDons
                .Where(h => h.IdBenhNhan == check.lk.IdBenhNhan
                         && h.LoaiHoaDon == "DVKT"
                         && h.IdLanKham == dto.IdLanKham)   // 🔥 Quan trọng
                .OrderByDescending(h => h.NgayTao)
                .FirstOrDefaultAsync();

            if (hoaDonCls == null)
            {
                // 📌 Tạo mã hóa đơn chuẩn theo hệ thống
                var maHd = _code.GenMa("HDCLS");

                hoaDonCls = new HoaDon
                {
                    MaHd = maHd,
                    IdBenhNhan = check.lk.IdBenhNhan,
                    IdLanKham = dto.IdLanKham,    // 🔥 Thêm IdLanKham vào hóa đơn
                    LoaiHoaDon = "DVKT",
                    HinhThucTt = "TIEN_MAT",
                    TrangThai = "CHUA_THANH_TOAN",
                    NgayTao = DateTime.Now,
                    TongTienTruoc = 0,
                    TongTien = 0
                };

                _db.HoaDons.Add(hoaDonCls);
                await _db.SaveChangesAsync();
            }

            // 📌 Lấy giá
            var donGia = giaHieuLuc.DonGia;

            // 📌 Thêm chi tiết hóa đơn
            _db.ChiTietHoaDons.Add(new ChiTietHoaDon
            {
                IdHoaDon = hoaDonCls.Id,
                LoaiThamChieu = "DVKT",
                IdThamChieu = dvkt.Id,
                MoTa = $"CLS: {dvkt.TenDvkt}",
                SoLuong = cd.SoLuong,
                DonGia = donGia,
                ThanhTien = donGia * cd.SoLuong
            });

            // 📌 Cập nhật tổng tiền
            hoaDonCls.TongTienTruoc += donGia * cd.SoLuong;
            hoaDonCls.TongTien = hoaDonCls.TongTienTruoc;

            await _db.SaveChangesAsync();


            return Ok(new
            {
                success = true,
                message = "Chỉ định DVKT thành công.",
                data = new
                {
                    id = cd.Id,
                    idLanKham = cd.IdLanKham,
                    idDvkt = cd.IdDvkt,
                    soLuong = cd.SoLuong,
                    ghiChu = cd.GhiChu,
                    trangThai = cd.TrangThai,
                    createdAt = cd.CreatedAt,
                    donGia = giaHieuLuc.DonGia,
                    tenDvkt = dvkt.TenDvkt
                }
            });


        }

        // ==========================================================
        // 3. LẤY DS CHỈ ĐỊNH THEO LẦN KHÁM
        // ==========================================================
        [Authorize]
        [HttpGet("lankham/{idLanKham}")]
        public async Task<IActionResult> GetByLanKham(long idLanKham)
        {
            long idBacSi = GetBacSiId();

            var check = await CheckLanKham(idLanKham, idBacSi);
            if (!check.ok) return check.error!;

            var data = await (
                from c in _db.ChiDinhDvkts
                join d in _db.Dvkts on c.IdDvkt equals d.Id
                where c.IdLanKham == idLanKham
                select new
                {
                    c.Id,
                    c.IdLanKham,
                    c.IdDvkt,
                    d.MaDvkt,
                    d.TenDvkt,
                    c.SoLuong,
                    c.TrangThai,
                    c.GhiChu,
                    c.CreatedAt
                }
            ).ToListAsync();

            return Ok(data);
        }

        // ==========================================================
        // 4. CẬP NHẬT CHỈ ĐỊNH (PENDING)
        // ==========================================================
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(long id, UpdateChiDinhDVKTDto dto)
        {
            if (dto.SoLuong <= 0)
                return BadRequest("Số lượng phải >= 1");

            var cd = await _db.ChiDinhDvkts
                .Include(x => x.IdLanKhamNavigation)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (cd == null)
                return NotFound("Không tìm thấy chỉ định.");

            long idBacSi = GetBacSiId();

            var check = await CheckLanKham(cd.IdLanKham, idBacSi);
            if (!check.ok) return check.error!;

            if (cd.TrangThai != "pending")
                return BadRequest("Chỉ định đã được xử lý, không thể cập nhật.");

            cd.SoLuong = dto.SoLuong;
            cd.GhiChu = dto.GhiChu;

            await _db.SaveChangesAsync();
            return Ok(cd);
        }

        // ==========================================================
        // 5. HỦY CHỈ ĐỊNH (PENDING)
        // ==========================================================
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Cancel(long id)
        {
            var cd = await _db.ChiDinhDvkts
                .Include(x => x.IdLanKhamNavigation)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (cd == null)
                return NotFound("Không tìm thấy chỉ định.");

            long idBacSi = GetBacSiId();

            var check = await CheckLanKham(cd.IdLanKham, idBacSi);
            if (!check.ok) return check.error!;

            // ❗ CHECK HÓA ĐƠN DVKT ĐÃ THANH TOÁN CHƯA
            var hoaDon = await _db.HoaDons
                .Where(h => h.IdLanKham == cd.IdLanKham && h.LoaiHoaDon == "DVKT")
                .OrderByDescending(h => h.NgayTao)
                .FirstOrDefaultAsync();

            if (hoaDon != null && hoaDon.TrangThai == "DA_THANH_TOAN")
            {
                return BadRequest("Chỉ định đã được thanh toán, không thể hủy.");
            }


            if (cd.TrangThai != "pending")
                return BadRequest("Không thể hủy chỉ định đã được xử lý.");

            cd.TrangThai = "canceled";
            await _db.SaveChangesAsync();

            return Ok("Đã hủy chỉ định.");
        }

        // ==========================================================
        // 6. LẤY FULL DVKT (+ GIÁ ĐANG HIỆU LỰC)
        // ==========================================================
        [AllowAnonymous]
        [HttpGet("full")]
        public async Task<IActionResult> GetAllFull()
        {
            var today = DateOnly.FromDateTime(DateTime.Now);

            var data = await (
                from d in _db.Dvkts
                join p in _db.DvktPhongs on d.Id equals p.IdDvkt into gj
                from sub in gj.DefaultIfEmpty()
                join phong in _db.PhongThucHiens on sub.IdPhong equals phong.Id into gj2
                from phongFinal in gj2.DefaultIfEmpty()
                where d.HoatDong == true
                select new
                {
                    id = d.Id,
                    maDvkt = d.MaDvkt,
                    tenDvkt = d.TenDvkt,
                    loai = d.IdNhom,
                    donGia = d.DvktGia
                        .Where(g => g.TuNgay <= today && (g.DenNgay == null || g.DenNgay >= today))
                        .OrderByDescending(g => g.TuNgay)
                        .Select(g => g.DonGia)
                        .FirstOrDefault(),
                    phong = phongFinal != null ? new
                    {
                        idPhong = phongFinal.Id,
                        tenPhong = phongFinal.TenPhong,
                        tang = phongFinal.Tang
                    } : null
                }
            ).ToListAsync();

            return Ok(data);
        }

        [HttpGet("pdf/{id}")]
        public IActionResult XemPDF(long id)
        {
            var folder = Path.Combine(_env.WebRootPath, "pdf-ketqua");
            var fileName = $"KETQUA_DVKT_{id}.pdf";
            var fullPath = Path.Combine(folder, fileName);

            if (!System.IO.File.Exists(fullPath))
                return NotFound("Không tìm thấy PDF.");

            var stream = new FileStream(fullPath, FileMode.Open, FileAccess.Read);

            Response.Headers["Content-Disposition"] = $"inline; filename={fileName}";
            return new FileStreamResult(stream, "application/pdf");
        }

    }
}

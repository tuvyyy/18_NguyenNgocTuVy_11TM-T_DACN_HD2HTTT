using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DACN_QLPK_1150070050_NguyenNgocTuVy.Data;
using DACN_QLPK_1150070050_NguyenNgocTuVy.Models;
using DACN_QLPK_1150070050_NguyenNgocTuVy.Dtos;
using System.Security.Claims;
using DACN_QLPK_1150070050_NguyenNgocTuVy.Controllers.PDF;

namespace DACN.Controllers
{
    [ApiController]
    [Route("api/ktv/dvkt")]
    public class ThucHienDVKTController : ControllerBase
    {
        private readonly DACNDbContext _db;

        // ===========================
        // TRẠNG THÁI CHUẨN
        // ===========================
        private const string TRANG_THAI_PENDING = "pending";      // Chờ thực hiện
        private const string TRANG_THAI_PROCESSING = "processing"; // Đang thực hiện
        private const string TRANG_THAI_DONE = "done";            // Đã hoàn thành

        private const string KQ_STATUS_DRAFT = "draft";
        private const string KQ_STATUS_COMPLETED = "completed";
        private const string KQ_STATUS_DONE = "done";

        public ThucHienDVKTController(DACNDbContext db)
        {
            _db = db;
        }

        // ============================================================
        // HELPER: LẤY ID KTV TỪ TOKEN
        // ============================================================
        private long GetKtvId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier) ?? User.FindFirst("sub");
            if (claim == null)
            {
                throw new InvalidOperationException("Không tìm thấy thông tin người thực hiện trong token.");
            }

            return long.Parse(claim.Value);
        }

        // ============================================================
        // HELPER: GHI LOG THAO TÁC
        // (Bạn nhớ add DbSet<DvktThucHienLog> vào DACNDbContext + migration)
        // ============================================================
        private async Task AddLog(long idChiDinh, string action, string? note = null)
        {
            var ktvId = GetKtvId();

            var log = new DvktThucHienLog
            {
                IdChiDinhDvkt = idChiDinh,
                IdNguoiThucHien = ktvId,
                Action = action,
                Note = note,
                CreatedAt = DateTime.Now
            };

            _db.DvktThucHienLogs.Add(log);
            await _db.SaveChangesAsync();
        }

        // ============================================================
        // 1) DANH SÁCH DVKT CHỜ THỰC HIỆN (CHƯA AI NHẬN)
        // ============================================================
        [HttpGet("pending")]
        public async Task<IActionResult> GetPending()
        {
            var data = await (
                from cd in _db.ChiDinhDvkts
                join dv in _db.Dvkts on cd.IdDvkt equals dv.Id

                join lk in _db.LanKhams on cd.IdLanKham equals lk.Id
                join bn in _db.BenhNhans on lk.IdBenhNhan equals bn.Id

                join dvp in _db.DvktPhongs on dv.Id equals dvp.IdDvkt into grp1
                from dvp in grp1.DefaultIfEmpty()

                join p in _db.PhongThucHiens on dvp.IdPhong equals p.Id into grp2
                from p in grp2.DefaultIfEmpty()

                join g in _db.DvktGia on dv.Id equals g.IdDvkt into grp3
                from g in grp3
                    .OrderByDescending(x => x.TuNgay)
                    .Take(1)
                    .DefaultIfEmpty()

                where cd.TrangThai == TRANG_THAI_PENDING
                      && cd.IdNguoiThucHien == null

                orderby cd.CreatedAt descending

                select new
                {
                    cd.Id,
                    cd.IdLanKham,
                    dv.TenDvkt,
                    dv.MaDvkt,
                    cd.SoLuong,
                    Gia = g != null ? g.DonGia : 0,

                    // 🔥 Thông tin bệnh nhân
                    BenhNhan = bn.HoTen,
                    MaBenhNhan = bn.MaBn,
                    GioiTinh = bn.GioiTinh,
                    NgaySinh = bn.NgaySinh,

                    Phong = p != null ? p.TenPhong : "Chưa gán phòng",
                    Tang = p != null ? (p.Tang.HasValue ? p.Tang.Value : 0) : 0,
                    TrangThai = cd.TrangThai,
                    IdNguoiThucHien = cd.IdNguoiThucHien
                }
            ).ToListAsync();

            return Ok(data);
        }


        // ============================================================
        // 2) DANH SÁCH DVKT ĐANG THỰC HIỆN CỦA KTV
        [HttpGet("processing")]
        public async Task<IActionResult> GetProcessing()
        {
            var ktvId = GetKtvId();

            var data = await (
                from cd in _db.ChiDinhDvkts
                join dv in _db.Dvkts on cd.IdDvkt equals dv.Id
                join lk in _db.LanKhams on cd.IdLanKham equals lk.Id
                join bn in _db.BenhNhans on lk.IdBenhNhan equals bn.Id

                join dvp in _db.DvktPhongs on dv.Id equals dvp.IdDvkt into grp1
                from dvp in grp1.DefaultIfEmpty()

                join p in _db.PhongThucHiens on dvp.IdPhong equals p.Id into grp2
                from p in grp2.DefaultIfEmpty()

                join g in _db.DvktGia on dv.Id equals g.IdDvkt into grp3
                from g in grp3
                    .OrderByDescending(x => x.TuNgay)
                    .Take(1)
                    .DefaultIfEmpty()

                where cd.TrangThai == TRANG_THAI_PROCESSING
                      && cd.IdNguoiThucHien == ktvId

                orderby cd.NhanLuc descending

                select new
                {
                    cd.Id,
                    cd.IdLanKham,
                    dv.TenDvkt,
                    dv.MaDvkt,
                    cd.SoLuong,
                    Gia = g != null ? g.DonGia : 0,

                    // 🔥 Thông tin bệnh nhân
                    BenhNhan = bn.HoTen,
                    MaBenhNhan = bn.MaBn,
                    GioiTinh = bn.GioiTinh,
                    NgaySinh = bn.NgaySinh,

                    Phong = p != null ? p.TenPhong : "Chưa gán phòng",
                    Tang = p != null ? (p.Tang.HasValue ? p.Tang.Value : 0) : 0,
                    TrangThai = cd.TrangThai,
                    IdNguoiThucHien = cd.IdNguoiThucHien,
                    NhanLuc = cd.NhanLuc
                }
            ).ToListAsync();

            return Ok(data);
        }


        // ============================================================
        // 3) DANH SÁCH DVKT ĐÃ HOÀN THÀNH CỦA KTV (CÓ LỌC NGÀY)
        [HttpGet("done")]
        public async Task<IActionResult> GetDone([FromQuery] DateTime? from, [FromQuery] DateTime? to)
        {
            var ktvId = GetKtvId();
            var tuNgay = from ?? DateTime.Today.AddDays(-30);
            var denNgay = to ?? DateTime.Today.AddDays(1);

            var data = await (
                from cd in _db.ChiDinhDvkts
                join dv in _db.Dvkts on cd.IdDvkt equals dv.Id

                // ⭐ THÊM 2 JOIN QUAN TRỌNG
                join lk in _db.LanKhams on cd.IdLanKham equals lk.Id
                join bn in _db.BenhNhans on lk.IdBenhNhan equals bn.Id

                select new
                {
                    cd,
                    dv,
                    bn,
                    kq = _db.DvktKetQuas
                        .Where(x => x.IdChiDinhDvkt == cd.Id)
                        .OrderByDescending(x => x.Id)
                        .FirstOrDefault()
                }
            )
            .Where(x =>
                x.cd.TrangThai == TRANG_THAI_DONE &&
                x.cd.IdNguoiThucHien == ktvId &&
                x.cd.HoanThanhLuc >= tuNgay &&
                x.cd.HoanThanhLuc < denNgay
            )
            .OrderByDescending(x => x.cd.HoanThanhLuc)
            .Select(x => new
            {
                x.cd.Id,
                x.cd.IdLanKham,
                x.dv.TenDvkt,
                x.dv.MaDvkt,

                // ⭐ Thêm thông tin bệnh nhân
                MaBenhNhan = x.bn.MaBn,
                BenhNhan = x.bn.HoTen,
                NgaySinh = x.bn.NgaySinh,
                GioiTinh = x.bn.GioiTinh,

                trangThai = x.cd.TrangThai,
                trangThaiKQ = x.kq != null ? x.kq.TrangThai : "draft",

                ketQuaText = x.kq != null ? x.kq.KetQuaText : null,
                fileUrl = x.kq != null ? x.kq.FileUrl : null
            })
            .ToListAsync();

            return Ok(data);
        }


        // ============================================================
        // 4) KTV NHẬN DVKT (CHỐNG 2 KTV NHẬN TRÙNG)
        // ============================================================
        [HttpPatch("nhan/{id}")]
        public async Task<IActionResult> NhanDVKT(long id)
        {
            // 🔥 CHECK THANH TOÁN TRƯỚC KHI NHẬN DVKT
            var daThanhToan = await (
                from cdkt in _db.ChiDinhDvkts
                join hdct in _db.ChiTietHoaDons
                    on cdkt.IdDvkt equals hdct.IdThamChieu
                join hd in _db.HoaDons
                    on hdct.IdHoaDon equals hd.Id
                where cdkt.Id == id
                      && hd.LoaiHoaDon == "DVKT"
                      && hdct.LoaiThamChieu == "DVKT"
                      && hd.TrangThai == "DA_THANH_TOAN"
                select hd.Id
            ).AnyAsync();

            if (!daThanhToan)
            {
                return BadRequest("❌ Dịch vụ này chưa được thanh toán. Không thể nhận thực hiện DVKT.");
            }

            var ktvId = GetKtvId();

            // Chỉ cho nhận nếu pending và chưa có người thực hiện
            var cd = await _db.ChiDinhDvkts
                .Where(x => x.Id == id
                            && x.TrangThai == TRANG_THAI_PENDING
                            && x.IdNguoiThucHien == null)
                .SingleOrDefaultAsync();

            if (cd == null)
            {
                return Conflict("DVKT đã được nhận bởi người khác hoặc không ở trạng thái chờ.");
            }

            cd.TrangThai = TRANG_THAI_PROCESSING;
            cd.IdNguoiThucHien = ktvId;
            cd.NhanLuc = DateTime.Now;

            await _db.SaveChangesAsync();
            await AddLog(id, "nhan", "Nhận DVKT để thực hiện");

            return Ok(new { message = "Đã nhận DVKT.", id = cd.Id, cd.TrangThai });
        }

        // ============================================================
        // 5) HỦY NHẬN DVKT (TRẢ VỀ HÀNG CHỜ)
        // ============================================================
        [HttpPatch("huy-nhan/{id}")]
        public async Task<IActionResult> HuyNhanDVKT(long id)
        {
            var ktvId = GetKtvId();

            var cd = await _db.ChiDinhDvkts.FindAsync(id);
            if (cd == null) return NotFound("Không tìm thấy DVKT.");

            if (cd.TrangThai != TRANG_THAI_PROCESSING)
                return BadRequest("Chỉ được hủy nhận khi DVKT đang ở trạng thái 'đang thực hiện'.");

            if (cd.IdNguoiThucHien != ktvId)
                return Forbid("Bạn không phải người đang thực hiện DVKT này.");

            cd.TrangThai = TRANG_THAI_PENDING;
            cd.IdNguoiThucHien = null;
            cd.NhanLuc = null;

            await _db.SaveChangesAsync();
            await AddLog(id, "huy_nhan", "Hủy nhận DVKT, trả về hàng chờ");

            return Ok(new { message = "Đã hủy nhận DVKT, trả về trạng thái chờ." });
        }

        // ============================================================
        // 6) TẠO / CẬP NHẬT KẾT QUẢ TỔNG CHO DVKT
        // ============================================================
        [HttpPost("ketqua")]
        public async Task<IActionResult> TaoHoacCapNhatKetQua([FromBody] CreateKetQuaDVKTDto dto)
        {
            var ktvId = GetKtvId();

            // Kiểm tra chỉ định DVKT
            var cd = await _db.ChiDinhDvkts.FindAsync(dto.IdChiDinhDVKT);
            if (cd == null) return NotFound("Không tìm thấy chỉ định DVKT.");

            // Chỉ người đang thực hiện mới được nhập kết quả
            if (cd.IdNguoiThucHien != ktvId)
                return Forbid("Bạn không phải người thực hiện DVKT này.");

            if (cd.TrangThai != TRANG_THAI_PROCESSING && cd.TrangThai != TRANG_THAI_DONE)
                return BadRequest("Chỉ được nhập kết quả khi DVKT đang thực hiện hoặc đã hoàn thành.");

            // Check đã có kết quả chưa
            var kq = await _db.DvktKetQuas
                .FirstOrDefaultAsync(x => x.IdChiDinhDvkt == cd.Id);

            if (kq == null)
            {
                kq = new DvktKetQua
                {
                    IdChiDinhDvkt = dto.IdChiDinhDVKT,
                    KetQuaText = dto.KetQuaText,
                    FileUrl = dto.FileUrl,
                    TrangThai = string.IsNullOrWhiteSpace(dto.KetQuaText) && string.IsNullOrWhiteSpace(dto.FileUrl)
                        ? KQ_STATUS_DRAFT
                        : KQ_STATUS_COMPLETED,
                    ThoiGianThucHien = DateTime.Now
                };
                _db.DvktKetQuas.Add(kq);
            }
            else
            {
                kq.KetQuaText = dto.KetQuaText;
                kq.FileUrl = dto.FileUrl;
                kq.TrangThai = string.IsNullOrWhiteSpace(dto.KetQuaText) && string.IsNullOrWhiteSpace(dto.FileUrl)
                    ? KQ_STATUS_DRAFT
                    : KQ_STATUS_COMPLETED;
                kq.ThoiGianThucHien = DateTime.Now;
            }

            await _db.SaveChangesAsync();
            await AddLog(cd.Id, "ket_qua_tong", "Nhập/ cập nhật kết quả tổng DVKT");

            return Ok(new
            {
                id = kq.Id,
                ketQuaText = kq.KetQuaText,
                fileUrl = kq.FileUrl,
                trangThai = kq.TrangThai,
                thoiGian = kq.ThoiGianThucHien
            });
        }



        // 7) NHẬP / CẬP NHẬT KẾT QUẢ CHỈ TIÊU
        [HttpPost("ketqua/chitiet")]
        public async Task<IActionResult> NhapKetQuaChiTiet([FromBody] CreateKetQuaChiTietDto dto)
        {
            var ktvId = GetKtvId();

            // Lấy kết quả tổng
            var kq = await _db.DvktKetQuas
                .Include(x => x.IdChiDinhDvktNavigation)
                .FirstOrDefaultAsync(x => x.Id == dto.IdKetQua);

            if (kq == null)
                return NotFound("Không tìm thấy kết quả DVKT.");

            var cd = kq.IdChiDinhDvktNavigation;
            if (cd == null)
                return BadRequest("Kết quả không gắn với chỉ định DVKT hợp lệ.");

            if (cd.IdNguoiThucHien != ktvId)
                return Forbid("Bạn không phải người thực hiện DVKT này.");

            // Lấy thông tin chỉ tiêu (có min–max)

            var chiTieu = await _db.DvktChiTieus
            .FirstOrDefaultAsync(x => x.Id == dto.IdChiTieu);

            if (chiTieu == null)
                return BadRequest("Chỉ tiêu không hợp lệ.");

            // ============================
            // 🔥 TÍNH DANH GIÁ (LOW/HIGH/NORMAL)
            // ============================
            string? danhGia = null;

            if (!string.IsNullOrEmpty(dto.GiaTri) && double.TryParse(dto.GiaTri, out double val))
            {
                if (chiTieu.GioiHanThap.HasValue && val < chiTieu.GioiHanThap.Value)
                    danhGia = "THẤP";
                else if (chiTieu.GioiHanCao.HasValue && val > chiTieu.GioiHanCao.Value)
                    danhGia = "CAO";
                else
                    danhGia = "BÌNH THƯỜNG";
            }

            // ============================
            // 🔥 UPSERT (IdKetQua + IdChiTieu)
            // ============================
            var existed = await _db.DvktKetQuaChiTiets
                .FirstOrDefaultAsync(x => x.IdKetQua == dto.IdKetQua && x.IdChiTieu == dto.IdChiTieu);

            if (existed == null)
            {
                var ct = new DvktKetQuaChiTiet
                {
                    IdKetQua = dto.IdKetQua,
                    IdChiTieu = (int)dto.IdChiTieu,
                    GiaTri = dto.GiaTri,
                    DanhGia = danhGia
                };

                _db.DvktKetQuaChiTiets.Add(ct);
            }
            else
            {
                existed.GiaTri = dto.GiaTri;
                existed.DanhGia = danhGia;
            }

            await _db.SaveChangesAsync();
            await AddLog(cd.Id, "ket_qua_chi_tiet", "Nhập/ cập nhật kết quả chỉ tiêu");

            _db.Entry(kq).State = EntityState.Detached;
            _db.Entry(kq.IdChiDinhDvktNavigation).State = EntityState.Detached;

            return Ok(new
            {
                id = kq.Id,
                idChiDinh = kq.IdChiDinhDvkt,
                ketQuaText = kq.KetQuaText,
                fileUrl = kq.FileUrl,
                trangThai = kq.TrangThai,
                thoiGian = kq.ThoiGianThucHien
            });


        }


        [HttpGet("ketqua/full/{idChiDinh}")]
        public async Task<IActionResult> GetFullKetQua(long idChiDinh)
        {
            var ktvId = GetKtvId();

            var cd = await _db.ChiDinhDvkts
                .Include(x => x.IdLanKhamNavigation)
                .ThenInclude(x => x.IdBenhNhanNavigation)
                .FirstOrDefaultAsync(x => x.Id == idChiDinh);

            if (cd == null)
                return NotFound("Không tìm thấy chỉ định DVKT.");

            if (cd.IdNguoiThucHien != ktvId)
                return Forbid("Bạn không phải người thực hiện DVKT này.");

            var dvkt = await _db.Dvkts.FindAsync(cd.IdDvkt);

            // Lấy kết quả tổng (nếu có)
            var kq = await _db.DvktKetQuas
                .FirstOrDefaultAsync(x => x.IdChiDinhDvkt == idChiDinh);

            long? ketQuaId = kq?.Id;

            // ============================================
            // 1) LẤY DANH SÁCH CHỈ TIÊU
            // ============================================
            var chiTieus = await _db.DvktChiTieus
                .Where(x => x.IdDvkt == cd.IdDvkt)
                .OrderBy(x => x.ThuTu)
                .ToListAsync();

            // ============================================
            // 2) LẤY DANH SÁCH KẾT QUẢ CHỈ TIÊU (NẾU CÓ)
            // ============================================
            var ketQuaChiTiet = await _db.DvktKetQuaChiTiets
                .Where(x => x.IdKetQua == ketQuaId)
                .ToListAsync();

            // ============================================
            // 3) GHÉP (LEFT JOIN BẰNG LINQ C#)
            // ============================================
            var merged = chiTieus
                .Select(ct =>
                {
                    var ctKq = ketQuaChiTiet
                        .FirstOrDefault(x => x.IdChiTieu == ct.Id);

                    return new
                    {
                        ChiTieuId = ct.Id,
                        ct.TenChiTieu,
                        ct.DonVi,
                        ct.GioiHanThap,
                        ct.GioiHanCao,
                        GiaTri = ctKq?.GiaTri,
                        DanhGia = ctKq?.DanhGia
                    };
                })
                .ToList();

            // ============================================
            // 4) TRẢ VỀ
            // ============================================
            return Ok(new
            {
                thongTin = new
                {
                    cd.Id,
                    dvkt.TenDvkt,
                    cd.IdLanKham,
                    BenhNhan = cd.IdLanKhamNavigation.IdBenhNhanNavigation.HoTen,
                    MaBenhNhan = cd.IdLanKhamNavigation.IdBenhNhanNavigation.MaBn,
                    GioiTinh = cd.IdLanKhamNavigation.IdBenhNhanNavigation.GioiTinh,
                    NgaySinh = cd.IdLanKhamNavigation.IdBenhNhanNavigation.NgaySinh
                },
                ketQuaId = kq?.Id,

                ketQuaTong = kq?.KetQuaText,
                fileUrl = kq?.FileUrl,
                trangThai = kq?.TrangThai ?? "draft",

                chiTieus = merged
            });
        }




        [HttpPatch("duyet/{id}")]
        public async Task<IActionResult> DuyetKetQua(long id)
        {
            var ktvId = GetKtvId();

            var kq = await _db.DvktKetQuas
                .FirstOrDefaultAsync(x => x.IdChiDinhDvkt == id);

            if (kq == null)
                return BadRequest("Chưa có dữ liệu kết quả để duyệt.");

            kq.TrangThai = "approved";
            kq.ThoiGianThucHien = DateTime.Now;

            await _db.SaveChangesAsync();
            await AddLog(id, "duyet_ket_qua");

            return Ok(new { message = "Đã duyệt kết quả." });
        }


        [HttpPatch("huy-duyet/{id}")]
        public async Task<IActionResult> HuyDuyet(long id)
        {
            var kq = await _db.DvktKetQuas
                .FirstOrDefaultAsync(x => x.IdChiDinhDvkt == id);

            if (kq == null)
                return NotFound("Không tìm thấy kết quả.");

            kq.TrangThai = "draft";

            await _db.SaveChangesAsync();
            await AddLog(id, "huy_duyet");

            return Ok(new { message = "Đã hủy duyệt." });
        }

        [HttpPatch("send/{id}")]
        public async Task<IActionResult> SendKetQua(long id)
        {
            var kq = await _db.DvktKetQuas
                .FirstOrDefaultAsync(x => x.IdChiDinhDvkt == id);

            if (kq == null)
                return BadRequest("KQ chưa có, không thể gửi.");

            if (kq.TrangThai != "approved")
                return BadRequest("Kết quả chưa duyệt, không thể gửi.");

            // ====== 1) TẠO PDF ======
            var pdfController = new ThucHienDVKTPDFController(_db);
            var pdfFile = await pdfController.Export(id) as FileContentResult;

            if (pdfFile == null)
                return BadRequest("Không thể tạo PDF.");

            // ====== 2) LƯU PDF VÀO WWWROOT ======
            var folder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/pdf-ketqua");
            if (!Directory.Exists(folder))
                Directory.CreateDirectory(folder);

            var fileName = $"KETQUA_DVKT_{id}_{DateTime.Now:yyyyMMddHHmmss}.pdf";
            var filePath = Path.Combine(folder, fileName);

            await System.IO.File.WriteAllBytesAsync(filePath, pdfFile.FileContents);

            var fileUrl = $"/pdf-ketqua/{fileName}";

            // ====== 3) CẬP NHẬT DB ======
            kq.FileUrl = fileUrl;
            kq.TrangThai = "sent";

            var cd = await _db.ChiDinhDvkts.FindAsync(id);
            if (cd != null)
            {
                cd.TrangThai = "sent";
                cd.HoanThanhLuc = DateTime.Now;
            }

            await _db.SaveChangesAsync();
            await AddLog(id, "gui_ket_qua", "Gửi kết quả + PDF");

            return Ok(new
            {
                message = "Đã gửi kết quả + PDF về phòng khám.",
                fileUrl = fileUrl
            });
        }



        // HELPER: KIỂM TRA ĐỦ CHỈ TIÊU CHƯA
        // (Dựa vào bảng DvktChiTieu, bạn nhớ add DbSet trong DbContext)
        private async Task<bool> KiemTraDuChiTieuAsync(long idChiDinh)
        {
            var cd = await _db.ChiDinhDvkts.FindAsync(idChiDinh);
            if (cd == null) return false;

            // Lấy DVKT để biết danh sách chỉ tiêu yêu cầu
            var requiredChiTieus = await _db.DvktChiTieus
                .Where(x => x.IdDvkt == cd.IdDvkt)
                .Select(x => x.Id)
                .ToListAsync();

            // Nếu DVKT không cấu hình chỉ tiêu -> coi như không bắt buộc
            if (!requiredChiTieus.Any()) return true;

            var kq = await _db.DvktKetQuas
                .FirstOrDefaultAsync(x => x.IdChiDinhDvkt == cd.Id);

            if (kq == null) return false;

            var filledChiTieus = await _db.DvktKetQuaChiTiets
                .Where(x => x.IdKetQua == kq.Id)
                .Select(x => x.IdChiTieu)
                .Distinct()
                .ToListAsync();

            // Nếu còn chỉ tiêu bắt buộc mà chưa có kết quả -> false
            var missing = requiredChiTieus.Except(filledChiTieus).Any();
            return !missing;
        }


        // 8) ĐÁNH DẤU HOÀN THÀNH DVKT
        //   - Check đủ chỉ tiêu
        //   - Cập nhật trạng thái DVKT + Kết quả
        [HttpPatch("hoanthanh/{id}")]
        public async Task<IActionResult> HoanThanh(long id)
        {
            var ktvId = GetKtvId();

            var cd = await _db.ChiDinhDvkts.FindAsync(id);
            if (cd == null) return NotFound("Không tìm thấy DVKT.");

            if (cd.IdNguoiThucHien != ktvId)
                return Forbid("Bạn không phải người thực hiện DVKT này.");

            if (cd.TrangThai != TRANG_THAI_PROCESSING && cd.TrangThai != TRANG_THAI_DONE)
                return BadRequest("Chỉ được hoàn thành DVKT khi đang ở trạng thái 'đang thực hiện'.");

            // Kiểm tra đủ chỉ tiêu chưa
            var duChiTieu = await KiemTraDuChiTieuAsync(id);
            if (!duChiTieu)
                return BadRequest("Chưa nhập đầy đủ kết quả các chỉ tiêu bắt buộc.");

            // Không thay đổi trạng thái KẾT QUẢ!!!
            // (Giữ nguyên trạng thái completed/approved của kq)

            cd.TrangThai = TRANG_THAI_DONE;
            cd.HoanThanhLuc = DateTime.Now;

            await _db.SaveChangesAsync();
            await AddLog(id, "hoan_thanh", "Hoàn thành DVKT");

            return Ok(new { message = "Đã hoàn thành DVKT.", id = cd.Id });
        }


        // ===========================
        // 10) XUẤT PDF DVKT (XEM PDF)
        // ===========================
        [HttpGet("pdf/{id}")]
        public async Task<IActionResult> ExportPdf(long id)
        {
            // gọi lại controller PDF cũ
            var pdfCtrl = new ThucHienDVKTPDFController(_db);

            var file = await pdfCtrl.Export(id); // file = FileContentResult

            return file;
        }



        // 9) XEM LỊCH SỬ THAO TÁC TRÊN 1 DVKT
        [HttpGet("logs/{idChiDinh}")]
        public async Task<IActionResult> GetLogs(long idChiDinh)
        {
            var logs = await _db.DvktThucHienLogs
                .Where(x => x.IdChiDinhDvkt == idChiDinh)
                .OrderByDescending(x => x.CreatedAt)
                .ToListAsync();

            return Ok(logs);
        }
    }

    
    // DTOs GỢI Ý (BẠN DÙNG DTO SẴN CÓ THÌ CÓ THỂ BỎ QUA PHẦN NÀY)
    public class CreateKetQuaDVKTDto
    {
        public long IdChiDinhDVKT { get; set; }
        public string? KetQuaText { get; set; }
        public string? FileUrl { get; set; }
    }

    public class CreateKetQuaChiTietDto
    {
        public long IdKetQua { get; set; }
        public long IdChiTieu { get; set; }
        public string? GiaTri { get; set; }
        public string? DanhGia { get; set; }
    }
}

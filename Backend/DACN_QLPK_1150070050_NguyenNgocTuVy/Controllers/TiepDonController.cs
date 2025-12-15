using DACN_QLPK_1150070050_NguyenNgocTuVy.Data;
using DACN_QLPK_1150070050_NguyenNgocTuVy.Dtos;
using DACN_QLPK_1150070050_NguyenNgocTuVy.Models;
using DACN_QLPK_1150070050_NguyenNgocTuVy.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DACN_QLPK_1150070050_NguyenNgocTuVy.Controllers;

[ApiController]          
[Route("api/reception")]
public class TiepDonController : ControllerBase
{
    private readonly DACNDbContext _db;
    private readonly ICodeGenerator _code;

    public TiepDonController(DACNDbContext db, ICodeGenerator code)
    {
        _db = db;
        _code = code;
    }
    [HttpGet("list-today")]
    public async Task<IActionResult> GetTodayReceptions([FromQuery] DateTime? date)
    {
        var targetDate = date?.Date ?? DateTime.Today;

        var list = await _db.HoSoBenhAns
            .Include(h => h.IdBenhNhanNavigation)
            .Where(h => h.NgayTao.HasValue && h.NgayTao.Value.Date == targetDate)
            .OrderByDescending(h => h.NgayTao)
            .Select(h => new
            {
                h.Id,
                h.MaHs,
                h.TrangThai,
                h.NgayTao,
                BenhNhan = new
                {
                    h.IdBenhNhanNavigation.MaBn,
                    h.IdBenhNhanNavigation.HoTen,
                    h.IdBenhNhanNavigation.GioiTinh,
                    h.IdBenhNhanNavigation.NgaySinh,
                    h.IdBenhNhanNavigation.SoDienThoai
                }
            })
            .ToListAsync();

        return Ok(list);
    }

    [HttpPost("create-full")]
    public async Task<IActionResult> CreateFullReception([FromBody] FullReceptionRequest req)
    {
        var today = DateTime.Today;

        // 1) Kiểm tra hồ sơ hôm nay
        var hs = await _db.HoSoBenhAns
            .FirstOrDefaultAsync(h => h.IdBenhNhan == req.IdBenhNhan
                                   && h.NgayTao.Value.Date == today);

        if (hs == null)
        {
            hs = new HoSoBenhAn
            {
                IdBenhNhan = req.IdBenhNhan,
                MaHs = _code.GenMa("HS"),
                NgayTao = DateTime.Now,
                IdNguoiTao = req.IdNguoiTao,
                TrangThai = "MOI"
            };
            _db.HoSoBenhAns.Add(hs);
            await _db.SaveChangesAsync();
        }

        // 2) Tạo LAN KHÁM
        var lk = new LanKham
        {
            IdHoSo = hs.Id,
            IdBenhNhan = req.IdBenhNhan,
            IdPhong = req.IdPhong,
            TrangThai = "CHO_KHAM",
            ThoiGianBatDau = DateTime.Now,
            CreatedAt = DateTime.Now
        };

        _db.LanKhams.Add(lk);
        await _db.SaveChangesAsync();

        // 3) Tạo SINH HIỆU
        var sh = new SinhHieu
        {
            IdLanKham = lk.Id,
            NhietDo = req.NhietDo,
            HuyetApTamThu = req.HuyetApTamThu,
            HuyetApTamTruong = req.HuyetApTamTruong,
            NhipTim = req.NhipTim,
            NhipTho = req.NhipTho,
            CanNang = req.CanNang,
            ChieuCao = req.ChieuCao,
            SpO2 = req.SpO2,
            ThoiGianDo = DateTime.Now
        };
        _db.SinhHieus.Add(sh);
        await _db.SaveChangesAsync();

        // 4) Gán vào LAN KHÁM
        lk.IdSinhHieu = sh.Id;
        await _db.SaveChangesAsync();

        return Ok(new
        {
            message = "Tiếp đón đầy đủ thành công",
            hoSo = hs,
            lanKham = lk,
            sinhHieu = sh
        });
    }


    // ======================= 1️⃣ KIỂM TRA BỆNH NHÂN (autofill + trạng thái hồ sơ hôm nay) =======================
    // FE dùng endpoint này để autofill khi nhập CCCD/SĐT
    [HttpGet("patients/check")]
    public async Task<IActionResult> CheckPatient([FromQuery] PatientLookupRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.SoDienThoai) && string.IsNullOrWhiteSpace(req.CCCD))
            return BadRequest("Cần cung cấp số điện thoại hoặc CCCD.");

        var q = _db.BenhNhans.AsQueryable();

        if (!string.IsNullOrWhiteSpace(req.SoDienThoai))
            q = q.Where(x => x.SoDienThoai == req.SoDienThoai);
        if (!string.IsNullOrWhiteSpace(req.CCCD))
            q = q.Where(x => x.Cccd == req.CCCD);

        var found = await q.Select(x => new
        {
            x.Id,
            x.MaBn,
            x.HoTen,
            x.NgaySinh,
            x.GioiTinh,
            x.Cccd,
            x.SoDienThoai
        }).FirstOrDefaultAsync();

        // bổ sung trạng thái hồ sơ trong ngày (nếu có)
        var today = DateTime.Today;
        object? todayRecord = null;

        if (found != null)
        {
            var rec = await _db.HoSoBenhAns
                .Where(h => h.IdBenhNhan == found.Id && h.NgayTao.HasValue && h.NgayTao.Value.Date == today)
                .OrderByDescending(h => h.NgayTao)
                .Select(h => new
                {
                    h.Id,
                    h.MaHs,
                    TrangThai = h.TrangThai // "MOI" | "CHUA_CHI_DINH" | "CHI_DINH" | "DA_KHAM" | "DONG"
                })
                .FirstOrDefaultAsync();

            if (rec != null)
            {
                todayRecord = new
                {
                    exists = true,
                    rec.Id,
                    rec.MaHs,
                    rec.TrangThai
                };
            }
        }

        return Ok(new
        {
            exists = found != null,
            patient = found,
            todayRecord
        });
    }

    // ======================= 2️⃣ TẠO / XỬ LÝ BỆNH NHÂN + PHÂN NHÁNH TRẠNG THÁI HỒ SƠ TRONG NGÀY =======================
    [HttpPost("patients")]
    public async Task<IActionResult> CreatePatient([FromBody] PatientCreateRequest req)
    {
        // ✅ Kiểm tra đầu vào
        if (string.IsNullOrWhiteSpace(req.Ho_ten))
            return BadRequest("Thiếu họ tên bệnh nhân.");

        if (string.IsNullOrWhiteSpace(req.CCCD) && string.IsNullOrWhiteSpace(req.So_dien_thoai))
            return BadRequest("Cần nhập ít nhất CCCD hoặc số điện thoại.");

        // ✅ Kiểm tra bệnh nhân trùng CCCD hoặc SĐT
        var existing = await _db.BenhNhans
            .FirstOrDefaultAsync(x => x.Cccd == req.CCCD || x.SoDienThoai == req.So_dien_thoai);

        var today = DateTime.Today;

        if (existing != null)
        {
            // Tìm hồ sơ hôm nay (nếu có)
            var existingRecord = await _db.HoSoBenhAns
                .Where(h => h.IdBenhNhan == existing.Id && h.NgayTao.HasValue && h.NgayTao.Value.Date == today)
                .OrderByDescending(h => h.NgayTao)
                .FirstOrDefaultAsync();

            if (existingRecord != null)
            {
                var status = existingRecord.TrangThai ?? "MOI";

                // 🔀 PHÂN NHÁNH RÕ RÀNG ĐỂ FE XỬ LÝ
                switch (status)
                {
                    case "MOI":
                    case "CHUA_CHI_DINH":
                        return Ok(new
                        {
                            state = "NEED_ORDER",
                            message = "Bệnh nhân đã được tiếp đón hôm nay nhưng chưa chỉ định dịch vụ.",
                            benhNhan = new
                            {
                                IdBenhNhan = existing.Id,
                                MaBn = existing.MaBn,
                                existing.HoTen,
                                existing.GioiTinh,
                                existing.NgaySinh,
                                CCCD = existing.Cccd,
                                SoDienThoai = existing.SoDienThoai,
                                existing.Email,
                                existing.NgheNghiep,
                                existing.DiaChiDuong,
                                existing.DiaChiXa,
                                existing.DiaChiHuyen,
                                existing.DiaChiTinh,
                                existing.QuocGia
                            },
                            hoSo = new
                            {
                                IdHoSo = existingRecord.Id,
                                MaHs = existingRecord.MaHs,
                                TrangThai = status
                            }
                        });

                    // ⭐⭐⭐ CASE BỊ THIẾU – đã bổ sung
                    case "CHO_CHI_DINH":
                        return Ok(new
                        {
                            state = "NEED_ORDER",
                            message = "Hồ sơ đang chờ chỉ định dịch vụ.",
                            benhNhan = new
                            {
                                IdBenhNhan = existing.Id,
                                MaBn = existing.MaBn,
                                existing.HoTen,
                                existing.GioiTinh,
                                existing.NgaySinh,
                                CCCD = existing.Cccd,
                                SoDienThoai = existing.SoDienThoai
                            },
                            hoSo = new
                            {
                                IdHoSo = existingRecord.Id,
                                MaHs = existingRecord.MaHs,
                                TrangThai = status
                            }
                        });

                    case "CHI_DINH":
                        return Ok(new
                        {
                            state = "ORDERED_WAITING_DOCTOR",
                            message = "Bệnh nhân đã được chỉ định, đang chờ bác sĩ khám.",
                            benhNhan = new { IdBenhNhan = existing.Id, MaBn = existing.MaBn },
                            hoSo = new { IdHoSo = existingRecord.Id, MaHs = existingRecord.MaHs, TrangThai = status }
                        });

                    case "DA_KHAM":
                    case "DONG":
                        return Ok(new
                        {
                            state = "EXAM_DONE_OR_CLOSED",
                            message = "Bệnh nhân đã khám xong/đã đóng hồ sơ.",
                            benhNhan = new { IdBenhNhan = existing.Id, MaBn = existing.MaBn },
                            hoSo = new { IdHoSo = existingRecord.Id, MaHs = existingRecord.MaHs, TrangThai = status }
                        });

                    default:
                        return Ok(new
                        {
                            state = "UNKNOWN_STATE",
                            message = "Hồ sơ hôm nay có trạng thái không xác định.",
                            benhNhan = new { IdBenhNhan = existing.Id, MaBn = existing.MaBn },
                            hoSo = new { IdHoSo = existingRecord.Id, MaHs = existingRecord.MaHs, TrangThai = status }
                        });
                }
            }

            // ⚙️ BN cũ nhưng CHƯA có hồ sơ hôm nay → FE tạo hồ sơ mới
            return Ok(new
            {
                state = "NEED_CREATE_RECORD",
                message = "Bệnh nhân đã tồn tại, chưa có hồ sơ hôm nay.",
                IdBenhNhan = existing.Id,
                MaBn = existing.MaBn
            });
        }

        // ✅ Tạo mới bệnh nhân
        var entity = new Models.BenhNhan
        {
            MaBn = _code.GenMa("BN"),
            HoTen = req.Ho_ten,
            NgaySinh = req.Ngay_sinh.HasValue ? DateOnly.FromDateTime(req.Ngay_sinh.Value) : null,
            GioiTinh = req.Gioi_tinh,
            Cccd = req.CCCD,
            SoDienThoai = req.So_dien_thoai,
            Email = req.Email,
            QuocTich = req.Quoc_tich,
            DanToc = req.Dan_toc,
            NgheNghiep = req.Nghe_nghiep,
            DiaChiDuong = req.Dia_chi_duong,
            DiaChiXa = req.Dia_chi_xa,
            DiaChiHuyen = req.Dia_chi_huyen,
            DiaChiTinh = req.Dia_chi_tinh,
            QuocGia = req.Quoc_gia,
            CreatedAt = DateTime.Now,
            UpdatedAt = DateTime.Now
        };

        _db.BenhNhans.Add(entity);
        await _db.SaveChangesAsync();

        return Ok(new
        {
            state = "NEW_PATIENT_CREATED",
            message = "Tạo mới bệnh nhân thành công.",
            IdBenhNhan = entity.Id,
            MaBn = entity.MaBn
        });
    }


    // ======================= 3️⃣ TẠO HOẶC LẤY HỒ SƠ TRONG NGÀY =======================
    [HttpPost("records")]
    public async Task<IActionResult> CreateRecord([FromBody] RecordCreateDto dto)
    {
        if (dto == null || dto.IdBenhNhan == 0)
            return BadRequest(new { message = "Dữ liệu không hợp lệ" });

        var hs = new HoSoBenhAn
        {
            IdBenhNhan = dto.IdBenhNhan,
            MaHs = _code.GenMa("HS"),
            NgayTao = DateTime.Now,
            IdNguoiTao = dto.IdNguoiTao,
            TrangThai = "CHO_CHI_DINH"
        };

        await _db.HoSoBenhAns.AddAsync(hs);
        await _db.SaveChangesAsync();

        var lk = new LanKham
        {
            IdHoSo = hs.Id,
            IdBenhNhan = dto.IdBenhNhan,
            TrangThai = "CHO_KHAM",
            ThoiGianBatDau = DateTime.Now,
            CreatedAt = DateTime.Now
        };

        await _db.LanKhams.AddAsync(lk);
        await _db.SaveChangesAsync();

        if (dto.SinhHieu != null)
        {
            var sh = new SinhHieu
            {
                IdLanKham = lk.Id,
                NhietDo = dto.SinhHieu.NhietDo,
                HuyetApTamThu = dto.SinhHieu.HuyetApTamThu,
                HuyetApTamTruong = dto.SinhHieu.HuyetApTamTruong,
                NhipTim = dto.SinhHieu.NhipTim,
                NhipTho = dto.SinhHieu.NhipTho,
                SpO2 = dto.SinhHieu.SpO2,
                CanNang = dto.SinhHieu.CanNang,
                ChieuCao = dto.SinhHieu.ChieuCao,
                Bmi = dto.SinhHieu.Bmi,
                ThoiGianDo = DateTime.Now
            };

            _db.SinhHieus.Add(sh);
            await _db.SaveChangesAsync();

            lk.IdSinhHieu = sh.Id;
            await _db.SaveChangesAsync();
        }

        return Ok(new
        {
    idHoSo = hs.Id,       // ⭐ ĐÚNG TÊN FE CẦN
            maHs = hs.MaHs,
            idLanKham = lk.Id
        });
    }


    [HttpPatch("cancel/{id}")]
    public async Task<IActionResult> CancelReception(long id)
    {
        var record = await _db.HoSoBenhAns.FindAsync(id);
        if (record == null)
            return NotFound("Không tìm thấy hồ sơ.");

        if (record.TrangThai == "DA_KHAM" || record.TrangThai == "DONG")
            return BadRequest("Không thể hủy hồ sơ đã khám hoặc đã đóng.");

        record.TrangThai = "HUY";
        record.UpdatedAt = DateTime.Now;

        await _db.SaveChangesAsync();

        return Ok(new { message = "Đã hủy tiếp đón thành công.", record.Id, record.MaHs });
    }

    [HttpGet("cancelled")]
    public async Task<IActionResult> GetCancelledReceptions()
    {
        var list = await _db.HoSoBenhAns
            .Include(h => h.IdBenhNhanNavigation)
            .Where(h => h.TrangThai == "HUY")
            .OrderByDescending(h => h.UpdatedAt ?? h.NgayTao)
            .Select(h => new
            {
                h.Id,
                h.MaHs,
                h.TrangThai,
                h.NgayTao,
                h.UpdatedAt,
                BenhNhan = new
                {
                    h.IdBenhNhanNavigation.MaBn,
                    h.IdBenhNhanNavigation.HoTen,
                    h.IdBenhNhanNavigation.GioiTinh,
                    h.IdBenhNhanNavigation.NgaySinh,
                    h.IdBenhNhanNavigation.SoDienThoai
                }
            })
            .ToListAsync();

        return Ok(list);
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetReceptionStats()
    {
        var today = DateTime.Today;

        var totalToday = await _db.HoSoBenhAns
            .CountAsync(h => h.NgayTao.HasValue && h.NgayTao.Value.Date == today);

        var cancelled = await _db.HoSoBenhAns
            .CountAsync(h => h.TrangThai == "HUY" && h.NgayTao.HasValue && h.NgayTao.Value.Date == today);

        var newPatients = await _db.BenhNhans
            .CountAsync(b => b.CreatedAt.HasValue && b.CreatedAt.Value.Date == today);

        var reExam = await _db.HoSoBenhAns
            .CountAsync(h => h.TrangThai == "DA_KHAM" && h.NgayTao.HasValue && h.NgayTao.Value.Date == today);

        return Ok(new
        {
            totalToday,
            cancelled,
            newPatients,
            reExam
        });
    }

}

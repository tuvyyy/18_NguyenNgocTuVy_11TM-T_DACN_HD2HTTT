using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DACN_QLPK_1150070050_NguyenNgocTuVy.Data;
using DACN_QLPK_1150070050_NguyenNgocTuVy.Dtos;
using DACN_QLPK_1150070050_NguyenNgocTuVy.Models;
using DACN_QLPK_1150070050_NguyenNgocTuVy.Services;

namespace DACN_QLPK_1150070050_NguyenNgocTuVy.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DonThuocController : ControllerBase
    {
        private readonly DACNDbContext _db;
        private readonly DonThuocValidatorService _validator;

        public DonThuocController(DACNDbContext db, DonThuocValidatorService validator)
        {
            _db = db;
            _validator = validator;
        }

        // ==========================================================
        // 1) API CHECK ĐƠN THUỐC (dùng trước khi nhấn "Lưu")
        // ==========================================================
        [HttpPost("check")]
        public async Task<IActionResult> CheckDon([FromBody] DonThuocCreateDto dto)
        {
            var (warnings, errors) = await _validator.ValidateFull(dto);

            return Ok(new
            {
                isSafe = errors.Count == 0,
                warnings,
                errors
            });
        }
        // ==========================================================
        // 2) TẠO ĐƠN THUỐC — FULL SAFE + TRANSACTION
        // ==========================================================
        [HttpPost]
        public async Task<IActionResult> CreateDon([FromBody] DonThuocCreateDto dto)
        {
            // 1. Validate an toàn đơn thuốc
            var (warnings, errors) = await _validator.ValidateFull(dto);
            if (errors.Any())
                return BadRequest(new { message = "Đơn thuốc KHÔNG AN TOÀN", errors });

            // 2. Lấy thông tin LẦN KHÁM để đảm bảo FK đúng
            var lanKham = await _db.LanKhams
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == dto.IdLanKham);

            if (lanKham == null)
                return BadRequest(new { message = $"Lần khám {dto.IdLanKham} không tồn tại!" });

            // Lấy id bệnh nhân & bác sĩ từ lần khám (đảm bảo khớp FK)
            var idBenhNhan = lanKham.IdBenhNhan;
            var idBacSi = lanKham.IdBacSi ?? dto.IdBacSi;

            // Double-check bệnh nhân có tồn tại trong bảng benh_nhan
            var benhNhanExists = await _db.BenhNhans
                .AsNoTracking()
                .AnyAsync(b => b.Id == idBenhNhan);

            if (!benhNhanExists)
                return BadRequest(new { message = $"Bệnh nhân {idBenhNhan} không tồn tại!" });

            using var tx = await _db.Database.BeginTransactionAsync();

            try
            {
                // 3. Tạo đơn thuốc (DÙ FE GỬI idBenhNhan GÌ THÌ CŨNG BỎ QUA,
                //    CHỈ DÙNG id lấy từ LanKham)
                var don = new DonThuoc
                {
                    IdLanKham = lanKham.Id,
                    IdBenhNhan = idBenhNhan,
                    IdBacSi = idBacSi,
                    NgayKe = DateTime.Now,
                    SoNgayUong = dto.SoNgayUong,
                    GhiChu = dto.GhiChu
                };

                _db.DonThuocs.Add(don);
                await _db.SaveChangesAsync();

                decimal tongTien = 0;
                var dsThuoc = await _db.Thuocs.ToListAsync();

                foreach (var ct in dto.ChiTiet)
                {
                    var t = dsThuoc.First(x => x.Id == ct.IdThuoc);
                    t.SoLuongTon -= ct.SoLuong ?? 0;

                    tongTien += (t.DonGia ?? 0m) * (ct.SoLuong ?? 0);

                    _db.ChiTietDonThuocs.Add(new ChiTietDonThuoc
                    {
                        IdDonThuoc = don.Id,
                        IdThuoc = ct.IdThuoc,
                        SoLuong = ct.SoLuong,
                        DonVi = ct.DonVi,
                        DungTich = ct.DungTich,
                        Sang = ct.Sang,
                        Trua = ct.Trua,
                        Chieu = ct.Chieu,
                        Toi = ct.Toi,
                        Khuya = ct.Khuya,
                        SoNgayUong = ct.SoNgayUong,
                        GhiChu = ct.GhiChu
                    });
                }

                don.TongTien = tongTien;
                await _db.SaveChangesAsync();

                await tx.CommitAsync();

                return Ok(new
                {
                    message = "Tạo đơn thuốc thành công!",
                    id = don.Id,
                    warnings
                });
            }
            catch
            {
                await tx.RollbackAsync();
                throw;
            }
        }


        // ==========================================================
        // 3) CẬP NHẬT ĐƠN THUỐC — RESTORE TỒN KHO — REVALIDATE
        // ==========================================================
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDon(long id, [FromBody] DonThuocCreateDto dto)
        {
            var don = await _db.DonThuocs.FirstOrDefaultAsync(x => x.Id == id);
            if (don == null) return NotFound();

            var oldCt = await _db.ChiTietDonThuocs.Where(x => x.IdDonThuoc == id).ToListAsync();

            using var tx = await _db.Database.BeginTransactionAsync();

            try
            {
                var dsThuoc = await _db.Thuocs.ToListAsync();

                foreach (var c in oldCt)
                {
                    var t = dsThuoc.First(x => x.Id == c.IdThuoc);
                    t.SoLuongTon += c.SoLuong ?? 0;
                }

                _db.ChiTietDonThuocs.RemoveRange(oldCt);
                await _db.SaveChangesAsync();

                var (warnings, errors) = await _validator.ValidateFull(dto);
                if (errors.Any())
                {
                    await tx.RollbackAsync();
                    return BadRequest(new { message = "Đơn KHÔNG AN TOÀN", errors });
                }

                decimal tongTien = 0;

                foreach (var ct in dto.ChiTiet)
                {
                    var t = dsThuoc.First(x => x.Id == ct.IdThuoc);
                    t.SoLuongTon -= ct.SoLuong ?? 0;

                    tongTien += (t.DonGia ?? 0m) * (ct.SoLuong ?? 0);

                    _db.ChiTietDonThuocs.Add(new ChiTietDonThuoc
                    {
                        IdDonThuoc = don.Id,
                        IdThuoc = ct.IdThuoc,
                        SoLuong = ct.SoLuong,
                        DonVi = ct.DonVi,
                        DungTich = ct.DungTich,
                        Sang = ct.Sang,
                        Trua = ct.Trua,
                        Chieu = ct.Chieu,
                        Toi = ct.Toi,
                        Khuya = ct.Khuya,
                        SoNgayUong = ct.SoNgayUong,
                        GhiChu = ct.GhiChu
                    });
                }

                don.TongTien = tongTien;
                don.GhiChu = dto.GhiChu;
                don.SoNgayUong = dto.SoNgayUong;

                await _db.SaveChangesAsync();
                await tx.CommitAsync();

                return Ok(new { message = "Cập nhật đơn thành công!", warnings });
            }
            catch
            {
                await tx.RollbackAsync();
                throw;
            }
        }

        // ==========================================================
        // 4) XÓA ĐƠN — PHỤC HỒI TỒN KHO
        // ==========================================================
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(long id)
        {
            var don = await _db.DonThuocs.FirstOrDefaultAsync(x => x.Id == id);
            if (don == null) return NotFound();

            using var tx = await _db.Database.BeginTransactionAsync();

            try
            {
                var ct = await _db.ChiTietDonThuocs.Where(x => x.IdDonThuoc == id).ToListAsync();
                var dsThuoc = await _db.Thuocs.ToListAsync();

                foreach (var c in ct)
                {
                    var t = dsThuoc.First(x => x.Id == c.IdThuoc);
                    t.SoLuongTon += c.SoLuong ?? 0;
                }

                _db.ChiTietDonThuocs.RemoveRange(ct);
                _db.DonThuocs.Remove(don);

                await _db.SaveChangesAsync();
                await tx.CommitAsync();

                return Ok(new { message = "Xóa đơn thuốc thành công!" });
            }
            catch
            {
                await tx.RollbackAsync();
                throw;
            }
        }

        // ==========================================================
        // 5) GỢI Ý THUỐC THAY THẾ AN TOÀN
        // ==========================================================
        [HttpGet("goi-y/{idThuoc}")]
        public async Task<IActionResult> GoiYThuoc(long idThuoc)
        {
            var interact = await _db.TuongTacThuocs
                .Where(x => x.IdThuoc1 == idThuoc || x.IdThuoc2 == idThuoc)
                .Select(x => x.IdThuoc1 == idThuoc ? x.IdThuoc2 : x.IdThuoc1)
                .ToListAsync();

            var unsafeIds = new HashSet<long>(interact);

            var safeMedicines = await _db.Thuocs
                .Where(t => t.HoatDong == true && !unsafeIds.Contains(t.Id))
                .Select(t => new { t.Id, t.Ten })
                .ToListAsync();

            return Ok(safeMedicines);
        }

        // 6) LẤY ĐƠN THEO LẦN KHÁM
        [HttpGet("lan-kham/{idLanKham}")]
        public async Task<IActionResult> GetByLanKham(long idLanKham)
        {
            try
            {
                // ⭐ LẤY ĐƠN MỚI NHẤT THEO LẦN KHÁM
                var don = await _db.DonThuocs
                    .AsNoTracking()
                    .Where(x => x.IdLanKham == idLanKham)
                    .OrderByDescending(x => x.Id)   // ⭐ VERY IMPORTANT
                    .FirstOrDefaultAsync();

                if (don == null)
                    return Ok(null);

                // Lấy chi tiết
                var chiTiet = await _db.ChiTietDonThuocs
                    .Where(c => c.IdDonThuoc == don.Id)
                    .Include(c => c.IdThuocNavigation)
                    .AsNoTracking()
                    .ToListAsync();

                var result = new
                {
                    don.Id,
                    don.NgayKe,
                    don.SoNgayUong,
                    don.GhiChu,
                    ChiTiet = chiTiet.Select(x => new
                    {
                        x.Id,
                        x.IdThuoc,
                        TenThuoc = x.IdThuocNavigation?.Ten ?? "(Thuốc không tồn tại)",
                        x.SoLuong,
                        x.DonVi,
                        x.DungTich,
                        x.Sang,
                        x.Trua,
                        x.Chieu,
                        x.Toi,
                        x.Khuya,
                        x.SoNgayUong,
                        x.GhiChu
                    })
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Lỗi GetByLanKham",
                    detail = ex.Message,
                    stack = ex.StackTrace
                });
            }
        }



        [HttpDelete("chi-tiet/{id}")]
        public async Task<IActionResult> DeleteChiTiet(long id)
        {
            var ct = await _db.ChiTietDonThuocs.FirstOrDefaultAsync(x => x.Id == id);
            if (ct == null) return NotFound();

            var thuoc = await _db.Thuocs.FirstAsync(t => t.Id == ct.IdThuoc);
            thuoc.SoLuongTon += ct.SoLuong ?? 0;

            _db.ChiTietDonThuocs.Remove(ct);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Xóa thuốc thành công!" });
        }

        [HttpPut("chi-tiet/{id}")]
        public async Task<IActionResult> UpdateChiTiet(long id, [FromBody] ChiTietUpdateDto dto)
        {
            var ct = await _db.ChiTietDonThuocs.FirstOrDefaultAsync(x => x.Id == id);
            if (ct == null) return NotFound();

            // Phục hồi tồn kho cũ
            var thuoc = await _db.Thuocs.FirstAsync(t => t.Id == ct.IdThuoc);
            thuoc.SoLuongTon += ct.SoLuong ?? 0;

            // Cập nhật lại
            ct.SoLuong = dto.SoLuong;
            ct.Sang = dto.Sang;
            ct.Trua = dto.Trua;
            ct.Chieu = dto.Chieu;
            ct.Toi = dto.Toi;
            ct.Khuya = dto.Khuya;
            ct.SoNgayUong = dto.SoNgayUong;
            ct.GhiChu = dto.GhiChu;

            // Trừ tồn kho mới
            thuoc.SoLuongTon -= dto.SoLuong;

            await _db.SaveChangesAsync();

            return Ok(new { message = "Cập nhật thuốc thành công!" });
        }

    }
}

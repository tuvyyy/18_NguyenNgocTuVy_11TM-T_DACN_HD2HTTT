using DACN_QLPK_1150070050_NguyenNgocTuVy.Data;
using Microsoft.EntityFrameworkCore;

namespace DACN_QLPK_1150070050_NguyenNgocTuVy.Services
{
    /// <summary>
    /// 🧾 Service tra cứu đơn giá hiện hành của dịch vụ (theo phòng & ngày áp dụng).
    /// Dành cho phần tiếp đón, chỉ định, thu ngân.
    /// </summary>
    public class PricingService
    {
        private readonly DACNDbContext _db;

        public PricingService(DACNDbContext db)
        {
            _db = db;
        }

        /// <summary>
        /// ✅ Lấy giá hiện hành của dịch vụ theo phòng (ưu tiên bản ghi còn hiệu lực mới nhất).
        /// </summary>
        /// <param name="idDichVu">ID dịch vụ</param>
        /// <param name="idPhong">ID phòng (có thể null)</param>
        /// <returns>Đơn giá hiện hành, hoặc null nếu không tìm thấy</returns>
        public async Task<decimal?> GetCurrentPriceAsync(long idDichVu, long? idPhong)
        {
            var today = DateOnly.FromDateTime(DateTime.Now);

            // 1️⃣ Ưu tiên lấy giá theo phòng
            if (idPhong != null)
            {
                var giaPhong = await _db.DichVuGia
                    .Where(g => g.IdDichVu == idDichVu
                                && g.IdPhong == idPhong
                                && g.HoatDong == true
                                && (g.NgayApDung == default || g.NgayApDung <= today)
                                && (g.NgayHetHan == null || g.NgayHetHan >= today))
                    .OrderByDescending(g => g.NgayApDung)
                    .Select(g => g.DonGia)
                    .FirstOrDefaultAsync();

                if (giaPhong > 0)
                    return giaPhong;
            }

            // 2️⃣ Nếu không có giá theo phòng → lấy giá chung của dịch vụ
            var giaChung = await _db.DichVuGia
                .Where(g => g.IdDichVu == idDichVu
                            && g.IdPhong == null
                            && g.HoatDong == true
                            && (g.NgayApDung == default || g.NgayApDung <= today)
                            && (g.NgayHetHan == null || g.NgayHetHan >= today))
                .OrderByDescending(g => g.NgayApDung)
                .Select(g => g.DonGia)
                .FirstOrDefaultAsync();

            return giaChung > 0 ? giaChung : null;
        }

        /// <summary>
        /// ✅ Lấy toàn bộ bảng giá hiện hành của dịch vụ (hiển thị trong giao diện quản lý giá).
        /// </summary>
        public async Task<List<PricingItem>> GetAllActivePricesAsync(long idDichVu)
        {
            var today = DateOnly.FromDateTime(DateTime.Now);

            var list = await _db.DichVuGia
                .Where(g => g.IdDichVu == idDichVu
                            && g.HoatDong == true
                            && (g.NgayApDung == default || g.NgayApDung <= today)
                            && (g.NgayHetHan == null || g.NgayHetHan >= today))
                .OrderByDescending(g => g.NgayApDung)
                .Select(g => new PricingItem
                {
                    Id = g.Id,
                    IdPhong = g.IdPhong,
                    DonGia = g.DonGia,
                    NgayApDung = g.NgayApDung,
                    NgayHetHan = g.NgayHetHan,
                    DoiTuongApDung = g.DoiTuongApDung,
                    GhiChu = g.GhiChu
                })
                .ToListAsync();

            return list;
        }
    }

    /// <summary>
    /// DTO phụ để trả ra thông tin bảng giá hiện hành
    /// </summary>
    public class PricingItem
    {
        public long Id { get; set; }
        public long? IdPhong { get; set; }
        public decimal DonGia { get; set; }
        public DateOnly NgayApDung { get; set; }
        public DateOnly? NgayHetHan { get; set; }
        public string? DoiTuongApDung { get; set; }
        public string? GhiChu { get; set; }
    }
}

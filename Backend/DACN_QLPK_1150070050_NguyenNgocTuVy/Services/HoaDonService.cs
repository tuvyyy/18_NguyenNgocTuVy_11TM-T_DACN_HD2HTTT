using DACN_QLPK_1150070050_NguyenNgocTuVy.Data;
using DACN_QLPK_1150070050_NguyenNgocTuVy.Services;
using Microsoft.EntityFrameworkCore;

public class HoaDonService : IHoaDonService
{
    private readonly DACNDbContext _db;

    public HoaDonService(DACNDbContext db)
    {
        _db = db;
    }

    public bool UpdateDaThanhToan(string maHd)
    {
        var hoaDon = _db.HoaDons.FirstOrDefault(h => h.MaHd == maHd);

        if (hoaDon == null) return false;

        hoaDon.TrangThai = "DA_THANH_TOAN";
        hoaDon.NgayThanhToan = DateTime.Now;

        _db.SaveChanges();
        return true;
    }
}

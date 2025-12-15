namespace DACN_QLPK_1150070050_NguyenNgocTuVy.Dtos;

public class ClinicWithPriceDto
{
    public int IdPhong { get; set; }
    public string TenPhong { get; set; } = default!;
    public long IdDichVu { get; set; }
    public string TenDichVu { get; set; } = default!;
    public decimal DonGia { get; set; }
}

// Chỉ định nhiều phòng khám + auto tính tiền khám
public class ChiDinhKhamRequest
{
    public long IdBenhNhan { get; set; }
    public long IdHoSo { get; set; }
    public long IdThuNgan { get; set; }           // người thu ngân tạo hóa đơn
    public long? IdBacSi { get; set; }            // optional
    public List<int> IdPhongChon { get; set; } = new();  // chọn 1..n phòng
    public string? GhiChu { get; set; }
}

// Kết quả trả về để in phiếu khám
public class ChiDinhKhamResponse
{
    public long IdHoaDon { get; set; }
    public string MaHoaDon { get; set; } = default!;
    public decimal TongTien { get; set; }
    public List<ChiTietPhongKhamItem> ChiTiet { get; set; } = new();
}

public class ChiTietPhongKhamItem
{
    public int IdPhong { get; set; }
    public string TenPhong { get; set; } = default!;
    public string TenDichVu { get; set; } = default!;
    public decimal DonGia { get; set; }
    public long IdLanKham { get; set; }
}

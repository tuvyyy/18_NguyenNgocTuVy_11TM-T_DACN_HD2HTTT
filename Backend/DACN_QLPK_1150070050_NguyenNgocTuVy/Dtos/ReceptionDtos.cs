namespace DACN_QLPK_1150070050_NguyenNgocTuVy.Dtos;

// 1.1 Kiểm tra / nhập bệnh nhân
public class PatientLookupRequest
{
    public string? SoDienThoai { get; set; }
    public string? CCCD { get; set; }
}
public class FullReceptionRequest
{
    public long IdBenhNhan { get; set; }
    public long IdNguoiTao { get; set; }
    public int IdPhong { get; set; }

    public double? NhietDo { get; set; }
    public int? HuyetApTamThu { get; set; }
    public int? HuyetApTamTruong { get; set; }
    public int? NhipTim { get; set; }
    public int? NhipTho { get; set; }
    public double? CanNang { get; set; }
    public double? ChieuCao { get; set; }
    public int? SpO2 { get; set; }
}

public class PatientCreateRequest
{
    public string Ho_ten { get; set; } = default!;
    public DateTime? Ngay_sinh { get; set; }
    public string? Gioi_tinh { get; set; }
    public string? CCCD { get; set; }
    public string? So_dien_thoai { get; set; }
    public string? Email { get; set; }
    public string? Quoc_tich { get; set; }
    public string? Dan_toc { get; set; }
    public string? Nghe_nghiep { get; set; }
    public string? Dia_chi_duong { get; set; }
    public string? Dia_chi_xa { get; set; }
    public string? Dia_chi_huyen { get; set; }
    public string? Dia_chi_tinh { get; set; }
    public string? Quoc_gia { get; set; }
}

public class ReceptionCreateRecordRequest
{
    public long IdBenhNhan { get; set; }
    public long IdNguoiTao { get; set; } // id_nguoi_dung thực hiện tiếp đón
    public SinhHieuDtos? SinhHieu { get; set; }

}

public class AppointmentCreateRequest
{
    public string? GhiChu { get; set; }
    public long IdBenhNhan { get; set; }
    public long? IdBacSi { get; set; }
    public int? IdPhong { get; set; }
    public DateOnly Ngay { get; set; }
    public TimeOnly GioBatDau { get; set; }
    public TimeOnly? GioKetThuc { get; set; }
    public long IdNguoiTao { get; set; }
}

// Dành cho walk-in (đến khám trực tiếp)
public class DirectVisitCreateRequest
{
    public long IdBenhNhan { get; set; }
    public long? IdHoSo { get; set; }      // nếu null sẽ tự lấy hồ sơ mới nhất của bệnh nhân
    public int IdPhong { get; set; }
    public long IdTiepDon { get; set; }    // id_nguoi_dung tiếp đón
    public string? LyDo { get; set; }
}
public class RecordCreateDto
{
    public long IdBenhNhan { get; set; }
    public long IdNguoiTao { get; set; }

    public SinhHieuDto? SinhHieu { get; set; }
}

public class SinhHieuDto
{
    public double? NhietDo { get; set; }
    public int? HuyetApTamThu { get; set; }
    public int? HuyetApTamTruong { get; set; }
    public int? NhipTim { get; set; }
    public int? NhipTho { get; set; }
    public int? SpO2 { get; set; }
    public double? CanNang { get; set; }
    public double? ChieuCao { get; set; }
    public double? Bmi { get; set; }
}

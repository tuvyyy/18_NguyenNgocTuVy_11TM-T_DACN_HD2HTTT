using System;
using System.Collections.Generic;

namespace DACN_QLPK_1150070050_NguyenNgocTuVy.Models;

public partial class LanKham
{
    public long Id { get; set; }

    public long? IdHoSo { get; set; }

    public long? IdBenhNhan { get; set; }

    public long? IdBacSi { get; set; }

    public long? IdDatLich { get; set; }

    public long? IdTiepDon { get; set; }

    public int? IdPhong { get; set; }

    public DateTime? ThoiGianBatDau { get; set; }

    public DateTime? ThoiGianKetThuc { get; set; }

    public string? LyDo { get; set; }

    public string? ChanDoanSoBo { get; set; }

    public string? ChanDoanCuoi { get; set; }

    public string? KetQuaKham { get; set; }

    public string? HuongXuTri { get; set; }

    public string? GhiChu { get; set; }

    public string? TrangThai { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public long? IdBenh { get; set; }

    public long? IdSinhHieu { get; set; }

    public virtual ICollection<ChiDinhDvkt> ChiDinhDvkts { get; set; } = new List<ChiDinhDvkt>();

    public virtual ICollection<DonThuoc> DonThuocs { get; set; } = new List<DonThuoc>();

    public virtual ICollection<HoaDon> HoaDons { get; set; } = new List<HoaDon>();

    public virtual NguoiDung? IdBacSiNavigation { get; set; }

    public virtual Benh? IdBenhNavigation { get; set; }

    public virtual BenhNhan? IdBenhNhanNavigation { get; set; }

    public virtual DatLich? IdDatLichNavigation { get; set; }

    public virtual HoSoBenhAn? IdHoSoNavigation { get; set; }

    public virtual PhongKham? IdPhongNavigation { get; set; }

    public virtual SinhHieu? IdSinhHieuNavigation { get; set; }

    public virtual NguoiDung? IdTiepDonNavigation { get; set; }

    public virtual ICollection<LanKhamDichVu> LanKhamDichVus { get; set; } = new List<LanKhamDichVu>();

    public virtual ICollection<SinhHieu> SinhHieus { get; set; } = new List<SinhHieu>();
}

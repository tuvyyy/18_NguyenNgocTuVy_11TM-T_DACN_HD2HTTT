using System;
using System.Collections.Generic;

namespace DACN_QLPK_1150070050_NguyenNgocTuVy.Models;

public partial class HoaDon
{
    public long Id { get; set; }

    public string MaHd { get; set; } = null!;

    public long? IdBenhNhan { get; set; }

    public long? IdLanKham { get; set; }

    public long? IdThuNgan { get; set; }

    public string? LoaiHoaDon { get; set; }

    public string? HinhThucTt { get; set; }

    public string? MaGiaoDichVnpay { get; set; }

    public decimal? TongTienTruoc { get; set; }

    public decimal? GiamGia { get; set; }

    public decimal? ThueVat { get; set; }

    public decimal? TongTien { get; set; }

    public string? TrangThai { get; set; }

    public DateTime? NgayTao { get; set; }

    public DateTime? NgayThanhToan { get; set; }

    public string? GhiChu { get; set; }

    public virtual ICollection<ChiTietHoaDon> ChiTietHoaDons { get; set; } = new List<ChiTietHoaDon>();

    public virtual BenhNhan? IdBenhNhanNavigation { get; set; }

    public virtual LanKham? IdLanKhamNavigation { get; set; }

    public virtual NguoiDung? IdThuNganNavigation { get; set; }
}

using System;
using System.Collections.Generic;

namespace DACN_QLPK_1150070050_NguyenNgocTuVy.Models;

public partial class ChiTietHoaDon
{
    public long Id { get; set; }

    public long? IdHoaDon { get; set; }

    public string? LoaiThamChieu { get; set; }

    public long? IdThamChieu { get; set; }

    public string? MoTa { get; set; }

    public int? SoLuong { get; set; }

    public decimal? DonGia { get; set; }

    public decimal? ThanhTien { get; set; }

    public decimal? ThueVat { get; set; }

    public virtual HoaDon? IdHoaDonNavigation { get; set; }
}

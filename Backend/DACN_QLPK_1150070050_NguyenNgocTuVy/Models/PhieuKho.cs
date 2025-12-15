using System;
using System.Collections.Generic;

namespace DACN_QLPK_1150070050_NguyenNgocTuVy.Models;

public partial class PhieuKho
{
    public long Id { get; set; }

    public string MaPhieu { get; set; } = null!;

    public long? IdThuoc { get; set; }

    public string? Loai { get; set; }

    public string? SoLo { get; set; }

    public DateOnly? HanSuDung { get; set; }

    public int? SoLuong { get; set; }

    public decimal? DonGia { get; set; }

    public long? NguoiLap { get; set; }

    public long? NguoiDuyet { get; set; }

    public DateTime? ThoiGian { get; set; }

    public string? GhiChu { get; set; }

    public virtual Thuoc? IdThuocNavigation { get; set; }

    public virtual NguoiDung? NguoiDuyetNavigation { get; set; }

    public virtual NguoiDung? NguoiLapNavigation { get; set; }
}

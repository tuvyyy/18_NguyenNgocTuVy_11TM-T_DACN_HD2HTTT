using System;
using System.Collections.Generic;

namespace DACN_QLPK_1150070050_NguyenNgocTuVy.Models;

public partial class DvktChiTieu
{
    public int Id { get; set; }

    public int IdDvkt { get; set; }

    public string TenChiTieu { get; set; } = null!;

    public string? DonVi { get; set; }

    public string? GiaTriThamChieu { get; set; }

    public int? ThuTu { get; set; }

    public bool? HoatDong { get; set; }

    public double? GioiHanThap { get; set; }

    public double? GioiHanCao { get; set; }

    public virtual ICollection<DvktKetQuaChiTiet> DvktKetQuaChiTiets { get; set; } = new List<DvktKetQuaChiTiet>();

    public virtual Dvkt IdDvktNavigation { get; set; } = null!;
}

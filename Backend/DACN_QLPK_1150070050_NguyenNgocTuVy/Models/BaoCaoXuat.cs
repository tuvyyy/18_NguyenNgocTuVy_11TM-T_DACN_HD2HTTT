using System;
using System.Collections.Generic;

namespace DACN_QLPK_1150070050_NguyenNgocTuVy.Models;

public partial class BaoCaoXuat
{
    public long Id { get; set; }

    public long? IdBaoCao { get; set; }

    public long? IdNguoiDung { get; set; }

    public string? DinhDang { get; set; }

    public DateTime? ThoiGianBatDau { get; set; }

    public DateTime? ThoiGianKetThuc { get; set; }

    public string? DuongDanFile { get; set; }

    public virtual BaoCao? IdBaoCaoNavigation { get; set; }

    public virtual NguoiDung? IdNguoiDungNavigation { get; set; }
}

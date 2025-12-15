using System;
using System.Collections.Generic;

namespace DACN_QLPK_1150070050_NguyenNgocTuVy.Models;

public partial class SinhHieu
{
    public long Id { get; set; }

    public long IdLanKham { get; set; }

    public double? NhietDo { get; set; }

    public int? HuyetApTamThu { get; set; }

    public int? HuyetApTamTruong { get; set; }

    public int? NhipTim { get; set; }

    public int? NhipTho { get; set; }

    public int? SpO2 { get; set; }

    public double? CanNang { get; set; }

    public double? ChieuCao { get; set; }

    public DateTime ThoiGianDo { get; set; }

    public double? Bmi { get; set; }

    public virtual LanKham IdLanKhamNavigation { get; set; } = null!;

    public virtual ICollection<LanKham> LanKhams { get; set; } = new List<LanKham>();
}

using System;
using System.Collections.Generic;

namespace DACN_QLPK_1150070050_NguyenNgocTuVy.Models;

public partial class MaXacThuc
{
    public long Id { get; set; }

    public long IdNguoiDung { get; set; }

    public string MaOtp { get; set; } = null!;

    public string? Loai { get; set; }

    public DateTime ThoiGianTao { get; set; }

    public DateTime ThoiGianHetHan { get; set; }

    public bool DaSuDung { get; set; }
}

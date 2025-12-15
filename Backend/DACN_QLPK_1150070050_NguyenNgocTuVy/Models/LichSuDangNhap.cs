using System;
using System.Collections.Generic;

namespace DACN_QLPK_1150070050_NguyenNgocTuVy.Models;

public partial class LichSuDangNhap
{
    public long Id { get; set; }

    public long? IdNguoiDung { get; set; }

    public DateTime? ThoiGian { get; set; }

    public string? Ip { get; set; }

    public string? ThietBi { get; set; }

    public string? KetQua { get; set; }

    public virtual NguoiDung? IdNguoiDungNavigation { get; set; }
}

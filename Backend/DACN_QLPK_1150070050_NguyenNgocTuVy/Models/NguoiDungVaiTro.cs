using System;
using System.Collections.Generic;

namespace DACN_QLPK_1150070050_NguyenNgocTuVy.Models;

public partial class NguoiDungVaiTro
{
    public int Id { get; set; }

    public long? IdNguoiDung { get; set; }

    public int? IdVaiTro { get; set; }

    public virtual NguoiDung? IdNguoiDungNavigation { get; set; }

    public virtual VaiTro? IdVaiTroNavigation { get; set; }
}

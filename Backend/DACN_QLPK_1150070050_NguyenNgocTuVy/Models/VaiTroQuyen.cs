using System;
using System.Collections.Generic;

namespace DACN_QLPK_1150070050_NguyenNgocTuVy.Models;

public partial class VaiTroQuyen
{
    public int Id { get; set; }

    public int? IdVaiTro { get; set; }

    public int? IdQuyen { get; set; }

    public bool? Xem { get; set; }

    public bool? Them { get; set; }

    public bool? Sua { get; set; }

    public bool? Xoa { get; set; }

    public bool? Xuat { get; set; }

    public virtual Quyen? IdQuyenNavigation { get; set; }

    public virtual VaiTro? IdVaiTroNavigation { get; set; }
}

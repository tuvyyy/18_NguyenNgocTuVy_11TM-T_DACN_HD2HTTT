using System;
using System.Collections.Generic;

namespace DACN_QLPK_1150070050_NguyenNgocTuVy.Models;

public partial class Quyen
{
    public int Id { get; set; }

    public int? IdChucNang { get; set; }

    public string? MaQuyen { get; set; }

    public bool? Xem { get; set; }

    public bool? Them { get; set; }

    public bool? Sua { get; set; }

    public bool? Xoa { get; set; }

    public bool? Xuat { get; set; }

    public virtual ChucNang? IdChucNangNavigation { get; set; }

    public virtual ICollection<VaiTroQuyen> VaiTroQuyens { get; set; } = new List<VaiTroQuyen>();
}

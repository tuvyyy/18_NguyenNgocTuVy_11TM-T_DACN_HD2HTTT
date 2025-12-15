using System;
using System.Collections.Generic;

namespace DACN_QLPK_1150070050_NguyenNgocTuVy.Models;

public partial class NhomDvkt
{
    public int Id { get; set; }

    public string TenNhom { get; set; } = null!;

    public string? MoTa { get; set; }

    public bool HoatDong { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<Dvkt> Dvkts { get; set; } = new List<Dvkt>();
}

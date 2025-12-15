using System;
using System.Collections.Generic;

namespace DACN_QLPK_1150070050_NguyenNgocTuVy.Models;

public partial class ChucNang
{
    public int Id { get; set; }

    public string MaChucNang { get; set; } = null!;

    public string Ten { get; set; } = null!;

    public string? MoTa { get; set; }

    public virtual ICollection<Quyen> Quyens { get; set; } = new List<Quyen>();
}

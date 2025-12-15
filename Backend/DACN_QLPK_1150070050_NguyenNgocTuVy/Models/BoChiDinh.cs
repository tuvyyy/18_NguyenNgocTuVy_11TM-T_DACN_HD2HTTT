using System;
using System.Collections.Generic;

namespace DACN_QLPK_1150070050_NguyenNgocTuVy.Models;

public partial class BoChiDinh
{
    public long Id { get; set; }

    public string MaBo { get; set; } = null!;

    public string Ten { get; set; } = null!;

    public string? MoTa { get; set; }

    public virtual ICollection<BoChiDinhCt> BoChiDinhCts { get; set; } = new List<BoChiDinhCt>();

    public virtual ICollection<DatLich> DatLiches { get; set; } = new List<DatLich>();
}

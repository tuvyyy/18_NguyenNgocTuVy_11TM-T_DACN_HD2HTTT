using System;
using System.Collections.Generic;

namespace DACN_QLPK_1150070050_NguyenNgocTuVy.Models;

public partial class DvktGium
{
    public int Id { get; set; }

    public int IdDvkt { get; set; }

    public decimal DonGia { get; set; }

    public DateOnly TuNgay { get; set; }

    public DateOnly? DenNgay { get; set; }

    public string? GhiChu { get; set; }

    public virtual Dvkt IdDvktNavigation { get; set; } = null!;
}

using System;
using System.Collections.Generic;

namespace DACN_QLPK_1150070050_NguyenNgocTuVy.Models;

public partial class DvktKetQuaChiTiet
{
    public long Id { get; set; }

    public long IdKetQua { get; set; }

    public int IdChiTieu { get; set; }

    public string? GiaTri { get; set; }

    public string? DanhGia { get; set; }

    public virtual DvktChiTieu IdChiTieuNavigation { get; set; } = null!;

    public virtual DvktKetQua IdKetQuaNavigation { get; set; } = null!;
}

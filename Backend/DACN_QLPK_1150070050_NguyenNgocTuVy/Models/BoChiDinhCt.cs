using System;
using System.Collections.Generic;

namespace DACN_QLPK_1150070050_NguyenNgocTuVy.Models;

public partial class BoChiDinhCt
{
    public long Id { get; set; }

    public long? IdBo { get; set; }

    public long? IdDichVu { get; set; }

    public int? SoLuong { get; set; }

    public string? GhiChu { get; set; }

    public virtual BoChiDinh? IdBoNavigation { get; set; }

    public virtual DichVu? IdDichVuNavigation { get; set; }
}

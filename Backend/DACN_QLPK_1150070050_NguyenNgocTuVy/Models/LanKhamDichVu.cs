using System;
using System.Collections.Generic;

namespace DACN_QLPK_1150070050_NguyenNgocTuVy.Models;

public partial class LanKhamDichVu
{
    public long Id { get; set; }

    public long? IdLanKham { get; set; }

    public long? IdDichVu { get; set; }

    public int? SoLuong { get; set; }

    public decimal? DonGia { get; set; }

    public string? TrangThaiThucHien { get; set; }

    public string? GhiChu { get; set; }

    public virtual DichVu? IdDichVuNavigation { get; set; }

    public virtual LanKham? IdLanKhamNavigation { get; set; }
}

using System;
using System.Collections.Generic;

namespace DACN_QLPK_1150070050_NguyenNgocTuVy.Models;

public partial class DichVu
{
    public long Id { get; set; }

    public int? IdNhom { get; set; }

    public int? IdPhong { get; set; }

    public string Ma { get; set; } = null!;

    public string? Ten { get; set; }

    public string? DonViTinh { get; set; }

    public string? MoTa { get; set; }

    public bool? HoatDong { get; set; }

    public virtual ICollection<BoChiDinhCt> BoChiDinhCts { get; set; } = new List<BoChiDinhCt>();

    public virtual ICollection<DichVuGium> DichVuGia { get; set; } = new List<DichVuGium>();

    public virtual NhomDichVu? IdNhomNavigation { get; set; }

    public virtual PhongKham? IdPhongNavigation { get; set; }

    public virtual ICollection<LanKhamDichVu> LanKhamDichVus { get; set; } = new List<LanKhamDichVu>();
}

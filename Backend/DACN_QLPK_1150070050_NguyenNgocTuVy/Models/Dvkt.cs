using System;
using System.Collections.Generic;

namespace DACN_QLPK_1150070050_NguyenNgocTuVy.Models;

public partial class Dvkt
{
    public int Id { get; set; }

    public string MaDvkt { get; set; } = null!;

    public string TenDvkt { get; set; } = null!;

    public string? MoTa { get; set; }

    public int IdNhom { get; set; }

    public string? DonVi { get; set; }

    public int? ThoiGianDuKien { get; set; }

    public bool HoatDong { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<ChiDinhDvkt> ChiDinhDvkts { get; set; } = new List<ChiDinhDvkt>();

    public virtual ICollection<DvktChiTieu> DvktChiTieus { get; set; } = new List<DvktChiTieu>();

    public virtual ICollection<DvktGium> DvktGia { get; set; } = new List<DvktGium>();

    public virtual ICollection<DvktPhong> DvktPhongs { get; set; } = new List<DvktPhong>();

    public virtual NhomDvkt IdNhomNavigation { get; set; } = null!;
}

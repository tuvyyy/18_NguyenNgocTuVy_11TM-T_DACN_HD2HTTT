using System;
using System.Collections.Generic;

namespace DACN_QLPK_1150070050_NguyenNgocTuVy.Models;

public partial class BaoCao
{
    public long Id { get; set; }

    public string MaBc { get; set; } = null!;

    public string Loai { get; set; } = null!;

    public string? ThamSo { get; set; }

    public DateOnly? NgayBatDau { get; set; }

    public DateOnly? NgayKetThuc { get; set; }

    public string? DinhDang { get; set; }

    public DateTime? NgayTao { get; set; }

    public long? IdNguoiDung { get; set; }

    public string? DuLieu { get; set; }

    public virtual ICollection<BaoCaoXuat> BaoCaoXuats { get; set; } = new List<BaoCaoXuat>();

    public virtual NguoiDung? IdNguoiDungNavigation { get; set; }
}

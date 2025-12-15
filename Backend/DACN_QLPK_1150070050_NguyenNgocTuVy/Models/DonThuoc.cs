using System;
using System.Collections.Generic;

namespace DACN_QLPK_1150070050_NguyenNgocTuVy.Models;

public partial class DonThuoc
{
    public long Id { get; set; }

    public long? IdLanKham { get; set; }

    public long? IdBenhNhan { get; set; }

    public long? IdBacSi { get; set; }

    public long? IdThuNgan { get; set; }

    public DateTime? NgayKe { get; set; }

    public int? SoNgayUong { get; set; }

    public decimal? TongTien { get; set; }

    public string? GhiChu { get; set; }

    public virtual ICollection<ChiTietDonThuoc> ChiTietDonThuocs { get; set; } = new List<ChiTietDonThuoc>();

    public virtual NguoiDung? IdBacSiNavigation { get; set; }

    public virtual BenhNhan? IdBenhNhanNavigation { get; set; }

    public virtual LanKham? IdLanKhamNavigation { get; set; }

    public virtual NguoiDung? IdThuNganNavigation { get; set; }
}

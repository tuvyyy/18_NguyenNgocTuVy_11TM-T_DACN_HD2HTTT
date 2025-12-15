using System;
using System.Collections.Generic;

namespace DACN_QLPK_1150070050_NguyenNgocTuVy.Models;

public partial class ChiTietDonThuoc
{
    public long Id { get; set; }

    public long? IdDonThuoc { get; set; }

    public long? IdThuoc { get; set; }

    public int? SoLuong { get; set; }

    public string? DonVi { get; set; }

    public string? DungTich { get; set; }

    public int? Sang { get; set; }

    public int? Trua { get; set; }

    public int? Chieu { get; set; }

    public int? Toi { get; set; }

    public int? Khuya { get; set; }

    public int? SoNgayUong { get; set; }

    public string? GhiChu { get; set; }

    public virtual DonThuoc? IdDonThuocNavigation { get; set; }

    public virtual Thuoc? IdThuocNavigation { get; set; }
}

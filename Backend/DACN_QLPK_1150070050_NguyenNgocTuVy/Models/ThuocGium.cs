using System;
using System.Collections.Generic;

namespace DACN_QLPK_1150070050_NguyenNgocTuVy.Models;

public partial class ThuocGium
{
    public long Id { get; set; }

    public long IdThuoc { get; set; }

    public decimal DonGia { get; set; }

    public DateOnly NgayApDung { get; set; }

    public DateOnly? NgayHetHan { get; set; }

    public string? DoiTuongApDung { get; set; }

    public string? GhiChu { get; set; }

    public bool? HoatDong { get; set; }

    public virtual Thuoc IdThuocNavigation { get; set; } = null!;
}

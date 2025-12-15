using System;
using System.Collections.Generic;

namespace DACN_QLPK_1150070050_NguyenNgocTuVy.Models;

public partial class ThuocLieuChuan
{
    public long Id { get; set; }

    public long IdThuoc { get; set; }

    public int LieuToiDaNgay { get; set; }

    public string? GhiChu { get; set; }

    public virtual Thuoc IdThuocNavigation { get; set; } = null!;
}

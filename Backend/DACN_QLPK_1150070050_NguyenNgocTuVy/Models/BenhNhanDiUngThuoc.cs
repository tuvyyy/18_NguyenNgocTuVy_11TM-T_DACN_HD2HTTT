using System;
using System.Collections.Generic;

namespace DACN_QLPK_1150070050_NguyenNgocTuVy.Models;

public partial class BenhNhanDiUngThuoc
{
    public long Id { get; set; }

    public long IdBenhNhan { get; set; }

    public long IdThuoc { get; set; }

    public string? GhiChu { get; set; }

    public virtual BenhNhan IdBenhNhanNavigation { get; set; } = null!;

    public virtual Thuoc IdThuocNavigation { get; set; } = null!;
}

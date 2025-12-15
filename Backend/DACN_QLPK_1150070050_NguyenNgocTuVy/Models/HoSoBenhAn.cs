using System;
using System.Collections.Generic;

namespace DACN_QLPK_1150070050_NguyenNgocTuVy.Models;

public partial class HoSoBenhAn
{
    public long Id { get; set; }

    public long? IdBenhNhan { get; set; }

    public string MaHs { get; set; } = null!;

    public DateTime? NgayTao { get; set; }

    public long? IdNguoiTao { get; set; }

    public string? ChanDoan { get; set; }

    public string? GhiChu { get; set; }

    public string? TrangThai { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual BenhNhan? IdBenhNhanNavigation { get; set; }

    public virtual NguoiDung? IdNguoiTaoNavigation { get; set; }

    public virtual ICollection<LanKham> LanKhams { get; set; } = new List<LanKham>();
}

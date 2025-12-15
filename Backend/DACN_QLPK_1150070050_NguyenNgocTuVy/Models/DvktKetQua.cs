using System;
using System.Collections.Generic;

namespace DACN_QLPK_1150070050_NguyenNgocTuVy.Models;

public partial class DvktKetQua
{
    public long Id { get; set; }

    public long IdChiDinhDvkt { get; set; }

    public string? KetQuaText { get; set; }

    public string? FileUrl { get; set; }

    public string? NguoiThucHien { get; set; }

    public DateTime? ThoiGianThucHien { get; set; }

    public string TrangThai { get; set; } = null!;

    public virtual ICollection<DvktKetQuaChiTiet> DvktKetQuaChiTiets { get; set; } = new List<DvktKetQuaChiTiet>();

    public virtual ChiDinhDvkt IdChiDinhDvktNavigation { get; set; } = null!;
}

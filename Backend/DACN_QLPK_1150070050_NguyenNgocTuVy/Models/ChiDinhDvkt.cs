using System;
using System.Collections.Generic;

namespace DACN_QLPK_1150070050_NguyenNgocTuVy.Models;

public partial class ChiDinhDvkt
{
    public long Id { get; set; }

    public long IdLanKham { get; set; }

    public int IdDvkt { get; set; }

    public int SoLuong { get; set; }

    public string? GhiChu { get; set; }

    public string TrangThai { get; set; } = null!;

    public DateTime? CreatedAt { get; set; }

    public long? IdNguoiThucHien { get; set; }

    public DateTime? NhanLuc { get; set; }

    public DateTime? HoanThanhLuc { get; set; }

    public virtual ICollection<DvktKetQua> DvktKetQuas { get; set; } = new List<DvktKetQua>();

    public virtual ICollection<DvktThucHienLog> DvktThucHienLogs { get; set; } = new List<DvktThucHienLog>();

    public virtual Dvkt IdDvktNavigation { get; set; } = null!;

    public virtual LanKham IdLanKhamNavigation { get; set; } = null!;
}

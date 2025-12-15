using System;
using System.Collections.Generic;

namespace DACN_QLPK_1150070050_NguyenNgocTuVy.Models;

public partial class DatLich
{
    public long Id { get; set; }

    public string MaDatLich { get; set; } = null!;

    public long? IdBenhNhan { get; set; }

    public long? IdBacSi { get; set; }

    public long? IdBoChiDinh { get; set; }

    public DateOnly Ngay { get; set; }

    public TimeOnly GioBatDau { get; set; }

    public TimeOnly? GioKetThuc { get; set; }

    public int? IdPhong { get; set; }

    public string? TrangThai { get; set; }

    public long? IdNguoiTao { get; set; }

    public long? IdNguoiCapNhat { get; set; }

    public DateTime? ThoiGianNhac { get; set; }

    public bool? DaGuiNhac { get; set; }

    public string? GhiChu { get; set; }

    public bool? Active { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual NguoiDung? IdBacSiNavigation { get; set; }

    public virtual BenhNhan? IdBenhNhanNavigation { get; set; }

    public virtual BoChiDinh? IdBoChiDinhNavigation { get; set; }

    public virtual NguoiDung? IdNguoiCapNhatNavigation { get; set; }

    public virtual NguoiDung? IdNguoiTaoNavigation { get; set; }

    public virtual ICollection<LanKham> LanKhams { get; set; } = new List<LanKham>();
}

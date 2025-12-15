using System;
using System.Collections.Generic;

namespace DACN_QLPK_1150070050_NguyenNgocTuVy.Models;

public partial class BenhNhan
{
    public long Id { get; set; }

    public string MaBn { get; set; } = null!;

    public string? HoTen { get; set; }

    public DateOnly? NgaySinh { get; set; }

    public string? GioiTinh { get; set; }

    public string? Cccd { get; set; }

    public string? QuocTich { get; set; }

    public string? DanToc { get; set; }

    public string? SoDienThoai { get; set; }

    public string? Email { get; set; }

    public string? NgheNghiep { get; set; }

    public string? DiaChiDuong { get; set; }

    public string? DiaChiXa { get; set; }

    public string? DiaChiHuyen { get; set; }

    public string? DiaChiTinh { get; set; }

    public string? QuocGia { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<BenhNhanDiUngThuoc> BenhNhanDiUngThuocs { get; set; } = new List<BenhNhanDiUngThuoc>();

    public virtual ICollection<DatLich> DatLiches { get; set; } = new List<DatLich>();

    public virtual ICollection<DonThuoc> DonThuocs { get; set; } = new List<DonThuoc>();

    public virtual ICollection<HoSoBenhAn> HoSoBenhAns { get; set; } = new List<HoSoBenhAn>();

    public virtual ICollection<HoaDon> HoaDons { get; set; } = new List<HoaDon>();

    public virtual ICollection<LanKham> LanKhams { get; set; } = new List<LanKham>();
}

using System;
using System.Collections.Generic;

namespace DACN_QLPK_1150070050_NguyenNgocTuVy.Models;

public partial class PhongKham
{
    public int Id { get; set; }

    public string MaPhong { get; set; } = null!;

    public string? TenPhong { get; set; }

    public string? KhoaPhong { get; set; }

    public string? MoTa { get; set; }

    public bool? HoatDong { get; set; }

    public virtual ICollection<BacSiPhong> BacSiPhongs { get; set; } = new List<BacSiPhong>();

    public virtual ICollection<DichVuGium> DichVuGia { get; set; } = new List<DichVuGium>();

    public virtual ICollection<DichVu> DichVus { get; set; } = new List<DichVu>();

    public virtual ICollection<LanKham> LanKhams { get; set; } = new List<LanKham>();
}

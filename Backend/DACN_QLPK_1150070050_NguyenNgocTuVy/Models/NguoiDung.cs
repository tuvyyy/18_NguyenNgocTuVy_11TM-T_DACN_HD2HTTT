using System;
using System.Collections.Generic;

namespace DACN_QLPK_1150070050_NguyenNgocTuVy.Models;

public partial class NguoiDung
{
    public long Id { get; set; }

    public string TenDangNhap { get; set; } = null!;

    public string MatKhau { get; set; } = null!;

    public string? Salt { get; set; }

    public string? MaNv { get; set; }

    public string HoTen { get; set; } = null!;

    public string? ChucDanh { get; set; }

    public string? KhoaPhong { get; set; }

    public string? Cccd { get; set; }

    public string? SoDienThoai { get; set; }

    public string? Email { get; set; }

    public bool? HoatDong { get; set; }

    public DateTime? LanDangNhapCuoi { get; set; }

    public int? SoLanSai { get; set; }

    public int? SoLanKhoa { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<BacSiPhong> BacSiPhongs { get; set; } = new List<BacSiPhong>();

    public virtual ICollection<BaoCaoXuat> BaoCaoXuats { get; set; } = new List<BaoCaoXuat>();

    public virtual ICollection<BaoCao> BaoCaos { get; set; } = new List<BaoCao>();

    public virtual ICollection<DatLich> DatLichIdBacSiNavigations { get; set; } = new List<DatLich>();

    public virtual ICollection<DatLich> DatLichIdNguoiCapNhatNavigations { get; set; } = new List<DatLich>();

    public virtual ICollection<DatLich> DatLichIdNguoiTaoNavigations { get; set; } = new List<DatLich>();

    public virtual ICollection<DonThuoc> DonThuocIdBacSiNavigations { get; set; } = new List<DonThuoc>();

    public virtual ICollection<DonThuoc> DonThuocIdThuNganNavigations { get; set; } = new List<DonThuoc>();

    public virtual ICollection<HoSoBenhAn> HoSoBenhAns { get; set; } = new List<HoSoBenhAn>();

    public virtual ICollection<HoaDon> HoaDons { get; set; } = new List<HoaDon>();

    public virtual ICollection<LanKham> LanKhamIdBacSiNavigations { get; set; } = new List<LanKham>();

    public virtual ICollection<LanKham> LanKhamIdTiepDonNavigations { get; set; } = new List<LanKham>();

    public virtual ICollection<LichSuDangNhap> LichSuDangNhaps { get; set; } = new List<LichSuDangNhap>();

    public virtual ICollection<NguoiDungVaiTro> NguoiDungVaiTros { get; set; } = new List<NguoiDungVaiTro>();

    public virtual ICollection<PhieuKho> PhieuKhoNguoiDuyetNavigations { get; set; } = new List<PhieuKho>();

    public virtual ICollection<PhieuKho> PhieuKhoNguoiLapNavigations { get; set; } = new List<PhieuKho>();
}

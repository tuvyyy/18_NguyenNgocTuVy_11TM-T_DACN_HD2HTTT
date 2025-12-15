using System;
using System.Collections.Generic;

namespace DACN_QLPK_1150070050_NguyenNgocTuVy.Models;

public partial class Thuoc
{
    public long Id { get; set; }

    public string Ma { get; set; } = null!;

    public string Ten { get; set; } = null!;

    public string? HamLuong { get; set; }

    public string? DonVi { get; set; }

    public string? HangSx { get; set; }

    public DateOnly? HanSuDung { get; set; }

    public int? SoLuongTon { get; set; }

    public decimal? DonGia { get; set; }

    public string? MoTa { get; set; }

    public bool? HoatDong { get; set; }

    public int? IdNhom { get; set; }

    public virtual ICollection<BenhNhanDiUngThuoc> BenhNhanDiUngThuocs { get; set; } = new List<BenhNhanDiUngThuoc>();

    public virtual ICollection<ChiTietDonThuoc> ChiTietDonThuocs { get; set; } = new List<ChiTietDonThuoc>();

    public virtual ICollection<ChongChiDinhBenhThuoc> ChongChiDinhBenhThuocs { get; set; } = new List<ChongChiDinhBenhThuoc>();

    public virtual NhomThuoc? IdNhomNavigation { get; set; }

    public virtual ICollection<PhieuKho> PhieuKhos { get; set; } = new List<PhieuKho>();

    public virtual ICollection<ThuocGium> ThuocGia { get; set; } = new List<ThuocGium>();

    public virtual ICollection<ThuocLieuChuan> ThuocLieuChuans { get; set; } = new List<ThuocLieuChuan>();

    public virtual ICollection<TuongTacThuoc> TuongTacThuocIdThuoc1Navigations { get; set; } = new List<TuongTacThuoc>();

    public virtual ICollection<TuongTacThuoc> TuongTacThuocIdThuoc2Navigations { get; set; } = new List<TuongTacThuoc>();
}

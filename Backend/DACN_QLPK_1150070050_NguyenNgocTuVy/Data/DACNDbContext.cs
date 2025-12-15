using System;
using System.Collections.Generic;
using DACN_QLPK_1150070050_NguyenNgocTuVy.Models;
using Microsoft.EntityFrameworkCore;

namespace DACN_QLPK_1150070050_NguyenNgocTuVy.Data;

public partial class DACNDbContext : DbContext
{
    public DACNDbContext()
    {
    }

    public DACNDbContext(DbContextOptions<DACNDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<BacSiPhong> BacSiPhongs { get; set; }

    public virtual DbSet<BaoCao> BaoCaos { get; set; }

    public virtual DbSet<BaoCaoXuat> BaoCaoXuats { get; set; }

    public virtual DbSet<Benh> Benhs { get; set; }

    public virtual DbSet<BenhNhan> BenhNhans { get; set; }

    public virtual DbSet<BenhNhanDiUngThuoc> BenhNhanDiUngThuocs { get; set; }

    public virtual DbSet<BoChiDinh> BoChiDinhs { get; set; }

    public virtual DbSet<BoChiDinhCt> BoChiDinhCts { get; set; }

    public virtual DbSet<ChiDinhDvkt> ChiDinhDvkts { get; set; }

    public virtual DbSet<ChiTietDonThuoc> ChiTietDonThuocs { get; set; }

    public virtual DbSet<ChiTietHoaDon> ChiTietHoaDons { get; set; }

    public virtual DbSet<ChongChiDinhBenhThuoc> ChongChiDinhBenhThuocs { get; set; }

    public virtual DbSet<ChucNang> ChucNangs { get; set; }

    public virtual DbSet<DatLich> DatLiches { get; set; }

    public virtual DbSet<DichVu> DichVus { get; set; }

    public virtual DbSet<DichVuGium> DichVuGia { get; set; }

    public virtual DbSet<DonThuoc> DonThuocs { get; set; }

    public virtual DbSet<Dvkt> Dvkts { get; set; }

    public virtual DbSet<DvktChiTieu> DvktChiTieus { get; set; }

    public virtual DbSet<DvktGium> DvktGia { get; set; }

    public virtual DbSet<DvktKetQua> DvktKetQuas { get; set; }

    public virtual DbSet<DvktKetQuaChiTiet> DvktKetQuaChiTiets { get; set; }

    public virtual DbSet<DvktPhong> DvktPhongs { get; set; }

    public virtual DbSet<DvktThucHienLog> DvktThucHienLogs { get; set; }

    public virtual DbSet<HoSoBenhAn> HoSoBenhAns { get; set; }

    public virtual DbSet<HoaDon> HoaDons { get; set; }

    public virtual DbSet<LanKham> LanKhams { get; set; }

    public virtual DbSet<LanKhamDichVu> LanKhamDichVus { get; set; }

    public virtual DbSet<LichSuDangNhap> LichSuDangNhaps { get; set; }

    public virtual DbSet<MaXacThuc> MaXacThucs { get; set; }

    public virtual DbSet<NguoiDung> NguoiDungs { get; set; }

    public virtual DbSet<NguoiDungVaiTro> NguoiDungVaiTros { get; set; }

    public virtual DbSet<NhomDichVu> NhomDichVus { get; set; }

    public virtual DbSet<NhomDvkt> NhomDvkts { get; set; }

    public virtual DbSet<NhomThuoc> NhomThuocs { get; set; }

    public virtual DbSet<PhieuKho> PhieuKhos { get; set; }

    public virtual DbSet<PhongKham> PhongKhams { get; set; }

    public virtual DbSet<PhongThucHien> PhongThucHiens { get; set; }

    public virtual DbSet<Quyen> Quyens { get; set; }

    public virtual DbSet<SinhHieu> SinhHieus { get; set; }

    public virtual DbSet<Thuoc> Thuocs { get; set; }

    public virtual DbSet<ThuocGium> ThuocGia { get; set; }

    public virtual DbSet<ThuocLieuChuan> ThuocLieuChuans { get; set; }

    public virtual DbSet<TuongTacThuoc> TuongTacThuocs { get; set; }

    public virtual DbSet<VaiTro> VaiTros { get; set; }

    public virtual DbSet<VaiTroQuyen> VaiTroQuyens { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=.;Database=DACN;Trusted_Connection=True;TrustServerCertificate=True");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.UseCollation("Vietnamese_CI_AS");

        modelBuilder.Entity<BacSiPhong>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__bac_si_p__3213E83F691E7C1C");

            entity.ToTable("bac_si_phong");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.IdBacSi).HasColumnName("id_bac_si");
            entity.Property(e => e.IdPhong).HasColumnName("id_phong");

            entity.HasOne(d => d.IdBacSiNavigation).WithMany(p => p.BacSiPhongs)
                .HasForeignKey(d => d.IdBacSi)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_bac_si_phong_bacsi");

            entity.HasOne(d => d.IdPhongNavigation).WithMany(p => p.BacSiPhongs)
                .HasForeignKey(d => d.IdPhong)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_bac_si_phong_phong");
        });

        modelBuilder.Entity<BaoCao>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__bao_cao__3213E83F4389C486");

            entity.ToTable("bao_cao");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.DinhDang)
                .HasMaxLength(20)
                .IsUnicode(false)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("dinh_dang");
            entity.Property(e => e.DuLieu)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("du_lieu");
            entity.Property(e => e.IdNguoiDung).HasColumnName("id_nguoi_dung");
            entity.Property(e => e.Loai)
                .HasMaxLength(100)
                .IsUnicode(false)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("loai");
            entity.Property(e => e.MaBc)
                .HasMaxLength(20)
                .IsUnicode(false)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("ma_bc");
            entity.Property(e => e.NgayBatDau).HasColumnName("ngay_bat_dau");
            entity.Property(e => e.NgayKetThuc).HasColumnName("ngay_ket_thuc");
            entity.Property(e => e.NgayTao)
                .HasColumnType("datetime")
                .HasColumnName("ngay_tao");
            entity.Property(e => e.ThamSo)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("tham_so");

            entity.HasOne(d => d.IdNguoiDungNavigation).WithMany(p => p.BaoCaos)
                .HasForeignKey(d => d.IdNguoiDung)
                .HasConstraintName("FK__bao_cao__id_nguo__7CD98669");
        });

        modelBuilder.Entity<BaoCaoXuat>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__bao_cao___3213E83FE32C9A72");

            entity.ToTable("bao_cao_xuat");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.DinhDang)
                .HasMaxLength(20)
                .IsUnicode(false)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("dinh_dang");
            entity.Property(e => e.DuongDanFile)
                .HasMaxLength(255)
                .IsUnicode(false)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("duong_dan_file");
            entity.Property(e => e.IdBaoCao).HasColumnName("id_bao_cao");
            entity.Property(e => e.IdNguoiDung).HasColumnName("id_nguoi_dung");
            entity.Property(e => e.ThoiGianBatDau)
                .HasColumnType("datetime")
                .HasColumnName("thoi_gian_bat_dau");
            entity.Property(e => e.ThoiGianKetThuc)
                .HasColumnType("datetime")
                .HasColumnName("thoi_gian_ket_thuc");

            entity.HasOne(d => d.IdBaoCaoNavigation).WithMany(p => p.BaoCaoXuats)
                .HasForeignKey(d => d.IdBaoCao)
                .HasConstraintName("FK__bao_cao_x__id_ba__7FB5F314");

            entity.HasOne(d => d.IdNguoiDungNavigation).WithMany(p => p.BaoCaoXuats)
                .HasForeignKey(d => d.IdNguoiDung)
                .HasConstraintName("FK__bao_cao_x__id_ng__00AA174D");
        });

        modelBuilder.Entity<Benh>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__benh__3213E83F3AC69C88");

            entity.ToTable("benh");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Ma)
                .HasMaxLength(20)
                .HasColumnName("ma");
            entity.Property(e => e.MoTa)
                .HasMaxLength(255)
                .HasColumnName("mo_ta");
            entity.Property(e => e.Ten)
                .HasMaxLength(255)
                .HasColumnName("ten");
        });

        modelBuilder.Entity<BenhNhan>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__benh_nha__3213E83F459AF847");

            entity.ToTable("benh_nhan");

            entity.HasIndex(e => e.Cccd, "UQ_BenhNhan_CCCD").IsUnique();

            entity.HasIndex(e => e.SoDienThoai, "UQ_BenhNhan_SDT").IsUnique();

            entity.HasIndex(e => e.MaBn, "UQ__benh_nha__0FE17EFE9C8D0F50").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Cccd)
                .HasMaxLength(20)
                .IsUnicode(false)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("cccd");
            entity.Property(e => e.CreatedAt)
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.DanToc)
                .HasMaxLength(100)
                .HasColumnName("dan_toc");
            entity.Property(e => e.DiaChiDuong)
                .HasMaxLength(255)
                .HasColumnName("dia_chi_duong");
            entity.Property(e => e.DiaChiHuyen)
                .HasMaxLength(100)
                .IsUnicode(false)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("dia_chi_huyen");
            entity.Property(e => e.DiaChiTinh)
                .HasMaxLength(255)
                .HasColumnName("dia_chi_tinh");
            entity.Property(e => e.DiaChiXa)
                .HasMaxLength(100)
                .IsUnicode(false)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("dia_chi_xa");
            entity.Property(e => e.Email)
                .HasMaxLength(120)
                .IsUnicode(false)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("email");
            entity.Property(e => e.GioiTinh)
                .HasMaxLength(10)
                .IsUnicode(false)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("gioi_tinh");
            entity.Property(e => e.HoTen)
                .HasMaxLength(100)
                .HasColumnName("ho_ten");
            entity.Property(e => e.MaBn)
                .HasMaxLength(30)
                .IsUnicode(false)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("ma_bn");
            entity.Property(e => e.NgaySinh).HasColumnName("ngay_sinh");
            entity.Property(e => e.NgheNghiep)
                .HasMaxLength(100)
                .HasColumnName("nghe_nghiep");
            entity.Property(e => e.QuocGia)
                .HasMaxLength(50)
                .HasColumnName("quoc_gia");
            entity.Property(e => e.QuocTich)
                .HasMaxLength(100)
                .HasColumnName("quoc_tich");
            entity.Property(e => e.SoDienThoai)
                .HasMaxLength(20)
                .IsUnicode(false)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("so_dien_thoai");
            entity.Property(e => e.UpdatedAt)
                .HasColumnType("datetime")
                .HasColumnName("updated_at");
        });

        modelBuilder.Entity<BenhNhanDiUngThuoc>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__benh_nha__3213E83F9C1558ED");

            entity.ToTable("benh_nhan_di_ung_thuoc");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.GhiChu)
                .HasMaxLength(255)
                .HasColumnName("ghi_chu");
            entity.Property(e => e.IdBenhNhan).HasColumnName("id_benh_nhan");
            entity.Property(e => e.IdThuoc).HasColumnName("id_thuoc");

            entity.HasOne(d => d.IdBenhNhanNavigation).WithMany(p => p.BenhNhanDiUngThuocs)
                .HasForeignKey(d => d.IdBenhNhan)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__benh_nhan__id_be__6D6238AF");

            entity.HasOne(d => d.IdThuocNavigation).WithMany(p => p.BenhNhanDiUngThuocs)
                .HasForeignKey(d => d.IdThuoc)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__benh_nhan__id_th__6E565CE8");
        });

        modelBuilder.Entity<BoChiDinh>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__bo_chi_d__3213E83FF81D7750");

            entity.ToTable("bo_chi_dinh");

            entity.HasIndex(e => e.MaBo, "UQ__bo_chi_d__0FE17EFF79CD5E56").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.MaBo)
                .HasMaxLength(30)
                .IsUnicode(false)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("ma_bo");
            entity.Property(e => e.MoTa)
                .HasMaxLength(255)
                .IsUnicode(false)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("mo_ta");
            entity.Property(e => e.Ten)
                .HasMaxLength(150)
                .IsUnicode(false)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("ten");
        });

        modelBuilder.Entity<BoChiDinhCt>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__bo_chi_d__3213E83FFC830250");

            entity.ToTable("bo_chi_dinh_ct");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.GhiChu)
                .HasMaxLength(255)
                .IsUnicode(false)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("ghi_chu");
            entity.Property(e => e.IdBo).HasColumnName("id_bo");
            entity.Property(e => e.IdDichVu).HasColumnName("id_dich_vu");
            entity.Property(e => e.SoLuong).HasColumnName("so_luong");

            entity.HasOne(d => d.IdBoNavigation).WithMany(p => p.BoChiDinhCts)
                .HasForeignKey(d => d.IdBo)
                .HasConstraintName("FK__bo_chi_di__id_bo__4B422AD5");

            entity.HasOne(d => d.IdDichVuNavigation).WithMany(p => p.BoChiDinhCts)
                .HasForeignKey(d => d.IdDichVu)
                .HasConstraintName("FK__bo_chi_di__id_di__4C364F0E");
        });

        modelBuilder.Entity<ChiDinhDvkt>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__chi_dinh__3213E83FFC8692F8");

            entity.ToTable("chi_dinh_dvkt");

            entity.HasIndex(e => e.IdNguoiThucHien, "IX_ChiDinhDVKT_IdNguoiThucHien");

            entity.HasIndex(e => e.TrangThai, "IX_ChiDinhDVKT_TrangThai");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.GhiChu).HasColumnName("ghi_chu");
            entity.Property(e => e.HoanThanhLuc)
                .HasColumnType("datetime")
                .HasColumnName("hoan_thanh_luc");
            entity.Property(e => e.IdDvkt).HasColumnName("id_dvkt");
            entity.Property(e => e.IdLanKham).HasColumnName("id_lan_kham");
            entity.Property(e => e.IdNguoiThucHien).HasColumnName("id_nguoi_thuc_hien");
            entity.Property(e => e.NhanLuc)
                .HasColumnType("datetime")
                .HasColumnName("nhan_luc");
            entity.Property(e => e.SoLuong)
                .HasDefaultValue(1)
                .HasColumnName("so_luong");
            entity.Property(e => e.TrangThai)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasDefaultValue("pending")
                .HasColumnName("trang_thai");

            entity.HasOne(d => d.IdDvktNavigation).WithMany(p => p.ChiDinhDvkts)
                .HasForeignKey(d => d.IdDvkt)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_chi_dinh_dvkt_dvkt");

            entity.HasOne(d => d.IdLanKhamNavigation).WithMany(p => p.ChiDinhDvkts)
                .HasForeignKey(d => d.IdLanKham)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_chi_dinh_dvkt_lankham");
        });

        modelBuilder.Entity<ChiTietDonThuoc>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__chi_tiet__3213E83F282A7970");

            entity.ToTable("chi_tiet_don_thuoc");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Chieu).HasColumnName("chieu");
            entity.Property(e => e.DonVi)
                .HasMaxLength(50)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("don_vi");
            entity.Property(e => e.DungTich)
                .HasMaxLength(50)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("dung_tich");
            entity.Property(e => e.GhiChu)
                .HasMaxLength(255)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("ghi_chu");
            entity.Property(e => e.IdDonThuoc).HasColumnName("id_don_thuoc");
            entity.Property(e => e.IdThuoc).HasColumnName("id_thuoc");
            entity.Property(e => e.Khuya).HasColumnName("khuya");
            entity.Property(e => e.Sang).HasColumnName("sang");
            entity.Property(e => e.SoLuong).HasColumnName("so_luong");
            entity.Property(e => e.SoNgayUong).HasColumnName("so_ngay_uong");
            entity.Property(e => e.Toi).HasColumnName("toi");
            entity.Property(e => e.Trua).HasColumnName("trua");

            entity.HasOne(d => d.IdDonThuocNavigation).WithMany(p => p.ChiTietDonThuocs)
                .HasForeignKey(d => d.IdDonThuoc)
                .HasConstraintName("FK__chi_tiet___id_do__6ABAD62E");

            entity.HasOne(d => d.IdThuocNavigation).WithMany(p => p.ChiTietDonThuocs)
                .HasForeignKey(d => d.IdThuoc)
                .HasConstraintName("FK__chi_tiet___id_th__6BAEFA67");
        });

        modelBuilder.Entity<ChiTietHoaDon>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__chi_tiet__3213E83FE27EDDAF");

            entity.ToTable("chi_tiet_hoa_don");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.DonGia)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("don_gia");
            entity.Property(e => e.IdHoaDon).HasColumnName("id_hoa_don");
            entity.Property(e => e.IdThamChieu).HasColumnName("id_tham_chieu");
            entity.Property(e => e.LoaiThamChieu)
                .HasMaxLength(20)
                .IsUnicode(false)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("loai_tham_chieu");
            entity.Property(e => e.MoTa)
                .HasMaxLength(255)
                .HasColumnName("mo_ta");
            entity.Property(e => e.SoLuong).HasColumnName("so_luong");
            entity.Property(e => e.ThanhTien)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("thanh_tien");
            entity.Property(e => e.ThueVat)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("thue_vat");

            entity.HasOne(d => d.IdHoaDonNavigation).WithMany(p => p.ChiTietHoaDons)
                .HasForeignKey(d => d.IdHoaDon)
                .HasConstraintName("FK__chi_tiet___id_ho__79FD19BE");
        });

        modelBuilder.Entity<ChongChiDinhBenhThuoc>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__chong_ch__3213E83FE185729B");

            entity.ToTable("chong_chi_dinh_benh_thuoc");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CanhBao)
                .HasMaxLength(500)
                .HasColumnName("canh_bao");
            entity.Property(e => e.GhiChu)
                .HasMaxLength(255)
                .HasColumnName("ghi_chu");
            entity.Property(e => e.IdBenh).HasColumnName("id_benh");
            entity.Property(e => e.IdThuoc).HasColumnName("id_thuoc");

            entity.HasOne(d => d.IdBenhNavigation).WithMany(p => p.ChongChiDinhBenhThuocs)
                .HasForeignKey(d => d.IdBenh)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__chong_chi__id_be__79C80F94");

            entity.HasOne(d => d.IdThuocNavigation).WithMany(p => p.ChongChiDinhBenhThuocs)
                .HasForeignKey(d => d.IdThuoc)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__chong_chi__id_th__7ABC33CD");
        });

        modelBuilder.Entity<ChucNang>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__chuc_nan__3213E83FD379D794");

            entity.ToTable("chuc_nang");

            entity.HasIndex(e => e.MaChucNang, "UQ__chuc_nan__34AC6706FD5D0F8D").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.MaChucNang)
                .HasMaxLength(50)
                .IsUnicode(false)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("ma_chuc_nang");
            entity.Property(e => e.MoTa)
                .HasMaxLength(255)
                .IsUnicode(false)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("mo_ta");
            entity.Property(e => e.Ten)
                .HasMaxLength(100)
                .IsUnicode(false)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("ten");
        });

        modelBuilder.Entity<DatLich>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__dat_lich__3213E83FD747E789");

            entity.ToTable("dat_lich");

            entity.HasIndex(e => e.MaDatLich, "UQ__dat_lich__BE721E7AE434603B").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Active).HasColumnName("active");
            entity.Property(e => e.CreatedAt)
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.DaGuiNhac).HasColumnName("da_gui_nhac");
            entity.Property(e => e.GhiChu)
                .HasMaxLength(255)
                .IsUnicode(false)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("ghi_chu");
            entity.Property(e => e.GioBatDau).HasColumnName("gio_bat_dau");
            entity.Property(e => e.GioKetThuc).HasColumnName("gio_ket_thuc");
            entity.Property(e => e.IdBacSi).HasColumnName("id_bac_si");
            entity.Property(e => e.IdBenhNhan).HasColumnName("id_benh_nhan");
            entity.Property(e => e.IdBoChiDinh).HasColumnName("id_bo_chi_dinh");
            entity.Property(e => e.IdNguoiCapNhat).HasColumnName("id_nguoi_cap_nhat");
            entity.Property(e => e.IdNguoiTao).HasColumnName("id_nguoi_tao");
            entity.Property(e => e.IdPhong).HasColumnName("id_phong");
            entity.Property(e => e.MaDatLich)
                .HasMaxLength(30)
                .IsUnicode(false)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("ma_dat_lich");
            entity.Property(e => e.Ngay).HasColumnName("ngay");
            entity.Property(e => e.ThoiGianNhac)
                .HasColumnType("datetime")
                .HasColumnName("thoi_gian_nhac");
            entity.Property(e => e.TrangThai)
                .HasMaxLength(50)
                .IsUnicode(false)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("trang_thai");
            entity.Property(e => e.UpdatedAt)
                .HasColumnType("datetime")
                .HasColumnName("updated_at");

            entity.HasOne(d => d.IdBacSiNavigation).WithMany(p => p.DatLichIdBacSiNavigations)
                .HasForeignKey(d => d.IdBacSi)
                .HasConstraintName("FK__dat_lich__id_bac__50FB042B");

            entity.HasOne(d => d.IdBenhNhanNavigation).WithMany(p => p.DatLiches)
                .HasForeignKey(d => d.IdBenhNhan)
                .HasConstraintName("FK__dat_lich__id_ben__5006DFF2");

            entity.HasOne(d => d.IdBoChiDinhNavigation).WithMany(p => p.DatLiches)
                .HasForeignKey(d => d.IdBoChiDinh)
                .HasConstraintName("FK__dat_lich__id_bo___51EF2864");

            entity.HasOne(d => d.IdNguoiCapNhatNavigation).WithMany(p => p.DatLichIdNguoiCapNhatNavigations)
                .HasForeignKey(d => d.IdNguoiCapNhat)
                .HasConstraintName("FK__dat_lich__id_ngu__53D770D6");

            entity.HasOne(d => d.IdNguoiTaoNavigation).WithMany(p => p.DatLichIdNguoiTaoNavigations)
                .HasForeignKey(d => d.IdNguoiTao)
                .HasConstraintName("FK__dat_lich__id_ngu__52E34C9D");
        });

        modelBuilder.Entity<DichVu>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__dich_vu__3213E83F9D7C32BA");

            entity.ToTable("dich_vu");

            entity.HasIndex(e => e.Ma, "UQ__dich_vu__3213C8B66E440D3F").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.DonViTinh)
                .HasMaxLength(50)
                .HasColumnName("don_vi_tinh");
            entity.Property(e => e.HoatDong).HasColumnName("hoat_dong");
            entity.Property(e => e.IdNhom).HasColumnName("id_nhom");
            entity.Property(e => e.IdPhong).HasColumnName("id_phong");
            entity.Property(e => e.Ma)
                .HasMaxLength(50)
                .IsUnicode(false)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("ma");
            entity.Property(e => e.MoTa)
                .HasMaxLength(255)
                .HasColumnName("mo_ta");
            entity.Property(e => e.Ten)
                .HasMaxLength(255)
                .HasColumnName("ten");

            entity.HasOne(d => d.IdNhomNavigation).WithMany(p => p.DichVus)
                .HasForeignKey(d => d.IdNhom)
                .HasConstraintName("FK__dich_vu__id_nhom__40C49C62");

            entity.HasOne(d => d.IdPhongNavigation).WithMany(p => p.DichVus)
                .HasForeignKey(d => d.IdPhong)
                .HasConstraintName("FK__dich_vu__id_phon__41B8C09B");
        });

        modelBuilder.Entity<DichVuGium>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__dich_vu___3213E83F7D4C9367");

            entity.ToTable("dich_vu_gia");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.DoiTuongApDung)
                .HasMaxLength(255)
                .HasColumnName("doi_tuong_ap_dung");
            entity.Property(e => e.DonGia)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("don_gia");
            entity.Property(e => e.GhiChu)
                .HasMaxLength(255)
                .HasColumnName("ghi_chu");
            entity.Property(e => e.HoatDong).HasColumnName("hoat_dong");
            entity.Property(e => e.IdDichVu).HasColumnName("id_dich_vu");
            entity.Property(e => e.IdPhong).HasColumnName("id_phong");
            entity.Property(e => e.NgayApDung).HasColumnName("ngay_ap_dung");
            entity.Property(e => e.NgayHetHan).HasColumnName("ngay_het_han");

            entity.HasOne(d => d.IdDichVuNavigation).WithMany(p => p.DichVuGia)
                .HasForeignKey(d => d.IdDichVu)
                .HasConstraintName("FK__dich_vu_g__id_di__44952D46");

            entity.HasOne(d => d.IdPhongNavigation).WithMany(p => p.DichVuGia)
                .HasForeignKey(d => d.IdPhong)
                .HasConstraintName("FK__dich_vu_g__id_ph__4589517F");
        });

        modelBuilder.Entity<DonThuoc>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__don_thuo__3213E83F4554A01B");

            entity.ToTable("don_thuoc");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.GhiChu)
                .HasMaxLength(255)
                .IsUnicode(false)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("ghi_chu");
            entity.Property(e => e.IdBacSi).HasColumnName("id_bac_si");
            entity.Property(e => e.IdBenhNhan).HasColumnName("id_benh_nhan");
            entity.Property(e => e.IdLanKham).HasColumnName("id_lan_kham");
            entity.Property(e => e.IdThuNgan).HasColumnName("id_thu_ngan");
            entity.Property(e => e.NgayKe)
                .HasColumnType("datetime")
                .HasColumnName("ngay_ke");
            entity.Property(e => e.SoNgayUong).HasColumnName("so_ngay_uong");
            entity.Property(e => e.TongTien)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("tong_tien");

            entity.HasOne(d => d.IdBacSiNavigation).WithMany(p => p.DonThuocIdBacSiNavigations)
                .HasForeignKey(d => d.IdBacSi)
                .HasConstraintName("FK__don_thuoc__id_ba__66EA454A");

            entity.HasOne(d => d.IdBenhNhanNavigation).WithMany(p => p.DonThuocs)
                .HasForeignKey(d => d.IdBenhNhan)
                .HasConstraintName("FK__don_thuoc__id_be__65F62111");

            entity.HasOne(d => d.IdLanKhamNavigation).WithMany(p => p.DonThuocs)
                .HasForeignKey(d => d.IdLanKham)
                .HasConstraintName("FK__don_thuoc__id_la__6501FCD8");

            entity.HasOne(d => d.IdThuNganNavigation).WithMany(p => p.DonThuocIdThuNganNavigations)
                .HasForeignKey(d => d.IdThuNgan)
                .HasConstraintName("FK__don_thuoc__id_th__67DE6983");
        });

        modelBuilder.Entity<Dvkt>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__dvkt__3213E83F83235E11");

            entity.ToTable("dvkt");

            entity.HasIndex(e => e.MaDvkt, "UQ__dvkt__802722DBA4B48CA7").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.DonVi)
                .HasMaxLength(50)
                .HasColumnName("don_vi");
            entity.Property(e => e.HoatDong)
                .HasDefaultValue(true)
                .HasColumnName("hoat_dong");
            entity.Property(e => e.IdNhom).HasColumnName("id_nhom");
            entity.Property(e => e.MaDvkt)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("ma_dvkt");
            entity.Property(e => e.MoTa).HasColumnName("mo_ta");
            entity.Property(e => e.TenDvkt)
                .HasMaxLength(255)
                .HasColumnName("ten_dvkt");
            entity.Property(e => e.ThoiGianDuKien).HasColumnName("thoi_gian_du_kien");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("updated_at");

            entity.HasOne(d => d.IdNhomNavigation).WithMany(p => p.Dvkts)
                .HasForeignKey(d => d.IdNhom)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_dvkt_nhom");
        });

        modelBuilder.Entity<DvktChiTieu>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__dvkt_chi__3213E83FD88E10CA");

            entity.ToTable("dvkt_chi_tieu");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.DonVi)
                .HasMaxLength(50)
                .HasColumnName("don_vi");
            entity.Property(e => e.GiaTriThamChieu)
                .HasMaxLength(100)
                .HasColumnName("gia_tri_tham_chieu");
            entity.Property(e => e.GioiHanCao).HasColumnName("gioi_han_cao");
            entity.Property(e => e.GioiHanThap).HasColumnName("gioi_han_thap");
            entity.Property(e => e.HoatDong)
                .HasDefaultValue(true)
                .HasColumnName("hoat_dong");
            entity.Property(e => e.IdDvkt).HasColumnName("id_dvkt");
            entity.Property(e => e.TenChiTieu)
                .HasMaxLength(255)
                .HasColumnName("ten_chi_tieu");
            entity.Property(e => e.ThuTu).HasColumnName("thu_tu");

            entity.HasOne(d => d.IdDvktNavigation).WithMany(p => p.DvktChiTieus)
                .HasForeignKey(d => d.IdDvkt)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_chitieu_dvkt");
        });

        modelBuilder.Entity<DvktGium>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__dvkt_gia__3213E83F76DE61CC");

            entity.ToTable("dvkt_gia");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.DenNgay).HasColumnName("den_ngay");
            entity.Property(e => e.DonGia)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("don_gia");
            entity.Property(e => e.GhiChu).HasColumnName("ghi_chu");
            entity.Property(e => e.IdDvkt).HasColumnName("id_dvkt");
            entity.Property(e => e.TuNgay).HasColumnName("tu_ngay");

            entity.HasOne(d => d.IdDvktNavigation).WithMany(p => p.DvktGia)
                .HasForeignKey(d => d.IdDvkt)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_dvkt_gia_dvkt");
        });

        modelBuilder.Entity<DvktKetQua>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__dvkt_ket__3213E83F6C365664");

            entity.ToTable("dvkt_ket_qua");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.FileUrl).HasColumnName("file_url");
            entity.Property(e => e.IdChiDinhDvkt).HasColumnName("id_chi_dinh_dvkt");
            entity.Property(e => e.KetQuaText).HasColumnName("ket_qua_text");
            entity.Property(e => e.NguoiThucHien)
                .HasMaxLength(255)
                .HasColumnName("nguoi_thuc_hien");
            entity.Property(e => e.ThoiGianThucHien)
                .HasColumnType("datetime")
                .HasColumnName("thoi_gian_thuc_hien");
            entity.Property(e => e.TrangThai)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasDefaultValue("pending")
                .HasColumnName("trang_thai");

            entity.HasOne(d => d.IdChiDinhDvktNavigation).WithMany(p => p.DvktKetQuas)
                .HasForeignKey(d => d.IdChiDinhDvkt)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ket_qua_dvkt_chidinh");
        });

        modelBuilder.Entity<DvktKetQuaChiTiet>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__dvkt_ket__3213E83F86597BCB");

            entity.ToTable("dvkt_ket_qua_chi_tiet");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.DanhGia)
                .HasMaxLength(100)
                .HasColumnName("danh_gia");
            entity.Property(e => e.GiaTri)
                .HasMaxLength(100)
                .HasColumnName("gia_tri");
            entity.Property(e => e.IdChiTieu).HasColumnName("id_chi_tieu");
            entity.Property(e => e.IdKetQua).HasColumnName("id_ket_qua");

            entity.HasOne(d => d.IdChiTieuNavigation).WithMany(p => p.DvktKetQuaChiTiets)
                .HasForeignKey(d => d.IdChiTieu)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_kqct_chitieu");

            entity.HasOne(d => d.IdKetQuaNavigation).WithMany(p => p.DvktKetQuaChiTiets)
                .HasForeignKey(d => d.IdKetQua)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_kqct_kq");
        });

        modelBuilder.Entity<DvktPhong>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__dvkt_pho__3213E83F4828785B");

            entity.ToTable("dvkt_phong");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.IdDvkt).HasColumnName("id_dvkt");
            entity.Property(e => e.IdPhong).HasColumnName("id_phong");

            entity.HasOne(d => d.IdDvktNavigation).WithMany(p => p.DvktPhongs)
                .HasForeignKey(d => d.IdDvkt)
                .HasConstraintName("FK__dvkt_phon__id_dv__4F9CCB9E");

            entity.HasOne(d => d.IdPhongNavigation).WithMany(p => p.DvktPhongs)
                .HasForeignKey(d => d.IdPhong)
                .HasConstraintName("FK__dvkt_phon__id_ph__5090EFD7");
        });

        modelBuilder.Entity<DvktThucHienLog>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__dvkt_thu__3213E83F811C5D8E");

            entity.ToTable("dvkt_thuc_hien_log");

            entity.HasIndex(e => e.IdChiDinhDvkt, "IX_DvktThucHienLog_IdChiDinhDvkt");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Action).HasMaxLength(100);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.IdChiDinhDvkt).HasColumnName("id_chi_dinh_dvkt");
            entity.Property(e => e.IdNguoiThucHien).HasColumnName("id_nguoi_thuc_hien");
            entity.Property(e => e.Note).HasColumnName("note");

            entity.HasOne(d => d.IdChiDinhDvktNavigation).WithMany(p => p.DvktThucHienLogs)
                .HasForeignKey(d => d.IdChiDinhDvkt)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_DvktThucHienLog_ChiDinhDvkt");
        });

        modelBuilder.Entity<HoSoBenhAn>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__ho_so_be__3213E83F6139C013");

            entity.ToTable("ho_so_benh_an");

            entity.HasIndex(e => e.MaHs, "UQ__ho_so_be__0FE16EB66741633F").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.ChanDoan)
                .HasMaxLength(255)
                .IsUnicode(false)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("chan_doan");
            entity.Property(e => e.GhiChu)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("ghi_chu");
            entity.Property(e => e.IdBenhNhan).HasColumnName("id_benh_nhan");
            entity.Property(e => e.IdNguoiTao).HasColumnName("id_nguoi_tao");
            entity.Property(e => e.MaHs)
                .HasMaxLength(30)
                .IsUnicode(false)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("ma_hs");
            entity.Property(e => e.NgayTao)
                .HasColumnType("datetime")
                .HasColumnName("ngay_tao");
            entity.Property(e => e.TrangThai)
                .HasMaxLength(50)
                .IsUnicode(false)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("trang_thai");
            entity.Property(e => e.UpdatedAt).HasColumnType("datetime");

            entity.HasOne(d => d.IdBenhNhanNavigation).WithMany(p => p.HoSoBenhAns)
                .HasForeignKey(d => d.IdBenhNhan)
                .HasConstraintName("FK__ho_so_ben__id_be__36470DEF");

            entity.HasOne(d => d.IdNguoiTaoNavigation).WithMany(p => p.HoSoBenhAns)
                .HasForeignKey(d => d.IdNguoiTao)
                .HasConstraintName("FK__ho_so_ben__id_ng__373B3228");
        });

        modelBuilder.Entity<HoaDon>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__hoa_don__3213E83F7962581F");

            entity.ToTable("hoa_don");

            entity.HasIndex(e => e.MaHd, "UQ__hoa_don__0FE16E879BD4E4B8").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.GhiChu)
                .HasMaxLength(255)
                .IsUnicode(false)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("ghi_chu");
            entity.Property(e => e.GiamGia)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("giam_gia");
            entity.Property(e => e.HinhThucTt)
                .HasMaxLength(50)
                .IsUnicode(false)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("hinh_thuc_tt");
            entity.Property(e => e.IdBenhNhan).HasColumnName("id_benh_nhan");
            entity.Property(e => e.IdLanKham).HasColumnName("id_lan_kham");
            entity.Property(e => e.IdThuNgan).HasColumnName("id_thu_ngan");
            entity.Property(e => e.LoaiHoaDon)
                .HasMaxLength(20)
                .IsUnicode(false)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("loai_hoa_don");
            entity.Property(e => e.MaGiaoDichVnpay)
                .HasMaxLength(100)
                .IsUnicode(false)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("ma_giao_dich_vnpay");
            entity.Property(e => e.MaHd)
                .HasMaxLength(30)
                .IsUnicode(false)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("ma_hd");
            entity.Property(e => e.NgayTao)
                .HasColumnType("datetime")
                .HasColumnName("ngay_tao");
            entity.Property(e => e.NgayThanhToan)
                .HasColumnType("datetime")
                .HasColumnName("ngay_thanh_toan");
            entity.Property(e => e.ThueVat)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("thue_vat");
            entity.Property(e => e.TongTien)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("tong_tien");
            entity.Property(e => e.TongTienTruoc)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("tong_tien_truoc");
            entity.Property(e => e.TrangThai)
                .HasMaxLength(20)
                .IsUnicode(false)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("trang_thai");

            entity.HasOne(d => d.IdBenhNhanNavigation).WithMany(p => p.HoaDons)
                .HasForeignKey(d => d.IdBenhNhan)
                .HasConstraintName("FK__hoa_don__id_benh__753864A1");

            entity.HasOne(d => d.IdLanKhamNavigation).WithMany(p => p.HoaDons)
                .HasForeignKey(d => d.IdLanKham)
                .HasConstraintName("FK__hoa_don__id_lan___762C88DA");

            entity.HasOne(d => d.IdThuNganNavigation).WithMany(p => p.HoaDons)
                .HasForeignKey(d => d.IdThuNgan)
                .HasConstraintName("FK__hoa_don__id_thu___7720AD13");
        });

        modelBuilder.Entity<LanKham>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__lan_kham__3213E83F1E352E98");

            entity.ToTable("lan_kham");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.ChanDoanCuoi)
                .HasMaxLength(255)
                .IsUnicode(false)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("chan_doan_cuoi");
            entity.Property(e => e.ChanDoanSoBo)
                .HasMaxLength(255)
                .IsUnicode(false)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("chan_doan_so_bo");
            entity.Property(e => e.CreatedAt)
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.GhiChu)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("ghi_chu");
            entity.Property(e => e.HuongXuTri)
                .HasMaxLength(50)
                .IsUnicode(false)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("huong_xu_tri");
            entity.Property(e => e.IdBacSi).HasColumnName("id_bac_si");
            entity.Property(e => e.IdBenh).HasColumnName("id_benh");
            entity.Property(e => e.IdBenhNhan).HasColumnName("id_benh_nhan");
            entity.Property(e => e.IdDatLich).HasColumnName("id_dat_lich");
            entity.Property(e => e.IdHoSo).HasColumnName("id_ho_so");
            entity.Property(e => e.IdPhong).HasColumnName("id_phong");
            entity.Property(e => e.IdTiepDon).HasColumnName("id_tiep_don");
            entity.Property(e => e.KetQuaKham)
                .HasMaxLength(255)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("ket_qua_kham");
            entity.Property(e => e.LyDo)
                .HasMaxLength(255)
                .IsUnicode(false)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("ly_do");
            entity.Property(e => e.ThoiGianBatDau)
                .HasColumnType("datetime")
                .HasColumnName("thoi_gian_bat_dau");
            entity.Property(e => e.ThoiGianKetThuc)
                .HasColumnType("datetime")
                .HasColumnName("thoi_gian_ket_thuc");
            entity.Property(e => e.TrangThai)
                .HasMaxLength(30)
                .IsUnicode(false)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("trang_thai");
            entity.Property(e => e.UpdatedAt)
                .HasColumnType("datetime")
                .HasColumnName("updated_at");

            entity.HasOne(d => d.IdBacSiNavigation).WithMany(p => p.LanKhamIdBacSiNavigations)
                .HasForeignKey(d => d.IdBacSi)
                .HasConstraintName("FK__lan_kham__id_bac__589C25F3");

            entity.HasOne(d => d.IdBenhNavigation).WithMany(p => p.LanKhams)
                .HasForeignKey(d => d.IdBenh)
                .HasConstraintName("FK_lan_kham_benh");

            entity.HasOne(d => d.IdBenhNhanNavigation).WithMany(p => p.LanKhams)
                .HasForeignKey(d => d.IdBenhNhan)
                .HasConstraintName("FK__lan_kham__id_ben__57A801BA");

            entity.HasOne(d => d.IdDatLichNavigation).WithMany(p => p.LanKhams)
                .HasForeignKey(d => d.IdDatLich)
                .HasConstraintName("FK__lan_kham__id_dat__59904A2C");

            entity.HasOne(d => d.IdHoSoNavigation).WithMany(p => p.LanKhams)
                .HasForeignKey(d => d.IdHoSo)
                .HasConstraintName("FK__lan_kham__id_ho___56B3DD81");

            entity.HasOne(d => d.IdPhongNavigation).WithMany(p => p.LanKhams)
                .HasForeignKey(d => d.IdPhong)
                .HasConstraintName("FK__lan_kham__id_pho__5B78929E");

            entity.HasOne(d => d.IdSinhHieuNavigation).WithMany(p => p.LanKhams)
                .HasForeignKey(d => d.IdSinhHieu)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("FK_LanKham_SinhHieu");

            entity.HasOne(d => d.IdTiepDonNavigation).WithMany(p => p.LanKhamIdTiepDonNavigations)
                .HasForeignKey(d => d.IdTiepDon)
                .HasConstraintName("FK__lan_kham__id_tie__5A846E65");
        });

        modelBuilder.Entity<LanKhamDichVu>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__lan_kham__3213E83F4CBF2997");

            entity.ToTable("lan_kham_dich_vu");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.DonGia)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("don_gia");
            entity.Property(e => e.GhiChu)
                .HasMaxLength(255)
                .IsUnicode(false)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("ghi_chu");
            entity.Property(e => e.IdDichVu).HasColumnName("id_dich_vu");
            entity.Property(e => e.IdLanKham).HasColumnName("id_lan_kham");
            entity.Property(e => e.SoLuong).HasColumnName("so_luong");
            entity.Property(e => e.TrangThaiThucHien)
                .HasMaxLength(50)
                .IsUnicode(false)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("trang_thai_thuc_hien");

            entity.HasOne(d => d.IdDichVuNavigation).WithMany(p => p.LanKhamDichVus)
                .HasForeignKey(d => d.IdDichVu)
                .HasConstraintName("FK__lan_kham___id_di__5F492382");

            entity.HasOne(d => d.IdLanKhamNavigation).WithMany(p => p.LanKhamDichVus)
                .HasForeignKey(d => d.IdLanKham)
                .HasConstraintName("FK__lan_kham___id_la__5E54FF49");
        });

        modelBuilder.Entity<LichSuDangNhap>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__lich_su___3213E83FE37A47DE");

            entity.ToTable("lich_su_dang_nhap");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.IdNguoiDung).HasColumnName("id_nguoi_dung");
            entity.Property(e => e.Ip)
                .HasMaxLength(50)
                .IsUnicode(false)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("ip");
            entity.Property(e => e.KetQua)
                .HasMaxLength(50)
                .IsUnicode(false)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("ket_qua");
            entity.Property(e => e.ThietBi)
                .HasMaxLength(100)
                .IsUnicode(false)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("thiet_bi");
            entity.Property(e => e.ThoiGian)
                .HasColumnType("datetime")
                .HasColumnName("thoi_gian");

            entity.HasOne(d => d.IdNguoiDungNavigation).WithMany(p => p.LichSuDangNhaps)
                .HasForeignKey(d => d.IdNguoiDung)
                .HasConstraintName("FK__lich_su_d__id_ng__2F9A1060");
        });

        modelBuilder.Entity<MaXacThuc>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__ma_xac_t__3213E83F5FC0A9C5");

            entity.ToTable("ma_xac_thuc");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.DaSuDung).HasColumnName("da_su_dung");
            entity.Property(e => e.IdNguoiDung).HasColumnName("id_nguoi_dung");
            entity.Property(e => e.Loai)
                .HasMaxLength(20)
                .IsUnicode(false)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("loai");
            entity.Property(e => e.MaOtp)
                .HasMaxLength(20)
                .IsUnicode(false)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("ma_otp");
            entity.Property(e => e.ThoiGianHetHan)
                .HasColumnType("datetime")
                .HasColumnName("thoi_gian_het_han");
            entity.Property(e => e.ThoiGianTao)
                .HasColumnType("datetime")
                .HasColumnName("thoi_gian_tao");
        });

        modelBuilder.Entity<NguoiDung>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__nguoi_du__3213E83F27CE814E");

            entity.ToTable("nguoi_dung");

            entity.HasIndex(e => e.MaNv, "UQ__nguoi_du__0FE15F7DD13910CC").IsUnique();

            entity.HasIndex(e => e.TenDangNhap, "UQ__nguoi_du__363698B396CDF9C5").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Cccd)
                .HasMaxLength(20)
                .IsUnicode(false)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("cccd");
            entity.Property(e => e.ChucDanh)
                .HasMaxLength(100)
                .IsUnicode(false)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("chuc_danh");
            entity.Property(e => e.CreatedAt)
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.Email)
                .HasMaxLength(120)
                .IsUnicode(false)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("email");
            entity.Property(e => e.HoTen)
                .HasMaxLength(150)
                .IsUnicode(false)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("ho_ten");
            entity.Property(e => e.HoatDong).HasColumnName("hoat_dong");
            entity.Property(e => e.KhoaPhong)
                .HasMaxLength(100)
                .IsUnicode(false)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("khoa_phong");
            entity.Property(e => e.LanDangNhapCuoi)
                .HasColumnType("datetime")
                .HasColumnName("lan_dang_nhap_cuoi");
            entity.Property(e => e.MaNv)
                .HasMaxLength(30)
                .IsUnicode(false)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("ma_nv");
            entity.Property(e => e.MatKhau)
                .HasMaxLength(255)
                .IsUnicode(false)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("mat_khau");
            entity.Property(e => e.Salt)
                .HasMaxLength(255)
                .IsUnicode(false)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("salt");
            entity.Property(e => e.SoDienThoai)
                .HasMaxLength(20)
                .IsUnicode(false)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("so_dien_thoai");
            entity.Property(e => e.SoLanKhoa).HasColumnName("so_lan_khoa");
            entity.Property(e => e.SoLanSai).HasColumnName("so_lan_sai");
            entity.Property(e => e.TenDangNhap)
                .HasMaxLength(100)
                .IsUnicode(false)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("ten_dang_nhap");
            entity.Property(e => e.UpdatedAt)
                .HasColumnType("datetime")
                .HasColumnName("updated_at");
        });

        modelBuilder.Entity<NguoiDungVaiTro>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__nguoi_du__3213E83F3CD5848D");

            entity.ToTable("nguoi_dung_vai_tro");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.IdNguoiDung).HasColumnName("id_nguoi_dung");
            entity.Property(e => e.IdVaiTro).HasColumnName("id_vai_tro");

            entity.HasOne(d => d.IdNguoiDungNavigation).WithMany(p => p.NguoiDungVaiTros)
                .HasForeignKey(d => d.IdNguoiDung)
                .HasConstraintName("FK__nguoi_dun__id_ng__2BC97F7C");

            entity.HasOne(d => d.IdVaiTroNavigation).WithMany(p => p.NguoiDungVaiTros)
                .HasForeignKey(d => d.IdVaiTro)
                .HasConstraintName("FK__nguoi_dun__id_va__2CBDA3B5");
        });

        modelBuilder.Entity<NhomDichVu>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__nhom_dic__3213E83FC14CC37A");

            entity.ToTable("nhom_dich_vu");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.MoTa)
                .HasMaxLength(500)
                .HasColumnName("mo_ta");
            entity.Property(e => e.Ten)
                .HasMaxLength(200)
                .HasColumnName("ten");
        });

        modelBuilder.Entity<NhomDvkt>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__nhom_dvk__3213E83F52113714");

            entity.ToTable("nhom_dvkt");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.HoatDong)
                .HasDefaultValue(true)
                .HasColumnName("hoat_dong");
            entity.Property(e => e.MoTa).HasColumnName("mo_ta");
            entity.Property(e => e.TenNhom)
                .HasMaxLength(255)
                .HasColumnName("ten_nhom");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("updated_at");
        });

        modelBuilder.Entity<NhomThuoc>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__nhom_thu__3213E83F7DCCAC3D");

            entity.ToTable("nhom_thuoc");

            entity.HasIndex(e => e.Ten, "UQ__nhom_thu__DC107AB19B85AFC5").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.MoTa)
                .HasMaxLength(500)
                .HasColumnName("mo_ta");
            entity.Property(e => e.Ten)
                .HasMaxLength(200)
                .HasColumnName("ten");
        });

        modelBuilder.Entity<PhieuKho>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__phieu_kh__3213E83F5911B74C");

            entity.ToTable("phieu_kho");

            entity.HasIndex(e => e.MaPhieu, "UQ__phieu_kh__11D0F07BE6296265").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.DonGia)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("don_gia");
            entity.Property(e => e.GhiChu)
                .HasMaxLength(255)
                .IsUnicode(false)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("ghi_chu");
            entity.Property(e => e.HanSuDung).HasColumnName("han_su_dung");
            entity.Property(e => e.IdThuoc).HasColumnName("id_thuoc");
            entity.Property(e => e.Loai)
                .HasMaxLength(20)
                .IsUnicode(false)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("loai");
            entity.Property(e => e.MaPhieu)
                .HasMaxLength(30)
                .IsUnicode(false)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("ma_phieu");
            entity.Property(e => e.NguoiDuyet).HasColumnName("nguoi_duyet");
            entity.Property(e => e.NguoiLap).HasColumnName("nguoi_lap");
            entity.Property(e => e.SoLo)
                .HasMaxLength(50)
                .IsUnicode(false)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("so_lo");
            entity.Property(e => e.SoLuong).HasColumnName("so_luong");
            entity.Property(e => e.ThoiGian)
                .HasColumnType("datetime")
                .HasColumnName("thoi_gian");

            entity.HasOne(d => d.IdThuocNavigation).WithMany(p => p.PhieuKhos)
                .HasForeignKey(d => d.IdThuoc)
                .HasConstraintName("FK__phieu_kho__id_th__6F7F8B4B");

            entity.HasOne(d => d.NguoiDuyetNavigation).WithMany(p => p.PhieuKhoNguoiDuyetNavigations)
                .HasForeignKey(d => d.NguoiDuyet)
                .HasConstraintName("FK__phieu_kho__nguoi__7167D3BD");

            entity.HasOne(d => d.NguoiLapNavigation).WithMany(p => p.PhieuKhoNguoiLapNavigations)
                .HasForeignKey(d => d.NguoiLap)
                .HasConstraintName("FK__phieu_kho__nguoi__7073AF84");
        });

        modelBuilder.Entity<PhongKham>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__phong_kh__3213E83FD5ACC445");

            entity.ToTable("phong_kham");

            entity.HasIndex(e => e.MaPhong, "UQ__phong_kh__1BD319C8E27DF78B").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.HoatDong).HasColumnName("hoat_dong");
            entity.Property(e => e.KhoaPhong)
                .HasMaxLength(255)
                .HasColumnName("khoa_phong");
            entity.Property(e => e.MaPhong)
                .HasMaxLength(20)
                .IsUnicode(false)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("ma_phong");
            entity.Property(e => e.MoTa).HasColumnName("mo_ta");
            entity.Property(e => e.TenPhong)
                .HasMaxLength(255)
                .HasColumnName("ten_phong");
        });

        modelBuilder.Entity<PhongThucHien>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__phong_th__3213E83F64CA232E");

            entity.ToTable("phong_thuc_hien");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.HoatDong)
                .HasDefaultValue(true)
                .HasColumnName("hoat_dong");
            entity.Property(e => e.Tang).HasColumnName("tang");
            entity.Property(e => e.TenPhong)
                .HasMaxLength(100)
                .HasColumnName("ten_phong");
        });

        modelBuilder.Entity<Quyen>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__quyen__3213E83F89828DAE");

            entity.ToTable("quyen");

            entity.HasIndex(e => e.MaQuyen, "UQ_quyen_ma_quyen").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.IdChucNang).HasColumnName("id_chuc_nang");
            entity.Property(e => e.MaQuyen)
                .HasMaxLength(50)
                .IsUnicode(false)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("ma_quyen");
            entity.Property(e => e.Sua).HasColumnName("sua");
            entity.Property(e => e.Them).HasColumnName("them");
            entity.Property(e => e.Xem).HasColumnName("xem");
            entity.Property(e => e.Xoa).HasColumnName("xoa");
            entity.Property(e => e.Xuat).HasColumnName("xuat");

            entity.HasOne(d => d.IdChucNangNavigation).WithMany(p => p.Quyens)
                .HasForeignKey(d => d.IdChucNang)
                .HasConstraintName("FK__quyen__id_chuc_n__251C81ED");
        });

        modelBuilder.Entity<SinhHieu>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__SinhHieu__3214EC0733AFFB9D");

            entity.ToTable("SinhHieu");

            entity.Property(e => e.Bmi)
                .HasComputedColumnSql("(case when [ChieuCao]>(0) then round([CanNang]/power([ChieuCao]/(100.0),(2)),(1))  end)", false)
                .HasColumnName("BMI");
            entity.Property(e => e.ThoiGianDo)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.IdLanKhamNavigation).WithMany(p => p.SinhHieus)
                .HasForeignKey(d => d.IdLanKham)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SinhHieu__IdLanK__6497E884");
        });

        modelBuilder.Entity<Thuoc>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__thuoc__3213E83F4E488F9C");

            entity.ToTable("thuoc");

            entity.HasIndex(e => e.Ma, "UQ__thuoc__3213C8B64C86E689").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.DonGia)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("don_gia");
            entity.Property(e => e.DonVi)
                .HasMaxLength(50)
                .HasColumnName("don_vi");
            entity.Property(e => e.HamLuong)
                .HasMaxLength(50)
                .HasColumnName("ham_luong");
            entity.Property(e => e.HanSuDung).HasColumnName("han_su_dung");
            entity.Property(e => e.HangSx)
                .HasMaxLength(100)
                .HasColumnName("hang_sx");
            entity.Property(e => e.HoatDong).HasColumnName("hoat_dong");
            entity.Property(e => e.IdNhom).HasColumnName("id_nhom");
            entity.Property(e => e.Ma)
                .HasMaxLength(50)
                .IsUnicode(false)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("ma");
            entity.Property(e => e.MoTa)
                .HasMaxLength(500)
                .HasColumnName("mo_ta");
            entity.Property(e => e.SoLuongTon).HasColumnName("so_luong_ton");
            entity.Property(e => e.Ten)
                .HasMaxLength(150)
                .IsUnicode(false)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("ten");

            entity.HasOne(d => d.IdNhomNavigation).WithMany(p => p.Thuocs)
                .HasForeignKey(d => d.IdNhom)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("FK_thuoc_nhom");
        });

        modelBuilder.Entity<ThuocGium>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__thuoc_gi__3213E83F006B7AC3");

            entity.ToTable("thuoc_gia");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.DoiTuongApDung)
                .HasMaxLength(200)
                .HasColumnName("doi_tuong_ap_dung");
            entity.Property(e => e.DonGia)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("don_gia");
            entity.Property(e => e.GhiChu)
                .HasMaxLength(300)
                .HasColumnName("ghi_chu");
            entity.Property(e => e.HoatDong)
                .HasDefaultValue(true)
                .HasColumnName("hoat_dong");
            entity.Property(e => e.IdThuoc).HasColumnName("id_thuoc");
            entity.Property(e => e.NgayApDung).HasColumnName("ngay_ap_dung");
            entity.Property(e => e.NgayHetHan).HasColumnName("ngay_het_han");

            entity.HasOne(d => d.IdThuocNavigation).WithMany(p => p.ThuocGia)
                .HasForeignKey(d => d.IdThuoc)
                .HasConstraintName("FK_thuoc_gia_thuoc");
        });

        modelBuilder.Entity<ThuocLieuChuan>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__thuoc_li__3213E83F1CEF34F7");

            entity.ToTable("thuoc_lieu_chuan");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.GhiChu)
                .HasMaxLength(255)
                .HasColumnName("ghi_chu");
            entity.Property(e => e.IdThuoc).HasColumnName("id_thuoc");
            entity.Property(e => e.LieuToiDaNgay).HasColumnName("lieu_toi_da_ngay");

            entity.HasOne(d => d.IdThuocNavigation).WithMany(p => p.ThuocLieuChuans)
                .HasForeignKey(d => d.IdThuoc)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__thuoc_lie__id_th__7D98A078");
        });

        modelBuilder.Entity<TuongTacThuoc>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__tuong_ta__3213E83F8B3F601A");

            entity.ToTable("tuong_tac_thuoc");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CanhBao)
                .HasMaxLength(500)
                .HasColumnName("canh_bao");
            entity.Property(e => e.IdThuoc1).HasColumnName("id_thuoc_1");
            entity.Property(e => e.IdThuoc2).HasColumnName("id_thuoc_2");
            entity.Property(e => e.MucDo).HasColumnName("muc_do");

            entity.HasOne(d => d.IdThuoc1Navigation).WithMany(p => p.TuongTacThuocIdThuoc1Navigations)
                .HasForeignKey(d => d.IdThuoc1)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__tuong_tac__id_th__7132C993");

            entity.HasOne(d => d.IdThuoc2Navigation).WithMany(p => p.TuongTacThuocIdThuoc2Navigations)
                .HasForeignKey(d => d.IdThuoc2)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__tuong_tac__id_th__7226EDCC");
        });

        modelBuilder.Entity<VaiTro>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__vai_tro__3213E83FA6DED652");

            entity.ToTable("vai_tro");

            entity.HasIndex(e => e.Ten, "UQ__vai_tro__DC107AB17B8E35D1").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.MoTa)
                .HasMaxLength(255)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("mo_ta");
            entity.Property(e => e.Ten)
                .HasMaxLength(50)
                .IsUnicode(false)
                .UseCollation("SQL_Latin1_General_CP1_CI_AS")
                .HasColumnName("ten");
        });

        modelBuilder.Entity<VaiTroQuyen>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__vai_tro___3213E83FA2738166");

            entity.ToTable("vai_tro_quyen");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.IdQuyen).HasColumnName("id_quyen");
            entity.Property(e => e.IdVaiTro).HasColumnName("id_vai_tro");
            entity.Property(e => e.Sua)
                .HasDefaultValue(false)
                .HasColumnName("sua");
            entity.Property(e => e.Them)
                .HasDefaultValue(false)
                .HasColumnName("them");
            entity.Property(e => e.Xem)
                .HasDefaultValue(false)
                .HasColumnName("xem");
            entity.Property(e => e.Xoa)
                .HasDefaultValue(false)
                .HasColumnName("xoa");
            entity.Property(e => e.Xuat)
                .HasDefaultValue(false)
                .HasColumnName("xuat");

            entity.HasOne(d => d.IdQuyenNavigation).WithMany(p => p.VaiTroQuyens)
                .HasForeignKey(d => d.IdQuyen)
                .HasConstraintName("FK__vai_tro_q__id_qu__28ED12D1");

            entity.HasOne(d => d.IdVaiTroNavigation).WithMany(p => p.VaiTroQuyens)
                .HasForeignKey(d => d.IdVaiTro)
                .HasConstraintName("FK__vai_tro_q__id_va__27F8EE98");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}

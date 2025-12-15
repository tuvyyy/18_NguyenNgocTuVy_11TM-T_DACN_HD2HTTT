using System;
using System.Collections.Generic;

namespace DACN_QLPK_1150070050_NguyenNgocTuVy.Dtos
{
    // ==========================================
    // Generic Paged Result (cho phân trang)
    // ==========================================
    public class PagedResult<T>
    {
        public int TotalItems { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public IEnumerable<T> Items { get; set; } = new List<T>();
    }

    // ==========================================
    // NHÓM DỊCH VỤ (nhom_dich_vu)
    // ==========================================
    public class NhomDichVuDto
    {
        public int Id { get; set; }
        public string Ten { get; set; } = string.Empty;
        public string? MoTa { get; set; }
    }

    public class NhomDichVuCreateUpdateDto
    {
        public string Ten { get; set; } = string.Empty;
        public string? MoTa { get; set; }
    }

    // ==========================================
    // DỊCH VỤ (dich_vu)
    // ==========================================
    public class DichVuDto
    {
        public long Id { get; set; }
        public int IdNhom { get; set; }
        public int? IdPhong { get; set; }
        public string Ma { get; set; } = string.Empty;
        public string Ten { get; set; } = string.Empty;
        public string? DonViTinh { get; set; }
        public string? MoTa { get; set; }
        public bool? HoatDong { get; set; }

        // ✅ Thông tin join
        public string? TenNhom { get; set; }
        public string? TenPhong { get; set; }
    }

    public class DichVuCreateUpdateDto
    {
        public int IdNhom { get; set; }
        public int? IdPhong { get; set; }
        public string Ma { get; set; } = string.Empty;
        public string Ten { get; set; } = string.Empty;
        public string? DonViTinh { get; set; }
        public string? MoTa { get; set; }
        public bool? HoatDong { get; set; } = true;
    }

    // ==========================================
    // DỊCH VỤ GIÁ (dich_vu_gia)
    // ==========================================
    public class DichVuGiaDto
    {
        public long Id { get; set; }
        public long IdDichVu { get; set; }
        public int? IdPhong { get; set; }
        public decimal DonGia { get; set; }
        public DateTime NgayApDung { get; set; }
        public DateTime? NgayHetHan { get; set; }
        public string? DoiTuongApDung { get; set; }
        public string? GhiChu { get; set; }
        public bool? HoatDong { get; set; }

        // ✅ Thông tin join
        public string? TenDichVu { get; set; }
        public string? MaDichVu { get; set; }
        public string? TenPhong { get; set; }
    }

    public class DichVuGiaCreateUpdateDto
    {
        public long IdDichVu { get; set; }
        public int? IdPhong { get; set; }
        public decimal DonGia { get; set; }
        public DateTime NgayApDung { get; set; }
        public DateTime? NgayHetHan { get; set; }
        public string? DoiTuongApDung { get; set; }
        public string? GhiChu { get; set; }
        public bool? HoatDong { get; set; } = true;
    }
}

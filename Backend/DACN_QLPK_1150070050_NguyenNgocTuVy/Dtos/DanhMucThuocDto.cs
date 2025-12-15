using System;
using System.Collections.Generic;

namespace DACN_QLPK_1150070050_NguyenNgocTuVy.Dtos
{
    // =============================================
    // 🧩 1️⃣ NHÓM THUỐC
    // =============================================
    public class NhomThuocDto
    {
        public int Id { get; set; }
        public string Ten { get; set; } = string.Empty;
        public string? MoTa { get; set; }
    }

    // =============================================
    // 💊 2️⃣ THUỐC
    // =============================================
    public class ThuocDto
    {
        public long Id { get; set; }
        public int? IdNhom { get; set; }
        public string Ma { get; set; } = string.Empty;
        public string Ten { get; set; } = string.Empty;
        public string? DonViTinh { get; set; }
        public string? MoTa { get; set; }
        public bool? HoatDong { get; set; }

        // 🔗 Liên kết
        public string? TenNhom { get; set; }
    }

    // =============================================
    // 💵 3️⃣ THUỐC GIÁ - XEM
    // =============================================
    public class ThuocGiaDto
    {
        public long Id { get; set; }
        public long IdThuoc { get; set; }
        public decimal DonGia { get; set; }
        public DateTime NgayApDung { get; set; }
        public DateTime? NgayHetHan { get; set; }
        public string? DoiTuongApDung { get; set; }
        public string? GhiChu { get; set; }
        public bool? HoatDong { get; set; }

        // 🔗 Liên kết
        public string? TenThuoc { get; set; }
        public string? MaThuoc { get; set; }
    }

    // =============================================
    // ✍️ 4️⃣ THUỐC GIÁ - TẠO / CẬP NHẬT
    // =============================================
    public class ThuocGiaCreateUpdateDto
    {
        public long IdThuoc { get; set; }
        public decimal DonGia { get; set; }
        public DateTime NgayApDung { get; set; }
        public DateTime? NgayHetHan { get; set; }
        public string? DoiTuongApDung { get; set; }
        public string? GhiChu { get; set; }
        public bool? HoatDong { get; set; }
    }
}

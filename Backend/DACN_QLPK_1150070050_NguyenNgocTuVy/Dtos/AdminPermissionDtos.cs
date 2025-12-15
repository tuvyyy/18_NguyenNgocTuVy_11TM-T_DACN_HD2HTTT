using System;

namespace DACN_QLPK_1150070050_NguyenNgocTuVy.Dtos
{
    // ============================================================
    // DTO DEFINITIONS – Dành cho nhóm Quản lý người dùng & phân quyền
    // ============================================================

    public class VaiTroDto
    {
        public int Id { get; set; }
        public string Ten { get; set; } = "";
        public string? MoTa { get; set; }
    }

    public class ChucNangDto
    {
        public int Id { get; set; }
        public string MaChucNang { get; set; } = "";
        public string Ten { get; set; } = "";
        public string? MoTa { get; set; }
    }

    public class QuyenDto
    {
        public int Id { get; set; }
        public int IdChucNang { get; set; }
        public string? MaQuyen { get; set; }
        public bool Xem { get; set; }
        public bool Them { get; set; }
        public bool Sua { get; set; }
        public bool Xoa { get; set; }
        public bool Xuat { get; set; }
    }

    public class VaiTroQuyenDto
    {
        public int Id { get; set; }
        public int? IdVaiTro { get; set; }   // nullable do entity hiện là int?
        public int? IdQuyen { get; set; }    // nullable do entity hiện là int?
        public string? ChucNang { get; set; }
        public string? MaQuyen { get; set; }
    }
}

using System;
using System.Collections.Generic;

namespace DACN_QLPK_1150070050_NguyenNgocTuVy.Dtos
{
    // =======================================================
    // 1) DTO TẠO ĐƠN THUỐC (FE gửi lên)
    // =======================================================
    public class DonThuocCreateDto
    {
        public long IdLanKham { get; set; }
        public long IdBenhNhan { get; set; }
        public long IdBacSi { get; set; }
        public int SoNgayUong { get; set; }
        public string? GhiChu { get; set; }

        public List<DonThuocChiTietCreateDto> ChiTiet { get; set; } = new();
    }

    public class DonThuocChiTietCreateDto
    {
        public long IdThuoc { get; set; }
        public int? SoLuong { get; set; }
        public string? DonVi { get; set; }
        public string? DungTich { get; set; }

        public int? Sang { get; set; }
        public int? Trua { get; set; }
        public int? Chieu { get; set; }
        public int? Toi { get; set; }
        public int? Khuya { get; set; }

        public int? SoNgayUong { get; set; }
        public string? GhiChu { get; set; }
    }
    // =======================================================
    // 2) DTO ITEM (chi tiết) trong đơn thuốc
    // =======================================================
    public class DonThuocItemDto
    {
        public long IdThuoc { get; set; }

        public int? SoLuong { get; set; }
        public string? DonVi { get; set; }
        public string? DungTich { get; set; }

        public int? Sang { get; set; }
        public int? Trua { get; set; }
        public int? Chieu { get; set; }
        public int? Toi { get; set; }
        public int? Khuya { get; set; }

        public int? SoNgayUong { get; set; }
        public string? GhiChu { get; set; }
    }

    // =======================================================
    // 3) DTO ĐƠN THUỐC FULL (trả về FE)
    // =======================================================
    public class DonThuocDto
    {
        public long Id { get; set; }
        public DateTime? NgayKe { get; set; }
        public int? SoNgayUong { get; set; }
        public string? GhiChu { get; set; }

        public List<DonThuocChiTietDto> ChiTiet { get; set; } = new();
    }

    // =======================================================
    // 4) DTO CHI TIẾT TRẢ VỀ FE
    // =======================================================
    public class DonThuocChiTietDto
    {
        public long Id { get; set; }
        public long? IdThuoc { get; set; }

        public string TenThuoc { get; set; } = "";

        public int? SoLuong { get; set; }
        public string? DonVi { get; set; }
        public string? DungTich { get; set; }

        public int? Sang { get; set; }
        public int? Trua { get; set; }
        public int? Chieu { get; set; }
        public int? Toi { get; set; }
        public int? Khuya { get; set; }

        public int? SoNgayUong { get; set; }
        public string? GhiChu { get; set; }
    }

        public class ChiTietUpdateDto
        {
            public long IdThuoc { get; set; }      // ID thuốc
            public int? SoLuong { get; set; }       // Số lượng (bắt buộc)
            public string? DonVi { get; set; }      // Viên / Gói / Ống...

            public int? Sang { get; set; }
            public int? Trua { get; set; }
            public int? Chieu { get; set; }
            public int? Toi { get; set; }
            public int? Khuya { get; set; }

            public int? SoNgayUong { get; set; }

            public string? GhiChu { get; set; }
        }
    }


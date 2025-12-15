namespace DACN_QLPK_1150070050_NguyenNgocTuVy.Dtos
{
    // ============================================================
    // 1) DTO TẠO / CẬP NHẬT KẾT QUẢ TỔNG DVKT
    //    - Dùng cho POST /api/ktv/dvkt/ketqua
    // ============================================================
    public class CreateKetQuaDVKTDto
    {
        public long IdChiDinhDVKT { get; set; }
        public string? KetQuaText { get; set; }
        public string? FileUrl { get; set; }
    }

    // ============================================================
    // 2) DTO NHẬP / CẬP NHẬT KẾT QUẢ CHỈ TIÊU
    //    - Dùng cho POST /api/ktv/dvkt/ketqua/chitiet
    // ============================================================
    public class CreateKetQuaChiTietDto
    {
        public long IdKetQua { get; set; }
        public int IdChiTieu { get; set; }
        public string? GiaTri { get; set; }
        public string? DanhGia { get; set; }
    }

    // ============================================================
    // 3) DTO TRẢ RA (READ-ONLY) CHỈ TIÊU ĐÃ NHẬP
    // ============================================================
    public class KetQuaChiTietDto
    {
        public long IdKetQua { get; set; }
        public int IdChiTieu { get; set; }
        public string GiaTri { get; set; }
        public string DanhGia { get; set; }
    }
}

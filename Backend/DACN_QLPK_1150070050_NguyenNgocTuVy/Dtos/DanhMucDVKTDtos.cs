namespace DACN_QLPK_1150070050_NguyenNgocTuVy.Dtos
{
    public class NhomDVKTDto
    {
        public int Id { get; set; }
        public string TenNhom { get; set; }
        public string MoTa { get; set; }
    }

    public class CreateNhomDVKTDto
    {
        public string TenNhom { get; set; }
        public string MoTa { get; set; }
    }

    public class UpdateNhomDVKTDto
    {
        public string TenNhom { get; set; }
        public string MoTa { get; set; }
        public bool HoatDong { get; set; }
    }


    // -------------------- DVKT --------------------
    public class DVKTDto
    {
        public int Id { get; set; }
        public string MaDVKT { get; set; }
        public string TenDVKT { get; set; }
        public string DonVi { get; set; }
        public int IdNhom { get; set; }
        public string TenNhom { get; set; }
        public int? ThoiGianDuKien { get; set; }
        public bool HoatDong { get; set; }
    }

    public class CreateDVKTDto
    {
        public string MaDVKT { get; set; }
        public string TenDVKT { get; set; }
        public string DonVi { get; set; }
        public int IdNhom { get; set; }
        public int? ThoiGianDuKien { get; set; }
        public string MoTa { get; set; }
    }

    public class UpdateDVKTDto
    {
        public string TenDVKT { get; set; }
        public string DonVi { get; set; }
        public int IdNhom { get; set; }
        public int? ThoiGianDuKien { get; set; }
        public string MoTa { get; set; }
        public bool HoatDong { get; set; }
    }


    // -------------------- GIÁ DVKT --------------------
    public class DVKTGiaDto
    {
        public int Id { get; set; }
        public int IdDVKT { get; set; }
        public decimal DonGia { get; set; }
        public DateTime TuNgay { get; set; }
        public DateTime? DenNgay { get; set; }
        public string GhiChu { get; set; }
    }

    public class CreateDVKTGiaDto
    {
        public int IdDVKT { get; set; }
        public decimal DonGia { get; set; }
        public DateTime TuNgay { get; set; }
        public string GhiChu { get; set; }
    }

    public class UpdateDVKTGiaDto
    {
        public decimal DonGia { get; set; }
        public DateTime? DenNgay { get; set; }
        public string GhiChu { get; set; }
    }
}

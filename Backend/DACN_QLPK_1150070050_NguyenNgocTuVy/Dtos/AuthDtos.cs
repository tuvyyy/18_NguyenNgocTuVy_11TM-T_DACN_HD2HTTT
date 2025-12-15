namespace DACN_QLPK_1150070050_NguyenNgocTuVy.Dtos
{
    public class RegisterRequest
    {
        public string? HoTen { get; set; }
        public string TenDangNhap { get; set; } = string.Empty; // có thể là email
        public string MatKhau { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? SoDienThoai { get; set; }
        public int[]? VaiTroIds { get; set; } 
    }

    public class LoginRequest
    {
        public string TenDangNhap { get; set; } = string.Empty;
        public string MatKhau { get; set; } = string.Empty;
    }

    public class LoginResponse
    {
        public long UserId { get; set; }
        public string TenDangNhap { get; set; } = string.Empty;
        public string[] Roles { get; set; } = Array.Empty<string>();
        public string Token { get; set; } = string.Empty;
    }
}

namespace DACN_QLPK_1150070050_NguyenNgocTuVy.Dtos
{
    // ============================================================
    // 🧾 DTO tổng hợp dùng cho CRUD người dùng (dùng trong Controller)
    // ============================================================
    public class NguoiDungDto
    {
        public long Id { get; set; }
        public string HoTen { get; set; } = string.Empty;
        public string TenDangNhap { get; set; } = string.Empty;
        public string MatKhau { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? SoDienThoai { get; set; }
        public string? ChucDanh { get; set; }
        public string? KhoaPhong { get; set; }
        public bool? HoatDong { get; set; } = true;
        public List<int>? VaiTroIds { get; set; }    // ✅ danh sách id vai trò gán cho người dùng
    }

    // ============================================================
    // 🧾 DTO hiển thị danh sách người dùng
    // ============================================================
    public class UserListDto
    {
        public long Id { get; set; }
        public string TenDangNhap { get; set; } = string.Empty;
        public string HoTen { get; set; } = string.Empty;
        public string? ChucDanh { get; set; }
        public string? KhoaPhong { get; set; }
        public string? Email { get; set; }
        public string? SoDienThoai { get; set; }
        public bool? HoatDong { get; set; }           // ✅ có trong model
        public string? VaiTro { get; set; }           // ✅ map từ bảng NguoiDungVaiTro
        public DateTime? LanDangNhapCuoi { get; set; }
    }

    // ============================================================
    // 🧾 DTO thêm mới người dùng
    // ============================================================
    public class UserCreateDto
    {
        public string TenDangNhap { get; set; } = string.Empty;
        public string MatKhau { get; set; } = string.Empty;
        public string HoTen { get; set; } = string.Empty;
        public string? ChucDanh { get; set; }
        public string? KhoaPhong { get; set; }
        public string? Email { get; set; }
        public string? SoDienThoai { get; set; }
        public string? VaiTro { get; set; }           // ✅ tên vai trò
        public bool? HoatDong { get; set; } = true;
    }

    // ============================================================
    // 🧾 DTO cập nhật thông tin người dùng
    // ============================================================
    public class UserUpdateDto
    {
        public string? HoTen { get; set; }
        public string? Email { get; set; }
        public string? SoDienThoai { get; set; }
        public string? ChucDanh { get; set; }
        public string? KhoaPhong { get; set; }
        public string? VaiTro { get; set; }
        public bool? HoatDong { get; set; }
    }

    // ============================================================
    // 🧾 DTO khoá/mở tài khoản
    // ============================================================
    public class UserLockDto
    {
        public bool Khoa { get; set; }    // ✅ đúng theo các controller khác
    }
}

namespace DACN_QLPK_1150070050_NguyenNgocTuVy.Dtos
{
    public class CreateChiDinhDVKTDto
    {
        public long IdLanKham { get; set; }
        public long IdDVKT { get; set; }
        public int SoLuong { get; set; }
        public string? GhiChu { get; set; }
    }

    public class UpdateChiDinhDVKTDto
    {
        public int SoLuong { get; set; }
        public string? GhiChu { get; set; }
    }

    public class ChiDinhDVKTItemDto
    {
        public long Id { get; set; }
        public long IdLanKham { get; set; }
        public long IdDvkt { get; set; }
        public string MaDvkt { get; set; } = "";
        public string TenDvkt { get; set; } = "";
        public int SoLuong { get; set; }
        public string TrangThai { get; set; } = "";
        public string? GhiChu { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class ApiResponse<T>
    {
        public bool Success { get; set; } = true;
        public string? Message { get; set; }
        public T? Data { get; set; }

        public static ApiResponse<T> Ok(T data, string? msg = null)
            => new ApiResponse<T> { Success = true, Data = data, Message = msg };

        public static ApiResponse<T> Fail(string msg)
            => new ApiResponse<T> { Success = false, Message = msg };
    }

    public static class DvktTrangThai
    {
        public const string Pending = "pending";
        public const string Sent = "sent";          // đã gửi sang phòng cận lâm sàng
        public const string Processing = "processing";
        public const string Done = "done";
        public const string Paid = "paid";
        public const string Canceled = "canceled";
    }
}

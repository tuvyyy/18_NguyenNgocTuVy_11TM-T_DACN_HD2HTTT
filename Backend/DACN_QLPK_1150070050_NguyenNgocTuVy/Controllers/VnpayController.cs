using DACN_QLPK_1150070050_NguyenNgocTuVy.Services;
using Microsoft.AspNetCore.Mvc;
using VNPAY.NET;
using VNPAY.NET.Enums;
using VNPAY.NET.Models;
using VNPAY.NET.Utilities;

namespace DACN_QLPK_1150070050_NguyenNgocTuVy.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VnpayController : ControllerBase
    {
        private readonly IVnpay _vnpay;
        private readonly IConfiguration _config;
        private readonly IHoaDonService _hoaDonService;


        public VnpayController(IConfiguration config, IHoaDonService hoaDonService)
        {
            _config = config;
            _hoaDonService = hoaDonService;

            _vnpay = new Vnpay();

            _vnpay.Initialize(
                _config["Vnpay:TmnCode"],
                _config["Vnpay:HashSecret"],
                _config["Vnpay:BaseUrl"],
                _config["Vnpay:CallbackUrl"]
            );
        }

        [HttpGet("CreatePaymentUrl")]
        public IActionResult CreatePaymentUrl(string maHd, double amount)
        {
            var ip = NetworkHelper.GetIpAddress(HttpContext);

            var request = new PaymentRequest
            {
                PaymentId = DateTime.Now.Ticks,
                Money = amount,
                Description = $"Thanh toán hóa đơn {maHd}",
                IpAddress = ip,
                BankCode = BankCode.ANY,
                Currency = Currency.VND,
                Language = DisplayLanguage.Vietnamese
            };

            var url = _vnpay.GetPaymentUrl(request);
            return Ok(new { paymentUrl = url });
        }

        [HttpGet("Callback")]
        public IActionResult Callback()
        {
            try
            {
                var result = _vnpay.GetPaymentResult(Request.Query);

                if (!result.IsSuccess)
                    return Redirect("http://localhost:3000/payment-failed");

                // Lấy mã hóa đơn
                string maHd = result.Description
                    .Replace("Thanh toán hóa đơn", "")
                    .Trim();

                // Cập nhật hóa đơn
                _hoaDonService.UpdateDaThanhToan(maHd);

                // Redirect về FE
                return Redirect($"http://localhost:3000/thu-ngan/detail/{maHd}?success=1");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


    }
}

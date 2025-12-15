using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DACN_QLPK_1150070050_NguyenNgocTuVy.Data;
using DACN_QLPK_1150070050_NguyenNgocTuVy.Models;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using QRCoder;

namespace DACN_QLPK_1150070050_NguyenNgocTuVy.Controllers.PDF
{
    [ApiController]
    [Route("api/pdf/donthuoc")]
    public class DonThuocPDFController : ControllerBase
    {
        private readonly DACNDbContext _db;

        public DonThuocPDFController(DACNDbContext db)
        {
            _db = db;
            QuestPDF.Settings.License = LicenseType.Community;
        }

        // ================================================
        // EXPORT PDF
        // ================================================
        [HttpGet("{id}")]
        public async Task<IActionResult> Export(long id)
        {
            var don = await _db.DonThuocs
                .Include(x => x.IdBenhNhanNavigation)
                .Include(x => x.IdBacSiNavigation)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (don == null)
                return NotFound(new { message = "Không tìm thấy đơn thuốc!" });

            var chiTiet = await _db.ChiTietDonThuocs
                .Include(x => x.IdThuocNavigation)
                .Where(x => x.IdDonThuoc == id)
                .ToListAsync();

            var qrBytes = GenerateQrCode($"{don.IdBenhNhanNavigation?.HoTen} | ID: {don.IdBenhNhan}");

            var pdf = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Margin(40);
                    page.Size(PageSizes.A4);
                    page.DefaultTextStyle(TextStyle.Default.FontFamily("Inter"));

                    page.Header().Element(c => BuildHeader(c, don, qrBytes));
                    page.Content().Element(c => BuildBody(c, don, chiTiet));
                    page.Footer().Element(BuildFooter);
                });
            }).GeneratePdf();

            return File(pdf, "application/pdf", $"DonThuoc_{don.IdBenhNhan}.pdf");
        }

        // ================================================
        // HEADER
        // ================================================
        private void BuildHeader(IContainer container, DonThuoc don, byte[] qr)
        {
            container.Row(row =>
            {
                row.RelativeColumn().Stack(stack =>
                {
                    stack.Item().Text("PHÒNG KHÁM ĐA KHOA").Bold().FontSize(18);
                    stack.Item().Text("Địa chỉ: 123 Nguyễn Văn Cừ, TP.HCM");
                    stack.Item().Text("Điện thoại: 0123 456 789");
                });

                row.ConstantColumn(90).Image(qr);
            });
        }

        // ================================================
        // BODY
        // ================================================
        private void BuildBody(IContainer container, DonThuoc don, List<ChiTietDonThuoc> list)
        {
            container.Stack(stack =>
            {
                // Tiêu đề
                stack.Item().PaddingBottom(10).AlignCenter()
                    .Text("ĐƠN THUỐC").FontSize(20).Bold();

                // Thông tin bệnh nhân
                stack.Item().Grid(grid =>
                {
                    grid.Columns(2);
                    grid.Item().Text($"👤 Họ tên: {don.IdBenhNhanNavigation?.HoTen}");
                    grid.Item().Text($"📅 Ngày kê: {don.NgayKe:dd/MM/yyyy}");
                    grid.Item().Text($"🎂 Ngày sinh: {don.IdBenhNhanNavigation?.NgaySinh:dd/MM/yyyy}");
                    grid.Item().Text($"👨‍⚕️ Bác sĩ: {don.IdBacSiNavigation?.HoTen}");
                });

                stack.Item().PaddingVertical(15);

                // Bảng thuốc
                stack.Item().Table(table =>
                {
                    table.ColumnsDefinition(col =>
                    {
                        col.RelativeColumn(3);
                        col.RelativeColumn(1);
                        col.RelativeColumn(1);
                        col.RelativeColumn(1);
                        col.RelativeColumn(2);
                    });

                    table.Header(h =>
                    {
                        h.Cell().Background("#f5f5f5").Padding(6).Text("Tên thuốc").Bold();
                        h.Cell().Background("#f5f5f5").Padding(6).Text("SL").Bold();
                        h.Cell().Background("#f5f5f5").Padding(6).Text("Sáng").Bold();
                        h.Cell().Background("#f5f5f5").Padding(6).Text("Trưa").Bold();
                        h.Cell().Background("#f5f5f5").Padding(6).Text("Ghi chú").Bold();
                    });

                    foreach (var c in list)
                    {
                        table.Cell().Padding(6).Text(c.IdThuocNavigation?.Ten);
                        table.Cell().Padding(6).Text(c.SoLuong?.ToString() ?? "-");
                        table.Cell().Padding(6).Text(c.Sang?.ToString() ?? "-");
                        table.Cell().Padding(6).Text(c.Trua?.ToString() ?? "-");
                        table.Cell().Padding(6).Text(c.GhiChu ?? "");
                    }
                });

                // Lời dặn
                stack.Item().PaddingTop(20)
                    .Text($"📝 Lời dặn của bác sĩ: {don.GhiChu ?? "(Không)"}");

                // Chữ ký + con dấu
                stack.Item().PaddingTop(40).Row(r =>
                {
                    r.RelativeColumn().AlignLeft().Width(120)
                        .Image("wwwroot/stamps/clinic-stamp.png");

                    r.RelativeColumn().AlignRight().Stack(s =>
                    {
                        s.Item().Text("Chữ ký bác sĩ").Italic();
                        s.Item().Height(70)
                            .Image("wwwroot/signatures/doctor-sign.png", ImageScaling.FitHeight);
                        s.Item().Text(don.IdBacSiNavigation?.HoTen).Bold();
                    });
                });
            });
        }

        // ================================================
        // FOOTER
        // ================================================
        private void BuildFooter(IContainer container)
        {
            container.AlignCenter().PaddingTop(10).Text($"© Phòng khám Đa khoa – {DateTime.Now:dd/MM/yyyy HH:mm}");
        }

        // ================================================
        // QR CODE
        // ================================================
        private byte[] GenerateQrCode(string text)
        {
            using var generator = new QRCodeGenerator();
            var data = generator.CreateQrCode(text, QRCodeGenerator.ECCLevel.Q);

            using var qr = new QRCode(data);
            using var bmp = qr.GetGraphic(5);

            using var ms = new MemoryStream();
            bmp.Save(ms, System.Drawing.Imaging.ImageFormat.Png);
            return ms.ToArray();
        }
    }
}

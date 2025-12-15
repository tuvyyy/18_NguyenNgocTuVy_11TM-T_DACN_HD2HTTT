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
    [Route("api/pdf/dvkt")]
    public class ThucHienDVKTPDFController : ControllerBase
    {
        private readonly DACNDbContext _db;

        public ThucHienDVKTPDFController(DACNDbContext db)
        {
            _db = db;
            QuestPDF.Settings.License = LicenseType.Community;
        }

        // ============================================================================
        // EXPORT PDF KẾT QUẢ DVKT
        // ============================================================================
        [HttpGet("{idChiDinh}")]
        public async Task<IActionResult> Export(long idChiDinh)
        {
            var cd = await _db.ChiDinhDvkts
                .Include(x => x.IdLanKhamNavigation)
                .ThenInclude(lk => lk.IdBenhNhanNavigation)
                .Include(x => x.IdDvktNavigation)
                .FirstOrDefaultAsync(x => x.Id == idChiDinh);

            if (cd == null)
                return NotFound("Không tìm thấy chỉ định DVKT.");

            var bn = cd.IdLanKhamNavigation.IdBenhNhanNavigation;
            var dv = cd.IdDvktNavigation;

            // ----- KẾT QUẢ TỔNG -----
            var kq = await _db.DvktKetQuas
                .FirstOrDefaultAsync(x => x.IdChiDinhDvkt == idChiDinh);

            if (kq == null)
                return BadRequest("DVKT này chưa có kết quả.");

            // ----- CHỈ TIÊU -----
            var chiTieus = await (
                from ct in _db.DvktChiTieus
                join kqct in _db.DvktKetQuaChiTiets
                    on new { A = ct.Id, B = kq.Id }
                    equals new { A = kqct.IdChiTieu, B = kqct.IdKetQua } into grp
                from ctKq in grp.DefaultIfEmpty()
                where ct.IdDvkt == dv.Id
                orderby ct.ThuTu
                select new
                {
                    TenChiTieu = ct.TenChiTieu,
                    DonVi = ct.DonVi,
                    GioiHanThap = ct.GioiHanThap,
                    GioiHanCao = ct.GioiHanCao,
                    GiaTri = ctKq != null ? ctKq.GiaTri : null,
                    DanhGia = ctKq != null ? ctKq.DanhGia : null
                }
            ).ToListAsync();

            // QR
            var qrBytes = GenerateQrCode($"{bn.HoTen} | DVKT: {dv.TenDvkt} | ID: {idChiDinh}");

            // ----- BUILD PDF -----
            var pdf = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Margin(40);
                    page.Size(PageSizes.A4);
                    page.DefaultTextStyle(TextStyle.Default.FontFamily("Inter"));

                    page.Header().Element(c => BuildHeader(c, bn, dv, qrBytes));
                    page.Content().Element(c => BuildBody(c, bn, dv, chiTieus, kq));
                    page.Footer().Element(BuildFooter);
                });
            }).GeneratePdf();

            return File(pdf, "application/pdf", $"DVKT_{bn.HoTen}_{dv.MaDvkt}.pdf");
        }

        // ============================================================================
        // HEADER
        // ============================================================================
        private void BuildHeader(IContainer container, BenhNhan bn, Dvkt dv, byte[] qr)
        {
            container.Row(row =>
            {
                row.RelativeColumn().Stack(stack =>
                {
                    stack.Item().Text("PHÒNG KHÁM ĐA KHOA").Bold().FontSize(18);
                    stack.Item().Text("Địa chỉ: 123 Nguyễn Văn Cừ, TP.HCM");
                    stack.Item().Text("Điện thoại: 0123 456 789");

                    stack.Item().PaddingTop(10).Stack(info =>
                    {
                        info.Item().Text($"📌 Dịch vụ: {dv.TenDvkt} ({dv.MaDvkt})").Bold();
                        info.Item().Text($"👤 Bệnh nhân: {bn.HoTen}");
                        info.Item().Text($"🎂 Ngày sinh: {bn.NgaySinh:dd/MM/yyyy}");
                        info.Item().Text($"🆔 Mã BN: {bn.MaBn}");
                    });
                });

                row.ConstantColumn(90).Image(qr);
            });
        }

        // ============================================================================
        // BODY
        // ============================================================================
        private void BuildBody(IContainer container, BenhNhan bn, Dvkt dv,
            IEnumerable<dynamic> chiTieus, DvktKetQua kq)
        {
            container.Stack(stack =>
            {
                stack.Item().PaddingBottom(15).AlignCenter()
                    .Text("KẾT QUẢ XÉT NGHIỆM").FontSize(20).Bold();

                // TABLE
                stack.Item().Table(table =>
                {
                    table.ColumnsDefinition(col =>
                    {
                        col.RelativeColumn(3);
                        col.RelativeColumn(2);
                        col.RelativeColumn(2);
                        col.RelativeColumn(2);
                    });

                    table.Header(h =>
                    {
                        h.Cell().Background("#f5f5f5").Padding(6).Text("Chỉ tiêu").Bold();
                        h.Cell().Background("#f5f5f5").Padding(6).Text("Giá trị").Bold();
                        h.Cell().Background("#f5f5f5").Padding(6).Text("Giới hạn").Bold();
                        h.Cell().Background("#f5f5f5").Padding(6).Text("Đánh giá").Bold();
                    });

                    foreach (var ct in chiTieus)
                    {
                        table.Cell().Padding(6).Text((string)ct.TenChiTieu);
                        table.Cell().Padding(6).Text((string)(ct.GiaTri ?? "-"));
                        table.Cell().Padding(6).Text($"{ct.GioiHanThap} - {ct.GioiHanCao} {ct.DonVi}");
                        table.Cell().Padding(6).Text((string)(ct.DanhGia ?? "-"));
                    }
                });

                // KẾT LUẬN
                stack.Item().PaddingTop(20).Text("📄 Kết luận:").Bold();
                stack.Item().PaddingTop(5)
                    .Text((string)(kq.KetQuaText ?? "(Không có)"));

                // FILE KÈM THEO
                if (!string.IsNullOrWhiteSpace(kq.FileUrl))
                {
                    stack.Item().PaddingTop(15)
                        .Text($"📎 File đính kèm: {kq.FileUrl}");
                }

                // CHỮ KÝ
                stack.Item().PaddingTop(40).Row(r =>
                {
                    r.RelativeColumn().AlignLeft().Width(120)
                        .Image("wwwroot/stamps/clinic-stamp.png");

                    r.RelativeColumn().AlignRight().Stack(s =>
                    {
                        s.Item().Text("Chữ ký kỹ thuật viên").Italic();
                        s.Item().Height(70)
                            .Image("wwwroot/signatures/doctor-sign.png", ImageScaling.FitHeight);
                    });
                });
            });
        }

        // ============================================================================
        // FOOTER
        // ============================================================================
        private void BuildFooter(IContainer container)
        {
            container.AlignCenter()
                .PaddingTop(10)
                .Text($"© Phòng khám Đa khoa – {DateTime.Now:dd/MM/yyyy HH:mm}");
        }

        // ============================================================================
        // QR CODE
        // ============================================================================
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

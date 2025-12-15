using System;
using System.Linq;
using DACN_QLPK_1150070050_NguyenNgocTuVy.Data;

namespace DACN_QLPK_1150070050_NguyenNgocTuVy.Services
{
    public interface ICodeGenerator
    {
        /// <summary>
        /// Sinh mã dạng: PREFIX-yyyyMMdd-000001
        /// </summary>
        /// <param name="prefix">Tiền tố định danh (ví dụ: HD, BN, DT...)</param>
        /// <returns>Mã sinh tự động, duy nhất trong ngày</returns>
        string GenMa(string prefix);
    }

    public class CodeGenerator : ICodeGenerator
    {
        private readonly DACNDbContext _db;

        public CodeGenerator(DACNDbContext db)
        {
            _db = db;
        }

        // =======================
        // TẠO MÃ KHÔNG BAO GIỜ TRÙNG
        // PREFIX-yyyyMMdd-000001
        // =======================
        public string GenMa(string prefix)
        {
            if (string.IsNullOrWhiteSpace(prefix))
                prefix = "XX";

            string today = DateTime.Now.ToString("yyyyMMdd");
            string prefixToday = $"{prefix}-{today}";

            IQueryable<string> query;

            // ===========================
            // 🔥 QUY TẮC:
            // - HS → bảng Hồ Sơ Bệnh Án
            // - BN → bảng Bệnh Nhân
            // - HD*, HDKHAM, HDCLS, HDTHUOC → bảng Hóa Đơn
            // ===========================

            if (prefix == "HS")
            {
                query = _db.HoSoBenhAns
                    .Where(x => x.MaHs.StartsWith(prefixToday))
                    .Select(x => x.MaHs);
            }
            else if (prefix == "BN")
            {
                query = _db.BenhNhans
                    .Where(x => x.MaBn.StartsWith(prefixToday))
                    .Select(x => x.MaBn);
            }
            else if (prefix.StartsWith("HD"))
            {
                query = _db.HoaDons
                    .Where(x => x.MaHd.StartsWith(prefixToday))
                    .Select(x => x.MaHd);
            }
            else
            {
                // fallback: nếu prefix lạ thì dùng bảng Hóa Đơn
                query = _db.HoaDons
                    .Where(x => x.MaHd.StartsWith(prefixToday))
                    .Select(x => x.MaHd);
            }

            var existingCodes = query.ToList();

            int next = 1;
            if (existingCodes.Any())
            {
                next = existingCodes
                    .Select(code => int.Parse(code.Split('-').Last()))
                    .Max() + 1;
            }

            return $"{prefixToday}-{next:000000}";
        }
    }
}

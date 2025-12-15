import React, { useEffect, useState } from "react";
import axios from "axios";
import MainLayout from "../layouts/MainLayout";
import { useLocation, useNavigate } from "react-router-dom"; // ✅ dùng để nhận dữ liệu truyền sang

export default function ChiDinhKham() {
  const location = useLocation();
  const navigate = useNavigate();
  const patient = location.state?.patient; // ✅ lấy thông tin bệnh nhân truyền sang
  const onBack = () => navigate(-1);
  const onNextToThuNgan = (p) => navigate("/thu-ngan", { state: { patient: p } });

  // ========================= STATES =========================
  const [dichVuList, setDichVuList] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // ========================= LOAD DATA =========================
  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const res = await axios.get("https://localhost:7007/api/chidinh/clinics/prices");
        setDichVuList(res.data || []);
      } catch (err) {
        console.error("❌ Lỗi tải danh sách phòng khám:", err);
      }
    };
    fetchClinics();
  }, []);

  // ========================= CHỌN DỊCH VỤ =========================
  const toggleSelect = (dv) => {
    if (selected.some((item) => item.idDichVu === dv.idDichVu)) {
      setSelected(selected.filter((item) => item.idDichVu !== dv.idDichVu));
    } else {
      setSelected([...selected, dv]);
    }
  };

  const total = selected.reduce((sum, item) => sum + (item.donGia || 0), 0);

  const startIdx = (currentPage - 1) * pageSize;
  const currentData = dichVuList.slice(startIdx, startIdx + pageSize);
  const totalPages = Math.ceil(dichVuList.length / pageSize);

  // ========================= GỬI CHỈ ĐỊNH KHÁM =========================
  const handleSave = async () => {
    if (!patient || !patient.idBenhNhan || !patient.idHoSo) {
      alert("⚠️ Thiếu thông tin bệnh nhân hoặc hồ sơ!");
      return;
    }
    if (selected.length === 0) {
      alert("⚠️ Vui lòng chọn ít nhất một dịch vụ!");
      return;
    }

    try {
      setLoading(true);
      const reqBody = {
        idBenhNhan: patient.idBenhNhan,
        idHoSo: patient.idHoSo,
        idThuNgan: 10005, // tạm fix (sau sẽ lấy từ userInfo)
        idPhongChon: selected.map((x) => x.idPhong),
        ghiChu: "Chỉ định khám tự động từ tiếp đón",
      };

      const res = await axios.post("https://localhost:7007/api/chidinh", reqBody);
      console.log("✅ Kết quả tạo chỉ định:", res.data);

      alert(
        `✅ Chỉ định thành công!\nMã hoá đơn: ${res.data.maHd}\nTổng tiền: ${res.data.tongTien.toLocaleString()} đ`
      );
      setSelected([]);

      // 👉 CHUYỂN TRANG QUA THU NGÂN
      onNextToThuNgan(patient);
    } catch (err) {
      console.error("❌ Lỗi lưu chỉ định:", err);
      alert("❌ Lỗi khi lưu chỉ định khám. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // ========================= GIAO DIỆN =========================
  return (
    <MainLayout>
      <div className="flex flex-col lg:flex-row gap-4">
        {/* ====================== BÊN TRÁI ====================== */}
        <div className="flex-1 flex flex-col bg-white rounded-lg shadow-lg border border-gray-200 p-3 animate-fadeSlide">
          {/* --- Thông tin bệnh nhân --- */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-3">
            {!patient ? (
  <p className="text-sm text-gray-500 italic">
    ⚠️ Không có dữ liệu bệnh nhân. Vui lòng quay lại trang Tiếp đón.
  </p>
) : (
  <div className="grid grid-cols-1 md:grid-cols-2 text-sm gap-y-1 text-gray-700">
    <div><b>👤 Bệnh nhân:</b> {patient.hoTen} ({patient.gioiTinh})</div>
    <div><b>Ngày sinh:</b> {patient.ngaySinh}</div>
    <div><b>Địa chỉ:</b> {patient.diaChi}</div>
    <div><b>SĐT:</b> {patient.soDienThoai}</div>
    <div><b>Mã HS:</b> <span className="text-blue-600 font-semibold">{patient.maHs}</span></div>
    <div><b>Mã BN:</b> <span className="text-blue-600 font-semibold">{patient.maBn}</span></div>
  </div>
)}
          </div>

          {/* --- Bảng dịch vụ --- */}
          <h2 className="text-[#0077B6] font-semibold text-sm mb-2">Chỉ định dịch vụ</h2>

          <div className="flex justify-between items-center mb-2">
            <input
              type="text"
              placeholder="Tìm tên dịch vụ hoặc phòng..."
              className="border rounded-md px-3 py-1 w-1/2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
            />
            <select className="border rounded-md px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-400">
              <option>Tất cả</option>
              <option>Khám</option>
              <option>Xét nghiệm</option>
              <option>Chẩn đoán hình ảnh</option>
            </select>
          </div>

          {/* Danh sách dịch vụ */}
          <div className="overflow-y-auto border rounded-md" style={{ height: "300px" }}>
            <table className="w-full text-sm border-collapse">
              <thead className="sticky top-0 bg-blue-100">
                <tr className="text-gray-700 text-center">
                  <th className="border p-1 w-[10%]">Mã DV</th>
                  <th className="border p-1 text-left w-[45%]">Tên dịch vụ</th>
                  <th className="border p-1 w-[15%]">Đơn giá</th>
                  <th className="border p-1 w-[20%]">Phòng</th>
                  <th className="border p-1 w-[10%]">Chọn</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((dv) => (
                  <tr
                    key={dv.idDichVu}
                    className="hover:bg-blue-50 transition cursor-pointer"
                    onClick={() => toggleSelect(dv)}
                  >
                    <td className="border p-1 text-center">DV{dv.idDichVu}</td>
                    <td className="border p-1">{dv.tenDichVu}</td>
                    <td className="border p-1 text-right text-gray-700">
                      {dv.donGia?.toLocaleString()} đ
                    </td>
                    <td className="border p-1 text-center text-gray-600">{dv.tenPhong}</td>
                    <td className="border p-1 text-center">
                      <input
                        type="checkbox"
                        checked={selected.some((item) => item.idDichVu === dv.idDichVu)}
                        onChange={() => toggleSelect(dv)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Phân trang */}
          <div className="flex justify-center items-center gap-2 mt-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              «
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 text-sm rounded ${
                  currentPage === i + 1
                    ? "bg-[#0077B6] text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              »
            </button>
          </div>
        </div>

        {/* ====================== BÊN PHẢI ====================== */}
        <div className="w-full lg:w-1/3 flex flex-col bg-white rounded-lg shadow-lg border border-gray-200 p-3 animate-fadeSlide relative">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-[#0077B6] font-semibold text-sm">Dịch vụ đã chọn</h2>
            <span className="text-xs text-gray-500">{selected.length} mục</span>
          </div>

          {/* Danh sách dịch vụ đã chọn */}
          <div
            className="border rounded-md overflow-y-auto"
            style={{ maxHeight: "430px", minHeight: "430px" }}
          >
            {selected.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-4 italic">
                Chưa chọn dịch vụ nào
              </p>
            ) : (
              <table className="w-full text-sm border-collapse">
                <thead className="sticky top-0 bg-blue-50">
                  <tr>
                    <th className="border p-1 w-8">#</th>
                    <th className="border p-1 text-left">Tên dịch vụ</th>
                    <th className="border p-1">Giá</th>
                    <th className="border p-1">Xóa</th>
                  </tr>
                </thead>
                <tbody>
                  {selected.map((dv, i) => (
                    <tr key={dv.idDichVu} className="hover:bg-gray-50">
                      <td className="border p-1 text-center">{i + 1}</td>
                      <td className="border p-1">{dv.tenDichVu}</td>
                      <td className="border p-1 text-right">{dv.donGia?.toLocaleString()} đ</td>
                      <td
                        className="border p-1 text-center text-red-600 cursor-pointer hover:text-red-800"
                        onClick={() => toggleSelect(dv)}
                      >
                        ✕
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Tổng tiền + nút hành động */}
          <div className="mt-auto border-t pt-2 absolute bottom-3 left-3 right-3 bg-white">
            <p className="text-xs text-gray-600">
              Ghi chú: Số tiền chính xác xác định tại quầy thu ngân sau khi áp dụng giảm giá.
            </p>
            <div className="flex justify-between items-center mt-2">
              <span className="font-semibold text-gray-700">Tổng tiền:</span>
              <span className="text-red-600 font-bold text-lg">
                {total.toLocaleString()} đ
              </span>
            </div>
            <div className="flex justify-end gap-2 mt-3">
              <button
                onClick={onBack}
                className="bg-gray-300 text-gray-800 px-4 py-1 rounded-md text-sm font-medium hover:bg-gray-400 transition"
              >
                ← Quay lại
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className={`bg-[#0077B6] text-white px-4 py-1 rounded-md text-sm font-medium transition ${
                  loading ? "opacity-60 cursor-not-allowed" : "hover:bg-blue-700"
                }`}
              >
                💾 {loading ? "Đang lưu..." : "Lưu dịch vụ"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

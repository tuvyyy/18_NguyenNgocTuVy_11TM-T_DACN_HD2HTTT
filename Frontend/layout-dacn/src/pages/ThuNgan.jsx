  import React, { useEffect, useState } from "react";
  import { loadWaitingPatients, handleViewBill } from "../controllers/ThuNganController";
  import { useNavigate } from "react-router-dom";
  import { Eye, Search, Filter } from "lucide-react";
import MainLayout from "../layouts/MainLayout";

  export default function ThuNgan() {
    const [patients, setPatients] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [status, setStatus] = useState("TAT_CA");
    const [type, setType] = useState("TAT_CA");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const navigate = useNavigate();

    // 🧩 Load dữ liệu khi khởi tạo
    useEffect(() => {
      loadWaitingPatients("", (data) => {
        setPatients(data);
        setFiltered(data);
      });
    }, []);

    // 🧮 Tính số liệu thống kê
    const stats = {
      total: patients.length,
      paid: patients.filter((x) => x.trangThai === "DA_THANH_TOAN").length,
      unpaid: patients.filter((x) => x.trangThai !== "DA_THANH_TOAN").length,
      kham: patients.filter((x) => x.loaiHoaDon === "KHAM" && x.trangThai === "DA_THANH_TOAN").length,
      dvkt: patients.filter((x) => x.loaiHoaDon === "DVKT" && x.trangThai === "DA_THANH_TOAN").length,
      thuoc: patients.filter((x) => x.loaiHoaDon === "THUOC" && x.trangThai === "DA_THANH_TOAN").length,
    };

    // 🧠 Bộ lọc
    const applyFilters = () => {
      let data = [...patients];

      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        data = data.filter(
          (x) =>
            x.hoTen.toLowerCase().includes(term) ||
            x.maHoaDon.toLowerCase().includes(term) ||
            x.soDienThoai?.toLowerCase().includes(term)
        );
      }

      if (status !== "TAT_CA") {
    if (status === "CHUA_THANH_TOAN") {
      data = data.filter(
        (x) => x.trangThai === "CHUA_THANH_TOAN" || x.trangThai === "TAO"
      );
    } else {
      data = data.filter((x) => x.trangThai === status);
    }
  }
/* ⭐⭐⭐ THÊM ĐOẠN NÀY ⭐⭐⭐ */
if (type !== "TAT_CA") {
  data = data.filter((x) => x.loaiHoaDon === type);
}

      if (dateFrom) {
        data = data.filter((x) => new Date(x.ngayTao) >= new Date(dateFrom));
      }
      if (dateTo) {
        data = data.filter((x) => new Date(x.ngayTao) <= new Date(dateTo));
      }

      setFiltered(data);
    };

    // 🧩 Auto update khi thay đổi filter
    useEffect(() => {
      applyFilters();
    }, [searchTerm, status, type, dateFrom, dateTo, patients]);

    return (
      <MainLayout>
      <div className="p-6">

        {/* Bộ lọc */}
        <div className="bg-white p-4 rounded-lg shadow mb-5 space-y-3">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm text-gray-600">Tìm kiếm hồ sơ / mã / tên / SĐT</label>
              <div className="flex items-center gap-2 border rounded px-2">
                <Search size={16} className="text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 py-1 outline-none text-sm"
                  placeholder="Nhập thông tin cần tìm..."
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-600">Trạng thái</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border rounded px-2 py-1 text-sm"
              >
                <option value="TAT_CA">Tất cả</option>
                <option value="CHUA_THANH_TOAN">Chưa thanh toán</option>
                <option value="DA_THANH_TOAN">Đã thanh toán</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-600">Loại hóa đơn</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full border rounded px-2 py-1 text-sm"
              >
                <option value="TAT_CA">Tất cả</option>
                <option value="KHAM">Khám</option>
                <option value="DVKT">Dịch vụ kỹ thuật</option>
                <option value="THUOC">Thuốc</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-600">Từ ngày</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Đến ngày</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              />
            </div>

            <button
              onClick={applyFilters}
              className="bg-sky-500 hover:bg-sky-600 text-white px-3 py-2 rounded text-sm flex items-center gap-1"
            >
              <Filter size={14} /> Lọc
            </button>
          </div>
        </div>

        {/* Thống kê */}
        <div className="flex flex-wrap gap-3 mb-5">
          <div className="bg-cyan-100 text-cyan-700 px-4 py-2 rounded-lg shadow">
            Tổng phiếu thu: <b>{stats.total}</b>
          </div>
          <div className="bg-orange-100 text-orange-700 px-4 py-2 rounded-lg shadow">
            Chưa thanh toán: <b>{stats.unpaid}</b>
          </div>
          <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg shadow">
            Đã thanh toán: <b>{stats.paid}</b>
          </div>
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg shadow">
            Đã TT Khám: <b>{stats.kham}</b>
          </div>
          <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg shadow">
            Đã TT DVKT: <b>{stats.dvkt}</b>
          </div>
          <div className="bg-pink-100 text-pink-700 px-4 py-2 rounded-lg shadow">
            Đã TT Thuốc: <b>{stats.thuoc}</b>
          </div>
        </div>

        {/* Danh sách */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="w-full text-sm border">
            <thead className="bg-sky-50 text-sky-700">
              <tr>
                <th className="p-2 border">Mã HĐ</th>
                <th className="p-2 border">Họ tên</th>
                <th className="p-2 border">SĐT</th>
                <th className="p-2 border">Phòng khám</th>
                <th className="p-2 border">Loại HĐ</th>
                <th className="p-2 border text-right">Tổng tiền</th>
                <th className="p-2 border">Ngày tạo</th>
                <th className="p-2 border">Trạng thái</th>
                <th className="p-2 border text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((p, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition">
                    <td className="p-2 border text-gray-700">{p.maHoaDon}</td>
                    <td className="p-2 border font-medium">{p.hoTen}</td>
                    <td className="p-2 border">{p.soDienThoai}</td>
                    <td className="p-2 border">{p.phongKham}</td>
                    <td className="p-2 border">{p.loaiHoaDon}</td>
                    <td className="p-2 border text-right text-blue-600">
                      {p.tongTien?.toLocaleString()} ₫
                    </td>
                    <td className="p-2 border text-gray-500">
                      {new Date(p.ngayTao).toLocaleDateString("vi-VN")}
                    </td>
                    <td
                      className={`p-2 border text-center font-semibold ${
                        p.trangThai === "DA_THANH_TOAN"
                          ? "text-green-600"
                          : "text-orange-500"
                      }`}
                    >
                      {p.trangThai === "DA_THANH_TOAN"
                        ? "Đã thanh toán"
                        : "Chưa thanh toán"}
                    </td>
                    <td className="p-2 border text-center">
                      <button
                        onClick={() => handleViewBill(p.maHoaDon, navigate)}
                        className="text-sky-600 hover:text-sky-800"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center text-gray-500 py-4">
                    Không có dữ liệu phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      </MainLayout>
    );
  }

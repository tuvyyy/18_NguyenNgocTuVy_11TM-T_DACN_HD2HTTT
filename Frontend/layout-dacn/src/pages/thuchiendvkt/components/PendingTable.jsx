import React, { useState, useMemo } from "react";

export default function PendingTable({ data, onReceive }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // ===========================
  // 1) Tính tuổi
  // ===========================
  const calcAge = (dob) => {
    if (!dob) return "";
    return new Date().getFullYear() - new Date(dob).getFullYear();
  };

  // ===========================
  // 2) SEARCH FILTER
  // ===========================
  const filtered = useMemo(() => {
    if (!data) return [];
    return data.filter(
      (item) =>
        item.benhNhan.toLowerCase().includes(search.toLowerCase()) ||
        item.maBenhNhan.toLowerCase().includes(search.toLowerCase()) ||
        item.tenDvkt.toLowerCase().includes(search.toLowerCase()) ||
        item.maDvkt.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, data]);

  // ===========================
  // 3) PAGINATION
  // ===========================
  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize) || 1;

  const slice = useMemo(() => {
    return filtered.slice((page - 1) * pageSize, page * pageSize);
  }, [filtered, page]);

  const goPage = (p) => {
    if (p >= 1 && p <= totalPages) setPage(p);
  };

  // ===========================
  // 4) Render nếu không có dữ liệu
  // ===========================
  if (!data || data.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        Không có DVKT nào đang chờ thực hiện.
      </div>
    );
  }

  // ===========================
  // 5) RENDER TABLE
  // ===========================
  return (
    <div className="bg-white rounded-xl shadow p-4 animate-fadeIn h-full flex flex-col">

      {/* Search */}
      <div className="mb-3">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="🔍 Tìm kiếm bệnh nhân / DVKT..."
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
        />
      </div>

      {/* Table wrapper scroll */}
      <div className="relative flex-1 overflow-auto rounded-lg border">
        <table className="min-w-max text-sm">
          <thead className="sticky top-0 bg-sky-50 text-sky-700 shadow z-10">
            <tr>
              <th className="px-3 py-2 border">Mã BN</th>
              <th className="px-3 py-2 border">Tên bệnh nhân</th>
              <th className="px-3 py-2 border">Tuổi</th>
              <th className="px-3 py-2 border">Mã DV</th>
              <th className="px-3 py-2 border">Tên DVKT</th>
              <th className="px-3 py-2 border">SL</th>
              <th className="px-3 py-2 border">Phòng</th>
              <th className="px-3 py-2 border">Tầng</th>
              <th className="px-3 py-2 border text-center">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {slice.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-blue-50 transition cursor-pointer"
              >
                <td className="px-3 py-2 border">{item.maBenhNhan}</td>
                <td className="px-3 py-2 border font-medium text-gray-700">
                  {item.benhNhan}
                </td>
                <td className="px-3 py-2 border">{calcAge(item.ngaySinh)}</td>

                <td className="px-3 py-2 border">{item.maDvkt}</td>
                <td className="px-3 py-2 border">{item.tenDvkt}</td>
                <td className="px-3 py-2 border text-center">{item.soLuong}</td>
                <td className="px-3 py-2 border">{item.phong}</td>
                <td className="px-3 py-2 border text-center">{item.tang}</td>

                <td className="px-3 py-2 border text-center">
                  <button
                    onClick={() => onReceive(item.id)}
                    className="px-3 py-1 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm shadow-sm"
                  >
                    Nhận
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-3 flex justify-between items-center text-sm">
        <span className="text-gray-600">
          Trang {page}/{totalPages} ({total} mục)
        </span>

        <div className="flex gap-2">
          <button
            onClick={() => goPage(page - 1)}
            className="px-3 py-1 border rounded hover:bg-gray-100"
          >
            ←
          </button>
          <button
            onClick={() => goPage(page + 1)}
            className="px-3 py-1 border rounded hover:bg-gray-100"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}

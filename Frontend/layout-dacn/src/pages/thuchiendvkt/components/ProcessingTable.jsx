// ==========================================================
// 📌 ProcessingTable.jsx — DVKT Đang Thực Hiện (UI PRO VERSION)
// ==========================================================
import React, { useState, useMemo } from "react";
import { ThucHienDVKTController } from "../../../controllers/ThucHienDVKTController";

export default function ProcessingTable({ data, onComplete, onCancel }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // ===========================
  // 🔍 FILTER SEARCH
  // ===========================
  const filtered = useMemo(() => {
    if (!data) return [];
    return data.filter(
      (item) =>
        (item.benhNhan || "").toLowerCase().includes(search.toLowerCase()) ||
        (item.maBenhNhan || "").toLowerCase().includes(search.toLowerCase()) ||
        (item.tenDvkt || "").toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  // ===========================
  // 📄 PAGINATION
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
  // Nếu không có dữ liệu
  // ===========================
  if (!data || data.length === 0)
    return (
      <div className="text-gray-600 italic p-4 text-center">
        Không có DVKT nào đang được thực hiện.
      </div>
    );

  // ===========================
  // RENDER TABLE
  // ===========================
  return (
    <div className="bg-white rounded-xl shadow p-4 h-full flex flex-col animate-fadeIn">

      {/* Search */}
      <div className="mb-3">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="🔍 Tìm bệnh nhân / DVKT..."
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
        />
      </div>

      {/* Wrapper scroll */}
      <div className="relative flex-1 overflow-auto rounded-lg border">
        <table className="min-w-max text-sm">
          <thead className="sticky top-0 bg-sky-50 text-sky-700 shadow z-10">
            <tr>
              <th className="px-3 py-2 border">Mã BN</th>
              <th className="px-3 py-2 border">Tên bệnh nhân</th>
              <th className="px-3 py-2 border">Tên DVKT</th>
              <th className="px-3 py-2 border">Phòng</th>
              <th className="px-3 py-2 border">Nhận lúc</th>
              <th className="px-3 py-2 border text-center">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {slice.map((item) => (
              <tr
                key={item.id}
                className="border-t hover:bg-blue-50 transition cursor-pointer"
              >
                <td className="px-3 py-2 border font-medium text-gray-800">
                  {item.maBenhNhan || "—"}
                </td>

                <td className="px-3 py-2 border">{item.benhNhan || "—"}</td>

                <td className="px-3 py-2 border text-gray-700">{item.tenDvkt}</td>

                <td className="px-3 py-2 border">{item.phong || "—"}</td>

                <td className="px-3 py-2 border">
                  {item.nhanLuc
                    ? new Date(item.nhanLuc).toLocaleString()
                    : "—"}
                </td>

                <td className="px-3 py-2 border text-center flex gap-2 justify-center">

                  {/* Trả KQ */}
                  <button
                    className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded shadow-sm"
                    onClick={() =>
                      window.dispatchEvent(
                        new CustomEvent("openTraKetQua", { detail: item })
                      )
                    }
                  >
                    Trả KQ
                  </button>

                  {/* Hoàn thành */}
                  <button
                    className="px-2 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded shadow-sm"
                    onClick={() =>
                      ThucHienDVKTController.handleHoanThanh(
                        item.id,
                        onComplete
                      )
                    }
                  >
                    Hoàn thành
                  </button>

                  {/* Hủy nhận */}
                  <button
                    className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded shadow-sm"
                    onClick={() =>
                      ThucHienDVKTController.handleHuyNhan(item.id, onCancel)
                    }
                  >
                    Hủy
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

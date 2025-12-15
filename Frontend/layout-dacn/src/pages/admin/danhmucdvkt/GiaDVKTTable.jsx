import React, { useState } from "react";

export default function GiaDVKTTable({ data = [], dvkt, onAdd, onEdit }) {
  const pageSize = 5; // số dòng mỗi trang
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(data.length / pageSize);
  const start = (page - 1) * pageSize;
  const pageData = data.slice(start, start + pageSize);

  return (
    <div className="bg-white rounded-xl shadow-md border border-pink-100 h-full flex flex-col">
      {/* HEADER */}
      <div className="px-4 py-2 border-b flex items-center justify-between">
        <h2 className="text-sm font-semibold text-pink-700">
          Giá: {dvkt.tenDvkt} ({dvkt.maDvkt})
        </h2>

        <button
          onClick={onAdd}
          className="px-3 py-1 rounded-md bg-emerald-500 text-white hover:bg-emerald-600"
        >
          + Thêm giá
        </button>
      </div>

      {/* TABLE */}
      <div className="p-2 flex-1">
        <table className="min-w-full text-sm">
          <thead className="bg-pink-50 text-pink-700 sticky top-0">
            <tr>
              <th className="p-2">#</th>
              <th className="p-2 text-left">Đơn giá</th>
              <th className="p-2 text-left">Ngày áp dụng</th>
              <th className="p-2 text-center">HĐ</th>
            </tr>
          </thead>

          <tbody>
            {pageData.map((row, i) => (
              <tr key={row.id} className="border-b hover:bg-pink-50">
                <td className="px-2 py-1 text-center">{start + i + 1}</td>
                <td className="px-2 py-1">
                  {row.donGia?.toLocaleString()} VNĐ
                </td>
                <td className="px-2 py-1">{row.tuNgay}</td>
                <td className="px-2 py-1 text-center">
                  <button
                    className="px-3 py-1 rounded-md bg-yellow-400 hover:bg-yellow-500"
                    onClick={() => onEdit(row)}
                  >
                    Sửa
                  </button>
                </td>
              </tr>
            ))}

            {data.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  Chưa có giá DVKT
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {data.length > 0 && (
        <div className="p-2 border-t flex items-center justify-between">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-40"
          >
            ← Trước
          </button>

          <span className="text-sm">
            Trang {page}/{totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-40"
          >
            Sau →
          </button>
        </div>
      )}
    </div>
  );
}

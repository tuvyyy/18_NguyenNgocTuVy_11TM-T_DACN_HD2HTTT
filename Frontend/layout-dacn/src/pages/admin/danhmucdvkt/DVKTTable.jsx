import React, { useState, useMemo } from "react";

export default function DVKTTable({
  data = [],
  onSelect,
  selectedId,
  onEdit,
  onToggle,
}) {
  // ===========================
  // PHÂN TRANG FE-ONLY
  // ===========================
  const pageSize = 10; // mỗi trang 10 dòng — muốn đổi thì sửa đây
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(data.length / pageSize);

  const pageData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, page]);

  const goPrev = () => setPage((p) => (p > 1 ? p - 1 : 1));
  const goNext = () => setPage((p) => (p < totalPages ? p + 1 : totalPages));

  // ===========================

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-3 text-sky-700">Danh sách DVKT</h2>

      <div className="overflow-auto max-h-[600px]">
        <table className="w-full text-sm">
          <thead className="bg-sky-100 text-sky-700">
            <tr>
              <th className="p-2">Mã</th>
              <th className="p-2">Tên DVKT</th>
              <th className="p-2">Nhóm</th>
              <th className="p-2">Đơn vị</th>
              <th className="p-2">Tình trạng</th>
              <th className="p-2 w-24">#</th>
            </tr>
          </thead>

          <tbody>
            {pageData.map((row) => (
              <tr
                key={row.id}
                className={`border-b hover:bg-sky-50 cursor-pointer ${
                  row.id === selectedId ? "bg-sky-100" : ""
                }`}
                onClick={() => onSelect(row)}
              >
                <td className="p-2">{row.maDvkt}</td>
                <td className="p-2">{row.tenDvkt}</td>
                <td className="p-2">{row.nhom}</td>
                <td className="p-2">{row.donVi}</td>

                <td className="p-2">
                  {row.hoatDong ? (
                    <span className="text-emerald-600 font-semibold">Hoạt động</span>
                  ) : (
                    <span className="text-red-500 font-semibold">Khóa</span>
                  )}
                </td>

                <td className="p-2 flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(row);
                    }}
                    className="px-2 py-1 bg-yellow-400 rounded-md text-white"
                  >
                    Sửa
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggle(row);
                    }}
                    className={`px-2 py-1 rounded-md text-white ${
                      row.hoatDong ? "bg-red-500" : "bg-emerald-500"
                    }`}
                  >
                    {row.hoatDong ? "Khóa" : "Mở"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ======================== */}
      {/* PHÂN TRANG */}
      {/* ======================== */}
      <div className="flex justify-center items-center gap-3 mt-4">
        <button
          onClick={goPrev}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="font-medium">
          Trang {page} / {totalPages}
        </span>

        <button
          onClick={goNext}
          disabled={page === totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

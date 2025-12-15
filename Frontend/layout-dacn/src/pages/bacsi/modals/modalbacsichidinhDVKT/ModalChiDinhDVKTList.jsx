import React, { useState, useEffect } from "react";

export default function ModalChiDinhDVKTList({
  ds,
  filterLoai,
  search,
  selected,
  toggleSelect,
}) {
  // ======================================================
  // 1) PAGINATION
  // ======================================================
  const pageSize = 12;
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [filterLoai, search, ds]);

  // ======================================================
  // 2) COLUMN TOGGLE (ẩn/hiện cột)
  // ======================================================
  const [columns, setColumns] = useState({
    ma: true,
    ten: true,
    phong: true,
    tang: true,
    donGia: true,
  });

  const [openCols, setOpenCols] = useState(false);

  // ======================================================
  // 3) FILTER DVKT
  // ======================================================
  const filtered = ds.filter((item) => {
    const matchLoai =
      filterLoai === "all" || String(item.loai) === String(filterLoai);

    const str = search.toLowerCase();
    const matchSearch =
      item.tenDvkt.toLowerCase().includes(str) ||
      item.maDvkt.toLowerCase().includes(str);

    return matchLoai && matchSearch;
  });

  // ======================================================
  // 4) PAGED DATA
  // ======================================================
  const totalPages = Math.ceil(filtered.length / pageSize);
  const pagedData = filtered.slice((page - 1) * pageSize, page * pageSize);

  // ======================================================
  // 5) RENDER
  // ======================================================
  return (
    <div className="flex flex-col flex-1 max-h-[64vh] relative">

      {/* BUTTON: Điều chỉnh cột */}
      <div className="flex justify-end mb-2 pr-1">
        <button
          onClick={() => setOpenCols(!openCols)}
          className="px-2 py-1 border rounded bg-white hover:bg-gray-200 text-sm"
        >
          ⚙ Điều chỉnh cột
        </button>
      </div>

      {/* POPUP CHỌN CỘT */}
      {openCols && (
        <div className="absolute right-2 top-10 bg-white border rounded shadow-lg p-3 z-50 w-48 animate-fadeIn">
          <div className="space-y-2 text-sm">
            {Object.keys(columns).map((key) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={columns[key]}
                  onChange={() =>
                    setColumns({ ...columns, [key]: !columns[key] })
                  }
                />
                {{
                  ma: "Mã DVKT",
                  ten: "Tên DVKT",
                  phong: "Phòng",
                  tang: "Tầng",
                  donGia: "Đơn giá",
                }[key]}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* TABLE */}
      <div className="flex-1 overflow-y-auto overflow-x-auto border rounded">
        <table className="min-w-max text-sm whitespace-nowrap">
          <thead className="bg-blue-50 text-blue-700 sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="p-2 w-10"></th>

              {columns.ma && <th className="p-2">Mã dịch vụ</th>}
              {columns.ten && <th className="p-2">Tên dịch vụ</th>}
              {columns.phong && <th className="p-2">Phòng</th>}
              {columns.tang && <th className="p-2">Tầng</th>}
              {columns.donGia && <th className="p-2 text-right">Giá</th>}
            </tr>
          </thead>

          <tbody>
            {pagedData.map((item) => {
              const isSel = selected.some((s) => s.id === item.id);

              return (
                <tr
key={`${item.id}-${item.maDvkt}-${item.tenPhong || ""}`}
                  onClick={() => toggleSelect(item)}
                  className={`border-b cursor-pointer transition-all hover:bg-gray-100 ${
                    isSel ? "bg-green-50 font-semibold" : ""
                  }`}
                >
                  <td className="p-2 text-center">
                    <input
                      type="checkbox"
                      checked={isSel}
                      readOnly
                      className="pointer-events-none"
                    />
                  </td>

                  {columns.ma && <td className="p-2">{item.maDvkt}</td>}
                  {columns.ten && <td className="p-2">{item.tenDvkt}</td>}
                  {columns.phong && (
                    <td className="p-2">{item.phong?.tenPhong || "-"}</td>
                  )}
                  {columns.tang && (
                    <td className="p-2 text-center">{item.phong?.tang || "-"}</td>
                  )}
                  {columns.donGia && (
                    <td className="p-2 text-right">
                      {item.donGia?.toLocaleString("vi-VN")} đ
                    </td>
                  )}
                </tr>
              );
            })}

            {pagedData.length === 0 && (
              <tr>
                <td colSpan="6" className="p-3 text-center text-gray-500 italic">
                  Không có dịch vụ phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-2 px-2 py-1 text-sm">
          <button
            className="px-3 py-1 border rounded-md bg-white hover:bg-gray-100 disabled:opacity-40"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            ← Trước
          </button>

          <span className="font-medium">
            Trang {page}/{totalPages}
          </span>

          <button
            className="px-3 py-1 border rounded-md bg-white hover:bg-gray-100 disabled:opacity-40"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Sau →
          </button>
        </div>
      )}
    </div>
  );
}

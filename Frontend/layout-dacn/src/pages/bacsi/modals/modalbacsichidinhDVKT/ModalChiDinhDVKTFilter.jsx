import React from "react";

export default function ModalChiDinhDVKTFilter({
  filterLoai,
  setFilterLoai,
  search,
  setSearch,
}) {
  return (
    <div className="p-3 border-b bg-gray-50 flex gap-3 items-center">
      <select
        value={filterLoai}
        onChange={(e) => setFilterLoai(e.target.value)}
        className="border rounded-md px-2 py-1 text-sm"
      >
        <option value="all">Tất cả loại phiếu</option>
        <option value="1">Xét nghiệm</option>
        <option value="2">Chẩn đoán hình ảnh</option>
        <option value="3">Kỹ thuật khác</option>
      </select>

      <input
        type="text"
        placeholder="Chọn dịch vụ..."
        className="border px-2 py-1 rounded-md text-sm flex-1"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}

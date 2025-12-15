import React from "react";

export default function DVKTFilter({
  nhomList = [],
  filters = {},
  onChange = () => {},   // ⭐ FIX: đảm bảo không bao giờ undefined
  onAdd = () => {},      // ⭐ FIX: tránh lỗi khi không truyền
}) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-sky-100 p-4 flex flex-col md:flex-row items-center gap-3">
      
      {/* Nhóm DVKT */}
      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">Nhóm DVKT</label>
        <select
          className="border rounded-md px-3 py-1"
          value={filters.idNhom || ""}
          onChange={(e) => onChange({ idNhom: e.target.value })}
        >
          <option value="">Tất cả</option>
          {nhomList.map((n) => (
            <option key={n.id} value={n.id}>
              {n.tenNhom}
            </option>
          ))}
        </select>
      </div>

      {/* Keyword */}
      <div className="flex flex-col flex-1">
        <label className="text-sm text-gray-600 mb-1">Từ khóa</label>
        <input
          type="text"
          placeholder="Tìm theo tên DVKT..."
          className="border rounded-md px-3 py-1"
          value={filters.keyword || ""}
          onChange={(e) => onChange({ keyword: e.target.value })}
        />
      </div>

      {/* Thêm mới */}
      <button
        onClick={onAdd}
        className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition"
      >
        + Thêm DVKT
      </button>
    </div>
  );
}

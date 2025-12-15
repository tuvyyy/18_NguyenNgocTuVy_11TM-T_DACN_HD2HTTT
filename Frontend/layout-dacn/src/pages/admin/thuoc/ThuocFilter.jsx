// src/pages/admin/thuoc/ThuocFilter.jsx
import React, { useState, useEffect } from "react";

export default function ThuocFilter({ nhomList, filters, onChange, onAdd }) {
  const [local, setLocal] = useState(filters);

  useEffect(() => setLocal(filters), [filters]);

  const apply = () => onChange(local);

  return (
    <div className="bg-white/90 backdrop-blur rounded-2xl shadow border border-sky-100 p-4 mt-3">
      <div className="grid grid-cols-12 gap-3 items-end">
        <div className="col-span-12 sm:col-span-3">
          <label className="block text-sm text-gray-600 mb-1">Nhóm thuốc</label>
          <select
            value={local.idNhom || ""}
            onChange={(e) => setLocal((s) => ({ ...s, idNhom: e.target.value || "" }))}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="">-- Tất cả --</option>
            {nhomList.map((x) => (
              <option key={x.id} value={x.id}>{x.ten}</option>
            ))}
          </select>
        </div>

        <div className="col-span-12 sm:col-span-3">
          <label className="block text-sm text-gray-600 mb-1">Trạng thái</label>
          <select
            value={local.hoatDong}
            onChange={(e) => setLocal((s) => ({ ...s, hoatDong: e.target.value }))}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="">-- Tất cả --</option>
            <option value="true">Đang hoạt động</option>
            <option value="false">Đã vô hiệu</option>
          </select>
        </div>

        <div className="col-span-12 sm:col-span-4">
          <label className="block text-sm text-gray-600 mb-1">Từ khóa</label>
          <input
            value={local.keyword}
            onChange={(e) => setLocal((s) => ({ ...s, keyword: e.target.value }))}
            placeholder="Mã/ tên thuốc..."
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div className="col-span-12 sm:col-span-2 flex gap-2">
          <button onClick={apply} className="flex-1 px-3 py-2 rounded-lg bg-sky-500 text-white hover:bg-sky-600">
            Lọc
          </button>
          <button
            onClick={onAdd}
            className="px-3 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600"
          >
            + Thêm
          </button>
        </div>
      </div>
    </div>
  );
}

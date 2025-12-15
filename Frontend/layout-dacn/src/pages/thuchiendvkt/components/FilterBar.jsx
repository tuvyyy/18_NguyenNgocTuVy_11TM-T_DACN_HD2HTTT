import React, { useState } from "react";

export default function FilterBar({ onRefresh, onFilter }) {

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const handleFilter = () => {
    if (onFilter) onFilter(from, to);
  };

  return (
    <div className="flex items-end gap-4 bg-white rounded-lg p-4 shadow mb-4">
      
      <div className="flex flex-col">
        <label className="text-sm text-gray-600">Từ ngày</label>
        <input
          type="date"
          className="border rounded px-2 py-1"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-gray-600">Đến ngày</label>
        <input
          type="date"
          className="border rounded px-2 py-1"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
      </div>

      <button
        className="px-3 py-2 bg-sky-600 text-white rounded shadow"
        onClick={handleFilter}
      >
        Lọc
      </button>

      <button
        className="px-3 py-2 bg-gray-200 rounded shadow"
        onClick={onRefresh}
      >
        Refresh
      </button>

    </div>
  );
}

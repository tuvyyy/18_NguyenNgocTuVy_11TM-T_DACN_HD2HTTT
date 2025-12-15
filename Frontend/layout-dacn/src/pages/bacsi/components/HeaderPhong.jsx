// src/pages/bacsi/components/HeaderPhong.jsx
import React from "react";

export default function HeaderPhong({ phong }) {
  return (
    <div className="w-full flex justify-end pr-6 pt-2 text-xs text-gray-600">
      🏥 Phòng khám:
      <span className="ml-1 font-semibold text-sky-700">
        {phong?.tenPhong || "Đang tải..."}
      </span>
    </div>
  );
}

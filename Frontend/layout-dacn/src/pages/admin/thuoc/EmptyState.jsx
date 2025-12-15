// src/pages/admin/thuoc/EmptyState.jsx
import React from "react";

export default function EmptyState() {
  return (
    <div className="h-full min-h-[220px] flex items-center justify-center">
      <div className="text-center">
        <div className="text-3xl">🧪</div>
        <div className="mt-2 text-gray-600">Hãy chọn một thuốc ở cột bên trái để xem/thiết lập giá.</div>
      </div>
    </div>
  );
}

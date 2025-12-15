import React from "react";

export default function Loading() {
  return (
    <div className="py-10 text-center animate-pulse text-gray-500">
      <div className="w-8 h-8 mx-auto border-4 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-3">Đang tải dữ liệu...</p>
    </div>
  );
}

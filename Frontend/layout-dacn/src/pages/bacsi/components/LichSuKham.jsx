import React, { useState } from "react";

export default function LichSuKham({ list }) {
  const [collapsed, setCollapsed] = useState(false);

  if (collapsed) {
    return (
      <div
        className="w-10 bg-sky-600 text-white flex items-center justify-center rounded-xl cursor-pointer select-none"
        onClick={() => setCollapsed(false)}
      >
        <div className="rotate-180 [writing-mode:vertical-rl] text-sm font-semibold tracking-wider">
          Lịch sử khám
        </div>
      </div>
    );
  }

  return (
    <div className="w-1/3 bg-white rounded-xl border shadow-sm flex flex-col overflow-hidden transition-all">
      <div className="flex items-center justify-between bg-gradient-to-r from-sky-600 to-cyan-500 text-white px-4 py-2 rounded-t-xl text-sm font-semibold">
        🧾 Lịch sử khám
        <button
          onClick={() => setCollapsed(true)}
          className="text-white/80 hover:text-white"
        >
          Thu gọn
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 text-sm">
        {!list || list.length === 0 ? (
          <div className="text-center text-gray-400 italic mt-10">
            Không có lịch sử.
          </div>
        ) : (
          list.map((ls) => (
            <div
              key={ls.id}
              className="border border-gray-200 rounded p-2 mb-2 bg-gray-50 hover:bg-gray-100 transition"
            >
              <div className="font-semibold text-gray-700">
                {ls.chanDoanCuoi || "(Chưa có chẩn đoán)"}
              </div>

              <div className="text-xs text-gray-500">
                🏥 {ls.phongKham} • {ls.trangThai}
              </div>

              <div className="text-xs text-gray-400 italic">
                🕒{" "}
                {ls.thoiGianBatDau
                  ? new Date(ls.thoiGianBatDau).toLocaleDateString("vi-VN")
                  : "Không rõ thời gian"}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

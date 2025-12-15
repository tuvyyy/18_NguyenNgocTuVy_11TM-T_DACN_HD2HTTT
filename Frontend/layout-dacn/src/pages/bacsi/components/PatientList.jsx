// src/pages/bacsi/components/PatientList.jsx
import React from "react";

export default function PatientList({ 
  list, filter, setFilter, selected, setSelected, onSelect
}) {

const getTitle = () => {
  if (filter === "CHO_KHAM") return "📋 Chờ khám";
  if (filter === "DA_KHAM") return "✅ Đã khám";
  return "📆 Hôm nay";
};

const title = getTitle();


  return (
    <div className="w-[320px] bg-white rounded-xl border shadow-sm flex flex-col">

      {/* Header */}
      <div className="flex justify-between items-center bg-gradient-to-r from-sky-600 to-cyan-500 text-white text-sm font-semibold px-4 py-2 rounded-t-xl">
        <span>{title}</span>

        <div className="flex gap-1">
          <button
            onClick={() => setFilter("CHO_KHAM")}
            className={`px-2 py-0.5 rounded ${
              filter === "CHO_KHAM" ? "bg-white text-sky-600" : "text-white/80"
            }`}
          >
            Chờ
          </button>

          <button
            onClick={() => setFilter("HOM_NAY")}
            className={`px-2 py-0.5 rounded ${
              filter === "HOM_NAY" ? "bg-white text-sky-600" : "text-white/80"
            }`}
          >
            Hôm nay
          </button>
          {/* ⭐⭐⭐ NÚT MỚI: ĐÃ KHÁM ⭐⭐⭐ */}
  <button
    onClick={() => setFilter("DA_KHAM")}
    className={`px-2 py-0.5 rounded ${
      filter === "DA_KHAM" ? "bg-white text-sky-600" : "text-white/80"
    }`}
  >
    Đã khám
  </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-3 text-sm">
        {!list || list.length === 0 ? (
          <div className="text-center text-gray-400 italic mt-10">
            Không có dữ liệu.
          </div>
        ) : (
          list.map((bn) => (
            <div
              key={bn.id}
              onClick={() => onSelect(bn)}   // ✔ ĐÚNG RỒI NÈ
              className={`border rounded-md p-2 mb-2 cursor-pointer hover:bg-sky-50 transition-all ${
                selected?.id === bn.id ? "border-sky-500 bg-sky-50" : "border-gray-200"
              }`}
            >
              <div className="font-semibold text-gray-700">{bn.benhNhan}</div>
              <div className="text-xs text-gray-500">
                Mã: {bn.maBenhNhan} •{" "}
                {bn.thoiGianBatDau
                  ? new Date(bn.thoiGianBatDau).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "--:--"}
              </div>
              <div className="text-xs text-gray-400 italic">{bn.trangThai}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

import React from "react";

export default function ModalChiDinhDVKTTotals({ selected }) {
  const total = selected.reduce((sum, item) => {
    const gia = Number(item.donGia) || 0;
    const sl = Number(item.soLuong) || 1;
    return sum + gia * sl;
  }, 0);

  return (
    <div className="p-3 border-b bg-green-50 flex justify-between items-center animate-fadeIn">
      <div className="font-semibold text-green-700 text-lg">
        Đã chọn: {selected.length} dịch vụ
      </div>

      <div className="font-bold text-lg text-green-700">
        Tổng tiền: {total.toLocaleString("vi-VN")} đ
      </div>
    </div>
  );
}

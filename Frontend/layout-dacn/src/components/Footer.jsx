import React from "react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#0077B6] text-white py-2 mt-4 shadow-inner overflow-hidden">
      <marquee behavior="scroll" direction="left" scrollamount="5" className="text-sm tracking-wide">
        🏥 Phòng khám Đa khoa TIUV Clinic – Nơi chăm sóc sức khỏe của bạn – Hotline: 036 887 8419 – 
        Làm việc tất cả các ngày trong tuần từ 7h00 đến 20h00
      </marquee>
    </footer>
  );
}

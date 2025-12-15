import React from "react";

export default function AdminFooter() {
  return (
    <footer className="bg-white/60 backdrop-blur-md border-t border-sky-100 text-center py-3 mt-6 text-gray-500 text-sm">
      © {new Date().getFullYear()} Trung tâm Quản trị hệ thống — Phòng Khám Đa Khoa 115  
      <span className="text-sky-500"> | Built with 💙 by Dâu 🍓</span>
    </footer>
  );
}

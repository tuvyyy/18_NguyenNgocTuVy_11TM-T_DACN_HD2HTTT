import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Crown } from "lucide-react";

export default function AdminHeader() {
  const location = useLocation();

  const menus = [
    { path: "/admin", label: "Bảng điều hành" },
    { path: "/admin/users", label: "Người dùng" },
    { path: "/admin/roles", label: "Vai trò" },
    { path: "/admin/logs", label: "Nhật ký" },
    { path: "/admin/system", label: "Cấu hình" },
  ];

  return (
    <header className="bg-white/70 backdrop-blur-md border-b border-sky-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-3 px-6">
        {/* Logo / tên hệ thống */}
        <div className="flex items-center gap-2 text-sky-700 font-semibold text-lg">
          <Crown size={22} className="text-pink-400" />
          Admin Dashboard
        </div>

        {/* Menu điều hướng */}
        <nav className="flex gap-4 text-sm font-medium">
          {menus.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                  active
                    ? "bg-sky-100 text-sky-700 shadow-inner"
                    : "text-gray-600 hover:text-sky-700 hover:bg-sky-50"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Khu vực thông tin admin */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">Xin chào, Admin 👋</span>
          <button className="text-red-500 hover:text-red-600 text-sm font-medium transition">
            Đăng xuất
          </button>
        </div>
      </div>
    </header>
  );
}

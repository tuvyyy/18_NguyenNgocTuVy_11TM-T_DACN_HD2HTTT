import React, { useState, useRef, useEffect } from "react";
import {
  FaBell,
  FaSearch,
  FaUserMd,
  FaGlobe,
  FaQuestionCircle,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";

export default function Header() {
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);

  // 🧠 Lấy thông tin người dùng từ localStorage
  const [userName, setUserName] = useState("Người dùng");

  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        // Nếu API có fullName thì dùng, còn không thì fallback sang tenDangNhap
        setUserName(user.fullName || user.tenDangNhap || "Người dùng");
      } catch {
        setUserName("Người dùng");
      }
    }
  }, []);

  // 🧩 Đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🚪 Hàm xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("userInfo"); // Xóa thông tin đăng nhập
    window.location.href = "/"; // Quay về trang login
  };

  return (
    <header className="w-full bg-[#0077B6] text-white flex items-center justify-between px-5 py-2 shadow relative">
      {/* Logo + tên hệ thống */}
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center bg-white text-[#0077B6] rounded-full w-9 h-9 shadow-inner">
          <FaUserMd size={20} />
        </div>
        <h1 className="text-lg font-bold tracking-wide">TIUV Clinic System</h1>
      </div>

      {/* Thanh tìm kiếm */}
      <div className="flex items-center bg-white rounded-full px-3 py-1 w-1/2">
        <FaSearch className="text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="Tìm kiếm bệnh nhân, hồ sơ, mã khám..."
          className="w-full outline-none text-gray-700 text-sm"
        />
      </div>

      {/* Biểu tượng + tài khoản */}
      <div className="flex items-center gap-4 text-lg">
        <FaBell className="cursor-pointer hover:text-yellow-300" />
        <FaQuestionCircle className="cursor-pointer hover:text-yellow-300" />
        <FaGlobe className="cursor-pointer hover:text-yellow-300" />

        {/* Avatar + tên người dùng + dropdown */}
        <div className="relative" ref={menuRef}>
          <div
            className="flex items-center gap-2 cursor-pointer select-none border-l pl-3"
            onClick={() => setOpenMenu(!openMenu)}
          >
            <div className="flex items-center justify-center bg-white text-[#0077B6] rounded-full w-8 h-8">
              <FaUserMd size={18} />
            </div>
            {/* ✅ Hiển thị họ tên thật của user */}
            <span className="text-sm font-medium truncate max-w-[120px]">
              {userName}
            </span>
          </div>

          {/* Dropdown menu */}
          {openMenu && (
            <div className="absolute right-0 mt-2 w-44 bg-white text-gray-700 rounded-md shadow-lg border border-gray-200 z-50 animate-fadeIn">
              <ul className="text-sm">
                <li className="px-3 py-2 flex items-center gap-2 hover:bg-gray-100 cursor-pointer">
                  <FaUserCircle className="text-[#0077B6]" />
                  <span>Tài khoản cá nhân</span>
                </li>
                <li
                  onClick={handleLogout}
                  className="px-3 py-2 flex items-center gap-2 hover:bg-red-100 cursor-pointer text-red-600 border-t border-gray-200"
                >
                  <FaSignOutAlt />
                  <span>Đăng xuất</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

import React, { useState, useEffect } from "react";
import axios from "axios";
import bgImage from "../assets/imgDangKy.png";

const DangKy = ({ onSwitchPage }) => {
  const [hoTen, setHoTen] = useState("");
  const [tenDangNhap, setTenDangNhap] = useState("");
  const [matKhau, setMatKhau] = useState("");
  const [xacNhan, setXacNhan] = useState("");
  const [email, setEmail] = useState("");
  const [soDienThoai, setSoDienThoai] = useState("");
  const [selectedRole, setSelectedRole] = useState(null);
  const [roleOpen, setRoleOpen] = useState(false);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // 🔄 Lấy danh sách vai trò từ API
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await axios.get("https://localhost:7007/api/Auth/roles");
        setRoles(res.data);
      } catch (err) {
        console.error("⚠️ Lỗi tải danh sách vai trò:", err);
      }
    };
    fetchRoles();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!tenDangNhap || !matKhau || !xacNhan || !selectedRole) {
      setMessage({ type: "error", text: "Vui lòng nhập đầy đủ thông tin." });
      return;
    }
    if (matKhau !== xacNhan) {
      setMessage({ type: "error", text: "Mật khẩu xác nhận không khớp." });
      return;
    }

    const body = {
      hoTen,
      tenDangNhap,
      matKhau,
      email,
      soDienThoai,
      vaiTroIds: [selectedRole.id],
    };

    try {
      setLoading(true);
      const res = await axios.post("https://localhost:7007/api/Auth/register", body);
      console.log("✅ Đăng ký thành công:", res.data);

      setMessage({
        type: "success",
        text: "🎉 Đăng ký tài khoản thành công! Đang chuyển hướng...",
      });

      // Reset form
      setHoTen("");
      setTenDangNhap("");
      setMatKhau("");
      setXacNhan("");
      setEmail("");
      setSoDienThoai("");
      setSelectedRole(null);

      // ⏳ Sau 2 giây quay lại trang đăng nhập
      setTimeout(() => {
        if (onSwitchPage) onSwitchPage();
      }, 2000);
    } catch (err) {
      console.error("❌ Lỗi đăng ký:", err);
      const msg =
        err.response?.data?.message ||
        err.response?.data ||
        "Đăng ký thất bại, vui lòng thử lại!";
      setMessage({ type: "error", text: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 to-blue-50 px-8 overflow-hidden">
      {/* ✨ Hạt sáng lung linh */}
      <div className="absolute inset-0 overflow-hidden z-0">
        {[...Array(35)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-particle"
            style={{
              width: `${12 + Math.random() * 30}px`,
              height: `${12 + Math.random() * 30}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              background: `radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(165,215,255,0.5) 60%, transparent 100%)`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${10 + Math.random() * 16}s`,
              filter: "blur(2px)",
              opacity: 0.6 + Math.random() * 0.4,
            }}
          ></div>
        ))}
      </div>

      {/* 🌿 Khung chính */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-6xl overflow-hidden transform transition-all duration-500 hover:scale-[1.01] hover:shadow-3xl z-10 flex">
        {/* Banner bên trái */}
        <div className="hidden md:block w-1/2 relative">
          <img src={bgImage} alt="Clinic Management" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-sky-700/50 to-transparent"></div>
          <div className="absolute bottom-8 text-center w-full px-6">
            <h3 className="text-2xl font-semibold text-white drop-shadow-lg">
              Quản lý phòng khám dễ dàng hơn
            </h3>
            <p className="text-sky-100 mt-1 text-sm">
              Đăng ký tài khoản để tham gia hệ thống quản lý thông minh.
            </p>
          </div>
        </div>

        {/* Form đăng ký */}
        <div className="w-full md:w-1/2 bg-sky-50 px-10 py-10 relative z-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-center mb-8 text-sky-700">
            Đăng Ký Tài Khoản
          </h2>

          {message.text && (
            <div
              className={`text-center mb-5 p-3 rounded-lg ${
                message.type === "error"
                  ? "bg-red-100 text-red-600"
                  : "bg-green-100 text-green-600"
              }`}
            >
              {message.text}
            </div>
          )}

          <form className="grid grid-cols-1 gap-5 animate-fadeInSlow" onSubmit={handleRegister}>
            {/* Họ và tên */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
              <input
                value={hoTen}
                onChange={(e) => setHoTen(e.target.value)}
                type="text"
                placeholder="Nguyễn Văn A"
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-sky-300 shadow-sm"
              />
            </div>

            {/* Tên đăng nhập */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên tài khoản (Mã NV) <span className="text-red-500">*</span>
              </label>
              <input
                value={tenDangNhap}
                onChange={(e) => setTenDangNhap(e.target.value)}
                type="text"
                placeholder="VD: NV001"
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-sky-300 shadow-sm"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="example@gmail.com"
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-sky-300 shadow-sm"
              />
            </div>

            {/* SĐT */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
              <input
                value={soDienThoai}
                onChange={(e) => setSoDienThoai(e.target.value)}
                type="text"
                placeholder="090xxxxxxx"
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-sky-300 shadow-sm"
              />
            </div>

            {/* Mật khẩu */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <input
                value={matKhau}
                onChange={(e) => setMatKhau(e.target.value)}
                type="password"
                placeholder="Nhập mật khẩu"
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-sky-300 shadow-sm"
              />
            </div>

            {/* Xác nhận mật khẩu */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Xác nhận mật khẩu <span className="text-red-500">*</span>
              </label>
              <input
                value={xacNhan}
                onChange={(e) => setXacNhan(e.target.value)}
                type="password"
                placeholder="Nhập lại mật khẩu"
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-sky-300 shadow-sm"
              />
            </div>

            {/* Vai trò */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vai trò <span className="text-red-500">*</span>
              </label>

              <div
                className="relative"
                onClick={() => setRoleOpen(!roleOpen)}
                onBlur={() => setRoleOpen(false)}
                tabIndex={0}
              >
                <div className="flex justify-between items-center border rounded-lg p-3 bg-white cursor-pointer shadow-sm">
                  <span className={`${!selectedRole ? "text-gray-400" : ""}`}>
                    {selectedRole ? selectedRole.moTa : "-- Chọn vai trò --"}
                  </span>
                  <span
                    className={`text-sky-500 transition-transform ${
                      roleOpen ? "rotate-180" : ""
                    }`}
                  >
                    ▼
                  </span>
                </div>

                <ul
                  className={`absolute w-full bg-white border border-sky-100 rounded-lg mt-1 shadow-lg transition-all duration-200 origin-top transform ${
                    roleOpen
                      ? "scale-y-100 opacity-100"
                      : "scale-y-0 opacity-0 pointer-events-none"
                  }`}
                >
                  {roles.map((role) => (
                    <li
                      key={role.id}
                      onClick={() => {
                        setSelectedRole(role);
                        setRoleOpen(false);
                      }}
                      className="px-4 py-2 hover:bg-sky-100 cursor-pointer"
                    >
                      {role.moTa || role.ten}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Nút đăng ký */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-sky-400 to-blue-500 text-white font-semibold py-3 rounded-lg text-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition disabled:opacity-70"
            >
              {loading ? "⏳ Đang đăng ký..." : "Đăng ký"}
            </button>
          </form>

          <p className="text-center mt-8 text-gray-600">
            Đã có tài khoản?{" "}
            <button
              type="button"
              onClick={onSwitchPage}
              className="text-sky-600 font-semibold hover:text-sky-700 hover:underline bg-transparent border-none cursor-pointer"
            >
              Đăng nhập ngay
            </button>
          </p>
        </div>
      </div>

      {/* ✨ Animation */}
      <style>{`
        @keyframes particle {
          0% { transform: translate(0, 0) scale(1); opacity: 0.8; }
          25% { transform: translate(40px, -50px) scale(1.1); opacity: 1; }
          50% { transform: translate(-60px, -100px) scale(0.9); opacity: 0.9; }
          75% { transform: translate(20px, -180px) scale(1.05); opacity: 0.6; }
          100% { transform: translate(0, -250px) scale(1); opacity: 0.4; }
        }
        .animate-particle { animation: particle ease-in-out infinite; }
        @keyframes fadeInSlow {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInSlow { animation: fadeInSlow 1s ease forwards; }
      `}</style>
    </div>
  );
};

export default DangKy;

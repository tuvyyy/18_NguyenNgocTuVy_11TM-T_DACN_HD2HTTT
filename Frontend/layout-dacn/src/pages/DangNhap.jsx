import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ thêm dòng này

const DangNhap = ({ onSwitchPage, onLoginSuccess }) => {
  const navigate = useNavigate(); 
  const [tenDangNhap, setTenDangNhap] = useState("");
  const [matKhau, setMatKhau] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ====================== Hàm xử lý login ======================
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.post("https://localhost:7007/api/Auth/login", {
        TenDangNhap: tenDangNhap,
        MatKhau: matKhau,
      });

      const data = res.data;

      if (res.status === 200 && data.message === "Đăng nhập thành công") {
        const user = {
          userId: data.userId,
          tenDangNhap: data.tenDangNhap,
          roles: data.roles || [],
        };

        // ✅ Lưu localStorage
        localStorage.setItem("userInfo", JSON.stringify(user));
        
        onLoginSuccess(user);
        setSuccess("✅ Đăng nhập thành công!");
        localStorage.setItem("access_token", data.token);

        // ✅ Điều hướng đúng vai trò
if (user.roles.includes("ADMIN")) {
  navigate("/admin");
} else {
  navigate("/dashboard");
}

        // ✅ Điều hướng theo vai trò
        // if (user.roles.includes("TIEP_DON")) navigate("/tiep-don");
        // else if (user.roles.includes("BAC_SI")) navigate("/bac-si");
        // else if (user.roles.includes("THU_NGAN")) navigate("/thu-ngan");
        // else if (user.roles.includes("ADMIN")) navigate("/admin");
        // else navigate("/login");
      } else {
        setError("❌ Sai tên đăng nhập hoặc mật khẩu.");
      }
    } catch (err) {
      console.error("❌ Lỗi đăng nhập:", err);
      const errorMsg =
        typeof err.response?.data === "string"
          ? err.response.data
          : err.response?.data?.message || "Sai tên đăng nhập hoặc mật khẩu.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // ====================== JSX giao diện ======================
  return (
    <div className="min-h-screen flex bg-gradient-to-r from-sky-50 to-blue-50 overflow-hidden relative">
      {/* ✨ Hạt sáng nhẹ trong nền */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-sky-200 opacity-40 animate-particle"
            style={{
              width: `${10 + Math.random() * 25}px`,
              height: `${10 + Math.random() * 25}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${8 + Math.random() * 8}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Form đăng nhập */}
      <div className="w-1/2 flex items-center justify-center relative z-10 animate-fadeIn">
        <div className="max-w-lg w-full bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-10 border border-sky-100">
          <div className="flex flex-col items-center mb-8">
            <div className="w-28 h-28 rounded-full border-4 border-sky-300 flex items-center justify-center shadow-sm bg-gradient-to-br from-sky-50 to-white">
              <span className="text-6xl text-sky-500 font-bold">＋</span>
            </div>
            <p className="text-gray-500 mt-4 text-base italic">
              Hôm nay bạn thế nào?
            </p>
            <h2 className="text-3xl font-bold mt-2 text-sky-700">
              Vui lòng <span className="text-blue-500">Đăng nhập</span>
            </h2>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <input
              type="text"
              placeholder="Tên tài khoản"
              value={tenDangNhap}
              onChange={(e) => setTenDangNhap(e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-3 text-base focus:outline-none focus:ring-2 focus:ring-sky-300 shadow-sm hover:shadow-md transition"
              required
            />

            <input
              type="password"
              placeholder="Mật khẩu"
              value={matKhau}
              onChange={(e) => setMatKhau(e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-3 text-base focus:outline-none focus:ring-2 focus:ring-sky-300 shadow-sm hover:shadow-md transition"
              required
            />

            {/* Thông báo lỗi / thành công */}
            {error && (
              <div className="flex items-center gap-2 text-red-500 text-sm font-medium bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
                ⚠️ {error}
              </div>
            )}
            {success && (
              <div className="flex items-center gap-2 text-green-600 text-sm font-medium bg-green-50 border border-green-200 px-3 py-2 rounded-lg">
                ✅ {success}
              </div>
            )}

            <div className="flex justify-between items-center text-sm">
              <button
                type="button"
                onClick={onSwitchPage}
                className="text-sky-600 font-semibold hover:text-sky-700 hover:underline bg-transparent border-none cursor-pointer"
              >
                Đăng ký tài khoản
              </button>

              <a
                href="#"
                className="text-sky-600 hover:text-blue-600 font-medium hover:underline"
              >
                Quên mật khẩu?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r from-sky-400 via-blue-400 to-blue-500 text-white font-semibold py-3 rounded-lg text-lg shadow-md hover:shadow-lg transition-all ${
                loading
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:translate-y-[-2px]"
              }`}
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>
        </div>
      </div>

      {/* Cột phải - placeholder */}
      <div className="w-1/2 bg-sky-100 flex flex-col h-screen relative z-10 border-l border-sky-200 justify-center items-center">
        <h2 className="text-sky-700 text-2xl font-bold mb-4">🏥 PHÒNG KHÁM 115</h2>
        <p className="text-gray-600 text-center w-3/4">
          Hệ thống quản lý phòng khám hiện đại — nhanh chóng, tiện lợi, bảo mật tuyệt đối.
        </p>
      </div>

      {/* 🌌 Animation */}
      <style>{`
        @keyframes particle {
          0% { transform: translateY(0); opacity: 0.6; }
          50% { transform: translateY(-60px); opacity: 0.9; }
          100% { transform: translateY(-120px); opacity: 0.4; }
        }
        .animate-particle { animation: particle linear infinite; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.8s ease forwards; }
      `}</style>
    </div>
  );
};

export default DangNhap;

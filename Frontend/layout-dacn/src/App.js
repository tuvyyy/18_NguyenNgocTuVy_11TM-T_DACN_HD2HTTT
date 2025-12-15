// src/App.js
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

// ===== Pages =====
import DangNhap from "./pages/DangNhap.jsx";
import DangKy from "./pages/DangKy.jsx";
import StaffDashboard from "./pages/StaffDashboard.jsx";

// ===== Bác sĩ =====
import BacSi from "./pages/bacsi/BacSi.jsx";

// =====Thực hiện Cận lâm sàng =====
import ThucHienDVKT from "./pages/thuchiendvkt/ThucHienDVKT.jsx";

// ===== Tiếp đón =====
import TiepDon from "./pages/TiepDon.jsx";
import ChiDinhKham from "./pages/ChiDinhKham.jsx";

// ===== Thu ngân =====
import ThuNgan from "./pages/ThuNgan.jsx";
import ThuNganDetail from "./pages/ThuNganDetail.jsx";

// ===== Admin =====
import AdminLayout from "./layouts/AdminLayout.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import { AdminUserPage } from "./pages/admin/users";
import AdminPermissionPage from "./pages/admin/permission/AdminPermissionPage";
import DanhMucDichVu from "./pages/admin/dvkt/DanhMucDichVu.jsx";
import ThuocPage from "./pages/admin/thuoc/index.jsx";
import DanhMucDVKT from "./pages/admin/danhmucdvkt/index.jsx";


// =======================================================
// 🧩 APP CHÍNH
// =======================================================
export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Đọc userInfo từ localStorage
  useEffect(() => {
    const stored = localStorage.getItem("userInfo");
    if (stored) {
      try {
        const user = JSON.parse(stored);
        setCurrentUser(user);
      } catch {
        localStorage.removeItem("userInfo");
      }
    }
    setLoading(false);
  }, []);

  if (loading) return <div className="p-8 text-center">Đang tải...</div>;

  return (
    <Router>
      <Routes>
        {/* ===================== ĐĂNG NHẬP ===================== */}
        <Route path="/login" element={<DangNhap onLoginSuccess={setCurrentUser} />} />

        {/* ===================== ĐĂNG KÝ ===================== */}
        <Route path="/register" element={<DangKy />} />

        {/* ===================== DASHBOARD NHÂN VIÊN ===================== */}
        <Route path="/dashboard" element={<RequireLogin user={currentUser} />}>
          <Route index element={<StaffDashboard />} />
        </Route>

        {/* ===================== BÁC SĨ ===================== */}
        <Route
          path="/bac-si"
          element={<RequireRole user={currentUser} role="BAC_SI" />}
        >
        <Route index element={<BacSi />} />
        </Route>

        <Route
  path="/can-lam-sang"
  element={<RequireRole user={currentUser} role="BAC_SI" />}
>
  <Route index element={<ThucHienDVKT />} />
</Route>

        {/* ===================== TIẾP ĐÓN ===================== */}
        <Route
          path="/tiep-don"
          element={<RequireRole user={currentUser} role="TIEP_DON" />}
        >
          <Route index element={<TiepDon />} />
          <Route path="chi-dinh" element={<ChiDinhKham />} />
        </Route>

        {/* ===================== THU NGÂN ===================== */}
        <Route
          path="/thu-ngan"
          element={<RequireRole user={currentUser} role="THU_NGAN" />}
        >
          <Route index element={<ThuNgan />} />
          <Route path="detail/:maHoaDon" element={<ThuNganDetail />} />
        </Route>

        {/* ===================== ADMIN ===================== */}
        <Route
          path="/admin"
          element={<RequireRole user={currentUser} role="ADMIN" />}
        >
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUserPage />} />
            <Route path="roles" element={<AdminPermissionPage />} />
            <Route path="logs" element={<div>Trang nhật ký hoạt động</div>} />
            <Route path="system" element={<div>Trang cấu hình hệ thống</div>} />

            {/* ✅ Danh mục DVKT */}
            <Route path="danh-muc-dv" element={<DanhMucDichVu />} />
            {/* ✅ Danh mục Thuốc */}
            <Route path="danh-muc-thuoc" element={<ThuocPage />} />
             {/* ✅ Danh mục Thuốc */}
            <Route path="danh-muc-dvkt" element={<DanhMucDVKT />} />
          </Route>
        </Route>

        {/* ===================== REDIRECT MẶC ĐỊNH ===================== */}
        <Route
          path="*"
          element={
            currentUser ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

// =======================================================
// 🧩 Component bảo vệ route (RequireLogin)
// =======================================================
function RequireLogin({ user }) {
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}

// =======================================================
// 🧩 Component bảo vệ route theo vai trò
// =======================================================
function RequireRole({ user, role }) {
  if (!user) return <Navigate to="/login" replace />;
  const hasRole = user.roles?.includes(role);
  if (!hasRole) {
    return (
      <div className="p-8 text-center text-red-500 font-semibold">
        ⚠️ Bạn không có quyền truy cập vào trang này.
      </div>
    );
  }
  return <Outlet />;
}

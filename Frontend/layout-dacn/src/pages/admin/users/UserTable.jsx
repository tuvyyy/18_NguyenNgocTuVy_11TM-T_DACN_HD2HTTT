import React from "react";
import AdminAuthController from "../../../controllers/AdminAuthController";

export default function UserTable({ users, loading, onEdit, loadData }) {
  const handleToggleActive = async (user) => {
    if (user.hoatDong) {
      await AdminAuthController.disableUser(user.id, loadData);
    } else {
      await AdminAuthController.enableUser(user.id, loadData);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-sky-100 overflow-hidden w-full">
      <table className="w-full text-sm text-gray-700">
        <thead className="bg-gradient-to-r from-sky-100 to-pink-100 text-sky-800">
          <tr className="text-left">
            <th className="py-3 px-4 text-center w-[50px]">#</th>
            <th className="py-3 px-4">Tên đăng nhập</th>
            <th className="py-3 px-4">Họ tên</th>
            <th className="py-3 px-4">Email</th>
            <th className="py-3 px-4">Vai trò</th>
            <th className="py-3 px-4 text-center w-[120px]">Trạng thái</th>
            <th className="py-3 px-4 text-center w-[190px]">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-sky-50">
          {loading ? (
            <tr>
              <td colSpan="7" className="text-center py-5 text-gray-500">
                Đang tải...
              </td>
            </tr>
          ) : users.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center py-5 text-gray-500">
                Không có dữ liệu
              </td>
            </tr>
          ) : (
            users.map((u, i) => (
              <tr
                key={u.id}
                className="hover:bg-gradient-to-r hover:from-sky-50 hover:to-pink-50 transition-colors duration-200"
              >
                <td className="text-center py-2">{i + 1}</td>
                <td className="py-2 px-4 font-medium text-gray-800">
                  {u.tenDangNhap}
                </td>
                <td className="py-2 px-4">{u.hoTen}</td>
                <td className="py-2 px-4">{u.email}</td>
                <td className="py-2 px-4">
                  {Array.isArray(u.vaiTro)
                    ? u.vaiTro.join(", ")
                    : u.vaiTro || "—"}
                </td>

                <td className="text-center">
                  {u.hoatDong ? (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                      Hoạt động
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                      Khoá
                    </span>
                  )}
                </td>

                <td className="text-center py-2 flex justify-center gap-3">
  {/* ✅ Reset mật khẩu */}
  <button
    className="text-sky-600 hover:text-sky-800 hover:scale-125 transition-all duration-150"
    onClick={() => AdminAuthController.resetPassword(u.id, u.tenDangNhap)}
    title={`Đặt lại mật khẩu cho ${u.tenDangNhap}`}
  >
    🔁
  </button>

  {/* ✅ Sửa */}
  <button
    className="text-indigo-600 hover:text-indigo-800 hover:scale-125 transition-all duration-150"
    onClick={() => onEdit(u)}
    title="Sửa thông tin"
  >
    ✏️
  </button>

  {/* ✅ Khóa / mở */}
  <button
    className={`${
      u.hoatDong ? "text-yellow-600 hover:text-yellow-800" : "text-green-600 hover:text-green-800"
    } hover:scale-125 transition-all duration-150`}
    onClick={() =>
      AdminAuthController.toggleLock(u.id, u.hoatDong, loadData)
    }
    title={u.hoatDong ? "Khoá tài khoản" : "Mở khoá tài khoản"}
  >
    {u.hoatDong ? "🔒" : "🔓"}
  </button>

  {/* ✅ Xóa */}
  <button
    className="text-red-600 hover:text-red-800 hover:scale-125 transition-all duration-150"
    onClick={() => AdminAuthController.deleteUser(u.id, loadData)}
    title="Xoá người dùng"
  >
    🗑️
  </button>
</td>

              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

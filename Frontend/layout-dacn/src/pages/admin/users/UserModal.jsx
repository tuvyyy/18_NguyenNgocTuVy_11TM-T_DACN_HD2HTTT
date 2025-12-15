import React from "react";
import AdminAuthController from "../../../controllers/AdminAuthController";

export default function UserModal({ isEdit, formData, setFormData, onClose, loadData }) {
  // ✅ Toggle vai trò (thêm hoặc xóa)
  const toggleRole = (role) => {
    setFormData((prev) => {
      const newRoles = prev.vaiTro.includes(role)
        ? prev.vaiTro.filter((r) => r !== role)
        : [...prev.vaiTro, role];
      return { ...prev, vaiTro: newRoles };
    });
  };

  // ✅ Map vai trò sang ID để BE hiểu
  const roleMap = {
    ADMIN: 1,
    BAC_SI: 2,
    TIEP_DON: 3,
    THU_NGAN: 4,
  };

  const handleSave = async () => {
    try {
      const dto = {
        hoTen: formData.hoTen,
        tenDangNhap: formData.tenDangNhap,
        matKhau: formData.matKhau || "Abcd@1234",
        email: formData.email,
        soDienThoai: formData.soDienThoai,
        chucDanh: formData.chucDanh,
        khoaPhong: formData.khoaPhong,
        vaiTroIds: formData.vaiTro.map((r) => roleMap[r] || 0),
      };

      if (isEdit) {
        await AdminAuthController.editUser(formData.id, dto, loadData);
      } else {
        await AdminAuthController.addUser(dto, loadData);
      }

      onClose();
    } catch (err) {
      console.error("❌ Lỗi khi lưu người dùng:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />

      <div className="relative bg-white w-[520px] max-w-[92vw] rounded-2xl shadow-2xl border border-sky-100 p-6">
        <h3 className="text-lg font-bold mb-4 text-sky-700">
          {isEdit ? "✏️ Sửa thông tin người dùng" : "➕ Thêm người dùng mới"}
        </h3>

        <div className="grid grid-cols-1 gap-3">
          <input
            type="text"
            placeholder="Họ tên"
            className="border px-3 py-2 rounded-lg"
            value={formData.hoTen}
            onChange={(e) => setFormData({ ...formData, hoTen: e.target.value })}
          />

          {!isEdit && (
            <input
              type="text"
              placeholder="Tên đăng nhập"
              className="border px-3 py-2 rounded-lg"
              value={formData.tenDangNhap}
              onChange={(e) => setFormData({ ...formData, tenDangNhap: e.target.value })}
            />
          )}

          <input
            type="email"
            placeholder="Email"
            className="border px-3 py-2 rounded-lg"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />

          <input
            type="text"
            placeholder="Số điện thoại"
            className="border px-3 py-2 rounded-lg"
            value={formData.soDienThoai}
            onChange={(e) => setFormData({ ...formData, soDienThoai: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Chức danh"
              className="border px-3 py-2 rounded-lg"
              value={formData.chucDanh || ""}
              onChange={(e) => setFormData({ ...formData, chucDanh: e.target.value })}
            />
            <input
              type="text"
              placeholder="Khoa/Phòng"
              className="border px-3 py-2 rounded-lg"
              value={formData.khoaPhong || ""}
              onChange={(e) => setFormData({ ...formData, khoaPhong: e.target.value })}
            />
          </div>

          {/* Vai trò */}
          <div className="border rounded-xl p-3">
            <p className="font-medium mb-2">Vai trò:</p>
            <div className="flex flex-wrap gap-2">
              {["ADMIN", "BAC_SI", "THU_NGAN", "TIEP_DON"].map((r) => {
                const active = formData.vaiTro.includes(r);
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => toggleRole(r)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition ${
                      active
                        ? "bg-sky-100 text-sky-700 border-sky-200"
                        : "bg-white text-gray-600 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {r}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-5 gap-2">
          <button className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300" onClick={onClose}>
            ❌ Hủy
          </button>
          <button
            className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700"
            onClick={handleSave}
          >
            💾 Lưu
          </button>
        </div>
      </div>
    </div>
  );
}

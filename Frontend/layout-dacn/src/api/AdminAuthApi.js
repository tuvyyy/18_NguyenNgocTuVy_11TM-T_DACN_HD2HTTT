// src/api/AdminAuthApi.js
import axios from "axios";

const API_BASE = "https://localhost:7007/api";

export const AdminAuthApi = {
  // =========================================================
  // 👤 NGƯỜI DÙNG (đã khớp đúng với /api/nguoidung)
  // =========================================================
  async getAll() {
    const res = await axios.get(`${API_BASE}/nguoidung`);
    return res.data;
  },

  async createUser(payload) {
    // payload gồm: hoTen, tenDangNhap, matKhau, email, soDienThoai, vaiTroIds[]
    const res = await axios.post(`${API_BASE}/nguoidung`, payload);
    return res.data;
  },

  async updateUser(id, payload) {
    const res = await axios.put(`${API_BASE}/nguoidung/${id}`, payload);
    return res.data;
  },

  // ✅ Vô hiệu hóa tài khoản (BE: DELETE /api/nguoidung/{id})
  async deleteUser(id) {
    const res = await axios.delete(`${API_BASE}/nguoidung/${id}`);
    return res.data;
  },
async resetPassword(id) {
  const res = await axios.patch(`${API_BASE}/nguoidung/${id}/reset-password`);
  return res.data;
},

  // ✅ Kích hoạt tài khoản (BE: PATCH /api/nguoidung/{id}/kich-hoat)
  async enableUser(id) {
    const res = await axios.patch(`${API_BASE}/nguoidung/${id}/kich-hoat`);
    return res.data;
  },

  // =========================================================
  // 🧩 VAI TRÒ & QUYỀN
  // =========================================================
  async getRoles() {
    const res = await axios.get(`${API_BASE}/vaitro`);
    return res.data;
  },

  // ✅ Cập nhật quyền cho vai trò (BE: PATCH /api/vaitroquyen/{roleId})
  async updateRoles(roleId, quyenIds) {
    console.log("📡 PATCH gửi đến:", `${API_BASE}/vaitroquyen/${roleId}`);
    console.log("📦 Body gửi lên (mảng quyền):", quyenIds);

    try {
      const res = await axios.patch(
        `${API_BASE}/vaitroquyen/${roleId}`,
        quyenIds,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("✅ Server trả về:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ BE trả lỗi:", err.response?.data || err.message);
      throw err;
    }
  },
};

export default AdminAuthApi;

import axios from "axios";

const API_BASE = "https://localhost:7007/api";

/* ============================================================
   🔹 ADMIN PERMISSION API – Vai trò & Phân quyền
   ============================================================ */

// ==================== LẤY DANH SÁCH VAI TRÒ ====================
export const getRoles = async () => {
  try {
    const res = await axios.get(`${API_BASE}/vaitro`, {
      validateStatus: () => true,
    });
    if (res.status === 200) return res.data;
    console.warn("⚠️ Không thể tải vai trò:", res.statusText);
    return [];
  } catch (err) {
    console.error("❌ Lỗi tải vai trò:", err.message);
    return [];
  }
};

// ==================== LẤY DANH SÁCH CHỨC NĂNG ====================
export const getFunctions = async () => {
  try {
    const res = await axios.get(`${API_BASE}/chucnang`, {
      validateStatus: () => true,
    });
    if (res.status === 200) return res.data;
    console.warn("⚠️ Không thể tải chức năng:", res.statusText);
    return [];
  } catch (err) {
    console.error("❌ Lỗi tải chức năng:", err.message);
    return [];
  }
};

// ==================== LẤY DANH SÁCH QUYỀN ====================
export const getPermissions = async () => {
  try {
    const res = await axios.get(`${API_BASE}/quyen`, {
      validateStatus: () => true,
    });
    if (res.status === 200) return res.data;
    console.warn("⚠️ Không thể tải quyền:", res.statusText);
    return [];
  } catch (err) {
    console.error("❌ Lỗi tải quyền:", err.message);
    return [];
  }
};

// ==================== LẤY QUYỀN THEO VAI TRÒ ====================
export const getRolePermissions = async (roleId) => {
  try {
    const res = await axios.get(`${API_BASE}/users/vaitroquyen`, {
      params: { roleId },
    });
    console.log("🌐 [API] GET /vaitroquyen =>", res.data);
    return res.data;
  } catch (err) {
    console.error("❌ API lỗi khi lấy rolePermissions:", err);
    return [];
  }
};


// ==================== CẬP NHẬT QUYỀN CHO VAI TRÒ ====================
export const updateRolePermissions = async (roleId, updates) => {
  if (!roleId) {
    console.warn("⚠️ Thiếu roleId khi cập nhật quyền.");
    return null;
  }

  try {
    console.log("📤 [PATCH] Gửi dữ liệu cập nhật quyền:", updates);

    const res = await axios.patch(`${API_BASE}/users/vaitroquyen/${roleId}`, updates, {
      headers: { "Content-Type": "application/json" },
      validateStatus: () => true, // tránh Axios tự throw khi 400
    });

    console.log("📦 Phản hồi từ API:", res);

    // ✅ Thành công: BE trả về 200 + message
    if (res.status === 200 && res.data && res.data.message) {
      console.log("✅ Cập nhật quyền vai trò thành công!");
      return res.data; // { message: "Cập nhật quyền chi tiết cho vai trò thành công!" }
    }

    // ⚠️ Trường hợp lỗi BE trả khác định dạng
    console.warn("⚠️ Cập nhật quyền thất bại:", res.status, res.statusText, res.data);
    return null;
  } catch (err) {
    console.error("❌ Lỗi khi gọi API updateRolePermissions:", err);
    return null;
  }
};


// ==================== LẤY QUYỀN CỦA NGƯỜI DÙNG ====================
export const getUserPermissions = async (userId) => {
  if (!userId) return null;
  try {
    const res = await axios.get(`${API_BASE}/users/${userId}/permissions`, {
      validateStatus: () => true,
    });
    if (res.status === 200) return res.data;
    console.warn("⚠️ Không thể tải quyền người dùng:", res.statusText);
    return null;
  } catch (err) {
    console.error("❌ Lỗi tải quyền người dùng:", err.message);
    return null;
  }
};

// ==================== KIỂM TRA NGƯỜI DÙNG CÓ QUYỀN THỰC HIỆN HÀNH ĐỘNG ====================
export const checkUserPermission = async (userId, feature, action) => {
  if (!userId || !feature || !action) return false;
  try {
    const res = await axios.get(`${API_BASE}/users/${userId}/can`, {
      params: { feature, action },
      validateStatus: () => true,
    });
    if (res.status === 200) return res.data.allowed || false;
    return false;
  } catch (err) {
    console.error("❌ Lỗi kiểm tra quyền người dùng:", err.message);
    return false;
  }
};

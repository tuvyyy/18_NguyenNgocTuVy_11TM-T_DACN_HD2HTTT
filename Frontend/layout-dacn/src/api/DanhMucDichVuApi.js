// ============================================
// 📁 src/api/DanhMucDichVuApi.js
// ============================================
import axios from "axios";

// ✅ Khởi tạo axios instance
const api = axios.create({
  baseURL: "https://localhost:7007/api/DanhMucDichVu",
  withCredentials: false,
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    Accept: "application/json; charset=utf-8",
  },
});

// ✅ Interceptor để log lỗi rõ ràng và đảm bảo UTF-8
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("❌ Lỗi API:", error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

// ======================================================
// 🧩 NHÓM DỊCH VỤ
// ======================================================
export const apiGetNhomDichVu = async (keyword = "") => {
  return api.get("/nhom-dich-vu", { params: { keyword } });
};

// ======================================================
// 🧩 DỊCH VỤ
// ======================================================
export const apiGetDichVuList = async (params) => {
  // params: { idNhom, idPhong, keyword, hoatDong, page, pageSize }
  return api.get("/dich-vu", { params });
};

export const apiGetDichVuDropdown = async () => {
  return api.get("/dich-vu/dropdown");
};

// ======================================================
// 🧩 PHÒNG KHÁM
// ======================================================
export const apiGetPhongKhamDropdown = async () => {
  return api.get("/phong-kham/dropdown");
};

// ======================================================
// 🧩 DỊCH VỤ GIÁ
// ======================================================
export const apiGetDichVuGiaList = async (params) => {
  // params: { idDichVu, idPhong, atDate, activeOnly }
  return api.get("/dich-vu-gia", { params });
};

export const apiGetDichVuGiaById = async (id) => {
  return api.get(`/dich-vu-gia/${id}`);
};

export const apiCreateDichVuGia = async (payload) => {
  // 🧠 đảm bảo luôn UTF-8 khi gửi text tiếng Việt
  const data = {
    ...payload,
    doiTuongApDung: payload.doiTuongApDung?.toString() || "Tất cả",
    ghiChu: payload.ghiChu?.toString() || "Giá khám hiện hành",
  };

  console.log("📤 Gửi tạo mới DV giá:", data);
  return api.post("/dich-vu-gia", data);
};

export const apiUpdateDichVuGia = async (id, payload) => {
  const data = {
    ...payload,
    doiTuongApDung: payload.doiTuongApDung?.toString() || "Tất cả",
    ghiChu: payload.ghiChu?.toString() || "Cập nhật giá khám",
  };

  console.log("📤 Gửi cập nhật DV giá:", data);
  return api.put(`/dich-vu-gia/${id}`, data);
};

export const apiSoftDeleteDichVuGia = async (id) => {
  console.log("🗑 Xóa mềm DV giá:", id);
  return api.delete(`/dich-vu-gia/${id}`);
};

export const apiGetGiaHienHanh = async () => {
  return api.get("/dich-vu-gia/hien-hanh");
};

// ======================================================
// 🧩 EXPORT TỔNG
// ======================================================
export default {
  apiGetNhomDichVu,
  apiGetDichVuList,
  apiGetDichVuDropdown,
  apiGetPhongKhamDropdown,
  apiGetDichVuGiaList,
  apiGetDichVuGiaById,
  apiCreateDichVuGia,
  apiUpdateDichVuGia,
  apiSoftDeleteDichVuGia,
  apiGetGiaHienHanh,
};

// src/api/DanhMucThuocApi.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7007/api/DanhMucThuoc",
  headers: { "Content-Type": "application/json" },
});

// ===== Nhóm thuốc =====
export const apiGetNhomThuoc = (keyword = "") =>
  api.get(`/nhom-thuoc`, { params: { keyword } });

// ===== Thuốc =====
export const apiGetThuocList = (params) => api.get(`/thuoc`, { params }); // {idNhom, keyword, hoatDong, page, pageSize}
export const apiGetThuocDropdown = (includeInactive = false) =>
  api.get(`/thuoc/dropdown`, { params: { includeInactive } });
export const apiGetThuocById = (id) => api.get(`/thuoc/${id}`);
export const apiCreateThuoc = (payload) => api.post(`/thuoc`, payload);
export const apiUpdateThuoc = (id, payload) => api.put(`/thuoc/${id}`, payload);
export const apiSoftDeleteThuoc = (id) => api.delete(`/thuoc/${id}`);
export const apiActivateThuoc = (id) => api.put(`/thuoc/kich-hoat/${id}`);

// ===== Giá thuốc =====
export const apiGetThuocGiaList = (params) => api.get(`/thuoc-gia`, { params }); // {idThuoc, atDate, activeOnly}
export const apiCreateThuocGia = (payload) => api.post(`/thuoc-gia`, payload);
export const apiUpdateThuocGia = (id, payload) => api.put(`/thuoc-gia/${id}`, payload);
export const apiSoftDeleteThuocGia = (id) => api.delete(`/thuoc-gia/${id}`);
export const apiActivateThuocGia = (id) => api.put(`/thuoc-gia/kich-hoat/${id}`);

export default {
  apiGetNhomThuoc,
  apiGetThuocList,
  apiGetThuocDropdown,
  apiGetThuocById,
  apiCreateThuoc,
  apiUpdateThuoc,
  apiSoftDeleteThuoc,
  apiActivateThuoc,
  apiGetThuocGiaList,
  apiCreateThuocGia,
  apiUpdateThuocGia,
  apiSoftDeleteThuocGia,
  apiActivateThuocGia,
};

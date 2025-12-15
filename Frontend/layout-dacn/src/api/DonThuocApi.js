// src/api/DonThuocApi.js
import axios from "axios";
import http from "./BacSiApi";

const api = axios.create({
  baseURL: "https://localhost:7007/api/DonThuoc",
  headers: { "Content-Type": "application/json" },
});

// =============================
//  API KÊ ĐƠN THUỐC
// =============================

// Lấy danh sách thuốc (từ endpoint ThuocController bên bạn)
export const apiGetThuocList = () =>
  axios.get("https://localhost:7007/api/Thuoc");

// Kiểm tra đơn thuốc
export const apiCheckDonThuoc = (payload) =>
  api.post(`/check`, payload);

// Tạo đơn thuốc
export const apiCreateDonThuoc = (payload) =>
  api.post(`/`, payload);

// Cập nhật đơn thuốc
export const apiUpdateDonThuoc = (id, payload) =>
  api.put(`/${id}`, payload);

// Xóa đơn thuốc
export const apiDeleteDonThuoc = (id) =>
  api.delete(`/${id}`);

// Lấy đơn theo lần khám
export const apiGetDonTheoLanKham = (idLanKham) =>
  api.get(`/lan-kham/${idLanKham}`);

// Gợi ý thuốc thay thế
export const apiGoiYThuoc = (idThuoc) =>
  api.get(`/goi-y/${idThuoc}`);

// Xóa 1 thuốc trong đơn
export function deleteThuocInDon(idChiTiet) {
  return api.delete(`/chi-tiet/${idChiTiet}`);
}

// Sửa 1 thuốc trong đơn
export function updateThuocInDon(idChiTiet, dto) {
  return api.put(`/chi-tiet/${idChiTiet}`, dto);
}

// Tải PDF đơn thuốc
export function apiDownloadDonThuocPDF(idDon) {
  return axios.get(`https://localhost:7007/api/pdf/donthuoc/${idDon}`, {
    responseType: "blob",
  });
}


export default {
  apiGetThuocList,
  apiCheckDonThuoc,
  apiCreateDonThuoc,
  apiUpdateDonThuoc,
  apiDeleteDonThuoc,
  apiGetDonTheoLanKham,
  apiGoiYThuoc,
  deleteThuocInDon,
  updateThuocInDon,
  apiDownloadDonThuocPDF,
};

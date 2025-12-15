// src/controller/DanhMucDichVuController.js
import {
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
} from "../api/DanhMucDichVuApi";

const safe = async (fn) => {
  try {
    const res = await fn();
    return [res.data, null];
  } catch (err) {
    const msg =
      err?.response?.data?.message ||
      err?.response?.data ||
      err?.message ||
      "Có lỗi xảy ra";
    return [null, msg];
  }
};

// ===== Nhóm dịch vụ =====
export const getNhomDichVu = async (keyword) =>
  safe(() => apiGetNhomDichVu(keyword));

// ===== Dịch vụ =====
export const getDichVuList = async (filters) =>
  safe(() => apiGetDichVuList(filters));

export const getDichVuDropdown = async () => safe(apiGetDichVuDropdown);

// ===== Phòng khám =====
export const getPhongKhamDropdown = async () => safe(apiGetPhongKhamDropdown);

// ===== Dịch vụ giá =====
export const getDichVuGiaList = async (filters) =>
  safe(() => apiGetDichVuGiaList(filters));

export const getDichVuGiaById = async (id) => safe(() => apiGetDichVuGiaById(id));

export const createDichVuGia = async (payload) =>
  safe(() => apiCreateDichVuGia(payload));

export const updateDichVuGia = async (id, payload) =>
  safe(() => apiUpdateDichVuGia(id, payload));

export const softDeleteDichVuGia = async (id) =>
  safe(() => apiSoftDeleteDichVuGia(id));

export const getGiaHienHanh = async () => safe(apiGetGiaHienHanh);

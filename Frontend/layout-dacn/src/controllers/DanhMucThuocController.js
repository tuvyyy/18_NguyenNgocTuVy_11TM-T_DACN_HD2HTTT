// src/controllers/DanhMucThuocController.js
import * as api from "../api/DanhMucThuocApi";

export const loadFilters = async () => {
  const [nhom] = await Promise.all([api.apiGetNhomThuoc("")]);
  return { nhomList: nhom.data ?? [] };
};

export const loadThuoc = async (filters) => {
  const { idNhom, keyword, hoatDong, page = 1, pageSize = 12 } = filters;
  const res = await api.apiGetThuocList({ idNhom, keyword, hoatDong, page, pageSize });
  return res.data;
};

export const createThuoc = async (payload) => {
  const res = await api.apiCreateThuoc(payload);
  return res.data;
};

export const updateThuoc = async (id, payload) => {
  const res = await api.apiUpdateThuoc(id, payload);
  return res.data;
};

export const toggleThuoc = async (row) => {
  return row.hoatDong
    ? api.apiSoftDeleteThuoc(row.id)
    : api.apiActivateThuoc(row.id);
};

export const loadGiaByThuoc = async (idThuoc, activeOnly = false) => {
  if (!idThuoc) return [];
  const res = await api.apiGetThuocGiaList({ idThuoc, activeOnly });
  return res.data ?? [];
};

export const createGia = async (payload) => {
  const res = await api.apiCreateThuocGia(payload);
  return res.data;
};

export const updateGia = async (id, payload) => {
  const res = await api.apiUpdateThuocGia(id, payload);
  return res.data;
};

export const toggleGia = async (row) => {
  return row.hoatDong
    ? api.apiSoftDeleteThuocGia(row.id)
    : api.apiActivateThuocGia(row.id);
};

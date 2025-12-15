// src/api/DanhMucDVKTApi.js
import axios from "axios";

const BASE = "https://localhost:7007/api/admin/dvkt";

const api = axios.create({
  baseURL: BASE,
  headers: { "Content-Type": "application/json" },
});

// NHÓM DVKT
export const apiGetNhomDVKT = () => api.get("/nhom");
export const apiCreateNhomDVKT = (payload) => api.post("/nhom", payload);
export const apiUpdateNhomDVKT = (id, payload) =>
  api.put(`/nhom/${id}`, payload);

// DANH MỤC DVKT
export const apiGetDVKT = () => api.get("");
export const apiCreateDVKT = (payload) => api.post("", payload);
export const apiUpdateDVKT = (id, payload) => api.put(`/${id}`, payload);

// TOGGLE HOẠT ĐỘNG DVKT + NHÓM
export const apiToggleDVKT = (id) => api.patch(`/${id}/toggle`);
export const apiToggleNhomDVKT = (id) => api.patch(`/nhom/${id}/toggle`);

// GIÁ DVKT
export const apiGetGiaDVKT = (idDVKT) => api.get(`/${idDVKT}/gia`);
export const apiCreateGiaDVKT = (payload) => api.post(`/gia`, payload);
export const apiUpdateGiaDVKT = (id, payload) =>
  api.put(`/gia/${id}`, payload);

export default {
  apiGetNhomDVKT,
  apiCreateNhomDVKT,
  apiUpdateNhomDVKT,

  apiGetDVKT,
  apiCreateDVKT,
  apiUpdateDVKT,

  apiGetGiaDVKT,
  apiCreateGiaDVKT,
  apiUpdateGiaDVKT,
  apiToggleDVKT,
  apiToggleNhomDVKT,
};

// ============================================
// src/api/BacSiApi.js
// ============================================

import axios from "axios";

/** ============================================
 *  Axios instance + helpers
 *  ============================================ */
const BASE_URL = "https://localhost:7007";

// Lấy token
const getToken = () => localStorage.getItem("access_token");



const http = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  withCredentials: false,
  validateStatus: () => true,
});

// Gắn Authorization nếu có
http.interceptors.request.use((config) => {
  const token = getToken();
  console.log("---- FE REQUEST ----");
  console.log("URL =", config.url);
  console.log("METHOD =", config.method);
console.log("INTERCEPTOR TOKEN = ", token);

  if (token) config.headers.Authorization = `Bearer ${token}`;

  return config;
});

// Chuẩn hóa response
const ok = (res) => res?.status >= 200 && res?.status < 300;

const wrap = (res) => {
  const isOk = res?.status >= 200 && res?.status < 300;

  // Trường hợp BE trả về plain text
  if (typeof res?.data === "string") {
    return {
      ok: isOk,
      status: res.status,
      data: null,
      message: res.data,   // <-- Lấy nội dung text BE trả về
    };
  }

  // Trường hợp BE trả JSON
  return {
    ok: isOk,
    status: res?.status ?? 0,
    data: res?.data?.data ?? res?.data ?? null,
    message:
      res?.data?.message ||
      res?.data?.error ||
      (isOk ? "Success" : `Error ${res?.status || ""}`.trim()),
  };
};

export async function chiDinhDVKTRaw(dto, config = {}) {
  return http.post("/api/bacsi/dvkt/chidinh", dto, config);
}

// CHỈ ĐỊNH DVKT – LUÔN GỬI TOKEN
export async function chiDinhDVKT(dto) {
  const token = getToken();

  const res = await http.post(
    "/api/bacsi/dvkt/chidinh",
    dto,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return wrap(res);
}

export function getLanKhamDetail(id) {
  return http.get(`/api/LanKham/lan-kham/${id}/detail`);
}

// 1) DANH SÁCH BỆNH NHÂN CHỜ KHÁM
export async function getChoKham({ idBacSi, idPhong }) {
  const res = await http.get("/api/LanKham/cho-kham", {
    params: { idBacSi, idPhong },
  });
  return wrap(res);
}

// 2) DANH SÁCH LƯỢT KHÁM HÔM NAY
export async function getHomNay({ idBacSi, idPhong }) {
  const res = await http.get("/api/LanKham/hom-nay", {
    params: { idBacSi, idPhong },
  });
  return wrap(res);
}

// 2.1) DANH SÁCH LƯỢT ĐÃ KHÁM
export async function getDaKham({ idBacSi, idPhong }) {
  const res = await http.get("/api/LanKham/da-kham", {
    params: { idBacSi, idPhong },
  });
  return wrap(res);
}

// 3) CẬP NHẬT KẾT QUẢ KHÁM
export async function updateKetQuaKham(idLanKham, dto) {
  const res = await http.put(`/api/LanKham/${idLanKham}`, dto);
  return wrap(res);
}

// DANH SÁCH DVKT
export async function getAllDVKT() {
  const res = await http.get("/api/bacsi/dvkt/full");
  return wrap(res);
}

// Lấy DVKT theo lần khám
export async function getDVKTByLanKham(idLanKham) {
  const res = await http.get(`/api/bacsi/dvkt/lankham/${idLanKham}`);
  return wrap(res);
}

// Cập nhật DVKT
export async function updateDVKT(id, dto) {
  const res = await http.put(`/api/bacsi/dvkt/${id}`, dto);
  return wrap(res);
}

// Hủy DVKT
export async function cancelDVKT(id) {
  const res = await http.delete(`/api/bacsi/dvkt/${id}`);
  return wrap(res);
}

// 6) HỦY LƯỢT KHÁM
export async function cancelLanKham(idLanKham, reason) {
  const res = await http.patch(
    `/api/LanKham/${idLanKham}/cancel`,
    reason ?? ""
  );
  return wrap(res);
}

// 7) LỊCH SỬ KHÁM
export async function getLichSuKham(idBenhNhan) {
  const res = await http.get(`/api/benhNhan/${idBenhNhan}/lichSuKham`);
  return wrap(res);
}

// Helper
export function ensureOk(resp, fallbackMsg = "Có lỗi xảy ra") {
  if (!resp?.ok) throw new Error(resp?.message || fallbackMsg);
  return resp.data;
}

// Lấy phòng theo bác sĩ
export async function getPhongByBacSi(idBacSi) {
  const res = await http.get(`/api/bacsi/${idBacSi}/phong`);
  return wrap(res);
}


export async function apiReopenHoSo(idLanKham) {
  return http.patch(`/api/LanKham/${idLanKham}/reopen`);
}



// ============================================
// DEFAULT EXPORT
// ============================================
const BacSiApi = {
  getChoKham,
  getHomNay,
  getDaKham,
  updateKetQuaKham,
  cancelLanKham,
  getLichSuKham,
  getPhongByBacSi,

  chiDinhDVKT,
  chiDinhDVKTRaw, // ← Dâu nghĩ là có

  getAllDVKT,
  getDVKTByLanKham,
  updateDVKT,
  cancelDVKT,
  apiReopenHoSo,
  ensureOk,
};

export default BacSiApi;

// src/controllers/DanhMucDVKTController.js
import {
  apiGetNhomDVKT,
  apiGetDVKT,
  apiCreateDVKT,
  apiUpdateDVKT,
  apiGetGiaDVKT,
  apiCreateGiaDVKT,
  apiUpdateGiaDVKT,
  apiToggleDVKT,
} from "../api/DanhMucDVKTApi";

import Swal from "sweetalert2";

// ================== NHÓM DVKT ==================
export async function loadNhomDVKT() {
  const res = await apiGetNhomDVKT();
  return Array.isArray(res.data) ? res.data : [];
}

// ================== DANH MỤC DVKT ==================
export async function loadDVKT() {
  const res = await apiGetDVKT();
  return Array.isArray(res.data) ? res.data : [];
}

export async function createDVKT(payload) {
  const res = await apiCreateDVKT(payload);
  return res.data;
}

export async function updateDVKT(id, payload) {
  const res = await apiUpdateDVKT(id, payload);
  return res.data;
}

export async function toggleDVKT(id) {
  const res = await apiToggleDVKT(id);
  return res.data;
}


// ================== GIÁ DVKT ==================
export async function loadGiaDVKT(idDVKT) {
  const res = await apiGetGiaDVKT(idDVKT);
  return Array.isArray(res.data) ? res.data : [];
}

export async function createGiaDVKT(payload) {
  const res = await apiCreateGiaDVKT(payload);
  return res.data;
}

export async function updateGiaDVKT(id, payload) {
  const res = await apiUpdateGiaDVKT(id, payload);
  return res.data;
}

// ================== ALERT ==================
export function alertSuccess(message = "Thành công!") {
  Swal.fire({
    icon: "success",
    title: message,
    timer: 1500,
    showConfirmButton: false,
  });
}

export function alertError(message = "Có lỗi xảy ra!") {
  Swal.fire({
    icon: "error",
    title: "Lỗi",
    text: message,
  });
}

// src/api/TiepDonApi.js
import axios from "axios";

const API_BASE = "https://localhost:7007/api/reception";

/* ============================================================
   AXIOS INSTANCE CHUẨN
============================================================ */
const http = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  validateStatus: () => true, // FE đọc được cả 400
  headers: {
    "Content-Type": "application/json",
  },
});

/* ============================================================
   LIST TODAY
============================================================ */
export const getReceptionList = async (date) => {
  try {
    const res = await http.get("/list-today", {
      params: date ? { date } : {},
    });

    return res.data;
  } catch (err) {
    console.error("❌ [TiepDonApi.getReceptionList] Lỗi:", err);
    return [];
  }
};

/* ============================================================
   CREATE PATIENT
============================================================ */
export const createPatient = async (payload) => {
  try {
    return await http.post("/patients", payload, {
      validateStatus: () => true,
    });
  } catch (err) {
    console.error("❌ [TiepDonApi.createPatient] Lỗi:", err);
    return null;
  }
};

/* ============================================================
   CREATE RECORD
============================================================ */
export const createRecord = async (payload) => {
  console.group("🚨 DEBUG createRecord()");
  console.log("📤 Payload gửi BE:", JSON.stringify(payload, null, 2));

  try {
    const res = await axios.post(`${API_BASE}/records`, payload, {
      headers: { "Content-Type": "application/json" },
      validateStatus: () => true,
    });

    console.log("📥 Response STATUS:", res.status);
    console.log("📥 Response DATA:", res.data);

    if (res.status >= 400) {
      console.error("❌ BE trả lỗi:");
      console.error(res.data);

      // Nếu BE có inner exception → in rõ ra
      if (res.data?.error || res.data?.errors) {
        console.error("🔥 INNER ERROR (DB / ModelState):");
        console.error(res.data.error || res.data.errors);
      }
    }

    console.groupEnd();
    return res;
  } catch (err) {
    console.error("💥 EXCEPTION createRecord():", err);
    console.groupEnd();
    return null;
  }
};


/* ============================================================
   CHECK PATIENT
============================================================ */
export const checkPatient = async (cccd, sdt) => {
  if (!cccd && !sdt) return null;

  try {
    const res = await http.get("/patients/check", {
      params: {
        CCCD: cccd || undefined,
        SoDienThoai: sdt || undefined,
      },
    });

    return res.data;
  } catch (err) {
    console.error("❌ [TiepDonApi.checkPatient] Lỗi:", err);
    return null;
  }
};

/* ============================================================
   CANCEL RECEPTION
============================================================ */
export const cancelReception = async (id) => {
  try {
    return await http.patch(`/cancel/${id}`, null, {
      validateStatus: () => true,
    });
  } catch (err) {
    console.error("❌ [TiepDonApi.cancelReception] Lỗi:", err);
    return null;
  }
};

/* ============================================================
   LIST CANCELLED
============================================================ */
export const getCancelledList = async () => {
  try {
    const res = await http.get("/cancelled");
    return res.data;
  } catch (err) {
    console.error("❌ [TiepDonApi.getCancelledList] Lỗi:", err);
    return [];
  }
};

/* ============================================================
   RECEPTION STATS
============================================================ */
export const getStats = async () => {
  try {
    const res = await http.get("/stats");
    return res.data;
  } catch (err) {
    console.error("❌ [TiepDonApi.getStats] Lỗi:", err);
    return {};
  }
};

/* ============================================================
   API SINH HIỆU
============================================================ */
export const getSinhHieuByLanKham = async (idLanKham) => {
  try {
    const res = await axios.get(
      `https://localhost:7007/api/sinhhieu/lankham/${idLanKham}`,
      { validateStatus: () => true }
    );
    return res.data;
  } catch (err) {
    console.error("❌ [TiepDonApi.getSinhHieuByLanKham] Lỗi:", err);
    return null;
  }
};

export const saveSinhHieu = async (payload) => {
  try {
    const res = await axios.post(
      `https://localhost:7007/api/sinhhieu`,
      payload,
      { validateStatus: () => true }
    );
    return res.data;
  } catch (err) {
    console.error("❌ [TiepDonApi.saveSinhHieu] Lỗi:", err);
    return null;
  }
};

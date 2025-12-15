import axios from "axios";

const API_BASE = "https://localhost:7007/api/ktv/dvkt";

// Lấy token tự động
const getToken = () =>
  localStorage.getItem("access_token") ||
  localStorage.getItem("token") ||
  sessionStorage.getItem("access_token");

const authHeader = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/* =====================================================
   1) DANH SÁCH PENDING
===================================================== */
export const getPendingDVKT = async () => {
  try {
    const res = await axios.get(`${API_BASE}/pending`, {
      headers: authHeader(),
    });
    return res.data;
  } catch (err) {
    console.error("❌ Lấy pending lỗi:", err);
    return [];
  }
};

/* =====================================================
   2) DANH SÁCH PROCESSING
===================================================== */
export const getProcessingDVKT = async () => {
  try {
    const res = await axios.get(`${API_BASE}/processing`, {
      headers: authHeader(),
    });
    return res.data;
  } catch (err) {
    console.error("❌ Lấy processing lỗi:", err);
    return [];
  }
};

/* =====================================================
   3) DONE
===================================================== */
export const getDoneDVKT = async (from = "", to = "") => {
  try {
    const res = await axios.get(`${API_BASE}/done`, {
      params: { from, to },
      headers: authHeader(),
    });
    return res.data;
  } catch (err) {
    console.error("❌ Lấy done lỗi:", err);
    return [];
  }
};

/* =====================================================
   4) NHẬN DVKT
===================================================== */
export const nhanDVKT = async (id) => {
  const res = await axios.patch(`${API_BASE}/nhan/${id}`, null, {
    headers: authHeader(),
  });
  return res.data;
};

/* =====================================================
   5) HỦY NHẬN DVKT
===================================================== */
export const huyNhanDVKT = async (id) => {
  const res = await axios.patch(`${API_BASE}/huy-nhan/${id}`, null, {
    headers: authHeader(),
  });
  return res.data;
};

/* =====================================================
   6) LƯU KQ TỔNG
===================================================== */
export const saveKetQuaTong = async (payload) => {
  const res = await axios.post(`${API_BASE}/ketqua`, payload, {
    headers: { "Content-Type": "application/json", ...authHeader() },
  });
  return res.data;
};

/* =====================================================
   7) LƯU KQ CHỈ TIÊU
===================================================== */
export const saveKetQuaChiTiet = async (payload) => {
  const res = await axios.post(`${API_BASE}/ketqua/chitiet`, payload, {
    headers: { "Content-Type": "application/json", ...authHeader() },
  });
  return res.data;
};

/* =====================================================
   8) FULL KQ
===================================================== */
export const fetchFullKetQua = async (idChiDinh) => {
  const res = await axios.get(`${API_BASE}/ketqua/full/${idChiDinh}`, {
    headers: authHeader(),
  });
  return res.data;
};

/* =====================================================
   9) DUYỆT KQ
===================================================== */
export const approveKetQua = async (idChiDinh) => {
  const res = await axios.patch(`${API_BASE}/duyet/${idChiDinh}`, null, {
    headers: authHeader(),
  });
  return res.data;
};

/* =====================================================
   10) HỦY DUYỆT (🔥 FIX QUAN TRỌNG)
===================================================== */
export const cancelApproveKetQua = async (idChiDinh) => {
  const res = await axios.patch(`${API_BASE}/huy-duyet/${idChiDinh}`, null, {
    headers: authHeader(),
  });
  return res.data;
};

/* =====================================================
   11) SEND KQ
===================================================== */
export const sendKetQua = async (idChiDinh) => {
  const res = await axios.patch(`${API_BASE}/send/${idChiDinh}`, null, {
    headers: authHeader(),
  });
  return res.data;
};

/* =====================================================
   12) HOÀN THÀNH DVKT
===================================================== */
export const hoanThanhDVKT = async (id) => {
  const res = await axios.patch(`${API_BASE}/hoanthanh/${id}`, null, {
    headers: authHeader(),
  });
  return res.data;
};

/* =====================================================
   13) LOG
===================================================== */
export const getLogsDVKT = async (idChiDinh) => {
  const res = await axios.get(`${API_BASE}/logs/${idChiDinh}`, {
    headers: authHeader(),
  });
  return res.data;
};

/* =====================================================
   14) EXPORT PDF DVKT
===================================================== */
export const exportPdfDVKT = async (id) => {
  const token = getToken();

  const res = await axios.get(
    `${API_BASE}/pdf/${id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "blob"
    }
  );

  return res.data; // blob
};




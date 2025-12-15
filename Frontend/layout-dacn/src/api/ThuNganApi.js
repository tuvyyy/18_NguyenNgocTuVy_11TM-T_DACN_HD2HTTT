import axios from "axios";

const API_BASE = "https://localhost:7007/api/HoaDon";

// ================== DANH SÁCH CHỜ THANH TOÁN ==================
export const getWaitingPatients = async (type = "") => {
  try {
    const res = await axios.get(`${API_BASE}/benh-nhan-cho-thanh-toan`, {
      params: { loai: type || "" },
    });
    return res.data;
  } catch (err) {
    console.error("❌ Lỗi khi lấy danh sách bệnh nhân:", err);
    return [];
  }
};

// ================== XEM CHI TIẾT HÓA ĐƠN ==================
export const getBillDetail = async (idOrCode) => {
  try {
    if (!idOrCode) return null;
    const url = `${API_BASE}/ma/${idOrCode}`;
    const res = await axios.get(url);
    return res.data;
  } catch (err) {
    console.error("❌ Lỗi khi lấy chi tiết hóa đơn:", err);
    return null;
  }
};
// ================== TẠO URL THANH TOÁN VNPAY ==================
export const getVnpayPaymentUrl = async (maHoaDon) => {
  try {
    const res = await axios.get(
      `https://localhost:7007/api/Vnpay/CreatePaymentUrl`,
      {
        params: { maHd: maHoaDon },
      }
    );

    return res.data; // { paymentUrl: "https://..." }
  } catch (err) {
    console.error("❌ Lỗi tạo URL thanh toán VNPay:", err);
    return null;
  }
};

// ================== XÁC NHẬN THANH TOÁN ==================
export const confirmPayment = async (idOrCode, idThuNgan) => {
  try {
    const isStringCode = typeof idOrCode === "string";
    const url = isStringCode
      ? `${API_BASE}/xac-nhan-thanh-toan/ma/${idOrCode}`
      : `${API_BASE}/xac-nhan-thanh-toan/${idOrCode}`;
    const res = await axios.put(
  url,
  { idThuNgan }, // ✅ gửi đúng body JSON
  {
    headers: { "Content-Type": "application/json" },
  }
);

    return res.data;
  } catch (err) {
    console.error("❌ Lỗi khi xác nhận thanh toán:", err);
    throw err;
  }
};

// ================== IN PHIẾU THU ==================
export const getReceipt = async (idOrCode) => {
  try {
    if (!idOrCode) return null;
    const isStringCode =
      typeof idOrCode === "string" && idOrCode.toUpperCase().startsWith("HD-");
    const url = isStringCode
      ? `${API_BASE}/phieu-thu/ma/${idOrCode}`
      : `${API_BASE}/phieu-thu/${idOrCode}`;
    const res = await axios.get(url);
    return res.data;
  } catch (err) {
    console.error("❌ Lỗi khi lấy phiếu thu:", err);
    return null;
  }
};

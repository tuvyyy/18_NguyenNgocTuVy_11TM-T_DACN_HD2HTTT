import {
  getPendingDVKT,
  getProcessingDVKT,
  getDoneDVKT,
  nhanDVKT,
  huyNhanDVKT,
  saveKetQuaTong,
  saveKetQuaChiTiet,
  hoanThanhDVKT,
  getLogsDVKT,
  fetchFullKetQua,
  approveKetQua,
  cancelApproveKetQua,
  sendKetQua,
  exportPdfDVKT ,
} from "../api/ThucHienDVKTApi";

import Swal from "sweetalert2";


export const handleExportPDF = async (id, refresh) => {
  try {
    const blob = await exportPdfDVKT(id);
    const url = window.URL.createObjectURL(blob);
    window.open(url, "_blank");
  } catch (err) {
    console.log("PDF err:", err);
    Swal.fire("Lỗi", "Không thể xuất PDF", "error");
  }
};
// =============================
// PENDING
// =============================
export const loadPending = async (setState) => {
  setState((s) => ({ ...s, loading: true }));
  const data = await getPendingDVKT();
  setState((s) => ({ ...s, pending: data, loading: false }));
};

// PROCESSING
export const loadProcessing = async (setState) => {
  setState((s) => ({ ...s, loading: true }));
  const data = await getProcessingDVKT();
  setState((s) => ({ ...s, processing: data, loading: false }));
};

// =============================
// DONE – CHUẨN DUY NHẤT
// =============================
export const loadDone = async (setState, from = "", to = "") => {
  setState((s) => ({ ...s, loading: true }));

  const raw = await getDoneDVKT(from, to);
  console.log("🔥 RAW FROM BE:", raw);

  const data = raw.map((x) => ({
    ...x,
    trangThaiKQ: x.trangThaiKQ ?? "draft",  // ⭐ LẤY TRỰC TIẾP TỪ BE
  }));

  console.log("🔥 DONE DATA FE SAU MAP:", data);

  setState((s) => ({ ...s, done: data, loading: false }));
};


// =============================
// SAVE KQ TỔNG
// =============================
export const handleSaveKetQuaTong = async (payload, refresh) => {
  try {
    await saveKetQuaTong(payload);
    Swal.fire("OK", "Đã lưu kết quả tổng", "success");
    refresh && refresh();
  } catch {
    Swal.fire("Lỗi", "Không thể lưu", "error");
  }
};

// =============================
// SAVE CHI TIẾT
// =============================
export const handleSaveChiTiet = async (payload, refresh) => {
  try {
    await saveKetQuaChiTiet(payload);
    refresh && refresh();
  } catch {
    Swal.fire("Lỗi", "Không thể lưu chỉ tiêu", "error");
  }
};

// =============================
// DUYỆT
// =============================
export const handleDuyet = async (id, refresh) => {
  try {
    await approveKetQua(id);
    Swal.fire("Đã ký", "Kết quả đã được duyệt", "success");
    refresh && refresh();
  } catch {
    Swal.fire("Lỗi", "Không thể duyệt", "error");
  }
};

// =============================
// HỦY DUYỆT
// =============================
export const handleHuyDuyet = async (id, refresh) => {
  try {
    await cancelApproveKetQua(id);
    Swal.fire("Đã hủy ký", "Bạn có thể chỉnh sửa lại", "success");
    refresh && refresh();
  } catch {
    Swal.fire("Lỗi", "Không thể hủy ký", "error");
  }
};

// =============================
// GỬI KQ
// =============================
export const handleGui = async (id, refresh) => {
  try {
    await sendKetQua(id);
    Swal.fire("Đã gửi", "Đã gửi về phòng khám", "success");
    refresh && refresh();
  } catch {
    Swal.fire("Lỗi", "Không thể gửi", "error");
  }
};

// =============================
// NHẬN
// =============================
export const handleNhan = async (id, refresh) => {
  try {
    await nhanDVKT(id);
    Swal.fire("Đã nhận", "", "success");
    refresh && refresh();
  } catch (err) {
    Swal.fire("Lỗi", err?.response?.data, "error");
  }
};

// =============================
// HỦY NHẬN
// =============================
export const handleHuyNhan = async (id, refresh) => {
  try {
    await huyNhanDVKT(id);
    Swal.fire("Đã hủy nhận", "", "info");
    refresh && refresh();
  } catch {
    Swal.fire("Lỗi", "Không thể hủy nhận", "error");
  }
};

// =============================
// HOÀN THÀNH
// =============================
export const handleHoanThanh = async (id, refresh) => {
  try {
    await hoanThanhDVKT(id);
    Swal.fire("Hoàn thành", "", "success");
    refresh && refresh();
  } catch {
    Swal.fire("Lỗi", "Không thể hoàn thành", "error");
  }
};

// =============================
// LOGS
// =============================
export const loadLogs = async (id, setLogs) => {
  const data = await getLogsDVKT(id);
  setLogs(data);
};

// =============================
// EXPORT CONTROLLER
// =============================
export const ThucHienDVKTController = {
  loadPending,
  loadProcessing,
  loadDone,
  loadLogs,

  handleNhan,
  handleHuyNhan,
  handleSaveKetQuaTong,
  handleSaveChiTiet,
  handleDuyet,
  handleHuyDuyet,
  handleGui,
  handleHoanThanh,

  fetchFull: fetchFullKetQua,
  handleExportPDF,
};

// ======================================================
// src/controllers/BacSiController.js
// ======================================================

import { toast } from "react-toastify";
import Swal from "sweetalert2";


import {
  getChoKham,
  getHomNay,
  getDaKham,
  updateKetQuaKham,
  cancelLanKham,
  getLichSuKham,
  getPhongByBacSi,
  getLanKhamDetail,
  getDVKTByLanKham,
  updateDVKT,
  cancelDVKT,
  ensureOk,
  apiReopenHoSo,
} from "../api/BacSiApi";

import {
  apiGetThuocList,
  apiCheckDonThuoc,
  apiCreateDonThuoc,
  apiUpdateDonThuoc,
  apiDeleteDonThuoc,
  apiGetDonTheoLanKham,
  apiGoiYThuoc,
  deleteThuocInDon,        // ✔ ĐÚNG (từ DonThuocApi)
  updateThuocInDon,        // ✔ ĐÚNG
} from "../api/DonThuocApi";


// ⭐ 0) LẤY CHI TIẾT LẦN KHÁM
export async function fetchLanKhamDetail(id, setState) {
  try {
    const res = await getLanKhamDetail(id);
    const d = res.data;

    const mapped = {
      id: d.idLanKham,
      idLanKham: d.idLanKham,

      // bệnh nhân
      idBenhNhan: d.benhNhan?.id || null,
      hoTen: d.benhNhan?.hoTen || "",
      gioiTinh: d.benhNhan?.gioiTinh || "",
      ngaySinh: d.benhNhan?.ngaySinh || null,
      soDienThoai: d.benhNhan?.soDienThoai || "",
      diaChi: d.benhNhan?.diaChi || "",

      // bác sĩ
      bacSi: d.bacSi || null,

      // trạng thái
      trangThai: d.trangThai || "",

      // sinh hiệu
      sinhHieu: d.sinhHieu || null,

      // kết quả khám
      chanDoanSoBo: d.chanDoanSoBo || "",
      chanDoanCuoi: d.chanDoanCuoi || "",
      ketQuaKham: d.ketQuaKham || "",
      huongXuTri: d.huongXuTri || "",
      ghiChu: d.ghiChu || "",
    };

    setState(mapped);
  } catch (err) {
    console.error("fetchLanKhamDetail err:", err);
  }
}


// ======================================================
// 1) DANH SÁCH CHỜ KHÁM
// ======================================================
export async function fetchChoKhamList(idBacSi, idPhong, setList) {
  try {
    const res = await getChoKham({ idBacSi, idPhong });
    ensureOk(res);
    setList(res.data || []);
  } catch (err) {
    console.error("❌ fetchChoKhamList:", err);
    toast.error("Không tải được danh sách chờ khám!");
  }
}


// ======================================================
// 2) DANH SÁCH HÔM NAY
// ======================================================
export async function fetchHomNayList(idBacSi, idPhong, setList) {
  try {
    const res = await getHomNay({ idBacSi, idPhong });
    ensureOk(res);
    setList(res.data || []);
  } catch (err) {
    console.error("❌ fetchHomNayList:", err);
    toast.error("Không tải được danh sách hôm nay!");
  }
}

// 2.1) DANH SÁCH ĐÃ KHÁM
export async function fetchDaKhamList(idBacSi, idPhong, setList) {
  try {
    const res = await getDaKham({ idBacSi, idPhong });
    ensureOk(res);
    setList(res.data || []);
  } catch (err) {
    console.error("❌ fetchDaKhamList:", err);
    toast.error("Không tải được danh sách đã khám!");
  }
}

// 3) CẬP NHẬT KẾT QUẢ
export async function handleUpdateKetQua(idLanKham, form, onDone) {
  try {
    const dto = {
      ChanDoanSoBo: form.chan_doan_so_bo,
      ChanDoanCuoi: form.chan_doan_cuoi,
      KetQuaKham: form.ket_qua,
      HuongXuTri: form.huong_xu_tri,
      GhiChu: form.ghi_chu,
    };

    const res = await updateKetQuaKham(idLanKham, dto);
    ensureOk(res);

    toast.success("💾 Đã lưu kết quả khám!");
    onDone?.();
  } catch (err) {
    console.error("❌ handleUpdateKetQua:", err);
    toast.error("Không thể lưu kết quả khám!");
  }
}

// 4) LẤY ĐƠN THUỐC THEO LẦN KHÁM
export async function fetchDonTheoLanKham(idLanKham, setDon) {
  try {
    const res = await apiGetDonTheoLanKham(idLanKham);
    const data = res.data || null;
    setDon(data);
    return data;   // ⭐⭐ QUAN TRỌNG: RETURN VỀ
  } catch (err) {
    console.error("❌ fetchDonTheoLanKham:", err);
    setDon(null);
    return null;   // ⭐⭐ RETURN LUÔN
  }
}

// 5) LẤY DANH SÁCH THUỐC
export async function fetchThuocList(setList) {
  try {
    const res = await apiGetThuocList();
    setList(res.data || []);
  } catch (err) {
    console.error("❌ fetchThuocList:", err);
    toast.error("Không tải được danh sách thuốc!");
  }
}

export async function handleCheckDonThuoc(dto) {
  try {
    const res = await apiCheckDonThuoc(dto);
    return res.data || null;
  } catch {
    return null;
  }
}

// ⭐ 6) DVKT THEO LẦN KHÁM
export async function fetchDVKTTheoLanKham(idLanKham, setter) {
  try {
    const res = await getDVKTByLanKham(idLanKham);
    ensureOk(res);
    setter(res.data || []);
  } catch (err) {
    console.error("❌ fetchDVKTTheoLanKham:", err);
    setter([]);
  }
}
// ⭐ 6.1) CẬP NHẬT CHỈ ĐỊNH DVKT
export async function handleUpdateDVKT(id, dto, onDone) {
  try {
    const res = await updateDVKT(id, dto);
    ensureOk(res);

    toast.success("✏️ Đã cập nhật chỉ định!");
    onDone?.();
  } catch (err) {
    console.error("❌ handleUpdateDVKT:", err);
    toast.error("Không thể cập nhật chỉ định!");
  }
}
// ⭐ 6.2) HỦY CHỈ ĐỊNH DVKT (pending → canceled)
export async function handleCancelDVKT(id, onDone) {
  try {
    const res = await cancelDVKT(id);

    // Nếu BE trả lỗi
    if (!res.ok) {
      return Swal.fire({
        icon: "error",
        title: "Không thể hủy chỉ định",
        text: res.message || "Có lỗi xảy ra!",
      });
    }

    Swal.fire({
      icon: "success",
      title: "Đã hủy chỉ định",
      timer: 1200,
      showConfirmButton: false,
    });

    onDone?.();

  } catch (err) {
    console.error("❌ handleCancelDVKT:", err);

    return Swal.fire({
      icon: "error",
      title: "Không thể hủy chỉ định",
      text:
        err?.response?.data ||
        err?.response?.data?.message ||
        err?.message ||
        "Có lỗi xảy ra.",
    });
  }
}

// 7) TẠO – CẬP NHẬT – XÓA ĐƠN THUỐC
export async function handleCreateDonThuoc(dto, onDone) {
  try {
    const res = await apiCreateDonThuoc(dto);
    toast.success("💊 Đã tạo đơn thuốc!");
    onDone?.(res.data);
  } catch (err) {
    console.error("❌ handleCreateDonThuoc:", err);
    toast.error("Không thể tạo đơn thuốc!");
  }
}

export async function handleUpdateDonThuoc(id, dto, onDone) {
  try {
    const res = await apiUpdateDonThuoc(id, dto);
    toast.success("🔄 Đã cập nhật đơn!");
    onDone?.(res.data);
  } catch (err) {
    console.error("❌ handleUpdateDonThuoc:", err);
    toast.error("Không thể cập nhật đơn thuốc!");
  }
}

export async function handleDeleteDonThuoc(id, onDone) {
  try {
    await apiDeleteDonThuoc(id);
    toast.info("🗑️ Đã xóa đơn thuốc");
    onDone?.();
  } catch (err) {
    console.error("❌ handleDeleteDonThuoc:", err);
  }
}

// 8) GỢI Ý THUỐC
export async function fetchGoiYThuoc(idThuoc, setList) {
  try {
    const res = await apiGoiYThuoc(idThuoc);
    setList(res.data || []);
  } catch (err) {
    console.error("❌ fetchGoiYThuoc:", err);
  }
}

// 9) HỦY KHÁM
export async function handleCancelLanKham(idLanKham, reason, onDone) {
  try {
    const res = await cancelLanKham(idLanKham, reason);
    ensureOk(res);

    toast.info("🗑️ Đã hủy lượt khám");
    onDone?.();
  } catch (err) {
    console.error("❌ handleCancelLanKham:", err);
  }
}

// 🔟 PHÒNG BÁC SĨ
export async function fetchPhongBacSi(idBacSi, setPhong) {
  try {
    const res = await getPhongByBacSi(idBacSi);
    ensureOk(res);
    setPhong(res.data);
  } catch (err) {
    console.error("❌ fetchPhongBacSi:", err);
  }
}

// 1️⃣1️⃣ LỊCH SỬ KHÁM
export async function fetchLichSuKham(idBenhNhan, setList) {
  try {
    const res = await getLichSuKham(idBenhNhan);
    ensureOk(res);
    setList(res.data || []);
  } catch (err) {
    console.error("❌ fetchLichSuKham:", err);
  }
}

export async function handleReopenHoSo(idLanKham, callback) {
  try {
    const res = await apiReopenHoSo(idLanKham);

    if (res?.status === 200) {
      if (callback) await callback();
      return true;
    }

    return false;
  } catch (err) {
    return false;
  }
}
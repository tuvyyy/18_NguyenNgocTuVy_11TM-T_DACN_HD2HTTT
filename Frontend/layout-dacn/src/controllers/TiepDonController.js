// src/controllers/TiepDonController.js
import {
  createPatient,
  createRecord,
  checkPatient,
  getReceptionList,
  getCancelledList,
  getStats,
} from "../api/TiepDonApi";

/* ============================================================
   HELPERS
============================================================ */
const buildPatientInfoFromForm = (form, { idBenhNhan, idHoSo, maBn, maHs }) => ({
  idBenhNhan,
  idHoSo,
  maBn,
  maHs,
  hoTen: form.ho_ten || "",
  gioiTinh: form.gio_tinh || "",
  ngaySinh: form.ngay_sinh || "",
  soDienThoai: form.so_dien_thoai || "",
  diaChi: form.dia_chi_duong || "",
  email: form.email || "",
});

const buildPatientInfoFromServer = (data) => {
  const hoSo = data?.hoSo || {};
  const bn = data?.benhNhan || {};

  const pick = (o, A, a) => o?.[A] ?? o?.[a] ?? null;

  return {
    idBenhNhan: pick(bn, "IdBenhNhan", "idBenhNhan"),
    idHoSo: pick(hoSo, "IdHoSo", "idHoSo"),
    maBn: pick(bn, "MaBn", "maBn"),
    maHs: pick(hoSo, "MaHs", "maHs"),
    hoTen: pick(bn, "HoTen", "hoTen"),
    gioiTinh: pick(bn, "GioiTinh", "gioiTinh"),
    ngaySinh: pick(bn, "NgaySinh", "ngaySinh"),
    soDienThoai: pick(bn, "SoDienThoai", "soDienThoai"),
    diaChi: pick(bn, "DiaChiDuong", "diaChiDuong"),
    email: pick(bn, "Email", "email"),
  };
};

/* ============================================================
   CONVERT SỐ — FIX LỖI "" → int?
============================================================ */
const toNumberOrNull = (v) => {
  if (v === "" || v === null || v === undefined) return null;
  const n = Number(v);
  return isNaN(n) ? null : n;
};

/* ============================================================
   HANDLE TIẾP ĐÓN
============================================================ */
export async function handleTiepDonSave(form, onNext) {
  /* -------- Payload bệnh nhân -------- */
  const patientPayload = {
    Ho_ten: form.ho_ten,
    Ngay_sinh: form.ngay_sinh || null,
    Gio_tinh: form.gio_tinh,
    CCCD: form.cccd,
    So_dien_thoai: form.so_dien_thoai,
    Email: form.email,
    Quoc_tich: form.quoc_tich,
    Dan_toc: form.dan_toc,
    Nghe_nghiep: form.nghe_nghiep,
    Dia_chi_duong: form.dia_chi_duong,
    Dia_chi_xa: "",
    Dia_chi_huyen: "",
    Dia_chi_tinh: "",
    Quoc_gia: form.quoc_gia,
  };

  // convert helper
  const toNum = (v) => {
    if (v === "" || v === null || v === undefined) return null;
    const n = Number(v);
    return isNaN(n) ? null : n;
  };

  const vit = form.sinhHieu || {}; // FE truyền sinhHieu: vital

  const sinhHieuPayload = {
    NhietDo: toNum(vit.nhietDo),
    HuyetApTamThu: toNum(vit.huyetApTamThu),
    HuyetApTamTruong: toNum(vit.huyetApTamTruong),
    NhipTim: toNum(vit.nhipTim),
    NhipTho: toNum(vit.nhipTho),
    SpO2: toNum(vit.spo2),
    CanNang: toNum(vit.canNang),
    ChieuCao: toNum(vit.chieuCao),
    Bmi: toNum(vit.bmi),
  };

  try {
    const res = await createPatient(patientPayload);
    if (!res || !res.data) {
      alert("❌ Không thể kết nối máy chủ.");
      return;
    }

    const data = res.data;
    const state = data.state;

    console.log("🚀 [handleTiepDonSave] state:", state, "raw:", data);

    /* ============================================================
        CASE 1 — PATIENT NEW → CREATE RECORD
    ============================================================= */
    if (state === "NEW_PATIENT_CREATED") {
      console.group("🟦 handleTiepDonSave → BEFORE createRecord");
      console.log("⭐ BN:", data.idBenhNhan);
      console.log("⭐ SinhHiệu:", sinhHieuPayload);
      console.groupEnd();

      const recordRes = await createRecord({
        IdBenhNhan: data.idBenhNhan,
        IdNguoiTao: 2,
        SinhHieu: sinhHieuPayload,
      });

      if (!recordRes?.data) {
        alert("❌ Lỗi tạo hồ sơ.");
        return;
      }

      // 📦 Debug kết quả từ BE
      console.group("📦 RESULT FROM createRecord");
      console.log("idHoSo =", recordRes.data.idHoSo);
      console.log("maHs =", recordRes.data.maHs);
      console.log("idLanKham =", recordRes.data.idLanKham);
      console.groupEnd();

      const info = buildPatientInfoFromForm(form, {
        idBenhNhan: data.idBenhNhan,
        idHoSo: recordRes.data.idHoSo,
        maBn: data.maBn,
        maHs: recordRes.data.maHs,
      });

      console.log("📤 [onNext] NEW:", info);
      if (onNext) onNext(info, "NEW");
      return;
    }

    /* ============================================================
        CASE 2 — EXISTING PATIENT, NO RECORD TODAY
    ============================================================= */
    if (state === "NEED_CREATE_RECORD") {
      const recordRes = await createRecord({
        IdBenhNhan: data.idBenhNhan,
        IdNguoiTao: 2,
        SinhHieu: sinhHieuPayload,
      });

      if (!recordRes?.data) {
        alert("❌ Lỗi tạo hồ sơ.");
        return;
      }

      // 📦 Debug kết quả BE
      console.group("📦 RESULT FROM createRecord");
      console.log("idHoSo =", recordRes.data.idHoSo);
      console.log("maHs =", recordRes.data.maHs);
      console.log("idLanKham =", recordRes.data.idLanKham);
      console.groupEnd();

      const info = buildPatientInfoFromForm(form, {
        idBenhNhan: data.idBenhNhan,
        idHoSo: recordRes.data.idHoSo,
        maBn: data.maBn,
        maHs: recordRes.data.maHs,
      });

      console.log("📤 [onNext] CREATE:", info);
      if (onNext) onNext(info, "CREATE");
      return;
    }

    /* ============================================================
        CASE 3 — NEED_ORDER
    ============================================================= */
    if (state === "NEED_ORDER") {
      const info = buildPatientInfoFromServer(data);
      console.log("📤 [onNext] NEED_ORDER:", info);

      if (onNext) onNext(info, "NEED_ORDER");
      return;
    }

    /* ============================================================
        CASE 4 — ORDERED — WAITING DOCTOR
    ============================================================= */
    if (state === "ORDERED_WAITING_DOCTOR") {
      alert("🩺 Bệnh nhân đã được chỉ định, đang chờ bác sĩ khám.");
      return;
    }

    /* ============================================================
        CASE 5 — RECORD CLOSED
    ============================================================= */
    if (state === "EXAM_DONE_OR_CLOSED") {
      alert("ℹ️ Hồ sơ đã đóng hoặc bệnh nhân đã khám xong.");
      return;
    }

    alert("⚠️ Trạng thái hồ sơ không xác định.");
  } catch (err) {
    console.error("❌ Lỗi khi lưu tiếp đón:", err);
    alert("Đã xảy ra lỗi khi lưu tiếp đón.");
  }
}


/* ============================================================
   AUTOFILL
============================================================ */
export async function autoFillPatient(cccd, sdt, setForm) {
  try {
    const res = await checkPatient(cccd, sdt);
    if (res?.exists && res.patient) {
      const p = res.patient;

      setForm((prev) => ({
        ...prev,
        ma_bn: p.maBn,
        ho_ten: p.hoTen,
        gioi_tinh: p.gioiTinh,
        ngay_sinh: p.ngaySinh,
        cccd: p.cccd,
        so_dien_thoai: p.soDienThoai,
      }));
    }
  } catch (err) {
    console.warn("⚠️ Lỗi tra cứu bệnh nhân:", err);
  }
}

/* ============================================================
   FETCH LISTS
============================================================ */
export async function fetchReceptionLists(setToday, setCancelled, date) {
  try {
    const todayList = await getReceptionList(date);
    const cancelled = await getCancelledList();
    setToday(todayList || []);
    setCancelled(cancelled || []);
  } catch (e) {
    console.error("❌ Lỗi tải danh sách:", e);
    setToday([]);
    setCancelled([]);
  }
}

/* ============================================================
   FETCH STATS
============================================================ */
export async function fetchReceptionStats(setStats) {
  try {
    const stats = await getStats();
    setStats(stats || { totalToday: 0, cancelled: 0, newPatients: 0, reExam: 0 });
  } catch (e) {
    console.error("❌ Lỗi tải thống kê:", e);
    setStats({ totalToday: 0, cancelled: 0, newPatients: 0, reExam: 0 });
  }
}

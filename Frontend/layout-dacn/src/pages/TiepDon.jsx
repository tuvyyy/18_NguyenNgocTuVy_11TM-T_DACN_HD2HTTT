import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import {
  handleTiepDonSave,
  autoFillPatient,
  fetchReceptionLists,
  fetchReceptionStats,
} from "../controllers/TiepDonController";
import { cancelReception } from "../api/TiepDonApi";
import { saveSinhHieu } from "../api/TiepDonApi";
import { usePermission } from "../hooks/UsePermission";

export default function TiepDon() {
  const navigate = useNavigate();
  const { canView, canAdd, canEdit, loading: permLoading } = usePermission("TIEP_DON");

  const [form, setForm] = useState({
    ma_bn: "",
    ho_ten: "",
    ngay_sinh: "",
    gioi_tinh: "",
    cccd: "",
    so_dien_thoai: "",
    email: "",
    nghe_nghiep: "",
    dia_chi_duong: "",
    dia_chi_daydu: "",
    quoc_gia: "Việt Nam",
  });
  // ================== FORM SINH HIỆU ==================
const [vital, setVital] = useState({
  nhietDo: "",
  huyetApTamThu: "",
  huyetApTamTruong: "",
  nhipTim: "",
  nhipTho: "",
  spo2: "",
  chieuCao: "",
  canNang: "",
  bmi: "",
  ngayDo: "",
});


  const [loading, setLoading] = useState(false);
  const [listToday, setListToday] = useState([]);
  const [cancelledList, setCancelledList] = useState([]);
  const [stats, setStats] = useState({});
  const [listLoading, setListLoading] = useState(true);
  const [filterDate, setFilterDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [search, setSearch] = useState("");

  const [modal, setModal] = useState({ show: false, data: null }); // modal chỉ định DVKT
  const [cancelModal, setCancelModal] = useState({ show: false, id: null, maHs: null }); // modal hủy tiếp đón

  // ================== Load dữ liệu ==================
  const loadData = async (date) => {
    setListLoading(true);
    await fetchReceptionLists(setListToday, setCancelledList, date);
    await fetchReceptionStats(setStats);
    setListLoading(false);
  };

  useEffect(() => {
    loadData(filterDate);
  }, [filterDate]);

  // ================== Auto fill BN ==================
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  useEffect(() => {
    const timer = setTimeout(() => {
      if (form.cccd || form.so_dien_thoai)
        autoFillPatient(form.cccd, form.so_dien_thoai, setForm);
    }, 800);
    return () => clearTimeout(timer);
  }, [form.cccd, form.so_dien_thoai]);
  
  const vitalPayload = {
  NhietDo: Number(vital.nhietDo) || null,
  HuyetApTamThu: Number(vital.huyetApTamThu) || null,
  HuyetApTamTruong: Number(vital.huyetApTamTruong) || null,
  NhipTim: Number(vital.nhipTim) || null,
  NhipTho: Number(vital.nhipTho) || null,
  SpO2: Number(vital.spo2) || null,
  CanNang: Number(vital.canNang) || null,
  ChieuCao: Number(vital.chieuCao) || null,
  };

  // ================== Lưu tiếp đón ==================
const handleSave = async () => {
  if (!canAdd && !canEdit) return alert("⚠️ Bạn không có quyền lưu!");
  setLoading(true);

  await handleTiepDonSave(
    {
      ...form,
      sinhHieu: vital,   // ⭐ Gửi luôn sinh hiệu về BE
    },
    (info, state) => {
      if (!info || !info.idBenhNhan) {
        alert("⚠️ Không có dữ liệu bệnh nhân hợp lệ từ server!");
        return;
      }

      if (state === "NEED_ORDER") {
        setModal({ show: true, data: info });
      } else {
        navigate("/tiep-don/chi-dinh", { state: { patient: info } });
      }
    }
  );

  await loadData();
  setLoading(false);
};

  // ================== Hủy tiếp đón ==================
  const confirmCancel = (id, maHs) => setCancelModal({ show: true, id, maHs });
  const handleCancel = async () => {
    if (!cancelModal.id) return;
    const res = await cancelReception(cancelModal.id);
    if (res?.status === 200) alert("✅ Đã hủy tiếp đón!");
    setCancelModal({ show: false, id: null, maHs: null });
    await loadData(filterDate);
  };

  // ================== Lọc & tìm kiếm ==================
  const filteredList = listToday
    .filter((bn) =>
      search
        ? bn.benhNhan.hoTen.toLowerCase().includes(search.toLowerCase()) ||
          bn.benhNhan.maBn.toLowerCase().includes(search.toLowerCase())
        : true
    )
    .filter((bn) => {
      if (!filterDate) return true;
      const d = new Date(bn.ngayTao).toISOString().slice(0, 10);
      return d === filterDate;
    });

  if (permLoading)
    return <div className="p-10 text-center text-gray-500 text-sm">Đang kiểm tra quyền truy cập...</div>;
  if (!canView)
    return (
      <div className="p-10 text-center text-red-600 font-semibold text-lg">
        ⚠️ Bạn không có quyền xem trang Tiếp đón.
      </div>
    );

  // ================== Giao diện ==================
  return (
    <MainLayout>
      <div className="w-full h-[calc(100vh-90px)] p-4 bg-gradient-to-b from-sky-50 via-white to-blue-50 flex flex-col gap-3 overflow-hidden">
        {/* ======= Thống kê tổng quan ======= */}
        <div className="grid grid-cols-4 gap-4 text-sm">
          <StatCard title="👩‍⚕️ Tổng tiếp đón hôm nay" value={stats.totalToday} color="from-sky-500 to-cyan-500" />
          <StatCard title="🆕 Bệnh nhân mới" value={stats.newPatients} color="from-emerald-500 to-green-400" />
          <StatCard title="❌ Hủy tiếp đón" value={stats.cancelled} color="from-rose-500 to-red-400" />
          <StatCard title="🔁 Khám lại" value={stats.reExam} color="from-amber-500 to-yellow-400" />
        </div>

        <div className="flex gap-4 flex-grow overflow-hidden">
          {/* ===== DANH SÁCH TIẾP ĐÓN ===== */}
          <div className="w-1/3 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
            <div className="bg-gradient-to-r from-sky-600 to-cyan-500 text-white px-4 py-2 text-sm font-semibold rounded-t-xl flex justify-between items-center">
              <span>📋 Tiếp đón</span>
              <div className="flex gap-2 items-center">
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="text-xs text-gray-700 px-1 rounded"
                />
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="text-xs px-2 py-0.5 rounded border border-gray-200"
                />
              </div>
            </div>

            <div className="flex-1 p-3 text-sm overflow-y-auto">
              {listLoading ? (
                <div className="text-center text-gray-500 italic mt-10">⏳ Đang tải...</div>
              ) : filteredList.length === 0 ? (
                <div className="text-center text-gray-400 italic mt-10">Không có hồ sơ.</div>
              ) : (
                filteredList.map((bn) => (
                  <div
                    key={bn.id}
                    className="border border-gray-200 rounded-md p-2 mb-2 hover:bg-sky-50 cursor-pointer transition-all relative group"
                  >
                    <div className="font-semibold text-gray-700">{bn.benhNhan.hoTen}</div>
                    <div className="text-xs text-gray-500">
                      Mã BN: {bn.benhNhan.maBn} • Giờ:{" "}
                      {new Date(bn.ngayTao).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                    <div className="text-xs text-gray-400 italic">Trạng thái: {bn.trangThai}</div>
                    <button
                      onClick={() => confirmCancel(bn.id, bn.maHs)}
                      className="absolute top-1 right-2 opacity-0 group-hover:opacity-100 text-xs text-red-500 hover:underline"
                    >
                      Hủy
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ===== FORM TIẾP ĐÓN ===== */}
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
            <div className="bg-gradient-to-r from-sky-600 to-cyan-500 text-white px-4 py-2 text-sm font-semibold rounded-t-xl">
              🧍 Thông tin bệnh nhân
            </div>

            <div className="flex-1 p-5 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3 text-sm">
                <Input label="Mã BN" name="ma_bn" value={form.ma_bn} readOnly />
                <Input label="Họ tên" name="ho_ten" value={form.ho_ten} onChange={handleChange} />
                <Input type="date" label="Ngày sinh" name="ngay_sinh" value={form.ngay_sinh} onChange={handleChange} />
                <Select label="Giới tính" name="gioi_tinh" value={form.gio_tinh} onChange={handleChange} options={["Nam", "Nữ", "Khác"]} />
                <Input label="CCCD" name="cccd" value={form.cccd} onChange={handleChange} />
                <Input label="SĐT" name="so_dien_thoai" value={form.so_dien_thoai} onChange={handleChange} />
                <Input label="Email" name="email" value={form.email} onChange={handleChange} />
                <Input label="Nghề nghiệp" name="nghe_nghiep" value={form.nghe_nghiep} onChange={handleChange} />
                <Input label="Địa chỉ" name="dia_chi_duong" value={form.dia_chi_duong} onChange={handleChange} />
                <Input label="Quốc gia" name="quoc_gia" value={form.quoc_gia} onChange={handleChange} />
              </div>
            </div>

          </div>

          {/* ===== DANH SÁCH HỦY ===== */}
          <div className="w-1/3 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
            <div className="bg-gradient-to-r from-red-500 to-rose-400 text-white px-4 py-2 text-sm font-semibold rounded-t-xl">
              ❌ Tiếp đón bị hủy
            </div>
            <div className="flex-1 p-3 text-sm overflow-y-auto">
              {listLoading ? (
                <div className="text-center text-gray-500 italic mt-10">⏳ Đang tải...</div>
              ) : cancelledList.length === 0 ? (
                <div className="text-center text-gray-400 italic mt-10">Không có hồ sơ bị hủy.</div>
              ) : (
                cancelledList.map((bn) => (
                  <div
                    key={bn.id}
                    className="border border-gray-200 rounded-md p-2 mb-2 bg-rose-50 hover:bg-rose-100 transition-all"
                  >
                    <div className="font-semibold text-gray-700">{bn.benhNhan.hoTen}</div>
                    <div className="text-xs text-gray-500">Mã BN: {bn.benhNhan.maBn}</div>
                    <div className="text-xs text-gray-400 italic">
                      🕒 {new Date(bn.updatedAt || bn.ngayTao).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

{/* ==================== FORM SINH HIỆU (AUTO SAVE CÙNG TIẾP ĐÓN) ==================== */}
<div className="bg-white border border-blue-200 rounded-xl shadow-sm p-4 mt-2">
  <h3 className="font-semibold text-sky-700 text-sm mb-3 flex items-center gap-2">
    🩺 Sinh hiệu (Vital Signs)
  </h3>

<div className="grid grid-cols-6 gap-3 text-sm">

  <Input label="🌡️ Nhiệt độ (°C)" name="nhietDo"
    value={vital.nhietDo}
    onChange={(e) => setVital({ ...vital, nhietDo: e.target.value })}/>

<Input label="💓 Nhịp tim (lần/phút)" 
  name="nhipTim"
  value={vital.nhipTim}
  onChange={(e) => setVital({ ...vital, nhipTim: e.target.value })}
/>
<Input label="🫀 SpO₂ (%)" 
  name="spo2"
  value={vital.spo2}
  onChange={(e) => setVital({ ...vital, spo2: e.target.value })}
/>


<Input label="🩸 Huyết áp Tâm thu (mmHg)" 
  name="huyetApTamThu"
  value={vital.huyetApTamThu}
  onChange={(e) => setVital({ ...vital, huyetApTamThu: e.target.value })}
/>

<Input label="🩸 Huyết áp Tâm trương (mmHg)" 
  name="huyetApTamTruong"
  value={vital.huyetApTamTruong}
  onChange={(e) => setVital({ ...vital, huyetApTamTruong: e.target.value })}
/>


  <Input label="🫁 Nhịp thở" name="nhipTho"
    value={vital.nhipTho}
    onChange={(e) => setVital({ ...vital, nhipTho: e.target.value })}/>

  <Input label="📏 Chiều cao (cm)" name="chieuCao"
    value={vital.chieuCao}
    onChange={(e) => setVital({ ...vital, chieuCao: e.target.value })}/>

  <Input label="⚖️ Cân nặng (kg)" name="canNang"
    value={vital.canNang}
    onChange={(e) => setVital({ ...vital, canNang: e.target.value })}/>

  <Input label="⚖️ Cân nặng vào viện (kg)" name="canNangVaoVien"
    value={vital.canNangVaoVien}
    onChange={(e) => setVital({ ...vital, canNangVaoVien: e.target.value })}/>

  <Input label="BMI" name="bmi" readOnly
    value={vital.bmi}
    onChange={() => {}}/>

  <Input label="👤 Người đo" name="nguoiDo"
    value={vital.nguoiDo}
    onChange={(e) => setVital({ ...vital, nguoiDo: e.target.value })}/>

  <Input type="datetime-local" label="📅 Ngày đo" name="ngayDo"
    value={vital.ngayDo}
    onChange={(e) => setVital({ ...vital, ngayDo: e.target.value })}/>

</div>

<div className="border-t border-gray-100 bg-gray-50 p-3 flex justify-end rounded-b-xl">
  {(canAdd || canEdit) && (
    <button
      onClick={handleSave} // ✅ gọi hàm chính để lưu tiếp đón
      disabled={loading}
      className={`px-5 py-1.5 text-sm font-semibold text-white rounded-md shadow-md transition-all duration-300 ${
        loading
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-gradient-to-r from-sky-600 to-cyan-500 hover:brightness-110 hover:scale-105"
      }`}
    >
      {loading ? "⏳ Đang lưu..." : "💾 Lưu & chuyển chỉ định"}
    </button>
  )}
</div>

  <p className="text-xs text-gray-500 mt-2 italic">
    👉 Sinh hiệu sẽ tự động lưu khi bạn bấm “💾 Lưu & chuyển chỉ định”
  </p>
</div>

        {/* ===== MODAL XÁC NHẬN CHỈ ĐỊNH ===== */}
       {modal.show && (
  <ConfirmModal
    title="⚠️ Bệnh nhân chưa chỉ định DVKT"
    content="Bệnh nhân này đã được tiếp đón hôm nay nhưng chưa có chỉ định dịch vụ. Bạn có muốn chuyển sang trang chỉ định DVKT không?"
    onCancel={() => setModal({ show: false, data: null })}
    onConfirm={() => {
      const p = modal.data;                      // ✅ lấy info đã build từ controller
      setModal({ show: false, data: null });
      navigate("/tiep-don/chi-dinh", { state: { patient: p } }); // ✅ truyền patient
    }}                                                                                                                                        
    
  />
)}
   

        {/* ===== MODAL HỦY TIẾP ĐÓN ===== */}
        {cancelModal.show && (
          <ConfirmModal
            title="❌ Xác nhận hủy tiếp đón"
            content={`Bạn có chắc muốn hủy hồ sơ ${cancelModal.maHs}?`}
            onCancel={() => setCancelModal({ show: false, id: null, maHs: null })}
            onConfirm={handleCancel}
          />
        )}
      </div>
    </MainLayout>
  );
}

// ================== COMPONENT CON ==================
function ConfirmModal({ title, content, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[380px] animate-fadeIn text-sm">
        <h3 className="text-lg font-semibold text-sky-600 mb-3">{title}</h3>
        <p className="text-gray-600 mb-5">{content}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-1 rounded bg-gray-200 hover:bg-gray-300 font-medium">
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-1 rounded bg-gradient-to-r from-sky-600 to-cyan-500 text-white font-medium hover:brightness-110"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}

function Input({ label, name, value, onChange, placeholder, type = "text", readOnly }) {
  return (
    <div className="relative">
      <label className="block text-gray-700 text-xs font-semibold mb-0.5">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`w-full border border-gray-300 rounded-md px-2 py-1 text-sm outline-none transition-all duration-150
          focus:ring-2 focus:ring-sky-400 focus:border-sky-500
          ${readOnly ? "bg-gray-100 cursor-not-allowed" : "hover:border-gray-400"}
        `}
      />
    </div>
  );
}


function Select({ label, name, value, onChange, options }) {
  return (
    <div>
      <label className="block text-gray-700 text-xs font-semibold mb-0.5">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-md px-2 py-1 outline-none focus:ring-2 focus:ring-sky-400"
      >
        <option value="">-- Chọn --</option>
        {options.map((opt, i) => (
          <option key={i} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function StatCard({ title, value, color }) {
  return (
    <div className={`rounded-xl shadow-sm text-white px-4 py-3 bg-gradient-to-r ${color}`}>
      <div className="text-xs opacity-80">{title}</div>
      <div className="text-lg font-bold">{value ?? 0}</div>
    </div>
  );
}

// src/pages/admin/thuoc/ThuocModal.jsx
import React, { useEffect, useState } from "react";

export default function ThuocModal({ open, onClose, onSubmit, nhomList, initial }) {
  const [form, setForm] = useState({
    idNhom: "",
    ma: "",
    ten: "",
    donViTinh: "",
    moTa: "",
    hoatDong: true,
  });

  useEffect(() => {
    if (initial) {
      setForm({
        idNhom: initial.idNhom || "",
        ma: initial.ma || "",
        ten: initial.ten || "",
        donViTinh: initial.donViTinh || "",
        moTa: initial.moTa || "",
        hoatDong: initial.hoatDong ?? true,
      });
    } else {
      setForm({
        idNhom: "",
        ma: "",
        ten: "",
        donViTinh: "",
        moTa: "",
        hoatDong: true,
      });
    }
  }, [initial]);

  if (!open) return null;

  const save = () => {
    if (!form.ma || !form.ten) return;
    onSubmit({
      ...form,
      idNhom: form.idNhom ? Number(form.idNhom) : null,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl">
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <h3 className="font-semibold text-sky-700">
            {initial ? "Cập nhật thuốc" : "Thêm thuốc mới"}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <div className="p-5 grid grid-cols-12 gap-4">
          <div className="col-span-12 sm:col-span-6">
            <label className="text-sm text-gray-600">Nhóm thuốc</label>
            <select
              value={form.idNhom}
              onChange={(e) => setForm((s) => ({ ...s, idNhom: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2 mt-1"
            >
              <option value="">-- Chưa chọn --</option>
              {nhomList.map((x) => (
                <option key={x.id} value={x.id}>{x.ten}</option>
              ))}
            </select>
          </div>

          <div className="col-span-12 sm:col-span-6">
            <label className="text-sm text-gray-600">Mã</label>
            <input
              value={form.ma}
              onChange={(e) => setForm((s) => ({ ...s, ma: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2 mt-1"
              placeholder="VD: TH001"
            />
          </div>

          <div className="col-span-12">
            <label className="text-sm text-gray-600">Tên thuốc</label>
            <input
              value={form.ten}
              onChange={(e) => setForm((s) => ({ ...s, ten: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2 mt-1"
              placeholder="Paracetamol 500mg"
            />
          </div>

          <div className="col-span-12 sm:col-span-6">
            <label className="text-sm text-gray-600">Đơn vị tính</label>
            <input
              value={form.donViTinh}
              onChange={(e) => setForm((s) => ({ ...s, donViTinh: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2 mt-1"
              placeholder="Viên / Vỉ / Hộp..."
            />
          </div>

          <div className="col-span-12 sm:col-span-6">
            <label className="text-sm text-gray-600">Trạng thái</label>
            <select
              value={String(form.hoatDong)}
              onChange={(e) => setForm((s) => ({ ...s, hoatDong: e.target.value === "true" }))}
              className="w-full border rounded-lg px-3 py-2 mt-1"
            >
              <option value="true">Hoạt động</option>
              <option value="false">Vô hiệu</option>
            </select>
          </div>

          <div className="col-span-12">
            <label className="text-sm text-gray-600">Mô tả</label>
            <textarea
              value={form.moTa}
              onChange={(e) => setForm((s) => ({ ...s, moTa: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2 mt-1"
              rows={3}
              placeholder="Ghi chú/mô tả"
            />
          </div>
        </div>

        <div className="px-5 py-4 border-t bg-gray-50 rounded-b-2xl flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border hover:bg-white">Hủy</button>
          <button onClick={save} className="px-4 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700">
            {initial ? "Lưu" : "Thêm"}
          </button>
        </div>
      </div>
    </div>
  );
}

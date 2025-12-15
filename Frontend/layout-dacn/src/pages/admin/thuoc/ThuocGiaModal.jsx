// src/pages/admin/thuoc/ThuocGiaModal.jsx
import React, { useEffect, useState } from "react";

export default function ThuocGiaModal({ open, onClose, onSubmit, initial, selectedThuoc }) {
  const [form, setForm] = useState({
    donGia: "",
    ngayApDung: "",
    ngayHetHan: "",
    doiTuongApDung: "",
    ghiChu: "",
    hoatDong: true,
  });

  useEffect(() => {
    if (initial) {
      setForm({
        donGia: initial.donGia ?? "",
        ngayApDung: initial.ngayApDung ? initial.ngayApDung.slice(0, 10) : "",
        ngayHetHan: initial.ngayHetHan ? initial.ngayHetHan.slice(0, 10) : "",
        doiTuongApDung: initial.doiTuongApDung || "",
        ghiChu: initial.ghiChu || "",
        hoatDong: initial.hoatDong ?? true,
      });
    } else {
      setForm({
        donGia: "",
        ngayApDung: "",
        ngayHetHan: "",
        doiTuongApDung: "",
        ghiChu: "",
        hoatDong: true,
      });
    }
  }, [initial]);

  if (!open) return null;

  const save = () => {
    if (!form.donGia || !form.ngayApDung) return;
    onSubmit({
      ...form,
      donGia: Number(form.donGia),
      ngayApDung: new Date(form.ngayApDung),
      ngayHetHan: form.ngayHetHan ? new Date(form.ngayHetHan) : null,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl">
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <h3 className="font-semibold text-pink-700">
            {initial ? "Cập nhật giá thuốc" : "Thêm giá thuốc"}
            {selectedThuoc ? ` — ${selectedThuoc.ten}` : ""}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <div className="p-5 grid grid-cols-12 gap-4">
          <div className="col-span-12 sm:col-span-6">
            <label className="text-sm text-gray-600">Đơn giá (VND)</label>
            <input
              value={form.donGia}
              onChange={(e) => setForm((s) => ({ ...s, donGia: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2 mt-1"
              placeholder="Ví dụ: 5000"
              type="number"
              min="0"
            />
          </div>

          <div className="col-span-12 sm:col-span-6">
            <label className="text-sm text-gray-600">Ngày áp dụng</label>
            <input
              type="date"
              value={form.ngayApDung}
              onChange={(e) => setForm((s) => ({ ...s, ngayApDung: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2 mt-1"
            />
          </div>

          <div className="col-span-12 sm:col-span-6">
            <label className="text-sm text-gray-600">Ngày hết hạn (tuỳ chọn)</label>
            <input
              type="date"
              value={form.ngayHetHan}
              onChange={(e) => setForm((s) => ({ ...s, ngayHetHan: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2 mt-1"
            />
          </div>

          <div className="col-span-12 sm:col-span-6">
            <label className="text-sm text-gray-600">Đối tượng áp dụng</label>
            <input
              value={form.doiTuongApDung}
              onChange={(e) => setForm((s) => ({ ...s, doiTuongApDung: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2 mt-1"
              placeholder="Tất cả/ BHYT/ VIP..."
            />
          </div>

          <div className="col-span-12">
            <label className="text-sm text-gray-600">Ghi chú</label>
            <textarea
              value={form.ghiChu}
              onChange={(e) => setForm((s) => ({ ...s, ghiChu: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2 mt-1"
              rows={3}
              placeholder="Ghi chú"
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
        </div>

        <div className="px-5 py-4 border-t bg-gray-50 rounded-b-2xl flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border hover:bg-white">Hủy</button>
          <button onClick={save} className="px-4 py-2 rounded-lg bg-pink-600 text-white hover:bg-pink-700">
            {initial ? "Lưu" : "Thêm"}
          </button>
        </div>
      </div>
    </div>
  );
}

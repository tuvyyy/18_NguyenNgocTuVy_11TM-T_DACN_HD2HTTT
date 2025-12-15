import React, { useState } from "react";
import { updateThuocInDon } from "../../../api/DonThuocApi";
import { toast } from "react-toastify";

export default function ModalEditThuoc({ open, onClose, thuoc, onSaved }) {

  // ❗ Hook đặt lên trên cùng — KHÔNG bị conditional
  const [form, setForm] = useState({
    soLuong: thuoc?.soLuong ?? "",
    donVi: thuoc?.donVi ?? "",
    sang: thuoc?.sang ?? "",
    trua: thuoc?.trua ?? "",
    chieu: thuoc?.chieu ?? "",
    toi: thuoc?.toi ?? "",
    khuya: thuoc?.khuya ?? "",
    soNgayUong: thuoc?.soNgayUong ?? "",
    ghiChu: thuoc?.ghiChu ?? "",
    idThuoc: thuoc?.idThuoc ?? ""
  });

  // ❗ KHÔNG return null trước useState, dùng fragment
  if (!open) return <></>;

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async () => {
    try {
      const res = await updateThuocInDon(thuoc.id, form);

      if (res.status === 200) {
        toast.success("Cập nhật thuốc thành công!");
        await onSaved();
        onClose();
      } else {
        toast.error("Cập nhật thất bại!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Không thể cập nhật thuốc!");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[9999]">
      <div className="bg-white w-[420px] p-5 rounded-xl shadow-xl space-y-4 animate-fade">

        <h2 className="text-lg font-bold text-blue-600 border-b pb-2">
          ✏️ Sửa thuốc: {thuoc.tenThuoc}
        </h2>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <input name="soLuong" value={form.soLuong} onChange={onChange} className="input" />
          <input name="donVi" value={form.donVi} onChange={onChange} className="input" />

          <input name="sang" value={form.sang} onChange={onChange} className="input" />
          <input name="trua" value={form.trua} onChange={onChange} className="input" />
          <input name="chieu" value={form.chieu} onChange={onChange} className="input" />
          <input name="toi" value={form.toi} onChange={onChange} className="input" />
          <input name="khuya" value={form.khuya} onChange={onChange} className="input" />
          <input name="soNgayUong" value={form.soNgayUong} onChange={onChange} className="input" />

          <textarea
            name="ghiChu"
            value={form.ghiChu}
            onChange={onChange}
            className="input col-span-2 h-16"
          />
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 bg-gray-300 rounded">Hủy</button>
          <button onClick={onSubmit} className="px-3 py-1 bg-blue-600 text-white rounded shadow">
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}

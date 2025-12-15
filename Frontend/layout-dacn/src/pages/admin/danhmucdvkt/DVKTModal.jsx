import React, { useState, useEffect } from "react";

export default function DVKTModal({ open, onClose, onSubmit, initial, nhomList }) {
  const [form, setForm] = useState({
    maDVKT: "",
    tenDVKT: "",
    donVi: "",
    idNhom: "",
    thoiGianDuKien: "",
    moTa: "",
  });

  useEffect(() => {
    if (initial) {
      setForm({
        maDVKT: initial.maDvkt,
        tenDVKT: initial.tenDvkt,
        donVi: initial.donVi,
        idNhom: initial.idNhom,
        thoiGianDuKien: initial.thoiGianDuKien,
        moTa: initial.moTa,
      });
    }
  }, [initial]);

  const change = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl">
        <h2 className="text-xl font-semibold mb-4 text-sky-700">
          {initial ? "Cập nhật DVKT" : "Thêm DVKT mới"}
        </h2>

        <div className="space-y-3">
          <input
            className="w-full border px-3 py-2 rounded-md"
            placeholder="Mã DVKT"
            value={form.maDVKT}
            onChange={(e) => change("maDVKT", e.target.value)}
          />

          <input
            className="w-full border px-3 py-2 rounded-md"
            placeholder="Tên DVKT"
            value={form.tenDVKT}
            onChange={(e) => change("tenDVKT", e.target.value)}
          />

          <select
            className="w-full border px-3 py-2 rounded-md"
            value={form.idNhom}
            onChange={(e) => change("idNhom", e.target.value)}
          >
            <option value="">-- Chọn nhóm --</option>
            {nhomList.map((n) => (
              <option key={n.id} value={n.id}>
                {n.tenNhom}
              </option>
            ))}
          </select>

          <input
            className="w-full border px-3 py-2 rounded-md"
            placeholder="Đơn vị"
            value={form.donVi}
            onChange={(e) => change("donVi", e.target.value)}
          />

          <input
            className="w-full border px-3 py-2 rounded-md"
            placeholder="Thời gian dự kiến (phút)"
            value={form.thoiGianDuKien}
            onChange={(e) => change("thoiGianDuKien", e.target.value)}
          />

          <textarea
            className="w-full border px-3 py-2 rounded-md"
            placeholder="Mô tả"
            value={form.moTa}
            onChange={(e) => change("moTa", e.target.value)}
          ></textarea>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button className="px-4 py-2 rounded-md bg-gray-300" onClick={onClose}>
            Hủy
          </button>

          <button
  className="px-4 py-2 rounded-md bg-emerald-500 text-white"
  onClick={() =>
    onSubmit({
      ...form,
      thoiGianDuKien:
        form.thoiGianDuKien === "" ? null : Number(form.thoiGianDuKien),
      idNhom: Number(form.idNhom),
    })
  }
>
  {initial ? "Lưu thay đổi" : "Thêm mới"}
</button>

        </div>
      </div>
    </div>
  );
}

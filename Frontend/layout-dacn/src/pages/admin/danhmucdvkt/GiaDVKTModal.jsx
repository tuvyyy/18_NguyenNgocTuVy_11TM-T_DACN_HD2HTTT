import React, { useState, useEffect } from "react";

export default function GiaDVKTModal({ open, onClose, onSubmit, initial, dvkt }) {
  const [form, setForm] = useState({
    donGia: "",
    tuNgay: "",
    denNgay: "",
    ghiChu: "",
  });

  useEffect(() => {
    if (initial) {
      // === UPDATE MODE ===
      setForm({
        donGia: initial.donGia,
        tuNgay: initial.tuNgay || "",   // không dùng khi update
        denNgay: initial.denNgay || "",
        ghiChu: initial.ghiChu || "",
      });
    } else {
      // === CREATE MODE ===
      setForm({
        donGia: "",
        tuNgay: "",
        denNgay: "",
        ghiChu: "",
      });
    }
  }, [initial]);

  const change = (key, val) => setForm((s) => ({ ...s, [key]: val }));

  if (!open) return null;

  const isUpdate = Boolean(initial);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-lg font-semibold mb-4 text-pink-700">
          {isUpdate ? "Cập nhật giá DVKT" : "Thêm giá DVKT"}
        </h2>

        <div className="space-y-3">

          {/* ĐƠN GIÁ */}
          <input
            className="w-full border px-3 py-2 rounded-md"
            placeholder="Đơn giá"
            value={form.donGia}
            onChange={(e) => change("donGia", e.target.value)}
          />

          {/* CHỈ SHOW tuNgay KHI THÊM MỚI */}
          {!isUpdate && (
            <input
              type="date"
              className="w-full border px-3 py-2 rounded-md"
              value={form.tuNgay}
              onChange={(e) => change("tuNgay", e.target.value)}
            />
          )}

          {/* denNgay CHỈ ÁP DỤNG KHI UPDATE */}
          {isUpdate && (
            <input
              type="date"
              className="w-full border px-3 py-2 rounded-md"
              value={form.denNgay}
              onChange={(e) => change("denNgay", e.target.value)}
            />
          )}

          <textarea
            className="w-full border px-3 py-2 rounded-md"
            placeholder="Ghi chú"
            value={form.ghiChu}
            onChange={(e) => change("ghiChu", e.target.value)}
          ></textarea>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button className="px-4 py-2 bg-gray-300 rounded-md" onClick={onClose}>
            Hủy
          </button>

          <button
            className="px-4 py-2 bg-emerald-500 text-white rounded-md"
            onClick={() => onSubmit(form)}
          >
            {isUpdate ? "Lưu thay đổi" : "Thêm mới"}
          </button>
        </div>
      </div>
    </div>
  );
}

// src/pages/admin/DanhMucDichVu/DanhMucDichVu.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  getNhomDichVu,
  getDichVuList,
  getDichVuDropdown,
  getPhongKhamDropdown,
  getDichVuGiaList,
  getDichVuGiaById,
  createDichVuGia,
  updateDichVuGia,
  softDeleteDichVuGia,
  getGiaHienHanh,
} from "../../../controllers/DanhMucDichVuController";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ========== Helpers ==========
const cx = (...arr) => arr.filter(Boolean).join(" ");
const formatMoney = (n) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    Number(n || 0)
  );
const ymd = (d) => (d ? new Date(d).toISOString().split("T")[0] : "");

// ========== Shared components ==========
function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-2 border-b mb-6">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={cx(
            "px-4 py-2 rounded-t-md",
            active === t.key
              ? "bg-white border-x border-t text-sky-700 font-semibold"
              : "text-gray-600 hover:text-sky-700"
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

function Pagination({ page, pageSize, total, onChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  return (
    <div className="flex items-center justify-between mt-4 text-sm">
      <div>
        Trang <b>{page}</b> / {totalPages} — Tổng <b>{total}</b> dòng
      </div>
      <div className="flex gap-2">
        <button
          className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
        >
          ← Trước
        </button>
        <button
          className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
          disabled={page >= totalPages}
          onClick={() => onChange(page + 1)}
        >
          Sau →
        </button>
      </div>
    </div>
  );
}

function ConfirmDialog({ open, title, message, onClose, onConfirm }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <div className="text-lg font-semibold mb-2">{title}</div>
        <div className="text-gray-600 mb-6">{message}</div>
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded border hover:bg-gray-50"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            className="px-4 py-2 rounded bg-rose-600 text-white hover:bg-rose-700"
            onClick={onConfirm}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}

// ========== Tab 1: Nhóm dịch vụ ==========
function NhomDichVuTab() {
  const [keyword, setKeyword] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const [data, err] = await getNhomDichVu(keyword);
    setLoading(false);
    if (err) return toast.error(err);
    setRows(data || []);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <div className="flex gap-3 items-end mb-4">
        <div className="flex-1">
          <label className="block text-sm text-gray-600 mb-1">Tìm kiếm</label>
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tên / mô tả nhóm dịch vụ..."
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-200"
          />
        </div>
        <button
          onClick={load}
          className="h-10 px-4 rounded-lg bg-sky-600 text-white hover:bg-sky-700"
        >
          Tìm
        </button>
      </div>

      <div className="overflow-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left bg-gray-50">
              <th className="p-3">#</th>
              <th className="p-3">Tên nhóm</th>
              <th className="p-3">Mô tả</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="p-3 text-gray-500" colSpan={3}>
                  Đang tải...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td className="p-3 text-gray-500" colSpan={3}>
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              rows.map((r, idx) => (
                <tr key={r.id} className="border-t">
                  <td className="p-3">{idx + 1}</td>
                  <td className="p-3 font-medium">{r.ten}</td>
                  <td className="p-3 text-gray-600">{r.moTa || "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ========== Tab 2: Dịch vụ ==========
function DichVuTab() {
  const [filters, setFilters] = useState({
    idNhom: "",
    idPhong: "",
    keyword: "",
    hoatDong: "",
    page: 1,
    pageSize: 10,
  });
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [phongDropdown, setPhongDropdown] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadPhong = async () => {
    const [data] = await getPhongKhamDropdown();
    setPhongDropdown(data || []);
  };

  const loadList = async () => {
    setLoading(true);
    const params = {
      page: filters.page,
      pageSize: filters.pageSize,
    };
    if (filters.idNhom) params.idNhom = Number(filters.idNhom);
    if (filters.idPhong) params.idPhong = Number(filters.idPhong);
    if (filters.keyword) params.keyword = filters.keyword;
    if (filters.hoatDong !== "") params.hoatDong = filters.hoatDong === "true";

    const [data, err] = await getDichVuList(params);
    setLoading(false);
    if (err) return toast.error(err);
    setRows(data?.items || []);
    setTotal(data?.totalItems || 0);
  };

  useEffect(() => {
    loadPhong();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    loadList();
    // eslint-disable-next-line
  }, [filters.page, filters.pageSize]);

  const applyFilter = () => {
    setFilters((f) => ({ ...f, page: 1 }));
    loadList();
  };

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Phòng khám</label>
          <select
            className="w-full border rounded-lg px-3 py-2"
            value={filters.idPhong}
            onChange={(e) =>
              setFilters((f) => ({ ...f, idPhong: e.target.value }))
            }
          >
            <option value="">— Tất cả —</option>
            {phongDropdown.map((p) => (
              <option key={p.id} value={p.id}>
                {p.tenPhong}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Trạng thái</label>
          <select
            className="w-full border rounded-lg px-3 py-2"
            value={filters.hoatDong}
            onChange={(e) =>
              setFilters((f) => ({ ...f, hoatDong: e.target.value }))
            }
          >
            <option value="">— Tất cả —</option>
            <option value="true">Đang hoạt động</option>
            <option value="false">Ngưng</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm text-gray-600 mb-1">Tìm kiếm</label>
          <div className="flex gap-2">
            <input
              placeholder="Mã / Tên dịch vụ…"
              value={filters.keyword}
              onChange={(e) =>
                setFilters((f) => ({ ...f, keyword: e.target.value }))
              }
              className="flex-1 border rounded-lg px-3 py-2"
            />
            <button
              onClick={applyFilter}
              className="px-4 rounded-lg bg-sky-600 text-white hover:bg-sky-700"
            >
              Lọc
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-auto mt-4">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left bg-gray-50">
              <th className="p-3">Mã</th>
              <th className="p-3">Tên dịch vụ</th>
              <th className="p-3">Nhóm</th>
              <th className="p-3">Phòng</th>
              <th className="p-3">Đơn vị</th>
              <th className="p-3">Mô tả</th>
              <th className="p-3">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="p-3 text-gray-500" colSpan={7}>
                  Đang tải...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td className="p-3 text-gray-500" colSpan={7}>
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="p-3 font-medium">{r.ma}</td>
                  <td className="p-3">{r.ten}</td>
                  <td className="p-3">{r.tenNhom ?? "—"}</td>
                  <td className="p-3">{r.tenPhong ?? "—"}</td>
                  <td className="p-3">{r.donViTinh ?? "—"}</td>
                  <td className="p-3 text-gray-600">{r.moTa ?? "—"}</td>
                  <td className="p-3">
                    {r.hoatDong ? (
                      <span className="px-2 py-0.5 text-xs rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Đang hoạt động
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-xs rounded bg-rose-50 text-rose-700 border border-rose-200">
                        Ngưng
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        page={filters.page}
        pageSize={filters.pageSize}
        total={total}
        onChange={(p) => setFilters((f) => ({ ...f, page: p }))}
      />
    </div>
  );
}

// ========== Modal Giá dịch vụ ==========
function BangGiaModal({ open, onClose, onSubmit, initial, dichVuOptions, phongOptions }) {
  const [form, setForm] = useState({
    idDichVu: "",
    idPhong: "",
    donGia: "",
    ngayApDung: ymd(new Date()),
    ngayHetHan: "",
    doiTuongApDung: "Tất cả",
    ghiChu: "Giá khám hiện hành",
    hoatDong: true,
  });

  useEffect(() => {
    if (open) {
      if (initial) {
        setForm({
          idDichVu: initial.idDichVu || "",
          idPhong: initial.idPhong || "",
          donGia: initial.donGia || "",
          ngayApDung: ymd(initial.ngayApDung),
          ngayHetHan: initial.ngayHetHan ? ymd(initial.ngayHetHan) : "",
          doiTuongApDung: initial.doiTuongApDung || "Tất cả",
          ghiChu: initial.ghiChu || "Giá khám hiện hành",
          hoatDong: initial.hoatDong ?? true,
        });
      } else {
        setForm((f) => ({ ...f, ngayApDung: ymd(new Date()) }));
      }
    }
  }, [open, initial]);

  if (!open) return null;

  const submit = () => {
    if (!form.idDichVu || !form.idPhong || !form.donGia || !form.ngayApDung) {
      toast.error("Vui lòng nhập đủ Dịch vụ, Phòng, Đơn giá, Ngày áp dụng");
      return;
    }
    const payload = {
      idDichVu: Number(form.idDichVu),
      idPhong: Number(form.idPhong),
      donGia: Number(form.donGia),
      ngayApDung: new Date(form.ngayApDung),
      ngayHetHan: form.ngayHetHan ? new Date(form.ngayHetHan) : null,
      doiTuongApDung: form.doiTuongApDung || "Tất cả",
      ghiChu: form.ghiChu || "",
      hoatDong: Boolean(form.hoatDong),
    };
    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6">
        <div className="text-lg font-semibold mb-1">
          {initial ? "Cập nhật giá dịch vụ" : "Thêm giá dịch vụ"}
        </div>
        <div className="text-gray-500 mb-4">
          Gán giá cho dịch vụ theo phòng, có ngày áp dụng/hết hạn rõ ràng.
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Dịch vụ</label>
            <select
              className="w-full border rounded-lg px-3 py-2"
              value={form.idDichVu}
              onChange={(e) => setForm((f) => ({ ...f, idDichVu: e.target.value }))}
              disabled={!!initial}
            >
              <option value="">— Chọn dịch vụ —</option>
              {dichVuOptions.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.ma} — {d.ten}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Phòng khám</label>
            <select
              className="w-full border rounded-lg px-3 py-2"
              value={form.idPhong}
              onChange={(e) => setForm((f) => ({ ...f, idPhong: e.target.value }))}
            >
              <option value="">— Chọn phòng —</option>
              {phongOptions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.tenPhong}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Đơn giá</label>
            <input
              type="number"
              min="0"
              className="w-full border rounded-lg px-3 py-2"
              value={form.donGia}
              onChange={(e) => setForm((f) => ({ ...f, donGia: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Ngày áp dụng</label>
            <input
              type="date"
              className="w-full border rounded-lg px-3 py-2"
              value={form.ngayApDung}
              onChange={(e) => setForm((f) => ({ ...f, ngayApDung: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Ngày hết hạn</label>
            <input
              type="date"
              className="w-full border rounded-lg px-3 py-2"
              value={form.ngayHetHan}
              onChange={(e) => setForm((f) => ({ ...f, ngayHetHan: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Đối tượng áp dụng</label>
            <input
              className="w-full border rounded-lg px-3 py-2"
              value={form.doiTuongApDung}
              onChange={(e) => setForm((f) => ({ ...f, doiTuongApDung: e.target.value }))}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-gray-600 mb-1">Ghi chú</label>
            <input
              className="w-full border rounded-lg px-3 py-2"
              value={form.ghiChu}
              onChange={(e) => setForm((f) => ({ ...f, ghiChu: e.target.value }))}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="hoatDong"
              type="checkbox"
              checked={form.hoatDong}
              onChange={(e) => setForm((f) => ({ ...f, hoatDong: e.target.checked }))}
            />
            <label htmlFor="hoatDong" className="text-sm text-gray-700">
              Đang hoạt động
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button className="px-4 py-2 rounded border hover:bg-gray-50" onClick={onClose}>
            Đóng
          </button>
          <button
            className="px-4 py-2 rounded bg-sky-600 text-white hover:bg-sky-700"
            onClick={submit}
          >
            {initial ? "Cập nhật" : "Thêm"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ========== Tab 3: Bảng giá ==========
function BangGiaTab() {
  const [filters, setFilters] = useState({
    idDichVu: "",
    idPhong: "",
    atDate: "",
    activeOnly: false,
  });
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dichVuOptions, setDichVuOptions] = useState([]);
  const [phongOptions, setPhongOptions] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState({ open: false, id: null });

  const loadDropdowns = async () => {
    const [dv] = await getDichVuDropdown();
    const [pk] = await getPhongKhamDropdown();
    setDichVuOptions(dv || []);
    setPhongOptions(pk || []);
  };

  const loadList = async () => {
    setLoading(true);
    const params = {};
    if (filters.idDichVu) params.idDichVu = Number(filters.idDichVu);
    if (filters.idPhong) params.idPhong = Number(filters.idPhong);
    if (filters.atDate) params.atDate = filters.atDate;
    if (filters.activeOnly) params.activeOnly = true;

    const [data, err] = await getDichVuGiaList(params);
    setLoading(false);
    if (err) return toast.error(err);
    setRows(data || []);
  };

  useEffect(() => {
    loadDropdowns();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    loadList();
    // eslint-disable-next-line
  }, []);

  const applyFilter = () => loadList();

  const onAdd = () => {
    setEditing(null);
    setOpenModal(true);
  };

  const onEdit = async (id) => {
    const [data, err] = await getDichVuGiaById(id);
    if (err) return toast.error(err);
    setEditing(data);
    setOpenModal(true);
  };

  const onDelete = (id) => setConfirm({ open: true, id });

  const doDelete = async () => {
    const id = confirm.id;
    setConfirm({ open: false, id: null });
    const [, err] = await softDeleteDichVuGia(id);
    if (err) return toast.error(err);
    toast.success("Đã vô hiệu hóa giá dịch vụ");
    loadList();
  };

  const submitModal = async (payload) => {
    let err;
    if (editing?.id) {
      [, err] = await updateDichVuGia(editing.id, payload);
      if (!err) toast.success("Cập nhật giá dịch vụ thành công!");
    } else {
      [, err] = await createDichVuGia(payload);
      if (!err) toast.success("Thêm giá dịch vụ thành công!");
    }
    if (err) return toast.error(err);
    setOpenModal(false);
    setEditing(null);
    loadList();
  };

  const colorByDate = (row) => {
    const today = new Date();
    const start = new Date(row.ngayApDung);
    const end = row.ngayHetHan ? new Date(row.ngayHetHan) : null;
    if (end && end < today) return "bg-rose-50 text-rose-700 border-rose-200";
    if (start <= today && (!end || end >= today))
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    return "bg-amber-50 text-amber-700 border-amber-200";
  };

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        <div className="md:col-span-2">
          <label className="block text-sm text-gray-600 mb-1">Dịch vụ</label>
          <select
            className="w-full border rounded-lg px-3 py-2"
            value={filters.idDichVu}
            onChange={(e) => setFilters((f) => ({ ...f, idDichVu: e.target.value }))}
          >
            <option value="">— Tất cả —</option>
            {dichVuOptions.map((d) => (
              <option key={d.id} value={d.id}>
                {d.ma} — {d.ten}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Phòng khám</label>
          <select
            className="w-full border rounded-lg px-3 py-2"
            value={filters.idPhong}
            onChange={(e) => setFilters((f) => ({ ...f, idPhong: e.target.value }))}
          >
            <option value="">— Tất cả —</option>
            {phongOptions.map((p) => (
              <option key={p.id} value={p.id}>
                {p.tenPhong}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Tại ngày</label>
          <input
            type="date"
            className="w-full border rounded-lg px-3 py-2"
            value={filters.atDate}
            onChange={(e) => setFilters((f) => ({ ...f, atDate: e.target.value }))}
          />
        </div>

        <div className="flex items-end gap-2">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={filters.activeOnly}
              onChange={(e) =>
                setFilters((f) => ({ ...f, activeOnly: e.target.checked }))
              }
            />
            <span className="text-sm">Chỉ giá còn hiệu lực</span>
          </label>
          <button
            onClick={applyFilter}
            className="ml-auto px-4 h-10 rounded-lg bg-sky-600 text-white hover:bg-sky-700"
          >
            Lọc
          </button>
          <button
            onClick={onAdd}
            className="px-4 h-10 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
          >
            + Thêm giá
          </button>
        </div>
      </div>

      <div className="overflow-auto mt-4">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left bg-gray-50">
              <th className="p-3">Dịch vụ</th>
              <th className="p-3">Phòng</th>
              <th className="p-3">Đơn giá</th>
              <th className="p-3">Áp dụng</th>
              <th className="p-3">Hết hạn</th>
              <th className="p-3">Trạng thái</th>
              <th className="p-3 w-40"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="p-3 text-gray-500" colSpan={7}>
                  Đang tải...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td className="p-3 text-gray-500" colSpan={7}>
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="p-3">
                    <div className="font-medium">{r.tenDichVu}</div>
                    <div className="text-gray-500 text-xs">{r.maDichVu}</div>
                  </td>
                  <td className="p-3">{r.tenPhong ?? "—"}</td>
                  <td className="p-3 font-semibold">{formatMoney(r.donGia)}</td>
                  <td className="p-3">{ymd(r.ngayApDung)}</td>
                  <td className="p-3">{r.ngayHetHan ? ymd(r.ngayHetHan) : "—"}</td>
                  <td className="p-3">
                    <span
                      className={cx(
                        "px-2 py-0.5 text-xs rounded border",
                        colorByDate(r)
                      )}
                    >
                      {r.hoatDong ? "Hiệu lực / Sắp hiệu lực" : "Ngưng"}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        className="px-3 py-1 rounded border hover:bg-gray-50"
                        onClick={() => onEdit(r.id)}
                      >
                        Sửa
                      </button>
                      <button
                        className="px-3 py-1 rounded border border-rose-300 text-rose-700 hover:bg-rose-50"
                        onClick={() => onDelete(r.id)}
                      >
                        Vô hiệu
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <BangGiaModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setEditing(null);
        }}
        onSubmit={submitModal}
        initial={editing}
        dichVuOptions={dichVuOptions}
        phongOptions={phongOptions}
      />

      <ConfirmDialog
        open={confirm.open}
        title="Vô hiệu hóa giá dịch vụ?"
        message="Giá sẽ được đánh dấu ngưng hoạt động (soft delete) và không còn hiệu lực áp dụng."
        onClose={() => setConfirm({ open: false, id: null })}
        onConfirm={doDelete}
      />
    </div>
  );
}

// ========== Trang chính ==========
export default function DanhMucDichVu() {
  const [active, setActive] = useState("nhom");

  const tabs = useMemo(
    () => [
      { key: "nhom", label: "Nhóm dịch vụ" },
      { key: "dichvu", label: "Dịch vụ" },
      { key: "banggia", label: "Bảng giá" },
    ],
    []
  );

  return (
    <div className="p-6">
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-sky-800">Danh mục & Cấu hình DVKT</h1>
        <p className="text-gray-600">
          Quản lý nhóm dịch vụ, dịch vụ, và bảng giá theo phòng khám.
        </p>
      </div>

      <Tabs tabs={tabs} active={active} onChange={setActive} />

      {active === "nhom" && <NhomDichVuTab />}
      {active === "dichvu" && <DichVuTab />}
      {active === "banggia" && <BangGiaTab />}
    </div>
  );
}

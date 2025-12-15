// src/pages/admin/thuoc/index.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  loadFilters,
  loadThuoc,
  createThuoc,
  updateThuoc,
  toggleThuoc,
  loadGiaByThuoc,
  createGia,
  updateGia,
  toggleGia,
} from "../../../controllers/DanhMucThuocController";

import ThuocFilter from "./ThuocFilter";
import ThuocTable from "./ThuocTable";
import ThuocModal from "./ThuocModal";
import ThuocGiaTable from "./ThuocGiaTable";
import ThuocGiaModal from "./ThuocGiaModal";
import EmptyState from "./EmptyState";
import ThuocColumnConfigModal from "./ThuocColumnConfigModal"; // ✅ dùng cho cả 2 bảng

export default function ThuocPage() {
  // ====== STATE CHUNG ======
  const [filters, setFilters] = useState({
    idNhom: "",
    keyword: "",
    hoatDong: "",
    page: 1,
    pageSize: 12,
  });

  const [nhomList, setNhomList] = useState([]);
  const [thuocPaged, setThuocPaged] = useState({ items: [], page: 1, pageSize: 12, totalItems: 0 });
  const [selected, setSelected] = useState(null);
  const [giaList, setGiaList] = useState([]);

  // ====== MODALS ======
  const [openThuocModal, setOpenThuocModal] = useState(false);
  const [editingThuoc, setEditingThuoc] = useState(null);

  const [openGiaModal, setOpenGiaModal] = useState(false);
  const [editingGia, setEditingGia] = useState(null);

  // ✅ Modal cấu hình cột (thuốc)
  const [openConfigThuoc, setOpenConfigThuoc] = useState(false);
  const [columnsThuoc, setColumnsThuoc] = useState([
    { id: "stt", label: "#", visible: true },
    { id: "ma", label: "Mã", visible: true },
    { id: "ten", label: "Tên", visible: true },
    { id: "donViTinh", label: "ĐVT", visible: true },
    { id: "nhom", label: "Nhóm", visible: true },
    { id: "trangThai", label: "TT", visible: true },
    { id: "actions", label: "Thao tác", visible: true },
  ]);

  // ✅ Modal cấu hình cột (giá thuốc)
  const [openConfigGia, setOpenConfigGia] = useState(false);
  const [columnsGia, setColumnsGia] = useState([
    { id: "stt", label: "#", visible: true },
    { id: "donGia", label: "Đơn giá (VNĐ)", visible: true },
    { id: "ngayApDung", label: "Ngày áp dụng", visible: true },
    { id: "trangThai", label: "TT", visible: true },
    { id: "actions", label: "Thao tác", visible: true },
  ]);

  // ====== LOAD DATA ======
  const refreshThuoc = useCallback(async () => {
    const data = await loadThuoc(filters);
    setThuocPaged(data);
  }, [filters]);

  const refreshGia = useCallback(async () => {
    if (!selected?.id) return setGiaList([]);
    const data = await loadGiaByThuoc(selected.id, false);
    setGiaList(data);
  }, [selected]);

  useEffect(() => {
    loadFilters().then(({ nhomList }) => setNhomList(nhomList));
  }, []);

  useEffect(() => {
    refreshThuoc();
  }, [refreshThuoc]);

  useEffect(() => {
    refreshGia();
  }, [refreshGia]);

  // ====== HANDLERS ======
  const onOpenAddThuoc = () => {
    setEditingThuoc(null);
    setOpenThuocModal(true);
  };

  const onEditThuoc = (row) => {
    setEditingThuoc(row);
    setOpenThuocModal(true);
  };

  const onSubmitThuoc = async (values) => {
    try {
      if (editingThuoc) {
        await updateThuoc(editingThuoc.id, values);
        toast.success("Cập nhật thuốc thành công");
      } else {
        await createThuoc(values);
        toast.success("Thêm thuốc thành công");
      }
      setOpenThuocModal(false);
      await refreshThuoc();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Lỗi lưu thuốc");
    }
  };

  const onToggleThuoc = async (row) => {
    await toggleThuoc(row);
    toast.success(row.hoatDong ? "Đã vô hiệu hóa" : "Đã kích hoạt");
    if (selected?.id === row.id && !row.hoatDong) setSelected(null);
    await refreshThuoc();
  };

  const onSelectThuoc = (row) => setSelected(row);

  const onOpenAddGia = () => {
    if (!selected) return toast.info("Vui lòng chọn thuốc trước");
    setEditingGia(null);
    setOpenGiaModal(true);
  };

  const onEditGia = (row) => {
    setEditingGia(row);
    setOpenGiaModal(true);
  };

  const onSubmitGia = async (values) => {
    try {
      const payload = { ...values, idThuoc: selected.id };
      if (editingGia) {
        await updateGia(editingGia.id, payload);
        toast.success("Cập nhật giá thành công");
      } else {
        await createGia(payload);
        toast.success("Thêm giá thành công");
      }
      setOpenGiaModal(false);
      await refreshGia();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Lỗi lưu giá thuốc");
    }
  };

  const onToggleGia = async (row) => {
    await toggleGia(row);
    toast.success(row.hoatDong ? "Đã vô hiệu giá" : "Đã kích hoạt giá");
    await refreshGia();
  };

  const headerTitle = useMemo(
    () => (selected ? `Giá: ${selected.ten} (${selected.ma})` : "💡 Chọn một thuốc để xem giá"),
    [selected]
  );

  // ====== RENDER ======
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-pink-50 overflow-x-auto">
      <ToastContainer position="top-right" autoClose={1300} />

      {/* Bộ lọc */}
      <div className="mb-2">
        <ThuocFilter
          nhomList={nhomList}
          filters={filters}
          onChange={(f) => setFilters((s) => ({ ...s, ...f, page: 1 }))}
          onAdd={onOpenAddThuoc}
        />
      </div>

      {/* 2 cột: Thuốc | Giá thuốc */}
      <div className="grid grid-cols-12 gap-3 w-full pt-1">
        {/* Bảng Thuốc */}
        <div className="col-span-12 xl:col-span-8">
          <div className="bg-white rounded-xl shadow-md border border-sky-100">
            <div className="px-4 py-2 border-b bg-white flex items-center justify-between">
              <h2 className="text-lg font-semibold text-sky-700">Danh sách thuốc</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setOpenConfigThuoc(true)}
                  className="px-3 py-0.5 rounded-md text-sm text-sky-700 border border-sky-300 hover:bg-sky-50"
                >
                  ⚙ Điều chỉnh cột
                </button>
                <span className="text-sm text-gray-500">
                  Tổng: <b>{thuocPaged.totalItems}</b>
                </span>
              </div>
            </div>
            <div className="p-2 overflow-x-auto">
              <ThuocTable
                data={thuocPaged.items}
                page={thuocPaged.page}
                pageSize={thuocPaged.pageSize}
                total={thuocPaged.totalItems}
                onPageChange={(page) => setFilters((s) => ({ ...s, page }))}
                onSelect={onSelectThuoc}
                selectedId={selected?.id}
                onEdit={onEditThuoc}
                onToggle={onToggleThuoc}
                columns={columnsThuoc.filter((c) => c.visible)}
              />
            </div>
          </div>
        </div>

        {/* Bảng Giá thuốc */}
        <div className="col-span-12 xl:col-span-4">
          <div className="bg-white rounded-xl shadow-md border border-pink-100 h-full flex flex-col">
            <div className="px-4 py-2 border-b bg-white flex items-center justify-between">
              <h2 className="text-sm font-semibold text-pink-700">{headerTitle}</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setOpenConfigGia(true)}
                  className="px-3 py-0.5 rounded-md text-sm text-pink-700 border border-pink-300 hover:bg-pink-50"
                >
                  Điều chỉnh cột
                </button>
                <button
                  onClick={onOpenAddGia}
                  className="px-3 py-0.5 rounded-md text-sm bg-emerald-500 text-white hover:bg-emerald-600 transition disabled:opacity-50"
                  disabled={!selected}
                >
                  Thêm
                </button>
              </div>
            </div>
            <div className="p-2 flex-1 overflow-x-auto">
              {selected ? (
                <ThuocGiaTable
                  data={giaList}
                  onEdit={onEditGia}
                  onToggle={onToggleGia}
                  columns={columnsGia.filter((c) => c.visible)}
                />
              ) : (
                <EmptyState />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {openThuocModal && (
        <ThuocModal
          open={openThuocModal}
          onClose={() => setOpenThuocModal(false)}
          onSubmit={onSubmitThuoc}
          nhomList={nhomList}
          initial={editingThuoc}
        />
      )}

      {openGiaModal && (
        <ThuocGiaModal
          open={openGiaModal}
          onClose={() => setOpenGiaModal(false)}
          onSubmit={onSubmitGia}
          initial={editingGia}
          selectedThuoc={selected}
        />
      )}

      {/* Cấu hình cột */}
      {openConfigThuoc && (
        <ThuocColumnConfigModal
          open={openConfigThuoc}
          onClose={() => setOpenConfigThuoc(false)}
          columns={columnsThuoc}
          setColumns={setColumnsThuoc}
        />
      )}

      {openConfigGia && (
        <ThuocColumnConfigModal
          open={openConfigGia}
          onClose={() => setOpenConfigGia(false)}
          columns={columnsGia}
          setColumns={setColumnsGia}
        />
      )}
    </div>
  );
}

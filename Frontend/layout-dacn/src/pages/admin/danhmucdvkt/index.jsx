// src/pages/admin/danhmucdvkt/index.jsx
import React, { useEffect, useState } from "react";
import {
  loadNhomDVKT,
  loadDVKT,
  createDVKT,
  updateDVKT,
  loadGiaDVKT,
  createGiaDVKT,
  updateGiaDVKT,
  alertSuccess,
  alertError,
  toggleDVKT,
} from "../../../controllers/DanhMucDVKTController";

import DVKTFilter from "./DVKTFilter";
import DVKTTable from "./DVKTTable";
import DVKTModal from "./DVKTModal";
import GiaDVKTTable from "./GiaDVKTTable";
import GiaDVKTModal from "./GiaDVKTModal";
import EmptyState from "./EmptyState";

export default function DanhMucDVKTPage() {
  const [nhomList, setNhomList] = useState([]);
  const [dvktList, setDvktList] = useState([]);
  const [dvktListBackup, setDvktListBackup] = useState([]);
  const [filters, setFilters] = useState({ idNhom: "", keyword: "" });
  const [selected, setSelected] = useState(null);
  const [giaList, setGiaList] = useState([]);

  const [openDVKTModal, setOpenDVKTModal] = useState(false);
  const [openGiaModal, setOpenGiaModal] = useState(false);
  const [editingDVKT, setEditingDVKT] = useState(null);
  const [editingGia, setEditingGia] = useState(null);

  const applyFilter = (f) => {
    let data = [...dvktListBackup];

    if (f.idNhom) {
      data = data.filter((x) => String(x.idNhom) === String(f.idNhom));
    }

    if (f.keyword) {
      const kw = f.keyword.toLowerCase();
      data = data.filter(
        (x) =>
          x.tenDvkt.toLowerCase().includes(kw) ||
          x.maDvkt.toLowerCase().includes(kw)
      );
    }

    setDvktList(data);
  };

  const onToggleDVKT = async (row) => {
    try {
      await toggleDVKT(row.id);
      alertSuccess(row.hoatDong ? "Đã khóa DVKT" : "Đã mở khóa DVKT");
      loadDVKT().then((list) => {
        setDvktList(list);
        setDvktListBackup(list);
        applyFilter(filters);
      });
    } catch (err) {
      alertError("Lỗi khi cập nhật trạng thái DVKT");
    }
  };

  useEffect(() => {
    loadNhomDVKT().then(setNhomList);
    loadDVKT().then((list) => {
      setDvktList(list);
      setDvktListBackup(list);
    });
  }, []);

  useEffect(() => {
    if (selected?.id) loadGiaDVKT(selected.id).then(setGiaList);
  }, [selected]);

  const openAddDVKT = () => {
    setEditingDVKT(null);
    setOpenDVKTModal(true);
  };

  const openEditDVKT = (row) => {
    setEditingDVKT(row);
    setOpenDVKTModal(true);
  };

  const submitDVKT = async (values) => {
    try {
      if (editingDVKT) {
        await updateDVKT(editingDVKT.id, values);
        alertSuccess("Cập nhật DVKT thành công!");
      } else {
        await createDVKT(values);
        alertSuccess("Thêm DVKT thành công!");
      }
      setOpenDVKTModal(false);
      loadDVKT().then((list) => {
        setDvktList(list);
        setDvktListBackup(list);
        applyFilter(filters);
      });
    } catch (err) {
      alertError("Lỗi khi lưu DVKT");
    }
  };

  const openAddGia = () => {
    if (!selected) return alertError("Chọn DVKT trước");
    setEditingGia(null);
    setOpenGiaModal(true);
  };

  const openEditGia = (row) => {
    setEditingGia(row);
    setOpenGiaModal(true);
  };

  const submitGia = async (values) => {
    try {
      if (editingGia) {
        const body = {
          donGia: values.donGia,
          denNgay: values.denNgay || null,
          ghiChu: values.ghiChu || "",
        };
        await updateGiaDVKT(editingGia.id, body);
        alertSuccess("Cập nhật giá thành công!");
      } else {
        const body = {
          idDVKT: selected.id,
          donGia: values.donGia,
          tuNgay: values.tuNgay,
          ghiChu: values.ghiChu || "",
        };
        await createGiaDVKT(body);
        alertSuccess("Thêm giá thành công!");
      }

      setOpenGiaModal(false);
      loadGiaDVKT(selected.id).then(setGiaList);
    } catch (err) {
      alertError("Lỗi khi lưu giá");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-pink-50 p-4">
      <DVKTFilter
        nhomList={nhomList}
        filters={filters}
        onAdd={openAddDVKT}
        onChange={(f) => {
          const newFilters = { ...filters, ...f };
          setFilters(newFilters);
          applyFilter(newFilters);
        }}
      />

      <div className="grid grid-cols-12 gap-4 mt-4">
        <div className="col-span-12 xl:col-span-8">
          <DVKTTable
            data={dvktList}
            onSelect={setSelected}
            selectedId={selected?.id}
            onEdit={openEditDVKT}
            onToggle={onToggleDVKT}
          />
        </div>

        <div className="col-span-12 xl:col-span-4">
          {selected ? (
            <GiaDVKTTable
              data={giaList}
              dvkt={selected}
              onAdd={openAddGia}
              onEdit={openEditGia}
            />
          ) : (
            <EmptyState />
          )}
        </div>
      </div>

      {openDVKTModal && (
        <DVKTModal
          open={openDVKTModal}
          onClose={() => setOpenDVKTModal(false)}
          onSubmit={submitDVKT}
          initial={editingDVKT}
          nhomList={nhomList}
        />
      )}

      {openGiaModal && (
        <GiaDVKTModal
          open={openGiaModal}
          onClose={() => setOpenGiaModal(false)}
          onSubmit={submitGia}
          initial={editingGia}
          dvkt={selected}
        />
      )}
    </div>
  );
}

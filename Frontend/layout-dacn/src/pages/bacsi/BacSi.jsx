import React, { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";

import {
  fetchChoKhamList,
  fetchHomNayList,
  fetchDaKhamList,
  fetchLichSuKham,
  fetchPhongBacSi,
  fetchLanKhamDetail,
  fetchDonTheoLanKham,
} from "../../controllers/BacSiController";

import PatientList from "./components/PatientList";
import ResultForm from "./components/ResultForm";
import LichSuKham from "./components/LichSuKham";
import HeaderPhong from "./components/HeaderPhong";

import ModalChiDinhDVKT from "./modals/modalbacsichidinhDVKT/ModalChiDinhDVKT";
import ModalKeDonThuoc from "./modals/ModalKeDonThuoc";
import ModalXacNhanHuy from "./modals/ModalXacNhanHuy";

import { toast } from "react-toastify";

// ======================== USER ==============================
function getCurrentUser() {
  try {
    const u =
      JSON.parse(localStorage.getItem("user")) ||
      JSON.parse(localStorage.getItem("userInfo")) ||
      null;

    if (!u) return {};

    return {
      id: u.userId || u.id,
      tenDangNhap: u.tenDangNhap || u.username,
      vaiTro: Array.isArray(u.roles) ? u.roles[0] : u.vaiTro,
      idPhong: u.idPhong,
    };
  } catch {
    return {};
  }
}

export default function BacSi() {
  const user = getCurrentUser();
  const idBacSi = Number(user.id);

  const [idPhong, setIdPhong] = useState(Number(user.idPhong));
  const isBacSi = (user.vaiTro || "").toUpperCase() === "BAC_SI";

  const [listChoKham, setListChoKham] = useState([]);
  const [listHomNay, setListHomNay] = useState([]);
  const [listDaKham, setListDaKham] = useState([]);   // ⭐ mới

  const [lichSu, setLichSu] = useState([]);
  const [phong, setPhong] = useState(null);

  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("CHO_KHAM");

  const [openKeDon, setOpenKeDon] = useState(false);
  const [openChiDinh, setOpenChiDinh] = useState(false);

  const [donThuoc, setDonThuoc] = useState(null);

  // ================= SELECT PATIENT =================
  const handleSelectPatient = async (bn) => {
    console.log("👉 SELECTED LIST ITEM:", bn);

    // bn.id = idLanKham
    await fetchLanKhamDetail(bn.id, setSelected);
  };

  function handleOpenKeDon() {
    if (!selected?.id) {
      toast.error("Chưa chọn lượt khám!");
      return;
    }
    setOpenKeDon(true);
  }

  function handleOpenChiDinh() {
    if (!selected?.id) {
      toast.error("Chưa chọn lượt khám!");
      return;
    }
    setOpenChiDinh(true);
  }

  // ================= LOAD PHÒNG =================
  useEffect(() => {
    if (!idBacSi) return;

    fetchPhongBacSi(idBacSi, (p) => {
      setPhong(p);
      if (p?.idPhong) setIdPhong(p.idPhong);
    });
  }, [idBacSi]);

  // ================= LOAD CHỜ KHÁM + HÔM NAY =================
useEffect(() => {
  if (!idPhong || !idBacSi) return;

  fetchChoKhamList(idBacSi, idPhong, setListChoKham);
  fetchHomNayList(idBacSi, idPhong, setListHomNay);
  fetchDaKhamList(idBacSi, idPhong, setListDaKham);   // ⭐ THÊM
}, [idPhong, idBacSi]);
// ⭐⭐⭐ LẮNG NGHE SỰ KIỆN TỪ ResultForm ĐỂ RELOAD DANH SÁCH TỰ ĐỘNG
useEffect(() => {
  const handler = () => {
    fetchChoKhamList(idBacSi, idPhong, setListChoKham);
    fetchHomNayList(idBacSi, idPhong, setListHomNay);
    fetchDaKhamList(idBacSi, idPhong, setListDaKham);
  };

  window.addEventListener("reload-patient-list", handler);

  return () => window.removeEventListener("reload-patient-list", handler);
}, [idBacSi, idPhong]);

  // ================= LOAD LỊCH SỬ + ĐƠN =================
  useEffect(() => {
    if (selected?.idBenhNhan) {
      fetchLichSuKham(selected.idBenhNhan, setLichSu);
    }

    if (selected?.id) {
      fetchDonTheoLanKham(selected.id, setDonThuoc);
    } else {
      setDonThuoc(null);
    }
  }, [selected]);

// ⭐⭐⭐ Gom thêm DANG_KHAM vào danh sách CHỜ KHÁM
let currentList = [...listChoKham];

if (filter === "CHO_KHAM") {
  currentList = [
    ...listChoKham,
    ...listHomNay.filter(x => x.trangThai === "DANG_KHAM"),
    ...listDaKham.filter(x => x.trangThai === "DANG_KHAM")
  ];
}

if (filter === "HOM_NAY") {
  currentList = [
    ...listHomNay,
    ...listDaKham.filter(x => x.trangThai === "DANG_KHAM")
  ];
}

if (filter === "DA_KHAM") {
  currentList = listDaKham.filter(x => x.trangThai === "DA_KHAM");
}



  // ================= VALIDATION =====================
  if (!idBacSi) {
    return (
      <MainLayout>
        <div className="p-8 text-center text-red-600 font-semibold">
          ⚠️ Không xác định bác sĩ. Vui lòng đăng nhập lại.
        </div>
      </MainLayout>
    );
  }

  if (!isBacSi) {
    return (
      <MainLayout>
        <div className="p-8 text-center text-red-600 font-semibold">
          ⚠️ Bạn không có quyền truy cập trang bác sĩ.
        </div>
      </MainLayout>
    );
  }

  // ================= UI ======================
  return (
    <MainLayout>
      <HeaderPhong phong={phong} />

      <div className="w-full h-[calc(100vh-80px)] p-4 flex gap-4">
        <PatientList
          list={currentList}
          filter={filter}
          setFilter={setFilter}
          selected={selected}
          setSelected={setSelected}
          onSelect={handleSelectPatient}
        />

<ResultForm
  selected={selected}
  idBacSi={idBacSi}
  idPhong={idPhong}
  donThuoc={donThuoc}
  onOpenKeDon={handleOpenKeDon}
  onOpenChiDinh={handleOpenChiDinh}
  refresh={() => {
    fetchChoKhamList(idBacSi, idPhong, setListChoKham);
    fetchHomNayList(idBacSi, idPhong, setListHomNay);
    if (selected?.id) fetchDonTheoLanKham(selected.id, setDonThuoc);
  }}

  /* ⭐⭐ THÊM PROP NÀY ⭐⭐ */
  onReloadSelected={async () => {
    if (selected?.id) {
      await fetchLanKhamDetail(selected.id, setSelected);
    }
  }}
/>



        <LichSuKham list={lichSu} />
      </div>

      {openChiDinh && (
        <ModalChiDinhDVKT
          open={openChiDinh}
          idLanKham={selected?.id}
          onClose={(needRefresh) => {
            setOpenChiDinh(false);
            if (needRefresh) {
              fetchChoKhamList(idBacSi, idPhong, setListChoKham);
              fetchHomNayList(idBacSi, idPhong, setListHomNay);
            }
          }}
        />
      )}

      {openKeDon && (
        <ModalKeDonThuoc
          isOpen={openKeDon}
          onClose={() => setOpenKeDon(false)}
          idLanKham={selected?.id}
          idBenhNhan={selected?.idBenhNhan}
          idBacSi={idBacSi}
          onSaved={() => {
            setOpenKeDon(false);
            fetchChoKhamList(idBacSi, idPhong, setListChoKham);
            fetchHomNayList(idBacSi, idPhong, setListHomNay);
            if (selected?.id) fetchDonTheoLanKham(selected.id, setDonThuoc);
          }}
        />
      )}

      <ModalXacNhanHuy />
    </MainLayout>
  );
}

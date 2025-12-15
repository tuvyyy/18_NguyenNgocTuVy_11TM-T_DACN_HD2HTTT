import React, { useEffect, useState } from "react";
import ModalDVKTFilter from "./ModalChiDinhDVKTFilter";
import ModalDVKTList from "./ModalChiDinhDVKTList";
import ModalDVKTSelected from "./ModalChiDinhDVKTSelected";
import ModalDVKTTotals from "./ModalChiDinhDVKTTotals";
import BacSiApi, { ensureOk } from "../../../../api/BacSiApi";

export default function ModalChiDinhDVKT({ open, onClose, idLanKham }) {
  const [loading, setLoading] = useState(false);
  const [dsDVKT, setDsDVKT] = useState([]);
  const [selected, setSelected] = useState([]);
  const [filterLoai, setFilterLoai] = useState("all");
  const [search, setSearch] = useState("");
  const [animate, setAnimate] = useState(false);
  const [token, setToken] = useState(null);


  // ==========================================================
  // LOAD DANH SÁCH DVKT
  // ==========================================================
  async function loadDVKT() {
    setLoading(true);
    try {
      const res = await BacSiApi.getAllDVKT();
      if (res.ok) setDsDVKT(res.data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  // ==========================================================
  // RESET MODAL KHI OPEN
  // ==========================================================
  useEffect(() => {
  const rawUser = localStorage.getItem("userInfo");
  const tk = localStorage.getItem("access_token");

  if (!rawUser || !tk) {
    alert("Thiếu thông tin đăng nhập!");
    return;
  }

  console.log("TOKEN LOAD:", tk);
  console.log("USER LOAD:", JSON.parse(rawUser));

  setToken(tk);
}, []);

  useEffect(() => {
    if (open) {
      console.log("[ModalChiDinhDVKT] OPEN → idLanKham =", idLanKham);

      loadDVKT();
      setSelected([]);
      setFilterLoai("all");
      setSearch("");
      setAnimate(false);

      setTimeout(() => setAnimate(true), 30);
    }
  }, [open]);

  // ==========================================================
  // CHỌN / BỎ CHỌN DV
  // ==========================================================
  function toggleSelect(item) {
    const exists = selected.find((x) => x.id === item.id);

    if (exists) {
      setSelected(selected.filter((x) => x.id !== item.id));
    } else {
      setSelected([...selected, { ...item, soLuong: 1 }]);
    }
  }

  // ==========================================================
  // UPDATE SỐ LƯỢNG
  // ==========================================================
  function updateSoLuong(id, sl) {
    setSelected(
      selected.map((x) =>
        x.id === id ? { ...x, soLuong: sl >= 1 ? sl : 1 } : x
      )
    );
  }

  // ==========================================================
  // SUBMIT — GỬI CHỈ ĐỊNH DVKT
  // ==========================================================
async function handleSubmit() {
  if (selected.length === 0) {
    alert("Chưa chọn DVKT nào");
    return;
  }

  console.log("[ModalChiDinhDVKT] handleSubmit() - selected =", selected);

  setLoading(true);

  try {
    for (let dv of selected) {

      const dto = {
        idLanKham,
        idDVKT: dv.id,
        soLuong: dv.soLuong,
        ghiChu: "",
      };

      console.log("[ModalChiDinhDVKT] Gửi DTO →", dto);

      const res = await BacSiApi.chiDinhDVKTRaw(dto, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("[ModalChiDinhDVKT] Kết quả API →", res);

      // --- FE CHECK RESPONSE ---
      if (!res || res.status >= 400) {
        const msg = res?.data || "Không thể chỉ định DVKT.";
        alert(msg);
        return; // ❌ Dừng — không gửi tiếp
      }
    }

    // --- CHỈ NHẢY VÀO ĐÂY KHI TẤT CẢ THÀNH CÔNG ---
    alert("Chỉ định DVKT thành công!");
    onClose(true);

  } catch (err) {
    console.error("[ModalChiDinhDVKT] LỖI handleSubmit()", err);

    const msg =
      err?.response?.data ||
      err?.message ||
      "Có lỗi khi gửi chỉ định DVKT";

    alert(msg);
  }

  setLoading(false);
}

  // ==========================================================
  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 bg-black/40 flex items-center justify-center z-50 transition-opacity duration-300 ${
        animate ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`bg-white w-[90vw] h-[90vh] rounded-xl shadow-2xl border transition-all duration-300 transform ${
          animate ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div className="p-3 border-b text-lg font-semibold">
          Chỉ định dịch vụ kỹ thuật
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* DANH SÁCH DV */}
          <div className="w-1/2 border-r flex flex-col">
            <ModalDVKTFilter
              filterLoai={filterLoai}
              setFilterLoai={setFilterLoai}
              search={search}
              setSearch={setSearch}
            />

            <ModalDVKTList
              ds={dsDVKT}
              filterLoai={filterLoai}
              search={search}
              selected={selected}
              toggleSelect={toggleSelect}
            />
          </div>

          {/* DV ĐÃ CHỌN */}
          <div className="w-1/2 flex flex-col">
            <ModalDVKTTotals selected={selected} />

            <ModalDVKTSelected
              selected={selected}
              updateSoLuong={updateSoLuong}
              toggleSelect={toggleSelect}
            />
          </div>
        </div>

        {/* BUTTON */}
        <div className="p-3 border-t flex justify-end gap-3">
          <button
            onClick={() => onClose(false)}
            className="px-4 py-2 bg-gray-200 rounded-md"
          >
            Hủy
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Đồng ý
          </button>
        </div>
      </div>
    </div>
  );
}

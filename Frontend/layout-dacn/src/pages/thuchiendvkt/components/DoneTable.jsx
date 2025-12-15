import React, { useState, useMemo, useEffect } from "react";
import Swal from "sweetalert2";
import { ThucHienDVKTController } from "../../../controllers/ThucHienDVKTController";

const calcAge = (date) => {
  if (!date) return "";
  const dob = new Date(date);
  return new Date().getFullYear() - dob.getFullYear();
};

export default function DoneTable({ data, refresh }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // ===================================================
  // DEBUG: xem data trả về từ BE
  // ===================================================
  useEffect(() => {
    console.log("🔍 [DoneTable] DATA NHẬN TỪ BE:", data);
  }, [data]);

  // ===================================================
  // 🔍 SEARCH
  // ===================================================
  const filtered = useMemo(() => {
    if (!data) return [];
    const s = search.toLowerCase();
    return data.filter((item) =>
      (item.tenDvkt || "").toLowerCase().includes(s) ||
      (item.ketQuaText || "").toLowerCase().includes(s) ||
      (item.benhNhan || "").toLowerCase().includes(s) ||
      (item.maBenhNhan || "").toLowerCase().includes(s)
    );
  }, [data, search]);

  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize) || 1;
  const slice = filtered.slice((page - 1) * pageSize, page * pageSize);

  // ===================================================
  // 📌 ACTIONS + DEBUG
  // ===================================================

  const handleKy = async (id) => {
    console.log("👉 BẤM DUYỆT ID =", id);

    const ok = await Swal.fire({
      title: "Duyệt kết quả?",
      icon: "question",
      showCancelButton: true,
    });

    if (!ok.isConfirmed) {
      console.log("❌ HỦY DUYỆT (user cancel)");
      return;
    }

    console.log("🔵 GỌI API handleDuyet...");
    await ThucHienDVKTController.handleDuyet(id, () => {
      console.log("🟢 REFRESH SAU KHI DUYỆT");
      refresh();
    });
  };

  const handleHuyKy = async (id) => {
    console.log("👉 BẤM HỦY DUYỆT ID =", id);

    const ok = await Swal.fire({
      title: "Hủy duyệt?",
      icon: "warning",
      showCancelButton: true,
    });

    if (!ok.isConfirmed) {
      console.log("❌ HỦY HỦY DUYỆT (user cancel)");
      return;
    }

    console.log("🔵 GỌI API handleHuyDuyet...");
    await ThucHienDVKTController.handleHuyDuyet(id, () => {
      console.log("🟢 REFRESH SAU HỦY DUYỆT");
      refresh();
    });
  };

  const handleGui = async (id) => {
    console.log("👉 BẤM GỬI ID =", id);

    const ok = await Swal.fire({
      title: "Gửi?",
      icon: "info",
      showCancelButton: true,
    });

    if (!ok.isConfirmed) return;

    console.log("🔵 GỌI API handleGui...");
await ThucHienDVKTController.handleGui(id, () => {
  // CẬP NHẬT lại trạng thái item ngay trong FE
  const newData = data.map(x =>
    x.id === id ? { ...x, trangThaiKQ: "completed", trangThai: "sent" } : x
  );

  window.dispatchEvent(new CustomEvent("updateDoneTable", { detail: newData }));
});
  };

  const handleEdit = (item) => {
    console.log("👉 BẤM SỬA:", item);

    const state = item.trangThai;
    if (state === "approved" || state === "sent") {
      Swal.fire("Không thể sửa", "Bạn phải hủy duyệt trước", "warning");
      return;
    }

    window.dispatchEvent(
      new CustomEvent("openTraKetQua", {
        detail: item,
      })
    );
  };

  // ===================================================
  // 📌 RENDER TABLE
  // ===================================================

  return (
    <div className="bg-white rounded-xl shadow p-4 h-full">

      {/* SEARCH */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Tìm theo tên DVKT / BN / kết quả..."
        className="w-full mb-3 px-3 py-2 border rounded"
      />

      <div className="overflow-auto border rounded">
        <table className="min-w-max text-sm">
          <thead className="bg-green-50 text-green-700 sticky top-0">
            <tr>
              <th className="px-3 py-2 border">Mã BN</th>
              <th className="px-3 py-2 border">Bệnh nhân</th>
              <th className="px-3 py-2 border">Tuổi</th>
              <th className="px-3 py-2 border">Mã DVKT</th>
              <th className="px-3 py-2 border">Tên DVKT</th>
              <th className="px-3 py-2 border">Hoàn thành lúc</th>
              <th className="px-3 py-2 border">Hành động</th>
            </tr>
          </thead>

<tbody>
  {slice.map((raw) => {

    const item = {
      ...raw,
      tenDvkt: raw.tenDvkt || raw.TenDvkt,
      maDvkt: raw.maDvkt || raw.MaDvkt,
      benhNhan: raw.benhNhan || raw.BenhNhan,
      maBenhNhan: raw.maBenhNhan || raw.MaBenhNhan,
      ngaySinh: raw.ngaySinh || raw.NgaySinh,
      hoanThanhLuc: raw.hoanThanhLuc || raw.HoanThanhLuc,
      trangThaiKQ: raw.trangThaiKQ || raw.TrangThaiKQ,
    };

    const state = item.trangThaiKQ;
    console.log("🟡 RENDER ROW:", item.id, "KQ:", state, "DVKT:", item.trangThai);

    return (
   <tr key={item.id} className="border-t hover:bg-green-50">

  {/* ⭐ MÃ BN */}
  <td className="px-3 py-2 border">{item.maBenhNhan || "—"}</td>

  {/* ⭐ TÊN BN */}
  <td className="px-3 py-2 border">{item.benhNhan}</td>

  {/* ⭐ TUỔI */}
  <td className="px-3 py-2 border">{calcAge(item.ngaySinh)}</td>

  {/* Mã DVKT */}
  <td className="px-3 py-2 border">{item.maDvkt}</td>

  {/* Tên DVKT */}
  <td className="px-3 py-2 border">{item.tenDvkt}</td>

  {/* Hoàn thành lúc */}
  <td className="px-3 py-2 border">
    {item.hoanThanhLuc
      ? new Date(item.hoanThanhLuc).toLocaleString()
      : "—"}
  </td>

  {/* Hành động */}
  <td className="px-3 py-2 border">
    <div className="flex gap-2 justify-center">

      {state === "approved" ? (
        <button
          onClick={() => handleHuyKy(item.id)}
          className="px-3 py-1 bg-red-500 text-white rounded"
        >Hủy duyệt</button>
      ) : (
        <button
          onClick={() => handleKy(item.id)}
          className="px-3 py-1 bg-green-600 text-white rounded"
        >Duyệt</button>
      )}

      <button
        onClick={() => handleEdit(item)}
        disabled={state === "approved" || state === "sent"}
        className="px-3 py-1 bg-yellow-500 text-white rounded disabled:opacity-50"
      >
        Sửa
      </button>
<button
      onClick={() => handleGui(item.id)}
      disabled={state !== "approved"}
      className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
    >
      Gửi
    </button>
{/* ⭐ XEM PDF — chỉ hiển thị khi đã gửi */}
{item.trangThaiKQ === "completed" && item.fileUrl && (
  <button
    onClick={() =>
      window.open(`https://localhost:7007${item.fileUrl}`, "_blank")
    }
    className="px-3 py-1 bg-purple-600 text-white rounded"
  >
    Xem PDF
  </button>
)}


    </div>
  </td>

</tr>

              );
            })}
          </tbody>

        </table>
      </div>

    </div>
  );
}

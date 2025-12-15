// src/pages/bacsi/components/ResultForm.jsx
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import ModalEditThuoc from "../modals/ModalEditThuoc";
import ModalKeDonThuoc from "../modals/ModalKeDonThuoc";

import {
  handleUpdateKetQua,
  handleCancelLanKham,
  fetchDonTheoLanKham,
  fetchDVKTTheoLanKham,
  handleUpdateDVKT,
  handleCancelDVKT,
  handleReopenHoSo,
  fetchLanKhamDetail,
} from "../../../controllers/BacSiController";

import { deleteThuocInDon, apiDownloadDonThuocPDF } from "../../../api/DonThuocApi";

export default function ResultForm({
  selected,
  refresh,
  donThuoc,
  onOpenKeDon,
  onOpenChiDinh,
}) {
  const [activeTab, setActiveTab] = useState("kham");
  const [lastTab, setLastTab] = useState("kham");

  const [form, setForm] = useState({
    chan_doan_so_bo: "",
    chan_doan_cuoi: "",
    ket_qua: "",
    huong_xu_tri: "",
    ghi_chu: "",
  });

  const [editingThuoc, setEditingThuoc] = useState(null);
  const [openKeDon, setOpenKeDon] = useState(false);
  const [keDonData, setKeDonData] = useState(null);
  const [localDonThuoc, setLocalDonThuoc] = useState(null);
  const [dsDVKT, setDsDVKT] = useState([]);

  const readonly =
    selected?.trangThai === "DA_KHAM" ||
    selected?.trangThai === "CHO_THANH_TOAN" ||
    selected?.trangThai === "DA_THANH_TOAN" ||
    selected?.trangThai === "DA_HUY";

  // ====================== XOÁ THUỐC TRONG ĐƠN ======================
  const onDeleteThuoc = async (t) => {
    if (readonly) {
      return toast.error("Hồ sơ đã khóa, không thể xóa thuốc!");
    }
    const confirmRes = await Swal.fire({
      title: "Xác nhận xoá thuốc?",
      text: `Thuốc: ${t.tenThuoc}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
      reverseButtons: true,
    });

    if (!confirmRes.isConfirmed) return;

    // ⚡ hiệu ứng fade trước khi gọi API
    setLocalDonThuoc((prev) => ({
      ...prev,
      chiTiet: prev.chiTiet.map((x) =>
        x.id === t.id ? { ...x, _removing: true } : x
      ),
    }));

    setTimeout(async () => {
      const res = await deleteThuocInDon(t.id);

      if (res?.status === 200) {
        toast.success("Đã xoá thuốc!");

        setLocalDonThuoc((prev) => ({
          ...prev,
          chiTiet: prev.chiTiet.filter((x) => x.id !== t.id),
        }));
      } else {
        toast.error("Xóa thuốc thất bại!");
      }
    }, 350);
  };

  const onEditThuoc = (t) => {
    if (readonly) {
      return toast.error("Hồ sơ đã khóa, không thể sửa thuốc!");
    }
    setEditingThuoc(t);
  };

  const onPrintDon = async (idDon) => {
    try {
      if (!idDon) {
        toast.error("Không tìm thấy đơn thuốc để in!");
        return;
      }

      const res = await apiDownloadDonThuocPDF(idDon);

      // Tạo file từ blob
      const file = new Blob([res.data], { type: "application/pdf" });

      const fileURL = URL.createObjectURL(file);

      // Mở tab mới xem PDF
      window.open(fileURL);

      // Hoặc auto download:
      // const a = document.createElement("a");
      // a.href = fileURL;
      // a.download = `DonThuoc_${idDon}.pdf`;
      // a.click();
    } catch (err) {
      toast.error("Không thể xuất PDF!");
    }
  };

  // ====================== SỬA DVKT ======================
  const onEditDVKT = async (dv) => {
    if (readonly) {
      return toast.error("Hồ sơ đã khóa, không thể sửa DVKT!");
    }
    if (dv.trangThai !== "pending") {
      return toast.warning("Chỉ sửa được chỉ định đang chờ (pending)!");
    }

    const result = await Swal.fire({
      icon: "info",
      title: "Sửa chỉ định",
      text: `Sửa số lượng cho dịch vụ: ${dv.tenDvkt}?`,
      showCancelButton: true,
      confirmButtonText: "Sửa",
      cancelButtonText: "Không",
    });

    if (!result.isConfirmed) return;

    const soLuong = await Swal.fire({
      title: "Nhập số lượng mới",
      input: "number",
      inputValue: dv.soLuong,
      inputAttributes: { min: 1 },
      showCancelButton: true,
      confirmButtonText: "OK",
    });

    if (!soLuong.value || soLuong.value <= 0)
      return toast.error("Số lượng không hợp lệ!");

    const ghiChu = await Swal.fire({
      title: "Ghi chú (tuỳ chọn)",
      input: "text",
      inputValue: dv.ghiChu || "",
      showCancelButton: true,
      confirmButtonText: "OK",
    });

    await handleUpdateDVKT(
      dv.id,
      { soLuong: Number(soLuong.value), ghiChu: ghiChu.value },
      refresh
    );
  };

  // ====================== HỦY DVKT ======================
  const onDeleteDVKT = async (dv) => {
    if (readonly) {
      return toast.error("Hồ sơ đã khóa, không thể hủy DVKT!");
    }
    switch (dv.trangThai) {
      case "pending":
        break;

      case "processing":
        return Swal.fire({
          icon: "warning",
          title: "Không thể hủy",
          text: "Dịch vụ đang được thực hiện!",
        });

      case "done":
        return Swal.fire({
          icon: "warning",
          title: "Không thể hủy",
          text: "Dịch vụ đã hoàn thành!",
        });

      case "canceled":
        return Swal.fire({
          icon: "info",
          title: "Đã hủy trước đó",
          text: "Chỉ định này đã được hủy.",
        });

      case "paid":
        return Swal.fire({
          icon: "error",
          title: "Không thể hủy",
          text: "Dịch vụ đã được thanh toán!",
        });

      default:
        return Swal.fire({
          icon: "error",
          title: "Không thể hủy",
          text: "Trạng thái không hợp lệ!",
        });
    }

    const confirmRes = await Swal.fire({
      icon: "warning",
      title: "Xác nhận hủy",
      text: `Hủy chỉ định ${dv.tenDvkt}?`,
      showCancelButton: true,
      confirmButtonText: "Hủy",
      cancelButtonText: "Không",
    });

    if (!confirmRes.isConfirmed) return;

    await handleCancelDVKT(dv.id, refresh);
  };

  // =============== LOAD DETAIL ===============
  useEffect(() => {
    console.log("➡️ SELECTED:", selected);

    if (!selected?.id) {
      setLocalDonThuoc(null);
      setDsDVKT([]);
      return;
    }

    fetchDonTheoLanKham(selected.id, setLocalDonThuoc);
    fetchDVKTTheoLanKham(selected.id, setDsDVKT);
  }, [selected]);

  // ====================== AUTO LẤY ĐẦY ĐỦ CHI TIẾT ======================
  // 🎯 Reload đơn thuốc mỗi khi modal kê đơn đóng và có dữ liệu mới
  useEffect(() => {
    if (!openKeDon && selected?.id) {
      fetchDonTheoLanKham(selected.id, setLocalDonThuoc);
    }
  }, [openKeDon, selected]);

  useEffect(() => {
    if (!selected) {
      setForm({
        chan_doan_so_bo: "",
        chan_doan_cuoi: "",
        ket_qua: "",
        huong_xu_tri: "",
        ghi_chu: "",
      });
      return;
    }

    setForm({
      chan_doan_so_bo: selected.chanDoanSoBo || "",
      chan_doan_cuoi: selected.chanDoanCuoi || "",
      ket_qua: selected.ketQuaKham || "",
      huong_xu_tri: selected.huongXuTri || "",
      ghi_chu: selected.ghiChu || "",
    });
  }, [selected]);

  const getSlide = () => {
    const order = ["kham", "dvkt", "don", "save"];
    return order.indexOf(activeTab) > order.indexOf(lastTab)
      ? "slide-left"
      : "slide-right";
  };

  const changeTab = (id) => {
    setLastTab(activeTab);
    setActiveTab(id);
  };

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSave = async () => {
    if (!selected?.id) return;

    if (readonly) {
      toast.error("Hồ sơ đã khóa, không thể lưu!");
      return;
    }

    await handleUpdateKetQua(selected.id, form, refresh);
  };

  const onCancel = async () => {
    if (!selected?.id) return;
    const reason = prompt("Nhập lý do hủy:");
    if (!reason) return;
    await handleCancelLanKham(selected.id, reason, refresh);
  };

  const statusColor = {
    pending: "bg-red-500",
    processing: "bg-yellow-400",
    done: "bg-green-500",
    canceled: "bg-gray-400",
  };

  const rowBg = {
    pending: "",
    processing: "bg-yellow-50",
    done: "bg-green-50",
    canceled: "bg-gray-100 text-gray-500",
  };

  return (
    <>
      <div className="flex-1 bg-white rounded-xl border shadow-md flex flex-col overflow-hidden">
        {/* ===================== THÔNG TIN BỆNH NHÂN ===================== */}
        {selected && (
          <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-blue-100 text-sm text-gray-700 fade-in">
            {/* HÀNG 1 – THÔNG TIN BỆNH NHÂN */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
              <div>
                <div className="font-semibold">Họ tên</div>
                <div>{selected.hoTen || "---"}</div>
              </div>

              <div>
                <div className="font-semibold">Ngày sinh</div>
                <div>{selected.ngaySinh || "---"}</div>
              </div>

              <div>
                <div className="font-semibold">Điện thoại</div>
                <div>{selected.soDienThoai || "---"}</div>
              </div>

              <div>
                <div className="font-semibold">Địa chỉ</div>
                <div className="truncate">{selected.diaChi || "---"}</div>
              </div>
            </div>

            {/* HÀNG 2 – SINH HIỆU */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {selected.sinhHieu ? (
                <>
                  <div>
                    <div className="font-semibold">Mạch</div>
                    <div>{selected.sinhHieu.mach || "---"}</div>
                  </div>

                  <div>
                    <div className="font-semibold">Huyết áp</div>
                    <div>{selected.sinhHieu.huyetAp || "---"}</div>
                  </div>

                  <div>
                    <div className="font-semibold">Chiều cao</div>
                    <div>{selected.sinhHieu.chieuCao || "---"}</div>
                  </div>

                  <div>
                    <div className="font-semibold">Cân nặng</div>
                    <div>{selected.sinhHieu.canNang || "---"}</div>
                  </div>
                </>
              ) : (
                <div className="col-span-4 text-xs text-gray-500 italic">
                  Chưa có sinh hiệu cho lượt khám này
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===================== TAB BAR ===================== */}
        <div className="px-4 py-2 bg-gray-100 border-b flex items-center gap-2 text-sm font-semibold">
          <FancyTab
            id="kham"
            label="KHÁM BỆNH"
            activeTab={activeTab}
            changeTab={changeTab}
          />
          <FancyTab
            id="dvkt"
            label="CHỈ ĐỊNH CLS"
            activeTab={activeTab}
            changeTab={changeTab}
          />
          <FancyTab
            id="don"
            label="KÊ ĐƠN THUỐC"
            activeTab={activeTab}
            changeTab={changeTab}
          />

          <div className="flex-1 flex justify-end">
            <FancyTab
              id="save"
              icon="💾"
              label="Lưu kết quả"
              activeTab={activeTab}
              changeTab={changeTab}
            />
          </div>
        </div>

        {/* ===================== CONTENT ===================== */}
        <div className={`flex-1 overflow-y-auto p-5 text-sm ${getSlide()}`}>
          {!selected ? (
            <div className="text-center text-gray-400 italic mt-20 fade-in">
              Chọn bệnh nhân để bắt đầu khám...
            </div>
          ) : (
            <>
              {/* TAB KHÁM */}
              {activeTab === "kham" && (
                <div className="space-y-4 fade-in">
                  <Input
                    label="Chẩn đoán sơ bộ"
                    name="chan_doan_so_bo"
                    value={form.chan_doan_so_bo}
                    onChange={onChange}
                    disabled={readonly}
                  />
                  <Input
                    label="Kết quả khám"
                    name="ket_qua"
                    value={form.ket_qua}
                    onChange={onChange}
                    disabled={readonly}
                  />
                  <Input
                    label="Chẩn đoán cuối"
                    name="chan_doan_cuoi"
                    value={form.chan_doan_cuoi}
                    onChange={onChange}
                    disabled={readonly}
                  />
                  <Input
                    label="Hướng xử trí"
                    name="huong_xu_tri"
                    value={form.huong_xu_tri}
                    onChange={onChange}
                    disabled={readonly}
                  />
                  <Input
                    label="Ghi chú"
                    name="ghi_chu"
                    value={form.ghi_chu}
                    onChange={onChange}
                    disabled={readonly}
                  />
                </div>
              )}

              {/* TAB DVKT */}
              {activeTab === "dvkt" && (
                <div className="space-y-3 fade-in">
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        if (readonly) {
                          toast.error(
                            "Hồ sơ đã khóa, không thể thêm chỉ định!"
                          );
                          return;
                        }
                        onOpenChiDinh();
                      }}
                      disabled={readonly}
                      className={`px-3 py-1 rounded text-white shadow ${
                        readonly
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      THÊM CHỈ ĐỊNH
                    </button>
                  </div>

                  <DVKTTable
                    dsDVKT={dsDVKT}
                    onEdit={onEditDVKT}
                    onDelete={onDeleteDVKT}
                    statusColor={statusColor}
                    rowBg={rowBg}
                      readonly={readonly}

                  />
                </div>
              )}

              {/* TAB ĐƠN THUỐC */}
              {activeTab === "don" && (
                <div className="space-y-3 fade-in">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        if (readonly) {
                          toast.error("Hồ sơ đã khóa, không thể kê đơn!");
                          return;
                        }
                        setKeDonData({
                          idLanKham: selected.id,
                          idBenhNhan: selected.idBenhNhan,
                          idBacSi: selected.bacSi?.id,
                        });
                        setOpenKeDon(true);
                      }}
                      disabled={readonly}
                      className={`px-3 py-1 rounded text-white shadow ${
                        readonly
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-yellow-500 hover:bg-yellow-600"
                      }`}
                    >
                      💊 + Kê đơn
                    </button>

                    <button
                      onClick={() => onPrintDon(donThuoc?.id || localDonThuoc?.id)}
                      className="px-3 py-1 rounded bg-purple-500 text-white hover:bg-purple-600 shadow"
                    >
                      🖨️ In đơn thuốc
                    </button>
                  </div>

                  <DonThuoc
                    donThuoc={localDonThuoc}
                    onEditThuoc={onEditThuoc}
                    onDeleteThuoc={onDeleteThuoc}
                    onPrintDon={onPrintDon}
                  />
                </div>
              )}

              {/* TAB LƯU */}
              {activeTab === "save" && (
                <div className="flex justify-end fade-in">
                  <div className="w-64 bg-gray-100 p-4 rounded-lg shadow-md space-y-3">
                    {/* LƯU KẾT QUẢ */}
                    <button
                      onClick={onSave}
                      disabled={readonly}
                      className={`w-full px-4 py-2 rounded text-white 
                        ${
                          readonly
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                      💾 Lưu kết quả
                    </button>

                    {/* HỦY KHÁM */}
                    <button
                      onClick={onCancel}
                      disabled={readonly}
                      className={`w-full px-4 py-2 rounded ${
                        readonly
                          ? "bg-gray-300 cursor-not-allowed text-white"
                          : "bg-red-600 hover:bg-red-700 text-white"
                      }`}
                    >
                      ❌ Hủy khám
                    </button>

                    {/* MỞ HỒ SƠ */}
<button
  onClick={async () => {
    if (!selected?.id) return;

    await handleReopenHoSo(selected.id);

    toast.success("Đã mở hồ sơ!");

    // ⭐⭐⭐ GỌI REFRESH DANH SÁCH TỪ PARENT ⭐⭐⭐
    if (typeof refresh === "function") {
      await refresh();  // ← cái này đã có
    }

    // ⭐⭐⭐ THÊM DÒNG NÀY !!! — ép Parent reload DANH SÁCH ⭐⭐⭐
    window.dispatchEvent(new Event("reload-patient-list"));
  }}
  disabled={!selected || selected.trangThai !== "DA_KHAM"}
  className="w-full px-4 py-2 rounded text-white bg-orange-500 hover:bg-orange-600"
>
  🔓 Mở hồ sơ
</button>


                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* MODAL KÊ ĐƠN THUỐC */}
      {keDonData && openKeDon && (
        <ModalKeDonThuoc
          isOpen={openKeDon}
          onClose={() => {
            setOpenKeDon(false);
            setKeDonData(null);
          }}
          idLanKham={keDonData.idLanKham}
          idBenhNhan={keDonData.idBenhNhan}
          idBacSi={keDonData.idBacSi}
          onSaved={async () => {
            if (selected?.id) {
              await fetchDonTheoLanKham(selected.id, setLocalDonThuoc);
            }
          }}
        />
      )}

      {/* MODAL SỬA THUỐC */}
      {editingThuoc && selected?.id && (
        <ModalEditThuoc
          open={true}
          thuoc={editingThuoc}
          onClose={() => setEditingThuoc(null)}
          onSaved={async () => {
            await fetchDonTheoLanKham(selected.id, setLocalDonThuoc);
            setEditingThuoc(null);
          }}
        />
      )}
    </>
  );
}

/* ================================================================== */
/* ---------------------- COMPONENTS -------------------------------- */
/* ================================================================== */

function FancyTab({ id, label, icon, activeTab, changeTab }) {
  const active =
    activeTab === id;

  return (
    <button
      onClick={() => changeTab(id)}
      className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all 
        ${active ? "tab-active" : "hover:bg-gray-200 text-gray-600"}`}
    >
      <span className={active ? "tab-active-icon" : ""}>{icon}</span>
      {label}
    </button>
  );
}

function Input({ label, name, value, onChange, disabled }) {
  return (
    <div className="floating-group">
      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder=" "
        disabled={disabled}
        className={`floating-input ${
          disabled ? "bg-gray-100 cursor-not-allowed" : ""
        }`}
      />
      <label className="floating-label">{label}</label>
    </div>
  );
}

function DonThuoc({ donThuoc, onEditThuoc, onDeleteThuoc }) {
  if (!donThuoc)
    return (
      <div className="italic text-gray-500 text-center py-5">
        Chưa có đơn thuốc.
      </div>
    );

  const data = donThuoc;

  return (
    <div className="bg-white border rounded-xl shadow-md p-4 fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 text-sm text-gray-700 gap-2 mb-4">
        <div>
          <b>📅 Ngày kê:</b>{" "}
          {data.ngayKe
            ? new Date(data.ngayKe).toLocaleString("vi-VN")
            : "---"}
        </div>

        <div>
          <b>⏳ Số ngày uống:</b> {data.soNgayUong} ngày
        </div>
        <div>
          <b>📝 Ghi chú:</b> {data.ghiChu || "---"}
        </div>
      </div>

      <div className="overflow-x-auto border rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-blue-50 text-gray-700 border-b">
            <tr>
              <th className="p-3 text-left w-48">Tên thuốc</th>
              <th className="p-3 text-center w-16">SL</th>
              <th className="p-3 text-center w-16">Đơn vị</th>
              <th className="p-3 text-center w-12">Sáng</th>
              <th className="p-3 text-center w-12">Trưa</th>
              <th className="p-3 text-center w-12">Chiều</th>
              <th className="p-3 text-center w-12">Tối</th>
              <th className="p-3 text-center w-12">Khuya</th>
              <th className="p-3 text-center w-20">Ngày</th>
              <th className="p-3 text-left w-32">Ghi chú</th>
              <th className="p-3 text-center w-20">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {data.chiTiet?.map((t) => (
              <tr
                key={t.id}
                className={`border-b hover:bg-blue-50 transition-all ${
                  t._removing ? "fade-remove" : ""
                }`}
              >
                <td className="p-3 font-semibold text-gray-900">
                  {t.tenThuoc}
                  <div className="text-xs text-gray-500">
                    ID Thuốc: {t.idThuoc}
                  </div>
                </td>

                <td className="p-3 text-center">{t.soLuong}</td>
                <td className="p-3 text-center">{t.donVi}</td>

                <td className="p-3 text-center">{t.sang}</td>
                <td className="p-3 text-center">{t.trua}</td>
                <td className="p-3 text-center">{t.chieu}</td>
                <td className="p-3 text-center">{t.toi}</td>
                <td className="p-3 text-center">{t.khuya}</td>

                <td className="p-3 text-center">{t.soNgayUong}</td>

                <td className="p-3 italic text-gray-600">
                  {t.ghiChu || "---"}
                </td>

                <td className="p-3 text-center flex items-center justify-center gap-3">
                  <button
                    className="text-blue-500 hover:text-blue-700 mr-3"
                    onClick={() => onEditThuoc(t)}
                  >
                    ✏️
                  </button>

                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => onDeleteThuoc(t)}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DVKTTable({ dsDVKT, onEdit, onDelete, statusColor, rowBg }) {
  return (
    <div className="rounded-xl shadow-lg overflow-hidden border bg-white">
      <table className="w-full text-sm">
        <thead className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b">
          <tr className="text-gray-700">
            <th className="p-3 font-semibold text-left">Trạng thái</th>
            <th className="p-3 font-semibold text-left">Dịch vụ</th>
            <th className="p-3 font-semibold text-center">SL</th>
            <th className="p-3 font-semibold text-center">Thời gian</th>
            <th className="p-3 font-semibold text-left">Ghi chú</th>
            <th className="p-3 font-semibold text-center">Khác</th>
          </tr>
        </thead>

        <tbody>
          {dsDVKT.map((dv) => (
            <tr
              key={dv.id}
              className={`${rowBg[dv.trangThai]} hover:bg-blue-50 transition`}
            >
              <td className="p-3 border-b">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-3 h-3 rounded-full ${
                      statusColor[dv.trangThai]
                    }`}
                  />
                  {dv.trangThai}
                </div>
              </td>

              <td className="p-3 border-b">
                <div className="font-semibold text-gray-800">
                  {dv.tenDvkt}
                </div>
                <div className="text-xs text-gray-500">Mã: {dv.maDvkt}</div>
              </td>

              <td className="p-3 text-center border-b">{dv.soLuong}</td>

              <td className="p-3 text-center border-b text-xs">
                {dv.thoiGianChiDinh
                  ? new Date(dv.thoiGianChiDinh).toLocaleString("vi-VN")
                  : "--"}
              </td>

              <td className="p-3 border-b italic">{dv.ghiChu || ""}</td>

              <td className="p-3 text-center border-b">
                <button
                  className="text-orange-500 hover:text-orange-700 mr-3"
                  onClick={() => onEdit(dv)}
                >
                  ✏️
                </button>

                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => onDelete(dv)}
                >
                  🗑️
                </button>
                {/* ⭐ NÚT XEM KẾT QUẢ (DVKT đã gửi) ⭐ */}
{dv.trangThai === "sent" && (
  <button
    className="text-blue-600 hover:text-blue-800"
    onClick={() =>
      window.open(`https://localhost:7007/api/ktv/dvkt/pdf/${dv.id}`, "_blank")
    }
  >
    🔍 Xem KQ
  </button>
)}

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

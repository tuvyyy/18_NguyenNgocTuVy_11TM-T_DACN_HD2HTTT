  // src/pages/bacsi/modals/ModalKeDonThuoc.jsx
  import React, { useEffect, useMemo, useState } from "react";
  import { X, Search } from "lucide-react";
  import { toast } from "react-toastify";

  // ✅ Các API dùng cho modal (tùy file DonThuocApi.js của bạn)
  import {
  apiGetThuocList,
  apiGetDonTheoLanKham,
  apiCheckDonThuoc,
  apiCreateDonThuoc,
  apiUpdateDonThuoc,
} from "../../../api/DonThuocApi";


  // ======================
  // Helper
  // ======================
  const fmtVnd = (n) =>
    typeof n === "number"
      ? n.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
          maximumFractionDigits: 0,
        })
      : "";

  const toInt = (v, def = 0) => {
    const n = parseInt(v, 10);
    return Number.isNaN(n) ? def : n;
  };

  // ======================
  // Component chính
  // ======================
  export default function ModalKeDonThuoc({
    isOpen,
    onClose,
    idLanKham,
    idBenhNhan,
    idBacSi,
    donCu, // có/không đều được, modal sẽ tự load theo idLanKham nếu cần
    onSaved,
  }) {
    const [loadingThuoc, setLoadingThuoc] = useState(false);
    const [thuocList, setThuocList] = useState([]);

    const [search, setSearch] = useState("");

    // Map theo idThuoc => detail dòng đã chọn
    const [selectedMap, setSelectedMap] = useState({});
    const selectedList = useMemo(
      () => Object.values(selectedMap),
      [selectedMap]
    );

    const [donId, setDonId] = useState(null); // để biết là create hay update

    const [checking, setChecking] = useState(false);
    const [saving, setSaving] = useState(false);
    const [checkResult, setCheckResult] = useState(null); // {errors:[], warnings:[]}

    // ================================
    // Load danh sách thuốc
    // ================================
    useEffect(() => {
  if (!isOpen) return;

  async function loadThuoc() {
    try {
      setLoadingThuoc(true);

      // gọi API lấy danh sách thuốc
      const res = await apiGetThuocList({
        keyword: "",
        page: 1,
        pageSize: 500,
      });

      // tùy backend trả gì
      const list =
        res?.data?.items ||
        res?.data?.data ||
        res?.data ||
        [];

      setThuocList(list);
    } catch (err) {
      console.error(err);
      toast.error("Không tải được danh sách thuốc!");
    } finally {
      setLoadingThuoc(false);
    }
  }

  loadThuoc();
}, [isOpen]);


    // ================================
    // Load đơn cũ theo lần khám (nếu có)
    // ================================
    useEffect(() => {
      if (!isOpen || !idLanKham) return;

      async function loadDonCu() {
        try {
          const res = await apiGetDonTheoLanKham(idLanKham);
          const data = res?.data;
          if (!data || !data.chiTiet || data.chiTiet.length === 0) {
            setDonId(null);
            setSelectedMap({});
            return;
          }

          setDonId(data.id || null);

          const map = {};
          data.chiTiet.forEach((ct) => {
            const lanNgay =
              (ct.sang || 0) +
                (ct.trua || 0) +
                (ct.chieu || 0) +
                (ct.toi || 0) +
                (ct.khuya || 0) || 1;
            const soNgay = ct.soNgayUong || data.soNgayUong || 1;

            let slLan = 1;
            if (lanNgay > 0 && soNgay > 0 && ct.soLuong) {
              slLan = Math.max(
                1,
                Math.round(ct.soLuong / (lanNgay * soNgay))
              );
            }

            map[ct.idThuoc] = {
              idThuoc: ct.idThuoc,
              ma: ct.maThuoc || ct.idThuoc,
              ten: ct.tenThuoc,
              donVi: ct.donVi,
              donGia: ct.donGia || 0,
              soLuongTon: ct.soLuongTon || 0,

              soNgay: soNgay,
              lanNgay,
              slLan,

              cachDung: ct.ghiChu || "",
              thoiDiemDung: "",
              duongDung: "",
            };
          });

          setSelectedMap(map);
        } catch (err) {
          console.error(err);
          // Không có đơn cũ cũng không sao
          setDonId(null);
          setSelectedMap({});
        }
      }

      loadDonCu();
    }, [isOpen, idLanKham]);

    // Reset khi đóng modal
    useEffect(() => {
      if (!isOpen) {
        setSearch("");
        setSelectedMap({});
        setDonId(null);
        setCheckResult(null);
        setChecking(false);
        setSaving(false);
      }
    }, [isOpen]);

    // ================================
    // Filter trên danh sách thuốc
    // ================================
    const filteredThuoc = useMemo(() => {
  if (!search) return thuocList;
  const s = search.toLowerCase();

  return thuocList.filter(
    (t) =>
      `${t.ma || ""} ${t.ten || ""} ${t.tenThuoc || ""}`
        .toLowerCase()
        .includes(s)
  );
}, [thuocList, search]);


    // ================================
    // Handle chọn thuốc
    // ================================
    const toggleThuoc = (row) => {
      const id = row.id || row.idThuoc || row.id_thuoc;
      if (!id) return;

      setSelectedMap((old) => {
        const clone = { ...old };
        if (clone[id]) {
          delete clone[id];
        } else {
          clone[id] = {
            idThuoc: id,
            ma: row.ma || row.code || "",
            ten: row.tenDayDu || row.ten || row.tenThuoc || "",
            donVi:
              row.donVi ||
              row.donViTinh ||
              row.dvt ||
              row.don_vi ||
              "Viên",
            donGia:
              row.donGia || row.giaBan || row.price || row.don_gia || 0,
            soLuongTon: row.soLuongTon || row.stock || row.so_luong_ton || 0,

            soNgay: 3,
            lanNgay: 2,
            slLan: 1,

            cachDung: "",
            thoiDiemDung: "",
            duongDung: "",
          };
        }
        return clone;
      });
    };

    const updateItemField = (idThuoc, field, value) => {
      setSelectedMap((old) => {
        const it = old[idThuoc];
        if (!it) return old;
        const clone = { ...old };
        clone[idThuoc] = {
          ...it,
          [field]:
            field === "soNgay" || field === "lanNgay" || field === "slLan"
              ? toInt(value, 0)
              : value,
        };
        return clone;
      });
    };

    const calcSoLuong = (it) => {
      const soNgay = it.soNgay || 0;
      const lanNgay = it.lanNgay || 0;
      const slLan = it.slLan || 0;
      return soNgay * lanNgay * slLan;
    };

    // ================================
    // Build payload cho API
    // ================================
const buildPayload = () => {
  const chiTiet = selectedList.map((it) => ({
    idThuoc: it.idThuoc,
    soLuong: calcSoLuong(it),
    donVi: it.donVi,
    dungTich: null,
    sang: it.lanNgay,
    trua: 0,
    chieu: 0,
    toi: 0,
    khuya: 0,
    soNgayUong: it.soNgay,
    ghiChu: it.cachDung,
  }));

  const soNgayUong =
    selectedList.reduce(
      (max, it) => Math.max(max, it.soNgay || 0),
      0
    ) || 0;

  return {
    idLanKham: idLanKham,
    idBenhNhan: idBenhNhan,   // ⭐ THÊM
    idBacSi: idBacSi,         // ⭐ THÊM
    soNgayUong,
    ghiChu: "",
    chiTiet,
  };
};


    // ================================
    // Validate client
    // ================================
    const validateLocal = () => {
      if (!selectedList.length) {
        toast.error("Chưa chọn thuốc nào!");
        return false;
      }

      for (const it of selectedList) {
        if (!it.soNgay || it.soNgay <= 0) {
          toast.error(`Thuốc ${it.ten}: Số ngày phải > 0`);
          return false;
        }
        if (!it.lanNgay || it.lanNgay <= 0) {
          toast.error(`Thuốc ${it.ten}: Lần/ngày phải > 0`);
          return false;
        }
        if (!it.slLan || it.slLan <= 0) {
          toast.error(`Thuốc ${it.ten}: SL/lần phải > 0`);
          return false;
        }
        const qty = calcSoLuong(it);
        if (it.soLuongTon && qty > it.soLuongTon) {
          toast.warning(
            `Thuốc ${it.ten}: kê ${qty} > tồn kho ${it.soLuongTon}`
          );
        }
      }

      return true;
    };

    // ================================
    // Submit (check + save)
    // ================================
    const handleSubmit = async () => {
      if (!validateLocal()) return;

      const payload = buildPayload();

      try {
        setChecking(true);
        const resCheck = await apiCheckDonThuoc(payload);
        const cr = resCheck?.data || { errors: [], warnings: [], isSafe: true };
        setCheckResult(cr);

        if (!cr.isSafe) {
          toast.error("Đơn thuốc chưa an toàn, xem lỗi bên dưới!");
          setChecking(false);
          return;
        }

        setChecking(false);
        setSaving(true);

        if (donId) {
          await apiUpdateDonThuoc(donId, payload);
        } else {
          const res = await apiCreateDonThuoc(payload);
          const newId = res?.data?.id;
          if (newId) setDonId(newId);
        }

       toast.success("Lưu đơn thuốc thành công!");
onSaved?.();       // reload đơn thuốc ở ResultForm
onClose?.();       // đóng modal → UI re-render

      } catch (err) {
        console.error(err);
        toast.error("Không thể lưu đơn thuốc!");
      } finally {
        setChecking(false);
        setSaving(false);
      }
    };

    // ================================
    // Render
    // ================================
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="w-[96vw] max-w-6xl h-[80vh] bg-white rounded-2xl shadow-xl flex flex-col">
          {/* HEADER */}
          <div className="flex items-center justify-between px-4 py-2 border-b">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-sky-700 uppercase">
                Chỉ định thuốc
              </span>
              {idBenhNhan && (
                <span className="text-xs text-gray-500">
                  Bệnh nhân ID:{" "}
                  <span className="font-semibold">{idBenhNhan}</span>
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* FILTER BAR */}
          <div className="flex items-center gap-3 px-4 py-2 border-b bg-slate-50">
            <select className="h-9 text-xs border border-gray-300 rounded-md px-2 bg-white">
              <option>Thuốc nhà thuốc</option>
              <option>Thuốc BHYT</option>
            </select>

            <select className="h-9 text-xs border border-gray-300 rounded-md px-2 bg-white">
              <option>Phân nhóm thuốc</option>
            </select>

            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-2 top-1/2 -translate-y-1/2" />
              <input
                className="w-full h-9 pl-7 pr-2 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-400 outline-none"
                placeholder="Nhập mã hoặc tên thuốc..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="text-xs text-emerald-700 font-semibold">
              Tổng tiền ước tính:{" "}
              {fmtVnd(
                selectedList.reduce(
                  (s, it) =>
                    s + (calcSoLuong(it) || 0) * (it.donGia || 0),
                  0
                )
              )}
            </div>
          </div>

          {/* BODY 2 PANEL */}
          <div className="flex-1 flex gap-3 px-4 py-3 overflow-hidden">
            {/* LEFT: DANH MỤC THUỐC */}
            <div className="flex-[2] border border-dashed border-emerald-300 rounded-xl flex flex-col overflow-hidden">
              <div className="px-3 py-2 text-xs font-semibold bg-slate-50 border-b">
                Danh mục thuốc
              </div>

              <div className="flex-1 overflow-auto text-xs">
                {loadingThuoc ? (
                  <div className="p-4 text-center text-gray-500">
                    Đang tải danh sách thuốc...
                  </div>
                ) : (
                  <table className="min-w-full text-xs">
                    <thead className="sticky top-0 bg-white border-b">
                      <tr className="text-[11px] text-gray-500">
                        <th className="w-10 px-2 py-2 text-left">Chọn</th>
                        <th className="w-20 px-2 py-2 text-left">Mã thuốc</th>
                        <th className="px-2 py-2 text-left">
                          Tên thuốc - Hàm lượng
                        </th>
                        <th className="w-24 px-2 py-2 text-right">Đơn giá</th>
                        <th className="w-24 px-2 py-2 text-right">
                          SL tồn kho
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredThuoc.map((t) => {
                        const id = t.id || t.idThuoc || t.id_thuoc;
                        const checked = !!selectedMap[id];
                        return (
                          <tr
                            key={id}
                            className={`border-b hover:bg-sky-50/60 ${
                              checked ? "bg-sky-50" : ""
                            }`}
                          >
                            <td className="px-2 py-1">
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggleThuoc(t)}
                              />
                            </td>
                            <td className="px-2 py-1 font-medium text-gray-700">
                              {t.ma || t.code}
                            </td>
                            <td className="px-2 py-1">
                              <div className="font-medium text-gray-800">
                                {t.tenDayDu || t.ten || t.tenThuoc}
                              </div>
                              {t.hamLuong && (
                                <div className="text-[11px] text-gray-500">
                                  {t.hamLuong}
                                </div>
                              )}
                            </td>
                            <td className="px-2 py-1 text-right text-gray-700">
                              {fmtVnd(
                                t.donGia || t.giaBan || t.price || t.don_gia
                              )}
                            </td>
                            <td className="px-2 py-1 text-right text-gray-600">
                              {t.soLuongTon || t.stock || t.so_luong_ton || 0}
                            </td>
                          </tr>
                        );
                      })}

                      {!filteredThuoc.length && (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-3 py-4 text-center text-gray-500"
                          >
                            Không có thuốc phù hợp.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* RIGHT: ĐÃ CHỌN */}
            <div className="flex-[3] border border-dashed border-emerald-300 rounded-xl flex flex-col overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-white bg-emerald-600">
                <span>Đã chọn</span>
                <span>Lưu ý: số lượng chính xác được xác định tại quầy thu ngân</span>
              </div>

              <div className="flex-1 overflow-auto text-xs">
                <table className="min-w-full text-xs">
                  <thead className="sticky top-0 bg-emerald-50 border-b border-emerald-200">
                    <tr className="text-[11px] text-emerald-900">
                      <th className="w-6 px-2 py-2 text-left">#</th>
                      <th className="px-2 py-2 text-left">
                        Tên thuốc - Hàm lượng
                      </th>
                      <th className="w-16 px-1 py-2 text-center">Số ngày</th>
                      <th className="w-16 px-1 py-2 text-center">Lần/ngày</th>
                      <th className="w-16 px-1 py-2 text-center">SL/lần</th>
                      <th className="w-20 px-1 py-2 text-center">DVSD</th>
                      <th className="w-20 px-1 py-2 text-center">Số lượng</th>
                      <th className="w-40 px-1 py-2 text-left">Cách dùng</th>
                      <th className="w-24 px-1 py-2 text-center">
                        Thời điểm dùng
                      </th>
                      <th className="w-24 px-1 py-2 text-center">Đường dùng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedList.map((it, idx) => {
                      const qty = calcSoLuong(it);
                      return (
                        <tr
                          key={it.idThuoc}
                          className="border-b bg-emerald-50/60 hover:bg-emerald-100/60"
                        >
                          <td className="px-2 py-1 align-top text-[11px] text-gray-500">
                            {idx + 1}
                          </td>
                          <td className="px-2 py-1 align-top">
                            <div className="font-semibold text-gray-800">
                              {it.ten}
                            </div>
                            <div className="text-[11px] text-gray-500">
                              Mã: {it.ma} • Tồn kho: {it.soLuongTon}
                            </div>
                          </td>

                          <td className="px-1 py-1 align-top text-center">
                            <input
                              type="number"
                              min={1}
                              className="w-14 h-7 text-center border border-emerald-300 rounded-md text-xs"
                              value={it.soNgay ?? ""}
                              onChange={(e) =>
                                updateItemField(
                                  it.idThuoc,
                                  "soNgay",
                                  e.target.value
                                )
                              }
                            />
                          </td>

                          <td className="px-1 py-1 align-top text-center">
                            <input
                              type="number"
                              min={1}
                              className="w-14 h-7 text-center border border-emerald-300 rounded-md text-xs"
                              value={it.lanNgay ?? ""}
                              onChange={(e) =>
                                updateItemField(
                                  it.idThuoc,
                                  "lanNgay",
                                  e.target.value
                                )
                              }
                            />
                          </td>

                          <td className="px-1 py-1 align-top text-center">
                            <input
                              type="number"
                              min={1}
                              className="w-14 h-7 text-center border border-emerald-300 rounded-md text-xs"
                              value={it.slLan ?? ""}
                              onChange={(e) =>
                                updateItemField(
                                  it.idThuoc,
                                  "slLan",
                                  e.target.value
                                )
                              }
                            />
                          </td>

                          <td className="px-1 py-1 align-top text-center">
                            <input
                              className="w-20 h-7 text-center border border-emerald-300 rounded-md text-xs"
                              value={it.donVi || ""}
                              onChange={(e) =>
                                updateItemField(
                                  it.idThuoc,
                                  "donVi",
                                  e.target.value
                                )
                              }
                            />
                          </td>

                          <td className="px-1 py-1 align-top text-center font-semibold text-emerald-700">
                            {qty}
                          </td>

                          <td className="px-1 py-1 align-top">
                            <input
                              className="w-full h-7 border border-emerald-300 rounded-md px-2 text-xs"
                              placeholder="Ví dụ: Uống sau ăn"
                              value={it.cachDung || ""}
                              onChange={(e) =>
                                updateItemField(
                                  it.idThuoc,
                                  "cachDung",
                                  e.target.value
                                )
                              }
                            />
                          </td>

                          <td className="px-1 py-1 align-top text-center">
                            <input
                              className="w-full h-7 border border-emerald-300 rounded-md px-2 text-xs"
                              placeholder="Sáng / Tối..."
                              value={it.thoiDiemDung || ""}
                              onChange={(e) =>
                                updateItemField(
                                  it.idThuoc,
                                  "thoiDiemDung",
                                  e.target.value
                                )
                              }
                            />
                          </td>

                          <td className="px-1 py-1 align-top text-center">
                            <input
                              className="w-full h-7 border border-emerald-300 rounded-md px-2 text-xs"
                              placeholder="Uống / Tiêm / Nhỏ..."
                              value={it.duongDung || ""}
                              onChange={(e) =>
                                updateItemField(
                                  it.idThuoc,
                                  "duongDung",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                        </tr>
                      );
                    })}

                    {!selectedList.length && (
                      <tr>
                        <td
                          colSpan={10}
                          className="px-3 py-5 text-center text-gray-400 italic"
                        >
                          Chưa chọn thuốc nào. Hãy tick vào danh sách bên trái.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* CHECK RESULT / FOOTER */}
          <div className="border-t px-4 py-2 flex items-center justify-between gap-3 bg-slate-50">
            {/* Panel lỗi / cảnh báo */}
            <div className="flex-1 text-xs max-h-20 overflow-auto">
              {checkResult && (
                <>
                  {!!checkResult.errors?.length && (
                    <div className="mb-1">
                      <div className="font-semibold text-red-600">
                        Lỗi an toàn:
                      </div>
                      <ul className="list-disc pl-4 text-red-600">
                        {checkResult.errors.map((e, idx) => (
                          <li key={idx}>{e}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {!!checkResult.warnings?.length && (
                    <div>
                      <div className="font-semibold text-amber-600">
                        Cảnh báo:
                      </div>
                      <ul className="list-disc pl-4 text-amber-600">
                        {checkResult.warnings.map((w, idx) => (
                          <li key={idx}>{w}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {!checkResult.errors?.length &&
                    !checkResult.warnings?.length && (
                      <div className="text-emerald-600 font-semibold">
                        ✅ Đơn thuốc an toàn.
                      </div>
                    )}
                </>
              )}
            </div>

            {/* Nút */}
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-md border border-gray-300 bg-white text-sm hover:bg-gray-100"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving || checking}
                className="px-5 py-2 rounded-md bg-gradient-to-r from-sky-600 to-blue-500 text-white text-sm font-semibold hover:brightness-110 disabled:opacity-60"
              >
                {saving || checking ? "Đang xử lý..." : "Đồng ý (F4)"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

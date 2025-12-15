import React, { useEffect, useState } from "react";
import { ThucHienDVKTController } from "../../../controllers/ThucHienDVKTController";

export default function ModalTraKetQua({ open, onClose, chiDinh, onSaved }) {
  const chiDinhId = chiDinh?.id;

  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState(null);
  const [chiTieus, setChiTieus] = useState([]);
  const [ketQuaText, setKetQuaText] = useState("");
  const [file, setFile] = useState("");
  const [ketQua, setKetQua] = useState(null);

  // =================== LOAD TRẠNG THÁI ===================
  const refreshKetQua = async () => {
    const res = await ThucHienDVKTController.fetchFull(chiDinhId);
    if (res) {
      setKetQua({
        ketQuaId: res.ketQuaId,
        trangThai: res.trangThai,
      });
    }
  };

  useEffect(() => {
    if (chiDinhId) refreshKetQua();
  }, [chiDinhId]);

  // =================== LOAD CHI TIÊU + THÔNG TIN ===================
  useEffect(() => {
    if (!open || !chiDinhId) return;
    setLoading(true);

    ThucHienDVKTController.fetchFull(chiDinhId).then((res) => {
      if (!res) return;

      setInfo(res.thongTin);
      setKetQuaText(res.ketQuaTong || "");
      setFile(res.fileUrl || "");

      const mapped = res.chiTieus.map((ct) => ({
        chiTieuId: ct.chiTieuId,
        tenChiTieu: ct.tenChiTieu,
        donVi: ct.donVi,
        gioiHanThap: ct.gioiHanThap,
        gioiHanCao: ct.gioiHanCao,
        ketQuaId: res.ketQuaId,
        giaTri: ct.giaTri || "",
        danhGia: ct.danhGia || "",
      }));

      setChiTieus(mapped);
      setKetQua({
        ketQuaId: res.ketQuaId,
        trangThai: res.trangThai,
      });

      setLoading(false);
    });
  }, [open, chiDinhId]);


  // =================== FORMAT KẾT QUẢ TỔNG (TỰ ĐỘNG — KHÔNG NÚT) ===================
  useEffect(() => {
    let txt = "";
    chiTieus.forEach((ct) => {
      if (ct.giaTri && ct.danhGia) {
        txt += `• ${ct.tenChiTieu}: ${ct.giaTri} ${ct.donVi} (${ct.danhGia})\n`;
      }
    });
    setKetQuaText(txt);
  }, [chiTieus]); // <-- chạy mỗi khi nhập giá trị


  // =================== HÀM LƯU TẤT CẢ — FIX LỖI 404 ===================
  const handleSaveAll = async () => {
    try {
      // 1) Lưu kết quả tổng trước (để tạo ketQuaId nếu chưa có)
      await ThucHienDVKTController.handleSaveKetQuaTong(
        { idChiDinhDVKT: chiDinhId, ketQuaText, fileUrl: file },
        () => {}
      );

      // 2) Lấy ketQuaId mới nhất
      const res = await ThucHienDVKTController.fetchFull(chiDinhId);
      const ketQuaId = res?.ketQuaId;

      if (!ketQuaId) {
        console.error("Không lấy được ketQuaId sau khi lưu tổng");
        return;
      }

      // 3) Cập nhật vào chiTieus
      const updated = chiTieus.map((ct) => ({ ...ct, ketQuaId }));
      setChiTieus(updated);

      // 4) Lưu từng dòng chi tiết
      for (const ct of updated) {
        await ThucHienDVKTController.handleSaveChiTiet({
          idKetQua: ct.ketQuaId,
          idChiTieu: ct.chiTieuId,
          giaTri: ct.giaTri,
          danhGia: ct.danhGia,
        });
      }

      refreshKetQua();
      onSaved && onSaved();
    } catch (err) {
      console.error("Lỗi khi lưu:", err);
    }
  };


  if (!open) return null;

  const calcDanhGia = (value, min, max) => {
    const num = parseFloat(value);
    if (isNaN(num)) return "";
    if (num < min) return "Thấp";
    if (num > max) return "Cao";
    return "Bình thường";
  };


  // =================== RENDER ===================
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center overflow-auto py-20">
      <div className="bg-white w-[95%] max-w-[1500px] rounded-2xl shadow-2xl flex flex-col max-h-[89vh] overflow-hidden animate-fadeIn">

        {/* HEADER */}
        <div className="p-4 border-b bg-gradient-to-r from-sky-50 to-sky-100 sticky top-0 z-10">
          <h2 className="text-xl font-bold text-sky-700">NHẬP LIỆU CÁC CHỈ SỐ</h2>
        </div>

        <div className="px-6 py-4 overflow-y-auto flex-1">

          {loading ? (
            <div className="text-center py-10 text-sky-600">Đang tải...</div>
          ) : (
            <>
              {/* THÔNG TIN CHUNG */}
              <div className="grid grid-cols-2 gap-6 bg-sky-50 p-4 rounded-lg mb-6">
                <div>
                  <p><b>Bệnh nhân:</b> {info?.benhNhan}</p>
                  <p><b>Mã BN:</b> {info?.maBenhNhan}</p>
                  <p><b>Giới tính:</b> {info?.gioiTinh || "—"}</p>
                  <p><b>Ngày sinh:</b> {info?.ngaySinh}</p>
                </div>
                <div>
                  <p><b>Dịch vụ:</b> {info?.tenDvkt}</p>
                  <p><b>Mã DV:</b> {info?.maDvkt}</p>
                  <p><b>Lần khám:</b> {info?.lanKham}</p>
                </div>
              </div>

              {/* BẢNG CHỈ TIÊU */}
              <h3 className="text-m font-semibold text-sky-700 mb-3">CHỈ TIÊU XÉT NGHIỆM</h3>

              <table className="w-full text-sm border">
                <thead className="bg-sky-100 text-sky-700">
                  <tr>
                    <th className="p-2 border">Chỉ tiêu</th>
                    <th className="p-2 border">Giới hạn</th>
                    <th className="p-2 border">Giá trị</th>
                    <th className="p-2 border">Đánh giá</th>
                  </tr>
                </thead>

                <tbody>
                  {chiTieus.map((ct, i) => (
                    <tr key={i} className="border-t">
                      <td className="p-2 border">{ct.tenChiTieu}</td>

                      <td className="p-2 border text-center">
                        {ct.gioiHanThap} - {ct.gioiHanCao} {ct.donVi}
                      </td>

                      <td className="p-2 border">
                        <input
                          className="border p-1 rounded w-24"
                          value={ct.giaTri}
                          onChange={(e) => {
                            const val = e.target.value;
                            const list = [...chiTieus];
                            list[i].giaTri = val;
                            list[i].danhGia = calcDanhGia(
                              val,
                              ct.gioiHanThap,
                              ct.gioiHanCao
                            );
                            setChiTieus(list);
                          }}
                        />
                      </td>

                      <td className="p-2 border font-semibold text-center">
                        <span className={{
                          Cao: "text-red-600",
                          Thấp: "text-blue-600",
                          "Bình thường": "text-green-600",
                        }[ct.danhGia]}>
                          {ct.danhGia}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* KẾT QUẢ TỔNG */}
              <h3 className="text-m font-semibold text-sky-700 mt-6 mb-3">KẾT QUẢ TỔNG</h3>

              <textarea
                className="w-full border p-3 rounded h-32"
                value={ketQuaText}
                onChange={(e) => setKetQuaText(e.target.value)}
              />

              <input
                className="w-full border p-2 rounded mt-3"
                placeholder="Link PDF (nếu có)"
                value={file}
                onChange={(e) => setFile(e.target.value)}
              />
            </>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t bg-white sticky bottom-0 flex justify-between">
  <button className="px-4 py-2 bg-gray-400 rounded" onClick={onClose}>
    ĐÓNG
  </button>

  <div className="flex gap-3">
<button
  className="px-4 py-2 bg-purple-600 text-white rounded"
  onClick={() => ThucHienDVKTController.handleExportPDF(chiDinhId)}
>
  📄 XUẤT PDF
</button>


    <button
      className="px-4 py-2 bg-blue-600 text-white rounded"
      onClick={handleSaveAll}
    >
      💾 TRẢ KẾT QUẢ
    </button>
  </div>
</div>

      </div>
    </div>
  );
}

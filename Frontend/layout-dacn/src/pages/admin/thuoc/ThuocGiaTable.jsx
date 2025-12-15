import React from "react";
import { Pencil, Power, RotateCcw } from "lucide-react";

const fmt = (n) =>
  typeof n === "number"
    ? n.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
      })
    : "-";

const asDate = (d) => (d ? new Date(d).toLocaleDateString("vi-VN") : "-");

export default function ThuocGiaTable({ data = [], onEdit, onToggle, columns = [] }) {
  // ✅ Map nội dung hiển thị cho từng cột
  const renderCell = (col, x, idx) => {
    switch (col.id) {
      case "stt":
        return idx + 1;
      case "donGia":
        return <span className="font-medium">{fmt(Number(x.donGia))}</span>;
      case "ngayApDung":
        return asDate(x.ngayApDung);
      case "ngayHetHan":
        return asDate(x.ngayHetHan);
      case "doiTuongApDung":
        return x.doiTuongApDung || "-";
      case "ghiChu":
        return x.ghiChu || "-";
      case "trangThai":
        return (
          <span
            className={`px-2 py-1 rounded text-xs ${
              x.hoatDong
                ? "bg-emerald-100 text-emerald-700"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {x.hoatDong ? "Hoạt động" : "Vô hiệu"}
          </span>
        );
      case "actions":
        return (
          <div className="inline-flex gap-2 justify-end">
            <button
              onClick={() => onEdit(x)}
              className="p-2 rounded hover:bg-gray-100"
              title="Sửa"
            >
              <Pencil size={18} />
            </button>
            <button
              onClick={async () => await onToggle(x)}
              className={`p-2 rounded hover:bg-gray-100 ${
                x.hoatDong ? "text-rose-600" : "text-emerald-600"
              }`}
              title={x.hoatDong ? "Vô hiệu hóa" : "Kích hoạt lại"}
            >
              {x.hoatDong ? <Power size={18} /> : <RotateCcw size={18} />}
            </button>
          </div>
        );
      default:
        return "-";
    }
  };

  return (
    <div className="overflow-auto rounded-xl border">
      <table className="min-w-full text-sm">
        <thead className="bg-pink-50 text-pink-700">
          <tr>
            {columns.map((col) => (
              <th
                key={col.id}
                className={`p-3 ${
                  col.id === "actions"
                    ? "text-right w-36"
                    : "text-left whitespace-nowrap"
                }`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((x, idx) => (
              <tr key={x.id} className="border-t hover:bg-pink-50">
                {columns.map((col) => (
                  <td
                    key={col.id}
                    className={`p-3 ${
                      col.id === "actions" ? "text-right" : ""
                    }`}
                  >
                    {renderCell(col, x, idx)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="p-6 text-center text-gray-500"
              >
                Chưa có giá cho thuốc này
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

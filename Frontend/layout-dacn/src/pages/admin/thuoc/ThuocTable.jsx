import React from "react";
import { Pencil, Power, RotateCcw } from "lucide-react";

export default function ThuocTable({
  data = [],
  page,
  pageSize,
  total,
  onPageChange,
  onSelect,
  selectedId,
  onEdit,
  onToggle,
  columns = [], // ✅ nhận danh sách cột động
}) {
  const totalPages = Math.max(1, Math.ceil((total || 0) / (pageSize || 1)));

  // ✅ ánh xạ các giá trị hiển thị theo id cột
  const renderCell = (col, x, idx) => {
    switch (col.id) {
      case "stt":
        return (page - 1) * pageSize + idx + 1;
      case "ma":
        return x.ma;
      case "ten":
        return x.ten;
      case "donViTinh":
        return x.donViTinh;
      case "nhom":
        return x.tenNhom || "-";
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
              onClick={(e) => {
                e.stopPropagation();
                onEdit(x);
              }}
              className="p-2 rounded hover:bg-gray-100"
              title="Sửa"
            >
              <Pencil size={18} />
            </button>
            <button
              onClick={async (e) => {
                e.stopPropagation();
                await onToggle(x);
              }}
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
    <div className="w-full">
      <div className="overflow-auto rounded-xl border">
        <table className="min-w-full text-sm">
          <thead className="bg-sky-50 text-sky-700">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.id}
                  className={`p-3 ${
                    col.id === "actions"
                      ? "text-right w-40"
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
              data.map((x, idx) => {
                const isSelected = selectedId === x.id;
                return (
                  <tr
                    key={x.id}
                    onClick={() => onSelect(x)}
                    className={`border-t hover:bg-sky-50 cursor-pointer ${
                      isSelected ? "bg-sky-50" : ""
                    }`}
                  >
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
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="p-6 text-center text-gray-500"
                >
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-3 flex items-center justify-between text-sm">
        <div>
          Trang {page}/{totalPages}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onPageChange(Math.max(1, page - 1))}
            className="px-3 py-1 border rounded hover:bg-gray-50"
            disabled={page <= 1}
          >
            Trước
          </button>
          <button
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            className="px-3 py-1 border rounded hover:bg-gray-50"
            disabled={page >= totalPages}
          >
            Sau
          </button>
        </div>
      </div>
    </div>
  );
}

import React from "react";

export default function ModalChiDinhDVKTSelected({
  selected,
  updateSoLuong,
  toggleSelect,
}) {
  return (
    <div className="flex-1 overflow-y-auto max-h-[64vh] border rounded">
      <table className="min-w-full text-sm">
        <thead className="bg-green-600 text-white sticky top-0 z-10">
          <tr>
            <th className="p-2 w-10"></th>
            <th className="p-2 w-12">STT</th>
            <th className="p-2">Mã dịch vụ</th>
            <th className="p-2">Tên dịch vụ</th>
            <th className="p-2">Phòng</th>
            <th className="p-2">Tầng</th>
            <th className="p-2 w-20">Số lượng</th>
            <th className="p-2 text-right">Đơn giá</th>
          </tr>
        </thead>

        <tbody>
          {selected.map((item, i) => (
            <tr
              key={item.id}
              className="border-b hover:bg-gray-100 transition cursor-pointer"
              onClick={(e) => {
                if (e.target.tagName.toLowerCase() !== "input") {
                  toggleSelect(item);
                }
              }}
            >
              <td className="p-2 text-center">
                <input
                  type="checkbox"
                  checked={true}
                  onChange={() => toggleSelect(item)}
                />
              </td>

              <td className="p-2 text-center">{i + 1}</td>

              <td className="p-2">{item.maDvkt}</td>
              <td className="p-2">{item.tenDvkt}</td>

              <td className="p-2">{item.phong?.tenPhong || "-"}</td>
              <td className="p-2 text-center">{item.phong?.tang || "-"}</td>

              <td className="p-2">
                <input
                  type="number"
                  min={1}
                  value={item.soLuong}
                  onChange={(e) =>
                    updateSoLuong(item.id, Number(e.target.value))
                  }
                  className="w-14 border rounded px-1 py-1 text-center"
                />
              </td>

              <td className="p-2 text-right font-semibold text-blue-700">
                {item.donGia?.toLocaleString("vi-VN")} đ
              </td>
            </tr>
          ))}

          {selected.length === 0 && (
            <tr>
              <td colSpan="8" className="p-3 text-center text-gray-500 italic">
                Chưa chọn dịch vụ nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

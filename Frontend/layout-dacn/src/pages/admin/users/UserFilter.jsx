import React from "react";
import { Search, Plus, ChevronsUpDown, Check } from "lucide-react";

export default function UserFilter({ filters, setFilters, onFilter, onAdd }) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") onFilter();
  };

  const handleReset = () => {
    setFilters({ keyword: "", role: "", active: "" });
    onFilter();
  };

  return (
    <div className="mb-5 grid grid-cols-1 md:grid-cols-6 gap-3 items-center">
      {/* Ô tìm kiếm */}
      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          placeholder="Tìm theo tên hoặc tài khoản…"
          className="pl-9 pr-3 py-2 w-full border border-sky-200 rounded-lg focus:ring focus:ring-sky-100"
          value={filters.keyword}
          onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
          onKeyDown={handleKeyDown}
        />
      </div>

      {/* Lọc vai trò */}
      <div className="relative">
        <ChevronsUpDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <select
          className="appearance-none w-full border border-slate-200 rounded-lg px-3 py-2"
          value={filters.role}
          onChange={(e) => {
            setFilters({ ...filters, role: e.target.value });
            onFilter();
          }}
        >
          <option value="">Tất cả vai trò</option>
          <option value="ADMIN">Admin</option>
          <option value="BAC_SI">Bác sĩ</option>
          <option value="THU_NGAN">Thu ngân</option>
          <option value="TIEP_DON">Lễ tân</option>
        </select>
      </div>

      {/* Lọc trạng thái */}
      <div className="relative">
        <ChevronsUpDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <select
          className="appearance-none w-full border border-slate-200 rounded-lg px-3 py-2"
          value={filters.active}
          onChange={(e) => {
            setFilters({ ...filters, active: e.target.value });
            onFilter();
          }}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="true">Đang hoạt động</option>
          <option value="false">Đã khóa</option>
        </select>
      </div>

      <button
        className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 w-full transition inline-flex items-center justify-center gap-2"
        onClick={onFilter}
      >
        <Search className="w-4 h-4" /> Lọc
      </button>

      <button
        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 w-full transition inline-flex items-center justify-center gap-2"
        onClick={onAdd}
      >
        <Plus className="w-4 h-4" /> Thêm người dùng
      </button>

      <button
        className="hidden md:inline-flex border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50 w-full items-center justify-center gap-2"
        onClick={handleReset}
      >
        <Check className="w-4 h-4 rotate-45 text-slate-400" />
        Đặt lại bộ lọc
      </button>
    </div>
  );
}

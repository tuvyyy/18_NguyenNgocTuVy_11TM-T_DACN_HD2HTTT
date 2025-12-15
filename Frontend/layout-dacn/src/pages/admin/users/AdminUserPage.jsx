import React, { useEffect, useState, useCallback } from "react";
import AdminAuthController from "../../../controllers/AdminAuthController";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserFilter from "./UserFilter";
import UserTable from "./UserTable";
import UserModal from "./UserModal";

export default function AdminUserPage() {
  // ======= DATA =======
  const [rawUsers, setRawUsers] = useState([]);   // dữ liệu gốc từ API
  const [users, setUsers] = useState([]);         // dữ liệu sau khi lọc
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ keyword: "", role: "", active: "" });

  // ======= STATS =======
  const [stats, setStats] = useState({ total: 0, active: 0, locked: 0 });

  // ======= PAGINATION =======
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const totalPages = Math.ceil(users.length / pageSize);
  const start = (currentPage - 1) * pageSize;
  const paginatedUsers = users.slice(start, start + pageSize);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  // ======= LOAD DATA =======
  const loadData = useCallback(async () => {
    // lấy ALL từ BE, giữ nguyên controller cũ
    await AdminAuthController.fetchUsers(setRawUsers, setLoading, {});
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ======= FILTER ON FE =======
  useEffect(() => {
    let filtered = [...rawUsers];

    // keyword theo họ tên / tài khoản / email
    if (filters.keyword) {
      const kw = filters.keyword.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.hoTen?.toLowerCase().includes(kw) ||
          u.tenDangNhap?.toLowerCase().includes(kw) ||
          u.email?.toLowerCase().includes(kw)
      );
    }

    // role (chuỗi hoặc mảng)
    if (filters.role) {
      filtered = filtered.filter((u) =>
        Array.isArray(u.vaiTro)
          ? u.vaiTro.includes(filters.role)
          : (u.vaiTro || "").includes(filters.role)
      );
    }

    // active
    if (filters.active !== "") {
      const isActive = filters.active === "true";
      filtered = filtered.filter((u) => u.hoatDong === isActive);
    }

    setUsers(filtered);
    setCurrentPage(1); // về trang 1 mỗi khi lọc
  }, [rawUsers, filters]);

  // ======= STATS FROM FILTERED LIST =======
  useEffect(() => {
    const total = users.length;
    const active = users.filter((u) => u.hoatDong).length;
    const locked = users.filter((u) => !u.hoatDong).length;
    setStats({ total, active, locked });
  }, [users]);

  // ======= MODAL =======
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    hoTen: "",
    tenDangNhap: "",
    email: "",
    soDienThoai: "",
    chucDanh: "",
    khoaPhong: "",
    vaiTro: [],
    matKhau: "Abcd@1234",
  });

  const handleAdd = () => {
    setIsEdit(false);
    setFormData({
      hoTen: "",
      tenDangNhap: "",
      email: "",
      soDienThoai: "",
      chucDanh: "",
      khoaPhong: "",
      vaiTro: [],
      matKhau: "Abcd@1234",
    });
    setShowModal(true);
  };

  const handleEdit = (user) => {
    setIsEdit(true);
    setFormData({
      id: user.id,
      hoTen: user.hoTen || "",
      tenDangNhap: user.tenDangNhap || "",
      email: user.email || "",
      soDienThoai: user.soDienThoai || "",
      chucDanh: user.chucDanh || "",
      khoaPhong: user.khoaPhong || "",
      vaiTro: Array.isArray(user.vaiTro)
        ? user.vaiTro
        : typeof user.vaiTro === "string"
        ? user.vaiTro.split(",").map((x) => x.trim())
        : [],
    });
    setShowModal(true);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-sky-50 to-pink-50 flex flex-col">
      <div className="flex-grow w-full p-10">
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg w-full h-full p-10 border border-sky-100">
          {/* Header */}
          <div className="mb-6 flex flex-wrap items-center justify-between">
            <h2 className="text-3xl font-bold text-sky-700 flex items-center gap-2">
              👑 Quản lý người dùng
            </h2>
            <div className="text-sm text-gray-600 flex items-center gap-3">
              👥 <b>Tổng:</b>{" "}
              <span className="text-gray-800">{stats.total}</span>{" "}
              | 🟢 <b>Hoạt động:</b>{" "}
              <span className="text-green-600">{stats.active}</span>{" "}
              | 🔴 <b>Khoá:</b>{" "}
              <span className="text-red-500">{stats.locked}</span>
            </div>
          </div>

          {/* Bộ lọc */}
          <div className="mb-8">
            <UserFilter
              filters={filters}
              setFilters={setFilters}
              onFilter={loadData}     // reload ALL rồi FE tự lọc
              onAdd={handleAdd}
            />
          </div>

          {/* Bảng dữ liệu */}
          <div className="overflow-x-auto">
            <UserTable
              users={paginatedUsers}
              loading={loading}
              onEdit={handleEdit}
              loadData={loadData}
            />
          </div>

          {/* Phân trang */}
          {totalPages > 1 && (
            <div className="flex justify-end items-center mt-6 gap-2 text-sm">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-full border transition ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white border-sky-200 text-sky-600 hover:bg-sky-100"
                }`}
              >
                ⬅ Trước
              </button>

              <span className="text-gray-600 px-2">
                Trang <b className="text-sky-700">{currentPage}</b> / {totalPages}
              </span>

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-full border transition ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white border-sky-200 text-sky-600 hover:bg-sky-100"
                }`}
              >
                Sau ➡
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <UserModal
          isEdit={isEdit}
          formData={formData}
          setFormData={setFormData}
          onClose={() => setShowModal(false)}
          loadData={loadData}
        />
      )}

      {/* Toast */}
      <ToastContainer position="bottom-right" autoClose={2500} newestOnTop />
    </div>
  );
}

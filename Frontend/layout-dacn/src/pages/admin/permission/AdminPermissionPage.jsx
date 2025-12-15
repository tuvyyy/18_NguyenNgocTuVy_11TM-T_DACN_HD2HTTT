import React, { useEffect, useState } from "react";
import {
  loadPermissionData,
  handleRoleSelect,
  handleUpdateRolePermissions,
} from "../../../controllers/AdminPermissionController";

export default function AdminPermissionPage() {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [rolePermissions, setRolePermissions] = useState([]);
  const [selectedPerms, setSelectedPerms] = useState({}); // { idQuyen: {xem:true,them:false,...} }
  const [loading, setLoading] = useState(false);

  // ===== LOAD DỮ LIỆU BAN ĐẦU =====
  useEffect(() => {
    loadPermissionData(setRoles, setPermissions);
  }, []);

  // ===== LOAD QUYỀN CỦA VAI TRÒ =====
  const loadRolePermissions = async (roleId) => {
    if (!roleId) return;
    setLoading(true);
    await handleRoleSelect(roleId, setSelectedRole, setRolePermissions);
    setLoading(false);
  };

  useEffect(() => {
    if (selectedRole) {
      loadRolePermissions(selectedRole);
    }
  }, [selectedRole]);

  // ===== ĐỒNG BỘ DỮ LIỆU QUYỀN =====
useEffect(() => {
  const map = {};
  rolePermissions.forEach((rp) => {
    map[rp.idQuyen] = {
      xem: rp.xem || false,
      them: rp.them || false,
      sua: rp.sua || false,
      xoa: rp.xoa || false,
      xuat: rp.xuat || false,
    };
  });
 console.log("rolePermissions:", rolePermissions);
console.log("selectedPerms map:", map);
  setSelectedPerms(map);
}, [rolePermissions]);


  // ===== CẬP NHẬT TRẠNG THÁI CHECKBOX =====
  const toggleAction = (permId, action) => {
    setSelectedPerms((prev) => ({
      ...prev,
      [permId]: {
        ...prev[permId],
        [action]: !prev[permId]?.[action],
      },
    }));
  };

  // ===== LƯU THAY ĐỔI =====
  const handleSave = async () => {
  if (!selectedRole) return alert("⚠️ Hãy chọn vai trò trước khi lưu.");

  // ✅ Gom dữ liệu chi tiết từng hành động cho từng quyền
  const selectedUpdates = Object.entries(selectedPerms).map(([id, acts]) => ({
    idQuyen: parseInt(id),
    xem: acts.xem || false,
    them: acts.them || false,
    sua: acts.sua || false,
    xoa: acts.xoa || false,
    xuat: acts.xuat || false,
  }));

  console.log("📤 Gửi lên API:", selectedUpdates);

  await handleUpdateRolePermissions(selectedRole, selectedUpdates);
};

  // ===== NHÓM THEO CHỨC NĂNG =====
  const grouped = permissions.reduce((groups, p) => {
    const name = p.tenChucNang || "Chưa phân nhóm";
    if (!groups[name]) groups[name] = [];
    groups[name].push(p);
    return groups;
  }, {});

  return (
    <div className="p-6 bg-gradient-to-br from-white to-pink-50 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-semibold text-pink-600 mb-4">
        🎯 Quản lý vai trò & phân quyền chi tiết
      </h2>

      {/* VAI TRÒ */}
      <div className="flex flex-wrap gap-3 mb-6">
        {roles.map((r) => (
          <button
            key={r.id}
            onClick={() => setSelectedRole(r.id)}
            className={`px-4 py-2 rounded-lg border transition ${
              selectedRole === r.id
                ? "bg-pink-500 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-pink-100"
            }`}
          >
            {r.ten.toUpperCase()}
          </button>
        ))}
      </div>

      {/* QUYỀN */}
      {selectedRole && (
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center text-gray-500 py-10">
              ⏳ Đang tải dữ liệu quyền...
            </div>
          ) : (
            Object.entries(grouped).map(([group, items]) => (
              <div
                key={group}
                className="bg-white rounded-lg border p-4 mb-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-sky-700 mb-3">
                  🩺 {group}
                </h3>

                <table className="min-w-full text-sm border">
                  <thead>
                    <tr className="bg-pink-100 text-gray-700 text-center">
                      <th className="border px-3 py-2">Mã quyền</th>
                      <th className="border px-3 py-2">Xem</th>
                      <th className="border px-3 py-2">Thêm</th>
                      <th className="border px-3 py-2">Sửa</th>
                      <th className="border px-3 py-2">Xóa</th>
                      <th className="border px-3 py-2">Xuất</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((perm) => (
                      <tr key={perm.id} className="text-center">
                        <td className="border px-3 py-2 text-gray-700 font-medium">
                          {perm.maQuyen}
                        </td>
                        {["xem", "them", "sua", "xoa", "xuat"].map((act) => (
                          <td
                            key={act}
                            className="border px-3 py-2 cursor-pointer hover:bg-pink-50"
                          >
                            <input
                              type="checkbox"
                              checked={selectedPerms[perm.id]?.[act] || false}
                              onChange={() => toggleAction(perm.id, act)}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))
          )}

          {/* NÚT LƯU */}
          <div className="mt-6 text-right">
            <button
              onClick={handleSave}
              disabled={loading}
              className={`px-6 py-2 rounded-lg shadow ${
                loading
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-pink-500 text-white hover:bg-pink-600"
              }`}
            >
              💾 {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

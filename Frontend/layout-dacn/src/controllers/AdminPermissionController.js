import {
  getRoles,
  getPermissions,
  getRolePermissions,
  updateRolePermissions,
  getUserPermissions,
  checkUserPermission,
} from "../api/AdminPermissionApi";

/* ============================================================
   🎯 ADMIN PERMISSION CONTROLLER – Xử lý logic phân quyền
   ============================================================ */

// ==================== LOAD DỮ LIỆU BAN ĐẦU ====================
export async function loadPermissionData(setRoles, setPermissions) {
  try {
    const roles = await getRoles();
    const permissions = await getPermissions();
    setRoles(roles || []);
    setPermissions(permissions || []);
  } catch (err) {
    console.error("❌ Lỗi loadPermissionData:", err);
    alert("Không thể tải dữ liệu vai trò và quyền.");
  }
}

// ==================== LOAD QUYỀN THEO VAI TRÒ ====================
export async function handleRoleSelect(roleId, setSelectedRole, setRolePermissions) {
  if (!roleId) return alert("⚠️ Chưa chọn vai trò.");
  try {
    setSelectedRole(roleId);
    const data = await getRolePermissions(roleId);

    console.log("[API] GET /vaitroquyen =>", data);

    // ✅ Chuẩn hóa dữ liệu BE trả về
    const formatted = data.map(p => ({
      idQuyen: p.idQuyen,
      maQuyen: p.maQuyen,
      tenChucNang: p.tenChucNang,
      xem: p.xem ?? false,
      them: p.them ?? false,
      sua: p.sua ?? false,
      xoa: p.xoa ?? false,
      xuat: p.xuat ?? false,
    }));

    console.log("✅ Sau khi format:", formatted);
    setRolePermissions(formatted);
  } catch (err) {
    console.error("❌ Lỗi tải quyền theo vai trò:", err);
    alert("Không thể tải danh sách quyền của vai trò này.");
  }
}


// ==================== CẬP NHẬT QUYỀN CHO VAI TRÒ ====================
export async function handleUpdateRolePermissions(roleId, selectedIds) {
  if (!roleId) return alert("⚠️ Chưa chọn vai trò cần cập nhật.");
  try {
    const res = await updateRolePermissions(roleId, selectedIds);

    if (res && res.message) {
      alert("✅ " + res.message);
    } else {
      alert("❌ Cập nhật quyền thất bại, vui lòng thử lại.");
    }
  } catch (err) {
    console.error("❌ Lỗi cập nhật quyền vai trò:", err);
    alert("❌ Có lỗi xảy ra khi cập nhật quyền.");
  }
}

// ==================== LẤY DANH SÁCH QUYỀN NGƯỜI DÙNG ====================
export async function handleGetUserPermissions(userId, setUserPermissions) {
  if (!userId) return;
  try {
    const res = await getUserPermissions(userId);
    if (res) setUserPermissions(res);
    else alert("⚠️ Không tìm thấy quyền cho người dùng này.");
  } catch (err) {
    console.error("❌ Lỗi lấy quyền người dùng:", err);
  }
}

// ==================== KIỂM TRA QUYỀN CỦA NGƯỜI DÙNG ====================
export async function handleCheckUserPermission(userId, feature, action) {
  if (!userId || !feature || !action) return false;
  try {
    const allowed = await checkUserPermission(userId, feature, action);
    console.log(`👤 Check quyền: ${feature}/${action} = ${allowed}`);
    return allowed;
  } catch (err) {
    console.error("❌ Lỗi kiểm tra quyền:", err);
    return false;
  }
}

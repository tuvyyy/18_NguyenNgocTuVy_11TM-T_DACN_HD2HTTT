import { toast } from "react-toastify";
import AdminAuthApi from "../api/AdminAuthApi";
import axios from "axios";

const API_BASE = "https://localhost:7007/api";

const AdminAuthController = {
  // =========================================================
  // 👤 NGƯỜI DÙNG
  // =========================================================

  // ✅ Lấy danh sách người dùng
async fetchUsers(setData, setLoading) {
  try {
    setLoading(true);
    const data = await AdminAuthApi.getAll();

    const normalized = (data || []).map((u) => ({
      id: u.id,
      tenDangNhap: u.tenDangNhap?.trim() || "",
      hoTen: u.hoTen || "",
      email: u.email || "",
      soDienThoai: u.soDienThoai || "",
      vaiTro: u.vaiTro
        ? Array.isArray(u.vaiTro)
          ? u.vaiTro
          : u.vaiTro.split(",").map((x) => x.trim())
        : [],
      hoatDong:
        typeof u.hoatDong === "boolean"
          ? u.hoatDong
          : u.hoatDong === "True" || u.hoatDong === 1,
      chucDanh: u.chucDanh || "",
      khoaPhong: u.khoaPhong || "",
    }));

    console.log("✅ Danh sách người dùng (normalized):", normalized);

    // ✅ ép React render lại dù dữ liệu giống hệt
    setData([...normalized]); // 👈 clone mảng mới ép re-render
  } catch (err) {
    console.error("❌ Lỗi tải danh sách người dùng:", err);
    toast.error("❌ Lỗi tải danh sách người dùng!");
  } finally {
    setLoading(false);
  }
},

  // ✅ Thêm người dùng mới
  async addUser(payload, refresh) {
    try {
      await AdminAuthApi.createUser(payload);
      toast.success("✅ Thêm người dùng thành công!");
      if (refresh) refresh();
    } catch (err) {
      console.error("❌ Không thể thêm người dùng:", err);
      toast.error("❌ Không thể thêm người dùng!");
    }
  },

  // ✅ Cập nhật người dùng
  async editUser(id, payload, refresh) {
    try {
      // 🔹 Chuẩn hóa dữ liệu gửi lên DTO khớp BE
      const dto = {
        hoTen: payload.hoTen || "",
        email: payload.email || "",
        soDienThoai: payload.soDienThoai || "",
        chucDanh: payload.chucDanh || "",
        khoaPhong: payload.khoaPhong || "",
        vaiTroIds: payload.vaiTroIds || [], // ✅ BE dùng mảng vaiTroIds
        hoatDong: payload.hoatDong ?? true,
      };

      await AdminAuthApi.updateUser(id, dto);
      toast.success("✏️ Cập nhật thông tin thành công!");
      if (refresh) refresh();
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật người dùng:", err);
      toast.error("❌ Lỗi khi cập nhật thông tin!");
    }
  },

  // ✅ Vô hiệu hóa tài khoản
  async disableUser(id, refresh) {
    try {
      await AdminAuthApi.deleteUser(id); // ✅ gọi DELETE /api/nguoidung/{id}
      toast.success("🔒 Đã vô hiệu hóa tài khoản!");
      if (refresh) refresh();
    } catch (err) {
      console.error("❌ Không thể vô hiệu hóa tài khoản:", err);
      toast.error("❌ Không thể vô hiệu hóa tài khoản!");
    }
  },

  // ✅ Kích hoạt tài khoản
  async enableUser(id, refresh) {
    try {
      await AdminAuthApi.enableUser(id); // ✅ gọi PATCH /api/nguoidung/{id}/kich-hoat
      toast.success("🔓 Đã kích hoạt lại tài khoản!");
      if (refresh) refresh();
    } catch (err) {
      console.error("❌ Không thể kích hoạt tài khoản:", err);
      toast.error("❌ Không thể kích hoạt tài khoản!");
    }
  },
// ✅ Reset mật khẩu
async resetPassword(id, fullName = "") {
  try {
    const res = await AdminAuthApi.resetPassword(id);

    // ✨ toast đẹp hơn
    toast.success(
  <>
    <div className="font-semibold text-sky-800">
      🔁 Đã đặt lại mật khẩu cho{" "}
      <span className="text-pink-600">{fullName}</span>
    </div>
    <div className="text-gray-700">
      🔐 Mật khẩu mới:{" "}
      <b className="text-green-700">{res.mat_khau_mac_dinh}</b>
    </div>
  </>,
  {
    icon: "💫",
    autoClose: 4000,
    style: {
      background: "linear-gradient(to right, #f0f9ff, #fff0f6)",
      borderLeft: "6px solid #38bdf8",
      borderRadius: "14px",
      width: "420px",          // ✅ Tăng chiều dài toast
      minHeight: "90px",       // ✅ Cao hơn xíu
      fontSize: "15px",        // ✅ Chữ dễ đọc hơn
    },
  }
);

  } catch (err) {
    console.error("❌ Lỗi reset mật khẩu:", err);
    toast.error("❌ Không thể đặt lại mật khẩu!");
  }
},

  // ✅ Xóa người dùng (nếu BE muốn delete cứng)
  async deleteUser(id, refresh) {
    if (!window.confirm("Bạn có chắc muốn xoá người dùng này không?")) return;
    try {
      await AdminAuthApi.deleteUser(id);
      toast.success("🗑️ Xoá người dùng thành công!");
      if (refresh) refresh();
    } catch (err) {
      console.error("❌ Không thể xoá người dùng:", err);
      toast.error("❌ Không thể xoá người dùng!");
    }
  },

  // =========================================================
  // 🧩 VAI TRÒ & QUYỀN
  // =========================================================
  async updateRoles(roleId, quyenIds) {
    try {
      console.log("📡 Gửi PATCH:", `${API_BASE}/vaitroquyen/${roleId}`);
      console.log("📦 Payload:", quyenIds);

      const res = await axios.patch(
        `${API_BASE}/vaitroquyen/${roleId}`,
        quyenIds,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("✅ Server trả về:", res.data);
      toast.success("✅ Cập nhật quyền cho vai trò thành công!");
      return res.data;
    } catch (err) {
      console.error("❌ Lỗi cập nhật quyền:", err);
      toast.error("❌ Không thể cập nhật quyền cho vai trò!");
      throw err;
    }
  },
 // ✅ Khóa / mở khóa tài khoản người dùng
async toggleLock(userId, isActive, refresh) {
  try {
    // ✅ đảo đúng chiều: nếu đang hoạt động thì gửi {khoa: true}, ngược lại {khoa: false}
    const payload = { khoa: isActive };
    const url = `${API_BASE}/users/${userId}/lock`;

    console.log(`🔐 Gửi PATCH: ${url}`);
    console.log("📦 Payload gửi đi:", payload);

    const res = await axios.patch(url, payload, {
      headers: { "Content-Type": "application/json" },
    });

    console.log("✅ Phản hồi từ server:", res.data);

    toast.success(res.data.message || "Đã cập nhật trạng thái tài khoản!");

    // 🕓 Đợi backend cập nhật xong rồi reload
    await new Promise((r) => setTimeout(r, 200));
    if (typeof refresh === "function") {
      console.log("🔁 Đang reload danh sách người dùng...");
      await refresh();
    }
  } catch (err) {
    console.error("❌ Lỗi khi đổi trạng thái người dùng:", err);
    toast.error("Không thể đổi trạng thái tài khoản!");
  }
},

};

export default AdminAuthController;

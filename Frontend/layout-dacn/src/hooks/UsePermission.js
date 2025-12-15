import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "https://localhost:7007/api";

/**
 * 🎯 Hook kiểm tra quyền người dùng cho 1 chức năng (feature)
 * @param {string} feature - Mã chức năng (ví dụ: "KHAM_BENH")
 */
export function usePermission(feature) {
  const [permissions, setPermissions] = useState({
    canView: false,
    canAdd: false,
    canEdit: false,
    canDelete: false,
    canExport: false,
    loading: true,
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (!user || !feature) return;

    const load = async () => {
      try {
        const userId = user.userId;
        const actions = ["xem", "them", "sua", "xoa", "xuat"];

        const results = await Promise.all(
          actions.map(async (action) => {
            const res = await axios.get(
              `${API_BASE}/users/${userId}/can?feature=${feature}&action=${action}`
            );
            return res.data.allowed;
          })
        );

        setPermissions({
          canView: results[0],
          canAdd: results[1],
          canEdit: results[2],
          canDelete: results[3],
          canExport: results[4],
          loading: false,
        });
      } catch (err) {
        console.error("❌ Lỗi khi tải quyền:", err);
        setPermissions((prev) => ({ ...prev, loading: false }));
      }
    };

    load();
  }, [feature]);

  return permissions;
}

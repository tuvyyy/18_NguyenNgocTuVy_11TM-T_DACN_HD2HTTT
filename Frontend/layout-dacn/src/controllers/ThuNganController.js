import {
  getWaitingPatients,
  getBillDetail,
  confirmPayment,
  getReceipt,
} from "../api/ThuNganApi";
import Swal from "sweetalert2";
import axios from "axios";


// ================== DANH SÁCH BỆNH NHÂN ==================
export async function loadWaitingPatients(type, setList) {
  const data = await getWaitingPatients(type);
  setList(Array.isArray(data) ? data : []);
}

// ================== XEM CHI TIẾT HÓA ĐƠN ==================
export const handleViewBill = (maHoaDon, navigate) => {
  if (!maHoaDon) {
    console.warn("⚠️ Thiếu mã hóa đơn khi xem chi tiết.");
    return;
  }
  console.log("🔍 Điều hướng đến chi tiết:", maHoaDon);
  navigate(`/thu-ngan/detail/${maHoaDon}`); // ✅ route phải khớp App.js
};

// ================== XÁC NHẬN THANH TOÁN ==================
export const handleConfirmPayment = async (maHd, idThuNgan, paymentMethod) => {
  if (!idThuNgan) {
    alert("Thiếu thông tin thu ngân, vui lòng đăng nhập lại!");
    return;
  }

  try {
    const url = `https://localhost:7007/api/HoaDon/xac-nhan-thanh-toan/ma/${maHd}`;
    const res = await axios.put(
      url,
      {
        idThuNgan,
        hinhThucThanhToan: paymentMethod,
      },
      { headers: { "Content-Type": "application/json" } }
    );
    return res.data;
  } catch (err) {
    console.error("❌ Lỗi xác nhận thanh toán:", err);
    throw err;
  }
};

// ================== IN PHIẾU THU ==================
export async function handlePrintReceipt(maHoaDon) {
  const data = await getReceipt(maHoaDon);
  if (!data) return Swal.fire("Không thể in phiếu thu.", "", "error");

  const content = `
    🧾 <b>PHIẾU THU - ${data.maHd}</b><br>
    Bệnh nhân: ${data.tenBenhNhan}<br>
    Ngày thu: ${new Date(data.ngayThu).toLocaleString()}<br>
    Tổng tiền: ${data.tongTien.toLocaleString()} VND<br><br>
    <b>Chi tiết:</b><br>
    ${data.chiTiet
      .map(
        (x) =>
          `- ${x.moTa}: ${x.soLuong} x ${x.donGia.toLocaleString()} = ${x.thanhTien.toLocaleString()}`
      )
      .join("<br>")}
  `;
  const printWindow = window.open("", "_blank");
  printWindow.document.write(`<pre>${content}</pre>`);
  printWindow.document.close();
  printWindow.print();
}

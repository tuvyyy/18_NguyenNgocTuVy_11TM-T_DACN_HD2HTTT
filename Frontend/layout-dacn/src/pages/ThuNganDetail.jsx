import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBillDetail } from "../api/ThuNganApi";
import axios from "axios";
import Swal from "sweetalert2";

import {
  handleConfirmPayment,
  handlePrintReceipt,
} from "../controllers/ThuNganController";

import { ArrowLeft, Printer, CheckCircle2, Edit } from "lucide-react";
import MainLayout from "../layouts/MainLayout";

export default function ThuNganDetail() {
  const { maHoaDon } = useParams();
  const navigate = useNavigate();

  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("TIEN_MAT");
  const [idThuNgan, setIdThuNgan] = useState(null);

  // ===========================================
  // 1️⃣ LẤY THÔNG TIN USER TỪ LOCAL STORAGE
  // ===========================================
  useEffect(() => {
    try {
      const raw = localStorage.getItem("userInfo");

      if (!raw) {
        Swal.fire("Thiếu thông tin!", "Vui lòng đăng nhập lại!", "warning");
        return;
      }

      const user = JSON.parse(raw);

      if (!user.userId) {
        Swal.fire("Lỗi!", "Không tìm thấy ID thu ngân!", "error");
        return;
      }

      setIdThuNgan(user.userId);
    } catch (err) {
      Swal.fire("Lỗi!", "Không thể đọc thông tin người dùng!", "error");
    }
  }, []);

  // ===========================================
  // 2️⃣ LOAD CHI TIẾT HÓA ĐƠN
  // ===========================================
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getBillDetail(maHoaDon);
        setBill(data);
      } catch {
        Swal.fire("Lỗi!", "Không tải được dữ liệu hóa đơn!", "error");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [maHoaDon]);

  // ===========================================
  // 3️⃣ THANH TOÁN VNPAY
  // ===========================================
  const handleVnPay = async () => {
    try {
      const res = await axios.get(
        "https://localhost:7007/api/Vnpay/CreatePaymentUrl",
        {
          params: {
            maHd: bill.maHd,
            amount: bill.tongTien,
          },
        }
      );

      window.location.href = res.data.paymentUrl || res.data;
    } catch (err) {
      Swal.fire("Lỗi!", "Không thể tạo yêu cầu thanh toán VNPay!", "error");
    }
  };

  // ===========================================
  // 4️⃣ THANH TOÁN TIỀN MẶT
  // ===========================================
  const processCashPayment = async () => {
    try {
      const confirm = await Swal.fire({
        title: "Xác nhận thanh toán?",
        text: "Bạn có chắc muốn thanh toán hóa đơn này?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Thanh toán",
        cancelButtonText: "Hủy",
      });

      if (!confirm.isConfirmed) return;

      await handleConfirmPayment(bill.maHd, idThuNgan, paymentMethod);

      await Swal.fire("Thành công!", "Hóa đơn đã được thanh toán!", "success");

      // Reload lại hóa đơn
      const refreshed = await getBillDetail(maHoaDon);
      setBill(refreshed);
    } catch (err) {
      Swal.fire("Lỗi!", "Thanh toán thất bại!", "error");
    }
  };

  // ===========================================
  // RENDER LOADING / LỖI / UI CHÍNH
  // ===========================================
  if (loading)
    return (
      <div className="p-8 text-center text-gray-500 animate-pulse">
        ⏳ Đang tải dữ liệu hóa đơn...
      </div>
    );

  if (!bill)
    return (
      <div className="p-8 text-center text-red-500">
        ⚠️ Không tìm thấy dữ liệu hóa đơn #{maHoaDon}
      </div>
    );

  // ===========================================
  //  UI CHÍNH
  // ===========================================
  return (
    <MainLayout>
    <div className="p-6 space-y-4 bg-gradient-to-br from-white to-sky-50 rounded-2xl shadow-md">
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/thu-ngan")}
          className="text-gray-600 hover:text-black flex items-center gap-2"
        >
          <ArrowLeft size={18} /> Quay lại danh sách
        </button>

        <h2 className="text-xl font-bold text-sky-700">
          💳 Chi tiết thanh toán — {bill.maHd}
        </h2>
      </div>

      {/* ================= THÔNG TIN BỆNH NHÂN ================= */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <h3 className="font-semibold text-gray-700 mb-2">👤 Thông tin bệnh nhân</h3>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <p>
            <b>Họ tên:</b> {bill.benhNhan}
          </p>
          <p>
            <b>Ngày tạo:</b>{" "}
            {new Date(bill.ngayTao).toLocaleString("vi-VN")}
          </p>
          <p>
            <b>Tổng tiền:</b> {bill.tongTien.toLocaleString("vi-VN")} VND
          </p>
          <p>
            <b>Trạng thái:</b>{" "}
            <span
              className={`font-semibold ${
                bill.trangThai === "DA_THANH_TOAN"
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {bill.trangThai === "DA_THANH_TOAN"
                ? "Đã thanh toán"
                : "Chưa thanh toán"}
            </span>
          </p>
        </div>
      </div>

      {/* ================= DANH SÁCH DỊCH VỤ ================= */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <h3 className="font-semibold text-gray-700 mb-3">📋 Danh sách dịch vụ</h3>

        <table className="w-full border text-sm">
          <thead className="bg-sky-100 text-gray-700">
            <tr>
              <th className="p-2 border">Mô tả</th>
              <th className="p-2 border w-20">SL</th>
              <th className="p-2 border w-32">Đơn giá</th>
              <th className="p-2 border w-32">Thành tiền</th>
            </tr>
          </thead>

          <tbody>
            {bill.chiTiet.map((ct, i) => (
              <tr key={i} className="text-center hover:bg-sky-50">
                <td className="p-2 border text-left">{ct.moTa}</td>
                <td className="p-2 border">{ct.soLuong}</td>
                <td className="p-2 border text-right">
                  {ct.donGia.toLocaleString("vi-VN")}
                </td>
                <td className="p-2 border text-right font-semibold">
                  {ct.thanhTien.toLocaleString("vi-VN")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= THANH TOÁN ================= */}
      <div className="bg-white p-4 rounded-lg shadow-sm border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Edit size={18} className="text-blue-500" />

          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          >
            <option value="TIEN_MAT">💵 Tiền mặt</option>
            <option value="VNPAY">💳 VNPay</option>
            <option value="MOMO">📱 MoMo</option>
          </select>
        </div>

        <div className="flex gap-2">
          {paymentMethod === "VNPAY" ? (
            <button
              onClick={handleVnPay}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              💳 Thanh toán VNPay
            </button>
          ) : (
            <button
              onClick={processCashPayment}
              className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-1 hover:bg-green-600"
            >
              <CheckCircle2 size={16} /> Xác nhận thanh toán
            </button>
          )}

          <button
            onClick={() => handlePrintReceipt(bill.maHd)}
            className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-1 hover:bg-blue-600"
          >
            <Printer size={16} /> In phiếu thu
          </button>
        </div>
      </div>
    </div>
    </MainLayout>
  );
}

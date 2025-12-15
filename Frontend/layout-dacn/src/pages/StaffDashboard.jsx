import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Stethoscope, UserPlus, DollarSign, CalendarCheck2, LogOut } from "lucide-react";
import MainLayout from "../layouts/MainLayout";

export default function StaffDashboard() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Tiếp đón bệnh nhân",
      icon: <UserPlus size={40} className="text-sky-600" />,
      desc: "Nhập thông tin bệnh nhân, kiểm tra trùng và tạo hồ sơ khám.",
      path: "/tiep-don",
      glow: "shadow-[0_0_25px_3px_rgba(56,189,248,0.3)]",
    },
    {
      title: "Khám bệnh",
      icon: <Stethoscope size={40} className="text-green-500" />,
      desc: "Bác sĩ thực hiện khám, chẩn đoán và chỉ định dịch vụ kỹ thuật.",
      path: "/bac-si",
      glow: "shadow-[0_0_25px_3px_rgba(34,197,94,0.25)]",
    },
    {
      title: "Thu ngân",
      icon: <DollarSign size={40} className="text-amber-500" />,
      desc: "Xử lý thanh toán tiền khám, thuốc, và các dịch vụ kỹ thuật.",
      path: "/thu-ngan",
      glow: "shadow-[0_0_25px_3px_rgba(245,158,11,0.25)]",
    },
    {
      title: "Thực hiện Cận lâm sàng",
      icon: <CalendarCheck2 size={40} className="text-indigo-500" />,
      desc: "Xem và thực hiện các chỉ định dịch vụ kỹ thuật từ bác sĩ.",
      path: "/can-lam-sang",
      glow: "shadow-[0_0_25px_3px_rgba(99,102,241,0.25)]",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  return (
    <MainLayout>
    <div className="min-h-[80vh] flex flex-col items-center mt-20 mb-20 px-4">

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-6xl">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            className={`relative p-6 rounded-2xl bg-white border border-sky-100 hover:${card.glow} cursor-pointer transition-all duration-300`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(card.path)}
          >
            <div className="flex flex-col items-start gap-3">
              {card.icon}
              <h2 className="text-lg font-semibold text-sky-800">{card.title}</h2>
              <p className="text-gray-600 text-sm leading-snug">{card.desc}</p>
            </div>

            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-white/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </motion.div>
        ))}

        {/* ✅ Card đăng xuất */}
        <motion.div
          className="relative p-6 rounded-2xl bg-white border border-rose-100 hover:shadow-[0_0_25px_3px_rgba(244,63,94,0.25)] cursor-pointer transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
        >
          <div className="flex flex-col items-start gap-3">
            <LogOut size={40} className="text-rose-500" />
            <h2 className="text-lg font-semibold text-rose-700">Đăng xuất</h2>
            <p className="text-gray-600 text-sm leading-snug">
              Thoát khỏi hệ thống và quay lại màn hình đăng nhập.
            </p>
          </div>
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-white/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </motion.div>
      </div>
    </div>
    </MainLayout>
  );
}

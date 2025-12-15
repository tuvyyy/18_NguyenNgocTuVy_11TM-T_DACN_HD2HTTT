// ================================================
// 📌 Giao diện Thực hiện DVKT – Layout 2 Cột (đẹp)
// ================================================
import React, { useEffect, useState } from "react";
import { ThucHienDVKTController } from "../../controllers/ThucHienDVKTController";
//sử dụng mainlayout chung nên phải import nó
import MainLayout from "../../layouts/MainLayout";
// ⭐⭐ THÊM NGAY DƯỚI ĐÂY ⭐⭐
import {
  getPendingDVKT,
  getProcessingDVKT,
  getDoneDVKT,
} from "../../api/ThucHienDVKTApi";
import PendingTable from "./components/PendingTable";
import ProcessingTable from "./components/ProcessingTable";
import DoneTable from "./components/DoneTable";
import ModalTraKetQua from "./modals/ModalTraKetQua";

export default function ThucHienDVKT() {
  const [state, setState] = useState({
    pending: [],
    processing: [],
    done: [],
    loading: true,
  });

  const [activeTab, setActiveTab] = useState("processing");
  const [openTraKQ, setOpenTraKQ] = useState(false);
  const [selectedDVKT, setSelectedDVKT] = useState(null);

const refreshAll = async () => {
  setState((s) => ({ ...s, loading: true }));

  const [pending, processing, done] = await Promise.all([
    getPendingDVKT(),
    getProcessingDVKT(),
    getDoneDVKT(),
  ]);

  setState({
    pending,
    processing,
    done,
    loading: false,
  });
};


  useEffect(() => {
    const handler = (e) => {
      setSelectedDVKT(e.detail);
      setOpenTraKQ(true);
    };
    window.addEventListener("openTraKetQua", handler);
    return () => window.removeEventListener("openTraKetQua", handler);
  }, []);

  useEffect(() => {
    refreshAll();
  }, []);

  return (
    <MainLayout>
    <div className="p-4 animate-fadeIn">
      {/* LAYOUT 2 CỘT */}
      <div className="grid grid-cols-[40%_60%] gap-6">

        {/* LEFT PANEL */}
        <div className="bg-white rounded-xl shadow border p-4 h-[calc(100vh-140px)] flex flex-col overflow-hidden">
          {/* Content scroll */}
          <div className="flex-1 overflow-y-auto pr-2">
            <PendingTable
              data={state.pending}
              onReceive={(id) =>
                ThucHienDVKTController.handleNhan(id, refreshAll)
              }
            />
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="bg-white rounded-xl shadow border p-4 h-[calc(100vh-140px)] flex flex-col overflow-hidden">

          {/* TABS */}
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setActiveTab("processing")}
              className={`px-6 py-2 rounded-xl text-sm font-semibold transition 
                ${
                  activeTab === "processing"
                    ? "bg-gradient-to-r from-sky-400 to-blue-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }
              `}
            >
              🟡 Đang thực hiện
            </button>

            <button
              onClick={() => setActiveTab("done")}
              className={`px-6 py-2 rounded-xl text-sm font-semibold transition 
                ${
                  activeTab === "done"
                    ? "bg-gradient-to-r from-green-400 to-green-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }
              `}
            >
              ✅ Đã hoàn thành
            </button>
          </div>

          {/* TAB CONTENT */}
          <div className="flex-1 overflow-y-auto pr-2">
            {activeTab === "processing" && (
              <ProcessingTable
                data={state.processing}
                onComplete={() => refreshAll()}
                onCancel={() => refreshAll()}
              />
            )}
            {activeTab === "done" && (
<DoneTable
  data={state.done}
  refreshItem={(id) => {
    setState((prev) => ({
      ...prev,
      done: prev.done.map(d =>
        d.id === id ? { ...d, trangThai: "sent", trangThaiKQ: "completed" } : d
      )
    }));
  }}
/>
)}

          </div>

        </div>
      </div>

      {/* MODAL */}
      <ModalTraKetQua
        open={openTraKQ}
        chiDinh={selectedDVKT}
        onClose={() => setOpenTraKQ(false)}
        onSaved={refreshAll}
      />
    </div>
    </MainLayout>
  );
}

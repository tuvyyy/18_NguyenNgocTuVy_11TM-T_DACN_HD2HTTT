import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import AdminHeader from "../components/AdminHeader";
import AdminFooter from "../components/AdminFooter";
import PageTransition from "../components/PageTransition";

export default function AdminLayout() {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-sky-50 to-pink-50">
      {/* 🔹 Header cố định */}
      <AdminHeader />

      {/* 🔹 Nội dung full màn hình, gần như không padding */}
      <main className="flex-1 w-full px-1 sm:px-2 md:px-3">
        <AnimatePresence mode="wait">
          <PageTransition key={location.pathname}>
            <div className="w-full">
              <Outlet />
            </div>
          </PageTransition>
        </AnimatePresence>
      </main>

      {/* 🔹 Footer cố định */}
      <AdminFooter />
    </div>
  );
}

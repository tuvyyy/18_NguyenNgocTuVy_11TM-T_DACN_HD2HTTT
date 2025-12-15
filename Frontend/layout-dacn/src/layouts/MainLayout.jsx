import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function MainLayout({ children }) {
  return (
    <div className="flex flex-col h-screen  overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header cố định */}
      <div className="flex-shrink-0">
        <Header />
      </div>

      {/* Main full width, full height, không cuộn */}
      <main className="flex-1 w-full h-full overflow-hidden flex justify-center items-stretch">
        <div className="w-full h-full">{children}</div>
      </main>

      {/* Footer cố định */}
      <div className="flex-shrink-0">
        <Footer />
      </div>
    </div>
  );
}

"use client";

import DashboardSidebar from "./DashboardSidebar";

export default function DashboardLayout({ children, role = "buyer" }) {
  return (
    <div className="dash-layout">
      <DashboardSidebar role={role} />
      <main className="dash-main">{children}</main>

      <style jsx>{`
        .dash-layout {
          display: flex;
          min-height: 100vh;
          min-height: 100dvh;
          background: #f8fafc;
          font-family: "Poppins", sans-serif;
          width: 100%;
          overflow-x: hidden;
        }

        .dash-main {
          flex: 1;
          margin-left: 260px;
          min-width: 0;
          max-width: 100%;
          overflow-x: hidden;
        }

        @media (max-width: 768px) {
          .dash-main {
            margin-left: 0;
            padding-top: 60px;
          }
        }
      `}</style>
    </div>
  );
}
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
        }

        .dash-main {
          flex: 1;
          margin-left: 260px;
          padding: 32px;
          min-width: 0;
          max-width: 100%;
        }

        @media (max-width: 768px) {
          .dash-main {
            margin-left: 0;
            padding: 16px;
            padding-top: calc(60px + 16px);
          }
        }

        @media (max-width: 480px) {
          .dash-main {
            padding: 12px;
            padding-top: calc(60px + 12px);
          }
        }
      `}</style>
    </div>
  );
}
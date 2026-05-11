"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const buyerNav = [
  { href: "/buyer/dashboard", label: "Dashboard", emoji: "📊" },
  { href: "/buyer/transactions", label: "My Transactions", emoji: "🔄" },
  { href: "/buyer/messages", label: "Messages", emoji: "💬" },
  { href: "/buyer/saved", label: "Bookmark", emoji: "❤️" },
  { href: "/buyer/settings", label: "Settings", emoji: "⚙️" },
];

const sellerNav = [
  { href: "/seller/dashboard", label: "Dashboard", emoji: "📊" },
  { href: "/seller/properties", label: "My Listings", emoji: "🏠" },
  { href: "/seller/messages", label: "Messages", emoji: "💬" },
  { href: "/seller/documents", label: "Documents", emoji: "📄" },
  { href: "/seller/settings", label: "Settings", emoji: "⚙️" },
];

export default function DashboardSidebar({ role = "buyer" }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const navItems = role === "seller" ? sellerNav : buyerNav;

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="dash-topbar">
        <Link href="/" className="dash-logo">
          <span className="dash-logo-icon">🏠</span>
          <span className="dash-logo-text">Susync</span>
        </Link>
        <button
          className="hamburger"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span className={`ham-line ${open ? "open-1" : ""}`} />
          <span className={`ham-line ${open ? "open-2" : ""}`} />
          <span className={`ham-line ${open ? "open-3" : ""}`} />
        </button>
      </header>

      {open && (
        <div
          className="sidebar-overlay"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside className={`dashboard-sidebar ${open ? "sidebar-open" : ""}`}>
        <Link href="/" className="sidebar-logo">
          <span className="dash-logo-icon">🏠</span>
          <span className="dash-logo-text">Susync</span>
        </Link>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-link ${active ? "sidebar-link-active" : ""}`}
              >
                <span className="sidebar-emoji">{item.emoji}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-divider" />

        <Link href="/login" className="sidebar-link sidebar-logout">
          <span className="sidebar-emoji">🚪</span>
          <span>Logout</span>
        </Link>
      </aside>

      <style jsx>{`
        .dash-topbar {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 60px;
          background: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          z-index: 100;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .dash-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          font-weight: 700;
          font-size: 1.1rem;
          color: #1e293b;
          font-family: "Poppins", sans-serif;
        }

        .dash-logo-icon {
          font-size: 1rem;
          background: #2563eb;
          border-radius: 8px;
          padding: 4px 6px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .dash-logo-text {
          font-weight: 700;
          color: #1e293b;
        }

        .hamburger {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 6px;
          border-radius: 8px;
          transition: background 0.15s ease;
          width: 36px;
          height: 36px;
        }

        .hamburger:hover {
          background: #f1f5f9;
        }

        .hamburger:focus-visible {
          outline: 2px solid #2563eb;
          outline-offset: 2px;
        }

        .ham-line {
          display: block;
          width: 20px;
          height: 2px;
          background: #1e293b;
          border-radius: 2px;
          transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1),
            opacity 0.28s cubic-bezier(0.4, 0, 0.2, 1);
          transform-origin: center;
        }

        .open-1 {
          transform: translateY(7px) rotate(45deg);
        }

        .open-2 {
          opacity: 0;
          transform: scaleX(0);
        }

        .open-3 {
          transform: translateY(-7px) rotate(-45deg);
        }

        .sidebar-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.45);
          z-index: 149;
          backdrop-filter: blur(2px);
          -webkit-backdrop-filter: blur(2px);
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .dashboard-sidebar {
          position: fixed;
          top: 0;
          left: 0;
          width: 260px;
          height: 100vh;
          height: 100dvh;
          background: #ffffff;
          border-right: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          padding: 24px 16px;
          z-index: 150;
          overflow-y: auto;
          overflow-x: hidden;
        }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          font-weight: 700;
          font-size: 1.1rem;
          color: #1e293b;
          margin-bottom: 32px;
          padding-left: 4px;
          font-family: "Poppins", sans-serif;
          flex-shrink: 0;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
        }

        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 14px;
          border-radius: 10px;
          text-decoration: none;
          font-size: 0.92rem;
          font-weight: 500;
          color: #64748b;
          transition: background 0.15s ease, color 0.15s ease;
          font-family: "Poppins", sans-serif;
          border-left: 3px solid transparent;
        }

        .sidebar-link:hover {
          background: #f8fafc;
          color: #1e293b;
        }

        .sidebar-link-active {
          background: #eff6ff;
          color: #2563eb;
          border-left: 3px solid #2563eb;
          padding-left: 11px;
          font-weight: 600;
        }

        .sidebar-emoji {
          font-size: 1rem;
          width: 20px;
          text-align: center;
          flex-shrink: 0;
        }

        .sidebar-divider {
          height: 1px;
          background: #e2e8f0;
          margin: 12px 0;
          flex-shrink: 0;
        }

        .sidebar-logout {
          color: #ef4444;
        }

        .sidebar-logout:hover {
          background: #fff1f2;
          color: #dc2626;
        }

        @media (max-width: 768px) {
          .dash-topbar {
            display: flex;
          }

          .sidebar-logo {
            display: none;
          }

          .dashboard-sidebar {
            transform: translateX(-100%);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            padding-top: 24px;
            box-shadow: none;
          }

          .sidebar-open {
            transform: translateX(0);
            box-shadow: 8px 0 32px rgba(0, 0, 0, 0.15);
          }
        }

        @media (min-width: 769px) {
          .sidebar-overlay {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
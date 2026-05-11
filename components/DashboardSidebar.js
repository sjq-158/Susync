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

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Mobile top bar */}
      <header className="dash-topbar">
        <Link href="/" className="dash-logo">
          <span className="dash-logo-icon">🏠</span>
          <span className="dash-logo-text">Susync</span>
        </Link>
        <div className="dash-topbar-right">
          <span className="dash-role-badge">{role === "seller" ? "Seller" : "Buyer"}</span>
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
        </div>
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
          <span className="sidebar-logo-icon">🏠</span>
          <span className="sidebar-logo-text">Susync</span>
        </Link>

        <div className="sidebar-role">{role === "seller" ? "Seller Account" : "Buyer Account"}</div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
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
        /* ── Mobile Topbar ── */
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
          z-index: 200;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
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
          background: #1A56DB;
          border-radius: 8px;
          padding: 4px 6px;
        }

        .dash-logo-text { font-weight: 700; color: #1e293b; }

        .dash-topbar-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .dash-role-badge {
          font-size: 11px;
          font-weight: 600;
          color: #1A56DB;
          background: #EBF2FF;
          padding: 3px 10px;
          border-radius: 20px;
          font-family: "Poppins", sans-serif;
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

        .hamburger:hover { background: #f1f5f9; }

        .hamburger:focus-visible {
          outline: 2px solid #1A56DB;
          outline-offset: 2px;
        }

        .ham-line {
          display: block;
          width: 20px;
          height: 2px;
          background: #1e293b;
          border-radius: 2px;
          transition: transform 0.28s cubic-bezier(0.4,0,0.2,1),
            opacity 0.28s cubic-bezier(0.4,0,0.2,1);
          transform-origin: center;
        }

        .open-1 { transform: translateY(7px) rotate(45deg); }
        .open-2 { opacity: 0; transform: scaleX(0); }
        .open-3 { transform: translateY(-7px) rotate(-45deg); }

        /* ── Overlay ── */
        .sidebar-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.45);
          z-index: 249;
          backdrop-filter: blur(2px);
          -webkit-backdrop-filter: blur(2px);
          animation: overlayFadeIn 0.2s ease;
        }

        @keyframes overlayFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* ── Sidebar ── */
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
          padding: 28px 16px 24px;
          z-index: 250;
          overflow-y: auto;
          overflow-x: hidden;
          box-shadow: none;
        }

        /* Desktop logo inside sidebar */
        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          font-weight: 700;
          font-size: 1.15rem;
          color: #111827;
          margin-bottom: 4px;
          padding-left: 4px;
          font-family: "Poppins", sans-serif;
          flex-shrink: 0;
        }

        .sidebar-logo-icon {
          background: #1A56DB;
          border-radius: 8px;
          padding: 4px 6px;
          font-size: 1rem;
        }

        .sidebar-logo-text {
          font-weight: 700;
          color: #1A56DB;
          letter-spacing: -0.3px;
        }

        .sidebar-role {
          font-size: 11px;
          font-weight: 600;
          color: #6B7280;
          padding-left: 8px;
          margin-bottom: 28px;
          font-family: "Poppins", sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.05em;
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
          font-size: 0.9rem;
          font-weight: 500;
          color: #475569;
          transition: background 0.15s ease, color 0.15s ease;
          font-family: "Poppins", sans-serif;
          border-left: 3px solid transparent;
        }

        .sidebar-link:hover {
          background: #f8fafc;
          color: #1e293b;
        }

        .sidebar-link-active {
          background: #EBF2FF;
          color: #1A56DB;
          border-left: 3px solid #1A56DB;
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

        .sidebar-logout { color: #ef4444; }
        .sidebar-logout:hover { background: #fff1f2; color: #dc2626; }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .dash-topbar { display: flex; }

          .dashboard-sidebar {
            transform: translateX(-100%);
            transition: transform 0.3s cubic-bezier(0.4,0,0.2,1),
              box-shadow 0.3s cubic-bezier(0.4,0,0.2,1);
            padding-top: 28px;
          }

          .sidebar-open {
            transform: translateX(0);
            box-shadow: 8px 0 32px rgba(0,0,0,0.15);
          }
        }

        @media (min-width: 769px) {
          .sidebar-overlay { display: none !important; }
        }
      `}</style>
    </>
  );
}
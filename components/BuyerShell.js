"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/buyer/dashboard", icon: "📊", label: "Dashboard" },
  { href: "/buyer/transactions?tab=all", match: "/buyer/transactions", icon: "🔄", label: "My Transactions" },
  { href: "/buyer/messages", icon: "💬", label: "Messages" },
  { href: "/buyer/saved", icon: "❤️", label: "Bookmark" },
  { href: "/buyer/settings", icon: "⚙️", label: "Settings" },
];

export default function BuyerShell({ children }) {
  const pathname = usePathname() || "";

  return (
    <>
      <style>{SHELL_CSS}</style>

      <input type="checkbox" id="bshell-toggle" className="bshell-toggle-input" />

      <div className="bshell-topbar">
        <div className="bshell-topbar-left">
          <label htmlFor="bshell-toggle" className="bshell-hamburger" aria-label="Toggle sidebar">
            <span></span>
            <span></span>
            <span></span>
          </label>
          <Link href="/buyer/dashboard" className="bshell-logo">
            <div className="bshell-logo-box">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              </svg>
            </div>
            <span className="bshell-logo-text">Susync</span>
          </Link>
        </div>
        <div className="bshell-user">
          <div className="bshell-user-meta">
            <div className="bshell-user-name">Juan dela Cruz</div>
            <div className="bshell-user-role">Buyer Account</div>
          </div>
          <div className="bshell-avatar">J</div>
        </div>
      </div>

      <div className="bshell-row">
        <div className="bshell-sidebar">
          {NAV.map((item) => {
            const target = item.match || item.href.split("?")[0];
            const active = pathname === target || pathname.startsWith(target + "/");
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`bshell-side-item${active ? " is-active" : ""}`}
              >
                <span className="bshell-side-icon">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
          <div className="bshell-divider"></div>
          <Link href="/" className="bshell-side-item bshell-logout">
            <span className="bshell-side-icon">🚪</span>
            <span>Logout</span>
          </Link>
        </div>

        {children}
      </div>
    </>
  );
}

const SHELL_CSS = `
  .bshell-toggle-input { display: none; }

  .bshell-topbar {
    height: 72px;
    padding: 0 60px;
    background: #ffffff;
    border-bottom: 1px solid #E5E7EB;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 100;
    font-family: 'Poppins', sans-serif;
  }
  .bshell-topbar-left { display: flex; align-items: center; gap: 20px; }
  .bshell-hamburger {
    cursor: pointer;
    padding: 10px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    transition: background 0.2s;
  }
  .bshell-hamburger:hover { background: #fbfbf9; }
  .bshell-hamburger span { width: 22px; height: 2px; background: #111827; border-radius: 2px; }

  .bshell-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
  .bshell-logo-box {
    width: 32px; height: 32px;
    background: #1A56DB;
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
  }
  .bshell-logo-text { font-size: 22px; font-weight: 700; color: #1A56DB; }

  .bshell-user { display: flex; align-items: center; gap: 12px; }
  .bshell-user-meta { text-align: right; }
  .bshell-user-name { font-size: 14px; font-weight: 700; color: #111827; }
  .bshell-user-role { font-size: 11px; color: #6B7280; }
  .bshell-avatar {
    width: 38px; height: 38px;
    border-radius: 50%;
    background: #1A56DB;
    color: #ffffff;
    display: flex; align-items: center; justify-content: center;
    font-weight: 700;
    font-family: 'Poppins', sans-serif;
  }

  .bshell-row {
    display: flex;
    min-height: calc(100vh - 72px);
    font-family: 'Poppins', sans-serif;
  }

  .bshell-sidebar {
    width: 260px;
    background: #ffffff;
    border-right: 1px solid #E5E7EB;
    padding: 32px 16px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  #bshell-toggle:checked ~ .bshell-row .bshell-sidebar {
    width: 0;
    padding: 32px 0;
    opacity: 0;
    transform: translateX(-260px);
    border-right: none;
  }

  .bshell-side-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    text-decoration: none;
    color: #111827;
    font-size: 14px;
    font-weight: 500;
    border-radius: 8px;
    margin-bottom: 4px;
    white-space: nowrap;
  }
  .bshell-side-item:hover:not(.is-active) { background: #f3f4f6; }
  .bshell-side-item.is-active {
    background: #EBF2FF;
    color: #1A56DB;
    border-left: 4px solid #1A56DB;
    padding-left: 12px;
  }
  .bshell-side-icon { width: 20px; display: inline-flex; justify-content: center; }

  .bshell-divider {
    margin: 8px 16px;
    border-top: 1px solid #E5E7EB;
    opacity: 0.6;
  }
  .bshell-logout { color: #ef4444; }
  .bshell-logout:hover:not(.is-active) { background: #fef2f2; }
`;

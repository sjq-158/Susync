"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/seller/properties", match: ["/seller/properties", "/seller/dashboard"], icon: "home", label: "My Properties" },
  { href: "/seller/sales", icon: "trending_up", label: "Sales Activity" },
  { href: "/seller/messages", icon: "chat_bubble", label: "Inquiries (12)" },
  { href: "/seller/documents", icon: "description", label: "Documents" },
  { href: "/seller/settings", icon: "settings", label: "Settings" },
];

export default function SellerShell({ children }) {
  const pathname = usePathname() || "";

  return (
    <>
      <style>{SHELL_CSS}</style>

      <input type="checkbox" id="sshell-toggle" className="sshell-toggle-input" />

      <div className="sshell-topbar">
        <div className="sshell-topbar-left">
          <label htmlFor="sshell-toggle" className="sshell-hamburger" aria-label="Toggle sidebar">
            <span></span>
            <span></span>
            <span></span>
          </label>
          <Link href="/seller/dashboard" className="sshell-logo">
            <div className="sshell-logo-box">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              </svg>
            </div>
            <span className="sshell-logo-text">Susync</span>
          </Link>
        </div>
        <div className="sshell-user">
          <div className="sshell-user-meta">
            <div className="sshell-user-name">Maria Santos</div>
            <div className="sshell-user-role">Seller Account</div>
          </div>
          <div className="sshell-avatar">M</div>
        </div>
      </div>

      <div className="sshell-row">
        <div className="sshell-sidebar">
          {NAV.map((item) => {
            const targets = Array.isArray(item.match) ? item.match : [item.match || item.href.split("?")[0]];
            const active = targets.some((t) => pathname === t || pathname.startsWith(t + "/"));
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`sshell-side-item${active ? " is-active" : ""}`}
              >
                <span className="material-icons sshell-side-icon">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
          <div className="sshell-divider"></div>
          <Link href="/" className="sshell-side-item sshell-logout">
            <span className="material-icons sshell-side-icon">logout</span>
            <span>Logout</span>
          </Link>
        </div>

        {children}
      </div>
    </>
  );
}

const SHELL_CSS = `
  .sshell-toggle-input { display: none; }

  .sshell-topbar {
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
  .sshell-topbar-left { display: flex; align-items: center; gap: 20px; }
  .sshell-hamburger {
    cursor: pointer;
    padding: 10px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    transition: background 0.2s;
  }
  .sshell-hamburger:hover { background: #fbfbf9; }
  .sshell-hamburger span { width: 22px; height: 2px; background: #111827; border-radius: 2px; }

  .sshell-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
  .sshell-logo-box {
    width: 32px; height: 32px;
    background: #1A56DB;
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
  }
  .sshell-logo-text { font-size: 22px; font-weight: 700; color: #1A56DB; }

  .sshell-user { display: flex; align-items: center; gap: 12px; }
  .sshell-user-meta { text-align: right; }
  .sshell-user-name { font-size: 14px; font-weight: 700; color: #111827; }
  .sshell-user-role { font-size: 11px; color: #6B7280; }
  .sshell-avatar {
    width: 40px; height: 40px;
    border-radius: 50%;
    background: #92400E;
    color: #ffffff;
    display: flex; align-items: center; justify-content: center;
    font-weight: 700;
    font-size: 16px;
    font-family: 'Poppins', sans-serif;
  }

  .sshell-row {
    display: flex;
    min-height: calc(100vh - 72px);
    font-family: 'Poppins', sans-serif;
  }

  .sshell-sidebar {
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
  #sshell-toggle:checked ~ .sshell-row .sshell-sidebar {
    width: 0;
    padding: 32px 0;
    opacity: 0;
    transform: translateX(-260px);
    border-right: none;
  }

  .sshell-side-item {
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
    transition: all 0.15s;
  }
  .sshell-side-item:hover:not(.is-active) { background: #f3f4f6; }
  .sshell-side-item.is-active {
    background: #FEF3C7;
    color: #92400E;
    border-left: 4px solid #92400E;
    padding-left: 12px;
    font-weight: 600;
  }
  .sshell-side-icon { font-size: 18px !important; }

  .sshell-divider {
    margin: 8px 16px;
    border-top: 1px solid #E5E7EB;
    opacity: 0.6;
  }
  .sshell-logout { color: #ef4444; }
  .sshell-logout:hover:not(.is-active) { background: #fef2f2; }
`;

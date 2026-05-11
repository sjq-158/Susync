"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/buyer/properties", label: "Browse Properties" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
        <div className="nav-inner">
          <Link href="/" className="nav-logo">
            <span className="logo-icon">🏠</span>
            <span className="logo-text">Susync</span>
          </Link>

          <nav className="nav-links" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${pathname === link.href ? "nav-link-active" : ""}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="nav-actions">
            <Link href="/login" className="btn-login">
              Login
            </Link>
            <Link href="/register" className="btn-started">
              Get Started
            </Link>
          </div>

          <button
            className="nav-hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            <span className={`ham-line ${menuOpen ? "open-1" : ""}`} />
            <span className={`ham-line ${menuOpen ? "open-2" : ""}`} />
            <span className={`ham-line ${menuOpen ? "open-3" : ""}`} />
          </button>
        </div>

        <div className={`mobile-menu ${menuOpen ? "mobile-menu-open" : ""}`} aria-hidden={!menuOpen}>
          <nav className="mob-links">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`mob-link ${pathname === link.href ? "mob-link-active" : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mob-actions">
            <Link href="/login" className="btn-login btn-login-full" onClick={() => setMenuOpen(false)}>
              Login
            </Link>
            <Link href="/register" className="btn-started btn-started-full" onClick={() => setMenuOpen(false)}>
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <style jsx>{`
        .navbar {
          position: sticky;
          top: 0;
          z-index: 50;
          background: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          transition: box-shadow 0.2s ease;
          font-family: "Poppins", sans-serif;
        }

        .navbar-scrolled {
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
        }

        .nav-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 40px;
          height: 64px;
          display: flex;
          align-items: center;
          gap: 0;
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          font-weight: 700;
          font-size: 1.1rem;
          color: #1e293b;
          flex-shrink: 0;
          margin-right: 40px;
        }

        .logo-icon {
          background: #2563eb;
          border-radius: 8px;
          padding: 4px 6px;
          font-size: 1rem;
        }

        .logo-text {
          color: #1e293b;
          font-weight: 700;
        }

        .nav-links {
          display: flex;
          gap: 8px;
          flex: 1;
          align-items: center;
        }

        .nav-link {
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          color: #64748b;
          padding: 6px 12px;
          border-radius: 8px;
          transition: color 0.15s ease, background 0.15s ease;
          white-space: nowrap;
        }

        .nav-link:hover {
          color: #1e293b;
          background: #f8fafc;
        }

        .nav-link-active {
          color: #2563eb;
          font-weight: 600;
        }

        .nav-actions {
          display: flex;
          gap: 12px;
          align-items: center;
          margin-left: auto;
          flex-shrink: 0;
        }

        .btn-login {
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          color: #1e293b;
          padding: 8px 18px;
          border-radius: 8px;
          transition: background 0.15s ease;
          white-space: nowrap;
          font-family: "Poppins", sans-serif;
        }

        .btn-login:hover {
          background: #f1f5f9;
        }

        .btn-started {
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 600;
          color: #ffffff;
          background: #2563eb;
          padding: 8px 20px;
          border-radius: 8px;
          transition: background 0.15s ease, transform 0.1s ease;
          white-space: nowrap;
          font-family: "Poppins", sans-serif;
        }

        .btn-started:hover {
          background: #1d4ed8;
          transform: translateY(-1px);
        }

        .btn-started:active {
          transform: translateY(0);
        }

        .nav-hamburger {
          display: none;
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
          margin-left: auto;
          flex-shrink: 0;
        }

        .nav-hamburger:hover {
          background: #f1f5f9;
        }

        .nav-hamburger:focus-visible {
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

        .mobile-menu {
          display: none;
          flex-direction: column;
          padding: 0 20px 20px;
          background: #ffffff;
          border-top: 1px solid #f1f5f9;
          overflow: hidden;
          max-height: 0;
          transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1),
            padding 0.3s ease;
        }

        .mobile-menu-open {
          max-height: 400px;
          padding: 16px 20px 24px;
        }

        .mob-links {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .mob-link {
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: 500;
          color: #475569;
          padding: 12px 4px;
          border-bottom: 1px solid #f1f5f9;
          transition: color 0.15s ease;
          font-family: "Poppins", sans-serif;
        }

        .mob-link:hover {
          color: #1e293b;
        }

        .mob-link-active {
          color: #2563eb;
          font-weight: 600;
        }

        .mob-actions {
          display: flex;
          gap: 12px;
          padding-top: 16px;
          align-items: center;
        }

        .btn-login-full {
          flex: 1;
          text-align: center;
          border: 1px solid #e2e8f0;
          padding: 10px 18px;
          border-radius: 8px;
        }

        .btn-started-full {
          flex: 1;
          text-align: center;
          padding: 10px 18px;
        }

        @media (max-width: 768px) {
          .nav-links {
            display: none;
          }

          .nav-actions {
            display: none;
          }

          .nav-hamburger {
            display: flex;
          }

          .mobile-menu {
            display: flex;
          }

          .nav-inner {
            padding: 0 20px;
          }

          .nav-logo {
            margin-right: 0;
          }
        }

        @media (max-width: 480px) {
          .nav-inner {
            padding: 0 16px;
          }
        }

        @media (min-width: 769px) {
          .mobile-menu {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
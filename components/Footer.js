import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Link href="/" className="footer-logo">
            <span className="logo-icon">🏠</span>
            <span className="logo-text">Susync</span>
          </Link>
          <p className="footer-tagline">
            Philippines&apos; first all-in-one digital real estate platform. No
            middlemen, no paperwork.
          </p>
        </div>

        {/* Product Section */}
        <div className="footer-col">
          <h4 className="footer-heading">PRODUCT</h4>
          <Link href="/buyer/properties" className="footer-link">
            Browse Properties
          </Link>
          <Link href="/#how-it-works" className="footer-link">
            How It Works
          </Link>
          <Link href="/virtual-tours" className="footer-link">
            Virtual Tours
          </Link>
        </div>

        {/* Company Section */}
        <div className="footer-col">
          <h4 className="footer-heading">COMPANY</h4>
          <Link href="/about" className="footer-link">
            About Us
          </Link>
          <Link href="/careers" className="footer-link">
            Careers
          </Link>
          <Link href="/contact" className="footer-link">
            Contact Us
          </Link>
        </div>

        {/* Support Section */}
        <div className="footer-col">
          <h4 className="footer-heading">SUPPORT</h4>
          <Link href="/help" className="footer-link">
            Help Center
          </Link>
          <Link href="/privacy" className="footer-link">
            Privacy Policy
          </Link>
          <Link href="/terms" className="footer-link">
            Terms of Service
          </Link>
        </div>
      </div>

      <div className="footer-bottom">
        <span className="footer-copy">
          &copy; 2025 Susync Inc. All rights reserved. Licensed by HLURB.
        </span>
        <span className="footer-badges">
          DICT Compliant &middot; 256-bit SSL Encrypted
        </span>
      </div>

      <style jsx>{`
        .footer {
          background: #0f172a;
          color: #94a3b8;
          padding-top: 64px;
          font-family: "Poppins", sans-serif;
        }

        .footer-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 40px 56px;
          display: grid;
          grid-template-columns: 2.2fr 1fr 1fr 1fr;
          gap: 48px;
          align-items: start;
        }

        .footer-brand {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          font-weight: 700;
          font-size: 1.15rem;
          color: #f8fafc;
        }

        .logo-icon {
          background: #2563eb;
          border-radius: 8px;
          padding: 4px 6px;
          font-size: 1rem;
        }

        .logo-text {
          color: #f8fafc;
          font-weight: 700;
        }

        .footer-tagline {
          font-size: 0.875rem;
          line-height: 1.7;
          color: #64748b;
          max-width: 270px;
          margin: 0;
        }

        .footer-col {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .footer-heading {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: #f1f5f9;
          margin: 0 0 4px 0;
          text-transform: uppercase;
        }

        .footer-link {
          text-decoration: none;
          font-size: 0.875rem;
          color: #64748b;
          transition: color 0.15s ease;
          line-height: 1.4;
        }

        .footer-link:hover {
          color: #e2e8f0;
        }

        .footer-bottom {
          max-width: 1280px;
          margin: 0 auto;
          padding: 22px 40px;
          border-top: 1px solid #1e293b;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.8rem;
          color: #475569;
          flex-wrap: wrap;
          gap: 8px;
        }

        .footer-copy {
          color: #475569;
        }

        .footer-badges {
          color: #475569;
          white-space: nowrap;
        }

        /* ── Tablet ── */
        @media (max-width: 1024px) {
          .footer-inner {
            grid-template-columns: 1fr 1fr 1fr;
            gap: 36px;
            padding: 0 32px 48px;
          }

          .footer-brand {
            grid-column: 1 / -1;
          }

          .footer-tagline {
            max-width: 400px;
          }

          .footer-bottom {
            padding: 20px 32px;
          }
        }

        /* ── Large mobile ── */
        @media (max-width: 768px) {
          .footer-inner {
            grid-template-columns: 1fr 1fr;
            gap: 32px;
            padding: 0 24px 40px;
          }

          .footer-brand {
            grid-column: 1 / -1;
          }

          .footer-bottom {
            padding: 18px 24px;
            flex-direction: column;
            align-items: flex-start;
            gap: 6px;
          }
        }

        /* ── Small mobile ── */
        @media (max-width: 480px) {
          .footer {
            padding-top: 48px;
          }

          .footer-inner {
            grid-template-columns: 1fr 1fr;
            gap: 28px;
            padding: 0 20px 36px;
          }

          .footer-bottom {
            padding: 16px 20px;
          }

          .footer-badges {
            white-space: normal;
          }
        }
      `}</style>
    </footer>
  );
}
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

function EyeOff() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  );
}

function Eye() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export default function AuthLoginClient() {
  const router = useRouter();
  const [show, setShow] = useState(false);

  return (
    <>
      <Link href="/" className="logo-head">
        <div className="logo-box">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          </svg>
        </div>
        <span className="logo-txt">Susync</span>
      </Link>
      <div className="auth-card">
        <div className="tabs">
          <div className="tab active">Login</div>
          <Link
            href="/register"
            className="tab"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "inherit",
            }}
          >
            Register
          </Link>
        </div>
        <h2 style={{ fontWeight: 700, marginBottom: 8, textAlign: "center" }}>Welcome back</h2>
        <p style={{ color: "var(--neutral-500)", fontSize: 14, marginBottom: 32, textAlign: "center" }}>Sign in to your Susync account</p>

        <div className="form-group">
          <label>Email Address</label>
          <input type="email" placeholder="you@email.com" />
        </div>
        <div className="form-group">
          <label>Password</label>
          <div className="input-with-icon">
            <input type={show ? "text" : "password"} placeholder="Password" />
            <button type="button" className="password-toggle-btn" aria-label="Toggle password visibility" onClick={() => setShow((s) => !s)}>
              {show ? <Eye /> : <EyeOff />}
            </button>
          </div>
        </div>
        <div style={{ textAlign: "right", marginBottom: 16 }}>
          <Link href="/help" style={{ fontSize: 12, color: "var(--primary)", textDecoration: "none", fontWeight: 600 }}>
            Forgot Password?
          </Link>
        </div>

        <button type="button" className="btn-submit" onClick={() => router.push("/buyer/dashboard")}>
          Login
        </button>
      </div>
      <div className="trust-row">
        <div className="trust-item">🔒 256-bit SSL</div>
        <div className="trust-item">🛡️ DICT Compliant</div>
        <div className="trust-item">✅ Secure Platform</div>
      </div>
    </>
  );
}

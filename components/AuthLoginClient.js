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

// Demo credentials pulled from seed.sql
const DEMO_USERS = [
  { email: "juan@example.com",         password: "password123", role: "buyer"  },
  { email: "maria.santos@email.com",   password: "password123", role: "seller" },
  { email: "carlos@example.com",       password: "password123", role: "seller" },
];

export default function AuthLoginClient() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [error, setError]               = useState("");
  const [loading, setLoading]           = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    // Simulate network delay for realism
    await new Promise((r) => setTimeout(r, 800));

    const match = DEMO_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!match) {
      setLoading(false);
      setError("Incorrect email or password. Try a demo account below.");
      return;
    }

    router.push(match.role === "seller" ? "/seller/dashboard" : "/buyer/dashboard");
  };

  const fillDemo = (user) => {
    setEmail(user.email);
    setPassword(user.password);
    setError("");
  };

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        :root {
          --primary: #1A56DB;
          --primary-100: #EBF2FF;
          --neutral-900: #111827;
          --neutral-500: #6B7280;
          --border: #E5E7EB;
          --error: #DC2626;
          --error-bg: #FEF2F2;
          --error-border: #FECACA;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: 'Poppins', sans-serif;
          background: var(--primary-100);
          width: 1440px;
          margin: 0 auto;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .logo-head { display: flex; align-items: center; gap: 8px; margin-bottom: 32px; text-decoration: none; }
        .logo-box { width: 36px; height: 36px; background: var(--primary); border-radius: 10px; display: flex; align-items: center; justify-content: center; }
        .logo-txt { font-size: 24px; font-weight: 700; color: var(--primary); letter-spacing: -0.5px; }

        .auth-card { background: white; width: 480px; padding: 40px; border-radius: 20px; box-shadow: 0 8px 32px rgba(26,23,20,0.16); }

        .tabs { display: flex; background: #F3F4F6; padding: 4px; border-radius: 14px; margin-bottom: 32px; }
        .tab { flex: 1; padding: 10px; text-align: center; font-size: 14px; font-weight: 600; color: var(--neutral-500); cursor: pointer; border-radius: 10px; border: none; background: transparent; font-family: inherit; text-decoration: none; display: flex; align-items: center; justify-content: center; transition: background 0.15s, color 0.15s; }
        .tab.active { background: var(--primary); color: white; box-shadow: 0 1px 4px rgba(0,0,0,0.1); }
        .tab:not(.active):hover { background: #E5E7EB; }

        .form-group { margin-bottom: 20px; text-align: left; }
        label { display: block; font-size: 14px; font-weight: 500; margin-bottom: 6px; color: var(--neutral-900); }
        input[type="email"], input[type="text"], input[type="password"] {
          width: 100%; height: 48px; border: 1.5px solid var(--border); border-radius: 10px;
          padding: 0 16px; font-family: inherit; font-size: 14px; outline: none;
          transition: border-color 0.15s;
        }
        input:focus { border-color: var(--primary); }
        input.error-field { border-color: var(--error-border); background: var(--error-bg); }

        .input-with-icon { position: relative; width: 100%; }
        .input-with-icon input { padding-right: 44px; }
        .password-toggle-btn { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: var(--neutral-500); padding: 0; display: flex; align-items: center; justify-content: center; }
        .password-toggle-btn:hover { color: var(--neutral-900); }

        .error-banner {
          background: var(--error-bg);
          border: 1px solid var(--error-border);
          border-radius: 10px;
          padding: 12px 14px;
          font-size: 13px;
          color: var(--error);
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-submit {
          width: 100%; height: 48px; background: var(--primary); color: white;
          border: none; border-radius: 10px; font-weight: 600; font-size: 16px;
          margin-top: 12px; cursor: pointer; font-family: inherit;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: background 0.15s, opacity 0.15s, transform 0.1s;
        }
        .btn-submit:hover:not(:disabled) { background: #1547C0; }
        .btn-submit:active:not(:disabled) { transform: scale(0.98); }
        .btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }

        .spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .demo-accounts { margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--border); }
        .demo-label { font-size: 12px; color: var(--neutral-500); margin-bottom: 10px; font-weight: 500; }
        .demo-pills { display: flex; gap: 8px; flex-wrap: wrap; }
        .demo-pill {
          padding: 6px 12px; border-radius: 20px; border: 1.5px solid var(--border);
          font-size: 12px; font-weight: 600; cursor: pointer; background: white;
          color: var(--neutral-900); font-family: inherit;
          transition: border-color 0.15s, background 0.15s;
        }
        .demo-pill:hover { border-color: var(--primary); color: var(--primary); background: var(--primary-100); }
        .demo-pill:active { transform: scale(0.97); }

        .trust-row { display: flex; gap: 24px; margin-top: 40px; }
        .trust-item { font-size: 12px; color: var(--neutral-500); display: flex; align-items: center; gap: 6px; }
      `}</style>

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
          <button type="button" className="tab active">Login</button>
          <Link href="/register" className="tab" style={{ textDecoration: "none" }}>Register</Link>
        </div>

        <h2 style={{ fontWeight: 700, marginBottom: 8, textAlign: "center" }}>Welcome back</h2>
        <p style={{ color: "var(--neutral-500)", fontSize: 14, marginBottom: 32, textAlign: "center" }}>
          Sign in to your Susync account
        </p>

        {error && (
          <div className="error-banner">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              className={error ? "error-field" : ""}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-with-icon">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                className={error ? "error-field" : ""}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                aria-label="Toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <Eye /> : <EyeOff />}
              </button>
            </div>
          </div>

          <div style={{ textAlign: "right", marginBottom: 16 }}>
            <Link href="#" style={{ fontSize: 12, color: "var(--primary)", textDecoration: "none", fontWeight: 600 }}>
              Forgot Password?
            </Link>
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner" />
                Signing in...
              </>
            ) : "Login"}
          </button>
        </form>

        <div className="demo-accounts">
          <div className="demo-label">Quick demo accounts — click to auto-fill:</div>
          <div className="demo-pills">
            {DEMO_USERS.map((u) => (
              <button
                key={u.email}
                type="button"
                className="demo-pill"
                onClick={() => fillDemo(u)}
              >
                {u.role === "buyer" ? "👤" : "🏠"} {u.email.split("@")[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="trust-row">
        <div className="trust-item">🔒 256-bit SSL</div>
        <div className="trust-item">🛡️ DICT Compliant</div>
        <div className="trust-item">✅ Secure Platform</div>
      </div>
    </>
  );
}
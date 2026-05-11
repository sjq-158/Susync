"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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

function Check() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function AuthRegisterClient() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const initialSeller = searchParams.get("role") === "seller";
  const [roleSeller, setRoleSeller] = useState(initialSeller);
  const [showPw, setShowPw]               = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    // Clear specific error on change
    if (errors[name]) setErrors((prev) => { const n = { ...prev }; delete n[name]; return n; });
  };

  const validate = () => {
    const e = {};
    if (!formData.firstName.trim())     e.firstName = "First name is required.";
    if (!formData.lastName.trim())      e.lastName  = "Last name is required.";
    if (!formData.email.trim())         e.email     = "Email is required.";
    if (!formData.password)             e.password  = "Password is required.";
    else if (formData.password.length < 8) e.password = "Password must be at least 8 characters.";
    if (formData.password !== formData.confirmPassword)
      e.confirmPassword = "Passwords do not match.";
    if (!formData.agreeTerms)           e.agreeTerms = "You must agree to the Terms of Service.";
    return e;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    router.push(roleSeller ? "/seller/dashboard" : "/buyer/dashboard");
  };

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        :root {
          --primary-500: hsl(220, 74%, 48%);
          --primary-100: hsl(220, 74%, 95%);
          --neutral-900: hsl(30, 13%, 9%);
          --neutral-500: hsl(30, 4%, 53%);
          --neutral-100: hsl(60, 11%, 98%);
          --border: hsl(30, 6%, 85%);
          --shadow-overlay: 0 8px 32px rgba(26,23,20,0.16);
          --error: #DC2626;
          --error-bg: #FEF2F2;
          --error-border: #FECACA;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Poppins', sans-serif;
          background-color: var(--primary-100);
          width: 1440px;
          margin: 0 auto;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 0;
        }

        .logo-link { display: flex; align-items: center; gap: 8px; text-decoration: none; margin-bottom: 32px; }
        .logo-icon { width: 36px; height: 36px; background: var(--primary-500); border-radius: 12px; display: flex; align-items: center; justify-content: center; }
        .logo-text { font-size: 24px; font-weight: 700; color: var(--primary-500); }

        .auth-card { background: white; width: 480px; padding: 32px; border-radius: 1rem; border: 1px solid var(--border); box-shadow: var(--shadow-overlay); }

        .tab-switcher { display: flex; background: var(--neutral-100); padding: 4px; border-radius: 14px; margin-bottom: 32px; }
        .tab-btn {
          flex: 1; padding: 10px; border: none; border-radius: 8px;
          font-weight: 600; font-size: 14px; cursor: pointer;
          color: var(--neutral-500); background: transparent; font-family: inherit;
          text-decoration: none; display: flex; align-items: center; justify-content: center;
          transition: background 0.15s, color 0.15s;
        }
        .tab-btn.active { background: var(--primary-500); color: white; box-shadow: 0 1px 4px rgba(0,0,0,0.1); }
        .tab-btn:not(.active):hover { background: var(--border); }

        .form-title { text-align: center; margin-bottom: 24px; }
        .form-title h2 { font-size: 20px; font-weight: 700; color: var(--neutral-900); }
        .form-title p { font-size: 14px; color: var(--neutral-500); margin-top: 4px; }

        .field-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 4px; }
        .form-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
        label { font-size: 14px; font-weight: 500; color: var(--neutral-900); }

        input[type="text"],
        input[type="email"],
        input[type="password"],
        input[type="tel"] {
          height: 48px; padding: 0 16px;
          border: 1.5px solid var(--border); border-radius: 10px;
          font-family: inherit; font-size: 14px; outline: none;
          transition: border-color 0.15s;
          width: 100%;
        }
        input:focus { border-color: var(--primary-500); }
        input.error-field { border-color: var(--error-border) !important; background: var(--error-bg); }
        .field-error { font-size: 12px; color: var(--error); margin-top: 2px; }

        .input-with-icon { position: relative; width: 100%; }
        .input-with-icon input { padding-right: 44px; }
        .password-toggle-btn { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: var(--neutral-500); padding: 0; display: flex; align-items: center; }
        .password-toggle-btn:hover { color: var(--neutral-900); }

        .mobile-wrap { display: flex; gap: 8px; }
        .prefix { background: var(--neutral-100); border: 1.5px solid var(--border); border-radius: 10px; padding: 0 12px; display: flex; align-items: center; font-size: 14px; font-weight: 500; color: var(--neutral-900); white-space: nowrap; height: 48px; }

        .role-box { display: flex; background: var(--neutral-100); padding: 4px; border-radius: 14px; }
        .role-opt {
          flex: 1; padding: 10px; border-radius: 8px; border: none;
          font-weight: 600; font-size: 13px; cursor: pointer;
          color: var(--neutral-500); background: transparent; font-family: inherit;
          transition: background 0.15s, color 0.15s;
        }
        .role-opt.active { background: var(--primary-500); color: white; box-shadow: 0 1px 4px rgba(0,0,0,0.1); }
        .role-opt:not(.active):hover { background: var(--border); }

        /* Custom checkbox */
        .checkbox-row { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 20px; }
        .custom-checkbox {
          width: 18px; height: 18px; min-width: 18px;
          border: 1.5px solid var(--border); border-radius: 4px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; background: white; margin-top: 1px;
          transition: background 0.15s, border-color 0.15s;
        }
        .custom-checkbox.checked { background: var(--primary-500); border-color: var(--primary-500); }
        .custom-checkbox.cb-error { border-color: var(--error); }
        input[type="checkbox"].sr-only { position: absolute; opacity: 0; width: 0; height: 0; }
        .checkbox-label { font-size: 13px; color: var(--neutral-500); line-height: 1.5; cursor: pointer; }
        .checkbox-label a { color: var(--primary-500); text-decoration: none; font-weight: 500; }
        .checkbox-label a:hover { text-decoration: underline; }

        .btn-submit {
          width: 100%; height: 48px; background: var(--primary-500); color: white;
          border: none; border-radius: 10px; font-weight: 700; font-size: 16px;
          cursor: pointer; font-family: inherit;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: background 0.15s, transform 0.1s, opacity 0.15s;
        }
        .btn-submit:hover:not(:disabled) { background: hsl(220, 74%, 40%); }
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

        .trust-badges { display: flex; gap: 24px; margin-top: 24px; }
        .badge { font-size: 12px; color: var(--neutral-500); display: flex; align-items: center; gap: 6px; }
      `}</style>

      <Link href="/" className="logo-link">
        <div className="logo-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          </svg>
        </div>
        <span className="logo-text">Susync</span>
      </Link>

      <div className="auth-card">
        <div className="tab-switcher">
          <Link href="/login" className="tab-btn" style={{ textDecoration: "none" }}>Login</Link>
          <button type="button" className="tab-btn active">Register</button>
        </div>

        <form onSubmit={handleRegister} noValidate>
          <div className="form-title">
            <h2>Create your account</h2>
            <p>Join thousands of Filipino property seekers</p>
          </div>

          <div className="field-grid">
            <div className="form-field">
              <label htmlFor="firstName">First Name</label>
              <input
                id="firstName" type="text" name="firstName"
                placeholder="First Name" value={formData.firstName}
                onChange={handleInputChange}
                className={errors.firstName ? "error-field" : ""}
              />
              {errors.firstName && <span className="field-error">{errors.firstName}</span>}
            </div>
            <div className="form-field">
              <label htmlFor="lastName">Last Name</label>
              <input
                id="lastName" type="text" name="lastName"
                placeholder="Last Name" value={formData.lastName}
                onChange={handleInputChange}
                className={errors.lastName ? "error-field" : ""}
              />
              {errors.lastName && <span className="field-error">{errors.lastName}</span>}
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="email">Email Address</label>
            <input
              id="email" type="email" name="email"
              placeholder="you@email.com" value={formData.email}
              onChange={handleInputChange}
              className={errors.email ? "error-field" : ""}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="phone">Mobile Number</label>
            <div className="mobile-wrap">
              <div className="prefix">+63</div>
              <input
                id="phone" type="tel" name="phone"
                placeholder="9XX XXX XXXX"
                style={{ flex: 1 }}
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="password">Password</label>
            <div className="input-with-icon">
              <input
                id="password"
                type={showPw ? "text" : "password"} name="password"
                placeholder="Create a password" value={formData.password}
                onChange={handleInputChange}
                className={errors.password ? "error-field" : ""}
              />
              <button type="button" className="password-toggle-btn" onClick={() => setShowPw(!showPw)}>
                {showPw ? <Eye /> : <EyeOff />}
              </button>
            </div>
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-with-icon">
              <input
                id="confirmPassword"
                type={showConfirmPw ? "text" : "password"} name="confirmPassword"
                placeholder="Confirm your password" value={formData.confirmPassword}
                onChange={handleInputChange}
                className={errors.confirmPassword ? "error-field" : ""}
              />
              <button type="button" className="password-toggle-btn" onClick={() => setShowConfirmPw(!showConfirmPw)}>
                {showConfirmPw ? <Eye /> : <EyeOff />}
              </button>
            </div>
            {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
          </div>

          <div className="form-field">
            <label>I am a...</label>
            <div className="role-box">
              <button type="button" className={`role-opt${!roleSeller ? " active" : ""}`} onClick={() => setRoleSeller(false)}>
                Buyer / Renter
              </button>
              <button type="button" className={`role-opt${roleSeller ? " active" : ""}`} onClick={() => setRoleSeller(true)}>
                Seller / Landlord
              </button>
            </div>
          </div>

          <div className="checkbox-row">
            {/* Custom styled checkbox — fixes the broken native checkbox layout */}
            <div
              className={`custom-checkbox${formData.agreeTerms ? " checked" : ""}${errors.agreeTerms ? " cb-error" : ""}`}
              onClick={() => {
                setFormData((prev) => ({ ...prev, agreeTerms: !prev.agreeTerms }));
                if (errors.agreeTerms) setErrors((prev) => { const n = { ...prev }; delete n.agreeTerms; return n; });
              }}
              role="checkbox"
              aria-checked={formData.agreeTerms}
              tabIndex={0}
              onKeyDown={(e) => e.key === " " && e.currentTarget.click()}
            >
              {formData.agreeTerms && <Check />}
            </div>
            <label
              className="checkbox-label"
              onClick={() => {
                setFormData((prev) => ({ ...prev, agreeTerms: !prev.agreeTerms }));
                if (errors.agreeTerms) setErrors((prev) => { const n = { ...prev }; delete n.agreeTerms; return n; });
              }}
            >
              I agree to Susync&apos;s{" "}
              <Link href="/terms" onClick={(e) => e.stopPropagation()}>Terms of Service</Link>
              {" "}and{" "}
              <Link href="/privacy" onClick={(e) => e.stopPropagation()}>Privacy Policy</Link>
            </label>
          </div>
          {errors.agreeTerms && <div className="field-error" style={{ marginTop: -14, marginBottom: 14 }}>{errors.agreeTerms}</div>}

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner" />
                Creating account...
              </>
            ) : "Create Account"}
          </button>
        </form>
      </div>

      <div className="trust-badges">
        <div className="badge">🔒 256-bit SSL</div>
        <div className="badge">🛡️ DICT Compliant</div>
        <div className="badge">✅ Secure Platform</div>
      </div>
    </>
  );
}
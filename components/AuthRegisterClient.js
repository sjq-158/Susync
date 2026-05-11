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

export default function AuthRegisterClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSeller = searchParams.get("role") === "seller";
  const [roleSeller, setRoleSeller] = useState(initialSeller);
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

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
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      alert("Please fill in all required fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (!formData.agreeTerms) {
      alert("You must agree to the Terms of Service to continue.");
      return;
    }

    alert(`Success! Account created for ${formData.firstName}. Welcome to Susync!`);
    router.push(roleSeller ? "/seller/dashboard" : "/buyer/dashboard");
  };

  return (
    <>
      <style jsx global>{`
        :root {
            --primary-500: hsl(220, 74%, 48%); --primary-100: hsl(220, 74%, 95%);
            --neutral-900: hsl(30, 13%, 9%); --neutral-500: hsl(30, 4%, 53%); --neutral-100: hsl(60, 11%, 98%);
            --border: hsl(30, 6%, 85%); --radius: 0.875rem;
            --shadow-overlay: 0 8px 32px rgba(26,23,20,0.16);
        }
        body { font-family: 'Poppins', sans-serif; background-color: var(--primary-100); width: 1440px; margin: 0 auto; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        
        .logo-link { display: flex; align-items: center; gap: 8px; text-decoration: none; margin-bottom: 32px; }
        .logo-icon { width: 36px; height: 36px; background: var(--primary-500); border-radius: 12px; display: flex; align-items: center; justify-content: center; }
        .logo-text { font-size: 24px; font-weight: 700; color: var(--primary-500); }

        .auth-card { background: white; width: 480px; padding: 32px; border-radius: 1rem; border: 1px solid var(--border); box-shadow: var(--shadow-overlay); }
        
        .tab-switcher { display: flex; background: var(--neutral-100); padding: 4px; border-radius: 14px; margin-bottom: 32px; }
        .tab-btn { flex: 1; padding: 10px; border: none; border-radius: 8px; font-weight: 600; font-size: 14px; cursor: pointer; color: var(--neutral-500); background: transparent; }
        .tab-btn.active { background: var(--primary-500); color: white; box-shadow: 0 1px 4px rgba(0,0,0,0.1); }

        .form-title { text-align: center; margin-bottom: 24px; }
        .form-title h2 { font-size: 20px; font-weight: 700; color: var(--neutral-900); }
        .form-title p { font-size: 14px; color: var(--neutral-500); margin-top: 4px; }

        .field-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; }
        .form-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
        label { font-size: 14px; font-weight: 500; color: var(--neutral-900); }
        input { height: 48px; padding: 0 16px; border: 1.5px solid var(--border); border-radius: 10px; font-family: inherit; font-size: 14px; outline: none; }
        input:focus { border-color: var(--primary-500); }

        .input-with-icon { position: relative; width: 100%; }
        .input-with-icon input { width: 100%; padding-right: 40px; }
        .password-toggle-btn { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: var(--neutral-500); padding: 0; }
        
        .mobile-wrap { display: flex; gap: 8px; }
        .prefix { background: var(--neutral-100); border: 1.5px solid var(--border); border-radius: 10px; padding: 0 12px; display: flex; align-items: center; font-size: 14px; font-weight: 500; }

        .role-box { display: flex; background: var(--neutral-100); padding: 4px; border-radius: 14px; margin-bottom: 16px; }
        .role-opt { flex: 1; padding: 10px; border-radius: 8px; border: none; font-weight: 600; font-size: 13px; cursor: pointer; color: var(--neutral-500); background: transparent; }
        .role-opt.active { background: var(--primary-500); color: white; }

        .checkbox-row { display: flex; align-items: center; gap: 10px; margin-bottom: 24px; }
        .checkbox-row input[type="checkbox"] { width: 18px; height: 18px; margin: 0; cursor: pointer; accent-color: var(--primary-500); }
        .checkbox-row span { font-size: 13px; color: var(--neutral-500); line-height: 1; }
        .checkbox-row a { color: var(--primary-500); text-decoration: none; font-weight: 500; }

        .btn-submit { width: 100%; height: 48px; background: var(--primary-500); color: white; border: none; border-radius: 10px; font-weight: 700; font-size: 16px; cursor: pointer; }

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
          <Link href="/login" className="tab-btn" style={{ textDecoration: "none", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center" }}>
            Login
          </Link>
          <button type="button" className="tab-btn active">
            Register
          </button>
        </div>

        <form onSubmit={handleRegister}>
          <div className="form-title">
            <h2>Create your account</h2>
            <p>Join thousands of Filipino property seekers</p>
          </div>

          <div className="field-grid">
            <div className="form-field">
              <label>First Name</label>
              <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleInputChange} required />
            </div>
            <div className="form-field">
              <label>Last Name</label>
              <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleInputChange} required />
            </div>
          </div>

          <div className="form-field">
            <label>Email Address</label>
            <input type="email" name="email" placeholder="you@email.com" value={formData.email} onChange={handleInputChange} required />
          </div>

          <div className="form-field">
            <label>Mobile Number</label>
            <div className="mobile-wrap">
              <div className="prefix">+63</div>
              <input type="tel" name="phone" placeholder="9XX XXX XXXX" style={{ flex: 1 }} value={formData.phone} onChange={handleInputChange} />
            </div>
          </div>

          <div className="form-field">
            <label>Password</label>
            <div className="input-with-icon">
              <input type={showPw ? "text" : "password"} name="password" placeholder="Create a password" value={formData.password} onChange={handleInputChange} required />
              <button type="button" className="password-toggle-btn" aria-label="Toggle password visibility" onClick={() => setShowPw(!showPw)}>
                {showPw ? <Eye /> : <EyeOff />}
              </button>
            </div>
          </div>

          <div className="form-field">
            <label>Confirm Password</label>
            <div className="input-with-icon">
              <input type={showConfirmPw ? "text" : "password"} name="confirmPassword" placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleInputChange} required />
              <button type="button" className="password-toggle-btn" aria-label="Toggle confirm password visibility" onClick={() => setShowConfirmPw(!showConfirmPw)}>
                {showConfirmPw ? <Eye /> : <EyeOff />}
              </button>
            </div>
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
            <input type="checkbox" id="terms" name="agreeTerms" checked={formData.agreeTerms} onChange={handleInputChange} />
            <span>
              I agree to Susync&apos;s{" "}
              <Link href="/terms" style={{ color: "var(--primary-500)", textDecoration: "none", fontWeight: 500 }}>
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" style={{ color: "var(--primary-500)", textDecoration: "none", fontWeight: 500 }}>
                Privacy Policy
              </Link>
            </span>
          </div>

          <button type="submit" className="btn-submit">
            Create Account
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

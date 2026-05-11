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
  const [pw1, setPw1] = useState(false);
  const [pw2, setPw2] = useState(false);

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
          <Link href="/login" className="tab-btn" style={{ textDecoration: "none", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}>
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
              <input type={pw1 ? "text" : "password"} name="password" placeholder="Create a password" value={formData.password} onChange={handleInputChange} required />
              <button type="button" className="password-toggle-btn" aria-label="Toggle password visibility" onClick={() => setPw1((x) => !x)}>
                {pw1 ? <Eye /> : <EyeOff />}
              </button>
            </div>
          </div>

          <div className="form-field">
            <label>Confirm Password</label>
            <div className="input-with-icon">
              <input type={pw2 ? "text" : "password"} name="confirmPassword" placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleInputChange} required />
              <button type="button" className="password-toggle-btn" aria-label="Toggle confirm password visibility" onClick={() => setPw2((x) => !x)}>
                {pw2 ? <Eye /> : <EyeOff />}
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

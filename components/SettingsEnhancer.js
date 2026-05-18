"use client";

import { useEffect, useRef, useState } from "react";

const CONFIRM_PHRASE = "DELETE MY ACCOUNT";

export default function SettingsEnhancer() {
  const [modal, setModal] = useState(null); // null | "password" | "upload" | "delete"
  const [uploadCtx, setUploadCtx] = useState({ label: "", mode: "upload" });
  const fileInputRef = useRef(null);
  const avatarInputRef = useRef(null);
  const avatarElRef = useRef(null);

  // Password modal state
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwError, setPwError] = useState("");
  const [showPw, setShowPw] = useState({ current: false, next: false, confirm: false });

  // Upload modal state
  const [picked, setPicked] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);

  // Delete modal state
  const [confirmText, setConfirmText] = useState("");
  const [deletePw, setDeletePw] = useState("");
  const [ackChecked, setAckChecked] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Wire up the static HTML on mount.
  useEffect(() => {
    // Scope to either the standalone .susync-root (seller) or fall back to whole document (buyer is shell-wrapped).
    const scope = document;

    const cleanups = [];

    // 1. Remove "Edit Profile" button (in profile-header).
    scope.querySelectorAll(".profile-header .btn-outline-std").forEach((btn) => {
      if (btn.textContent.trim() === "Edit Profile") btn.remove();
    });

    // 2. Remove "Edit" button on Personal Information (.btn-action or .btn-text inside .card-title-row).
    scope.querySelectorAll(".card-title-row .btn-action, .card-title-row .btn-text").forEach((btn) => {
      if (btn.textContent.trim() === "Edit") btn.remove();
    });

    // 3. Wire Update Password buttons.
    scope.querySelectorAll("button.btn-outline-std").forEach((btn) => {
      if (btn.textContent.trim() === "Update Password") {
        const onClick = (e) => {
          e.preventDefault();
          setPwForm({ current: "", next: "", confirm: "" });
          setPwError("");
          setModal("password");
        };
        btn.addEventListener("click", onClick);
        cleanups.push(() => btn.removeEventListener("click", onClick));
      }
    });

    // 4. Wire Upload / Re-upload / Update buttons on verification cards.
    scope.querySelectorAll(".btn-upload").forEach((btn) => {
      const action = btn.textContent.trim(); // "Upload" | "Re-upload" | "Update"
      // The label sits in the sibling .verif-info / .verif-label container.
      const card = btn.closest(".verif-card, .verif-item");
      const label = card?.querySelector("h4")?.textContent?.trim() || "Document";
      const onClick = (e) => {
        e.preventDefault();
        setUploadCtx({ label, mode: action });
        setPicked(null);
        setUploadDone(false);
        setUploading(false);
        setModal("upload");
      };
      btn.addEventListener("click", onClick);
      cleanups.push(() => btn.removeEventListener("click", onClick));
    });

    // 4b. Wire profile avatar camera button.
    const camBtn = scope.querySelector(".profile-avatar-wrap .cam-btn");
    const avatarEl = scope.querySelector(".profile-avatar-wrap .profile-avatar");
    if (camBtn && avatarEl) {
      avatarElRef.current = avatarEl;
      const onCamClick = (e) => {
        e.preventDefault();
        avatarInputRef.current?.click();
      };
      camBtn.addEventListener("click", onCamClick);
      cleanups.push(() => camBtn.removeEventListener("click", onCamClick));
    }

    // 5. Wire Delete Account button.
    scope.querySelectorAll(".btn-destructive").forEach((btn) => {
      if (btn.textContent.trim() === "Delete Account") {
        const onClick = (e) => {
          e.preventDefault();
          setConfirmText("");
          setDeletePw("");
          setAckChecked(false);
          setDeleting(false);
          setModal("delete");
        };
        btn.addEventListener("click", onClick);
        cleanups.push(() => btn.removeEventListener("click", onClick));
      }
    });

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, []);

  // Close on Escape.
  useEffect(() => {
    if (!modal) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setModal(null);
    };
    window.addEventListener("keydown", onKey);
    // Lock body scroll.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [modal]);

  const closeModal = () => setModal(null);

  // --- Password submit ---
  const submitPassword = (e) => {
    e.preventDefault();
    if (!pwForm.current) return setPwError("Enter your current password.");
    if (pwForm.next.length < 8) return setPwError("New password must be at least 8 characters.");
    if (pwForm.next !== pwForm.confirm) return setPwError("New password and confirmation do not match.");
    if (pwForm.next === pwForm.current) return setPwError("New password must differ from current password.");
    setPwError("");
    // Demo: show success then close.
    alert("Password updated successfully.");
    closeModal();
  };

  // --- Upload handlers ---
  const openFilePicker = () => fileInputRef.current?.click();
  const onFilePicked = (e) => {
    const f = e.target.files?.[0];
    if (f) setPicked(f);
  };
  const submitUpload = () => {
    if (!picked || uploading) return;
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setUploadDone(true);
    }, 1200);
  };

  // --- Delete submit ---
  const canDelete = confirmText === CONFIRM_PHRASE && deletePw.length > 0 && ackChecked && !deleting;
  const submitDelete = (e) => {
    e.preventDefault();
    if (!canDelete) return;
    setDeleting(true);
    setTimeout(() => {
      setDeleting(false);
      closeModal();
      alert("Account deletion requested. (Demo only — no data changed.)");
    }, 1500);
  };

  return (
    <>
      <style>{MODAL_CSS}</style>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf,.doc,.docx"
        style={{ display: "none" }}
        onChange={onFilePicked}
      />

      <input
        ref={avatarInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          if (!f.type.startsWith("image/")) {
            alert("Please select an image file.");
            e.target.value = "";
            return;
          }
          const reader = new FileReader();
          reader.onload = (ev) => {
            const el = avatarElRef.current;
            if (!el) return;
            el.textContent = "";
            el.style.backgroundImage = `url(${ev.target.result})`;
            el.style.backgroundSize = "cover";
            el.style.backgroundPosition = "center";
          };
          reader.readAsDataURL(f);
          e.target.value = "";
        }}
      />

      {modal === "password" && (
        <div className="sx-modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="sx-modal" role="dialog" aria-modal="true" aria-labelledby="sx-pw-title">
            <div className="sx-modal-head">
              <h3 id="sx-pw-title">Update Password</h3>
              <button className="sx-modal-close" onClick={closeModal} aria-label="Close">
                <span className="material-icons">close</span>
              </button>
            </div>
            <form className="sx-modal-body" onSubmit={submitPassword}>
              <p className="sx-modal-sub">For your security, please confirm your current password before setting a new one.</p>

              <PasswordField
                label="Current Password"
                value={pwForm.current}
                onChange={(v) => setPwForm((s) => ({ ...s, current: v }))}
                show={showPw.current}
                onToggle={() => setShowPw((s) => ({ ...s, current: !s.current }))}
                autoFocus
              />
              <PasswordField
                label="New Password"
                value={pwForm.next}
                onChange={(v) => setPwForm((s) => ({ ...s, next: v }))}
                show={showPw.next}
                onToggle={() => setShowPw((s) => ({ ...s, next: !s.next }))}
                hint="At least 8 characters."
              />
              <PasswordField
                label="Confirm New Password"
                value={pwForm.confirm}
                onChange={(v) => setPwForm((s) => ({ ...s, confirm: v }))}
                show={showPw.confirm}
                onToggle={() => setShowPw((s) => ({ ...s, confirm: !s.confirm }))}
              />

              {pwError && <div className="sx-modal-error">{pwError}</div>}

              <div className="sx-modal-actions">
                <button type="button" className="sx-btn sx-btn-ghost" onClick={closeModal}>Cancel</button>
                <button type="submit" className="sx-btn sx-btn-primary">Update Password</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modal === "upload" && (
        <div className="sx-modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="sx-modal" role="dialog" aria-modal="true" aria-labelledby="sx-up-title">
            <div className="sx-modal-head">
              <h3 id="sx-up-title">{uploadCtx.mode} — {uploadCtx.label}</h3>
              <button className="sx-modal-close" onClick={closeModal} aria-label="Close">
                <span className="material-icons">close</span>
              </button>
            </div>
            <div className="sx-modal-body">
              {!uploadDone ? (
                <>
                  <p className="sx-modal-sub">
                    Upload a clear photo or PDF of your <strong>{uploadCtx.label}</strong>. Accepted formats: JPG, PNG, PDF (max 10MB).
                  </p>

                  <div
                    className={`sx-dropzone${picked ? " has-file" : ""}`}
                    onClick={openFilePicker}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const f = e.dataTransfer.files?.[0];
                      if (f) setPicked(f);
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && openFilePicker()}
                  >
                    {picked ? (
                      <>
                        <span className="material-icons sx-dz-icon">description</span>
                        <div className="sx-dz-name">{picked.name}</div>
                        <div className="sx-dz-meta">{(picked.size / 1024).toFixed(1)} KB · Click to replace</div>
                      </>
                    ) : (
                      <>
                        <span className="material-icons sx-dz-icon">cloud_upload</span>
                        <div className="sx-dz-name">Click to browse or drag a file here</div>
                        <div className="sx-dz-meta">JPG, PNG, or PDF</div>
                      </>
                    )}
                  </div>

                  {uploading && (
                    <div className="sx-progress">
                      <div className="sx-progress-bar" />
                      <span>Uploading…</span>
                    </div>
                  )}

                  <div className="sx-modal-actions">
                    <button type="button" className="sx-btn sx-btn-ghost" onClick={closeModal} disabled={uploading}>Cancel</button>
                    <button
                      type="button"
                      className="sx-btn sx-btn-primary"
                      onClick={submitUpload}
                      disabled={!picked || uploading}
                    >
                      {uploading ? "Uploading…" : "Submit for Review"}
                    </button>
                  </div>
                </>
              ) : (
                <div className="sx-success">
                  <span className="material-icons sx-success-icon">check_circle</span>
                  <h4>Upload received</h4>
                  <p>Your <strong>{uploadCtx.label}</strong> has been submitted. Verification typically completes within 1–2 business days.</p>
                  <div className="sx-modal-actions" style={{ justifyContent: "center" }}>
                    <button type="button" className="sx-btn sx-btn-primary" onClick={closeModal}>Done</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {modal === "delete" && (
        <div className="sx-modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && !deleting && closeModal()}>
          <div className="sx-modal sx-modal-danger" role="dialog" aria-modal="true" aria-labelledby="sx-del-title">
            <div className="sx-modal-head sx-modal-head-danger">
              <div className="sx-danger-title-wrap">
                <span className="material-icons sx-danger-icon">warning</span>
                <h3 id="sx-del-title">Delete account permanently</h3>
              </div>
              <button className="sx-modal-close" onClick={closeModal} aria-label="Close" disabled={deleting}>
                <span className="material-icons">close</span>
              </button>
            </div>
            <form className="sx-modal-body" onSubmit={submitDelete}>
              <div className="sx-danger-callout">
                <strong>This cannot be undone.</strong> All listings, transactions, messages, and verification documents tied to this account will be permanently removed.
              </div>

              <label className="sx-check">
                <input
                  type="checkbox"
                  checked={ackChecked}
                  onChange={(e) => setAckChecked(e.target.checked)}
                  disabled={deleting}
                />
                <span>I understand this action is permanent and irreversible.</span>
              </label>

              <div className="sx-field">
                <label className="sx-field-label">Confirm your password</label>
                <input
                  type="password"
                  className="sx-input"
                  value={deletePw}
                  onChange={(e) => setDeletePw(e.target.value)}
                  placeholder="Account password"
                  disabled={deleting}
                />
              </div>

              <div className="sx-field">
                <label className="sx-field-label">
                  Type <code className="sx-code">{CONFIRM_PHRASE}</code> to confirm
                </label>
                <input
                  type="text"
                  className="sx-input sx-input-mono"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder={CONFIRM_PHRASE}
                  disabled={deleting}
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>

              <div className="sx-modal-actions">
                <button type="button" className="sx-btn sx-btn-ghost" onClick={closeModal} disabled={deleting}>Cancel</button>
                <button
                  type="submit"
                  className="sx-btn sx-btn-danger"
                  disabled={!canDelete}
                >
                  {deleting ? "Deleting…" : "Delete account permanently"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function PasswordField({ label, value, onChange, show, onToggle, hint, autoFocus }) {
  return (
    <div className="sx-field">
      <label className="sx-field-label">{label}</label>
      <div className="sx-input-wrap">
        <input
          type={show ? "text" : "password"}
          className="sx-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoFocus={autoFocus}
        />
        <button type="button" className="sx-eye" onClick={onToggle} aria-label={show ? "Hide" : "Show"}>
          <span className="material-icons">{show ? "visibility_off" : "visibility"}</span>
        </button>
      </div>
      {hint && <div className="sx-field-hint">{hint}</div>}
    </div>
  );
}

const MODAL_CSS = `
  .sx-modal-backdrop {
    position: fixed; inset: 0;
    background: rgba(17, 24, 39, 0.55);
    display: flex; align-items: center; justify-content: center;
    z-index: 2000;
    padding: 24px;
    font-family: 'Poppins', sans-serif;
    animation: sx-fade 0.15s ease-out;
  }
  @keyframes sx-fade { from { opacity: 0; } to { opacity: 1; } }
  @keyframes sx-pop { from { transform: translateY(8px) scale(0.98); opacity: 0; } to { transform: none; opacity: 1; } }

  .sx-modal {
    width: 100%; max-width: 480px;
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 20px 50px rgba(17,24,39,0.25);
    overflow: hidden;
    animation: sx-pop 0.18s ease-out;
    color: #111827;
  }
  .sx-modal-danger { max-width: 520px; border: 1px solid rgba(239, 68, 68, 0.35); }

  .sx-modal-head {
    display: flex; align-items: center; justify-content: space-between;
    padding: 18px 24px;
    border-bottom: 1px solid #E5E7EB;
  }
  .sx-modal-head h3 { font-size: 16px; font-weight: 700; }
  .sx-modal-head-danger { background: rgba(239, 68, 68, 0.06); border-bottom-color: rgba(239,68,68,0.2); }
  .sx-danger-title-wrap { display: flex; align-items: center; gap: 10px; }
  .sx-danger-icon { color: #ef4444; font-size: 22px !important; }
  .sx-modal-head-danger h3 { color: #b91c1c; }

  .sx-modal-close {
    background: none; border: none; cursor: pointer;
    width: 32px; height: 32px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    color: #6B7280;
  }
  .sx-modal-close:hover { background: #f3f4f6; color: #111827; }
  .sx-modal-close .material-icons { font-size: 20px; }

  .sx-modal-body { padding: 22px 24px 24px; display: flex; flex-direction: column; gap: 14px; }
  .sx-modal-sub { font-size: 13px; color: #6B7280; line-height: 1.5; }

  .sx-field { display: flex; flex-direction: column; gap: 6px; }
  .sx-field-label { font-size: 12px; font-weight: 600; color: #374151; }
  .sx-field-hint { font-size: 11px; color: #6B7280; }

  .sx-input-wrap { position: relative; }
  .sx-input {
    width: 100%;
    padding: 10px 12px;
    border: 1.5px solid #E5E7EB;
    border-radius: 10px;
    font-size: 14px;
    font-family: inherit;
    color: #111827;
    background: #ffffff;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .sx-input:focus { outline: none; border-color: #1A56DB; box-shadow: 0 0 0 3px rgba(26,86,219,0.15); }
  .sx-input:disabled { background: #f9fafb; color: #6B7280; cursor: not-allowed; }
  .sx-input-mono { font-family: 'SFMono-Regular', Menlo, Consolas, monospace; letter-spacing: 0.5px; }

  .sx-eye {
    position: absolute; right: 8px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer;
    width: 30px; height: 30px; border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
    color: #6B7280;
  }
  .sx-eye:hover { background: #f3f4f6; color: #111827; }
  .sx-eye .material-icons { font-size: 18px; }

  .sx-modal-error {
    background: rgba(239, 68, 68, 0.08);
    border: 1px solid rgba(239, 68, 68, 0.25);
    color: #b91c1c;
    font-size: 12px;
    font-weight: 600;
    padding: 10px 12px;
    border-radius: 10px;
  }

  .sx-modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 6px; }
  .sx-btn {
    padding: 10px 18px;
    border-radius: 10px;
    font-weight: 700;
    font-size: 13px;
    font-family: inherit;
    cursor: pointer;
    border: 1.5px solid transparent;
    transition: all 0.15s;
  }
  .sx-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .sx-btn-ghost { background: #ffffff; border-color: #E5E7EB; color: #111827; }
  .sx-btn-ghost:hover:not(:disabled) { background: #fbfbf9; }
  .sx-btn-primary { background: #1A56DB; color: #ffffff; }
  .sx-btn-primary:hover:not(:disabled) { background: #1746b3; }
  .sx-btn-danger { background: #ef4444; color: #ffffff; }
  .sx-btn-danger:hover:not(:disabled) { background: #dc2626; }

  /* Dropzone */
  .sx-dropzone {
    border: 2px dashed #E5E7EB;
    border-radius: 12px;
    padding: 28px 16px;
    text-align: center;
    cursor: pointer;
    background: #fbfbf9;
    transition: all 0.15s;
  }
  .sx-dropzone:hover { border-color: #1A56DB; background: #EBF2FF; }
  .sx-dropzone.has-file { border-style: solid; border-color: #1A56DB; background: #EBF2FF; }
  .sx-dz-icon { font-size: 36px !important; color: #1A56DB; }
  .sx-dz-name { font-size: 13px; font-weight: 600; margin-top: 8px; word-break: break-all; }
  .sx-dz-meta { font-size: 11px; color: #6B7280; margin-top: 4px; }

  .sx-progress {
    display: flex; align-items: center; gap: 10px;
    font-size: 12px; color: #6B7280;
  }
  .sx-progress-bar {
    flex: 1; height: 4px; border-radius: 4px; background: #E5E7EB; position: relative; overflow: hidden;
  }
  .sx-progress-bar::after {
    content: ""; position: absolute; inset: 0;
    background: #1A56DB;
    animation: sx-prog 1.2s ease-in-out infinite;
  }
  @keyframes sx-prog {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }

  .sx-success { text-align: center; padding: 8px 0 4px; }
  .sx-success-icon { font-size: 48px !important; color: #15803d; }
  .sx-success h4 { font-size: 16px; font-weight: 700; margin: 8px 0 4px; }
  .sx-success p { font-size: 13px; color: #6B7280; line-height: 1.5; margin-bottom: 16px; }

  /* Danger modal extras */
  .sx-danger-callout {
    background: rgba(239, 68, 68, 0.08);
    border: 1px solid rgba(239, 68, 68, 0.25);
    color: #7f1d1d;
    font-size: 13px;
    line-height: 1.5;
    padding: 12px 14px;
    border-radius: 10px;
  }
  .sx-check { display: flex; align-items: flex-start; gap: 10px; font-size: 13px; color: #374151; cursor: pointer; }
  .sx-check input { margin-top: 3px; accent-color: #ef4444; width: 16px; height: 16px; }
  .sx-code {
    font-family: 'SFMono-Regular', Menlo, Consolas, monospace;
    background: #f3f4f6;
    border: 1px solid #E5E7EB;
    padding: 1px 6px;
    border-radius: 4px;
    font-size: 12px;
    color: #b91c1c;
    font-weight: 700;
  }
`;

"use client";

import { useEffect, useState } from "react";

function Modal({ open, onClose, children, maxWidth = 520 }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="pi-overlay" onClick={onClose}>
      <div className="pi-modal" style={{ maxWidth }} onClick={(e) => e.stopPropagation()}>
        <button className="pi-close" onClick={onClose} aria-label="Close">
          <span className="material-icons">close</span>
        </button>
        {children}
      </div>
    </div>
  );
}

export function PropertyActionRow({ title }) {
  const [share, setShare] = useState(false);
  const [report, setReport] = useState(false);
  const [copied, setCopied] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDetails, setReportDetails] = useState("");
  const [reportSent, setReportSent] = useState(false);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  const submitReport = (e) => {
    e.preventDefault();
    setReportSent(true);
    setTimeout(() => {
      setReport(false);
      setReportSent(false);
      setReportReason("");
      setReportDetails("");
    }, 1600);
  };

  return (
    <>
      <button className="pd-btn-icon pd-saved"><span className="material-icons" style={{ fontSize: 18 }}>favorite</span> Saved</button>
      <button className="pd-btn-icon" onClick={() => setShare(true)}>
        <span className="material-icons" style={{ fontSize: 18 }}>share</span> Share
      </button>
      <button className="pd-btn-icon" onClick={() => setReport(true)}>
        <span className="material-icons" style={{ fontSize: 18 }}>flag</span> Report
      </button>

      <Modal open={share} onClose={() => setShare(false)}>
        <h3 className="pi-title">Share this listing</h3>
        <p className="pi-sub">Send this property to friends or family.</p>

        <div className="pi-share-grid">
          {[
            ["Facebook", "share", "#1877F2"],
            ["X / Twitter", "alternate_email", "#111827"],
            ["Messenger", "chat", "#0084FF"],
            ["WhatsApp", "chat_bubble", "#25D366"],
            ["Email", "mail", "#6B7280"],
            ["SMS", "sms", "#1A56DB"],
          ].map(([label, icon, color]) => (
            <button key={label} className="pi-share-btn" type="button">
              <span className="material-icons" style={{ color }}>{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>

        <div className="pi-link-row">
          <input className="pi-link-input" readOnly value={shareUrl} />
          <button className="pi-btn-primary" onClick={copyLink}>
            <span className="material-icons" style={{ fontSize: 18 }}>{copied ? "check" : "content_copy"}</span>
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </Modal>

      <Modal open={report} onClose={() => setReport(false)}>
        {reportSent ? (
          <div className="pi-success">
            <span className="material-icons pi-success-icon">check_circle</span>
            <h3 className="pi-title">Report submitted</h3>
            <p className="pi-sub">Thank you. Our trust &amp; safety team will review this listing within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={submitReport}>
            <h3 className="pi-title">Report this listing</h3>
            <p className="pi-sub">Help us keep Susync safe. Tell us what&apos;s wrong with &quot;{title}&quot;.</p>

            <div className="pi-field">
              <label className="pi-label">Reason</label>
              <div className="pi-radio-list">
                {[
                  "Suspected scam or fraud",
                  "Inaccurate price or details",
                  "Photos don't match property",
                  "Already sold / no longer available",
                  "Inappropriate content",
                  "Other",
                ].map((r) => (
                  <label key={r} className="pi-radio">
                    <input
                      type="radio"
                      name="reason"
                      value={r}
                      checked={reportReason === r}
                      onChange={(e) => setReportReason(e.target.value)}
                      required
                    />
                    <span>{r}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pi-field">
              <label className="pi-label">Additional details (optional)</label>
              <textarea
                className="pi-textarea"
                rows={3}
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
                placeholder="Share any context that will help us investigate…"
              />
            </div>

            <div className="pi-actions">
              <button type="button" className="pi-btn-secondary" onClick={() => setReport(false)}>Cancel</button>
              <button type="submit" className="pi-btn-primary">
                <span className="material-icons" style={{ fontSize: 18 }}>send</span> Submit Report
              </button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}

export function PropertyGallery({ photos }) {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const total = photos.length;

  const openAt = (i) => {
    setIdx(i);
    setOpen(true);
  };
  const prev = () => setIdx((i) => (i - 1 + total) % total);
  const next = () => setIdx((i) => (i + 1) % total);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, total]);

  return (
    <>
      <div className="pd-gallery">
        <div className="pd-g-cell pd-g-main" onClick={() => openAt(0)} style={{ cursor: "pointer" }}>
          <img src={photos[0]} alt="Main" />
        </div>
        {photos.slice(1, 4).map((src, i) => (
          <div key={i} className="pd-g-cell" onClick={() => openAt(i + 1)} style={{ cursor: "pointer" }}>
            <img src={src} alt={`Photo ${i + 2}`} />
          </div>
        ))}
        <div className="pd-g-cell" onClick={() => openAt(Math.min(4, total - 1))} style={{ cursor: "pointer" }}>
          <img src={photos[4] || photos[0]} alt="More" />
          <div className="pd-more-overlay">+{total} photos</div>
        </div>
      </div>

      {open && (
        <div className="pi-lb-overlay" onClick={() => setOpen(false)}>
          <button className="pi-lb-close" onClick={() => setOpen(false)} aria-label="Close">
            <span className="material-icons">close</span>
          </button>
          <button className="pi-lb-nav pi-lb-prev" onClick={(e) => { e.stopPropagation(); prev(); }} aria-label="Previous">
            <span className="material-icons">chevron_left</span>
          </button>
          <div className="pi-lb-stage" onClick={(e) => e.stopPropagation()}>
            <img src={photos[idx]} alt={`Photo ${idx + 1}`} className="pi-lb-img" />
            <div className="pi-lb-counter">{idx + 1} / {total}</div>
            <div className="pi-lb-thumbs">
              {photos.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  onClick={() => setIdx(i)}
                  className={`pi-lb-thumb ${i === idx ? "pi-lb-thumb-active" : ""}`}
                />
              ))}
            </div>
          </div>
          <button className="pi-lb-nav pi-lb-next" onClick={(e) => { e.stopPropagation(); next(); }} aria-label="Next">
            <span className="material-icons">chevron_right</span>
          </button>
        </div>
      )}
    </>
  );
}

export function PropertyCTAButtons({ listingKind, propertyTitle, priceLabel }) {
  const [schedule, setSchedule] = useState(false);
  const [offer, setOffer] = useState(false);

  const [schedDate, setSchedDate] = useState("");
  const [schedTime, setSchedTime] = useState("");
  const [schedMode, setSchedMode] = useState("in-person");
  const [schedNotes, setSchedNotes] = useState("");
  const [schedSent, setSchedSent] = useState(false);

  const [offerAmount, setOfferAmount] = useState("");
  const [offerFinancing, setOfferFinancing] = useState("cash");
  const [offerMoveIn, setOfferMoveIn] = useState("");
  const [offerMessage, setOfferMessage] = useState("");
  const [offerSent, setOfferSent] = useState(false);

  const isRent = listingKind === "rent";

  const submitSchedule = (e) => {
    e.preventDefault();
    setSchedSent(true);
    setTimeout(() => {
      setSchedule(false);
      setSchedSent(false);
      setSchedDate("");
      setSchedTime("");
      setSchedNotes("");
    }, 1800);
  };

  const submitOffer = (e) => {
    e.preventDefault();
    setOfferSent(true);
    setTimeout(() => {
      setOffer(false);
      setOfferSent(false);
      setOfferAmount("");
      setOfferMoveIn("");
      setOfferMessage("");
    }, 1800);
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      <button className="pd-btn-outline" onClick={() => setSchedule(true)}>
        <span className="material-icons" style={{ fontSize: 18 }}>event</span> Schedule Viewing
      </button>
      <button className="pd-btn-outline pd-btn-accent" onClick={() => setOffer(true)}>
        <span className="material-icons" style={{ fontSize: 18 }}>handshake</span>
        {isRent ? " Reserve Unit" : " Make an Offer"}
      </button>

      <Modal open={schedule} onClose={() => setSchedule(false)}>
        {schedSent ? (
          <div className="pi-success">
            <span className="material-icons pi-success-icon">event_available</span>
            <h3 className="pi-title">Viewing requested</h3>
            <p className="pi-sub">The seller has been notified. You&apos;ll receive a confirmation in Messages once they approve the schedule.</p>
          </div>
        ) : (
          <form onSubmit={submitSchedule}>
            <h3 className="pi-title">Schedule a viewing</h3>
            <p className="pi-sub">Pick a date and time to visit &quot;{propertyTitle}&quot;.</p>

            <div className="pi-grid-2">
              <div className="pi-field">
                <label className="pi-label">Preferred date</label>
                <input
                  type="date"
                  className="pi-input"
                  min={today}
                  value={schedDate}
                  onChange={(e) => setSchedDate(e.target.value)}
                  required
                />
              </div>
              <div className="pi-field">
                <label className="pi-label">Preferred time</label>
                <select
                  className="pi-input"
                  value={schedTime}
                  onChange={(e) => setSchedTime(e.target.value)}
                  required
                >
                  <option value="">Select time…</option>
                  {["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pi-field">
              <label className="pi-label">Viewing mode</label>
              <div className="pi-mode-row">
                {[
                  ["in-person", "home_work", "In-Person"],
                  ["virtual", "videocam", "Virtual Tour"],
                ].map(([val, icon, label]) => (
                  <label key={val} className={`pi-mode ${schedMode === val ? "pi-mode-active" : ""}`}>
                    <input
                      type="radio"
                      name="mode"
                      value={val}
                      checked={schedMode === val}
                      onChange={(e) => setSchedMode(e.target.value)}
                    />
                    <span className="material-icons">{icon}</span>
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pi-field">
              <label className="pi-label">Notes for the seller (optional)</label>
              <textarea
                className="pi-textarea"
                rows={3}
                value={schedNotes}
                onChange={(e) => setSchedNotes(e.target.value)}
                placeholder="Any special requests or questions before the viewing…"
              />
            </div>

            <div className="pi-actions">
              <button type="button" className="pi-btn-secondary" onClick={() => setSchedule(false)}>Cancel</button>
              <button type="submit" className="pi-btn-primary">
                <span className="material-icons" style={{ fontSize: 18 }}>send</span> Send Request
              </button>
            </div>
          </form>
        )}
      </Modal>

      <Modal open={offer} onClose={() => setOffer(false)} maxWidth={560}>
        {offerSent ? (
          <div className="pi-success">
            <span className="material-icons pi-success-icon">handshake</span>
            <h3 className="pi-title">{isRent ? "Reservation sent" : "Offer submitted"}</h3>
            <p className="pi-sub">
              {isRent
                ? "Your reservation request has been sent. The seller will respond within 24 hours."
                : "Your offer has been sent to the seller. You can track its status in My Transactions."}
            </p>
          </div>
        ) : (
          <form onSubmit={submitOffer}>
            <h3 className="pi-title">{isRent ? "Reserve this unit" : "Make an offer"}</h3>
            <p className="pi-sub">
              Listing price: <strong>{priceLabel}{isRent ? " / mo" : ""}</strong>
            </p>

            <div className="pi-field">
              <label className="pi-label">{isRent ? "Your monthly offer (₱)" : "Your offer amount (₱)"}</label>
              <input
                type="number"
                className="pi-input"
                min="1"
                step="1000"
                value={offerAmount}
                onChange={(e) => setOfferAmount(e.target.value)}
                placeholder="e.g. 4500000"
                required
              />
            </div>

            {!isRent && (
              <div className="pi-field">
                <label className="pi-label">Financing</label>
                <select
                  className="pi-input"
                  value={offerFinancing}
                  onChange={(e) => setOfferFinancing(e.target.value)}
                >
                  <option value="cash">Cash</option>
                  <option value="bank">Bank Financing</option>
                  <option value="pag-ibig">Pag-IBIG Housing Loan</option>
                  <option value="in-house">In-House Financing</option>
                </select>
              </div>
            )}

            <div className="pi-field">
              <label className="pi-label">{isRent ? "Preferred move-in date" : "Target closing date"}</label>
              <input
                type="date"
                className="pi-input"
                min={today}
                value={offerMoveIn}
                onChange={(e) => setOfferMoveIn(e.target.value)}
                required
              />
            </div>

            <div className="pi-field">
              <label className="pi-label">Message to seller (optional)</label>
              <textarea
                className="pi-textarea"
                rows={3}
                value={offerMessage}
                onChange={(e) => setOfferMessage(e.target.value)}
                placeholder="Add a personal note or any conditions…"
              />
            </div>

            <div className="pi-tip">
              <span className="material-icons" style={{ fontSize: 18, color: "#1A56DB" }}>info</span>
              <span>Funds are <strong>only collected through Susync escrow</strong> once your offer is accepted. No payment is required now.</span>
            </div>

            <div className="pi-actions">
              <button type="button" className="pi-btn-secondary" onClick={() => setOffer(false)}>Cancel</button>
              <button type="submit" className="pi-btn-primary">
                <span className="material-icons" style={{ fontSize: 18 }}>send</span>
                {isRent ? " Send Reservation" : " Submit Offer"}
              </button>
            </div>
          </form>
        )}
      </Modal>

      <style jsx global>{`
        .pi-overlay {
          position: fixed; inset: 0; background: rgba(17, 24, 39, 0.55);
          display: flex; align-items: center; justify-content: center;
          z-index: 1000; padding: 20px; font-family: 'Poppins', sans-serif;
        }
        .pi-modal {
          background: #fff; border-radius: 16px; width: 100%;
          padding: 28px; position: relative; box-shadow: 0 20px 50px rgba(0,0,0,0.2);
          max-height: 92vh; overflow-y: auto;
        }
        .pi-close {
          position: absolute; top: 14px; right: 14px; background: transparent;
          border: none; cursor: pointer; color: #6B7280; padding: 4px;
          display: flex; align-items: center; justify-content: center;
        }
        .pi-close:hover { color: #111827; }
        .pi-title { font-size: 20px; font-weight: 800; color: #111827; margin: 0 0 6px; padding-right: 24px; }
        .pi-sub { font-size: 13px; color: #6B7280; margin: 0 0 18px; }
        .pi-field { margin-bottom: 14px; }
        .pi-label { display: block; font-size: 12px; font-weight: 700; color: #374151;
          text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
        .pi-input, .pi-textarea {
          box-sizing: border-box; width: 100%; padding: 10px 12px;
          border: 1px solid #E5E7EB; border-radius: 10px; font-size: 14px;
          font-family: inherit; color: #111827; background: #fff;
        }
        .pi-input:focus, .pi-textarea:focus {
          outline: none; border-color: #1A56DB; box-shadow: 0 0 0 3px #EBF2FF;
        }
        .pi-textarea { resize: vertical; min-height: 70px; }
        .pi-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .pi-mode-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .pi-mode {
          display: flex; align-items: center; gap: 8px; padding: 10px 14px;
          border: 1.5px solid #E5E7EB; border-radius: 10px; cursor: pointer;
          font-size: 13px; font-weight: 600; color: #374151; background: #fff;
        }
        .pi-mode input { display: none; }
        .pi-mode .material-icons { color: #6B7280; font-size: 18px; }
        .pi-mode-active { border-color: #1A56DB; background: #EBF2FF; color: #1A56DB; }
        .pi-mode-active .material-icons { color: #1A56DB; }
        .pi-radio-list { display: flex; flex-direction: column; gap: 6px; }
        .pi-radio { display: flex; align-items: center; gap: 8px; font-size: 13px;
          color: #374151; padding: 6px 0; cursor: pointer; }
        .pi-tip {
          display: flex; gap: 10px; align-items: flex-start;
          background: #EBF2FF; border-radius: 10px; padding: 12px 14px;
          font-size: 12px; color: #1E3A8A; line-height: 1.5; margin: 6px 0 14px;
        }
        .pi-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 6px; }
        .pi-btn-primary {
          padding: 10px 18px; background: #1A56DB; color: #fff; border-radius: 10px;
          font-size: 13px; font-weight: 700; cursor: pointer; border: none;
          display: inline-flex; align-items: center; gap: 6px; font-family: inherit;
        }
        .pi-btn-primary:hover { background: #1849b8; }
        .pi-btn-secondary {
          padding: 10px 18px; background: #fff; border: 1.5px solid #E5E7EB;
          color: #374151; border-radius: 10px; font-size: 13px; font-weight: 700;
          cursor: pointer; font-family: inherit;
        }
        .pi-btn-secondary:hover { background: #F3F4F6; }
        .pi-share-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 18px; }
        .pi-share-btn {
          display: flex; flex-direction: column; align-items: center; gap: 6px;
          padding: 14px 8px; background: #F9FAFB; border: 1px solid #E5E7EB;
          border-radius: 12px; cursor: pointer; font-size: 12px; font-weight: 600;
          color: #111827; font-family: inherit;
        }
        .pi-share-btn:hover { background: #EBF2FF; border-color: #1A56DB; }
        .pi-share-btn .material-icons { font-size: 24px; }
        .pi-link-row { display: flex; gap: 8px; }
        .pi-link-input {
          flex: 1; padding: 10px 12px; border: 1px solid #E5E7EB; border-radius: 10px;
          background: #F9FAFB; font-size: 12px; color: #374151; font-family: inherit;
        }
        .pi-success { text-align: center; padding: 12px 0; }
        .pi-success-icon { color: #15803D; font-size: 56px !important; margin-bottom: 8px; }

        .pi-lb-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.92);
          display: flex; align-items: center; justify-content: center;
          z-index: 1100; padding: 20px;
        }
        .pi-lb-close {
          position: absolute; top: 20px; right: 24px; background: rgba(255,255,255,0.1);
          border: none; color: #fff; width: 44px; height: 44px; border-radius: 50%;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
        }
        .pi-lb-close:hover { background: rgba(255,255,255,0.2); }
        .pi-lb-nav {
          position: absolute; top: 50%; transform: translateY(-50%);
          background: rgba(255,255,255,0.1); border: none; color: #fff;
          width: 52px; height: 52px; border-radius: 50%; cursor: pointer;
          display: flex; align-items: center; justify-content: center; z-index: 2;
        }
        .pi-lb-nav:hover { background: rgba(255,255,255,0.25); }
        .pi-lb-nav .material-icons { font-size: 32px; }
        .pi-lb-prev { left: 24px; }
        .pi-lb-next { right: 24px; }
        .pi-lb-stage {
          display: flex; flex-direction: column; align-items: center; gap: 16px;
          max-width: 90vw; max-height: 90vh;
        }
        .pi-lb-img {
          max-width: 85vw; max-height: 72vh; object-fit: contain; border-radius: 8px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.5);
        }
        .pi-lb-counter { color: #fff; font-size: 13px; font-weight: 600; font-family: 'Poppins', sans-serif; }
        .pi-lb-thumbs { display: flex; gap: 8px; max-width: 85vw; overflow-x: auto; padding: 4px; }
        .pi-lb-thumb {
          width: 70px; height: 50px; object-fit: cover; border-radius: 6px;
          cursor: pointer; opacity: 0.55; border: 2px solid transparent;
          flex-shrink: 0;
        }
        .pi-lb-thumb:hover { opacity: 0.85; }
        .pi-lb-thumb-active { opacity: 1; border-color: #fff; }
      `}</style>
    </>
  );
}

"use client";

import { useState } from "react";

export default function ContactSupportButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="tt-btn-outline" style={{ marginTop: 12 }} onClick={() => setOpen(true)}>
        <span className="material-icons" style={{ fontSize: 18 }}>support_agent</span>
        {" "}Contact Support
      </button>

      {open && (
        <div className="cs-overlay" onClick={() => setOpen(false)}>
          <div className="cs-modal" onClick={(e) => e.stopPropagation()}>
            <button className="cs-close" onClick={() => setOpen(false)} aria-label="Close">
              <span className="material-icons">close</span>
            </button>

            <div className="cs-header">
              <div className="cs-icon">
                <span className="material-icons">support_agent</span>
              </div>
              <div>
                <h3 className="cs-title">Contact Susync Support</h3>
                <p className="cs-sub">We're here to help 24/7 with your transaction.</p>
              </div>
            </div>

            <div className="cs-channels">
              <div className="cs-channel">
                <span className="material-icons cs-ch-icon">call</span>
                <div className="cs-ch-body">
                  <div className="cs-ch-label">Phone Support</div>
                  <div className="cs-ch-value">+63 (2) 8888-7777</div>
                  <div className="cs-ch-meta">Mon–Sun, 24/7 • Avg wait: 2 min</div>
                </div>
              </div>

              <div className="cs-channel">
                <span className="material-icons cs-ch-icon">mail</span>
                <div className="cs-ch-body">
                  <div className="cs-ch-label">Email Support</div>
                  <div className="cs-ch-value">support@susync.ph</div>
                  <div className="cs-ch-meta">Replies within 2 hours</div>
                </div>
              </div>

              <div className="cs-channel">
                <span className="material-icons cs-ch-icon">chat</span>
                <div className="cs-ch-body">
                  <div className="cs-ch-label">Live Chat</div>
                  <div className="cs-ch-value">Available in your dashboard</div>
                  <div className="cs-ch-meta">Instant • Average response &lt; 1 min</div>
                </div>
              </div>

              <div className="cs-channel">
                <span className="material-icons cs-ch-icon">location_on</span>
                <div className="cs-ch-body">
                  <div className="cs-ch-label">Head Office</div>
                  <div className="cs-ch-value">12F Susync Tower, BGC, Taguig City</div>
                  <div className="cs-ch-meta">Walk-ins: Mon–Fri, 9 AM – 6 PM</div>
                </div>
              </div>
            </div>

            <div className="cs-tip">
              <span className="material-icons" style={{ fontSize: 18, color: "#1A56DB" }}>info</span>
              <span>Have your <strong>transaction reference code</strong> ready when reaching out — it helps us assist you faster.</span>
            </div>

            <div className="cs-actions">
              <button className="cs-btn-secondary" onClick={() => setOpen(false)}>Close</button>
              <a href="mailto:support@susync.ph" className="cs-btn-primary">
                <span className="material-icons" style={{ fontSize: 18 }}>send</span> Email Support
              </a>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .cs-overlay {
          position: fixed; inset: 0; background: rgba(17, 24, 39, 0.55);
          display: flex; align-items: center; justify-content: center;
          z-index: 1000; padding: 20px; font-family: 'Poppins', sans-serif;
        }
        .cs-modal {
          background: #fff; border-radius: 16px; width: 100%; max-width: 520px;
          padding: 28px; position: relative; box-shadow: 0 20px 50px rgba(0,0,0,0.2);
          max-height: 90vh; overflow-y: auto;
        }
        .cs-close {
          position: absolute; top: 14px; right: 14px; background: transparent;
          border: none; cursor: pointer; color: #6B7280; padding: 4px;
          display: flex; align-items: center; justify-content: center;
        }
        .cs-close:hover { color: #111827; }
        .cs-header { display: flex; gap: 14px; align-items: flex-start; margin-bottom: 20px; }
        .cs-icon {
          width: 48px; height: 48px; border-radius: 12px; background: #EBF2FF;
          color: #1A56DB; display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .cs-icon .material-icons { font-size: 26px; }
        .cs-title { font-size: 18px; font-weight: 800; margin: 0 0 4px; color: #111827; }
        .cs-sub { font-size: 13px; color: #6B7280; margin: 0; }
        .cs-channels {
          display: flex; flex-direction: column; gap: 10px; margin-bottom: 18px;
        }
        .cs-channel {
          display: flex; gap: 12px; align-items: flex-start;
          padding: 12px 14px; background: #F9FAFB; border: 1px solid #E5E7EB;
          border-radius: 12px;
        }
        .cs-ch-icon {
          color: #1A56DB; font-size: 22px; margin-top: 2px;
        }
        .cs-ch-body { flex: 1; }
        .cs-ch-label { font-size: 11px; color: #6B7280; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.5px; }
        .cs-ch-value { font-size: 14px; font-weight: 700; color: #111827; margin: 2px 0; }
        .cs-ch-meta { font-size: 12px; color: #6B7280; }
        .cs-tip {
          display: flex; gap: 10px; align-items: flex-start;
          background: #EBF2FF; border-radius: 10px; padding: 12px 14px;
          font-size: 13px; color: #1E3A8A; line-height: 1.5; margin-bottom: 18px;
        }
        .cs-actions { display: flex; gap: 10px; justify-content: flex-end; }
        .cs-btn-secondary {
          padding: 10px 18px; background: #fff; border: 1.5px solid #E5E7EB;
          color: #374151; border-radius: 10px; font-size: 13px; font-weight: 700;
          cursor: pointer; font-family: inherit;
        }
        .cs-btn-secondary:hover { background: #F3F4F6; }
        .cs-btn-primary {
          padding: 10px 18px; background: #1A56DB; color: #fff; border-radius: 10px;
          font-size: 13px; font-weight: 700; cursor: pointer; text-decoration: none;
          display: inline-flex; align-items: center; gap: 6px; border: none;
        }
        .cs-btn-primary:hover { background: #1849b8; }
      `}</style>
    </>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";

const INITIAL_CONTACTS = [
  {
    id: "c1",
    name: "Juan Dela Cruz",
    initial: "J",
    online: true,
    color: "#1A56DB",
    property: "Modern 4BR House, QC",
    propImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=600",
    propPrice: 8500000,
    propLocation: "Diliman, Quezon City",
    time: "2m ago",
    preview: "I've sent an offer for the property...",
    verified: true,
    memberSince: 2022,
    pofVerified: true,
    rating: "4.8",
    transactions: 3,
    occupation: "Software Engineer",
    location: "Quezon City",
    offer: { amount: 8000000, label: "Sent via Secure Offer System" },
    progress: "negotiation",
    messages: [
      { id: 1, from: "buyer", text: "Hi Maria! I really liked the virtual tour of the QC house." },
      { id: 2, from: "seller", text: "Glad you liked it, Juan! Do you have any specific questions about the floor plan?" },
      { id: 3, from: "buyer", text: "The layout is perfect. Based on the current market, would you consider an offer of ₱8.0M?" },
      { id: 4, from: "buyer", type: "offer", amount: 8000000 },
    ],
  },
  {
    id: "c2",
    name: "Alice Guo",
    initial: "A",
    online: false,
    color: "#6B7280",
    property: "2BR Condo, BGC",
    propImage: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=600",
    propPrice: 12500000,
    propLocation: "Bonifacio Global City, Taguig",
    time: "1h ago",
    preview: "Is the parking included in the price?",
    verified: true,
    memberSince: 2023,
    pofVerified: false,
    rating: "4.5",
    transactions: 1,
    occupation: "Marketing Director",
    location: "Makati City",
    offer: null,
    progress: "inquiry",
    messages: [
      { id: 1, from: "buyer", text: "Hi! Is the parking included in the price?" },
      { id: 2, from: "buyer", text: "Also, do you accept Pag-IBIG financing?" },
    ],
  },
];

export default function Page() {
  const [contacts, setContacts] = useState(INITIAL_CONTACTS);
  const [activeId, setActiveId] = useState("c1");
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");

  const [profileOpen, setProfileOpen] = useState(false);
  const [acceptOpen, setAcceptOpen] = useState(false);
  const [counterOpen, setCounterOpen] = useState(false);
  const [pofOpen, setPofOpen] = useState(false);

  const [toast, setToast] = useState(null);
  const bodyRef = useRef(null);
  const fileRef = useRef(null);

  const active = contacts.find((c) => c.id === activeId);
  const filtered = contacts.filter((c) =>
    !search ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.property.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [active?.messages.length, activeId]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  };

  const updateActive = (updater) => {
    setContacts((arr) => arr.map((c) => (c.id === activeId ? updater(c) : c)));
  };

  const pushMessage = (msg) => {
    updateActive((c) => ({
      ...c,
      messages: [...c.messages, { id: Date.now() + Math.random(), ...msg }],
      preview: msg.text || (msg.type === "counter" ? `Counter-offer: ₱${Number(msg.amount).toLocaleString("en-PH")}` : msg.type === "pof-request" ? "Requested proof of funds" : c.preview),
      time: "Just now",
    }));
  };

  const sendMessage = (e) => {
    e?.preventDefault?.();
    const text = draft.trim();
    if (!text) return;
    pushMessage({ from: "seller", text });
    setDraft("");
    setTimeout(() => {
      pushMessage({ from: "buyer", text: autoReply(text) });
    }, 1400);
  };

  const onPickFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    pushMessage({ from: "seller", type: "file", fileName: f.name, fileSize: Math.round(f.size / 1024) });
    e.target.value = "";
    showToast(`Attached: ${f.name}`);
  };

  const acceptOffer = () => {
    pushMessage({ from: "seller", text: `Offer of ₱${Number(active.offer.amount).toLocaleString("en-PH")} accepted. Susync will now prepare the deed of sale.` });
    updateActive((c) => ({ ...c, progress: "contracting" }));
    setAcceptOpen(false);
    showToast("Offer accepted. Buyer notified.");
  };

  const sendCounter = (amount, message) => {
    pushMessage({ from: "seller", type: "counter", amount, message });
    setCounterOpen(false);
    showToast("Counter-offer sent.");
  };

  const requestPOF = (reason) => {
    pushMessage({ from: "seller", type: "pof-request", reason });
    setPofOpen(false);
    showToast("Proof of funds request sent.");
  };

  return (
    <>
      <style>{CSS}</style>

      <div className="sm-wrap">
        <div className="sm-contacts">
          <div className="sm-search-box">
            <span className="material-icons sm-search-icon">search</span>
            <input
              className="sm-search-input"
              type="text"
              placeholder="Search inquiries…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {filtered.map((c) => (
            <div
              key={c.id}
              className={`sm-contact ${activeId === c.id ? "sm-contact-active" : ""}`}
              onClick={() => setActiveId(c.id)}
            >
              <div className="sm-avatar" style={{ background: c.color }}>
                {c.initial}
                {c.online && <div className="sm-online" />}
              </div>
              <div className="sm-c-info">
                <div className="sm-c-top">
                  <span className="sm-c-name">{c.name}</span>
                  <span className="sm-c-time">{c.time}</span>
                </div>
                <p className="sm-c-prop">{c.property}</p>
                <p className="sm-c-preview">{c.preview}</p>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="sm-empty-contacts">No conversations match &quot;{search}&quot;.</div>
          )}
        </div>

        {active ? (
          <>
            <div className="sm-chat">
              <div className="sm-chat-head">
                <div>
                  <h3>{active.name}</h3>
                  <p className={active.online ? "sm-status-on" : "sm-status-off"}>
                    {active.online ? "● Active Now" : "● Last seen recently"}
                  </p>
                </div>
                <button className="sm-btn-outline" onClick={() => setProfileOpen(true)}>
                  <span className="material-icons" style={{ fontSize: 16 }}>person</span> View Buyer Profile
                </button>
              </div>

              <div className="sm-body" ref={bodyRef}>
                {active.messages.map((m) => {
                  if (m.type === "offer") {
                    return (
                      <div key={m.id} className="sm-offer-bubble">
                        <div className="sm-offer-label">Buyer Offer</div>
                        <div className="sm-offer-price">₱{Number(m.amount).toLocaleString("en-PH")}</div>
                        <div className="sm-offer-meta">Sent via Secure Offer System</div>
                      </div>
                    );
                  }
                  if (m.type === "counter") {
                    return (
                      <div key={m.id} className="sm-counter-bubble">
                        <div className="sm-counter-label">Counter-Offer Sent</div>
                        <div className="sm-counter-price">₱{Number(m.amount).toLocaleString("en-PH")}</div>
                        {m.message && <div className="sm-counter-note">&quot;{m.message}&quot;</div>}
                      </div>
                    );
                  }
                  if (m.type === "pof-request") {
                    return (
                      <div key={m.id} className="sm-pof-bubble">
                        <div className="sm-pof-label">
                          <span className="material-icons" style={{ fontSize: 16 }}>verified_user</span> Proof of Funds Requested
                        </div>
                        <div className="sm-pof-note">{m.reason}</div>
                      </div>
                    );
                  }
                  if (m.type === "file") {
                    return (
                      <div key={m.id} className={`sm-msg sm-msg-${m.from === "seller" ? "sent" : "recv"} sm-msg-file`}>
                        <span className="material-icons" style={{ fontSize: 22 }}>attach_file</span>
                        <div>
                          <div style={{ fontWeight: 700 }}>{m.fileName}</div>
                          <div style={{ fontSize: 11, opacity: 0.8 }}>{m.fileSize} KB</div>
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div key={m.id} className={`sm-msg sm-msg-${m.from === "seller" ? "sent" : "recv"}`}>
                      {m.text}
                    </div>
                  );
                })}
              </div>

              <div className="sm-footer">
                <div className="sm-neg-bar">
                  <button
                    className="sm-btn-neg sm-btn-neg-primary"
                    disabled={!active.offer || active.progress === "contracting"}
                    onClick={() => setAcceptOpen(true)}
                  >
                    <span className="material-icons" style={{ fontSize: 14 }}>handshake</span> Accept Offer
                  </button>
                  <button className="sm-btn-neg" onClick={() => setCounterOpen(true)}>
                    <span className="material-icons" style={{ fontSize: 14 }}>swap_horiz</span> Send Counter-offer
                  </button>
                  <button className="sm-btn-neg" onClick={() => setPofOpen(true)}>
                    <span className="material-icons" style={{ fontSize: 14 }}>verified_user</span> Request Proof of Funds
                  </button>
                </div>
                <form className="sm-input-area" onSubmit={sendMessage}>
                  <input ref={fileRef} type="file" style={{ display: "none" }} onChange={onPickFile} />
                  <button type="button" className="sm-btn-icon" onClick={() => fileRef.current?.click()}>
                    <span className="material-icons" style={{ fontSize: 20 }}>attach_file</span>
                  </button>
                  <input
                    type="text"
                    className="sm-msg-input"
                    placeholder="Type your message to the buyer…"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                  />
                  <button type="submit" className="sm-btn-send" disabled={!draft.trim()}>
                    <span className="material-icons" style={{ fontSize: 18 }}>send</span>
                  </button>
                </form>
              </div>
            </div>

            <div className="sm-context">
              <img src={active.propImage} alt={active.property} className="sm-prop-img" />
              <p className="sm-prop-price">₱{Number(active.propPrice).toLocaleString("en-PH")}</p>
              <p className="sm-prop-title">{active.property}</p>
              <p className="sm-prop-loc">
                <span className="material-icons" style={{ fontSize: 16, verticalAlign: "middle" }}>location_on</span>
                {active.propLocation}
              </p>

              <div className="sm-tracker">
                <p className="sm-tracker-title">Deal Progress</p>
                {["inquiry", "negotiation", "contracting", "payment"].map((step, i) => {
                  const order = ["inquiry", "negotiation", "contracting", "payment"];
                  const currentIdx = order.indexOf(active.progress);
                  const state = i < currentIdx ? "done" : i === currentIdx ? "current" : "pending";
                  return (
                    <div key={step} className="sm-step">
                      <div className={`sm-step-dot sm-step-${state}`} />
                      <span className={`sm-step-label sm-step-label-${state}`}>
                        {step.charAt(0).toUpperCase() + step.slice(1)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <div className="sm-no-active">Select a conversation to begin.</div>
        )}
      </div>

      {profileOpen && active && (
        <BuyerProfileModal contact={active} onClose={() => setProfileOpen(false)} />
      )}
      {acceptOpen && active && (
        <AcceptOfferModal contact={active} onClose={() => setAcceptOpen(false)} onConfirm={acceptOffer} />
      )}
      {counterOpen && active && (
        <CounterOfferModal contact={active} onClose={() => setCounterOpen(false)} onSubmit={sendCounter} />
      )}
      {pofOpen && active && (
        <POFModal contact={active} onClose={() => setPofOpen(false)} onSubmit={requestPOF} />
      )}

      {toast && (
        <div className="sm-toast">
          <span className="material-icons" style={{ fontSize: 18 }}>check_circle</span>
          {toast}
        </div>
      )}
    </>
  );
}

function autoReply(text) {
  const lower = text.toLowerCase();
  if (lower.includes("price") || lower.includes("offer")) return "Thanks! Let me think about that and get back to you shortly.";
  if (lower.includes("viewing") || lower.includes("visit") || lower.includes("schedule")) return "Sounds good — please send a couple of dates that work for you.";
  if (lower.includes("?")) return "Good question — let me check on that and follow up.";
  return "Got it, thank you!";
}

function BuyerProfileModal({ contact, onClose }) {
  return (
    <div className="sm-overlay" onClick={onClose}>
      <div className="sm-modal" onClick={(e) => e.stopPropagation()}>
        <button className="sm-close" onClick={onClose}><span className="material-icons">close</span></button>

        <div className="sm-profile-head">
          <div className="sm-profile-avatar" style={{ background: contact.color }}>{contact.initial}</div>
          <div>
            <h2 className="sm-modal-title">{contact.name}</h2>
            <div className="sm-profile-badges">
              {contact.verified && <span className="sm-badge-verified"><span className="material-icons" style={{ fontSize: 14 }}>verified</span> ID Verified</span>}
              {contact.pofVerified && <span className="sm-badge-pof"><span className="material-icons" style={{ fontSize: 14 }}>account_balance</span> POF Verified</span>}
            </div>
          </div>
        </div>

        <div className="sm-profile-grid">
          <div className="sm-prof-item"><label>Member Since</label><span>{contact.memberSince}</span></div>
          <div className="sm-prof-item"><label>Buyer Rating</label><span>{contact.rating} ★</span></div>
          <div className="sm-prof-item"><label>Past Transactions</label><span>{contact.transactions}</span></div>
          <div className="sm-prof-item"><label>Location</label><span>{contact.location}</span></div>
          <div className="sm-prof-item"><label>Occupation</label><span>{contact.occupation}</span></div>
          <div className="sm-prof-item"><label>Status</label><span className="sm-prof-active">{contact.online ? "Active Now" : "Recently Active"}</span></div>
        </div>

        <div className="sm-profile-tip">
          <span className="material-icons" style={{ fontSize: 18, color: "#1A56DB" }}>info</span>
          <span>All buyer information is verified by Susync&apos;s compliance team. Verified buyers complete transactions <strong>3x faster</strong>.</span>
        </div>

        <div className="sm-actions">
          <button className="sm-btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

function AcceptOfferModal({ contact, onClose, onConfirm }) {
  return (
    <div className="sm-overlay" onClick={onClose}>
      <div className="sm-modal" onClick={(e) => e.stopPropagation()}>
        <button className="sm-close" onClick={onClose}><span className="material-icons">close</span></button>

        <div className="sm-success-icon"><span className="material-icons">handshake</span></div>
        <h2 className="sm-modal-title" style={{ textAlign: "center" }}>Accept this offer?</h2>
        <p className="sm-modal-sub" style={{ textAlign: "center" }}>You&apos;re about to accept the buyer&apos;s offer. Once confirmed, Susync will move this transaction to the contracting stage.</p>

        <div className="sm-accept-box">
          <div className="sm-accept-row">
            <span>Buyer</span>
            <strong>{contact.name}</strong>
          </div>
          <div className="sm-accept-row">
            <span>Property</span>
            <strong>{contact.property}</strong>
          </div>
          <div className="sm-accept-row">
            <span>Listing price</span>
            <strong>₱{Number(contact.propPrice).toLocaleString("en-PH")}</strong>
          </div>
          <div className="sm-accept-row sm-accept-emph">
            <span>Offer amount</span>
            <strong>₱{Number(contact.offer.amount).toLocaleString("en-PH")}</strong>
          </div>
        </div>

        <div className="sm-actions">
          <button className="sm-btn-secondary" onClick={onClose}>Cancel</button>
          <button className="sm-btn-primary" onClick={onConfirm}>
            <span className="material-icons" style={{ fontSize: 18 }}>check</span> Confirm &amp; Accept
          </button>
        </div>
      </div>
    </div>
  );
}

function CounterOfferModal({ contact, onClose, onSubmit }) {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const buyerOffer = contact.offer?.amount || 0;
  const list = contact.propPrice;

  const submit = (e) => {
    e.preventDefault();
    onSubmit(Number(amount), message);
  };

  return (
    <div className="sm-overlay" onClick={onClose}>
      <div className="sm-modal" onClick={(e) => e.stopPropagation()}>
        <button className="sm-close" onClick={onClose}><span className="material-icons">close</span></button>
        <h2 className="sm-modal-title">Send Counter-offer</h2>
        <p className="sm-modal-sub">Propose a different price to {contact.name}.</p>

        <div className="sm-counter-summary">
          <div><span>Listing price</span><strong>₱{list.toLocaleString("en-PH")}</strong></div>
          {buyerOffer ? <div><span>Buyer&apos;s offer</span><strong>₱{buyerOffer.toLocaleString("en-PH")}</strong></div> : null}
        </div>

        <form onSubmit={submit}>
          <div className="sm-field">
            <label>Your counter-offer (₱)</label>
            <input
              className="sm-input"
              type="number"
              required
              min="1"
              step="1000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 8250000"
            />
          </div>
          <div className="sm-field">
            <label>Message to buyer (optional)</label>
            <textarea
              className="sm-input"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add context — repairs done, market value, urgency, etc."
            />
          </div>

          <div className="sm-actions">
            <button type="button" className="sm-btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="sm-btn-primary">
              <span className="material-icons" style={{ fontSize: 18 }}>send</span> Send Counter-offer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function POFModal({ contact, onClose, onSubmit }) {
  const [reason, setReason] = useState("Standard verification before contract drafting");

  const submit = (e) => {
    e.preventDefault();
    onSubmit(reason);
  };

  return (
    <div className="sm-overlay" onClick={onClose}>
      <div className="sm-modal" onClick={(e) => e.stopPropagation()}>
        <button className="sm-close" onClick={onClose}><span className="material-icons">close</span></button>
        <h2 className="sm-modal-title">Request Proof of Funds</h2>
        <p className="sm-modal-sub">Ask {contact.name} to submit financial documents proving their ability to complete the transaction.</p>

        {contact.pofVerified && (
          <div className="sm-already-pof">
            <span className="material-icons" style={{ fontSize: 20, color: "#15803d" }}>verified</span>
            <span>This buyer is already POF-verified by Susync. You can still request additional documents below.</span>
          </div>
        )}

        <form onSubmit={submit}>
          <div className="sm-field">
            <label>Reason for the request</label>
            <select className="sm-input" value={reason} onChange={(e) => setReason(e.target.value)}>
              <option>Standard verification before contract drafting</option>
              <option>Confirming cash availability for full payment</option>
              <option>Bank pre-approval letter required</option>
              <option>Pag-IBIG / loan eligibility check</option>
              <option>High-value transaction — extra due diligence</option>
            </select>
          </div>

          <div className="sm-pof-list">
            <p className="sm-pof-list-title">Susync will ask the buyer to upload any of:</p>
            <ul>
              <li>Bank statement (last 3 months)</li>
              <li>Bank pre-approval letter</li>
              <li>Pag-IBIG / SSS housing loan eligibility document</li>
              <li>Notarized affidavit of cash availability</li>
            </ul>
          </div>

          <div className="sm-actions">
            <button type="button" className="sm-btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="sm-btn-primary">
              <span className="material-icons" style={{ fontSize: 18 }}>send</span> Send Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const CSS = `
  .sm-wrap { flex: 1; display: flex; background: #fff; overflow: hidden; height: calc(100vh - 72px); font-family: 'Poppins', sans-serif; }

  .sm-contacts { width: 340px; border-right: 1px solid #E5E7EB; display: flex; flex-direction: column; overflow-y: auto; }
  .sm-search-box { padding: 18px 20px; border-bottom: 1px solid #E5E7EB; position: relative; }
  .sm-search-input { width: 100%; box-sizing: border-box; padding: 10px 14px 10px 38px; background: #fbfbf9;
    border: 1px solid #E5E7EB; border-radius: 10px; font-family: inherit; font-size: 13px; outline: none; }
  .sm-search-input:focus { border-color: #1A56DB; box-shadow: 0 0 0 3px #EBF2FF; }
  .sm-search-icon { position: absolute; top: 50%; left: 32px; transform: translateY(-50%); font-size: 18px !important; color: #6B7280; }

  .sm-contact { padding: 14px 20px; display: flex; gap: 12px; border-bottom: 1px solid #E5E7EB; cursor: pointer; transition: background 0.15s; }
  .sm-contact:hover { background: #fbfbf9; }
  .sm-contact-active { background: #EBF2FF; border-left: 4px solid #1A56DB; padding-left: 16px; }

  .sm-avatar { width: 48px; height: 48px; border-radius: 50%; color: #fff;
    display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0; position: relative; }
  .sm-online { position: absolute; bottom: 0; right: 0; width: 12px; height: 12px; background: #15803d;
    border: 2px solid #fff; border-radius: 50%; }
  .sm-c-info { flex: 1; min-width: 0; }
  .sm-c-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
  .sm-c-name { font-size: 14px; font-weight: 700; }
  .sm-c-time { font-size: 11px; color: #6B7280; }
  .sm-c-prop { font-size: 12px; color: #1A56DB; font-weight: 600; margin-bottom: 2px; }
  .sm-c-preview { font-size: 12px; color: #6B7280; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sm-empty-contacts { padding: 40px 20px; text-align: center; font-size: 13px; color: #6B7280; }

  .sm-chat { flex: 1; display: flex; flex-direction: column; background: #f9fafb; min-width: 0; }
  .sm-chat-head { padding: 14px 24px; background: #fff; border-bottom: 1px solid #E5E7EB; display: flex; justify-content: space-between; align-items: center; }
  .sm-chat-head h3 { font-size: 15px; font-weight: 700; }
  .sm-status-on { font-size: 12px; color: #15803d; font-weight: 600; }
  .sm-status-off { font-size: 12px; color: #6B7280; font-weight: 600; }
  .sm-btn-outline { background: #fff; border: 1.5px solid #1A56DB; color: #1A56DB; padding: 8px 14px;
    border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer; font-family: inherit;
    display: inline-flex; align-items: center; gap: 6px; }
  .sm-btn-outline:hover { background: #EBF2FF; }

  .sm-body { flex: 1; padding: 24px; overflow-y: auto; display: flex; flex-direction: column; gap: 14px; }
  .sm-msg { max-width: 70%; padding: 11px 16px; border-radius: 14px; font-size: 14px; line-height: 1.5; word-wrap: break-word; }
  .sm-msg-recv { background: #fff; border: 1px solid #E5E7EB; align-self: flex-start; border-bottom-left-radius: 4px; color: #111827; }
  .sm-msg-sent { background: #1A56DB; color: #fff; align-self: flex-end; border-bottom-right-radius: 4px; }
  .sm-msg-file { display: flex; gap: 10px; align-items: center; }

  .sm-offer-bubble { background: #FEF3C7; border: 1.5px solid #92400E; padding: 14px; border-radius: 14px;
    align-self: flex-start; width: 260px; }
  .sm-offer-label { font-size: 10px; font-weight: 800; text-transform: uppercase; color: #92400E; margin-bottom: 4px; letter-spacing: 0.5px; }
  .sm-offer-price { font-size: 20px; font-weight: 800; color: #92400E; }
  .sm-offer-meta { font-size: 11px; margin-top: 6px; color: #6B7280; }

  .sm-counter-bubble { background: #EBF2FF; border: 1.5px solid #1A56DB; padding: 14px; border-radius: 14px;
    align-self: flex-end; width: 260px; }
  .sm-counter-label { font-size: 10px; font-weight: 800; text-transform: uppercase; color: #1A56DB; margin-bottom: 4px; letter-spacing: 0.5px; }
  .sm-counter-price { font-size: 20px; font-weight: 800; color: #1A56DB; }
  .sm-counter-note { font-size: 12px; margin-top: 6px; color: #374151; font-style: italic; }

  .sm-pof-bubble { background: #fff; border: 1.5px dashed #1A56DB; padding: 12px 14px; border-radius: 12px;
    align-self: flex-end; max-width: 70%; }
  .sm-pof-label { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 700; color: #1A56DB; }
  .sm-pof-note { font-size: 12px; color: #6B7280; margin-top: 4px; }

  .sm-footer { padding: 18px 20px; background: #fff; border-top: 1px solid #E5E7EB; }
  .sm-neg-bar { display: flex; gap: 8px; margin-bottom: 12px; }
  .sm-btn-neg { padding: 7px 14px; border-radius: 8px; font-size: 12px; font-weight: 700;
    border: 1px solid #E5E7EB; background: #fff; cursor: pointer; font-family: inherit; color: #111827;
    display: inline-flex; align-items: center; gap: 4px; }
  .sm-btn-neg:hover:not(:disabled) { background: #f3f4f6; }
  .sm-btn-neg:disabled { opacity: 0.5; cursor: not-allowed; }
  .sm-btn-neg-primary { background: #92400E; color: #fff; border: none; }
  .sm-btn-neg-primary:hover:not(:disabled) { background: #78350F; }

  .sm-input-area { display: flex; gap: 10px; align-items: center; }
  .sm-btn-icon { width: 40px; height: 40px; border-radius: 8px; border: 1px solid #E5E7EB; background: #fff;
    color: #6B7280; cursor: pointer; display: flex; align-items: center; justify-content: center; font-family: inherit; }
  .sm-btn-icon:hover { background: #f3f4f6; }
  .sm-msg-input { flex: 1; padding: 11px 14px; border-radius: 12px; border: 1px solid #E5E7EB;
    background: #fbfbf9; font-family: inherit; outline: none; font-size: 14px; }
  .sm-msg-input:focus { border-color: #1A56DB; box-shadow: 0 0 0 3px #EBF2FF; }
  .sm-btn-send { width: 44px; height: 44px; border-radius: 50%; background: #1A56DB; border: none;
    color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; }
  .sm-btn-send:hover:not(:disabled) { background: #1849b8; }
  .sm-btn-send:disabled { background: #9CA3AF; cursor: not-allowed; }

  .sm-context { width: 300px; background: #fff; border-left: 1px solid #E5E7EB; padding: 24px; overflow-y: auto; }
  .sm-prop-img { width: 100%; height: 150px; border-radius: 12px; object-fit: cover; margin-bottom: 14px; }
  .sm-prop-price { font-size: 20px; font-weight: 800; color: #1A56DB; margin-bottom: 4px; }
  .sm-prop-title { font-size: 14px; font-weight: 700; margin-bottom: 6px; }
  .sm-prop-loc { font-size: 12px; color: #6B7280; margin-bottom: 18px; }

  .sm-tracker { border-top: 1px solid #E5E7EB; padding-top: 18px; }
  .sm-tracker-title { font-size: 11px; font-weight: 700; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #6B7280; }
  .sm-step { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; font-size: 13px; }
  .sm-step-dot { width: 10px; height: 10px; border-radius: 50%; background: #E5E7EB; }
  .sm-step-done { background: #15803d; }
  .sm-step-current { background: #92400E; box-shadow: 0 0 0 4px #FEF3C7; }
  .sm-step-label-done { color: #111827; font-weight: 600; }
  .sm-step-label-current { color: #92400E; font-weight: 700; }
  .sm-step-label-pending { color: #6B7280; }

  .sm-no-active { flex: 1; display: flex; align-items: center; justify-content: center; color: #6B7280; }

  .sm-overlay { position: fixed; inset: 0; background: rgba(17,24,39,0.55); display: flex;
    align-items: center; justify-content: center; z-index: 1000; padding: 20px; font-family: 'Poppins', sans-serif; }
  .sm-modal { background: #fff; border-radius: 16px; width: 100%; max-width: 540px;
    padding: 28px; position: relative; box-shadow: 0 20px 50px rgba(0,0,0,0.2); max-height: 92vh; overflow-y: auto; }
  .sm-close { position: absolute; top: 14px; right: 14px; background: transparent; border: none;
    cursor: pointer; color: #6B7280; padding: 4px; }
  .sm-close:hover { color: #111827; }
  .sm-modal-title { font-size: 20px; font-weight: 800; margin-bottom: 6px; padding-right: 32px; }
  .sm-modal-sub { font-size: 13px; color: #6B7280; margin-bottom: 18px; }

  .sm-field { margin-bottom: 14px; }
  .sm-field label { display: block; font-size: 12px; font-weight: 700; color: #374151;
    text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
  .sm-input { box-sizing: border-box; width: 100%; padding: 10px 12px; border: 1px solid #E5E7EB;
    border-radius: 10px; font-size: 14px; font-family: inherit; color: #111827; background: #fff; }
  .sm-input:focus { outline: none; border-color: #1A56DB; box-shadow: 0 0 0 3px #EBF2FF; }
  textarea.sm-input { resize: vertical; }

  .sm-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 8px; }
  .sm-btn-primary { padding: 10px 18px; background: #1A56DB; color: #fff; border-radius: 10px;
    font-size: 13px; font-weight: 700; cursor: pointer; border: none; font-family: inherit;
    display: inline-flex; align-items: center; gap: 6px; }
  .sm-btn-primary:hover { background: #1849b8; }
  .sm-btn-secondary { padding: 10px 18px; background: #fff; border: 1.5px solid #E5E7EB; color: #374151;
    border-radius: 10px; font-size: 13px; font-weight: 700; cursor: pointer; font-family: inherit; }
  .sm-btn-secondary:hover { background: #F3F4F6; }

  .sm-profile-head { display: flex; gap: 14px; align-items: center; margin-bottom: 20px; }
  .sm-profile-avatar { width: 64px; height: 64px; border-radius: 50%; color: #fff;
    display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 24px; }
  .sm-profile-badges { display: flex; gap: 6px; margin-top: 6px; }
  .sm-badge-verified, .sm-badge-pof { display: inline-flex; align-items: center; gap: 4px;
    padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; }
  .sm-badge-verified { background: #dcfce7; color: #15803d; }
  .sm-badge-pof { background: #EBF2FF; color: #1A56DB; }
  .sm-profile-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 18px; }
  .sm-prof-item label { display: block; font-size: 11px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px; }
  .sm-prof-item span { font-size: 14px; font-weight: 700; color: #111827; }
  .sm-prof-active { color: #15803d !important; }
  .sm-profile-tip { display: flex; gap: 10px; align-items: flex-start; background: #EBF2FF;
    border-radius: 10px; padding: 12px 14px; font-size: 12px; color: #1E3A8A; line-height: 1.5; margin-bottom: 16px; }

  .sm-success-icon { width: 64px; height: 64px; border-radius: 50%; background: #DCFCE7;
    color: #15803D; display: flex; align-items: center; justify-content: center; margin: 0 auto 14px; }
  .sm-success-icon .material-icons { font-size: 32px !important; }
  .sm-accept-box { background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 12px; padding: 16px; margin-bottom: 18px; }
  .sm-accept-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; }
  .sm-accept-row span { color: #6B7280; }
  .sm-accept-row strong { color: #111827; }
  .sm-accept-emph { border-top: 1px dashed #E5E7EB; margin-top: 6px; padding-top: 10px; font-size: 16px; }
  .sm-accept-emph strong { color: #15803d; font-size: 18px; }

  .sm-counter-summary { background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 10px;
    padding: 12px; margin-bottom: 16px; display: flex; justify-content: space-around; }
  .sm-counter-summary div { text-align: center; }
  .sm-counter-summary span { display: block; font-size: 11px; color: #6B7280; text-transform: uppercase; }
  .sm-counter-summary strong { font-size: 15px; color: #111827; }

  .sm-already-pof { display: flex; gap: 10px; background: #DCFCE7; border: 1px solid #86efac;
    border-radius: 10px; padding: 12px 14px; font-size: 13px; color: #15803d; margin-bottom: 14px; align-items: flex-start; }
  .sm-pof-list { background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 10px; padding: 14px; margin-bottom: 14px; }
  .sm-pof-list-title { font-size: 12px; font-weight: 700; color: #374151; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
  .sm-pof-list ul { margin: 0; padding-left: 18px; font-size: 13px; color: #374151; }
  .sm-pof-list li { padding: 3px 0; }

  .sm-toast { position: fixed; bottom: 24px; right: 24px; background: #15803d; color: #fff;
    padding: 12px 20px; border-radius: 10px; font-size: 13px; font-weight: 600;
    box-shadow: 0 8px 24px rgba(0,0,0,0.2); display: flex; align-items: center; gap: 8px;
    z-index: 2000; font-family: 'Poppins', sans-serif; animation: sm-slidein 0.25s ease-out; }
  @keyframes sm-slidein { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
`;

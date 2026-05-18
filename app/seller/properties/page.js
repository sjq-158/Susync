"use client";

import { useRef, useState } from "react";

const INITIAL_LISTINGS = [
  {
    id: "p1",
    title: "Modern 4BR House in QC",
    status: "active",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=600",
    price: 8500000,
    listing_kind: "sale",
    type: "house",
    address: "Diliman, Quezon City",
    beds: 4,
    baths: 3,
    area: 220,
    description: "A modern, fully-renovated family home in a gated subdivision with 24/7 security.",
    views: 1240,
    inquiries: 8,
    days: 12,
    offers: [],
  },
  {
    id: "p2",
    title: "2BR Condo in BGC",
    status: "negotiation",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=600",
    price: 12500000,
    listing_kind: "sale",
    type: "condo",
    address: "Bonifacio Global City, Taguig",
    beds: 2,
    baths: 2,
    area: 78,
    description: "Premium 2BR unit at the heart of BGC with skyline views and resort-style amenities.",
    views: 4890,
    inquiries: 32,
    days: 38,
    offers: [
      { id: "o1", buyer: "Juan Dela Cruz", amount: 11800000, message: "Cash offer, ready to close in 30 days.", date: "2 days ago", financing: "Cash" },
      { id: "o2", buyer: "Andrea Lim", amount: 12000000, message: "Bank pre-approved. Move-in target April 2026.", date: "5 hours ago", financing: "Bank Financing" },
    ],
  },
];

const emptyForm = {
  title: "",
  listing_kind: "sale",
  type: "house",
  price: "",
  address: "",
  beds: "",
  baths: "",
  area: "",
  description: "",
  image: "",
};

export default function Page() {
  const [listings, setListings] = useState(INITIAL_LISTINGS);
  const [listOpen, setListOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [offers, setOffers] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(null); // { kind: "create"|"update"|"delete", message }
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  };

  const handleCreate = (form, fileName) => {
    setBusy({ kind: "create", message: "Publishing new listing…" });
    setTimeout(() => {
      const id = "p" + (listings.length + 1) + "-" + Math.random().toString(36).slice(2, 6);
      setListings((arr) => [
        {
          id,
          status: "active",
          views: 0,
          inquiries: 0,
          days: 0,
          offers: [],
          ...form,
          price: Number(form.price),
          beds: Number(form.beds),
          baths: Number(form.baths),
          area: Number(form.area),
          image: form.image || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600",
          uploadedFile: fileName || null,
        },
        ...arr,
      ]);
      setBusy(null);
      setListOpen(false);
      showToast("Listing published.");
    }, 1100);
  };

  const handleUpdate = (form) => {
    setBusy({ kind: "update", message: `Updating "${form.title}"…` });
    setTimeout(() => {
      setListings((arr) =>
        arr.map((l) =>
          l.id === editing.id
            ? {
                ...l,
                ...form,
                price: Number(form.price),
                beds: Number(form.beds),
                baths: Number(form.baths),
                area: Number(form.area),
              }
            : l,
        ),
      );
      setBusy(null);
      setEditing(null);
      showToast("Listing updated.");
    }, 1100);
  };

  const handleDelete = (id, title) => {
    setBusy({ kind: "delete", message: `Deleting "${title}"…` });
    setTimeout(() => {
      setListings((arr) => arr.filter((l) => l.id !== id));
      setBusy(null);
      setDeleting(null);
      showToast("Listing deleted.");
    }, 1200);
  };

  const handleAcceptOffer = (listingId, offerId) => {
    setListings((arr) =>
      arr.map((l) =>
        l.id === listingId
          ? { ...l, status: "sold", offers: l.offers.map((o) => ({ ...o, accepted: o.id === offerId })) }
          : l,
      ),
    );
    setOffers(null);
    showToast("Offer accepted. Buyer notified.");
  };

  const totalSales = listings.reduce((s, l) => s + (l.status === "sold" ? l.price : 0), 0) + 10200000;
  const activeCount = listings.filter((l) => l.status === "active").length;
  const inquiriesTotal = listings.reduce((s, l) => s + (l.inquiries || 0), 0);

  return (
    <>
      <style>{CSS}</style>

      <main className="spm-main">
        <div className="spm-header">
          <div>
            <h1>Property Management</h1>
            <p>Track your listings, views, and inquiries performance.</p>
          </div>
          <button className="spm-btn-primary" onClick={() => setListOpen(true)}>
            <span className="material-icons" style={{ fontSize: 18 }}>add</span> List New Property
          </button>
        </div>

        <div className="spm-stats">
          <div className="spm-stat"><span className="spm-stat-v">₱{(totalSales / 1_000_000).toFixed(1)}M</span><span className="spm-stat-l">Total Closed Sales</span></div>
          <div className="spm-stat"><span className="spm-stat-v">{activeCount}</span><span className="spm-stat-l">Active Listings</span></div>
          <div className="spm-stat"><span className="spm-stat-v">{inquiriesTotal}</span><span className="spm-stat-l">New Inquiries</span></div>
          <div className="spm-stat"><span className="spm-stat-v" style={{ color: "#1A56DB" }}>62%</span><span className="spm-stat-l">Inquiry Conversion</span></div>
        </div>

        <div className="spm-section-head"><h2>Your Properties</h2></div>

        {listings.length === 0 ? (
          <div className="spm-empty">
            <span className="material-icons spm-empty-icon">home_work</span>
            <p>You haven&apos;t listed any properties yet.</p>
            <button className="spm-btn-primary" onClick={() => setListOpen(true)}>
              <span className="material-icons" style={{ fontSize: 18 }}>add</span> List Your First Property
            </button>
          </div>
        ) : (
          listings.map((l) => (
            <div key={l.id} className="spm-card">
              <img src={l.image} alt={l.title} className="spm-card-img" />
              <div className="spm-card-body">
                <span className={`spm-pill spm-pill-${l.status}`}>{l.status}</span>
                <h3>{l.title}</h3>
                <p className="spm-card-meta">
                  <span className="material-icons" style={{ fontSize: 14, verticalAlign: "middle" }}>location_on</span>
                  {l.address} · ₱{Number(l.price).toLocaleString("en-PH")}
                </p>
                <div className="spm-card-stats">
                  <span>Views: <b>{l.views.toLocaleString()}</b></span>
                  <span>Inquiries: <b>{l.inquiries}</b></span>
                  <span>{l.offers?.length ? <>Offers: <b>{l.offers.length}</b></> : <>Days Listed: <b>{l.days}</b></>}</span>
                </div>
              </div>
              <div className="spm-card-actions">
                {l.offers?.length ? (
                  <button className="spm-btn-action spm-btn-primary-sm" onClick={() => setOffers(l)}>Review Offers</button>
                ) : null}
                <button className="spm-btn-action" onClick={() => setEditing(l)}>Edit Listing</button>
                <button className="spm-btn-action" onClick={() => setAnalytics(l)}>View Analytics</button>
                <button className="spm-btn-action spm-btn-danger" onClick={() => setDeleting(l)}>
                  <span className="material-icons" style={{ fontSize: 14 }}>delete</span> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </main>

      {listOpen && (
        <ListingForm
          mode="create"
          onClose={() => setListOpen(false)}
          onSubmit={handleCreate}
        />
      )}
      {editing && (
        <ListingForm
          mode="edit"
          listing={editing}
          onClose={() => setEditing(null)}
          onSubmit={(form) => handleUpdate(form)}
        />
      )}
      {analytics && <AnalyticsModal listing={analytics} onClose={() => setAnalytics(null)} />}
      {offers && <OffersModal listing={offers} onClose={() => setOffers(null)} onAccept={handleAcceptOffer} />}
      {deleting && (
        <DeleteConfirm
          listing={deleting}
          onClose={() => setDeleting(null)}
          onConfirm={() => handleDelete(deleting.id, deleting.title)}
        />
      )}

      {busy && (
        <div className="spm-busy">
          <div className="spm-busy-box">
            <div className="spm-spinner" />
            <p>{busy.message}</p>
          </div>
        </div>
      )}

      {toast && (
        <div className="spm-toast">
          <span className="material-icons" style={{ fontSize: 18 }}>check_circle</span>
          {toast}
        </div>
      )}
    </>
  );
}

function ListingForm({ mode, listing, onClose, onSubmit }) {
  const [form, setForm] = useState(() =>
    listing
      ? {
          title: listing.title,
          listing_kind: listing.listing_kind,
          type: listing.type,
          price: listing.price,
          address: listing.address,
          beds: listing.beds,
          baths: listing.baths,
          area: listing.area,
          description: listing.description,
          image: listing.image,
        }
      : emptyForm,
  );
  const [fileName, setFileName] = useState(listing?.uploadedFile || "");
  const fileRef = useRef(null);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const onPickFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFileName(f.name);
    const reader = new FileReader();
    reader.onload = (ev) => update("image", ev.target.result);
    reader.readAsDataURL(f);
  };

  const submit = (e) => {
    e.preventDefault();
    onSubmit(form, fileName);
  };

  return (
    <div className="spm-overlay" onClick={onClose}>
      <div className="spm-modal spm-modal-wide" onClick={(e) => e.stopPropagation()}>
        <button className="spm-close" onClick={onClose}><span className="material-icons">close</span></button>
        <h2 className="spm-modal-title">{mode === "create" ? "List New Property" : "Edit Listing"}</h2>
        <p className="spm-modal-sub">{mode === "create" ? "Add a new property to your active listings." : `Update details for "${listing.title}".`}</p>

        <form onSubmit={submit}>
          <div className="spm-field">
            <label>Property photo</label>
            <div className="spm-file-row">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={onPickFile}
                style={{ display: "none" }}
              />
              <button type="button" className="spm-btn-secondary" onClick={() => fileRef.current?.click()}>
                <span className="material-icons" style={{ fontSize: 18 }}>folder_open</span>
                Browse files…
              </button>
              <span className="spm-file-name">{fileName || (form.image ? "Using current photo" : "No file selected")}</span>
            </div>
            {form.image && <img src={form.image} alt="" className="spm-file-preview" />}
          </div>

          <div className="spm-field">
            <label>Title</label>
            <input className="spm-input" required value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="e.g. Modern 3BR Townhouse in Cebu" />
          </div>

          <div className="spm-grid-2">
            <div className="spm-field">
              <label>Listing kind</label>
              <select className="spm-input" value={form.listing_kind} onChange={(e) => update("listing_kind", e.target.value)}>
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
            </div>
            <div className="spm-field">
              <label>Property type</label>
              <select className="spm-input" value={form.type} onChange={(e) => update("type", e.target.value)}>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="townhouse">Townhouse</option>
                <option value="lot">Lot</option>
              </select>
            </div>
          </div>

          <div className="spm-grid-2">
            <div className="spm-field">
              <label>Price (₱)</label>
              <input className="spm-input" type="number" required min="1" value={form.price} onChange={(e) => update("price", e.target.value)} placeholder="8500000" />
            </div>
            <div className="spm-field">
              <label>Floor area (sqm)</label>
              <input className="spm-input" type="number" required min="1" value={form.area} onChange={(e) => update("area", e.target.value)} placeholder="120" />
            </div>
          </div>

          <div className="spm-grid-2">
            <div className="spm-field">
              <label>Bedrooms</label>
              <input className="spm-input" type="number" required min="0" value={form.beds} onChange={(e) => update("beds", e.target.value)} placeholder="3" />
            </div>
            <div className="spm-field">
              <label>Bathrooms</label>
              <input className="spm-input" type="number" required min="0" value={form.baths} onChange={(e) => update("baths", e.target.value)} placeholder="2" />
            </div>
          </div>

          <div className="spm-field">
            <label>Address</label>
            <input className="spm-input" required value={form.address} onChange={(e) => update("address", e.target.value)} placeholder="Barangay, City" />
          </div>

          <div className="spm-field">
            <label>Description</label>
            <textarea className="spm-input" rows={4} required value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Highlight what makes this property stand out…" />
          </div>

          <div className="spm-actions">
            <button type="button" className="spm-btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="spm-btn-primary">
              <span className="material-icons" style={{ fontSize: 18 }}>{mode === "create" ? "publish" : "save"}</span>
              {mode === "create" ? "Publish Listing" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AnalyticsModal({ listing, onClose }) {
  const days = Array.from({ length: 14 }, (_, i) => ({
    day: i + 1,
    views: Math.round(20 + Math.random() * 80 + (i * 6)),
    inquiries: Math.round(Math.random() * 3),
  }));
  const maxV = Math.max(...days.map((d) => d.views));

  return (
    <div className="spm-overlay" onClick={onClose}>
      <div className="spm-modal spm-modal-wide" onClick={(e) => e.stopPropagation()}>
        <button className="spm-close" onClick={onClose}><span className="material-icons">close</span></button>
        <h2 className="spm-modal-title">Analytics — {listing.title}</h2>
        <p className="spm-modal-sub">Performance overview for the last 14 days.</p>

        <div className="spm-an-stats">
          <div className="spm-an-stat"><span>{listing.views.toLocaleString()}</span><label>Total Views</label></div>
          <div className="spm-an-stat"><span>{listing.inquiries}</span><label>Inquiries</label></div>
          <div className="spm-an-stat"><span>{listing.offers?.length || 0}</span><label>Offers</label></div>
          <div className="spm-an-stat"><span>{((listing.inquiries / Math.max(1, listing.views)) * 100).toFixed(1)}%</span><label>Inquiry Rate</label></div>
        </div>

        <div className="spm-an-card">
          <div className="spm-an-card-head">
            <h3>Daily Views</h3>
            <span className="spm-an-trend">+18% vs. previous period</span>
          </div>
          <div className="spm-chart">
            {days.map((d) => (
              <div key={d.day} className="spm-bar-wrap" title={`Day ${d.day}: ${d.views} views`}>
                <div className="spm-bar" style={{ height: `${(d.views / maxV) * 100}%` }} />
                <span className="spm-bar-label">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="spm-an-card">
          <h3 style={{ marginBottom: 14 }}>Viewer Sources</h3>
          {[
            ["Direct Search", 42],
            ["Featured Listings", 28],
            ["Referrals & Saved", 18],
            ["External (Facebook, Google)", 12],
          ].map(([label, pct]) => (
            <div key={label} className="spm-src-row">
              <div className="spm-src-label">{label}</div>
              <div className="spm-src-rail"><div className="spm-src-fill" style={{ width: `${pct}%` }} /></div>
              <div className="spm-src-pct">{pct}%</div>
            </div>
          ))}
        </div>

        <div className="spm-actions">
          <button className="spm-btn-secondary" onClick={onClose}>Close</button>
          <button className="spm-btn-primary">
            <span className="material-icons" style={{ fontSize: 18 }}>download</span> Export Report
          </button>
        </div>
      </div>
    </div>
  );
}

function OffersModal({ listing, onClose, onAccept }) {
  return (
    <div className="spm-overlay" onClick={onClose}>
      <div className="spm-modal spm-modal-wide" onClick={(e) => e.stopPropagation()}>
        <button className="spm-close" onClick={onClose}><span className="material-icons">close</span></button>
        <h2 className="spm-modal-title">Offers — {listing.title}</h2>
        <p className="spm-modal-sub">Listed at ₱{Number(listing.price).toLocaleString("en-PH")}. Review and respond to active offers below.</p>

        {listing.offers.map((o) => {
          const diff = o.amount - listing.price;
          const pct = ((diff / listing.price) * 100).toFixed(1);
          return (
            <div key={o.id} className="spm-offer-card">
              <div className="spm-offer-top">
                <div>
                  <div className="spm-offer-buyer">{o.buyer}</div>
                  <div className="spm-offer-meta">{o.financing} · {o.date}</div>
                </div>
                <div className="spm-offer-amount-block">
                  <div className="spm-offer-amount">₱{Number(o.amount).toLocaleString("en-PH")}</div>
                  <div className={`spm-offer-diff ${diff >= 0 ? "spm-offer-up" : "spm-offer-down"}`}>
                    {diff >= 0 ? "+" : ""}{pct}% vs. listing
                  </div>
                </div>
              </div>
              <p className="spm-offer-msg">&quot;{o.message}&quot;</p>
              <div className="spm-offer-actions">
                <button className="spm-btn-secondary">Counter</button>
                <button className="spm-btn-secondary">Decline</button>
                <button className="spm-btn-primary" onClick={() => onAccept(listing.id, o.id)}>
                  <span className="material-icons" style={{ fontSize: 18 }}>handshake</span> Accept Offer
                </button>
              </div>
            </div>
          );
        })}

        <div className="spm-actions">
          <button className="spm-btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirm({ listing, onClose, onConfirm }) {
  const phrase = `DELETE ${listing.title}`;
  const [typed, setTyped] = useState("");
  const matches = typed === phrase;

  return (
    <div className="spm-overlay" onClick={onClose}>
      <div className="spm-modal" onClick={(e) => e.stopPropagation()}>
        <button className="spm-close" onClick={onClose}><span className="material-icons">close</span></button>

        <div className="spm-danger-head">
          <div className="spm-danger-icon"><span className="material-icons">warning</span></div>
          <div>
            <h2 className="spm-modal-title" style={{ color: "#B91C1C" }}>Delete this listing?</h2>
            <p className="spm-modal-sub">This action cannot be undone. All views, inquiries, and offer history will be permanently removed.</p>
          </div>
        </div>

        <div className="spm-danger-box">
          <div className="spm-danger-summary">
            <img src={listing.image} alt="" />
            <div>
              <strong>{listing.title}</strong>
              <span>{listing.address}</span>
              <span>₱{Number(listing.price).toLocaleString("en-PH")}</span>
            </div>
          </div>
        </div>

        <div className="spm-field">
          <label>To confirm, type the phrase below exactly:</label>
          <div className="spm-confirm-phrase">{phrase}</div>
          <input
            className="spm-input"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            placeholder="Type the phrase above…"
            autoFocus
          />
        </div>

        <div className="spm-actions">
          <button className="spm-btn-secondary" onClick={onClose}>Cancel</button>
          <button
            className="spm-btn-danger-lg"
            disabled={!matches}
            onClick={onConfirm}
          >
            <span className="material-icons" style={{ fontSize: 18 }}>delete_forever</span>
            Permanently Delete
          </button>
        </div>
      </div>
    </div>
  );
}

const CSS = `
  .spm-main { flex: 1; padding: 40px 60px; font-family: 'Poppins', sans-serif; background: #fbfbf9; color: #111827; }
  .spm-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
  .spm-header h1 { font-size: 24px; font-weight: 800; }
  .spm-header p { font-size: 14px; color: #6B7280; margin-top: 4px; }
  .spm-btn-primary {
    background: #1A56DB; color: #fff; padding: 10px 18px; border-radius: 10px;
    border: none; font-weight: 700; font-size: 13px; cursor: pointer;
    box-shadow: 0 4px 12px rgba(26,86,219,0.2); display: inline-flex; align-items: center;
    gap: 6px; font-family: inherit;
  }
  .spm-btn-primary:hover { background: #1849b8; }
  .spm-btn-primary:disabled { background: #9CA3AF; cursor: not-allowed; box-shadow: none; }

  .spm-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 40px; }
  .spm-stat { background: #fff; border: 1px solid #E5E7EB; padding: 22px; border-radius: 14px; box-shadow: 0 1px 4px rgba(26,23,20,0.08); }
  .spm-stat-v { font-size: 24px; font-weight: 800; color: #92400E; display: block; }
  .spm-stat-l { font-size: 11px; color: #6B7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 6px; display: block; }

  .spm-section-head h2 { font-size: 18px; font-weight: 700; margin-bottom: 20px; }

  .spm-card { background: #fff; border: 1px solid #E5E7EB; border-radius: 16px; overflow: hidden;
    display: flex; margin-bottom: 16px; box-shadow: 0 1px 4px rgba(26,23,20,0.08); transition: transform 0.2s; }
  .spm-card:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(26,23,20,0.10); }
  .spm-card-img { width: 220px; height: 170px; object-fit: cover; flex-shrink: 0; }
  .spm-card-body { flex: 1; padding: 22px; display: flex; flex-direction: column; justify-content: center; gap: 6px; }
  .spm-card-body h3 { font-size: 17px; font-weight: 700; }
  .spm-card-meta { font-size: 12px; color: #6B7280; display: flex; align-items: center; gap: 4px; }
  .spm-card-stats { display: flex; gap: 28px; font-size: 13px; color: #6B7280; margin-top: 6px; }
  .spm-card-stats b { color: #111827; font-weight: 600; }
  .spm-pill { font-size: 10px; font-weight: 700; text-transform: uppercase; padding: 4px 10px; border-radius: 6px;
    width: fit-content; letter-spacing: 0.5px; }
  .spm-pill-active { background: #dcfce7; color: #15803d; border: 1px solid #86efac; }
  .spm-pill-negotiation { background: #FEF3C7; color: #92400E; border: 1px solid #fcd34d; }
  .spm-pill-sold { background: #EBF2FF; color: #1A56DB; border: 1px solid #93C5FD; }

  .spm-card-actions { padding: 20px; border-left: 1px solid #E5E7EB; display: flex; flex-direction: column;
    justify-content: center; gap: 8px; width: 190px; background: #fafafa; }
  .spm-btn-action { width: 100%; padding: 9px; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer;
    border: 1px solid #E5E7EB; background: #fff; color: #111827; font-family: inherit;
    display: inline-flex; align-items: center; justify-content: center; gap: 4px; }
  .spm-btn-action:hover { background: #f3f4f6; border-color: #6B7280; }
  .spm-btn-primary-sm { background: #1A56DB; color: #fff; border: none; }
  .spm-btn-primary-sm:hover { background: #1849b8; border: none; }
  .spm-btn-danger { color: #B91C1C; border-color: #FECACA; }
  .spm-btn-danger:hover { background: #FEF2F2; border-color: #FCA5A5; }

  .spm-empty { background: #fff; border: 1px dashed #E5E7EB; border-radius: 16px; padding: 60px; text-align: center; }
  .spm-empty-icon { font-size: 48px !important; color: #9CA3AF; margin-bottom: 12px; }
  .spm-empty p { color: #6B7280; margin-bottom: 18px; }

  .spm-overlay { position: fixed; inset: 0; background: rgba(17,24,39,0.55); display: flex;
    align-items: center; justify-content: center; z-index: 1000; padding: 20px; font-family: 'Poppins', sans-serif; }
  .spm-modal { background: #fff; border-radius: 16px; width: 100%; max-width: 520px;
    padding: 28px; position: relative; box-shadow: 0 20px 50px rgba(0,0,0,0.2); max-height: 92vh; overflow-y: auto; }
  .spm-modal-wide { max-width: 720px; }
  .spm-close { position: absolute; top: 14px; right: 14px; background: transparent; border: none;
    cursor: pointer; color: #6B7280; padding: 4px; }
  .spm-close:hover { color: #111827; }
  .spm-modal-title { font-size: 20px; font-weight: 800; margin-bottom: 6px; padding-right: 32px; }
  .spm-modal-sub { font-size: 13px; color: #6B7280; margin-bottom: 18px; }

  .spm-field { margin-bottom: 14px; }
  .spm-field label { display: block; font-size: 12px; font-weight: 700; color: #374151;
    text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
  .spm-input { box-sizing: border-box; width: 100%; padding: 10px 12px; border: 1px solid #E5E7EB;
    border-radius: 10px; font-size: 14px; font-family: inherit; color: #111827; background: #fff; }
  .spm-input:focus { outline: none; border-color: #1A56DB; box-shadow: 0 0 0 3px #EBF2FF; }
  .spm-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

  .spm-file-row { display: flex; gap: 10px; align-items: center; }
  .spm-file-name { font-size: 13px; color: #6B7280; }
  .spm-file-preview { margin-top: 10px; width: 220px; height: 140px; object-fit: cover; border-radius: 10px; border: 1px solid #E5E7EB; }

  .spm-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 8px; }
  .spm-btn-secondary { padding: 10px 18px; background: #fff; border: 1.5px solid #E5E7EB; color: #374151;
    border-radius: 10px; font-size: 13px; font-weight: 700; cursor: pointer; font-family: inherit;
    display: inline-flex; align-items: center; gap: 6px; }
  .spm-btn-secondary:hover { background: #F3F4F6; }
  .spm-btn-danger-lg { padding: 10px 18px; background: #DC2626; color: #fff; border: none;
    border-radius: 10px; font-size: 13px; font-weight: 700; cursor: pointer; font-family: inherit;
    display: inline-flex; align-items: center; gap: 6px; }
  .spm-btn-danger-lg:hover { background: #B91C1C; }
  .spm-btn-danger-lg:disabled { background: #FCA5A5; cursor: not-allowed; }

  .spm-danger-head { display: flex; gap: 14px; align-items: flex-start; margin-bottom: 18px; }
  .spm-danger-icon { width: 48px; height: 48px; border-radius: 12px; background: #FEE2E2; color: #B91C1C;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .spm-danger-box { background: #FEF2F2; border: 1px solid #FECACA; border-radius: 12px;
    padding: 14px; margin-bottom: 18px; }
  .spm-danger-summary { display: flex; gap: 12px; align-items: center; }
  .spm-danger-summary img { width: 64px; height: 64px; object-fit: cover; border-radius: 8px; }
  .spm-danger-summary strong { display: block; font-weight: 700; color: #111827; }
  .spm-danger-summary span { display: block; font-size: 12px; color: #6B7280; }
  .spm-confirm-phrase { background: #F3F4F6; border: 1px solid #E5E7EB; border-radius: 8px;
    padding: 10px 12px; font-family: 'Courier New', monospace; font-weight: 700; color: #B91C1C;
    margin-bottom: 8px; user-select: all; }

  .spm-an-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 18px; }
  .spm-an-stat { background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 12px; padding: 14px; text-align: center; }
  .spm-an-stat span { display: block; font-size: 20px; font-weight: 800; color: #1A56DB; }
  .spm-an-stat label { font-size: 11px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.5px; }
  .spm-an-card { background: #fff; border: 1px solid #E5E7EB; border-radius: 12px; padding: 18px; margin-bottom: 16px; }
  .spm-an-card-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
  .spm-an-card h3 { font-size: 14px; font-weight: 700; }
  .spm-an-trend { font-size: 12px; color: #15803d; font-weight: 700; }
  .spm-chart { display: flex; gap: 6px; align-items: flex-end; height: 160px; padding: 6px 0; }
  .spm-bar-wrap { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px; height: 100%; }
  .spm-bar { width: 100%; background: linear-gradient(180deg, #1A56DB, #93C5FD); border-radius: 4px 4px 0 0; min-height: 4px; }
  .spm-bar-label { font-size: 10px; color: #6B7280; }
  .spm-src-row { display: grid; grid-template-columns: 180px 1fr 50px; gap: 12px; align-items: center; margin-bottom: 10px; }
  .spm-src-label { font-size: 13px; color: #374151; }
  .spm-src-rail { height: 8px; background: #E5E7EB; border-radius: 4px; overflow: hidden; }
  .spm-src-fill { height: 100%; background: #1A56DB; }
  .spm-src-pct { font-size: 12px; font-weight: 700; color: #111827; text-align: right; }

  .spm-offer-card { background: #fff; border: 1px solid #E5E7EB; border-radius: 14px; padding: 18px; margin-bottom: 14px; }
  .spm-offer-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
  .spm-offer-buyer { font-size: 15px; font-weight: 700; }
  .spm-offer-meta { font-size: 12px; color: #6B7280; margin-top: 2px; }
  .spm-offer-amount-block { text-align: right; }
  .spm-offer-amount { font-size: 22px; font-weight: 800; color: #92400E; }
  .spm-offer-diff { font-size: 11px; font-weight: 700; margin-top: 2px; }
  .spm-offer-up { color: #15803d; }
  .spm-offer-down { color: #B91C1C; }
  .spm-offer-msg { font-size: 13px; color: #374151; font-style: italic; background: #F9FAFB;
    padding: 10px 14px; border-left: 3px solid #1A56DB; border-radius: 8px; margin-bottom: 12px; }
  .spm-offer-actions { display: flex; gap: 8px; justify-content: flex-end; }

  .spm-busy { position: fixed; inset: 0; background: rgba(17,24,39,0.65); z-index: 1500;
    display: flex; align-items: center; justify-content: center; font-family: 'Poppins', sans-serif; }
  .spm-busy-box { background: #fff; padding: 30px 40px; border-radius: 16px; text-align: center;
    box-shadow: 0 20px 50px rgba(0,0,0,0.3); display: flex; flex-direction: column; align-items: center; gap: 14px; }
  .spm-busy-box p { font-size: 14px; font-weight: 600; color: #111827; }
  .spm-spinner { width: 36px; height: 36px; border: 4px solid #E5E7EB; border-top-color: #1A56DB;
    border-radius: 50%; animation: spm-spin 0.8s linear infinite; }
  @keyframes spm-spin { to { transform: rotate(360deg); } }

  .spm-toast { position: fixed; bottom: 24px; right: 24px; background: #15803d; color: #fff;
    padding: 12px 20px; border-radius: 10px; font-size: 13px; font-weight: 600;
    box-shadow: 0 8px 24px rgba(0,0,0,0.2); display: flex; align-items: center; gap: 8px;
    z-index: 2000; font-family: 'Poppins', sans-serif; animation: spm-slidein 0.25s ease-out; }
  @keyframes spm-slidein { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
`;

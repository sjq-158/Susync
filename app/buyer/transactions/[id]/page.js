import Link from "next/link";
import { dbAll } from "@/lib/sqlite";
import ContactSupportButton from "./ContactSupportButton";

const STEPS = [
  { key: "offer", label: "Offer Accepted", icon: "handshake" },
  { key: "verify", label: "Documents Verified", icon: "verified" },
  { key: "contract", label: "Contract Review", icon: "description" },
  { key: "payment", label: "Payment & Escrow", icon: "account_balance" },
  { key: "turnover", label: "Turnover & Title", icon: "key" },
];

const STEP_DETAILS = {
  offer: "Buyer's offer was reviewed and accepted by the seller.",
  verify: "Title, tax declaration, and seller ID were checked by Susync.",
  contract: "Deed of Sale is being prepared and reviewed by both parties.",
  payment: "Funds will be held in escrow until clearance is confirmed.",
  turnover: "Keys, title transfer, and final walkthrough are scheduled.",
};

export default async function Page({ params }) {
  const { id } = await params;
  const rows = await dbAll(
    `SELECT t.*, p.title AS prop_title, p.image_url AS prop_image, p.beds, p.baths,
            p.floor_area_sqm, p.address_line, p.barangay, p.city, p.property_type,
            p.listing_kind, p.id AS property_id
     FROM transactions t
     LEFT JOIN properties p ON p.id = t.property_id
     WHERE t.id = ? OR t.reference_code = ?`,
    [id, id],
  );
  const t = rows[0];

  if (!t) {
    return (
      <main style={{ flex: 1, padding: 80, textAlign: "center", fontFamily: "Poppins, sans-serif" }}>
        <p style={{ marginBottom: 16, color: "#6B7280" }}>Transaction not found.</p>
        <Link href="/buyer/transactions" style={{ color: "#1A56DB", fontWeight: 600 }}>
          ← Back to My Transactions
        </Link>
      </main>
    );
  }

  const isCompleted = t.status === "completed";
  const isCancelled = t.status === "cancelled";
  const isHistory = isCompleted || isCancelled;
  const currentIdx = Math.max(0, Math.min(STEPS.length - 1, (t.step_current || 1) - 1));

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <main className="tt-main">
        <div className="tt-breadcrumb">
          <Link href="/buyer/transactions?tab=all">
            <span className="material-icons" style={{ fontSize: 16 }}>arrow_back</span> Back to My Transactions
          </Link>
          <span>/</span>
          <span>{t.reference_code}</span>
        </div>

        {isHistory && (
          <div className={`tt-banner ${isCompleted ? "tt-banner-done" : "tt-banner-cancel"}`}>
            <span className="material-icons">
              {isCompleted ? "verified" : "cancel"}
            </span>
            <div>
              <div className="tt-banner-title">
                {isCompleted ? "Transaction Completed" : "Transaction Cancelled"}
              </div>
              <div className="tt-banner-sub">
                {isCompleted
                  ? "This deal has been finalized. The records below are kept for your reference."
                  : "This deal was cancelled before completion. The records below are archived for your reference."}
              </div>
            </div>
          </div>
        )}

        <div className="tt-header">
          <div>
            <div className="tt-ref">{t.reference_code}</div>
            <h1 className="tt-title">{t.prop_title}</h1>
            <div className="tt-sub">
              <span><span className="material-icons" style={{ fontSize: 16, verticalAlign: "middle" }}>location_on</span> {t.barangay}, {t.city}</span>
              <span><span className="material-icons" style={{ fontSize: 16, verticalAlign: "middle" }}>person</span> {t.seller_display_name}</span>
            </div>
          </div>
          <div className={`tt-status-pill ${isCompleted ? "tt-pill-done" : isCancelled ? "tt-pill-cancel" : ""}`}>
            {isCompleted ? "Completed" : isCancelled ? "Cancelled" : "In Progress"}
          </div>
        </div>

        <div className="tt-layout">
          <div>
            <div className="tt-card">
              <div className="tt-card-head">
                <h2>{isHistory ? "Transaction History" : "Transaction Progress"}</h2>
                <span className={`tt-percent ${isCancelled ? "tt-percent-cancel" : ""}`}>{t.progress_percent}%</span>
              </div>
              <div className="tt-rail">
                <div
                  className="tt-fill"
                  style={{
                    width: `${t.progress_percent}%`,
                    background: isCompleted ? "#15803D" : isCancelled ? "#9CA3AF" : undefined,
                  }}
                />
              </div>
              <div className="tt-step-current">
                {isCompleted
                  ? `All ${t.step_total} steps completed`
                  : isCancelled
                    ? `Cancelled at step ${t.step_current} of ${t.step_total} — ${STEPS[currentIdx].label}`
                    : `Step ${t.step_current} of ${t.step_total} — ${STEPS[currentIdx].label}`}
              </div>

              <ol className="tt-timeline">
                {STEPS.map((s, i) => {
                  let state;
                  if (isCompleted) state = "done";
                  else if (isCancelled) state = i < currentIdx ? "done" : i === currentIdx ? "cancel" : "pending";
                  else state = i < currentIdx ? "done" : i === currentIdx ? "active" : "pending";
                  return (
                    <li key={s.key} className={`tt-step tt-${state}`}>
                      <div className="tt-step-icon">
                        <span className="material-icons">
                          {state === "done" ? "check" : state === "cancel" ? "close" : s.icon}
                        </span>
                      </div>
                      <div className="tt-step-body">
                        <div className="tt-step-label">{s.label}</div>
                        <div className="tt-step-detail">{STEP_DETAILS[s.key]}</div>
                      </div>
                      <div className="tt-step-state">
                        {state === "done"
                          ? "Completed"
                          : state === "active"
                            ? "In Progress"
                            : state === "cancel"
                              ? "Cancelled"
                              : "Pending"}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>

            <div className="tt-card">
              <h2>{isHistory ? "Transaction History" : "Activity"}</h2>
              <ul className="tt-activity">
                {isCompleted ? (
                  <>
                    <li><strong>Step 1</strong> — Offer of {t.price_display} accepted by {t.seller_display_name}.</li>
                    <li><strong>Step 2</strong> — Documents verified by Susync compliance team.</li>
                    <li><strong>Step 3</strong> — Deed of Sale signed by both parties.</li>
                    <li><strong>Step 4</strong> — Payment cleared through escrow.</li>
                    <li><strong>Step 5</strong> — Turnover completed and title transferred. Transaction closed.</li>
                  </>
                ) : isCancelled ? (
                  <>
                    <li><strong>Step 1</strong> — Offer of {t.price_display} sent to {t.seller_display_name}.</li>
                    <li><strong>Cancelled</strong> — Transaction was cancelled before completion.</li>
                  </>
                ) : (
                  <>
                    <li><strong>Today, 2:15 PM</strong> — Offer of {t.price_display} sent to {t.seller_display_name}.</li>
                    <li><strong>Today, 2:20 PM</strong> — Offer accepted. Contract preparation started.</li>
                    <li><strong>Today, 2:25 PM</strong> — Contract draft uploaded for buyer review.</li>
                  </>
                )}
              </ul>
            </div>
          </div>

          <aside className="tt-side">
            <div className="tt-prop-card">
              <img src={t.prop_image} alt={t.prop_title} className="tt-prop-img" />
              <div className="tt-prop-price">{t.price_display}</div>
              <div className="tt-prop-title">{t.prop_title}</div>
              <div className="tt-prop-loc">
                <span className="material-icons" style={{ fontSize: 16, verticalAlign: "middle" }}>location_on</span>
                {t.address_line}, {t.barangay}, {t.city}
              </div>
              <div className="tt-prop-specs">
                <div><span className="material-icons" style={{ fontSize: 16, verticalAlign: "middle" }}>bed</span> {t.beds} Beds</div>
                <div><span className="material-icons" style={{ fontSize: 16, verticalAlign: "middle" }}>bathtub</span> {t.baths} Baths</div>
                <div><span className="material-icons" style={{ fontSize: 16, verticalAlign: "middle" }}>square_foot</span> {t.floor_area_sqm} sqm</div>
              </div>
              <Link href={`/buyer/properties/${t.property_id}`} className="tt-btn-primary">
                <span className="material-icons" style={{ fontSize: 18 }}>visibility</span> View Full Listing
              </Link>
              <Link href="/buyer/messages" className="tt-btn-outline">
                <span className="material-icons" style={{ fontSize: 18 }}>chat</span> Message Seller
              </Link>
            </div>

            <div className="tt-prop-card">
              <div className="tt-label">{isHistory ? "Records" : "Need Help?"}</div>
              <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.6 }}>
                {isCompleted
                  ? "Your transaction documents and final receipts are archived for download anytime."
                  : isCancelled
                    ? "Cancellation notes and refund records (if any) are preserved for your reference."
                    : "Susync support is available 24/7 to guide you through the contract review and escrow steps."}
              </p>
              {isHistory ? (
                <button className="tt-btn-outline" style={{ marginTop: 12 }}>
                  <span className="material-icons" style={{ fontSize: 18 }}>download</span>
                  {" "}Download Records
                </button>
              ) : (
                <ContactSupportButton />
              )}
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}

const CSS = `
  .tt-main { flex: 1; padding: 32px 40px 60px; font-family: 'Poppins', sans-serif; color: #111827; background: #F9FAFB; }
  .tt-breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #6B7280; margin-bottom: 20px; }
  .tt-breadcrumb a { color: #1A56DB; text-decoration: none; font-weight: 600; display: inline-flex; align-items: center; gap: 4px; }
  .tt-breadcrumb a:hover { text-decoration: underline; }
  .tt-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 24px; margin-bottom: 24px; }
  .tt-ref { font-size: 12px; color: #6B7280; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; }
  .tt-title { font-size: 28px; font-weight: 800; margin: 4px 0 6px; }
  .tt-sub { display: flex; gap: 14px; font-size: 14px; color: #6B7280; flex-wrap: wrap; }
  .tt-status-pill { background: #EBF2FF; color: #1A56DB; padding: 6px 14px; border-radius: 999px; font-size: 12px; font-weight: 700; }
  .tt-pill-done { background: #DCFCE7; color: #15803D; }
  .tt-pill-cancel { background: #FEE2E2; color: #B91C1C; }

  .tt-banner { display: flex; gap: 14px; align-items: center; padding: 16px 20px; border-radius: 14px; margin-bottom: 22px; }
  .tt-banner .material-icons { font-size: 28px; flex-shrink: 0; }
  .tt-banner-title { font-size: 15px; font-weight: 700; margin-bottom: 2px; }
  .tt-banner-sub { font-size: 13px; line-height: 1.5; }
  .tt-banner-done { background: #DCFCE7; color: #15803D; border: 1px solid #BBF7D0; }
  .tt-banner-cancel { background: #FEF2F2; color: #B91C1C; border: 1px solid #FECACA; }

  .tt-percent-cancel { color: #9CA3AF !important; }

  .tt-layout { display: grid; grid-template-columns: 1fr 360px; gap: 28px; align-items: start; }

  .tt-card { background: #fff; border: 1px solid #E5E7EB; border-radius: 16px; padding: 24px; margin-bottom: 24px; }
  .tt-card h2 { font-size: 18px; font-weight: 700; margin-bottom: 14px; }
  .tt-card-head { display: flex; justify-content: space-between; align-items: center; }
  .tt-percent { font-size: 22px; font-weight: 800; color: #1A56DB; }
  .tt-rail { height: 8px; background: #E5E7EB; border-radius: 4px; margin: 10px 0 6px; overflow: hidden; }
  .tt-fill { height: 100%; background: #1A56DB; }
  .tt-step-current { font-size: 13px; color: #6B7280; margin-bottom: 18px; }

  .tt-timeline { list-style: none; padding: 0; margin: 0; }
  .tt-step { display: grid; grid-template-columns: 44px 1fr auto; gap: 14px; align-items: flex-start; padding: 14px 0; border-top: 1px solid #F3F4F6; }
  .tt-step:first-child { border-top: none; }
  .tt-step-icon { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: #F3F4F6; color: #6B7280; }
  .tt-step-icon .material-icons { font-size: 18px; }
  .tt-done .tt-step-icon { background: #DCFCE7; color: #15803D; }
  .tt-active .tt-step-icon { background: #EBF2FF; color: #1A56DB; }
  .tt-cancel .tt-step-icon { background: #FEE2E2; color: #B91C1C; }
  .tt-step-label { font-size: 14px; font-weight: 700; }
  .tt-step-detail { font-size: 12px; color: #6B7280; margin-top: 2px; }
  .tt-step-state { font-size: 11px; font-weight: 700; color: #6B7280; text-transform: uppercase; letter-spacing: 0.5px; }
  .tt-done .tt-step-state { color: #15803D; }
  .tt-active .tt-step-state { color: #1A56DB; }
  .tt-cancel .tt-step-state { color: #B91C1C; }

  .tt-activity { list-style: none; padding: 0; margin: 0; }
  .tt-activity li { font-size: 13px; color: #6B7280; padding: 8px 0; border-top: 1px dashed #E5E7EB; }
  .tt-activity li:first-child { border-top: none; }
  .tt-activity strong { color: #111827; font-weight: 700; }

  .tt-side { position: sticky; top: 96px; }
  .tt-prop-card { background: #fff; border: 1px solid #E5E7EB; border-radius: 16px; padding: 20px; margin-bottom: 18px; box-shadow: 0 1px 4px rgba(26,23,20,0.06); }
  .tt-prop-img { width: 100%; height: 170px; object-fit: cover; border-radius: 12px; margin-bottom: 14px; }
  .tt-prop-price { font-size: 22px; font-weight: 800; color: #1A56DB; }
  .tt-prop-title { font-size: 15px; font-weight: 700; margin: 4px 0; }
  .tt-prop-loc { font-size: 12px; color: #6B7280; display: flex; align-items: center; gap: 4px; margin-bottom: 14px; }
  .tt-prop-specs { display: flex; justify-content: space-between; background: #EBF2FF; padding: 10px 12px; border-radius: 10px; font-size: 12px; font-weight: 600; margin-bottom: 14px; }
  .tt-label { font-size: 11px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700; margin-bottom: 10px; }

  .tt-btn-primary { box-sizing: border-box; width: 100%; padding: 12px; background: #1A56DB; color: #fff; border-radius: 10px; font-size: 13px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 6px; text-decoration: none; border: none; }
  .tt-btn-primary:hover { background: #1849b8; }
  .tt-btn-outline { box-sizing: border-box; width: 100%; padding: 12px; background: #fff; color: #1A56DB; border: 1.5px solid #1A56DB; border-radius: 10px; font-size: 13px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 6px; text-decoration: none; margin-top: 10px; font-family: inherit; }
  .tt-btn-outline:hover { background: #EBF2FF; }
`;

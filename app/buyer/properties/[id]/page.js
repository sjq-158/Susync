import Link from "next/link";
import { dbAll } from "@/lib/sqlite";
import { PropertyActionRow, PropertyGallery, PropertyCTAButtons } from "./PropertyInteractive";

const GALLERY = {
  "prop-1": [
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600",
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600",
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600",
    "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=600",
  ],
  "prop-2": [
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600",
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600",
  ],
  "prop-3": [
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200",
    "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600",
    "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600",
    "https://images.unsplash.com/photo-1556909114-44e3e9399a2e?w=600",
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600",
  ],
};

const FEATURES = {
  house: [
    ["security", "24/7 Gated Security"],
    ["pool", "Private Swimming Pool"],
    ["wifi", "Fiber Internet Ready"],
    ["ac_unit", "Centralized A/C"],
    ["solar_power", "Solar Panels"],
    ["kitchen", "Modular Kitchen"],
    ["yard", "Landscaped Garden"],
    ["videocam", "CCTV System"],
  ],
  condo: [
    ["pool", "Infinity Pool & Jacuzzi"],
    ["fitness_center", "24/7 Fitness Center"],
    ["security", "Concierge & Security"],
    ["elevator", "High-Speed Elevators"],
    ["deck", "Sky Lounge & Garden"],
    ["local_laundry_service", "Laundry Services"],
    ["pets", "Pet-Friendly"],
    ["ev_station", "EV Charging"],
  ],
  townhouse: [
    ["security", "Subdivision Security"],
    ["park", "Community Playground"],
    ["wifi", "Fiber Internet Ready"],
    ["water_drop", "Water Tank Reserve"],
    ["yard", "Private Backyard"],
    ["kitchen", "Modern Kitchen"],
    ["balcony", "Front Balcony"],
    ["videocam", "Perimeter CCTV"],
  ],
};

const NEARBY = {
  "prop-1": [
    ["school", "Cebu International School — 1.2 km"],
    ["local_hospital", "Chong Hua Hospital — 2.1 km"],
    ["shopping_cart", "Ayala Center Cebu — 2.8 km"],
    ["business", "Cebu IT Park — 1.5 km"],
    ["restaurant", "The Walk Restaurants — 1.4 km"],
    ["flight", "Mactan Airport — 14 km"],
  ],
  "prop-2": [
    ["business", "Cebu IT Park — 0.3 km"],
    ["restaurant", "The Walk — 0.4 km"],
    ["shopping_cart", "Ayala Center Cebu — 1.5 km"],
    ["local_hospital", "Cebu Doctors' Hospital — 2.0 km"],
    ["school", "University of Cebu — 1.8 km"],
    ["flight", "Mactan Airport — 12 km"],
  ],
  "prop-3": [
    ["shopping_cart", "SM Consolacion — 1.0 km"],
    ["school", "Consolacion National HS — 0.8 km"],
    ["local_hospital", "Allegiant Hospital — 1.6 km"],
    ["church", "St. Narciso Parish — 0.6 km"],
    ["restaurant", "Gaisano Grand Mall — 1.3 km"],
    ["directions_bus", "Consolacion Terminal — 0.9 km"],
  ],
};

const SELLER_STATS = {
  "user-seller-1": { rating: "4.9 ★", listings: 32, response: "~2 hrs", since: 2021 },
  "user-seller-2": { rating: "4.8 ★", listings: 17, response: "~1 hr", since: 2022 },
  "user-seller-3": { rating: "4.7 ★", listings: 5, response: "~4 hrs", since: 2023 },
};

export default async function Page({ params }) {
  const { id } = await params;
  const rows = await dbAll(
    `SELECT p.*, u.display_name AS seller_name, u.id AS seller_user_id
     FROM properties p
     LEFT JOIN users u ON u.id = p.seller_id
     WHERE p.id = ?`,
    [id],
  );
  const p = rows[0];

  if (!p) {
    return (
      <main style={{ flex: 1, padding: 80, textAlign: "center", fontFamily: "Poppins, sans-serif" }}>
        <p style={{ marginBottom: 16, color: "#6B7280" }}>Listing not found.</p>
        <Link href="/buyer/saved" style={{ color: "#1A56DB", fontWeight: 600 }}>
          ← Back to Saved Properties
        </Link>
      </main>
    );
  }

  const priceLabel =
    p.listing_kind === "rent"
      ? `₱${Number(p.price).toLocaleString("en-PH")}`
      : `₱${Number(p.price).toLocaleString("en-PH")}`;
  const priceSub =
    p.listing_kind === "rent"
      ? `For Rent · ₱${Math.round(p.price / p.floor_area_sqm).toLocaleString("en-PH")} / sqm`
      : `For Sale · ₱${Math.round(p.price / p.floor_area_sqm).toLocaleString("en-PH")} / sqm`;
  const photos = GALLERY[id] || [p.image_url];
  const features = FEATURES[p.property_type] || FEATURES.house;
  const nearby = NEARBY[id] || [];
  const stats = SELLER_STATS[p.seller_user_id] || { rating: "—", listings: "—", response: "—", since: "—" };
  const mapQuery = encodeURIComponent(`${p.barangay || ""}, ${p.city}`);
  const sellerInitial = (p.seller_name || "S").charAt(0).toUpperCase();

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: PAGE_CSS }} />
      <main className="pd-main">
        <div className="pd-breadcrumb">
          <Link href="/buyer/saved">
            <span className="material-icons" style={{ fontSize: 16 }}>arrow_back</span> Back to Saved Properties
          </Link>
          <span>/</span>
          <span>{p.title}</span>
        </div>

        <div className="pd-title-row">
          <div>
            <h1 className="pd-title">{p.title}</h1>
            <div className="pd-meta">
              {p.verified ? (
                <span className="pd-badge"><span className="material-icons" style={{ fontSize: 14 }}>check_circle</span> Verified Listing</span>
              ) : null}
              <span><span className="material-icons" style={{ fontSize: 16, verticalAlign: "middle" }}>location_on</span> {p.barangay}, {p.city}</span>
              <span><span className="material-icons" style={{ fontSize: 16, verticalAlign: "middle" }}>visibility</span> 1,243 views</span>
            </div>
          </div>
          <div className="pd-price-block">
            <div className="pd-price">
              {priceLabel}
              {p.listing_kind === "rent" ? <span className="pd-price-suffix">/mo</span> : null}
            </div>
            <div className="pd-price-sub">{priceSub}</div>
          </div>
        </div>

        <div className="pd-action-row">
          <PropertyActionRow title={p.title} />
        </div>

        <PropertyGallery photos={photos} />

        <div className="pd-layout">
          <div>
            <div className="pd-section">
              <h2>Key Specifications</h2>
              <div className="pd-key-specs">
                <div className="pd-key-spec"><span className="material-icons pd-ks-icon">bed</span><div className="pd-ks-value">{p.beds}</div><div className="pd-ks-label">Bedrooms</div></div>
                <div className="pd-key-spec"><span className="material-icons pd-ks-icon">bathtub</span><div className="pd-ks-value">{p.baths}</div><div className="pd-ks-label">Bathrooms</div></div>
                <div className="pd-key-spec"><span className="material-icons pd-ks-icon">square_foot</span><div className="pd-ks-value">{p.floor_area_sqm}</div><div className="pd-ks-label">Floor Area (sqm)</div></div>
                <div className="pd-key-spec"><span className="material-icons pd-ks-icon">directions_car</span><div className="pd-ks-value">{p.property_type === "condo" ? 1 : 2}</div><div className="pd-ks-label">Parking</div></div>
              </div>
            </div>

            <div className="pd-section">
              <h2>Description</h2>
              <p>{p.description}</p>
            </div>

            <div className="pd-section">
              <h2>Property Details</h2>
              <div className="pd-detail-grid">
                <div className="pd-detail-item"><span className="pd-dl">Property Type</span><span className="pd-dv">{p.property_type.charAt(0).toUpperCase() + p.property_type.slice(1)}</span></div>
                <div className="pd-detail-item"><span className="pd-dl">Floor Area</span><span className="pd-dv">{p.floor_area_sqm} sqm</span></div>
                <div className="pd-detail-item"><span className="pd-dl">Address</span><span className="pd-dv">{p.address_line}</span></div>
                <div className="pd-detail-item"><span className="pd-dl">City</span><span className="pd-dv">{p.city}</span></div>
                <div className="pd-detail-item"><span className="pd-dl">Listing Kind</span><span className="pd-dv">{p.listing_kind === "rent" ? "For Rent" : "For Sale"}</span></div>
                <div className="pd-detail-item"><span className="pd-dl">Status</span><span className="pd-dv">{p.status}</span></div>
                <div className="pd-detail-item"><span className="pd-dl">Title Status</span><span className="pd-dv">Clean Title (TCT)</span></div>
                <div className="pd-detail-item"><span className="pd-dl">Listing ID</span><span className="pd-dv">{p.id.toUpperCase()}</span></div>
              </div>
            </div>

            <div className="pd-section">
              <h2>Features &amp; Amenities</h2>
              <div className="pd-features">
                {features.map(([icon, label]) => (
                  <div key={label} className="pd-feature"><span className="material-icons">{icon}</span> {label}</div>
                ))}
              </div>
            </div>

            <div className="pd-section">
              <h2>Location &amp; 3D Map View</h2>
              <div className="pd-map-tabs">
                <span className="pd-map-tab">Street</span>
                <span className="pd-map-tab pd-active">3D / Satellite</span>
              </div>
              <iframe
                className="pd-map-frame"
                src={`https://maps.google.com/maps?q=${mapQuery}&t=k&z=16&ie=UTF8&iwloc=&output=embed`}
                allowFullScreen
                loading="lazy"
              />
              <div className="pd-map-note">
                <span className="material-icons" style={{ fontSize: 14 }}>info</span>
                Drag the map to explore the neighborhood in satellite/3D view.
              </div>
            </div>

            {nearby.length ? (
              <div className="pd-section">
                <h2>Nearby Establishments</h2>
                <div className="pd-features">
                  {nearby.map(([icon, label]) => (
                    <div key={label} className="pd-feature"><span className="material-icons">{icon}</span> {label}</div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div className="pd-sticky-side">
            <div className="pd-seller-card">
              <div className="pd-seller-label">Listed By</div>
              <div className="pd-seller-row">
                <div className="pd-seller-avatar">{sellerInitial}</div>
                <div>
                  <h3>{p.seller_name || "Verified Seller"}</h3>
                  <div className="pd-role">Verified Seller · Susync Pro</div>
                  <span className="pd-verified-line"><span className="material-icons" style={{ fontSize: 14 }}>verified</span> ID Verified</span>
                </div>
              </div>
              <Link href="/buyer/messages" className="pd-btn-primary">
                <span className="material-icons" style={{ fontSize: 18 }}>chat</span> Message Seller
              </Link>
              <PropertyCTAButtons
                listingKind={p.listing_kind}
                propertyTitle={p.title}
                priceLabel={priceLabel}
              />

              <div className="pd-quick-stats">
                <div className="pd-qs"><strong>{stats.rating}</strong> Seller Rating</div>
                <div className="pd-qs"><strong>{stats.listings}</strong> Properties Listed</div>
                <div className="pd-qs"><strong>{stats.response}</strong> Response Time</div>
                <div className="pd-qs"><strong>{stats.since}</strong> Member Since</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

const PAGE_CSS = `
  .pd-main { flex: 1; padding: 32px 40px 60px; font-family: 'Poppins', sans-serif; color: #111827; background: #F9FAFB; }
  .pd-breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #6B7280; margin-bottom: 20px; }
  .pd-breadcrumb a { color: #1A56DB; text-decoration: none; font-weight: 600; display: inline-flex; align-items: center; gap: 4px; }
  .pd-breadcrumb a:hover { text-decoration: underline; }

  .pd-title-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; gap: 24px; }
  .pd-title { font-size: 30px; font-weight: 800; margin-bottom: 6px; }
  .pd-meta { display: flex; align-items: center; gap: 14px; font-size: 14px; color: #6B7280; flex-wrap: wrap; }
  .pd-badge { background: #DCFCE7; color: #15803D; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; display: inline-flex; align-items: center; gap: 4px; }
  .pd-price-block { text-align: right; }
  .pd-price { font-size: 32px; font-weight: 800; color: #1A56DB; }
  .pd-price-suffix { font-size: 18px; color: #6B7280; font-weight: 600; }
  .pd-price-sub { font-size: 12px; color: #6B7280; }

  .pd-action-row { display: flex; gap: 10px; margin: 16px 0 24px; }
  .pd-btn-icon { background: #fff; border: 1px solid #E5E7EB; padding: 8px 14px; border-radius: 10px; font-family: inherit; font-size: 13px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; color: #111827; }
  .pd-btn-icon:hover { background: #EBF2FF; color: #1A56DB; border-color: #1A56DB; }
  .pd-btn-icon.pd-saved { background: #FEE2E2; border-color: #FCA5A5; color: #DC2626; }

  .pd-gallery { display: grid; grid-template-columns: 2fr 1fr 1fr; grid-template-rows: 220px 220px; gap: 8px; margin-bottom: 32px; border-radius: 16px; overflow: hidden; }
  .pd-g-main { grid-row: 1 / span 2; }
  .pd-gallery img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .pd-g-cell { position: relative; }
  .pd-more-overlay { position: absolute; inset: 0; background: rgba(17,24,39,0.55); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 16px; }

  .pd-layout { display: grid; grid-template-columns: 1fr 360px; gap: 32px; align-items: start; }

  .pd-section { background: #fff; border: 1px solid #E5E7EB; border-radius: 16px; padding: 24px; margin-bottom: 24px; }
  .pd-section h2 { font-size: 18px; font-weight: 700; margin-bottom: 14px; }
  .pd-section p { font-size: 14px; line-height: 1.7; color: #6B7280; }

  .pd-key-specs { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
  .pd-key-spec { background: #EBF2FF; border-radius: 12px; padding: 16px; text-align: center; }
  .pd-ks-icon { color: #1A56DB; font-size: 24px !important; margin-bottom: 6px; }
  .pd-ks-label { font-size: 11px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px; }
  .pd-ks-value { font-size: 16px; font-weight: 700; color: #111827; }

  .pd-detail-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px 24px; }
  .pd-detail-item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px dashed #E5E7EB; font-size: 13px; }
  .pd-dl { color: #6B7280; }
  .pd-dv { font-weight: 700; }

  .pd-features { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .pd-feature { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #111827; }
  .pd-feature .material-icons { color: #1A56DB; font-size: 18px; }

  .pd-map-tabs { display: inline-flex; background: #F9FAFB; border-radius: 10px; padding: 4px; margin-bottom: 14px; }
  .pd-map-tab { padding: 6px 14px; border-radius: 8px; font-size: 12px; font-weight: 600; color: #6B7280; cursor: pointer; }
  .pd-map-tab.pd-active { background: #fff; color: #111827; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
  .pd-map-frame { width: 100%; height: 420px; border: 0; border-radius: 12px; overflow: hidden; }
  .pd-map-note { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #6B7280; margin-top: 10px; }

  .pd-sticky-side { position: sticky; top: 96px; align-self: start; }
  .pd-seller-card { background: #fff; border: 1px solid #E5E7EB; border-radius: 16px; padding: 24px; box-shadow: 0 1px 4px rgba(26,23,20,0.08), 0 2px 12px rgba(26,23,20,0.06); }
  .pd-seller-label { font-size: 11px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700; margin-bottom: 12px; }
  .pd-seller-row { display: flex; align-items: center; gap: 12px; margin-bottom: 18px; }
  .pd-seller-avatar { width: 56px; height: 56px; border-radius: 50%; background: #1A56DB; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 20px; }
  .pd-seller-row h3 { font-size: 16px; font-weight: 700; }
  .pd-role { font-size: 12px; color: #6B7280; }
  .pd-verified-line { font-size: 12px; color: #15803D; display: inline-flex; align-items: center; gap: 4px; font-weight: 600; }

  .pd-btn-primary { box-sizing: border-box; width: 100%; padding: 12px 16px; background: #1A56DB; color: #fff; border: none; border-radius: 10px; font-family: inherit; font-size: 14px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 6px; text-decoration: none; }
  .pd-btn-primary:hover { background: #1849b8; }
  .pd-btn-outline { box-sizing: border-box; width: 100%; padding: 12px 16px; background: #fff; color: #1A56DB; border: 1.5px solid #1A56DB; border-radius: 10px; font-family: inherit; font-size: 14px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 6px; margin-top: 10px; }
  .pd-btn-outline:hover { background: #EBF2FF; }
  .pd-btn-accent { border-color: #92400E; color: #92400E; }
  .pd-btn-accent:hover { background: #FEF3C7; }

  .pd-quick-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 18px; padding-top: 18px; border-top: 1px solid #E5E7EB; }
  .pd-qs { font-size: 11px; color: #6B7280; }
  .pd-qs strong { display: block; font-size: 14px; color: #111827; font-weight: 700; }
`;

import Link from "next/link";
import { dbAll } from "@/lib/sqlite";
import { loadImport } from "@/lib/loadImport";

export default async function Page({ params }) {
  const { id } = await params;
  const rows = await dbAll(`SELECT * FROM properties WHERE id = ?`, [id]);
  const p = rows[0];
  const { css } = loadImport("view_properties_BUYER");

  if (!p) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: css }} />
        <main style={{ flex: 1, padding: 80, textAlign: "center" }}>
          <p style={{ marginBottom: 16 }}>Listing not found.</p>
          <Link href="/buyer/properties" className="btn-details" style={{ textDecoration: "none", display: "inline-block" }}>
            Back to search
          </Link>
        </main>
      </>
    );
  }

  const priceLabel =
    p.listing_kind === "rent" ? `₱${Number(p.price).toLocaleString("en-PH")}/mo` : `₱${Number(p.price).toLocaleString("en-PH")}`;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <main style={{ flex: 1, padding: "40px 60px" }}>
        <div className="results-info" style={{ marginBottom: 24 }}>
          <h2>Property details</h2>
          <Link href="/buyer/properties" className="sort-select" style={{ textDecoration: "none", padding: "10px 16px", border: "1px solid var(--border)", borderRadius: 10 }}>
            ← Back to results
          </Link>
        </div>

        <div className="property-grid">
          <div className="property-card">
            <div className="card-image-box">
              <img src={p.image_url} alt={p.title} />
              <span className="badge-verified"><span className="material-icons" style={{ fontSize: 14, verticalAlign: "middle" }}>check</span> Verified</span>
            </div>
            <div className="card-body">
              <p className="card-price">{priceLabel}</p>
              <h4 className="card-title">{p.title}</h4>
              <p className="card-loc">
                <span className="material-icons" style={{ fontSize: 14, verticalAlign: "middle" }}>location_on</span> {p.barangay}, {p.city}
              </p>
              <p style={{ fontSize: 13, color: "var(--neutral-500)", lineHeight: 1.6, marginTop: 12 }}>{p.description}</p>
              <div className="card-specs">
                <span className="spec"><span className="material-icons" style={{ fontSize: 14, verticalAlign: "middle" }}>bed</span> {p.beds} Beds</span>
                <span className="spec"><span className="material-icons" style={{ fontSize: 14, verticalAlign: "middle" }}>bathtub</span> {p.baths} Baths</span>
                <span className="spec"><span className="material-icons" style={{ fontSize: 14, verticalAlign: "middle" }}>square_foot</span> {p.floor_area_sqm} m²</span>
              </div>
              <div className="card-footer">
                <div className="seller">
                  <div className="seller-avatar">M</div>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>List owner</span>
                </div>
                <Link href="/buyer/messages" className="btn-details" style={{ textDecoration: "none", textAlign: "center" }}>
                  Message seller
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

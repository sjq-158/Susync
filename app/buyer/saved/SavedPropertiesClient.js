"use client";

import { useState } from "react";

const INITIAL_PROPERTIES = [
  {
    id: "prop-1",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400",
    imageAlt: "House",
    verified: true,
    price: "₱8,500,000",
    title: "Modern 4BR House in Cebu City",
    location: "Lahug, Cebu City",
    beds: 4,
    baths: 3,
    sqm: 220,
    ownerInitial: "M",
    ownerName: "Maria Santos",
  },
  {
    id: "prop-2",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400",
    imageAlt: "Condo",
    verified: true,
    price: "₱35,000/mo",
    title: "Stylish 2BR Condo in Cebu IT Park",
    location: "Mandaue City",
    beds: 2,
    baths: 2,
    sqm: 75,
    ownerInitial: "C",
    ownerName: "Carlos Reyes",
  },
  {
    id: "prop-3",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400",
    imageAlt: "House",
    verified: false,
    price: "₱5,200,000",
    title: "Cozy Townhouse in Consolacion",
    location: "Consolacion, Cebu",
    beds: 3,
    baths: 2,
    sqm: 140,
    ownerInitial: "A",
    ownerName: "Ana Lim",
  },
];

export default function SavedPropertiesClient() {
  const [properties, setProperties] = useState(INITIAL_PROPERTIES);
  const [liked, setLiked] = useState(() => new Set(INITIAL_PROPERTIES.map((p) => p.id)));

  const toggleLike = (id) => {
    const isLiked = liked.has(id);
    if (isLiked) {
      setProperties((prev) => prev.filter((p) => p.id !== id));
      setLiked((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } else {
      setLiked((prev) => new Set(prev).add(id));
    }
  };

  return (
    <main>
      <div className="page-header">
        <h1>Saved Properties</h1>
        <p>
          {properties.length === 0
            ? "You haven't saved any properties yet."
            : `You have ${properties.length} ${properties.length === 1 ? "property" : "properties"} saved in your wishlist.`}
        </p>
      </div>

      {properties.length === 0 ? (
        <div
          style={{
            background: "#fff",
            border: "1px dashed #E5E7EB",
            borderRadius: 16,
            padding: "48px 24px",
            textAlign: "center",
            color: "#6B7280",
          }}
        >
          <span className="material-icons" style={{ fontSize: 48, color: "#9CA3AF" }}>
            favorite_border
          </span>
          <p style={{ marginTop: 12, fontSize: 14, fontWeight: 600 }}>
            Your saved list is empty. Browse listings and tap the heart to save them here.
          </p>
        </div>
      ) : (
        <div className="property-grid">
          {properties.map((p) => {
            const isLiked = liked.has(p.id);
            return (
              <div className="property-card" key={p.id}>
                <div className="card-image-wrapper">
                  <img src={p.image} alt={p.imageAlt} className="card-image" />
                  {p.verified && (
                    <span className="badge badge-verified">
                      <span className="material-icons" style={{ fontSize: 18, verticalAlign: "middle" }}>
                        check
                      </span>{" "}
                      Verified
                    </span>
                  )}
                  <button
                    type="button"
                    className="save-btn"
                    aria-label={isLiked ? "Unlike" : "Like"}
                    aria-pressed={isLiked}
                    onClick={() => toggleLike(p.id)}
                    style={{ color: isLiked ? "#EF4444" : "#9CA3AF" }}
                  >
                    <span className="material-icons" style={{ fontSize: 18, verticalAlign: "middle" }}>
                      {isLiked ? "favorite" : "favorite_border"}
                    </span>
                  </button>
                </div>
                <div className="card-content">
                  <p className="card-price">{p.price}</p>
                  <h3 className="card-title">{p.title}</h3>
                  <p className="card-location">
                    <span className="material-icons" style={{ fontSize: 18, verticalAlign: "middle" }}>
                      location_on
                    </span>{" "}
                    {p.location}
                  </p>
                  <div className="card-specs">
                    <span className="spec-item">
                      <span className="material-icons" style={{ fontSize: 18, verticalAlign: "middle" }}>
                        bed
                      </span>{" "}
                      {p.beds} Beds
                    </span>
                    <span className="spec-item">
                      <span className="material-icons" style={{ fontSize: 18, verticalAlign: "middle" }}>
                        bathtub
                      </span>{" "}
                      {p.baths} Baths
                    </span>
                    <span className="spec-item">
                      <span className="material-icons" style={{ fontSize: 18, verticalAlign: "middle" }}>
                        square_foot
                      </span>{" "}
                      {p.sqm} sqm
                    </span>
                  </div>
                  <div className="card-footer">
                    <div className="owner-info">
                      <div className="owner-avatar">{p.ownerInitial}</div>
                      <span className="owner-name">{p.ownerName}</span>
                    </div>
                    <a
                      href={`/buyer/properties/${p.id}`}
                      className="view-btn"
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      View Details
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}

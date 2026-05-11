export default function LandingPage() {
  return (
    <>
      <style>{`
        :root {
          --primary-500: #1A56DB;
          --primary-100: #EBF2FF;
          --accent-500: #92400E;
          --accent-100: #FEF3C7;
          --neutral-100: #fbfbf9;
          --neutral-500: #6B7280;
          --neutral-900: #111827;
          --border: #E5E7EB;
          --white: #ffffff;
          --verified-bg: #dcfce7;
          --verified-text: #15803d;
          --shadow-card: 0 1px 4px rgba(26,23,20,0.08), 0 2px 12px rgba(26,23,20,0.06);
          --shadow-overlay: 0 12px 40px rgba(0,0,0,0.12);
        }

        .lp-root {
          font-family: 'Poppins', sans-serif;
          background: var(--white);
          color: var(--neutral-900);
          width: 100%;
          overflow-x: hidden;
        }

        /* ─── HERO ─── */
        .lp-hero {
          background-color: var(--primary-100);
          padding: 80px;
          display: flex;
          align-items: center;
          gap: 60px;
        }

        .lp-hero-content { flex: 1; min-width: 0; }

        .lp-hero-tagline {
          color: var(--accent-500);
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin-bottom: 16px;
          display: block;
        }

        .lp-hero-title {
          font-size: 52px;
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 24px;
        }

        .lp-hero-title span { color: var(--primary-500); }

        .lp-hero-desc {
          font-size: 18px;
          color: var(--neutral-500);
          max-width: 520px;
          margin-bottom: 32px;
          line-height: 1.6;
        }

        .lp-hero-btns {
          display: flex;
          gap: 16px;
          margin-bottom: 40px;
          flex-wrap: wrap;
        }

        .lp-btn {
          padding: 16px 32px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 16px;
          text-decoration: none;
          border: 1px solid var(--border);
          display: inline-flex;
          align-items: center;
          transition: all 0.2s;
          font-family: 'Poppins', sans-serif;
          cursor: pointer;
        }

        .lp-btn-primary {
          background: var(--primary-500);
          color: white;
          border-color: var(--primary-500);
        }

        .lp-btn-primary:hover { background: #1741b0; }

        .lp-btn-outline {
          background: white;
          color: var(--neutral-900);
        }

        .lp-btn-outline:hover { background: #f8fafc; }

        .lp-hero-trust {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .lp-trust-badge {
          background: white;
          padding: 14px 24px;
          border-radius: 12px;
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 700;
          box-shadow: var(--shadow-card);
          white-space: nowrap;
        }

        .lp-hero-visual {
          flex: 1;
          min-width: 0;
          position: relative;
        }

        .lp-hero-img {
          width: 100%;
          border-radius: 24px;
          box-shadow: var(--shadow-overlay);
          display: block;
        }

        .lp-online-status {
          position: absolute;
          top: 24px;
          right: 24px;
          background: white;
          padding: 8px 16px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 700;
          box-shadow: var(--shadow-overlay);
        }

        .lp-dot {
          width: 10px;
          height: 10px;
          background: var(--verified-text);
          border-radius: 50%;
        }

        .lp-float-card {
          position: absolute;
          bottom: 30px;
          left: 30px;
          background: white;
          padding: 20px;
          border-radius: 20px;
          box-shadow: var(--shadow-overlay);
          width: 260px;
        }

        .lp-float-card h4 {
          font-size: 18px;
          font-weight: 800;
          color: var(--primary-500);
          margin-bottom: 6px;
        }

        .lp-verified-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: var(--verified-text);
          font-size: 11px;
          font-weight: 700;
          background: var(--verified-bg);
          padding: 4px 10px;
          border-radius: 6px;
        }

        /* ─── GALLERY ─── */
        .lp-gallery {
          padding: 80px 0;
          background: white;
          overflow: hidden;
          text-align: center;
        }

        .lp-gallery-header { margin-bottom: 40px; padding: 0 40px; }

        .lp-vibrant-label {
          color: var(--accent-500);
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .lp-gallery-title {
          font-size: 42px;
          font-weight: 800;
          margin: 12px 0;
          color: #111827;
        }

        .lp-gallery-desc {
          color: var(--neutral-500);
          font-size: 17px;
          max-width: 700px;
          margin: 0 auto;
          line-height: 1.5;
        }

        .lp-track-wrap { overflow: hidden; }

        .lp-image-track {
          display: flex;
          gap: 24px;
          width: max-content;
          animation: lp-scroll 35s linear infinite;
          padding: 20px 0;
        }

        @keyframes lp-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 12px)); }
        }

        .lp-anim-card {
          width: 400px;
          height: 260px;
          border-radius: 20px;
          overflow: hidden;
          position: relative;
          box-shadow: var(--shadow-card);
          flex-shrink: 0;
        }

        .lp-anim-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .lp-anim-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          padding: 20px;
          background: linear-gradient(transparent, rgba(0,0,0,0.7));
          color: white;
          text-align: left;
        }

        .lp-anim-title { font-size: 16px; font-weight: 700; }
        .lp-anim-loc { font-size: 12px; opacity: 0.8; }

        /* ─── WHY US ─── */
        .lp-why {
          padding: 80px;
          background: var(--white);
          text-align: center;
        }

        .lp-why-label {
          color: var(--accent-500);
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .lp-why-title {
          font-size: 38px;
          font-weight: 800;
          margin: 10px 0 50px;
          color: #111827;
        }

        .lp-feature-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }

        .lp-feature-card {
          background: white;
          padding: 32px 24px;
          border-radius: 24px;
          border: 1px solid var(--border);
          text-align: left;
          transition: transform 0.3s, box-shadow 0.3s;
        }

        .lp-feature-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-card);
        }

        .lp-icon-box {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          font-size: 20px;
        }

        .lp-feature-card h3 {
          font-size: 16px;
          font-weight: 800;
          margin-bottom: 12px;
          color: #111827;
        }

        .lp-feature-card p {
          font-size: 13px;
          color: var(--neutral-500);
          line-height: 1.6;
        }

        /* ─── RESPONSIVE ─── */
        @media (max-width: 1024px) {
          .lp-hero { padding: 60px 40px; gap: 40px; }
          .lp-hero-title { font-size: 40px; }
          .lp-feature-grid { grid-template-columns: repeat(2, 1fr); }
          .lp-why { padding: 60px 40px; }
        }

        @media (max-width: 768px) {
          .lp-hero {
            flex-direction: column;
            padding: 40px 24px;
            gap: 32px;
          }
          .lp-hero-title { font-size: 32px; }
          .lp-hero-desc { font-size: 15px; }
          .lp-float-card { display: none; }
          .lp-anim-card { width: 280px; height: 190px; }
          .lp-gallery-title { font-size: 28px; }
          .lp-feature-grid { grid-template-columns: 1fr 1fr; }
          .lp-why { padding: 48px 24px; }
          .lp-why-title { font-size: 26px; }
        }

        @media (max-width: 480px) {
          .lp-hero { padding: 32px 16px; }
          .lp-hero-title { font-size: 26px; }
          .lp-btn { padding: 12px 20px; font-size: 14px; }
          .lp-trust-badge { font-size: 12px; padding: 10px 16px; }
          .lp-feature-grid { grid-template-columns: 1fr; }
          .lp-gallery-header { padding: 0 16px; }
        }
      `}</style>

      <div className="lp-root">
        {/* ── HERO ── */}
        <section className="lp-hero">
          <div className="lp-hero-content">
            <span className="lp-hero-tagline">Philippines' First All-in-One Property Platform</span>
            <h1 className="lp-hero-title">
              Find, Negotiate, and Close Property Deals —{" "}
              <span>Fully Online.</span>
            </h1>
            <p className="lp-hero-desc">
              No middlemen. Verified listings. Digital contracts. Secure bank payments — all in one seamless platform.
            </p>
            <div className="lp-hero-btns">
              <a href="/buyer/properties" className="lp-btn lp-btn-primary">Browse Properties →</a>
              <a href="/#how-it-works" className="lp-btn lp-btn-outline">How It Works</a>
            </div>
            <div className="lp-hero-trust">
              <div className="lp-trust-badge">Verified Listings</div>
              <div className="lp-trust-badge">10,000+ Properties</div>
              <div className="lp-trust-badge">4.9/5 Rating</div>
            </div>
          </div>

          <div className="lp-hero-visual">
            <img
              src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"
              alt="House"
              className="lp-hero-img"
            />
            <div className="lp-online-status">
              <div className="lp-dot" />
              Owner Online
            </div>
            <div className="lp-float-card">
              <h4>4BR House in Cebu City</h4>
              <div className="lp-verified-pill">✓ Verified Listing</div>
            </div>
          </div>
        </section>

        {/* ── GALLERY ── */}
        <section className="lp-gallery">
          <div className="lp-gallery-header">
            <span className="lp-vibrant-label">Vibrant Collections</span>
            <h2 className="lp-gallery-title">Explore Our Curated Spaces</h2>
            <p className="lp-gallery-desc">
              A glimpse into the diverse, verified properties waiting for you on the Susync platform.
            </p>
          </div>
          <div className="lp-track-wrap">
            <div className="lp-image-track">
              {[
                { src: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80", title: "Cebu IT Park Condo", loc: "Cebu City" },
                { src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80", title: "Modern Mandaue House", loc: "Mandaue City" },
                { src: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80", title: "Liloan Townhouse", loc: "Liloan, Cebu" },
                { src: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=600&q=80", title: "Busay Luxury Lot", loc: "Cebu City" },
                { src: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80", title: "Cebu IT Park Condo", loc: "Cebu City" },
                { src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80", title: "Modern Mandaue House", loc: "Mandaue City" },
                { src: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80", title: "Liloan Townhouse", loc: "Liloan, Cebu" },
                { src: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=600&q=80", title: "Busay Luxury Lot", loc: "Cebu City" },
              ].map((card, i) => (
                <div className="lp-anim-card" key={i}>
                  <img src={card.src} alt={card.title} />
                  <div className="lp-anim-overlay">
                    <p className="lp-anim-title">{card.title}</p>
                    <p className="lp-anim-loc">{card.loc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHY CHOOSE US ── */}
        <section className="lp-why" id="how-it-works">
          <span className="lp-why-label">WHY CHOOSE US</span>
          <h2 className="lp-why-title">The Smarter Way to Property</h2>
          <div className="lp-feature-grid">
            {[
              { bg: "#EBF2FF", icon: "📱", title: "All-Digital Flow", desc: "From viewing to contracting and payment, handle the entire deal on your phone." },
              { bg: "#DCFCE7", icon: "🛡️", title: "Anti-Scam Check", desc: "Rigorous verification process for every listing to ensure title authenticity and safety." },
              { bg: "#FEF3C7", icon: "🤝", title: "Zero Middlemen", desc: "Communicate directly with verified owners and save on unnecessary hidden costs." },
              { bg: "#FEE2E2", icon: "📍", title: "Smart Insights", desc: "Access neighborhood data, price history, and market trends for every neighborhood." },
            ].map((f, i) => (
              <div className="lp-feature-card" key={i}>
                <div className="lp-icon-box" style={{ background: f.bg }}>{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
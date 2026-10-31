import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  newslettersStorageApi,
  type NewsletterData,
} from "../services/api";

export default function Newsletters() {
  const [newsletters, setNewsletters] = useState<NewsletterData[]>(() => {
    return newslettersStorageApi.getAll();
  });

  const [activeFrequency, setActiveFrequency] = useState<"All" | "Weekly" | "Monthly" | "Bi-Weekly">("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const handleUpdate = () => {
      setNewsletters(newslettersStorageApi.getAll());
    };
    window.addEventListener("gp_newsletters_updated", handleUpdate);
    return () => window.removeEventListener("gp_newsletters_updated", handleUpdate);
  }, []);

  // Filtered dispatches
  const filtered = newsletters.filter((item) => {
    const matchesFreq = activeFrequency === "All" || item.frequency === activeFrequency;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      (item.highlights && item.highlights.some((h) => h.toLowerCase().includes(q)));
    return matchesFreq && matchesSearch;
  });

  const weeklyCount = newsletters.filter((n) => n.frequency === "Weekly").length;
  const monthlyCount = newsletters.filter((n) => n.frequency === "Monthly").length;
  const biweeklyCount = newsletters.filter((n) => n.frequency === "Bi-Weekly").length;

  return (
    <main className="gp-hub-page">
      {/* SIGNATURE EXECUTIVE TECH GRID BACKGROUND */}
      <div className="gp-hero-bg">
        <div className="gp-bg-grid-pattern" />
        <div className="gp-ambient-orb gp-ambient-one" />
        <div className="gp-ambient-orb gp-ambient-two" />
        <div className="gp-ambient-orb gp-ambient-three" />
      </div>

      <div className="gp-hub-content-layer">
        {/* 1. TOP HERO BANNER */}
        <section className="gp-hub-hero">
          <div className="gp-hub-container">
            <div className="gp-hub-badge">
              <span>✉</span> EXECUTIVE EDITORIAL DISPATCHES
            </div>
            <h1 className="gp-hub-title">
              B2B Pipeline &amp; Enterprise Market Intelligence Newsletters
            </h1>
            <p className="gp-hub-subtitle">
              Curated weekly, bi-weekly, and monthly dispatches delivered to over 15,000 Director-level and above B2B marketing, growth, and demand generation leaders.
            </p>

            {/* Search & Frequency Filter Controls */}
            <div className="gp-hub-filter-wrapper">
              <div className="gp-hub-search-box">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search dispatches by topic, keyword, or ICP category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="clear-search-btn"
                    onClick={() => setSearchQuery("")}
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="gp-hub-frequency-pills">
                <button
                  className={`gp-hub-freq-btn ${activeFrequency === "All" ? "active" : ""}`}
                  onClick={() => setActiveFrequency("All")}
                >
                  All Dispatches <span className="pill-count">{newsletters.length}</span>
                </button>
                <button
                  className={`gp-hub-freq-btn ${activeFrequency === "Weekly" ? "active" : ""}`}
                  onClick={() => setActiveFrequency("Weekly")}
                >
                  Weekly <span className="pill-count">{weeklyCount}</span>
                </button>
                <button
                  className={`gp-hub-freq-btn ${activeFrequency === "Monthly" ? "active" : ""}`}
                  onClick={() => setActiveFrequency("Monthly")}
                >
                  Monthly <span className="pill-count">{monthlyCount}</span>
                </button>
                <button
                  className={`gp-hub-freq-btn ${activeFrequency === "Bi-Weekly" ? "active" : ""}`}
                  onClick={() => setActiveFrequency("Bi-Weekly")}
                >
                  Bi-Weekly <span className="pill-count">{biweeklyCount}</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 2. DISPATCHES GRID SECTION */}
        <section className="gp-hub-grid-section">
          <div className="gp-hub-container">
            <div className="gp-hub-grid-meta">
              <h2>
                Featured Newsletter Editions
                <span className="count-tag">{filtered.length} Available</span>
              </h2>
              <span className="grid-hint">
                Click any dispatch to open its dedicated landing page and referenced resources.
              </span>
            </div>

            {filtered.length === 0 ? (
              <div className="gp-hub-empty-state">
                <span className="empty-icon">📬</span>
                <h3>No dispatches match your search</h3>
                <p>Try refining your search keyword or selecting a different frequency tab.</p>
                <button
                  className="gp-btn-reset-filter"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveFrequency("All");
                  }}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="gp-hub-cards-grid">
                {filtered.map((item) => (
                  <article className="gp-hub-card" key={item._id}>
                    {/* Thumbnail / Header */}
                    <Link
                      to={`/newsletter/${item.slug}`}
                      className="gp-hub-card-media"
                      title={`Open landing page for ${item.title}`}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        loading="lazy"
                      />
                      <div className="gp-hub-card-badges">
                        <span className={`gp-hub-freq-badge freq-${item.frequency.toLowerCase()}`}>
                          {item.frequency}
                        </span>
                        <span className="gp-hub-verified-pill">● Verified</span>
                      </div>
                    </Link>

                    {/* Body */}
                    <div className="gp-hub-card-body">
                      <div className="gp-hub-card-top-info">
                        <span className="gp-hub-card-cat">{item.category}</span>
                        <span className="gp-hub-card-date">{item.date}</span>
                      </div>

                      <h3 className="gp-hub-card-title">
                        <Link to={`/newsletter/${item.slug}`}>
                          {item.title}
                        </Link>
                      </h3>

                      <p className="gp-hub-card-summary">{item.summary}</p>

                      {item.highlights && item.highlights.length > 0 && (
                        <div className="gp-hub-card-highlights">
                          <span className="highlights-label">Key Highlights:</span>
                          <ul>
                            {item.highlights.slice(0, 3).map((h, hIdx) => (
                              <li key={hIdx}>
                                <span className="bullet">▸</span>
                                <span>{h}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="gp-hub-card-author-meta">
                        <span>✍ {item.author || "GETprospeKt Editorial"}</span>
                        <span>⏱ {item.readTime || "5 min read"}</span>
                      </div>
                    </div>

                    {/* Footer Action */}
                    <div className="gp-hub-card-footer">
                      <span className="subscribers-count">
                        👥 {item.subscribersCount || "1,200+ Readers"}
                      </span>
                      <Link
                        to={`/newsletter/${item.slug}`}
                        className="gp-hub-open-landing-btn"
                      >
                        <span>Open Landing Page</span>
                        <span className="arrow">→</span>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 3. GLOBAL VIP SUBSCRIPTION BANNER */}
        <section className="gp-hub-vip-banner">
          <div className="gp-hub-container">
            <div className="gp-hub-vip-card">
              <div className="gp-hub-vip-content">
                <span className="vip-badge">ENTERPRISE EXECUTIVE ACCESS</span>
                <h2>Never Miss An Intelligence Dispatch</h2>
                <p>
                  Get curated B2B intent shifts, lead scoring playbooks, and enterprise technology procurement updates delivered straight to your inbox every week.
                </p>
              </div>
              <div className="gp-hub-vip-actions">
                <Link to="/contact" className="gp-hub-vip-btn primary">
                  Request Custom Pipeline Audit →
                </Link>
                <Link to="/solutions" className="gp-hub-vip-btn secondary">
                  Explore Demand Solutions
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* EMBEDDED STYLES FOR NEWSLETTERS DIRECTORY */}
      <style>{`
        .gp-hub-page {
          background-color: #060B12;
          color: #D5DBE7;
          font-family: var(--font-sans);
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
        }

        /* SIGNATURE EXECUTIVE TECH GRID BACKGROUND */
        .gp-hero-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }

        .gp-bg-grid-pattern {
          position: absolute;
          inset: 0;
          background-color: #060B12;
          background-image: 
            radial-gradient(ellipse 85% 50% at 50% -10%, rgba(0, 70, 252, 0.16) 0%, transparent 65%),
            radial-gradient(circle at 90% 20%, rgba(0, 210, 255, 0.10) 0%, transparent 45%),
            radial-gradient(circle at 10% 70%, rgba(0, 70, 252, 0.08) 0%, transparent 40%),
            url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='%23CBD5E1' stroke-width='0.5' stroke-opacity='0.06'%3E%3Cpath d='M30 0v60M0 30h60'/%3E%3C/g%3E%3Ccircle cx='30' cy='30' r='1' fill='%2300D2FF' fill-opacity='0.20'/%3E%3Ccircle cx='0' cy='0' r='0.8' fill='%23CBD5E1' fill-opacity='0.08'/%3E%3Ccircle cx='60' cy='0' r='0.8' fill='%23CBD5E1' fill-opacity='0.08'/%3E%3Ccircle cx='60' cy='60' r='0.8' fill='%23CBD5E1' fill-opacity='0.08'/%3E%3C/g%3E%3C/svg%3E");
          background-size: 100% 100%, 100% 100%, 100% 100%, 60px 60px;
          background-position: center top, center top, center center, center center;
        }

        .gp-ambient-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
        }

        .gp-ambient-one {
          width: 500px;
          height: 500px;
          top: -80px;
          right: 12%;
          background: rgba(0, 210, 255, 0.14);
          animation: floatOne 11s ease-in-out infinite;
        }

        .gp-ambient-two {
          width: 440px;
          height: 440px;
          top: 36%;
          left: -60px;
          background: rgba(0, 70, 252, 0.16);
          animation: floatTwo 15s ease-in-out infinite;
        }

        .gp-ambient-three {
          width: 400px;
          height: 400px;
          bottom: 12%;
          right: 8%;
          background: rgba(0, 210, 255, 0.12);
          animation: floatOne 13s ease-in-out infinite reverse;
        }

        @keyframes floatOne {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-24px) scale(1.04); }
        }

        @keyframes floatTwo {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, -20px) scale(0.97); }
        }

        .gp-hub-content-layer {
          position: relative;
          z-index: 1;
        }

        .gp-hub-container {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* Hero */
        .gp-hub-hero {
          background: transparent;
          padding: 56px 0 40px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          text-align: center;
        }
        .gp-hub-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(0, 70, 252, 0.2);
          border: 1px solid rgba(0, 210, 255, 0.35);
          color: #00D2FF;
          padding: 6px 14px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 18px;
        }
        .gp-hub-title {
          font-size: 42px;
          line-height: 1.2;
          font-weight: 800;
          color: #FFFFFF;
          letter-spacing: -0.025em;
          margin-bottom: 16px;
          max-width: 920px;
          margin-left: auto;
          margin-right: auto;
        }
        .gp-hub-subtitle {
          font-size: 18px;
          line-height: 1.6;
          color: #CBD5E1;
          max-width: 780px;
          margin-left: auto;
          margin-right: auto;
          margin-bottom: 36px;
        }

        /* Filter Controls */
        .gp-hub-filter-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          max-width: 720px;
          margin: 0 auto;
        }
        .gp-hub-search-box {
          position: relative;
          width: 100%;
        }
        .gp-hub-search-box input {
          width: 100%;
          padding: 14px 44px 14px 44px;
          font-size: 15px;
          background: #0D1522;
          color: #FFFFFF;
          border: 1px solid rgba(203, 213, 225, 0.2);
          border-radius: 999px;
          outline: none;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .gp-hub-search-box input:focus {
          border-color: #00D2FF;
          box-shadow: 0 0 0 3px rgba(0, 210, 255, 0.15);
        }
        .gp-hub-search-box .search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 16px;
          color: #00D2FF;
          pointer-events: none;
        }
        .clear-search-btn {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: #CBD5E1;
          border-radius: 50%;
          width: 22px;
          height: 22px;
          font-size: 11px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .gp-hub-frequency-pills {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
        }
        .gp-hub-freq-btn {
          background: #0D1522;
          border: 1px solid rgba(203, 213, 225, 0.18);
          padding: 8px 18px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 600;
          color: #CBD5E1;
          cursor: pointer;
          transition: all 0.15s;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .gp-hub-freq-btn:hover {
          border-color: #00D2FF;
          color: #FFFFFF;
        }
        .gp-hub-freq-btn.active {
          background: linear-gradient(135deg, #0046FC 0%, #00D2FF 100%);
          border-color: transparent;
          color: #FFFFFF;
          box-shadow: 0 4px 14px rgba(0, 70, 252, 0.4);
        }
        .gp-hub-freq-btn .pill-count {
          font-size: 11px;
          padding: 2px 6px;
          border-radius: 999px;
          background: rgba(0, 0, 0, 0.25);
        }
        .gp-hub-freq-btn.active .pill-count {
          background: rgba(255, 255, 255, 0.25);
          color: #FFFFFF;
        }

        /* Grid Section */
        .gp-hub-grid-section {
          padding: 48px 0 64px;
        }
        .gp-hub-grid-meta {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 28px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .gp-hub-grid-meta h2 {
          font-size: 24px;
          font-weight: 800;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .gp-hub-grid-meta .count-tag {
          font-size: 13px;
          font-weight: 600;
          color: #00D2FF;
          background: rgba(0, 70, 252, 0.25);
          border: 1px solid rgba(0, 210, 255, 0.3);
          padding: 3px 10px;
          border-radius: 999px;
        }
        .grid-hint {
          font-size: 13px;
          color: #94A3B8;
        }

        /* Cards Grid */
        .gp-hub-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
          gap: 28px;
        }
        .gp-hub-card {
          background: #0D1522;
          border: 1px solid rgba(203, 213, 225, 0.12);
          border-radius: 16px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35);
          transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
        }
        .gp-hub-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.6), 0 0 24px rgba(0, 210, 255, 0.12);
          border-color: #00D2FF;
        }

        /* Media */
        .gp-hub-card-media {
          position: relative;
          height: 200px;
          overflow: hidden;
          display: block;
        }
        .gp-hub-card-media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.35s ease;
        }
        .gp-hub-card:hover .gp-hub-card-media img {
          transform: scale(1.04);
        }
        .gp-hub-card-badges {
          position: absolute;
          top: 12px;
          left: 12px;
          right: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .gp-hub-freq-badge {
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          background: rgba(6, 11, 18, 0.85);
          backdrop-filter: blur(4px);
          color: #00D2FF;
          border: 1px solid rgba(0, 210, 255, 0.3);
        }
        .gp-hub-verified-pill {
          background: rgba(16, 185, 129, 0.9);
          color: #FFFFFF;
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          backdrop-filter: blur(4px);
        }

        /* Body */
        .gp-hub-card-body {
          padding: 22px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }
        .gp-hub-card-top-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        .gp-hub-card-cat {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #00D2FF;
        }
        .gp-hub-card-date {
          font-size: 12px;
          color: #64748B;
        }
        .gp-hub-card-title {
          font-size: 18px;
          line-height: 1.4;
          font-weight: 700;
          color: #FFFFFF;
          margin-bottom: 10px;
        }
        .gp-hub-card-title a {
          color: #FFFFFF;
          text-decoration: none;
          transition: color 0.15s;
        }
        .gp-hub-card-title a:hover {
          color: #00D2FF;
        }
        .gp-hub-card-summary {
          font-size: 14px;
          line-height: 1.55;
          color: #94A3B8;
          margin-bottom: 16px;
          flex-grow: 1;
        }

        /* Highlights */
        .gp-hub-card-highlights {
          background: #080E18;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 16px;
        }
        .highlights-label {
          display: block;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          color: #64748B;
          margin-bottom: 6px;
        }
        .gp-hub-card-highlights ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .gp-hub-card-highlights li {
          font-size: 12px;
          color: #CBD5E1;
          display: flex;
          align-items: flex-start;
          gap: 6px;
          line-height: 1.4;
        }
        .gp-hub-card-highlights .bullet {
          color: #00D2FF;
        }

        .gp-hub-card-author-meta {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #64748B;
          padding-top: 10px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }

        /* Footer */
        .gp-hub-card-footer {
          padding: 14px 22px;
          background: #090F1B;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .subscribers-count {
          font-size: 12px;
          font-weight: 600;
          color: #94A3B8;
        }
        .gp-hub-open-landing-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: linear-gradient(135deg, #0046FC 0%, #002BB8 100%);
          color: #FFFFFF;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          padding: 7px 14px;
          border-radius: 6px;
          transition: all 0.15s;
          box-shadow: 0 2px 8px rgba(0, 70, 252, 0.35);
        }
        .gp-hub-open-landing-btn:hover {
          background: linear-gradient(135deg, #0056FF 0%, #0036D8 100%);
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(0, 70, 252, 0.5);
        }
        .gp-hub-open-landing-btn .arrow {
          font-size: 14px;
          transition: transform 0.15s;
        }
        .gp-hub-open-landing-btn:hover .arrow {
          transform: translateX(3px);
        }

        /* VIP Banner */
        .gp-hub-vip-banner {
          padding: 0 0 80px;
        }
        .gp-hub-vip-card {
          background: linear-gradient(135deg, #0A1322 0%, #0D1C30 50%, #07172A 100%);
          color: #FFFFFF;
          border: 1px solid rgba(0, 210, 255, 0.25);
          border-radius: 20px;
          padding: 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 24px;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);
        }
        .gp-hub-vip-content {
          max-width: 640px;
        }
        .vip-badge {
          display: inline-block;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #00D2FF;
          margin-bottom: 12px;
        }
        .gp-hub-vip-content h2 {
          font-size: 30px;
          font-weight: 800;
          margin-bottom: 12px;
          line-height: 1.25;
          color: #FFFFFF;
        }
        .gp-hub-vip-content p {
          font-size: 16px;
          line-height: 1.6;
          color: #94A3B8;
        }
        .gp-hub-vip-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
          min-width: 240px;
        }
        .gp-hub-vip-btn {
          display: inline-block;
          text-align: center;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.15s;
        }
        .gp-hub-vip-btn.primary {
          background: linear-gradient(135deg, #0046FC 0%, #00D2FF 100%);
          color: #FFFFFF;
          box-shadow: 0 4px 14px rgba(0, 70, 252, 0.4);
        }
        .gp-hub-vip-btn.primary:hover {
          background: linear-gradient(135deg, #0056FF 0%, #00E0FF 100%);
          transform: translateY(-1px);
        }
        .gp-hub-vip-btn.secondary {
          background: rgba(255, 255, 255, 0.08);
          color: #FFFFFF;
          border: 1px solid rgba(255, 255, 255, 0.15);
        }
        .gp-hub-vip-btn.secondary:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        /* Empty State */
        .gp-hub-empty-state {
          text-align: center;
          background: #0D1522;
          border: 1px dashed rgba(203, 213, 225, 0.2);
          border-radius: 16px;
          padding: 56px 24px;
          max-width: 500px;
          margin: 0 auto;
        }
        .empty-icon {
          font-size: 44px;
          display: block;
          margin-bottom: 12px;
        }
        .gp-hub-empty-state h3 {
          font-size: 20px;
          font-weight: 700;
          color: #FFFFFF;
          margin-bottom: 8px;
        }
        .gp-hub-empty-state p {
          font-size: 14px;
          color: #94A3B8;
          margin-bottom: 20px;
        }
        .gp-btn-reset-filter {
          background: #0046FC;
          color: #FFFFFF;
          border: none;
          padding: 9px 18px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .gp-hub-title {
            font-size: 30px;
          }
          .gp-hub-cards-grid {
            grid-template-columns: 1fr;
          }
          .gp-hub-vip-card {
            padding: 32px 24px;
          }
        }
      `}</style>
    </main>
  );
}

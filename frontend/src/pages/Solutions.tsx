import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export interface SolutionItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  tag: string;
  badge: string;
  subtitle: string;
  description: string;
  deliverables: string[];
  image: string;
  path: string;
}

export const solutionsData: SolutionItem[] = [
  {
    id: "sol-1",
    slug: "human-verified-data",
    title: "Human-Verified Data",
    category: "Data Verification",
    tag: "High Accuracy",
    badge: "100% Verified",
    subtitle: "For Revenue Teams Requiring Accurate Prospect Records",
    description:
      "Prospect data manually reviewed, phoned, and verified for accuracy, completeness and recency across your exact Total Addressable Market (TAM).",
    deliverables: [
      "Direct phone numbers & verified corporate emails",
      "Active seniority, department & decision-maker check",
      "100% replacement guarantee on any invalid record",
    ],
    image:
      "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1200&q=90",
    path: "/article/human-verified-data",
  },
  {
    id: "sol-2",
    slug: "mql-generation",
    title: "MQL Generation",
    category: "Demand Generation",
    tag: "Marketing Qualified",
    badge: "Custom ICP Filter",
    subtitle: "For Marketing Teams Scaling Lead Influx & Content Engagement",
    description:
      "Marketing-qualified leads generated and validated against your agreed ideal customer profile, target accounts, and content engagement criteria.",
    deliverables: [
      "Verified content syndication engagement & opt-in",
      "Custom ICP tiering across employee size and revenue",
      "Enriched firmographic data ready for automated nurture",
    ],
    image:
      "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=1200&q=90",
    path: "/article/mql-generation",
  },
  {
    id: "sol-3",
    slug: "sql-generation",
    title: "SQL Generation",
    category: "Sales Pipeline",
    tag: "Sales Qualified",
    badge: "Active Need",
    subtitle: "For Sales Teams Accelerating Pipeline Velocity",
    description:
      "Sales-qualified leads that meet your agreed criteria for fit, immediate business need, and sales-readiness to minimize sales cycle friction.",
    deliverables: [
      "Confirmed buying committee & active project pain points",
      "Direct verification with verified decision-maker personas",
      "Direct handoff into your sales cadence and CRM",
    ],
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=90",
    path: "/article/sql-generation",
  },
  {
    id: "sol-4",
    slug: "bant-qualified-leads",
    title: "BANT-Qualified Leads",
    category: "High Intent",
    tag: "Strict Criteria",
    badge: "BANT Standard",
    subtitle: "For Enterprise Closers Demanding High Purchase Intent",
    description:
      "High-intent enterprise prospects rigorously qualified against Budget, Authority, Need, and Timing parameters before delivery.",
    deliverables: [
      "Verified budget allocation & authority confirmation",
      "Explicit purchase and implementation timeframe (3-12 mo)",
      "Thorough technical requirement alignment brief",
    ],
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=90",
    path: "/article/bant-qualified-leads",
  },
  {
    id: "sol-5",
    slug: "appointment-generation",
    title: "Appointment Generation",
    category: "Meeting Booking",
    tag: "Direct Calendars",
    badge: "Guaranteed Meetings",
    subtitle: "For Account Executives Needing Confirmed Sales Discovery Calls",
    description:
      "Confirmed introductory meetings directly scheduled on your sales reps' calendars with qualified decision-makers matching your target accounts.",
    deliverables: [
      "Direct calendar invitations accepted by target prospect",
      "Pre-call briefing notes with account context & pain points",
      "Comprehensive no-show protection and rescheduling policy",
    ],
    image:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=90",
    path: "/article/appointment-generation",
  },
  {
    id: "sol-6",
    slug: "webinar-campaigns",
    title: "Webinar Campaigns",
    category: "Event Marketing",
    tag: "Targeted Audience",
    badge: "Verified Registrants",
    subtitle: "For Event Marketers Driving Qualified Live Attendance",
    description:
      "Targeted multi-channel promotional campaigns designed to drive relevant enterprise registrations and engaged attendees for virtual conferences.",
    deliverables: [
      "Multi-channel acquisition (email, phone, direct outreach)",
      "Strict persona validation preventing irrelevant sign-ups",
      "Post-event attendee engagement reports and contact handoff",
    ],
    image:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=90",
    path: "/article/webinar-campaigns",
  },
];

const FILTER_TAGS = [
  "All Solutions",
  "Demand Generation",
  "Sales Pipeline",
  "High Intent",
  "Meeting Booking",
  "Data Verification",
  "Event Marketing",
];

const Solutions: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState("All Solutions");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const filteredSolutions =
    selectedFilter === "All Solutions"
      ? solutionsData
      : solutionsData.filter((item) => item.category === selectedFilter);

  return (
    <>
      <style>{`
        /* =========================================
           SOLUTIONS PAGE STYLES
        ========================================= */
        .solutions-page {
          min-height: 100vh;
          background: #060B12;
          color: #D5DBE7;
          padding: 30px 0 90px;
          font-family: var(--font-sans);
        }

        .solutions-container {
          width: min(1380px, calc(100% - 48px));
          margin: 0 auto;
        }

        /* BREADCRUMB */
        .solutions-breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #64748B;
          margin-bottom: 24px;
        }

        .solutions-breadcrumb a {
          color: #94A3B8;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .solutions-breadcrumb a:hover {
          color: #00D2FF;
        }

        .solutions-breadcrumb span {
          color: #475569;
        }

        /* HERO HEADER */
        .solutions-hero {
          margin-bottom: 36px;
          border-bottom: 1px solid rgba(203, 213, 225, 0.12);
          padding-bottom: 30px;
        }

        .solutions-pill {
          display: inline-block;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #00D4AA;
          background: rgba(0, 212, 170, 0.1);
          border: 1px solid rgba(0, 212, 170, 0.25);
          padding: 5px 14px;
          border-radius: 20px;
          margin-bottom: 14px;
        }

        .solutions-title {
          font-size: clamp(30px, 3.8vw, 44px);
          font-weight: 800;
          color: #FFFFFF;
          margin: 0 0 14px;
          line-height: 1.18;
          letter-spacing: -0.02em;
        }

        .solutions-subtitle {
          font-size: 16px;
          line-height: 1.6;
          color: #94A3B8;
          max-width: 820px;
          margin: 0;
        }

        /* FILTER BAR */
        .solutions-filter-bar {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 36px;
        }

        .solutions-filter-btn {
          background: #0B1320;
          color: #94A3B8;
          border: 1px solid rgba(203, 213, 225, 0.14);
          padding: 8px 18px;
          border-radius: 22px;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
        }

        .solutions-filter-btn:hover {
          color: #FFFFFF;
          border-color: rgba(0, 210, 255, 0.4);
          background: #0E1A2B;
        }

        .solutions-filter-btn.active {
          background: linear-gradient(135deg, #0046FC 0%, #00D2FF 100%);
          color: #FFFFFF;
          border-color: transparent;
          box-shadow: 0 4px 14px rgba(0, 70, 252, 0.35);
        }

        /* 3-COLUMN CARDS GRID */
        .solutions-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
          margin-bottom: 60px;
        }

        /* INDIVIDUAL SOLUTION CARD */
        .solution-card {
          background: #0B121E;
          border: 1px solid rgba(203, 213, 225, 0.12);
          border-radius: 10px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          text-decoration: none;
          color: inherit;
          transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1),
                      border-color 0.3s ease,
                      box-shadow 0.3s ease;
          position: relative;
        }

        .solution-card:hover {
          transform: translateY(-6px);
          border-color: rgba(0, 210, 255, 0.5);
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.5), 0 0 24px rgba(0, 210, 255, 0.12);
        }

        /* COVER IMAGE WRAPPER */
        .solution-card-image-wrap {
          position: relative;
          width: 100%;
          height: 200px;
          overflow: hidden;
          background: #070D16;
        }

        .solution-card-image-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .solution-card:hover .solution-card-image-wrap img {
          transform: scale(1.06);
        }

        .solution-card-image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(6, 11, 18, 0.1) 0%, rgba(6, 11, 18, 0.85) 100%);
          pointer-events: none;
        }

        .solution-card-badge {
          position: absolute;
          top: 14px;
          left: 14px;
          background: rgba(6, 11, 18, 0.82);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(0, 212, 170, 0.4);
          color: #00D4AA;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 4px;
        }

        .solution-card-tag {
          position: absolute;
          bottom: 12px;
          right: 14px;
          background: rgba(0, 70, 252, 0.85);
          backdrop-filter: blur(6px);
          color: #FFFFFF;
          font-size: 11px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 4px;
        }

        /* CARD BODY */
        .solution-card-body {
          padding: 24px 22px 20px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .solution-card-subtitle {
          font-size: 11.5px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #38BDF8;
          font-weight: 700;
          margin-bottom: 6px;
        }

        .solution-card-title {
          font-size: 21px;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0 0 10px;
          line-height: 1.25;
          letter-spacing: -0.01em;
          transition: color 0.2s ease;
        }

        .solution-card:hover .solution-card-title {
          color: #00D2FF;
        }

        .solution-card-desc {
          font-size: 13.5px;
          line-height: 1.55;
          color: #94A3B8;
          margin: 0 0 18px;
        }

        /* DELIVERABLES LIST */
        .solution-card-deliverables {
          list-style: none;
          padding: 0;
          margin: 0 0 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          border-top: 1px solid rgba(203, 213, 225, 0.08);
          padding-top: 16px;
        }

        .solution-card-deliverables li {
          font-size: 12.5px;
          color: #CBD5E1;
          display: flex;
          align-items: flex-start;
          gap: 8px;
          line-height: 1.45;
        }

        .solution-card-deliverables li::before {
          content: "✓";
          color: #00D4AA;
          font-weight: 800;
          font-size: 13px;
          line-height: 1.2;
          flex-shrink: 0;
        }

        /* ACTION FOOTER */
        .solution-card-action {
          margin-top: auto;
          padding-top: 14px;
          border-top: 1px solid rgba(203, 213, 225, 0.08);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .solution-card-link-text {
          font-size: 13.5px;
          font-weight: 700;
          color: #00D2FF;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: gap 0.2s ease;
        }

        .solution-card:hover .solution-card-link-text {
          gap: 10px;
        }

        .solution-card-link-arrow {
          font-size: 15px;
          transition: transform 0.2s ease;
        }

        .solution-card:hover .solution-card-link-arrow {
          transform: translateX(4px);
        }

        /* BOTTOM CTA SECTION */
        .solutions-cta-box {
          background: linear-gradient(135deg, #0A1322 0%, #0D1C30 50%, #07172A 100%);
          border: 1px solid rgba(0, 210, 255, 0.25);
          border-radius: 12px;
          padding: 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
          box-shadow: 0 12px 36px rgba(0, 0, 0, 0.4);
        }

        .solutions-cta-text h3 {
          font-size: 24px;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0 0 8px;
        }

        .solutions-cta-text p {
          font-size: 14.5px;
          color: #94A3B8;
          margin: 0;
          max-width: 650px;
          line-height: 1.55;
        }

        .solutions-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #0046FC 0%, #00D2FF 100%);
          color: #FFFFFF;
          font-weight: 700;
          font-size: 14.5px;
          padding: 14px 28px;
          border-radius: 28px;
          text-decoration: none;
          white-space: nowrap;
          box-shadow: 0 4px 18px rgba(0, 70, 252, 0.4);
          transition: all 0.25s ease;
        }

        .solutions-cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 210, 255, 0.55);
        }

        /* RESPONSIVE */
        @media (max-width: 1100px) {
          .solutions-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 22px;
          }
        }

        @media (max-width: 768px) {
          .solutions-grid {
            grid-template-columns: 1fr;
          }

          .solutions-cta-box {
            flex-direction: column;
            align-items: flex-start;
            padding: 28px 22px;
          }
        }
      `}</style>

      <main className="solutions-page">
        <div className="solutions-container">
          {/* BREADCRUMB */}
          <div className="solutions-breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Solutions</span>
          </div>

          {/* HERO HEADER */}
          <header className="solutions-hero">
            <span className="solutions-pill">GETprospeKt Solutions</span>
            <h1 className="solutions-title">Our Lead-Generation Solutions</h1>
            <p className="solutions-subtitle">
              Six standalone, outcome-focused solutions designed to turn your target market into
              qualified pipeline — at the qualification level your business requires.
            </p>
          </header>

          {/* FILTER BAR */}
          <div className="solutions-filter-bar">
            {FILTER_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                className={`solutions-filter-btn ${selectedFilter === tag ? "active" : ""}`}
                onClick={() => setSelectedFilter(tag)}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* 3-COLUMN CARDS GRID */}
          <div className="solutions-grid">
            {filteredSolutions.map((sol) => (
              <article key={sol.id} className="solution-card">
                <Link to={sol.path} className="solution-card-image-wrap">
                  <img src={sol.image} alt={sol.title} loading="lazy" />
                  <div className="solution-card-image-overlay" />
                  <span className="solution-card-badge">{sol.badge}</span>
                  <span className="solution-card-tag">{sol.tag}</span>
                </Link>

                <div className="solution-card-body">
                  <span className="solution-card-subtitle">{sol.subtitle}</span>
                  <h2 className="solution-card-title">
                    <Link to={sol.path} style={{ color: "inherit", textDecoration: "none" }}>
                      {sol.title}
                    </Link>
                  </h2>
                  <p className="solution-card-desc">{sol.description}</p>

                  <ul className="solution-card-deliverables">
                    {sol.deliverables.map((d, idx) => (
                      <li key={idx}>{d}</li>
                    ))}
                  </ul>

                  <div className="solution-card-action">
                    <Link to={sol.path} className="solution-card-link-text">
                      Explore Solution <span className="solution-card-link-arrow">→</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* BOTTOM CTA */}
          <section className="solutions-cta-box">
            <div className="solutions-cta-text">
              <h3>Need a Custom Solution Mix for Your Enterprise?</h3>
              <p>
                Our solutions are completely modular. Whether you require pure human-verified data,
                BANT-qualified leads, or direct sales appointment setting, our team can tailor
                custom SLAs for your sales pipeline.
              </p>
            </div>
            <Link to="/contact" className="solutions-cta-btn">
              Talk to a Specialist <span>→</span>
            </Link>
          </section>
        </div>
      </main>
    </>
  );
};

export default Solutions;

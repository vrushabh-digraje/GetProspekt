import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { solutionsStorageApi, initialSolutionsList, type SolutionData } from "../services/api";

export type SolutionItem = SolutionData;
export const solutionsData = initialSolutionsList;

const Solutions: React.FC = () => {
  const [solutions, setSolutions] = useState<SolutionItem[]>(() => solutionsStorageApi.getAll());

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const handleUpdate = () => {
      setSolutions(solutionsStorageApi.getAll());
    };
    window.addEventListener("gp_solutions_updated", handleUpdate);
    return () => window.removeEventListener("gp_solutions_updated", handleUpdate);
  }, []);

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
          aspect-ratio: 16 / 9;
          height: auto;
          min-height: 200px;
          overflow: hidden;
          background: #FFFFFF;
          border-bottom: 1px solid rgba(203, 213, 225, 0.12);
        }

        .solution-card-image-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .solution-card:hover .solution-card-image-wrap img {
          transform: scale(1.03);
        }

        .solution-card-image-overlay {
          display: none;
        }

        .solution-card-tags-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }

        .solution-card-badge {
          background: rgba(0, 212, 170, 0.12);
          border: 1px solid rgba(0, 212, 170, 0.35);
          color: #00D4AA;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          padding: 3px 9px;
          border-radius: 4px;
        }

        .solution-card-tag {
          background: rgba(0, 70, 252, 0.2);
          border: 1px solid rgba(0, 136, 255, 0.35);
          color: #38BDF8;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 9px;
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
          gap: 9px;
          border-top: 1px solid rgba(203, 213, 225, 0.08);
          padding-top: 16px;
        }

        .solution-card-deliverables li {
          font-size: 12.8px;
          color: #CBD5E1;
          display: flex;
          align-items: flex-start;
          gap: 10px;
          line-height: 1.5;
          padding: 6px 10px;
          border-radius: 6px;
          background: rgba(13, 21, 34, 0.35);
          border: 1px solid rgba(203, 213, 225, 0.06);
          border-left: 2px solid rgba(0, 212, 170, 0.25);
          transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: default;
        }

        .solution-card-deliverables li:hover {
          transform: translateX(4px);
          background: rgba(16, 27, 46, 0.8);
          border-color: rgba(0, 212, 170, 0.35);
          border-left: 2px solid #00D4AA;
          color: #FFFFFF;
        }

        .solution-card-deliverables li::before {
          content: "✓";
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 18px;
          height: 18px;
          min-width: 18px;
          min-height: 18px;
          border-radius: 5px;
          background: rgba(0, 212, 170, 0.12);
          border: 1px solid rgba(0, 212, 170, 0.35);
          color: #00D4AA;
          font-weight: 800;
          font-size: 11px;
          line-height: 1;
          flex-shrink: 0;
          margin-top: 1px;
          box-shadow: 0 0 6px rgba(0, 212, 170, 0.2);
          transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .solution-card-deliverables li:hover::before {
          transform: scale(1.2) rotate(6deg);
          background: linear-gradient(135deg, #00A884, #00D4AA);
          border-color: #00D4AA;
          color: #FFFFFF;
          box-shadow: 0 0 12px rgba(0, 212, 170, 0.6);
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

          {/* 3-COLUMN CARDS GRID */}
          <div className="solutions-grid">
            {solutions.map((sol) => (
              <article key={sol.id} className="solution-card">
                <Link to={sol.path} className="solution-card-image-wrap">
                  <img src={sol.image} alt={sol.title} loading="lazy" />
                </Link>

                <div className="solution-card-body">
                  <div className="solution-card-tags-row">
                    <span className="solution-card-badge">{sol.badge}</span>
                    <span className="solution-card-tag">{sol.tag}</span>
                  </div>
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

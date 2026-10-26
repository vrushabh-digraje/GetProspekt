import React, { useState, useEffect } from "react";
import EditorialCoverImage from "../components/EditorialCoverImage";
import { useSearchParams, Link } from "react-router-dom";
import { resourcesApi } from "../services/api";
import { downloadPdfDocument } from "../utils/pdfGenerator";

export interface ResourceItem {
  _id: string;
  title: string;
  type: string;
  category: string;
  summary: string;
  content?: string;
  coverImage: string;
  fileUrl?: string;
  downloadCount?: number;
  createdAt?: string;
}

const filterTypes = [
  "All",
  "Whitepapers",
  "Playbooks",
  "Industry Reports",
  "Enterprise Technology Trends",
  "Buyer Insights",
];

export const normalizeResourceType = (t: string | null): string => {
  if (!t) return "All";
  const s = t.toLowerCase().trim();
  if (s === "all") return "All";
  if (s.startsWith("whitepaper")) return "Whitepapers";
  if (s.startsWith("playbook")) return "Playbooks";
  if (s.startsWith("industry report")) return "Industry Reports";
  if (s.includes("enterprise technology trend")) return "Enterprise Technology Trends";
  if (s.includes("buyer insight")) return "Buyer Insights";
  return t;
};

const topicBriefings: Record<string, {
  badge: string;
  title: string;
  description: string;
  pills: string[];
  docCountLabel: string;
}> = {
  "Industry Reports": {
    badge: "Empirical Enterprise Research",
    title: "Industry Reports — Market Intelligence & Empirical Benchmarks",
    description: "Quantitative survey findings, cyber threat indexes, CISO budget allocations, and SOC operations benchmarks analyzing conversion rates, pipeline acquisition costs, and vulnerability exposure across 500+ global enterprises.",
    pills: ["B2B Pipeline Benchmarks", "Global Threat Index", "SOC Alert Triage Data", "CISO Budget Allocation", "Vulnerability MTTR Metrics"],
    docCountLabel: "10 Verified Industry Reports • 100% Peer-Reviewed • Fortune 1000 Scope",
  },
  "Enterprise Technology Trends": {
    badge: "Strategic Architecture Analysis",
    title: "Enterprise Technology Trends — Architectural Shifts & Next-Gen Infrastructure",
    description: "Forward-looking technical analyses covering SASE and ZTNA 2.0 convergence, Agentic AI in IT service management, post-quantum cryptography migration roadmaps, and unified CNAPP cloud workload protection.",
    pills: ["SASE & ZTNA Convergence", "Agentic AI in ITSM", "Post-Quantum Cryptography", "CNAPP Consolidation", "eBPF Kernel Telemetry"],
    docCountLabel: "10 Strategic Trend Reports • Reference Topologies • Migration Roadmaps",
  },
  "Buyer Insights": {
    badge: "Purchasing Psychology & Committee Dynamics",
    title: "Buyer Insights — Enterprise Purchasing Dynamics & Committee Governance",
    description: "Direct buyer research detailing how CISOs, CIOs, and enterprise procurement committees evaluate tech vendors, score intent signals, navigate the procurement gauntlet, and approve six-figure software budgets.",
    pills: ["CISO Evaluation Rubrics", "Intent Signal Correlation", "PoC Bake-Off Criteria", "Procurement Gauntlet SOPs", "Vendor Rationalization"],
    docCountLabel: "10 Executive Buyer Studies • 320+ Committees Analyzed • Deal Velocity Frameworks",
  },
  "Whitepapers": {
    badge: "Peer-Reviewed Architecture Frameworks",
    title: "Technical Whitepapers — Enterprise Reference Blueprints & Standards",
    description: "Rigorous technical whitepapers covering Zero Trust deployment topologies, automated endpoint management, machine identity security, and enterprise data hygiene standards tested across mission-critical environments.",
    pills: ["NIST 800-207 Architecture", "Cloud Workload Defense", "Zero-Waste Data Hygiene", "Machine Identity Security", "Immutable Ransomware Vaults"],
    docCountLabel: "10 Technical Whitepapers • Engineering Topologies • Compliance Checklists",
  },
  "Playbooks": {
    badge: "Operational Standard Operating Procedures",
    title: "Operational Playbooks — Standard Operating Procedures & Execution Runbooks",
    description: "Field-tested operational execution manuals detailing multi-touch cold outreach cadences, gatekeeper navigation, CSPM drift remediation, and cyber incident escalation decision trees.",
    pills: ["21-Day Multi-Touch Cadence", "CISO Engagement Scripts", "Incident Response Decision Trees", "CSPM Drift Remediation", "Active Directory Modernization"],
    docCountLabel: "10 Operational Playbooks • Step-by-Step SOPs • Actionable Talk Tracks",
  },
  "All": {
    badge: "Knowledge & Research Vault",
    title: "Enterprise Research Vault — Whitepapers, Playbooks & Market Intelligence",
    description: "Explore GETprospeKt's complete archive of 50 technical architecture whitepapers, operational sales playbooks, empirical benchmark reports, technology trend analyses, and buyer committee studies.",
    pills: ["Whitepapers", "Playbooks", "Industry Reports", "Tech Trends", "Buyer Insights"],
    docCountLabel: "50 Enterprise Publications • Verified Research • Instant PDF & Digital Access",
  },
};

const Resources: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialType = normalizeResourceType(searchParams.get("type"));

  const [activeType, setActiveType] = useState<string>(initialType);
  const [searchQuery, setSearchQuery] = useState("");
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync state with URL params
  useEffect(() => {
    const typeParam = searchParams.get("type");
    if (typeParam) {
      setActiveType(normalizeResourceType(typeParam));
    } else {
      setActiveType("All");
    }
  }, [searchParams]);

  useEffect(() => {
    loadResources();
  }, [activeType]);

  const loadResources = async () => {
    setLoading(true);
    try {
      const typeFilter = activeType === "All" ? undefined : activeType;
      const data = await resourcesApi.getAll(typeFilter);
      setResources(data || []);
    } catch (err) {
      console.error("Failed to load resources:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTypeChange = (type: string) => {
    setActiveType(type);
    if (type === "All") {
      searchParams.delete("type");
    } else {
      searchParams.set("type", type);
    }
    setSearchParams(searchParams);
  };

  const filteredResources = resources.filter((item) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.summary.toLowerCase().includes(query) ||
      item.type.toLowerCase().includes(query)
    );
  });

  return (
    <>
      <style>{`
        /* =========================================
           RESOURCES GALLERY PAGE
        ========================================= */
        .resources-page {
          min-height: 100vh;
          background: #060B12;
          color: #D5DBE7;
          padding: 40px 0 90px;
          font-family: var(--font-sans);
        }

        .resources-container {
          width: min(1380px, calc(100% - 48px));
          margin: 0 auto;
        }

        /* HEADER */
        .resources-hero {
          text-align: center;
          margin-bottom: 44px;
        }

        .resources-badge {
          display: inline-block;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #00D2FF;
          background: rgba(0, 70, 252, 0.12);
          border: 1px solid rgba(0, 210, 255, 0.25);
          padding: 6px 16px;
          border-radius: 20px;
          margin-bottom: 16px;
        }

        .resources-hero h1 {
          font-size: clamp(30px, 3.8vw, 48px);
          font-weight: 800;
          color: #FFFFFF;
          margin: 0 0 14px;
          letter-spacing: -0.02em;
          line-height: 1.15;
        }

        .resources-hero p {
          max-width: 720px;
          margin: 0 auto;
          font-size: 16px;
          line-height: 1.6;
          color: #94A3B8;
        }

        /* FILTERS & SEARCH BAR */
        .resources-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 18px;
          background: #0D1522;
          border: 1px solid rgba(203, 213, 225, 0.12);
          border-radius: 10px;
          padding: 12px 18px;
          margin-bottom: 38px;
        }

        .resources-tabs {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .resources-tab-btn {
          border: 0;
          background: transparent;
          color: #94A3B8;
          font-size: 14px;
          font-weight: 600;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .resources-tab-btn:hover {
          color: #FFFFFF;
          background: rgba(255, 255, 255, 0.05);
        }

        .resources-tab-btn.active {
          color: #FFFFFF;
          background: #0046FC;
          box-shadow: 0 2px 10px rgba(0, 70, 252, 0.4);
        }

        .resources-search-box {
          position: relative;
          min-width: 270px;
          transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .resources-search-box:focus-within {
          min-width: 330px;
        }

        .resources-search-box input {
          width: 100%;
          background: #060B12;
          border: 1px solid rgba(203, 213, 225, 0.18);
          border-radius: 8px;
          padding: 9px 34px 9px 36px;
          color: #FFFFFF;
          font-size: 13.5px;
          outline: none;
          transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
          box-sizing: border-box;
          box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.4);
        }

        .resources-search-box input::placeholder {
          color: #64748B;
          transition: color 0.2s ease;
        }

        .resources-search-box:hover input {
          border-color: rgba(0, 210, 255, 0.45);
          background: #09101C;
          box-shadow: 0 2px 10px rgba(0, 70, 252, 0.15);
        }

        .resources-search-box input:focus {
          border-color: #00D2FF;
          background: #0B1424;
          box-shadow: 0 0 0 3px rgba(0, 210, 255, 0.2), 0 4px 18px rgba(0, 70, 252, 0.25);
        }

        .resources-search-box input:focus::placeholder {
          color: #94A3B8;
        }

        .resources-search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          width: 15px;
          height: 15px;
          color: #64748B;
          pointer-events: none;
          display: block;
          transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .resources-search-box:hover .resources-search-icon {
          color: #94A3B8;
        }

        .resources-search-box:focus-within .resources-search-icon {
          color: #00D2FF;
          transform: translateY(-50%) scale(1.12);
        }

        .resources-search-clear {
          position: absolute;
          right: 9px;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.08);
          border: 0;
          color: #94A3B8;
          font-size: 11px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
          padding: 0;
          line-height: 1;
        }

        .resources-search-clear:hover {
          background: rgba(239, 68, 68, 0.25);
          color: #EF4444;
          transform: translateY(-50%) scale(1.15);
        }

        .resources-search-clear:active {
          transform: translateY(-50%) scale(0.95);
        }

        /* CARD GRID (MATCHING SHARED SCREENSHOT) */
        .resources-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }

        @media (max-width: 1200px) {
          .resources-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 900px) {
          .resources-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 560px) {
          .resources-grid {
            grid-template-columns: 1fr;
          }
        }

        /* INDIVIDUAL CARD (HARMONIZED WITH WEBSITE THEME) */
        .resource-card {
          background: #0D1522;
          border-radius: 8px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.45);
          border: 1px solid rgba(203, 213, 225, 0.14);
          transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), 
                      box-shadow 0.3s cubic-bezier(0.2, 0.8, 0.2, 1),
                      border-color 0.3s ease;
          text-decoration: none;
          color: #D5DBE7;
          position: relative;
          cursor: pointer;
        }

        .resource-card:hover {
          transform: translateY(-8px) scale(1.008);
          border-color: #00D2FF;
          box-shadow: 0 18px 42px rgba(0, 70, 252, 0.35), 0 0 25px rgba(0, 210, 255, 0.22);
        }

        .resource-card:active {
          transform: translateY(-3px) scale(0.995);
        }

        /* CARD COVER IMAGE */
        .resource-card-cover {
          width: 100%;
          height: 250px;
          background: #060B12;
          position: relative;
          overflow: hidden;
          border-bottom: 1px solid rgba(203, 213, 225, 0.1);
        }

        .resource-card-cover img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), filter 0.3s ease;
        }

        .resource-hover-badge {
          position: absolute;
          bottom: 12px;
          left: 12px;
          background: rgba(6, 11, 18, 0.9);
          backdrop-filter: blur(6px);
          color: #00D2FF;
          border: 1px solid rgba(0, 210, 255, 0.4);
          border-radius: 4px;
          padding: 4px 8px;
          font-size: 11px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          opacity: 0.85;
          z-index: 3;
          transition: all 0.25s ease;
          pointer-events: none;
        }

        .resource-card:hover .resource-hover-badge {
          opacity: 1;
          background: #0046FC;
          color: #FFFFFF;
          border-color: #00D2FF;
          transform: translateY(-2px);
        }

        .resource-card:hover .resource-card-cover img {
          transform: scale(1.08);
          filter: brightness(1.06);
        }

        .resource-card-cover::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(6, 11, 18, 0) 50%, rgba(6, 11, 18, 0.6) 100%);
          opacity: 0.8;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        .resource-card:hover .resource-card-cover::after {
          opacity: 0.5;
        }

        /* RED CATEGORY TAG ON RIGHT OF IMAGE */
        .resource-card-tag {
          position: absolute;
          bottom: 12px;
          right: 12px;
          color: #FFFFFF;
          font-weight: 700;
          font-size: 12px;
          background: rgba(220, 38, 38, 0.88);
          backdrop-filter: blur(6px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 4px 11px;
          border-radius: 4px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
          transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
          z-index: 2;
        }

        .resource-card:hover .resource-card-tag {
          background: #DC2626;
          transform: scale(1.06);
          box-shadow: 0 4px 14px rgba(220, 38, 38, 0.55);
        }

        /* CARD BODY */
        .resource-card-body {
          padding: 20px 20px 22px;
          display: flex;
          flex-direction: column;
          flex: 1;
          background: #0D1522;
          transition: background 0.25s ease;
        }

        .resource-topic-panel {
          background: linear-gradient(135deg, rgba(13, 21, 34, 0.95) 0%, rgba(6, 11, 18, 0.9) 100%);
          border: 1px solid rgba(0, 210, 255, 0.28);
          border-left: 4px solid #00D2FF;
          border-radius: 10px;
          padding: 24px 28px;
          margin-bottom: 34px;
          box-shadow: 0 12px 36px rgba(0, 0, 0, 0.45);
          position: relative;
          overflow: hidden;
        }

        .resource-topic-badge {
          display: inline-block;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #00D2FF;
          background: rgba(0, 70, 252, 0.2);
          border: 1px solid rgba(0, 210, 255, 0.35);
          padding: 4px 12px;
          border-radius: 4px;
          margin-bottom: 10px;
        }

        .resource-topic-title {
          font-size: clamp(20px, 2.4vw, 26px);
          font-weight: 800;
          color: #FFFFFF;
          margin: 0 0 10px;
          letter-spacing: -0.01em;
        }

        .resource-topic-desc {
          font-size: 14.5px;
          line-height: 1.65;
          color: #CBD5E1;
          margin: 0 0 16px;
          max-width: 980px;
        }

        .resource-topic-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          padding-top: 14px;
          border-top: 1px solid rgba(203, 213, 225, 0.1);
        }

        .resource-topic-pills {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .resource-topic-pill {
          font-size: 11.5px;
          font-weight: 600;
          color: #E2E8F0;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(203, 213, 225, 0.14);
          padding: 4px 10px;
          border-radius: 4px;
        }

        .resource-topic-count {
          font-size: 12px;
          font-weight: 700;
          color: #00D2FF;
        }

        .resource-card-summary {
          font-size: 13.5px;
          line-height: 1.55;
          color: #94A3B8;
          margin: 0 0 14px;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          flex: 1;
        }

        .resource-card-title {
          font-size: 17px;
          font-weight: 700;
          line-height: 1.35;
          color: #FFFFFF;
          margin: 0 0 10px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 46px;
          transition: color 0.25s ease;
        }

        .resource-card:hover .resource-card-title {
          color: #00D2FF;
        }

        .resource-card-meta {
          font-size: 12px;
          color: #94A3B8;
          margin-top: auto;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 10px;
          border-top: 1px solid rgba(203, 213, 225, 0.1);
        }

        .resource-card-meta span {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          transition: color 0.2s ease;
        }

        .resource-card:hover .resource-card-meta span {
          color: #D5DBE7;
        }

        /* DOWNLOAD NOW INTERACTIVE BOTTOM BUTTON */
        .resource-card-btn {
          width: 100%;
          background: #060B12;
          color: #D5DBE7;
          border: 1px solid rgba(0, 210, 255, 0.3);
          padding: 12px 18px;
          font-size: 13.5px;
          font-weight: 700;
          text-align: center;
          letter-spacing: 0.05em;
          text-transform: capitalize;
          cursor: pointer;
          border-radius: 6px;
          transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: auto;
          position: relative;
          overflow: hidden;
          font-family: inherit;
          outline: none;
        }

        .resource-card-btn .arrow-icon {
          display: inline-block;
          transition: transform 0.25s ease;
          color: #00D2FF;
        }

        .resource-card:hover .resource-card-btn {
          background: linear-gradient(135deg, #0046FC 0%, #00D2FF 100%);
          color: #FFFFFF;
          border-color: transparent;
          box-shadow: 0 4px 20px rgba(0, 70, 252, 0.5);
        }

        .resource-card:hover .resource-card-btn .arrow-icon {
          transform: translateX(6px);
          color: #FFFFFF;
        }

        /* EMPTY STATE */
        .resources-empty {
          text-align: center;
          padding: 70px 20px;
          background: #0D1522;
          border-radius: 10px;
          border: 1px dashed rgba(203, 213, 225, 0.2);
        }

        .resources-empty h3 {
          font-size: 20px;
          color: #FFFFFF;
          margin-bottom: 8px;
        }

        .resources-empty p {
          color: #94A3B8;
        }
      `}</style>

      <div className="resources-page">
        <div className="resources-container">
          {/* HERO */}
          <div className="resources-hero">
            <span className="resources-badge">Knowledge & Research Vault</span>
            <h1>Enterprise Whitepapers & Playbooks</h1>
            <p>
              In-depth technical architecture frameworks, operational sales playbooks,
              and verified industry benchmarks designed for enterprise decision-makers.
            </p>
          </div>

          {/* CONTROLS (TABS + SEARCH) */}
          <div className="resources-controls">
            <div className="resources-tabs">
              {filterTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  className={`resources-tab-btn ${
                    activeType === type ? "active" : ""
                  }`}
                  onClick={() => handleTypeChange(type)}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className={`resources-search-box ${searchQuery ? "has-query" : ""}`}>
              <svg
                className="resources-search-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search whitepapers, reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search whitepapers and reports"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="resources-search-clear"
                  onClick={() => setSearchQuery("")}
                  title="Clear search"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* DYNAMIC CATEGORY INTELLIGENCE BRIEF */}
          {(() => {
            const briefing = topicBriefings[activeType] || topicBriefings["All"];
            return (
              <div className="resource-topic-panel">
                <span className="resource-topic-badge">{briefing.badge}</span>
                <h2 className="resource-topic-title">{briefing.title}</h2>
                <p className="resource-topic-desc">{briefing.description}</p>
                <div className="resource-topic-footer">
                  <div className="resource-topic-pills">
                    {briefing.pills.map((pill, idx) => (
                      <span key={idx} className="resource-topic-pill">
                        ✓ {pill}
                      </span>
                    ))}
                  </div>
                  <span className="resource-topic-count">{briefing.docCountLabel}</span>
                </div>
              </div>
            );
          })()}

          {/* CARDS GRID */}
          {loading ? (
            <div className="resources-empty">
              <h3>Loading resources...</h3>
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="resources-empty">
              <h3>No resources found</h3>
              <p>Try searching for a different keyword or select another category tab.</p>
            </div>
          ) : (
            <div className="resources-grid">
              {filteredResources.map((item) => (
                <Link
                  key={item._id}
                  to={`/resources/view/${item._id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="resource-card"
                  aria-label={`Download ${item.title}`}
                >
                  {/* EDITORIAL COVER IMAGE (MATCHING BRAND CANONICAL DESIGN) */}
                  <div className="resource-card-cover">
                    <EditorialCoverImage
                      title={item.title}
                      subtitle={item.summary}
                      category={item.category || item.type || "Research"}
                      photo={
                        item.coverImage ||
                        "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=85"
                      }
                      variant="card"
                    />
                    <span className="resource-card-tag">
                      {item.type || "Whitepapers"}
                    </span>
                  </div>

                  {/* BODY */}
                  <div className="resource-card-body">
                    <h3 className="resource-card-title">{item.title}</h3>

                    {item.summary && (
                      <p className="resource-card-summary">{item.summary}</p>
                    )}

                    <div className="resource-card-meta">
                      <span>🏷️ {item.category}</span>
                      <span>📥 {item.downloadCount || 0} downloads</span>
                    </div>

                    {/* SOLID DOWNLOAD NOW BUTTON (AS SHOWN IN SCREENSHOT) */}
                    <button
                      type="button"
                      className="resource-card-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        downloadPdfDocument({
                          title: item.title,
                          type: item.type,
                          category: item.category,
                          summary: item.summary,
                          content: item.content,
                          coverImage: item.coverImage,
                        });
                      }}
                    >
                      Download Now <span className="arrow-icon">→</span>
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Resources;

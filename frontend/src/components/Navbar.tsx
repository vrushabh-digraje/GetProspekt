import { useState } from "react";
import { Link } from "react-router-dom";
import { solutionsData } from "../pages/Solutions";

type NavDropdownItem = {
  label: string;
  path: string;
};

type NavGroup = {
  key: string;
  label: string;
  items: NavDropdownItem[];
};

const navGroups: NavGroup[] = [
  {
    key: "solutions",
    label: "Solutions",
    items: [
      { label: "MQL Generation", path: "/article/mql-generation" },
      { label: "SQL Generation", path: "/article/sql-generation" },
      { label: "BANT Qualified Leads", path: "/article/bant-qualified-leads" },
      { label: "Appointment Generation", path: "/article/appointment-generation" },
      { label: "Webinar Campaigns", path: "/article/webinar-campaigns" },
      { label: "Human-Verified Data", path: "/article/human-verified-data" },
    ],
  },
  {
    key: "topics",
    label: "Topics",
    items: [
      { label: "B2B Lead Generation", path: "/article/better-pipeline-starts-with-better-decisions" },
      { label: "Demand Generation", path: "/article/mql-generation" },
      { label: "Lead Qualification", path: "/article/bant-qualified-leads" },
      { label: "Pipeline Growth", path: "/article/better-pipeline-starts-with-better-decisions" },
      { label: "Sales Development", path: "/article/sql-generation" },
      { label: "B2B Marketing", path: "/article/mql-generation" },
    ],
  },
  {
    key: "industries",
    label: "Insights / Industries",
    items: [
      { label: "B2B Technology", path: "/article/better-pipeline-starts-with-better-decisions" },
      { label: "Enterprise Technology", path: "/article/better-pipeline-starts-with-better-decisions" },
      { label: "Cloud", path: "/article/human-verified-data" },
      { label: "Cybersecurity", path: "/article/mql-generation" },
      { label: "AI", path: "/article/sql-generation" },
      { label: "SaaS", path: "/article/bant-qualified-leads" },
      { label: "Digital Transformation", path: "/article/appointment-generation" },
    ],
  },
  {
    key: "research",
    label: "Research",
    items: [
      { label: "Industry Reports", path: "/resources?type=Industry%20Report" },
      { label: "Enterprise Technology Trends", path: "/resources?type=Enterprise%20Technology%20Trends" },
      { label: "Buyer Insights", path: "/resources?type=Buyer%20Insights" },
    ],
  },
  {
    key: "resources",
    label: "Resources",
    items: [
      { label: "Whitepapers", path: "/resources?type=Whitepaper" },
      { label: "Playbooks", path: "/resources?type=Playbook" },
      { label: "Case Studies", path: "/case-studies" },
    ],
  },
  {
    key: "newsletters",
    label: "Newsletters",
    items: [
      { label: "Weekly/Monthly Industry Newsletter", path: "/article/better-pipeline-starts-with-better-decisions" },
    ],
  },
];

function Navbar() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  return (
    <>
      <style>{`
        /* =========================================
           NAVBAR
        ========================================= */

        .publication-navbar {
          width: 100%;
          height: 59px;
          background: #060B12;
          border-top: 3px solid #0046FC;
          border-bottom: 1px solid rgba(203, 213, 225, 0.1);
          position: relative;
          z-index: 900;
          font-family: var(--font-sans);
        }

        .publication-navbar-container {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 25px;
          box-sizing: border-box;
        }

        .publication-navbar-links {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: clamp(16px, 2.2vw, 36px);
        }

        .publication-navbar-item {
          height: 100%;
          display: flex;
          align-items: center;
          position: relative;
        }

        .publication-navbar-link {
          border: 0;
          background: transparent;
          height: 100%;
          display: inline-flex;
          align-items: center;
          color: #D5DBE7;
          text-decoration: none;
          font-size: 15.5px;
          font-weight: 600;
          white-space: nowrap;
          cursor: pointer;
          transition: color 0.2s ease;
          font-family: inherit;
          padding: 0;
        }

        .publication-navbar-link:hover,
        .publication-navbar-item.active .publication-navbar-link {
          color: #00D2FF;
        }

        .publication-navbar-arrow {
          margin-left: 6px;
          color: #AEB8CA;
          font-size: 9px;
          position: relative;
          top: -1px;
          transition: transform 0.2s ease, color 0.2s ease;
        }

        .publication-navbar-item:hover .publication-navbar-arrow,
        .publication-navbar-item.active .publication-navbar-arrow {
          color: #00D2FF;
          transform: rotate(180deg);
        }

        /* =========================================
           VERTICAL DROPDOWN (LIKE REFERENCE IMAGE)
        ========================================= */

        .publication-vertical-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          min-width: 250px;
          background: #0D1522;
          border-radius: 8px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6), 0 2px 8px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(203, 213, 225, 0.14);
          padding: 12px 10px;
          box-sizing: border-box;
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transform: translateY(6px);
          transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s ease;
          display: flex;
          flex-direction: column;
          gap: 3px;
          z-index: 1000;
        }

        .publication-navbar-item:hover .publication-vertical-dropdown,
        .publication-navbar-item.active .publication-vertical-dropdown {
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
          transform: translateY(0);
        }

        .publication-dropdown-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 14px;
          border-radius: 6px;
          text-decoration: none;
          color: #D5DBE7;
          font-size: 15px;
          font-weight: 500;
          transition: background 0.15s ease, color 0.15s ease, transform 0.15s ease;
          white-space: nowrap;
        }

        .publication-dropdown-link:hover {
          background: rgba(0, 210, 255, 0.12);
          color: #00D2FF;
        }

        .publication-dropdown-label {
          flex: 0 0 auto;
        }

        .publication-dropdown-arrow {
          color: #00D2FF;
          font-size: 12px;
          line-height: 1;
          transition: transform 0.15s ease;
          flex-shrink: 0;
        }

        .publication-dropdown-link:hover .publication-dropdown-arrow {
          transform: translateX(3px);
        }

        /* =========================================
           SOLUTIONS CARDS MEGA-DROPDOWN
        ========================================= */

        .publication-solutions-cards-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          width: min(980px, 94vw);
          background: #0B121E;
          border-radius: 10px;
          box-shadow: 0 20px 48px rgba(0, 0, 0, 0.75), 0 0 24px rgba(0, 210, 255, 0.12);
          border: 1px solid rgba(203, 213, 225, 0.16);
          padding: 18px 20px 16px;
          box-sizing: border-box;
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transform: translateY(6px);
          transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s ease;
          z-index: 1000;
        }

        .publication-navbar-item:hover .publication-solutions-cards-dropdown,
        .publication-navbar-item.active .publication-solutions-cards-dropdown {
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
          transform: translateY(0);
        }

        .solutions-cards-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(203, 213, 225, 0.1);
          padding-bottom: 12px;
          margin-bottom: 14px;
        }

        .solutions-cards-header-title h4 {
          margin: 0 0 3px;
          font-size: 15px;
          font-weight: 800;
          color: #FFFFFF;
        }

        .solutions-cards-header-title p {
          margin: 0;
          font-size: 12px;
          color: #94A3B8;
        }

        .solutions-cards-view-all-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12.5px;
          font-weight: 700;
          color: #00D2FF;
          text-decoration: none;
          background: rgba(0, 210, 255, 0.1);
          border: 1px solid rgba(0, 210, 255, 0.25);
          padding: 6px 14px;
          border-radius: 18px;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .solutions-cards-view-all-link:hover {
          background: linear-gradient(135deg, #0046FC 0%, #00D2FF 100%);
          color: #FFFFFF;
          border-color: transparent;
        }

        .solutions-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .solution-dropdown-card {
          display: flex;
          background: #070D16;
          border: 1px solid rgba(203, 213, 225, 0.1);
          border-radius: 7px;
          overflow: hidden;
          text-decoration: none;
          color: inherit;
          transition: all 0.25s ease;
        }

        .solution-dropdown-card:hover {
          border-color: rgba(0, 210, 255, 0.45);
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.4);
          background: #0E1828;
        }

        .solution-dropdown-card-thumb {
          width: 82px;
          min-width: 82px;
          position: relative;
          overflow: hidden;
          background: #02060B;
        }

        .solution-dropdown-card-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .solution-dropdown-card-tag {
          position: absolute;
          bottom: 3px;
          left: 3px;
          background: rgba(6, 11, 18, 0.88);
          color: #00D4AA;
          font-size: 7.5px;
          font-weight: 700;
          padding: 2px 4px;
          border-radius: 2px;
          white-space: nowrap;
        }

        .solution-dropdown-card-info {
          padding: 9px 11px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          min-width: 0;
        }

        .solution-dropdown-card-info h5 {
          margin: 0 0 3px;
          font-size: 13px;
          font-weight: 700;
          color: #FFFFFF;
          line-height: 1.25;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .solution-dropdown-card:hover .solution-dropdown-card-info h5 {
          color: #00D2FF;
        }

        .solution-dropdown-card-info p {
          margin: 0 0 5px;
          font-size: 10.5px;
          line-height: 1.35;
          color: #94A3B8;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .solution-dropdown-card-arrow {
          font-size: 10.5px;
          font-weight: 700;
          color: #00D2FF;
        }

        /* =========================================
           RESPONSIVE
        ========================================= */

        @media (max-width: 1024px) {
          .publication-navbar-links {
            gap: 28px;
          }
          .publication-navbar-link {
            font-size: 15px;
          }
        }

        @media (max-width: 768px) {
          .publication-navbar-container {
            overflow-x: auto;
            scrollbar-width: none;
            justify-content: flex-start;
          }
          .publication-navbar-container::-webkit-scrollbar {
            display: none;
          }
          .publication-navbar-links {
            gap: 22px;
            padding: 0 10px;
          }
        }
      `}</style>

      <nav className="publication-navbar">
        <div className="publication-navbar-container">
          <div className="publication-navbar-links">
            {navGroups.map((group) => {
              const isOpen = activeMenu === group.key;

              return (
                <div
                  key={group.key}
                  className={`publication-navbar-item ${isOpen ? "active" : ""}`}
                  onMouseEnter={() => setActiveMenu(group.key)}
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  {group.key === "solutions" ? (
                    <Link
                      to="/solutions"
                      className="publication-navbar-link"
                      onClick={() => setActiveMenu(null)}
                    >
                      {group.label}
                      <span className="publication-navbar-arrow">▼</span>
                    </Link>
                  ) : (
                    <button
                      type="button"
                      className="publication-navbar-link"
                      aria-expanded={isOpen}
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveMenu(isOpen ? null : group.key);
                      }}
                    >
                      {group.label}
                      <span className="publication-navbar-arrow">▼</span>
                    </button>
                  )}

                  {group.key === "solutions" ? (
                    <div className="publication-solutions-cards-dropdown">
                      <div className="solutions-cards-header">
                        <div className="solutions-cards-header-title">
                          <h4>Our Lead-Generation Solutions</h4>
                          <p>Six standalone, outcome-focused solutions for B2B pipeline growth.</p>
                        </div>
                        <Link
                          to="/solutions"
                          className="solutions-cards-view-all-link"
                          onClick={() => setActiveMenu(null)}
                        >
                          View All <span>→</span>
                        </Link>
                      </div>

                      <div className="solutions-cards-grid">
                        {solutionsData.map((sol) => (
                          <Link
                            key={sol.id}
                            to={sol.path}
                            className="solution-dropdown-card"
                            onClick={() => setActiveMenu(null)}
                          >
                            <div className="solution-dropdown-card-thumb">
                              <img src={sol.image} alt={sol.title} loading="lazy" />
                              <span className="solution-dropdown-card-tag">{sol.tag}</span>
                            </div>
                            <div className="solution-dropdown-card-info">
                              <h5>{sol.title}</h5>
                              <p>{sol.description}</p>
                              <span className="solution-dropdown-card-arrow">Explore Solution →</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="publication-vertical-dropdown">
                      {group.items.map((subItem) => (
                        <Link
                          key={subItem.label}
                          to={subItem.path}
                          className="publication-dropdown-link"
                          onClick={() => setActiveMenu(null)}
                        >
                          <span className="publication-dropdown-label">{subItem.label}</span>
                          <span className="publication-dropdown-arrow" aria-hidden="true">
                            ▸
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Direct link for Contact Us */}
            <div className="publication-navbar-item">
              <Link
                to="/contact"
                className="publication-navbar-link"
                onClick={() => setActiveMenu(null)}
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
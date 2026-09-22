import { useState } from "react";
import { Link } from "react-router-dom";

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
      { label: "Industry Reports", path: "/article/human-verified-data" },
      { label: "Enterprise Technology Trends", path: "/article/better-pipeline-starts-with-better-decisions" },
      { label: "Buyer Insights", path: "/article/sql-generation" },
    ],
  },
  {
    key: "resources",
    label: "Resources",
    items: [
      { label: "Playbooks", path: "/article/webinar-campaigns" },
      { label: "Case Studies", path: "/case-studies" },
      { label: "Whitepapers", path: "/article/bant-qualified-leads" },
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
          background: #071019;
          border-top: 3px solid #7568E8;
          border-bottom: 1px solid rgba(255,255,255,.08);
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
          gap: 48px;
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
          font-size: 17px;
          font-weight: 600;
          white-space: nowrap;
          cursor: pointer;
          transition: color 0.2s ease;
          font-family: inherit;
          padding: 0;
        }

        .publication-navbar-link:hover,
        .publication-navbar-item.active .publication-navbar-link {
          color: #96AEFC;
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
          color: #96AEFC;
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
          background: #121022;
          border-radius: 8px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6), 0 2px 8px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.12);
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
          background: rgba(150, 174, 252, 0.12);
          color: #96AEFC;
        }

        .publication-dropdown-label {
          flex: 0 0 auto;
        }

        .publication-dropdown-arrow {
          color: #96AEFC;
          font-size: 12px;
          line-height: 1;
          transition: transform 0.15s ease;
          flex-shrink: 0;
        }

        .publication-dropdown-link:hover .publication-dropdown-arrow {
          transform: translateX(3px);
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
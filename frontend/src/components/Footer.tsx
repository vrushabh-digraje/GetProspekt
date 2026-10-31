import { Link } from "react-router-dom";
import gettLogo from "../assets/images/gett.png";

const solutionsLinks = [
  { label: "Human-Verified Data", to: "/article/human-verified-data" },
  { label: "MQL Generation", to: "/article/mql-generation" },
  { label: "SQL Generation", to: "/article/sql-generation" },
  { label: "BANT-Qualified Leads", to: "/article/bant-qualified-leads" },
  { label: "Appointment Generation", to: "/article/appointment-generation" },
  { label: "Webinar Campaigns", to: "/article/webinar-campaigns" },
];

const mediaBrandsLinks = [
  { label: "Enterprise Current", to: "/article/enterprise-technology" },
  { label: "CyberDefense Journal", to: "/article/cybersecurity-pipeline" },
  { label: "Cloud Enterprise", to: "/article/cloud-infrastructure" },
  { label: "Growth Marketer", to: "/article/b2b-technology" },
  { label: "Enterprise AI Brief", to: "/article/ai-native-demand-generation" },
  { label: "Fintech Perspective", to: "/article/fintech-cloud-security-token-hijacking" },
];

const resourcesLinks = [
  { label: "How We Work", to: "/solutions" },
  { label: "FAQ", to: "/faq" },
  { label: "Case Studies", to: "/case-studies" },
  { label: "Contact", to: "/contact" },
];

function Footer() {
  return (
    <>
      <footer className="ref-site-footer">
        <div className="ref-footer-container">
          <div className="ref-footer-main-grid">
            {/* Column 1: Brand & Tagline */}
            <div className="ref-footer-brand-col">
              <Link to="/" className="ref-footer-logo-link" aria-label="GETprospeKt Home">
                <img
                  src={gettLogo}
                  alt="GETprospeKt"
                  className="ref-footer-logo-img"
                />
              </Link>
              <p className="ref-footer-brand-desc">
                B2B lead-generation partner helping marketing teams turn their target market into qualified leads — at the qualification level their business requires.
              </p>
            </div>

            {/* Column 2: Solutions */}
            <div className="ref-footer-nav-col">
              <h2 className="ref-footer-col-heading">Solutions</h2>
              <ul className="ref-footer-links-list">
                {solutionsLinks.map((item) => (
                  <li key={item.to}>
                    <Link to={item.to} className="ref-footer-link">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Media Brands */}
            <div className="ref-footer-nav-col">
              <h2 className="ref-footer-col-heading">Media Brands</h2>
              <ul className="ref-footer-links-list">
                {mediaBrandsLinks.map((item) => (
                  <li key={item.to}>
                    <Link to={item.to} className="ref-footer-link">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Resources */}
            <div className="ref-footer-nav-col">
              <h2 className="ref-footer-col-heading">Resources</h2>
              <ul className="ref-footer-links-list">
                {resourcesLinks.map((item) => (
                  <li key={item.label}>
                    <Link to={item.to} className="ref-footer-link">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar: Copyright & Legal */}
          <div className="ref-footer-bottom-bar">
            <p className="ref-footer-copyright">
              © 2025 GETprospeKt. All rights reserved.
            </p>
            <nav className="ref-footer-legal-nav" aria-label="Legal">
              <Link to="/faq" className="ref-footer-legal-link">
                Privacy Policy
              </Link>
              <Link to="/faq" className="ref-footer-legal-link">
                Terms of Service
              </Link>
            </nav>
          </div>
        </div>
      </footer>

      <style>{`
        /* =========================================================
           REFERENCE-MATCHED FOOTER STYLING (GETPROSPEKT.CO)
           ========================================================= */
        .ref-site-footer {
          position: relative;
          z-index: 10;
          width: 100%;
          background-color: #1a2847;
          color: #FFFFFF;
          border-top: 1px solid rgba(232, 236, 239, 0.2);
          box-sizing: border-box;
        }

        .ref-footer-container {
          width: 100%;
          max-width: 1240px;
          margin-left: auto;
          margin-right: auto;
          padding: 64px 20px 48px;
          box-sizing: border-box;
        }

        @media (min-width: 640px) {
          .ref-footer-container {
            padding: 64px 24px 56px;
          }
        }

        @media (min-width: 768px) {
          .ref-footer-container {
            padding: 80px 40px 64px;
          }
        }

        .ref-footer-main-grid {
          display: grid;
          gap: 40px;
          grid-template-columns: 1fr;
        }

        @media (min-width: 640px) and (max-width: 1023px) {
          .ref-footer-main-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 36px 32px;
          }
        }

        @media (min-width: 1024px) {
          .ref-footer-main-grid {
            grid-template-columns: 1.35fr 1fr 1.15fr 0.85fr;
            gap: 36px;
          }
        }

        .ref-footer-brand-col {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .ref-footer-logo-link {
          display: inline-block;
          margin-bottom: 6px;
          text-decoration: none;
        }

        .ref-footer-logo-img {
          height: auto;
          max-height: 48px;
          width: auto;
          max-width: 180px;
          display: block;
          object-fit: contain;
        }

        .ref-footer-brand-desc {
          margin-top: 2px;
          max-width: 360px;
          font-size: 15px;
          line-height: 1.6;
          color: #E8ECEF;
        }

        .ref-footer-nav-col {
          display: flex;
          flex-direction: column;
        }

        .ref-footer-col-heading {
          font-size: 15px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #FFFFFF;
          margin: 0 0 16px;
        }

        .ref-footer-links-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .ref-footer-link {
          font-size: 15px;
          color: #E8ECEF;
          text-decoration: none;
          transition: color 0.2s ease;
          display: inline-block;
          width: fit-content;
        }

        .ref-footer-link:hover {
          color: #00D9FF;
          text-decoration: underline;
          text-underline-offset: 4px;
        }

        /* BOTTOM BAR */
        .ref-footer-bottom-bar {
          margin-top: 48px;
          padding-top: 24px;
          border-top: 1px solid rgba(232, 236, 239, 0.25);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        @media (min-width: 768px) {
          .ref-footer-bottom-bar {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
        }

        .ref-footer-copyright {
          margin: 0;
          font-size: 14px;
          color: #E8ECEF;
        }

        .ref-footer-legal-nav {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        @media (min-width: 640px) {
          .ref-footer-legal-nav {
            flex-direction: row;
            gap: 24px;
          }
        }

        .ref-footer-legal-link {
          font-size: 14px;
          color: #E8ECEF;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .ref-footer-legal-link:hover {
          color: #00D9FF;
          text-decoration: underline;
          text-underline-offset: 4px;
        }
      `}</style>
    </>
  );
}

export default Footer;

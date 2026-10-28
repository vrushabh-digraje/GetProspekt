import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  solutionsStorageApi,
  newslettersStorageApi,
  type SolutionData,
  type NewsletterData,
} from "../services/api";

type NavDropdownItem = {
  label: string;
  path: string;
  desc?: string;
  color?: string;
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
      { label: "Human-Verified Data", path: "/article/human-verified-data", desc: "100% phone & email verified B2B intelligence" },
      { label: "MQL Generation", path: "/article/mql-generation", desc: "Marketing-qualified leads with high buyer engagement" },
      { label: "SQL Generation", path: "/article/sql-generation", desc: "Sales-qualified pipeline with immediate purchase intent" },
      { label: "BANT-Qualified Leads", path: "/article/bant-qualified-leads", desc: "Budget, Authority, Need, and Timing confirmed" },
      { label: "Appointment Generation", path: "/article/appointment-generation", desc: "Pre-qualified sales discovery meetings directly on your calendar" },
      { label: "Webinar Campaigns", path: "/article/webinar-campaigns", desc: "High-intent registrations for live virtual executive sessions" },
    ],
  },
  {
    key: "media-brands",
    label: "Media Brands",
    items: [
      { label: "Enterprise Current", path: "/article/enterprise-technology", desc: "The umbrella enterprise technology publication", color: "#FB923C" },
      { label: "CyberDefense Journal", path: "/article/cybersecurity-pipeline", desc: "Cybersecurity and risk management", color: "#00D2FF" },
      { label: "Cloud Enterprise", path: "/article/cloud-infrastructure", desc: "Cloud, infrastructure, and enterprise IT", color: "#C084FC" },
      { label: "Growth Marketer", path: "/article/b2b-technology", desc: "CMOs, demand generation, and B2B marketing", color: "#F472B6" },
      { label: "Enterprise AI Brief", path: "/article/ai-native-demand-generation", desc: "AI adoption and business automation", color: "#38BDF8" },
      { label: "Fintech Perspective", path: "/article/fintech-cloud-security-token-hijacking", desc: "Banking, payments, and financial technology", color: "#34D399" },
    ],
  },
  {
    key: "research",
    label: "Research",
    items: [
      { label: "Industry Reports", path: "/resources?type=Industry%20Reports", desc: "Proprietary market surveys and benchmark studies" },
      { label: "Enterprise Technology Trends", path: "/resources?type=Enterprise%20Technology%20Trends", desc: "Executive forecasts and adoption data" },
      { label: "Buyer Insights", path: "/resources?type=Buyer%20Insights", desc: "Decision-maker behavior and purchase criteria" },
    ],
  },
  {
    key: "resources",
    label: "Resources",
    items: [
      { label: "Whitepapers", path: "/resources?type=Whitepapers", desc: "Technical architectures and implementation playbooks" },
      { label: "Playbooks", path: "/resources?type=Playbooks", desc: "Step-by-step executive execution guides" },
      { label: "Case Studies", path: "/case-studies", desc: "Real-world client pipeline metrics and conversion data" },
      { label: "All Resources & Library", path: "/resources", desc: "Browse full searchable asset repository" },
    ],
  },
  {
    key: "newsletters",
    label: "Newsletters",
    items: [
      { label: "Weekly/Monthly Industry Newsletter", path: "/article/better-pipeline-starts-with-better-decisions", desc: "Curated intelligence delivered directly to your inbox" },
    ],
  },
];

function Navbar() {
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileActiveAccordion, setMobileActiveAccordion] = useState<string | null>("solutions");
  const [solutions, setSolutions] = useState<SolutionData[]>(() => solutionsStorageApi.getAll());
  const [newsletters, setNewsletters] = useState<NewsletterData[]>(() => newslettersStorageApi.getAll());

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile drawer if resized to laptop/desktop (> 1024px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        setActiveMenu(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const handleUpdate = () => {
      setSolutions(solutionsStorageApi.getAll());
    };
    const handleNewsUpdate = () => {
      setNewsletters(newslettersStorageApi.getAll());
    };
    window.addEventListener("gp_solutions_updated", handleUpdate);
    window.addEventListener("gp_newsletters_updated", handleNewsUpdate);
    return () => {
      window.removeEventListener("gp_solutions_updated", handleUpdate);
      window.removeEventListener("gp_newsletters_updated", handleNewsUpdate);
    };
  }, []);

  return (
    <>
      <style>{`
        /* =========================================
           NAVBAR (DESKTOP / LAPTOP > 1024px)
        ========================================= */

        .publication-navbar {
          width: 100%;
          min-height: 58px;
          background: #060B12;
          border-top: 3px solid #0046FC;
          border-bottom: 1px solid rgba(203, 213, 225, 0.1);
          position: relative;
          z-index: 900;
          font-family: var(--font-sans);
        }

        .publication-navbar-container {
          width: 100%;
          min-height: 55px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 25px;
          box-sizing: border-box;
          position: relative;
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
          padding: 16px 0;
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
           VERTICAL DROPDOWN (DESKTOP)
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
           SOLUTIONS CARDS MEGA-DROPDOWN (DESKTOP)
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
          transform: translateY(8px);
          transition: opacity 0.22s ease, transform 0.22s ease, visibility 0.22s ease;
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
          padding-bottom: 12px;
          margin-bottom: 12px;
          border-bottom: 1px solid rgba(203, 213, 225, 0.1);
        }

        .solutions-cards-header-title h4 {
          margin: 0 0 2px;
          font-size: 16px;
          font-weight: 700;
          color: #FFFFFF;
        }

        .solutions-cards-header-title p {
          margin: 0;
          font-size: 12px;
          color: #94A3B8;
        }

        .solutions-cards-view-all-link {
          color: #00D2FF;
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
          transition: color 0.15s ease;
        }

        .solutions-cards-view-all-link:hover {
          color: #FFFFFF;
        }

        .solutions-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .solution-dropdown-card {
          display: flex;
          background: #060B12;
          border: 1px solid rgba(203, 213, 225, 0.12);
          border-radius: 8px;
          overflow: hidden;
          text-decoration: none;
          transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .solution-dropdown-card:hover {
          border-color: #00D2FF;
          background: #0E1726;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5), 0 0 16px rgba(0, 210, 255, 0.2);
        }

        .solution-dropdown-card-thumb {
          width: 82px;
          min-width: 82px;
          position: relative;
          background: #060B12;
          overflow: hidden;
        }

        .solution-dropdown-card-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .solution-dropdown-card-tag {
          position: absolute;
          top: 6px;
          left: 6px;
          background: rgba(0, 70, 252, 0.85);
          color: #FFFFFF;
          font-size: 9px;
          font-weight: 800;
          padding: 2px 5px;
          border-radius: 3px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
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

        /* =========================================================
           MOBILE & TABLET VIEWPORT STYLING (<= 1024px)
           HAMBURGER BUTTON REPLACING HORIZONTAL NAVBAR
        ========================================================= */

        /* Desktop view: hide mobile bar & drawer */
        @media (min-width: 1025px) {
          .publication-mobile-navbar-bar {
            display: none !important;
          }
          .publication-mobile-menu-drawer,
          .publication-mobile-menu-backdrop {
            display: none !important;
          }
        }

        /* Mobile and Tablet view: show hamburger button */
        @media (max-width: 1024px) {
          .publication-navbar {
            min-height: 54px;
            height: auto;
          }

          .publication-navbar-container {
            min-height: 54px;
            padding: 0 16px;
            justify-content: flex-start;
          }

          /* Hide horizontal dropdown links on mobile/tablet */
          .publication-navbar-links {
            display: none !important;
          }

          /* Display mobile/tablet bar with hamburger button */
          .publication-mobile-navbar-bar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            gap: 12px;
            padding: 6px 0;
          }
        }

        /* THE HAMBURGER BUTTON (COLOR COMBINATION ACCORDING TO WEBSITE, NO TEXT) */
        .mobile-hamburger-btn {
          width: 44px;
          height: 44px;
          min-width: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0F172A 0%, #070D18 100%);
          border: 1.5px solid rgba(0, 210, 255, 0.4);
          border-radius: 9px;
          padding: 0;
          cursor: pointer;
          transition: all 0.22s cubic-bezier(0.2, 0.8, 0.2, 1);
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.6), 0 0 12px rgba(0, 70, 252, 0.3);
          font-family: inherit;
          user-select: none;
          flex-shrink: 0;
        }

        .mobile-hamburger-btn:hover {
          background: #0E1A30;
          border-color: #00D2FF;
          transform: translateY(-1px) scale(1.04);
          box-shadow: 0 6px 20px rgba(0, 70, 252, 0.5), 0 0 16px rgba(0, 210, 255, 0.45);
        }

        .mobile-hamburger-btn.is-open {
          background: #0046FC;
          border-color: #00D2FF;
          box-shadow: 0 0 18px rgba(0, 210, 255, 0.6);
        }

        /* 3 rounded horizontal cyan/blue bars matching website color combination */
        .mobile-hamburger-box {
          width: 22px;
          height: 17px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
        }

        .mobile-hamburger-line {
          display: block;
          width: 100%;
          height: 3px;
          background: linear-gradient(90deg, #00D2FF 0%, #38BDF8 100%);
          border-radius: 3px;
          box-shadow: 0 0 6px rgba(0, 210, 255, 0.45);
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .mobile-hamburger-btn:hover .mobile-hamburger-line {
          background: #FFFFFF;
          box-shadow: 0 0 8px #00D2FF;
        }

        /* Animate into crisp 'X' when open */
        .mobile-hamburger-btn.is-open .mobile-hamburger-line {
          background: #FFFFFF;
          box-shadow: 0 0 8px #FFFFFF;
        }

        .mobile-hamburger-btn.is-open .mobile-hamburger-line.line-top {
          transform: translateY(7px) rotate(45deg);
        }

        .mobile-hamburger-btn.is-open .mobile-hamburger-line.line-mid {
          opacity: 0;
          transform: scaleX(0);
        }

        .mobile-hamburger-btn.is-open .mobile-hamburger-line.line-bot {
          transform: translateY(-7px) rotate(-45deg);
        }

        /* Quick access pills on mobile/tablet */
        .mobile-quick-pills {
          display: flex;
          align-items: center;
          gap: 8px;
          overflow-x: auto;
          scrollbar-width: none;
        }

        .mobile-quick-pills::-webkit-scrollbar {
          display: none;
        }

        .mobile-quick-pill {
          display: inline-flex;
          align-items: center;
          color: #CBD5E1;
          text-decoration: none;
          font-size: 12.5px;
          font-weight: 600;
          padding: 6px 14px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 20px;
          white-space: nowrap;
          transition: all 0.2s ease;
        }

        .mobile-quick-pill:hover,
        .mobile-quick-pill.highlight {
          color: #00D2FF;
          border-color: rgba(0, 210, 255, 0.4);
          background: rgba(0, 70, 252, 0.22);
        }

        /* Backdrop overlay */
        .publication-mobile-menu-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(6, 11, 18, 0.78);
          backdrop-filter: blur(5px);
          z-index: 899;
          animation: mobileFadeIn 0.2s ease;
        }

        @keyframes mobileFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Mobile / Tablet Menu Drawer */
        .publication-mobile-menu-drawer {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: #090E1A;
          border-bottom: 2px solid #0046FC;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.95), 0 0 35px rgba(0, 70, 252, 0.25);
          max-height: calc(100vh - 110px);
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          z-index: 1000;
          padding: 18px 20px 32px;
          animation: mobileDrawerSlide 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes mobileDrawerSlide {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .mobile-drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 12px;
          margin-bottom: 14px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .mobile-drawer-eyebrow {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #00D2FF;
        }

        .mobile-drawer-close {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 50%;
          width: 30px;
          height: 30px;
          color: #94A3B8;
          font-size: 15px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
          transition: all 0.2s ease;
        }

        .mobile-drawer-close:hover {
          background: rgba(239, 68, 68, 0.2);
          color: #EF4444;
          border-color: #EF4444;
        }

        .mobile-drawer-sections {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .mobile-drawer-group {
          background: #0D1524;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          overflow: hidden;
        }

        .mobile-drawer-group-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 13px 16px;
          background: transparent;
          border: 0;
          color: #FFFFFF;
          font-size: 15.5px;
          font-weight: 700;
          cursor: pointer;
          text-align: left;
          font-family: inherit;
          transition: all 0.18s ease;
        }

        .mobile-drawer-group-btn:hover,
        .mobile-drawer-group-btn.is-expanded {
          background: rgba(0, 70, 252, 0.18);
          color: #00D2FF;
        }

        .mobile-group-arrow {
          font-size: 13px;
          color: #94A3B8;
          transition: transform 0.22s ease;
        }

        .mobile-group-arrow.open {
          transform: rotate(180deg);
          color: #00D2FF;
        }

        .mobile-drawer-subitems {
          padding: 6px 12px 14px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          background: rgba(6, 11, 18, 0.5);
        }

        .mobile-subitem-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 12px;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          color: #D5DBE7;
          text-decoration: none;
          transition: all 0.18s ease;
          gap: 12px;
        }

        .mobile-subitem-link:hover {
          background: rgba(0, 210, 255, 0.12);
          border-color: rgba(0, 210, 255, 0.35);
          color: #FFFFFF;
          transform: translateX(4px);
        }

        .mobile-subitem-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
          min-width: 0;
        }

        .mobile-subitem-tag {
          font-size: 9.5px;
          font-weight: 800;
          color: #00D2FF;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .mobile-subitem-info strong {
          font-size: 13.5px;
          color: #FFFFFF;
          font-weight: 700;
        }

        .mobile-subitem-info p {
          margin: 0;
          font-size: 11px;
          color: #94A3B8;
          line-height: 1.35;
          text-align: left;
        }

        .mobile-subitem-link.simple strong {
          font-size: 14px;
          color: #FFFFFF;
          font-weight: 600;
        }

        .mobile-subitem-desc {
          display: block;
          font-size: 11.5px;
          margin-top: 2px;
        }

        .mobile-subitem-arrow {
          color: #00D2FF;
          font-size: 14px;
          font-weight: 700;
          flex-shrink: 0;
        }

        .mobile-subitem-all-link {
          display: block;
          text-align: center;
          padding: 10px;
          color: #00D2FF;
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
          background: rgba(0, 70, 252, 0.18);
          border: 1px solid rgba(0, 210, 255, 0.3);
          border-radius: 6px;
          margin-top: 4px;
          transition: all 0.18s ease;
        }

        .mobile-subitem-all-link:hover {
          background: #0046FC;
          color: #FFFFFF;
        }

        .mobile-drawer-group.direct {
          background: transparent;
          border: 0;
        }

        .mobile-drawer-direct-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 13px 16px;
          background: linear-gradient(135deg, #0046FC 0%, #002DB3 100%);
          border: 1px solid rgba(0, 210, 255, 0.35);
          border-radius: 8px;
          color: #FFFFFF;
          text-decoration: none;
          font-size: 15px;
          font-weight: 700;
          transition: all 0.2s ease;
          box-shadow: 0 4px 14px rgba(0, 70, 252, 0.35);
        }

        .mobile-drawer-direct-link:hover {
          background: #0036CC;
          box-shadow: 0 6px 20px rgba(0, 70, 252, 0.5), 0 0 16px rgba(0, 210, 255, 0.3);
          transform: translateY(-1px);
        }

        .mobile-drawer-secondary-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          background: #0D1524;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          color: #D5DBE7;
          text-decoration: none;
          font-size: 14.5px;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .mobile-drawer-secondary-link:hover {
          background: rgba(0, 70, 252, 0.15);
          border-color: rgba(0, 210, 255, 0.3);
          color: #00D2FF;
          transform: translateX(3px);
        }
      `}</style>

      <nav className="publication-navbar">
        <div className="publication-navbar-container">
          {/* =========================================================
             MOBILE & TABLET VIEWPORT BAR (HAMBURGER BUTTON ONLY, NO TEXT)
             ========================================================= */}
          <div className="publication-mobile-navbar-bar">
            <button
              type="button"
              className={`mobile-hamburger-btn ${mobileMenuOpen ? "is-open" : ""}`}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
            >
              <div className="mobile-hamburger-box">
                <span className="mobile-hamburger-line line-top" />
                <span className="mobile-hamburger-line line-mid" />
                <span className="mobile-hamburger-line line-bot" />
              </div>
            </button>

            <div className="mobile-quick-pills">
              <Link
                to="/solutions"
                className="mobile-quick-pill highlight"
                onClick={() => setMobileMenuOpen(false)}
              >
                Solutions
              </Link>
              <Link
                to="/case-studies"
                className="mobile-quick-pill"
                onClick={() => setMobileMenuOpen(false)}
              >
                Case Studies
              </Link>
              <Link
                to="/resources"
                className="mobile-quick-pill"
                onClick={() => setMobileMenuOpen(false)}
              >
                Resources
              </Link>
            </div>
          </div>

          {/* =========================================================
             DESKTOP / LAPTOP HORIZONTAL DROPDOWN LINKS (> 1024px)
             ========================================================= */}
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
                          View All
                        </Link>
                      </div>

                      <div className="solutions-cards-grid">
                        {solutions.map((sol) => (
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
                              <span className="solution-dropdown-card-arrow">Explore Solution</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="publication-vertical-dropdown">
                      {group.key === "newsletters" && newsletters.length > 0 ? (
                        newsletters.map((nl) => (
                          <Link
                            key={nl._id}
                            to={`/article/better-pipeline-starts-with-better-decisions?newsletter=${nl.slug}`}
                            className="publication-dropdown-link"
                            onClick={() => setActiveMenu(null)}
                          >
                            <span className="publication-dropdown-label">{nl.title}</span>
                            <span className="publication-dropdown-arrow" aria-hidden="true">
                              ▸
                            </span>
                          </Link>
                        ))
                      ) : (
                        group.items.map((subItem) => (
                          <Link
                            key={subItem.label}
                            to={subItem.path}
                            className="publication-dropdown-link"
                            onClick={() => setActiveMenu(null)}
                          >
                            <div style={{ display: "flex", flexDirection: "column", gap: "2px", flex: 1 }}>
                              <span className="publication-dropdown-label" style={{ fontWeight: 700 }}>{subItem.label}</span>
                              {subItem.desc && (
                                <span style={{ fontSize: "11px", color: subItem.color || "#94A3B8", fontWeight: 500 }}>
                                  {subItem.desc}
                                </span>
                              )}
                            </div>
                            <span className="publication-dropdown-arrow" aria-hidden="true">
                              ▸
                            </span>
                          </Link>
                        ))
                      )}
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

        {/* =========================================================
           MOBILE & TABLET DRAWER OVERLAY (TRIGGERED BY HAMBURGER BUTTON)
           CONTAINS ALL NAVBAR OPTIONS
           ========================================================= */}
        {mobileMenuOpen && (
          <>
            <div
              className="publication-mobile-menu-backdrop"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />
            <div
              className="publication-mobile-menu-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation Menu"
            >
              <div className="mobile-drawer-header">
                <span className="mobile-drawer-eyebrow">EXPLORE GETprospeKt</span>
                <button
                  type="button"
                  className="mobile-drawer-close"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                >
                  ✕
                </button>
              </div>

              <div className="mobile-drawer-sections">
                {/* 1. ALL CORE NAVBAR GROUPS (SOLUTIONS, MEDIA BRANDS, RESEARCH, RESOURCES, NEWSLETTERS) */}
                {navGroups.map((group) => {
                  const isExpanded = mobileActiveAccordion === group.key;

                  return (
                    <div key={group.key} className="mobile-drawer-group">
                      <button
                        type="button"
                        className={`mobile-drawer-group-btn ${isExpanded ? "is-expanded" : ""}`}
                        onClick={() =>
                          setMobileActiveAccordion(isExpanded ? null : group.key)
                        }
                      >
                        <span className="mobile-group-title">{group.label}</span>
                        <span className={`mobile-group-arrow ${isExpanded ? "open" : ""}`}>
                          ▾
                        </span>
                      </button>

                      {isExpanded && (
                        <div className="mobile-drawer-subitems">
                          {group.key === "solutions" ? (
                            <>
                              {solutions.map((sol) => (
                                <Link
                                  key={sol.id}
                                  to={sol.path}
                                  className="mobile-subitem-link"
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  <div className="mobile-subitem-info">
                                    <span className="mobile-subitem-tag">{sol.tag}</span>
                                    <strong>{sol.title}</strong>
                                    <p>{sol.description}</p>
                                  </div>
                                  <span className="mobile-subitem-arrow">→</span>
                                </Link>
                              ))}
                              <Link
                                to="/solutions"
                                className="mobile-subitem-all-link"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                View All Solutions →
                              </Link>
                            </>
                          ) : group.key === "newsletters" && newsletters.length > 0 ? (
                            newsletters.map((nl) => (
                              <Link
                                key={nl._id}
                                to={`/article/better-pipeline-starts-with-better-decisions?newsletter=${nl.slug}`}
                                className="mobile-subitem-link simple"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                <strong>{nl.title}</strong>
                                <span className="mobile-subitem-arrow">→</span>
                              </Link>
                            ))
                          ) : (
                            group.items.map((subItem) => (
                              <Link
                                key={subItem.label}
                                to={subItem.path}
                                className="mobile-subitem-link simple"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                <div>
                                  <strong>{subItem.label}</strong>
                                  {subItem.desc && (
                                    <span className="mobile-subitem-desc" style={{ color: subItem.color || "#94a3b8" }}>
                                      {subItem.desc}
                                    </span>
                                  )}
                                </div>
                                <span className="mobile-subitem-arrow">→</span>
                              </Link>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* 2. LEARNING CENTER & FAQ */}
                <div className="mobile-drawer-group direct">
                  <Link
                    to="/faq"
                    className="mobile-drawer-secondary-link"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>Learning Center &amp; FAQ</span>
                    <span style={{ color: "#00D2FF" }}>→</span>
                  </Link>
                </div>

                {/* 3. EVENTS & WEBINARS */}
                <div className="mobile-drawer-group direct">
                  <Link
                    to="/events"
                    className="mobile-drawer-secondary-link"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>Events &amp; Webinars</span>
                    <span style={{ color: "#00D2FF" }}>→</span>
                  </Link>
                </div>

                {/* 4. CONTACT US */}
                <div className="mobile-drawer-group direct">
                  <Link
                    to="/contact"
                    className="mobile-drawer-direct-link"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>Contact Us</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </nav>
    </>
  );
}

export default Navbar;

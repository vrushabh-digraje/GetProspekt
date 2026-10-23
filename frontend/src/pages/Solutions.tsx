import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { solutionsStorageApi, initialSolutionsList, type SolutionData } from "../services/api";

export type SolutionItem = SolutionData;
export const solutionsData = initialSolutionsList;

// =========================================
// PROFESSIONAL VECTOR SVG ICONS
// =========================================
const SearchIcon: React.FC<{ size?: number; className?: string }> = ({ size = 13, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={{ verticalAlign: "middle" }}
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const EyeIcon: React.FC<{ size?: number; className?: string }> = ({ size = 13, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={{ verticalAlign: "middle" }}
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const PipelineIcon: React.FC<{ size?: number; className?: string }> = ({ size = 14, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={{ verticalAlign: "middle" }}
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const ShieldCheckIcon: React.FC<{ size?: number; color?: string; className?: string }> = ({
  size = 16,
  color = "currentColor",
  className,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={{ verticalAlign: "middle" }}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);

const UsersIcon: React.FC<{ size?: number; className?: string }> = ({ size = 14, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={{ verticalAlign: "middle" }}
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const UserCheckIcon: React.FC<{ size?: number; color?: string; className?: string }> = ({
  size = 15,
  color = "currentColor",
  className,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={{ verticalAlign: "middle" }}
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <polyline points="17 11 19 13 23 9" />
  </svg>
);

const CloseIcon: React.FC<{ size?: number; className?: string }> = ({ size = 15, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={{ verticalAlign: "middle" }}
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ZoomInIcon: React.FC<{ size?: number; className?: string }> = ({ size = 13, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={{ verticalAlign: "middle" }}
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
    <line x1="11" y1="8" x2="11" y2="14" />
    <line x1="8" y1="11" x2="14" y2="11" />
  </svg>
);

const ZoomOutIcon: React.FC<{ size?: number; className?: string }> = ({ size = 13, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={{ verticalAlign: "middle" }}
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
    <line x1="8" y1="11" x2="14" y2="11" />
  </svg>
);

const CrmSyncIcon: React.FC<{ size?: number; color?: string; className?: string }> = ({
  size = 11,
  color = "currentColor",
  className,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={{ verticalAlign: "middle" }}
  >
    <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
  </svg>
);


interface SolutionDetailMeta {
  funnelStage: string;
  stageNumber: string;
  funnelDescription: string;
  qualificationProcess: string[];
  slaGuarantee: string;
  crmDeliveryFormats: string[];
  targetPersonas: string[];
}

const solutionMetaMap: Record<string, SolutionDetailMeta> = {
  "human-verified-data": {
    funnelStage: "Top-of-Funnel (ToFU) • Data Intelligence",
    stageNumber: "Stage 01",
    funnelDescription:
      "Provides an exhaustive, verified foundation of decision-makers matching your exact enterprise ICP. Eliminates duplicate, stale, and inaccurate contact data before sales outreach begins.",
    qualificationProcess: [
      "Target account list (TAL) & TAM addressable mapping",
      "Human-agent phone verification for active employment",
      "Direct-dial extension and corporate email SMTP handshake testing",
      "Seniority tier, department hierarchy, and reporting structure audit",
    ],
    slaGuarantee:
      "100% replacement guarantee within 14 business days on any email hard bounce or disconnected phone number.",
    crmDeliveryFormats: ["Salesforce CRM", "HubSpot", "Marketo", "CSV / XLSX", "REST Webhook"],
    targetPersonas: [
      "C-Suite (CEO, CTO, CIO, CMO, CRO)",
      "VP & SVP Level Executives",
      "Directors & Heads of Department",
      "Global Enterprise Buying Committees",
    ],
  },
  "mql-generation": {
    funnelStage: "Middle-of-Funnel (MoFU) • Demand Generation",
    stageNumber: "Stage 02",
    funnelDescription:
      "Generates high-engagement marketing-qualified leads through targeted content syndication (whitepapers, eBooks, solution briefs). Prospects willingly opt-in and meet all firmographic thresholds.",
    qualificationProcess: [
      "Rigid ICP filtering: Company revenue, employee headcount, industry, geography",
      "Content syndication opt-in through trusted editorial publication networks",
      "Full contact details capture with work email verification and phone checks",
      "Marketing engagement scoring based on content consumption and asset topic",
    ],
    slaGuarantee:
      "Zero personal emails (Gmail/Yahoo rejected). 100% ICP compliant with timestamped opt-in proof.",
    crmDeliveryFormats: ["HubSpot Marketing Hub", "Marketo Engage", "Pardot", "CSV / XLSX", "Direct API"],
    targetPersonas: [
      "Demand Generation Directors",
      "Enterprise Growth Marketers",
      "Digital Transformation Leads",
      "Security & IT Evaluators",
    ],
  },
  "sql-generation": {
    funnelStage: "Bottom-of-Funnel (BoFU) • Pipeline Velocity",
    stageNumber: "Stage 03",
    funnelDescription:
      "Delivers sales-ready leads that have demonstrated immediate business pain, verified buying authority, and willingness to evaluate enterprise solutions with your sales executives.",
    qualificationProcess: [
      "Direct analyst telephone discovery with verified decision-makers",
      "Confirmation of active project timeline (3 to 12 months)",
      "Buying committee authority mapping and current tech stack pain points",
      "Pre-qualified intent to discuss solution capabilities with your representatives",
    ],
    slaGuarantee:
      "Replacement guarantee if prospect denies having an active evaluation or does not hold agreed decision-making influence.",
    crmDeliveryFormats: ["Salesforce Sales Cloud", "HubSpot Sales", "Outreach.io", "Salesloft", "Encrypted CSV"],
    targetPersonas: [
      "Chief Information Officers (CIO)",
      "Chief Information Security Officers (CISO)",
      "VP Enterprise Architecture",
      "Procurement & IT Directors",
    ],
  },
  "bant-qualified-leads": {
    funnelStage: "Bottom-of-Funnel (BoFU) • Strict Purchase Intent",
    stageNumber: "Stage 04",
    funnelDescription:
      "Rigorous enterprise qualification holding prospects to strict Budget, Authority, Need, and Timing standards. Built for sales teams with high ACV solutions where time-to-close is critical.",
    qualificationProcess: [
      "Budget: Dedicated or allocated CAPEX/OPEX budget confirmed",
      "Authority: Direct economic buyer or key buying committee stakeholder",
      "Need: Explicitly documented operational pain point and project requirement",
      "Timing: Definite purchase and vendor selection milestone within 3–12 months",
    ],
    slaGuarantee:
      "Full replacement on any lead failing to meet all 4 BANT criteria during sales discovery.",
    crmDeliveryFormats: ["Salesforce Enterprise", "HubSpot CRM", "Custom Pipeline Webhook", "Secure CSV"],
    targetPersonas: [
      "Economic Buyers & Budget Owners",
      "C-Suite & Managing Directors",
      "VP Infrastructure & Operations",
      "Enterprise IT Steering Committees",
    ],
  },
  "appointment-generation": {
    funnelStage: "Pipeline Conversion • Confirmed Discovery Meetings",
    stageNumber: "Stage 05",
    funnelDescription:
      "Takes all qualification burden off your account executives. Confirmed, high-intent discovery calls booked directly onto your sales reps' Google or Microsoft Outlook calendars.",
    qualificationProcess: [
      "Prospect ICP qualification and warm phone/email introduction",
      "Direct synchronization with your sales team's calendar availability",
      "Calendar invite accepted with full company and requirement briefing",
      "Automated SMS/email reminder sequence to ensure maximum show-up rates",
    ],
    slaGuarantee:
      "Guaranteed free rescheduling or lead replacement for any prospect no-show.",
    crmDeliveryFormats: [
      "Google Calendar / MS Outlook 365",
      "Chili Piper / Calendly Integration",
      "Salesforce Calendar",
      "HubSpot Meetings",
    ],
    targetPersonas: [
      "VP Enterprise Sales",
      "Account Executives (AEs)",
      "Strategic Deal Directors",
      "Enterprise Business Development Teams",
    ],
  },
  "webinar-campaigns": {
    funnelStage: "Engagement & Education • Virtual Audience Conversion",
    stageNumber: "Stage 06",
    funnelDescription:
      "Drives verified enterprise registrations and high live-attendance rates for your virtual summits, product launches, and digital roundtables across your agreed target market.",
    qualificationProcess: [
      "Omnichannel promotional push across editorial publications and email networks",
      "Strict registrant qualification to prevent competitor or non-ICP attendees",
      "Multi-touch registration confirmation and calendar placeholder invites",
      "Post-session engagement reporting with live poll and Q&A analytics",
    ],
    slaGuarantee:
      "Target attendee volume guarantee; non-qualifying registrants filtered out before reporting.",
    crmDeliveryFormats: ["Zoom Webinars", "ON24", "GoToWebinar", "HubSpot", "Marketo", "CSV Export"],
    targetPersonas: [
      "Event Marketing Directors",
      "Product Marketing Leaders",
      "Field Marketing Teams",
      "Executive Roundtable Hosts",
    ],
  },
};

const Solutions: React.FC = () => {
  const [solutions, setSolutions] = useState<SolutionItem[]>(() => solutionsStorageApi.getAll());
  const [activeModalSolution, setActiveModalSolution] = useState<SolutionItem | null>(null);
  const [modalActiveTab, setModalActiveTab] = useState<"funnel" | "sla" | "personas">("funnel");
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const handleUpdate = () => {
      setSolutions(solutionsStorageApi.getAll());
    };
    window.addEventListener("gp_solutions_updated", handleUpdate);
    return () => window.removeEventListener("gp_solutions_updated", handleUpdate);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (activeModalSolution) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setActiveModalSolution(null);
          setIsZoomed(false);
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "auto";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "auto";
    }
  }, [activeModalSolution]);

  const openInspector = (solution: SolutionItem, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setActiveModalSolution(solution);
    setModalActiveTab("funnel");
    setIsZoomed(false);
  };

  const closeModal = () => {
    setActiveModalSolution(null);
    setIsZoomed(false);
  };

  const activeMeta = activeModalSolution ? solutionMetaMap[activeModalSolution.slug] : null;

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
          position: relative;
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

        /* COVER IMAGE WRAPPER (CLEAN & UNOBSTRUCTED) */
        .solution-card-image-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          height: auto;
          min-height: 200px;
          overflow: hidden;
          background: #FFFFFF;
          border-bottom: 1px solid rgba(203, 213, 225, 0.12);
          cursor: pointer;
        }

        .solution-card-image-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .solution-card:hover .solution-card-image-wrap img {
          transform: scale(1.04);
        }

        /* HOVER SHIMMER LIGHT REFLECTION */
        .solution-card-image-wrap::after {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 60%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.25),
            transparent
          );
          transform: skewX(-25deg);
          transition: left 0.75s ease-out;
          pointer-events: none;
        }

        .solution-card:hover .solution-card-image-wrap::after {
          left: 180%;
        }

        /* FLOATING INTERACTIVE QUICK-INSPECT PILL (APPEARS ON HOVER) */
        .solution-image-inspect-btn {
          position: absolute;
          bottom: 12px;
          right: 12px;
          background: rgba(0, 18, 40, 0.88);
          border: 1px solid rgba(0, 210, 255, 0.6);
          color: #FFFFFF;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 0.04em;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          backdrop-filter: blur(10px);
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.5), 0 0 16px rgba(0, 210, 255, 0.35);
          opacity: 0;
          transform: translateY(6px);
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 3;
          cursor: pointer;
        }

        .solution-card:hover .solution-image-inspect-btn {
          opacity: 1;
          transform: translateY(0);
        }

        .solution-image-inspect-btn:hover {
          background: linear-gradient(135deg, #0046FC, #00D2FF);
          border-color: #FFFFFF;
          color: #FFFFFF;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 210, 255, 0.6);
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

        /* DELIVERABLES LIST WITH VECTOR CHECKMARKS */
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
          content: "";
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 18px;
          height: 18px;
          min-width: 18px;
          min-height: 18px;
          border-radius: 5px;
          background: rgba(0, 212, 170, 0.12) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%2300D4AA' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'%3E%3C/polyline%3E%3C/svg%3E") no-repeat center center;
          border: 1px solid rgba(0, 212, 170, 0.35);
          flex-shrink: 0;
          margin-top: 1px;
          box-shadow: 0 0 6px rgba(0, 212, 170, 0.2);
          transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .solution-card-deliverables li:hover::before {
          transform: scale(1.15);
          background: linear-gradient(135deg, #00A884, #00D4AA) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%23FFFFFF' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'%3E%3C/polyline%3E%3C/svg%3E") no-repeat center center;
          border-color: #00D4AA;
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
          gap: 12px;
        }

        .solution-card-inspect-trigger {
          background: transparent;
          border: none;
          color: #94A3B8;
          font-size: 12.5px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 9px;
          border-radius: 5px;
          transition: all 0.2s ease;
        }

        .solution-card-inspect-trigger:hover {
          color: #00D2FF;
          background: rgba(0, 210, 255, 0.08);
        }

        .solution-card-link-text {
          font-size: 13.5px;
          font-weight: 700;
          color: #00D2FF;
          display: inline-flex;
          align-items: center;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .solution-card-link-text:hover {
          color: #38BDF8;
          text-decoration: underline;
        }

        /* =========================================
           INTERACTIVE LIGHTBOX INSPECTOR MODAL
        ========================================= */
        .solution-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(3, 7, 18, 0.88);
          backdrop-filter: blur(12px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          animation: modalFadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .solution-modal-container {
          background: #0B1321;
          border: 1px solid rgba(0, 210, 255, 0.35);
          border-radius: 16px;
          width: min(1040px, 100%);
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(0, 210, 255, 0.2);
          position: relative;
          display: flex;
          flex-direction: column;
          animation: modalScaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes modalScaleUp {
          from {
            opacity: 0;
            transform: scale(0.96) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        /* MODAL HEADER */
        .solution-modal-header {
          padding: 20px 24px;
          border-bottom: 1px solid rgba(203, 213, 225, 0.12);
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          background: rgba(13, 22, 38, 0.6);
        }

        .solution-modal-header-meta {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .solution-modal-badge-row {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .solution-modal-stage-pill {
          background: rgba(0, 212, 170, 0.12);
          border: 1px solid rgba(0, 212, 170, 0.35);
          color: #00D4AA;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 12px;
        }

        .solution-modal-category-pill {
          background: rgba(56, 189, 248, 0.12);
          border: 1px solid rgba(56, 189, 248, 0.3);
          color: #38BDF8;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 12px;
        }

        .solution-modal-title {
          font-size: 26px;
          font-weight: 800;
          color: #FFFFFF;
          margin: 6px 0 2px;
        }

        .solution-modal-subtitle {
          font-size: 13.5px;
          color: #94A3B8;
          margin: 0;
        }

        .solution-modal-close-btn {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #CBD5E1;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .solution-modal-close-btn:hover {
          background: rgba(239, 68, 68, 0.2);
          border-color: #EF4444;
          color: #FFFFFF;
          transform: rotate(90deg);
        }

        /* MODAL BODY */
        .solution-modal-body {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        /* MODAL GRAPHIC BANNER VIEW */
        .solution-modal-graphic-wrapper {
          position: relative;
          background: #FFFFFF;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(203, 213, 225, 0.2);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
        }

        .solution-modal-graphic-img {
          width: 100%;
          height: auto;
          display: block;
          max-height: 420px;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .solution-modal-graphic-img.zoomed {
          max-height: none;
          transform: scale(1.02);
        }

        .solution-modal-zoom-toggle {
          position: absolute;
          bottom: 12px;
          right: 12px;
          background: rgba(6, 11, 18, 0.85);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.25);
          color: #FFFFFF;
          font-size: 11.5px;
          font-weight: 700;
          padding: 6px 12px;
          border-radius: 18px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .solution-modal-zoom-toggle:hover {
          background: #00D2FF;
          color: #030712;
          border-color: #00D2FF;
        }

        /* MODAL TAB CONTROLS */
        .solution-modal-tabs {
          display: flex;
          align-items: center;
          gap: 8px;
          border-bottom: 1px solid rgba(203, 213, 225, 0.1);
          padding-bottom: 10px;
        }

        .solution-modal-tab-btn {
          background: transparent;
          border: none;
          color: #94A3B8;
          font-size: 13.5px;
          font-weight: 700;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .solution-modal-tab-btn:hover {
          color: #FFFFFF;
          background: rgba(255, 255, 255, 0.05);
        }

        .solution-modal-tab-btn.active {
          color: #00D2FF;
          background: rgba(0, 210, 255, 0.1);
          border-bottom: 2px solid #00D2FF;
        }

        /* TAB PANELS */
        .solution-modal-panel {
          font-size: 14px;
          line-height: 1.6;
          color: #CBD5E1;
        }

        /* FUNNEL PROGRESSION STEP TRACKER */
        .solution-modal-funnel-tracker {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-top: 16px;
        }

        .solution-funnel-step {
          background: rgba(13, 21, 34, 0.6);
          border: 1px solid rgba(203, 213, 225, 0.1);
          border-radius: 8px;
          padding: 12px 14px;
          position: relative;
        }

        .solution-funnel-step.active {
          border-color: #00D2FF;
          background: rgba(0, 210, 255, 0.08);
          box-shadow: 0 0 16px rgba(0, 210, 255, 0.15);
        }

        .solution-funnel-step-num {
          font-size: 10px;
          font-weight: 800;
          color: #64748B;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 4px;
        }

        .solution-funnel-step.active .solution-funnel-step-num {
          color: #00D2FF;
        }

        .solution-funnel-step-title {
          font-size: 13px;
          font-weight: 700;
          color: #FFFFFF;
          margin-bottom: 2px;
        }

        .solution-funnel-step-desc {
          font-size: 11.5px;
          color: #94A3B8;
          line-height: 1.4;
        }

        /* QUALIFICATION LIST */
        .solution-modal-checklist {
          list-style: none;
          padding: 0;
          margin: 12px 0 18px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .solution-modal-checklist li {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          background: rgba(13, 21, 34, 0.5);
          border: 1px solid rgba(203, 213, 225, 0.08);
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 13px;
          color: #E2E8F0;
        }

        .solution-modal-checklist li::before {
          content: "";
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          min-width: 20px;
          min-height: 20px;
          border-radius: 6px;
          background: rgba(0, 212, 170, 0.15) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='11' viewBox='0 0 24 24' fill='none' stroke='%2300D4AA' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'%3E%3C/polyline%3E%3C/svg%3E") no-repeat center center;
          border: 1px solid rgba(0, 212, 170, 0.4);
          flex-shrink: 0;
          margin-top: 1px;
        }

        /* SLA SHIELD BOX */
        .solution-modal-sla-box {
          background: linear-gradient(135deg, rgba(50, 100, 49, 0.25) 0%, rgba(16, 185, 129, 0.15) 100%);
          border: 1px solid rgba(16, 185, 129, 0.4);
          border-radius: 10px;
          padding: 14px 18px;
          display: flex;
          align-items: flex-start;
          gap: 14px;
          margin-top: 12px;
        }

        .solution-modal-sla-icon {
          flex-shrink: 0;
          margin-top: 2px;
        }

        .solution-modal-sla-title {
          font-size: 13.5px;
          font-weight: 800;
          color: #34D399;
          margin-bottom: 2px;
        }

        .solution-modal-sla-text {
          font-size: 12.5px;
          color: #E2E8F0;
          margin: 0;
          line-height: 1.5;
        }

        /* PERSONA GRID */
        .solution-modal-persona-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-top: 14px;
        }

        .solution-persona-card {
          background: rgba(13, 21, 34, 0.5);
          border: 1px solid rgba(203, 213, 225, 0.08);
          border-radius: 8px;
          padding: 12px 14px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .solution-persona-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(56, 189, 248, 0.15);
          border: 1px solid rgba(56, 189, 248, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .solution-persona-title {
          font-size: 13px;
          font-weight: 700;
          color: #FFFFFF;
        }

        /* CRM FORMAT PILLS */
        .solution-modal-crm-row {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 12px;
        }

        .solution-crm-pill {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(203, 213, 225, 0.15);
          color: #CBD5E1;
          font-size: 12px;
          font-weight: 600;
          padding: 6px 12px;
          border-radius: 6px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        /* MODAL FOOTER */
        .solution-modal-footer {
          padding: 18px 24px;
          border-top: 1px solid rgba(203, 213, 225, 0.12);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          background: rgba(13, 22, 38, 0.8);
          border-radius: 0 0 16px 16px;
          flex-wrap: wrap;
        }

        .solution-modal-primary-btn {
          background: linear-gradient(135deg, #0046FC 0%, #00D2FF 100%);
          color: #FFFFFF;
          font-size: 13.5px;
          font-weight: 700;
          padding: 10px 22px;
          border-radius: 24px;
          text-decoration: none;
          box-shadow: 0 4px 16px rgba(0, 70, 252, 0.4);
          transition: all 0.25s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .solution-modal-primary-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 210, 255, 0.55);
        }

        .solution-modal-article-link {
          color: #00D2FF;
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          transition: color 0.2s ease;
        }

        .solution-modal-article-link:hover {
          color: #38BDF8;
          text-decoration: underline;
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
          .solution-modal-funnel-tracker {
            grid-template-columns: repeat(2, 1fr);
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

          .solution-modal-persona-grid {
            grid-template-columns: 1fr;
          }

          .solution-modal-funnel-tracker {
            grid-template-columns: 1fr;
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
                {/* INTERACTIVE COVER IMAGE WRAPPER (CLEAN & UNOBSTRUCTED) */}
                <div
                  className="solution-card-image-wrap"
                  onClick={(e) => openInspector(sol, e)}
                  title={`Click to inspect ${sol.title} specifications`}
                >
                  <img src={sol.image} alt={sol.title} loading="lazy" />

                  <button
                    type="button"
                    className="solution-image-inspect-btn"
                    onClick={(e) => openInspector(sol, e)}
                  >
                    <SearchIcon size={12} />
                    <span>Inspect Blueprint</span>
                  </button>
                </div>

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
                      <li key={idx} title="Verified deliverable">
                        {d}
                      </li>
                    ))}
                  </ul>

                  <div className="solution-card-action">
                    <button
                      type="button"
                      className="solution-card-inspect-trigger"
                      onClick={(e) => openInspector(sol, e)}
                    >
                      <EyeIcon size={13} />
                      <span>Quick Preview</span>
                    </button>
                    <Link to={sol.path} className="solution-card-link-text">
                      <span>Explore Solution</span>
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
              <span>Talk to a Specialist</span>
            </Link>
          </section>
        </div>
      </main>

      {/* =========================================
          INTERACTIVE SOLUTION INSPECTOR LIGHTBOX MODAL
      ========================================= */}
      {activeModalSolution && activeMeta && (
        <div className="solution-modal-backdrop" onClick={closeModal}>
          <div
            className="solution-modal-container"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-solution-title"
          >
            {/* MODAL HEADER */}
            <div className="solution-modal-header">
              <div className="solution-modal-header-meta">
                <div className="solution-modal-badge-row">
                  <span className="solution-modal-stage-pill">{activeMeta.stageNumber}</span>
                  <span className="solution-modal-category-pill">{activeModalSolution.category}</span>
                  <span style={{ fontSize: "11px", color: "#64748B" }}>
                    {activeMeta.funnelStage}
                  </span>
                </div>
                <h2 id="modal-solution-title" className="solution-modal-title">
                  {activeModalSolution.title}
                </h2>
                <p className="solution-modal-subtitle">{activeModalSolution.subtitle}</p>
              </div>

              <button
                type="button"
                className="solution-modal-close-btn"
                onClick={closeModal}
                aria-label="Close interactive inspector"
              >
                <CloseIcon size={16} />
              </button>
            </div>

            {/* MODAL BODY */}
            <div className="solution-modal-body">
              {/* HIGH RESOLUTION EDITORIAL GRAPHIC */}
              <div className="solution-modal-graphic-wrapper">
                <img
                  src={activeModalSolution.image}
                  alt={activeModalSolution.title}
                  className={`solution-modal-graphic-img ${isZoomed ? "zoomed" : ""}`}
                />
                <button
                  type="button"
                  className="solution-modal-zoom-toggle"
                  onClick={() => setIsZoomed(!isZoomed)}
                >
                  {isZoomed ? <ZoomOutIcon size={12} /> : <ZoomInIcon size={12} />}
                  <span>{isZoomed ? "Zoom Out" : "Full Size"}</span>
                </button>
              </div>

              {/* INTERACTIVE TABS */}
              <div className="solution-modal-tabs">
                <button
                  type="button"
                  className={`solution-modal-tab-btn ${modalActiveTab === "funnel" ? "active" : ""}`}
                  onClick={() => setModalActiveTab("funnel")}
                >
                  <PipelineIcon size={14} />
                  <span>Funnel Flow & Mechanics</span>
                </button>
                <button
                  type="button"
                  className={`solution-modal-tab-btn ${modalActiveTab === "sla" ? "active" : ""}`}
                  onClick={() => setModalActiveTab("sla")}
                >
                  <ShieldCheckIcon size={14} />
                  <span>Qualification & SLA Guarantees</span>
                </button>
                <button
                  type="button"
                  className={`solution-modal-tab-btn ${modalActiveTab === "personas" ? "active" : ""}`}
                  onClick={() => setModalActiveTab("personas")}
                >
                  <UsersIcon size={14} />
                  <span>Target Buying Personas & CRM</span>
                </button>
              </div>

              {/* TAB 1: FUNNEL FLOW */}
              {modalActiveTab === "funnel" && (
                <div className="solution-modal-panel">
                  <p style={{ margin: "0 0 12px", color: "#CBD5E1", fontSize: "14px" }}>
                    {activeMeta.funnelDescription}
                  </p>

                  <div className="solution-modal-funnel-tracker">
                    <div className="solution-funnel-step">
                      <div className="solution-funnel-step-num">Step 01</div>
                      <div className="solution-funnel-step-title">TAM Mapping</div>
                      <div className="solution-funnel-step-desc">
                        Identifies decision-makers in your target account list
                      </div>
                    </div>
                    <div className="solution-funnel-step">
                      <div className="solution-funnel-step-num">Step 02</div>
                      <div className="solution-funnel-step-title">ICP Filtering</div>
                      <div className="solution-funnel-step-desc">
                        Firmographic validation against agreed enterprise criteria
                      </div>
                    </div>
                    <div className="solution-funnel-step active">
                      <div className="solution-funnel-step-num">Step 03 • Active</div>
                      <div className="solution-funnel-step-title">
                        {activeModalSolution.title}
                      </div>
                      <div className="solution-funnel-step-desc">
                        Rigorous lead qualification and intent verification
                      </div>
                    </div>
                    <div className="solution-funnel-step">
                      <div className="solution-funnel-step-num">Step 04</div>
                      <div className="solution-funnel-step-title">CRM Direct Handoff</div>
                      <div className="solution-funnel-step-desc">
                        Enriched delivery directly into your sales cadences
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: QUALIFICATION & SLA */}
              {modalActiveTab === "sla" && (
                <div className="solution-modal-panel">
                  <strong style={{ color: "#FFFFFF", fontSize: "14px" }}>
                    Multi-Stage Verification Checklist:
                  </strong>
                  <ul className="solution-modal-checklist">
                    {activeMeta.qualificationProcess.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ul>

                  <div className="solution-modal-sla-box">
                    <span className="solution-modal-sla-icon">
                      <ShieldCheckIcon size={24} color="#34D399" />
                    </span>
                    <div>
                      <div className="solution-modal-sla-title">Guaranteed Quality SLA</div>
                      <p className="solution-modal-sla-text">{activeMeta.slaGuarantee}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: TARGET PERSONAS & CRM */}
              {modalActiveTab === "personas" && (
                <div className="solution-modal-panel">
                  <strong style={{ color: "#FFFFFF", fontSize: "14px" }}>
                    Decision-Maker Personas Targeted:
                  </strong>
                  <div className="solution-modal-persona-grid">
                    {activeMeta.targetPersonas.map((persona, idx) => (
                      <div key={idx} className="solution-persona-card">
                        <span className="solution-persona-icon">
                          <UserCheckIcon size={15} color="#38BDF8" />
                        </span>
                        <span className="solution-persona-title">{persona}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: "18px" }}>
                    <strong style={{ color: "#FFFFFF", fontSize: "13px" }}>
                      Compatible Delivery Formats & CRM Integrations:
                    </strong>
                    <div className="solution-modal-crm-row">
                      {activeMeta.crmDeliveryFormats.map((crm, idx) => (
                        <span key={idx} className="solution-crm-pill">
                          <CrmSyncIcon size={12} color="#38BDF8" /> {crm}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* MODAL FOOTER */}
            <div className="solution-modal-footer">
              <Link
                to={activeModalSolution.path}
                className="solution-modal-article-link"
                onClick={closeModal}
              >
                <span>Read Full Solution Editorial Article</span>
              </Link>
              <Link
                to={`/contact?solution=${encodeURIComponent(activeModalSolution.slug)}`}
                className="solution-modal-primary-btn"
                onClick={closeModal}
              >
                <span>Request Campaign Sample & Pricing</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Solutions;

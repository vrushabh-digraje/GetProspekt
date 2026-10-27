import React, { useState, useEffect } from "react";
import EditorialCoverImage from "../components/EditorialCoverImage";
import { useSearchParams, Link } from "react-router-dom";
import { resourcesApi, enquiriesApi, formConfigApi, type GatedFormConfig } from "../services/api";
import { downloadResourceAsset } from "../utils/pdfGenerator";

const countryOptions = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "Singapore",
  "India",
  "Netherlands",
  "France",
  "United Arab Emirates",
  "Ireland",
  "Switzerland",
  "Other",
];

const companySizeOptions = [
  "1 - 10 employees",
  "11 - 50 employees",
  "51 - 200 employees",
  "201 - 500 employees",
  "501 - 1,000 employees",
  "1,001 - 5,000 employees",
  "5,000+ employees",
];

const industryOptions = [
  "B2B Technology & Software",
  "Cloud & Data Infrastructure",
  "Cybersecurity & Risk Management",
  "Financial Services & FinTech",
  "Healthcare & Life Sciences",
  "Manufacturing & Industrial",
  "Telecommunications",
  "Professional & Consulting Services",
  "Retail & eCommerce",
  "Other",
];

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

  // Modal Gated Download State
  const [modalResource, setModalResource] = useState<any | null>(null);
  const [modalFormConfig, setModalFormConfig] = useState<GatedFormConfig>(() => formConfigApi.get());

  const [modalFirstName, setModalFirstName] = useState("");
  const [modalLastName, setModalLastName] = useState("");
  const [modalEmail, setModalEmail] = useState("");
  const [modalTelephone, setModalTelephone] = useState("");
  const [modalCountry, setModalCountry] = useState("United States");
  const [modalCompanyName, setModalCompanyName] = useState("");
  const [modalCompanySize, setModalCompanySize] = useState("51 - 200 employees");
  const [modalStateProvince, setModalStateProvince] = useState("");
  const [modalCity, setModalCity] = useState("");
  const [modalAddress, setModalAddress] = useState("");
  const [modalPostalCode, setModalPostalCode] = useState("");
  const [modalIndustry, setModalIndustry] = useState("B2B Technology & Software");
  const [modalJobTitle, setModalJobTitle] = useState("Director / Head of Department");
  const [modalOptInMarketing, setModalOptInMarketing] = useState(true);
  const [modalOptInPartner, setModalOptInPartner] = useState(true);
  const [modalCustomValues] = useState<Record<string, any>>({});
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [modalSubmitted, setModalSubmitted] = useState(false);
  const [modalError, setModalError] = useState("");

  const openDownloadModal = (item: any) => {
    setModalResource(item);
    setModalFormConfig(formConfigApi.getForResource(item));
    setModalSubmitted(false);
    setModalError("");
  };

  const closeDownloadModal = () => {
    setModalResource(null);
  };

  const triggerAssetDownload = (item: any) => {
    downloadResourceAsset(
      {
        title: item.title,
        type: item.type,
        category: item.category,
        summary: item.summary,
        content: item.content,
        downloadContent: item.downloadContent || item.content,
        coverImage: item.coverImage,
        recipientName: `${modalFirstName} ${modalLastName}`.trim() || "Enterprise Executive",
        recipientCompany: modalCompanyName.trim() || "",
        recipientEmail: modalEmail.trim() || "",
      },
      item.fileUrl,
      item.downloadFileType,
      item.downloadFileName
    );
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError("");

    if (!modalResource) return;

    const fields = modalFormConfig.fields;
    const missing: string[] = [];
    const isFrench = modalResource.language === "fr" || /Analyse approfondie|comment Veeam/i.test(modalResource.title || "");

    if (fields.firstName?.enabled && fields.firstName?.required && !modalFirstName.trim()) {
      missing.push(fields.firstName.label || (isFrench ? "Prénom" : "First Name"));
    }
    if (fields.lastName?.enabled && fields.lastName?.required && !modalLastName.trim()) {
      missing.push(fields.lastName.label || (isFrench ? "Nom de famille" : "Last Name"));
    }
    if (fields.email?.enabled && fields.email?.required && !modalEmail.trim()) {
      missing.push(fields.email.label || (isFrench ? "E-mail" : "Corporate Email"));
    }
    if (fields.telephone?.enabled && fields.telephone?.required && !modalTelephone.trim()) {
      missing.push(fields.telephone.label || (isFrench ? "Téléphone" : "Telephone"));
    }
    if (fields.companyName?.enabled && fields.companyName?.required && !modalCompanyName.trim()) {
      missing.push(fields.companyName.label || (isFrench ? "Nom de l'entreprise" : "Company Name"));
    }
    if (fields.jobTitle?.enabled && fields.jobTitle?.required && !modalJobTitle.trim()) {
      missing.push(fields.jobTitle.label || (isFrench ? "Titre d'emploi" : "Job Title"));
    }
    if (fields.industry?.enabled && fields.industry?.required && !modalIndustry.trim()) {
      missing.push(fields.industry.label || (isFrench ? "Industrie" : "Industry"));
    }
    if (fields.companySize?.enabled && fields.companySize?.required && !modalCompanySize.trim()) {
      missing.push(fields.companySize.label || (isFrench ? "Taille de l'entreprise" : "Company Size"));
    }
    if (fields.country?.enabled && fields.country?.required && !modalCountry.trim()) {
      missing.push(fields.country.label || (isFrench ? "Pays" : "Country"));
    }
    if (fields.state?.enabled && fields.state?.required && !modalStateProvince.trim()) {
      missing.push(fields.state.label || (isFrench ? "État" : "State / Province"));
    }
    if (fields.city?.enabled && fields.city?.required && !modalCity.trim()) {
      missing.push(fields.city.label || (isFrench ? "Ville" : "City"));
    }
    if (fields.address?.enabled && fields.address?.required && !modalAddress.trim()) {
      missing.push(fields.address.label || (isFrench ? "Adresse" : "Address"));
    }
    if (fields.postalCode?.enabled && fields.postalCode?.required && !modalPostalCode.trim()) {
      missing.push(fields.postalCode.label || (isFrench ? "Code Postal" : "Postal Code"));
    }
    if (fields.optInMarketing?.enabled && fields.optInMarketing?.required && !modalOptInMarketing) {
      missing.push(fields.optInMarketing.label || "Marketing Opt-in");
    }
    if (fields.optInPartner?.enabled && fields.optInPartner?.required && !modalOptInPartner) {
      missing.push(fields.optInPartner.label || "Partner Consent");
    }

    if (missing.length > 0) {
      setModalError(
        isFrench
          ? `Veuillez renseigner tous les champs obligatoires : ${missing.join(", ")}`
          : `Please fill in all required fields: ${missing.join(", ")}`
      );
      return;
    }

    setModalSubmitting(true);
    try {
      await enquiriesApi.submit({
        firstName: modalFirstName.trim(),
        lastName: modalLastName.trim(),
        email: modalEmail.trim(),
        telephone: modalTelephone.trim(),
        country: modalCountry,
        company: modalCompanyName.trim(),
        companySize: modalCompanySize,
        state: modalStateProvince.trim(),
        city: modalCity.trim(),
        address: modalAddress.trim(),
        postalCode: modalPostalCode.trim(),
        industry: modalIndustry,
        jobTitle: modalJobTitle,
        resourceId: modalResource._id,
        resourceTitle: modalResource.title || "Resource",
        assetTitle: modalResource.title || "Resource",
        assetType: modalResource.type || "Whitepaper",
        downloadFileType: modalResource.downloadFileType || "PDF",
        type: "download",
        optInMarketing: modalOptInMarketing,
        optInPartner: modalOptInPartner,
        customFields: modalCustomValues,
        subject: `Resource Download: ${modalResource.title || "Whitepaper"}`,
        message: `Lead downloaded ${modalResource.type || "Whitepaper"}: ${modalResource.title || "Resource"}. Format: ${modalResource.downloadFileType || "PDF"}. Company: ${modalCompanyName}, Size: ${modalCompanySize}, State: ${modalStateProvince}, Industry: ${modalIndustry}, Job Title: ${modalJobTitle}, Phone: ${modalTelephone}`,
      });

      if (modalResource._id) {
        const nextCount = (modalResource.downloadCount || 0) + 1;
        resourcesApi.update(modalResource._id, {
          downloadCount: nextCount,
        });
        setResources((prev) =>
          prev.map((r) => (r._id === modalResource._id ? { ...r, downloadCount: nextCount } : r))
        );
      }

      setModalSubmitted(true);
      setTimeout(() => {
        triggerAssetDownload(modalResource);
      }, 400);
    } catch (err: any) {
      setModalError(err.message || "Failed to submit. Please try again.");
    } finally {
      setModalSubmitting(false);
    }
  };

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

        .resource-card:hover .resource-card-btn {
          background: linear-gradient(135deg, #0046FC 0%, #00D2FF 100%);
          color: #FFFFFF;
          border-color: transparent;
          box-shadow: 0 4px 20px rgba(0, 70, 252, 0.5);
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
        /* ================= SPONSOR / PUBLISH RESEARCH STRIP ================= */
        .resource-sponsor-strip {
          margin-top: 60px;
          background: linear-gradient(135deg, rgba(13, 21, 34, 0.95) 0%, rgba(6, 11, 18, 0.98) 100%);
          border: 1px solid rgba(0, 210, 255, 0.35);
          border-radius: 12px;
          padding: 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 36px;
          box-shadow: 0 12px 40px rgba(0, 70, 252, 0.2), 0 0 30px rgba(0, 210, 255, 0.08);
          position: relative;
          overflow: hidden;
        }

        .resource-sponsor-strip::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #0046FC 0%, #00D2FF 50%, #34D399 100%);
        }

        .resource-sponsor-content {
          flex: 1;
          max-width: 780px;
        }

        .resource-sponsor-badge {
          display: inline-block;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #00D2FF;
          background: rgba(0, 210, 255, 0.1);
          border: 1px solid rgba(0, 210, 255, 0.3);
          padding: 5px 12px;
          border-radius: 4px;
          margin-bottom: 14px;
        }

        .resource-sponsor-title {
          font-size: 26px;
          font-weight: 800;
          color: #FFFFFF;
          line-height: 1.3;
          margin-bottom: 12px;
          letter-spacing: -0.01em;
        }

        .resource-sponsor-desc {
          font-size: 15px;
          line-height: 1.6;
          color: #AEB8CA;
          margin-bottom: 22px;
        }

        .resource-sponsor-metrics {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .resource-sponsor-metric-item {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(203, 213, 225, 0.08);
          border-radius: 8px;
          padding: 12px 14px;
        }

        .resource-sponsor-metric-item strong {
          display: block;
          font-size: 20px;
          font-weight: 800;
          color: #00D2FF;
          line-height: 1.1;
          margin-bottom: 4px;
        }

        .resource-sponsor-metric-item span {
          display: block;
          font-size: 11px;
          color: #94A3B8;
          line-height: 1.3;
          font-weight: 500;
        }

        .resource-sponsor-action {
          flex-shrink: 0;
        }

        .btn-resource-sponsor {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0046FC 0%, #00D2FF 100%);
          color: #FFFFFF;
          padding: 16px 32px;
          font-size: 15px;
          font-weight: 800;
          text-decoration: none;
          border-radius: 8px;
          box-shadow: 0 8px 24px rgba(0, 70, 252, 0.45);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          white-space: nowrap;
        }

        .btn-resource-sponsor:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(0, 210, 255, 0.55);
          color: #FFFFFF;
        }

        @media (max-width: 960px) {
          .resource-sponsor-strip {
            flex-direction: column;
            align-items: flex-start;
            padding: 30px 24px;
            gap: 24px;
          }

          .resource-sponsor-metrics {
            grid-template-columns: repeat(2, 1fr);
          }

          .resource-sponsor-action {
            width: 100%;
          }

          .btn-resource-sponsor {
            width: 100%;
          }
        }

        @media (max-width: 520px) {
          .resource-sponsor-title {
            font-size: 20px;
          }

          .resource-sponsor-metrics {
            grid-template-columns: 1fr;
          }
        }


        /* ================= GATED DOWNLOAD MODAL ================= */
        .res-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(6, 11, 18, 0.88);
          backdrop-filter: blur(8px);
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          overflow-y: auto;
        }

        .res-modal-card {
          width: min(720px, 100%);
          max-height: 92vh;
          overflow-y: auto;
          background: #0F172A;
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          padding: 28px 30px 32px;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 163, 196, 0.15);
          color: #D5DBE7;
          position: relative;
        }

        .res-modal-close-btn {
          position: absolute;
          top: 18px;
          right: 18px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #94A3B8;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .res-modal-close-btn:hover {
          background: rgba(239, 68, 68, 0.2);
          color: #EF4444;
          border-color: #EF4444;
        }

        .res-modal-header {
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding-right: 36px;
        }

        .res-modal-tag {
          display: inline-block;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #00D2FF;
          background: rgba(0, 210, 255, 0.1);
          border: 1px solid rgba(0, 210, 255, 0.3);
          padding: 4px 10px;
          border-radius: 4px;
          margin-bottom: 10px;
        }

        .res-modal-title {
          font-size: 20px;
          font-weight: 800;
          color: #FFFFFF;
          line-height: 1.35;
          margin: 0 0 6px;
        }

        .res-modal-subtitle {
          font-size: 13px;
          color: #94A3B8;
          margin: 0;
          line-height: 1.5;
        }

        .res-modal-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 12px;
        }

        .res-modal-col-full {
          grid-column: 1 / -1;
        }

        @media (max-width: 580px) {
          .res-modal-grid {
            grid-template-columns: 1fr;
            gap: 10px;
          }
          .res-modal-col-full {
            grid-column: 1;
          }
        }

        .res-modal-input-wrap {
          position: relative;
          width: 100%;
        }

        .res-modal-input,
        .res-modal-select {
          width: 100%;
          height: 44px;
          background: #252D3C;
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 6px;
          padding: 0 14px;
          font-size: 13px;
          color: #FFFFFF;
          outline: none;
          box-sizing: border-box;
          font-family: inherit;
          transition: all 0.2s ease;
        }

        .res-modal-input:focus,
        .res-modal-select:focus {
          border-color: #00D2FF;
          background: #263142;
          box-shadow: 0 0 0 3px rgba(0, 210, 255, 0.22);
        }

        .res-modal-select {
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 14px center;
          background-size: 16px;
          padding-right: 36px;
        }

        .res-modal-select option {
          background: #0D1522;
          color: #FFFFFF;
        }

        .res-modal-consent {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-top: 12px;
          font-size: 11px;
          line-height: 1.45;
          color: #94A3B8;
        }

        .res-modal-consent input[type="checkbox"] {
          margin-top: 2px;
          accent-color: #00A3C4;
          width: 14px;
          height: 14px;
          cursor: pointer;
          flex-shrink: 0;
        }

        .res-modal-consent label {
          cursor: pointer;
        }

        .res-modal-submit-btn {
          width: 100%;
          height: 48px;
          background: #00A3C4;
          color: #FFFFFF;
          border: 0;
          border-radius: 6px;
          margin-top: 18px;
          font-size: 14.5px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 18px rgba(0, 163, 196, 0.4);
        }

        .res-modal-submit-btn:hover {
          background: #00BBE0;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 210, 255, 0.55);
        }

        .res-modal-trust {
          text-align: center;
          margin-top: 12px;
          font-size: 11px;
          color: #64748B;
        }

        .res-modal-error {
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid #EF4444;
          color: #FCA5A5;
          padding: 10px 14px;
          border-radius: 6px;
          font-size: 12px;
          margin-bottom: 14px;
        }

        .res-modal-success {
          text-align: center;
          padding: 24px 12px;
        }

        .res-modal-success-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: rgba(0, 163, 196, 0.15);
          border: 2px solid #00A3C4;
          color: #00D2FF;
          font-size: 26px;
          margin-bottom: 16px;
        }

        .res-modal-success h3 {
          font-size: 20px;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0 0 10px;
        }

        .res-modal-success p {
          font-size: 13.5px;
          color: #94A3B8;
          line-height: 1.6;
          margin-bottom: 22px;
        }

        .res-modal-secondary-btn {
          margin-top: 10px;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.18);
          color: #CBD5E1;
          padding: 11px 20px;
          border-radius: 6px;
          cursor: pointer;
          width: 100%;
          font-weight: 600;
          font-size: 13.5px;
          transition: all 0.2s ease;
        }

        .res-modal-secondary-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          color: #FFFFFF;
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
                        openDownloadModal(item);
                      }}
                    >
                      Download Now
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          )}
          {/* ================= SPONSOR / PUBLISH RESEARCH STRIP ================= */}
          <section className="resource-sponsor-strip">
            <div className="resource-sponsor-content">
              <span className="resource-sponsor-badge">CONTENT SYNDICATION &amp; RESEARCH PARTNERSHIP</span>
              <h3 className="resource-sponsor-title">Distribute Your Whitepapers &amp; Reports to 500,000+ Enterprise Tech Decision-Makers</h3>
              <p className="resource-sponsor-desc">
                Partner with GETprospeKt to syndicate your high-value research across our 6 Media Brands. We guarantee verified downloads from C-level executives, directors, and active buying committees.
              </p>
              <div className="resource-sponsor-metrics">
                <div className="resource-sponsor-metric-item">
                  <strong>500K+</strong>
                  <span>Verified Tech Subscribers</span>
                </div>
                <div className="resource-sponsor-metric-item">
                  <strong>100%</strong>
                  <span>Human Phone Verification</span>
                </div>
                <div className="resource-sponsor-metric-item">
                  <strong>85%+</strong>
                  <span>Meeting Show-Up Rate</span>
                </div>
                <div className="resource-sponsor-metric-item">
                  <strong>6</strong>
                  <span>Specialized Media Brands</span>
                </div>
              </div>
            </div>
            <div className="resource-sponsor-action">
              <Link to="/solutions" className="btn-resource-sponsor">
                Sponsor or Syndicate Research
              </Link>
            </div>
          </section>

        </div>
      </div>

      {/* ================= GATED DOWNLOAD MODAL ================= */}
      {modalResource && (
        <div className="res-modal-backdrop" onClick={closeDownloadModal}>
          <div className="res-modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="res-modal-close-btn"
              onClick={closeDownloadModal}
              aria-label="Close Modal"
            >
              ✕
            </button>

            <div className="res-modal-header">
              <span className="res-modal-tag">
                {modalResource.type || "Whitepaper"} • {modalResource.category}
              </span>
              <h2 className="res-modal-title">{modalResource.title}</h2>
              <p className="res-modal-subtitle">
                {modalResource.language === "fr" || /Analyse approfondie|comment Veeam/i.test(modalResource.title || "")
                  ? "Veuillez remplir ce court formulaire d'authentification pour débloquer le téléchargement direct du document officiel."
                  : "Please complete this verified enterprise brief to unlock instant download access to the official publication."}
              </p>
            </div>

            {modalSubmitted ? (
              <div className="res-modal-success">
                <div className="res-modal-success-badge">✓</div>
                <h3>
                  {modalResource.language === "fr" || /Analyse approfondie|comment Veeam/i.test(modalResource.title || "")
                    ? "Téléchargement Débloqué !"
                    : "Download Unlocked!"}
                </h3>
                <p>
                  {modalResource.language === "fr" || /Analyse approfondie|comment Veeam/i.test(modalResource.title || "")
                    ? `Votre accès a été validé. Le fichier (${modalResource.downloadFileName || "document.pdf"}) est en cours de téléchargement.`
                    : `Your access has been verified. The asset (${modalResource.downloadFileName || "document.pdf"}) is downloading automatically.`}
                </p>
                <button
                  type="button"
                  className="res-modal-submit-btn"
                  onClick={() => triggerAssetDownload(modalResource)}
                >
                  {modalResource.language === "fr" || /Analyse approfondie|comment Veeam/i.test(modalResource.title || "")
                    ? "Télécharger à Nouveau"
                    : "Download File Again"}
                </button>
                <button
                  type="button"
                  className="res-modal-secondary-btn"
                  onClick={closeDownloadModal}
                >
                  {modalResource.language === "fr" || /Analyse approfondie|comment Veeam/i.test(modalResource.title || "")
                    ? "Fermer la Fenêtre"
                    : "Close Window"}
                </button>
              </div>
            ) : (
              <form onSubmit={handleModalSubmit}>
                {modalError && <div className="res-modal-error">{modalError}</div>}

                {/* 2-COLUMN INPUT GRID */}
                <div className="res-modal-grid">
                  {/* ROW 1: FIRST & LAST NAME */}
                  <div className="res-modal-input-wrap">
                    <input
                      type="text"
                      required
                      placeholder={modalResource.language === "fr" ? "Prénom*" : "First Name*"}
                      className="res-modal-input"
                      value={modalFirstName}
                      onChange={(e) => setModalFirstName(e.target.value)}
                    />
                  </div>
                  <div className="res-modal-input-wrap">
                    <input
                      type="text"
                      required
                      placeholder={modalResource.language === "fr" ? "Nom de famille*" : "Last Name*"}
                      className="res-modal-input"
                      value={modalLastName}
                      onChange={(e) => setModalLastName(e.target.value)}
                    />
                  </div>

                  {/* ROW 2: EMAIL & TELEPHONE */}
                  <div className="res-modal-input-wrap">
                    <input
                      type="email"
                      required
                      placeholder={modalResource.language === "fr" ? "E-mail*" : "Work E-mail*"}
                      className="res-modal-input"
                      value={modalEmail}
                      onChange={(e) => setModalEmail(e.target.value)}
                    />
                  </div>
                  <div className="res-modal-input-wrap">
                    <input
                      type="tel"
                      required
                      placeholder={modalResource.language === "fr" ? "Téléphone*" : "Telephone*"}
                      className="res-modal-input"
                      value={modalTelephone}
                      onChange={(e) => setModalTelephone(e.target.value)}
                    />
                  </div>

                  {/* ROW 3: COUNTRY & COMPANY NAME */}
                  <div className="res-modal-input-wrap">
                    <select
                      className="res-modal-select"
                      value={modalCountry}
                      onChange={(e) => setModalCountry(e.target.value)}
                    >
                      <option value="">{modalResource.language === "fr" ? "Pays*" : "Country*"}</option>
                      {countryOptions.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="res-modal-input-wrap">
                    <input
                      type="text"
                      required
                      placeholder={modalResource.language === "fr" ? "Nom de l'entreprise*" : "Company Name*"}
                      className="res-modal-input"
                      value={modalCompanyName}
                      onChange={(e) => setModalCompanyName(e.target.value)}
                    />
                  </div>

                  {/* ROW 4: COMPANY SIZE & STATE */}
                  <div className="res-modal-input-wrap">
                    <select
                      className="res-modal-select"
                      value={modalCompanySize}
                      onChange={(e) => setModalCompanySize(e.target.value)}
                    >
                      <option value="">{modalResource.language === "fr" ? "Taille de l'entreprise*" : "Company Size*"}</option>
                      {companySizeOptions.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div className="res-modal-input-wrap">
                    <input
                      type="text"
                      required
                      placeholder={modalResource.language === "fr" ? "État*" : "State / Province*"}
                      className="res-modal-input"
                      value={modalStateProvince}
                      onChange={(e) => setModalStateProvince(e.target.value)}
                    />
                  </div>

                  {/* ROW 5: CITY & ADDRESS */}
                  <div className="res-modal-input-wrap">
                    <input
                      type="text"
                      required
                      placeholder={modalResource.language === "fr" ? "Ville*" : "City*"}
                      className="res-modal-input"
                      value={modalCity}
                      onChange={(e) => setModalCity(e.target.value)}
                    />
                  </div>
                  <div className="res-modal-input-wrap">
                    <input
                      type="text"
                      required
                      placeholder={modalResource.language === "fr" ? "Adresse*" : "Address*"}
                      className="res-modal-input"
                      value={modalAddress}
                      onChange={(e) => setModalAddress(e.target.value)}
                    />
                  </div>

                  {/* ROW 6: POSTAL CODE & INDUSTRY */}
                  <div className="res-modal-input-wrap">
                    <input
                      type="text"
                      required
                      placeholder={modalResource.language === "fr" ? "Code Postal*" : "Postal Code*"}
                      className="res-modal-input"
                      value={modalPostalCode}
                      onChange={(e) => setModalPostalCode(e.target.value)}
                    />
                  </div>
                  <div className="res-modal-input-wrap">
                    <select
                      className="res-modal-select"
                      value={modalIndustry}
                      onChange={(e) => setModalIndustry(e.target.value)}
                    >
                      <option value="">{modalResource.language === "fr" ? "Industrie*" : "Industry*"}</option>
                      {industryOptions.map((ind) => (
                        <option key={ind} value={ind}>{ind}</option>
                      ))}
                    </select>
                  </div>

                  {/* ROW 7: JOB TITLE (FULL WIDTH) */}
                  <div className="res-modal-input-wrap res-modal-col-full">
                    <input
                      type="text"
                      required
                      placeholder={modalResource.language === "fr" ? "Titre d'emploi*" : "Job Title*"}
                      className="res-modal-input"
                      value={modalJobTitle}
                      onChange={(e) => setModalJobTitle(e.target.value)}
                    />
                  </div>
                </div>

                {/* CONSENT 1 */}
                <div className="res-modal-consent">
                  <input
                    type="checkbox"
                    id="modalOptInMarketing"
                    checked={modalOptInMarketing}
                    onChange={(e) => setModalOptInMarketing(e.target.checked)}
                  />
                  <label htmlFor="modalOptInMarketing">
                    {modalResource.language === "fr"
                      ? "J'aimerais recevoir des informations de fournisseurs sponsorisant ce contenu et disposés à partager les informations ci-dessus avec EnterpriseTalk / GETprospeKt."
                      : "I would like to receive information from suppliers sponsoring this content and willing to share the information above with GETprospeKt."}
                  </label>
                </div>

                {/* CONSENT 2 */}
                <div className="res-modal-consent">
                  <input
                    type="checkbox"
                    id="modalOptInPartner"
                    checked={modalOptInPartner}
                    onChange={(e) => setModalOptInPartner(e.target.checked)}
                  />
                  <label htmlFor="modalOptInPartner">
                    {modalResource.language === "fr"
                      ? "En cochant cette case, j'accepte qu'EnterpriseTalk / GETprospeKt partage mes données avec des partenaires afin que ceux-ci puissent me contacter par e-mail ou par téléphone."
                      : "By checking this box, I agree that GETprospeKt can share my data with partners so that they can contact me by email or phone and provide more information about this content."}
                  </label>
                </div>

                {/* SUBMIT BUTTON */}
                <button
                  type="submit"
                  className="res-modal-submit-btn"
                  disabled={modalSubmitting}
                >
                  {modalSubmitting
                    ? (modalResource.language === "fr" ? "Traitement en cours..." : "Processing...")
                    : modalResource.language === "fr"
                    ? "TÉLÉCHARGER MAINTENANT"
                    : "DOWNLOAD NOW"}
                </button>

                {/* TRUST NOTE */}
                <div className="res-modal-trust">
                  🔒 256-Bit Encrypted • Confidential Enterprise Access • Instant Delivery
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </>
  );
};

export default Resources;

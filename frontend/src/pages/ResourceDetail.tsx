import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { resourcesApi, enquiriesApi } from "../services/api";
import { downloadPdfDocument } from "../utils/pdfGenerator";

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

const jobTitleOptions = [
  "C-Level Executive (CIO, CTO, CMO, CEO, CRO)",
  "Vice President / Senior VP",
  "Director / Head of Department",
  "Manager / Team Lead",
  "Solutions Architect / Enterprise Engineer",
  "Sales / Demand Generation Leader",
  "Specialist / Analyst",
  "Other",
];

const ResourceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [resource, setResource] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Form State (matching user screenshots 2 & 3)
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [country, setCountry] = useState("United States");
  const [companyName, setCompanyName] = useState("");
  const [companySize, setCompanySize] = useState("51 - 200 employees");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [industry, setIndustry] = useState("B2B Technology & Software");
  const [jobTitle, setJobTitle] = useState("Director / Head of Department");
  const [optInMarketing, setOptInMarketing] = useState(true);
  const [optInPartner, setOptInPartner] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [relatedResources, setRelatedResources] = useState<any[]>([]);

  useEffect(() => {
    loadResource();
  }, [id]);

  const loadResource = async () => {
    setLoading(true);
    try {
      if (id) {
        const data = await resourcesApi.getById(id);
        setResource(data);
        const allRes = await resourcesApi.getAll();
        if (Array.isArray(allRes)) {
          setRelatedResources(allRes.filter((r: any) => r._id !== id).slice(0, 3));
        }
      }
    } catch (err) {
      console.error("Failed to load resource:", err);
    } finally {
      setLoading(false);
    }
  };

  const res = resource || {
    title: "Enterprise Technical Whitepaper",
    type: "Whitepaper",
    category: "Enterprise Technology",
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=85",
    summary: "Download this comprehensive guide covering modern enterprise deployment and cost efficiency strategies.",
    content: "Discover how top-performing tech companies optimize their infrastructure refresh cycles and reduce maintenance expenditures by up to 12.5%. Includes total economic impact analysis, architecture diagrams, and procurement frameworks.",
    fileUrl: "/sample-whitepaper.pdf",
  };

  const handleDownloadPdf = () => {
    downloadPdfDocument(
      {
        title: res.title || "Enterprise Resource",
        type: res.type || "Whitepaper",
        category: res.category || "Enterprise Technology",
        summary: res.summary || "",
        content: res.content || "",
        recipientName: `${firstName} ${lastName}`.trim() || "Enterprise Executive",
        recipientCompany: companyName.trim() || "",
      },
      res.fileUrl || "/sample-whitepaper.pdf"
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !telephone.trim() || !companyName.trim()) {
      setErrorMsg("Please fill in all required fields marked with *.");
      return;
    }

    setSubmitting(true);
    try {
      await enquiriesApi.submit({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        telephone: telephone.trim(),
        country,
        company: companyName.trim(),
        companySize,
        city: city.trim(),
        address: address.trim(),
        postalCode: postalCode.trim(),
        industry,
        jobTitle,
        resourceId: resource?._id || id,
        resourceTitle: resource?.title || "Resource",
        optInMarketing,
        optInPartner,
        subject: `Resource Download: ${resource?.title || "Whitepaper"}`,
        message: `Lead downloaded ${resource?.type || "Whitepaper"}: ${resource?.title || "Resource"}. Company: ${companyName}, Size: ${companySize}, Industry: ${industry}, Job Title: ${jobTitle}, Phone: ${telephone}`,
      });

      // Increment download count locally
      if (resource?._id) {
        resourcesApi.update(resource._id, {
          downloadCount: (resource.downloadCount || 0) + 1,
        });
      }

      setSubmitted(true);
      // Auto-trigger the PDF download in authentic PDF format
      setTimeout(() => {
        handleDownloadPdf();
      }, 400);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "80vh", background: "#060B12", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF" }}>
        Loading document preview...
      </div>
    );
  }

  return (
    <>
      <style>{`
        /* =========================================
           RESOURCE DETAIL & GATED DOWNLOAD PAGE
        ========================================= */
        .resource-detail-page {
          min-height: 100vh;
          background: #060B12;
          color: #D5DBE7;
          padding: 30px 0 90px;
          font-family: var(--font-sans);
        }

        .resource-detail-container {
          width: min(1380px, calc(100% - 48px));
          margin: 0 auto;
        }

        .resource-breadcrumb {
          font-size: 13px;
          color: #64748B;
          margin-bottom: 26px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .resource-breadcrumb a {
          color: #00D2FF;
          text-decoration: none;
        }

        .resource-breadcrumb a:hover {
          text-decoration: underline;
        }

        /* 2-COLUMN SPLIT (CONTENT + FORM) */
        .resource-split {
          display: grid;
          grid-template-columns: 1fr 480px;
          gap: 48px;
          align-items: start;
        }

        @media (max-width: 1080px) {
          .resource-split {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }

        /* LEFT CONTENT COLUMN */
        .resource-content-col {
          display: flex;
          flex-direction: column;
        }

        .resource-type-pill {
          display: inline-block;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #DC2626;
          background: rgba(220, 38, 38, 0.1);
          border: 1px solid rgba(220, 38, 38, 0.3);
          padding: 4px 14px;
          border-radius: 4px;
          align-self: flex-start;
          margin-bottom: 16px;
        }

        .resource-heading-title {
          font-size: clamp(26px, 3.2vw, 38px);
          font-weight: 800;
          line-height: 1.25;
          color: #FFFFFF;
          margin: 0 0 16px;
          letter-spacing: -0.01em;
        }

        .resource-meta-bar {
          display: flex;
          align-items: center;
          gap: 20px;
          font-size: 13px;
          color: #94A3B8;
          border-bottom: 1px solid rgba(203, 213, 225, 0.12);
          padding-bottom: 18px;
          margin-bottom: 28px;
          flex-wrap: wrap;
        }

        .resource-meta-bar span {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        /* FULL WIDTH IMAGE CONTAINER */
        /* FULL WIDTH FIXED IMAGE CONTAINER (INTERACTIVE) */
        .resource-fixed-image-wrap {
          width: 100%;
          height: 420px;
          border-radius: 8px;
          overflow: hidden;
          background: #0D1522;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(203, 213, 225, 0.15);
          margin-bottom: 26px;
          border: 2px solid #0046FC;
          transition: all 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
          position: relative;
        }

        .resource-fixed-image-wrap:hover {
          border-color: #00D2FF;
          box-shadow: 0 20px 48px rgba(0, 70, 252, 0.4), 0 0 30px rgba(0, 210, 255, 0.25);
        }

        .resource-fixed-image-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), filter 0.3s ease;
        }

        .resource-fixed-image-wrap:hover img {
          transform: scale(1.03);
          filter: brightness(1.04);
        }

        @media (max-width: 600px) {
          .resource-fixed-image-wrap {
            width: 100%;
            height: 240px;
          }
        }

        .resource-summary-box {
          background: rgba(13, 21, 34, 0.7);
          border: 1px solid rgba(203, 213, 225, 0.12);
          border-left: 4px solid #00D2FF;
          padding: 16px 20px;
          border-radius: 0 8px 8px 0;
          font-size: 14.5px;
          line-height: 1.6;
          color: #E2E8F0;
          margin-bottom: 22px;
          transition: all 0.25s ease;
        }

        .resource-summary-box:hover {
          background: rgba(13, 21, 34, 0.95);
          border-left-color: #0046FC;
          box-shadow: 0 6px 20px rgba(0, 70, 252, 0.18);
          transform: translateX(4px);
        }

        .resource-body-text {
          font-size: 14.5px;
          line-height: 1.65;
          color: #CBD5E1;
          margin-bottom: 22px;
        }

        .resource-learn-box {
          background: #0D1522;
          border: 1px solid rgba(203, 213, 225, 0.14);
          border-radius: 8px;
          padding: 22px;
          margin-top: 10px;
          transition: all 0.25s ease;
        }

        .resource-learn-box:hover {
          border-color: rgba(0, 210, 255, 0.35);
          box-shadow: 0 10px 28px rgba(0, 0, 0, 0.5);
        }

        .resource-learn-box h4 {
          margin: 0 0 12px;
          font-size: 15.5px;
          color: #FFFFFF;
          font-weight: 700;
        }

        .resource-learn-box ul {
          margin: 0;
          padding-left: 20px;
          display: flex;
          flex-direction: column;
          gap: 9px;
        }

        .resource-learn-box li {
          font-size: 13.5px;
          color: #94A3B8;
          line-height: 1.45;
        }

        /* RIGHT FORM COLUMN (SLIGHTLY SHORTENED & INTERACTIVE) */
        .resource-form-card {
          background: #0D1522;
          border: 1px solid rgba(203, 213, 225, 0.16);
          border-top: 3px solid #0046FC;
          border-radius: 10px;
          padding: 20px 20px 22px;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6), 0 0 25px rgba(0, 70, 252, 0.08);
          color: #D5DBE7;
          position: sticky;
          top: 85px;
          transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .resource-form-card:hover,
        .resource-form-card:focus-within {
          border-color: rgba(0, 210, 255, 0.4);
          border-top-color: #00D2FF;
          box-shadow: 0 20px 48px rgba(0, 0, 0, 0.7), 0 0 35px rgba(0, 70, 252, 0.22);
        }

        .resource-form-header {
          text-align: center;
          margin-bottom: 15px;
          border-bottom: 1px solid rgba(203, 213, 225, 0.12);
          padding-bottom: 11px;
          position: relative;
        }

        .resource-form-header h3 {
          margin: 0 0 4px;
          font-size: 20px;
          font-weight: 800;
          letter-spacing: 0.12em;
          background: linear-gradient(135deg, #FFFFFF 20%, #00D2FF 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-transform: uppercase;
        }

        .resource-form-header p {
          margin: 0;
          font-size: 11.5px;
          color: #94A3B8;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .resource-form-header p .pulse-dot {
          display: inline-block;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #10B981;
          box-shadow: 0 0 8px #10B981;
        }

        .resource-form-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        @media (max-width: 520px) {
          .resource-form-grid-2 {
            grid-template-columns: 1fr;
            gap: 0;
          }
        }

        .resource-form-group {
          margin-bottom: 10px;
        }

        .resource-form-label {
          display: block;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #CBD5E1;
          margin-bottom: 4px;
        }

        .resource-form-label span.req {
          color: #FF4444;
          margin-left: 2px;
        }

        .resource-form-input,
        .resource-form-select {
          width: 100%;
          background: #060B12;
          border: 1px solid rgba(203, 213, 225, 0.18);
          border-radius: 6px;
          padding: 8px 11px;
          font-size: 12.5px;
          color: #FFFFFF;
          outline: none;
          box-sizing: border-box;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          font-family: inherit;
        }

        .resource-form-input::placeholder {
          color: #64748B;
        }

        .resource-form-input:hover,
        .resource-form-select:hover {
          border-color: rgba(0, 210, 255, 0.45);
          background: #09101A;
        }

        .resource-form-input:focus,
        .resource-form-select:focus {
          border-color: #00D2FF;
          background: #0B1422;
          box-shadow: 0 0 0 3px rgba(0, 210, 255, 0.22);
        }

        .resource-form-select option {
          background: #0D1522;
          color: #FFFFFF;
        }

        .resource-checkbox-wrap {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          margin-top: 10px;
          font-size: 10.5px;
          line-height: 1.4;
          color: #94A3B8;
        }

        .resource-checkbox-wrap input[type="checkbox"] {
          margin-top: 2px;
          flex-shrink: 0;
          cursor: pointer;
          accent-color: #00D2FF;
          width: 13px;
          height: 13px;
        }

        .resource-checkbox-wrap label {
          cursor: pointer;
          transition: color 0.15s ease;
        }

        .resource-checkbox-wrap label:hover {
          color: #E2E8F0;
        }

        .resource-submit-btn {
          width: 100%;
          background: linear-gradient(135deg, #0046FC 0%, #00D2FF 100%);
          color: #FFFFFF;
          border: 0;
          padding: 12px 20px;
          font-size: 13.5px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          border-radius: 26px;
          margin-top: 14px;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 4px 18px rgba(0, 70, 252, 0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .resource-submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 26px rgba(0, 210, 255, 0.55);
          filter: brightness(1.1);
        }

        .resource-submit-btn:active {
          transform: translateY(0);
          filter: brightness(0.95);
        }

        .resource-submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .resource-trust-note {
          text-align: center;
          margin-top: 10px;
          font-size: 10.5px;
          color: #64748B;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .resource-form-error {
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid #EF4444;
          color: #FCA5A5;
          padding: 9px 13px;
          border-radius: 6px;
          font-size: 12px;
          margin-bottom: 14px;
        }

        /* SUCCESS STATE */
        .resource-success-box {
          text-align: center;
          padding: 35px 12px;
        }

        .resource-success-icon {
          font-size: 46px;
          margin-bottom: 12px;
        }

        .resource-success-box h4 {
          font-size: 22px;
          font-weight: 800;
          color: #00D2FF;
          margin: 0 0 12px;
        }

        .resource-success-box p {
          font-size: 13.5px;
          color: #94A3B8;
          line-height: 1.6;
          margin-bottom: 24px;
        }

        .resource-download-file-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #0046FC 0%, #00D2FF 100%);
          color: #FFFFFF;
          padding: 13px 28px;
          border-radius: 26px;
          border: 0;
          cursor: pointer;
          font-family: inherit;
          text-decoration: none;
          font-weight: 700;
          font-size: 14px;
          letter-spacing: 0.04em;
          transition: all 0.25s ease;
          box-shadow: 0 4px 18px rgba(0, 70, 252, 0.4);
        }

        .resource-download-file-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 26px rgba(0, 210, 255, 0.55);
        }

        /* RELATED CARDS SECTION */
        .resource-related-section {
          margin-top: 70px;
          padding-top: 45px;
          border-top: 1px solid rgba(203, 213, 225, 0.12);
        }

        .resource-related-header {
          text-align: center;
          margin-bottom: 34px;
        }

        .resource-related-badge {
          display: inline-block;
          font-size: 11.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #00D2FF;
          background: rgba(0, 70, 252, 0.12);
          border: 1px solid rgba(0, 210, 255, 0.25);
          padding: 4px 14px;
          border-radius: 20px;
          margin-bottom: 12px;
        }

        .resource-related-header h2 {
          font-size: 28px;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0;
          letter-spacing: -0.01em;
        }

        .resource-related-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        @media (max-width: 900px) {
          .resource-related-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .resource-related-grid {
            grid-template-columns: 1fr;
          }
        }

        /* REUSABLE INTERACTIVE RESOURCE CARD (HARMONIZED WITH WEBSITE THEME) */
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

        .resource-card-cover {
          width: 100%;
          height: 220px;
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

        .resource-card-body {
          padding: 18px 18px 20px;
          display: flex;
          flex-direction: column;
          flex: 1;
          background: #0D1522;
        }

        .resource-card-title {
          font-size: 16px;
          font-weight: 700;
          line-height: 1.35;
          color: #FFFFFF;
          margin: 0 0 10px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 44px;
          transition: color 0.25s ease;
        }

        .resource-card:hover .resource-card-title {
          color: #00D2FF;
        }

        .resource-card-meta {
          font-size: 11.5px;
          color: #94A3B8;
          margin-top: auto;
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 8px;
          border-top: 1px solid rgba(203, 213, 225, 0.1);
        }

        .resource-card-meta span {
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .resource-card-btn {
          width: 100%;
          background: #060B12;
          color: #D5DBE7;
          border: 1px solid rgba(0, 210, 255, 0.3);
          padding: 11px 16px;
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
          gap: 6px;
          margin-top: auto;
          position: relative;
          overflow: hidden;
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
      `}</style>

      <div className="resource-detail-page">
        <div className="resource-detail-container">
          {/* BREADCRUMB */}
          <div className="resource-breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/resources">Resources</Link>
            <span>/</span>
            <span>{res.type || "Whitepaper"}</span>
          </div>

          <div className="resource-split">
            {/* LEFT: CONTENT & FIXED-SIZE IMAGE */}
            <div className="resource-content-col">
              <span className="resource-type-pill">{res.type || "Whitepaper"}</span>
              <h1 className="resource-heading-title">{res.title}</h1>

              <div className="resource-meta-bar">
                <span>📁 {res.category}</span>
                <span>📄 Format: PDF Document</span>
                <span>🔒 Enterprise Research</span>
                <span>📥 {res.downloadCount || 0} Downloads</span>
              </div>

              {/* FIXED IMAGE AS REQUESTED */}
              <div className="resource-fixed-image-wrap">
                <img
                  src={
                    res.coverImage ||
                    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=85"
                  }
                  alt={res.title}
                />
              </div>

              {/* SUMMARY */}
              <div className="resource-summary-box">
                {res.summary}
              </div>

              {/* DETAILED CONTENT */}
              <div className="resource-body-text">
                {res.content || (
                  <p>
                    Enterprise technology environments require precise benchmarking and validated
                    vendor capabilities. This document offers actionable deployment frameworks,
                    infrastructure cost models, and step-by-step methodologies tested across Fortune 500
                    deployments.
                  </p>
                )}
              </div>

              {/* KEY TAKEAWAYS BOX */}
              <div className="resource-learn-box">
                <h4>What You Will Learn Inside This {res.type || "Document"}:</h4>
                <ul>
                  <li>Strategic frameworks for aligning IT capabilities with operational business goals.</li>
                  <li>Total Economic Impact data including cost savings, deployment timetables, and ROI metrics.</li>
                  <li>Best practices for risk mitigation, zero-trust security compliance, and vendor rotation.</li>
                  <li>Actionable executive checklist ready for immediate internal stakeholder distribution.</li>
                </ul>
              </div>
            </div>

            {/* RIGHT: EXACT "GET IT NOW!" GATED FORM */}
            <div className="resource-form-card">
              <div className="resource-form-header">
                <h3>GET IT NOW!</h3>
                <p>
                  <span className="pulse-dot" /> Instant Access • Verified Research
                </p>
              </div>

              {submitted ? (
                <div className="resource-success-box">
                  <div className="resource-success-icon">🎉</div>
                  <h4>Thank You!</h4>
                  <p>
                    Your request has been verified. A copy has been emailed to <strong>{email}</strong>.
                    You can also access your instant document download below.
                  </p>
                  <button
                    type="button"
                    onClick={handleDownloadPdf}
                    className="resource-download-file-btn"
                  >
                    📥 Download PDF Now
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {errorMsg && <div className="resource-form-error">{errorMsg}</div>}

                  {/* ROW 1: FIRST & LAST NAME */}
                  <div className="resource-form-grid-2">
                    <div className="resource-form-group">
                      <label className="resource-form-label">
                        First Name<span className="req">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="John"
                        className="resource-form-input"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>
                    <div className="resource-form-group">
                      <label className="resource-form-label">
                        Last Name<span className="req">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Doe"
                        className="resource-form-input"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* ROW 2: CORPORATE EMAIL & TELEPHONE */}
                  <div className="resource-form-grid-2">
                    <div className="resource-form-group">
                      <label className="resource-form-label">
                        Corporate Email<span className="req">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="name@company.com"
                        className="resource-form-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="resource-form-group">
                      <label className="resource-form-label">
                        Telephone<span className="req">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+1 (555) 000-0000"
                        className="resource-form-input"
                        value={telephone}
                        onChange={(e) => setTelephone(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* ROW 3: COMPANY NAME & JOB TITLE */}
                  <div className="resource-form-grid-2">
                    <div className="resource-form-group">
                      <label className="resource-form-label">
                        Company Name<span className="req">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Acme Corp"
                        className="resource-form-input"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                      />
                    </div>
                    <div className="resource-form-group">
                      <label className="resource-form-label">
                        Job Title<span className="req">*</span>
                      </label>
                      <select
                        className="resource-form-select"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                      >
                        {jobTitleOptions.map((title) => (
                          <option key={title} value={title}>
                            {title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* ROW 4: INDUSTRY & COMPANY SIZE */}
                  <div className="resource-form-grid-2">
                    <div className="resource-form-group">
                      <label className="resource-form-label">
                        Industry<span className="req">*</span>
                      </label>
                      <select
                        className="resource-form-select"
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                      >
                        {industryOptions.map((ind) => (
                          <option key={ind} value={ind}>
                            {ind}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="resource-form-group">
                      <label className="resource-form-label">
                        Company Size<span className="req">*</span>
                      </label>
                      <select
                        className="resource-form-select"
                        value={companySize}
                        onChange={(e) => setCompanySize(e.target.value)}
                      >
                        {companySizeOptions.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* ROW 5: COUNTRY & CITY */}
                  <div className="resource-form-grid-2">
                    <div className="resource-form-group">
                      <label className="resource-form-label">
                        Country<span className="req">*</span>
                      </label>
                      <select
                        className="resource-form-select"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                      >
                        {countryOptions.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="resource-form-group">
                      <label className="resource-form-label">
                        City<span className="req">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="New York"
                        className="resource-form-input"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* ROW 6: ADDRESS & POSTAL CODE */}
                  <div className="resource-form-grid-2">
                    <div className="resource-form-group">
                      <label className="resource-form-label">
                        Address<span className="req">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="123 Market St"
                        className="resource-form-input"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>
                    <div className="resource-form-group">
                      <label className="resource-form-label">
                        Postal Code<span className="req">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="10001"
                        className="resource-form-input"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* CHECKBOX 1 */}
                  <div className="resource-checkbox-wrap">
                    <input
                      type="checkbox"
                      id="optInMarketing"
                      checked={optInMarketing}
                      onChange={(e) => setOptInMarketing(e.target.checked)}
                    />
                    <label htmlFor="optInMarketing">
                      Yes, I would like to subscribe to email and phone updates. GETprospeKt and its
                      group partners would love to stay in touch to keep you updated on solutions,
                      research, exclusive offers, and events. You can unsubscribe anytime.
                    </label>
                  </div>

                  {/* CHECKBOX 2 */}
                  <div className="resource-checkbox-wrap">
                    <input
                      type="checkbox"
                      id="optInPartner"
                      checked={optInPartner}
                      onChange={(e) => setOptInPartner(e.target.checked)}
                    />
                    <label htmlFor="optInPartner">
                      By checking this box, I agree that GETprospeKt can share my contact data with partners
                      so that partners can contact me by email or phone and provide more information about
                      this content.
                    </label>
                  </div>

                  {/* SUBMIT BUTTON */}
                  <button
                    type="submit"
                    className="resource-submit-btn"
                    disabled={submitting}
                  >
                    {submitting ? "Processing..." : "DOWNLOAD NOW! →"}
                  </button>

                  {/* TRUST NOTE */}
                  <div className="resource-trust-note">
                    🔒 256-Bit Encrypted • Confidential Enterprise Access
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* RELATED RESOURCES SECTION */}
          {relatedResources.length > 0 && (
            <div className="resource-related-section">
              <div className="resource-related-header">
                <span className="resource-related-badge">More Enterprise Insights</span>
                <h2>Related Whitepapers & Playbooks</h2>
              </div>
              <div className="resource-related-grid">
                {relatedResources.map((item) => (
                  <Link
                    key={item._id}
                    to={`/resources/view/${item._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resource-card"
                  >
                    <div className="resource-card-cover">
                      <img
                        src={
                          item.coverImage ||
                          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=85"
                        }
                        alt={item.title}
                        loading="lazy"
                      />
                      <span className="resource-card-tag">{item.type || "Whitepaper"}</span>
                    </div>
                    <div className="resource-card-body">
                      <h3 className="resource-card-title">{item.title}</h3>
                      <div className="resource-card-meta">
                        <span>🏷️ {item.category}</span>
                        <span>📥 {item.downloadCount || 0} downloads</span>
                      </div>
                      <div className="resource-card-btn">
                        Download Now <span className="arrow-icon">→</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ResourceDetail;

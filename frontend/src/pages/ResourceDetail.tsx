import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
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
  const [formConfig, setFormConfig] = useState<GatedFormConfig>(() => formConfigApi.get());

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
  const [customValues, setCustomValues] = useState<Record<string, any>>({});

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [relatedResources, setRelatedResources] = useState<any[]>([]);

  const standardFieldKeys = [
    "firstName", "lastName", "email", "telephone", "companyName", "jobTitle",
    "industry", "companySize", "country", "city", "address", "postalCode",
    "optInMarketing", "optInPartner"
  ];
  const customFieldsList = Object.values(formConfig.fields || {}).filter(
    (f) => f && f.enabled && !standardFieldKeys.includes(f.id)
  );

  useEffect(() => {
    loadResource();
  }, [id]);

  useEffect(() => {
    setFormConfig(formConfigApi.getForResource(resource));
    const handleConfigChange = () => {
      setFormConfig(formConfigApi.getForResource(resource));
    };
    window.addEventListener("gp_form_config_updated", handleConfigChange);
    return () => window.removeEventListener("gp_form_config_updated", handleConfigChange);
  }, [resource]);

  const loadResource = async () => {
    setLoading(true);
    try {
      if (id) {
        const data = await resourcesApi.getById(id);
        setResource(data);
        setFormConfig(formConfigApi.getForResource(data));
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
    coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=85",
    summary: "Download this comprehensive guide covering modern enterprise deployment and cost efficiency strategies.",
    content: "Discover how top-performing tech companies optimize their infrastructure refresh cycles and reduce maintenance expenditures by up to 12.5%. Includes total economic impact analysis, architecture diagrams, and procurement frameworks.",
    fileUrl: "/sample-whitepaper.pdf",
    downloadFileType: "pdf",
    downloadFileName: "enterprise-technical-whitepaper.pdf",
  };

  const catDownloadAsset = formConfig.downloadAsset;
  const effectiveFileType =
    res.downloadFileType && res.downloadFileType !== "auto-pdf"
      ? res.downloadFileType
      : catDownloadAsset?.fileType && catDownloadAsset.fileType !== "auto-pdf"
      ? catDownloadAsset.fileType
      : res.downloadFileType || catDownloadAsset?.fileType || "auto-pdf";

  const effectiveFileUrl =
    res.fileUrl && res.fileUrl !== "/sample-whitepaper.pdf"
      ? res.fileUrl
      : catDownloadAsset?.fileUrl || res.fileUrl;

  const effectiveFileName =
    res.downloadFileName || catDownloadAsset?.fileName;

  const effectiveDownloadContent =
    res.downloadContent || catDownloadAsset?.downloadContent || res.content || "";

  const handleTriggerDownload = () => {
    downloadResourceAsset(
      {
        title: res.title || "Enterprise Resource",
        type: res.type || "Whitepaper",
        category: res.category || "Enterprise Technology",
        summary: res.summary || "",
        content: res.content || "",
        downloadContent: effectiveDownloadContent,
        coverImage: res.coverImage || "",
        recipientName: `${firstName} ${lastName}`.trim() || "Enterprise Executive",
        recipientCompany: companyName.trim() || "",
        recipientEmail: email.trim() || "",
      },
      effectiveFileUrl,
      effectiveFileType,
      effectiveFileName
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const fields = formConfig.fields;
    const missing: string[] = [];

    if (fields.firstName?.enabled && fields.firstName?.required && !firstName.trim()) {
      missing.push(fields.firstName.label || "First Name");
    }
    if (fields.lastName?.enabled && fields.lastName?.required && !lastName.trim()) {
      missing.push(fields.lastName.label || "Last Name");
    }
    if (fields.email?.enabled && fields.email?.required && !email.trim()) {
      missing.push(fields.email.label || "Corporate Email");
    }
    if (fields.telephone?.enabled && fields.telephone?.required && !telephone.trim()) {
      missing.push(fields.telephone.label || "Telephone");
    }
    if (fields.companyName?.enabled && fields.companyName?.required && !companyName.trim()) {
      missing.push(fields.companyName.label || "Company Name");
    }
    if (fields.jobTitle?.enabled && fields.jobTitle?.required && !jobTitle.trim()) {
      missing.push(fields.jobTitle.label || "Job Title");
    }
    if (fields.industry?.enabled && fields.industry?.required && !industry.trim()) {
      missing.push(fields.industry.label || "Industry");
    }
    if (fields.companySize?.enabled && fields.companySize?.required && !companySize.trim()) {
      missing.push(fields.companySize.label || "Company Size");
    }
    if (fields.country?.enabled && fields.country?.required && !country.trim()) {
      missing.push(fields.country.label || "Country");
    }
    if (fields.city?.enabled && fields.city?.required && !city.trim()) {
      missing.push(fields.city.label || "City");
    }
    if (fields.address?.enabled && fields.address?.required && !address.trim()) {
      missing.push(fields.address.label || "Address");
    }
    if (fields.postalCode?.enabled && fields.postalCode?.required && !postalCode.trim()) {
      missing.push(fields.postalCode.label || "Postal Code");
    }
    if (fields.optInMarketing?.enabled && fields.optInMarketing?.required && !optInMarketing) {
      missing.push(fields.optInMarketing.label || "Marketing Subscription Opt-in");
    }
    if (fields.optInPartner?.enabled && fields.optInPartner?.required && !optInPartner) {
      missing.push(fields.optInPartner.label || "Partner Consent");
    }

    // Validate any custom required fields
    customFieldsList.forEach((cf) => {
      if (cf.required) {
        const val = customValues[cf.id];
        if (cf.type === "checkbox") {
          if (!val) missing.push(cf.label);
        } else if (!val || !String(val).trim()) {
          missing.push(cf.label);
        }
      }
    });

    if (missing.length > 0) {
      setErrorMsg(`Please fill in all required fields: ${missing.join(", ")}`);
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
        assetTitle: resource?.title || "Resource",
        assetType: resource?.type || "Whitepaper",
        downloadFileType: resource?.downloadFileType || "PDF",
        type: "download",
        optInMarketing,
        optInPartner,
        customFields: customValues,
        subject: `Resource Download: ${resource?.title || "Whitepaper"}`,
        message: `Lead downloaded ${resource?.type || "Whitepaper"}: ${resource?.title || "Resource"}. Format: ${resource?.downloadFileType || "PDF"}. Company: ${companyName}, Size: ${companySize}, Industry: ${industry}, Job Title: ${jobTitle}, Phone: ${telephone}`,
      });

      // Increment download count locally
      if (resource?._id) {
        const nextCount = (resource.downloadCount || 0) + 1;
        resourcesApi.update(resource._id, {
          downloadCount: nextCount,
        });
        setResource((prev: any) => (prev ? { ...prev, downloadCount: nextCount } : prev));
      }

      setSubmitted(true);
      // Auto-trigger configured asset download (Image, PDF, Video, or Dynamic PDF)
      setTimeout(() => {
        handleTriggerDownload();
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
          padding: 0;
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .resource-learn-box .resource-point-item,
        .resource-learn-box li {
          font-size: 13.5px;
          color: #CBD5E1;
          line-height: 1.5;
          display: flex;
          align-items: flex-start;
          gap: 11px;
          padding: 8px 12px;
          background: rgba(10, 17, 30, 0.45);
          border: 1px solid rgba(203, 213, 225, 0.08);
          border-left: 3px solid rgba(0, 210, 255, 0.25);
          border-radius: 6px;
          transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: default;
        }

        .resource-learn-box .resource-point-item:hover,
        .resource-learn-box li:hover {
          transform: translateX(4px);
          background: rgba(16, 27, 46, 0.8);
          border-color: rgba(0, 210, 255, 0.3);
          border-left-color: #00D2FF;
          color: #FFFFFF;
        }

        .resource-point-symbol {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          min-width: 20px;
          min-height: 20px;
          border-radius: 5px;
          background: rgba(0, 70, 252, 0.15);
          border: 1px solid rgba(0, 210, 255, 0.35);
          color: #00D2FF;
          margin-top: 1px;
          box-shadow: 0 0 8px rgba(0, 210, 255, 0.15);
          transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
          flex-shrink: 0;
        }

        .resource-point-item:hover .resource-point-symbol {
          transform: scale(1.18) rotate(5deg);
          background: linear-gradient(135deg, #0046FC, #00D2FF);
          border-color: #00D2FF;
          color: #FFFFFF;
          box-shadow: 0 0 12px rgba(0, 210, 255, 0.6);
        }

        .resource-point-text {
          flex: 1;
        }

        .resource-faq-section {
          margin-top: 28px;
        }

        .resource-faq-section h4 {
          margin: 0 0 14px;
          font-size: 18px;
          color: #FFFFFF;
          font-weight: 800;
        }

        .resource-faq-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .resource-faq-card {
          background: #0D1522;
          border: 1px solid rgba(203, 213, 225, 0.14);
          border-radius: 10px;
          overflow: hidden;
          transition: border-color 0.25s ease, box-shadow 0.25s ease;
        }

        .resource-faq-card[open] {
          border-color: rgba(0, 210, 255, 0.45);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
        }

        .resource-faq-question {
          list-style: none;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 15px 18px;
          cursor: pointer;
          user-select: none;
          font-size: 15px;
          font-weight: 700;
          color: #FFFFFF;
          line-height: 1.4;
        }

        .resource-faq-question::-webkit-details-marker {
          display: none;
        }

        .resource-faq-q-badge {
          flex-shrink: 0;
          width: 26px;
          height: 26px;
          border-radius: 6px;
          background: rgba(0, 210, 255, 0.14);
          border: 1px solid rgba(0, 210, 255, 0.35);
          color: #00D2FF;
          font-size: 12px;
          font-weight: 800;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .resource-faq-q-text {
          flex: 1;
        }

        .resource-faq-chevron {
          flex-shrink: 0;
          width: 8px;
          height: 8px;
          border-right: 2px solid #94A3B8;
          border-bottom: 2px solid #94A3B8;
          transform: rotate(45deg);
          transition: transform 0.25s ease, border-color 0.25s ease;
          margin-right: 4px;
        }

        .resource-faq-card[open] .resource-faq-chevron {
          transform: rotate(-135deg);
          border-color: #00D2FF;
        }

        .resource-faq-answer {
          padding: 14px 18px 16px;
          border-top: 1px solid rgba(203, 213, 225, 0.1);
          background: rgba(6, 11, 18, 0.55);
        }

        .resource-faq-answer p {
          margin: 0;
          font-size: 14px;
          line-height: 1.65;
          color: #CBD5E1;
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

        .resource-form-grid-1 {
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
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

              {(res.showCategoryBadge !== false && formConfig.metaBar?.showCategory !== false) ||
              (res.showFormatBadge !== false && formConfig.metaBar?.showFormat !== false) ||
              (res.showAccessBadge !== false && formConfig.metaBar?.showAccessBadge !== false) ||
              (res.showDownloadCount !== false && formConfig.metaBar?.showDownloadCount !== false) ? (
                <div className="resource-meta-bar">
                  {res.showCategoryBadge !== false && formConfig.metaBar?.showCategory !== false && (
                    <span>📁 {res.category}</span>
                  )}
                  {res.showFormatBadge !== false && formConfig.metaBar?.showFormat !== false && (
                    <span>
                      {res.formatBadgeText?.trim()
                        ? res.formatBadgeText.trim().match(/^(📄|🖼️|🎥|📝|📦)/)
                          ? res.formatBadgeText.trim()
                          : `${
                              effectiveFileType === "image"
                                ? "🖼️"
                                : effectiveFileType === "video"
                                ? "🎥"
                                : effectiveFileType === "word"
                                ? "📝"
                                : effectiveFileType === "any"
                                ? "📦"
                                : "📄"
                            } ${res.formatBadgeText.trim()}`
                        : effectiveFileType === "image"
                        ? "🖼️ Format: High-Res Image"
                        : effectiveFileType === "video"
                        ? "🎥 Format: High-Def Video"
                        : effectiveFileType === "word"
                        ? "📝 Format: Word Document"
                        : effectiveFileType === "any"
                        ? "📦 Format: Custom File"
                        : "📄 Format: PDF Document"}
                    </span>
                  )}
                  {res.showAccessBadge !== false && formConfig.metaBar?.showAccessBadge !== false && (
                    <span>
                      🔒{" "}
                      {res.accessBadgeText?.trim() ||
                        formConfig.metaBar?.defaultAccessBadgeText ||
                        "Enterprise Research"}
                    </span>
                  )}
                  {res.showDownloadCount !== false && formConfig.metaBar?.showDownloadCount !== false && (
                    <span>
                      📥 {res.downloadCount || 0}{" "}
                      {formConfig.metaBar?.downloadsSuffix || "Downloads"}
                    </span>
                  )}
                </div>
              ) : null}

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
                <ul className="resource-points-list">
                  {[
                    "Strategic frameworks for aligning IT capabilities with operational business goals.",
                    "Total Economic Impact data including cost savings, deployment timetables, and ROI metrics.",
                    "Best practices for risk mitigation, zero-trust security compliance, and vendor rotation.",
                    "Actionable executive checklist ready for immediate internal stakeholder distribution."
                  ].map((item, idx) => (
                    <li key={idx} className="resource-point-item">
                      <span className="resource-point-symbol" aria-hidden="true">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </span>
                      <span className="resource-point-text">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* QUESTIONS WE OFTEN HEAR (Q&A ACCORDION) */}
              <div className="resource-faq-section">
                <h4>Questions We Often Hear</h4>
                <div className="resource-faq-list">
                  {(
                    res.faqs || [
                      {
                        question: `What file format will I receive when downloading "${res.title}"?`,
                        answer:
                          effectiveFileType === "image"
                            ? `You will receive an instant high-resolution visual blueprint (${effectiveFileName || "Image Asset"}) ready for team presentations and strategy reviews.`
                            : effectiveFileType === "video"
                            ? `You will receive instant access to the high-definition executive video walkthrough (${effectiveFileName || "MP4 Video Asset"}).`
                            : effectiveFileType === "word"
                            ? `You will receive the editable Microsoft Word document (${effectiveFileName || "Word Document"}) immediately upon submitting the form.`
                            : `You will receive the complete executive ${res.type || "research document"} (${effectiveFileName || "PDF Document"}) immediately upon submitting the form.`,
                      },
                      {
                        question: `Who is this ${res.type || "resource"} designed for?`,
                        answer: `This ${res.type || "publication"} is tailored for Director-level and above leaders in ${res.category || "Enterprise Technology"}, Revenue Operations, Marketing, and IT who are evaluating scalable B2B pipeline and infrastructure strategies.`,
                      },
                      {
                        question: "Can I share this downloaded asset with my internal buying committee?",
                        answer:
                          "Yes. Once unlocked via the form, you are welcome to distribute the downloaded file across your internal executive, sales, and technical evaluation teams.",
                      },
                    ]
                  ).map((faq: { question: string; answer: string }, idx: number) => (
                    <details
                      key={faq.question}
                      className="resource-faq-card"
                      open={idx === 0}
                    >
                      <summary className="resource-faq-question">
                        <span className="resource-faq-q-text">{faq.question}</span>
                        <span className="resource-faq-chevron" aria-hidden="true" />
                      </summary>
                      <div className="resource-faq-answer">
                        <p>{faq.answer}</p>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT: EXACT "GET IT NOW!" GATED FORM (DYNAMIC CONFIGURATION) */}
            <div className="resource-form-card">
              <div className="resource-form-header">
                <h3>{formConfig.headerTitle || "GET IT NOW!"}</h3>
                <p>
                  <span className="pulse-dot" /> {formConfig.subtitle || "Instant Access • Verified Research"}
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
                    onClick={handleTriggerDownload}
                    className="resource-download-file-btn"
                  >
                    {effectiveFileType === "image"
                      ? `🖼️ Download Image (${effectiveFileName || "Asset"})`
                      : effectiveFileType === "video"
                      ? `🎥 Download Video (${effectiveFileName || "Asset"})`
                      : effectiveFileType === "word"
                      ? `📝 Download Word Doc (${effectiveFileName || "Document.doc"})`
                      : effectiveFileType === "any"
                      ? `📦 Download File (${effectiveFileName || "Asset"})`
                      : `📄 Download PDF (${effectiveFileName || "Document.pdf"})`}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {errorMsg && <div className="resource-form-error">{errorMsg}</div>}

                  {/* ROW 1: FIRST & LAST NAME */}
                  {(formConfig.fields.firstName?.enabled || formConfig.fields.lastName?.enabled) && (
                    <div
                      className={
                        formConfig.fields.firstName?.enabled && formConfig.fields.lastName?.enabled
                          ? "resource-form-grid-2"
                          : "resource-form-grid-1"
                      }
                    >
                      {formConfig.fields.firstName?.enabled && (
                        <div className="resource-form-group">
                          <label className="resource-form-label">
                            {formConfig.fields.firstName.label || "First Name"}
                            {formConfig.fields.firstName.required && <span className="req">*</span>}
                          </label>
                          <input
                            type="text"
                            required={formConfig.fields.firstName.required}
                            placeholder="John"
                            className="resource-form-input"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                          />
                        </div>
                      )}
                      {formConfig.fields.lastName?.enabled && (
                        <div className="resource-form-group">
                          <label className="resource-form-label">
                            {formConfig.fields.lastName.label || "Last Name"}
                            {formConfig.fields.lastName.required && <span className="req">*</span>}
                          </label>
                          <input
                            type="text"
                            required={formConfig.fields.lastName.required}
                            placeholder="Doe"
                            className="resource-form-input"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* ROW 2: CORPORATE EMAIL & TELEPHONE */}
                  {(formConfig.fields.email?.enabled || formConfig.fields.telephone?.enabled) && (
                    <div
                      className={
                        formConfig.fields.email?.enabled && formConfig.fields.telephone?.enabled
                          ? "resource-form-grid-2"
                          : "resource-form-grid-1"
                      }
                    >
                      {formConfig.fields.email?.enabled && (
                        <div className="resource-form-group">
                          <label className="resource-form-label">
                            {formConfig.fields.email.label || "Corporate Email"}
                            {formConfig.fields.email.required && <span className="req">*</span>}
                          </label>
                          <input
                            type="email"
                            required={formConfig.fields.email.required}
                            placeholder="name@company.com"
                            className="resource-form-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                      )}
                      {formConfig.fields.telephone?.enabled && (
                        <div className="resource-form-group">
                          <label className="resource-form-label">
                            {formConfig.fields.telephone.label || "Telephone"}
                            {formConfig.fields.telephone.required && <span className="req">*</span>}
                          </label>
                          <input
                            type="tel"
                            required={formConfig.fields.telephone.required}
                            placeholder="+1 (555) 000-0000"
                            className="resource-form-input"
                            value={telephone}
                            onChange={(e) => setTelephone(e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* ROW 3: COMPANY NAME & JOB TITLE */}
                  {(formConfig.fields.companyName?.enabled || formConfig.fields.jobTitle?.enabled) && (
                    <div
                      className={
                        formConfig.fields.companyName?.enabled && formConfig.fields.jobTitle?.enabled
                          ? "resource-form-grid-2"
                          : "resource-form-grid-1"
                      }
                    >
                      {formConfig.fields.companyName?.enabled && (
                        <div className="resource-form-group">
                          <label className="resource-form-label">
                            {formConfig.fields.companyName.label || "Company Name"}
                            {formConfig.fields.companyName.required && <span className="req">*</span>}
                          </label>
                          <input
                            type="text"
                            required={formConfig.fields.companyName.required}
                            placeholder="Acme Corp"
                            className="resource-form-input"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                          />
                        </div>
                      )}
                      {formConfig.fields.jobTitle?.enabled && (
                        <div className="resource-form-group">
                          <label className="resource-form-label">
                            {formConfig.fields.jobTitle.label || "Job Title"}
                            {formConfig.fields.jobTitle.required && <span className="req">*</span>}
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
                      )}
                    </div>
                  )}

                  {/* ROW 4: INDUSTRY & COMPANY SIZE */}
                  {(formConfig.fields.industry?.enabled || formConfig.fields.companySize?.enabled) && (
                    <div
                      className={
                        formConfig.fields.industry?.enabled && formConfig.fields.companySize?.enabled
                          ? "resource-form-grid-2"
                          : "resource-form-grid-1"
                      }
                    >
                      {formConfig.fields.industry?.enabled && (
                        <div className="resource-form-group">
                          <label className="resource-form-label">
                            {formConfig.fields.industry.label || "Industry"}
                            {formConfig.fields.industry.required && <span className="req">*</span>}
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
                      )}
                      {formConfig.fields.companySize?.enabled && (
                        <div className="resource-form-group">
                          <label className="resource-form-label">
                            {formConfig.fields.companySize.label || "Company Size"}
                            {formConfig.fields.companySize.required && <span className="req">*</span>}
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
                      )}
                    </div>
                  )}

                  {/* ROW 5: COUNTRY & CITY */}
                  {(formConfig.fields.country?.enabled || formConfig.fields.city?.enabled) && (
                    <div
                      className={
                        formConfig.fields.country?.enabled && formConfig.fields.city?.enabled
                          ? "resource-form-grid-2"
                          : "resource-form-grid-1"
                      }
                    >
                      {formConfig.fields.country?.enabled && (
                        <div className="resource-form-group">
                          <label className="resource-form-label">
                            {formConfig.fields.country.label || "Country"}
                            {formConfig.fields.country.required && <span className="req">*</span>}
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
                      )}
                      {formConfig.fields.city?.enabled && (
                        <div className="resource-form-group">
                          <label className="resource-form-label">
                            {formConfig.fields.city.label || "City"}
                            {formConfig.fields.city.required && <span className="req">*</span>}
                          </label>
                          <input
                            type="text"
                            required={formConfig.fields.city.required}
                            placeholder="New York"
                            className="resource-form-input"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* ROW 6: ADDRESS & POSTAL CODE */}
                  {(formConfig.fields.address?.enabled || formConfig.fields.postalCode?.enabled) && (
                    <div
                      className={
                        formConfig.fields.address?.enabled && formConfig.fields.postalCode?.enabled
                          ? "resource-form-grid-2"
                          : "resource-form-grid-1"
                      }
                    >
                      {formConfig.fields.address?.enabled && (
                        <div className="resource-form-group">
                          <label className="resource-form-label">
                            {formConfig.fields.address.label || "Address"}
                            {formConfig.fields.address.required && <span className="req">*</span>}
                          </label>
                          <input
                            type="text"
                            required={formConfig.fields.address.required}
                            placeholder="123 Market St"
                            className="resource-form-input"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                          />
                        </div>
                      )}
                      {formConfig.fields.postalCode?.enabled && (
                        <div className="resource-form-group">
                          <label className="resource-form-label">
                            {formConfig.fields.postalCode.label || "Postal Code"}
                            {formConfig.fields.postalCode.required && <span className="req">*</span>}
                          </label>
                          <input
                            type="text"
                            required={formConfig.fields.postalCode.required}
                            placeholder="10001"
                            className="resource-form-input"
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* CUSTOM DYNAMIC FIELDS */}
                  {customFieldsList.map((cf) => (
                    <div
                      key={cf.id}
                      className="resource-form-group"
                      style={{ gridColumn: cf.type === "textarea" ? "1 / -1" : undefined }}
                    >
                      <label className="resource-form-label">
                        {cf.label}
                        {cf.required && <span className="req">*</span>}
                      </label>
                      {cf.type === "select" ? (
                        <select
                          className="resource-form-select"
                          required={cf.required}
                          value={customValues[cf.id] || ""}
                          onChange={(e) =>
                            setCustomValues((prev) => ({ ...prev, [cf.id]: e.target.value }))
                          }
                        >
                          <option value="">Select {cf.label}...</option>
                          {(cf.options || []).map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      ) : cf.type === "textarea" ? (
                        <textarea
                          className="resource-form-input"
                          style={{ minHeight: "80px", resize: "vertical" }}
                          rows={3}
                          required={cf.required}
                          placeholder={cf.placeholder || `Enter ${cf.label}...`}
                          value={customValues[cf.id] || ""}
                          onChange={(e) =>
                            setCustomValues((prev) => ({ ...prev, [cf.id]: e.target.value }))
                          }
                        />
                      ) : cf.type === "checkbox" ? (
                        <div className="resource-checkbox-wrap">
                          <input
                            type="checkbox"
                            id={`res-${cf.id}`}
                            checked={Boolean(customValues[cf.id])}
                            onChange={(e) =>
                              setCustomValues((prev) => ({ ...prev, [cf.id]: e.target.checked }))
                            }
                          />
                          <label htmlFor={`res-${cf.id}`}>
                            {cf.placeholder || cf.label}
                            {cf.required && <span className="req">*</span>}
                          </label>
                        </div>
                      ) : (
                        <input
                          type={cf.type || "text"}
                          className="resource-form-input"
                          required={cf.required}
                          placeholder={cf.placeholder || `Enter ${cf.label}...`}
                          value={customValues[cf.id] || ""}
                          onChange={(e) =>
                            setCustomValues((prev) => ({ ...prev, [cf.id]: e.target.value }))
                          }
                        />
                      )}
                    </div>
                  ))}

                  {/* CHECKBOX 1: MARKETING OPT-IN */}
                  {formConfig.fields.optInMarketing?.enabled && (
                    <div className="resource-checkbox-wrap">
                      <input
                        type="checkbox"
                        id="optInMarketing"
                        checked={optInMarketing}
                        required={formConfig.fields.optInMarketing.required}
                        onChange={(e) => setOptInMarketing(e.target.checked)}
                      />
                      <label htmlFor="optInMarketing">
                        {formConfig.fields.optInMarketing.label ||
                          "I would like to receive information from suppliers sponsoring this content and willing to share the information above with OnDot Media."}
                        {formConfig.fields.optInMarketing.required && <span className="req">*</span>}
                      </label>
                    </div>
                  )}

                  {/* CHECKBOX 2: PARTNER OPT-IN */}
                  {formConfig.fields.optInPartner?.enabled && (
                    <div className="resource-checkbox-wrap">
                      <input
                        type="checkbox"
                        id="optInPartner"
                        checked={optInPartner}
                        required={formConfig.fields.optInPartner.required}
                        onChange={(e) => setOptInPartner(e.target.checked)}
                      />
                      <label htmlFor="optInPartner">
                        {formConfig.fields.optInPartner.label ||
                          "By checking this box, I agree that OnDot Media can share my data with Partners so that Partners can contact me by email or phone and provide more information about this content."}
                        {formConfig.fields.optInPartner.required && <span className="req">*</span>}
                      </label>
                    </div>
                  )}

                  {/* SUBMIT BUTTON */}
                  <button
                    type="submit"
                    className="resource-submit-btn"
                    disabled={submitting}
                  >
                    {submitting
                      ? "Processing..."
                      : formConfig.submitButtonText ||
                        (res.downloadFileType === "image"
                          ? "DOWNLOAD IMAGE NOW! →"
                          : res.downloadFileType === "video"
                          ? "DOWNLOAD VIDEO NOW! →"
                          : "DOWNLOAD NOW! →")}
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
                      <button
                        type="button"
                        className="resource-card-btn"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          downloadResourceAsset(
                            {
                              title: item.title,
                              type: item.type,
                              category: item.category,
                              summary: item.summary,
                              content: item.content,
                              coverImage: item.coverImage,
                            },
                            item.fileUrl,
                            item.downloadFileType,
                            item.downloadFileName
                          );
                        }}
                      >
                        Download Now <span className="arrow-icon">→</span>
                      </button>
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

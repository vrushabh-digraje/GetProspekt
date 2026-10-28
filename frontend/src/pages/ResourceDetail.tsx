import React, { useState, useEffect } from "react";
import EditorialCoverImage from "../components/EditorialCoverImage";
import { useParams, Link } from "react-router-dom";
import { resourcesApi, enquiriesApi, formConfigApi, type GatedFormConfig } from "../services/api";
import { downloadResourceAsset } from "../utils/pdfGenerator";

const countryOptions = [
  "India",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "Singapore",
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


const ResourceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [resource, setResource] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [formConfig, setFormConfig] = useState<GatedFormConfig>(() => formConfigApi.get());

  // Form State (matching EnterpriseTalk & Veeam B2B gated format)
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [country, setCountry] = useState("India");
  const [companyName, setCompanyName] = useState("");
  const [companySize, setCompanySize] = useState("51 - 200 employees");
  const [stateProvince, setStateProvince] = useState("");
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
    "firstName", "lastName", "email", "telephone", "country", "companyName",
    "companySize", "state", "city", "address", "postalCode", "industry", "jobTitle",
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
    title: "Analyse approfondie de l'intégration : comment Veeam Data Platform et Veeam Vault créent une solution de protection prête pour l'avenir",
    sponsor: "Veeam",
    sponsorLogo: "veeam",
    collection: "The EnterpriseTalk Conversion Collection",
    language: "fr",
    type: "Whitepaper",
    category: "Cybersecurity",
    coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=85",
    summary: "Votre organisation peut-elle réellement restaurer ses données après une attaque ? Alors que 90 % répondent par l'affirmative en toute confiance, seuls 28 % des victimes de ransomware ont réellement restauré leurs données, ce qui révèle un écart entre croyance et réalité.",
    content: "Cet e-book d'immersion sur l'intégration explique comment Veeam Data Platform et Veeam Vault comblent cet écart. Cela inclut une sauvegarde basée sur les stratégies qui est directement dirigée vers un stockage inaltérable et un stockage entièrement isolé de façon logique, sans intervention manuelle, sans outils supplémentaires et sans frais de sortie imprévus lors de la restauration.",
    fileUrl: "",
    downloadFileType: "pdf",
    downloadFileName: "Veeam-Data-Platform-Vault-Integration-DeepDive.pdf",
  };

  const isFrench = res.language === "fr" || /Analyse approfondie|comment Veeam/i.test(res.title || "");

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
      missing.push(fields.firstName.label || (isFrench ? "Prénom" : "First Name"));
    }
    if (fields.lastName?.enabled && fields.lastName?.required && !lastName.trim()) {
      missing.push(fields.lastName.label || (isFrench ? "Nom de famille" : "Last Name"));
    }
    if (fields.email?.enabled && fields.email?.required && !email.trim()) {
      missing.push(fields.email.label || (isFrench ? "E-mail" : "Corporate Email"));
    }
    if (fields.telephone?.enabled && fields.telephone?.required && !telephone.trim()) {
      missing.push(fields.telephone.label || (isFrench ? "Téléphone" : "Telephone"));
    }
    if (fields.companyName?.enabled && fields.companyName?.required && !companyName.trim()) {
      missing.push(fields.companyName.label || (isFrench ? "Nom de l'entreprise" : "Company Name"));
    }
    if (fields.jobTitle?.enabled && fields.jobTitle?.required && !jobTitle.trim()) {
      missing.push(fields.jobTitle.label || (isFrench ? "Titre d'emploi" : "Job Title"));
    }
    if (fields.industry?.enabled && fields.industry?.required && !industry.trim()) {
      missing.push(fields.industry.label || (isFrench ? "Industrie" : "Industry"));
    }
    if (fields.companySize?.enabled && fields.companySize?.required && !companySize.trim()) {
      missing.push(fields.companySize.label || (isFrench ? "Taille de l'entreprise" : "Company Size"));
    }
    if (fields.country?.enabled && fields.country?.required && !country.trim()) {
      missing.push(fields.country.label || (isFrench ? "Pays" : "Country"));
    }
    if (fields.state?.enabled && fields.state?.required && !stateProvince.trim()) {
      missing.push(fields.state.label || (isFrench ? "État" : "State / Province"));
    }
    if (fields.city?.enabled && fields.city?.required && !city.trim()) {
      missing.push(fields.city.label || (isFrench ? "Ville" : "City"));
    }
    if (fields.address?.enabled && fields.address?.required && !address.trim()) {
      missing.push(fields.address.label || (isFrench ? "Adresse" : "Address"));
    }
    if (fields.postalCode?.enabled && fields.postalCode?.required && !postalCode.trim()) {
      missing.push(fields.postalCode.label || (isFrench ? "Code Postal" : "Postal Code"));
    }
    if (fields.optInMarketing?.enabled && fields.optInMarketing?.required && !optInMarketing) {
      missing.push(fields.optInMarketing.label || "Marketing Opt-in");
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
      setErrorMsg(
        isFrench
          ? `Veuillez renseigner tous les champs obligatoires : ${missing.join(", ")}`
          : `Please fill in all required fields: ${missing.join(", ")}`
      );
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
        state: stateProvince.trim(),
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
        message: `Lead downloaded ${resource?.type || "Whitepaper"}: ${resource?.title || "Resource"}. Company: ${companyName}, Size: ${companySize}, State: ${stateProvince}, Industry: ${industry}, Job Title: ${jobTitle}, Phone: ${telephone}`,
      });

      if (resource?._id) {
        const nextCount = (resource.downloadCount || 0) + 1;
        resourcesApi.update(resource._id, {
          downloadCount: nextCount,
        });
        setResource((prev: any) => (prev ? { ...prev, downloadCount: nextCount } : prev));
      }

      setSubmitted(true);
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
        /* =========================================================================
           ENTERPRISE B2B WHITEPAPER & E-BOOK LANDING PAGE (BENCHMARK FORMAT)
        ========================================================================= */
        .resource-detail-page {
          min-height: 100vh;
          background: #060B12;
          background-image: 
            radial-gradient(circle at 82% 24%, rgba(0, 163, 196, 0.16) 0%, transparent 48%),
            radial-gradient(circle at 18% 62%, rgba(0, 70, 252, 0.16) 0%, transparent 52%),
            linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
          background-size: 100% 100%, 100% 100%, 56px 56px, 56px 56px;
          color: #D5DBE7;
          padding: 28px 0 90px;
          font-family: var(--font-sans);
          position: relative;
          overflow-x: hidden;
        }

        /* AMBIENT TECH GRAPHIC WATERMARK */
        .resource-detail-page::before {
          content: "";
          position: absolute;
          top: 140px;
          left: 5%;
          width: 520px;
          height: 520px;
          background: radial-gradient(circle, rgba(0, 210, 255, 0.05) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .resource-detail-container {
          width: min(1400px, calc(100% - 48px));
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        /* BREADCRUMB */
        .resource-breadcrumb {
          font-size: 13px;
          color: #64748B;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .resource-breadcrumb a {
          color: #00D2FF;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .resource-breadcrumb a:hover {
          color: #FFFFFF;
          text-decoration: underline;
        }

        /* 2-COLUMN SPLIT: LEFT CONTENT (60%) | RIGHT GATED FORM (40%) */
        .resource-split {
          display: grid;
          grid-template-columns: 1.15fr 0.95fr;
          gap: 48px;
          align-items: start;
        }

        @media (max-width: 1080px) {
          .resource-split {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }

        /* ================= LEFT CONTENT COLUMN ================= */
        .resource-content-col {
          display: flex;
          flex-direction: column;
        }



        /* HEADLINE TITLE */
        .resource-heading-title {
          font-size: clamp(26px, 3.2vw, 38px);
          font-weight: 800;
          line-height: 1.25;
          color: #FFFFFF;
          margin: 0 0 24px;
          letter-spacing: -0.015em;
        }

        /* EXECUTIVE ABSTRACT / LEAD HOOK */
        .resource-lead-abstract {
          font-size: 15.5px;
          line-height: 1.68;
          color: #CBD5E1;
          margin-bottom: 22px;
          text-align: justify;
          text-justify: inter-word;
          text-align-last: left;
          hyphens: auto;
          -webkit-hyphens: auto;
        }

        .resource-lead-abstract p {
          margin: 0 0 16px;
          text-align: justify;
          text-justify: inter-word;
          text-align-last: left;
          hyphens: auto;
          -webkit-hyphens: auto;
        }

        .resource-stat-highlight {
          color: #FFFFFF;
          font-weight: 700;
          display: block;
          text-align: justify;
          text-justify: inter-word;
          text-align-last: left;
          hyphens: auto;
          -webkit-hyphens: auto;
        }



        /* EDITORIAL COVER IMAGE WRAP */
        .resource-fixed-image-wrap {
          width: 100%;
          height: 380px;
          border-radius: 8px;
          overflow: hidden;
          background: #0D1522;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(203, 213, 225, 0.15);
          margin-bottom: 28px;
          border: 2px solid #0046FC;
          transition: all 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
          position: relative;
        }

        .resource-fixed-image-wrap:hover {
          border-color: #00D2FF;
          box-shadow: 0 20px 48px rgba(0, 70, 252, 0.4), 0 0 30px rgba(0, 210, 255, 0.25);
        }

        /* TEXT AFTER IMAGE */
        .resource-post-image-text {
          font-size: 15.5px;
          line-height: 1.72;
          color: #CBD5E1;
          margin-top: 6px;
          margin-bottom: 26px;
          text-align: justify;
          text-justify: inter-word;
          text-align-last: left;
          hyphens: auto;
          -webkit-hyphens: auto;
        }

        .resource-post-image-text p {
          margin: 0 0 16px;
          font-size: 15.5px;
          line-height: 1.72;
          color: #CBD5E1;
          text-align: justify;
          text-justify: inter-word;
          text-align-last: left;
          hyphens: auto;
          -webkit-hyphens: auto;
        }

        /* KEY TAKEAWAYS BOX */
        .resource-learn-box {
          background: #0D1522;
          border: 1px solid rgba(203, 213, 225, 0.14);
          border-radius: 8px;
          padding: 24px;
          margin-bottom: 26px;
        }

        .resource-learn-box h4 {
          margin: 0 0 14px;
          font-size: 16px;
          color: #FFFFFF;
          font-weight: 800;
          letter-spacing: -0.01em;
        }

        .resource-points-list {
          margin: 0;
          padding: 0;
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .resource-point-item {
          font-size: 14px;
          color: #CBD5E1;
          line-height: 1.5;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 10px 14px;
          background: rgba(10, 17, 30, 0.45);
          border: 1px solid rgba(203, 213, 225, 0.08);
          border-left: 3px solid #00D2FF;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .resource-point-item:hover {
          background: rgba(16, 27, 46, 0.8);
          color: #FFFFFF;
          transform: translateX(4px);
        }

        /* SINGLE CYAN SQUARE BULLET */
        .resource-point-square {
          width: 8px;
          height: 8px;
          background: #00D2FF;
          border-radius: 2px;
          flex-shrink: 0;
          margin-top: 6px;
          box-shadow: 0 0 8px rgba(0, 210, 255, 0.6);
        }

        /* SPECS GRID */
        .resource-specs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
          margin-bottom: 26px;
        }

        .resource-spec-item {
          background: rgba(13, 21, 34, 0.85);
          border: 1px solid rgba(203, 213, 225, 0.12);
          border-radius: 8px;
          padding: 12px 14px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .resource-spec-label {
          font-size: 11px;
          font-weight: 700;
          color: #00D2FF;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .resource-spec-value {
          font-size: 13.5px;
          font-weight: 600;
          color: #FFFFFF;
        }

        /* FAQ ACCORDION */
        .resource-faq-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .resource-faq-card {
          background: #0D1522;
          border: 1px solid rgba(203, 213, 225, 0.14);
          border-radius: 8px;
          overflow: hidden;
        }

        .resource-faq-question {
          list-style: none;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          cursor: pointer;
          font-size: 14.5px;
          font-weight: 700;
          color: #FFFFFF;
        }

        .resource-faq-question::-webkit-details-marker {
          display: none;
        }

        .resource-faq-answer {
          padding: 12px 16px 16px;
          border-top: 1px solid rgba(203, 213, 225, 0.1);
          background: rgba(6, 11, 18, 0.55);
          font-size: 13.5px;
          line-height: 1.6;
          color: #CBD5E1;
          text-align: justify;
          text-justify: inter-word;
          text-align-last: left;
          hyphens: auto;
          -webkit-hyphens: auto;
        }

        /* ================= RIGHT GATED FORM COLUMN (EXACT BENCHMARK FORM) ================= */
        .resource-form-card {
          background: rgba(18, 25, 38, 0.94);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 12px;
          padding: 30px 26px 28px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7), 0 0 35px rgba(0, 163, 196, 0.12);
          color: #D5DBE7;
          position: sticky;
          top: 85px;
        }

        .resource-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 12px;
        }

        .resource-form-col-full {
          grid-column: 1 / -1;
        }

        @media (max-width: 560px) {
          .resource-form-grid {
            grid-template-columns: 1fr;
            gap: 10px;
          }
          .resource-form-col-full {
            grid-column: 1;
          }
        }

        /* FORM INPUTS & DROPDOWNS (MATCHING SCREENSHOT) */
        .resource-input-wrap {
          position: relative;
          width: 100%;
        }

        .resource-b2b-input,
        .resource-b2b-select {
          width: 100%;
          height: 46px;
          background: #252D3C;
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 6px;
          padding: 0 14px;
          font-size: 13px;
          color: #FFFFFF;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
          font-family: inherit;
        }

        .resource-b2b-input::placeholder {
          color: #94A3B8;
          font-size: 12.5px;
        }

        .resource-b2b-input:hover,
        .resource-b2b-select:hover {
          border-color: rgba(0, 210, 255, 0.4);
          background: #2A3344;
        }

        .resource-b2b-input:focus,
        .resource-b2b-select:focus {
          border-color: #00D2FF;
          background: #263142;
          box-shadow: 0 0 0 3px rgba(0, 210, 255, 0.22);
        }

        .resource-b2b-select {
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 14px center;
          background-size: 16px;
          padding-right: 36px;
        }

        .resource-b2b-select option {
          background: #0D1522;
          color: #FFFFFF;
        }

        /* CHECKBOXES */
        .resource-consent-box {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-top: 14px;
          font-size: 11px;
          line-height: 1.45;
          color: #94A3B8;
        }

        .resource-consent-box input[type="checkbox"] {
          margin-top: 2px;
          flex-shrink: 0;
          cursor: pointer;
          accent-color: #00A3C4;
          width: 14px;
          height: 14px;
        }

        .resource-consent-box label {
          cursor: pointer;
          user-select: none;
        }

        .resource-consent-box label:hover {
          color: #CBD5E1;
        }

        /* SOLID TEAL / CYAN SUBMIT BUTTON (MATCHING SCREENSHOT) */
        .resource-submit-btn-teal {
          width: 100%;
          height: 50px;
          background: #00A3C4;
          color: #FFFFFF;
          border: 0;
          border-radius: 6px;
          margin-top: 18px;
          font-size: 15px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 18px rgba(0, 163, 196, 0.4);
        }

        .resource-submit-btn-teal:hover {
          background: #00BBE0;
          transform: translateY(-2px);
          box-shadow: 0 8px 26px rgba(0, 210, 255, 0.55);
        }

        .resource-submit-btn-teal:active {
          transform: translateY(0);
        }

        .resource-submit-btn-teal:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .resource-security-note {
          text-align: center;
          margin-top: 14px;
          font-size: 11px;
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
          padding: 10px 14px;
          border-radius: 6px;
          font-size: 12px;
          margin-bottom: 14px;
        }

        /* SUCCESS STATE */
        .resource-success-state {
          text-align: center;
          padding: 30px 10px;
        }

        .resource-success-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: rgba(0, 163, 196, 0.15);
          border: 2px solid #00A3C4;
          color: #00D2FF;
          font-size: 28px;
          margin-bottom: 16px;
        }

        .resource-success-state h4 {
          font-size: 22px;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0 0 10px;
        }

        .resource-success-state p {
          font-size: 14px;
          color: #94A3B8;
          line-height: 1.6;
          margin-bottom: 24px;
        }

        .resource-direct-download-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #00A3C4;
          color: #FFFFFF;
          padding: 14px 28px;
          border-radius: 6px;
          border: 0;
          cursor: pointer;
          font-size: 14.5px;
          font-weight: 800;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          text-decoration: none;
          box-shadow: 0 4px 18px rgba(0, 163, 196, 0.4);
          transition: all 0.2s ease;
        }

        .resource-direct-download-btn:hover {
          background: #00BBE0;
          transform: translateY(-2px);
          box-shadow: 0 8px 26px rgba(0, 210, 255, 0.55);
        }

        /* RELATED RESOURCES */
        .resource-related-section {
          margin-top: 75px;
          padding-top: 45px;
          border-top: 1px solid rgba(203, 213, 225, 0.12);
        }

        .resource-related-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-top: 24px;
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

        .resource-card {
          background: #0D1522;
          border-radius: 8px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          border: 1px solid rgba(203, 213, 225, 0.14);
          text-decoration: none;
          color: #D5DBE7;
          transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
        }

        .resource-card:hover {
          transform: translateY(-6px);
          border-color: #00D2FF;
          box-shadow: 0 16px 36px rgba(0, 70, 252, 0.35);
        }

        .resource-card-cover {
          width: 100%;
          height: 200px;
          background: #060B12;
          position: relative;
        }

        .resource-card-tag {
          position: absolute;
          bottom: 10px;
          right: 10px;
          background: rgba(0, 70, 252, 0.85);
          color: #FFFFFF;
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 700;
        }

        .resource-card-body {
          padding: 16px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .resource-card-title {
          font-size: 15px;
          font-weight: 700;
          color: #FFFFFF;
          line-height: 1.4;
          margin: 0 0 10px;
        }

        .resource-card-btn {
          margin-top: auto;
          width: 100%;
          background: #060B12;
          color: #00D2FF;
          border: 1px solid rgba(0, 210, 255, 0.3);
          padding: 9px;
          border-radius: 4px;
          font-weight: 700;
          font-size: 12.5px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all 0.2s ease;
        }

        .resource-card:hover .resource-card-btn {
          background: #00A3C4;
          color: #FFFFFF;
          border-color: #00A3C4;
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
            {/* ================= LEFT CONTENT COLUMN ================= */}
            <div className="resource-content-col">


              {/* BOLD HEADLINE */}
              <h1 className="resource-heading-title">{res.title}</h1>

              {/* EXECUTIVE ABSTRACT & LEAD PARAGRAPHS */}
              <div className="resource-lead-abstract">
                {res.summary && (
                  <p>
                    <span className="resource-stat-highlight">
                      {res.summary}
                    </span>
                  </p>
                )}

                {typeof res.content === "string" ? (
                  res.content.split("\n\n").map((block: string, idx: number) => {
                    const trimmed = block.trim();
                    if (trimmed.startsWith("### ")) {
                      return (
                        <h3
                          key={idx}
                          style={{
                            fontSize: "19px",
                            fontWeight: 800,
                            color: "#FFFFFF",
                            margin: "24px 0 10px",
                            paddingLeft: "12px",
                            borderLeft: "3px solid #00D2FF",
                          }}
                        >
                          {trimmed.replace(/^###\s*/, "")}
                        </h3>
                      );
                    }
                    return <p key={idx}>{trimmed}</p>;
                  })
                ) : (
                  <p>{res.content}</p>
                )}

                <p>
                  {isFrench
                    ? "Près de 60 % des décideurs IT pointent du doigt la croissance du multicloud et du SaaS en tant que coupable, ayant déjà diminué la visibilité de l'emplacement de leurs données. La protection et la restauration commencent toutes deux par la connaissance de l'emplacement de vos données et l'application systématique de règles d'immuabilité garanties."
                    : "Over 60% of enterprise technology and security leaders identify hybrid multi-cloud expansion and fragmented SaaS applications as primary drivers of visibility degradation. Comprehensive enterprise resilience demands deterministic data discovery paired with policy-driven immutability across distributed infrastructure."}
                </p>

              </div>



              {/* EDITORIAL COVER IMAGE BANNER */}
              <div className="resource-fixed-image-wrap">
                <EditorialCoverImage
                  title={res.title}
                  subtitle={res.summary}
                  category={res.type || res.category || "Research"}
                  photo={
                    res.coverImage ||
                    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=85"
                  }
                  variant="hero"
                />
              </div>

              {/* TEXT AFTER IMAGE (BALANCED EDITORIAL FLOW) */}
              <div className="resource-post-image-text">
                <p>
                  {isFrench
                    ? "Ce guide méthodologique complet fournit aux équipes d'infrastructure, de sécurité et d'architecture cloud les repères opérationnels indispensables pour auditer leur cyber-résilience, éliminer les coûts imprévus de rapatriement de données et garantir une reprise d'activité immédiate sans compromission."
                    : "This technical executive guide equips enterprise infrastructure, SecOps, and cloud engineering leaders with the operational frameworks required to validate disaster recovery pipelines, eliminate unpredictable egress overhead, and achieve rapid, uncompromised business continuity."}
                </p>
                <p>
                  {isFrench
                    ? "En combinant des données empiriques et des topologies de déploiement éprouvées, cette ressource détaille la transition vers une architecture de protection immuable, conçue pour résister aux attaques de rançongiciels les plus agressives tout en maintenant des coûts d'exploitation prévisibles."
                    : "By combining empirical benchmark telemetry with verified architectural topologies, this research publication details the practical migration towards zero-trust immutable storage, engineered to withstand aggressive ransomware threats while maintaining predictable operational economics."}
                </p>
              </div>

              {/* WHAT YOU WILL DISCOVER (KEY TAKEAWAYS) */}
              <div className="resource-learn-box">
                <h4>
                  {isFrench
                    ? "Points Clés & Architecture Stratégique :"
                    : "Key Executive Takeaways & Architecture :"}
                </h4>
                <ul className="resource-points-list">
                  {(res.takeaways && res.takeaways.length > 0
                    ? res.takeaways
                    : [
                        "Architectural frameworks for aligning IT resilience with operational business continuity.",
                        "Total Economic Impact data comparing immutable cloud vaults against legacy storage.",
                        "Zero-trust protocols preventing credential compromise and unauthorized data tampering.",
                        "Automated verification methodologies ready for immediate enterprise deployment.",
                      ]
                  ).map((item: string, idx: number) => (
                    <li key={idx} className="resource-point-item">
                      <span className="resource-point-square" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* TECHNICAL SPECS */}
              {res.specs && Array.isArray(res.specs) && res.specs.length > 0 && (
                <div className="resource-specs-grid">
                  {res.specs.map(([label, value]: [string, string], idx: number) => (
                    <div key={idx} className="resource-spec-item">
                      <span className="resource-spec-label">{label}</span>
                      <span className="resource-spec-value">{value}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* FAQS ACCORDION */}
              {res.faqs && Array.isArray(res.faqs) && res.faqs.length > 0 && (
                <div style={{ marginTop: "14px" }}>
                  <h4 style={{ fontSize: "16px", color: "#FFFFFF", fontWeight: 800, marginBottom: "12px" }}>
                    {isFrench ? "Questions Fréquemment Posées" : "Questions We Often Hear"}
                  </h4>
                  <div className="resource-faq-list">
                    {res.faqs.map((faq: { question: string; answer: string }, idx: number) => (
                      <details key={idx} className="resource-faq-card" open={idx === 0}>
                        <summary className="resource-faq-question">
                          <span>{faq.question}</span>
                          <span style={{ color: "#00D2FF" }}>▾</span>
                        </summary>
                        <div className="resource-faq-answer">
                          <p style={{ margin: 0 }}>{faq.answer}</p>
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ================= RIGHT GATED FORM COLUMN (MATCHING SCREENSHOT) ================= */}
            <div className="resource-form-card" id="gated-form">
              {submitted ? (
                <div className="resource-success-state">
                  <div className="resource-success-badge">✓</div>
                  <h4>{isFrench ? "Téléchargement Débloqué !" : "Download Unlocked!"}</h4>
                  <p>
                    {isFrench
                      ? `Votre accès a été validé. Une copie a également été envoyée à ${email}.`
                      : `Your access has been verified. A copy has also been sent to ${email}.`}
                  </p>
                  <button
                    type="button"
                    onClick={handleTriggerDownload}
                    className="resource-direct-download-btn"
                  >
                    {isFrench ? "TÉLÉCHARGER LE FICHIER (PDF)" : "DOWNLOAD FILE (PDF)"}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {errorMsg && <div className="resource-form-error">{errorMsg}</div>}

                  {/* 2-COLUMN INPUT GRID (EXACTLY AS IN BENCHMARK SCREENSHOT) */}
                  <div className="resource-form-grid">
                    {/* ROW 1: FIRST NAME & LAST NAME */}
                    {formConfig.fields.firstName?.enabled && (
                      <div className="resource-input-wrap">
                        <input
                          type="text"
                          required={formConfig.fields.firstName.required}
                          placeholder={isFrench ? "Prénom*" : "First Name*"}
                          className="resource-b2b-input"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                        />
                      </div>
                    )}

                    {formConfig.fields.lastName?.enabled && (
                      <div className="resource-input-wrap">
                        <input
                          type="text"
                          required={formConfig.fields.lastName.required}
                          placeholder={isFrench ? "Nom de famille*" : "Last Name*"}
                          className="resource-b2b-input"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                        />
                      </div>
                    )}

                    {/* ROW 2: E-MAIL & TELEPHONE */}
                    {formConfig.fields.email?.enabled && (
                      <div className="resource-input-wrap">
                        <input
                          type="email"
                          required={formConfig.fields.email.required}
                          placeholder={isFrench ? "E-mail*" : "Work E-mail*"}
                          className="resource-b2b-input"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    )}

                    {formConfig.fields.telephone?.enabled && (
                      <div className="resource-input-wrap">
                        <input
                          type="tel"
                          required={formConfig.fields.telephone.required}
                          placeholder={isFrench ? "Téléphone*" : "Telephone*"}
                          className="resource-b2b-input"
                          value={telephone}
                          onChange={(e) => setTelephone(e.target.value)}
                        />
                      </div>
                    )}

                    {/* ROW 3: COUNTRY & COMPANY NAME */}
                    {formConfig.fields.country?.enabled && (
                      <div className="resource-input-wrap">
                        <select
                          className="resource-b2b-select"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                        >
                          <option value="">{isFrench ? "Pays*" : "Country*"}</option>
                          {countryOptions.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {formConfig.fields.companyName?.enabled && (
                      <div className="resource-input-wrap">
                        <input
                          type="text"
                          required={formConfig.fields.companyName.required}
                          placeholder={isFrench ? "Nom de l'entreprise*" : "Company Name*"}
                          className="resource-b2b-input"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                        />
                      </div>
                    )}

                    {/* ROW 4: COMPANY SIZE & STATE */}
                    {formConfig.fields.companySize?.enabled && (
                      <div className="resource-input-wrap">
                        <select
                          className="resource-b2b-select"
                          value={companySize}
                          onChange={(e) => setCompanySize(e.target.value)}
                        >
                          <option value="">{isFrench ? "Taille de l'entreprise*" : "Company Size*"}</option>
                          {companySizeOptions.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {formConfig.fields.state?.enabled !== false && (
                      <div className="resource-input-wrap">
                        <input
                          type="text"
                          required={formConfig.fields.state?.required}
                          placeholder={isFrench ? "État*" : "State / Province*"}
                          className="resource-b2b-input"
                          value={stateProvince}
                          onChange={(e) => setStateProvince(e.target.value)}
                        />
                      </div>
                    )}

                    {/* ROW 5: CITY & ADDRESS */}
                    {formConfig.fields.city?.enabled && (
                      <div className="resource-input-wrap">
                        <input
                          type="text"
                          required={formConfig.fields.city.required}
                          placeholder={isFrench ? "Ville*" : "City*"}
                          className="resource-b2b-input"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                        />
                      </div>
                    )}

                    {formConfig.fields.address?.enabled && (
                      <div className="resource-input-wrap">
                        <input
                          type="text"
                          required={formConfig.fields.address.required}
                          placeholder={isFrench ? "Adresse*" : "Address*"}
                          className="resource-b2b-input"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                        />
                      </div>
                    )}

                    {/* ROW 6: POSTAL CODE & INDUSTRY */}
                    {formConfig.fields.postalCode?.enabled && (
                      <div className="resource-input-wrap">
                        <input
                          type="text"
                          required={formConfig.fields.postalCode.required}
                          placeholder={isFrench ? "Code Postal*" : "Postal Code*"}
                          className="resource-b2b-input"
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                        />
                      </div>
                    )}

                    {formConfig.fields.industry?.enabled && (
                      <div className="resource-input-wrap">
                        <select
                          className="resource-b2b-select"
                          value={industry}
                          onChange={(e) => setIndustry(e.target.value)}
                        >
                          <option value="">{isFrench ? "Industrie*" : "Industry*"}</option>
                          {industryOptions.map((ind) => (
                            <option key={ind} value={ind}>
                              {ind}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* ROW 7: JOB TITLE (FULL WIDTH / SPANS 2 COLUMNS) */}
                    {formConfig.fields.jobTitle?.enabled && (
                      <div className="resource-input-wrap resource-form-col-full">
                        <input
                          type="text"
                          required={formConfig.fields.jobTitle.required}
                          placeholder={isFrench ? "Titre d'emploi*" : "Job Title*"}
                          className="resource-b2b-input"
                          value={jobTitle}
                          onChange={(e) => setJobTitle(e.target.value)}
                        />
                      </div>
                    )}
                  </div>

                  {/* CUSTOM DYNAMIC FIELDS (IF ADDED VIA ADMIN) */}
                  {customFieldsList.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "12px" }}>
                      {customFieldsList.map((cf) => (
                        <div key={cf.id} className="resource-input-wrap">
                          {cf.type === "select" ? (
                            <select
                              className="resource-b2b-select"
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
                          ) : (
                            <input
                              type={cf.type || "text"}
                              className="resource-b2b-input"
                              required={cf.required}
                              placeholder={`${cf.label}${cf.required ? "*" : ""}`}
                              value={customValues[cf.id] || ""}
                              onChange={(e) =>
                                setCustomValues((prev) => ({ ...prev, [cf.id]: e.target.value }))
                              }
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* CHECKBOX 1: SUPPLIER / SPONSOR MARKETING */}
                  {formConfig.fields.optInMarketing?.enabled && (
                    <div className="resource-consent-box">
                      <input
                        type="checkbox"
                        id="optInMarketing"
                        checked={optInMarketing}
                        required={formConfig.fields.optInMarketing.required}
                        onChange={(e) => setOptInMarketing(e.target.checked)}
                      />
                      <label htmlFor="optInMarketing">
                        {isFrench
                          ? "J'aimerais recevoir des informations de fournisseurs sponsorisant ce contenu et disposés à partager les informations ci-dessus avec EnterpriseTalk."
                          : formConfig.fields.optInMarketing.label ||
                            "I would like to receive information from suppliers sponsoring this content and willing to share the information above with GETprospeKt."}
                      </label>
                    </div>
                  )}

                  {/* CHECKBOX 2: PARTNER DATA SHARING CONSENT */}
                  {formConfig.fields.optInPartner?.enabled && (
                    <div className="resource-consent-box">
                      <input
                        type="checkbox"
                        id="optInPartner"
                        checked={optInPartner}
                        required={formConfig.fields.optInPartner.required}
                        onChange={(e) => setOptInPartner(e.target.checked)}
                      />
                      <label htmlFor="optInPartner">
                        {isFrench
                          ? "En cochant cette case, j'accepte qu'EnterpriseTalk partage mes données avec des partenaires afin que ceux-ci puissent me contacter par e-mail ou par téléphone et me fournir plus d'informations sur ce contenu."
                          : formConfig.fields.optInPartner.label ||
                            "By checking this box, I agree that GETprospeKt can share my data with partners so that they can contact me by email or phone and provide more information about this content."}
                      </label>
                    </div>
                  )}

                  {/* SOLID TEAL / CYAN SUBMIT BUTTON */}
                  <button
                    type="submit"
                    className="resource-submit-btn-teal"
                    disabled={submitting}
                  >
                    {submitting
                      ? (isFrench ? "Traitement..." : "Processing...")
                      : isFrench
                      ? "TÉLÉCHARGER MAINTENANT"
                      : formConfig.submitButtonText || "DOWNLOAD NOW"}
                  </button>

                  {/* TRUST NOTE */}
                  <div className="resource-security-note">
                    🔒 256-Bit Encrypted • Confidential Enterprise Access • Instant Access
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* RELATED RESOURCES SECTION */}
          {relatedResources.length > 0 && (
            <div className="resource-related-section">
              <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#FFFFFF", marginBottom: "6px" }}>
                {isFrench ? "Autres Livres Blancs & Recherches Exécutives" : "Related Whitepapers & Executive Playbooks"}
              </h2>
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
                      <EditorialCoverImage
                        title={item.title}
                        subtitle={item.summary}
                        category={item.type || item.category || "Research"}
                        photo={
                          item.coverImage ||
                          "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=85"
                        }
                        variant="card"
                      />
                      <span className="resource-card-tag">{item.type || "Whitepaper"}</span>
                    </div>
                    <div className="resource-card-body">
                      <h3 className="resource-card-title">{item.title}</h3>
                      <button type="button" className="resource-card-btn">
                        {isFrench ? "Accéder à l'E-book" : "View Whitepaper"}
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

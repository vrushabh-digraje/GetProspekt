import { jsPDF } from "jspdf";

export interface PdfDocumentData {
  title: string;
  type?: string;
  category?: string;
  summary?: string;
  content?: string;
  downloadContent?: string;
  coverImage?: string;
  imageUrl?: string;
  recipientName?: string;
  recipientCompany?: string;
  recipientEmail?: string;
  fileUrl?: string;
}

/**
 * Generates an executive-branded digital cover illustration via HTML5 Canvas
 * Used as a dependable visual banner when an external image cannot be loaded or during offline access.
 */
function createBrandedCoverImage(title: string, category: string, type: string): string {
  try {
    if (typeof document === "undefined") return "";
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";

    // Deep luxury dark gradient background
    const grad = ctx.createLinearGradient(0, 0, 1200, 480);
    grad.addColorStop(0, "#08101E");
    grad.addColorStop(0.45, "#0D1E32");
    grad.addColorStop(1, "#072033");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1200, 480);

    // Subtle geometric technical grid lines
    ctx.strokeStyle = "rgba(0, 212, 170, 0.09)";
    ctx.lineWidth = 1;
    for (let x = 0; x < 1200; x += 48) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 480);
      ctx.stroke();
    }
    for (let y = 0; y < 480; y += 48) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1200, y);
      ctx.stroke();
    }

    // Glowing cyan/blue radial illumination on the right
    const radial = ctx.createRadialGradient(980, 160, 20, 980, 160, 360);
    radial.addColorStop(0, "rgba(0, 212, 170, 0.38)");
    radial.addColorStop(0.45, "rgba(29, 155, 240, 0.22)");
    radial.addColorStop(1, "rgba(8, 16, 30, 0)");
    ctx.fillStyle = radial;
    ctx.fillRect(600, 0, 600, 480);

    // Decorative geometric rings
    ctx.strokeStyle = "rgba(56, 189, 248, 0.25)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(980, 160, 110, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = "rgba(0, 212, 170, 0.2)";
    ctx.beginPath();
    ctx.arc(980, 160, 180, 0, Math.PI * 2);
    ctx.stroke();

    // Type badge pill
    ctx.fillStyle = "#00D4AA";
    const badgeW = 240;
    const badgeH = 38;
    if (typeof (ctx as any).roundRect === "function") {
      (ctx as any).roundRect(50, 50, badgeW, badgeH, 6);
      ctx.fill();
    } else {
      ctx.fillRect(50, 50, badgeW, badgeH);
    }
    ctx.fillStyle = "#060B12";
    ctx.font = "bold 15px sans-serif";
    ctx.fillText((type || "EXECUTIVE REPORT").toUpperCase(), 68, 74);

    // Brand headline
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 42px sans-serif";
    ctx.fillText("GETprospeKt Research", 50, 145);

    // Category
    ctx.fillStyle = "#38BDF8";
    ctx.font = "600 22px sans-serif";
    ctx.fillText(`Category: ${category}`, 50, 195);

    // Title preview line
    ctx.fillStyle = "#E2E8F0";
    ctx.font = "bold 18px sans-serif";
    const cleanTitle = title.length > 70 ? title.slice(0, 67) + "..." : title;
    ctx.fillText(cleanTitle, 50, 245);

    // Separator line
    ctx.strokeStyle = "rgba(255, 255, 255, 0.18)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(50, 275);
    ctx.lineTo(1150, 275);
    ctx.stroke();

    // Verification stamps
    ctx.fillStyle = "#94A3B8";
    ctx.font = "15px sans-serif";
    ctx.fillText(
      "Enterprise Research Vault Document  •  Verified Data Intelligence  •  GETprospeKt Global",
      50,
      315
    );

    return canvas.toDataURL("image/jpeg", 0.9);
  } catch {
    return "";
  }
}

/**
 * Resolves the cover image for the PDF.
 * If a URL is provided, loads the image onto a canvas to extract base64 data.
 * Includes a strict 1200ms timeout so offline/slow connections never delay downloads.
 * Falls back to an executive canvas illustration if CORS restrictions or loading errors occur.
 */
async function resolveImageToDataUrl(
  url?: string,
  fallbackData?: { title: string; category: string; type: string }
): Promise<string> {
  if (url && url.startsWith("data:image/")) {
    return url;
  }

  if (url && typeof document !== "undefined") {
    try {
      const dataUrl = await new Promise<string | null>((resolve) => {
        const timer = setTimeout(() => {
          resolve(null);
        }, 1200);

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          clearTimeout(timer);
          try {
            const canvas = document.createElement("canvas");
            let w = img.naturalWidth || img.width || 800;
            let h = img.naturalHeight || img.height || 450;
            const maxW = 1200;
            if (w > maxW) {
              h = Math.round((h * maxW) / w);
              w = maxW;
            }
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext("2d");
            if (!ctx) return resolve(null);
            ctx.drawImage(img, 0, 0, w, h);
            resolve(canvas.toDataURL("image/jpeg", 0.88));
          } catch {
            resolve(null);
          }
        };
        img.onerror = () => {
          clearTimeout(timer);
          resolve(null);
        };
        img.src = url;
      });

      if (dataUrl) return dataUrl;
    } catch {
      // Fall through to canvas generator
    }
  }

  return createBrandedCoverImage(
    fallbackData?.title || "Enterprise Report",
    fallbackData?.category || "Enterprise Technology",
    fallbackData?.type || "Report"
  );
}

/**
 * Category-specific strategic principles and learning objectives
 */
const CATEGORY_STRATEGIC_TAKEAWAYS: Record<string, string[]> = {
  Cybersecurity: [
    "Zero Trust Architecture: Enforce continuous verification across all user sessions, services, and workloads.",
    "Immutable Storage Protection: Guarantee write-once-read-many (WORM) air-gapped backups adhering to the 3-2-1-1-0 rule.",
    "Rapid Ransomware Containment: Deploy automated SOC playbooks to isolate affected endpoints and reduce mean time to remediate (MTTR).",
    "Regulatory Compliance: Achieve full operational alignment with NIS2, DORA, SOC 2 Type II, and ISO 27001 data protection mandates.",
  ],
  "Data & Analytics": [
    "Deterministic Verification: Replace static web scraping with multi-point live mail server and switchboard verification.",
    "Zero Database Decay: Mitigate the 37.5% annual corporate turnover decay through continuous human-in-the-loop auditing.",
    "Sender Domain Reputation: Maintain sub-0.8% email bounce rates to protect Google Workspace and Microsoft 365 inbox placement.",
    "Pipeline Acceleration: Equip sales development teams with verified direct-dial extensions to save up to 14 rep hours per week.",
  ],
  "Cloud & Infrastructure": [
    "Architecture Modernization: Transition legacy perimeter appliances to unified cloud-native SASE and ZTNA fabrics.",
    "Circular IT & Lifecycle: Lower total cost of ownership by 22% and maximize ESG hardware sustainability through modern rotation programs.",
    "Egress Cost Predictability: Eliminate unbudgeted cloud exit fees through predictable flat-rate storage and compute agreements.",
    "Workload Resilience: Enforce runtime drift detection and automated container image vulnerability scanning across multi-cloud clusters.",
  ],
  "ABM & Demand Generation": [
    "Buying Committee Orchestration: Map and multi-thread 8 to 12 cross-functional enterprise stakeholders across IT, InfoSec, and Finance.",
    "High-Value Account Qualification: Eliminate vanity traffic and tire-kickers with strict BANT telephone qualification gates.",
    "Multi-Channel Cadence: Deploy a 21-day, 12-touch sequence combining verified phone outreach, executive email, and social touches.",
    "Sales Handoff Velocity: Guarantee 88%+ AE meeting show rates through executive calendar confirmation dossiers.",
  ],
  "Buyer Insights": [
    "Evaluation Committee Alignment: Position technical diagnostics and value-add audits over generic promotional product decks.",
    "Proof-of-Concept (PoC) Crucible: Prove sub-second query latency, minimal agent footprint, and zero operational disruption.",
    "Procurement Friction Mitigation: Pre-package SOC 2 Type II reports, DPIA audits, and standardized MSA redlines.",
    "Contract Renewal Assurance: Establish 90-day executive business reviews tied directly to quantifiable ROI metrics.",
  ],
  "Enterprise Technology": [
    "Technology Convergence: Unify siloed data lake, telemetry, and compute architectures into cohesive enterprise fabrics.",
    "Automation & Orchestration: Deploy low-code and agentic workflows to eliminate manual routine tasks and reduce operational friction.",
    "Hardware Lifecycle Governance: Establish standardized cryptographic data sanitization (IEEE 2883-2022 / NIST SP 800-88).",
    "Executive Decision Framework: Align IT infrastructure procurement with multi-year revenue growth and operational resiliency goals.",
  ],
};

/**
 * Builds the structured publication PDF containing the exact, matching content
 * of the specific document requested by the user.
 */
async function buildStructuredPdfDocument(data: PdfDocumentData): Promise<jsPDF> {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const w = 210;
  const margin = 14;
  const contentW = w - margin * 2;
  const pageBottom = 270;
  const dateStr = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const typeStr = (data.type || "Industry Report").toUpperCase();
  const categoryStr = data.category || "Enterprise Technology";
  const recipientName = data.recipientName || "Enterprise Executive";
  const recipientCompany = data.recipientCompany ? ` | ${data.recipientCompany}` : "";

  // 1. Resolve the specific Cover Image or Branded Canvas Banner
  const imgData = await resolveImageToDataUrl(data.coverImage || data.imageUrl, {
    title: data.title || "Enterprise Resource",
    category: categoryStr,
    type: typeStr,
  });

  // Helper to draw standardized page header
  const drawHeader = (isFirstPage: boolean) => {
    doc.setFillColor(10, 17, 30);
    doc.rect(0, 0, w, isFirstPage ? 16 : 13, "F");
    doc.setFillColor(0, 212, 170);
    doc.rect(0, isFirstPage ? 16 : 13, w, 1.2, "F");

    // Brand Name
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(isFirstPage ? 13 : 11);
    doc.setFont("helvetica", "bold");
    doc.text("GETprospeKt", margin, isFirstPage ? 11 : 9);

    // Cyan brand accent dot
    doc.setFillColor(0, 212, 170);
    doc.circle(margin + (isFirstPage ? 33 : 28), isFirstPage ? 9.8 : 7.8, 1.2, "F");

    // Header Vault Tag
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(148, 163, 184);
    const tagText = isFirstPage
      ? `EXECUTIVE VAULT  |  ${typeStr}`
      : `${typeStr}  •  ${categoryStr.toUpperCase()}`;
    doc.text(tagText, w - margin, isFirstPage ? 11 : 9, { align: "right" });
  };

  // Helper to ensure content doesn't overflow page bottom
  let currentY = 0;
  const checkPageBreak = (neededHeight: number) => {
    if (currentY + neededHeight > pageBottom) {
      doc.addPage();
      drawHeader(false);
      currentY = 22;
    }
  };

  // ====================================================
  // PAGE 1: HEADER & BRAND MASTHEAD
  // ====================================================
  drawHeader(true);

  // ====================================================
  // PAGE 1: TYPE BADGE & METADATA BREADCRUMB
  // ====================================================
  currentY = 24;
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, currentY, 38, 6.5, 1.5, 1.5, "FD");
  doc.setTextColor(13, 148, 136);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.text(typeStr, margin + 4, currentY + 4.5);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text(`Category: ${categoryStr}   |   Verified Date: ${dateStr}`, margin + 44, currentY + 4.5);

  // ====================================================
  // PAGE 1: FEATURED COVER IMAGE BANNER
  // ====================================================
  currentY = 34;
  const imgHeight = 55;
  if (imgData) {
    try {
      const format = imgData.startsWith("data:image/png") ? "PNG" : "JPEG";
      doc.addImage(imgData, format, margin, currentY, contentW, imgHeight);
      doc.setDrawColor(203, 213, 225);
      doc.rect(margin, currentY, contentW, imgHeight);

      // Overlay security classification tag on bottom-left of image
      doc.setFillColor(10, 17, 30);
      doc.roundedRect(margin + 5, currentY + imgHeight - 10, 78, 6.5, 1.2, 1.2, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(6.8);
      doc.setFont("helvetica", "bold");
      doc.text(`VERIFIED ${typeStr} • RESTRICTED ACCESS`, margin + 7.5, currentY + imgHeight - 5.8);
    } catch (err) {
      console.warn("Could not embed image to PDF, proceeding with text layout:", err);
    }
  }

  // ====================================================
  // PAGE 1: DOCUMENT TITLE
  // ====================================================
  currentY += imgHeight + 8;
  doc.setTextColor(10, 17, 30);
  doc.setFontSize(15);
  doc.setFont("helvetica", "bold");
  const titleLines = doc.splitTextToSize(data.title || "Enterprise Technical Report", contentW);
  doc.text(titleLines, margin, currentY);

  currentY += titleLines.length * 6.5 + 4;

  // ====================================================
  // PAGE 1: PREPARED FOR & METADATA CARD
  // ====================================================
  const boxHeight = 16.5;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, currentY, contentW, boxHeight, 1.8, 1.8, "FD");
  doc.setFillColor(0, 212, 170);
  doc.rect(margin, currentY, 2.5, boxHeight, "F");

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(7.2);
  doc.setFont("helvetica", "bold");
  doc.text("PREPARED EXCLUSIVELY FOR:", margin + 6, currentY + 5.2);
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(`${recipientName}${recipientCompany}`, margin + 6, currentY + 11.5);

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(7.2);
  doc.setFont("helvetica", "bold");
  doc.text("SECURITY CLASSIFICATION:", margin + contentW * 0.58, currentY + 5.2);
  doc.setTextColor(13, 148, 136);
  doc.setFontSize(8.2);
  doc.text(`Official ${data.type || "Report"} • Active Vault Document`, margin + contentW * 0.58, currentY + 11.5);

  currentY += boxHeight + 8;

  // ====================================================
  // SECTION 01: EXECUTIVE SUMMARY
  // ====================================================
  if (data.summary && data.summary.trim()) {
    checkPageBreak(30);

    doc.setTextColor(10, 17, 30);
    doc.setFontSize(10.5);
    doc.setFont("helvetica", "bold");
    doc.text("01 | EXECUTIVE SUMMARY & STRATEGIC CONTEXT", margin, currentY);
    doc.setFillColor(0, 212, 170);
    doc.rect(margin, currentY + 1.8, 32, 0.8, "F");

    currentY += 7.5;
    doc.setTextColor(51, 65, 85);
    doc.setFontSize(8.8);
    doc.setFont("helvetica", "normal");
    const cleanSummary = data.summary.trim().replace(/\*\*/g, "");
    const summaryLines = doc.splitTextToSize(cleanSummary, contentW);
    doc.text(summaryLines, margin, currentY);

    currentY += summaryLines.length * 4.5 + 6;
  }

  // ====================================================
  // SECTION 02+: IN-DEPTH RESEARCH & ANALYSIS (PARSED SECTIONS)
  // ====================================================
  const activeContent = data.content?.trim() || data.downloadContent?.trim() || "";
  if (activeContent) {
    const rawParagraphs = activeContent.split(/\n\s*\n|\n/);
    let sectionCounter = 2;

    rawParagraphs.forEach((p) => {
      const line = p.trim();
      if (!line) return;

      // Handle Markdown Headings (### or ##)
      if (line.startsWith("###") || line.startsWith("##")) {
        const headingText = line.replace(/^#+\s*/, "").replace(/\*\*/g, "").trim();
        checkPageBreak(25);
        currentY += 4;
        doc.setTextColor(10, 17, 30);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        const prefix = String(sectionCounter).padStart(2, "0");
        doc.text(`${prefix} | ${headingText.toUpperCase()}`, margin, currentY);
        doc.setFillColor(0, 212, 170);
        doc.rect(margin, currentY + 1.8, 28, 0.8, "F");
        currentY += 7.5;
        sectionCounter++;
      }
      // Handle Bullet Points
      else if (line.startsWith("- ") || line.startsWith("* ") || line.startsWith("• ")) {
        const bulletText = line.replace(/^[-*•]\s*/, "").replace(/\*\*/g, "").trim();
        const bulletLines = doc.splitTextToSize(bulletText, contentW - 8);
        checkPageBreak(bulletLines.length * 4.4 + 3);
        doc.setFillColor(0, 212, 170);
        doc.circle(margin + 2.5, currentY - 1, 1, "F");
        doc.setTextColor(51, 65, 85);
        doc.setFontSize(8.6);
        doc.setFont("helvetica", "normal");
        doc.text(bulletLines, margin + 7, currentY);
        currentY += bulletLines.length * 4.4 + 2.5;
      }
      // Handle Numbered Lists
      else if (/^\d+\.\s+/.test(line)) {
        const numMatch = line.match(/^(\d+)\.\s*(.*)/);
        const numStr = numMatch ? `${numMatch[1]}.` : "•";
        const itemText = (numMatch ? numMatch[2] : line).replace(/\*\*/g, "").trim();
        const numLines = doc.splitTextToSize(itemText, contentW - 9);
        checkPageBreak(numLines.length * 4.4 + 3);
        doc.setTextColor(13, 148, 136);
        doc.setFontSize(8.6);
        doc.setFont("helvetica", "bold");
        doc.text(numStr, margin + 2, currentY);
        doc.setTextColor(51, 65, 85);
        doc.setFont("helvetica", "normal");
        doc.text(numLines, margin + 8, currentY);
        currentY += numLines.length * 4.4 + 2.5;
      }
      // Handle Standard Paragraph
      else {
        const cleanPara = line.replace(/\*\*/g, "").trim();
        const paraLines = doc.splitTextToSize(cleanPara, contentW);
        checkPageBreak(paraLines.length * 4.5 + 4);
        doc.setTextColor(51, 65, 85);
        doc.setFontSize(8.8);
        doc.setFont("helvetica", "normal");
        doc.text(paraLines, margin, currentY);
        currentY += paraLines.length * 4.5 + 4;
      }
    });

    currentY += 3;
  }

  // ====================================================
  // SECTION: STRATEGIC OBJECTIVES & TAKEAWAYS
  // ====================================================
  checkPageBreak(42);
  currentY += 2;

  doc.setTextColor(10, 17, 30);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("STRATEGIC LEARNING OBJECTIVES & CORE TAKEAWAYS", margin, currentY);
  doc.setFillColor(0, 212, 170);
  doc.rect(margin, currentY + 1.8, 32, 0.8, "F");

  currentY += 8;

  const resolvedTakeaways =
    CATEGORY_STRATEGIC_TAKEAWAYS[categoryStr] ||
    CATEGORY_STRATEGIC_TAKEAWAYS["Enterprise Technology"];

  resolvedTakeaways.forEach((item) => {
    const itemLines = doc.splitTextToSize(item, contentW - 8);
    checkPageBreak(itemLines.length * 4.4 + 4);

    doc.setFillColor(0, 212, 170);
    doc.circle(margin + 2.5, currentY - 1, 1.2, "F");

    doc.setTextColor(51, 65, 85);
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.text(itemLines, margin + 7, currentY);

    currentY += itemLines.length * 4.4 + 2.5;
  });

  currentY += 3;

  // ====================================================
  // SECTION: ACTIONABLE EXECUTIVE CHECKLIST & GOVERNANCE
  // ====================================================
  checkPageBreak(42);
  currentY += 2;

  doc.setTextColor(10, 17, 30);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("EXECUTIVE ACTION CHECKLIST & GOVERNANCE GATES", margin, currentY);
  doc.setFillColor(0, 212, 170);
  doc.rect(margin, currentY + 1.8, 32, 0.8, "F");

  currentY += 8;

  const actionChecklist = [
    `Audit current ${categoryStr} architecture and performance metrics against verified 2026 industry benchmarks.`,
    `Establish cross-functional stakeholder consensus across IT, Security, and Procurement leadership teams.`,
    `Enforce deterministic verification protocols and zero-trust policy SLAs prior to enterprise procurement.`,
    `Execute controlled proof-of-concept (PoC) validation to eliminate operational bottlenecks and integration risks.`,
    `Schedule recurring quarterly telemetry reviews and compliance attestation audits.`,
  ];

  actionChecklist.forEach((item) => {
    const itemLines = doc.splitTextToSize(item, contentW - 10);
    checkPageBreak(itemLines.length * 4.4 + 4);

    // Draw stylized interactive-feel check box
    doc.setDrawColor(0, 212, 170);
    doc.setLineWidth(0.4);
    doc.roundedRect(margin + 1, currentY - 3, 3.5, 3.5, 0.6, 0.6, "D");

    doc.setTextColor(51, 65, 85);
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.text(itemLines, margin + 7, currentY);

    currentY += itemLines.length * 4.4 + 3;
  });

  currentY += 3;

  // ====================================================
  // ADVISORY & VAULT VERIFICATION CONTAINER
  // ====================================================
  checkPageBreak(30);

  doc.setFillColor(10, 17, 30);
  doc.roundedRect(margin, currentY, contentW, 26, 2.5, 2.5, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9.5);
  doc.setFont("helvetica", "bold");
  doc.text("GETprospeKt Executive Research & Document Vault", margin + 7, currentY + 7.5);

  doc.setFontSize(7.8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(203, 213, 225);
  doc.text(
    `This ${data.type || "report"} is registered in the GETprospeKt Executive Intelligence Vault. Verified for enterprise distribution.`,
    margin + 7,
    currentY + 14
  );

  doc.setFontSize(7.4);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(56, 189, 248);
  doc.text(
    "Contact: solutions@getprospekt.com   |   Web: https://getprospekt.com   |   Registered Knowledge Asset",
    margin + 7,
    currentY + 20.5
  );

  // ====================================================
  // DYNAMIC FOOTER & PAGE NUMBERING ON EVERY PAGE
  // ====================================================
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, 283, w - margin, 283);
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(148, 163, 184);
    const footerTitle =
      data.title && data.title.length > 55 ? `${data.title.slice(0, 52)}...` : data.title || "Enterprise Report";
    doc.text(`GETprospeKt Publications  •  ${footerTitle}`, margin, 288);
    doc.text(`Page ${i} of ${totalPages}`, w - margin, 288, { align: "right" });
  }

  return doc;
}

/**
 * Returns a Blob of the structured PDF document
 */
export async function generateResourcePdfBlob(data: PdfDocumentData): Promise<Blob> {
  const doc = await buildStructuredPdfDocument(data);
  return doc.output("blob");
}

/**
 * Triggers the browser download of the structured PDF document with cover image
 * containing the EXACT matching content of this specific document.
 * Never redirects or falls back to generic sample PDF files.
 */
export async function downloadPdfDocument(
  data: PdfDocumentData,
  preferredFilename?: string
): Promise<void> {
  const cleanTitle = (data.title || "Enterprise-Resource")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const safeFilename =
    preferredFilename && preferredFilename.trim()
      ? preferredFilename.toLowerCase().endsWith(".pdf")
        ? preferredFilename.trim()
        : `${preferredFilename.trim()}.pdf`
      : `${cleanTitle}.pdf`;

  try {
    const doc = await buildStructuredPdfDocument(data);
    doc.save(safeFilename);
  } catch (err) {
    console.error("PDF generation primary error, generating resilient pure-vector document:", err);
    try {
      // Pure in-memory fallback PDF that never touches external network or canvas
      const doc = new jsPDF({ unit: "mm", format: "a4" });
      const w = 210;
      const margin = 14;
      const contentW = w - margin * 2;
      let currentY = 24;

      doc.setFillColor(10, 17, 30);
      doc.rect(0, 0, w, 16, "F");
      doc.setFillColor(0, 212, 170);
      doc.rect(0, 16, w, 1.2, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.text("GETprospeKt Research Vault", margin, 11);

      doc.setTextColor(10, 17, 30);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      const titleLines = doc.splitTextToSize(data.title || "Enterprise Resource", contentW);
      doc.text(titleLines, margin, currentY);
      currentY += titleLines.length * 6.5 + 4;

      if (data.summary) {
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(51, 65, 85);
        const sLines = doc.splitTextToSize(data.summary.replace(/\*\*/g, ""), contentW);
        doc.text(sLines, margin, currentY);
        currentY += sLines.length * 4.5 + 6;
      }

      if (data.content) {
        doc.setFontSize(8.8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(51, 65, 85);
        const cLines = doc.splitTextToSize(
          data.content.replace(/#+/g, "").replace(/\*\*/g, ""),
          contentW
        );
        doc.text(cLines, margin, currentY);
      }

      doc.save(safeFilename);
    } catch (fallbackErr) {
      console.error("Fallback PDF save error:", fallbackErr);
    }
  }
}

function getAssetExtension(fileType?: string, url?: string, fileName?: string): string {
  if (fileName && fileName.includes(".")) {
    const parts = fileName.split(".");
    const extFromName = parts[parts.length - 1].toLowerCase().trim();
    if (extFromName && extFromName.length <= 6) return extFromName;
  }
  if (fileType === "image") return "png";
  if (fileType === "video") return "mp4";
  if (fileType === "word") return "doc";
  if (fileType === "pdf" || fileType === "auto-pdf") return "pdf";
  if (url) {
    if (url.startsWith("data:")) {
      const mimeMatch = url.match(/^data:([^;]+);/);
      if (mimeMatch) {
        const mime = mimeMatch[1].toLowerCase();
        if (mime.includes("pdf")) return "pdf";
        if (mime.includes("png")) return "png";
        if (mime.includes("jpeg") || mime.includes("jpg")) return "jpg";
        if (mime.includes("webp")) return "webp";
        if (mime.includes("gif")) return "gif";
        if (mime.includes("mp4")) return "mp4";
        if (mime.includes("webm")) return "webm";
        if (mime.includes("wordprocessingml")) return "docx";
        if (mime.includes("msword")) return "doc";
        if (mime.includes("spreadsheetml") || mime.includes("excel")) return "xlsx";
        if (mime.includes("presentationml") || mime.includes("powerpoint")) return "pptx";
        if (mime.includes("zip")) return "zip";
        if (mime.includes("csv")) return "csv";
        if (mime.includes("plain")) return "txt";
      }
    }
    if (url.includes(".docx")) return "docx";
    if (url.includes(".doc")) return "doc";
    if (url.includes(".png")) return "png";
    if (url.includes(".jpg") || url.includes(".jpeg")) return "jpg";
    if (url.includes(".webp")) return "webp";
    if (url.includes(".mp4")) return "mp4";
    if (url.includes(".webm")) return "webm";
    if (url.includes(".xlsx")) return "xlsx";
    if (url.includes(".pptx")) return "pptx";
    if (url.includes(".zip")) return "zip";
    if (url.includes(".pdf")) return "pdf";
  }
  return "pdf";
}

/**
 * Generates and downloads a formatted Microsoft Word (.doc) document
 * containing the resource title, summary, and custom download content.
 */
function downloadGeneratedWordDocument(data: PdfDocumentData, filename: string): void {
  const dateStr = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const bodyContent = (data.downloadContent || data.content || data.summary || "")
    .split(/\n\s*\n|\n/)
    .filter((p) => p.trim())
    .map(
      (p) =>
        `<p style="font-family: Calibri, Arial, sans-serif; font-size: 11.5pt; line-height: 1.6; color: #1E293B; margin-bottom: 12pt;">${p
          .trim()
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")}</p>`
    )
    .join("");

  const wordHtml = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:w="urn:schemas-microsoft-com:office:word"
          xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8" />
      <title>${(data.title || "Enterprise Resource").replace(/</g, "&lt;")}</title>
    </head>
    <body style="font-family: Calibri, Arial, sans-serif; color: #0F172A; margin: 36pt;">
      <div style="background: #0A111E; color: #FFFFFF; padding: 18pt 22pt; border-bottom: 4pt solid #00D4AA; margin-bottom: 20pt;">
        <div style="font-size: 10pt; color: #00D4AA; font-weight: bold; letter-spacing: 1pt; text-transform: uppercase;">
          GETprospeKt Executive Research  |  ${(data.type || "Whitepaper").toUpperCase()}
        </div>
        <h1 style="font-size: 20pt; margin: 8pt 0 6pt; color: #FFFFFF;">
          ${(data.title || "Enterprise Resource").replace(/</g, "&lt;")}
        </h1>
        <div style="font-size: 9.5pt; color: #94A3B8;">
          Category: ${data.category || "Enterprise Technology"}  •  Date: ${dateStr}
          ${data.recipientName ? `  •  Prepared For: ${data.recipientName}` : ""}
        </div>
      </div>

      ${
        data.summary
          ? `<h2 style="font-size: 13pt; color: #0F172A; border-bottom: 1.5pt solid #00D4AA; padding-bottom: 4pt; margin-top: 16pt;">01 | Executive Summary</h2>
             <p style="font-size: 11.5pt; line-height: 1.6; color: #334155; background: #F8FAFC; padding: 12pt; border-left: 3pt solid #0046FC;">
               ${data.summary.replace(/</g, "&lt;")}
             </p>`
          : ""
      }

      <h2 style="font-size: 13pt; color: #0F172A; border-bottom: 1.5pt solid #00D4AA; padding-bottom: 4pt; margin-top: 18pt;">
        02 | Full Downloadable Content &amp; Research Details
      </h2>
      ${
        bodyContent ||
        `<p style="font-size: 11.5pt; line-height: 1.6; color: #1E293B;">Enterprise research document and strategic implementation guide prepared by GETprospeKt.</p>`
      }

      <hr style="margin-top: 28pt; border: none; border-top: 1pt solid #CBD5E1;" />
      <p style="font-size: 9pt; color: #64748B; text-align: center;">
        © ${new Date().getFullYear()} GETprospeKt Publications  •  Verified Enterprise Knowledge Asset
      </p>
    </body>
    </html>
  `;

  const blob = new Blob(["\ufeff", wordHtml], {
    type: "application/msword;charset=utf-8",
  });
  const blobUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download =
    filename.endsWith(".doc") || filename.endsWith(".docx") ? filename : `${filename}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => window.URL.revokeObjectURL(blobUrl), 2000);
}

/**
 * Downloads a resource asset.
 * Synthesizes a dedicated, matching PDF tailored specifically to this resource's
 * title, category, summary, and in-depth sections.
 * Never delivers generic fallback files.
 */
export async function downloadResourceAsset(
  data: PdfDocumentData,
  fileUrl?: string,
  downloadFileType?: string,
  downloadFileName?: string
): Promise<void> {
  const safeFilename = (data.title || "Enterprise-Resource")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const ext = getAssetExtension(downloadFileType, fileUrl, downloadFileName);
  const finalFilename =
    downloadFileName && downloadFileName.trim()
      ? downloadFileName.trim().includes(".")
        ? downloadFileName.trim()
        : `${downloadFileName.trim()}.${ext}`
      : `${safeFilename}.${ext}`;

  // Merge custom downloadContent into data.content if provided
  const enrichedData: PdfDocumentData = {
    ...data,
    content: data.downloadContent?.trim() ? data.downloadContent.trim() : data.content,
  };

  // 1. If the admin uploaded a real base64/blob custom file (e.g. from local disk)
  if (fileUrl && (fileUrl.startsWith("data:") || fileUrl.startsWith("blob:"))) {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = finalFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }

  // 2. If format is Word (.doc / .docx) and no external Word URL is provided, generate a rich Word document
  if (
    downloadFileType === "word" &&
    (!fileUrl || fileUrl === "/sample-whitepaper.pdf" || !fileUrl.match(/\.(doc|docx)$/i))
  ) {
    downloadGeneratedWordDocument(enrichedData, finalFilename);
    return;
  }

  // 3. If the admin specified a real external custom URL (and not sample-whitepaper placeholder)
  if (
    fileUrl &&
    fileUrl.trim() &&
    fileUrl !== "/sample-whitepaper.pdf" &&
    downloadFileType !== "auto-pdf" &&
    downloadFileType !== "pdf"
  ) {
    try {
      const response = await fetch(fileUrl, { mode: "cors" });
      if (response.ok) {
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = finalFilename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => window.URL.revokeObjectURL(blobUrl), 2000);
        return;
      }
    } catch {
      // Proceed to link click
    }

    const fallbackLink = document.createElement("a");
    fallbackLink.href = fileUrl;
    fallbackLink.download = finalFilename;
    fallbackLink.target = "_blank";
    fallbackLink.rel = "noopener noreferrer";
    document.body.appendChild(fallbackLink);
    fallbackLink.click();
    document.body.removeChild(fallbackLink);
    return;
  }

  // 4. Default: Synthesize and download the 1-to-1 matching executive PDF document
  await downloadPdfDocument(enrichedData, finalFilename);
}

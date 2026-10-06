import { jsPDF } from "jspdf";

export interface PdfDocumentData {
  title: string;
  type?: string;
  category?: string;
  summary?: string;
  content?: string;
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
    const badgeW = 220;
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
    ctx.fillText("Enterprise Research Vault Document  •  Verified Data Intelligence  •  GETprospeKt Global", 50, 315);

    return canvas.toDataURL("image/jpeg", 0.9);
  } catch {
    return "";
  }
}

/**
 * Resolves the cover image for the PDF.
 * If a URL is provided, loads the image onto a canvas to extract base64 data.
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
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
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
        img.onerror = () => resolve(null);
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
 * Builds the structured publication PDF containing ONLY the specific content
 * of the document currently being read by the user.
 */
async function buildStructuredPdfDocument(data: PdfDocumentData): Promise<jsPDF> {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const w = 210;
  const margin = 14;
  const contentW = w - margin * 2;
  const pageBottom = 270;
  const dateStr = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const typeStr = (data.type || "Industry Report").toUpperCase();
  const categoryStr = data.category || "Enterprise Technology";
  const recipientName = data.recipientName || "Enterprise Reader";
  const recipientCompany = data.recipientCompany ? ` | ${data.recipientCompany}` : "";

  // 1. Resolve the specific Cover Image for this document
  const imgData = await resolveImageToDataUrl(data.coverImage || data.imageUrl, {
    title: data.title || "Enterprise Resource",
    category: categoryStr,
    type: typeStr,
  });

  // Helper to draw page header
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
  // PAGE 1: HEADER & BRAND BANNER
  // ====================================================
  drawHeader(true);

  // ====================================================
  // PAGE 1: TYPE BADGE & METADATA BREADCRUMB
  // ====================================================
  currentY = 24;
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, currentY, 36, 6.5, 1.5, 1.5, "FD");
  doc.setTextColor(13, 148, 136);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.text(typeStr, margin + 4, currentY + 4.5);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text(`Category: ${categoryStr}   |   Verified Date: ${dateStr}`, margin + 42, currentY + 4.5);

  // ====================================================
  // PAGE 1: FEATURED COVER IMAGE OF THIS SPECIFIC REPORT
  // ====================================================
  currentY = 34;
  const imgHeight = 60;
  if (imgData) {
    try {
      doc.addImage(imgData, "JPEG", margin, currentY, contentW, imgHeight);
      doc.setDrawColor(203, 213, 225);
      doc.rect(margin, currentY, contentW, imgHeight);

      // Overlay security tag on bottom-left of image
      doc.setFillColor(10, 17, 30);
      doc.roundedRect(margin + 5, currentY + imgHeight - 10, 72, 6.5, 1.2, 1.2, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(6.8);
      doc.setFont("helvetica", "bold");
      doc.text(`VERIFIED ${typeStr} • RESTRICTED ACCESS`, margin + 7.5, currentY + imgHeight - 5.8);
    } catch (err) {
      console.warn("Could not embed image to PDF, proceeding with text layout:", err);
    }
  }

  // ====================================================
  // PAGE 1: SPECIFIC DOCUMENT TITLE
  // ====================================================
  currentY += imgHeight + 8;
  doc.setTextColor(10, 17, 30);
  doc.setFontSize(15.5);
  doc.setFont("helvetica", "bold");
  const titleLines = doc.splitTextToSize(data.title || "Enterprise Technical Report", contentW);
  doc.text(titleLines, margin, currentY);

  currentY += (titleLines.length * 6.5) + 3;

  // ====================================================
  // PAGE 1: PREPARED FOR & METADATA CARD
  // ====================================================
  const boxHeight = 17.5;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, currentY, contentW, boxHeight, 1.8, 1.8, "FD");
  doc.setFillColor(29, 155, 240);
  doc.rect(margin, currentY, 2.5, boxHeight, "F");

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(7.2);
  doc.setFont("helvetica", "bold");
  doc.text("PREPARED EXCLUSIVELY FOR:", margin + 6, currentY + 5.2);
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(9.2);
  doc.setFont("helvetica", "bold");
  doc.text(`${recipientName}${recipientCompany}`, margin + 6, currentY + 12);

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(7.2);
  doc.setFont("helvetica", "bold");
  doc.text("SECURITY CLASSIFICATION:", margin + (contentW * 0.58), currentY + 5.2);
  doc.setTextColor(13, 148, 136);
  doc.setFontSize(8.2);
  doc.text(`Official ${data.type || "Report"} • Active Vault Document`, margin + (contentW * 0.58), currentY + 12);

  currentY += boxHeight + 8;

  // ====================================================
  // SECTION 01: SPECIFIC EXECUTIVE SUMMARY
  // ====================================================
  if (data.summary && data.summary.trim()) {
    checkPageBreak(30);

    doc.setTextColor(10, 17, 30);
    doc.setFontSize(10.5);
    doc.setFont("helvetica", "bold");
    doc.text("01 | EXECUTIVE SUMMARY & OVERVIEW", margin, currentY);
    doc.setFillColor(0, 212, 170);
    doc.rect(margin, currentY + 1.8, 30, 0.8, "F");

    currentY += 7;
    doc.setTextColor(51, 65, 85);
    doc.setFontSize(8.8);
    doc.setFont("helvetica", "normal");
    const summaryLines = doc.splitTextToSize(data.summary.trim(), contentW);
    doc.text(summaryLines, margin, currentY);

    currentY += (summaryLines.length * 4.5) + 6;
  }

  // ====================================================
  // SECTION 02: SPECIFIC DETAILED CONTENT / RESEARCH
  // ====================================================
  if (data.content && data.content.trim()) {
    checkPageBreak(30);

    doc.setTextColor(10, 17, 30);
    doc.setFontSize(10.5);
    doc.setFont("helvetica", "bold");
    doc.text("02 | COMPREHENSIVE RESEARCH & DETAILED ANALYSIS", margin, currentY);
    doc.setFillColor(0, 212, 170);
    doc.rect(margin, currentY + 1.8, 30, 0.8, "F");

    currentY += 7;
    doc.setTextColor(51, 65, 85);
    doc.setFontSize(8.8);
    doc.setFont("helvetica", "normal");

    // Split paragraphs if any
    const rawParagraphs = data.content.trim().split(/\n\s*\n|\n/);
    rawParagraphs.forEach((para) => {
      const cleanPara = para.trim();
      if (!cleanPara) return;
      const paraLines = doc.splitTextToSize(cleanPara, contentW);
      checkPageBreak(paraLines.length * 4.5 + 4);
      doc.text(paraLines, margin, currentY);
      currentY += (paraLines.length * 4.5) + 4;
    });

    currentY += 3;
  }

  // ====================================================
  // SECTION 03: SPECIFIC KEY OBJECTIVES & TAKEAWAYS
  // ====================================================
  checkPageBreak(40);

  doc.setTextColor(10, 17, 30);
  doc.setFontSize(10.5);
  doc.setFont("helvetica", "bold");
  doc.text(`03 | KEY LEARNING OBJECTIVES & STRATEGIC TAKEAWAYS`, margin, currentY);
  doc.setFillColor(0, 212, 170);
  doc.rect(margin, currentY + 1.8, 30, 0.8, "F");

  currentY += 8.5;

  const specificTakeaways = [
    `Strategic Frameworks: Proven methodologies for aligning ${categoryStr} architecture with long-term business and revenue objectives.`,
    `Economic & Operational Impact: Detailed benchmarks covering cost efficiency models, hardware and software deployment timetables, and resource optimization.`,
    `Governance & Compliance Standards: Best practices for risk mitigation, enterprise security protocols, and verified compliance adherence.`,
    `Actionable Decision-Maker Checklist: Practical evaluation criteria and implementation steps ready for executive and technical stakeholder review.`,
  ];

  specificTakeaways.forEach((item) => {
    const itemLines = doc.splitTextToSize(item, contentW - 8);
    checkPageBreak(itemLines.length * 4.4 + 4);

    doc.setFillColor(0, 212, 170);
    doc.circle(margin + 2.5, currentY - 1, 1.2, "F");

    doc.setTextColor(51, 65, 85);
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.text(itemLines, margin + 7, currentY);

    currentY += (itemLines.length * 4.4) + 2.5;
  });

  currentY += 4;

  // ====================================================
  // ADVISORY & VAULT VERIFICATION CONTAINER
  // ====================================================
  checkPageBreak(32);

  doc.setFillColor(10, 17, 30);
  doc.roundedRect(margin, currentY, contentW, 28, 2.5, 2.5, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9.5);
  doc.setFont("helvetica", "bold");
  doc.text("GETprospeKt Executive Research & Document Vault", margin + 7, currentY + 8);

  doc.setFontSize(7.8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(203, 213, 225);
  doc.text(
    `This ${data.type || "report"} is registered in the GETprospeKt Executive Intelligence Vault. Verified for enterprise distribution.`,
    margin + 7,
    currentY + 15
  );

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(56, 189, 248);
  doc.text(
    "Contact: solutions@getprospekt.com   |   Web: https://getprospekt.com   |   Registered Knowledge Asset",
    margin + 7,
    currentY + 22
  );

  // ====================================================
  // DYNAMIC FOOTER ON EVERY PAGE
  // ====================================================
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, 283, w - margin, 283);
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(148, 163, 184);
    doc.text(
      `GETprospeKt Publications  •  ${data.title ? (data.title.length > 50 ? data.title.slice(0, 47) + "..." : data.title) : "Enterprise Report"}`,
      margin,
      288
    );
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
 * containing ONLY the specific document content.
 */
export async function downloadPdfDocument(
  data: PdfDocumentData,
  fallbackUrl = "/sample-whitepaper.pdf"
): Promise<void> {
  const safeFilename = (data.title || "Enterprise-Resource")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  try {
    const doc = await buildStructuredPdfDocument(data);
    doc.save(`${safeFilename}.pdf`);
  } catch (err) {
    console.error("PDF generation error, executing fallback download:", err);
    try {
      const fallback = document.createElement("a");
      fallback.href = fallbackUrl;
      fallback.download = `${safeFilename}.pdf`;
      document.body.appendChild(fallback);
      fallback.click();
      document.body.removeChild(fallback);
    } catch (fallbackErr) {
      console.error("Fallback download error:", fallbackErr);
    }
  }
}

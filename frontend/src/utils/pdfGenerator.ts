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
 * Downloads a resource asset of any format: PDF, Image, Word (.doc/.docx), Video (.mp4/.webm), or Any File.
 * If the admin attached a specific file or wrote custom downloadContent,
 * this function downloads that exact asset in the chosen format.
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

  // 1. If the admin uploaded a local file (data: or blob:) of ANY format (PDF, Image, Word, Video, ZIP, XLSX, etc.)
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

  // 3. If format is Image and no custom fileUrl was set, use coverImage or generated branded canvas PNG
  if (downloadFileType === "image" && (!fileUrl || fileUrl === "/sample-whitepaper.pdf")) {
    const imgDataUrl = await resolveImageToDataUrl(data.coverImage || data.imageUrl, {
      title: data.title || "Enterprise Resource",
      category: data.category || "Enterprise Technology",
      type: data.type || "Infographic",
    });
    if (imgDataUrl) {
      const link = document.createElement("a");
      link.href = imgDataUrl;
      link.download = finalFilename.match(/\.(png|jpg|jpeg|webp)$/i)
        ? finalFilename
        : `${safeFilename}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }
  }

  // 4. If format is Video and no custom video URL was provided, use reliable sample MP4 stream
  const effectiveUrl =
    downloadFileType === "video" && (!fileUrl || fileUrl === "/sample-whitepaper.pdf")
      ? "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
      : fileUrl;

  // 5. If the admin specified a custom external file URL (and not auto-pdf)
  if (
    effectiveUrl &&
    effectiveUrl !== "/sample-whitepaper.pdf" &&
    downloadFileType !== "auto-pdf"
  ) {
    try {
      const response = await fetch(effectiveUrl, { mode: "cors" });
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
    } catch (e) {
      // Proceed to fallback link click
    }

    const fallbackLink = document.createElement("a");
    fallbackLink.href = effectiveUrl;
    fallbackLink.download = finalFilename;
    fallbackLink.target = "_blank";
    fallbackLink.rel = "noopener noreferrer";
    document.body.appendChild(fallbackLink);
    fallbackLink.click();
    document.body.removeChild(fallbackLink);
    return;
  }

  // 6. Auto-generated executive PDF with enrichedData (uses custom downloadContent if provided!)
  await downloadPdfDocument(enrichedData, effectiveUrl);
}

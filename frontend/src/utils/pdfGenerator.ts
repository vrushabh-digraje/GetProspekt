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
 * Used as a dependable, zero-dependency visual banner when an external image cannot be loaded or during offline access.
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
    ctx.fillText((type || "WHITEPAPER").toUpperCase(), 68, 74);

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
    fallbackData?.title || "Enterprise Whitepaper",
    fallbackData?.category || "Enterprise Technology",
    fallbackData?.type || "Whitepaper"
  );
}

/**
 * Builds the structured 2-page publication PDF instance using jsPDF
 */
async function buildStructuredPdfDocument(data: PdfDocumentData): Promise<jsPDF> {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const w = 210;
  const margin = 14;
  const contentW = w - margin * 2;
  const dateStr = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const typeStr = (data.type || "Whitepaper").toUpperCase();
  const categoryStr = data.category || "Enterprise Technology";
  const recipientName = data.recipientName || "Enterprise Executive";
  const recipientCompany = data.recipientCompany ? ` | ${data.recipientCompany}` : "";

  // 1. Resolve Cover Image (with fallback canvas graphic)
  const imgData = await resolveImageToDataUrl(data.coverImage || data.imageUrl, {
    title: data.title || "Enterprise Resource",
    category: categoryStr,
    type: typeStr,
  });

  // ====================================================
  // PAGE 1: HEADER & BRAND BANNER
  // ====================================================
  doc.setFillColor(10, 17, 30);
  doc.rect(0, 0, w, 16, "F");
  doc.setFillColor(0, 212, 170);
  doc.rect(0, 16, w, 1.2, "F");

  // Brand Name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("GETprospeKt", margin, 11);

  // Cyan brand accent dot
  doc.setFillColor(0, 212, 170);
  doc.circle(margin + 33, 9.8, 1.2, "F");

  // Header Vault Tag
  doc.setFontSize(7.8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(148, 163, 184);
  doc.text("EXECUTIVE RESEARCH VAULT  |  RESTRICTED BRIEF", w - margin, 11, { align: "right" });

  // ====================================================
  // PAGE 1: TYPE BADGE & BREADCRUMB
  // ====================================================
  let currentY = 24;
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
  // PAGE 1: FEATURED COVER IMAGE
  // ====================================================
  currentY = 34;
  const imgHeight = 64;
  if (imgData) {
    try {
      doc.addImage(imgData, "JPEG", margin, currentY, contentW, imgHeight);
      doc.setDrawColor(203, 213, 225);
      doc.rect(margin, currentY, contentW, imgHeight);

      // Overlay security tag on bottom-left of image
      doc.setFillColor(10, 17, 30);
      doc.roundedRect(margin + 5, currentY + imgHeight - 10.5, 66, 6.5, 1.2, 1.2, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(6.8);
      doc.setFont("helvetica", "bold");
      doc.text("CONFIDENTIAL ENTERPRISE REPORT", margin + 7.5, currentY + imgHeight - 6.2);
    } catch (err) {
      console.warn("Could not embed image to PDF, proceeding with text layout:", err);
    }
  }

  // ====================================================
  // PAGE 1: DOCUMENT TITLE
  // ====================================================
  currentY += imgHeight + 8;
  doc.setTextColor(10, 17, 30);
  doc.setFontSize(15.5);
  doc.setFont("helvetica", "bold");
  const titleLines = doc.splitTextToSize(data.title || "Enterprise Technical Resource", contentW);
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
  doc.text("Verified Access • Vault Document GP-2026", margin + (contentW * 0.58), currentY + 12);

  currentY += boxHeight + 7.5;

  // ====================================================
  // PAGE 1: SECTION 01 - EXECUTIVE SUMMARY
  // ====================================================
  doc.setTextColor(10, 17, 30);
  doc.setFontSize(10.5);
  doc.setFont("helvetica", "bold");
  doc.text("01 | EXECUTIVE SUMMARY & STRATEGIC OVERVIEW", margin, currentY);
  doc.setFillColor(0, 212, 170);
  doc.rect(margin, currentY + 1.8, 30, 0.8, "F");

  currentY += 7;
  doc.setTextColor(51, 65, 85);
  doc.setFontSize(8.8);
  doc.setFont("helvetica", "normal");
  const summaryText =
    data.summary ||
    "This comprehensive executive report details proven frameworks, benchmarks, and infrastructure methodologies to accelerate enterprise demand generation and optimize qualified pipeline velocity.";
  const summaryLines = doc.splitTextToSize(summaryText, contentW);
  doc.text(summaryLines, margin, currentY);

  currentY += (summaryLines.length * 4.5) + 6;

  // ====================================================
  // PAGE 1: SECTION 02 - STRATEGIC CONTEXT & ANALYSIS
  // ====================================================
  doc.setTextColor(10, 17, 30);
  doc.setFontSize(10.5);
  doc.setFont("helvetica", "bold");
  doc.text("02 | STRATEGIC CONTEXT & MARKET CHALLENGES", margin, currentY);
  doc.setFillColor(0, 212, 170);
  doc.rect(margin, currentY + 1.8, 30, 0.8, "F");

  currentY += 7;
  doc.setTextColor(51, 65, 85);
  doc.setFontSize(8.8);
  doc.setFont("helvetica", "normal");
  const contentText =
    data.content ||
    "Modern B2B revenue and marketing leaders face increasing complexity in identifying, validating, and converting target accounts. Standard outbound models suffer from diminishing returns and data decay. This report outlines how human-verified intelligence combined with multi-threaded intent scoring drives predictable, high-qualification sales pipelines.";
  const contentLines = doc.splitTextToSize(contentText, contentW);
  const maxLinesPage1 = Math.min(contentLines.length, Math.floor((278 - currentY) / 4.5));
  doc.text(contentLines.slice(0, maxLinesPage1), margin, currentY);

  // PAGE 1: FOOTER
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, 283, w - margin, 283);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(148, 163, 184);
  doc.text("GETprospeKt Publications  •  Registered Enterprise Vault Document", margin, 288);
  doc.text("Page 1 of 2", w - margin, 288, { align: "right" });

  // ====================================================
  // PAGE 2: HEADER
  // ====================================================
  doc.addPage();
  doc.setFillColor(10, 17, 30);
  doc.rect(0, 0, w, 14, "F");
  doc.setFillColor(0, 212, 170);
  doc.rect(0, 14, w, 1, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("GETprospeKt", margin, 9);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(148, 163, 184);
  doc.text("Technical Brief & Performance Benchmarks", w - margin, 9, { align: "right" });

  // ====================================================
  // PAGE 2: SECTION 03 - BENCHMARKS & METRICS
  // ====================================================
  let p2Y = 22;
  doc.setTextColor(10, 17, 30);
  doc.setFontSize(10.5);
  doc.setFont("helvetica", "bold");
  doc.text("03 | VERIFIED PERFORMANCE BENCHMARKS", margin, p2Y);
  doc.setFillColor(0, 212, 170);
  doc.rect(margin, p2Y + 1.8, 30, 0.8, "F");

  // KPI METRIC CARDS
  const cardW = 88;
  const cardH = 31;
  const gap = 6;
  const row1Y = p2Y + 6;

  // Card 1: Pipeline Growth
  doc.setFillColor(240, 253, 250);
  doc.setDrawColor(153, 246, 228);
  doc.roundedRect(margin, row1Y, cardW, cardH, 2, 2, "FD");
  doc.setTextColor(13, 148, 136);
  doc.setFontSize(17);
  doc.setFont("helvetica", "bold");
  doc.text("+142%", margin + 6, row1Y + 10);
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(8.5);
  doc.text("Qualified Pipeline Growth", margin + 6, row1Y + 18);
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text("Target account conversion uplift within 90 days.", margin + 6, row1Y + 24);

  // Card 2: BANT Velocity
  const col2X = margin + cardW + gap;
  doc.setFillColor(239, 246, 255);
  doc.setDrawColor(191, 219, 254);
  doc.roundedRect(col2X, row1Y, cardW, cardH, 2, 2, "FD");
  doc.setTextColor(37, 99, 235);
  doc.setFontSize(17);
  doc.setFont("helvetica", "bold");
  doc.text("3.8x", col2X + 6, row1Y + 10);
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(8.5);
  doc.text("BANT Qualification Velocity", col2X + 6, row1Y + 18);
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text("Accelerated meeting confirmation rate vs standard outreach.", col2X + 6, row1Y + 24);

  // Card 3: Verified Accuracy
  const row2Y = row1Y + cardH + 5;
  doc.setFillColor(240, 253, 250);
  doc.setDrawColor(153, 246, 228);
  doc.roundedRect(margin, row2Y, cardW, cardH, 2, 2, "FD");
  doc.setTextColor(13, 148, 136);
  doc.setFontSize(17);
  doc.setFont("helvetica", "bold");
  doc.text("99.4%", margin + 6, row2Y + 10);
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(8.5);
  doc.text("Human-Verified Data Accuracy", margin + 6, row2Y + 18);
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text("Direct phone, email, and role recency checked by researchers.", margin + 6, row2Y + 24);

  // Card 4: Evaluation Cycle
  doc.setFillColor(245, 243, 255);
  doc.setDrawColor(221, 214, 254);
  doc.roundedRect(col2X, row2Y, cardW, cardH, 2, 2, "FD");
  doc.setTextColor(124, 58, 237);
  doc.setFontSize(17);
  doc.setFont("helvetica", "bold");
  doc.text("-34%", col2X + 6, row2Y + 10);
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(8.5);
  doc.text("Shorter Evaluation Cycles", col2X + 6, row2Y + 18);
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text("Buying consensus reached faster via multi-threaded targeting.", col2X + 6, row2Y + 24);

  // ====================================================
  // PAGE 2: SECTION 04 - METHODOLOGY & GOVERNANCE
  // ====================================================
  p2Y = row2Y + cardH + 11;
  doc.setTextColor(10, 17, 30);
  doc.setFontSize(10.5);
  doc.setFont("helvetica", "bold");
  doc.text("04 | TECHNICAL METHODOLOGY & GOVERNANCE", margin, p2Y);
  doc.setFillColor(0, 212, 170);
  doc.rect(margin, p2Y + 1.8, 30, 0.8, "F");

  const bullets = [
    "Multi-Threaded Persona Mapping: Engaging 4-7 decision-makers across IT, Finance, Operations, and Security.",
    "First-Party Intent Signal Synthesis: Real-time monitoring of content consumption, topic interest, and hiring velocity.",
    "Strict Qualification Thresholds: Custom BANT validation ensuring prospects have active projects, timelines, and budget.",
    "Enterprise Compliance Standard: Full compliance with GDPR, CCPA, and ISO/IEC 27001 data governance protocols."
  ];

  let bY = p2Y + 8.5;
  bullets.forEach((b) => {
    doc.setFillColor(0, 212, 170);
    doc.circle(margin + 2.5, bY - 1, 1.2, "F");
    doc.setTextColor(51, 65, 85);
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    const bLines = doc.splitTextToSize(b, contentW - 8);
    doc.text(bLines, margin + 7, bY);
    bY += (bLines.length * 4.3) + 2.5;
  });

  // ====================================================
  // PAGE 2: SECTION 05 - STRATEGIC RECOMMENDATIONS
  // ====================================================
  p2Y = bY + 5;
  doc.setTextColor(10, 17, 30);
  doc.setFontSize(10.5);
  doc.setFont("helvetica", "bold");
  doc.text("05 | STRATEGIC RECOMMENDATIONS & ADVISORY", margin, p2Y);
  doc.setFillColor(0, 212, 170);
  doc.rect(margin, p2Y + 1.8, 30, 0.8, "F");

  p2Y += 7;
  doc.setTextColor(51, 65, 85);
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  const recText =
    "1. Align marketing qualification thresholds directly with sales acceptance criteria (SLA).\n2. Replace broad unverified email lists with multi-channel, human-verified decision-maker contacts.\n3. Integrate account intent scoring into active SDR workflows to prioritize surging in-market accounts.";
  const recLines = doc.splitTextToSize(recText, contentW);
  doc.text(recLines, margin, p2Y);

  p2Y += (recLines.length * 4.3) + 6;

  // ====================================================
  // PAGE 2: ADVISORY CTA BOX
  // ====================================================
  const ctaY = Math.max(p2Y, 222);
  doc.setFillColor(10, 17, 30);
  doc.roundedRect(margin, ctaY, contentW, 44, 3, 3, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10.5);
  doc.setFont("helvetica", "bold");
  doc.text("ACCELERATE YOUR ENTERPRISE PIPELINE WITH GETPROSPEKT", margin + 8, ctaY + 11);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(203, 213, 225);
  doc.text(
    "Ready to turn target accounts into qualified revenue pipeline? Our dedicated research team builds custom,",
    margin + 8,
    ctaY + 19
  );
  doc.text(
    "verified B2B lead generation programs tailored specifically to your business qualification requirements.",
    margin + 8,
    ctaY + 25
  );
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(56, 189, 248);
  doc.text(
    "Contact: solutions@getprospekt.com   |   Web: https://getprospekt.com   |   Enterprise Advisory",
    margin + 8,
    ctaY + 36
  );

  // PAGE 2: FOOTER
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, 283, w - margin, 283);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(148, 163, 184);
  doc.text("GETprospeKt Publications  •  Registered Enterprise Vault Document", margin, 288);
  doc.text("Page 2 of 2", w - margin, 288, { align: "right" });

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

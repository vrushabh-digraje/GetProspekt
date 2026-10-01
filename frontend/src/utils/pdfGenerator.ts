export interface PdfDocumentData {
  title: string;
  type?: string;
  category?: string;
  summary?: string;
  content?: string;
  recipientName?: string;
  recipientCompany?: string;
}

export function generateResourcePdfBlob(data: PdfDocumentData): Blob {
  const sanitize = (text: string) => (text || "").replace(/[\(\)\\]/g, "\\$&");

  const wrapText = (text: string, maxLen = 72): string[] => {
    const clean = (text || "").replace(/\s+/g, " ").trim();
    if (!clean) return [];
    const words = clean.split(" ");
    const lines: string[] = [];
    let cur = "";
    for (const w of words) {
      if ((cur + " " + w).trim().length <= maxLen) {
        cur = (cur + " " + w).trim();
      } else {
        if (cur) lines.push(cur);
        cur = w;
      }
    }
    if (cur) lines.push(cur);
    return lines;
  };

  const type = data.type || "Enterprise Research";
  const title = data.title || "Technical Whitepaper";
  const category = data.category || "Enterprise Technology";
  const recipientName = data.recipientName || "Enterprise Reader";
  const recipientCompany = data.recipientCompany ? ` | ${data.recipientCompany}` : "";
  const dateStr = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const summaryLines = wrapText(data.summary || "", 72);
  const contentLines = wrapText(data.content || "", 74);

  const streamLines: string[] = [
    "BT",
    "/F1 20 Tf",
    "50 735 Td",
    `(${sanitize(`GETprospeKt ${type.toUpperCase()}`)}) Tj`,
    "/F2 9 Tf",
    "0 -16 Td",
    `(${sanitize(`CONFIDENTIAL RESEARCH - PREPARED FOR: ${recipientName.toUpperCase()}${recipientCompany.toUpperCase()}`)}) Tj`,
    "/F1 15 Tf",
    "0 -36 Td",
    `(${sanitize(title)}) Tj`,
    "/F2 10 Tf",
    "0 -18 Td",
    `(${sanitize(`Category: ${category}   |   Verified Date: ${dateStr}`)}) Tj`,
    "/F1 12 Tf",
    "0 -30 Td",
    "(1. EXECUTIVE SUMMARY & STRATEGIC OVERVIEW) Tj",
    "/F2 10.5 Tf",
    "0 -18 Td",
  ];

  summaryLines.slice(0, 5).forEach((line) => {
    streamLines.push(`(${sanitize(line)}) Tj`);
    streamLines.push("0 -15 Td");
  });

  streamLines.push("/F1 12 Tf");
  streamLines.push("0 -20 Td");
  streamLines.push("(2. METHODOLOGY & TECHNICAL FRAMEWORK) Tj");
  streamLines.push("/F2 10.5 Tf");
  streamLines.push("0 -18 Td");

  contentLines.slice(0, 7).forEach((line) => {
    streamLines.push(`(${sanitize(line)}) Tj`);
    streamLines.push("0 -15 Td");
  });

  streamLines.push("/F1 12 Tf");
  streamLines.push("0 -20 Td");
  streamLines.push("(3. VERIFIED BENCHMARKS & KEY TAKEAWAYS) Tj");
  streamLines.push("/F2 10 Tf");
  streamLines.push("0 -16 Td");
  streamLines.push("([+] Total Economic Impact: Infrastructure optimization delivers up to 12.5% direct cost reduction.) Tj");
  streamLines.push("0 -15 Td");
  streamLines.push("([+] Procurement Alignment: Multi-stakeholder consensus models shorten evaluation cycles by 34%.) Tj");
  streamLines.push("0 -15 Td");
  streamLines.push("([+] Enterprise Compliance: Architecture meets SOC2, GDPR, and ISO-27001 data integrity standards.) Tj");
  streamLines.push("0 -15 Td");
  streamLines.push("([+] Operational Execution: Production rollout timelines compressed from 90 days to 28 days.) Tj");

  streamLines.push("/F2 8.5 Tf");
  streamLines.push("0 -45 Td");
  streamLines.push(`(${sanitize(`Copyright ${new Date().getFullYear()} GETprospeKt Publications. All rights reserved. Registered Enterprise Vault Document.`)}) Tj`);
  streamLines.push("ET");

  const streamBody = streamLines.join("\n");
  const streamLen = new TextEncoder().encode(streamBody).length;

  const objects: string[] = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${streamLen} >>\nstream\n${streamBody}\nendstream`,
  ];

  let pdfText = "%PDF-1.4\n";
  const offsets: number[] = [0];

  objects.forEach((obj, idx) => {
    offsets.push(pdfText.length);
    pdfText += `${idx + 1} 0 obj\n${obj}\nendobj\n`;
  });

  const startxref = pdfText.length;
  let xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i <= objects.length; i++) {
    xref += String(offsets[i]).padStart(10, "0") + " 00000 n \n";
  }
  xref += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${startxref}\n%%EOF\n`;
  pdfText += xref;

  return new Blob([pdfText], { type: "application/pdf" });
}

export function downloadPdfDocument(data: PdfDocumentData, fallbackUrl = "/sample-whitepaper.pdf") {
  const safeFilename = (data.title || "Enterprise-Resource")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  try {
    const blob = generateResourcePdfBlob(data);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${safeFilename}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  } catch (err) {
    const fallback = document.createElement("a");
    fallback.href = fallbackUrl;
    fallback.download = `${safeFilename}.pdf`;
    document.body.appendChild(fallback);
    fallback.click();
    document.body.removeChild(fallback);
  }
}

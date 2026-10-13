import { useMemo, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { caseStudiesStorageApi } from "../services/api";
import { downloadResourceAsset } from "../utils/pdfGenerator";

type CaseStudy = {
  _id?: string;
  slug: string;
  label?: string;
  title: string;
  description: string;
  image: string;
  stats: [string, string][];
  profile: string;
  objective: string;
  spec: string[];
  executed: string[];
  owned: string;
  client: string;
  clientOwned?: string;
  metric?: string;
  faqs?: { question: string; answer: string }[];
  fileUrl?: string;
  downloadFileType?: string;
  downloadFileName?: string;
  downloadContent?: string;
  downloadCount?: number;
};

const caseStudies: CaseStudy[] = [
  {
    slug: "webinar-registrations-ai-business-process", label: "Case Study", title: "Targeted Outreach for an AI and Business-Process Webinar",
    description: "A US-focused webinar organizer targeting technology decision-makers needed high-quality registrations from a defined audience. GETprospeKt identified and engaged 1,500+ prospects matching the target specification, resulting in 192 webinar registrations and 23 attendees, with a 12% attendance rate.", image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=90",
    stats: [["1,500+", "Prospects identified and engaged"], ["192", "Webinar registrations"], ["23", "Attendees"], ["12%", "Attendance rate"]], profile: "Organizer of a US-focused webinar on AI in business processes, targeting technology professionals in managerial and senior-level roles.", objective: "Generate high-quality webinar registrations from a defined audience of technology decision-makers and influencers, not generic traffic.",
    spec: ["Audience: Technology professionals in the United States", "Seniority: Managerial and senior-level contacts", "Company size: 500+ employees", "Industries: Finance, manufacturing, retail, hospitality, and other technology-oriented business environments", "Relevance: Prospects whose roles made the webinar topic directly meaningful"], executed: ["Identified and reviewed prospects against the agreed audience specification", "Ran personalized email outreach focused on the webinar's core question", "Executed sequential follow-up through email and tele-calling", "Maintained strict adherence to the agreed audience and campaign criteria throughout"], owned: "Prospect identification, outreach, follow-up, and registration generation against the agreed specification.", client: "Event experience, content delivery, attendee engagement, and all downstream activity after registration.",
    faqs: [
      {
        question: "How did GETprospeKt ensure the 192 webinar registrations matched the target persona?",
        answer: "Every prospect in the 1,500+ outreach universe was pre-screened and human-verified against the client's exact specification: US-based technology managers and senior decision-makers at companies with 500+ employees in finance, manufacturing, retail, and hospitality."
      },
      {
        question: "Which outreach channels drove the highest registration response?",
        answer: "A coordinated combination of personalized email sequences focused on the webinar's core AI business-process question followed by direct tele-calling follow-up produced consistent conversions from senior technology leaders."
      },
      {
        question: "What was the handoff process once a prospect registered?",
        answer: "GETprospeKt delivered verified registrant profiles directly to the organizer's event platform, while the client owned reminder workflows, live webinar hosting, and post-event sales follow-up."
      }
    ]
  },
  {
    slug: "bant-lead-generation-enterprise-automation", label: "Case Study", title: "Targeted BANT Lead Generation for an Enterprise Automation Platform",
    description: "A global software company needed BANT-qualified leads over three months to feed their US sales team. GETprospeKt identified and qualified Technology and Marketing decision-makers using tele-calling, delivering 125 BANT-qualified leads across CIOs, CTOs, CMOs, and Marketing/IT Directors.", image: "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=1600&q=90",
    stats: [["125", "BANT-qualified leads delivered"], ["USA", "Geography"], ["3 months", "Campaign duration"], ["BANT", "Budget, Authority, Need, Timing verified"]], profile: "A global software company offering an enterprise automation platform designed for organizations seeking to improve workflow efficiency and operational productivity.", objective: "Generate 125 BANT-qualified leads over a three-month campaign from a defined audience of Technology and Marketing decision-makers in the United States.",
    spec: ["Geography: USA", "Company size: 250+ employees", "Campaign duration: 3 months", "Lead type: BANT-qualified leads", "BANT qualification: Budget, Authority, Need, Timing verified", "Outreach channel: Tele-calling", "Target audience: Technology and Marketing decision-makers", "Target roles: CIOs, CTOs, CMOs, Marketing Directors, IT Directors"], executed: ["Identified and researched Technology and Marketing decision-makers", "Executed targeted tele-calling against the defined prospect universe", "Conducted follow-up conversations and applied the agreed BANT qualification criteria", "Delivered leads with Budget, Authority, Need, and Timing verified"], owned: "Prospect identification, audience matching, tele-calling and follow-up, BANT qualification, and lead delivery.", client: "Sales follow-up after lead handoff.",
    faqs: [
      {
        question: "How were Budget, Authority, Need, and Timing verified for all 125 leads?",
        answer: "Our specialists conducted structured tele-qualification conversations with each CIO, CTO, CMO, or IT/Marketing Director, documenting confirmed budget allocation, decision-making role, specific workflow automation pain points, and active implementation timelines."
      },
      {
        question: "Why was tele-calling selected as the primary outreach channel for this campaign?",
        answer: "Confirming all four BANT dimensions with C-suite and Director-level stakeholders at 250+ employee enterprises requires direct two-way dialogue to validate project scope and purchasing timelines accurately."
      },
      {
        question: "How were the 125 BANT leads paced across the 3-month campaign?",
        answer: "Leads were delivered in regular weekly batches along with full call qualification notes so the client's US sales team could engage every prospect while intent was fresh."
      }
    ]
  },
  {
    slug: "mql-generation-marcom-platform", label: "Case Study", title: "MQL Generation for a Marketing Communications Management Solution",
    description: "A MarCom platform provider needed high-volume MQLs within a 60-day campaign to feed their sales and nurture pipelines. GETprospeKt executed outreach to Marketing Communications professionals across enterprise and mid-market organizations in the USA, delivering 8,500 MQLs.", image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=90",
    stats: [["USA", "Geography"], ["MarCom", "Target audience"], ["60 days", "Campaign duration"], ["8,500", "MQLs delivered"]], profile: "A provider of a Marketing Communications Management platform designed for MarCom teams managing content planning, brand governance, campaign execution, and performance measurement.", objective: "Generate a consistent flow of marketing-qualified leads among Marketing Communications professionals across enterprise and mid-market organizations in the United States.",
    spec: ["Audience: Marketing Communications and related marketing professionals", "Seniority: VP/SVP, Director/Sr. Director, Manager/Sr. Manager", "Geography: USA", "Company segment: Enterprise and mid-market organizations", "Campaign period: 60 days", "Lead type: MQL (Marketing-Qualified Leads)", "Qualification criteria: ICP fit + demonstrated engagement with outreach", "Channel: Email and tele-calling outreach and follow-up"], executed: ["Identified and targeted Marketing Communications professionals", "Executed outreach to prospects matching the defined USA market", "Followed up through email and tele-calling", "Qualified prospects who demonstrated engagement", "Delivered MQLs against the campaign specification"], owned: "Audience targeting, prospect identification, outreach execution, follow-up, engagement qualification, and MQL delivery.", client: "Sales engagement after handoff, downstream nurture, opportunity management, and revenue generation.",
    faqs: [
      {
        question: "How did GETprospeKt deliver 8,500 MQLs within a 60-day window without sacrificing ICP quality?",
        answer: "We pre-built a human-verified US enterprise and mid-market MarCom prospect universe across Manager, Director, and VP/SVP tiers, then ran high-velocity multi-channel email and tele-calling outreach with strict ICP and engagement verification gates."
      },
      {
        question: "What qualified a prospect as an MQL in this campaign?",
        answer: "Each MQL had to meet two mandatory criteria: verified ICP fit (MarCom leadership role at a US mid-market or enterprise organization) plus demonstrated active engagement with the campaign's MarCom solution content."
      },
      {
        question: "How did the client's revenue team use the 8,500 delivered MQLs?",
        answer: "High-engagement enterprise contacts were routed directly to SDRs for immediate outreach, while mid-market contacts entered structured multi-touch nurture tracks managed by the client's marketing team."
      }
    ]
  },
  {
    slug: "sql-generation-multi-cloud", label: "Case Study", title: "Survey-Led SQL Generation for a Multi-Cloud Management Platform",
    description: "A cloud storage solutions provider needed to identify and qualify enterprise decision-makers with active cloud migration requirements. GETprospeKt used a structured Value-Add Assessment to capture qualification data from 3,000+ prospects, delivering 92 SQLs.", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=90",
    stats: [["USA", "Target market"], ["Mid-to-large", "Target company segment"], ["3 months", "Campaign duration"], ["92", "SQLs delivered"]], profile: "A cloud storage solutions provider offering a Hybrid Multi-Cloud Management Platform for mid-to-large enterprises.", objective: "Generate and qualify leads by identifying decision-makers with active cloud migration or optimization requirements.",
    spec: ["Audience: Decision-makers involved in cloud infrastructure and management", "Target market: Mid-to-large enterprises", "Industries: Financial services, healthcare, manufacturing, logistics", "Geography: USA", "Campaign duration: 3 months", "Qualification approach: Structured Value-Add Assessment", "Lead type: Sales Qualified Leads (SQL)"], executed: ["Identified prospects within the agreed enterprise audience", "Used a structured Value-Add Assessment", "Captured qualification information", "Evaluated responses against agreed criteria", "Distinguished higher-intent prospects from information seekers", "Delivered SQLs to the client"], owned: "Audience targeting, prospect identification, assessment execution, qualification data collection, SQL identification, and handoff.", client: "Sales follow-up after handoff, opportunity management, further nurture, negotiation and closing.",
    faqs: [
      {
        question: "How did the Value-Add Assessment help identify the 92 SQLs?",
        answer: "The assessment asked targeted diagnostic questions about current hybrid cloud architecture, migration bottlenecks, and upcoming infrastructure initiatives—allowing us to separate active enterprise buyers from passive researchers across 3,000+ prospects."
      },
      {
        question: "Which industries showed the strongest SQL conversion for multi-cloud management?",
        answer: "US mid-to-large enterprises in financial services, healthcare, manufacturing, and logistics had the highest concentration of active multi-cloud migration and storage optimization initiatives."
      },
      {
        question: "What data accompanied each of the 92 SQLs at handoff?",
        answer: "Each SQL was delivered with verified contact information, firmographic profile, and the prospect's complete Value-Add Assessment responses so account executives could tailor their first discovery call."
      }
    ]
  },
  {
    slug: "appointment-generation-engineering", label: "Case Study", title: "Appointment Generation for a Cloud-Based Design and Engineering Solution",
    description: "An engineering software provider needed qualified sales appointments with manufacturing design and engineering decision-makers. GETprospeKt executed targeted cold calling across 4,000 validated contacts, delivering 35 confirmed appointments (110% of KPI).", image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1600&q=90",
    stats: [["USA", "Region"], ["4 months", "Campaign duration"], ["4,000", "Initial database"], ["35", "Appointments booked"], ["110%", "KPI achievement"]], profile: "A global engineering software provider offering a cloud-based design and engineering platform for the manufacturing sector.", objective: "Generate qualified sales appointments in the US manufacturing market for a cloud-based design and engineering solution.",
    spec: ["Campaign type: Appointment generation", "Region: USA", "Industry: SaaS / Engineering Software", "Target sector: Manufacturing", "Target segments: Furniture and consumer product manufacturing", "Target personas: Design and Engineering decision-makers", "Campaign duration: 4 months", "Initial database: 4,000 contacts", "Outreach channel: Cold calling"], executed: ["Audited the initial database against the agreed target profile", "Validated contacts and filtered out prospects that did not match", "Researched and enriched relevant contacts", "Developed persona-specific calling approaches", "Built objection-handling approaches", "Executed targeted cold calling and repeated follow-up", "Generated qualified appointments and handed them to the sales team"], owned: "Database validation, ICP filtering, contact research, persona identification, calling execution, follow-up, and appointment generation.", client: "Sales conversations after appointment handoff, opportunity management, demonstrations, negotiation and closing.",
    faqs: [
      {
        question: "Why did GETprospeKt audit and filter the initial 4,000-contact database first?",
        answer: "Auditing the initial list allowed us to remove outdated records and non-matching companies, then enrich verified Design and Engineering leaders within furniture and consumer product manufacturing before launching cold calling."
      },
      {
        question: "How did the campaign achieve 110% of the appointment KPI?",
        answer: "By pairing clean, human-verified direct dials with persona-specific calling scripts and structured objection handling tailored to cloud-based CAD/engineering workflows."
      },
      {
        question: "What qualified a booked meeting to count toward the 35 confirmed appointments?",
        answer: "Each appointment required a verified Design or Engineering decision-maker in the target US manufacturing sector who confirmed interest in evaluating the cloud platform and accepted a scheduled calendar invite with the client's sales team."
      }
    ]
  },
  {
    slug: "abm-sql-cybersecurity-zero-trust", label: "Case Study", title: "ABM & Multi-Touch SQL Generation for a Zero-Trust Cybersecurity Platform",
    description: "An enterprise cybersecurity vendor targeting Fortune 2000 CISOs and Network Security Directors needed sales-ready pipeline across North America and the UK. GETprospeKt mapped 2,200+ named accounts and delivered 148 Sales-Qualified Leads with a 94% sales acceptance rate.", image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1600&q=90",
    stats: [["2,200+", "Target enterprise accounts mapped"], ["148", "Sales-Qualified Leads (SQLs)"], ["USA & UK", "Target regions"], ["94%", "Sales acceptance rate"]], profile: "A leading enterprise cybersecurity provider specializing in Zero-Trust Network Access (ZTNA) and cloud workload protection for regulated industries.", objective: "Identify and qualify CISOs, VPs of InfoSec, and Network Architecture Directors actively evaluating zero-trust security upgrades within a 90-day ABM program.",
    spec: ["Audience: CISOs, VP of Information Security, Director of Cloud Security, Head of Infrastructure", "Geography: United States & United Kingdom", "Company size: 1,000+ employees", "Industries: Banking, FinTech, Healthcare, Defense, and Enterprise SaaS", "Campaign duration: 90 days", "Qualification approach: Multi-touch email + tele-qualification on active zero-trust initiatives", "Lead type: Sales-Qualified Leads (SQL)"], executed: ["Mapped buying committees across 2,200+ named enterprise accounts", "Human-verified direct dials and corporate emails for security decision-makers", "Executed executive-level outreach around zero-trust compliance and identity governance", "Conducted structured qualification calls to confirm active security pain points and evaluation readiness", "Delivered 148 SQLs with complete security stack and initiative notes"], owned: "Named account research, buying committee verification, multi-channel outreach, security pain-point qualification, and SQL delivery.", client: "Technical architecture demos, proof-of-value (POV) trials, security proposal, and contract closing.",
    faqs: [
      {
        question: "How did GETprospeKt engage hard-to-reach CISOs and InfoSec leaders?",
        answer: "We combined human-verified direct contact data with peer-level security assessment messaging focused on zero-trust identity gaps and hybrid cloud compliance, followed by concise tele-qualification conversations."
      },
      {
        question: "Why did this campaign achieve a 94% sales acceptance rate?",
        answer: "Every SQL required documented confirmation of current perimeter security challenges, an active zero-trust or IAM initiative within the next 6 to 12 months, and openness to a technical architecture review."
      },
      {
        question: "How many stakeholders per enterprise account were mapped during the ABM research phase?",
        answer: "An average of 3.5 security and infrastructure stakeholders per account were human-verified so the client's sales team had full buying-committee visibility."
      }
    ]
  },
  {
    slug: "executive-appointments-ai-fintech", label: "Case Study", title: "Executive Appointment Generation for an AI FinTech & Treasury Solution",
    description: "An AI-powered corporate treasury and cash-flow forecasting platform needed 50 confirmed meetings with CFOs, VPs of Finance, and Corporate Treasurers at mid-market enterprises. GETprospeKt delivered 62 confirmed executive appointments in 90 days (124% of KPI).", image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1600&q=90",
    stats: [["62", "Confirmed C-Suite & VP appointments"], ["90 days", "Campaign duration"], ["1,800", "Verified finance leaders contacted"], ["124%", "Target KPI achievement"]], profile: "A high-growth FinTech SaaS provider offering AI-driven liquidity management, automated cash-flow forecasting, and multi-entity treasury orchestration.", objective: "Book 50+ confirmed 1-on-1 discovery meetings with CFOs, VPs of Finance, and Corporate Treasurers at US companies with $100M+ in annual revenue.",
    spec: ["Campaign type: Executive Appointment Generation", "Geography: United States", "Company revenue: $100M to $2B+", "Target personas: CFO, VP of Finance, Corporate Treasurer, Controller", "Campaign duration: 90 days", "Verified prospect pool: 1,800 finance executives", "Outreach channel: Executive email sequences + direct tele-calling"], executed: ["Built and human-verified a prospect pool of 1,800 finance leaders at $100M+ enterprises", "Crafted CFO-specific messaging centered on working-capital visibility and ERP cash-forecasting accuracy", "Executed persistent multi-touch phone and email follow-up", "Confirmed calendar invitations and facilitated warm introductions to the client's Account Executives"], owned: "Finance persona verification, multi-channel outreach, qualification of ERP/treasury environment, calendar booking, and warm meeting handoff.", client: "Live product walkthroughs, ROI modeling, commercial negotiation, and deal closure.",
    faqs: [
      {
        question: "What qualification criteria were verified before booking each CFO or VP of Finance appointment?",
        answer: "We verified that the organization operated across multiple banking or ERP entities, met the $100M+ revenue threshold, and that the finance leader wanted to improve cash-flow forecasting accuracy or treasury automation."
      },
      {
        question: "How did GETprospeKt minimize meeting no-shows among busy finance executives?",
        answer: "Every appointment was confirmed directly over the phone, accompanied by a tailored agenda brief, calendar invite confirmation, and a 24-hour pre-meeting reminder check-in from the specialist who booked the call."
      },
      {
        question: "How quickly did the first confirmed appointments start appearing on the sales team's calendar?",
        answer: "The first 9 confirmed CFO and Treasurer appointments were booked within the first 14 business days of live outreach."
      }
    ]
  }
];

function CaseStudies() {
  const location = useLocation();
  const path = location.pathname.replace(/\/+$/, "") || "/case-studies";
  const slug = path.startsWith("/case-studies/") ? path.replace("/case-studies/", "") : "";

  // When visiting /case-studies without a slug, open the cards catalog first!
  const isCatalog = !slug;

  const [studiesList, setStudiesList] = useState<CaseStudy[]>(() => {
    try {
      const saved = caseStudiesStorageApi.getAll();
      return saved && saved.length > 0 ? (saved as unknown as CaseStudy[]) : caseStudies;
    } catch {
      return caseStudies;
    }
  });

  useEffect(() => {
    const handleSync = () => {
      try {
        const saved = caseStudiesStorageApi.getAll();
        if (saved && saved.length > 0) setStudiesList(saved as unknown as CaseStudy[]);
      } catch (err) {
        console.warn("[CaseStudies Sync]", err);
      }
    };

    window.addEventListener("storage", handleSync);
    window.addEventListener("gp_casestudies_updated", handleSync);
    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("gp_casestudies_updated", handleSync);
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  const selected = useMemo(() => {
    const found = studiesList.find((item) => item.slug === slug) || studiesList[0] || caseStudies[0];
    const fallback = caseStudies.find((item) => item.slug === found.slug);
    return {
      ...found,
      faqs: found.faqs && found.faqs.length > 0 ? found.faqs : fallback?.faqs || [
        {
          question: "How were prospects verified for this campaign?",
          answer: "Every prospect was human-verified against the agreed ICP and qualification specification prior to outreach and handoff."
        },
        {
          question: "How are campaign results measured and handed off?",
          answer: "GETprospeKt tracks every milestone from initial outreach to verified qualification, delivering complete prospect profiles directly to the client's revenue team."
        }
      ]
    };
  }, [slug, studiesList]);

  const related = studiesList.filter((item) => item.slug !== selected.slug).slice(0, 4);

  // Gated Download State
  const [dlFirstName, setDlFirstName] = useState("");
  const [dlLastName, setDlLastName] = useState("");
  const [dlEmail, setDlEmail] = useState("");
  const [dlCompany, setDlCompany] = useState("");
  const [dlJobTitle, setDlJobTitle] = useState("");
  const [dlIsSubmitting, setDlIsSubmitting] = useState(false);
  const [dlSuccess, setDlSuccess] = useState(false);
  const [dlError, setDlError] = useState("");

  const handleDownload = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setDlError("");

    if (!dlFirstName.trim()) {
      setDlError("Please enter your first name.");
      return;
    }
    if (!dlLastName.trim()) {
      setDlError("Please enter your last name.");
      return;
    }
    if (!dlEmail.trim() || !dlEmail.includes("@")) {
      setDlError("Please enter a valid corporate email address.");
      return;
    }
    if (!dlCompany.trim()) {
      setDlError("Please enter your company name.");
      return;
    }

    setDlIsSubmitting(true);

    try {
      // Increment download count in local storage
      const currentList = caseStudiesStorageApi.getAll();
      const updatedList = currentList.map((cs) => {
        if (cs.slug === selected.slug || cs._id === selected._id) {
          return { ...cs, downloadCount: (cs.downloadCount || 0) + 1 };
        }
        return cs;
      });
      caseStudiesStorageApi.saveAll(updatedList);
      setStudiesList(updatedList as unknown as CaseStudy[]);

      // Trigger multi-format download delivery (PDF, Image, Word, Video, or any file!)
      await downloadResourceAsset(
        {
          title: selected.title,
          type: "Case Study Blueprint",
          category: selected.client || "Client Success",
          summary: selected.description,
          content: selected.description,
          downloadContent:
            selected.downloadContent ||
            `EXECUTIVE CASE STUDY & METHODOLOGY BLUEPRINT\n\nTitle: ${selected.title}\nClient: ${selected.client}\nMetric: ${selected.metric || "Verified Pipeline"}\n\n1. EXECUTIVE SUMMARY\n${selected.description}\n\n2. CLIENT PROFILE & OBJECTIVE\n• Profile: ${selected.profile}\n• Objective: ${selected.objective}\n\n3. CAMPAIGN SPECIFICATION\n${(selected.spec || []).map((s) => "• " + s).join("\n")}\n\n4. EXECUTION ROADMAP\n${(selected.executed || []).map((e) => "• " + e).join("\n")}\n\n5. KEY VERIFIED RESULTS\n${(selected.stats || []).map(([v, l]) => "• " + v + ": " + l).join("\n")}\n\n6. OWNERSHIP & GOVERNANCE\n• GETprospeKt: ${selected.owned}\n• Client Scope: ${selected.clientOwned || selected.client}`,
          coverImage: selected.image,
          recipientName: `${dlFirstName} ${dlLastName}`.trim(),
          recipientCompany: dlCompany.trim(),
          recipientEmail: dlEmail.trim(),
        },
        selected.fileUrl,
        selected.downloadFileType || "auto-pdf",
        selected.downloadFileName
      );

      setDlSuccess(true);
    } catch (err) {
      console.error("[Download Error]", err);
      setDlError("Download could not be initiated. Please try again.");
    } finally {
      setDlIsSubmitting(false);
    }
  };

  return (
    <main className={`case-page ${isCatalog ? "case-catalog-page" : ""}`}>
      <div className="case-container">
        {isCatalog ? (
          <>
            {/* ================= 3-COLUMN CARDS GRID (OPENED FIRST) ================= */}
            <div className="case-gallery-grid">
              {studiesList.map((item) => (
                <article className="case-gallery-card" key={item.slug}>
                  <Link to={"/case-studies/" + item.slug} className="case-gallery-link">
                    <div className="case-gallery-image-wrap">
                      <img src={item.image} alt={item.title} loading="lazy" />
                      <span className="case-gallery-badge-tag">CASE STUDY</span>
                      {item.stats && item.stats[0] && (
                        <span className="case-gallery-stat-pill">{item.stats[0][0]}</span>
                      )}
                    </div>

                    <div className="case-gallery-body">
                      <span className="case-gallery-kicker">Client Success Story</span>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>

                      {item.stats && (
                        <div className="case-gallery-metrics-row">
                          {item.stats.slice(0, 2).map(([val, lbl]: [string, string]) => (
                            <div key={val + lbl} className="case-mini-metric">
                              <strong>{val}</strong>
                              <small>{lbl}</small>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="case-gallery-btn">
                        View Case Study <span className="arrow-icon">→</span>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* ================= DETAIL BREADCRUMB & BACK BUTTON ================= */}
            <div className="case-detail-top-nav">
              <Link to="/case-studies" className="back-to-catalog-btn">
                ← All Case Studies
              </Link>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-current">{selected.title}</span>
            </div>

            <div className="case-grid">

          <article className="case-article">

            {/* ================= ARTICLE HEADER ================= */}
            <header className="case-header">
              <h1>{selected.title}</h1>

              <div className="case-byline">
                By <strong>GETprospeKt</strong>
                <span>|</span>
                Case Study
                <span>|</span>
                Sep 10, 2026
              </div>

              <div className="case-social">
                <button className="share-symbol" aria-label="Share">●</button>
                <button aria-label="Facebook">f</button>
                <button aria-label="Twitter">♥</button>
                <button
                  aria-label="LinkedIn"
                  onClick={() =>
                    window.open(
                      "https://www.linkedin.com/sharing/share-offsite/?url=" +
                        encodeURIComponent(window.location.href),
                      "_blank"
                    )
                  }
                >
                  in
                </button>
              </div>
            </header>

            {/* ================= REFERENCE HERO ================= */}
            <section className="reference-hero">

              {/* Right-side editorial image */}
              <div className="reference-media">
                <img src={selected.image} alt={selected.title} />
              </div>

              {/* White editorial content */}
              <div className="reference-copy">
                <div className="reference-label">CASE STUDY</div>

                {/* Title is deliberately placed in the black
                    horizontal editorial panel, matching the reference. */}
                <div className="reference-title-panel">
                  <h2>{selected.title}</h2>
                </div>

                <div className="reference-divider" />

                <p>{selected.description}</p>
              </div>

            </section>

            {/* ================= EXISTING CASE STUDY CONTENT ================= */}

            <p className="case-intro">{selected.description}</p>

            <section className="case-section">
              <h2>Client Profile</h2>
              <p>{selected.profile}</p>
            </section>

            <section className="case-section">
              <h2>Objective</h2>
              <p>{selected.objective}</p>
            </section>

            <section className="case-section">
              <h2>Campaign Specification</h2>
              <ul>
                {selected.spec.map((item: string) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="case-section">
              <h2>What GETprospeKt Executed</h2>
              <ul>
                {selected.executed.map((item: string) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="case-section">
              <h2>Results</h2>

              <div className="case-stats">
                {selected.stats.map(([value, label]: [string, string]) => (
                  <div className="case-stat" key={value + label}>
                    <strong>{value}</strong>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="case-section">
              <h2>Ownership &amp; Handoff</h2>

              <div className="ownership-grid">
                <div>
                  <h3>GETprospeKt owned:</h3>
                  <p>{selected.owned}</p>
                </div>

                <div>
                  <h3>Client owned:</h3>
                  <p>{selected.client}</p>
                </div>
              </div>
            </section>

            {selected.faqs && selected.faqs.length > 0 && (
              <section className="case-section">
                <h2>Questions We Often Hear</h2>
                <div className="case-faq-list">
                  {selected.faqs.map((faq, idx) => (
                    <details
                      key={faq.question}
                      className="case-faq-card"
                      open={idx === 0}
                    >
                      <summary className="case-faq-question">
                        <span className="case-faq-q-badge">Q</span>
                        <span className="case-faq-q-text">{faq.question}</span>
                        <span className="case-faq-chevron" aria-hidden="true" />
                      </summary>
                      <div className="case-faq-answer">
                        <span className="case-faq-a-badge">A</span>
                        <p>{faq.answer}</p>
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {/* ================= GATED ASSET DOWNLOAD FORM ================= */}
            <section className="case-download-card">
              <div className="case-download-header">
                <span className="case-dl-kicker">
                  {selected.downloadFileType === "image"
                    ? "🖼️ HIGH-RES INFOGRAPHIC"
                    : selected.downloadFileType === "video"
                    ? "🎥 VIDEO BRIEFING"
                    : selected.downloadFileType === "word"
                    ? "📝 EDITABLE BLUEPRINT (.DOC)"
                    : selected.downloadFileType === "any"
                    ? "📦 EXECUTIVE ASSET"
                    : "🔒 GATED RESEARCH REPORT"}
                </span>
                <h2>Download Complete Case Study Blueprint &amp; Data</h2>
                <p>
                  Access the full executive report, verified targeting parameters, outreach cadences, and conversion benchmarks. Enter your corporate details below to download immediately.
                </p>
                <div className="case-dl-badges">
                  <span className="case-dl-format-badge">
                    {selected.downloadFileType === "image"
                      ? "🖼️ High-Res Image"
                      : selected.downloadFileType === "video"
                      ? "🎥 Full Video Walkthrough"
                      : selected.downloadFileType === "word"
                      ? "📝 Word Document (.doc)"
                      : selected.downloadFileType === "any"
                      ? "📦 Custom Document File"
                      : "📄 Executive PDF Document"}
                  </span>
                  <span className="case-dl-count-badge">
                    📥 {selected.downloadCount || 0} Downloads
                  </span>
                  <span className="case-dl-access-badge">
                    ⚡ Instant Direct Delivery
                  </span>
                </div>
              </div>

              {dlSuccess ? (
                <div className="case-dl-success-box">
                  <div className="case-dl-success-icon">🎉</div>
                  <h3>Your download has started!</h3>
                  <p>
                    Thank you, <strong>{dlFirstName}</strong>. Your copy of <em>{selected.title}</em> has been prepared and downloaded directly to your device.
                  </p>
                  <button
                    type="button"
                    className="case-dl-btn-retry"
                    onClick={() => handleDownload()}
                  >
                    ↺ Click here if download did not start automatically
                  </button>
                </div>
              ) : (
                <form onSubmit={handleDownload} className="case-dl-form">
                  {dlError && <div className="case-dl-error">{dlError}</div>}
                  <div className="case-dl-grid">
                    <div className="case-dl-field">
                      <label htmlFor="cs-dl-first">First Name <span className="req">*</span></label>
                      <input
                        id="cs-dl-first"
                        type="text"
                        required
                        placeholder="John"
                        value={dlFirstName}
                        onChange={(e) => setDlFirstName(e.target.value)}
                      />
                    </div>
                    <div className="case-dl-field">
                      <label htmlFor="cs-dl-last">Last Name <span className="req">*</span></label>
                      <input
                        id="cs-dl-last"
                        type="text"
                        required
                        placeholder="Smith"
                        value={dlLastName}
                        onChange={(e) => setDlLastName(e.target.value)}
                      />
                    </div>
                    <div className="case-dl-field">
                      <label htmlFor="cs-dl-email">Corporate Work Email <span className="req">*</span></label>
                      <input
                        id="cs-dl-email"
                        type="email"
                        required
                        placeholder="john.smith@company.com"
                        value={dlEmail}
                        onChange={(e) => setDlEmail(e.target.value)}
                      />
                    </div>
                    <div className="case-dl-field">
                      <label htmlFor="cs-dl-company">Company Name <span className="req">*</span></label>
                      <input
                        id="cs-dl-company"
                        type="text"
                        required
                        placeholder="Acme Enterprises"
                        value={dlCompany}
                        onChange={(e) => setDlCompany(e.target.value)}
                      />
                    </div>
                    <div className="case-dl-field full-width">
                      <label htmlFor="cs-dl-job">Job Title</label>
                      <input
                        id="cs-dl-job"
                        type="text"
                        placeholder="e.g. VP Marketing / Demand Gen Director"
                        value={dlJobTitle}
                        onChange={(e) => setDlJobTitle(e.target.value)}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="case-dl-submit-btn"
                    disabled={dlIsSubmitting}
                  >
                    {dlIsSubmitting ? "Generating Document..." : "DOWNLOAD NOW!"}
                  </button>
                  <p className="case-dl-disclaimer">
                    🔒 By downloading, you agree to receive relevant industry insights. Your corporate data is protected under our enterprise privacy policy.
                  </p>
                </form>
              )}
            </section>

            <section className="case-cta">
              <h2>Want results like this?</h2>
              <p>Let's discuss your campaign specification.</p>
              <a href="/contact">Get in Touch</a>
            </section>

          </article>

          {/* ================= RELATED CONTENT ================= */}
          <aside className="related-content">
            <div className="related-header-tag">PROVEN OUTCOMES</div>
            <h2>Related Case Studies</h2>

            <div className="related-cards-col">
              {related.map((item) => (
                <article className="related-card" key={item.slug}>
                  <Link to={"/case-studies/" + item.slug} className="related-card-link">
                    <div className="related-card-image-wrap">
                      <img src={item.image} alt={item.title} loading="lazy" />
                      <span className="related-card-badge">{item.label || "Case Study"}</span>
                      {item.stats && item.stats[0] && (
                        <span className="related-card-metric">{item.stats[0][0]}</span>
                      )}
                    </div>

                    <div className="related-card-body">
                      <h3>{item.title}</h3>

                      <div className="related-byline">
                        <span>Verified Result: <strong>{item.stats && item.stats[1] ? item.stats[1][0] : "Enterprise"}</strong></span>
                      </div>

                      <p>{item.description}</p>

                      <div className="related-card-btn">
                        Read Case Study <span className="arrow-icon">→</span>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </aside>
        </div>

        {/* ================= ALL CASE STUDIES BOTTOM GALLERY ================= */}
        <section className="case-gallery-section">
          <div className="case-gallery-header">
            <span className="case-gallery-badge">Proven Client Results</span>
            <h2>More Pipeline Case Studies</h2>
            <p>
              Explore verified B2B campaign performance, lead qualification benchmarks, and pipeline growth metrics across our client portfolio.
            </p>
          </div>

          <div className="case-gallery-grid">
            {studiesList.filter((item) => item.slug !== selected.slug).map((item) => (
              <article
                className="case-gallery-card"
                key={item.slug}
              >
                <Link to={"/case-studies/" + item.slug} className="case-gallery-link">
                  <div className="case-gallery-image-wrap">
                    <img src={item.image} alt={item.title} loading="lazy" />
                    <span className="case-gallery-badge-tag">CASE STUDY</span>
                    {item.stats && item.stats[0] && (
                      <span className="case-gallery-stat-pill">{item.stats[0][0]}</span>
                    )}
                  </div>

                  <div className="case-gallery-body">
                    <span className="case-gallery-kicker">Client Success Story</span>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>

                    {item.stats && (
                      <div className="case-gallery-metrics-row">
                        {item.stats.slice(0, 2).map(([val, lbl]: [string, string]) => (
                          <div key={val + lbl} className="case-mini-metric">
                            <strong>{val}</strong>
                            <small>{lbl}</small>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="case-gallery-btn">
                      View Case Study <span className="arrow-icon">→</span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>
          </>
        )}
      </div>

      <style>{`
        /* =========================================================
           CASE STUDY PAGE — REFERENCE SCREENSHOT STRUCTURE
           ========================================================= */

        .case-page{
          width:100%;
          min-height:100vh;
          background:transparent;
          color:#D5DBE7;
          font-family: var(--font-sans);
          overflow-x:hidden;
        }

        .case-container{
          width:min(1530px,calc(100% - 64px));
          margin:0 auto;
          padding:22px 0 80px;
        }

        .case-grid{
          display:grid;
          grid-template-columns:minmax(0,1fr) 375px;
          column-gap:16px;
          align-items:start;
        }

        .case-article{
          min-width:0;
        }

        /* =========================================================
           HEADER
           ========================================================= */

        .case-header{
          position:relative;
          min-height:163px;
          padding:0 0 18px;
        }

        .case-header h1{
          margin:0;
          max-width:1120px;
          color:#FFFFFF;
          font-size:44px;
          line-height:1.075;
          letter-spacing:-1.5px;
          font-weight:700;
        }

        .case-byline{
          display:flex;
          align-items:center;
          flex-wrap:wrap;
          gap:8px;
          margin-top:20px;
          color:#AEB8CA;
          font-size:14px;
          line-height:1.4;
        }

        .case-byline strong{
          font-weight:800;
          color:#FFFFFF;
        }

        .case-social{
          position:absolute;
          right:0;
          bottom:25px;
          display:flex;
          align-items:center;
          gap:7px;
        }

        .case-social button{
          width:32px;
          height:32px;
          padding:0;
          border:1px solid rgba(255,255,255,.12);
          border-radius:0;
          background:#0046FC;
          color:#fff;
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:17px;
          font-weight:800;
          cursor:pointer;
        }

        .case-social .share-symbol{
          width:28px;
          background:#111C2D;
          color:#FFFFFF;
          font-size:18px;
        }

        /* =========================================================
           HERO
           ========================================================= */

        /* =========================================================
           REFERENCE HERO — SAME EDITORIAL STRUCTURE
           ========================================================= */

        .reference-hero{
          position:relative;
          width:100%;
          min-height:500px;
          overflow:hidden;
          background:#0D1522;
          border:1px solid rgba(203, 213, 225, 0.12);
          border-radius:8px;
        }

        /*
         * RIGHT IMAGE
         * Large portrait/editorial image, flush to the right.
         */
        .reference-media{
          position:absolute;
          z-index:1;
          right:0;
          top:0;
          width:44%;
          height:100%;
          overflow:hidden;
          background:#111C2D;
        }

        .reference-media img{
          display:block;
          width:100%;
          height:100%;
          object-fit:cover;
          object-position:center;
        }

        /*
         * LEFT WHITE CONTENT AREA
         */
        .reference-copy{
          position:relative;
          z-index:5;
          width:100%;
          padding:32px 0 36px 42px;
          display:flex;
          flex-direction:column;
          align-items:flex-start;
          pointer-events:auto;
        }

        .reference-label{
          margin:0 0 20px;
          padding:0 0 8px;
          color:#00D2FF;
          font-size:18px;
          line-height:1;
          font-weight:800;
          letter-spacing:.1px;
          border-bottom:2px solid #0046FC;
          display:inline-block;
        }

        /*
         * BLACK TITLE PANEL
         *
         * It intentionally crosses from the white area into the
         * photograph, exactly like the supplied reference screenshot.
         */
        .reference-title-panel{
          margin-left:-42px;
          width:60%;
          min-height:130px;
          box-sizing:border-box;
          padding:32px 42px;
          background:linear-gradient(115deg, #000000 0%, #000000 42%, #0046FC 100%);
          display:flex;
          align-items:center;
          margin-bottom:26px;
        }

        .reference-copy h2{
          margin:0;
          max-width:760px;
          color:#fff;
          font-size:30px;
          line-height:1.18;
          letter-spacing:-.4px;
          font-weight:700;
        }

        /*
         * Divider belongs below the black title panel on the white
         * side, matching the editorial layout.
         */
        .reference-divider{
          width:380px;
          max-width:52%;
          height:2px;
          margin:0 0 24px;
          background:linear-gradient(
            90deg,
            #0046FC 0%,
            #0046FC 55%,
            rgba(0, 70, 252, .22) 82%,
            transparent 100%
          );
        }

        .reference-copy p{
          margin:0;
          width:480px;
          max-width:52%;
          color:#D5DBE7;
          font-size:17px;
          line-height:1.6;
          font-weight:600;
        }

        /*
         * No circular ring is used here. The reference screenshot's
         * key visual is the black horizontal editorial title panel.
         */
        .reference-ring,
        .reference-ring-cutout,
        .media-ring-tail{
          display:none !important;
        }

        /* =========================================================
           EXISTING CONTENT
           ========================================================= */

        .case-intro{
          margin:30px 0 45px;
          color:#D5DBE7;
          font-size:18px;
          line-height:1.65;
        }

        .case-section{
          padding:30px 0;
          border-top:1px solid rgba(255,255,255,.08);
        }

        .case-section h2{
          margin:0 0 15px;
          color:#FFFFFF;
          font-size:28px;
          line-height:1.15;
        }

        .case-section p{
          margin:0;
          color:#AEB8CA;
          font-size:16px;
          line-height:1.7;
        }

        .case-section ul{
          margin:0;
          padding-left:22px;
        }

        .case-section li{
          margin:10px 0;
          color:#D5DBE7;
          font-size:16px;
          line-height:1.55;
        }

        .case-stats{
          display:grid;
          grid-template-columns:repeat(4,1fr);
          gap:12px;
        }

        .case-stat{
          min-height:110px;
          padding:20px 16px;
          border:1px solid rgba(203, 213, 225, 0.12);
          border-radius:8px;
          background:#0D1522;
          display:flex;
          flex-direction:column;
          justify-content:center;
        }

        .case-stat strong{
          margin-bottom:8px;
          color:#00D2FF;
          font-size:28px;
          line-height:1;
        }

        .case-stat span{
          color:#AEB8CA;
          font-size:13px;
          line-height:1.35;
        }

        .ownership-grid{
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:18px;
        }

        .ownership-grid>div{
          padding:20px;
          background:#0D1522;
          border:1px solid rgba(203, 213, 225, 0.12);
          border-radius:8px;
        }

        .ownership-grid h3{
          margin:0 0 8px;
          font-size:16px;
          color:#FFFFFF;
        }

        .case-faq-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-top: 16px;
        }

        .case-faq-card {
          background: #0D1522;
          border: 1px solid rgba(203, 213, 225, 0.14);
          border-radius: 10px;
          overflow: hidden;
          transition: border-color 0.25s ease, box-shadow 0.25s ease;
        }

        .case-faq-card[open] {
          border-color: rgba(0, 210, 255, 0.45);
          box-shadow: 0 10px 28px rgba(0, 0, 0, 0.35);
        }

        .case-faq-question {
          list-style: none;
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 18px 20px;
          cursor: pointer;
          user-select: none;
          font-size: 16.5px;
          font-weight: 700;
          color: #FFFFFF;
          line-height: 1.45;
        }

        .case-faq-question::-webkit-details-marker {
          display: none;
        }

        .case-faq-q-badge {
          flex-shrink: 0;
          width: 28px;
          height: 28px;
          border-radius: 7px;
          background: rgba(0, 210, 255, 0.14);
          border: 1px solid rgba(0, 210, 255, 0.35);
          color: #00D2FF;
          font-size: 13px;
          font-weight: 800;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .case-faq-q-text {
          flex: 1;
        }

        .case-faq-chevron {
          flex-shrink: 0;
          width: 9px;
          height: 9px;
          border-right: 2px solid #94A3B8;
          border-bottom: 2px solid #94A3B8;
          transform: rotate(45deg);
          transition: transform 0.25s ease, border-color 0.25s ease;
          margin-right: 4px;
        }

        .case-faq-card[open] .case-faq-chevron {
          transform: rotate(-135deg);
          border-color: #00D2FF;
        }

        .case-faq-answer {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 16px 20px 20px;
          border-top: 1px solid rgba(203, 213, 225, 0.1);
          background: rgba(6, 11, 18, 0.55);
        }

        .case-faq-a-badge {
          flex-shrink: 0;
          width: 28px;
          height: 28px;
          border-radius: 7px;
          background: rgba(0, 212, 170, 0.14);
          border: 1px solid rgba(0, 212, 170, 0.35);
          color: #00D4AA;
          font-size: 13px;
          font-weight: 800;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-top: 2px;
        }

        .case-faq-answer p {
          margin: 0 !important;
          font-size: 15.5px !important;
          line-height: 1.75 !important;
          color: #CBD5E1 !important;
        }

        .case-cta{
          margin-top:30px;
          padding:34px;
          border-radius:10px;
          background:linear-gradient(
            115deg,
            #000 0%,
            #060B12 35%,
            #0D1522 70%,
            #0046FC 100%
          );
          color:#fff;
          border:1px solid rgba(203, 213, 225, 0.12);
        }

        .case-cta h2{
          margin:0 0 8px;
          color:#FFFFFF;
        }

        .case-cta p{
          margin:0 0 20px;
          color:#D5DBE7;
        }

        .case-cta a{
          display:inline-flex;
          padding:11px 18px;
          border-radius:5px;
          background:#0046FC;
          color:#fff;
          text-decoration:none;
          font-weight:800;
          transition: background .2s ease;
        }

        .case-cta a:hover{
          background:#0038D1;
        }

        /* =========================================================
           RELATED CONTENT
           ========================================================= */

        .related-content{
          min-width:0;
          border-left:1px solid rgba(255,255,255,.08);
          padding-left:14px;
          position:sticky;
          top:0;
        }

        /* ================= RELATED CASE STUDY CARDS ================= */
        .related-content {
          padding-left: 20px;
          border-left: 1px solid rgba(203, 213, 225, 0.12);
        }

        .related-header-tag {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.8px;
          color: #00D2FF;
          margin-bottom: 6px;
          text-transform: uppercase;
        }

        .related-content h2 {
          font-size: 24px;
          color: #FFFFFF;
          margin: 0 0 20px;
          font-family: var(--font-serif);
        }

        .related-cards-col {
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        .related-card {
          background: #0D1522;
          border: 1px solid rgba(203, 213, 225, 0.14);
          border-top: 3px solid #0046FC;
          border-radius: 10px;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.45);
        }

        .related-card:hover {
          transform: translateY(-6px);
          border-color: #00D2FF;
          border-top-color: #00D2FF;
          box-shadow: 0 16px 36px rgba(0, 70, 252, 0.3), 0 0 20px rgba(0, 210, 255, 0.18);
        }

        .related-card-link {
          display: flex;
          flex-direction: column;
          text-decoration: none;
          color: inherit;
        }

        .related-card-image-wrap {
          position: relative;
          height: 160px;
          overflow: hidden;
          background: #060B12;
        }

        .related-card-image-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .related-card:hover .related-card-image-wrap img {
          transform: scale(1.06);
        }

        .related-card-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          background: rgba(0, 70, 252, 0.9);
          color: #FFFFFF;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.5px;
          padding: 3px 8px;
          border-radius: 4px;
          text-transform: uppercase;
        }

        .related-card-metric {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(0, 210, 255, 0.95);
          color: #060B12;
          font-size: 11px;
          font-weight: 800;
          padding: 3px 9px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .related-card-body {
          padding: 16px 18px 18px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .related-card-body h3 {
          margin: 0 0 8px;
          font-size: 16px;
          font-weight: 700;
          color: #FFFFFF;
          line-height: 1.35;
          transition: color 0.2s ease;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .related-card:hover .related-card-body h3 {
          color: #00D2FF;
        }

        .related-byline {
          font-size: 11.5px;
          color: #94A3B8;
          margin-bottom: 10px;
        }

        .related-byline strong {
          color: #00D2FF;
        }

        .related-card-body p {
          margin: 0 0 14px;
          font-size: 13px;
          color: #CBD5E1;
          line-height: 1.45;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .related-card-btn {
          margin-top: auto;
          padding: 9px 14px;
          background: #060B12;
          border: 1px solid rgba(0, 210, 255, 0.3);
          border-radius: 6px;
          color: #D5DBE7;
          font-size: 12.5px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all 0.25s ease;
        }

        .related-card:hover .related-card-btn {
          background: linear-gradient(135deg, #0046FC 0%, #00D2FF 100%);
          color: #FFFFFF;
          border-color: transparent;
          box-shadow: 0 4px 14px rgba(0, 70, 252, 0.4);
        }

        .related-card-btn .arrow-icon {
          transition: transform 0.25s ease;
          color: #00D2FF;
        }

        .related-card:hover .related-card-btn .arrow-icon {
          transform: translateX(5px);
          color: #FFFFFF;
        }

        /* ================= CATALOG HERO ================= */
        .case-catalog-hero {
          text-align: center;
          margin-bottom: 45px;
          padding: 20px 0 10px;
        }

        .catalog-accent-line {
          width: 60px;
          height: 3px;
          background: linear-gradient(90deg, #0046FC, #00D2FF);
          margin: 14px auto 16px;
          border-radius: 2px;
        }

        .case-catalog-hero h1 {
          font-size: 38px;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0;
          font-family: var(--font-serif);
          letter-spacing: -0.5px;
        }

        .case-catalog-hero p {
          color: #94A3B8;
          font-size: 16px;
          max-width: 720px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* ================= DETAIL VIEW TOP BREADCRUMB ================= */
        .case-detail-top-nav {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(203, 213, 225, 0.1);
          font-size: 14px;
        }

        .back-to-catalog-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #00D2FF;
          text-decoration: none;
          font-weight: 700;
          padding: 6px 14px;
          border-radius: 6px;
          background: rgba(0, 70, 252, 0.12);
          border: 1px solid rgba(0, 210, 255, 0.3);
          transition: all 0.2s ease;
        }

        .back-to-catalog-btn:hover {
          background: rgba(0, 70, 252, 0.25);
          border-color: #00D2FF;
          transform: translateX(-3px);
          color: #FFFFFF;
        }

        .breadcrumb-separator {
          color: #64748B;
        }

        .breadcrumb-current {
          color: #94A3B8;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 500px;
        }

        /* ================= BOTTOM GALLERY SECTION ================= */
        .case-gallery-section {
          margin-top: 70px;
          padding-top: 50px;
          border-top: 1px solid rgba(203, 213, 225, 0.12);
        }

        .case-gallery-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .case-gallery-badge {
          display: inline-block;
          font-size: 11.5px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #00D2FF;
          background: rgba(0, 70, 252, 0.12);
          border: 1px solid rgba(0, 210, 255, 0.25);
          padding: 5px 16px;
          border-radius: 20px;
          margin-bottom: 12px;
        }

        .case-gallery-header h2 {
          font-size: 32px;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0 0 10px;
          font-family: var(--font-serif);
        }

        .case-gallery-header p {
          color: #94A3B8;
          font-size: 15px;
          max-width: 680px;
          margin: 0 auto;
          line-height: 1.5;
        }

        .case-gallery-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 26px;
        }

        @media (max-width: 1080px) {
          .case-gallery-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 650px) {
          .case-gallery-grid {
            grid-template-columns: 1fr;
          }
        }

        .case-gallery-card {
          background: #0D1522;
          border: 1px solid rgba(203, 213, 225, 0.14);
          border-top: 3px solid #0046FC;
          border-radius: 10px;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
        }

        .case-gallery-card:hover {
          transform: translateY(-8px) scale(1.01);
          border-color: #00D2FF;
          border-top-color: #00D2FF;
          box-shadow: 0 18px 44px rgba(0, 70, 252, 0.35), 0 0 25px rgba(0, 210, 255, 0.2);
        }

        .case-gallery-card.is-current {
          border-color: rgba(0, 210, 255, 0.6);
          box-shadow: 0 0 22px rgba(0, 210, 255, 0.2);
        }

        .case-gallery-link {
          display: flex;
          flex-direction: column;
          height: 100%;
          text-decoration: none;
          color: inherit;
        }

        .case-gallery-image-wrap {
          position: relative;
          height: 190px;
          overflow: hidden;
          background: #060B12;
        }

        .case-gallery-image-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .case-gallery-card:hover .case-gallery-image-wrap img {
          transform: scale(1.06);
        }

        .case-gallery-badge-tag {
          position: absolute;
          top: 12px;
          left: 12px;
          background: rgba(0, 70, 252, 0.9);
          color: #FFFFFF;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.5px;
          padding: 4px 10px;
          border-radius: 4px;
          text-transform: uppercase;
        }

        .case-current-tag {
          position: absolute;
          top: 12px;
          left: 105px;
          background: rgba(16, 185, 129, 0.9);
          color: #FFFFFF;
          font-size: 11px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 4px;
        }

        .case-gallery-stat-pill {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(0, 210, 255, 0.95);
          color: #060B12;
          font-size: 12px;
          font-weight: 800;
          padding: 4px 11px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
        }

        .case-gallery-body {
          padding: 20px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .case-gallery-kicker {
          font-size: 11px;
          font-weight: 800;
          color: #00D2FF;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          margin-bottom: 6px;
        }

        .case-gallery-body h3 {
          margin: 0 0 10px;
          font-size: 18px;
          font-weight: 700;
          color: #FFFFFF;
          line-height: 1.35;
          font-family: var(--font-serif);
          transition: color 0.2s ease;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .case-gallery-card:hover .case-gallery-body h3 {
          color: #00D2FF;
        }

        .case-gallery-body p {
          margin: 0 0 16px;
          font-size: 13.5px;
          color: #94A3B8;
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .case-gallery-metrics-row {
          display: flex;
          gap: 12px;
          margin-bottom: 18px;
          padding: 10px 12px;
          background: #060B12;
          border: 1px solid rgba(203, 213, 225, 0.1);
          border-radius: 6px;
        }

        .case-mini-metric {
          flex: 1;
        }

        .case-mini-metric strong {
          display: block;
          font-size: 14px;
          color: #00D2FF;
          font-weight: 800;
        }

        .case-mini-metric small {
          font-size: 10.5px;
          color: #94A3B8;
          display: block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .case-gallery-btn {
          margin-top: auto;
          width: 100%;
          padding: 11px 16px;
          background: #060B12;
          border: 1px solid rgba(0, 210, 255, 0.3);
          border-radius: 6px;
          color: #D5DBE7;
          font-size: 13px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all 0.25s ease;
        }

        .case-gallery-card:hover .case-gallery-btn {
          background: linear-gradient(135deg, #0046FC 0%, #00D2FF 100%);
          color: #FFFFFF;
          border-color: transparent;
          box-shadow: 0 4px 18px rgba(0, 70, 252, 0.45);
        }

        .case-gallery-btn .arrow-icon {
          transition: transform 0.25s ease;
          color: #00D2FF;
        }

        .case-gallery-card:hover .case-gallery-btn .arrow-icon {
          transform: translateX(6px);
          color: #FFFFFF;
        }

        /* =========================================================
           TABLET
           ========================================================= */

        @media(max-width:1100px){
          .case-container{
            width:calc(100% - 36px);
          }

          .case-grid{
            grid-template-columns:1fr;
          }

          .related-content{
            position:static;
            border-left:0;
            border-top:1px solid rgba(255,255,255,.08);
            padding:28px 0 0;
          }
        }

        /* =========================================================
           MOBILE
           ========================================================= */

        @media(max-width:700px){
          .case-container{
            width:calc(100% - 24px);
            padding-top:14px;
          }

          .case-header{
            min-height:0;
            padding-bottom:18px;
          }

          .case-header h1{
            font-size:31px;
            line-height:1.08;
            letter-spacing:-.6px;
          }

          .case-byline{
            margin-top:14px;
            font-size:13px;
          }

          .case-social{
            position:static;
            justify-content:flex-start;
            margin-top:15px;
          }

          .reference-hero{
            height:auto;
            min-height:0;
            overflow:hidden;
          }

          .reference-copy{
            position:absolute;
            left:0;
            top:0;
            width:100%;
            height:100%;
          }

          .reference-label{
            margin-bottom:42px;
            font-size:16px;
          }

          .reference-copy h2{
            max-width:100%;
            font-size:30px;
          }

          .reference-divider{
            width:88%;
            margin:28px 0 30px;
          }

          .reference-copy p{
            max-width:100%;
            font-size:16px;
          }

          .reference-media{
            position:absolute;
            top:0;
            right:0;
            width:100%;
            height:100%;
          }

          .reference-media img{
            width:100%;
            height:100%;
            object-fit:cover;
            object-position:center;
          }

          .reference-ring{
            left:0;
            right:0;
            top:0;
            width:100%;
            height:100%;
            border-radius:0;
            transform:none;
          }

          .reference-ring-cutout{
            display:none;
          }

          .media-ring-tail{
            left:8%;
            bottom:350px;
            width:105px;
            height:72px;
          }

          .case-intro{
            margin:25px 0 35px;
            font-size:16px;
          }

          .case-section{
            padding:24px 0;
          }

          .case-section h2{
            font-size:21px;
          }

          .case-stats,
          .ownership-grid{
            grid-template-columns:1fr;
          }

          .related-card{
            padding-top:25px;
          }

          .related-card h3{
            font-size:20px;
          }
        }
        @media(max-width:700px){
          .reference-hero{
            height:620px;
          }

          .reference-media{
            width:100%;
            height:100%;
          }

          .reference-copy{
            width:100%;
            height:100%;
          }

          .reference-label{
            left:24px;
            top:28px;
            font-size:15px;
          }

          .reference-title-panel{
            left:0;
            top:250px;
            width:88%;
            min-height:130px;
            padding:28px 24px;
          }

          .reference-copy h2{
            font-size:22px;
            line-height:1.15;
          }

          .reference-divider{
            left:24px;
            top:405px;
            width:75%;
          }

          .reference-copy p{
            left:24px;
            top:445px;
            width:78%;
            max-width:78%;
            font-size:16px;
            line-height:1.45;
          }
        }

        /* =========================================================
           GATED CASE STUDY ASSET DOWNLOAD CARD
           ========================================================= */
        .case-download-card {
          margin: 48px 0 36px;
          padding: 36px 32px;
          background: linear-gradient(145deg, #091222 0%, #060B12 100%);
          border: 1.5px solid rgba(0, 210, 255, 0.35);
          border-radius: 12px;
          box-shadow: 0 10px 35px rgba(0, 0, 0, 0.45), 0 0 40px rgba(0, 70, 252, 0.12);
        }

        .case-download-header {
          margin-bottom: 24px;
        }

        .case-dl-kicker {
          display: inline-block;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #00D2FF;
          background: rgba(0, 210, 255, 0.1);
          border: 1px solid rgba(0, 210, 255, 0.3);
          padding: 4px 12px;
          border-radius: 12px;
          margin-bottom: 12px;
        }

        .case-download-header h2 {
          font-size: 26px;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0 0 10px;
          line-height: 1.25;
        }

        .case-download-header p {
          font-size: 15px;
          color: #94A3B8;
          line-height: 1.55;
          margin: 0 0 16px;
        }

        .case-dl-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .case-dl-format-badge {
          display: inline-flex;
          align-items: center;
          font-size: 12px;
          font-weight: 700;
          color: #FFFFFF;
          background: rgba(0, 70, 252, 0.25);
          border: 1px solid rgba(0, 70, 252, 0.5);
          padding: 4px 12px;
          border-radius: 6px;
        }

        .case-dl-count-badge {
          display: inline-flex;
          align-items: center;
          font-size: 12px;
          font-weight: 700;
          color: #38BDF8;
          background: rgba(56, 189, 248, 0.12);
          border: 1px solid rgba(56, 189, 248, 0.25);
          padding: 4px 12px;
          border-radius: 6px;
        }

        .case-dl-access-badge {
          display: inline-flex;
          align-items: center;
          font-size: 12px;
          font-weight: 700;
          color: #34D399;
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.25);
          padding: 4px 12px;
          border-radius: 6px;
        }

        .case-dl-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .case-dl-error {
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.4);
          color: #FCA5A5;
          padding: 10px 14px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
        }

        .case-dl-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        @media (max-width: 640px) {
          .case-dl-grid {
            grid-template-columns: 1fr;
          }
        }

        .case-dl-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .case-dl-field.full-width {
          grid-column: 1 / -1;
        }

        .case-dl-field label {
          font-size: 12px;
          font-weight: 700;
          color: #CBD5E1;
          letter-spacing: 0.02em;
        }

        .case-dl-field label .req {
          color: #F87171;
        }

        .case-dl-field input {
          width: 100%;
          padding: 11px 14px;
          background: #0B132B;
          border: 1px solid rgba(203, 213, 225, 0.2);
          border-radius: 6px;
          color: #FFFFFF;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .case-dl-field input:focus {
          border-color: #00D2FF;
          box-shadow: 0 0 0 3px rgba(0, 210, 255, 0.15);
        }

        .case-dl-submit-btn {
          width: 100%;
          padding: 15px 24px;
          background: linear-gradient(135deg, #00D2FF 0%, #0046FC 100%);
          border: none;
          border-radius: 6px;
          color: #FFFFFF;
          font-size: 15px;
          font-weight: 800;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          cursor: pointer;
          box-shadow: 0 6px 20px rgba(0, 70, 252, 0.45);
          transition: transform 0.15s, box-shadow 0.15s;
          margin-top: 6px;
        }

        .case-dl-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 26px rgba(0, 210, 255, 0.5);
        }

        .case-dl-submit-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .case-dl-disclaimer {
          font-size: 11.5px;
          color: #64748B;
          line-height: 1.45;
          margin: 0;
          text-align: center;
        }

        .case-dl-success-box {
          background: rgba(16, 185, 129, 0.12);
          border: 1.5px solid rgba(16, 185, 129, 0.4);
          border-radius: 8px;
          padding: 24px;
          text-align: center;
        }

        .case-dl-success-icon {
          font-size: 38px;
          margin-bottom: 10px;
        }

        .case-dl-success-box h3 {
          font-size: 20px;
          font-weight: 800;
          color: #A7F3D0;
          margin: 0 0 8px;
        }

        .case-dl-success-box p {
          font-size: 14px;
          color: #E2E8F0;
          margin: 0 0 16px;
        }

        .case-dl-btn-retry {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.25);
          color: #FFFFFF;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s;
        }

        .case-dl-btn-retry:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}
        </style>
    </main>
  );
}

export { caseStudies };
export default CaseStudies;

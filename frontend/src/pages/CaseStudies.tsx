import { useMemo, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  caseStudiesStorageApi,
  formConfigApi,
  enquiriesApi,
  type GatedFormConfig,
} from "../services/api";
import { downloadResourceAsset } from "../utils/pdfGenerator";

const INDUSTRY_OPTIONS = [
  "B2B Technology & Software",
  "Healthcare & Life Sciences",
  "Financial Services & Banking",
  "Manufacturing & Industrial",
  "Telecommunications & 5G",
  "Retail, FMCG & E-Commerce",
  "Energy, Utilities & Cleantech",
  "Professional & Legal Services",
  "Transportation & Logistics",
  "Public Sector & Higher Education",
  "Other Industry",
];

const COMPANY_SIZE_OPTIONS = [
  "1 - 10 employees (Startup)",
  "11 - 50 employees (Small Business)",
  "51 - 200 employees (Mid-Market)",
  "201 - 500 employees (Mid-Market)",
  "501 - 1,000 employees (Upper Mid-Market)",
  "1,001 - 5,000 employees (Enterprise)",
  "5,000+ employees (Global Enterprise)",
];

const JOB_TITLE_OPTIONS = [
  "C-Level (CEO, CIO, CTO, CMO, CRO, CFO)",
  "VP / Senior Vice President",
  "Director / Head of Department",
  "Senior Manager / Lead",
  "Solutions Architect / Enterprise Engineer",
  "Sales / Demand Generation Leader",
  "Specialist / Analyst",
  "Other",
];

type CaseStudy = {
  _id?: string;
  slug: string;
  eyebrow?: string;
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
  formConfig?: GatedFormConfig;
};

const caseStudies: CaseStudy[] = [
  {
    slug: "webinar-registrations-ai-business-process",
    eyebrow: "CASE STUDY 1 — WEBINAR REGISTRATIONS FOR AI AND BUSINESS PROCESS WEBINAR",
    label: "Case Study 1",
    title: "Targeted Outreach for an AI and Business-Process Webinar",
    description: "A US-focused webinar organizer targeting technology decision-makers needed high-quality registrations from a defined audience. GETprospeKt identified and engaged 1,500+ prospects matching the target specification, resulting in 192 webinar registrations and 23 attendees, with a 12% attendance rate.",
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=90",
    stats: [["1,500+", "Prospects identified and engaged"], ["192", "Webinar registrations"], ["23", "Attendees"], ["12%", "Attendance rate"]],
    profile: "Organizer of a US-focused webinar on AI in business processes, targeting technology professionals in managerial and senior-level roles.",
    objective: "Generate high-quality webinar registrations from a defined audience of technology decision-makers and influencers, not generic traffic.",
    spec: ["Audience: Technology professionals in the United States", "Seniority: Managerial and senior-level contacts", "Company size: 500+ employees", "Industries: Finance, manufacturing, retail, hospitality, and other technology-oriented business environments", "Relevance: Prospects whose roles made the webinar topic directly meaningful"],
    executed: ["Identified and reviewed prospects against the agreed audience specification", "Ran personalized email outreach focused on the webinar's core question", "Executed sequential follow-up through email and tele-calling", "Maintained strict adherence to the agreed audience and campaign criteria throughout"],
    owned: "Prospect identification, outreach, follow-up, and registration generation against the agreed specification.",
    client: "Event experience, content delivery, attendee engagement, and all downstream activity after registration.",
    metric: "192 Registrations",
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
    slug: "bant-lead-generation-enterprise-automation",
    eyebrow: "CASE STUDY 2 — TARGETED BANT LEAD GENERATION FOR AN ENTERPRISE AUTOMATION PLATFORM",
    label: "Case Study 2",
    title: "Targeted BANT Lead Generation for an Enterprise Automation Platform",
    description: "A global software company needed BANT-qualified leads over three months to feed their US sales team. GETprospeKt identified and qualified Technology and Marketing decision-makers using tele-calling, delivering 125 BANT-qualified leads (Budget, Authority, Need, Timing verified) across CIOs, CTOs, CMOs, and Marketing/IT Directors in 3 months.",
    image: "https://plus.unsplash.com/premium_photo-1661772661721-b16346fe5b0f?auto=format&fit=crop&w=1600&q=90",
    stats: [["125", "BANT-qualified leads delivered"], ["USA", "Geography"], ["3 months", "Campaign duration"], ["BANT", "Budget, Authority, Need, Timing verified"]],
    profile: "A global software company offering an enterprise automation platform designed for organizations seeking to improve workflow efficiency and operational productivity.",
    objective: "Generate 125 BANT-qualified leads over a three-month campaign from a defined audience of Technology and Marketing decision-makers in the United States.",
    spec: ["Geography: USA", "Company size: 250+ employees", "Campaign duration: 3 months", "Lead type: BANT-qualified leads", "BANT qualification: Budget, Authority, Need, Timing verified", "Outreach channel: Tele-calling", "Target audience: Technology and Marketing decision-makers", "Target roles: CIOs, CTOs, CMOs, Marketing Directors, IT Directors"],
    executed: ["Identified and researched Technology and Marketing decision-makers", "Executed targeted tele-calling against the defined prospect universe", "Conducted follow-up conversations and applied the agreed BANT qualification criteria", "Delivered leads with Budget, Authority, Need, and Timing verified"],
    owned: "Prospect identification, audience matching, tele-calling and follow-up, BANT qualification, and lead delivery.",
    client: "Sales follow-up after lead handoff.",
    metric: "125 BANT Leads",
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
    slug: "mql-generation-marcom-platform",
    eyebrow: "CASE STUDY 3 — MQL GENERATION FOR A MARKETING COMMUNICATIONS MANAGEMENT SOLUTION",
    label: "Case Study 3",
    title: "MQL Generation for a Marketing Communications Management Solution",
    description: "A MarCom platform provider needed high-volume MQLs within a 60-day campaign to feed their sales and nurture pipelines. GETprospeKt executed outreach to Marketing Communications professionals across enterprise and mid-market organizations in the USA, delivering 8,500 MQLs with maintained audience and seniority relevance.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=90",
    stats: [["USA", "Geography"], ["MarCom", "Target audience"], ["60 days", "Campaign duration"], ["8,500", "MQLs delivered"]],
    profile: "A provider of a Marketing Communications Management platform designed for MarCom teams managing content planning, brand governance, campaign execution, and performance measurement.",
    objective: "Generate a consistent flow of marketing-qualified leads among Marketing Communications professionals across enterprise and mid-market organizations in the United States.",
    spec: ["Audience: Marketing Communications and related marketing professionals", "Seniority: VP/SVP, Director/Sr. Director, Manager/Sr. Manager", "Geography: USA", "Company segment: Enterprise and mid-market organizations", "Campaign period: 60 days", "Lead type: MQL (Marketing-Qualified Leads)", "Qualification criteria: ICP fit + demonstrated engagement with outreach", "Channel: Email and tele-calling outreach and follow-up"],
    executed: ["Identified and targeted Marketing Communications professionals", "Executed outreach to prospects matching the defined USA market", "Followed up through email and tele-calling", "Qualified prospects who demonstrated engagement", "Delivered MQLs against the campaign specification"],
    owned: "Audience targeting, prospect identification, outreach execution, follow-up, engagement qualification, and MQL delivery.",
    client: "Sales engagement after handoff, downstream nurture, opportunity management, and revenue generation.",
    metric: "8,500 MQLs",
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
    slug: "sql-generation-multi-cloud",
    eyebrow: "CASE STUDY 4 — SURVEY-LED SQL GENERATION FOR A MULTI-CLOUD MANAGEMENT PLATFORM",
    label: "Case Study 4",
    title: "Survey-Led SQL Generation for a Multi-Cloud Management Platform",
    description: "A cloud storage solutions provider needed to identify and qualify enterprise decision-makers with active cloud migration requirements. GETprospeKt used a structured Value-Add Assessment to capture qualification data from 3,000+ prospects across financial services, healthcare, manufacturing, and logistics, delivering 92 SQLs qualified against infrastructure, cloud strategy, and budget criteria.",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1600&q=90",
    stats: [["USA", "Target market"], ["Mid-to-large", "Target company segment"], ["3 months", "Campaign duration"], ["92", "SQLs delivered"]],
    profile: "A cloud storage solutions provider offering a Hybrid Multi-Cloud Management Platform for mid-to-large enterprises.",
    objective: "Generate and qualify leads by identifying decision-makers with active cloud migration or optimization requirements.",
    spec: ["Audience: Decision-makers involved in cloud infrastructure and management", "Target market: Mid-to-large enterprises", "Industries: Financial services, healthcare, manufacturing, logistics", "Geography: USA", "Campaign duration: 3 months", "Qualification approach: Structured Value-Add Assessment", "Lead type: Sales Qualified Leads (SQL)"],
    executed: ["Identified prospects within the agreed enterprise audience", "Used a structured Value-Add Assessment", "Captured qualification information", "Evaluated responses against agreed criteria", "Distinguished higher-intent prospects from information seekers", "Delivered SQLs to the client"],
    owned: "Audience targeting, prospect identification, assessment execution, qualification data collection, SQL identification, and handoff.",
    client: "Sales follow-up after handoff, opportunity management, further nurture, negotiation and closing.",
    metric: "92 SQLs",
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
    slug: "appointment-generation-engineering",
    eyebrow: "CASE STUDY 5 — APPOINTMENT GENERATION FOR A CLOUD-BASED DESIGN AND ENGINEERING SOLUTION",
    label: "Case Study 5",
    title: "Appointment Generation for a Cloud-Based Design and Engineering Solution",
    description: "An engineering software provider needed qualified sales appointments with manufacturing design and engineering decision-makers, including prospects using competing solutions. GETprospeKt executed targeted cold calling across 4,000 validated contacts, delivering 35 confirmed appointments (110% of KPI) with persona-specific handling of competitive objections.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1600&q=90",
    stats: [["USA", "Region"], ["4 months", "Campaign duration"], ["4,000", "Initial database"], ["35", "Appointments booked"], ["110%", "KPI achievement"]],
    profile: "A global engineering software provider offering a cloud-based design and engineering platform for the manufacturing sector.",
    objective: "Generate qualified sales appointments in the US manufacturing market for a cloud-based design and engineering solution.",
    spec: ["Campaign type: Appointment generation", "Region: USA", "Industry: SaaS / Engineering Software", "Target sector: Manufacturing", "Target segments: Furniture and consumer product manufacturing", "Target personas: Design and Engineering decision-makers", "Campaign duration: 4 months", "Initial database: 4,000 contacts", "Outreach channel: Cold calling"],
    executed: ["Audited the initial database against the agreed target profile", "Validated contacts and filtered out prospects that did not match", "Researched and enriched relevant contacts", "Developed persona-specific calling approaches", "Built objection-handling approaches", "Executed targeted cold calling and repeated follow-up", "Generated qualified appointments and handed them to the sales team"],
    owned: "Database validation, ICP filtering, contact research, persona identification, calling execution, follow-up, and appointment generation.",
    client: "Sales conversations after appointment handoff, opportunity management, demonstrations, negotiation and closing.",
    metric: "35 Appointments (110%)",
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
    slug: "appointment-generation-healthcare-buyer-personas",
    eyebrow: "CASE STUDY 6 — APPOINTMENT GENERATION ACROSS NEW HEALTHCARE BUYER PERSONAS",
    label: "Case Study 6",
    title: "Appointment Generation Across New Healthcare Buyer Personas",
    description: "A healthcare technology provider needed to expand beyond their traditional nursing audience into IT, Population Health, and Director+ decision-makers at hospital systems. GETprospeKt mapped complex healthcare account structures and executed targeted cold calling across ~200 hospital accounts, delivering 44 confirmed meetings with 72% from previously unreached buyer personas.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1600&q=90",
    stats: [["44", "Confirmed meetings delivered"], ["72%", "Previously unreached buyer personas"], ["~200", "Hospital accounts engaged"], ["USA", "Target geography"]],
    profile: "A healthcare technology provider offering operational, clinical workflow, and administrative solutions for hospital systems and integrated delivery networks.",
    objective: "Expand beyond traditional nursing stakeholders into IT, Population Health, and Director+ decision-makers at target hospital systems to secure qualified discovery meetings.",
    spec: ["Target industry: Healthcare Systems & Hospital Networks", "Target personas: IT Directors, Population Health Directors, Clinical Informatics, Hospital Administration", "Account universe: ~200 designated hospital systems in the USA", "Campaign focus: Persona expansion into unreached executive buying committees", "Outreach channel: Targeted cold calling & account structure mapping", "Deliverable: Confirmed meetings with Director+ healthcare leaders"],
    executed: ["Mapped complex hospital account hierarchies and decision-making structures across ~200 health systems", "Identified and verified direct contact details for IT, Population Health, and administrative leadership", "Designed persona-specific talk tracks addressing clinical workflow bottlenecks and system integration", "Executed targeted cold calling campaigns to navigate hospital gatekeepers and engage clinical/IT leaders", "Confirmed 44 qualified sales meetings, with 72% representing previously uncontacted stakeholder roles"],
    owned: "Hospital account mapping, new persona verification, multi-touch phone outreach, and meeting confirmation.",
    client: "Sales discovery calls, platform demonstrations, clinical workflow alignment, and contract negotiation.",
    metric: "44 Confirmed Meetings",
    faqs: [
      {
        question: "How did GETprospeKt identify new buyer personas within 200 hospital networks?",
        answer: "We mapped complex hospital administrative and clinical hierarchies, pinpointing key leaders across IT, Population Health, and Informatics who were previously uncontacted by the client's internal team."
      },
      {
        question: "Why did 72% of confirmed meetings come from previously unreached roles?",
        answer: "By creating persona-specific calling tracks centered on health informatics and system integration bottlenecks rather than standard nursing workflows, we engaged senior hospital executives who had historically ignored vendor outreach."
      },
      {
        question: "What qualified a hospital appointment before handoff to the client?",
        answer: "Each meeting required confirmed Director+ authority within a verified target hospital system, an identified clinical or IT optimization requirement, and acceptance of a scheduled calendar meeting."
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

  const [expandedSlugs, setExpandedSlugs] = useState<Record<string, boolean>>({});
  const [viewMode, setViewMode] = useState<"cards" | "accordion">("cards");

  const toggleAccordion = (itemSlug: string) => {
    setExpandedSlugs((prev) => ({
      ...prev,
      [itemSlug]: !prev[itemSlug],
    }));
  };

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

  // Gated Download State & Dynamic Form Configuration
  const [csFormConfig, setCsFormConfig] = useState<GatedFormConfig>(() =>
    formConfigApi.getForCaseStudy(selected)
  );

  useEffect(() => {
    setCsFormConfig(formConfigApi.getForCaseStudy(selected));
    const handleSync = () => {
      setCsFormConfig(formConfigApi.getForCaseStudy(selected));
    };
    window.addEventListener("gp_casestudies_updated", handleSync);
    window.addEventListener("gp_form_config_updated", handleSync);
    return () => {
      window.removeEventListener("gp_casestudies_updated", handleSync);
      window.removeEventListener("gp_form_config_updated", handleSync);
    };
  }, [selected]);

  const [dlFirstName, setDlFirstName] = useState("");
  const [dlLastName, setDlLastName] = useState("");
  const [dlEmail, setDlEmail] = useState("");
  const [dlTelephone, setDlTelephone] = useState("");
  const [dlCountry, setDlCountry] = useState("United States");
  const [dlCompany, setDlCompany] = useState("");
  const [dlCompanySize, setDlCompanySize] = useState("51 - 200 employees");
  const [dlCity, setDlCity] = useState("");
  const [dlAddress, setDlAddress] = useState("");
  const [dlPostalCode, setDlPostalCode] = useState("");
  const [dlIndustry, setDlIndustry] = useState("B2B Technology & Software");
  const [dlJobTitle, setDlJobTitle] = useState("Director / Head of Department");
  const [dlOptInMarketing, setDlOptInMarketing] = useState(true);
  const [dlOptInPartner, setDlOptInPartner] = useState(true);
  const [dlCustomFields, setDlCustomFields] = useState<Record<string, any>>({});
  const [dlIsSubmitting, setDlIsSubmitting] = useState(false);
  const [dlSuccess, setDlSuccess] = useState(false);
  const [dlError, setDlError] = useState("");

  const standardFieldKeys = [
    "firstName", "lastName", "email", "telephone", "companyName", "jobTitle",
    "industry", "companySize", "country", "city", "address", "postalCode",
    "optInMarketing", "optInPartner"
  ];
  const customFieldsList = Object.values(csFormConfig.fields || {}).filter(
    (f) => f && f.enabled && !standardFieldKeys.includes(f.id)
  );

  const handleDownload = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setDlError("");

    const fields = csFormConfig.fields;
    const missing: string[] = [];

    if (fields.firstName?.enabled && fields.firstName?.required && !dlFirstName.trim()) {
      missing.push(fields.firstName.label || "First Name");
    }
    if (fields.lastName?.enabled && fields.lastName?.required && !dlLastName.trim()) {
      missing.push(fields.lastName.label || "Last Name");
    }
    if (fields.email?.enabled && fields.email?.required && (!dlEmail.trim() || !dlEmail.includes("@"))) {
      missing.push(fields.email.label || "Corporate Work Email");
    }
    if (fields.telephone?.enabled && fields.telephone?.required && !dlTelephone.trim()) {
      missing.push(fields.telephone.label || "Phone Number");
    }
    if (fields.companyName?.enabled && fields.companyName?.required && !dlCompany.trim()) {
      missing.push(fields.companyName.label || "Company Name");
    }
    if (fields.jobTitle?.enabled && fields.jobTitle?.required && !dlJobTitle.trim()) {
      missing.push(fields.jobTitle.label || "Job Title");
    }
    if (fields.industry?.enabled && fields.industry?.required && !dlIndustry.trim()) {
      missing.push(fields.industry.label || "Industry");
    }
    if (fields.companySize?.enabled && fields.companySize?.required && !dlCompanySize.trim()) {
      missing.push(fields.companySize.label || "Company Size");
    }
    if (fields.country?.enabled && fields.country?.required && !dlCountry.trim()) {
      missing.push(fields.country.label || "Country");
    }
    if (fields.city?.enabled && fields.city?.required && !dlCity.trim()) {
      missing.push(fields.city.label || "City");
    }
    if (fields.address?.enabled && fields.address?.required && !dlAddress.trim()) {
      missing.push(fields.address.label || "Address");
    }
    if (fields.postalCode?.enabled && fields.postalCode?.required && !dlPostalCode.trim()) {
      missing.push(fields.postalCode.label || "Postal Code");
    }
    if (fields.optInMarketing?.enabled && fields.optInMarketing?.required && !dlOptInMarketing) {
      missing.push(fields.optInMarketing.label || "Marketing Consent");
    }
    if (fields.optInPartner?.enabled && fields.optInPartner?.required && !dlOptInPartner) {
      missing.push(fields.optInPartner.label || "Partner Consent");
    }

    // Validate any custom required fields
    customFieldsList.forEach((cf) => {
      if (cf.required) {
        const val = dlCustomFields[cf.id];
        if (cf.type === "checkbox") {
          if (!val) missing.push(cf.label);
        } else if (!val || !String(val).trim()) {
          missing.push(cf.label);
        }
      }
    });

    if (missing.length > 0) {
      setDlError(`Please complete required field(s): ${missing.join(", ")}`);
      return;
    }

    setDlIsSubmitting(true);

    try {
      // Record lead in enquiries system
      try {
        await enquiriesApi.submit({
          firstName: dlFirstName.trim(),
          lastName: dlLastName.trim(),
          email: dlEmail.trim(),
          telephone: dlTelephone.trim(),
          country: dlCountry,
          company: dlCompany.trim(),
          companySize: dlCompanySize,
          city: dlCity.trim(),
          address: dlAddress.trim(),
          postalCode: dlPostalCode.trim(),
          industry: dlIndustry,
          jobTitle: dlJobTitle,
          resourceId: selected._id || selected.slug,
          resourceTitle: selected.title,
          optInMarketing: dlOptInMarketing,
          optInPartner: dlOptInPartner,
          customFields: dlCustomFields,
          subject: `Case Study Download: ${selected.title}`,
          message: `Lead downloaded Case Study: ${selected.title}. Format: ${selected.downloadFileType || "PDF"}. Company: ${dlCompany}, Job Title: ${dlJobTitle}, Phone: ${dlTelephone}`,
        });
      } catch (logErr) {
        console.warn("[Enquiry Log Error]", logErr);
      }

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
          <div className="case-catalog-section">
            <div className="case-catalog-hero">
              <span className="case-catalog-badge">PROVEN B2B PIPELINE OUTCOMES</span>
              <h1>Client Success Stories & Case Studies</h1>
              <div className="catalog-accent-line"></div>
              <p>
                Explore verified lead generation, BANT qualification, and appointment generation benchmarks across enterprise technology and healthcare sectors.
              </p>
            </div>

            <div className="case-view-controls">
              <div className="case-count-indicator">
                Showing <strong>{studiesList.length}</strong> Verified Case Studies
              </div>
              <div className="case-view-toggle-group">
                <button
                  type="button"
                  className={`case-view-toggle-btn ${viewMode === "cards" ? "is-active" : ""}`}
                  onClick={() => setViewMode("cards")}
                  title="Card Grid View"
                >
                  <span>⊞</span> Cards
                </button>
                <button
                  type="button"
                  className={`case-view-toggle-btn ${viewMode === "accordion" ? "is-active" : ""}`}
                  onClick={() => setViewMode("accordion")}
                  title="Accordion List View"
                >
                  <span>☰</span> Accordion
                </button>
              </div>
            </div>

            {viewMode === "cards" ? (
              <div className="case-cards-grid">
                {studiesList.map((item, idx) => {
                  const eyebrowText =
                    item.eyebrow ||
                    `CASE STUDY ${idx + 1} — ${item.title.toUpperCase()}`;
                  const topMetric =
                    item.metric ||
                    (item.stats && item.stats[0] ? item.stats[0][0] : "Verified");

                  return (
                    <article className="case-card-item" key={item.slug}>
                      <Link to={"/case-studies/" + item.slug} className="case-card-inner-link">
                        <div className="case-card-image-wrap">
                          <img src={item.image} alt={item.title} loading="lazy" />
                          <span className="case-card-badge-tag">
                            {item.label || `Case Study ${idx + 1}`}
                          </span>
                          <span className="case-card-metric-pill">{topMetric}</span>
                        </div>

                        <div className="case-card-content">
                          <div className="case-card-eyebrow">{eyebrowText}</div>
                          <h2 className="case-card-title">{item.title}</h2>
                          {item.client && (
                            <div className="case-card-client-row">
                              <span className="case-card-client-label">Client:</span>{" "}
                              <span className="case-card-client-val">{item.client}</span>
                            </div>
                          )}
                          <p className="case-card-desc">{item.description}</p>

                          {item.stats && item.stats.length > 0 && (
                            <div className="case-card-metrics-row">
                              {item.stats.slice(0, 3).map(([val, lbl]: [string, string], sIdx: number) => (
                                <div key={sIdx} className="case-card-mini-metric">
                                  <strong>{val}</strong>
                                  <small>{lbl}</small>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="case-card-btn-wrap">
                            <span className="case-card-btn">
                              Read Full Case Study <span className="arrow-icon">→</span>
                            </span>
                          </div>
                        </div>
                      </Link>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="case-accordion-catalog">
                <div className="case-accordion-list">
                  {studiesList.map((item, idx) => {
                    const isExpanded = !!expandedSlugs[item.slug];
                    const eyebrowText =
                      item.eyebrow ||
                      `CASE STUDY ${idx + 1} — ${item.title.toUpperCase()}`;
                    return (
                      <article
                        className={`case-accordion-card ${isExpanded ? "is-expanded" : ""}`}
                        key={item.slug}
                      >
                        <div
                          className="case-accordion-header"
                          onClick={() => toggleAccordion(item.slug)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              toggleAccordion(item.slug);
                            }
                          }}
                        >
                          <div className="case-accordion-main">
                            <div className="case-accordion-eyebrow">{eyebrowText}</div>
                            <h2 className="case-accordion-title">{item.title}</h2>
                            <p className="case-accordion-desc">{item.description}</p>
                          </div>

                          <button
                            type="button"
                            className={`case-accordion-toggle-btn ${isExpanded ? "is-expanded" : ""}`}
                            aria-label={isExpanded ? "Collapse case study details" : "Expand case study details"}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleAccordion(item.slug);
                            }}
                          >
                            <svg
                              viewBox="0 0 24 24"
                              width="18"
                              height="18"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                          </button>
                        </div>

                        {isExpanded && (
                          <div className="case-accordion-body">
                            {item.stats && item.stats.length > 0 && (
                              <div className="case-accordion-metrics-row">
                                {item.stats.map(([val, lbl]: [string, string], sIdx: number) => (
                                  <div key={sIdx} className="case-accordion-metric-badge">
                                    <strong>{val}</strong>
                                    <span>{lbl}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            <div className="case-accordion-details-columns">
                              {item.profile && (
                                <div className="case-accordion-detail-box">
                                  <h4>Client Profile</h4>
                                  <p>{item.profile}</p>
                                </div>
                              )}
                              {item.objective && (
                                <div className="case-accordion-detail-box">
                                  <h4>Campaign Objective</h4>
                                  <p>{item.objective}</p>
                                </div>
                              )}
                            </div>

                            {item.executed && item.executed.length > 0 && (
                              <div className="case-accordion-execution-box">
                                <h4>Execution Highlights</h4>
                                <ul>
                                  {item.executed.slice(0, 4).map((step, stepIdx) => (
                                    <li key={stepIdx}>{step}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            <div className="case-accordion-cta-row">
                              <Link
                                to={`/case-studies/${item.slug}`}
                                className="case-accordion-full-link"
                              >
                                Read Full Case Study & Download PDF →
                              </Link>
                            </div>
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
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
                <h2>{csFormConfig.headerTitle || "Download Complete Case Study Blueprint & Data"}</h2>
                <p>
                  {csFormConfig.subtitle || "Access the full executive report, verified targeting parameters, outreach cadences, and conversion benchmarks. Enter your corporate details below to download immediately."}
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
                    {/* First Name */}
                    {csFormConfig.fields.firstName?.enabled && (
                      <div className="case-dl-field">
                        <label htmlFor="cs-dl-first">
                          {csFormConfig.fields.firstName.label || "First Name"}{" "}
                          {csFormConfig.fields.firstName.required && <span className="req">*</span>}
                        </label>
                        <input
                          id="cs-dl-first"
                          type="text"
                          required={csFormConfig.fields.firstName.required}
                          placeholder="John"
                          value={dlFirstName}
                          onChange={(e) => setDlFirstName(e.target.value)}
                        />
                      </div>
                    )}

                    {/* Last Name */}
                    {csFormConfig.fields.lastName?.enabled && (
                      <div className="case-dl-field">
                        <label htmlFor="cs-dl-last">
                          {csFormConfig.fields.lastName.label || "Last Name"}{" "}
                          {csFormConfig.fields.lastName.required && <span className="req">*</span>}
                        </label>
                        <input
                          id="cs-dl-last"
                          type="text"
                          required={csFormConfig.fields.lastName.required}
                          placeholder="Smith"
                          value={dlLastName}
                          onChange={(e) => setDlLastName(e.target.value)}
                        />
                      </div>
                    )}

                    {/* Email */}
                    {csFormConfig.fields.email?.enabled && (
                      <div className="case-dl-field">
                        <label htmlFor="cs-dl-email">
                          {csFormConfig.fields.email.label || "Corporate Work Email"}{" "}
                          {csFormConfig.fields.email.required && <span className="req">*</span>}
                        </label>
                        <input
                          id="cs-dl-email"
                          type="email"
                          required={csFormConfig.fields.email.required}
                          placeholder="john.smith@company.com"
                          value={dlEmail}
                          onChange={(e) => setDlEmail(e.target.value)}
                        />
                      </div>
                    )}

                    {/* Telephone */}
                    {csFormConfig.fields.telephone?.enabled && (
                      <div className="case-dl-field">
                        <label htmlFor="cs-dl-phone">
                          {csFormConfig.fields.telephone.label || "Direct Phone Number"}{" "}
                          {csFormConfig.fields.telephone.required && <span className="req">*</span>}
                        </label>
                        <input
                          id="cs-dl-phone"
                          type="tel"
                          required={csFormConfig.fields.telephone.required}
                          placeholder="+1 (555) 019-2834"
                          value={dlTelephone}
                          onChange={(e) => setDlTelephone(e.target.value)}
                        />
                      </div>
                    )}

                    {/* Company Name */}
                    {csFormConfig.fields.companyName?.enabled && (
                      <div className="case-dl-field">
                        <label htmlFor="cs-dl-company">
                          {csFormConfig.fields.companyName.label || "Company Name"}{" "}
                          {csFormConfig.fields.companyName.required && <span className="req">*</span>}
                        </label>
                        <input
                          id="cs-dl-company"
                          type="text"
                          required={csFormConfig.fields.companyName.required}
                          placeholder="Acme Enterprises"
                          value={dlCompany}
                          onChange={(e) => setDlCompany(e.target.value)}
                        />
                      </div>
                    )}

                    {/* Job Title */}
                    {csFormConfig.fields.jobTitle?.enabled && (
                      <div className="case-dl-field">
                        <label htmlFor="cs-dl-job">
                          {csFormConfig.fields.jobTitle.label || "Job Title"}{" "}
                          {csFormConfig.fields.jobTitle.required && <span className="req">*</span>}
                        </label>
                        <select
                          id="cs-dl-job"
                          required={csFormConfig.fields.jobTitle.required}
                          value={dlJobTitle}
                          onChange={(e) => setDlJobTitle(e.target.value)}
                        >
                          {JOB_TITLE_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Industry */}
                    {csFormConfig.fields.industry?.enabled && (
                      <div className="case-dl-field">
                        <label htmlFor="cs-dl-industry">
                          {csFormConfig.fields.industry.label || "Industry Sector"}{" "}
                          {csFormConfig.fields.industry.required && <span className="req">*</span>}
                        </label>
                        <select
                          id="cs-dl-industry"
                          required={csFormConfig.fields.industry.required}
                          value={dlIndustry}
                          onChange={(e) => setDlIndustry(e.target.value)}
                        >
                          {INDUSTRY_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Company Size */}
                    {csFormConfig.fields.companySize?.enabled && (
                      <div className="case-dl-field">
                        <label htmlFor="cs-dl-compsize">
                          {csFormConfig.fields.companySize.label || "Company Size"}{" "}
                          {csFormConfig.fields.companySize.required && <span className="req">*</span>}
                        </label>
                        <select
                          id="cs-dl-compsize"
                          required={csFormConfig.fields.companySize.required}
                          value={dlCompanySize}
                          onChange={(e) => setDlCompanySize(e.target.value)}
                        >
                          {COMPANY_SIZE_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Country */}
                    {csFormConfig.fields.country?.enabled && (
                      <div className="case-dl-field">
                        <label htmlFor="cs-dl-country">
                          {csFormConfig.fields.country.label || "Country / Territory"}{" "}
                          {csFormConfig.fields.country.required && <span className="req">*</span>}
                        </label>
                        <input
                          id="cs-dl-country"
                          type="text"
                          required={csFormConfig.fields.country.required}
                          placeholder="e.g. United States, Germany, Japan"
                          value={dlCountry}
                          onChange={(e) => setDlCountry(e.target.value)}
                        />
                      </div>
                    )}

                    {/* City */}
                    {csFormConfig.fields.city?.enabled && (
                      <div className="case-dl-field">
                        <label htmlFor="cs-dl-city">
                          {csFormConfig.fields.city.label || "City"}{" "}
                          {csFormConfig.fields.city.required && <span className="req">*</span>}
                        </label>
                        <input
                          id="cs-dl-city"
                          type="text"
                          required={csFormConfig.fields.city.required}
                          placeholder="e.g. San Francisco, London"
                          value={dlCity}
                          onChange={(e) => setDlCity(e.target.value)}
                        />
                      </div>
                    )}

                    {/* Address */}
                    {csFormConfig.fields.address?.enabled && (
                      <div className="case-dl-field">
                        <label htmlFor="cs-dl-address">
                          {csFormConfig.fields.address.label || "Corporate Street Address"}{" "}
                          {csFormConfig.fields.address.required && <span className="req">*</span>}
                        </label>
                        <input
                          id="cs-dl-address"
                          type="text"
                          required={csFormConfig.fields.address.required}
                          placeholder="100 Enterprise Way, Suite 400"
                          value={dlAddress}
                          onChange={(e) => setDlAddress(e.target.value)}
                        />
                      </div>
                    )}

                    {/* Postal Code */}
                    {csFormConfig.fields.postalCode?.enabled && (
                      <div className="case-dl-field">
                        <label htmlFor="cs-dl-postal">
                          {csFormConfig.fields.postalCode.label || "Postal / ZIP Code"}{" "}
                          {csFormConfig.fields.postalCode.required && <span className="req">*</span>}
                        </label>
                        <input
                          id="cs-dl-postal"
                          type="text"
                          required={csFormConfig.fields.postalCode.required}
                          placeholder="94105"
                          value={dlPostalCode}
                          onChange={(e) => setDlPostalCode(e.target.value)}
                        />
                      </div>
                    )}

                    {/* Dynamic Custom Fields */}
                    {customFieldsList.map((cf) => (
                      <div
                        key={cf.id}
                        className={`case-dl-field ${cf.type === "textarea" ? "full-width" : ""}`}
                      >
                        <label htmlFor={`dl-${cf.id}`}>
                          {cf.label} {cf.required && <span className="req">*</span>}
                        </label>
                        {cf.type === "select" ? (
                          <select
                            id={`dl-${cf.id}`}
                            required={cf.required}
                            value={dlCustomFields[cf.id] || ""}
                            onChange={(e) =>
                              setDlCustomFields((prev) => ({ ...prev, [cf.id]: e.target.value }))
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
                            id={`dl-${cf.id}`}
                            required={cf.required}
                            placeholder={cf.placeholder || `Enter ${cf.label}...`}
                            rows={3}
                            value={dlCustomFields[cf.id] || ""}
                            onChange={(e) =>
                              setDlCustomFields((prev) => ({ ...prev, [cf.id]: e.target.value }))
                            }
                          />
                        ) : cf.type === "checkbox" ? (
                          <div className="case-dl-checkbox">
                            <label>
                              <input
                                type="checkbox"
                                checked={Boolean(dlCustomFields[cf.id])}
                                onChange={(e) =>
                                  setDlCustomFields((prev) => ({
                                    ...prev,
                                    [cf.id]: e.target.checked,
                                  }))
                                }
                              />
                              <span>{cf.placeholder || cf.label}</span>
                            </label>
                          </div>
                        ) : (
                          <input
                            type={cf.type || "text"}
                            id={`dl-${cf.id}`}
                            required={cf.required}
                            placeholder={cf.placeholder || `Enter ${cf.label}...`}
                            value={dlCustomFields[cf.id] || ""}
                            onChange={(e) =>
                              setDlCustomFields((prev) => ({ ...prev, [cf.id]: e.target.value }))
                            }
                          />
                        )}
                      </div>
                    ))}

                    {/* Opt-In Marketing */}
                    {csFormConfig.fields.optInMarketing?.enabled && (
                      <div className="case-dl-field full-width case-dl-checkbox">
                        <label>
                          <input
                            type="checkbox"
                            checked={dlOptInMarketing}
                            onChange={(e) => setDlOptInMarketing(e.target.checked)}
                          />
                          <span>
                            {csFormConfig.fields.optInMarketing.label ||
                              "I would like to receive information from suppliers sponsoring this content and willing to share the information above with OnDot Media."}
                            {csFormConfig.fields.optInMarketing.required && <span className="req">*</span>}
                          </span>
                        </label>
                      </div>
                    )}

                    {/* Opt-In Partner */}
                    {csFormConfig.fields.optInPartner?.enabled && (
                      <div className="case-dl-field full-width case-dl-checkbox">
                        <label>
                          <input
                            type="checkbox"
                            checked={dlOptInPartner}
                            onChange={(e) => setDlOptInPartner(e.target.checked)}
                          />
                          <span>
                            {csFormConfig.fields.optInPartner.label ||
                              "By checking this box, I agree that OnDot Media can share my data with Partners so that Partners can contact me by email or phone and provide more information about this content."}
                            {csFormConfig.fields.optInPartner.required && <span className="req">*</span>}
                          </span>
                        </label>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="case-dl-submit-btn"
                    disabled={dlIsSubmitting}
                  >
                    {dlIsSubmitting
                      ? "Generating Document..."
                      : csFormConfig.submitButtonText || "DOWNLOAD NOW!"}
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
           CASE STUDY CARD FORMAT GRID & CATALOG
           ========================================================= */

        .case-catalog-page {
          background: #060a12;
        }

        .case-catalog-page .case-container {
          width: min(1400px, calc(100% - 48px));
          margin: 0 auto;
          padding: 30px 0 80px;
        }

        .case-catalog-section {
          width: 100%;
        }

        .case-catalog-hero {
          text-align: center;
          margin-bottom: 35px;
          padding: 10px 0 0;
        }

        .case-catalog-badge {
          display: inline-block;
          font-size: 11.5px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #00D2FF;
          background: rgba(0, 70, 252, 0.12);
          border: 1px solid rgba(0, 210, 255, 0.25);
          padding: 6px 18px;
          border-radius: 20px;
          margin-bottom: 14px;
        }

        .case-catalog-hero h1 {
          font-size: 36px;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0;
          letter-spacing: -0.5px;
        }

        .catalog-accent-line {
          width: 60px;
          height: 3px;
          background: linear-gradient(90deg, #0046FC, #00D2FF);
          margin: 14px auto 16px;
          border-radius: 2px;
        }

        .case-catalog-hero p {
          color: #94A3B8;
          font-size: 15.5px;
          max-width: 720px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* View Mode Controls */
        .case-view-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
          padding-bottom: 14px;
          border-bottom: 1px solid rgba(203, 213, 225, 0.1);
        }

        .case-count-indicator {
          color: #94a3b8;
          font-size: 13.5px;
          font-weight: 600;
        }

        .case-count-indicator strong {
          color: #38bdf8;
        }

        .case-view-toggle-group {
          display: inline-flex;
          background: #090e1a;
          border: 1px solid #1b2a47;
          border-radius: 8px;
          padding: 3px;
          gap: 4px;
        }

        .case-view-toggle-btn {
          background: transparent;
          border: none;
          color: #94a3b8;
          font-size: 12.5px;
          font-weight: 700;
          padding: 6px 14px;
          border-radius: 6px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s ease;
        }

        .case-view-toggle-btn:hover {
          color: #ffffff;
        }

        .case-view-toggle-btn.is-active {
          background: linear-gradient(135deg, #0046fc 0%, #00d2ff 100%);
          color: #ffffff;
          box-shadow: 0 2px 8px rgba(0, 70, 252, 0.35);
        }

        /* 3-Column / 2-Column Responsive Cards Grid */
        .case-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 26px;
        }

        @media (max-width: 1120px) {
          .case-cards-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 22px;
          }
        }

        @media (max-width: 680px) {
          .case-cards-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }

        .case-card-item {
          background: #0d1527;
          border: 1px solid rgba(56, 189, 248, 0.16);
          border-top: 3px solid #0046fc;
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
          display: flex;
          flex-direction: column;
        }

        .case-card-item:hover {
          transform: translateY(-8px) scale(1.01);
          border-color: #38bdf8;
          border-top-color: #38bdf8;
          box-shadow: 0 18px 40px rgba(0, 70, 252, 0.35), 0 0 24px rgba(56, 189, 248, 0.2);
        }

        .case-card-inner-link {
          display: flex;
          flex-direction: column;
          height: 100%;
          text-decoration: none;
          color: inherit;
        }

        .case-card-image-wrap {
          position: relative;
          height: 200px;
          overflow: hidden;
          background: #060b12;
        }

        .case-card-image-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .case-card-item:hover .case-card-image-wrap img {
          transform: scale(1.07);
        }

        .case-card-badge-tag {
          position: absolute;
          top: 12px;
          left: 12px;
          background: rgba(0, 70, 252, 0.92);
          color: #ffffff;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.6px;
          padding: 4px 10px;
          border-radius: 4px;
          text-transform: uppercase;
          backdrop-filter: blur(4px);
        }

        .case-card-metric-pill {
          position: absolute;
          top: 12px;
          right: 12px;
          background: #00d2ff;
          color: #060b12;
          font-size: 12px;
          font-weight: 800;
          padding: 4px 11px;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
        }

        .case-card-content {
          padding: 22px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .case-card-eyebrow {
          color: #38bdf8;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.6px;
          text-transform: uppercase;
          margin-bottom: 6px;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .case-card-title {
          margin: 0 0 8px;
          font-size: 18px;
          font-weight: 700;
          color: #ffffff;
          line-height: 1.35;
          transition: color 0.2s ease;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .case-card-item:hover .case-card-title {
          color: #00d2ff;
        }

        .case-card-client-row {
          font-size: 12px;
          color: #64748b;
          margin-bottom: 12px;
        }

        .case-card-client-label {
          color: #64748b;
          font-weight: 600;
        }

        .case-card-client-val {
          color: #94a3b8;
          font-weight: 700;
        }

        .case-card-desc {
          margin: 0 0 16px;
          font-size: 13.5px;
          color: #94a3b8;
          line-height: 1.55;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .case-card-metrics-row {
          display: flex;
          gap: 10px;
          margin-bottom: 18px;
          padding: 10px 12px;
          background: #060b12;
          border: 1px solid rgba(203, 213, 225, 0.1);
          border-radius: 8px;
        }

        .case-card-mini-metric {
          flex: 1;
          min-width: 0;
        }

        .case-card-mini-metric strong {
          display: block;
          font-size: 14px;
          color: #00d2ff;
          font-weight: 800;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .case-card-mini-metric small {
          font-size: 10.5px;
          color: #94a3b8;
          display: block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .case-card-btn-wrap {
          margin-top: auto;
          padding-top: 10px;
        }

        .case-card-btn {
          width: 100%;
          padding: 10px 14px;
          background: rgba(0, 70, 252, 0.14);
          border: 1px solid rgba(0, 210, 255, 0.35);
          border-radius: 6px;
          color: #d5dbe7;
          font-size: 13px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all 0.25s ease;
        }

        .case-card-item:hover .case-card-btn {
          background: linear-gradient(135deg, #0046fc 0%, #00d2ff 100%);
          color: #ffffff;
          border-color: transparent;
          box-shadow: 0 4px 14px rgba(0, 70, 252, 0.4);
        }

        .case-card-btn .arrow-icon {
          transition: transform 0.25s ease;
          color: #00d2ff;
        }

        .case-card-item:hover .case-card-btn .arrow-icon {
          transform: translateX(5px);
          color: #ffffff;
        }

        /* Accordion mode constraints */
        .case-accordion-catalog {
          width: 100%;
          max-width: 980px;
          margin: 0 auto;
        }

        .case-accordion-list {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .case-accordion-card {
          background: #0d1527;
          border: 1px solid #1b2a47;
          border-radius: 12px;
          padding: 24px 28px;
          transition: all 0.25s ease;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.45);
          position: relative;
        }

        .case-accordion-card:hover {
          border-color: #2563eb;
          box-shadow: 0 6px 26px rgba(37, 99, 235, 0.22);
        }

        .case-accordion-card.is-expanded {
          border-color: #38bdf8;
          box-shadow: 0 8px 30px rgba(56, 189, 248, 0.18);
        }

        .case-accordion-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
          cursor: pointer;
          user-select: none;
        }

        .case-accordion-main {
          flex: 1;
          min-width: 0;
        }

        .case-accordion-eyebrow {
          color: #38bdf8;
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 0.6px;
          text-transform: uppercase;
          margin-bottom: 8px;
          line-height: 1.4;
        }

        .case-accordion-title {
          color: #ffffff;
          font-size: 20.5px;
          font-weight: 700;
          line-height: 1.35;
          margin: 0 0 10px 0;
          transition: color 0.2s ease;
        }

        .case-accordion-desc {
          color: #94a3b8;
          font-size: 14px;
          line-height: 1.6;
          margin: 0;
        }

        .case-accordion-toggle-btn {
          width: 36px;
          height: 36px;
          min-width: 36px;
          border-radius: 50%;
          background: #060b16;
          border: 1.5px solid #1e293b;
          color: #38bdf8;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          padding: 0;
          margin-top: 2px;
          flex-shrink: 0;
        }

        .case-accordion-toggle-btn:hover {
          background: #0f172a;
          border-color: #38bdf8;
          color: #ffffff;
          transform: scale(1.08);
        }

        .case-accordion-toggle-btn.is-expanded {
          background: #38bdf8;
          border-color: #38bdf8;
          color: #060b16;
          transform: rotate(180deg);
        }

        .case-accordion-body {
          margin-top: 22px;
          padding-top: 20px;
          border-top: 1px solid rgba(27, 42, 71, 0.8);
          animation: caseAccordionFadeIn 0.28s ease forwards;
        }

        @keyframes caseAccordionFadeIn {
          from {
            opacity: 0;
            transform: translateY(-6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .case-accordion-metrics-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 12px;
          margin-bottom: 18px;
        }

        .case-accordion-metric-badge {
          background: rgba(15, 23, 42, 0.85);
          border: 1px solid rgba(56, 189, 248, 0.25);
          border-radius: 8px;
          padding: 12px 14px;
          display: flex;
          flex-direction: column;
        }

        .case-accordion-metric-badge strong {
          color: #38bdf8;
          font-size: 19px;
          font-weight: 800;
          margin-bottom: 2px;
        }

        .case-accordion-metric-badge span {
          color: #94a3b8;
          font-size: 12px;
          line-height: 1.3;
        }

        .case-accordion-details-columns {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }

        @media (max-width: 768px) {
          .case-accordion-details-columns {
            grid-template-columns: 1fr;
          }
          .case-accordion-card {
            padding: 18px 16px;
          }
          .case-accordion-title {
            font-size: 18px;
          }
        }

        .case-accordion-detail-box,
        .case-accordion-execution-box {
          background: rgba(13, 21, 39, 0.6);
          border: 1px solid rgba(27, 42, 71, 0.8);
          border-radius: 8px;
          padding: 14px 16px;
        }

        .case-accordion-detail-box h4,
        .case-accordion-execution-box h4 {
          color: #ffffff;
          font-size: 13.5px;
          font-weight: 700;
          margin: 0 0 8px 0;
        }

        .case-accordion-detail-box p {
          color: #94a3b8;
          font-size: 13px;
          line-height: 1.55;
          margin: 0;
        }

        .case-accordion-execution-box {
          margin-bottom: 18px;
        }

        .case-accordion-execution-box ul {
          margin: 0;
          padding-left: 20px;
          color: #94a3b8;
          font-size: 13px;
          line-height: 1.6;
        }

        .case-accordion-execution-box li {
          margin-bottom: 4px;
        }

        .case-accordion-cta-row {
          display: flex;
          justify-content: flex-end;
          margin-top: 14px;
        }

        .case-accordion-full-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #0046fc, #00d2ff);
          color: #ffffff;
          font-size: 13.5px;
          font-weight: 700;
          padding: 9px 18px;
          border-radius: 6px;
          text-decoration: none;
          transition: all 0.25s ease;
          box-shadow: 0 4px 14px rgba(0, 70, 252, 0.35);
        }

        .case-accordion-full-link:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 22px rgba(0, 210, 255, 0.45);
          color: #ffffff;
        }

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

        .case-dl-field input,
        .case-dl-field select {
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

        .case-dl-field input:focus,
        .case-dl-field select:focus {
          border-color: #00D2FF;
          box-shadow: 0 0 0 3px rgba(0, 210, 255, 0.15);
        }

        .case-dl-checkbox label {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          cursor: pointer;
          font-size: 12.5px;
          color: #94A3B8;
          line-height: 1.45;
          font-weight: 500;
        }

        .case-dl-checkbox input[type="checkbox"] {
          width: 16px;
          height: 16px;
          margin-top: 2px;
          accent-color: #00D2FF;
          flex-shrink: 0;
          cursor: pointer;
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

import humanVerifiedImg from "../assets/images/solutions/human-verified-data.jpg";
import mqlGenerationImg from "../assets/images/solutions/mql-generation.jpg";
import sqlGenerationImg from "../assets/images/solutions/sql-generation.jpg";
import bantQualifiedImg from "../assets/images/solutions/bant-qualified-leads.jpg";
import appointmentGenImg from "../assets/images/solutions/appointment-generation.jpg";
import webinarCampaignsImg from "../assets/images/solutions/webinar-campaigns.jpg";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getHeaders = (includeAuth = false) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (includeAuth) {
    const token = localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return headers;
};

// ================= AUTH API =================
export const authApi = {
  login: async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to log in.");
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      return data;
    } catch (error: any) {
      // Fallback for standalone demo when backend server is offline
      if (email === "admin@getprospekt.co" && password === "admin123") {
        localStorage.setItem("token", "mock_jwt_token_2026");
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem(
          "user",
          JSON.stringify({ name: "Admin", email, role: "admin" })
        );
        return {
          token: "mock_jwt_token_2026",
          user: { name: "Admin", email, role: "admin" },
        };
      }
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
  },

  getMe: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getHeaders(true),
    });
    return response.json();
  },
};

// ================= ARTICLES API =================
export const articlesApi = {
  getAll: async (category?: string) => {
    try {
      const url = category
        ? `${API_BASE_URL}/articles?category=${encodeURIComponent(category)}`
        : `${API_BASE_URL}/articles`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch articles");
      return await response.json();
    } catch (error) {
      console.warn("[API Warning] Using local article fallback:", error);
      return [];
    }
  },

  getBySlug: async (slug: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/articles/${slug}`);
      if (!response.ok) throw new Error("Article not found");
      return await response.json();
    } catch (error) {
      return null;
    }
  },

  create: async (articleData: any) => {
    const response = await fetch(`${API_BASE_URL}/articles`, {
      method: "POST",
      headers: getHeaders(true),
      body: JSON.stringify(articleData),
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || "Failed to create article");
    }
    return response.json();
  },

  update: async (id: string, articleData: any) => {
    const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
      method: "PUT",
      headers: getHeaders(true),
      body: JSON.stringify(articleData),
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || "Failed to update article");
    }
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
      method: "DELETE",
      headers: getHeaders(true),
    });
    return response.json();
  },
};

// ================= CASE STUDIES API =================
export const caseStudiesApi = {
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/case-studies`);
      if (!response.ok) throw new Error("Failed to fetch case studies");
      return await response.json();
    } catch (error) {
      return [];
    }
  },

  create: async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/case-studies`, {
      method: "POST",
      headers: getHeaders(true),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || "Failed to create case study");
    }
    return response.json();
  },

  update: async (id: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}/case-studies/${id}`, {
      method: "PUT",
      headers: getHeaders(true),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || "Failed to update case study");
    }
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/case-studies/${id}`, {
      method: "DELETE",
      headers: getHeaders(true),
    });
    return response.json();
  },
};

export interface CaseStudyData {
  _id: string;
  slug: string;
  eyebrow?: string;
  label?: string;
  title: string;
  client: string;
  metric: string;
  description: string;
  image: string;
  profile: string;
  objective: string;
  stats: [string, string][];
  spec: string[];
  executed: string[];
  owned: string;
  clientOwned: string;
  fileUrl?: string;
  downloadFileType?: string;
  downloadFileName?: string;
  downloadContent?: string;
  downloadCount?: number;
  faqs?: { question: string; answer: string }[];
  formConfig?: GatedFormConfig;
}

export const initialCaseStudiesList: CaseStudyData[] = [
  {
    _id: "cs-1",
    slug: "webinar-registrations-ai-business-process",
    eyebrow: "CASE STUDY 1 — WEBINAR REGISTRATIONS FOR AI AND BUSINESS PROCESS WEBINAR",
    label: "Case Study 1",
    title: "Targeted Outreach for an AI and Business-Process Webinar",
    client: "US Enterprise AI Webinar Organizer",
    metric: "192 Registrations",
    description: "A US-focused webinar organizer targeting technology decision-makers needed high-quality registrations from a defined audience. GETprospeKt identified and engaged 1,500+ prospects matching the target specification, resulting in 192 webinar registrations and 23 attendees, with a 12% attendance rate.",
    image: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?auto=format&fit=crop&w=1600&q=90",
    profile: "Organizer of a US-focused webinar on AI in business processes, targeting technology professionals in managerial and senior-level roles.",
    objective: "Generate high-quality webinar registrations from a defined audience of technology decision-makers and influencers, not generic traffic.",
    stats: [["1,500+", "Prospects identified and engaged"], ["192", "Webinar registrations"], ["23", "Attendees"], ["12%", "Attendance rate"]],
    spec: [
      "Audience: Technology professionals in the United States",
      "Seniority: Managerial and senior-level contacts",
      "Company size: 500+ employees",
      "Industries: Finance, manufacturing, retail, hospitality, and other technology-oriented business environments",
      "Relevance: Prospects whose roles made the webinar topic directly meaningful",
    ],
    executed: [
      "Identified and reviewed prospects against the agreed audience specification",
      "Ran personalized email outreach focused on the webinar's core question",
      "Executed sequential follow-up through email and tele-calling",
      "Maintained strict adherence to the agreed audience and campaign criteria throughout",
    ],
    owned: "Prospect identification, outreach, follow-up, and registration generation against the agreed specification.",
    clientOwned: "Event experience, content delivery, attendee engagement, and all downstream activity after registration.",
  },
  {
    _id: "cs-2",
    slug: "bant-lead-generation-enterprise-automation",
    eyebrow: "CASE STUDY 2 — TARGETED BANT LEAD GENERATION FOR AN ENTERPRISE AUTOMATION PLATFORM",
    label: "Case Study 2",
    title: "Targeted BANT Lead Generation for an Enterprise Automation Platform",
    client: "Global Automation Software",
    metric: "125 BANT Leads",
    description: "A global software company needed BANT-qualified leads over three months to feed their US sales team. GETprospeKt identified and qualified Technology and Marketing decision-makers using tele-calling, delivering 125 BANT-qualified leads (Budget, Authority, Need, Timing verified) across CIOs, CTOs, CMOs, and Marketing/IT Directors in 3 months.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=90",
    profile: "A global software company offering an enterprise automation platform designed for organizations seeking to improve workflow efficiency and operational productivity.",
    objective: "Generate 125 BANT-qualified leads over a three-month campaign from a defined audience of Technology and Marketing decision-makers in the United States.",
    stats: [["125", "BANT-qualified leads delivered"], ["USA", "Geography"], ["3 months", "Campaign duration"], ["BANT", "Budget, Authority, Need, Timing verified"]],
    spec: [
      "Geography: USA",
      "Company size: 250+ employees",
      "Campaign duration: 3 months",
      "Lead type: BANT-qualified leads",
      "BANT qualification: Budget, Authority, Need, Timing verified",
      "Outreach channel: Tele-calling",
      "Target audience: Technology and Marketing decision-makers",
      "Target roles: CIOs, CTOs, CMOs, Marketing Directors, IT Directors",
    ],
    executed: [
      "Identified and researched Technology and Marketing decision-makers",
      "Executed targeted tele-calling against the defined prospect universe",
      "Conducted follow-up conversations and applied the agreed BANT qualification criteria",
      "Delivered leads with Budget, Authority, Need, and Timing verified",
    ],
    owned: "Prospect identification, audience matching, tele-calling and follow-up, BANT qualification, and lead delivery.",
    clientOwned: "Sales follow-up after lead handoff.",
  },
  {
    _id: "cs-3",
    slug: "mql-generation-marcom-platform",
    eyebrow: "CASE STUDY 3 — MQL GENERATION FOR A MARKETING COMMUNICATIONS MANAGEMENT SOLUTION",
    label: "Case Study 3",
    title: "MQL Generation for a Marketing Communications Management Solution",
    client: "Enterprise MarCom Provider",
    metric: "8,500 MQLs",
    description: "A MarCom platform provider needed high-volume MQLs within a 60-day campaign to feed their sales and nurture pipelines. GETprospeKt executed outreach to Marketing Communications professionals across enterprise and mid-market organizations in the USA, delivering 8,500 MQLs with maintained audience and seniority relevance.",
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1600&q=90",
    profile: "A provider of a Marketing Communications Management platform designed for MarCom teams managing content planning, brand governance, campaign execution, and performance measurement.",
    objective: "Generate a consistent flow of marketing-qualified leads among Marketing Communications professionals across enterprise and mid-market organizations in the United States.",
    stats: [["USA", "Geography"], ["MarCom", "Target audience"], ["60 days", "Campaign duration"], ["8,500", "MQLs delivered"]],
    spec: [
      "Audience: Marketing Communications and related marketing professionals",
      "Seniority: VP/SVP, Director/Sr. Director, Manager/Sr. Manager",
      "Geography: USA",
      "Company segment: Enterprise and mid-market organizations",
      "Campaign period: 60 days",
      "Lead type: MQL (Marketing-Qualified Leads)",
      "Qualification criteria: ICP fit + demonstrated engagement with outreach",
      "Channel: Email and tele-calling outreach and follow-up",
    ],
    executed: [
      "Identified and targeted Marketing Communications professionals",
      "Executed outreach to prospects matching the defined USA market",
      "Followed up through email and tele-calling",
      "Qualified prospects who demonstrated engagement",
      "Delivered MQLs against the campaign specification",
    ],
    owned: "Audience targeting, prospect identification, outreach execution, follow-up, engagement qualification, and MQL delivery.",
    clientOwned: "Sales engagement after handoff, downstream nurture, opportunity management, and revenue generation.",
  },
  {
    _id: "cs-4",
    slug: "sql-generation-multi-cloud",
    eyebrow: "CASE STUDY 4 — SURVEY-LED SQL GENERATION FOR A MULTI-CLOUD MANAGEMENT PLATFORM",
    label: "Case Study 4",
    title: "Survey-Led SQL Generation for a Multi-Cloud Management Platform",
    client: "Cloud Infrastructure Firm",
    metric: "92 SQLs",
    description: "A cloud storage solutions provider needed to identify and qualify enterprise decision-makers with active cloud migration requirements. GETprospeKt used a structured Value-Add Assessment to capture qualification data from 3,000+ prospects across financial services, healthcare, manufacturing, and logistics, delivering 92 SQLs qualified against infrastructure, cloud strategy, and budget criteria.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=90",
    profile: "A cloud storage solutions provider offering a Hybrid Multi-Cloud Management Platform for mid-to-large enterprises.",
    objective: "Generate and qualify leads by identifying decision-makers with active cloud migration or optimization requirements.",
    stats: [["USA", "Target market"], ["Mid-to-large", "Target company segment"], ["3 months", "Campaign duration"], ["92", "SQLs delivered"]],
    spec: [
      "Audience: Decision-makers involved in cloud infrastructure and management",
      "Target market: Mid-to-large enterprises",
      "Industries: Financial services, healthcare, manufacturing, logistics",
      "Geography: USA",
      "Campaign duration: 3 months",
      "Qualification approach: Structured Value-Add Assessment",
      "Lead type: Sales Qualified Leads (SQL)",
    ],
    executed: [
      "Identified prospects within the agreed enterprise audience",
      "Used a structured Value-Add Assessment",
      "Captured qualification information",
      "Evaluated responses against agreed criteria",
      "Distinguished higher-intent prospects from information seekers",
      "Delivered SQLs to the client",
    ],
    owned: "Audience targeting, prospect identification, assessment execution, qualification data collection, SQL identification, and handoff.",
    clientOwned: "Sales follow-up after handoff, opportunity management, further nurture, negotiation and closing.",
  },
  {
    _id: "cs-5",
    slug: "appointment-generation-engineering",
    eyebrow: "CASE STUDY 5 — APPOINTMENT GENERATION FOR A CLOUD-BASED DESIGN AND ENGINEERING SOLUTION",
    label: "Case Study 5",
    title: "Appointment Generation for a Cloud-Based Design and Engineering Solution",
    client: "Global Engineering Software Provider",
    metric: "35 Appointments (110%)",
    description: "An engineering software provider needed qualified sales appointments with manufacturing design and engineering decision-makers, including prospects using competing solutions. GETprospeKt executed targeted cold calling across 4,000 validated contacts, delivering 35 confirmed appointments (110% of KPI) with persona-specific handling of competitive objections.",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1600&q=90",
    profile: "A global engineering software provider offering a cloud-based design and engineering platform for the manufacturing sector.",
    objective: "Generate qualified sales appointments in the US manufacturing market for a cloud-based design and engineering solution.",
    stats: [["USA", "Region"], ["4 months", "Campaign duration"], ["4,000", "Initial database"], ["35", "Appointments booked"], ["110%", "KPI achievement"]],
    spec: [
      "Campaign type: Appointment generation",
      "Region: USA",
      "Industry: SaaS / Engineering Software",
      "Target sector: Manufacturing",
      "Target segments: Furniture and consumer product manufacturing",
      "Target personas: Design and Engineering decision-makers",
      "Campaign duration: 4 months",
      "Initial database: 4,000 contacts",
      "Outreach channel: Cold calling",
    ],
    executed: [
      "Audited the initial database against the agreed target profile",
      "Validated contacts and filtered out prospects that did not match",
      "Researched and enriched relevant contacts",
      "Developed persona-specific calling approaches",
      "Built objection-handling approaches",
      "Executed targeted cold calling and repeated follow-up",
      "Generated qualified appointments and handed them to the sales team",
    ],
    owned: "Database validation, ICP filtering, contact research, persona identification, calling execution, follow-up, and appointment generation.",
    clientOwned: "Sales conversations after appointment handoff, opportunity management, demonstrations, negotiation and closing.",
  },
  {
    _id: "cs-6",
    slug: "appointment-generation-healthcare-buyer-personas",
    eyebrow: "CASE STUDY 6 — APPOINTMENT GENERATION ACROSS NEW HEALTHCARE BUYER PERSONAS",
    label: "Case Study 6",
    title: "Appointment Generation Across New Healthcare Buyer Personas",
    client: "Healthcare Technology Provider",
    metric: "44 Confirmed Meetings",
    description: "A healthcare technology provider needed to expand beyond their traditional nursing audience into IT, Population Health, and Director+ decision-makers at hospital systems. GETprospeKt mapped complex healthcare account structures and executed targeted cold calling across ~200 hospital accounts, delivering 44 confirmed meetings with 72% from previously unreached buyer personas.",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1600&q=90",
    profile: "A healthcare technology provider offering operational, clinical workflow, and administrative solutions for hospital systems and integrated delivery networks.",
    objective: "Expand beyond traditional nursing stakeholders into IT, Population Health, and Director+ decision-makers at target hospital systems to secure qualified discovery meetings.",
    stats: [["44", "Confirmed meetings delivered"], ["72%", "Previously unreached buyer personas"], ["~200", "Hospital accounts engaged"], ["USA", "Target geography"]],
    spec: [
      "Target industry: Healthcare Systems & Hospital Networks",
      "Target personas: IT Directors, Population Health Directors, Clinical Informatics, Hospital Administration",
      "Account universe: ~200 designated hospital systems in the USA",
      "Campaign focus: Persona expansion into unreached executive buying committees",
      "Outreach channel: Targeted cold calling & account structure mapping",
      "Deliverable: Confirmed meetings with Director+ healthcare leaders",
    ],
    executed: [
      "Mapped complex hospital account hierarchies and decision-making structures across ~200 health systems",
      "Identified and verified direct contact details for IT, Population Health, and administrative leadership",
      "Designed persona-specific talk tracks addressing clinical workflow bottlenecks and system integration",
      "Executed targeted cold calling campaigns to navigate hospital gatekeepers and engage clinical/IT leaders",
      "Confirmed 44 qualified sales meetings, with 72% representing previously uncontacted stakeholder roles",
    ],
    owned: "Hospital account mapping, new persona verification, multi-touch phone outreach, and meeting confirmation.",
    clientOwned: "Sales discovery calls, platform demonstrations, clinical workflow alignment, and contract negotiation.",
  },
  {
    _id: "cs-7",
    slug: "ciso-bant-lead-generation-cloud-workload-protection",
    eyebrow: "CASE STUDY 7 — CISO BANT LEAD GENERATION FOR CLOUD WORKLOAD PROTECTION",
    label: "Case Study 7",
    title: "CISO BANT Lead Generation for Cloud Workload Protection",
    client: "Enterprise Cloud Security Provider",
    metric: "118 BANT Leads",
    description: "An enterprise cloud security provider needed to engage CISOs, Heads of SecOps, and Cloud Security Architects evaluating runtime container and Kubernetes defense. GETprospeKt executed multi-channel research and phone outreach across 3,200 enterprise accounts, delivering 118 BANT-qualified leads with active cloud migration and budget timelines.",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1600&q=90",
    profile: "Provider of AI-driven Cloud-Native Application Protection Platforms (CNAPP) for hybrid and multi-cloud enterprises.",
    objective: "Generate 115+ BANT-qualified leads from Fortune 2000 CISOs and Cloud Security directors actively reviewing CNAPP or container defense solutions.",
    stats: [["118", "BANT-qualified leads delivered"], ["$50k+", "Average deal ACV"], ["94%", "CISO / VP SecOps seniority fit"], ["3 months", "Campaign duration"]],
    spec: [
      "Geography: North America & UK",
      "Target Roles: CISO, VP of InfoSec, Director of Cloud Security",
      "Company Size: 1,000+ employees",
      "Lead Type: BANT-qualified leads",
      "Qualification Channel: Phone verification and structured pain assessment",
    ],
    executed: [
      "Researched and mapped security buying committees across 3,200 enterprise accounts",
      "Verified direct executive contact details and current cloud infrastructure deployments",
      "Conducted phone qualification evaluating active vulnerability scanning pain points",
      "Delivered verified BANT leads with confirmed budget timelines and security requirements",
    ],
    owned: "Account universe curation, contact verification, phone outreach, and BANT qualification.",
    clientOwned: "Technical demos, Proof of Concepts (PoCs), and commercial closing.",
  },
  {
    _id: "cs-8",
    slug: "zero-trust-identity-discovery-meetings-enterprise-banking",
    eyebrow: "CASE STUDY 8 — ZERO TRUST IDENTITY APPOINTMENT GENERATION FOR ENTERPRISE BANKING",
    label: "Case Study 8",
    title: "Zero Trust Architecture Discovery Meetings for Enterprise Financial Institutions",
    client: "Identity Governance & Access Management (IAM) Vendor",
    metric: "52 Confirmed Meetings",
    description: "An identity security company needed confirmed executive discovery meetings with Heads of Identity & Access Management and Chief Information Security Officers across tier-1 retail and commercial banks. GETprospeKt navigated complex banking gatekeepers and delivered 52 confirmed meetings (115% of quota) with verified decision-makers.",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1600&q=90",
    profile: "A cybersecurity innovator delivering Zero Trust machine identity management, credential governance, and privileged access security.",
    objective: "Secure 45 high-value executive discovery meetings with IAM and security architects at commercial banks and financial institutions.",
    stats: [["52", "Executive discovery meetings confirmed"], ["115%", "Quoted KPI achievement"], ["100%", "Tier-1 banking compliance fit"], ["4 months", "Campaign duration"]],
    spec: [
      "Target Sector: Banking, Wealth Management & Fintech",
      "Target Personas: Head of IAM, CISO, VP Security Architecture",
      "Geography: USA & Canada",
      "Deliverable: Calendar-confirmed sales discovery appointments",
    ],
    executed: [
      "Identified top 250 financial institutions undergoing Zero Trust or IAM modernization",
      "Verified direct extensions and corporate emails for security leadership",
      "Designed persona-specific talk tracks on privileged access sprawl and credential theft",
      "Secured and calendar-confirmed 52 sales appointments directly into client sales reps' calendars",
    ],
    owned: "Target banking list verification, multi-touch phone outreach, and calendar booking.",
    clientOwned: "Sales discovery execution, platform demos, and solution scoping.",
  },
  {
    _id: "cs-9",
    slug: "survey-led-sql-generation-automated-soc-platform",
    eyebrow: "CASE STUDY 9 — SURVEY-LED SQL GENERATION FOR AN AUTONOMOUS SOC & ALERT TRIAGE PLATFORM",
    label: "Case Study 9",
    title: "Survey-Led SQL Generation for an Autonomous SOC Alert Triage Platform",
    client: "AI-Powered SecOps Platform",
    metric: "84 SQLs Qualified",
    description: "An AI security operations provider needed to pinpoint enterprise SOC directors suffering from severe alert fatigue and analyst burnout. GETprospeKt conducted a structured 'State of SOC Alert Fatigue' assessment across 2,400 enterprise IT and security leaders, delivering 84 Sales-Qualified Leads (SQLs) actively evaluating automated triage tools.",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=90",
    profile: "A high-growth cybersecurity firm offering autonomous tier-1 alert investigation and AI-driven SOC triage.",
    objective: "Generate 75+ Sales-Qualified Leads (SQLs) from enterprise SOC managers experiencing 1,000+ alerts daily.",
    stats: [["84", "Sales-Qualified Leads delivered"], ["78%", "Reported severe SOC alert fatigue"], ["3 weeks", "Average time to active PoC"], ["60 days", "Campaign execution"]],
    spec: [
      "Target Personas: SOC Director, Security Operations Manager, CISO",
      "Target Market: Enterprises processing high-volume security alerts (500+ employees)",
      "Lead Type: Sales-Qualified Lead (SQL) with documented triage tool evaluation",
    ],
    executed: [
      "Drafted and deployed a peer-level SOC operational survey benchmarking triage times",
      "Captured granular data on daily alert volumes and current SIEM/SOAR limitations",
      "Qualified respondents with immediate pain and authorized evaluation budgets",
      "Handed off 84 SQL dossiers with complete qualification transcripts to enterprise AEs",
    ],
    owned: "Assessment design, audience engagement, qualification interviews, and SQL handoff.",
    clientOwned: "PoC deployment, architectural validation, and contract procurement.",
  },
  {
    _id: "cs-10",
    slug: "targeted-webinar-campaign-cyber-extortion-ransomware-defense",
    eyebrow: "CASE STUDY 10 — TARGETED WEBINAR CAMPAIGN FOR CYBER EXTORTION & RANSOMWARE DEFENSE",
    label: "Case Study 10",
    title: "Targeted Webinar Campaign for Cyber Extortion and Ransomware Defense",
    client: "Global Threat Intelligence Network",
    metric: "215 Enterprise Registrations",
    description: "A cyber risk intelligence firm hosting an executive briefing on modern data extortion and ransomware prevention needed to attract senior enterprise risk and security directors. GETprospeKt executed multi-channel promotion and phone engagement across 2,800 validated security contacts, delivering 215 verified enterprise registrations and 68 live attendees.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=90",
    profile: "A global cybersecurity intelligence provider specializing in dark web monitoring and cyber extortion prevention.",
    objective: "Secure 200+ qualified registrations from enterprise security executives for a virtual threat briefing.",
    stats: [["215", "Verified executive registrations"], ["68", "Live attendees on event day"], ["31.6%", "Live attendance rate"], ["2,800", "Validated outreach universe"]],
    spec: [
      "Geography: North America, Western Europe",
      "Target Roles: Director of Threat Intelligence, CISO, Head of Incident Response",
      "Company Segment: Enterprise (1,000+ employees)",
      "Outreach Channels: Targeted email invitations and tele-calling follow-up",
    ],
    executed: [
      "Filtered and verified a 2,800-contact target universe against executive criteria",
      "Sequenced personalized invitations highlighting emerging extortion methodologies",
      "Followed up by telephone to confirm executive attendance and calendar holds",
      "Delivered verified registrant data into the client's webinar CRM before the event",
    ],
    owned: "Audience targeting, contact verification, outreach, and registration generation.",
    clientOwned: "Keynote presentation, live Q&A, and post-webinar nurture.",
  },
];

export const caseStudiesStorageApi = {
  getAll: (): CaseStudyData[] => {
    try {
      const data = localStorage.getItem("gp_case_studies");
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const canonicalSlugs = new Set(initialCaseStudiesList.map((cs) => cs.slug));
          // Filter strictly to the 6 canonical case studies
          let filtered = parsed.filter((item: any) => canonicalSlugs.has(item.slug));

          // Ensure all 6 are present
          const missing = initialCaseStudiesList.filter(
            (def) => !filtered.some((item: any) => item.slug === def.slug || item._id === def._id)
          );
          if (missing.length > 0) {
            filtered = [...filtered, ...missing];
          }

          // Ensure eyebrow, title, and description match canonical definition
          let changed = false;
          filtered = filtered.map((item: CaseStudyData) => {
            const canonical = initialCaseStudiesList.find((def) => def.slug === item.slug);
            if (canonical) {
              if (
                item.eyebrow !== canonical.eyebrow ||
                item.title !== canonical.title ||
                item.description !== canonical.description ||
                item.image !== canonical.image ||
                item.metric !== canonical.metric
              ) {
                changed = true;
                return {
                  ...item,
                  eyebrow: canonical.eyebrow,
                  title: canonical.title,
                  description: canonical.description,
                  image: canonical.image,
                  metric: canonical.metric,
                  stats: canonical.stats,
                  spec: canonical.spec,
                  executed: canonical.executed,
                  faqs: canonical.faqs,
                };
              }
            }
            return item;
          });

          // Sort strictly in canonical order 1 to 6
          const slugOrder = initialCaseStudiesList.map((cs) => cs.slug);
          filtered.sort((a, b) => slugOrder.indexOf(a.slug) - slugOrder.indexOf(b.slug));

          if (changed || filtered.length !== parsed.length) {
            localStorage.setItem("gp_case_studies", JSON.stringify(filtered));
          }
          return filtered;
        }
      }
    } catch (e) {
      console.warn("[CaseStudies Storage] Read error", e);
    }
    return initialCaseStudiesList;
  },
  saveAll: (items: CaseStudyData[]) => {
    try {
      localStorage.setItem("gp_case_studies", JSON.stringify(items));
      window.dispatchEvent(new Event("gp_casestudies_updated"));
    } catch (e) {
      console.warn("[CaseStudies Storage] Save error", e);
    }
  },
  resetDefaults: (): CaseStudyData[] => {
    try {
      localStorage.setItem("gp_case_studies", JSON.stringify(initialCaseStudiesList));
      window.dispatchEvent(new Event("gp_casestudies_updated"));
    } catch (e) {
      console.warn("[CaseStudies Storage] Reset error", e);
    }
    return initialCaseStudiesList;
  },
};

// ================= SOLUTIONS STORAGE API =================
export interface SolutionData {
  id: string;
  slug: string;
  title: string;
  category: string;
  tag: string;
  badge: string;
  subtitle: string;
  description: string;
  deliverables: string[];
  image: string;
  path: string;
  formConfig?: GatedFormConfig;
}

export const initialSolutionsList: SolutionData[] = [
  {
    id: "sol-1",
    slug: "human-verified-data",
    title: "Human-Verified Data",
    category: "Data Verification",
    tag: "High Accuracy",
    badge: "100% Verified",
    subtitle: "For Revenue Teams Requiring Accurate Prospect Records",
    description:
      "Prospect data manually reviewed, phoned, and verified for accuracy, completeness and recency across your exact Total Addressable Market (TAM).",
    deliverables: [
      "Direct phone numbers & verified corporate emails",
      "Active seniority, department & decision-maker check",
      "100% replacement guarantee on any invalid record",
    ],
    image: humanVerifiedImg,
    path: "/article/human-verified-data",
  },
  {
    id: "sol-2",
    slug: "mql-generation",
    title: "MQL Generation",
    category: "Demand Generation",
    tag: "Marketing Qualified",
    badge: "Custom ICP Filter",
    subtitle: "For Marketing Teams Scaling Lead Influx & Content Engagement",
    description:
      "Marketing-qualified leads generated and validated against your agreed ideal customer profile, target accounts, and content engagement criteria.",
    deliverables: [
      "Verified content syndication engagement & opt-in",
      "Custom ICP tiering across employee size and revenue",
      "Enriched firmographic data ready for automated nurture",
    ],
    image: mqlGenerationImg,
    path: "/article/mql-generation",
  },
  {
    id: "sol-3",
    slug: "sql-generation",
    title: "SQL Generation",
    category: "Sales Pipeline",
    tag: "Sales Qualified",
    badge: "Active Need",
    subtitle: "For Sales Teams Accelerating Pipeline Velocity",
    description:
      "Sales-qualified leads that meet your agreed criteria for fit, immediate business need, and sales-readiness to minimize sales cycle friction.",
    deliverables: [
      "Confirmed buying committee & active project pain points",
      "Direct verification with verified decision-maker personas",
      "Direct handoff into your sales cadence and CRM",
    ],
    image: sqlGenerationImg,
    path: "/article/sql-generation",
  },
  {
    id: "sol-4",
    slug: "bant-qualified-leads",
    title: "BANT-Qualified Leads",
    category: "High Intent",
    tag: "Strict Criteria",
    badge: "BANT Standard",
    subtitle: "For Enterprise Closers Demanding High Purchase Intent",
    description:
      "High-intent enterprise prospects rigorously qualified against Budget, Authority, Need, and Timing parameters before delivery.",
    deliverables: [
      "Verified budget allocation & authority confirmation",
      "Explicit purchase and implementation timeframe (3-12 mo)",
      "Thorough technical requirement alignment brief",
    ],
    image: bantQualifiedImg,
    path: "/article/bant-qualified-leads",
  },
  {
    id: "sol-5",
    slug: "appointment-generation",
    title: "Appointment Generation",
    category: "Meeting Booking",
    tag: "Direct Calendars",
    badge: "Guaranteed Meetings",
    subtitle: "For Account Executives Needing Confirmed Sales Discovery Calls",
    description:
      "Confirmed introductory meetings directly scheduled on your sales reps' calendars with qualified decision-makers matching your target accounts.",
    deliverables: [
      "Direct calendar invitations accepted by target prospect",
      "Pre-call briefing notes with account context & pain points",
      "Comprehensive no-show protection and rescheduling policy",
    ],
    image: appointmentGenImg,
    path: "/article/appointment-generation",
  },
  {
    id: "sol-6",
    slug: "webinar-campaigns",
    title: "Webinar Campaigns",
    category: "Event Marketing",
    tag: "Targeted Audience",
    badge: "Verified Registrants",
    subtitle: "For Event Marketers Driving Qualified Live Attendance",
    description:
      "Targeted multi-channel promotional campaigns designed to drive relevant enterprise registrations and engaged attendees for virtual conferences.",
    deliverables: [
      "Multi-channel acquisition (email, phone, direct outreach)",
      "Strict persona validation preventing irrelevant sign-ups",
      "Post-event attendee engagement reports and contact handoff",
    ],
    image: webinarCampaignsImg,
    path: "/article/webinar-campaigns",
  },
];

// Canonical solution images synced automatically

export const solutionsStorageApi = {
  getAll: (): SolutionData[] => {
    try {
      const data = localStorage.getItem("gp_solutions");
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const allowedSlugs = new Set(initialSolutionsList.map((s) => s.slug));
          // Filter strictly to the 6 canonical solutions
          let filtered = parsed.filter((item: any) => allowedSlugs.has(item.slug));

          // Ensure any missing solutions are filled
          const missing = initialSolutionsList.filter(
            (def) => !filtered.some((item: any) => item.slug === def.slug || item.id === def.id)
          );
          if (missing.length > 0) {
            filtered = [...filtered, ...missing];
          }

          // Upgrade legacy placeholder images to the diverse, domain-matched images
          let updated = false;
          filtered = filtered.map((item: SolutionData) => {
            const canonical = initialSolutionsList.find((def) => def.slug === item.slug);
            if (canonical && item.image !== canonical.image) {
              updated = true;
              return { ...item, image: canonical.image };
            }
            return item;
          });

          // Sort in canonical order
          const slugOrder = initialSolutionsList.map((s) => s.slug);
          filtered.sort((a, b) => slugOrder.indexOf(a.slug) - slugOrder.indexOf(b.slug));

          if (updated || filtered.length !== parsed.length) {
            localStorage.setItem("gp_solutions", JSON.stringify(filtered));
          }
          return filtered;
        }
      }
    } catch (e) {
      console.warn("[Solutions Storage] Read error", e);
    }
    return initialSolutionsList;
  },
  saveAll: (items: SolutionData[]) => {
    try {
      localStorage.setItem("gp_solutions", JSON.stringify(items));
      window.dispatchEvent(new Event("gp_solutions_updated"));
    } catch (e) {
      console.warn("[Solutions Storage] Save error", e);
    }
  },
  resetDefaults: (): SolutionData[] => {
    try {
      localStorage.setItem("gp_solutions", JSON.stringify(initialSolutionsList));
      window.dispatchEvent(new Event("gp_solutions_updated"));
    } catch (e) {
      console.warn("[Solutions Storage] Reset error", e);
    }
    return initialSolutionsList;
  },
};

// ================= ENQUIRIES API =================
export const enquiriesApi = {
  submit: async (enquiryData: {
    firstName: string;
    lastName: string;
    email: string;
    company?: string;
    telephone?: string;
    country?: string;
    companySize?: string;
    city?: string;
    address?: string;
    postalCode?: string;
    industry?: string;
    jobTitle?: string;
    resourceId?: string;
    resourceTitle?: string;
    assetTitle?: string;
    assetType?: string;
    downloadFileType?: string;
    type?: "contact" | "download" | "subscription";
    optInMarketing?: boolean;
    optInPartner?: boolean;
    subject?: string;
    message?: string;
    [key: string]: any;
  }) => {
    const resolvedType =
      enquiryData.type ||
      (enquiryData.resourceId || enquiryData.resourceTitle || enquiryData.assetTitle
        ? "download"
        : enquiryData.subject && /subscribe|newsletter/i.test(enquiryData.subject)
        ? "subscription"
        : "contact");

    const payload = {
      ...enquiryData,
      type: resolvedType,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/enquiries`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Failed to submit enquiry");
      }

      return await response.json();
    } catch (error) {
      // Offline fallback: save to localStorage so it still appears in the dashboard
      const local = JSON.parse(localStorage.getItem("local_enquiries") || "[]");
      const newEnquiry = {
        _id: `local_${Date.now()}`,
        ...payload,
        status: "New",
        createdAt: new Date().toISOString(),
      };
      local.unshift(newEnquiry);
      localStorage.setItem("local_enquiries", JSON.stringify(local));
      return { message: "Enquiry submitted successfully (offline saved).", enquiry: newEnquiry };
    }
  },

  getAll: async () => {
    const initialEnquiries = [
      {
        _id: "enq-1",
        firstName: "Sarah",
        lastName: "Jenkins",
        email: "s.jenkins@nexuscloud.io",
        telephone: "+1 (415) 890-2341",
        company: "Nexus Cloud Technologies",
        jobTitle: "VP of Demand Generation",
        subject: "Enterprise BANT Lead Generation Pilot",
        message: "We are evaluating partners for a Q4 BANT campaign targeting 200 qualified CIO and CISO leads in North America. Would love to review your qualification methodology and rate card.",
        status: "New",
        type: "contact",
        createdAt: new Date(Date.now() - 3600000 * 3.5).toISOString(),
      },
      {
        _id: "enq-2",
        firstName: "David",
        lastName: "Miller",
        email: "david.miller@vanguardcyber.com",
        telephone: "+44 20 7946 0912",
        company: "Vanguard Cybersecurity",
        jobTitle: "Director of Enterprise Sales",
        companySize: "250-500 employees",
        industry: "Cybersecurity & InfoSec",
        country: "United Kingdom",
        city: "London",
        resourceId: "res-1",
        resourceTitle: "Get Ahead and Stay Ahead: Enterprise B2B Playbook",
        assetTitle: "Get Ahead and Stay Ahead: Enterprise B2B Playbook",
        assetType: "Playbook",
        downloadFileType: "PDF",
        subject: "Resource Download: Get Ahead and Stay Ahead: Enterprise B2B Playbook",
        message: "Lead downloaded Playbook: Get Ahead and Stay Ahead: Enterprise B2B Playbook. Format: PDF. Company: Vanguard Cybersecurity, Size: 250-500 employees, Industry: Cybersecurity & InfoSec, Job Title: Director of Enterprise Sales, Phone: +44 20 7946 0912",
        status: "Read",
        type: "download",
        createdAt: new Date(Date.now() - 3600000 * 18.2).toISOString(),
      },
      {
        _id: "enq-3",
        firstName: "Marcus",
        lastName: "Vance",
        email: "marcus.vance@solarisdata.com",
        telephone: "+1 (617) 555-0199",
        company: "Solaris AI Systems",
        jobTitle: "Head of Pipeline Strategy",
        companySize: "500-1000 employees",
        industry: "Enterprise AI & Cloud",
        country: "United States",
        city: "Boston, MA",
        resourceId: "res-2",
        resourceTitle: "B2B Tech Marketing Playbook: High-Value Account Acquisition",
        assetTitle: "B2B Tech Marketing Playbook: High-Value Account Acquisition",
        assetType: "Whitepaper",
        downloadFileType: "PDF",
        subject: "Resource Download: B2B Tech Marketing Playbook: High-Value Account Acquisition",
        message: "Lead downloaded Whitepaper: B2B Tech Marketing Playbook: High-Value Account Acquisition. Format: PDF. Company: Solaris AI Systems, Size: 500-1000 employees, Industry: Enterprise AI & Cloud, Job Title: Head of Pipeline Strategy, Phone: +1 (617) 555-0199",
        status: "New",
        type: "download",
        createdAt: new Date(Date.now() - 3600000 * 27.5).toISOString(),
      },
      {
        _id: "enq-4",
        firstName: "Elena",
        lastName: "Rostova",
        email: "elena.rostova@fintechpulse.co",
        telephone: "+1 (212) 555-0144",
        company: "Fintech Pulse Global",
        jobTitle: "Editor-in-Chief",
        subject: "Newsletter Subscription",
        message: "Subscribed to GETprospeKt publication newsletter and weekly insights.",
        status: "New",
        type: "subscription",
        createdAt: new Date(Date.now() - 3600000 * 42.1).toISOString(),
      },
      {
        _id: "enq-5",
        firstName: "Kenji",
        lastName: "Takahashi",
        email: "k.takahashi@apexcloud.jp",
        telephone: "+81 3 5555 0128",
        company: "Apex Cloud Systems",
        jobTitle: "Global Marketing Director",
        subject: "Newsletter Subscription",
        message: "Subscribed to GETprospeKt publication newsletter and weekly insights.",
        status: "Read",
        type: "subscription",
        createdAt: new Date(Date.now() - 3600000 * 70.8).toISOString(),
      },
    ];

    try {
      const response = await fetch(`${API_BASE_URL}/enquiries`, {
        headers: getHeaders(true),
      });
      if (!response.ok) throw new Error("Failed to fetch enquiries");
      const serverEnquiries = await response.json();
      const local = JSON.parse(localStorage.getItem("local_enquiries") || "null");
      const localPool = local && local.length > 0 ? local : initialEnquiries;
      return [...localPool, ...serverEnquiries];
    } catch (error) {
      const local = JSON.parse(localStorage.getItem("local_enquiries") || "null");
      if (!local || local.length === 0) {
        localStorage.setItem("local_enquiries", JSON.stringify(initialEnquiries));
        return initialEnquiries;
      }
      return local;
    }
  },

  updateStatus: async (id: string, status: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/enquiries/${id}`, {
        method: "PATCH",
        headers: getHeaders(true),
        body: JSON.stringify({ status }),
      });
      return await response.json();
    } catch (error) {
      const local = JSON.parse(localStorage.getItem("local_enquiries") || "[]");
      const updated = local.map((item: any) =>
        item._id === id ? { ...item, status } : item
      );
      localStorage.setItem("local_enquiries", JSON.stringify(updated));
      return { success: true };
    }
  },

  delete: async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/enquiries/${id}`, {
        method: "DELETE",
        headers: getHeaders(true),
      });
      return await response.json();
    } catch (error) {
      const local = JSON.parse(localStorage.getItem("local_enquiries") || "[]");
      const updated = local.filter((item: any) => item._id !== id);
      localStorage.setItem("local_enquiries", JSON.stringify(updated));
      return { success: true };
    }
  },
};

export const initialDemoResources = [
  {
    _id: "res-wp-1",
    title: "Zero-Waste Data Quality & ICP Validation Guide: Field-Tested Best Practices",
    type: "Whitepaper",
    category: "Data & Analytics",
    coverImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=85",
    summary: "How enterprise revenue teams audit prospect databases, eliminate outdated records, and guarantee 100% human verification across outbound campaigns.",
    content: "Comprehensive whitepaper on data decay rates, multi-point telephone verification, and CRM hygiene standards. Learn how top tech brands eliminate wasted SDR hours and improve inbox deliverability.",
    fileUrl: "/sample-whitepaper.pdf",
    downloadFileType: "pdf",
    downloadFileName: "zero-waste-data-quality-guide.pdf",
    downloadCount: 512,
    status: "Published",
    createdAt: "2026-10-14T10:00:00.000Z",
  },
  {
    _id: "res-wp-2",
    title: "PC-as-a-Service: Unlocking New IT Capabilities To Improve Employee Experience",
    type: "Whitepaper",
    category: "Cloud & Infrastructure",
    coverImage: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800&q=85",
    summary: "A Forrester Consulting Thought Leadership Paper on how modern device-as-a-service frameworks accelerate deployment, reduce IT overhead, and empower hybrid workforces.",
    content: "Modern IT departments face increasing pressure to provide secure, seamless computing experiences across distributed teams. Learn how transitioning from capex procurement to PC-as-a-Service cuts support tickets by 34% and accelerates new hire onboarding.",
    fileUrl: "/sample-whitepaper.pdf",
    downloadFileType: "pdf",
    downloadFileName: "forrester-pcaas-enterprise-brief.pdf",
    downloadCount: 420,
    status: "Published",
    createdAt: "2026-09-18T10:00:00.000Z",
  },
  {
    _id: "res-wp-3",
    title: "PRODUCT CATALOGUE: Next-Gen Enterprise Systems & Infrastructure",
    type: "Whitepaper",
    category: "B2B Technology",
    coverImage: "https://images.unsplash.com/photo-1597852074816-d933c4d2b988?auto=format&fit=crop&w=800&q=85",
    summary: "Comprehensive catalogue of enterprise technology solutions, storage platforms, and security services engineered to keep business operations fast and efficient.",
    content: "Discover next-generation server clusters, hyper-converged infrastructure, enterprise storage architectures, and perimeter defense systems tailored for mission-critical workloads.",
    fileUrl: "https://images.unsplash.com/photo-1597852074816-d933c4d2b988?auto=format&fit=crop&w=1600&q=90",
    downloadFileType: "image",
    downloadFileName: "enterprise-systems-catalogue-architecture.png",
    downloadCount: 590,
    status: "Published",
    createdAt: "2026-09-20T10:00:00.000Z",
  },
  {
    _id: "res-wp-4",
    title: "A Technical Brief Framework For Unified Workspace & Automated Endpoint Management",
    type: "Whitepaper",
    category: "Cybersecurity",
    coverImage: "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=800&q=85",
    summary: "A Forrester Total Economic Impact Study detailing step-by-step methodologies to maximize ROI through unified workspace and automated endpoint management.",
    content: "Unified Workspace integrates cloud-first deployment, intelligent security, and proactive support across your entire fleet. Read the technical architecture guide and compliance checklist for zero-trust endpoint deployment.",
    fileUrl: "/sample-whitepaper.pdf",
    downloadFileType: "pdf",
    downloadFileName: "unified-workspace-technical-brief.pdf",
    downloadCount: 380,
    status: "Published",
    createdAt: "2026-09-22T10:00:00.000Z",
  },
  {
    _id: "res-wp-5",
    title: "2026 Enterprise ABM & Qualification Architecture Blueprint (Infographic)",
    type: "Whitepaper",
    category: "ABM & Demand Generation",
    coverImage: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1200&q=85",
    summary: "High-resolution visual architecture blueprint mapping how enterprise marketing teams verify buying committees, score multi-touch engagement, and hand off BANT-ready leads.",
    content: "This full-scale visual architecture guide maps the 5-stage GETprospeKt ABM qualification engine: Target Account Universe Selection, Human Contact Verification, Multi-Channel Outreach Sequencing, BANT & SQL Qualification Gates, and Real-Time CRM Handoff.",
    fileUrl: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1800&q=90",
    downloadFileType: "image",
    downloadFileName: "2026-abm-qualification-architecture-blueprint.jpg",
    downloadCount: 610,
    status: "Published",
    createdAt: "2026-10-08T10:00:00.000Z",
  },
  {
    _id: "res-wp-6",
    title: "Zero Trust Architecture for Hybrid Multi-Cloud Workloads: Blueprint & Enforcement",
    type: "Whitepaper",
    category: "Cybersecurity",
    coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=85",
    summary: "Architectural guidelines for enforcing least-privilege microsegmentation, continuous attestation, and API traffic inspection across AWS, Azure, and private data centers.",
    content: "Detailed whitepaper breaking down NIST 800-207 Zero Trust implementation across containerized microservices and hybrid cloud networking. Features reference deployment topologies and IAM policy enforcement templates.",
    fileUrl: "/sample-whitepaper.pdf",
    downloadFileType: "pdf",
    downloadFileName: "zero-trust-hybrid-cloud-architecture.pdf",
    downloadCount: 445,
    status: "Published",
    createdAt: "2026-10-15T10:00:00.000Z",
  },
  {
    _id: "res-wp-7",
    title: "Automated Security Operations: Reducing SOC Triage Times with Agentic AI",
    type: "Whitepaper",
    category: "Security Operations",
    coverImage: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=85",
    summary: "Technical evaluation of autonomous tier-1 alert triage engines. Discover how AI-native SOC assistants cut median time to detect (MTTD) and remediate (MTTR).",
    content: "Analysis based on live deployments across 40+ enterprise SOCs. Demonstrates how autonomous agents parse telemetry, correlate multi-source indicators of compromise (IoCs), and reduce analyst burnout by 78%.",
    fileUrl: "/sample-whitepaper.pdf",
    downloadFileType: "pdf",
    downloadFileName: "agentic-ai-soc-automation-whitepaper.pdf",
    downloadCount: 530,
    status: "Published",
    createdAt: "2026-10-16T10:00:00.000Z",
  },
  {
    _id: "res-wp-8",
    title: "Next-Gen Firewall Services: Transitioning from Fixed Hardware to Cloud SASE",
    type: "Whitepaper",
    category: "Enterprise Technology",
    coverImage: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=85",
    summary: "Why distributed enterprises are abandoning physical firewall refresh cycles in favor of elastic subscription-based security services and unified SASE architectures.",
    content: "Co-authored with enterprise network architects. Examines bandwidth economics, total cost of ownership (TCO) comparisons, and security posture consistency across branch offices and remote workforces.",
    fileUrl: "/sample-whitepaper.pdf",
    downloadFileType: "pdf",
    downloadFileName: "next-gen-firewall-sase-transition.pdf",
    downloadCount: 490,
    status: "Published",
    createdAt: "2026-10-17T10:00:00.000Z",
  },
  {
    _id: "res-wp-9",
    title: "Machine Identity Management: Securing APIs, Microservices, and Digital Certificates",
    type: "Whitepaper",
    category: "Identity Security",
    coverImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=85",
    summary: "A comprehensive framework for auditing, rotating, and governing non-human machine identities, API tokens, and TLS certificates across Kubernetes clusters.",
    content: "Machine identities outnumber human employees by 45 to 1 in modern cloud environments. This whitepaper outlines automated lifecycle management, certificate expiry prevention, and cryptographic posture governance.",
    fileUrl: "/sample-whitepaper.pdf",
    downloadFileType: "pdf",
    downloadFileName: "machine-identity-management-framework.pdf",
    downloadCount: 395,
    status: "Published",
    createdAt: "2026-10-18T10:00:00.000Z",
  },
  {
    _id: "res-wp-10",
    title: "Modern Cyber Extortion & Ransomware Resilience: Proactive Data Hygiene Standards",
    type: "Whitepaper",
    category: "Cybersecurity",
    coverImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=85",
    summary: "Strategic and tactical countermeasures for defending sensitive IP and customer databases against double-extortion ransomware and dark web exfiltration.",
    content: "Examines real extortion syndicate negotiation patterns, data classification controls, air-gapped immutable backup architectures, and board-level risk disclosure requirements under SEC cyber mandates.",
    fileUrl: "/sample-whitepaper.pdf",
    downloadFileType: "pdf",
    downloadFileName: "modern-cyber-extortion-resilience-whitepaper.pdf",
    downloadCount: 575,
    status: "Published",
    createdAt: "2026-10-19T10:00:00.000Z",
  },
  {
    _id: "res-pb-1",
    title: "The Definitive B2B Outbound Playbook: Qualification & Scripting",
    type: "Playbook",
    category: "Sales Development",
    coverImage: "https://images.unsplash.com/photo-1552581234-26160f608093?auto=format&fit=crop&w=800&q=85",
    summary: "A step-by-step operational playbook covering multi-touch outreach cadence, gatekeeper navigation, and objection handling for high-ticket solutions.",
    content: "Get the battle-tested objection handling frameworks, multi-channel cadences (phone, email, social), and SDR call scripts that generated $42M in enterprise pipeline.",
    fileUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    downloadFileType: "video",
    downloadFileName: "b2b-outbound-playbook-walkthrough.mp4",
    downloadCount: 680,
    status: "Published",
    createdAt: "2026-09-26T10:00:00.000Z",
  },
  {
    _id: "res-pb-2",
    title: "2026 Enterprise Pipeline Acceleration Playbook: Strategic Framework & Cadence Benchmarks",
    type: "Playbook",
    category: "Enterprise Technology",
    coverImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=85",
    summary: "Step-by-step operational blueprint detailing multi-touch sequencing, BANT thresholds, and marketing-to-sales handoff SLAs for high-ticket technology solutions.",
    content: "A 48-page operational guide designed for CMOs, VPs of Demand Generation, and Sales Operations leaders. Features multi-channel outreach workflows, tele-qualification script templates, and SLA scorecard rubrics.",
    fileUrl: "/sample-whitepaper.pdf",
    downloadFileType: "pdf",
    downloadFileName: "2026-enterprise-pipeline-playbook.pdf",
    downloadCount: 540,
    status: "Published",
    createdAt: "2026-10-12T10:00:00.000Z",
  },
  {
    _id: "res-pb-3",
    title: "CISO Engagement Playbook: Penetrating Enterprise Security Buying Committees",
    type: "Playbook",
    category: "Cybersecurity",
    coverImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85",
    summary: "Field-tested talk tracks, pain-point mapping, and compliance triggers designed to secure discovery meetings with Chief Information Security Officers.",
    content: "CISOs delete 95% of vendor emails. This playbook outlines how to craft messaging centered on active audit deadlines, regulatory fines, and third-party risk reduction rather than generic product features.",
    fileUrl: "/sample-whitepaper.pdf",
    downloadFileType: "pdf",
    downloadFileName: "ciso-engagement-playbook.pdf",
    downloadCount: 620,
    status: "Published",
    createdAt: "2026-10-13T10:00:00.000Z",
  },
  {
    _id: "res-pb-4",
    title: "Cloud Security Posture Management (CSPM) Operational Playbook",
    type: "Playbook",
    category: "Cloud & Infrastructure",
    coverImage: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=85",
    summary: "Step-by-step procedures for detecting cloud misconfigurations, enforcing policy-as-code, and automating drift remediation across multi-cloud accounts.",
    content: "Provides operational runbooks for AWS, Azure, and Google Cloud. Includes terraform compliance templates, Kubernetes admission controller configs, and automated IAM least-privilege review cadences.",
    fileUrl: "/sample-whitepaper.pdf",
    downloadFileType: "pdf",
    downloadFileName: "cspm-operational-playbook.pdf",
    downloadCount: 490,
    status: "Published",
    createdAt: "2026-10-14T10:00:00.000Z",
  },
  {
    _id: "res-pb-5",
    title: "Incident Response & Cyber Crisis Escalation Playbook for Enterprise Teams",
    type: "Playbook",
    category: "Incident Response",
    coverImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=85",
    summary: "A tactical checklist and decision tree mapping containment actions, forensic preservation, and executive communications during active breach events.",
    content: "Features role-specific responsibilities for SecOps, Legal Counsel, PR/Communications, and C-Suite leaders during hour 1, hour 12, hour 24, and day 7 of an active cyber incident.",
    fileUrl: "/sample-whitepaper.pdf",
    downloadFileType: "pdf",
    downloadFileName: "incident-response-crisis-playbook.pdf",
    downloadCount: 580,
    status: "Published",
    createdAt: "2026-10-15T10:00:00.000Z",
  },
  {
    _id: "res-pb-6",
    title: "Autonomous Threat Detection & Rapid Remediation Operational Playbook",
    type: "Playbook",
    category: "Security Operations",
    coverImage: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=85",
    summary: "Implementing automated playbook triggers to isolate compromised endpoints, revoke session tokens, and block malicious IPs without manual human latency.",
    content: "Covers high-fidelity correlation rules, automated SOAR playbooks, webhook integrations, and false-positive suppression logic to protect mission-critical enterprise workloads 24/7.",
    fileUrl: "/sample-whitepaper.pdf",
    downloadFileType: "pdf",
    downloadFileName: "autonomous-threat-detection-playbook.pdf",
    downloadCount: 430,
    status: "Published",
    createdAt: "2026-10-16T10:00:00.000Z",
  },
  {
    _id: "res-pb-7",
    title: "Identity & Access Governance (IAM) Rollout Playbook: From Legacy to Zero Trust",
    type: "Playbook",
    category: "Identity Security",
    coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=85",
    summary: "A phased roadmap for migrating enterprise legacy Active Directory domains to modern cloud-first identity providers with phishing-resistant MFA.",
    content: "Step-by-step guidance on identity discovery, role-based access control (RBAC) rationalization, single sign-on (SSO) federation, and automated joiner-mover-leaver lifecycle workflows.",
    fileUrl: "/sample-whitepaper.pdf",
    downloadFileType: "pdf",
    downloadFileName: "identity-access-governance-playbook.pdf",
    downloadCount: 515,
    status: "Published",
    createdAt: "2026-10-17T10:00:00.000Z",
  },
  {
    _id: "res-pb-8",
    title: "Penetration Testing & Red Teaming Execution Playbook (NIST & OWASP Aligned)",
    type: "Playbook",
    category: "Compliance & Testing",
    coverImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=85",
    summary: "Standard operating procedures for planning, executing, and reporting internal and external penetration tests in accordance with NIST SP 800-115.",
    content: "Includes scope definition agreements, rules of engagement templates, vulnerability severity scoring matrices (CVSS 4.0), and remediation tracking boards for security engineering teams.",
    fileUrl: "/sample-whitepaper.pdf",
    downloadFileType: "pdf",
    downloadFileName: "pen-testing-red-teaming-playbook.pdf",
    downloadCount: 460,
    status: "Published",
    createdAt: "2026-10-18T10:00:00.000Z",
  },
  {
    _id: "res-pb-9",
    title: "Software Supply Chain Security & SBOM Implementation Playbook",
    type: "Playbook",
    category: "Application Security",
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=85",
    summary: "Engineering guidelines for generating CycloneDX and SPDX Software Bills of Materials (SBOM) and enforcing automated dependency gates in CI/CD pipelines.",
    content: "Learn how to block vulnerable open-source packages, verify cryptographic artifact signatures with Sigstore, and meet executive order federal cybersecurity procurement requirements.",
    fileUrl: "/sample-whitepaper.pdf",
    downloadFileType: "pdf",
    downloadFileName: "software-supply-chain-sbom-playbook.pdf",
    downloadCount: 410,
    status: "Published",
    createdAt: "2026-10-19T10:00:00.000Z",
  },
  {
    _id: "res-pb-10",
    title: "SaaS Security Governance Playbook: Mitigating Shadow Cloud & Token Misuse",
    type: "Playbook",
    category: "SaaS Security",
    coverImage: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=85",
    summary: "A practical manual for IT and security teams to discover unauthorized SaaS subscriptions, audit third-party OAuth app permissions, and enforce data loss prevention (DLP).",
    content: "Outlines discovery techniques using CASB and DNS telemetry, continuous OAuth permission auditing, automated offboarding scripts, and data export restriction policies for corporate tenants.",
    fileUrl: "/sample-whitepaper.pdf",
    downloadFileType: "pdf",
    downloadFileName: "saas-security-governance-playbook.pdf",
    downloadCount: 475,
    status: "Published",
    createdAt: "2026-10-20T10:00:00.000Z",
  },
  {
    _id: "res-ir-1",
    title: "2026 Enterprise B2B Pipeline Benchmark Report",
    type: "Industry Report",
    category: "B2B Technology",
    coverImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=85",
    summary: "In-depth research on conversion rates, qualification criteria, and lead acquisition costs across 500+ enterprise software companies.",
    content: "Analyzes benchmark data from over 2.4 million enterprise sales conversations. Benchmark your MQL-to-SQL conversion ratios, BANT qualification thresholds, and average sales cycle length against top-quartile performers.",
    fileUrl: "/sample-whitepaper.pdf",
    downloadFileType: "pdf",
    downloadFileName: "2026-pipeline-benchmark-report.pdf",
    downloadCount: 810,
    status: "Published",
    createdAt: "2026-09-24T10:00:00.000Z",
  },
  {
    _id: "res-ir-2",
    title: "2026 Global Cyber Threat Landscape & Vulnerability Index",
    type: "Industry Report",
    category: "Cybersecurity",
    coverImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=85",
    summary: "Comprehensive empirical study tracking attack vector evolution, zero-day exploitation speeds, and dark web extortion syndicates across 22 global industries.",
    content: "Detailed data analysis highlighting an 84% acceleration in exploit-to-weaponization timelines, the surge in AI-generated phishing lures, and sector-by-sector risk distribution curves.",
    fileUrl: "/sample-whitepaper.pdf",
    downloadFileType: "pdf",
    downloadFileName: "2026-global-cyber-threat-index.pdf",
    downloadCount: 920,
    status: "Published",
    createdAt: "2026-10-02T10:00:00.000Z",
  },
  {
    _id: "res-ir-3",
    title: "Enterprise Cloud Workload Protection & Runtime Risk Benchmark",
    type: "Industry Report",
    category: "Cloud & Infrastructure",
    coverImage: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=85",
    summary: "State of multi-cloud container security, API attack surfaces, and runtime defense adoption across Fortune 1000 hybrid deployments.",
    content: "Surveys 650 cloud architects and CISOs on Kubernetes vulnerability remediation, serverless function security, and the business impact of unmanaged cloud asset sprawl.",
    fileUrl: "/sample-whitepaper.pdf",
    downloadFileType: "pdf",
    downloadFileName: "cloud-workload-protection-benchmark.pdf",
    downloadCount: 670,
    status: "Published",
    createdAt: "2026-10-05T10:00:00.000Z",
  },
  {
    _id: "res-ir-4",
    title: "State of SOC Operations & Alert Fatigue Report 2026",
    type: "Industry Report",
    category: "Security Operations",
    coverImage: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=85",
    summary: "Quantitative survey of 800+ security analysts exploring daily alert volumes, false positive ratios, and burnout rates across enterprise SecOps centers.",
    content: "Finds that over 68% of enterprise SOC alerts go uninvestigated due to staffing shortages and tool fragmentation. Highlights the ROI metrics of organizations deploying AI-driven tier-1 triage.",
    fileUrl: "/sample-whitepaper.pdf",
    downloadFileType: "pdf",
    downloadFileName: "state-of-soc-alert-fatigue-2026.pdf",
    downloadCount: 740,
    status: "Published",
    createdAt: "2026-10-07T10:00:00.000Z",
  },
  {
    _id: "res-ir-5",
    title: "AI-Driven Cyber Extortion & Attack Surface Expansion Study",
    type: "Industry Report",
    category: "Threat Landscape",
    coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=85",
    summary: "Investigation into how adversarial machine learning models are weaponized to map external attack surfaces, bypass web application firewalls, and orchestrate extortion.",
    content: "Deep research analyzing dark web marketplace transactions, automated reconnaissance scripts, and defensive recommendations for enterprise threat intelligence units.",
    fileUrl: "/sample-whitepaper.pdf",
    downloadFileType: "pdf",
    downloadFileName: "ai-driven-cyber-extortion-study.pdf",
    downloadCount: 615,
    status: "Published",
    createdAt: "2026-10-09T10:00:00.000Z",
  },
  {
    _id: "res-ir-6",
    title: "2026 CISO Priorities & Security Budget Allocation Benchmark",
    type: "Industry Report",
    category: "Leadership / CISO",
    coverImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85",
    summary: "Annual benchmark of cybersecurity spending trends, vendor consolidation rates, and board reporting priorities across mid-market and enterprise organizations.",
    content: "Examines where CISOs are reallocating spend—showing heavy gains in Identity Security, Cloud Runtime Protection, and Automated Triage, offset by cuts in legacy perimeter hardware.",
    fileUrl: "/sample-whitepaper.pdf",
    downloadFileType: "pdf",
    downloadFileName: "ciso-budget-allocation-benchmark-2026.pdf",
    downloadCount: 850,
    status: "Published",
    createdAt: "2026-10-10T10:00:00.000Z",
  },
  {
    _id: "res-ir-7",
    title: "Industrial IoT & Operational Technology (OT) Security Outlook",
    type: "Industry Report",
    category: "IoT & Infrastructure",
    coverImage: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=85",
    summary: "State of convergence between IT and OT systems in manufacturing, energy, and logistics, highlighting vulnerability trends in legacy programmable logic controllers (PLCs).",
    content: "Features survey data from 450 industrial plant managers and security officers, outlining network segmentation challenges, protocol translation vulnerabilities, and physical safety safeguards.",
    fileUrl: "/sample-whitepaper.pdf",
    downloadFileType: "pdf",
    downloadFileName: "industrial-iot-ot-security-outlook.pdf",
    downloadCount: 480,
    status: "Published",
    createdAt: "2026-10-12T10:00:00.000Z",
  },
  {
    _id: "res-ir-8",
    title: "Zero-Click & Public API Vulnerability Remediation Timeline Study",
    type: "Industry Report",
    category: "Cloud Security",
    coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=85",
    summary: "Benchmarking how quickly global organizations detect, patch, or mitigate critical zero-click API and cloud infrastructure vulnerabilities in production.",
    content: "Reveals that while mean time to patch (MTTP) has dropped from 48 days to 19 days, attackers initiate scanning within 15 minutes of public CVE publication, requiring automated virtual patching.",
    fileUrl: "/sample-whitepaper.pdf",
    downloadFileType: "pdf",
    downloadFileName: "zero-click-vulnerability-remediation-study.pdf",
    downloadCount: 540,
    status: "Published",
    createdAt: "2026-10-14T10:00:00.000Z",
  },
  {
    _id: "res-ir-9",
    title: "Identity Security & Credential Theft in Multi-Cloud Environments",
    type: "Industry Report",
    category: "Identity Security",
    coverImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=85",
    summary: "Analyzing credential compromise vectors, session token theft techniques, and privilege escalation trends across AWS, Azure, and Google Cloud IAM hierarchies.",
    content: "Breaks down 1,200 verified identity compromise incidents, demonstrating that over 82% involved inactive service credentials, excessive wildcard permissions, or unrotated developer API keys.",
    fileUrl: "/sample-whitepaper.pdf",
    downloadFileType: "pdf",
    downloadFileName: "identity-security-credential-theft-report.pdf",
    downloadCount: 595,
    status: "Published",
    createdAt: "2026-10-16T10:00:00.000Z",
  },
  {
    _id: "res-ir-10",
    title: "Global Data Privacy & Cross-Border Sovereign Compliance Report",
    type: "Industry Report",
    category: "Data Privacy & Compliance",
    coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=85",
    summary: "Comparative analysis of data sovereignty laws across the EU, US, UK, and APAC, detailing technical requirements for international enterprise data transfers.",
    content: "A definitive reference report for General Counsels and Data Protection Officers on cryptographic pseudonymization, sovereign cloud enclaves, and regulatory audit checklists.",
    fileUrl: "/sample-whitepaper.pdf",
    downloadFileType: "pdf",
    downloadFileName: "global-data-privacy-sovereignty-report.pdf",
    downloadCount: 465,
    status: "Published",
    createdAt: "2026-10-18T10:00:00.000Z",
  },
  {
    _id: "res-et-1",
    title: "Get Ahead and Stay Ahead: Enterprise Technology Rotation & Lifecycle Sustainability",
    type: "Enterprise Technology Trends",
    category: "Enterprise Technology",
    coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=85",
    summary: "Pay less, be more productive and maximize sustainability throughout the lifecycle with modern enterprise technology rotation and refresh models.",
    content: "Explore how enterprise infrastructure rotation models lower acquisition costs by up to 12.5% while optimizing hardware refresh cycles. Includes total economic impact analysis and energy sustainability metrics.",
    fileUrl: "/sample-whitepaper.pdf",
    downloadFileType: "pdf",
    downloadFileName: "technology-rotation-sustainability-brief.pdf",
    downloadCount: 520,
    status: "Published",
    createdAt: "2026-09-15T10:00:00.000Z",
  },
  {
    _id: "res-et-2",
    title: "Convergence of SASE and Zero Trust Network Architecture (ZTNA)",
    type: "Enterprise Technology Trends",
    category: "Cloud & Infrastructure",
    coverImage: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=85",
    summary: "How enterprise networking and security teams are unifying SD-WAN, Cloud Access Security Brokers (CASB), and ZTNA into consolidated cloud-delivered edges.",
    content: "In-depth trend analysis tracking the phase-out of legacy enterprise VPNs in favor of context-aware, identity-driven application access gateways across hybrid workforces.",
    fileUrl: "/sample-whitepaper.pdf",
    downloadFileType: "pdf",
    downloadFileName: "sase-ztna-convergence-trends.pdf",
    downloadCount: 440,
    status: "Published",
    createdAt: "2026-10-04T10:00:00.000Z",
  },
  {
    _id: "res-et-3",
    title: "The Rise of Agentic AI in Enterprise IT Service Management",
    type: "Enterprise Technology Trends",
    category: "AI & Decision Intelligence",
    coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=85",
    summary: "How autonomous AI agents are moving beyond scripted chatbots to proactively resolve employee IT support tickets, provision access, and remediate system errors.",
    content: "Examines multi-agent orchestration architectures, enterprise knowledge graph grounding, and safety boundary enforcement in automated corporate IT support systems.",
    fileUrl: "/sample-whitepaper.pdf",
    downloadFileType: "pdf",
    downloadFileName: "agentic-ai-itsm-trends-report.pdf",
    downloadCount: 610,
    status: "Published",
    createdAt: "2026-10-06T10:00:00.000Z",
  },
  {
    _id: "res-et-4",
    title: "Consolidation of CNAPP, CSPM, and CWPP into Unified Cloud Defense",
    type: "Enterprise Technology Trends",
    category: "Cybersecurity",
    coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=85",
    summary: "Why enterprise security buyers are rejecting fragmented cloud security point tools in favor of unified Cloud-Native Application Protection Platforms (CNAPP).",
    content: "Explores how combining posture scanning, runtime workload protection, and infrastructure-as-code linting eliminates duplicate alerts and gives DevOps teams clear remediation priority.",
    fileUrl: "/sample-whitepaper.pdf",
    downloadFileType: "pdf",
    downloadFileName: "cnapp-consolidation-trends.pdf",
    downloadCount: 535,
    status: "Published",
    createdAt: "2026-10-08T10:00:00.000Z",
  },
  {
    _id: "res-et-5",
    title: "Post-Quantum Cryptography & Enterprise Encryption Migration Roadmaps",
    type: "Enterprise Technology Trends",
    category: "Enterprise Technology",
    coverImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=85",
    summary: "Preparing enterprise infrastructure for NIST-standardized quantum-resistant algorithms to safeguard long-lived financial and proprietary data against 'harvest now, decrypt later'.",
    content: "Practical guide on conducting cryptographic asset inventories, assessing certificate authority readiness, and drafting a 5-year post-quantum migration schedule.",
    fileUrl: "/sample-whitepaper.pdf",
    downloadFileType: "pdf",
    downloadFileName: "post-quantum-cryptography-roadmap.pdf",
    downloadCount: 390,
    status: "Published",
    createdAt: "2026-10-10T10:00:00.000Z",
  },
  {
    _id: "res-et-6",
    title: "Democratizing SOC Automation: Low-Code Security Orchestration (SOAR)",
    type: "Enterprise Technology Trends",
    category: "Security Operations",
    coverImage: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=85",
    summary: "How visual low-code workflow builders allow SecOps analysts to automate multi-system response actions without writing complex custom Python scripts.",
    content: "Analyzes adoption curves, pre-built playbook ecosystems, and API connector standards that enable rapid incident containment across heterogeneous enterprise toolstacks.",
    fileUrl: "/sample-whitepaper.pdf",
    downloadFileType: "pdf",
    downloadFileName: "low-code-soar-trends-analysis.pdf",
    downloadCount: 470,
    status: "Published",
    createdAt: "2026-10-12T10:00:00.000Z",
  },
  {
    _id: "res-et-7",
    title: "Container Security at Scale: Protecting Kubernetes Across Hybrid Clouds",
    type: "Enterprise Technology Trends",
    category: "Cloud & Infrastructure",
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=85",
    summary: "Key trends in eBPF-based kernel telemetry, service mesh mutual TLS, and automated admission controllers safeguarding multi-tenant Kubernetes clusters.",
    content: "Reviews production benchmark data from 300+ enterprise cloud architectures, examining how eBPF enables real-time container threat detection with minimal CPU overhead.",
    fileUrl: "/sample-whitepaper.pdf",
    downloadFileType: "pdf",
    downloadFileName: "kubernetes-container-security-trends.pdf",
    downloadCount: 510,
    status: "Published",
    createdAt: "2026-10-14T10:00:00.000Z",
  },
  {
    _id: "res-et-8",
    title: "API Security Maturity: Discovering Shadow Endpoints & Logic Flaws",
    type: "Enterprise Technology Trends",
    category: "Application Security",
    coverImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=85",
    summary: "Why traditional WAFs fail to catch broken object level authorization (BOLA) and how dedicated API security platforms map uncatalogued shadow APIs.",
    content: "Breaks down real-world API security breach case studies, OWASP API Top 10 vulnerabilities, and continuous runtime behavioral analysis patterns.",
    fileUrl: "/sample-whitepaper.pdf",
    downloadFileType: "pdf",
    downloadFileName: "api-security-maturity-trends.pdf",
    downloadCount: 485,
    status: "Published",
    createdAt: "2026-10-16T10:00:00.000Z",
  },
  {
    _id: "res-et-9",
    title: "Autonomous Endpoint Healing & Firmware-Level Threat Isolation",
    type: "Enterprise Technology Trends",
    category: "Enterprise Technology",
    coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=85",
    summary: "The emergence of hardware-enforced self-healing endpoints capable of detecting corrupted BIOS/firmware and restoring pristine operating environments automatically.",
    content: "Discusses hardware roots of trust (RoT), secure boot enforcement, and automated remote endpoint recovery for distributed enterprise workforces.",
    fileUrl: "/sample-whitepaper.pdf",
    downloadFileType: "pdf",
    downloadFileName: "autonomous-endpoint-healing-trends.pdf",
    downloadCount: 420,
    status: "Published",
    createdAt: "2026-10-18T10:00:00.000Z",
  },
  {
    _id: "res-et-10",
    title: "Next-Generation SIEM Platforms: Cost-Effective Data Lake Architectures",
    type: "Enterprise Technology Trends",
    category: "Security Operations",
    coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=85",
    summary: "How decoupling security log storage from analytical compute using cloud data lakes (Snowflake, BigQuery, Databricks) slashes enterprise SIEM ingestion bills by 60%.",
    content: "Architecture guide exploring Open Cybersecurity Schema Framework (OCSF) data standards, federated search queries, and high-performance threat hunting on hot/warm/cold log tiers.",
    fileUrl: "/sample-whitepaper.pdf",
    downloadFileType: "pdf",
    downloadFileName: "next-gen-siem-data-lake-trends.pdf",
    downloadCount: 560,
    status: "Published",
    createdAt: "2026-10-20T10:00:00.000Z",
  },
  {
    _id: "res-bi-1",
    title: "Enterprise Buyer Intent Signals & Purchasing Cycles",
    type: "Buyer Insights",
    category: "AI & Decision Intelligence",
    coverImage: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=85",
    summary: "Comprehensive market analysis on how enterprise buying committees evaluate, budget for, and adopt next-gen AI and data solutions in 2026.",
    content: "Enterprise technology procurement has fundamentally shifted. Buying committees now involve an average of 6.8 decision-makers spanning IT, InfoSec, Procurement, and Business Unit leadership.",
    fileUrl: "/sample-whitepaper.pdf",
    downloadFileType: "pdf",
    downloadFileName: "enterprise-buyer-intent-signals-2026.pdf",
    downloadCount: 580,
    status: "Published",
    createdAt: "2026-09-28T10:00:00.000Z",
  },
  {
    _id: "res-bi-2",
    title: "Executive Video Masterclass: Scaling BANT & SQL Pipeline in Enterprise Markets",
    type: "Buyer Insights",
    category: "Revenue Operations",
    coverImage: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=85",
    summary: "Watch our on-demand executive briefing covering how top-performing B2B organizations combine human-verified data with structured tele-qualification to double SQL conversion.",
    content: "In this executive video walkthrough, our pipeline strategists break down real enterprise campaign specifications across SaaS, Cybersecurity, and FinTech.",
    fileUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    downloadFileType: "video",
    downloadFileName: "executive-bant-sql-pipeline-masterclass.mp4",
    downloadCount: 690,
    status: "Published",
    createdAt: "2026-10-11T10:00:00.000Z",
  },
  {
    _id: "res-bi-3",
    title: "How Enterprise CISOs and CIOs Evaluate Next-Gen Security Vendors in 2026",
    type: "Buyer Insights",
    category: "Leadership / CISO",
    coverImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85",
    summary: "Direct buyer feedback from 120 Fortune 1000 security executives detailing vendor evaluation rubrics, PoC expectations, and non-negotiable security requirements.",
    content: "Reveals the top factors driving vendor selection: ease of SIEM/SOAR API integration (91%), agent performance impact under 1% CPU (87%), and transparent multi-year licensing without surprise surge fees (82%).",
    fileUrl: "/sample-whitepaper.pdf",
    downloadFileType: "pdf",
    downloadFileName: "ciso-vendor-evaluation-insights.pdf",
    downloadCount: 615,
    status: "Published",
    createdAt: "2026-10-13T10:00:00.000Z",
  },
  {
    _id: "res-bi-4",
    title: "Buyer Committee Dynamics in Enterprise Cloud Infrastructure Procurement",
    type: "Buyer Insights",
    category: "Cloud & Infrastructure",
    coverImage: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=85",
    summary: "Mapping the friction points between DevOps teams seeking agility and Finance/Procurement teams enforcing FinOps cloud budget limits.",
    content: "Provides revenue leaders with actionable buyer engagement blueprints to reconcile developer speed priorities with CFO cost-governance mandates during complex enterprise sales.",
    fileUrl: "/sample-whitepaper.pdf",
    downloadFileType: "pdf",
    downloadFileName: "cloud-infrastructure-buyer-committee-dynamics.pdf",
    downloadCount: 490,
    status: "Published",
    createdAt: "2026-10-15T10:00:00.000Z",
  },
  {
    _id: "res-bi-5",
    title: "Budget Allocation Shifts: Why Security Leaders Are Slashing Point Solutions",
    type: "Buyer Insights",
    category: "Cybersecurity",
    coverImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=85",
    summary: "Inside the enterprise consolidation wave: why 74% of enterprise CISOs plan to replace niche single-purpose tools with multi-function platform suites over the next 18 months.",
    content: "Deep research exploring total cost of ownership fatigue, integration overhead, and the vendor rationalization criteria applied during contract renewals.",
    fileUrl: "/sample-whitepaper.pdf",
    downloadFileType: "pdf",
    downloadFileName: "budget-shifts-point-solution-slashing.pdf",
    downloadCount: 540,
    status: "Published",
    createdAt: "2026-10-16T10:00:00.000Z",
  },
  {
    _id: "res-bi-6",
    title: "The CISO Evaluation Matrix: What High-Growth Security Vendors Must Prove in PoCs",
    type: "Buyer Insights",
    category: "Security Operations",
    coverImage: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=85",
    summary: "A transparent breakdown of proof-of-concept success criteria used by Fortune 500 security engineering teams to evaluate new threat detection and response technologies.",
    content: "Details test environment protocols, simulated attack scenarios (MITRE ATT&CK validation), telemetry ingestion overhead limits, and executive scoring matrices.",
    fileUrl: "/sample-whitepaper.pdf",
    downloadFileType: "pdf",
    downloadFileName: "ciso-poc-evaluation-matrix.pdf",
    downloadCount: 585,
    status: "Published",
    createdAt: "2026-10-17T10:00:00.000Z",
  },
  {
    _id: "res-bi-7",
    title: "Procurement Friction Points: Navigating Enterprise Legal, Risk, and InfoSec Audits",
    type: "Buyer Insights",
    category: "Enterprise Technology",
    coverImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=85",
    summary: "How enterprise B2B sales teams eliminate 60+ days of deal slippage by anticipating vendor security assessment questionnaires (VSAQ) and data processing addendums (DPA).",
    content: "Covers SOC 2 Type II expectations, ISO 27001 mapping, third-party penetration test disclosures, and standard liability caps required by enterprise procurement officers.",
    fileUrl: "/sample-whitepaper.pdf",
    downloadFileType: "pdf",
    downloadFileName: "procurement-friction-points-guide.pdf",
    downloadCount: 505,
    status: "Published",
    createdAt: "2026-10-18T10:00:00.000Z",
  },
  {
    _id: "res-bi-8",
    title: "Intent Signal Correlation: Identifying Accounts Actively Modernizing Security Stacks",
    type: "Buyer Insights",
    category: "Demand Generation",
    coverImage: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=85",
    summary: "How top-quartile demand gen teams combine first-party content consumption with third-party surge topics to trigger outbound outreach at the exact moment of buyer evaluation.",
    content: "Case examples demonstrating how correlation of regulatory audit announcements, job postings for security architects, and technical whitepaper downloads yield 3.4x higher conversion into SQLs.",
    fileUrl: "/sample-whitepaper.pdf",
    downloadFileType: "pdf",
    downloadFileName: "intent-signal-correlation-guide.pdf",
    downloadCount: 630,
    status: "Published",
    createdAt: "2026-10-19T10:00:00.000Z",
  },
  {
    _id: "res-bi-9",
    title: "Executive Purchasing Psychology: Value-Add Assessments vs Pitch Decks",
    type: "Buyer Insights",
    category: "Sales Development",
    coverImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=85",
    summary: "Why C-level technology decision-makers respond 400% more favorably to diagnostic benchmark assessments than standard vendor capability presentations.",
    content: "Shares cognitive psychology principles behind peer benchmark comparisons, risk scorecards, and consultation-led discovery that establish immediate trusted-advisor credibility.",
    fileUrl: "/sample-whitepaper.pdf",
    downloadFileType: "pdf",
    downloadFileName: "executive-purchasing-psychology-report.pdf",
    downloadCount: 560,
    status: "Published",
    createdAt: "2026-10-20T10:00:00.000Z",
  },
  {
    _id: "res-bi-10",
    title: "Contract Renewal & Vendor Rationalization: How Enterprise Buyers Decide Retention",
    type: "Buyer Insights",
    category: "Revenue Operations",
    coverImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=85",
    summary: "Key metrics enterprise procurement and IT leaders evaluate 90 days prior to contract renewal: active daily license utilization, realized ROI vs original business case, and executive sponsor health.",
    content: "Provides customer success and sales leadership with proven defense playbooks to proactively insulate key enterprise accounts against competitive displacement and budget clawbacks.",
    fileUrl: "/sample-whitepaper.pdf",
    downloadFileType: "pdf",
    downloadFileName: "contract-renewal-vendor-rationalization.pdf",
    downloadCount: 495,
    status: "Published",
    createdAt: "2026-10-21T10:00:00.000Z",
  },
];

// ================= RESOURCES & RESEARCH API =================
export const resourcesApi = {
  getAll: async (type?: string) => {
    try {
      const url = type
        ? `${API_BASE_URL}/resources?type=${encodeURIComponent(type)}`
        : `${API_BASE_URL}/resources`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch server resources");
      const serverResources = await response.json();
      if (serverResources && serverResources.length > 0) {
        return serverResources;
      }
    } catch (error) {
      // Fallback to local
    }

    const local = JSON.parse(localStorage.getItem("local_resources") || "null");
    let pool = local || initialDemoResources;
    if (local) {
      // Ensure missing demo items (like Buyer Insights) are synced automatically
      const missing = initialDemoResources.filter(
        (demo) => !local.some((l: any) => l._id === demo._id || l.title === demo.title)
      );
      if (missing.length > 0) {
        pool = [...local, ...missing];
        localStorage.setItem("local_resources", JSON.stringify(pool));
      }
    } else {
      localStorage.setItem("local_resources", JSON.stringify(initialDemoResources));
    }

    if (type) {
      const normalizedType = type.toLowerCase().trim();
      return pool.filter((r: any) =>
        (r.type || "").toLowerCase().includes(normalizedType) ||
        normalizedType.includes((r.type || "").toLowerCase())
      );
    }
    return pool;
  },

  getById: async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/resources/${id}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      // Fallback
    }

    const local = JSON.parse(localStorage.getItem("local_resources") || "null") || initialDemoResources;
    return local.find((r: any) => r._id === id || r.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") === id) || initialDemoResources.find((r) => r._id === id) || local[0];
  },

  create: async (data: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/resources`, {
        method: "POST",
        headers: getHeaders(true),
        body: JSON.stringify(data),
      });
      if (response.ok) return await response.json();
    } catch (error) {
      // Fallback
    }

    const local = JSON.parse(localStorage.getItem("local_resources") || "null") || [...initialDemoResources];
    const newRes = {
      _id: `local_res_${Date.now()}`,
      downloadCount: 0,
      ...data,
      createdAt: new Date().toISOString(),
    };
    local.unshift(newRes);
    localStorage.setItem("local_resources", JSON.stringify(local));
    return newRes;
  },

  update: async (id: string, data: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/resources/${id}`, {
        method: "PUT",
        headers: getHeaders(true),
        body: JSON.stringify(data),
      });
      if (response.ok) return await response.json();
    } catch (error) {
      // Fallback
    }

    const local = JSON.parse(localStorage.getItem("local_resources") || "null") || [...initialDemoResources];
    const updated = local.map((item: any) => (item._id === id ? { ...item, ...data } : item));
    localStorage.setItem("local_resources", JSON.stringify(updated));
    return { success: true, item: data };
  },

  delete: async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/resources/${id}`, {
        method: "DELETE",
        headers: getHeaders(true),
      });
      if (response.ok) return await response.json();
    } catch (error) {
      // Fallback
    }

    const local = JSON.parse(localStorage.getItem("local_resources") || "null") || [...initialDemoResources];
    const updated = local.filter((item: any) => item._id !== id);
    localStorage.setItem("local_resources", JSON.stringify(updated));
    return { success: true };
  },
};

// ================= NEWSLETTERS STORAGE & API =================
export interface NewsletterData {
  _id: string;
  title: string;
  slug: string;
  frequency: "Weekly" | "Monthly" | "Bi-Weekly";
  category: string;
  summary: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  status: "Published" | "Draft";
  highlights: string[];
  subscribersCount?: string;
  formConfig?: GatedFormConfig;
}

export const initialNewslettersList: NewsletterData[] = [
  {
    _id: "nl-1",
    title: "Weekly B2B Pipeline Dispatch: High-Intent Signals & Lead Scoring",
    slug: "weekly-b2b-pipeline-dispatch",
    frequency: "Weekly",
    category: "B2B Technology",
    summary: "Weekly breakdown of account intent triggers, BANT qualification criteria, and pipeline conversion benchmarks for enterprise sales teams.",
    author: "GETprospeKt Editorial",
    date: "Sep 2026",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=90",
    status: "Published",
    highlights: [
      "First-party vs third-party intent signals",
      "ICP qualification checklists",
      "Weekly conversion rates benchmark",
    ],
    subscribersCount: "1,420 subscribers",
  },
  {
    _id: "nl-2",
    title: "Monthly Enterprise Tech Pulse: Cloud & Infrastructure Buyer Shifts",
    slug: "monthly-enterprise-tech-pulse",
    frequency: "Monthly",
    category: "Enterprise Technology",
    summary: "A monthly executive briefing on enterprise IT budget allocation, procurement cycles, and cloud migration demand across Fortune 1000 buyers.",
    author: "GETprospeKt Research",
    date: "Sep 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=1200&q=90",
    status: "Published",
    highlights: [
      "Quarterly IT budget outlook",
      "Enterprise vendor shortlist insights",
      "C-suite decision making trends",
    ],
    subscribersCount: "2,850 subscribers",
  },
  {
    _id: "nl-3",
    title: "Cybersecurity & SaaS Growth Brief: Security Qualification in Pipeline",
    slug: "cybersecurity-saas-growth-brief",
    frequency: "Weekly",
    category: "Cybersecurity",
    summary: "How cybersecurity marketing teams verify technical stakeholder fit and accelerate security compliance vetting in early-stage pipelines.",
    author: "GETprospeKt Editorial",
    date: "Aug 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=90",
    status: "Published",
    highlights: [
      "Compliance criteria in BANT scoping",
      "CISO engagement patterns",
      "Security evaluation lead cycles",
    ],
    subscribersCount: "980 subscribers",
  },
  {
    _id: "nl-4",
    title: "AI Demand Dynamics: Generative Tools & B2B Buyer Evaluation",
    slug: "ai-demand-dynamics-newsletter",
    frequency: "Bi-Weekly",
    category: "AI",
    summary: "Bi-weekly analysis tracking generative AI adoption in enterprise workflow automation and tech stack evaluation timelines.",
    author: "GETprospeKt AI Labs",
    date: "Aug 2026",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=90",
    status: "Published",
    highlights: [
      "GenAI procurement trends",
      "ROI validation criteria",
      "Budget reallocations in Enterprise AI",
    ],
    subscribersCount: "1,760 subscribers",
  },
  {
    _id: "nl-5",
    title: "Revenue Architecture Weekly: Modern Outbound & RevOps Alignment",
    slug: "revenue-architecture-weekly",
    frequency: "Weekly",
    category: "Revenue Operations",
    summary: "Weekly executive briefing dissecting enterprise GTM cadences, pipeline conversion benchmarks, and sales-marketing alignment SLAs.",
    author: "GETprospeKt Editorial Board",
    date: "Oct 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=90",
    status: "Published",
    highlights: [
      "Enterprise GTM cadences",
      "Pipeline conversion benchmarks",
      "Sales & marketing alignment SLAs",
    ],
    subscribersCount: "4,850 subscribers",
  },
  {
    _id: "nl-6",
    title: "B2B Intent & Demand Dynamics: Surge Signals & Evaluation Cycles",
    slug: "b2b-intent-demand-dynamics",
    frequency: "Monthly",
    category: "Demand Generation",
    summary: "Monthly strategic analysis tracking high-intent topic surges, buying committee evaluations, and cross-channel outreach tactics across Enterprise SaaS.",
    author: "Elena Rostova",
    date: "Oct 2026",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=90",
    status: "Published",
    highlights: [
      "Surge topic analysis",
      "In-market account identification",
      "Omnichannel outreach strategies",
    ],
    subscribersCount: "3,420 subscribers",
  },
  {
    _id: "nl-7",
    title: "SOC Alert Fatigue & Autonomous Triage Dispatch",
    slug: "soc-alert-fatigue-autonomous-triage",
    frequency: "Weekly",
    category: "Cybersecurity",
    summary: "Weekly breakdown of SOC alert automation, tier-1 triage reduction metrics, and generative investigation workflows for security operations teams.",
    author: "Ahmed Achchak / GETprospeKt Cyber Labs",
    date: "Oct 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=90",
    status: "Published",
    highlights: [
      "Alert fatigue mitigation metrics",
      "Autonomous triage benchmark",
      "SOAR vs AI-native workflows",
    ],
    subscribersCount: "2,140 subscribers",
  },
  {
    _id: "nl-8",
    title: "Cloud Security & Runtime Vulnerability Wire",
    slug: "cloud-security-runtime-vulnerability-wire",
    frequency: "Monthly",
    category: "Cloud & Infrastructure",
    summary: "Monthly deep dive into zero-click cloud vulnerabilities, container runtime protection, and CNAPP consolidation trends across AWS and Azure.",
    author: "Ari Eitan / GETprospeKt Research",
    date: "Oct 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=90",
    status: "Published",
    highlights: [
      "Runtime risk prioritization",
      "Zero-click API exploit patterns",
      "Multi-cloud posture audits",
    ],
    subscribersCount: "3,120 subscribers",
  },
  {
    _id: "nl-9",
    title: "Identity Security & Access Governance Pulse",
    slug: "identity-security-access-governance-pulse",
    frequency: "Bi-Weekly",
    category: "Enterprise Technology",
    summary: "Bi-weekly executive intelligence tracking machine identity explosion, API credential management, and Zero Trust access policies.",
    author: "Greg Keller / GETprospeKt Editorial",
    date: "Oct 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=90",
    status: "Published",
    highlights: [
      "Machine ID governance",
      "Privileged access sprawl",
      "Zero Trust continuous auth",
    ],
    subscribersCount: "1,890 subscribers",
  },
  {
    _id: "nl-10",
    title: "Cyber Extortion & Ransomware Intelligence Brief",
    slug: "cyber-extortion-ransomware-intelligence-brief",
    frequency: "Weekly",
    category: "Cybersecurity",
    summary: "Weekly tactical briefing on emerging ransomware leak tactics, double-extortion mitigation, and proactive enterprise data hygiene.",
    author: "Jyotsna Iyer / GETprospeKt Cyber Labs",
    date: "Oct 2026",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=90",
    status: "Published",
    highlights: [
      "Data extortion economics",
      "Lateral movement defense",
      "Immutable backup governance",
    ],
    subscribersCount: "2,650 subscribers",
  },
];

export const newslettersStorageApi = {
  getAll: (): NewsletterData[] => {
    try {
      const data = localStorage.getItem("gp_newsletters");
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          let updated = false;
          const sanitized = parsed.map((item: any) => {
            const canonical = initialNewslettersList.find((def) => def.slug === item.slug || def._id === item._id);
            if (canonical && (!item.image || item.image.includes("1543286386-2e659306dc6c"))) {
              updated = true;
              return { ...item, image: canonical.image };
            }
            return item;
          });

          const missing = initialNewslettersList.filter(
            (def) => !sanitized.some((item: any) => item.slug === def.slug || item._id === def._id)
          );
          if (missing.length > 0 || updated) {
            const merged = [...sanitized, ...missing];
            localStorage.setItem("gp_newsletters", JSON.stringify(merged));
            return merged;
          }
          return sanitized;
        }
      }
    } catch (e) {
      console.warn("[Newsletters Storage] Read error", e);
    }
    return initialNewslettersList;
  },

  saveAll: (items: NewsletterData[]) => {
    try {
      localStorage.setItem("gp_newsletters", JSON.stringify(items));
      window.dispatchEvent(new Event("gp_newsletters_updated"));
    } catch (e) {
      console.warn("[Newsletters Storage] Save error", e);
    }
  },

  resetDefaults: (): NewsletterData[] => {
    try {
      localStorage.setItem("gp_newsletters", JSON.stringify(initialNewslettersList));
      window.dispatchEvent(new Event("gp_newsletters_updated"));
    } catch (e) {
      console.warn("[Newsletters Storage] Reset error", e);
    }
    return initialNewslettersList;
  },
};

export const newslettersApi = {
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/newsletters`);
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch (error) {
      // fallback
    }
    return newslettersStorageApi.getAll();
  },

  create: async (data: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/newsletters`, {
        method: "POST",
        headers: getHeaders(true),
        body: JSON.stringify(data),
      });
      if (response.ok) return await response.json();
    } catch (error) {
      // offline fallback
    }
    return data;
  },

  update: async (id: string, data: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/newsletters/${id}`, {
        method: "PUT",
        headers: getHeaders(true),
        body: JSON.stringify(data),
      });
      if (response.ok) return await response.json();
    } catch (error) {
      // offline fallback
    }
    return data;
  },

  delete: async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/newsletters/${id}`, {
        method: "DELETE",
        headers: getHeaders(true),
      });
      if (response.ok) return await response.json();
    } catch (error) {
      // offline fallback
    }
    return { success: true };
  },
};

// ================= RELATED CONTENT (ARTICLE SIDEBAR) API =================
export interface RelatedContentItem {
  _id: string;
  id?: string;
  title: string;
  author: string;
  date: string;
  category?: string;
  link: string;
  description: string;
}

export const initialRelatedContentList: RelatedContentItem[] = [
  {
    _id: "rc-1",
    id: "rc-1",
    title: "The Trust Premium of AI in Personalization for Brands",
    author: "Aafreen Shaikh",
    date: "Sep 2, 2026",
    category: "AI & Personalization",
    description: "Explore the role of AI in creating personalized experiences that build trust with consumers.",
    link: "/article/trust-premium-ai-personalization",
  },
  {
    _id: "rc-2",
    id: "rc-2",
    title: "Activating High-Value Audiences With First Party Data",
    author: "Aafreen Shaikh",
    date: "Jul 2, 2026",
    category: "First-Party Data",
    description: "Discover effective strategies to activate high-value audiences while safeguarding sensitive data.",
    link: "/article/guest-first-party-data",
  },
  {
    _id: "rc-3",
    id: "rc-3",
    title: "How CMOs Are Driving Success in an AI-Driven World",
    author: "Aafreen Shaikh",
    date: "May 20, 2026",
    category: "Executive Strategy",
    description: "Discover how CMOs leverage AI to enhance brand success and drive innovation.",
    link: "/article/guest-ai-driven-cmos",
  },
  {
    _id: "rc-4",
    id: "rc-4",
    title: "From AI Tools to AI-Native Marketing",
    author: "Aafreen Shaikh",
    date: "May 4, 2026",
    category: "AI Marketing",
    description: "Learn how CMOs are building marketing organizations for the next era of growth.",
    link: "/article/guest-ai-native-marketing",
  },
  {
    _id: "rc-5",
    id: "rc-5",
    title: "How AI Is Transforming Marketing and Advertising",
    author: "Aafreen Shaikh",
    date: "Apr 30, 2026",
    category: "Advertising & AI",
    description: "Explore the transformative impact of AI across modern marketing and advertising.",
    link: "/article/guest-ai-marketing-advertising",
  },
  {
    _id: "rc-6",
    id: "rc-6",
    title: "Mitigating SOC Alert Fatigue With Autonomous AI Triage",
    author: "Ahmed Achchak",
    date: "Oct 16, 2026",
    category: "SOC Operations",
    description: "How security operations centers cut through thousands of false positives and reduce investigation time from hours to seconds.",
    link: "/article/guest-soc-alert-fatigue-automation",
  },
  {
    _id: "rc-7",
    id: "rc-7",
    title: "Securing Autonomous AI Agents Against Memory Poisoning",
    author: "Gal Moyal",
    date: "Oct 12, 2026",
    category: "AI Security",
    description: "Explores emerging threat vectors targeting agentic AI applications and critical guardrails for enterprise deployments.",
    link: "/article/guest-securing-agentic-ai",
  },
  {
    _id: "rc-8",
    id: "rc-8",
    title: "Navigating AI-Driven Access Management & Identity Governance",
    author: "Greg Keller",
    date: "Oct 7, 2026",
    category: "Identity Security",
    description: "Why traditional perimeter security has collapsed and how machine identities define modern Zero Trust boundaries.",
    link: "/article/guest-redefining-identity-security",
  },
  {
    _id: "rc-9",
    id: "rc-9",
    title: "Unifying Cyber Protection: Zero-Click Vulnerabilities in Cloud",
    author: "Ari Eitan",
    date: "Sep 28, 2026",
    category: "Cloud Security",
    description: "A breakdown of zero-click and one-click cloud infrastructure vulnerabilities and runtime-first posture management.",
    link: "/article/cloud-infrastructure",
  },
  {
    _id: "rc-10",
    id: "rc-10",
    title: "Smarter Deployment of AI: Defending Against Shadow Tool Sprawl",
    author: "Jyotsna Iyer",
    date: "Sep 22, 2026",
    category: "Threat Landscape",
    description: "Enterprise strategies to prevent data leakage and govern employee personal AI agent interactions securely.",
    link: "/article/cybersecurity-pipeline",
  },
];

export const relatedContentStorageApi = {
  getAll: (): RelatedContentItem[] => {
    try {
      const data = localStorage.getItem("gp_related_content");
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("[Related Content Storage] Read error", e);
    }
    return initialRelatedContentList;
  },

  saveAll: (items: RelatedContentItem[]) => {
    try {
      localStorage.setItem("gp_related_content", JSON.stringify(items));
      window.dispatchEvent(new Event("gp_related_content_updated"));
    } catch (e) {
      console.warn("[Related Content Storage] Save error", e);
    }
  },

  resetDefaults: (): RelatedContentItem[] => {
    try {
      localStorage.setItem("gp_related_content", JSON.stringify(initialRelatedContentList));
      window.dispatchEvent(new Event("gp_related_content_updated"));
    } catch (e) {
      console.warn("[Related Content Storage] Reset error", e);
    }
    return initialRelatedContentList;
  },
};

// ================= HOMEPAGE LATEST & POPULAR API =================
export interface HomepageArticle {
  _id: string;
  title: string;
  author: string;
  date: string;
  category: string;
  link: string;
  description: string;
  image: string;
}

export const initialLatestArticles: HomepageArticle[] = [
  {
    _id: "latest-1",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1472&q=90",
    title: "Smarter Deployment of AI: Defending Against Shadow AI and Agentic Risks",
    author: "Jyotsna Iyer",
    date: "Oct 2026",
    category: "Cybersecurity",
    link: "/article/smarter-ai-deployment-guardrails",
    description: "Why modern enterprise cybersecurity doesn't need more AI models, but smarter deployment of governance guardrails to protect against unauthorized model use and memory leakage.",
  },
  {
    _id: "latest-2",
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=90",
    title: "Unifying Cyber Protection: Mitigating Zero-Click & Runtime Cloud Vulnerabilities",
    author: "Ari Eitan",
    date: "Oct 2026",
    category: "Cloud Security",
    link: "/article/runtime-cloud-vulnerability-protection",
    description: "How runtime-first cloud security platforms prioritize active exploit paths and shrink the window between vulnerability discovery and automated remediation.",
  },
  {
    _id: "latest-3",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=90",
    title: "Alert Fatigue in Cybersecurity: The Critical Role of AI Automation",
    author: "Ahmed Achchak",
    date: "Oct 2026",
    category: "Security Operations",
    link: "/article/guest-soc-alert-fatigue-automation",
    description: "Exploring why Tier-1 SOC analysts face acute burnout from false positives and how autonomous triage models reduce investigation times from hours to seconds.",
  },
  {
    _id: "latest-4",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=90",
    title: "The Next Leap in Enterprise Defense: Subscription-Based Firewall Services",
    author: "Chandrodaya Prasad",
    date: "Oct 2026",
    category: "Enterprise Leadership",
    link: "/article/subscription-firewalls-cloud-sase",
    description: "The architectural shift from rigid hardware appliances to flexible, cloud-centric firewall platforms and unified secure access service edge (SASE).",
  },
  {
    _id: "latest-5",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=90",
    title: "Redefining Identity Security: Navigating AI-Driven Access Management",
    author: "Greg Keller",
    date: "Oct 2026",
    category: "Identity Security",
    link: "/article/guest-redefining-identity-security",
    description: "Navigating identity perimeter dissolution, continuous machine-to-machine authentication, and automated credential governance in modern hybrid enterprises.",
  },
  {
    _id: "latest-6",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=90",
    title: "Guarding Against Exploits: Best Practices for Securing Enterprise AI Agents",
    author: "Gal Moyal",
    date: "Oct 2026",
    category: "AI Defense",
    link: "/article/guest-securing-agentic-ai",
    description: "Mitigating memory poisoning, indirect prompt injection, and multi-agent coordination risks across mission-critical enterprise workflows.",
  },
  {
    _id: "latest-7",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=90",
    title: "Modern Cyber Extortion: Why Data Leakage Has Become the Primary Currency",
    author: "GETprospeKt Cyber Labs",
    date: "Sep 2026",
    category: "Cybersecurity",
    link: "/article/modern-cyber-extortion-data-leakage",
    description: "Analyzing how extortion syndicates shifted from pure disk encryption to aggressive data exfiltration, bypassing traditional endpoint backups.",
  },
  {
    _id: "latest-8",
    image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=90",
    title: "Film to Theme Parks: Cutting-Edge Tech In Use in Entertainment",
    author: "GETprospeKt Engineering",
    date: "Oct 2026",
    category: "DevOps & Engineering",
    link: "/article/film-to-theme-parks-cutting-edge-tech-entertainment",
    description: "How the entertainment industry makes use of the latest tech to make magic — from virtual production LED volumes to real-time robotics in modern theme parks.",
  },
  {
    _id: "latest-9",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=90",
    title: "Penetration Testing Standardisation: Operationalising NIST SP 800-115 & OWASP",
    author: "GETprospeKt Research",
    date: "Sep 2026",
    category: "Enterprise Leadership",
    link: "/article/penetration-testing-standardisation-nist-owasp",
    description: "Standardizing offensive security validation, continuous automated red teaming, and verifiable remediation reporting for enterprise compliance audits.",
  },
  {
    _id: "latest-10",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=90",
    title: "Account-Based Pipeline Engineering in Cyber & Enterprise Tech",
    author: "GETprospeKt",
    date: "Sep 2026",
    category: "MarTech & Growth",
    link: "/article/abm-enterprise-account-intelligence",
    description: "How enterprise revenue teams map complex CISO buying committees and accelerate multi-stakeholder cybersecurity pipeline.",
  },
];

export const initialPopularArticles: HomepageArticle[] = [
  {
    _id: "pop-1",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=90",
    title: "2026 CISO Executive Agenda: Tool Consolidation & Vendor Rationalisation",
    author: "Elena Rostova",
    date: "Trending",
    category: "Enterprise Leadership",
    link: "/article/ciso-tool-consolidation-vendor-rationalisation",
    description: "Why security leaders are eliminating standalone point tools in favor of integrated platforms to curb cost and operational complexity.",
  },
  {
    _id: "pop-2",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=90",
    title: "Zero Trust for Machine Identities: Securing Workloads, Containers, and APIs",
    author: "Greg Keller",
    date: "Most Read",
    category: "Cybersecurity",
    link: "/article/zero-trust-machine-identity-architecture",
    description: "Expanding Zero Trust beyond human employees to encompass non-human service accounts, Kubernetes pods, and microservice certificates.",
  },
  {
    _id: "pop-3",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=90",
    title: "Ransomware Defense Playbook: Halting Lateral Movement in Hybrid Environments",
    author: "GETprospeKt Cyber Labs",
    date: "Popular",
    category: "Cybersecurity",
    link: "/article/ransomware-defense-lateral-movement",
    description: "Network micro-segmentation and behavioral endpoint inspection strategies that stop ransomware payloads before they compromise active directory.",
  },
  {
    _id: "pop-4",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=90",
    title: "Securing the Modern Software Supply Chain Against Dependency Infiltration",
    author: "GETprospeKt Dev Labs",
    date: "Featured",
    category: "DevOps & Engineering",
    link: "/article/software-supply-chain-dependency-security",
    description: "Implementing automated Software Bills of Materials (SBOM), continuous open-source package scanning, and signed artifact enforcement.",
  },
  {
    _id: "pop-5",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=90",
    title: "Activating High-Value Audiences With First Party Data",
    author: "Nick Henthorn",
    date: "Trending",
    category: "MarTech & Growth",
    link: "/article/guest-first-party-data",
    description: "Navigating GDPR, CCPA, and emerging global data residency mandates while training and deploying enterprise machine learning systems.",
  },
  {
    _id: "pop-6",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=90",
    title: "Automated Threat Hunting: Empowering Level-1 Analysts with Generative Insights",
    author: "Ahmed Achchak",
    date: "Hot Topic",
    category: "Cybersecurity",
    link: "/article/automated-threat-hunting-generative-insights",
    description: "Using natural-language threat investigation assistants to correlate multi-source SIEM logs and accelerate incident containment.",
  },
  {
    _id: "pop-7",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=90",
    title: "Endpoint Resilience Beyond EDR: Enforcing Continuous Integrity Across Fleets",
    author: "David Sterling",
    date: "Most Read",
    category: "Enterprise Leadership",
    link: "/article/endpoint-resilience-firmware-integrity",
    description: "How hardware-rooted firmware verification and self-healing OS agents prevent persistence from advanced nation-state threat actors.",
  },
  {
    _id: "pop-8",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=90",
    title: "Third-Party Risk Management: Assessing Cyber Posture in Vendor Ecosystems",
    author: "Marcus Vance",
    date: "Trending",
    category: "FinTech & Banking",
    link: "/article/third-party-risk-management-vendor-telemetry",
    description: "Moving beyond passive annual questionnaires to continuous passive telemetry and verified vendor security scorecards.",
  },
  {
    _id: "pop-9",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=90",
    title: "Defending Critical FinTech & SaaS Workloads Against Token Hijacking & Session Theft",
    author: "GETprospeKt FinTech Wire",
    date: "Featured",
    category: "FinTech & Banking",
    link: "/article/fintech-cloud-security-token-hijacking",
    description: "Preventing adversary-in-the-middle phishing attacks and cookie exfiltration across enterprise Microsoft 365, Google Workspace, and Salesforce.",
  },
  {
    _id: "pop-10",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=90",
    title: "Executive Cyber Crisis Playbook: Board Communication & Incident Response",
    author: "Elena Rostova",
    date: "Essential",
    category: "Enterprise Leadership",
    link: "/article/executive-cyber-crisis-playbook-board-comms",
    description: "Structuring transparent executive disclosures, regulatory timelines, and customer communications during mission-critical breach containment.",
  },
];

export const homepageShowcaseApi = {
  getLatest: (): HomepageArticle[] => {
    try {
      const saved = localStorage.getItem("gp_homepage_latest");
      if (saved) {
        let parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Sync with canonical article images to prevent image repetition
          let changed = false;
          parsed = parsed.map((item) => {
            const canonical = initialLatestArticles.find((def) => def.link === item.link || def._id === item._id);
            if (canonical && item.image !== canonical.image) {
              changed = true;
              return { ...item, image: canonical.image };
            }
            return item;
          });
          const missing = initialLatestArticles.filter(
            (def) => !parsed.some((item: any) => item.link === def.link || item._id === def._id)
          );
          if (missing.length > 0) {
            parsed = [...parsed, ...missing];
            changed = true;
          }
          if (changed) {
            localStorage.setItem("gp_homepage_latest", JSON.stringify(parsed));
          }
          return parsed;
        }
      }
    } catch (e) {}
    return initialLatestArticles;
  },
  saveLatest: (items: HomepageArticle[]) => {
    localStorage.setItem("gp_homepage_latest", JSON.stringify(items));
    window.dispatchEvent(new Event("gp_homepage_updated"));
    return items;
  },
  getPopular: (): HomepageArticle[] => {
    try {
      const saved = localStorage.getItem("gp_homepage_popular");
      if (saved) {
        let parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Sync with canonical article images to prevent image repetition
          let changed = false;
          parsed = parsed.map((item) => {
            const canonical = initialPopularArticles.find((def) => def.link === item.link || def._id === item._id);
            if (canonical && item.image !== canonical.image) {
              changed = true;
              return { ...item, image: canonical.image };
            }
            return item;
          });
          const missing = initialPopularArticles.filter(
            (def) => !parsed.some((item: any) => item.link === def.link || item._id === def._id)
          );
          if (missing.length > 0) {
            parsed = [...parsed, ...missing];
            changed = true;
          }
          if (changed) {
            localStorage.setItem("gp_homepage_popular", JSON.stringify(parsed));
          }
          return parsed;
        }
      }
    } catch (e) {}
    return initialPopularArticles;
  },
  savePopular: (items: HomepageArticle[]) => {
    localStorage.setItem("gp_homepage_popular", JSON.stringify(items));
    window.dispatchEvent(new Event("gp_homepage_updated"));
    return items;
  },
  resetDefaults: () => {
    localStorage.removeItem("gp_homepage_latest");
    localStorage.removeItem("gp_homepage_popular");
    window.dispatchEvent(new Event("gp_homepage_updated"));
    return { latest: initialLatestArticles, popular: initialPopularArticles };
  },
};

// ================= GATED FORM FIELDS CONFIG API =================
export interface FormFieldSetting {
  id: string;
  label: string;
  enabled: boolean;
  required: boolean;
  type?: "text" | "email" | "tel" | "number" | "select" | "textarea" | "checkbox";
  placeholder?: string;
  options?: string[];
  group?: string;
  hint?: string;
  isCustom?: boolean;
  icon?: string;
}

export interface ResourceMetaBarConfig {
  showCategory: boolean;
  showFormat: boolean;
  showAccessBadge: boolean;
  defaultAccessBadgeText: string;
  showDownloadCount: boolean;
  downloadsSuffix: string;
}

export interface DownloadAssetConfig {
  fileType: string;
  fileUrl: string;
  fileName: string;
  downloadContent: string;
}

export interface GatedFormConfig {
  headerTitle: string;
  subtitle: string;
  submitButtonText: string;
  metaBar: ResourceMetaBarConfig;
  downloadAsset?: DownloadAssetConfig;
  deletedFieldKeys?: string[];
  fields: {
    firstName: FormFieldSetting;
    lastName: FormFieldSetting;
    email: FormFieldSetting;
    telephone: FormFieldSetting;
    companyName: FormFieldSetting;
    jobTitle: FormFieldSetting;
    industry: FormFieldSetting;
    companySize: FormFieldSetting;
    country: FormFieldSetting;
    city: FormFieldSetting;
    address: FormFieldSetting;
    postalCode: FormFieldSetting;
    optInMarketing: FormFieldSetting;
    optInPartner: FormFieldSetting;
    [key: string]: FormFieldSetting;
  };
}

export const defaultGatedFormConfig: GatedFormConfig = {
  headerTitle: "GET IT NOW!",
  subtitle: "Instant Access • Verified Research",
  submitButtonText: "DOWNLOAD NOW! →",
  metaBar: {
    showCategory: true,
    showFormat: true,
    showAccessBadge: true,
    defaultAccessBadgeText: "Enterprise Research",
    showDownloadCount: true,
    downloadsSuffix: "Downloads",
  },
  downloadAsset: {
    fileType: "auto-pdf",
    fileUrl: "",
    fileName: "",
    downloadContent: "",
  },
  fields: {
    firstName: { id: "firstName", label: "First Name", enabled: true, required: true },
    lastName: { id: "lastName", label: "Last Name", enabled: true, required: true },
    email: { id: "email", label: "Corporate Email", enabled: true, required: true },
    telephone: { id: "telephone", label: "Telephone", enabled: true, required: true },
    companyName: { id: "companyName", label: "Company Name", enabled: true, required: true },
    jobTitle: { id: "jobTitle", label: "Job Title", enabled: true, required: true },
    industry: { id: "industry", label: "Industry", enabled: true, required: true },
    companySize: { id: "companySize", label: "Company Size", enabled: true, required: true },
    country: { id: "country", label: "Country", enabled: true, required: true },
    city: { id: "city", label: "City", enabled: true, required: true },
    address: { id: "address", label: "Address", enabled: true, required: true },
    postalCode: { id: "postalCode", label: "Postal Code", enabled: true, required: true },
    optInMarketing: {
      id: "optInMarketing",
      label: "I would like to receive information from suppliers sponsoring this content and willing to share the information above with OnDot Media.",
      enabled: true,
      required: false,
      type: "checkbox",
      group: "Consent",
      hint: "Supplier & Sponsor Communications",
    },
    optInPartner: {
      id: "optInPartner",
      label: "By checking this box, I agree that OnDot Media can share my data with Partners so that Partners can contact me by email or phone and provide more information about this content.",
      enabled: true,
      required: false,
      type: "checkbox",
      group: "Consent",
      hint: "Partner Data Sharing Consent",
    },
  },
};

export const ALL_RESOURCE_CATEGORIES = [
  "Enterprise Technology",
  "AI & Decision Intelligence",
  "Cloud & Infrastructure",
  "B2B Technology",
  "Cybersecurity",
  "Sales Development",
  "Marketing Operations",
  "ABM & Demand Generation",
  "Revenue Operations",
  "Buyer Insights",
  "Whitepaper",
  "Playbook",
  "Industry Report",
];

export const getCategoryDefaultFormConfig = (category?: string): GatedFormConfig => {
  if (!category || category === "GLOBAL") {
    return JSON.parse(JSON.stringify(defaultGatedFormConfig));
  }

  const base: GatedFormConfig = JSON.parse(JSON.stringify(defaultGatedFormConfig));

  const categoryPresets: Record<
    string,
    {
      headerTitle: string;
      subtitle: string;
      submitButtonText: string;
      accessBadge: string;
      disabledFields?: (keyof GatedFormConfig["fields"])[];
    }
  > = {
    "Enterprise Technology": {
      headerTitle: "GET ENTERPRISE BRIEF!",
      subtitle: "Instant Access • Enterprise Architecture Research",
      submitButtonText: "DOWNLOAD ENTERPRISE BRIEF →",
      accessBadge: "Enterprise Research",
    },
    "AI & Decision Intelligence": {
      headerTitle: "ACCESS AI INTELLIGENCE!",
      subtitle: "Verified AI & Decision Science Benchmark",
      submitButtonText: "DOWNLOAD AI REPORT →",
      accessBadge: "AI Research Brief",
    },
    "Cloud & Infrastructure": {
      headerTitle: "GET CLOUD ARCHITECTURE GUIDE!",
      subtitle: "Hybrid & Multi-Cloud Infrastructure Research",
      submitButtonText: "DOWNLOAD CLOUD GUIDE →",
      accessBadge: "Cloud Architecture Brief",
    },
    "B2B Technology": {
      headerTitle: "GET IT NOW!",
      subtitle: "Instant Access • B2B Technology Research",
      submitButtonText: "DOWNLOAD NOW! →",
      accessBadge: "Enterprise Research",
    },
    "Cybersecurity": {
      headerTitle: "UNLOCK SECURITY BRIEFING!",
      subtitle: "Zero-Trust & Enterprise Security Intelligence",
      submitButtonText: "DOWNLOAD SECURITY BRIEF →",
      accessBadge: "Security Clearance Brief",
    },
    "Sales Development": {
      headerTitle: "GET THE OUTBOUND PLAYBOOK!",
      subtitle: "Actionable SDR Scripting & Qualification Cadences",
      submitButtonText: "DOWNLOAD PLAYBOOK →",
      accessBadge: "SDR Tactical Playbook",
      disabledFields: ["address", "postalCode", "city"],
    },
    "Marketing Operations": {
      headerTitle: "GET MARCOM BENCHMARK!",
      subtitle: "Enterprise Marketing Operations & MQL Study",
      submitButtonText: "DOWNLOAD MARCOM REPORT →",
      accessBadge: "MarCom Benchmark",
    },
    "ABM & Demand Generation": {
      headerTitle: "GET ABM ARCHITECTURE BLUEPRINT!",
      subtitle: "Account-Based Pipeline & Qualification Guide",
      submitButtonText: "DOWNLOAD ABM BLUEPRINT →",
      accessBadge: "ABM Blueprint",
      disabledFields: ["address", "postalCode"],
    },
    "Revenue Operations": {
      headerTitle: "UNLOCK REVOPS MASTERCLASS!",
      subtitle: "Executive BANT & SQL Pipeline Briefing",
      submitButtonText: "ACCESS MASTERCLASS →",
      accessBadge: "Executive Masterclass",
      disabledFields: ["address", "postalCode", "city"],
    },
    "Buyer Insights": {
      headerTitle: "GET BUYER INSIGHTS REPORT!",
      subtitle: "Verified Enterprise Committee Purchasing Data",
      submitButtonText: "DOWNLOAD BUYER INSIGHTS →",
      accessBadge: "Buyer Intelligence",
    },
    "Whitepaper": {
      headerTitle: "GET TECHNICAL WHITEPAPER!",
      subtitle: "Peer-Reviewed Enterprise Technical Research",
      submitButtonText: "DOWNLOAD WHITEPAPER →",
      accessBadge: "Verified Whitepaper",
    },
    "Playbook": {
      headerTitle: "GET OPERATIONAL PLAYBOOK!",
      subtitle: "Step-by-Step Revenue Execution Framework",
      submitButtonText: "DOWNLOAD PLAYBOOK →",
      accessBadge: "Execution Playbook",
      disabledFields: ["address", "postalCode"],
    },
    "Industry Report": {
      headerTitle: "GET 2026 INDUSTRY REPORT!",
      subtitle: " Comprehensive B2B Market & Pipeline Benchmark",
      submitButtonText: "DOWNLOAD INDUSTRY REPORT →",
      accessBadge: "Industry Benchmark",
    },
  };

  const preset = categoryPresets[category];
  if (preset) {
    base.headerTitle = preset.headerTitle;
    base.subtitle = preset.subtitle;
    base.submitButtonText = preset.submitButtonText;
    base.metaBar.defaultAccessBadgeText = preset.accessBadge;
    if (preset.disabledFields) {
      preset.disabledFields.forEach((fieldKey) => {
        if (base.fields[fieldKey]) {
          base.fields[fieldKey].enabled = false;
          base.fields[fieldKey].required = false;
        }
      });
    }
  }

  return base;
};

const mergeFormConfig = (base: GatedFormConfig, override: any): GatedFormConfig => {
  if (!override) return base;
  const mergedFields: Record<string, FormFieldSetting> = { ...(base.fields as any) };
  if (override.fields) {
    Object.keys(override.fields).forEach((k) => {
      if (override.fields[k]) {
        mergedFields[k] = {
          ...(base.fields[k] || {}),
          ...override.fields[k],
        };
      }
    });
  }
  if (Array.isArray(override.deletedFieldKeys)) {
    override.deletedFieldKeys.forEach((key: string) => {
      delete mergedFields[key];
    });
  }
  return {
    ...base,
    ...override,
    metaBar: {
      ...base.metaBar,
      ...(override.metaBar || {}),
    },
    downloadAsset: {
      ...(base.downloadAsset || defaultGatedFormConfig.downloadAsset!),
      ...(override.downloadAsset || {}),
    },
    fields: mergedFields as any,
  };
};

export const formConfigApi = {
  getAllCategoryMap: (): Record<string, GatedFormConfig> => {
    try {
      const raw = localStorage.getItem("gp_category_form_configs");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("[FormConfig] Error reading category configs:", e);
    }
    return {};
  },

  hasCategoryOverride: (category: string): boolean => {
    if (!category || category === "GLOBAL") return false;
    const map = formConfigApi.getAllCategoryMap();
    return Boolean(map[category]);
  },

  get: (category?: string): GatedFormConfig => {
    try {
      if (category && category !== "GLOBAL") {
        const map = formConfigApi.getAllCategoryMap();
        const catBase = getCategoryDefaultFormConfig(category);
        if (map[category]) {
          return mergeFormConfig(catBase, map[category]);
        }
        // If global was customized and category has no override yet, still provide category preset merged with any global base
        return catBase;
      }

      const saved = localStorage.getItem("gp_download_form_config");
      if (saved) {
        const parsed = JSON.parse(saved);
        return mergeFormConfig(defaultGatedFormConfig, parsed);
      }
    } catch (e) {
      console.warn("[FormConfig] Error reading storage:", e);
    }
    return JSON.parse(JSON.stringify(defaultGatedFormConfig));
  },

  getForResource: (resource?: {
    category?: string;
    type?: string;
    formConfig?: GatedFormConfig | null;
    customFormConfig?: Partial<GatedFormConfig> | null;
  }): GatedFormConfig => {
    // 1. If individual resource has its own specific formConfig, prioritize it directly!
    if ((resource as any)?.formConfig) {
      return mergeFormConfig(defaultGatedFormConfig, (resource as any).formConfig);
    }
    if (resource?.customFormConfig) {
      return mergeFormConfig(defaultGatedFormConfig, resource.customFormConfig);
    }

    const map = formConfigApi.getAllCategoryMap();
    const cat = resource?.category?.trim();
    const type = resource?.type?.trim();

    let resolved: GatedFormConfig;
    // 2. Check if the exact category has a saved admin override
    if (cat && map[cat]) {
      resolved = mergeFormConfig(getCategoryDefaultFormConfig(cat), map[cat]);
    } else if (type && map[type]) {
      // 3. Check if the resource type (e.g. Whitepaper, Buyer Insights) has a saved admin override
      resolved = mergeFormConfig(getCategoryDefaultFormConfig(type), map[type]);
    } else if (cat) {
      // 4. Otherwise use the category's default configuration
      resolved = getCategoryDefaultFormConfig(cat);
    } else {
      // 5. Fallback to global config
      resolved = formConfigApi.get("GLOBAL");
    }

    return resolved;
  },

  getForCaseStudy: (study?: {
    formConfig?: GatedFormConfig | null;
  }): GatedFormConfig => {
    if (study?.formConfig) {
      return mergeFormConfig(defaultGatedFormConfig, study.formConfig);
    }
    // Default clean B2B form for case studies
    return {
      ...defaultGatedFormConfig,
      headerTitle: "DOWNLOAD CASE STUDY BLUEPRINT",
      subtitle: "Verified Lead Generation & Pipeline Benchmark",
      submitButtonText: "DOWNLOAD NOW! →",
      fields: {
        ...defaultGatedFormConfig.fields,
        firstName: { id: "firstName", label: "First Name", enabled: true, required: true },
        lastName: { id: "lastName", label: "Last Name", enabled: true, required: true },
        email: { id: "email", label: "Corporate Work Email", enabled: true, required: true },
        companyName: { id: "companyName", label: "Company Name", enabled: true, required: true },
        jobTitle: { id: "jobTitle", label: "Job Title", enabled: true, required: false },
        telephone: { id: "telephone", label: "Telephone", enabled: false, required: false },
        industry: { id: "industry", label: "Industry", enabled: false, required: false },
        companySize: { id: "companySize", label: "Company Size", enabled: false, required: false },
        country: { id: "country", label: "Country", enabled: false, required: false },
        city: { id: "city", label: "City", enabled: false, required: false },
        address: { id: "address", label: "Address", enabled: false, required: false },
        postalCode: { id: "postalCode", label: "Postal Code", enabled: false, required: false },
        optInMarketing: {
          id: "optInMarketing",
          label: "I would like to receive information from suppliers sponsoring this content and willing to share the information above with OnDot Media.",
          enabled: false,
          required: false,
          type: "checkbox",
          group: "Consent",
        },
        optInPartner: {
          id: "optInPartner",
          label: "By checking this box, I agree that OnDot Media can share my data with Partners so that Partners can contact me by email or phone and provide more information about this content.",
          enabled: false,
          required: false,
          type: "checkbox",
          group: "Consent",
        },
      },
    };
  },

  save: (config: GatedFormConfig, category?: string): GatedFormConfig => {
    try {
      if (category && category !== "GLOBAL") {
        const map = formConfigApi.getAllCategoryMap();
        map[category] = config;
        localStorage.setItem("gp_category_form_configs", JSON.stringify(map));
      } else {
        localStorage.setItem("gp_download_form_config", JSON.stringify(config));
      }
      window.dispatchEvent(new Event("gp_form_config_updated"));
    } catch (e) {
      console.warn("[FormConfig] Error saving storage:", e);
    }
    return config;
  },

  saveToAllCategories: (config: GatedFormConfig): GatedFormConfig => {
    try {
      localStorage.setItem("gp_download_form_config", JSON.stringify(config));
      const map = formConfigApi.getAllCategoryMap();
      ALL_RESOURCE_CATEGORIES.forEach((cat) => {
        map[cat] = JSON.parse(JSON.stringify(config));
      });
      localStorage.setItem("gp_category_form_configs", JSON.stringify(map));
      window.dispatchEvent(new Event("gp_form_config_updated"));
    } catch (e) {
      console.warn("[FormConfig] Error applying to all categories:", e);
    }
    return config;
  },

  reset: (category?: string): GatedFormConfig => {
    try {
      if (category && category !== "GLOBAL") {
        const map = formConfigApi.getAllCategoryMap();
        delete map[category];
        localStorage.setItem("gp_category_form_configs", JSON.stringify(map));
        window.dispatchEvent(new Event("gp_form_config_updated"));
        return getCategoryDefaultFormConfig(category);
      }

      localStorage.removeItem("gp_download_form_config");
      localStorage.removeItem("gp_category_form_configs");
      window.dispatchEvent(new Event("gp_form_config_updated"));
    } catch (e) {
      console.warn("[FormConfig] Error resetting storage:", e);
    }
    return JSON.parse(JSON.stringify(defaultGatedFormConfig));
  },
};

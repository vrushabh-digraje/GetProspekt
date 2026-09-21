import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";
import User from "./models/User.js";
import Article from "./models/Article.js";
import CaseStudy from "./models/CaseStudy.js";
import Resource from "./models/Resource.js";
import Newsletter from "./models/Newsletter.js";
import Enquiry from "./models/Enquiry.js";

// Prevent Windows Node.js querySrv ECONNREFUSED issue with Atlas SRV records
try {
  dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
} catch (e) {
  // Ignore if not permitted
}

dotenv.config();

const initialArticles = [
  {
    slug: "better-pipeline-starts-with-better-decisions",
    category: "B2B Lead Generation",
    title: "Better pipeline starts with better decisions.",
    author: "GETprospeKt",
    date: "Sep 10, 2026",
    description: "GETprospeKt is a B2B lead-generation partner helping marketing teams turn their target market into qualified leads — at the qualification level their business requires.",
    heroImage: "https://plus.unsplash.com/premium_photo-1661340603772-1ae4ff9afcb1?q=80&w=1472&auto=format&fit=crop",
    intro: "Every revenue leader knows that volume without qualification simply creates noise. Discover how structured lead generation transforms your pipeline.",
    sections: [
      {
        heading: "The Challenge of Unqualified Pipeline",
        paragraphs: [
          "Sales teams waste countless hours chasing leads that lack budget, authority, or genuine purchase intent.",
          "By implementing rigorous upfront qualification, marketing and sales teams align on high-probability opportunities."
        ]
      }
    ]
  },
  {
    slug: "human-verified-data",
    category: "Lead-Generation Solution",
    title: "Human-Verified Data",
    author: "GETprospeKt",
    date: "Sep 10, 2026",
    description: "Prospect data manually reviewed and verified for accuracy, completeness and recency.",
    heroImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=90",
    intro: "Automated scrapers degrade quickly. Human-verified research ensures your outreach reaches the right individuals at active companies.",
    sections: [
      {
        heading: "Why Human Verification Wins",
        paragraphs: [
          "Job titles change, companies reorganize, and email patterns evolve. Human researchers verify current employment and direct contact details before outreach begins."
        ]
      }
    ]
  },
  {
    slug: "mql-generation",
    category: "Lead-Generation Solution",
    title: "MQL Generation",
    author: "GETprospeKt",
    date: "Sep 10, 2026",
    description: "Marketing-qualified leads generated and qualified against your agreed criteria.",
    heroImage: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=90",
    sections: [
      {
        heading: "Criteria-Driven Qualification",
        paragraphs: [
          "MQLs should represent real engagement from defined target accounts. Our multi-channel campaigns ensure fit and interest before handoff."
        ]
      }
    ]
  },
  {
    slug: "sql-generation",
    category: "Lead-Generation Solution",
    title: "SQL Generation",
    author: "GETprospeKt",
    date: "Sep 10, 2026",
    description: "Sales-qualified leads that meet your agreed fit, need and sales-readiness criteria.",
    heroImage: "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=1600&q=90",
    sections: [
      {
        heading: "Sales-Ready Prospects",
        paragraphs: [
          "SQLs are decision-makers who have explicitly confirmed their need, timeline, and interest in speaking with your sales team."
        ]
      }
    ]
  },
  {
    slug: "bant-qualified-leads",
    category: "Lead-Generation Solution",
    title: "BANT-Qualified Leads",
    author: "GETprospeKt",
    date: "Sep 10, 2026",
    description: "Leads qualified against Budget, Authority, Need and Timing.",
    heroImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=90",
    sections: [
      {
        heading: "The Gold Standard of Qualification",
        paragraphs: [
          "BANT criteria ensure that sales reps engage only when budget is allocated, decision authority is verified, a distinct need exists, and a clear purchase timeline is established."
        ]
      }
    ]
  }
];

const initialCaseStudies = [
  {
    slug: "webinar-registrations-ai-business-process",
    label: "Case Study 1",
    title: "Targeted Outreach for an AI and Business-Process Webinar",
    description: "A US-focused webinar organizer targeting technology decision-makers needed high-quality registrations from a defined audience. GETprospeKt identified and engaged 1,500+ prospects matching the target specification, resulting in 192 webinar registrations and 23 attendees, with a 12% attendance rate.",
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=90",
    stats: [["1,500+", "Prospects identified and engaged"], ["192", "Webinar registrations"], ["23", "Attendees"], ["12%", "Attendance rate"]],
    profile: "Organizer of a US-focused webinar on AI in business processes, targeting technology professionals in managerial and senior-level roles.",
    objective: "Generate high-quality webinar registrations from a defined audience of technology decision-makers and influencers, not generic traffic.",
    spec: ["Audience: Technology professionals in the United States", "Seniority: Managerial and senior-level contacts", "Company size: 500+ employees", "Industries: Finance, manufacturing, retail, hospitality"],
    executed: ["Identified and reviewed prospects against agreed specification", "Ran personalized email outreach focused on core webinar topic", "Executed sequential follow-up through email and tele-calling"],
    owned: "Prospect identification, outreach, follow-up, and registration generation.",
    client: "Event experience, content delivery, and attendee follow-up."
  },
  {
    slug: "bant-lead-generation-enterprise-automation",
    label: "Case Study 2",
    title: "Targeted BANT Lead Generation for an Enterprise Automation Platform",
    description: "A global software company needed BANT-qualified leads over three months to feed their US sales team. GETprospeKt identified and qualified Technology and Marketing decision-makers using tele-calling, delivering 125 BANT-qualified leads across CIOs, CTOs, CMOs, and Marketing/IT Directors.",
    image: "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=1600&q=90",
    stats: [["125", "BANT-qualified leads delivered"], ["USA", "Geography"], ["3 months", "Campaign duration"], ["BANT", "Budget, Authority, Need, Timing verified"]],
    profile: "A global software company offering an enterprise automation platform designed for organizations seeking to improve workflow productivity.",
    objective: "Generate 125 BANT-qualified leads over a three-month campaign from a defined audience of Technology and Marketing decision-makers in the USA.",
    spec: ["Geography: USA", "Company size: 250+ employees", "Lead type: BANT-qualified leads", "Outreach channel: Tele-calling"],
    executed: ["Identified and researched Technology and Marketing decision-makers", "Executed targeted tele-calling", "Applied agreed BANT qualification criteria"],
    owned: "Prospect identification, audience matching, tele-calling, and BANT qualification.",
    client: "Sales follow-up after lead handoff."
  },
  {
    slug: "cloud-security-enterprise-lead-generation",
    label: "Case Study 3",
    title: "Enterprise Pipeline Growth for Cloud Security Solutions",
    description: "A premier cybersecurity provider needed direct access to CISOs and Security Directors in Fortune 1000 organizations. GETprospeKt generated 85 high-intent MQLs and 34 verified SQLs within a 60-day campaign.",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1600&q=90",
    stats: [["85", "Targeted MQLs generated"], ["34", "Sales-Ready SQLs"], ["60 Days", "Campaign duration"], ["Fortune 1000", "Target tier"]],
    profile: "Next-generation cloud security and compliance platform provider.",
    objective: "Engage senior enterprise security leadership across North America.",
    spec: ["Audience: CISOs, VP Information Security", "Company size: 1,000+ employees", "Industries: Financial Services, Healthcare, Technology"],
    executed: ["Multi-touch tele-calling and personalized executive email outreach", "Strict validation of current security stack and renewal timelines"],
    owned: "Account discovery, contact verification, and qualification handoff.",
    client: "Technical demonstrations and deal closing."
  }
];

const initialResources = [
  {
    title: "2026 Enterprise B2B Pipeline Benchmark Report",
    type: "Industry Report",
    category: "B2B Technology",
    summary: "In-depth research on conversion rates, qualification criteria, and lead acquisition costs across 500+ enterprise software companies.",
  },
  {
    title: "The Definitive B2B Outbound Playbook: Qualification & Scripting",
    type: "Playbook",
    category: "Enterprise Technology",
    summary: "A step-by-step operational playbook covering multi-touch outreach cadence, gatekeeper navigation, and objection handling for high-ticket solutions.",
  },
  {
    title: "Modern Lead Qualification Architecture: MQL to SQL Transition",
    type: "Whitepaper",
    category: "Cloud",
    summary: "Technical and strategic analysis of lead scoring algorithms, behavioral intent data, and criteria-driven qualification handoffs.",
  },
  {
    title: "Enterprise Buyer Intent Signals & Purchasing Cycles",
    type: "Buyer Insights",
    category: "AI",
    summary: "Understanding modern procurement behavior, multi-stakeholder consensus, and evaluation criteria for enterprise technology adoptions.",
  },
];

const initialNewsletters = [
  {
    title: "The B2B Pipeline Dispatch - Issue #1",
    issueNumber: 1,
    frequency: "Weekly",
    summary: "How modern CMOs are structuring their sales development and demand-gen teams for maximum efficiency in 2026.",
  },
  {
    title: "Enterprise Tech Intelligence - Issue #2",
    issueNumber: 2,
    frequency: "Weekly",
    summary: "Quarterly breakdown of enterprise tech spending trends, budget allocations, and key procurement timelines.",
  },
  {
    title: "Monthly B2B Pipeline Executive Review",
    issueNumber: 3,
    frequency: "Monthly",
    summary: "Strategic perspectives on sales-marketing alignment, pipeline hygiene, and high-conversion outbound strategies.",
  },
];

const initialEnquiries = [
  {
    firstName: "Sarah",
    lastName: "Jenkins",
    email: "sarah.jenkins@apexcloud.io",
    company: "Apex Cloud Systems",
    subject: "BANT-Qualified Leads",
    message: "We are planning a Q4 push for our cloud migration suite and need 50+ BANT-qualified enterprise leads. Can we schedule a brief discovery call?",
    status: "New",
  },
  {
    firstName: "Michael",
    lastName: "Chen",
    email: "m.chen@novasaas.com",
    company: "Nova SaaS Inc.",
    subject: "Case Study Inquiry",
    message: "Saw your case study on the AI business process webinar. We have a similar campaign coming up and would like to discuss registration and attendee outreach.",
    status: "Read",
  },
  {
    firstName: "Elena",
    lastName: "Rostova",
    email: "elena@cyberfortress.net",
    company: "CyberFortress Security",
    subject: "General Inquiry",
    message: "Interested in your human-verified prospect data for our cybersecurity SDR team. Looking for coverage in the UK and European markets.",
    status: "Replied",
  },
];

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/getprospekt";
    await mongoose.connect(mongoUri);
    console.log("[Seeder] Connected to MongoDB");

    // Seed Admin User
    const existingAdmin = await User.findOne({ email: "admin@getprospekt.co" });
    if (!existingAdmin) {
      await User.create({
        name: "Super Admin",
        email: "admin@getprospekt.co",
        password: "admin123",
        role: "admin",
      });
      console.log("[Seeder] Default admin user created: admin@getprospekt.co / admin123");
    } else {
      console.log("[Seeder] Admin user already exists");
    }

    // Seed Articles
    for (const item of initialArticles) {
      await Article.findOneAndUpdate({ slug: item.slug }, item, { upsert: true, new: true });
    }
    console.log(`[Seeder] Articles seeded (${initialArticles.length} items)`);

    // Seed Case Studies
    for (const item of initialCaseStudies) {
      await CaseStudy.findOneAndUpdate({ slug: item.slug }, item, { upsert: true, new: true });
    }
    console.log(`[Seeder] Case Studies seeded (${initialCaseStudies.length} items)`);

    // Seed Resources
    for (const item of initialResources) {
      await Resource.findOneAndUpdate({ title: item.title }, item, { upsert: true, new: true });
    }
    console.log(`[Seeder] Resources seeded (${initialResources.length} items)`);

    // Seed Newsletters
    for (const item of initialNewsletters) {
      await Newsletter.findOneAndUpdate({ title: item.title }, item, { upsert: true, new: true });
    }
    console.log(`[Seeder] Newsletters seeded (${initialNewsletters.length} items)`);

    // Seed Enquiries
    for (const item of initialEnquiries) {
      const exists = await Enquiry.findOne({ email: item.email, subject: item.subject });
      if (!exists) {
        await Enquiry.create(item);
      }
    }
    console.log(`[Seeder] Enquiries seeded (${initialEnquiries.length} items)`);

    console.log("[Seeder] Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("[Seeder Error]:", error);
    process.exit(1);
  }
};

seedData();

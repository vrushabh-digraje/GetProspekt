import EditorialCoverImage from "../components/EditorialCoverImage";
import { useState } from "react";

type Speaker = {
  name: string;
  role: string;
  company: string;
  image: string;
};

type EventItem = {
  id: string;
  title: string;
  hostNetwork: string;
  networkBadge: string;
  accentColor: string;
  format: "Virtual Summit" | "Executive Roundtable" | "Live Masterclass" | "On-Demand Briefing";
  date: string;
  time: string;
  status: "upcoming" | "past";
  image: string;
  description: string;
  keyTopics: string[];
  speakers: Speaker[];
  agenda: { timeSlot: string; topic: string; speakerName: string }[];
};

const eventsList: EventItem[] = [
  {
    id: "evt-1",
    title: "Global Cyber Defense & AI Threat Intelligence Virtual Summit 2026",
    hostNetwork: "GETprospeKt Cybersecurity",
    networkBadge: "Cybersecurity",
    accentColor: "#00D2FF",
    format: "Virtual Summit",
    date: "November 12, 2026",
    time: "10:00 AM - 2:30 PM EST",
    status: "upcoming",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=90",
    description:
      "Join 1,200+ global CISOs, threat intelligence analysts, and cloud defense engineers for a deep-dive summit on modern cyber extortion mitigation, memory poisoning in AI agents, and runtime cloud vulnerability prioritization.",
    keyTopics: [
      "Halting lateral movement across hybrid Active Directory perimeters",
      "Memory poisoning & indirect prompt injection defense in enterprise LLMs",
      "Securing non-human machine identities, microservices, and container clusters",
      "Autonomous SOC alert triage and mean time to containment benchmarks",
    ],
    speakers: [
      {
        name: "Jyotsna Iyer",
        role: "Chief Information Security Officer",
        company: "Global Cyber Research Labs",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=85",
      },
      {
        name: "Ari Eitan",
        role: "VP of Cloud Workload Security",
        company: "Runtime Defense Systems",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=85",
      },
    ],
    agenda: [
      { timeSlot: "10:00 - 10:45 AM", topic: "Keynote: Threat Intelligence Landscape 2026", speakerName: "Jyotsna Iyer" },
      { timeSlot: "11:00 - 11:45 AM", topic: "Runtime CNAPP Architecture vs. Static Scanners", speakerName: "Ari Eitan" },
      { timeSlot: "01:00 - 02:00 PM", topic: "Executive Panel: Boardroom Cyber Risk Reporting", speakerName: "Both Keynote Leaders" },
    ],
  },
  {
    id: "evt-2",
    title: "First-Party Data Activation & CDP Modernization Executive Roundtable",
    hostNetwork: "GETprospeKt MarTech",
    networkBadge: "MarTech & Growth",
    accentColor: "#FF6B6B",
    format: "Executive Roundtable",
    date: "November 19, 2026",
    time: "1:00 PM - 3:00 PM EST",
    status: "upcoming",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=90",
    description:
      "A closed-door executive roundtable for Heads of Marketing Operations, CMOs, and Enterprise Data Architects on unifying fragmented martech stacks, cookieless identity resolution, and continuous buyer intent scoring.",
    keyTopics: [
      "Cross-border consent frameworks and zero-party data acquisition",
      "Consolidating disjointed CDP, CRM, and marketing automation silos",
      "Real-time pipeline orchestration and B2B buying committee mapping",
      "AI-driven predictive churn scoring and customer lifetime value",
    ],
    speakers: [
      {
        name: "Nick Henthorn",
        role: "VP of Marketing Technology & Data",
        company: "OmniReach Intelligence",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=85",
      },
      {
        name: "Elena Rostova",
        role: "Chief Revenue & Strategy Officer",
        company: "Enterprise Growth Group",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=85",
      },
    ],
    agenda: [
      { timeSlot: "01:00 - 01:30 PM", topic: "The Death of Third-Party Cookies: 2026 Reality Check", speakerName: "Nick Henthorn" },
      { timeSlot: "01:35 - 02:15 PM", topic: "Live CDP Architectural Teardown & Intent Modeling", speakerName: "Nick Henthorn & Elena Rostova" },
      { timeSlot: "02:20 - 03:00 PM", topic: "Interactive Q&A: Allocating 2027 MarTech Capital", speakerName: "Elena Rostova" },
    ],
  },
  {
    id: "evt-3",
    title: "Platform Engineering, SBOM & Cloud Supply Chain Security Masterclass",
    hostNetwork: "GETprospeKt DevOps",
    networkBadge: "DevOps & Engineering",
    accentColor: "#4E97FD",
    format: "Live Masterclass",
    date: "December 3, 2026",
    time: "11:00 AM - 1:30 PM EST",
    status: "upcoming",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=90",
    description:
      "Engineering leaders and DevOps architects examine how to enforce automated Software Bills of Materials (SBOMs), build signed software supply chains, and automate container security without hindering developer velocity.",
    keyTopics: [
      "Automated open-source package vulnerability scanning in GitHub Actions & GitLab CI",
      "Cryptographic artifact signing and Sigstore verification policies",
      "Self-service internal developer platforms (IDP) and golden paths",
      "Eliminating secret sprawl across Kubernetes secrets and Terraform manifests",
    ],
    speakers: [
      {
        name: "Marcus Vance",
        role: "Head of Developer Platform Architecture",
        company: "CloudNative Core Labs",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=85",
      },
    ],
    agenda: [
      { timeSlot: "11:00 - 11:45 AM", topic: "Modern Dependency Hijacking Attack Vectors", speakerName: "Marcus Vance" },
      { timeSlot: "12:00 - 12:45 PM", topic: "Hands-on Lab: Enforcing Signed Artifact Policies", speakerName: "Marcus Vance" },
      { timeSlot: "12:50 - 01:30 PM", topic: "Platform Engineering Metrics: DORA vs. Security", speakerName: "Marcus Vance" },
    ],
  },
  {
    id: "evt-4",
    title: "Next-Gen Fraud Detection & Machine Identity Governance in Banking",
    hostNetwork: "GETprospeKt FinTech",
    networkBadge: "FinTech & Banking",
    accentColor: "#00E5A3",
    format: "Virtual Summit",
    date: "December 10, 2026",
    time: "10:30 AM - 2:00 PM EST",
    status: "upcoming",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=90",
    description:
      "Addressing the explosive rise of token hijacking, adversary-in-the-middle phishing against banking APIs, and synthetic identity generation across financial institutions.",
    keyTopics: [
      "Preventing OAuth token exfiltration and session replay in open banking",
      "Behavioral biometrics and transaction telemetry for fraud prevention",
      "Automated compliance with DORA, FFIEC, and PCI-DSS 4.0 standards",
      "Zero Trust architectures for core banking microservice interconnections",
    ],
    speakers: [
      {
        name: "David Sterling",
        role: "Chief Information Security Officer",
        company: "Apex Commercial Bank",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=85",
      },
    ],
    agenda: [
      { timeSlot: "10:30 - 11:30 AM", topic: "Financial Crime & API Attack Surfaces in 2026", speakerName: "David Sterling" },
      { timeSlot: "11:45 - 12:45 PM", topic: "Continuous Token Binding and Post-Quantum Prep", speakerName: "David Sterling" },
      { timeSlot: "01:00 - 02:00 PM", topic: "Bank Executive Panel: Incident Containment Stories", speakerName: "David Sterling" },
    ],
  },
  {
    id: "evt-5",
    title: "2026 Enterprise Technology Leadership & Vendor Consolidation Symposium",
    hostNetwork: "GETprospeKt Leadership",
    networkBadge: "Enterprise Leadership",
    accentColor: "#FFAE33",
    format: "Executive Roundtable",
    date: "January 14, 2027",
    time: "1:00 PM - 4:00 PM EST",
    status: "upcoming",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=90",
    description:
      "Fortune 1000 CIOs and CTOs share strategies on rationalizing SaaS portfolios, eliminating redundant cybersecurity point solutions, and establishing board-level AI governance.",
    keyTopics: [
      "Consolidating 40+ security vendors down to 4 foundational platforms",
      "Total Cost of Ownership (TCO) benchmarks for hybrid multi-cloud",
      "Operationalizing NIST AI Risk Management Framework",
      "Structuring cross-functional buying committees for software renewals",
    ],
    speakers: [
      {
        name: "Elena Rostova",
        role: "Chief Information Officer",
        company: "Global Enterprise Technology Council",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=85",
      },
    ],
    agenda: [
      { timeSlot: "01:00 - 02:00 PM", topic: "SaaS Rationalisation: Cutting 30% Without Compromise", speakerName: "Elena Rostova" },
      { timeSlot: "02:15 - 03:00 PM", topic: "Vendor Negotiation Tactics for Enterprise Buyers", speakerName: "Elena Rostova" },
      { timeSlot: "03:15 - 04:00 PM", topic: "Boardroom Technology Risk Scorecard Review", speakerName: "Elena Rostova" },
    ],
  },
  {
    id: "evt-6",
    title: "Autonomous SOC Triage: Slashing Mean Time to Detect from Hours to Seconds",
    hostNetwork: "GETprospeKt Cybersecurity",
    networkBadge: "Cybersecurity",
    accentColor: "#00D2FF",
    format: "Live Masterclass",
    date: "January 21, 2027",
    time: "2:00 PM - 3:30 PM EST",
    status: "upcoming",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=90",
    description:
      "A hands-on technical masterclass detailing how Tier-1 SOC analysts eliminate alert fatigue using autonomous generative triage assistants and structured playbooks.",
    keyTopics: [
      "Correlating multi-source SIEM and EDR telemetry automatically",
      "Reducing 10,000 daily alerts to 12 high-confidence incidents",
      "Designing human-in-the-loop validation for automated containment",
      "Preventing analyst burnout and lowering Tier-1 turnover",
    ],
    speakers: [
      {
        name: "Ahmed Achchak",
        role: "Director of Threat Hunting & SOC Ops",
        company: "Autonomous SecOps Institute",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=85",
      },
    ],
    agenda: [
      { timeSlot: "02:00 - 02:40 PM", topic: "Root Cause of SOC Alert Fatigue in 2026", speakerName: "Ahmed Achchak" },
      { timeSlot: "02:45 - 03:15 PM", topic: "Live Triage Architecture: From Detection to Containment", speakerName: "Ahmed Achchak" },
      { timeSlot: "03:15 - 03:30 PM", topic: "Open Q&A and Deployment Checklist", speakerName: "Ahmed Achchak" },
    ],
  },
  {
    id: "evt-7",
    title: "Account-Based Intelligence & Multi-Channel Pipeline Orchestration Briefing",
    hostNetwork: "GETprospeKt MarTech",
    networkBadge: "MarTech & Growth",
    accentColor: "#FF6B6B",
    format: "On-Demand Briefing",
    date: "September 24, 2026",
    time: "Recorded (62 mins)",
    status: "past",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=90",
    description:
      "An executive recording examining how revenue teams synchronize verified CISO account intelligence with multi-touch outbound cadences to accelerate complex enterprise pipeline.",
    keyTopics: [
      "Mapping the 8+ stakeholder personas in B2B cybersecurity buying committees",
      "Combining intent data with human-verified telephone qualification",
      "Account tiering formulas that maximize Sales Qualified Leads (SQLs)",
      "Calculating actual customer acquisition cost (CAC) payback periods",
    ],
    speakers: [
      {
        name: "GETprospeKt Editorial",
        role: "Enterprise Demand Strategists",
        company: "GETprospeKt Research",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=85",
      },
    ],
    agenda: [
      { timeSlot: "Part 1 (20m)", topic: "The Anatomy of 2026 Enterprise Buying Committees", speakerName: "GETprospeKt Research" },
      { timeSlot: "Part 2 (25m)", topic: "Intent-Led vs. Cold Outbound: Real Case Benchmark", speakerName: "GETprospeKt Research" },
      { timeSlot: "Part 3 (17m)", topic: "Closing the Loop: Sales and Marketing SLA Framework", speakerName: "GETprospeKt Research" },
    ],
  },
  {
    id: "evt-8",
    title: "Zero-Click Exploit Defense & Runtime Workload Protection Technical Summit",
    hostNetwork: "GETprospeKt DevOps",
    networkBadge: "DevOps & Engineering",
    accentColor: "#4E97FD",
    format: "On-Demand Briefing",
    date: "September 15, 2026",
    time: "Recorded (90 mins)",
    status: "past",
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=90",
    description:
      "In-depth architectural recording on isolating container escapes, detecting kernel-level rootkits, and shrinking vulnerability remediation windows across Kubernetes clusters.",
    keyTopics: [
      "eBPF-powered real-time system call monitoring without kernel modules",
      "Defeating fileless memory injection attacks in production nodes",
      "Automated rollback and container isolation policies",
      "Integrating runtime telemetry directly into Jira & Slack workflows",
    ],
    speakers: [
      {
        name: "Ari Eitan",
        role: "VP Cloud Security",
        company: "Runtime Defense Labs",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=85",
      },
    ],
    agenda: [
      { timeSlot: "Part 1 (30m)", topic: "Anatomy of Zero-Click Exploits in Container Clouds", speakerName: "Ari Eitan" },
      { timeSlot: "Part 2 (35m)", topic: "Live Demo: eBPF Real-Time Isolation in Kubernetes", speakerName: "Ari Eitan" },
      { timeSlot: "Part 3 (25m)", topic: "Implementation Checklist for Security Engineers", speakerName: "Ari Eitan" },
    ],
  },
  {
    id: "evt-9",
    title: "Token Security, Session Integrity & Open Banking API Defense",
    hostNetwork: "GETprospeKt FinTech",
    networkBadge: "FinTech & Banking",
    accentColor: "#00E5A3",
    format: "On-Demand Briefing",
    date: "August 28, 2026",
    time: "Recorded (75 mins)",
    status: "past",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=90",
    description:
      "A technical retrospective on preventing credential stuffing, mitigating credential replay in OAuth2 flows, and securing machine-to-machine financial endpoints.",
    keyTopics: [
      "OAuth 2.1 and FAPI (Financial-grade API) hardening best practices",
      "Mutual TLS (mTLS) and non-exportable hardware private keys",
      "Session cookie theft mitigation against Infostealer trojans",
      "Real-time fraud scoring for automated clearing house (ACH) transfers",
    ],
    speakers: [
      {
        name: "Greg Keller",
        role: "Chief Technology Strategist",
        company: "Identity Perimeter Security",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=85",
      },
    ],
    agenda: [
      { timeSlot: "Part 1 (25m)", topic: "The Rise of Session Hijacking & Token Replay", speakerName: "Greg Keller" },
      { timeSlot: "Part 2 (30m)", topic: "Hardening Open Banking APIs with FAPI Profiles", speakerName: "Greg Keller" },
      { timeSlot: "Part 3 (20m)", topic: "Continuous Machine Authentication Architecture", speakerName: "Greg Keller" },
    ],
  },
  {
    id: "evt-10",
    title: "Defending Against Shadow AI & Agentic Workflow Vulnerabilities",
    hostNetwork: "GETprospeKt Leadership",
    networkBadge: "Enterprise Leadership",
    accentColor: "#FFAE33",
    format: "On-Demand Briefing",
    date: "August 12, 2026",
    time: "Recorded (80 mins)",
    status: "past",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=90",
    description:
      "Enterprise leadership session examining unapproved LLM adoption, proprietary code leakage to external AI engines, and securing autonomous multi-agent task runners.",
    keyTopics: [
      "Data Loss Prevention (DLP) for enterprise browser interactions with LLMs",
      "Prompt guardrails and context window sanitization",
      "Sandboxing autonomous AI agents with restricted API tokens",
      "Enterprise Acceptable AI Usage Policy template walkthrough",
    ],
    speakers: [
      {
        name: "Gal Moyal",
        role: "Principal AI Security Architect",
        company: "Autonomous Defense Works",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=85",
      },
    ],
    agenda: [
      { timeSlot: "Part 1 (30m)", topic: "The Enterprise Shadow AI Blindspot Explained", speakerName: "Gal Moyal" },
      { timeSlot: "Part 2 (30m)", topic: "Building Agent Guardrails & API Containment Walls", speakerName: "Gal Moyal" },
      { timeSlot: "Part 3 (20m)", topic: "Governance Checklist for CIOs and CISOs", speakerName: "Gal Moyal" },
    ],
  },
];

function Events() {
  const [activeTab, setActiveTab] = useState<"all" | "upcoming" | "past">("all");
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [registeredEvents, setRegisteredEvents] = useState<Record<string, boolean>>({});
  const [regForm, setRegForm] = useState({ name: "", email: "", company: "", role: "" });
  const [regSuccess, setRegSuccess] = useState(false);

  const filteredEvents = eventsList.filter((evt) => {
    if (activeTab === "upcoming" && evt.status !== "upcoming") return false;
    if (activeTab === "past" && evt.status !== "past") return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        evt.title.toLowerCase().includes(q) ||
        evt.description.toLowerCase().includes(q) ||
        evt.hostNetwork.toLowerCase().includes(q) ||
        evt.format.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;
    setRegisteredEvents((prev) => ({ ...prev, [selectedEvent.id]: true }));
    setRegSuccess(true);
    setTimeout(() => {
      setRegSuccess(false);
    }, 4000);
  };

  return (
    <>
      <main className="events-page">
        <div className="events-container">
          {/* HEADER */}
          <div className="events-header">
            <div className="events-header-badge">EDITORIAL BRIEFINGS &amp; SUMMITS</div>
            <h1>Technology Leadership Events &amp; Virtual Briefings</h1>
            <p>
              Curated masterclasses, virtual summits, and executive roundtables hosted across
              our 5 specialist publication channels: <strong>Cybersecurity</strong>,{" "}
              <strong>MarTech & Growth</strong>, <strong>DevOps & Engineering</strong>,{" "}
              <strong>FinTech & Banking</strong>, and <strong>Enterprise Leadership</strong>.
              Click any image or card to open full briefing details and reserve your executive seat.
            </p>
          </div>

          {/* TABS & SEARCH */}
          <div className="events-controls-row">
            <div className="events-tabs" role="tablist">
              <button
                type="button"
                className={`events-tab ${activeTab === "all" ? "active" : ""}`}
                onClick={() => setActiveTab("all")}
              >
                All Events ({eventsList.length})
              </button>
              <button
                type="button"
                className={`events-tab ${activeTab === "upcoming" ? "active" : ""}`}
                onClick={() => setActiveTab("upcoming")}
              >
                Upcoming Events ({eventsList.filter((e) => e.status === "upcoming").length})
              </button>
              <button
                type="button"
                className={`events-tab ${activeTab === "past" ? "active" : ""}`}
                onClick={() => setActiveTab("past")}
              >
                On-Demand Briefings ({eventsList.filter((e) => e.status === "past").length})
              </button>
            </div>

            <div className="events-search-wrap">
              <input
                type="text"
                placeholder="Search topics, networks, or speakers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="events-search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="events-search-clear"
                  onClick={() => setSearchQuery("")}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="events-divider" />

          {/* EVENTS GRID (10 COMPREHENSIVE CARDS) */}
          <div className="events-grid">
            {filteredEvents.map((evt) => {
              const isRegistered = !!registeredEvents[evt.id];
              return (
                <article
                  className="event-card"
                  key={evt.id}
                  onClick={() => setSelectedEvent(evt)}
                >
                  {/* CLICKABLE COVER IMAGE WITH HOVER BADGE */}
                  <div
                    className="event-image-wrap"
                    title="Click image to open full content"
                  >
                    <EditorialCoverImage
                      title={evt.title}
                      subtitle={evt.description}
                      category="Executive Event"
                      photo={evt.image}
                      variant="card"
                    />
                    <span
                      className="event-host-tag"
                      style={{ borderLeftColor: evt.accentColor, zIndex: 6 }}
                    >
                      {evt.networkBadge}
                    </span>
                    <span
                      className={`event-status-pill ${evt.status}`}
                      style={{ zIndex: 6 }}
                    >
                      {evt.status === "upcoming" ? "LIVE UPCOMING" : "ON-DEMAND REPLAY"}
                    </span>
                  </div>

                  {/* CARD BODY */}
                  <div className="event-card-body">
                    <div className="event-meta-row">
                      <span className="event-format-badge">{evt.format}</span>
                      <span className="event-date-text">📅 {evt.date}</span>
                    </div>

                    <h2 className="event-title">{evt.title}</h2>

                    <div className="event-time-pill">
                      <span>⏰ {evt.time}</span>
                    </div>

                    <p className="event-desc">{evt.description}</p>

                    <div className="event-card-footer">
                      <div className="event-speakers-mini">
                        {evt.speakers.map((spk, idx) => (
                          <div className="speaker-pill" key={idx}>
                            <img src={spk.image} alt={spk.name} />
                            <span>{spk.name}</span>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        className={`event-action-btn ${isRegistered ? "registered" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEvent(evt);
                        }}
                      >
                        {isRegistered
                          ? "✓ Access Confirmed"
                          : evt.status === "upcoming"
                          ? "View Briefing & Register →"
                          : "Watch On-Demand →"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {filteredEvents.length === 0 && (
            <div className="events-empty">
              <h2>No events matched your search criteria.</h2>
              <p>Try clearing your search query or selecting a different tab.</p>
            </div>
          )}
        </div>

        {/* ================= FULL EVENT CONTENT MODAL ================= */}
        {selectedEvent && (
          <div
            className="event-modal-backdrop"
            onClick={() => setSelectedEvent(null)}
          >
            <div
              className="event-modal-dialog"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="event-modal-close"
                onClick={() => setSelectedEvent(null)}
                aria-label="Close modal"
              >
                ✕
              </button>

              <div className="event-modal-hero">
                <img src={selectedEvent.image} alt={selectedEvent.title} />
                <div className="event-modal-hero-overlay">
                  <span
                    className="event-host-tag modal-tag"
                    style={{ borderLeftColor: selectedEvent.accentColor }}
                  >
                    {selectedEvent.networkBadge}
                  </span>
                  <h2>{selectedEvent.title}</h2>
                  <div className="event-modal-meta-row">
                    <span>🗓️ {selectedEvent.date}</span>
                    <span>⏰ {selectedEvent.time}</span>
                    <span>📍 Global Virtual Broadcast</span>
                    <span className="format-tag">{selectedEvent.format}</span>
                  </div>
                </div>
              </div>

              <div className="event-modal-body">
                <div className="event-modal-left">
                  <section className="event-modal-section">
                    <h3>Executive Briefing Overview</h3>
                    <p>{selectedEvent.description}</p>
                  </section>

                  <section className="event-modal-section">
                    <h3>Key Discussion Topics &amp; Frameworks</h3>
                    <ul className="event-modal-bullets">
                      {selectedEvent.keyTopics.map((topic, idx) => (
                        <li key={idx}>
                          <span className="check-icon">✓</span>
                          <span>{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section className="event-modal-section">
                    <h3>Featured Keynote Faculty</h3>
                    <div className="event-modal-speakers">
                      {selectedEvent.speakers.map((spk, idx) => (
                        <div className="modal-speaker-card" key={idx}>
                          <img src={spk.image} alt={spk.name} />
                          <div>
                            <h4>{spk.name}</h4>
                            <p className="spk-role">{spk.role}</p>
                            <p className="spk-company">{spk.company}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="event-modal-section">
                    <h3>Event Agenda &amp; Run of Show</h3>
                    <div className="event-agenda-timeline">
                      {selectedEvent.agenda.map((item, idx) => (
                        <div className="timeline-item" key={idx}>
                          <div className="timeline-time">{item.timeSlot}</div>
                          <div className="timeline-content">
                            <strong>{item.topic}</strong>
                            <span>Presenter: {item.speakerName}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                <div className="event-modal-right">
                  <div className="event-register-box">
                    <h3>
                      {selectedEvent.status === "upcoming"
                        ? "Reserve Your Seat"
                        : "Instant On-Demand Access"}
                    </h3>
                    <p>
                      Complimentary access for qualified enterprise executives,
                      directors, and technology practitioners.
                    </p>

                    {registeredEvents[selectedEvent.id] ? (
                      <div className="reg-confirmed-card">
                        <div className="conf-icon">🎉</div>
                        <h4>Registration Confirmed!</h4>
                        <p>
                          Your calendar invite and access credentials have been sent.
                          You also have full access to presentation recordings.
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleRegister} className="event-reg-form">
                        <label>
                          Full Name *
                          <input
                            type="text"
                            required
                            placeholder="e.g. Sarah Jenkins"
                            value={regForm.name}
                            onChange={(e) =>
                              setRegForm({ ...regForm, name: e.target.value })
                            }
                          />
                        </label>

                        <label>
                          Work Email *
                          <input
                            type="email"
                            required
                            placeholder="name@company.com"
                            value={regForm.email}
                            onChange={(e) =>
                              setRegForm({ ...regForm, email: e.target.value })
                            }
                          />
                        </label>

                        <label>
                          Company Name *
                          <input
                            type="text"
                            required
                            placeholder="e.g. GETprospeKt"
                            value={regForm.company}
                            onChange={(e) =>
                              setRegForm({ ...regForm, company: e.target.value })
                            }
                          />
                        </label>

                        <label>
                          Job Title *
                          <input
                            type="text"
                            required
                            placeholder="e.g. VP of Information Security"
                            value={regForm.role}
                            onChange={(e) =>
                              setRegForm({ ...regForm, role: e.target.value })
                            }
                          />
                        </label>

                        <button type="submit" className="event-submit-btn">
                          {selectedEvent.status === "upcoming"
                            ? "Complete Executive Registration →"
                            : "Unlock Instant Replay Video →"}
                        </button>
                      </form>
                    )}

                    {regSuccess && (
                      <div className="reg-toast">
                        ✓ Registered successfully! Confirmation sent.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <style>{`
        * {
          box-sizing: border-box;
        }

        .events-page {
          width: 100%;
          min-height: 800px;
          background: #060B12;
          color: #D5DBE7;
          font-family: var(--font-sans);
          padding: 30px 0 90px;
        }

        .events-container {
          width: min(1380px, calc(100% - 48px));
          margin: 0 auto;
        }

        /* HEADER */
        .events-header {
          margin-bottom: 30px;
        }

        .events-header-badge {
          display: inline-block;
          color: #00D2FF;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.8px;
          margin-bottom: 10px;
        }

        .events-header h1 {
          margin: 0 0 14px;
          font-size: 38px;
          line-height: 1.2;
          font-weight: 800;
          color: #FFFFFF;
        }

        .events-header p {
          margin: 0;
          font-size: 16.5px;
          line-height: 1.6;
          color: #CBD5E1;
          max-width: 980px;
        }

        .events-header p strong {
          color: #00D2FF;
        }

        /* CONTROLS ROW */
        .events-controls-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          margin-top: 24px;
        }

        .events-tabs {
          display: flex;
          align-items: center;
          gap: 8px;
          overflow-x: auto;
          scrollbar-width: none;
        }

        .events-tab {
          border: 1px solid rgba(203, 213, 225, 0.14);
          background: #0D1522;
          color: #AEB8CA;
          padding: 11px 18px;
          border-radius: 6px;
          font-size: 14.5px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s ease;
        }

        .events-tab:hover {
          background: #111C2D;
          color: #FFFFFF;
          border-color: rgba(0, 210, 255, 0.3);
        }

        .events-tab.active {
          background: #0046FC;
          color: #FFFFFF;
          border-color: #00D2FF;
          box-shadow: 0 4px 14px rgba(0, 70, 252, 0.35);
        }

        .events-search-wrap {
          position: relative;
          min-width: 280px;
        }

        .events-search-input {
          width: 100%;
          background: #0D1522;
          border: 1px solid rgba(203, 213, 225, 0.16);
          border-radius: 6px;
          padding: 10px 32px 10px 14px;
          color: #FFFFFF;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s ease;
        }

        .events-search-input:focus {
          border-color: #00D2FF;
          box-shadow: 0 0 10px rgba(0, 210, 255, 0.2);
        }

        .events-search-clear {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: 0;
          color: #94A3B8;
          cursor: pointer;
          font-size: 12px;
        }

        .events-divider {
          width: 100%;
          height: 1px;
          background: rgba(203, 213, 225, 0.12);
          margin: 22px 0 28px;
        }

        /* GRID */
        .events-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 26px;
        }

        .event-card {
          background: #0D1522;
          border: 1px solid rgba(203, 213, 225, 0.12);
          border-radius: 8px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .event-card:hover {
          transform: translateY(-4px);
          border-color: rgba(0, 210, 255, 0.45);
          box-shadow: 0 10px 28px rgba(0, 0, 0, 0.45);
        }

        .event-image-wrap {
          width: 100%;
          height: 230px;
          position: relative;
          overflow: hidden;
          background: #060B12;
        }

        .event-image-wrap img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          transition: transform 0.45s ease;
        }

        .event-card:hover .event-image-wrap img {
          transform: scale(1.05);
        }

        .event-host-tag {
          position: absolute;
          top: 12px;
          left: 12px;
          background: rgba(6, 11, 18, 0.9);
          backdrop-filter: blur(4px);
          color: #FFFFFF;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.5px;
          padding: 4px 9px;
          border-radius: 4px;
          border-left: 3px solid #00D2FF;
        }

        .event-status-pill {
          position: absolute;
          top: 12px;
          right: 12px;
          font-size: 10.5px;
          font-weight: 800;
          letter-spacing: 0.5px;
          padding: 4px 8px;
          border-radius: 4px;
        }

        .event-status-pill.upcoming {
          background: #10B981;
          color: #FFFFFF;
        }

        .event-status-pill.past {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(4px);
          color: #CBD5E1;
        }

        .event-img-hover-badge {
          position: absolute;
          bottom: 12px;
          left: 12px;
          background: rgba(6, 11, 18, 0.9);
          backdrop-filter: blur(6px);
          color: #00D2FF;
          border: 1px solid rgba(0, 210, 255, 0.4);
          border-radius: 5px;
          padding: 5px 10px;
          font-size: 12px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          opacity: 0.85;
          transition: all 0.25s ease;
          pointer-events: none;
        }

        .event-card:hover .event-img-hover-badge {
          opacity: 1;
          background: #0046FC;
          color: #FFFFFF;
          border-color: #00D2FF;
          transform: translateY(-2px);
        }

        .event-card-body {
          padding: 22px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .event-meta-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
          font-size: 13px;
        }

        .event-format-badge {
          color: #00D2FF;
          font-weight: 700;
          text-transform: uppercase;
          font-size: 11.5px;
          letter-spacing: 0.5px;
        }

        .event-date-text {
          color: #CBD5E1;
        }

        .event-title {
          margin: 0 0 10px;
          font-size: 22px;
          line-height: 1.3;
          color: #FFFFFF;
          letter-spacing: -0.2px;
          transition: color 0.2s ease;
        }

        .event-card:hover .event-title {
          color: #00D2FF;
        }

        .event-time-pill {
          display: inline-flex;
          align-items: center;
          color: #94A3B8;
          font-size: 13px;
          margin-bottom: 12px;
        }

        .event-desc {
          margin: 0 0 18px;
          font-size: 15px;
          line-height: 1.55;
          color: #AEB8CA;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          flex: 1;
        }

        .event-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
          gap: 12px;
          padding-top: 14px;
          border-top: 1px solid rgba(203, 213, 225, 0.1);
        }

        .event-speakers-mini {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .speaker-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.05);
          padding: 3px 8px 3px 4px;
          border-radius: 20px;
          font-size: 12px;
          color: #CBD5E1;
        }

        .speaker-pill img {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          object-fit: cover;
        }

        .event-action-btn {
          background: #0046FC;
          color: #FFFFFF;
          border: 0;
          border-radius: 5px;
          padding: 8px 14px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          transition: background 0.2s ease, transform 0.2s ease;
        }

        .event-action-btn:hover {
          background: #00D2FF;
          color: #060B12;
          transform: translateY(-2px);
        }

        .event-action-btn.registered {
          background: #10B981;
          color: #FFFFFF;
        }

        .events-empty {
          text-align: center;
          padding: 60px 20px;
          color: #94A3B8;
        }

        .events-empty h2 {
          color: #FFFFFF;
          margin-bottom: 8px;
        }

        /* ================= MODAL ================= */
        .event-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(8px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .event-modal-dialog {
          background: #0D1522;
          border: 1px solid rgba(0, 210, 255, 0.35);
          border-radius: 12px;
          width: min(960px, 100%);
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7);
        }

        .event-modal-close {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #FFFFFF;
          font-size: 16px;
          cursor: pointer;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .event-modal-close:hover {
          background: #EF4444;
          transform: scale(1.1);
        }

        .event-modal-hero {
          position: relative;
          height: 260px;
          overflow: hidden;
          background: #060B12;
        }

        .event-modal-hero img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .event-modal-hero-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 24px 28px;
          background: linear-gradient(180deg, transparent 0%, rgba(13, 21, 34, 0.98) 90%);
        }

        .event-modal-hero-overlay h2 {
          margin: 10px 0 10px;
          font-size: 28px;
          color: #FFFFFF;
          line-height: 1.25;
        }

        .event-modal-meta-row {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          font-size: 13.5px;
          color: #CBD5E1;
        }

        .format-tag {
          color: #00D2FF;
          font-weight: 700;
        }

        .event-modal-body {
          display: grid;
          grid-template-columns: minmax(0, 1.4fr) minmax(300px, 0.8fr);
          gap: 28px;
          padding: 28px;
        }

        .event-modal-section {
          margin-bottom: 24px;
        }

        .event-modal-section h3 {
          margin: 0 0 10px;
          font-size: 18px;
          color: #00D2FF;
          border-bottom: 1px solid rgba(203, 213, 225, 0.12);
          padding-bottom: 6px;
        }

        .event-modal-section p {
          margin: 0;
          font-size: 15px;
          line-height: 1.6;
          color: #D5DBE7;
        }

        .event-modal-bullets {
          list-style: none;
          padding: 0;
          margin: 10px 0 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .event-modal-bullets li {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 14.5px;
          color: #CBD5E1;
          line-height: 1.5;
        }

        .check-icon {
          color: #00D2FF;
          font-weight: 800;
        }

        .event-modal-speakers {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 10px;
        }

        .modal-speaker-card {
          display: flex;
          align-items: center;
          gap: 14px;
          background: rgba(255, 255, 255, 0.04);
          padding: 10px 14px;
          border-radius: 8px;
          border: 1px solid rgba(203, 213, 225, 0.1);
        }

        .modal-speaker-card img {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #00D2FF;
        }

        .modal-speaker-card h4 {
          margin: 0 0 3px;
          font-size: 16px;
          color: #FFFFFF;
        }

        .spk-role {
          font-size: 13px;
          color: #00D2FF;
          margin: 0;
        }

        .spk-company {
          font-size: 12px;
          color: #94A3B8;
          margin: 0;
        }

        .event-agenda-timeline {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 10px;
        }

        .timeline-item {
          display: grid;
          grid-template-columns: 130px minmax(0, 1fr);
          gap: 12px;
          padding: 8px 0;
          border-bottom: 1px dashed rgba(203, 213, 225, 0.1);
          font-size: 13.5px;
        }

        .timeline-time {
          color: #00D2FF;
          font-weight: 700;
        }

        .timeline-content strong {
          display: block;
          color: #FFFFFF;
        }

        .timeline-content span {
          display: block;
          font-size: 12px;
          color: #94A3B8;
        }

        /* REGISTER BOX */
        .event-register-box {
          background: #111C2D;
          border: 1px solid rgba(0, 210, 255, 0.3);
          border-radius: 8px;
          padding: 22px;
          position: sticky;
          top: 20px;
        }

        .event-register-box h3 {
          margin: 0 0 8px;
          font-size: 20px;
          color: #FFFFFF;
        }

        .event-register-box p {
          margin: 0 0 16px;
          font-size: 13.5px;
          color: #AEB8CA;
          line-height: 1.45;
        }

        .event-reg-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .event-reg-form label {
          font-size: 12.5px;
          color: #CBD5E1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .event-reg-form input {
          background: #060B12;
          border: 1px solid rgba(203, 213, 225, 0.16);
          border-radius: 5px;
          padding: 9px 12px;
          color: #FFFFFF;
          font-size: 13.5px;
          outline: none;
        }

        .event-reg-form input:focus {
          border-color: #00D2FF;
        }

        .event-submit-btn {
          margin-top: 6px;
          background: #0046FC;
          color: #FFFFFF;
          border: 0;
          border-radius: 6px;
          padding: 12px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .event-submit-btn:hover {
          background: #00D2FF;
          color: #060B12;
        }

        .reg-confirmed-card {
          text-align: center;
          padding: 20px 10px;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid #10B981;
          border-radius: 6px;
        }

        .conf-icon {
          font-size: 32px;
          margin-bottom: 6px;
        }

        .reg-confirmed-card h4 {
          margin: 0 0 6px;
          color: #10B981;
          font-size: 17px;
        }

        .reg-confirmed-card p {
          margin: 0;
          font-size: 13px;
          color: #D5DBE7;
        }

        .reg-toast {
          margin-top: 10px;
          background: #10B981;
          color: #FFFFFF;
          padding: 8px 12px;
          border-radius: 5px;
          font-size: 12.5px;
          text-align: center;
        }

        @media (max-width: 900px) {
          .events-grid {
            grid-template-columns: 1fr;
          }

          .event-modal-body {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}

export default Events;

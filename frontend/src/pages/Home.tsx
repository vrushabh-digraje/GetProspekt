import { useEffect, useState } from "react";
import EditorialCoverImage from "../components/EditorialCoverImage";
import { Link } from "react-router-dom";
import {
  homepageShowcaseApi,
  solutionsStorageApi,
  type SolutionData,
} from "../services/api";

type Article = {
  image: string;
  title: string;
  author: string;
  date: string;
  description: string;
  category: string;
  link: string;
  readTime?: string;
};

type PodcastEpisode = {
  id: string;
  number: string;
  duration: string;
  title: string;
  guest: string;
  role: string;
  topic: string;
  description: string;
  link: string;
  image: string;
};

const latestArticles: Article[] = [
  {
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1472&q=90",
    title: "Smarter Deployment of AI: Defending Against Shadow AI and Agentic Risks",
    author: "Jyotsna Iyer",
    date: "Oct 2026",
    category: "Cybersecurity",
    link: "/article/smarter-ai-deployment-guardrails",
    readTime: "8 min read",
    description: "Why modern enterprise cybersecurity doesn't need more AI models, but smarter deployment of governance guardrails to protect against unauthorized model use and memory leakage.",
  },
  {
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=90",
    title: "Unifying Cyber Protection: Mitigating Zero-Click & Runtime Cloud Vulnerabilities",
    author: "Ari Eitan",
    date: "Oct 2026",
    category: "Cloud Security",
    link: "/article/runtime-cloud-vulnerability-protection",
    readTime: "7 min read",
    description: "How runtime-first cloud security platforms prioritize active exploit paths and shrink the window between vulnerability discovery and automated remediation.",
  },
  {
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=90",
    title: "Alert Fatigue in Cybersecurity: The Critical Role of AI Automation",
    author: "Ahmed Achchak",
    date: "Oct 2026",
    category: "Security Operations",
    link: "/article/guest-soc-alert-fatigue-automation",
    readTime: "9 min read",
    description: "Exploring why Tier-1 SOC analysts face acute burnout from false positives and how autonomous triage models reduce investigation times from hours to seconds.",
  },
  {
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=90",
    title: "The Next Leap in Enterprise Defense: Subscription-Based Firewall Services",
    author: "Chandrodaya Prasad",
    date: "Oct 2026",
    category: "Enterprise Leadership",
    link: "/article/subscription-firewalls-cloud-sase",
    readTime: "6 min read",
    description: "The architectural shift from rigid hardware appliances to flexible, cloud-centric firewall platforms and unified secure access service edge (SASE).",
  },
  {
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=90",
    title: "Redefining Identity Security: Navigating AI-Driven Access Management",
    author: "Greg Keller",
    date: "Oct 2026",
    category: "Identity Security",
    link: "/article/guest-redefining-identity-security",
    readTime: "8 min read",
    description: "Navigating identity perimeter dissolution, continuous machine-to-machine authentication, and automated credential governance in modern hybrid enterprises.",
  },
  {
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=90",
    title: "Guarding Against Exploits: Best Practices for Securing Enterprise AI Agents",
    author: "Gal Moyal",
    date: "Oct 2026",
    category: "AI Defense",
    link: "/article/guest-securing-agentic-ai",
    readTime: "10 min read",
    description: "Mitigating memory poisoning, indirect prompt injection, and multi-agent coordination risks across mission-critical enterprise workflows.",
  },
  {
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=90",
    title: "Modern Cyber Extortion: Why Data Leakage Has Become the Primary Currency",
    author: "GETprospeKt Cyber Labs",
    date: "Sep 2026",
    category: "Cybersecurity",
    link: "/article/modern-cyber-extortion-data-leakage",
    readTime: "7 min read",
    description: "Analyzing how extortion syndicates shifted from pure disk encryption to aggressive data exfiltration, bypassing traditional endpoint backups.",
  },
  {
    image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=90",
    title: "Film to Theme Parks: Cutting-Edge Tech In Use in Entertainment",
    author: "GETprospeKt Engineering",
    date: "Oct 2026",
    category: "DevOps & Engineering",
    link: "/article/film-to-theme-parks-cutting-edge-tech-entertainment",
    readTime: "6 min read",
    description: "How the entertainment industry makes use of the latest tech to make magic — from virtual production LED volumes to real-time robotics in modern theme parks.",
  },
  {
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=90",
    title: "Penetration Testing Standardisation: Operationalising NIST SP 800-115 & OWASP",
    author: "GETprospeKt Research",
    date: "Sep 2026",
    category: "Enterprise Leadership",
    link: "/article/penetration-testing-standardisation-nist-owasp",
    readTime: "9 min read",
    description: "Standardizing offensive security validation, continuous automated red teaming, and verifiable remediation reporting for enterprise compliance audits.",
  },
  {
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=90",
    title: "Account-Based Pipeline Engineering in Cyber & Enterprise Tech",
    author: "GETprospeKt",
    date: "Sep 2026",
    category: "MarTech & Growth",
    link: "/article/abm-enterprise-account-intelligence",
    readTime: "8 min read",
    description: "How enterprise revenue teams map complex CISO buying committees and accelerate multi-stakeholder cybersecurity pipeline.",
  },
  {
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=90",
    title: "Securing the Modern Software Supply Chain Against Dependency Infiltration",
    author: "GETprospeKt Dev Labs",
    date: "Oct 2026",
    category: "DevOps & Engineering",
    link: "/article/software-supply-chain-dependency-security",
    readTime: "8 min read",
    description: "Implementing automated Software Bills of Materials (SBOM), continuous open-source package scanning, and signed artifact enforcement across CI/CD.",
  },
  {
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=90",
    title: "Automated Threat Hunting: Empowering Level-1 Analysts with Generative Insights",
    author: "Ahmed Achchak",
    date: "Oct 2026",
    category: "Cybersecurity",
    link: "/article/automated-threat-hunting-generative-insights",
    readTime: "7 min read",
    description: "Using natural-language threat investigation assistants to correlate multi-source SIEM logs and accelerate incident containment.",
  },
  {
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=90",
    title: "Endpoint Resilience Beyond EDR: Enforcing Continuous Integrity Across Fleets",
    author: "David Sterling",
    date: "Sep 2026",
    category: "Enterprise Leadership",
    link: "/article/endpoint-resilience-firmware-integrity",
    readTime: "7 min read",
    description: "How hardware-rooted firmware verification and self-healing OS agents prevent persistence from advanced nation-state threat actors.",
  },
];

const popularArticles: Article[] = [
  {
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=90",
    title: "2026 CISO Executive Agenda: Tool Consolidation & Vendor Rationalisation",
    author: "Elena Rostova",
    date: "Trending",
    category: "Enterprise Leadership",
    link: "/article/ciso-tool-consolidation-vendor-rationalisation",
    readTime: "9 min read",
    description: "Why security leaders are eliminating standalone point tools in favor of integrated platforms to curb cost and operational complexity.",
  },
  {
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=90",
    title: "Zero Trust for Machine Identities: Securing Workloads, Containers, and APIs",
    author: "Greg Keller",
    date: "Most Read",
    category: "Cybersecurity",
    link: "/article/zero-trust-machine-identity-architecture",
    readTime: "8 min read",
    description: "Expanding Zero Trust beyond human employees to encompass non-human service accounts, Kubernetes pods, and microservice certificates.",
  },
  {
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=90",
    title: "Ransomware Defense Playbook: Halting Lateral Movement in Hybrid Environments",
    author: "GETprospeKt Cyber Labs",
    date: "Popular",
    category: "Cybersecurity",
    link: "/article/ransomware-defense-lateral-movement",
    readTime: "10 min read",
    description: "Network micro-segmentation and behavioral endpoint inspection strategies that stop ransomware payloads before they compromise active directory.",
  },
  {
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=90",
    title: "Securing the Modern Software Supply Chain Against Dependency Infiltration",
    author: "GETprospeKt Dev Labs",
    date: "Featured",
    category: "DevOps & Engineering",
    link: "/article/software-supply-chain-dependency-security",
    readTime: "8 min read",
    description: "Implementing automated Software Bills of Materials (SBOM), continuous open-source package scanning, and signed artifact enforcement.",
  },
  {
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=90",
    title: "Activating High-Value Audiences With First Party Data",
    author: "Nick Henthorn",
    date: "Trending",
    category: "MarTech & Growth",
    link: "/article/guest-first-party-data",
    readTime: "6 min read",
    description: "Navigating GDPR, CCPA, and emerging global data residency mandates while training and deploying enterprise machine learning systems.",
  },
  {
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=90",
    title: "Automated Threat Hunting: Empowering Level-1 Analysts with Generative Insights",
    author: "Ahmed Achchak",
    date: "Hot Topic",
    category: "Cybersecurity",
    link: "/article/automated-threat-hunting-generative-insights",
    readTime: "7 min read",
    description: "Using natural-language threat investigation assistants to correlate multi-source SIEM logs and accelerate incident containment.",
  },
  {
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=90",
    title: "Endpoint Resilience Beyond EDR: Enforcing Continuous Integrity Across Fleets",
    author: "David Sterling",
    date: "Most Read",
    category: "Enterprise Leadership",
    link: "/article/endpoint-resilience-firmware-integrity",
    readTime: "7 min read",
    description: "How hardware-rooted firmware verification and self-healing OS agents prevent persistence from advanced nation-state threat actors.",
  },
  {
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=90",
    title: "Third-Party Risk Management: Assessing Cyber Posture in Vendor Ecosystems",
    author: "Marcus Vance",
    date: "Trending",
    category: "FinTech & Banking",
    link: "/article/third-party-risk-management-vendor-telemetry",
    readTime: "8 min read",
    description: "Moving beyond passive annual questionnaires to continuous passive telemetry and verified vendor security scorecards.",
  },
  {
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=90",
    title: "Defending Critical FinTech & SaaS Workloads Against Token Hijacking & Session Theft",
    author: "GETprospeKt FinTech Wire",
    date: "Featured",
    category: "FinTech & Banking",
    link: "/article/fintech-cloud-security-token-hijacking",
    readTime: "9 min read",
    description: "Preventing adversary-in-the-middle phishing attacks and cookie exfiltration across enterprise Microsoft 365, Google Workspace, and Salesforce.",
  },
  {
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=90",
    title: "Executive Cyber Crisis Playbook: Board Communication & Incident Response",
    author: "Elena Rostova",
    date: "Essential",
    category: "Enterprise Leadership",
    link: "/article/executive-cyber-crisis-playbook-board-comms",
    readTime: "9 min read",
    description: "Structuring transparent executive disclosures, regulatory timelines, and customer communications during mission-critical breach containment.",
  },
];

const podcastEpisodes: PodcastEpisode[] = [
  {
    id: "ep-1",
    number: "EPISODE 01",
    duration: "38 MIN",
    title: "Eliminating SOC Alert Fatigue with Autonomous AI Triage",
    guest: "Ahmed Achchak",
    role: "CEO & Co-Founder, Qevlar AI",
    topic: "Security Operations & AI Automation",
    description: "How autonomous AI investigation engines eliminate 80% of Tier-1 alert noise, accelerate MTTI from hours to seconds, and prevent analyst burnout across global SOC environments.",
    link: "/article/guest-soc-alert-fatigue-automation",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=90",
  },
  {
    id: "ep-2",
    number: "EPISODE 02",
    duration: "44 MIN",
    title: "Securing Multi-Agent Systems Against Indirect Prompt Injection",
    guest: "Gal Moyal",
    role: "CTO Office, Noma Security",
    topic: "Agentic AI Governance",
    description: "Architectural defenses against tool-calling hijacking, memory poisoning in enterprise vector databases, and establishing deterministic runtime execution sandboxes.",
    link: "/article/guest-securing-agentic-ai",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=90",
  },
  {
    id: "ep-3",
    number: "EPISODE 03",
    duration: "42 MIN",
    title: "Identity as the New Perimeter: Phishing-Resistant FIDO2 Architecture",
    guest: "Greg Keller",
    role: "Chief Technology Officer, JumpCloud",
    topic: "Zero Trust Identity",
    description: "Why traditional push MFA is failing against AiTM reverse proxies and how continuous biometric WebAuthn passkeys restore zero-trust access control across hybrid workforces.",
    link: "/article/guest-redefining-identity-security",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=90",
  },
  {
    id: "ep-4",
    number: "EPISODE 04",
    duration: "51 MIN",
    title: "The 2026 CISO Agenda: Vendor Consolidation & Crisis Governance",
    guest: "Elena Rostova",
    role: "Chief Technology Analyst, GETprospeKt",
    topic: "Executive Strategy & Compliance",
    description: "Navigating SEC 4-day disclosure rules, reducing 70-tool stack sprawl into 3 core platform anchors, and structuring board-level cyber risk quantification with ROI clarity.",
    link: "/article/ciso-tool-consolidation-vendor-rationalisation",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=90",
  },
  {
    id: "ep-5",
    number: "EPISODE 05",
    duration: "36 MIN",
    title: "Beyond Questionnaires: Continuous TPRM External Telemetry",
    guest: "Marcus Vance",
    role: "Head of Supply Chain Risk, Solaris AI",
    topic: "Third-Party Risk Management",
    description: "Moving beyond static annual SIG surveys to real-time passive attack surface telemetry, darknet breach monitoring, and contractually enforced 72-hour vulnerability SLAs.",
    link: "/article/third-party-risk-management-vendor-telemetry",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=90",
  },
  {
    id: "ep-6",
    number: "EPISODE 06",
    duration: "47 MIN",
    title: "Zero-Click Cloud Exploits & Kernel-Level eBPF Defense",
    guest: "Ari Eitan",
    role: "VP Cloud Security Architecture",
    topic: "Cloud Native & Kubernetes Security",
    description: "How eBPF probes inside the Linux kernel provide sub-1% CPU runtime observability, terminating zero-click container escapes and reverse shells in milliseconds.",
    link: "/article/runtime-cloud-vulnerability-protection",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=90",
  },
];

function Home() {
  const [activeTab, setActiveTab] = useState<"latest" | "popular">("latest");

  const [solutions, setSolutions] = useState<SolutionData[]>(() => {
    try {
      return solutionsStorageApi.getAll();
    } catch {
      return [];
    }
  });

  const [latestList, setLatestList] = useState<Article[]>(() => {
    try {
      const saved = homepageShowcaseApi.getLatest();
      return saved && saved.length > 0 ? saved : latestArticles;
    } catch {
      return latestArticles;
    }
  });

  const [popularList, setPopularList] = useState<Article[]>(() => {
    try {
      const saved = homepageShowcaseApi.getPopular();
      return saved && saved.length > 0 ? saved : popularArticles;
    } catch {
      return popularArticles;
    }
  });

  useEffect(() => {
    const handleSync = () => {
      try {
        const l = homepageShowcaseApi.getLatest();
        const p = homepageShowcaseApi.getPopular();
        if (l && l.length > 0) setLatestList(l);
        if (p && p.length > 0) setPopularList(p);
      } catch (err) {
        console.warn("[Home Sync]", err);
      }
    };

    const handleSolutionsSync = () => {
      try {
        setSolutions(solutionsStorageApi.getAll());
      } catch (err) {
        console.warn("[Home Solutions Sync]", err);
      }
    };

    window.addEventListener("storage", handleSync);
    window.addEventListener("storage", handleSolutionsSync);
    window.addEventListener("gp_homepage_updated", handleSync);
    window.addEventListener("gp_solutions_updated", handleSolutionsSync);
    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("storage", handleSolutionsSync);
      window.removeEventListener("gp_homepage_updated", handleSync);
      window.removeEventListener("gp_solutions_updated", handleSolutionsSync);
    };
  }, []);

  const heroArticle = latestList[0] || latestArticles[0];
  const subfeaturedList = latestList.slice(1, 5);
  // Full 10 articles in the sidebar for both Latest and Popular tabs
  const sideArticles =
    activeTab === "latest"
      ? latestList.slice(0, 10)
      : popularList.slice(0, 10);

  return (
    <>
      <main className="publication-home">
        <div className="publication-container">

          {/* ================= LATEST & EDITORIAL HEADLINES ================= */}
          <section className="latest-section">
            <div className="section-title-row">
              <h1>Latest</h1>
              <div className="section-line" />
            </div>

            <div className="latest-layout">
              {/* LEFT COLUMN: HERO LEAD + 2X2 SUBFEATURED GRID + EDITORIAL STREAM */}
              <div className="latest-main-column">
                {/* HERO LEAD ARTICLE */}
                <article className="featured-article">
                  <Link
                    to={heroArticle.link}
                    className="featured-link"
                    aria-label={`Open ${heroArticle.title}`}
                  >
                    <div className="featured-image-wrap">
                      <EditorialCoverImage
                        title={heroArticle.title}
                        subtitle={heroArticle.description}
                        category={heroArticle.category}
                        photo={heroArticle.image}
                        variant="hero"
                      />
                    </div>

                    <div className="featured-content">
                      <span className="article-category">
                        {heroArticle.category}
                      </span>
                      <h2>{heroArticle.title}</h2>
                      <div className="article-meta">
                        By <strong>{heroArticle.author}</strong>
                        {heroArticle.date && (
                          <>
                            <span>|</span>
                            {heroArticle.date}
                          </>
                        )}
                        {heroArticle.readTime && (
                          <>
                            <span>|</span>
                            <span>{heroArticle.readTime}</span>
                          </>
                        )}
                      </div>
                      <p>{heroArticle.description}</p>
                      <span className="read-more">Read Full Article →</span>
                    </div>
                  </Link>
                </article>

                {/* SUBFEATURED 2X2 GRID */}
                <div className="subfeatured-grid">
                  {subfeaturedList.map((item) => (
                    <article className="subfeatured-card" key={item.link}>
                      <Link
                        to={item.link}
                        className="subfeatured-link"
                        aria-label={`Open ${item.title}`}
                      >
                        <div className="subfeatured-image-wrap">
                          <EditorialCoverImage
                            title={item.title}
                            subtitle={item.description}
                            category={item.category}
                            photo={item.image}
                            variant="subfeatured"
                          />
                        </div>

                        <div className="subfeatured-content">
                          <span className="article-category">{item.category}</span>
                          <h3>{item.title}</h3>
                          <div className="article-meta">
                            By <strong>{item.author}</strong>
                            <span>|</span>
                            {item.date}
                          </div>
                          <p>{item.description}</p>
                          <span className="subfeatured-read-link">Read Full Story →</span>
                        </div>
                      </Link>
                    </article>
                  ))}
                </div>
              </div>

              {/* RIGHT COLUMN: TABS + 10 SIDE ARTICLES WITH RANK BADGES + DISPATCH */}
              <aside className="latest-sidebar">
                <div className="tabs">
                  <button
                    type="button"
                    className={activeTab === "latest" ? "tab active" : "tab"}
                    onClick={() => setActiveTab("latest")}
                  >
                    Latest
                  </button>
                  <button
                    type="button"
                    className={activeTab === "popular" ? "tab active" : "tab"}
                    onClick={() => setActiveTab("popular")}
                  >
                    Popular
                  </button>
                </div>

                <div className="side-articles-list">
                  {sideArticles.map((article, idx) => (
                    <article className="side-article" key={article.link + idx}>
                      <div className="side-article-body">
                        <div className="side-top-row">
                          {activeTab === "popular" && (
                            <span className={`rank-badge ${idx < 3 ? "rank-top" : ""}`}>
                              #{String(idx + 1).padStart(2, "0")}
                            </span>
                          )}
                          <span className="article-category">{article.category}</span>
                        </div>
                        <h3>
                          <Link to={article.link}>{article.title}</Link>
                        </h3>
                        <div className="article-meta">
                          By <strong>{article.author}</strong>
                          <span>|</span>
                          {article.date}
                        </div>
                        <p>{article.description}</p>
                      </div>
                    </article>
                  ))}
                </div>

                {/* EXECUTIVE BRIEFING / NETWORK DISPATCH CARD */}
                <div className="executive-dispatch-card">
                  <div className="dispatch-badge">⚡ EDITORIAL DISPATCH</div>
                  <h4>GETprospeKt Intelligence Briefing</h4>
                  <p>
                    Curated domain reporting across Cybersecurity, MarTech,
                    DevOps, FinTech, and Enterprise Leadership. Access playbooks,
                    verified market research, and C-level insights.
                  </p>
                  <Link to="/resources" className="dispatch-btn">
                    Browse All Research &amp; Playbooks →
                  </Link>
                </div>
              </aside>
            </div>
          </section>

          {/* ================= OUR LEAD-GENERATION SOLUTIONS (100% UNTOUCHED) ================= */}
          <section className="more-section">
            <div className="section-title-row">
              <h2>Our Lead-Generation Solutions</h2>
              <div className="section-line" />
            </div>

            <div className="more-layout">
              <div className="more-list">
                {solutions.map((sol) => (
                  <article className="more-article" key={sol.id || sol.path}>
                    <Link to={sol.path} className="more-image-link" title="Click image to open full solution details">
                      <img
                        src={sol.image}
                        alt={sol.title}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src =
                            "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22600%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%230D1522%22%2F%3E%3C%2Fsvg%3E";
                        }}
                      />
                      <span className="img-hover-badge mini">
                        Click Image to Open Full Content
                      </span>
                    </Link>

                    <div className="more-content">
                      <span className="article-category">
                        {sol.tag || "Lead-Generation Solution"}
                      </span>
                      <h3>
                        <Link to={sol.path}>{sol.title}</Link>
                      </h3>
                      <div className="article-meta">
                        By <strong>GETprospeKt</strong>
                        <span>|</span>
                        Lead-Gen Solution
                      </div>
                      <p>{sol.description}</p>
                    </div>
                  </article>
                ))}
              </div>

              {/* ================= prospeKt Promo ================= */}
              <aside className="promo-column">
                <div className="promo-card">
                  <div className="promo-logo">
                    <span>GET</span>
                    <strong>prospeKt</strong>
                    <i />
                  </div>
                  <h3>
                    B2B Lead
                    <br />
                    Generation
                  </h3>
                  <p>
                    Qualified
                    <br />
                    Leads
                  </p>
                  <div className="promo-line" />
                </div>

                <a href="#solutions" className="promo-image">
                  <img
                    src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=90"
                    alt="B2B Lead technology"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src =
                        "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22600%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%230D1522%22%2F%3E%3C%2Fsvg%3E";
                    }}
                  />
                </a>
              </aside>
            </div>
          </section>

          {/* ================= PODCAST ================= */}
          <section className="podcast-section">
            <div className="section-title-row">
              <h2>Podcast</h2>
              <div className="section-line" />
            </div>

            <div className="podcast-intro-banner">
              <div className="podcast-banner-content">
                <span className="podcast-channel-tag">GETprospeKt EXECUTIVE AUDIO SERIES</span>
                <h3>Conversations with Enterprise Security &amp; Technology Leaders</h3>
                <p>
                  In-depth discussions with CISOs, CTOs, and engineering innovators tackling modern cyber defense,
                  autonomous AI alert triage, runtime cloud resilience, zero-trust identity, and supply chain telemetry.
                </p>
              </div>
              <div className="podcast-banner-stats">
                <div className="stat-pill">
                  <strong>6</strong>
                  <span>Executive Episodes</span>
                </div>
                <div className="stat-pill">
                  <strong>4.9 ★</strong>
                  <span>Industry Rating</span>
                </div>
                <div className="stat-pill">
                  <strong>Weekly</strong>
                  <span>New Broadcasts</span>
                </div>
              </div>
            </div>

            <div className="podcast-episodes-grid">
              {podcastEpisodes.map((ep) => (
                <article className="podcast-episode-card" key={ep.id}>
                  <div className="podcast-card-top">
                    <div className="podcast-badge-row">
                      <span className="ep-number">{ep.number}</span>
                      <span className="ep-duration">⏱ {ep.duration}</span>
                    </div>
                    <Link
                      to={ep.link}
                      className="podcast-play-button"
                      aria-label={`Listen to ${ep.title}`}
                      title="Play episode and read transcript"
                    >
                      <span className="play-triangle">▶</span>
                    </Link>
                  </div>

                  <span className="podcast-topic-pill">{ep.topic}</span>

                  <h3 className="podcast-ep-title">
                    <Link to={ep.link}>{ep.title}</Link>
                  </h3>

                  <p className="podcast-ep-desc">{ep.description}</p>

                  <div className="podcast-guest-row">
                    <img
                      src={ep.image}
                      alt={ep.guest}
                      className="podcast-guest-avatar"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=90";
                      }}
                    />
                    <div className="podcast-guest-info">
                      <strong>{ep.guest}</strong>
                      <span>{ep.role}</span>
                    </div>
                  </div>

                  <Link to={ep.link} className="podcast-listen-link">
                    Listen &amp; Read Full Transcript →
                  </Link>
                </article>
              ))}
            </div>
          </section>

        </div>
      </main>

      <style>{`
        * {
          box-sizing: border-box;
        }

        .publication-home {
          width: 100%;
          background: transparent;
          color: #D5DBE7;
          font-family: var(--font-sans);
        }

        .publication-container {
          width: min(1380px, calc(100% - 48px));
          margin: 0 auto;
          padding: 22px 0 70px;
        }

        .section-title-row {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 18px;
        }

        .section-title-row h1,
        .section-title-row h2 {
          margin: 0;
          font-size: 38px;
          line-height: 1.15;
          font-weight: 700;
          white-space: nowrap;
          color: #FFFFFF;
        }

        .section-line {
          flex: 1;
          height: 1px;
          background: rgba(203, 213, 225, 0.14);
        }

        /* ================= LATEST BALANCED LAYOUT ================= */
        .latest-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 325px;
          gap: 20px;
          align-items: start;
        }

        .latest-main-column {
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        /* FEATURED HERO */
        .featured-article {
          min-width: 0;
          background: #0D1522;
          border: 1px solid rgba(203, 213, 225, 0.12);
          border-radius: 8px;
          overflow: hidden;
          transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .featured-article:hover {
          border-color: rgba(0, 210, 255, 0.4);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
        }

        .featured-link {
          display: block;
          color: inherit;
          text-decoration: none;
        }

        .featured-image-wrap {
          width: 100%;
          height: 390px;
          overflow: hidden;
          background: #060B12;
          position: relative;
        }

        .featured-image-wrap img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .featured-link:hover .featured-image-wrap img {
          transform: scale(1.035);
        }

        /* HOVER OVERLAY BADGE ON IMAGES */
        .img-hover-badge {
          position: absolute;
          bottom: 14px;
          left: 14px;
          background: rgba(6, 11, 18, 0.88);
          backdrop-filter: blur(8px);
          color: #00D2FF;
          border: 1px solid rgba(0, 210, 255, 0.45);
          border-radius: 6px;
          padding: 6px 12px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.3px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          opacity: 0.85;
          transform: translateY(0);
          transition: all 0.3s ease;
          pointer-events: none;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.5);
        }

        .img-hover-badge.mini {
          font-size: 11px;
          padding: 4px 8px;
          bottom: 10px;
          left: 10px;
        }

        .featured-link:hover .img-hover-badge,
        .subfeatured-link:hover .img-hover-badge,
        .more-image-link:hover .img-hover-badge {
          opacity: 1;
          background: #0046FC;
          color: #FFFFFF;
          border-color: #00D2FF;
          transform: translateY(-2px);
        }

        .featured-content {
          padding: 22px 24px 26px;
        }

        .article-category {
          display: inline-block;
          margin-bottom: 8px;
          color: #00D2FF;
          font-size: 13px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.6px;
        }

        .featured-content h2 {
          margin: 0 0 12px;
          font-size: 32px;
          line-height: 1.25;
          letter-spacing: -0.4px;
          color: #FFFFFF;
          transition: color 0.25s ease;
        }

        .featured-link:hover .featured-content h2 {
          color: #00D2FF;
        }

        .article-meta {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 7px;
          color: #AEB8CA;
          font-size: 14.5px;
          line-height: 1.4;
          margin-bottom: 12px;
        }

        .article-meta strong {
          color: #E2E8F0;
        }

        .featured-content p {
          margin: 0 0 16px;
          font-size: 16.5px;
          line-height: 1.55;
          color: #CBD5E1;
        }

        .read-more {
          display: inline-flex;
          align-items: center;
          color: #00D2FF;
          font-size: 15px;
          font-weight: 700;
          transition: transform 0.2s ease, color 0.2s ease;
        }

        .featured-link:hover .read-more {
          color: #FFFFFF;
          transform: translateX(4px);
        }

        /* ================= SUBFEATURED 2X2 GRID ================= */
        .subfeatured-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .subfeatured-card {
          background: #0D1522;
          border: 1px solid rgba(203, 213, 225, 0.12);
          border-radius: 8px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .subfeatured-card:hover {
          transform: translateY(-3px);
          border-color: rgba(0, 210, 255, 0.4);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
        }

        .subfeatured-link {
          display: flex;
          flex-direction: column;
          height: 100%;
          color: inherit;
          text-decoration: none;
        }

        .subfeatured-image-wrap {
          width: 100%;
          height: 185px;
          position: relative;
          overflow: hidden;
          background: #060B12;
        }

        .subfeatured-image-wrap img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .subfeatured-link:hover .subfeatured-image-wrap img {
          transform: scale(1.05);
        }

        .subfeatured-content {
          padding: 18px 18px 20px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .subfeatured-content h3 {
          margin: 0 0 10px;
          font-size: 20px;
          line-height: 1.3;
          letter-spacing: -0.2px;
          color: #FFFFFF;
          transition: color 0.25s ease;
        }

        .subfeatured-link:hover .subfeatured-content h3 {
          color: #00D2FF;
        }

        .subfeatured-content p {
          margin: 0 0 14px;
          font-size: 14.5px;
          line-height: 1.5;
          color: #AEB8CA;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          flex: 1;
        }

        .subfeatured-read-link {
          font-size: 13.5px;
          font-weight: 700;
          color: #00D2FF;
          margin-top: auto;
          transition: transform 0.2s ease;
        }

        .subfeatured-link:hover .subfeatured-read-link {
          transform: translateX(3px);
          color: #FFFFFF;
        }

        /* ================= SIDEBAR WITH 10 ARTICLES & RANK BADGES ================= */
        .latest-sidebar {
          min-width: 0;
          border-left: 1px solid rgba(203, 213, 225, 0.12);
          padding-left: 18px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .tabs {
          display: flex;
          gap: 20px;
          border-bottom: 1px solid rgba(203, 213, 225, 0.14);
          padding-bottom: 2px;
        }

        .tab {
          position: relative;
          border: 0;
          background: transparent;
          padding: 0 0 10px;
          color: #AEB8CA;
          font-size: 17px;
          font-weight: 700;
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .tab:hover {
          color: #FFFFFF;
        }

        .tab.active {
          color: #FFFFFF;
        }

        .tab.active::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: -1px;
          height: 3px;
          background: #0046FC;
          border-radius: 2px;
        }

        .side-articles-list {
          display: flex;
          flex-direction: column;
        }

        .side-article {
          padding: 14px 0;
          border-bottom: 1px solid rgba(203, 213, 225, 0.1);
          transition: transform 0.2s ease;
        }

        .side-article:last-child {
          border-bottom: 0;
        }

        .side-article-body {
          min-width: 0;
        }

        .side-top-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 5px;
        }

        .rank-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 4px;
          background: rgba(0, 70, 252, 0.2);
          border: 1px solid rgba(0, 210, 255, 0.4);
          color: #00D2FF;
          letter-spacing: 0.5px;
        }

        .rank-badge.rank-top {
          background: linear-gradient(135deg, rgba(0, 210, 255, 0.3), rgba(0, 70, 252, 0.45));
          border-color: #00D2FF;
          color: #FFFFFF;
          box-shadow: 0 0 8px rgba(0, 210, 255, 0.3);
        }

        .side-article-body h3 {
          margin: 0 0 6px;
          font-size: 16.5px;
          line-height: 1.35;
          letter-spacing: -0.2px;
        }

        .side-article-body h3 a {
          color: #FFFFFF;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .side-article-body h3 a:hover {
          color: #00D2FF;
        }

        .side-article-body p {
          margin: 6px 0 0;
          font-size: 13.5px;
          line-height: 1.45;
          color: #AEB8CA;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* EXECUTIVE DISPATCH CARD IN SIDEBAR */
        .executive-dispatch-card {
          background: linear-gradient(145deg, #0D1522 0%, #111C2D 100%);
          border: 1px solid rgba(0, 210, 255, 0.25);
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
        }

        .dispatch-badge {
          display: inline-block;
          color: #00D2FF;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.6px;
          margin-bottom: 8px;
        }

        .executive-dispatch-card h4 {
          margin: 0 0 8px;
          font-size: 19px;
          color: #FFFFFF;
          line-height: 1.25;
        }

        .executive-dispatch-card p {
          margin: 0 0 16px;
          font-size: 13.5px;
          line-height: 1.5;
          color: #CBD5E1;
        }

        .dispatch-btn {
          display: inline-block;
          background: #0046FC;
          color: #FFFFFF;
          font-size: 13px;
          font-weight: 700;
          padding: 9px 15px;
          border-radius: 5px;
          text-decoration: none;
          transition: background 0.2s ease, transform 0.2s ease;
        }

        .dispatch-btn:hover {
          background: #00D2FF;
          color: #060B12;
          transform: translateY(-2px);
        }

        /* ================= MORE / SOLUTIONS SECTION ================= */
        .more-section {
          margin-top: 55px;
        }

        .more-layout {
          display: grid;
          grid-template-columns: minmax(0, 1.85fr) minmax(300px, 0.9fr);
          gap: 32px;
          align-items: start;
        }

        .more-list {
          min-width: 0;
        }

        .more-article {
          display: grid;
          grid-template-columns: 245px minmax(0, 1fr);
          gap: 25px;
          padding: 0 0 20px;
          margin-bottom: 20px;
          border-bottom: 1px solid rgba(203, 213, 225, 0.12);
        }

        .more-image-link {
          display: block;
          width: 245px;
          height: 152px;
          overflow: hidden;
          border-radius: 7px;
          background: #0D1522;
          position: relative;
          border: 1px solid rgba(203, 213, 225, 0.12);
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .more-image-link:hover {
          border-color: rgba(0, 210, 255, 0.45);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45), 0 0 16px rgba(0, 210, 255, 0.15);
        }

        .more-image-link img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .more-image-link:hover img {
          transform: scale(1.05);
        }

        .more-content {
          min-width: 0;
        }

        .more-content h3 {
          margin: 0 0 8px;
          font-size: 26px;
          line-height: 1.25;
          letter-spacing: -0.3px;
          color: #FFFFFF;
        }

        .more-content h3 a {
          color: inherit;
          text-decoration: none;
        }

        .more-content h3 a:hover {
          color: #00D2FF;
        }

        .more-content p {
          margin: 9px 0 0;
          font-size: 15.5px;
          line-height: 1.5;
          color: #D5DBE7;
        }

        /* PROMO */
        .promo-column {
          min-width: 0;
          border-left: 1px solid rgba(203, 213, 225, 0.12);
          padding-left: 24px;
        }

        .promo-card {
          position: relative;
          min-height: 255px;
          padding: 20px 0 25px;
          text-align: center;
          background: #0D1522;
          border-radius: 8px;
          border: 1px solid rgba(203, 213, 225, 0.12);
        }

        .promo-logo {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          margin-bottom: 28px;
          color: #AEB8CA;
          font-size: 17px;
        }

        .promo-logo strong {
          color: #FFFFFF;
        }

        .promo-logo i {
          width: 19px;
          height: 19px;
          display: inline-block;
          border-radius: 50%;
          background: #0046FC;
          position: relative;
        }

        .promo-logo i::after {
          content: "";
          position: absolute;
          width: 7px;
          height: 7px;
          left: 6px;
          top: 6px;
          border-radius: 50%;
          background: #fff;
        }

        .promo-card h3 {
          margin: 0;
          color: #00D2FF;
          font-size: 38px;
          line-height: 1.12;
        }

        .promo-card p {
          margin: 6px 0 0;
          color: #FFFFFF;
          font-size: 38px;
          line-height: 1.15;
          font-weight: 300;
        }

        .promo-line {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 8px;
          background: #0046FC;
        }

        .promo-image {
          display: block;
          width: 100%;
          height: 245px;
          overflow: hidden;
          background: #0D1522;
          border-radius: 8px;
          margin-top: 20px;
        }

        .promo-image img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
        }

        /* ================= PODCAST ================= */
        .podcast-section {
          margin-top: 55px;
        }

        .podcast-intro-banner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(145deg, #0D1522 0%, #111C2D 100%);
          border: 1px solid rgba(0, 210, 255, 0.22);
          border-radius: 8px;
          padding: 24px 28px;
          margin-bottom: 24px;
          gap: 24px;
        }

        .podcast-channel-tag {
          color: #00D2FF;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 1px;
          display: block;
          margin-bottom: 6px;
        }

        .podcast-banner-content h3 {
          margin: 0 0 8px;
          font-size: 24px;
          color: #FFFFFF;
          font-weight: 700;
          line-height: 1.25;
        }

        .podcast-banner-content p {
          margin: 0;
          color: #CBD5E1;
          font-size: 15px;
          max-width: 760px;
          line-height: 1.5;
        }

        .podcast-banner-stats {
          display: flex;
          gap: 12px;
          flex-shrink: 0;
        }

        .stat-pill {
          background: rgba(6, 11, 18, 0.75);
          border: 1px solid rgba(203, 213, 225, 0.15);
          border-radius: 6px;
          padding: 10px 16px;
          text-align: center;
          min-width: 100px;
        }

        .stat-pill strong {
          color: #00D2FF;
          display: block;
          font-size: 18px;
          font-weight: 800;
        }

        .stat-pill span {
          color: #AEB8CA;
          font-size: 12px;
          font-weight: 600;
        }

        .podcast-episodes-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .podcast-episode-card {
          background: #0D1522;
          border: 1px solid rgba(203, 213, 225, 0.12);
          border-radius: 8px;
          padding: 22px;
          display: flex;
          flex-direction: column;
          transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
        }

        .podcast-episode-card:hover {
          transform: translateY(-3px);
          border-color: rgba(0, 210, 255, 0.45);
          box-shadow: 0 10px 28px rgba(0, 0, 0, 0.5);
        }

        .podcast-card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .podcast-badge-row {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .ep-number {
          font-size: 11px;
          font-weight: 800;
          color: #00D2FF;
          letter-spacing: 0.8px;
          background: rgba(0, 210, 255, 0.12);
          padding: 3px 8px;
          border-radius: 4px;
          border: 1px solid rgba(0, 210, 255, 0.3);
        }

        .ep-duration {
          font-size: 12px;
          font-weight: 700;
          color: #AEB8CA;
        }

        .podcast-play-button {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #0046FC;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          transition: background 0.2s ease, transform 0.2s ease;
          text-decoration: none;
          box-shadow: 0 4px 12px rgba(0, 70, 252, 0.35);
        }

        .podcast-episode-card:hover .podcast-play-button {
          background: #00D2FF;
          color: #060B12;
          transform: scale(1.08);
        }

        .podcast-topic-pill {
          display: inline-block;
          font-size: 11px;
          font-weight: 700;
          color: #00D2FF;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          margin-bottom: 8px;
        }

        .podcast-ep-title {
          margin: 0 0 10px;
          font-size: 18.5px;
          line-height: 1.35;
          font-weight: 700;
        }

        .podcast-ep-title a {
          color: #FFFFFF;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .podcast-ep-title a:hover {
          color: #00D2FF;
        }

        .podcast-ep-desc {
          font-size: 13.5px;
          line-height: 1.5;
          color: #AEB8CA;
          margin: 0 0 16px;
          flex: 1;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .podcast-guest-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 0;
          border-top: 1px solid rgba(203, 213, 225, 0.1);
          border-bottom: 1px solid rgba(203, 213, 225, 0.1);
          margin-bottom: 14px;
        }

        .podcast-guest-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          object-fit: cover;
          border: 1px solid rgba(0, 210, 255, 0.4);
          flex-shrink: 0;
        }

        .podcast-guest-info {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .podcast-guest-info strong {
          color: #FFFFFF;
          font-size: 13.5px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .podcast-guest-info span {
          color: #AEB8CA;
          font-size: 12px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .podcast-listen-link {
          font-size: 13px;
          font-weight: 700;
          color: #00D2FF;
          text-decoration: none;
          transition: transform 0.2s ease, color 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          width: fit-content;
        }

        .podcast-listen-link:hover {
          color: #FFFFFF;
          transform: translateX(3px);
        }

        /* ================= RESPONSIVE ================= */
        @media (max-width: 1100px) {
          .latest-layout,
          .more-layout {
            grid-template-columns: 1fr;
          }

          .latest-sidebar,
          .promo-column {
            border-left: 0;
            padding-left: 0;
          }

          .podcast-intro-banner {
            flex-direction: column;
            align-items: flex-start;
          }

          .podcast-episodes-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .subfeatured-grid {
            grid-template-columns: 1fr;
          }

          .podcast-episodes-grid {
            grid-template-columns: 1fr;
          }

          .more-article {
            grid-template-columns: 1fr;
          }

          .more-image-link {
            width: 100%;
            height: 200px;
          }

          .featured-image-wrap {
            height: 260px;
          }

          .featured-content h2 {
            font-size: 24px;
          }

          .section-title-row h1,
          .section-title-row h2 {
            font-size: 28px;
          }
        }
      `}</style>
    </>
  );
}

export default Home;

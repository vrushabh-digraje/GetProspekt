import { useEffect, useState } from "react";
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
};

const latestArticles: Article[] = [
  {
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1472&q=90",
    title: "Smarter Deployment of AI: Defending Against Shadow AI and Agentic Risks",
    author: "Jyotsna Iyer",
    date: "Oct 2026",
    category: "Cybersecurity",
    link: "/article/cybersecurity-pipeline",
    description: "Why modern enterprise cybersecurity doesn't need more AI models, but smarter deployment of governance guardrails to protect against unauthorized model use and memory leakage.",
  },
  {
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=90",
    title: "Unifying Cyber Protection: Mitigating Zero-Click & Runtime Cloud Vulnerabilities",
    author: "Ari Eitan",
    date: "Oct 2026",
    category: "Cloud Security",
    link: "/article/cloud-infrastructure",
    description: "How runtime-first cloud security platforms prioritize active exploit paths and shrink the window between vulnerability discovery and automated remediation.",
  },
  {
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=90",
    title: "Mitigating SOC Alert Fatigue: The Critical Role of Autonomous AI Triage",
    author: "Ahmed Achchak",
    date: "Oct 2026",
    category: "Security Operations",
    link: "/article/guest-soc-alert-fatigue-automation",
    description: "Exploring why Tier-1 SOC analysts face acute burnout from false positives and how autonomous triage models reduce investigation times from hours to seconds.",
  },
  {
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=90",
    title: "The Next Leap in Enterprise Defense: Subscription-Based Firewall Services",
    author: "Chandrodaya Prasad",
    date: "Oct 2026",
    category: "Network Security",
    link: "/article/enterprise-technology",
    description: "The architectural shift from rigid hardware appliances to flexible, cloud-centric firewall platforms and unified secure access service edge (SASE).",
  },
  {
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=90",
    title: "Redefining Identity Security: Navigating AI-Driven Access Management",
    author: "Greg Keller",
    date: "Oct 2026",
    category: "Identity Security",
    link: "/article/guest-redefining-identity-security",
    description: "Navigating identity perimeter dissolution, continuous machine-to-machine authentication, and automated credential governance in modern hybrid enterprises.",
  },
  {
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=90",
    title: "Guarding Against Exploits: Best Practices for Securing Enterprise AI Agents",
    author: "Gal Moyal",
    date: "Oct 2026",
    category: "AI Defense",
    link: "/article/guest-securing-agentic-ai",
    description: "Mitigating memory poisoning, indirect prompt injection, and multi-agent coordination risks across mission-critical enterprise workflows.",
  },
  {
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=90",
    title: "Modern Cyber Extortion: Why Data Leakage Has Become the Primary Currency",
    author: "GETprospeKt Cyber Labs",
    date: "Sep 2026",
    category: "Threat Landscape",
    link: "/article/cybersecurity-pipeline",
    description: "Analyzing how extortion syndicates shifted from pure disk encryption to aggressive data exfiltration, bypassing traditional endpoint backups.",
  },
  {
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=90",
    title: "Industrial IoT Security: Securing Critical Operational Technology (OT) Networks",
    author: "Michael Skurla",
    date: "Sep 2026",
    category: "IoT & Infrastructure",
    link: "/article/b2b-technology",
    description: "Aggregating telemetry from industrial control environments while enforcing strict Zero Trust inspection across connected physical sensors and SCADA nodes.",
  },
  {
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=90",
    title: "Penetration Testing Standardisation: Operationalising NIST SP 800-115 & OWASP",
    author: "GETprospeKt Research",
    date: "Sep 2026",
    category: "Compliance & Testing",
    link: "/article/enterprise-technology",
    description: "Standardizing offensive security validation, continuous automated red teaming, and verifiable remediation reporting for enterprise compliance audits.",
  },
  {
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=90",
    title: "Account-Based Pipeline Engineering in Cyber & Enterprise Tech",
    author: "GETprospeKt",
    date: "Sep 2026",
    category: "ABM & Account Intelligence",
    link: "/article/abm-enterprise-account-intelligence",
    description: "How enterprise revenue teams map complex CISO buying committees and accelerate multi-stakeholder cybersecurity pipeline.",
  },
];

const popularArticles: Article[] = [
  {
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=90",
    title: "2026 CISO Executive Agenda: Tool Consolidation & Vendor Rationalisation",
    author: "Elena Rostova",
    date: "Trending",
    category: "Leadership / CISO",
    link: "/article/enterprise-technology",
    description: "Why security leaders are eliminating standalone point tools in favor of integrated platforms to curb cost and operational complexity.",
  },
  {
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=90",
    title: "Zero Trust for Machine Identities: Securing Workloads, Containers, and APIs",
    author: "Greg Keller",
    date: "Most Read",
    category: "Zero Trust Architecture",
    link: "/article/guest-redefining-identity-security",
    description: "Expanding Zero Trust beyond human employees to encompass non-human service accounts, Kubernetes pods, and microservice certificates.",
  },
  {
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=90",
    title: "Ransomware Defense Playbook: Halting Lateral Movement in Hybrid Environments",
    author: "GETprospeKt Cyber Labs",
    date: "Popular",
    category: "Incident Response",
    link: "/article/cybersecurity-pipeline",
    description: "Network micro-segmentation and behavioral endpoint inspection strategies that stop ransomware payloads before they compromise active directory.",
  },
  {
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=90",
    title: "Securing the Modern Software Supply Chain Against Dependency Infiltration",
    author: "GETprospeKt Research",
    date: "Featured",
    category: "Application Security",
    link: "/article/b2b-technology",
    description: "Implementing automated Software Bills of Materials (SBOM), continuous open-source package scanning, and signed artifact enforcement.",
  },
  {
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=90",
    title: "Enterprise Data Privacy & Sovereignty: Cross-Border Compliance in the AI Era",
    author: "Nick Henthorn",
    date: "Trending",
    category: "Data Privacy & Compliance",
    link: "/article/guest-first-party-data",
    description: "Navigating GDPR, CCPA, and emerging global data residency mandates while training and deploying enterprise machine learning systems.",
  },
  {
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=90",
    title: "Automated Threat Hunting: Empowering Level-1 Analysts with Generative Insights",
    author: "Ahmed Achchak",
    date: "Hot Topic",
    category: "SOC & Intelligence",
    link: "/article/guest-soc-alert-fatigue-automation",
    description: "Using natural-language threat investigation assistants to correlate multi-source SIEM logs and accelerate incident containment.",
  },
  {
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=90",
    title: "Endpoint Resilience Beyond EDR: Enforcing Continuous Integrity Across Fleets",
    author: "David Sterling",
    date: "Most Read",
    category: "Endpoint Protection",
    link: "/article/enterprise-technology",
    description: "How hardware-rooted firmware verification and self-healing OS agents prevent persistence from advanced nation-state threat actors.",
  },
  {
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=90",
    title: "Third-Party Risk Management: Assessing Cyber Posture in Vendor Ecosystems",
    author: "Marcus Vance",
    date: "Trending",
    category: "Enterprise Risk",
    link: "/article/b2b-technology",
    description: "Moving beyond passive annual questionnaires to continuous passive telemetry and verified vendor security scorecards.",
  },
  {
    image: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?auto=format&fit=crop&w=1200&q=90",
    title: "Defending Critical SaaS Workloads Against Token Hijacking & Session Theft",
    author: "GETprospeKt Editorial",
    date: "Featured",
    category: "SaaS Security",
    link: "/article/saas-pipeline-acceleration",
    description: "Preventing adversary-in-the-middle phishing attacks and cookie exfiltration across enterprise Microsoft 365, Google Workspace, and Salesforce.",
  },
  {
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=90",
    title: "Executive Cyber Crisis Playbook: Board Communication & Incident Response",
    author: "Elena Rostova",
    date: "Essential",
    category: "Executive Strategy",
    link: "/article/enterprise-technology",
    description: "Structuring transparent executive disclosures, regulatory timelines, and customer communications during mission-critical breach containment.",
  },
];

function Home() {
  const [activeTab, setActiveTab] =
    useState<"latest" | "popular">("latest");

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

  const tabArticles =
    activeTab === "latest"
      ? (latestList.length > 1 ? latestList.slice(1) : latestArticles.slice(1))
      : (popularList.length > 0 ? popularList : popularArticles);

  return (
    <>
      <main className="publication-home">
        <div className="publication-container">


          {/* ================= LATEST ================= */}

          <section className="latest-section">

            <div className="section-title-row">
              <h1>Latest</h1>
              <div className="section-line" />
            </div>

            <div className="latest-layout">

              <article className="featured-article">

                <a
                  href={heroArticle.link}
                  className="featured-link"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = heroArticle.link;
                  }}
                  aria-label={`Open ${heroArticle.title}`}
                >

                  <div className="featured-image-wrap">
                    <img
                      src={heroArticle.image}
                      alt={heroArticle.title}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22600%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%230D1522%22%2F%3E%3C%2Fsvg%3E";
                      }}
                    />
                  </div>

                  <div className="featured-content">

                    <span className="article-category">
                      {heroArticle.category}
                    </span>

                    <h2>
                      {heroArticle.title}
                    </h2>

                    <div className="article-meta">
                      By{" "}
                      <strong>
                        {heroArticle.author}
                      </strong>

                      {heroArticle.date && (
                        <>
                          <span>|</span>
                          {heroArticle.date}
                        </>
                      )}
                    </div>

                    <p>
                      {heroArticle.description}
                    </p>

                    <span
                      className="read-more"
                      role="link"
                      tabIndex={0}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.location.href = heroArticle.link;
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          window.location.href = heroArticle.link;
                        }
                      }}
                    >
                      Read More →
                    </span>

                  </div>

                </a>

              </article>

              {/* ================= SIDE LATEST ================= */}

              <aside className="latest-sidebar">

                <div className="tabs">

                  <button
                    type="button"
                    className={
                      activeTab === "latest"
                        ? "tab active"
                        : "tab"
                    }
                    onClick={() =>
                      setActiveTab("latest")
                    }
                  >
                    Latest
                  </button>

                  <button
                    type="button"
                    className={
                      activeTab === "popular"
                        ? "tab active"
                        : "tab"
                    }
                    onClick={() =>
                      setActiveTab("popular")
                    }
                  >
                    Popular
                  </button>

                </div>

                {tabArticles.map((article) => (
                  <article
                    className="side-article"
                    key={article.link}
                  >

                    <a
                      href={article.link}
                      className="side-image-link"
                    >
                      <img
                        src={article.image}
                        alt={article.title}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src =
                            "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=90";
                        }}
                      />
                    </a>

                    <div>

                      <span className="article-category">
                        {article.category}
                      </span>

                      <h3>
                        <a href={article.link}>
                          {article.title}
                        </a>
                      </h3>

                      <div className="article-meta">
                        By{" "}
                        <strong>
                          {article.author}
                        </strong>

                        <span>|</span>

                        {article.date}
                      </div>

                      <p>
                        {article.description}
                      </p>

                    </div>

                  </article>
                ))}

              </aside>

            </div>

          </section>


          {/* ================= MORE ================= */}

          <section className="more-section">

            <div className="section-title-row">
              <h2>Our Lead-Generation Solutions</h2>
              <div className="section-line" />
            </div>

            <div className="more-layout">

              <div className="more-list">

                {solutions.map((sol) => (
                  <article
                    className="more-article"
                    key={sol.id || sol.path}
                  >

                    <Link
                      to={sol.path}
                      className="more-image-link"
                    >
                      <img
                        src={sol.image}
                        alt={sol.title}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22600%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%230D1522%22%2F%3E%3C%2Fsvg%3E";
                        }}
                      />
                    </Link>

                    <div className="more-content">

                      <span className="article-category">
                        {sol.tag || "Lead-Generation Solution"}
                      </span>

                      <h3>
                        <Link to={sol.path}>
                          {sol.title}
                        </Link>
                      </h3>

                      <div className="article-meta">
                        By{" "}
                        <strong>
                          GETprospeKt
                        </strong>

                        <span>|</span>

                        Lead-Gen Solution
                      </div>

                      <p>
                        {sol.description}
                      </p>

                    </div>

                  </article>
                ))}

              </div>


              {/* ================= prospeKt ================= */}

              <aside className="promo-column">

                <div className="promo-card">

                  <div className="promo-logo">
                    <span>TALK</span>
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

                <a
                  href="#"
                  className="promo-image"
                >
                  <img
                    src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=90"
                    alt="B2B Lead technology"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22600%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%230D1522%22%2F%3E%3C%2Fsvg%3E";
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

            <a
              href="#"
              className="podcast-card"
            >

              <div className="podcast-icon">
                ▶
              </div>

              <div>

                <span>
                  THE GETPROSPEKT APPROACH
                </span>

                <h3>
                  Conversations with Marketing
                  &amp; Technology Leaders
                </h3>

                <p>
                  Explore expert conversations,
                  technology insights and industry
                  perspectives from marketing leaders.
                </p>

              </div>

            </a>

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
          width: min(
            1380px,
            calc(100% - 48px)
          );

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
          font-size: 40px;
          line-height: 1.15;
          font-weight: 700;
          white-space: nowrap;
          color: #FFFFFF;
        }

        .section-line {
          flex: 1;
          height: 1px;
          background: rgba(203, 213, 225, 0.12);
        }

        /* LATEST */

        .latest-layout {
          display: grid;
          grid-template-columns:
            minmax(0, 1.75fr)
            minmax(320px, .72fr);
          gap: 26px;
          align-items: start;
        }

        .featured-article {
          min-width: 0;
        }

        .featured-link {
          display: block;
          color: inherit;
          text-decoration: none;
          cursor: pointer;
        }

        .featured-link .read-more {
          cursor: pointer;
        }

        .featured-image-wrap {
          width: 100%;
          height: 380px;
          overflow: hidden;
          border-radius: 7px;
          background: #0D1522;
        }

        .featured-image-wrap img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          transition: transform .35s ease;
        }

        .featured-link:hover
        .featured-image-wrap img {
          transform: scale(1.025);
        }

        .featured-content {
          padding-top: 15px;
        }

        .article-category {
          display: block;
          margin-bottom: 8px;
          color: #00D2FF;
          font-size: 15px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .45px;
        }

        .featured-content h2 {
          margin: 0 0 10px;
          font-size: 40px;
          line-height: 1.2;
          letter-spacing: -.45px;
          color: #FFFFFF;
        }

        .article-meta {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 6px;
          color: #AEB8CA;
          font-size: 16px;
          line-height: 1.45;
        }

        .featured-content p {
          margin: 10px 0 0;
          font-size: 18px;
          line-height: 1.5;
          color: #D5DBE7;
        }

        .read-more {
          display: inline-block;
          margin-top: 10px;
          color: #00D2FF;
          font-size: 16px;
          font-weight: 700;
        }

        .latest-sidebar {
          min-width: 0;
          border-left: 1px solid rgba(203, 213, 225, 0.12);
          padding-left: 15px;
        }

        .tabs {
          display: flex;
          gap: 20px;
          border-bottom: 1px solid rgba(203, 213, 225, 0.12);
          margin-bottom: 2px;
        }

        .tab {
          position: relative;
          border: 0;
          background: transparent;
          padding: 0 0 11px;
          color: #AEB8CA;
          font-size: 18px;
          font-weight: 700;
          cursor: pointer;
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
          height: 2px;
          background: #0046FC;
        }

        .side-article {
          padding: 13px 0;
          border-bottom: 1px solid rgba(203, 213, 225, 0.12);
        }

        .side-image-link {
          display: none;
        }

        .side-article h3 {
          margin: 0 0 8px;
          font-size: 24px;
          line-height: 1.18;
          letter-spacing: -.25px;
          color: #FFFFFF;
        }

        .side-article h3 a {
          color: inherit;
          text-decoration: none;
        }

        .side-article h3 a:hover {
          color: #00D2FF;
        }

        .side-article p {
          margin: 8px 0 0;
          font-size: 16px;
          line-height: 1.45;
          color: #D5DBE7;
        }

        /* MORE */

        .more-section {
          margin-top: 42px;
        }

        .more-layout {
          display: grid;
          grid-template-columns:
            minmax(0, 1.75fr)
            minmax(300px, .72fr);
          gap: 28px;
          align-items: start;
        }

        .more-list {
          min-width: 0;
        }

        .more-article {
          display: grid;
          grid-template-columns:
            245px
            minmax(0, 1fr);
          gap: 25px;
          padding: 0 0 17px;
          margin-bottom: 18px;
          border-bottom: 1px solid rgba(203, 213, 225, 0.12);
        }

        .more-image-link {
          display: block;
          width: 245px;
          height: 148px;
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

        .more-image-link::after {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 60%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.22),
            transparent
          );
          transform: skewX(-25deg);
          transition: left 0.75s ease-out;
          pointer-events: none;
        }

        .more-image-link:hover::after {
          left: 180%;
        }

        .more-image-link img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          transition: transform .45s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .more-image-link:hover img {
          transform: scale(1.05);
        }

        .more-content {
          min-width: 0;
        }

        .more-content h3 {
          margin: 0 0 8px;
          font-size: 29px;
          line-height: 1.17;
          letter-spacing: -.3px;
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
          font-size: 17px;
          line-height: 1.45;
          color: #D5DBE7;
        }

        /* PROMO */

        .promo-column {
          min-width: 0;
          border-left: 1px solid rgba(203, 213, 225, 0.12);
          padding-left: 15px;
        }

        .promo-card {
          position: relative;
          min-height: 255px;
          padding: 15px 0 20px;
          text-align: center;
          background: #0D1522;
          border-radius: 8px;
          border: 1px solid rgba(203, 213, 225, 0.12);
        }

        .promo-logo {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          margin-bottom: 38px;
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
          font-size: 40px;
          line-height: 1.12;
        }

        .promo-card p {
          margin: 5px 0 0;
          color: #FFFFFF;
          font-size: 40px;
          line-height: 1.15;
          font-weight: 300;
        }

        .promo-line {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 10px;
          background: #0046FC;
        }

        .promo-image {
          display: block;
          width: 100%;
          height: 245px;
          overflow: hidden;
          background: #0D1522;
          border-radius: 8px;
        }

        .promo-image img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
        }

        /* PODCAST */

        .podcast-section {
          margin-top: 55px;
        }

        .podcast-card {
          display: flex;
          align-items: center;
          gap: 22px;
          padding: 25px;
          color: inherit;
          text-decoration: none;
          background: #0D1522;
          border: 1px solid rgba(203, 213, 225, 0.12);
          border-radius: 8px;
        }

        .podcast-icon {
          width: 58px;
          height: 58px;
          flex: 0 0 58px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #0046FC;
          color: #fff;
          font-size: 20px;
        }

        .podcast-card span {
          display: block;
          margin-bottom: 6px;
          color: #00D2FF;
          font-size: 15px;
          font-weight: 800;
          letter-spacing: 1px;
        }

        .podcast-card h3 {
          margin: 0 0 7px;
          font-size: 29px;
          line-height: 1.3;
          color: #FFFFFF;
        }

        .podcast-card p {
          margin: 0;
          color: #AEB8CA;
          font-size: 17px;
          line-height: 1.5;
        }

        /* =================================================
           DEVELOPERS GUIDE BANNER
           ================================================= */

        .developers-guide-banner {
          width: 100%;
          margin: 0 0 34px;
          overflow: hidden;
          background: #0D1522;
          border-top: 1px solid rgba(203, 213, 225, 0.12);
          border-bottom: 1px solid rgba(203, 213, 225, 0.12);
        }

        .developers-guide-inner {
          min-height: 196px;
          display: grid;
          grid-template-columns: 110px minmax(0, 1fr) minmax(260px, 42%);
          align-items: center;
          background: #0D1522;
        }

        .developers-guide-logo {
          position: relative;
          justify-self: center;
          display: flex;
          align-items: flex-end;
          gap: 2px;
          padding-bottom: 8px;
          color: #FFFFFF;
          font-size: 16px;
          line-height: 1;
          font-weight: 400;
        }

        .developers-guide-logo strong {
          color: #FFFFFF;
          font-size: 20px;
          font-weight: 900;
        }

        .developers-guide-logo i {
          position: absolute;
          right: -15px;
          bottom: 4px;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #0046FC;
        }

        .developers-guide-logo i::after {
          content: "";
          position: absolute;
          width: 6px;
          height: 6px;
          top: 6px;
          left: 6px;
          border-radius: 50%;
          background: #fff;
        }

        .developers-guide-title {
          padding: 20px 25px;
          font-size: clamp(28px, 3.2vw, 43px);
          line-height: 1.15;
          letter-spacing: -.5px;
          color: #FFFFFF;
        }

        .developers-guide-title span,
        .developers-guide-title strong {
          display: block;
        }

        .developers-guide-title span {
          font-weight: 400;
        }

        .developers-guide-title strong {
          font-weight: 800;
        }

        /* Empty visual area intentionally kept to preserve the banner structure.
           No photo/image is used here. */
        .developers-guide-visual {
          height: 100%;
          min-height: 196px;
          background:
            linear-gradient(
              90deg,
              #0D1522 0%,
              #0D1522 8%,
              #111C2D 8%,
              #111C2D 100%
            );
          position: relative;
        }

        .developers-guide-visual::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          width: 16px;
          height: 100%;
          background: #0046FC;
          border-radius: 50% 0 0 50%;
          transform: translateX(-8px);
        }

        @media (max-width: 900px) {
          .developers-guide-banner {
            margin-bottom: 28px;
          }

          .developers-guide-inner {
            min-height: 150px;
            grid-template-columns: 75px minmax(0, 1fr) 28%;
          }

          .developers-guide-visual {
            min-height: 150px;
          }

          .developers-guide-logo {
            font-size: 10px;
          }

          .developers-guide-logo strong {
            font-size: 16px;
          }

          .developers-guide-logo i {
            width: 14px;
            height: 14px;
            right: -11px;
          }

          .developers-guide-logo i::after {
            width: 5px;
            height: 5px;
            top: 4.5px;
            left: 4.5px;
          }

          .developers-guide-title {
            padding: 15px;
            font-size: clamp(22px, 4vw, 32px);
          }
        }

        @media (max-width: 600px) {
          .developers-guide-banner {
            margin-bottom: 22px;
          }

          .developers-guide-inner {
            min-height: 110px;
            grid-template-columns: 55px minmax(0, 1fr) 18%;
          }

          .developers-guide-visual {
            min-height: 110px;
          }

          .developers-guide-title {
            padding: 10px;
            font-size: clamp(17px, 5vw, 24px);
          }
        }

        /* =================================================
           GUEST AUTHOR
           ================================================= */

        .guest-author-section {
          width: 100%;
          background: #111C2D;
          padding: 52px 0 48px;
          overflow: hidden;
        }

        .guest-author-heading {
          width: min(
            1380px,
            calc(100% - 48px)
          );
          margin: 0 auto 30px;
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .guest-author-heading h2 {
          margin: 0;
          color: #FFFFFF;
          background: #060B12;
          border: 1px solid rgba(203, 213, 225, 0.14);
          padding: 9px 22px;
          font-size: 40px;
          line-height: 1.2;
          font-weight: 700;
          white-space: nowrap;
        }

        .guest-heading-line {
          flex: 1;
          height: 1px;
          background: rgba(203, 213, 225, 0.16);
        }

        .guest-slider-wrapper {
          position: relative;
          width: 100%;
        }

        .guest-track {
          display: flex;
          gap: 22px;
          overflow-x: auto;
          scroll-behavior: auto;
          scrollbar-width: none;
          padding: 0 7.5%;
          overscroll-behavior-x: none;
          -ms-overflow-style: none;
        }

        .guest-track::-webkit-scrollbar {
          display: none;
        }

        .guest-author-card {
          position: relative;
          flex: 0 0 345px;
          width: 345px;
          min-width: 345px;
          height: 215px;
          overflow: hidden;
          border-radius: 4px;
          background: #0D1522;
          border: 1px solid rgba(203, 213, 225, 0.12);
          color: #FFFFFF;
          text-decoration: none;
          box-shadow: 0 3px 12px rgba(0, 0, 0, 0.3);
          transition:
            transform .3s ease,
            box-shadow .3s ease;
        }

        .guest-author-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
        }

        .guest-track {
          cursor: grab;
        }

        .guest-track:active {
          cursor: grabbing;
        }

        .guest-card-top {
          position: relative;
          width: 100%;
          height: 100%;
          background: transparent;
          overflow: hidden;
        }

        .guest-poster {
          position: absolute;
          top: 0;
          right: 0;
          width: 64%;
          height: 100%;
          background: transparent;
          overflow: hidden;
          padding: 16px 14px 12px 8px;
        }

        .guest-poster::before {
          content: "";
          position: absolute;
          width: 80px;
          height: 80px;
          top: -28px;
          right: 28px;
          border-radius: 50%;
          background: rgba(255,255,255,.40);
        }

        .guest-poster::after {
          content: "";
          position: absolute;
          width: 58px;
          height: 58px;
          bottom: -28px;
          right: 8px;
          border-radius: 50%;
          background: rgba(255,255,255,.40);
        }

        .guest-poster-brand {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2px;
          color: #AEB8CA;
          font-size: 13px;
          font-weight: 400;
          white-space: nowrap;
        }

        .guest-poster-brand strong {
          color: #00D2FF;
        }

        .guest-poster-brand i {
          width: 12px;
          height: 12px;
          margin-left: 1px;
          border-radius: 50%;
          background: #0046FC;
          display: inline-block;
        }

        .guest-poster-title {
          position: relative;
          z-index: 2;
          margin-top: 14px;
          max-width: 215px;
          font-size: 27px;
          line-height: 0.98;
          font-weight: 800;
          letter-spacing: -.3px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          color: #FFFFFF;
        }

        .guest-poster-name,
        .guest-poster-role,
        .guest-poster-company {
          display: none;
        }

        .guest-photo-circle {
          position: absolute;
          z-index: 5;
          left: 12px;
          top: 43px;
          width: 108px;
          height: 108px;
          border-radius: 50%;
          padding: 4px;
          background: #0046FC;
          box-shadow: 0 0 0 2px #0D1522;
        }

        .guest-photo-circle img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          display: block;
          border: 3px solid #0D1522;
        }

        .guest-card-bottom {
          position: absolute;
          z-index: 4;
          top: 112px;
          right: 10px;
          width: 61%;
          height: 76px;
          padding: 0 5px 0 8px;
          background: transparent;
        }

        .guest-card-bottom p {
          margin: 0;
          color: #D5DBE7;
          font-size: 13.5px;
          line-height: 1.28;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .guest-arrow {
          position: absolute;
          z-index: 10;
          top: 50%;
          transform: translateY(-50%);
          width: 55px;
          height: 55px;
          border: 2px solid #fff;
          border-radius: 50%;
          background: rgba(0,0,0,.16);
          color: #fff;
          font-size: 48px;
          line-height: 40px;
          font-weight: 200;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition:
            background .2s ease,
            transform .2s ease;
        }

        .guest-arrow:hover {
          background: rgba(0,0,0,.32);
        }

        .guest-arrow-left {
          left: 25px;
        }

        .guest-arrow-right {
          right: 25px;
        }

        /* 1200 */

        @media (max-width: 1200px) {

          .publication-container {
            width: calc(100% - 40px);
          }

          .featured-image-wrap {
            height: 350px;
          }

          .featured-content h2 {
            font-size: 28px;
          }

          .more-article {
            grid-template-columns:
              210px
              minmax(0, 1fr);
          }

          .more-image-link {
            width: 210px;
            height: 135px;
          }

          .more-content h3 {
            font-size: 20px;
          }

          .guest-author-heading {
            width: calc(100% - 40px);
          }

          .guest-track {
            padding-left: 6%;
            padding-right: 6%;
          }

        }

        /* 1000 */

        @media (max-width: 1000px) {

          .latest-layout {
            grid-template-columns: 1fr;
          }

          .featured-image-wrap {
            height: 410px;
          }

          .latest-sidebar {
            border-left: 0;
            padding-left: 0;
          }

          .side-article {
            display: grid;
            grid-template-columns:
              105px
              minmax(0, 1fr);
            gap: 14px;
          }

          .side-image-link {
            display: block;
            width: 105px;
            height: 80px;
            overflow: hidden;
            border-radius: 5px;
          }

          .side-image-link img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .more-layout {
            grid-template-columns: 1fr;
          }

          .promo-column {
            border-left: 0;
            padding-left: 0;
          }

          .promo-card,
          .promo-image {
            max-width: 450px;
          }

          .guest-author-card {
            flex-basis: 345px;
            min-width: 345px;
            width: 345px;
            height: 250px;
          }

        }

        /* 760 */

        @media (max-width: 760px) {

          .publication-container {
            width: calc(100% - 30px);
            padding-bottom: 45px;
          }

          .section-title-row h1,
          .section-title-row h2 {
            font-size: 27px;
          }

          .featured-image-wrap {
            height: 310px;
          }

          .featured-content h2 {
            font-size: 29px;
          }

          .side-article h3 {
            font-size: 20px;
          }

          .more-article {
            grid-template-columns:
              180px
              minmax(0, 1fr);
            gap: 18px;
          }

          .more-image-link {
            width: 180px;
            height: 125px;
          }

          .more-content h3 {
            font-size: 24px;
          }

          .more-content p {
            font-size: 15px;
          }

          .guest-author-section {
            padding: 38px 0 35px;
          }

          .guest-author-heading {
            width: calc(100% - 30px);
            margin-bottom: 20px;
          }

          .guest-author-heading h2 {
            font-size: 22px;
            padding: 7px 15px;
          }

          .guest-track {
            gap: 14px;
            padding: 0 30px;
          }

          .guest-author-card {
            flex: 0 0 calc(100vw - 60px);
            min-width: calc(100vw - 60px);
            width: calc(100vw - 60px);
            height: 250px;
          }

          .guest-photo-circle {
            width: 108px;
            height: 108px;
            top: 65px;
          }

          .guest-poster-title {
            font-size: 28px;
          }

          .guest-card-bottom {
            top: 104px;
          }

          .guest-arrow {
            width: 42px;
            height: 42px;
            font-size: 38px;
          }

          .guest-arrow-left {
            left: 7px;
          }

          .guest-arrow-right {
            right: 7px;
          }

        }

        /* 560 */

        @media (max-width: 560px) {

          .publication-container {
            width: calc(100% - 20px);
          }

          .section-title-row {
            gap: 10px;
          }

          .section-title-row h1,
          .section-title-row h2 {
            font-size: 24px;
          }

          .featured-image-wrap {
            height: 240px;
          }

          .featured-content h2 {
            font-size: 22px;
          }

          .featured-content p {
            font-size: 14px;
          }

          .side-article {
            grid-template-columns:
              82px
              minmax(0, 1fr);
            gap: 11px;
          }

          .side-image-link {
            width: 82px;
            height: 65px;
          }

          .side-article h3 {
            font-size: 18px;
          }

          .side-article p {
            display: none;
          }

          .side-article .article-category {
            font-size: 8px;
            margin-bottom: 4px;
          }

          .side-article .article-meta {
            font-size: 9px;
          }

          .more-article {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .more-image-link {
            width: 100%;
            height: 215px;
          }

          .more-content h3 {
            font-size: 22px;
          }

          .promo-card h3 {
            font-size: 27px;
          }

          .promo-card p {
            font-size: 26px;
          }

          .promo-image {
            height: 210px;
          }

          .podcast-card {
            padding: 18px;
            gap: 14px;
          }

          .podcast-icon {
            width: 48px;
            height: 48px;
            flex-basis: 48px;
          }

          .podcast-card h3 {
            font-size: 20px;
          }

          .guest-author-card {
            flex-basis: calc(100vw - 40px);
            min-width: calc(100vw - 40px);
            width: calc(100vw - 40px);
            height: 240px;
          }

          .guest-track {
            padding: 0 20px;
          }

          .guest-poster {
            width: 65%;
            padding-left: 8px;
          }

          .guest-photo-circle {
            width: 105px;
            height: 105px;
            left: 7px;
            top: 57px;
          }

          .guest-poster-title {
            font-size: 19px;
            margin-top: 50px;
          }

          .guest-card-bottom {
            top: 123px;
            width: 62%;
          }

          .guest-card-bottom p {
            font-size: 14px;
          }

        }

        /* 380 */

        @media (max-width: 380px) {

          .publication-container {
            width: calc(100% - 16px);
          }

          .featured-image-wrap {
            height: 205px;
          }

          .featured-content h2 {
            font-size: 19px;
          }

          .side-article {
            grid-template-columns:
              70px
              minmax(0, 1fr);
          }

          .side-image-link {
            width: 70px;
            height: 58px;
          }

          .side-article h3 {
            font-size: 14px;
          }

          .more-image-link {
            height: 190px;
          }

          .more-content h3 {
            font-size: 24px;
          }

          .promo-card h3 {
            font-size: 28px;
          }

          .promo-card p {
            font-size: 22px;
          }

          .guest-author-card {
            flex-basis: calc(100vw - 30px);
            min-width: calc(100vw - 30px);
            width: calc(100vw - 30px);
            height: 225px;
          }

          .guest-track {
            padding: 0 15px;
          }

          .guest-photo-circle {
            width: 94px;
            height: 94px;
            top: 55px;
          }

          .guest-poster-title {
            font-size: 19px;
            margin-top: 46px;
          }

          .guest-card-bottom {
            top: 116px;
          }

          .guest-card-bottom p {
            font-size: 9.5px;
          }

        }

      `}</style>
    </>
  );
}

export default Home;
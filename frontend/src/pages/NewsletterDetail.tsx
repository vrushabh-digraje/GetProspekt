import { useState, useEffect, type FormEvent } from "react";
import { useParams, Link } from "react-router-dom";
import {
  newslettersStorageApi,
  enquiriesApi,
  type NewsletterData,
  type NewsletterLandingPageRef,
} from "../services/api";

export default function NewsletterDetail() {
  const { slug = "" } = useParams<{ slug: string }>();

  const [newsletter, setNewsletter] = useState<NewsletterData | null>(() => {
    return newslettersStorageApi.getBySlug(slug) || null;
  });

  const [allNewsletters, setAllNewsletters] = useState<NewsletterData[]>(() => {
    return newslettersStorageApi.getAll();
  });

  // Gated form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    company: "",
    jobTitle: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Sync newsletter when slug changes or storage updates
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const current = newslettersStorageApi.getBySlug(slug);
    setNewsletter(current || null);
    setAllNewsletters(newslettersStorageApi.getAll());
    setIsSubscribed(false);
    setSubmitError("");
  }, [slug]);

  useEffect(() => {
    const handleSync = () => {
      const updated = newslettersStorageApi.getBySlug(slug);
      if (updated) setNewsletter(updated);
      setAllNewsletters(newslettersStorageApi.getAll());
    };
    window.addEventListener("gp_newsletters_updated", handleSync);
    return () => window.removeEventListener("gp_newsletters_updated", handleSync);
  }, [slug]);

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.email.trim()) {
      setSubmitError("Please enter your business email.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    const parts = (formData.fullName.trim() || "Executive Subscriber").split(" ");
    const firstName = parts[0] || "Executive";
    const lastName = parts.slice(1).join(" ") || "Subscriber";

    try {
      await enquiriesApi.submit({
        firstName,
        lastName,
        email: formData.email,
        company: formData.company || "Enterprise Account",
        jobTitle: formData.jobTitle || "Executive",
        type: "subscription",
        subject: `Newsletter Subscription: ${newsletter?.title || slug}`,
        message: `Subscribed to Newsletter Dispatch: ${newsletter?.title || slug} [Job Title: ${formData.jobTitle || "Not specified"}]`,
      });
      setIsSubscribed(true);
    } catch (err) {
      console.warn("Subscription submission fallback:", err);
      setIsSubscribed(true); // Graceful fallback
    } finally {
      setIsSubmitting(false);
    }
  };

  // If newsletter not found
  if (!newsletter) {
    return (
      <main className="gp-nl-page">
        <div className="gp-hero-bg">
          <div className="gp-bg-grid-pattern" />
          <div className="gp-ambient-orb gp-ambient-one" />
        </div>
        <div className="gp-nl-content-layer">
          <div className="gp-nl-container" style={{ padding: "80px 24px" }}>
            <div className="gp-nl-not-found-card">
              <span className="gp-nl-not-found-icon">📬</span>
              <h1>Newsletter Dispatch Not Found</h1>
              <p>
                We couldn't locate the newsletter edition for <code>{slug}</code>. It may have been archived or updated.
              </p>
              <div className="gp-nl-not-found-actions">
                <Link to="/newsletters" className="gp-btn-primary">
                  Browse All Newsletters Directory →
                </Link>
                <Link to="/" className="gp-btn-secondary">
                  Return to Home
                </Link>
              </div>

              <div className="gp-nl-recent-dispatches">
                <h3>Available Dispatches:</h3>
                <div className="gp-nl-recent-grid">
                  {allNewsletters.slice(0, 4).map((item) => (
                    <Link key={item._id} to={`/newsletter/${item.slug}`} className="gp-nl-recent-item">
                      <strong>{item.title}</strong>
                      <span>{item.frequency} · {item.category}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Sibling newsletters to explore
  const siblingNewsletters = allNewsletters.filter((n) => n.slug !== newsletter.slug).slice(0, 3);

  // Featured landing pages fallback
  const featuredLandingPages: NewsletterLandingPageRef[] = newsletter.featuredLandingPages && newsletter.featuredLandingPages.length > 0
    ? newsletter.featuredLandingPages
    : [
        {
          title: "Intent-Driven Outbound Orchestration",
          category: "Solution Landing Page",
          link: "/solutions",
          description: "Multi-channel account-based plays activating high-intent buyer surges before competitors engage.",
          badge: "Featured Solution",
        },
        {
          title: "Better Pipeline Starts With Better Decisions",
          category: "Editorial Deep Dive",
          link: "/article/better-pipeline-starts-with-better-decisions",
          description: "Why enterprise marketing leaders are replacing volume vanity metrics with verified intent qualification.",
          badge: "Must Read",
        },
        {
          title: "Client Case Studies & Verified Pipeline ROI",
          category: "Case Studies Landing Page",
          link: "/case-studies",
          description: "How enterprise SaaS & cybersecurity marketing leaders scaled pipeline conversion by 312%.",
          badge: "Case Proof",
        },
        {
          title: "Executive Research & Resource Center",
          category: "Resources Landing Page",
          link: "/resources",
          description: "Download verified demand generation benchmarks and executive whitepapers.",
          badge: "Executive Library",
        },
      ];

  return (
    <main className="gp-nl-page">
      {/* SIGNATURE EXECUTIVE TECH GRID BACKGROUND */}
      <div className="gp-hero-bg">
        <div className="gp-bg-grid-pattern" />
        <div className="gp-ambient-orb gp-ambient-one" />
        <div className="gp-ambient-orb gp-ambient-two" />
        <div className="gp-ambient-orb gp-ambient-three" />
      </div>

      <div className="gp-nl-content-layer">
        {/* 1. TOP BREADCRUMB & HEADER STRIP */}
        <div className="gp-nl-breadcrumbs-strip">
          <div className="gp-nl-container">
            <nav className="gp-nl-breadcrumb" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span className="sep">/</span>
              <Link to="/newsletters">Newsletters</Link>
              <span className="sep">/</span>
              <span className="current">{newsletter.category}</span>
            </nav>
          </div>
        </div>

        {/* 2. HERO HEADER SECTION */}
        <header className="gp-nl-hero">
          <div className="gp-nl-container">
            <div className="gp-nl-hero-meta-top">
              <span className={`gp-nl-freq-pill freq-${newsletter.frequency.toLowerCase()}`}>
                {newsletter.frequency} Edition
              </span>
              <span className="gp-nl-category-tag">{newsletter.category}</span>
              <span className="gp-nl-published-badge">● Verified Dispatch</span>
            </div>

            <h1 className="gp-nl-hero-title">{newsletter.title}</h1>
            <p className="gp-nl-hero-summary">{newsletter.summary}</p>

            <div className="gp-nl-author-meta-bar">
              <div className="gp-nl-author-info">
                <span className="author-avatar-badge">✍</span>
                <div>
                  <strong>By {newsletter.author || "GETprospeKt Editorial Board"}</strong>
                  <span className="pub-date">Published {newsletter.date} · {newsletter.readTime || "5 min read"}</span>
                </div>
              </div>

              <div className="gp-nl-subscribers-pill">
                <span>👥</span>
                <strong>{newsletter.subscribersCount || "2,500+ Enterprise Readers"}</strong>
              </div>
            </div>

            {/* Hero Visual Media */}
            <div className="gp-nl-hero-media">
              <img
                src={newsletter.image}
                alt={newsletter.title}
                className="gp-nl-hero-img"
                loading="eager"
              />
              <div className="gp-nl-media-overlay-pill">
                <span className="pulse-dot" />
                <span>GETprospeKt Executive Intelligence Wire · {newsletter.category}</span>
              </div>
            </div>
          </div>
        </header>

        {/* 3. MAIN CONTENT BODY & SIDEBAR */}
        <div className="gp-nl-body-section">
          <div className="gp-nl-container gp-nl-layout-grid">
            {/* LEFT/CENTER: MAIN EDITORIAL DISPATCH */}
            <article className="gp-nl-article-main">
              {/* EXECUTIVE SYNOPSIS CALLOUT BOX */}
              <div className="gp-nl-callout-card">
                <div className="gp-nl-callout-head">
                  <span className="callout-icon">💡</span>
                  <h3>Executive Synopsis &amp; Decision Framework</h3>
                </div>
                <p>{newsletter.summary}</p>
              </div>

              {/* EDITORIAL ESSAY BODY */}
              <div className="gp-nl-prose">
                <h2>Executive Briefing &amp; Market Dynamics</h2>
                {newsletter.editorialBody && newsletter.editorialBody.length > 0 ? (
                  newsletter.editorialBody.map((paragraph, pIdx) => (
                    <p key={pIdx}>{paragraph}</p>
                  ))
                ) : (
                  <>
                    <p>
                      Enterprise pipeline velocity in modern B2B technology organizations is no longer governed by contact volume alone. Today, high-growth revenue engines rely on high-fidelity buyer intent signals, rigorously qualified against bespoke BANT criteria.
                    </p>
                    <p>
                      When account buying committees engage across technical architecture blueprints, peer benchmarks, and vendor pricing calculators, cross-functional sales and marketing teams must coordinate outreach within 48 hours to preserve conversion advantage.
                    </p>
                    <p>
                      In this dispatch, we analyze real-world campaign benchmarks and explore how executive leaders are aligning sales development, marketing operations, and demand orchestration into a unified pipeline architecture.
                    </p>
                  </>
                )}

                {/* HIGHLIGHTED TAKEAWAYS */}
                <div className="gp-nl-highlights-box">
                  <div className="gp-nl-highlights-title">
                    <span>🎯</span> Key Takeaways &amp; Scored Benchmarks
                  </div>
                  <ul className="gp-nl-highlights-items">
                    {newsletter.highlights && newsletter.highlights.length > 0 ? (
                      newsletter.highlights.map((h, hIdx) => (
                        <li key={hIdx}>
                          <span className="check-bullet">✓</span>
                          <span>{h}</span>
                        </li>
                      ))
                    ) : (
                      <>
                        <li>
                          <span className="check-bullet">✓</span>
                          <span>Verified first-party and third-party intent telemetry scoring</span>
                        </li>
                        <li>
                          <span className="check-bullet">✓</span>
                          <span>Strict ICP qualification checklists aligned with enterprise buying committees</span>
                        </li>
                        <li>
                          <span className="check-bullet">✓</span>
                          <span>Multi-touch outbound conversion metrics that drive predictable deal flow</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </div>

              {/* =========================================================================
                  FEATURED LANDING PAGES SECTION (INSIDE THE NEWSLETTER)
                  ALL LANDING PAGES ARE PROMINENTLY LISTED, CLICKABLE, AND OPEN DIRECTLY!
                  ========================================================================= */}
              <section className="gp-nl-landing-pages-section" id="featured-landing-pages">
                <div className="gp-nl-section-header">
                  <div className="gp-nl-badge-sm">🔗 Featured Landing Pages</div>
                  <h2 className="gp-nl-subheading">Landing Pages Featured in This Dispatch</h2>
                  <p className="gp-nl-subtext">
                    Explore the dedicated solution landing pages, verified playbooks, and in-depth research briefs referenced throughout this edition:
                  </p>
                </div>

                <div className="gp-nl-landing-grid">
                  {featuredLandingPages.map((lp, idx) => {
                    const isExternal = lp.link.startsWith("http");
                    return (
                      <div className="gp-nl-landing-card" key={idx}>
                        <div className="gp-nl-landing-card-top">
                          <span className="gp-nl-landing-cat">{lp.category}</span>
                          {lp.badge && <span className="gp-nl-landing-badge">{lp.badge}</span>}
                        </div>

                        <h3 className="gp-nl-landing-card-title">
                          {isExternal ? (
                            <a
                              href={lp.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="gp-nl-landing-title-link"
                            >
                              {lp.title}
                            </a>
                          ) : (
                            <Link to={lp.link} className="gp-nl-landing-title-link">
                              {lp.title}
                            </Link>
                          )}
                        </h3>

                        <p className="gp-nl-landing-card-desc">{lp.description}</p>

                        <div className="gp-nl-landing-card-footer">
                          <span className="gp-nl-landing-url-hint">
                            Target: <code>{lp.link}</code>
                          </span>

                          {isExternal ? (
                            <a
                              href={lp.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="gp-nl-landing-btn"
                            >
                              <span>Open Landing Page</span>
                              <span className="arrow">↗</span>
                            </a>
                          ) : (
                            <Link to={lp.link} className="gp-nl-landing-btn">
                              <span>Open Landing Page</span>
                              <span className="arrow">→</span>
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* SIBLING NEWSLETTERS: EXPLORE OTHER EDITIONS */}
              <section className="gp-nl-siblings-section">
                <div className="gp-nl-section-header">
                  <div className="gp-nl-badge-sm">📬 Other Dispatches</div>
                  <h2 className="gp-nl-subheading">More Executive Newsletters</h2>
                  <p className="gp-nl-subtext">
                    Browse other weekly dispatches, monthly industry pulses, and bi-weekly strategic briefings:
                  </p>
                </div>

                <div className="gp-nl-siblings-grid">
                  {siblingNewsletters.map((sib) => (
                    <article className="gp-nl-sib-card" key={sib._id}>
                      <Link to={`/newsletter/${sib.slug}`} className="gp-nl-sib-img-wrap">
                        <img src={sib.image} alt={sib.title} loading="lazy" />
                        <span className="gp-nl-sib-freq">{sib.frequency}</span>
                      </Link>

                      <div className="gp-nl-sib-content">
                        <span className="gp-nl-sib-cat">{sib.category}</span>
                        <h4 className="gp-nl-sib-title">
                          <Link to={`/newsletter/${sib.slug}`}>{sib.title}</Link>
                        </h4>
                        <p className="gp-nl-sib-summary">{sib.summary}</p>

                        <div className="gp-nl-sib-footer">
                          <span className="gp-nl-sib-date">{sib.date}</span>
                          <Link to={`/newsletter/${sib.slug}`} className="gp-nl-sib-link">
                            Open Landing Page →
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </article>

            {/* RIGHT COLUMN: INTERACTIVE GATED SUBSCRIPTION CARD */}
            <aside className="gp-nl-sidebar">
              <div className="gp-nl-subscribe-sticky-card">
                <div className="gp-nl-sub-card-badge">
                  <span>✉</span> Weekly Executive Briefing
                </div>

                <h3>Receive Next Edition Directly in Your Inbox</h3>
                <p>
                  Join over 15,000 senior B2B marketing leaders, CMOs, and growth executives. Guaranteed actionable pipeline intelligence every {newsletter.frequency.toLowerCase()}.
                </p>

                {isSubscribed ? (
                  <div className="gp-nl-sub-success">
                    <div className="success-icon">✓</div>
                    <h4>You're On The VIP Dispatch List!</h4>
                    <p>
                      Thank you for subscribing to <strong>{newsletter.title}</strong>. Future editions will be delivered directly to <strong>{formData.email}</strong>.
                    </p>
                    <button
                      className="gp-btn-reset-sub"
                      onClick={() => {
                        setIsSubscribed(false);
                        setFormData({ fullName: "", email: "", company: "", jobTitle: "" });
                      }}
                    >
                      Subscribe another colleague →
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="gp-nl-sub-form">
                    {submitError && <div className="gp-nl-form-error">{submitError}</div>}

                    <div className="gp-nl-input-group">
                      <label>Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Sarah Jenkins"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      />
                    </div>

                    <div className="gp-nl-input-group">
                      <label>Corporate Work Email *</label>
                      <input
                        type="email"
                        required
                        placeholder="sarah@enterprise.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>

                    <div className="gp-nl-input-group">
                      <label>Company Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Acme Corp"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      />
                    </div>

                    <div className="gp-nl-input-group">
                      <label>Job Title / Role</label>
                      <input
                        type="text"
                        placeholder="e.g. VP Demand Generation"
                        value={formData.jobTitle}
                        onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                      />
                    </div>

                    <button
                      type="submit"
                      className="gp-nl-submit-btn"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Registering..." : `Subscribe to ${newsletter.frequency} Dispatch`}
                    </button>

                    <div className="gp-nl-privacy-guarantee">
                      🔒 Zero spam policy. Strictly executive intelligence. Unsubscribe at any time with 1-click.
                    </div>
                  </form>
                )}

                {/* QUICK DIRECTORY LINK */}
                <div className="gp-nl-all-link-box">
                  <Link to="/newsletters" className="gp-nl-browse-all-btn">
                    Browse All Newsletters Directory →
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* EMBEDDED STYLES FOR THE NEWSLETTER LANDING PAGE */}
      <style>{`
        .gp-nl-page {
          background-color: #060B12;
          color: #D5DBE7;
          font-family: var(--font-sans);
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
        }

        /* SIGNATURE EXECUTIVE TECH GRID BACKGROUND */
        .gp-hero-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }

        .gp-bg-grid-pattern {
          position: absolute;
          inset: 0;
          background-color: #060B12;
          background-image: 
            radial-gradient(ellipse 85% 50% at 50% -10%, rgba(0, 70, 252, 0.16) 0%, transparent 65%),
            radial-gradient(circle at 90% 20%, rgba(0, 210, 255, 0.10) 0%, transparent 45%),
            radial-gradient(circle at 10% 70%, rgba(0, 70, 252, 0.08) 0%, transparent 40%),
            url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='%23CBD5E1' stroke-width='0.5' stroke-opacity='0.06'%3E%3Cpath d='M30 0v60M0 30h60'/%3E%3C/g%3E%3Ccircle cx='30' cy='30' r='1' fill='%2300D2FF' fill-opacity='0.20'/%3E%3Ccircle cx='0' cy='0' r='0.8' fill='%23CBD5E1' fill-opacity='0.08'/%3E%3Ccircle cx='60' cy='0' r='0.8' fill='%23CBD5E1' fill-opacity='0.08'/%3E%3Ccircle cx='60' cy='60' r='0.8' fill='%23CBD5E1' fill-opacity='0.08'/%3E%3C/g%3E%3C/svg%3E");
          background-size: 100% 100%, 100% 100%, 100% 100%, 60px 60px;
          background-position: center top, center top, center center, center center;
        }

        .gp-ambient-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
        }

        .gp-ambient-one {
          width: 500px;
          height: 500px;
          top: -80px;
          right: 12%;
          background: rgba(0, 210, 255, 0.14);
          animation: floatOne 11s ease-in-out infinite;
        }

        .gp-ambient-two {
          width: 440px;
          height: 440px;
          top: 36%;
          left: -60px;
          background: rgba(0, 70, 252, 0.16);
          animation: floatTwo 15s ease-in-out infinite;
        }

        .gp-ambient-three {
          width: 400px;
          height: 400px;
          bottom: 12%;
          right: 8%;
          background: rgba(0, 210, 255, 0.12);
          animation: floatOne 13s ease-in-out infinite reverse;
        }

        @keyframes floatOne {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-24px) scale(1.04); }
        }

        @keyframes floatTwo {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, -20px) scale(0.97); }
        }

        .gp-nl-content-layer {
          position: relative;
          z-index: 1;
        }

        .gp-nl-container {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* Breadcrumbs */
        .gp-nl-breadcrumbs-strip {
          background: transparent;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding: 14px 0;
          font-size: 13px;
        }
        .gp-nl-breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #64748B;
        }
        .gp-nl-breadcrumb a {
          color: #94A3B8;
          text-decoration: none;
          transition: color 0.15s;
        }
        .gp-nl-breadcrumb a:hover {
          color: #00D2FF;
        }
        .gp-nl-breadcrumb .sep {
          color: #475569;
        }
        .gp-nl-breadcrumb .current {
          color: #00D2FF;
          font-weight: 600;
        }

        /* Hero */
        .gp-nl-hero {
          background: transparent;
          padding: 48px 0 32px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .gp-nl-hero-meta-top {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }
        .gp-nl-freq-pill {
          padding: 4px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .gp-nl-freq-pill.freq-weekly {
          background: rgba(0, 70, 252, 0.2);
          color: #60A5FA;
          border: 1px solid rgba(96, 165, 250, 0.4);
        }
        .gp-nl-freq-pill.freq-monthly {
          background: rgba(168, 85, 247, 0.2);
          color: #C084FC;
          border: 1px solid rgba(192, 132, 252, 0.4);
        }
        .gp-nl-freq-pill.freq-bi-weekly {
          background: rgba(16, 185, 129, 0.2);
          color: #34D399;
          border: 1px solid rgba(52, 211, 153, 0.4);
        }
        .gp-nl-category-tag {
          font-size: 13px;
          font-weight: 600;
          color: #00D2FF;
          background: rgba(0, 210, 255, 0.12);
          border: 1px solid rgba(0, 210, 255, 0.25);
          padding: 4px 10px;
          border-radius: 6px;
        }
        .gp-nl-published-badge {
          font-size: 12px;
          font-weight: 600;
          color: #10B981;
        }
        .gp-nl-hero-title {
          font-size: 38px;
          line-height: 1.25;
          font-weight: 800;
          color: #FFFFFF;
          letter-spacing: -0.02em;
          margin-bottom: 18px;
          max-width: 980px;
        }
        .gp-nl-hero-summary {
          font-size: 18px;
          line-height: 1.6;
          color: #CBD5E1;
          margin-bottom: 28px;
          max-width: 880px;
        }
        .gp-nl-author-meta-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          padding-bottom: 28px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          margin-bottom: 32px;
        }
        .gp-nl-author-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .author-avatar-badge {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0046FC, #00D2FF);
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }
        .gp-nl-author-info strong {
          display: block;
          font-size: 15px;
          color: #FFFFFF;
        }
        .gp-nl-author-info .pub-date {
          font-size: 13px;
          color: #94A3B8;
        }
        .gp-nl-subscribers-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #0D1522;
          border: 1px solid rgba(203, 213, 225, 0.16);
          padding: 6px 14px;
          border-radius: 999px;
          font-size: 13px;
          color: #CBD5E1;
        }

        /* Hero Image */
        .gp-nl-hero-media {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(203, 213, 225, 0.12);
          max-height: 480px;
          border: 1px solid rgba(0, 210, 255, 0.2);
        }
        .gp-nl-hero-img {
          width: 100%;
          height: 100%;
          max-height: 480px;
          object-fit: cover;
          display: block;
        }
        .gp-nl-media-overlay-pill {
          position: absolute;
          bottom: 18px;
          left: 18px;
          background: rgba(6, 11, 18, 0.88);
          backdrop-filter: blur(8px);
          color: #FFFFFF;
          padding: 8px 16px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          border: 1px solid rgba(0, 210, 255, 0.25);
        }
        .pulse-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #00D2FF;
          box-shadow: 0 0 8px #00D2FF;
        }

        /* Layout Grid */
        .gp-nl-body-section {
          padding: 48px 0 80px;
        }
        .gp-nl-layout-grid {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 48px;
          align-items: start;
        }

        /* Main Editorial Article */
        .gp-nl-article-main {
          min-width: 0;
        }
        .gp-nl-callout-card {
          background: #0D1522;
          border-left: 4px solid #00D2FF;
          border: 1px solid rgba(203, 213, 225, 0.1);
          border-left-width: 4px;
          border-left-color: #00D2FF;
          border-radius: 0 12px 12px 0;
          padding: 24px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
          margin-bottom: 36px;
        }
        .gp-nl-callout-head {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }
        .gp-nl-callout-head h3 {
          font-size: 17px;
          font-weight: 700;
          color: #FFFFFF;
          margin: 0;
        }
        .gp-nl-callout-card p {
          font-size: 15px;
          line-height: 1.65;
          color: #CBD5E1;
          margin: 0;
        }

        /* Prose */
        .gp-nl-prose h2 {
          font-size: 24px;
          font-weight: 800;
          color: #FFFFFF;
          margin-bottom: 16px;
        }
        .gp-nl-prose p {
          font-size: 16.5px;
          line-height: 1.75;
          color: #CBD5E1;
          margin-bottom: 20px;
        }

        /* Highlights */
        .gp-nl-highlights-box {
          background: rgba(0, 70, 252, 0.12);
          border: 1px solid rgba(0, 210, 255, 0.25);
          border-radius: 12px;
          padding: 24px;
          margin: 36px 0;
        }
        .gp-nl-highlights-title {
          font-size: 16px;
          font-weight: 700;
          color: #00D2FF;
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .gp-nl-highlights-items {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .gp-nl-highlights-items li {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 15px;
          color: #E2E8F0;
          line-height: 1.5;
        }
        .check-bullet {
          color: #00D2FF;
          font-weight: 800;
        }

        /* Featured Landing Pages Section */
        .gp-nl-landing-pages-section {
          background: #0D1522;
          border: 1px solid rgba(203, 213, 225, 0.12);
          border-radius: 16px;
          padding: 36px 32px;
          margin: 48px 0;
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
        }
        .gp-nl-badge-sm {
          display: inline-block;
          font-size: 11px;
          font-weight: 700;
          color: #00D2FF;
          background: rgba(0, 70, 252, 0.2);
          padding: 4px 10px;
          border-radius: 999px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 8px;
        }
        .gp-nl-subheading {
          font-size: 26px;
          font-weight: 800;
          color: #FFFFFF;
          margin-bottom: 8px;
        }
        .gp-nl-subtext {
          font-size: 15px;
          line-height: 1.6;
          color: #94A3B8;
          margin-bottom: 24px;
        }
        .gp-nl-landing-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 18px;
        }
        .gp-nl-landing-card {
          background: #111C2D;
          border: 1px solid rgba(203, 213, 225, 0.14);
          border-radius: 12px;
          padding: 20px 24px;
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
        }
        .gp-nl-landing-card:hover {
          background: #142338;
          border-color: #00D2FF;
          box-shadow: 0 8px 24px rgba(0, 210, 255, 0.15);
          transform: translateY(-2px);
        }
        .gp-nl-landing-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 8px;
        }
        .gp-nl-landing-cat {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #00D2FF;
        }
        .gp-nl-landing-badge {
          font-size: 11px;
          font-weight: 600;
          color: #10B981;
          background: rgba(16, 185, 129, 0.15);
          padding: 2px 8px;
          border-radius: 4px;
        }
        .gp-nl-landing-card-title {
          font-size: 18px;
          font-weight: 700;
          color: #FFFFFF;
          margin-bottom: 8px;
          line-height: 1.4;
        }
        .gp-nl-landing-title-link {
          color: #FFFFFF;
          text-decoration: none;
          transition: color 0.15s;
        }
        .gp-nl-landing-title-link:hover {
          color: #00D2FF;
          text-decoration: underline;
        }
        .gp-nl-landing-card-desc {
          font-size: 14px;
          line-height: 1.55;
          color: #94A3B8;
          margin-bottom: 16px;
          flex-grow: 1;
        }
        .gp-nl-landing-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          padding-top: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }
        .gp-nl-landing-url-hint {
          font-size: 12px;
          color: #64748B;
        }
        .gp-nl-landing-url-hint code {
          background: #080E18;
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 2px 6px;
          border-radius: 4px;
          color: #00D2FF;
          font-family: monospace;
        }
        .gp-nl-landing-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: linear-gradient(135deg, #0046FC 0%, #002BB8 100%);
          color: #FFFFFF;
          text-decoration: none;
          font-size: 13px;
          font-weight: 600;
          padding: 8px 16px;
          border-radius: 8px;
          transition: all 0.15s;
          box-shadow: 0 2px 8px rgba(0, 70, 252, 0.35);
        }
        .gp-nl-landing-btn:hover {
          background: linear-gradient(135deg, #0056FF 0%, #0036D8 100%);
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(0, 70, 252, 0.5);
        }
        .gp-nl-landing-btn .arrow {
          font-size: 14px;
          transition: transform 0.15s;
        }
        .gp-nl-landing-btn:hover .arrow {
          transform: translateX(3px);
        }

        /* Siblings Section */
        .gp-nl-siblings-section {
          margin-top: 48px;
        }
        .gp-nl-siblings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px;
        }
        .gp-nl-sib-card {
          background: #0D1522;
          border: 1px solid rgba(203, 213, 225, 0.12);
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: box-shadow 0.2s, transform 0.2s, border-color 0.2s;
        }
        .gp-nl-sib-card:hover {
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.5), 0 0 16px rgba(0, 210, 255, 0.1);
          transform: translateY(-2px);
          border-color: #00D2FF;
        }
        .gp-nl-sib-img-wrap {
          position: relative;
          height: 140px;
          overflow: hidden;
          display: block;
        }
        .gp-nl-sib-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s;
        }
        .gp-nl-sib-card:hover .gp-nl-sib-img-wrap img {
          transform: scale(1.05);
        }
        .gp-nl-sib-freq {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(6, 11, 18, 0.85);
          border: 1px solid rgba(0, 210, 255, 0.3);
          color: #00D2FF;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
        }
        .gp-nl-sib-content {
          padding: 16px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }
        .gp-nl-sib-cat {
          font-size: 11px;
          font-weight: 700;
          color: #00D2FF;
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        .gp-nl-sib-title {
          font-size: 15px;
          font-weight: 700;
          color: #FFFFFF;
          line-height: 1.4;
          margin-bottom: 8px;
        }
        .gp-nl-sib-title a {
          color: #FFFFFF;
          text-decoration: none;
        }
        .gp-nl-sib-title a:hover {
          color: #00D2FF;
        }
        .gp-nl-sib-summary {
          font-size: 13px;
          color: #94A3B8;
          line-height: 1.5;
          margin-bottom: 14px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          flex-grow: 1;
        }
        .gp-nl-sib-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 10px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }
        .gp-nl-sib-date {
          font-size: 12px;
          color: #64748B;
        }
        .gp-nl-sib-link {
          font-size: 12px;
          font-weight: 600;
          color: #00D2FF;
          text-decoration: none;
        }
        .gp-nl-sib-link:hover {
          text-decoration: underline;
        }

        /* Sidebar Gated Subscribe */
        .gp-nl-subscribe-sticky-card {
          position: sticky;
          top: 96px;
          background: #0D1522;
          border: 1px solid rgba(0, 210, 255, 0.25);
          border-top: 3px solid #00D2FF;
          border-radius: 16px;
          padding: 28px 24px;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);
        }
        .gp-nl-sub-card-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 700;
          color: #00D2FF;
          background: rgba(0, 70, 252, 0.2);
          padding: 4px 10px;
          border-radius: 999px;
          text-transform: uppercase;
          margin-bottom: 12px;
        }
        .gp-nl-subscribe-sticky-card h3 {
          font-size: 18px;
          font-weight: 800;
          color: #FFFFFF;
          line-height: 1.35;
          margin-bottom: 10px;
        }
        .gp-nl-subscribe-sticky-card p {
          font-size: 14px;
          line-height: 1.55;
          color: #94A3B8;
          margin-bottom: 20px;
        }
        .gp-nl-sub-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .gp-nl-input-group label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          color: #CBD5E1;
          margin-bottom: 4px;
        }
        .gp-nl-input-group input {
          width: 100%;
          padding: 10px 12px;
          background: #080E18;
          color: #FFFFFF;
          border: 1px solid rgba(203, 213, 225, 0.2);
          border-radius: 8px;
          font-size: 14px;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .gp-nl-input-group input:focus {
          border-color: #00D2FF;
          box-shadow: 0 0 0 3px rgba(0, 210, 255, 0.15);
        }
        .gp-nl-submit-btn {
          background: linear-gradient(135deg, #0046FC 0%, #00D2FF 100%);
          color: #FFFFFF;
          border: none;
          padding: 12px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s;
          margin-top: 4px;
          box-shadow: 0 4px 14px rgba(0, 70, 252, 0.4);
        }
        .gp-nl-submit-btn:hover {
          background: linear-gradient(135deg, #0056FF 0%, #00E0FF 100%);
          transform: translateY(-1px);
        }
        .gp-nl-submit-btn:disabled {
          background: #475569;
          cursor: not-allowed;
          box-shadow: none;
        }
        .gp-nl-privacy-guarantee {
          font-size: 11px;
          color: #64748B;
          text-align: center;
          line-height: 1.4;
          margin-top: 8px;
        }
        .gp-nl-form-error {
          background: rgba(220, 38, 38, 0.15);
          color: #F87171;
          border: 1px solid rgba(248, 113, 113, 0.3);
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 12px;
        }
        .gp-nl-sub-success {
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: 12px;
          padding: 20px;
          text-align: center;
        }
        .gp-nl-sub-success .success-icon {
          width: 44px;
          height: 44px;
          background: #10B981;
          color: #FFFFFF;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: 800;
          margin: 0 auto 12px;
        }
        .gp-nl-sub-success h4 {
          font-size: 16px;
          font-weight: 800;
          color: #34D399;
          margin-bottom: 8px;
        }
        .gp-nl-sub-success p {
          font-size: 13px;
          color: #A7F3D0;
          line-height: 1.5;
          margin-bottom: 16px;
        }
        .gp-btn-reset-sub {
          background: transparent;
          border: 1px solid #10B981;
          color: #10B981;
          padding: 6px 14px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }
        .gp-nl-all-link-box {
          margin-top: 20px;
          padding-top: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          text-align: center;
        }
        .gp-nl-browse-all-btn {
          font-size: 13px;
          font-weight: 600;
          color: #00D2FF;
          text-decoration: none;
        }
        .gp-nl-browse-all-btn:hover {
          text-decoration: underline;
        }

        /* Not Found */
        .gp-nl-not-found-card {
          background: #0D1522;
          border: 1px solid rgba(203, 213, 225, 0.12);
          border-radius: 16px;
          padding: 48px;
          text-align: center;
          max-width: 680px;
          margin: 0 auto;
        }
        .gp-nl-not-found-icon {
          font-size: 48px;
          display: block;
          margin-bottom: 16px;
        }
        .gp-nl-not-found-card h1 {
          font-size: 28px;
          font-weight: 800;
          color: #FFFFFF;
          margin-bottom: 12px;
        }
        .gp-nl-not-found-card p {
          font-size: 16px;
          color: #94A3B8;
          margin-bottom: 24px;
        }
        .gp-nl-not-found-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
          margin-bottom: 36px;
        }
        .gp-btn-primary {
          background: linear-gradient(135deg, #0046FC, #00D2FF);
          color: #FFFFFF;
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
        }
        .gp-btn-secondary {
          background: rgba(255, 255, 255, 0.08);
          color: #CBD5E1;
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
        }
        .gp-nl-recent-dispatches {
          text-align: left;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding-top: 24px;
        }
        .gp-nl-recent-dispatches h3 {
          font-size: 14px;
          color: #64748B;
          text-transform: uppercase;
          margin-bottom: 12px;
        }
        .gp-nl-recent-grid {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .gp-nl-recent-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 14px;
          background: #111C2D;
          border: 1px solid rgba(203, 213, 225, 0.1);
          border-radius: 8px;
          text-decoration: none;
          color: #FFFFFF;
          font-size: 13px;
        }
        .gp-nl-recent-item:hover {
          background: #142338;
          border-color: #00D2FF;
          color: #00D2FF;
        }

        /* Responsive Breakpoints */
        @media (max-width: 992px) {
          .gp-nl-layout-grid {
            grid-template-columns: 1fr;
          }
          .gp-nl-hero-title {
            font-size: 30px;
          }
          .gp-nl-subscribe-sticky-card {
            position: static;
            margin-top: 32px;
          }
        }
        @media (max-width: 640px) {
          .gp-nl-hero-title {
            font-size: 24px;
          }
          .gp-nl-hero-summary {
            font-size: 16px;
          }
          .gp-nl-landing-pages-section {
            padding: 24px 16px;
          }
        }
      `}</style>
    </main>
  );
}

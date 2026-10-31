import { useState, useMemo } from "react";
import { Link } from "react-router-dom";

// High-resolution local solution imagery
import humanVerifiedImg from "../assets/images/solutions/human-verified-data.jpg";
import mqlImg from "../assets/images/solutions/mql-generation.jpg";
import sqlImg from "../assets/images/solutions/sql-generation.jpg";
import bantImg from "../assets/images/solutions/bant-qualified-leads.jpg";
import appointmentImg from "../assets/images/solutions/appointment-generation.jpg";
import webinarImg from "../assets/images/solutions/webinar-campaigns.jpg";
import marketingLeadersImg from "../assets/images/marketing-leaders.jpg";

// ========================================================
// DATA STRUCTURES (EXACT COPY FROM GETPROSPEKT.CO)
// ========================================================
interface SolutionCardItem {
  id: string;
  heading: string;
  badge: string;
  copy: string;
  to: string;
  image: string;
  statHighlight: string;
}

const solutionsList: SolutionCardItem[] = [
  {
    id: "hvd",
    heading: "Human-Verified Data",
    badge: "ACCURACY & RECENCY",
    copy: "Prospect data manually reviewed and verified for accuracy, completeness and recency.",
    to: "/article/human-verified-data",
    image: humanVerifiedImg,
    statHighlight: "100% Direct Verification",
  },
  {
    id: "mql",
    heading: "MQL Generation",
    badge: "QUALIFIED ENGAGEMENT",
    copy: "Marketing-qualified leads generated and qualified against your agreed criteria.",
    to: "/article/mql-generation",
    image: mqlImg,
    statHighlight: "Target ICP Engagement",
  },
  {
    id: "sql",
    heading: "SQL Generation",
    badge: "SALES-READINESS",
    copy: "Sales-qualified leads that meet your agreed fit, need and sales-readiness criteria.",
    to: "/article/sql-generation",
    image: sqlImg,
    statHighlight: "Commercial Purchase Fit",
  },
  {
    id: "bant",
    heading: "BANT-Qualified Leads",
    badge: "BUDGET • AUTHORITY • NEED • TIMING",
    copy: "Leads qualified against Budget, Authority, Need and Timing.",
    to: "/article/bant-qualified-leads",
    image: bantImg,
    statHighlight: "Strict 4-Pillar Attestation",
  },
  {
    id: "apt",
    heading: "Appointment Generation",
    badge: "CONFIRMED MEETINGS",
    copy: "Confirmed meetings with your agreed target personas.",
    to: "/article/appointment-generation",
    image: appointmentImg,
    statHighlight: "Direct Calendar Booking",
  },
  {
    id: "web",
    heading: "Webinar Campaigns",
    badge: "EXECUTIVE AUDIENCE",
    copy: "Qualified registrations for your webinar from prospects matching your defined audience.",
    to: "/article/webinar-campaigns",
    image: webinarImg,
    statHighlight: "Verified Attendee Turnout",
  },
];

const comparisonData = [
  {
    solution: "Human-Verified Data",
    delivers: "Verified prospect data",
    focus: "Accuracy, completeness, validity, consistency and recency",
    tag: "Data Quality",
  },
  {
    solution: "MQL Generation",
    delivers: "Marketing-qualified leads",
    focus: "Client-defined MQL criteria",
    tag: "Marketing Fit",
  },
  {
    solution: "SQL Generation",
    delivers: "Sales-qualified leads",
    focus: "ICP fit, relevant need and sales readiness",
    tag: "Sales Ready",
  },
  {
    solution: "BANT-Qualified Leads",
    delivers: "BANT-qualified leads",
    focus: "Budget, Authority, Need and Timing",
    tag: "High Intent",
  },
  {
    solution: "Appointment Generation",
    delivers: "Confirmed meetings",
    focus: "Agreed persona, prospect participation and confirmed meeting",
    tag: "Discovery Session",
  },
  {
    solution: "Webinar Campaigns",
    delivers: "Qualified registrations",
    focus: "Defined audience criteria and registration confirmation",
    tag: "Live Broadcast",
  },
];

const processSteps = [
  {
    num: "01",
    name: "Define",
    title: "Define Target Standards",
    desc: "We align on your target market, ideal buyer profile, selected solution and qualification criteria before any outreach begins.",
  },
  {
    num: "02",
    name: "Identify",
    title: "Identify & Research",
    desc: "Our research specialists pinpoint and cross-reference verified decision-makers across target accounts who match your defined parameters.",
  },
  {
    num: "03",
    name: "Engage",
    title: "Multi-Touch Engagement",
    desc: "We conduct personalized outreach across verified channels to connect directly with relevant prospects.",
  },
  {
    num: "04",
    name: "Qualify",
    title: "Conduct Qualification",
    desc: "Our team conducts in-depth qualification conversations against your specific agreed fit, need, BANT, or meeting criteria.",
  },
  {
    num: "05",
    name: "Deliver",
    title: "Deliver Verified Leads",
    desc: "We deliver leads that strictly meet your agreed standard directly into your pipeline. Your team takes the next step.",
  },
];

const howWeWorkSteps = [
  {
    phase: "Phase 01",
    subheading: "Discovery",
    copy: "We align on your target market, ideal buyer profile, selected solution and qualification criteria. That gives our team the definition we need to execute.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    phase: "Phase 02",
    subheading: "Execution",
    copy: "We identify, research, engage and qualify prospects against your agreed criteria, then deliver the leads that meet that standard. Your team takes the next step.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    phase: "Phase 03",
    subheading: "Optimization",
    copy: "We learn from feedback on lead quality and fit, then adjust targeting, qualification or outreach where appropriate.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20v-6M6 20V10M18 20V4" />
      </svg>
    ),
  },
];

const faqItems = [
  {
    q: "Do you define the qualification criteria, or do we?",
    a: "You define what qualified means for your business. We align on those criteria, then execute the lead-generation work against them.",
  },
  {
    q: "Who conducts the qualification conversations?",
    a: "Our team identifies prospects, engages them and conducts the qualification conversations. We deliver leads that meet your agreed criteria.",
  },
  {
    q: "Can I buy just one solution, or do I have to buy multiple?",
    a: "Every solution is standalone. You can purchase Human-Verified Data, MQL Generation, SQL Generation, BANT-Qualified Leads, or Appointment Generation independently. No bundling required.",
  },
  {
    q: "What happens after you deliver a qualified lead?",
    a: "Your team takes the next step. We deliver leads that meet your criteria; you determine how to work them—nurture, handoff to sales, or your existing process.",
  },
  {
    q: "For appointment generation, what happens after the meeting is booked?",
    a: "We identify, research, engage and qualify the prospect. We book the appointment and introduce your sales representative to the prospect. Then our team exits. Your sales representative conducts the meeting.",
  },
];

function Home() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [comparisonMode, setComparisonMode] = useState<"table" | "cards">("table");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [faqSearch, setFaqSearch] = useState<string>("");

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  const filteredFaqs = useMemo(() => {
    if (!faqSearch.trim()) return faqItems;
    const q = faqSearch.toLowerCase();
    return faqItems.filter(
      (item) => item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)
    );
  }, [faqSearch]);

  return (
    <>
      <div id="top" className="gp-page-root">
        {/* =========================================================
            SIGNATURE ANIMATED AMBIENT BACKGROUND LAYER (TECH GRID & ORBS)
            ========================================================= */}
        <div className="gp-bg-animation-container" aria-hidden="true">
          <div className="gp-bg-grid-pattern" />
          <div className="gp-ambient-orb gp-ambient-one" />
          <div className="gp-ambient-orb gp-ambient-two" />
          <div className="gp-ambient-orb gp-ambient-three" />
          <div className="gp-ambient-orb gp-ambient-four" />
        </div>

        {/* =========================================================
            SECTION 1: HERO (INTERACTIVE & VISUAL)
            ========================================================= */}
        <section className="gp-hero-section">
          <div className="gp-hero-glow-layer" aria-hidden="true" />
          <div className="gp-container gp-hero-grid">
            <div className="gp-hero-content">
              <h1 className="gp-hero-title">
                Better pipeline starts with{" "}
                <span className="gp-text-gradient">better decisions.</span>
              </h1>

              <p className="gp-hero-desc">
                GETprospeKt is a B2B lead-generation partner helping marketing teams turn their target market into qualified leads — at the qualification level their business requires.
              </p>

              <div className="gp-hero-actions">
                <Link to="/contact" className="gp-btn-primary">
                  <span>Discuss Your Lead-Generation Needs</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>

                <a href="#solutions" className="gp-btn-secondary">
                  <span>Explore 6 Solutions</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </a>
              </div>

              <div className="gp-hero-trust-row">
                <div className="gp-trust-item">
                  <strong>100%</strong>
                  <span>Human-Verified</span>
                </div>
                <div className="gp-trust-separator" />
                <div className="gp-trust-item">
                  <strong>6</strong>
                  <span>Standalone Solutions</span>
                </div>
                <div className="gp-trust-separator" />
                <div className="gp-trust-item">
                  <strong>Zero</strong>
                  <span>Mandatory Bundling</span>
                </div>
              </div>
            </div>

            {/* Interactive Visual Preview on Hero Right */}
            <div className="gp-hero-visual-card">
              <div className="gp-visual-header">
                <div className="gp-visual-dots">
                  <span className="dot red" />
                  <span className="dot yellow" />
                  <span className="dot green" />
                </div>
                <span className="gp-visual-label">GETprospeKt Qualification Engine</span>
              </div>

              <div className="gp-visual-image-wrap">
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=90"
                  alt="Enterprise Sales Pipeline"
                  className="gp-visual-image"
                />
                <div className="gp-visual-overlay-badge top-right">
                  <span className="badge-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <div>
                    <strong>Client-Defined Criteria</strong>
                    <span>You set qualification rules</span>
                  </div>
                </div>

                <div className="gp-visual-overlay-badge bottom-left">
                  <span className="badge-icon pulse">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                  </span>
                  <div>
                    <strong>Commercial Intent</strong>
                    <span>Verified Director+ Personas</span>
                  </div>
                </div>
              </div>

              <div className="gp-visual-footer-metrics">
                <div className="visual-metric">
                  <span className="label">Pipeline Output</span>
                  <span className="value text-cyan">Verified Leads</span>
                </div>
                <div className="visual-metric">
                  <span className="label">Qualification</span>
                  <span className="value">Direct Outreach</span>
                </div>
                <div className="visual-metric">
                  <span className="label">Execution</span>
                  <span className="value text-green">Multi-Touch</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            SECTION 2: BUILT FOR MARKETING LEADERS (EXECUTIVE BANNER)
            ========================================================= */}
        <section className="gp-leaders-section">
          <div className="gp-container">
            <div className="gp-leaders-card">
              <div className="gp-leaders-media">
                <img
                  src={marketingLeadersImg}
                  alt="Enterprise Marketing Executive"
                  className="gp-leaders-image"
                />
                <div className="gp-media-glass-pill">
                  <span className="pill-dot" />
                  <span>Serving High-Growth B2B Enterprises Globally</span>
                </div>
              </div>

              <div className="gp-leaders-content">
                <h2 className="gp-section-title">Built for Marketing Leaders</h2>
                <p className="gp-section-copy">
                  GETprospeKt works with Director-level and above marketing, growth, and demand generation leaders at B2B companies who need reliable, qualified lead generation.
                </p>

                <div className="gp-leaders-pillars">
                  <div className="pillar-item">
                    <span className="pillar-check">✓</span>
                    <div>
                      <strong>Director-Level &amp; Above Focus</strong>
                      <span>Tailored for VP Marketing, CMOs &amp; Demand Gen Heads</span>
                    </div>
                  </div>

                  <div className="pillar-item">
                    <span className="pillar-check">✓</span>
                    <div>
                      <strong>Custom-Aligned Criteria</strong>
                      <span>Never generic definitions — mapped to your sales motion</span>
                    </div>
                  </div>

                  <div className="pillar-item">
                    <span className="pillar-check">✓</span>
                    <div>
                      <strong>Predictable Pipeline Velocity</strong>
                      <span>Measurable output delivered directly to your reps</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            SECTION 3: SIX STANDALONE LEAD-GENERATION SOLUTIONS
            ========================================================= */}
        <section id="solutions" className="gp-solutions-section">
          <div className="gp-container">
            <div className="gp-section-header text-center">
              <h2 className="gp-section-title">Six Standalone Lead-Generation Solutions</h2>
              <p className="gp-section-subhead">
                Every solution operates independently with transparent verification and dedicated qualification. Buy what your sales pipeline requires.
              </p>
            </div>

            <div className="gp-solutions-interactive-grid">
              {solutionsList.map((sol) => (
                <Link
                  key={sol.heading}
                  to={sol.to}
                  className="gp-solution-visual-card group"
                >
                  <div className="gp-card-media-wrapper">
                    <img
                      src={sol.image}
                      alt={sol.heading}
                      className="gp-card-cover-image"
                      loading="lazy"
                    />
                    <div className="gp-card-gradient-overlay" />
                    <span className="gp-card-badge">{sol.badge}</span>
                    <span className="gp-card-stat-chip">{sol.statHighlight}</span>
                  </div>

                  <div className="gp-card-body">
                    <h3 className="gp-card-title">{sol.heading}</h3>
                    <p className="gp-card-desc">{sol.copy}</p>

                    <div className="gp-card-footer">
                      <span className="gp-card-link-text">
                        Explore Solution
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="gp-hover-arrow"
                        >
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================
            SECTION 4: WHAT MAKES EACH SOLUTION DIFFERENT?
            ========================================================= */}
        <section className="gp-diff-section">
          <div className="gp-container">
            <div className="gp-diff-header-row">
              <div>
                <h2 className="gp-section-title">What Makes Each Solution Different?</h2>
              </div>

              {/* Interactive View Switcher */}
              <div className="gp-view-switcher">
                <button
                  type="button"
                  className={`gp-switch-btn ${comparisonMode === "table" ? "active" : ""}`}
                  onClick={() => setComparisonMode("table")}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <line x1="3" y1="9" x2="21" y2="9" />
                    <line x1="9" y1="21" x2="9" y2="9" />
                  </svg>
                  <span>Table View</span>
                </button>
                <button
                  type="button"
                  className={`gp-switch-btn ${comparisonMode === "cards" ? "active" : ""}`}
                  onClick={() => setComparisonMode("cards")}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                  </svg>
                  <span>Cards View</span>
                </button>
              </div>
            </div>

            {/* View 1: Responsive Comparison Table */}
            {comparisonMode === "table" ? (
              <div className="gp-comparison-table-wrap">
                <table className="gp-rich-table">
                  <thead>
                    <tr>
                      <th scope="col" className="col-header-sol">Solution</th>
                      <th scope="col" className="col-header-del">What It Delivers</th>
                      <th scope="col" className="col-header-foc">Qualification / Verification Focus</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonData.map((row, idx) => (
                      <tr key={row.solution} className={idx % 2 === 0 ? "row-even" : "row-odd"}>
                        <td className="cell-sol">
                          <div className="sol-badge-wrap">
                            <span className="sol-name">{row.solution}</span>
                            <span className="sol-tag-sm">{row.tag}</span>
                          </div>
                        </td>
                        <td className="cell-del">
                          <span className="deliver-highlight">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00D2FF" strokeWidth="3">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            {row.delivers}
                          </span>
                        </td>
                        <td className="cell-foc">
                          <span className="focus-text">{row.focus}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              /* View 2: Interactive Cards Comparison */
              <div className="gp-comparison-cards-grid">
                {comparisonData.map((row) => (
                  <div key={row.solution} className="gp-compare-card">
                    <div className="compare-card-top">
                      <span className="compare-tag">{row.tag}</span>
                      <h3 className="compare-sol-title">{row.solution}</h3>
                    </div>

                    <div className="compare-row">
                      <span className="compare-label">DELIVERS:</span>
                      <span className="compare-value highlight">{row.delivers}</span>
                    </div>

                    <div className="compare-row">
                      <span className="compare-label">FOCUS:</span>
                      <span className="compare-value">{row.focus}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* =========================================================
            SECTION 5: WHY BETTER LEAD GENERATION STARTS BEFORE OUTREACH (INTERACTIVE TIMELINE)
            ========================================================= */}
        <section className="gp-process-section">
          <div className="gp-container">
            <div className="gp-section-header text-center">
              <h2 className="gp-section-title">Why Better Lead Generation Starts Before Outreach</h2>
              <p className="gp-section-subhead">
                Click any phase below to explore how pre-outreach alignment drives exceptional lead quality and eliminates wasted sales bandwidth.
              </p>
            </div>

            {/* Interactive Timeline Tabs */}
            <div className="gp-interactive-steps-container">
              <div className="gp-steps-bar">
                {processSteps.map((step, idx) => {
                  const isActive = activeStep === idx;
                  return (
                    <button
                      key={step.name}
                      type="button"
                      className={`gp-step-pill-btn ${isActive ? "active" : ""}`}
                      onClick={() => setActiveStep(idx)}
                    >
                      <span className="step-num">{step.num}</span>
                      <span className="step-name">{step.name}</span>
                      {isActive && <span className="active-indicator" />}
                    </button>
                  );
                })}
              </div>

              {/* Active Step Showcase Panel */}
              <div className="gp-active-step-panel">
                <div className="step-panel-left">
                  <span className="panel-step-badge">STEP {processSteps[activeStep].num} OF 05</span>
                  <h3 className="panel-step-title">{processSteps[activeStep].title}</h3>
                  <p className="panel-step-desc">{processSteps[activeStep].desc}</p>
                </div>

                <div className="step-panel-right">
                  <div className="step-visual-box">
                    <div className="step-icon-glow">
                      {activeStep === 0 && (
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#00D2FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="step-pro-svg">
                          <circle cx="12" cy="12" r="10" stroke="rgba(0, 210, 255, 0.35)" />
                          <circle cx="12" cy="12" r="6" stroke="#00D2FF" strokeWidth="2" />
                          <circle cx="12" cy="12" r="2" fill="#00D2FF" />
                          <line x1="12" y1="2" x2="12" y2="4" stroke="#00D2FF" strokeWidth="2.2" />
                          <line x1="12" y1="20" x2="12" y2="22" stroke="#00D2FF" strokeWidth="2.2" />
                          <line x1="2" y1="12" x2="4" y2="12" stroke="#00D2FF" strokeWidth="2.2" />
                          <line x1="20" y1="12" x2="22" y2="12" stroke="#00D2FF" strokeWidth="2.2" />
                        </svg>
                      )}
                      {activeStep === 1 && (
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#00D2FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="step-pro-svg">
                          <circle cx="11" cy="11" r="8" stroke="#00D2FF" strokeWidth="2" />
                          <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="#00D2FF" strokeWidth="2.2" />
                          <circle cx="11" cy="11" r="3" stroke="rgba(0, 210, 255, 0.5)" />
                          <path d="M11 6a5 5 0 0 1 5 5" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      )}
                      {activeStep === 2 && (
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#00D2FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="step-pro-svg">
                          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" stroke="#00D2FF" strokeWidth="2" fill="rgba(0, 70, 252, 0.15)" />
                          <circle cx="8" cy="12" r="1.5" fill="#00D2FF" />
                          <circle cx="12" cy="12" r="1.5" fill="#00D2FF" />
                          <circle cx="16" cy="12" r="1.5" fill="#00D2FF" />
                        </svg>
                      )}
                      {activeStep === 3 && (
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#00D2FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="step-pro-svg">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#00D2FF" strokeWidth="2" fill="rgba(0, 70, 252, 0.2)" />
                          <polyline points="9 12 11 14 15 10" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                      {activeStep === 4 && (
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#00D2FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="step-pro-svg">
                          <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" stroke="#00D2FF" strokeWidth="1.8" />
                          <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" stroke="#00D2FF" strokeWidth="2" fill="rgba(0, 210, 255, 0.15)" />
                          <circle cx="15.5" cy="8.5" r="1.5" fill="#38BDF8" />
                          <path d="M9 12l2 2" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      )}
                    </div>
                    <span className="step-status-chip">
                      <span className="chip-pulse-dot" />
                      Phase Active
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Foundational Copy from Reference Website */}
            <div className="gp-foundational-quote-card">
              <p className="quote-text">
                The quality of a lead is determined before the first message is sent. Before outreach begins, we align on who you want to reach and what qualifies as a lead for your business. We then identify, engage and qualify prospects against those criteria before delivering them to your team. <strong>You define what qualified means. We execute against it.</strong>
              </p>
            </div>
          </div>
        </section>

        {/* =========================================================
            SECTION 6: WHY GETPROSPEKT (INTERACTIVE GLASS CARDS)
            ========================================================= */}
        <section className="gp-why-section">
          <div className="gp-container">
            <div className="gp-why-header text-center">
              <h2 className="gp-section-title">Why GETprospeKt</h2>
              <p className="gp-why-tagline">
                You define what qualified means. We execute against it.
              </p>
            </div>

            <div className="gp-why-cards-grid">
              <div className="gp-why-card">
                <div className="why-card-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00D2FF" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <h3 className="why-card-title">Client-Defined Qualification</h3>
                <p className="why-card-copy">
                  We don't impose a universal definition of a qualified lead. We work from the criteria you establish and build our research, outreach and qualification around them.
                </p>
              </div>

              <div className="gp-why-card featured">
                <div className="why-card-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00D2FF" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <h3 className="why-card-title">We generate and qualify.</h3>
                <p className="why-card-copy">
                  Our team identifies prospects, engages them and conducts the qualification required for the solution you've selected before delivering the lead to your team.
                </p>
              </div>

              <div className="gp-why-card">
                <div className="why-card-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00D2FF" strokeWidth="2">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                </div>
                <h3 className="why-card-title">Six standalone solutions. Buy what you need.</h3>
                <p className="why-card-copy">
                  Human-Verified Data, MQLs, SQLs, BANT-Qualified Leads, Appointment Generation and Webinar Campaigns are independent solutions—not stages of a mandatory program.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            SECTION 7: HOW WE WORK (PHASED CARDS WITH ICONS)
            ========================================================= */}
        <section className="gp-how-section">
          <div className="gp-container">
            <div className="gp-section-header text-center">
              <h2 className="gp-section-title">How We Work</h2>
              <p className="gp-section-subhead">
                A structured three-phase execution model designed for complete transparency and continuous feedback loops.
              </p>
            </div>

            <div className="gp-how-cards-grid">
              {howWeWorkSteps.map((step) => (
                <div key={step.subheading} className="gp-how-work-card">
                  <div className="how-work-top">
                    <span className="how-work-phase">{step.phase}</span>
                    <div className="how-work-icon">{step.icon}</div>
                  </div>
                  <h3 className="how-work-title">{step.subheading}</h3>
                  <p className="how-work-desc">{step.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================
            SECTION 8: QUESTIONS WE OFTEN HEAR (FAQ ACCORDION + SEARCH)
            ========================================================= */}
        <section className="gp-faq-section">
          <div className="gp-container">
            <div className="gp-section-header text-center">
              <h2 className="gp-section-title">Questions We Often Hear</h2>
              <p className="gp-section-subhead">
                Everything you need to know about our qualification processes, delivery handoffs, and pricing flexibility.
              </p>
            </div>

            <div className="gp-faq-search-box">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00D2FF" strokeWidth="2.2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                placeholder="Filter questions (e.g. qualification, criteria, appointment)..."
                className="gp-faq-input"
              />
              {faqSearch && (
                <button
                  type="button"
                  onClick={() => setFaqSearch("")}
                  className="gp-faq-clear-btn"
                  aria-label="Clear filter"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="gp-faq-accordion-container">
              {filteredFaqs.length === 0 ? (
                <div className="gp-faq-empty">
                  <p>No questions found matching "{faqSearch}".</p>
                  <button type="button" onClick={() => setFaqSearch("")} className="gp-link-btn">
                    Reset search
                  </button>
                </div>
              ) : (
                filteredFaqs.map((item, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div
                      key={item.q}
                      className={`gp-faq-item-card ${isOpen ? "open" : ""}`}
                    >
                      <button
                        type="button"
                        className="gp-faq-item-trigger"
                        onClick={() => toggleFaq(idx)}
                        aria-expanded={isOpen}
                      >
                        <span className="faq-q-text">{item.q}</span>
                        <span className="faq-toggle-circle">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.4"
                            className={`faq-arrow-svg ${isOpen ? "rotated" : ""}`}
                          >
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </span>
                      </button>

                      {isOpen && (
                        <div className="gp-faq-item-answer">
                          <p className="faq-a-text">{item.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </section>

        {/* =========================================================
            SECTION 9: BOTTOM CTA BANNER (HIGH-IMPACT INTERACTIVE)
            ========================================================= */}
        <section className="gp-bottom-cta-section">
          <div className="gp-container">
            <div className="gp-bottom-cta-card">
              <div className="cta-glow-circle" aria-hidden="true" />
              <div className="cta-content-wrapper">
                <span className="gp-cta-pill">LET'S START CONVERSATIONS</span>
                <h2 className="gp-cta-title">Discuss Your Lead-Generation Needs</h2>
                <p className="gp-cta-desc">
                  Tell us what your marketing team needs. We'll discuss which of our six solutions fits your business and what success looks like for you.
                </p>

                <div className="gp-cta-btn-group">
                  <Link to="/contact" className="gp-btn-primary large">
                    <span>Discuss Your Lead-Generation Needs</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </Link>

                  <Link to="/solutions" className="gp-btn-secondary large">
                    <span>Compare All Solutions</span>
                  </Link>
                </div>

                <div className="gp-cta-guarantees">
                  <span>✓ 100% Client-Defined Standards</span>
                  <span>•</span>
                  <span>✓ Independent Solution Sourcing</span>
                  <span>•</span>
                  <span>✓ Direct Rep Handoff</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        /* =========================================================
           GLOBAL DARK LUXURY STYLES FOR HOMEPAGE
           ========================================================= */
        .gp-page-root {
          min-height: 100vh;
          background: #060B12;
          color: #FFFFFF;
          font-family: inherit;
          overflow-x: hidden;
          position: relative;
        }

        /* SIGNATURE ANIMATED AMBIENT BACKGROUND (TECH GRID & GLOWING ORBS) */
        .gp-bg-animation-container {
          position: fixed;
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
            radial-gradient(ellipse 85% 50% at 50% -10%, rgba(0, 70, 252, 0.12) 0%, transparent 65%),
            radial-gradient(circle at 90% 20%, rgba(0, 210, 255, 0.08) 0%, transparent 45%),
            radial-gradient(circle at 10% 70%, rgba(0, 70, 252, 0.06) 0%, transparent 40%),
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

        .gp-ambient-four {
          width: 140px;
          height: 140px;
          top: 22%;
          left: 48%;
          border: 1.5px solid rgba(0, 210, 255, 0.22);
          background: rgba(0, 70, 252, 0.08);
          animation: pulseOrb 6s ease-in-out infinite;
        }

        @keyframes floatOne {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-35px, 30px); }
        }

        @keyframes floatTwo {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(32px, -28px); }
        }

        @keyframes pulseOrb {
          0%, 100% { transform: scale(1); opacity: 0.35; }
          50% { transform: scale(1.25); opacity: 0.8; }
        }

        .gp-hero-section,
        .gp-leaders-section,
        .gp-solutions-section,
        .gp-diff-section,
        .gp-process-section,
        .gp-why-section,
        .gp-how-section,
        .gp-faq-section,
        .gp-bottom-cta-section {
          position: relative;
          z-index: 1;
        }

        .gp-container {
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
          padding: 64px 20px;
          box-sizing: border-box;
        }

        @media (min-width: 768px) {
          .gp-container {
            padding: 88px 32px;
          }
        }

        /* TYPOGRAPHY & BADGES */
        .gp-tag-pill {
          display: inline-block;
          font-size: 11.5px;
          font-weight: 800;
          letter-spacing: 1.2px;
          color: #00D2FF;
          background: rgba(0, 210, 255, 0.1);
          border: 1px solid rgba(0, 210, 255, 0.3);
          border-radius: 20px;
          padding: 5px 14px;
          margin-bottom: 14px;
          text-transform: uppercase;
        }

        .text-center {
          text-align: center !important;
        }

        .gp-section-header {
          text-align: center;
          max-width: 860px;
          margin-left: auto;
          margin-right: auto;
          margin-bottom: 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .gp-page-root p {
          text-align-last: auto;
          text-justify: auto;
        }

        .gp-section-title {
          font-size: clamp(28px, 4vw, 42px);
          font-weight: 800;
          line-height: 1.25;
          letter-spacing: -0.3px;
          color: #FFFFFF;
          margin: 0 auto;
          text-align: center !important;
          text-align-last: center !important;
          width: 100%;
        }

        .gp-section-subhead {
          font-size: clamp(16px, 2.2vw, 18px);
          line-height: 1.6;
          color: #CBD5E1;
          max-width: 760px;
          margin: 14px auto 0;
          text-align: center !important;
          text-align-last: center !important;
          text-justify: auto !important;
          width: 100%;
        }

        .gp-why-header {
          text-align: center;
          max-width: 860px;
          margin-left: auto;
          margin-right: auto;
          margin-bottom: 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .gp-why-header .gp-section-title {
          text-align: center !important;
          text-align-last: center !important;
          width: 100%;
        }

        .gp-why-tagline {
          font-size: clamp(19px, 2.5vw, 22px);
          font-weight: 700;
          color: #FFFFFF;
          margin: 14px auto 0;
          text-align: center !important;
          text-align-last: center !important;
          text-justify: auto !important;
          width: 100%;
        }

        .gp-section-copy {
          font-size: clamp(16px, 2.2vw, 18px);
          line-height: 1.65;
          color: #CBD5E1;
          margin: 16px 0 0;
        }

        .gp-text-gradient {
          background: linear-gradient(135deg, #00D2FF 0%, #38BDF8 60%, #FFFFFF 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* BUTTONS */
        .gp-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: linear-gradient(135deg, #0046FC 0%, #0099FF 100%);
          color: #FFFFFF;
          padding: 14px 28px;
          border-radius: 9px;
          font-size: 15.5px;
          font-weight: 700;
          text-decoration: none;
          box-shadow: 0 4px 18px rgba(0, 70, 252, 0.4), 0 0 12px rgba(0, 210, 255, 0.25);
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          border: 1px solid rgba(0, 210, 255, 0.35);
          cursor: pointer;
        }

        .gp-btn-primary:hover {
          background: linear-gradient(135deg, #0036CC 0%, #0080FF 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 70, 252, 0.55), 0 0 20px rgba(0, 210, 255, 0.4);
          color: #FFFFFF;
          text-decoration: none;
        }

        .gp-btn-primary.large {
          padding: 16px 34px;
          font-size: 16.5px;
        }

        .gp-btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(15, 23, 42, 0.8);
          color: #E2E8F0;
          padding: 14px 24px;
          border-radius: 9px;
          font-size: 15px;
          font-weight: 600;
          text-decoration: none;
          border: 1px solid rgba(255, 255, 255, 0.15);
          transition: all 0.2s ease;
        }

        .gp-btn-secondary:hover {
          background: rgba(30, 41, 59, 0.9);
          border-color: rgba(0, 210, 255, 0.4);
          color: #00D2FF;
          transform: translateY(-1px);
        }

        .gp-btn-secondary.large {
          padding: 16px 30px;
          font-size: 16px;
        }

        /* =========================================================
           SECTION 1: HERO
           ========================================================= */
        .gp-hero-section {
          position: relative;
          padding: 30px 0 20px;
          border-bottom: 1px solid rgba(203, 213, 225, 0.1);
        }

        .gp-hero-glow-layer {
          position: absolute;
          top: -120px;
          left: 50%;
          transform: translateX(-50%);
          width: 900px;
          height: 480px;
          background: radial-gradient(circle, rgba(0, 70, 252, 0.22) 0%, rgba(0, 210, 255, 0.08) 45%, transparent 70%);
          filter: blur(60px);
          pointer-events: none;
        }

        .gp-hero-grid {
          display: grid;
          gap: 48px;
          grid-template-columns: 1fr;
          align-items: center;
        }

        @media (min-width: 1024px) {
          .gp-hero-grid {
            grid-template-columns: 1fr 1.08fr;
            gap: 48px;
          }
        }

        .gp-eyebrow-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(0, 70, 252, 0.16);
          border: 1px solid rgba(0, 210, 255, 0.35);
          border-radius: 20px;
          padding: 6px 14px;
          font-size: 11.5px;
          font-weight: 800;
          letter-spacing: 1.4px;
          color: #00D2FF;
          margin-bottom: 20px;
        }

        .gp-eyebrow-dot {
          width: 8px;
          height: 8px;
          background: #00D2FF;
          border-radius: 50%;
          box-shadow: 0 0 10px #00D2FF;
          animation: pulseGlow 2s infinite ease-in-out;
        }

        @keyframes pulseGlow {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.6; }
        }

        .gp-hero-content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
        }

        .gp-hero-title {
          font-size: clamp(34px, 4.8vw, 56px);
          font-weight: 850;
          line-height: 1.15;
          letter-spacing: -0.5px;
          margin: 0;
          color: #FFFFFF;
          text-align: left;
        }

        .gp-hero-desc {
          margin: 22px 0 0;
          font-size: clamp(16.5px, 2.2vw, 19px);
          line-height: 1.65;
          color: #CBD5E1;
          max-width: 620px;
          text-align: left !important;
          text-align-last: left !important;
          text-justify: auto !important;
        }

        .gp-hero-actions {
          margin-top: 34px;
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-start;
          gap: 14px;
        }

        .gp-hero-trust-row {
          margin-top: 40px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 24px;
          padding-top: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          width: 100%;
        }

        .gp-trust-item {
          display: flex;
          flex-direction: column;
        }

        .gp-trust-item strong {
          font-size: 21px;
          font-weight: 800;
          color: #00D2FF;
          line-height: 1.1;
        }

        .gp-trust-item span {
          font-size: 12px;
          color: #94A3B8;
          margin-top: 4px;
        }

        .gp-trust-separator {
          width: 1px;
          height: 32px;
          background: rgba(255, 255, 255, 0.12);
        }

        /* HERO VISUAL CARD */
        .gp-hero-visual-card {
          background: #0B1322;
          border: 1px solid rgba(0, 210, 255, 0.3);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 16px 44px rgba(0, 0, 0, 0.65), 0 0 30px rgba(0, 70, 252, 0.2);
          transition: transform 0.3s ease;
        }

        .gp-hero-visual-card:hover {
          transform: translateY(-3px);
        }

        .gp-visual-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 18px;
          background: #070D18;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .gp-visual-dots {
          display: flex;
          gap: 6px;
        }

        .gp-visual-dots .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .gp-visual-dots .dot.red { background: #EF4444; }
        .gp-visual-dots .dot.yellow { background: #F59E0B; }
        .gp-visual-dots .dot.green { background: #10B981; }

        .gp-visual-label {
          font-size: 12px;
          font-weight: 600;
          color: #94A3B8;
          letter-spacing: 0.3px;
        }

        .gp-visual-image-wrap {
          position: relative;
          height: 310px;
          overflow: hidden;
        }

        .gp-visual-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .gp-visual-overlay-badge {
          position: absolute;
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(11, 19, 34, 0.92);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(0, 210, 255, 0.4);
          border-radius: 10px;
          padding: 9px 14px;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.6);
        }

        .gp-visual-overlay-badge.top-right {
          top: 14px;
          right: 14px;
        }

        .gp-visual-overlay-badge.bottom-left {
          bottom: 14px;
          left: 14px;
        }

        .badge-icon {
          width: 26px;
          height: 26px;
          background: rgba(0, 70, 252, 0.4);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          color: #00D2FF;
          font-weight: 800;
        }

        .badge-icon.pulse {
          background: rgba(16, 185, 129, 0.2);
          color: #10B981;
        }

        .gp-visual-overlay-badge strong {
          display: block;
          font-size: 12.5px;
          color: #FFFFFF;
        }

        .gp-visual-overlay-badge span {
          display: block;
          font-size: 11px;
          color: #94A3B8;
        }

        .gp-visual-footer-metrics {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          background: #070D18;
          padding: 14px 18px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          gap: 12px;
        }

        .visual-metric {
          display: flex;
          flex-direction: column;
        }

        .visual-metric .label {
          font-size: 11px;
          color: #64748B;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .visual-metric .value {
          font-size: 13.5px;
          font-weight: 700;
          color: #F1F5F9;
          margin-top: 2px;
        }

        .visual-metric .value.text-cyan { color: #00D2FF; }
        .visual-metric .value.text-green { color: #10B981; }

        /* =========================================================
           SECTION 2: BUILT FOR MARKETING LEADERS
           ========================================================= */
        .gp-leaders-section {
          border-bottom: 1px solid rgba(203, 213, 225, 0.08);
          background: transparent;
        }

        .gp-leaders-card {
          display: grid;
          gap: 40px;
          grid-template-columns: 1fr;
          align-items: center;
        }

        @media (min-width: 1024px) {
          .gp-leaders-card {
            grid-template-columns: 1.05fr 1fr;
            gap: 48px;
          }
        }

        .gp-leaders-content {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .gp-leaders-content .gp-section-title {
          text-align: center;
          width: 100%;
        }

        .gp-leaders-content .gp-section-copy {
          text-align: center;
          margin-top: 16px;
        }

        .gp-leaders-pillars {
          margin-top: 28px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .pillar-item {
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }

        .pillar-check {
          width: 24px;
          height: 24px;
          background: rgba(0, 210, 255, 0.15);
          border: 1px solid rgba(0, 210, 255, 0.4);
          border-radius: 50%;
          color: #00D2FF;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 800;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .pillar-item strong {
          display: block;
          font-size: 16px;
          color: #FFFFFF;
        }

        .pillar-item span {
          display: block;
          font-size: 14px;
          color: #94A3B8;
          margin-top: 2px;
        }

        .gp-leaders-media {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 12px 36px rgba(0, 0, 0, 0.5);
        }

        .gp-leaders-image {
          width: 100%;
          height: 410px;
          object-fit: cover;
          display: block;
        }

        .gp-media-glass-pill {
          position: absolute;
          bottom: 18px;
          left: 18px;
          right: 18px;
          background: rgba(11, 19, 34, 0.88);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(0, 210, 255, 0.35);
          border-radius: 10px;
          padding: 12px 18px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13.5px;
          font-weight: 600;
          color: #F8FAFC;
        }

        .gp-media-glass-pill .pill-dot {
          width: 8px;
          height: 8px;
          background: #10B981;
          border-radius: 50%;
          box-shadow: 0 0 8px #10B981;
        }

        /* =========================================================
           SECTION 3: SIX STANDALONE SOLUTIONS (VISUAL 6-GRID)
           ========================================================= */
        .gp-solutions-section {
          border-bottom: 1px solid rgba(203, 213, 225, 0.08);
          background: transparent;
        }

        .gp-solutions-interactive-grid {
          margin-top: 48px;
          display: grid;
          gap: 24px;
          grid-template-columns: 1fr;
        }

        @media (min-width: 640px) {
          .gp-solutions-interactive-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .gp-solutions-interactive-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .gp-solution-visual-card {
          display: flex;
          flex-direction: column;
          background: #0D1627;
          border: 1px solid rgba(203, 213, 225, 0.14);
          border-radius: 16px;
          overflow: hidden;
          text-decoration: none;
          transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.25s ease, box-shadow 0.25s ease;
        }

        .gp-solution-visual-card:hover {
          transform: translateY(-5px);
          border-color: rgba(0, 210, 255, 0.55);
          box-shadow: 0 14px 34px rgba(0, 0, 0, 0.65), 0 0 20px rgba(0, 70, 252, 0.25);
        }

        .gp-card-media-wrapper {
          position: relative;
          height: 190px;
          overflow: hidden;
        }

        .gp-card-cover-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.4s ease;
        }

        .gp-solution-visual-card:hover .gp-card-cover-image {
          transform: scale(1.06);
        }

        .gp-card-gradient-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(6, 11, 18, 0.1) 0%, rgba(13, 22, 39, 0.95) 100%);
        }

        .gp-card-badge {
          position: absolute;
          top: 14px;
          left: 14px;
          background: rgba(11, 19, 34, 0.88);
          border: 1px solid rgba(0, 210, 255, 0.35);
          border-radius: 6px;
          padding: 4px 10px;
          font-size: 11px;
          font-weight: 800;
          color: #00D2FF;
          letter-spacing: 0.8px;
        }

        .gp-card-stat-chip {
          position: absolute;
          bottom: 12px;
          right: 14px;
          background: rgba(0, 70, 252, 0.7);
          border: 1px solid rgba(0, 210, 255, 0.4);
          border-radius: 6px;
          padding: 3px 8px;
          font-size: 11.5px;
          font-weight: 700;
          color: #FFFFFF;
        }

        .gp-card-body {
          padding: 24px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .gp-card-title {
          margin: 0;
          font-size: 21px;
          font-weight: 800;
          line-height: 1.3;
          color: #FFFFFF;
          transition: color 0.2s ease;
        }

        .gp-solution-visual-card:hover .gp-card-title {
          color: #00D2FF;
        }

        .gp-card-desc {
          margin: 12px 0 0;
          font-size: 15px;
          line-height: 1.6;
          color: #CBD5E1;
          flex-grow: 1;
        }

        .gp-card-footer {
          margin-top: 22px;
          padding-top: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .gp-card-link-text {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 14.5px;
          font-weight: 700;
          color: #00D2FF;
          transition: gap 0.2s ease;
        }

        .gp-solution-visual-card:hover .gp-card-link-text {
          gap: 10px;
        }

        .gp-hover-arrow {
          transition: transform 0.2s ease;
        }

        /* =========================================================
           SECTION 4: WHAT MAKES EACH SOLUTION DIFFERENT?
           ========================================================= */
        .gp-diff-section {
          border-bottom: 1px solid rgba(203, 213, 225, 0.08);
          background: transparent;
        }

        .gp-diff-header-row {
          display: flex;
          flex-direction: column;
          gap: 20px;
          align-items: center;
          text-align: center;
          margin-bottom: 32px;
        }

        .gp-diff-header-row .gp-section-title {
          text-align: center;
          width: 100%;
        }

        .gp-view-switcher {
          display: inline-flex;
          background: #0D1627;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 8px;
          padding: 4px;
          gap: 4px;
        }

        .gp-switch-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: none;
          color: #94A3B8;
          padding: 8px 14px;
          border-radius: 6px;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
        }

        .gp-switch-btn.active {
          background: #0046FC;
          color: #FFFFFF;
          box-shadow: 0 2px 8px rgba(0, 70, 252, 0.4);
        }

        .gp-comparison-table-wrap {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          border: 1px solid rgba(203, 213, 225, 0.15);
          border-radius: 14px;
          background: #0B1322;
        }

        .gp-rich-table {
          width: 100%;
          min-width: 680px;
          border-collapse: collapse;
          text-align: left;
        }

        .gp-rich-table thead tr {
          background: #0F1D33;
          border-bottom: 1px solid rgba(0, 210, 255, 0.25);
        }

        .gp-rich-table th {
          padding: 18px 22px;
          font-size: 15px;
          font-weight: 700;
          color: #FFFFFF;
          letter-spacing: 0.5px;
        }

        .col-header-sol { width: 28%; }
        .col-header-del { width: 34%; }
        .col-header-foc { width: 38%; }

        .gp-rich-table td {
          padding: 18px 22px;
          font-size: 15px;
          vertical-align: middle;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .gp-rich-table tr.row-even { background: #0B1322; }
        .gp-rich-table tr.row-odd { background: #070D18; }

        .gp-rich-table tr:hover {
          background: rgba(0, 70, 252, 0.12);
        }

        .sol-badge-wrap {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .sol-name {
          font-weight: 700;
          color: #FFFFFF;
          font-size: 15.5px;
        }

        .sol-tag-sm {
          font-size: 11px;
          font-weight: 700;
          color: #00D2FF;
          letter-spacing: 0.4px;
        }

        .deliver-highlight {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #F1F5F9;
          font-weight: 500;
        }

        .focus-text {
          color: #CBD5E1;
          line-height: 1.5;
        }

        /* Cards View for Comparison */
        .gp-comparison-cards-grid {
          display: grid;
          gap: 16px;
          grid-template-columns: 1fr;
        }

        @media (min-width: 640px) {
          .gp-comparison-cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .gp-comparison-cards-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .gp-compare-card {
          background: #0B1322;
          border: 1px solid rgba(203, 213, 225, 0.15);
          border-radius: 12px;
          padding: 22px;
        }

        .compare-card-top {
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .compare-tag {
          font-size: 11px;
          font-weight: 800;
          color: #00D2FF;
          letter-spacing: 0.8px;
          text-transform: uppercase;
        }

        .compare-sol-title {
          font-size: 18px;
          font-weight: 800;
          color: #FFFFFF;
          margin: 6px 0 0;
        }

        .compare-row {
          margin-bottom: 12px;
        }

        .compare-label {
          display: block;
          font-size: 11px;
          font-weight: 700;
          color: #64748B;
          letter-spacing: 0.6px;
        }

        .compare-value {
          display: block;
          font-size: 14.5px;
          color: #CBD5E1;
          margin-top: 3px;
        }

        .compare-value.highlight {
          color: #00D2FF;
          font-weight: 600;
        }

        /* =========================================================
           SECTION 5: PROCESS TIMELINE (INTERACTIVE)
           ========================================================= */
        .gp-process-section {
          border-bottom: 1px solid rgba(203, 213, 225, 0.08);
          background: transparent;
        }

        .gp-interactive-steps-container {
          margin-top: 44px;
        }

        .gp-steps-bar {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          margin-bottom: 24px;
        }

        @media (min-width: 768px) {
          .gp-steps-bar {
            grid-template-columns: repeat(5, 1fr);
            gap: 12px;
          }
        }

        .gp-step-pill-btn {
          position: relative;
          background: #0D1627;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 16px 14px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          transition: all 0.22s ease;
          font-family: inherit;
        }

        .gp-step-pill-btn:hover {
          border-color: rgba(0, 210, 255, 0.4);
          background: #111D33;
        }

        .gp-step-pill-btn.active {
          background: linear-gradient(180deg, #102140 0%, #0A162C 100%);
          border-color: #00D2FF;
          box-shadow: 0 0 16px rgba(0, 210, 255, 0.25);
        }

        .gp-step-pill-btn .step-num {
          font-size: 12px;
          font-weight: 800;
          color: #64748B;
        }

        .gp-step-pill-btn.active .step-num {
          color: #00D2FF;
        }

        .gp-step-pill-btn .step-name {
          font-size: 16px;
          font-weight: 800;
          color: #E2E8F0;
        }

        .gp-step-pill-btn.active .step-name {
          color: #FFFFFF;
        }

        .active-indicator {
          position: absolute;
          bottom: -2px;
          left: 50%;
          transform: translateX(-50%);
          width: 24px;
          height: 3px;
          background: #00D2FF;
          border-radius: 2px;
          box-shadow: 0 0 8px #00D2FF;
        }

        .gp-active-step-panel {
          background: #0D1627;
          border: 1.5px solid rgba(0, 210, 255, 0.35);
          border-radius: 16px;
          padding: 32px;
          display: grid;
          gap: 28px;
          grid-template-columns: 1fr;
          align-items: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }

        @media (min-width: 768px) {
          .gp-active-step-panel {
            grid-template-columns: 1fr auto;
            padding: 36px 44px;
          }
        }

        .panel-step-badge {
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 1px;
          color: #00D2FF;
        }

        .panel-step-title {
          font-size: clamp(22px, 3vw, 28px);
          font-weight: 800;
          color: #FFFFFF;
          margin: 8px 0 0;
        }

        .panel-step-desc {
          font-size: 16.5px;
          line-height: 1.65;
          color: #CBD5E1;
          margin: 12px 0 0;
          max-width: 680px;
        }

        .step-visual-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 14px;
          background: linear-gradient(135deg, #0A1424 0%, #060C16 100%);
          border: 1.5px solid rgba(0, 210, 255, 0.35);
          border-radius: 16px;
          padding: 26px 36px;
          min-width: 170px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6), inset 0 0 20px rgba(0, 70, 252, 0.15);
          transition: border-color 0.25s ease, box-shadow 0.25s ease;
        }

        .step-visual-box:hover {
          border-color: rgba(0, 210, 255, 0.6);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.7), 0 0 20px rgba(0, 210, 255, 0.25);
        }

        .step-icon-glow {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0, 210, 255, 0.2) 0%, rgba(0, 70, 252, 0.1) 60%, transparent 80%);
          border: 1.5px solid rgba(0, 210, 255, 0.45);
          box-shadow: 0 0 24px rgba(0, 210, 255, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .step-visual-box:hover .step-icon-glow {
          transform: scale(1.08);
          border-color: #00D2FF;
          box-shadow: 0 0 32px rgba(0, 210, 255, 0.5);
        }

        .step-pro-svg {
          display: block;
          filter: drop-shadow(0 0 8px rgba(0, 210, 255, 0.5));
          transition: transform 0.25s ease;
        }

        .step-visual-box:hover .step-pro-svg {
          transform: scale(1.05);
        }

        .step-status-chip {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-size: 12px;
          font-weight: 700;
          color: #10B981;
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.35);
          border-radius: 20px;
          padding: 4px 12px;
          letter-spacing: 0.3px;
        }

        .chip-pulse-dot {
          width: 6px;
          height: 6px;
          background: #10B981;
          border-radius: 50%;
          box-shadow: 0 0 8px #10B981;
          animation: chipPulse 1.8s infinite ease-in-out;
        }

        @keyframes chipPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.5; }
        }

        .gp-foundational-quote-card {
          margin-top: 36px;
          background: linear-gradient(135deg, rgba(0, 70, 252, 0.12) 0%, rgba(13, 22, 39, 0.8) 100%);
          border: 1px solid rgba(0, 210, 255, 0.25);
          border-radius: 14px;
          padding: 28px 32px;
          position: relative;
        }

        .quote-icon {
          font-size: 42px;
          font-weight: 900;
          color: rgba(0, 210, 255, 0.4);
          line-height: 0.8;
          margin-bottom: 8px;
        }

        .quote-text {
          margin: 0;
          font-size: 16.5px;
          line-height: 1.7;
          color: #E2E8F0;
        }

        .quote-text strong {
          color: #00D2FF;
        }

        /* =========================================================
           SECTION 6: WHY GETPROSPEKT
           ========================================================= */
        .gp-why-section {
          border-bottom: 1px solid rgba(203, 213, 225, 0.08);
          background: transparent;
        }

        .gp-why-tagline {
          font-size: clamp(19px, 2.5vw, 22px);
          font-weight: 700;
          color: #FFFFFF;
          margin: 12px 0 0;
        }

        .gp-why-cards-grid {
          margin-top: 44px;
          display: grid;
          gap: 24px;
          grid-template-columns: 1fr;
        }

        @media (min-width: 768px) {
          .gp-why-cards-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .gp-why-card {
          background: #0D1627;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 16px;
          padding: 32px 26px;
          display: flex;
          flex-direction: column;
          transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
        }

        .gp-why-card:hover {
          transform: translateY(-4px);
          border-color: rgba(0, 210, 255, 0.45);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.5), 0 0 14px rgba(0, 210, 255, 0.2);
        }

        .gp-why-card.featured {
          background: linear-gradient(180deg, #102140 0%, #0D1627 100%);
          border-color: rgba(0, 210, 255, 0.4);
        }

        .why-card-icon {
          width: 52px;
          height: 52px;
          background: rgba(0, 210, 255, 0.1);
          border: 1px solid rgba(0, 210, 255, 0.3);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }

        .why-card-title {
          font-size: 20px;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0;
          line-height: 1.35;
        }

        .why-card-copy {
          font-size: 15.5px;
          line-height: 1.65;
          color: #CBD5E1;
          margin: 14px 0 0;
        }

        /* =========================================================
           SECTION 7: HOW WE WORK
           ========================================================= */
        .gp-how-section {
          border-bottom: 1px solid rgba(203, 213, 225, 0.08);
          background: transparent;
        }

        .gp-how-cards-grid {
          margin-top: 44px;
          display: grid;
          gap: 24px;
          grid-template-columns: 1fr;
        }

        @media (min-width: 768px) {
          .gp-how-cards-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .gp-how-work-card {
          background: #0D1627;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 30px;
          display: flex;
          flex-direction: column;
          transition: transform 0.25s ease, border-color 0.25s ease;
        }

        .gp-how-work-card:hover {
          transform: translateY(-4px);
          border-color: rgba(0, 210, 255, 0.45);
        }

        .how-work-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 18px;
        }

        .how-work-phase {
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 1px;
          color: #00D2FF;
          background: rgba(0, 210, 255, 0.1);
          border-radius: 6px;
          padding: 4px 10px;
        }

        .how-work-icon {
          color: #38BDF8;
        }

        .how-work-title {
          font-size: 22px;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0;
        }

        .how-work-desc {
          font-size: 15.5px;
          line-height: 1.65;
          color: #CBD5E1;
          margin: 12px 0 0;
        }

        /* =========================================================
           SECTION 8: FAQ ACCORDION WITH SEARCH
           ========================================================= */
        .gp-faq-section {
          border-bottom: 1px solid rgba(203, 213, 225, 0.08);
          background: transparent;
        }

        .gp-faq-search-box {
          max-width: 640px;
          margin: 32px auto 0;
          display: flex;
          align-items: center;
          gap: 12px;
          background: #0D1627;
          border: 1.5px solid rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          padding: 12px 18px;
          transition: border-color 0.2s ease;
        }

        .gp-faq-search-box:focus-within {
          border-color: #00D2FF;
          box-shadow: 0 0 16px rgba(0, 210, 255, 0.2);
        }

        .gp-faq-input {
          flex: 1;
          background: transparent;
          border: none;
          color: #FFFFFF;
          font-size: 15px;
          outline: none;
          font-family: inherit;
        }

        .gp-faq-input::placeholder {
          color: #64748B;
        }

        .gp-faq-clear-btn {
          background: transparent;
          border: none;
          color: #94A3B8;
          font-size: 14px;
          cursor: pointer;
        }

        .gp-faq-accordion-container {
          max-width: 840px;
          margin: 36px auto 0;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .gp-faq-item-card {
          background: #0D1627;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          overflow: hidden;
          transition: border-color 0.2s ease;
        }

        .gp-faq-item-card.open {
          border-color: rgba(0, 210, 255, 0.5);
          background: #0F1A30;
        }

        .gp-faq-item-trigger {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          padding: 20px 24px;
          background: transparent;
          border: none;
          color: #FFFFFF;
          text-align: left;
          cursor: pointer;
          font-family: inherit;
        }

        .gp-faq-item-trigger:hover {
          color: #00D2FF;
        }

        .faq-q-text {
          font-size: clamp(16.5px, 2.2vw, 18px);
          font-weight: 700;
          line-height: 1.4;
          color: inherit;
        }

        .faq-toggle-circle {
          width: 32px;
          height: 32px;
          background: rgba(0, 210, 255, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #00D2FF;
        }

        .faq-arrow-svg {
          transition: transform 0.25s ease;
        }

        .faq-arrow-svg.rotated {
          transform: rotate(180deg);
        }

        .gp-faq-item-answer {
          padding: 0 24px 22px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }

        .faq-a-text {
          margin: 16px 0 0;
          font-size: 16px;
          line-height: 1.65;
          color: #CBD5E1;
        }

        .gp-faq-empty {
          text-align: center;
          padding: 40px 20px;
          color: #94A3B8;
        }

        .gp-link-btn {
          background: transparent;
          border: none;
          color: #00D2FF;
          font-size: 14.5px;
          font-weight: 700;
          cursor: pointer;
          text-decoration: underline;
          margin-top: 8px;
        }

        /* =========================================================
           SECTION 9: BOTTOM CTA BANNER
           ========================================================= */
        .gp-bottom-cta-section {
          padding: 40px 0 60px;
          background: transparent;
        }

        .gp-bottom-cta-card {
          position: relative;
          background: linear-gradient(135deg, #0A162C 0%, #070D18 100%);
          border: 1.5px solid rgba(0, 210, 255, 0.4);
          border-radius: 20px;
          padding: 56px 24px;
          overflow: hidden;
          text-align: center;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(0, 70, 252, 0.3);
        }

        @media (min-width: 768px) {
          .gp-bottom-cta-card {
            padding: 72px 48px;
          }
        }

        .cta-glow-circle {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 600px;
          height: 350px;
          background: radial-gradient(circle, rgba(0, 70, 252, 0.3) 0%, rgba(0, 210, 255, 0.1) 40%, transparent 70%);
          filter: blur(50px);
          pointer-events: none;
        }

        .cta-content-wrapper {
          position: relative;
          max-width: 740px;
          margin: 0 auto;
        }

        .gp-cta-pill {
          display: inline-block;
          font-size: 11.5px;
          font-weight: 800;
          letter-spacing: 1.4px;
          color: #00D2FF;
          background: rgba(0, 210, 255, 0.12);
          border: 1px solid rgba(0, 210, 255, 0.35);
          border-radius: 20px;
          padding: 5px 14px;
          margin-bottom: 18px;
        }

        .gp-cta-title {
          font-size: clamp(30px, 4.2vw, 44px);
          font-weight: 850;
          line-height: 1.25;
          letter-spacing: -0.5px;
          color: #FFFFFF;
          margin: 0 auto;
          text-align: center !important;
          text-align-last: center !important;
          width: 100%;
        }

        .gp-cta-desc {
          margin: 18px auto 0;
          max-width: 680px;
          font-size: clamp(16.5px, 2.2vw, 18.5px);
          line-height: 1.65;
          color: #CBD5E1;
          text-align: center !important;
          text-align-last: center !important;
          text-justify: auto !important;
        }

        .gp-cta-btn-group {
          margin-top: 36px;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 16px;
        }

        .gp-cta-guarantees {
          margin-top: 32px;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          gap: 12px;
          font-size: 13.5px;
          color: #94A3B8;
        }

        .gp-cta-guarantees span {
          white-space: nowrap;
        }
      `}</style>
    </>
  );
}

export default Home;

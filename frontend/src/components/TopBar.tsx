import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { articles } from "../pages/Article";
import gettLogo from "../assets/images/gett.png";
import { enquiriesApi } from "../services/api";

function TopBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [subscribeOpen, setSubscribeOpen] = useState(false);
  const [subName, setSubName] = useState("");
  const [subEmail, setSubEmail] = useState("");
  const [subCompany, setSubCompany] = useState("");
  const [subSuccess, setSubSuccess] = useState(false);
  const [subLoading, setSubLoading] = useState(false);
  const [subError, setSubError] = useState("");

  const menuItems = [
    { label: "B2B Lead Generation", path: "/article/better-pipeline-starts-with-better-decisions" },
    { label: "Demand Generation", path: "/article/mql-generation" },
    { label: "MQL Generation", path: "/article/mql-generation" },
    { label: "SQL Generation", path: "/article/sql-generation" },
    { label: "BANT Qualified Leads", path: "/article/bant-qualified-leads" },
    { label: "Appointment Generation", path: "/article/appointment-generation" },
    { label: "Webinar Campaigns", path: "/article/webinar-campaigns" },
    { label: "Human-Verified Data", path: "/article/human-verified-data" },
    { label: "Lead Qualification", path: "/article/bant-qualified-leads" },
    { label: "Pipeline Growth", path: "/article/better-pipeline-starts-with-better-decisions" },
    { label: "Sales Development", path: "/article/sql-generation" },
    { label: "B2B Marketing", path: "/article/mql-generation" },
    { label: "Case Studies", path: "/case-studies" },
    { label: "Learning Center", path: "/faq" },
    { label: "Events & Webinars", path: "/events" },
  ];

  const searchItems = useMemo(() => {
    const pageItems = [
      {
        title: "Latest",
        category: "Page",
        description: "Latest B2B marketing news, insights, articles and updates.",
        link: "/",
      },
      {
        title: "Leadership",
        category: "Page",
        description: "Leadership and expert insights from business and marketing professionals.",
        link: "/",
      },
      {
        title: "Features",
        category: "Page",
        description: "Articles, learning center content, marketing insights and expert resources.",
        link: "/",
      },
      {
        title: "FAQ",
        category: "Page",
        description: "Frequently asked questions about GETprospeKt, its approach, delivery and partnership.",
        link: "/faq",
      },
      {
        title: "Case Studies",
        category: "Page",
        description: "Real-world lead generation and business growth case studies.",
        link: "/case-studies",
      },
      {
        title: "Events",
        category: "Page",
        description: "Events, webinars and upcoming publication activities.",
        link: "/events",
      },
      {
        title: "Contact Us",
        category: "Page",
        description: "Get in touch with GETprospeKt.",
        link: "/contact",
      },
      ...menuItems.map((item) => ({
        title: item.label,
        category: "Category",
        description: `${item.label} insights, articles and resources.`,
        link: item.path,
      })),
      ...articles.map((article) => {
        const sectionText = (article.sections || [])
          .map((section) =>
            [
              section.heading,
              ...(section.paragraphs || []),
              ...(section.bullets || []),
              ...(section.faqs || []).flatMap((faq) => [faq.question, faq.answer]),
            ].join(" ")
          )
          .join(" ");

        return {
          title: article.title,
          category: article.category,
          description: `${article.description} ${sectionText}`,
          link: `/article/${article.slug}`,
          author: article.author,
        };
      }),
    ];

    return pageItems;
  }, []);

  const filteredResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return [];

    const terms = query.split(/\s+/).filter(Boolean);

    return searchItems
      .map((item) => {
        const searchable = [
          item.title,
          item.category,
          item.description,
          "author" in item ? item.author : "",
        ]
          .join(" ")
          .toLowerCase();

        const matchedTerms = terms.filter((term) => searchable.includes(term));
        return {
          ...item,
          score: matchedTerms.length,
        };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12);
  }, [searchQuery, searchItems]);

  useEffect(() => {
    if (!searchOpen && !subscribeOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (searchOpen) {
          setSearchOpen(false);
          setSearchQuery("");
        }
        if (subscribeOpen) {
          closeSubscribe();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [searchOpen, subscribeOpen]);

  const openSearch = () => {
    setMenuOpen(false);
    setSearchOpen(true);
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery("");
  };

  const closeSubscribe = () => {
    setSubscribeOpen(false);
    setTimeout(() => {
      setSubSuccess(false);
      setSubError("");
      setSubName("");
      setSubEmail("");
      setSubCompany("");
    }, 300);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subEmail.trim()) {
      setSubError("Please enter your work email.");
      return;
    }
    setSubLoading(true);
    setSubError("");
    try {
      const parts = subName.trim().split(" ");
      const firstName = parts[0] || "Subscriber";
      const lastName = parts.slice(1).join(" ") || "Reader";
      await enquiriesApi.submit({
        firstName,
        lastName,
        email: subEmail.trim(),
        company: subCompany.trim() || "Independent Subscriber",
        subject: "Newsletter Subscription",
        message: "Subscribed to GETprospeKt publication newsletter and weekly insights.",
      });
      setSubSuccess(true);
    } catch (err: any) {
      setSubError(err.message || "Failed to subscribe. Please try again.");
    } finally {
      setSubLoading(false);
    }
  };

  return (
    <>
      <header className="topbar">
        <div className="topbar-inner">
          <button
            className="topbar-menu-button"
            type="button"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <span />
            <span />
            <span />
          </button>

          <Link to="/" className="topbar-logo" aria-label="GETprospeKt Home">
            <img
              src={gettLogo}
              alt="GETprospeKt"
              className="getprospekt-logo"
            />
          </Link>

          <div className="topbar-actions">
            <button
              type="button"
              className="topbar-search"
              aria-label="Search"
              onClick={openSearch}
            >
              <span className="search-glass" />
            </button>

            <Link to="/login" className="topbar-login-button">
              Login
            </Link>

            <button
              type="button"
              className="subscribe-button"
              onClick={() => setSubscribeOpen(true)}
            >
              Subscribe
            </button>
          </div>
        </div>
      </header>

      {searchOpen && (
        <div className="search-overlay" onClick={closeSearch}>
          <div
            className="search-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Search GETprospeKt"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="search-panel-header">
              <div>
                <span className="search-panel-eyebrow">SEARCH</span>
                <h2>Search GETprospeKt</h2>
              </div>
              <button
                type="button"
                className="search-close"
                aria-label="Close search"
                onClick={closeSearch}
              >
                ×
              </button>
            </div>

            <div className="search-input-wrap">
              <span className="search-input-icon" />
              <input
                autoFocus
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search articles, topics, categories, FAQs..."
                aria-label="Search content"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="search-clear"
                  aria-label="Clear search"
                  onClick={() => setSearchQuery("")}
                >
                  ×
                </button>
              )}
            </div>

            <div className="search-results">
              {!searchQuery.trim() ? (
                <div className="search-empty">
                  <strong>Find anything on the publication</strong>
                  <p>
                    Search article titles, categories, authors, FAQs, case
                    studies, events and marketing topics.
                  </p>
                </div>
              ) : filteredResults.length > 0 ? (
                <>
                  <div className="search-results-count">
                    {filteredResults.length} result{filteredResults.length !== 1 ? "s" : ""}
                  </div>

                  {filteredResults.map((item) => (
                    <Link
                      key={`${item.category}-${item.title}-${item.link}`}
                      to={item.link}
                      className="search-result-item"
                      onClick={closeSearch}
                    >
                      <div className="search-result-category">{item.category}</div>
                      <div className="search-result-title">{item.title}</div>
                      <div className="search-result-description">
                        {item.description.length > 180
                          ? `${item.description.slice(0, 180)}...`
                          : item.description}
                      </div>
                    </Link>
                  ))}
                </>
              ) : (
                <div className="search-empty">
                  <strong>No results found</strong>
                  <p>
                    Try a different keyword, topic, category or article name.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {subscribeOpen && (
        <div className="subscribe-overlay" onClick={closeSubscribe}>
          <div
            className="subscribe-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Subscribe to GETprospeKt"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="subscribe-close"
              aria-label="Close modal"
              onClick={closeSubscribe}
            >
              ×
            </button>

            {!subSuccess ? (
              <div className="subscribe-modal-content">
                <div className="subscribe-modal-badge">
                  <span>✉</span> NEWSLETTER
                </div>
                <h2>Subscribe to GETprospeKt</h2>
                <p className="subscribe-modal-subtitle">
                  Join B2B marketing leaders and enterprise executives. Receive our curated weekly market intelligence, lead generation playbooks, and strategic analysis directly in your inbox.
                </p>

                {subError && <div className="subscribe-error">{subError}</div>}

                <form onSubmit={handleSubscribe} className="subscribe-form">
                  <div className="subscribe-field">
                    <label>Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Alex Morgan"
                      value={subName}
                      onChange={(e) => setSubName(e.target.value)}
                      autoFocus
                    />
                  </div>

                  <div className="subscribe-field">
                    <label>Work Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="alex@company.com"
                      value={subEmail}
                      onChange={(e) => setSubEmail(e.target.value)}
                    />
                  </div>

                  <div className="subscribe-field">
                    <label>Company Name (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Acme Corp"
                      value={subCompany}
                      onChange={(e) => setSubCompany(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    className="subscribe-submit-btn"
                    disabled={subLoading}
                  >
                    {subLoading ? "Subscribing..." : "Join Newsletter →"}
                  </button>
                </form>

                <div className="subscribe-privacy-note">
                  🔒 No spam, ever. Unsubscribe at any time with a single click.
                </div>
              </div>
            ) : (
              <div className="subscribe-success-content">
                <div className="subscribe-success-icon">🎉</div>
                <h2>You're Subscribed!</h2>
                <p>
                  Thank you for subscribing to <strong>GETprospeKt</strong>. We've added <strong>{subEmail}</strong> to our dispatch list.
                </p>
                <p className="subscribe-success-hint">
                  Check your inbox for our latest B2B growth reports and weekly editorial highlights.
                </p>
                <button
                  type="button"
                  className="subscribe-submit-btn"
                  onClick={closeSubscribe}
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div
        className={`topbar-overlay ${menuOpen ? "show" : ""}`}
        onClick={() => setMenuOpen(false)}
      />

      <aside className={`side-menu ${menuOpen ? "open" : ""}`}>
        <div className="side-menu-header">
          <strong>Categories</strong>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          >
            ×
          </button>
        </div>

        <nav className="side-menu-nav">
          {menuItems.map((item) => (
            <Link
              to={item.path}
              key={`${item.label}-${item.path}`}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Zeyada&display=swap");

        * {
          box-sizing: border-box;
        }

        .topbar {
          width: 100%;
          height: 88px;
          background: #000000;
          color: #fff;
          position: relative;
          z-index: 1000;
        }

        .topbar-inner {
          width: min(1240px, calc(100% - 48px));
          height: 100%;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .topbar-menu-button {
          width: 42px;
          height: 42px;
          border: 0;
          padding: 7px 3px;
          background: transparent;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 6px;
          cursor: pointer;
          flex-shrink: 0;
        }

        .topbar-menu-button span {
          display: block;
          width: 31px;
          height: 5px;
          border-radius: 1px;
          background: #fff;
        }

        .topbar-logo {
          margin-right: auto;
          margin-left: 5px;
          display: inline-flex;
          align-items: center;
          color: #25234a;
          text-decoration: none;
          height: 68px;
        }

        .getprospekt-logo {
          display: block;
          width: 180px;
          max-width: 100%;
          height: auto;
          max-height: 58px;
          object-fit: contain;
        }

        .logo-talk {
          align-self: flex-start;
          margin-top: 9px;
          font-size: 25px;
          line-height: 1;
          font-weight: 300;
          letter-spacing: -1px;
        }

        .logo-cmo {
          margin-top: 22px;
          margin-left: -58px;
          font-size: 29px;
          line-height: 1;
          font-weight: 800;
          letter-spacing: -1.5px;
        }

        .logo-circle {
          width: 49px;
          height: 49px;
          margin-left: 5px;
          border-radius: 50%;
          background: #fff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .logo-circle span {
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background: #96AEFC;
          display: block;
          margin-top: -5px;
        }

        .topbar-actions {
          display: flex;
          align-items: center;
          gap: 28px;
        }

        .topbar-search {
          width: 42px;
          height: 42px;
          border: 0;
          background: transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .search-glass {
          width: 24px;
          height: 24px;
          border: 5px solid #FFFFFF;
          border-radius: 50%;
          display: block;
          position: relative;
        }

        .search-glass::after {
          content: "";
          position: absolute;
          width: 11px;
          height: 5px;
          background: #FFFFFF;
          border-radius: 3px;
          right: -9px;
          bottom: -5px;
          transform: rotate(48deg);
          transform-origin: center;
        }

        .topbar-login-button {
          min-width: 82px;
          height: 38px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255,255,255,.75);
          border-radius: 4px;
          background: transparent;
          color: #FFFFFF;
          padding: 0 18px;
          font-size: 15px;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          transition: .2s ease;
        }

        .topbar-login-button:hover {
          background: #FFFFFF;
          color: #000000;
        }

        .subscribe-button {
          min-width: 147px;
          height: 38px;
          border: 0;
          border-radius: 4px;
          background: #7568E8;
          color: #FFFFFF;
          padding: 0 25px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: .2s ease;
        }

        .subscribe-button:hover {
          background: #5144C8;
          transform: translateY(-1px);
        }

        .subscribe-overlay {
          position: fixed;
          inset: 0;
          z-index: 2500;
          background: rgba(0, 0, 0, 0.72);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: subFadeIn .2s ease-out;
        }

        @keyframes subFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .subscribe-modal {
          background: #121022;
          width: min(520px, 100%);
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          padding: 36px 32px 32px;
          position: relative;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.55);
          color: #D5DBE7;
          animation: subScaleUp .25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes subScaleUp {
          from { opacity: 0; transform: scale(0.94) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        .subscribe-close {
          position: absolute;
          top: 18px;
          right: 18px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 0;
          background: #17152A;
          color: #AEB8CA;
          font-size: 24px;
          line-height: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: .15s ease;
        }

        .subscribe-close:hover {
          background: #7568E8;
          color: #FFFFFF;
        }

        .subscribe-modal-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #17152A;
          color: #96AEFC;
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1px;
          margin-bottom: 12px;
        }

        .subscribe-modal h2 {
          font-size: 24px;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0 0 10px;
          font-family: var(--font-serif);
        }

        .subscribe-modal-subtitle {
          font-size: 14px;
          line-height: 1.55;
          color: #AEB8CA;
          margin: 0 0 22px;
        }

        .subscribe-error {
          background: rgba(225, 29, 72, 0.15);
          border: 1px solid rgba(225, 29, 72, 0.3);
          color: #fecdd3;
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 16px;
        }

        .subscribe-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .subscribe-field {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .subscribe-field label {
          font-size: 12px;
          font-weight: 700;
          color: #D5DBE7;
        }

        .subscribe-field input {
          padding: 11px 14px;
          border: 1.5px solid rgba(255, 255, 255, 0.16);
          border-radius: 8px;
          background: #071019;
          font-size: 14px;
          color: #FFFFFF;
          outline: none;
          transition: .2s ease;
        }

        .subscribe-field input:focus {
          border-color: #7568E8;
          box-shadow: 0 0 0 3px rgba(117, 104, 232, 0.25);
        }

        .subscribe-submit-btn {
          margin-top: 6px;
          padding: 13px;
          background: #7568E8;
          color: #ffffff;
          border: 0;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: .2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .subscribe-submit-btn:hover:not(:disabled) {
          background: #5144C8;
          transform: translateY(-1px);
        }

        .subscribe-submit-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .subscribe-privacy-note {
          margin-top: 14px;
          text-align: center;
          font-size: 12px;
          color: #AEB8CA;
        }

        .subscribe-success-content {
          text-align: center;
          padding: 20px 10px 10px;
        }

        .subscribe-success-icon {
          font-size: 48px;
          margin-bottom: 14px;
        }

        .subscribe-success-content h2 {
          font-size: 24px;
          margin-bottom: 10px;
          color: #FFFFFF;
        }

        .subscribe-success-content p {
          font-size: 14px;
          color: #D5DBE7;
          line-height: 1.5;
          margin-bottom: 8px;
        }

        .subscribe-success-hint {
          font-size: 13px;
          color: #AEB8CA;
          margin-bottom: 24px !important;
        }

        .search-overlay {
          position: fixed;
          inset: 0;
          z-index: 2000;
          background: rgba(0, 0, 0, .75);
          backdrop-filter: blur(7px);
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 105px 20px 30px;
          overflow-y: auto;
        }

        .search-panel {
          width: min(900px, 100%);
          max-height: calc(100vh - 135px);
          overflow: hidden;
          background: #121022;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 18px;
          box-shadow: 0 24px 70px rgba(0, 0, 0, .55);
          color: #D5DBE7;
          display: flex;
          flex-direction: column;
        }

        .search-panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 28px 16px;
        }

        .search-panel-eyebrow {
          display: block;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 2px;
          color: #96AEFC;
          margin-bottom: 5px;
        }

        .search-panel-header h2 {
          margin: 0;
          font-size: 25px;
          line-height: 1.2;
          font-weight: 800;
          color: #FFFFFF;
        }

        .search-close {
          width: 40px;
          height: 40px;
          border: 0;
          border-radius: 50%;
          background: #17152A;
          color: #AEB8CA;
          font-size: 28px;
          line-height: 1;
          cursor: pointer;
          transition: .15s ease;
        }

        .search-close:hover {
          background: #7568E8;
          color: #FFFFFF;
        }

        .search-input-wrap {
          margin: 0 28px 18px;
          min-height: 54px;
          display: flex;
          align-items: center;
          gap: 13px;
          border: 2px solid rgba(255, 255, 255, 0.16);
          border-radius: 10px;
          padding: 0 15px;
          background: #071019;
          transition: border-color .2s ease, box-shadow .2s ease;
        }

        .search-input-wrap:focus-within {
          border-color: #7568E8;
          box-shadow: 0 0 0 4px rgba(117, 104, 232, .25);
        }

        .search-input-icon {
          width: 19px;
          height: 19px;
          border: 3px solid #96AEFC;
          border-radius: 50%;
          display: block;
          position: relative;
          flex-shrink: 0;
        }

        .search-input-icon::after {
          content: "";
          position: absolute;
          width: 8px;
          height: 3px;
          border-radius: 3px;
          background: #96AEFC;
          right: -7px;
          bottom: -4px;
          transform: rotate(48deg);
        }

        .search-input-wrap input {
          width: 100%;
          height: 50px;
          border: 0;
          outline: 0;
          background: transparent;
          color: #FFFFFF;
          font-size: 16px;
        }

        .search-input-wrap input::placeholder {
          color: #AEB8CA;
        }

        .search-clear {
          width: 28px;
          height: 28px;
          border: 0;
          border-radius: 50%;
          background: #17152A;
          color: #AEB8CA;
          font-size: 19px;
          cursor: pointer;
          flex-shrink: 0;
          transition: .15s ease;
        }

        .search-clear:hover {
          background: #7568E8;
          color: #FFFFFF;
        }

        .search-results {
          overflow-y: auto;
          padding: 0 28px 28px;
        }

        .search-results-count {
          font-size: 12px;
          font-weight: 700;
          color: #AEB8CA;
          margin: 2px 0 9px;
        }

        .search-result-item {
          display: block;
          text-decoration: none;
          color: inherit;
          padding: 15px 16px;
          margin-bottom: 8px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          background: #17152A;
          transition: .18s ease;
        }

        .search-result-item:hover {
          border-color: #7568E8;
          background: #121022;
          transform: translateY(-1px);
        }

        .search-result-category {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: .7px;
          text-transform: uppercase;
          color: #96AEFC;
          margin-bottom: 5px;
        }

        .search-result-title {
          font-size: 17px;
          line-height: 1.35;
          font-weight: 800;
          color: #FFFFFF;
          margin-bottom: 5px;
        }

        .search-result-description {
          font-size: 13px;
          line-height: 1.55;
          color: #AEB8CA;
        }

        .search-empty {
          text-align: center;
          padding: 55px 25px 65px;
          color: #AEB8CA;
        }

        .search-empty strong {
          display: block;
          color: #FFFFFF;
          font-size: 18px;
          margin-bottom: 8px;
        }

        .search-empty p {
          margin: 0 auto;
          max-width: 560px;
          font-size: 14px;
          line-height: 1.6;
        }

        .topbar-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,.6);
          opacity: 0;
          visibility: hidden;
          transition: .25s ease;
          z-index: 1090;
        }

        .topbar-overlay.show {
          opacity: 1;
          visibility: visible;
        }

        .side-menu {
          position: fixed;
          z-index: 1100;
          top: 0;
          left: 0;
          width: min(375px, 88vw);
          height: 100vh;
          background: #121022;
          border-right: 1px solid rgba(255, 255, 255, 0.08);
          color: #D5DBE7;
          transform: translateX(-100%);
          transition: transform .28s ease;
          overflow-y: auto;
          box-shadow: 8px 0 30px rgba(0,0,0,.5);
        }

        .side-menu.open {
          transform: translateX(0);
        }

        .side-menu-header {
          min-height: 72px;
          padding: 0 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255,255,255,.08);
          position: sticky;
          top: 0;
          background: #121022;
          z-index: 2;
        }

        .side-menu-header strong {
          font-size: 18px;
          color: #FFFFFF;
        }

        .side-menu-header button {
          border: 0;
          background: transparent;
          color: #AEB8CA;
          font-size: 34px;
          line-height: 1;
          cursor: pointer;
          padding: 0 5px;
        }

        .side-menu-header button:hover {
          color: #FFFFFF;
        }

        .side-menu-nav {
          display: flex;
          flex-direction: column;
          padding: 8px 0 30px;
        }

        .side-menu-nav a {
          color: #D5DBE7;
          text-decoration: none;
          padding: 13px 22px;
          font-size: 14px;
          border-bottom: 1px solid rgba(255,255,255,.07);
          transition: .18s ease;
        }

        .side-menu-nav a:hover {
          background: #17152A;
          color: #96AEFC;
          padding-left: 28px;
        }

        @media (max-width: 700px) {
          .search-overlay {
            padding: 82px 10px 15px;
          }

          .search-panel {
            max-height: calc(100vh - 97px);
            border-radius: 14px;
          }

          .search-panel-header {
            padding: 18px 18px 12px;
          }

          .search-panel-header h2 {
            font-size: 21px;
          }

          .search-input-wrap {
            margin: 0 18px 14px;
            min-height: 50px;
          }

          .search-input-wrap input {
            height: 46px;
            font-size: 14px;
          }

          .search-results {
            padding: 0 18px 18px;
          }

          .search-result-item {
            padding: 13px;
          }

          .search-result-title {
            font-size: 15px;
          }

          .search-result-description {
            font-size: 12px;
          }

          .topbar {
            height: 74px;
          }

          .topbar-inner {
            width: calc(100% - 24px);
          }

          .topbar-logo {
            margin-left: 1px;
          }

          .getprospekt-logo {
            width: 145px;
            max-height: 50px;
          }

          .logo-talk {
            font-size: 20px;
            margin-top: 6px;
          }

          .logo-cmo {
            font-size: 24px;
            margin-left: -48px;
            margin-top: 20px;
          }

          .logo-circle {
            width: 40px;
            height: 40px;
            margin-left: 4px;
          }

          .logo-circle span {
            width: 12px;
            height: 12px;
          }

          .topbar-actions {
            gap: 10px;
          }

          .topbar-search {
            width: 35px;
          }

          .search-glass {
            width: 20px;
            height: 20px;
            border-width: 4px;
          }

          .topbar-login-button {
            min-width: 72px;
            height: 34px;
            padding: 0 11px;
            font-size: 13px;
          }

          .subscribe-button {
            min-width: 95px;
            height: 34px;
            padding: 0 13px;
            font-size: 14px;
          }
        }

        @media (max-width: 430px) {
          .topbar-inner {
            width: calc(100% - 16px);
          }

          .topbar-menu-button {
            width: 36px;
          }

          .topbar-menu-button span {
            width: 27px;
            height: 4px;
          }

          .logo-talk {
            font-size: 17px;
          }

          .getprospekt-logo {
            width: 125px;
            max-height: 44px;
          }

          .logo-cmo {
            font-size: 21px;
            margin-left: -41px;
          }

          .logo-circle {
            width: 35px;
            height: 35px;
          }

          .topbar-actions {
            gap: 4px;
          }

          .topbar-login-button {
            min-width: 62px;
            padding: 0 8px;
            font-size: 12px;
          }

          .subscribe-button {
            min-width: 84px;
            padding: 0 9px;
            font-size: 13px;
          }
        }
      `}</style>
    </>
  );
}

export default TopBar;

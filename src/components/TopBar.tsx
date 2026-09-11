import { useEffect, useMemo, useState } from "react";
import { articles } from "../pages/Article";

function TopBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const menuItems = [
    "Digital Marketing",
    "Content Marketing",
    "Email Marketing",
    "Influencer Marketing",
    "Guerrilla Marketing",
    "Brand Management",
    "Event Management",
    "Affiliate Marketing",
    "Marketing Communications",
    "Print Marketing",
    "SEO",
    "SEM",
    "Social Media Marketing",
    "Strategic Marketing",
    "Business Marketing",
    "Cause Marketing",
    "Database Marketing",
    "Inbound Marketing",
    "Outbound Marketing",
    "Product Marketing",
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
        title: item,
        category: "Category",
        description: `${item} marketing insights, articles and resources.`,
        link: "/",
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
    if (!searchOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSearchOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [searchOpen]);

  const openSearch = () => {
    setMenuOpen(false);
    setSearchOpen(true);
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery("");
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

          <a href="/" className="topbar-logo" aria-label="GETprospeKt Home">
            <img
              src="/src/assets/images/gett.png"
              alt="GETprospeKt"
              className="getprospekt-logo"
            />
          </a>

          <div className="topbar-actions">
            <button
              type="button"
              className="topbar-search"
              aria-label="Search"
              onClick={openSearch}
            >
              <span className="search-glass" />
            </button>

            <button type="button" className="subscribe-button">
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
                    <a
                      key={`${item.category}-${item.title}-${item.link}`}
                      href={item.link}
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
                    </a>
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
            <a
              href="#"
              key={item}
              onClick={() => setMenuOpen(false)}
            >
              {item}
            </a>
          ))}
        </nav>
      </aside>

      <style>{`
        * {
          box-sizing: border-box;
        }

        .topbar {
          width: 100%;
          height: 88px;
          background: linear-gradient(115deg, #000000 0%, #080808 30%, #4f536f 65%, #B7BFFF 100%);
          border-top: 4px solid #404040;
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
          background: linear-gradient(135deg, #b9c9ff 0%, #d9d9ff 42%, #c7b8f7 72%, #b8dfff 100%);
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
          border: 5px solid #25234a;
          border-radius: 50%;
          display: block;
          position: relative;
        }

        .search-glass::after {
          content: "";
          position: absolute;
          width: 11px;
          height: 5px;
          background: #25234a;
          border-radius: 3px;
          right: -9px;
          bottom: -5px;
          transform: rotate(48deg);
          transform-origin: center;
        }

        .subscribe-button {
          min-width: 147px;
          height: 38px;
          border: 0;
          border-radius: 4px;
          background: #fff;
          color: #222;
          padding: 0 25px;
          font-size: 17px;
          font-weight: 400;
          cursor: pointer;
          transition: .2s ease;
        }

        .subscribe-button:hover {
          background: #f2efff;
          transform: translateY(-1px);
        }

        .search-overlay {
          position: fixed;
          inset: 0;
          z-index: 2000;
          background: rgba(0, 0, 0, .66);
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
          background: #fff;
          border-radius: 18px;
          box-shadow: 0 24px 70px rgba(0, 0, 0, .35);
          color: #25234a;
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
          color: #6f75a5;
          margin-bottom: 5px;
        }

        .search-panel-header h2 {
          margin: 0;
          font-size: 25px;
          line-height: 1.2;
          font-weight: 800;
        }

        .search-close {
          width: 40px;
          height: 40px;
          border: 0;
          border-radius: 50%;
          background: #f1f1f5;
          color: #25234a;
          font-size: 28px;
          line-height: 1;
          cursor: pointer;
        }

        .search-close:hover {
          background: #e4e5f0;
        }

        .search-input-wrap {
          margin: 0 28px 18px;
          min-height: 54px;
          display: flex;
          align-items: center;
          gap: 13px;
          border: 2px solid #dfe1ec;
          border-radius: 10px;
          padding: 0 15px;
          background: #fff;
          transition: border-color .2s ease, box-shadow .2s ease;
        }

        .search-input-wrap:focus-within {
          border-color: #96aeff;
          box-shadow: 0 0 0 4px rgba(150, 174, 255, .14);
        }

        .search-input-icon {
          width: 19px;
          height: 19px;
          border: 3px solid #25234a;
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
          background: #25234a;
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
          color: #25234a;
          font-size: 16px;
        }

        .search-input-wrap input::placeholder {
          color: #9294a5;
        }

        .search-clear {
          width: 28px;
          height: 28px;
          border: 0;
          border-radius: 50%;
          background: #ececf2;
          color: #55576b;
          font-size: 19px;
          cursor: pointer;
          flex-shrink: 0;
        }

        .search-results {
          overflow-y: auto;
          padding: 0 28px 28px;
        }

        .search-results-count {
          font-size: 12px;
          font-weight: 700;
          color: #77798a;
          margin: 2px 0 9px;
        }

        .search-result-item {
          display: block;
          text-decoration: none;
          color: inherit;
          padding: 15px 16px;
          margin-bottom: 8px;
          border: 1px solid #e8e8ef;
          border-radius: 10px;
          transition: .18s ease;
        }

        .search-result-item:hover {
          border-color: #aebcff;
          background: #f8f9ff;
          transform: translateY(-1px);
        }

        .search-result-category {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: .7px;
          text-transform: uppercase;
          color: #6973a6;
          margin-bottom: 5px;
        }

        .search-result-title {
          font-size: 17px;
          line-height: 1.35;
          font-weight: 800;
          color: #25234a;
          margin-bottom: 5px;
        }

        .search-result-description {
          font-size: 13px;
          line-height: 1.55;
          color: #6e7080;
        }

        .search-empty {
          text-align: center;
          padding: 55px 25px 65px;
          color: #6e7080;
        }

        .search-empty strong {
          display: block;
          color: #25234a;
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
          background: rgba(0,0,0,.42);
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
          background: #25234a;
          color: #fff;
          transform: translateX(-100%);
          transition: transform .28s ease;
          overflow-y: auto;
          box-shadow: 8px 0 30px rgba(0,0,0,.3);
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
          border-bottom: 1px solid rgba(255,255,255,.14);
          position: sticky;
          top: 0;
          background: #25234a;
          z-index: 2;
        }

        .side-menu-header strong {
          font-size: 18px;
        }

        .side-menu-header button {
          border: 0;
          background: transparent;
          color: #fff;
          font-size: 34px;
          line-height: 1;
          cursor: pointer;
          padding: 0 5px;
        }

        .side-menu-nav {
          display: flex;
          flex-direction: column;
          padding: 8px 0 30px;
        }

        .side-menu-nav a {
          color: #fff;
          text-decoration: none;
          padding: 13px 22px;
          font-size: 14px;
          border-bottom: 1px solid rgba(255,255,255,.07);
          transition: .18s ease;
        }

        .side-menu-nav a:hover {
          background: linear-gradient(135deg, #b9c9ff 0%, #d9d9ff 42%, #c7b8f7 72%, #b8dfff 100%);
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

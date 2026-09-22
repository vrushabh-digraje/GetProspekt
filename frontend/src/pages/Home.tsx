import { useEffect, useRef, useState } from "react";

type Article = {
  image: string;
  title: string;
  author: string;
  date: string;
  description: string;
  category: string;
  link: string;
};

type GuestAuthor = {
  title: string;
  author: string;
  date: string;
  description: string;
  image: string;
  authorImage: string;
  link: string;
};

const latestArticles: Article[] = [
  {
    image: "https://plus.unsplash.com/premium_photo-1661340603772-1ae4ff9afcb1?q=80&w=1472&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Better pipeline starts with better decisions.",
    author: "GETprospeKt",
    date: "",
    category: "B2B Lead Generation",
    link: "/article/better-pipeline-starts-with-better-decisions",
    description: "GETprospeKt is a B2B lead-generation partner helping marketing teams turn their target market into qualified leads — at the qualification level their business requires.",
  },
  {
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=90",
    title: "Human-Verified Data",
    author: "GETprospeKt",
    date: "",
    category: "Lead-Generation Solution",
    link: "/article/human-verified-data",
    description: "Prospect data manually reviewed and verified for accuracy, completeness and recency.",
  },
  {
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=90",
    title: "MQL Generation",
    author: "GETprospeKt",
    date: "",
    category: "Lead-Generation Solution",
    link: "/article/mql-generation",
    description: "Marketing-qualified leads generated and qualified against your agreed criteria.",
  },
  {
    image: "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=1600&q=90",
    title: "SQL Generation",
    author: "GETprospeKt",
    date: "",
    category: "Lead-Generation Solution",
    link: "/article/sql-generation",
    description: "Sales-qualified leads that meet your agreed fit, need and sales-readiness criteria.",
  },
];

const popularArticles: Article[] = [
  {
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=90",
    title: "BANT-Qualified Leads",
    author: "GETprospeKt",
    date: "",
    category: "Lead-Generation Solution",
    link: "/article/bant-qualified-leads",
    description: "Leads qualified against Budget, Authority, Need and Timing.",
  },
  {
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=90",
    title: "Appointment Generation",
    author: "GETprospeKt",
    date: "",
    category: "Lead-Generation Solution",
    link: "/article/appointment-generation",
    description: "Confirmed meetings with your agreed target personas.",
  },
  {
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=90",
    title: "Webinar Campaigns",
    author: "GETprospeKt",
    date: "",
    category: "Lead-Generation Solution",
    link: "/article/webinar-campaigns",
    description: "Targeted webinar campaigns designed to drive relevant registrations and engagement.",
  },
];

const moreArticles: Article[] = [
  {
    image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1200&q=90",
    title: "Human-Verified Data",
    author: "GETprospeKt",
    date: "",
    category: "Lead-Generation Solution",
    link: "/article/human-verified-data",
    description: "Prospect data manually reviewed and verified for accuracy, completeness and recency.",
  },
  {
    image: "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=1200&q=90",
    title: "MQL Generation",
    author: "GETprospeKt",
    date: "",
    category: "Lead-Generation Solution",
    link: "/article/mql-generation",
    description: "Marketing-qualified leads generated and qualified against your agreed criteria.",
  },
  {
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=90",
    title: "SQL Generation",
    author: "GETprospeKt",
    date: "",
    category: "Lead-Generation Solution",
    link: "/article/sql-generation",
    description: "Sales-qualified leads that meet your agreed fit, need and sales-readiness criteria.",
  },
  {
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=90",
    title: "BANT-Qualified Leads",
    author: "GETprospeKt",
    date: "",
    category: "Lead-Generation Solution",
    link: "/article/bant-qualified-leads",
    description: "Leads qualified against Budget, Authority, Need and Timing.",
  },
];

/* =========================================================
   UNIQUE GUEST AUTHOR CARDS
   ========================================================= */

const guestAuthors: GuestAuthor[] = [
  {
    title: "Human-Verified Data",
    author: "GETprospeKt",
    date: "",
    description: "Prospect data manually reviewed and verified for accuracy, completeness and recency.",
    image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1000&q=90",
    authorImage: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=90",
    link: "/article/human-verified-data",
  },
  {
    title: "MQL Generation",
    author: "GETprospeKt",
    date: "",
    description: "Marketing-qualified leads generated and qualified against your agreed criteria.",
    image: "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=1000&q=90",
    authorImage: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=600&q=90",
    link: "/article/mql-generation",
  },
  {
    title: "SQL Generation",
    author: "GETprospeKt",
    date: "",
    description: "Sales-qualified leads that meet your agreed fit, need and sales-readiness criteria.",
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1000&q=90",
    authorImage: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=600&q=90",
    link: "/article/sql-generation",
  },
  {
    title: "BANT-Qualified Leads",
    author: "GETprospeKt",
    date: "",
    description: "Leads qualified against Budget, Authority, Need and Timing.",
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1000&q=90",
    authorImage: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=600&q=90",
    link: "/article/bant-qualified-leads",
  },
  {
    title: "Appointment Generation",
    author: "GETprospeKt",
    date: "",
    description: "Confirmed meetings with your agreed target personas.",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1000&q=90",
    authorImage: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=90",
    link: "/article/appointment-generation",
  },
  {
    title: "Webinar Campaigns",
    author: "GETprospeKt",
    date: "",
    description: "Targeted webinar campaigns designed to drive relevant registrations and engagement.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=90",
    authorImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=90",
    link: "/article/webinar-campaigns",
  },
];

function Home() {
  const [activeTab, setActiveTab] =
    useState<"latest" | "popular">("latest");

  const guestTrackRef = useRef<HTMLDivElement | null>(null);

  const tabArticles =
    activeTab === "latest"
      ? latestArticles.slice(1, 4)
      : popularArticles;

  const nextGuest = () => {
    const track = guestTrackRef.current;
    if (!track) return;

    const card = track.querySelector(
      ".guest-author-card"
    ) as HTMLElement | null;

    if (!card) return;

    const gap = window.innerWidth <= 760 ? 14 : 22;

    track.scrollLeft += card.offsetWidth + gap;
  };

  const previousGuest = () => {
    const track = guestTrackRef.current;
    if (!track) return;

    const card = track.querySelector(
      ".guest-author-card"
    ) as HTMLElement | null;

    if (!card) return;

    const gap = window.innerWidth <= 760 ? 14 : 22;

    track.scrollLeft -= card.offsetWidth + gap;

    if (track.scrollLeft < 0) {
      track.scrollLeft += track.scrollWidth / 2;
    }
  };

  /*
    CONTINUOUS GUEST AUTHOR SLIDER
    --------------------------------
    The track contains two identical sets of cards.
    We move the track a few pixels on every animation frame.
    When the first set has completely passed, scrollLeft is
    reset by exactly one set width, so the loop remains seamless.
  */
  useEffect(() => {
    const track = guestTrackRef.current;

    if (!track) return;

    let animationFrame = 0;
    let lastTime = performance.now();
    const speed = 42; // pixels per second

    const move = (time: number) => {
      const delta = Math.min(time - lastTime, 40);
      lastTime = time;

      track.scrollLeft += (speed * delta) / 1000;

      const firstSetWidth = track.scrollWidth / 2;

      if (firstSetWidth > 0 && track.scrollLeft >= firstSetWidth) {
        track.scrollLeft -= firstSetWidth;
      }

      animationFrame = window.requestAnimationFrame(move);
    };

    animationFrame = window.requestAnimationFrame(move);

    return () => {
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

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
                  href={latestArticles[0].link}
                  className="featured-link"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = latestArticles[0].link;
                  }}
                  aria-label={`Open ${latestArticles[0].title}`}
                >

                  <div className="featured-image-wrap">
                    <img
                      src={latestArticles[0].image}
                      alt={latestArticles[0].title}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=90";
                      }}
                    />
                  </div>

                  <div className="featured-content">

                    <span className="article-category">
                      {latestArticles[0].category}
                    </span>

                    <h2>
                      {latestArticles[0].title}
                    </h2>

                    <div className="article-meta">
                      By{" "}
                      <strong>
                        {latestArticles[0].author}
                      </strong>

                      <span>|</span>

                      {latestArticles[0].date}
                    </div>

                    <p>
                      {latestArticles[0].description}
                    </p>

                    <span
                      className="read-more"
                      role="link"
                      tabIndex={0}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.location.href = latestArticles[0].link;
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          window.location.href = latestArticles[0].link;
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
                            "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=90";
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

                {moreArticles.map((article) => (
                  <article
                    className="more-article"
                    key={article.link}
                  >

                    <a
                      href={article.link}
                      className="more-image-link"
                    >
                      <img
                        src={article.image}
                        alt={article.title}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src =
                            "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=90";
                        }}
                      />
                    </a>

                    <div className="more-content">

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
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=90";
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


      {/* ==================================================
          GUEST AUTHOR — AT THE VERY BOTTOM
         ================================================== */}

      <section className="guest-author-section">

        <div className="guest-author-heading">

          <h2>GETprospeKt Solutions</h2>

          <div className="guest-heading-line" />

        </div>


        <div className="guest-slider-wrapper">

          <button
            type="button"
            className="guest-arrow guest-arrow-left"
            onClick={previousGuest}
            aria-label="Previous guest author"
          >
            ‹
          </button>


          <div
            className="guest-track"
            ref={guestTrackRef}
          >

            {[
              ...guestAuthors,
              ...guestAuthors,
            ].map((guest, index) => (
              <a
                href={guest.link}
                className="guest-author-card"
                key={`${guest.link}-${index}`}
              >

                <div className="guest-card-top">

                  <div className="guest-poster">

                    <div className="guest-poster-brand">
                      <span>TALK</span>
                      <strong>prospeKt</strong>
                      <i />
                    </div>

                    <div className="guest-poster-title">
                      {guest.title}
                    </div>

                    <div className="guest-poster-name">
                      {guest.author}
                    </div>


                  </div>


                  <div className="guest-photo-circle">

                    <img
                      src={guest.authorImage}
                      alt={guest.author}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=600&q=90";
                      }}
                    />

                  </div>

                </div>


                <div className="guest-card-bottom">

                  <p>
                    {guest.description}
                  </p>

                </div>

              </a>
            ))}

          </div>


          <button
            type="button"
            className="guest-arrow guest-arrow-right"
            onClick={nextGuest}
            aria-label="Next guest author"
          >
            ›
          </button>

        </div>

      </section>


      <style>{`

        * {
          box-sizing: border-box;
        }

        .publication-home {
          width: 100%;
          background: #fff;
          color: #D5DBE7;
          font-family: var(--font-sans);
          background: #071019;
        }

        .publication-container {
          width: min(
            1240px,
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
          background: rgba(255, 255, 255, 0.12);
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
          background: #121022;
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
          color: #96AEFC;
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
          color: #96AEFC;
          font-size: 16px;
          font-weight: 700;
        }

        .latest-sidebar {
          min-width: 0;
          border-left: 1px solid rgba(255, 255, 255, 0.12);
          padding-left: 15px;
        }

        .tabs {
          display: flex;
          gap: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
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
          background: #7568E8;
        }

        .side-article {
          padding: 13px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
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
          color: #96AEFC;
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
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
        }

        .more-image-link {
          display: block;
          width: 245px;
          height: 148px;
          overflow: hidden;
          border-radius: 7px;
          background: #121022;
        }

        .more-image-link img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          transition: transform .35s ease;
        }

        .more-image-link:hover img {
          transform: scale(1.035);
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
          color: #96AEFC;
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
          border-left: 1px solid rgba(255, 255, 255, 0.12);
          padding-left: 15px;
        }

        .promo-card {
          position: relative;
          min-height: 255px;
          padding: 15px 0 20px;
          text-align: center;
          background: #121022;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.08);
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
          background: #7568E8;
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
          color: #96AEFC;
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
          background: #7568E8;
        }

        .promo-image {
          display: block;
          width: 100%;
          height: 245px;
          overflow: hidden;
          background: #121022;
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
          background: #121022;
          border: 1px solid rgba(255, 255, 255, 0.12);
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
          background: #7568E8;
          color: #fff;
          font-size: 20px;
        }

        .podcast-card span {
          display: block;
          margin-bottom: 6px;
          color: #96AEFC;
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
          background: #121022;
          border-top: 1px solid rgba(255, 255, 255, 0.12);
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
        }

        .developers-guide-inner {
          min-height: 196px;
          display: grid;
          grid-template-columns: 110px minmax(0, 1fr) minmax(260px, 42%);
          align-items: center;
          background: #121022;
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
          background: #7568E8;
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
              #121022 0%,
              #121022 8%,
              #17152A 8%,
              #17152A 100%
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
          background: #7568E8;
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
          background: #17152A;
          padding: 52px 0 48px;
          overflow: hidden;
        }

        .guest-author-heading {
          width: min(
            1240px,
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
          background: #071019;
          border: 1px solid rgba(255, 255, 255, 0.12);
          padding: 9px 22px;
          font-size: 40px;
          line-height: 1.2;
          font-weight: 700;
          white-space: nowrap;
        }

        .guest-heading-line {
          flex: 1;
          height: 1px;
          background: rgba(255, 255, 255, 0.2);
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
          background: #121022;
          border: 1px solid rgba(255, 255, 255, 0.12);
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
          color: #96AEFC;
        }

        .guest-poster-brand i {
          width: 12px;
          height: 12px;
          margin-left: 1px;
          border-radius: 50%;
          background: #7568E8;
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
          background: #7568E8;
          box-shadow: 0 0 0 2px #121022;
        }

        .guest-photo-circle img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          display: block;
          border: 3px solid #121022;
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
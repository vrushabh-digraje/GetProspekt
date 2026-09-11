import { useState } from "react";
import { articles } from "../pages/Article";

const featureArticles = articles
  .filter((article) => !article.isGuestAuthor)
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0, 3)
  .map((article) => ({
    image:
      article.heroImage ||
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=400&q=80",
    title: article.title,
    author: article.author,
    date: article.date,
    slug: article.slug,
  }));

const learningCenter = articles
  .filter((article) => !article.isGuestAuthor)
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(3, 6)
  .map((article) => ({
    image:
      article.heroImage ||
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=400&q=80",
    title: article.title,
    author: article.author,
    date: article.date,
    slug: article.slug,
  }));

const latestNews = articles
  .filter((article) => !article.isGuestAuthor)
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0, 6)
  .map((article) => ({
    image: article.heroImage || "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=400&q=80",
    title: article.title,
    author: article.author,
    date: article.date,
    description: article.description,
    slug: article.slug,
  }));

function Navbar() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  return (
    <>
      <style>{`

        /* =========================================
           NAVBAR
        ========================================= */

        .publication-navbar {
          width: 100%;
          height: 59px;

          background: #F0EEFF;

          border-top: 3px solid #7568E8;
          border-bottom: 1px solid #CBC7DF;

          position: relative;
          z-index: 900;

          font-family: Arial, Helvetica, sans-serif;
        }

        .publication-navbar-container {
          width: 100%;
          height: 100%;

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 0 25px;

          box-sizing: border-box;
        }

        .publication-navbar-links {
          height: 100%;

          display: flex;
          align-items: center;
          justify-content: center;

          gap: 68px;
        }

        .publication-navbar-item {
          height: 100%;

          display: flex;
          align-items: center;

          position: static;
        }

        .publication-navbar-link {
          height: 100%;

          display: flex;
          align-items: center;

          color: #17152A;

          text-decoration: none;

          font-size: 19px;
          font-weight: 600;

          white-space: nowrap;

          cursor: pointer;

          transition: color 0.2s ease;
        }

        .publication-navbar-link:hover {
          color: #6757D9;
        }

        .publication-navbar-arrow {
          margin-left: 7px;

          color: #17152A;

          font-size: 10px;

          position: relative;
          top: -1px;
        }


        /* =========================================
           LATEST DROPDOWN
        ========================================= */

        .publication-latest-dropdown {
          position: absolute;

          top: 59px;
          left: 50%;

          width: min(935px, calc(100vw - 40px));

          transform: translateX(-50%) translateY(10px);

          background: #FFFFFF;

          border-radius: 16px;

          box-shadow:
            0 7px 28px rgba(0, 0, 0, 0.17);

          padding: 10px 16px 0;

          box-sizing: border-box;

          opacity: 0;
          visibility: hidden;
          pointer-events: none;

          transition:
            opacity 0.2s ease,
            transform 0.2s ease,
            visibility 0.2s ease;
        }

        .publication-navbar-item:hover .publication-latest-dropdown,
        .publication-navbar-item.active .publication-latest-dropdown {
          opacity: 1;
          visibility: visible;
          pointer-events: auto;

          transform: translateX(-50%) translateY(0);
        }


        /* =========================================
           LATEST TITLE
        ========================================= */

        .publication-dropdown-title {
          width: 100%;

          text-align: center;

          color: #17152A;

          font-size: 20px;
          font-weight: 700;

          padding-bottom: 9px;

          border-bottom: 1px solid #D9D6EA;
        }


        /* =========================================
           LATEST ITEM
        ========================================= */

        .publication-latest-item {
          width: 100%;

          min-height: 96px;

          display: flex;
          align-items: center;

          gap: 20px;

          padding: 10px 0;

          border-bottom: 1px solid #E4E1F7;

          text-decoration: none;

          box-sizing: border-box;
        }

        .publication-latest-image {
          width: 150px;
          height: 90px;

          flex: 0 0 150px;

          overflow: hidden;

          border-radius: 5px;

          background: #F0EEFF;
        }

        .publication-latest-image img {
          width: 100%;
          height: 100%;

          display: block;

          object-fit: cover;
        }

        .publication-latest-content {
          flex: 1;
          min-width: 0;
        }

        .publication-latest-content h3 {
          margin: 0 0 7px;

          color: #17152A;

          font-size: 17px;
          line-height: 1.2;

          font-weight: 700;
        }

        .publication-latest-content p {
          margin: 0;

          color: #28243B;

          font-size: 14px;
          line-height: 1.3;
        }

        .publication-latest-content p span {
          margin: 0 5px;

          color: #6D6880;
        }


        /* =========================================
           FEATURES MEGA DROPDOWN
        ========================================= */

        .publication-features-dropdown {
          position: absolute;

          top: 59px;
          left: 50%;

          width: min(1250px, calc(100vw - 40px));

          min-height: 410px;

          transform: translateX(-50%) translateY(10px);

          background: #FFFFFF;

          border-radius: 17px;

          box-shadow:
            0 7px 28px rgba(0, 0, 0, 0.17);

          padding: 0 15px;

          box-sizing: border-box;

          display: grid;

          grid-template-columns: 1fr 1px 1fr;

          column-gap: 15px;

          opacity: 0;
          visibility: hidden;
          pointer-events: none;

          transition:
            opacity 0.2s ease,
            transform 0.2s ease,
            visibility 0.2s ease;
        }

        .publication-navbar-item:hover .publication-features-dropdown,
        .publication-navbar-item.active .publication-features-dropdown {
          opacity: 1;
          visibility: visible;
          pointer-events: auto;

          transform: translateX(-50%) translateY(0);
        }


        /* =========================================
           COLUMN
        ========================================= */

        .publication-feature-column {
          min-width: 0;

          padding-top: 8px;
        }

        .publication-feature-title {
          height: 42px;

          margin: 0;

          display: flex;
          align-items: center;
          justify-content: center;

          border-bottom: 1px solid #D9D6EA;

          color: #17152A;

          font-size: 20px;
          font-weight: 700;
        }

        .publication-feature-divider {
          width: 1px;
          height: 100%;

          background: #D9D6EA;
        }


        /* =========================================
           FEATURE ITEM
        ========================================= */

        .publication-feature-item {
          width: 100%;

          min-height: 105px;

          display: flex;
          align-items: center;

          gap: 20px;

          padding: 10px 0;

          border-bottom: 1px solid #E4E1F7;

          text-decoration: none;

          box-sizing: border-box;
        }

        .publication-feature-image {
          width: 150px;
          height: 90px;

          flex: 0 0 150px;

          overflow: hidden;

          border-radius: 4px;

          background: #F0EEFF;
        }

        .publication-feature-image img {
          width: 100%;
          height: 100%;

          display: block;

          object-fit: cover;

          transition: transform 0.25s ease;
        }

        .publication-feature-item:hover
        .publication-feature-image img {
          transform: scale(1.04);
        }

        .publication-feature-content {
          flex: 1;
          min-width: 0;
        }

        .publication-feature-content h3 {
          margin: 0 0 7px;

          color: #17152A;

          font-size: 17px;
          line-height: 1.2;

          font-weight: 700;
        }

        .publication-feature-item:hover
        .publication-feature-content h3 {
          color: #6757D9;
        }

        .publication-feature-content p {
          margin: 0;

          color: #28243B;

          font-size: 14px;
        }

        .publication-feature-content p span {
          margin: 0 5px;

          color: #6D6880;
        }


        /* =========================================
           SEE MORE
        ========================================= */

        .publication-see-more {
          height: 45px;

          display: flex;
          align-items: center;
          justify-content: flex-end;
        }

        .publication-see-more a {
          color: #17152A;

          font-size: 15px;
          font-weight: 700;

          text-decoration: none;
        }

        .publication-see-more a:hover {
          color: #6757D9;
        }


        /* =========================================
           TABLET
        ========================================= */

        @media (max-width: 1200px) {

          .publication-navbar-links {
            gap: 43px;
          }

          .publication-navbar-link {
            font-size: 17px;
          }

          .publication-features-dropdown {
            width: min(1100px, calc(100vw - 30px));
          }

          .publication-feature-image {
            width: 125px;
            height: 78px;

            flex-basis: 125px;
          }

          .publication-feature-content h3 {
            font-size: 15px;
          }

          .publication-feature-content p {
            font-size: 12px;
          }
        }


        /* =========================================
           TABLET SMALL
        ========================================= */

        @media (max-width: 900px) {

          .publication-navbar {
            height: 55px;
          }

          .publication-navbar-links {
            gap: 25px;
          }

          .publication-navbar-link {
            font-size: 15px;
          }

          .publication-latest-dropdown,
          .publication-features-dropdown {
            top: 55px;

            width: calc(100vw - 25px);
          }

          .publication-feature-item {
            gap: 12px;
          }

          .publication-feature-image {
            width: 105px;
            height: 68px;

            flex-basis: 105px;
          }

          .publication-feature-content h3 {
            font-size: 13px;
          }

          .publication-feature-content p {
            font-size: 10px;
          }
        }


        /* =========================================
           MOBILE
        ========================================= */

        @media (max-width: 700px) {

          .publication-navbar {
            height: 55px;
            min-height: 55px;
            overflow: visible;
          }

          .publication-navbar-container {
            padding: 0 12px;
          }

          /* Hide the desktop navigation on mobile */
          .publication-navbar-links {
            display: none;
          }

          /* Keep dropdowns hidden until their menu is opened */
          .publication-latest-dropdown,
          .publication-features-dropdown {
            display: none;
          }

          .publication-navbar-item.active .publication-latest-dropdown,
          .publication-navbar-item.active .publication-features-dropdown {
            display: block;
          }

          /* Mobile dropdown positioning */
          .publication-latest-dropdown,
          .publication-features-dropdown {
            position: fixed;
            top: 55px;
            left: 50%;
            width: calc(100vw - 20px);
            max-height: calc(100vh - 70px);
            overflow-y: auto;
            border-radius: 12px;
            transform: translateX(-50%) translateY(10px);
          }

          .publication-navbar-item.active .publication-latest-dropdown,
          .publication-navbar-item.active .publication-features-dropdown {
            transform: translateX(-50%) translateY(0);
          }


          /* Features becomes one column */

          .publication-features-dropdown {
            display: block;

            padding: 0 12px;
          }

          .publication-feature-column {
            width: 100%;
          }

          .publication-feature-divider {
            width: 100%;
            height: 1px;

            margin: 5px 0;
          }

          .publication-feature-title {
            font-size: 18px;
          }

          .publication-feature-item {
            min-height: 80px;

            gap: 12px;

            padding: 8px 0;
          }

          .publication-feature-image {
            width: 100px;
            height: 65px;

            flex-basis: 100px;
          }

          .publication-feature-content h3 {
            font-size: 13px;
          }

          .publication-feature-content p {
            font-size: 10px;
          }
        }


        /* =========================================
           SMALL MOBILE
        ========================================= */

        @media (max-width: 450px) {

          .publication-navbar-links {
            display: none;
          }

          .publication-latest-dropdown,
          .publication-features-dropdown {
            top: 55px;
            width: calc(100vw - 12px);
          }

          .publication-feature-image {
            width: 88px;
            height: 60px;

            flex-basis: 88px;
          }

          .publication-feature-content h3 {
            font-size: 12px;
          }

          .publication-feature-content p {
            font-size: 9px;
          }
        }

      `}</style>

      <nav className="publication-navbar">
        <div className="publication-navbar-container">

          <div className="publication-navbar-links">

            {/* ================================
                LATEST
            ================================= */}

            <div
              className={`publication-navbar-item ${
                activeMenu === "latest" ? "active" : ""
              }`}
              onMouseEnter={() => setActiveMenu("latest")}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <a
                href="#"
                className="publication-navbar-link"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveMenu(
                    activeMenu === "latest" ? null : "latest"
                  );
                }}
              >
                Latest
                <span className="publication-navbar-arrow">
                  ▼
                </span>
              </a>

              <div className="publication-latest-dropdown">

                <div className="publication-dropdown-title">
                  News
                </div>

                {latestNews.map((news) => (
                  <a
                    href={`/article/${news.slug}`}
                    className="publication-latest-item"
                    key={news.slug}
                  >
                    <div className="publication-latest-image">
                      <img src={news.image} alt="" />
                    </div>

                    <div className="publication-latest-content">
                      <h3>{news.title}</h3>

                      <p>
                        By {news.author}
                        <span>|</span>
                        {news.date}
                      </p>
                    </div>
                  </a>
                ))}

                <div className="publication-see-more">
                  <a href="#">See More</a>
                </div>

              </div>
            </div>

            {/* ================================
                FEATURES
            ================================= */}

            <div
              className={`publication-navbar-item ${
                activeMenu === "features" ? "active" : ""
              }`}
              onMouseEnter={() => setActiveMenu("features")}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <a
                href="#"
                className="publication-navbar-link"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveMenu(
                    activeMenu === "features"
                      ? null
                      : "features"
                  );
                }}
              >
                Features
                <span className="publication-navbar-arrow">
                  ▼
                </span>
              </a>

              <div className="publication-features-dropdown">

                {/* ARTICLES */}

                <div className="publication-feature-column">

                  <h2 className="publication-feature-title">
                    Articles
                  </h2>

                  {featureArticles.map(
                    (article) => (
                      <a
                        href={`/article/${article.slug}`}
                        className="publication-feature-item"
                        key={article.slug}
                        onClick={() => setActiveMenu(null)}
                      >
                        <div className="publication-feature-image">
                          <img
                            src={article.image}
                            alt=""
                          />
                        </div>

                        <div className="publication-feature-content">
                          <h3>
                            {article.title}
                          </h3>

                          <p>
                            By {article.author}
                            <span>|</span>
                            {article.date}
                          </p>
                        </div>
                      </a>
                    )
                  )}

                  <div className="publication-see-more">
                    <a href="#">See More</a>
                  </div>

                </div>


                {/* DIVIDER */}

                <div className="publication-feature-divider"></div>


                {/* LEARNING CENTER */}

                <div className="publication-feature-column">

                  <h2 className="publication-feature-title">
                    Learning Center
                  </h2>

                  {learningCenter.map(
                    (article) => (
                      <a
                        href={`/article/${article.slug}`}
                        className="publication-feature-item"
                        key={article.slug}
                        onClick={() => setActiveMenu(null)}
                      >
                        <div className="publication-feature-image">
                          <img
                            src={article.image}
                            alt=""
                          />
                        </div>

                        <div className="publication-feature-content">
                          <h3>
                            {article.title}
                          </h3>

                          <p>
                            By {article.author}
                            <span>|</span>
                            {article.date}
                          </p>
                        </div>
                      </a>
                    )
                  )}

                  <div className="publication-see-more">
                    <a href="#">See More</a>
                  </div>

                </div>

              </div>
            </div>


            {/* ================================
                FAQ
            ================================= */}

            <div className="publication-navbar-item">
              <a
                href="/faq"
                className="publication-navbar-link"
              >
                FAQ
              </a>
            </div>


            {/* ================================
                CASE STUDIES
            ================================= */}

            <div className="publication-navbar-item">
              <a
                href="/case-studies"
                className="publication-navbar-link"
              >
                Case Studies
              </a>
            </div>


            {/* ================================
                EVENTS
            ================================= */}

            <div className="publication-navbar-item">
              <a
                href="/events"
                className="publication-navbar-link"
              >
                Events
              </a>
            </div>


            {/* ================================
                CONTACT
            ================================= */}

            <div className="publication-navbar-item">
              <a
                href="/contact"
                className="publication-navbar-link"
              >
                Contact Us
              </a>
            </div>

          </div>

        </div>
      </nav>
    </>
  );
}

export default Navbar;
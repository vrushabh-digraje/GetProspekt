import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import gettLogo from "../assets/images/gett.png";

const initialDemoArticles = [
  {
    title: "Better Data Starts with Verification",
    category: "B2B Lead Generation",
    date: "Sep 11, 2026",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "MQL: Marketing-Qualified Leads",
    category: "B2B Lead Generation",
    date: "Sep 11, 2026",
    image:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "SQL: Sales-Qualified Leads",
    category: "B2B Lead Generation",
    date: "Sep 11, 2026",
    image:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=85",
  },
];

const demoCaseStudies = [
  {
    title: "Enterprise Lead Generation",
    description: "Demo case study for publication management.",
  },
  {
    title: "B2B Campaign Performance",
    description: "Demo case study showing campaign outcomes.",
  },
  {
    title: "Qualified Pipeline Growth",
    description: "Demo case study for business growth content.",
  },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [showAddContent, setShowAddContent] = useState(false);
  const [addType, setAddType] = useState("Article");
  const [demoAdded, setDemoAdded] = useState(false);
  const [articles, setArticles] = useState(initialDemoArticles);
  const [articleTitle, setArticleTitle] = useState("");
  const [articleCategory, setArticleCategory] = useState("Technology");
  const [articleAuthor, setArticleAuthor] = useState("Admin");
  const [articleDescription, setArticleDescription] = useState("");

  const navItems = [
    ["Dashboard", "⌂"],
    ["Articles", "▤"],
    ["Case Studies", "◫"],
    ["Authors", "●"],
    ["Resources", "▣"],
    ["Events", "◷"],
    ["FAQ", "?"],
    ["Enquiries", "✉"],
  ];

  const stats = [
    ["Total Articles", "128", "All content in publication", ""],
    ["Published", "96", "Currently published", "green"],
    ["Drafts", "18", "Content in progress", "purple"],
    ["Case Studies", "12", "Published case studies", "orange"],
    ["Resources", "24", "White papers & resources", "red"],
    ["Enquiries", "17", "New enquiries", "blue"],
  ];

  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/login", { replace: true });
  };

  const selectSection = (item: string) => {
    setActiveSection(item);
    if (window.innerWidth <= 800) {
      document.querySelector(".gp-dashboard-sidebar")?.classList.remove("mobile-open");
    }
  };

  const sectionDescription: Record<string, string> = {
    Articles: "Manage publication articles and editorial content.",
    "Case Studies": "Manage publication case studies.",
    Authors: "Manage authors and expert contributors.",
    Resources: "Manage white papers, guides and downloadable resources.",
    Events: "Manage publication events and upcoming sessions.",
    FAQ: "Manage frequently asked questions.",
    Enquiries: "View website enquiries and contact requests.",
  };

  const renderSection = () => {
    if (activeSection === "Dashboard") {
      return (
        <>
          <div className="gp-filter-bar">
            <div className="gp-filter-field">
              <label>Content Type</label>
              <select>
                <option>All Content</option>
                <option>Articles</option>
                <option>Case Studies</option>
                <option>Resources</option>
              </select>
            </div>

            <div className="gp-filter-field">
              <label>Author</label>
              <select>
                <option>All Authors</option>
                <option>Admin</option>
                <option>Guest Authors</option>
              </select>
            </div>

            <div className="gp-filter-field">
              <label>Month</label>
              <select>
                <option>September 2026</option>
                <option>August 2026</option>
                <option>July 2026</option>
              </select>
            </div>

            <div className="gp-filter-field">
              <label>From Date</label>
              <input type="date" />
            </div>

            <div className="gp-filter-field">
              <label>To Date</label>
              <input type="date" />
            </div>
          </div>

          <div className="gp-stats-grid">
            {stats.map(([title, value, text, iconClass], index) => (
              <div className="gp-stat-card" key={title}>
                <div className="gp-stat-top">
                  <span>{title}</span>
                  <i className={iconClass}>
                    {["▤", "✓", "●", "◫", "▣", "✉"][index]}
                  </i>
                </div>
                <strong>{value}</strong>
                <small>{text}</small>
              </div>
            ))}
          </div>

          <div className="gp-analytics-grid">
            <section className="gp-panel">
              <div className="gp-panel-heading">
                <div>
                  <h2>Content Overview</h2>
                  <p>Publication activity for the current period.</p>
                </div>
                <span>2026</span>
              </div>

              <div className="gp-chart">
                {[
                  ["Articles", 82, "128"],
                  ["Published", 68, "96"],
                  ["Drafts", 42, "18"],
                  ["Studies", 55, "12"],
                  ["Resources", 73, "24"],
                ].map(([label, height, value]) => (
                  <div className="gp-chart-column" key={label}>
                    <div className="gp-chart-value">{value}</div>
                    <div className="gp-chart-bar" style={{ height: `${height}%` }}>
                      <span />
                    </div>
                    <small>{label}</small>
                  </div>
                ))}
              </div>
            </section>

            <section className="gp-panel">
              <div className="gp-panel-heading">
                <div>
                  <h2>Content Distribution</h2>
                  <p>Current demo content mix.</p>
                </div>
              </div>

              <div className="gp-rings">
                <div className="gp-ring">
                  <div><strong>128</strong><small>Articles</small></div>
                </div>
                <div className="gp-ring ring-two">
                  <div><strong>12</strong><small>Studies</small></div>
                </div>
                <div className="gp-ring ring-three">
                  <div><strong>24</strong><small>Resources</small></div>
                </div>
              </div>

              <div className="gp-legend">
                <span><i /> Articles</span>
                <span><i /> Case Studies</span>
                <span><i /> Resources</span>
              </div>
            </section>
          </div>

          <div className="gp-dashboard-grid">
            <section className="gp-panel">
              <div className="gp-panel-heading">
                <div>
                  <h2>Recent Content</h2>
                  <p>Sample content shown in the admin demo.</p>
                </div>
                <button onClick={() => setActiveSection("Articles")}>View All →</button>
              </div>

              {articles.map((article) => (
                <div className="gp-article-row" key={article.title}>
                  <div className="gp-row-image">
                    <img src={article.image} alt={article.title} />
                  </div>
                  <div className="gp-row-copy">
                    <strong>{article.title}</strong>
                    <small>{article.category} · {article.date}</small>
                  </div>
                </div>
              ))}
            </section>

            <section className="gp-panel">
              <div className="gp-panel-heading">
                <div>
                  <h2>Recent Case Studies</h2>
                  <p>Sample items for the admin dashboard.</p>
                </div>
                <button onClick={() => setActiveSection("Case Studies")}>View All →</button>
              </div>

              {demoCaseStudies.map((item) => (
                <div className="gp-simple-row" key={item.title}>
                  <div>
                    <small>CASE STUDY</small>
                    <strong>{item.title}</strong>
                    <p>{item.description}</p>
                  </div>
                  <span>→</span>
                </div>
              ))}
            </section>
          </div>
        </>
      );
    }

    if (activeSection === "Articles") {
      return (
        <section className="gp-panel gp-full-panel">
          <div className="gp-panel-heading">
            <div>
              <h2>Articles</h2>
              <p>Sample article records for the admin POC.</p>
            </div>
            <span>128 Total</span>
          </div>

          <div className="gp-admin-content-grid">
            {articles.map((article) => (
              <div className="gp-content-card" key={article.title}>
                <div className="gp-demo-large-thumb">
                  <img src={article.image} alt={article.title} />
                </div>
                <div>
                  <small>{article.category}</small>
                  <h3>{article.title}</h3>
                  <p>{article.date} · Demo record</p>
                  <div className="gp-card-actions">
                    <b>Manage →</b>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      );
    }

    if (activeSection === "Case Studies") {
      return (
        <section className="gp-panel gp-full-panel">
          <div className="gp-panel-heading">
            <div>
              <h2>Case Studies</h2>
              <p>Sample case-study records for the admin POC.</p>
            </div>
            <span>12 Total</span>
          </div>

          <div className="gp-admin-content-grid">
            {demoCaseStudies.map((item) => (
              <div className="gp-content-card gp-simple-card" key={item.title}>
                <div>
                  <small>CASE STUDY</small>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <b>Published</b>
                </div>
              </div>
            ))}
          </div>
        </section>
      );
    }

    const countMap: Record<string, string> = {
      Authors: "14",
      Resources: "24",
      Events: "6",
      FAQ: "32",
      Enquiries: "17",
    };

    return (
      <section className="gp-panel gp-full-panel gp-placeholder-panel">
        <div className="gp-panel-heading">
          <div>
            <h2>{activeSection}</h2>
            <p>{sectionDescription[activeSection]}</p>
          </div>
          <strong>{countMap[activeSection] || "0"}</strong>
        </div>

        <div className="gp-empty-box">
          <div className="gp-empty-icon">
            {activeSection === "Events" ? "◷" :
             activeSection === "FAQ" ? "?" :
             activeSection === "Enquiries" ? "✉" : "▣"}
          </div>
          <h3>{activeSection} Management</h3>
          <p>
            This is a static admin dashboard demo. Real records, forms,
            filters and permissions can be connected when the backend is added.
          </p>

          {activeSection === "Events" && (
            <Link to="/events" className="gp-primary-button">Open Public Events →</Link>
          )}
          {activeSection === "FAQ" && (
            <Link to="/faq" className="gp-primary-button">Open Public FAQ →</Link>
          )}
          {activeSection === "Enquiries" && (
            <Link to="/contact" className="gp-primary-button">Open Contact Page →</Link>
          )}
        </div>
      </section>
    );
  };

  return (
    <div className="gp-dashboard">
      <aside className="gp-dashboard-sidebar">
        <div className="gp-dashboard-brand">
          <img src={gettLogo} alt="GETprospeKt" />
          <span>Publication Management</span>
        </div>

        <nav>
          {navItems.map(([item, icon]) => (
            <button
              key={item}
              className={`gp-side-item ${activeSection === item ? "active" : ""}`}
              onClick={() => selectSection(item)}
            >
              <span>{icon}</span>
              {item}
            </button>
          ))}
        </nav>

        <div className="gp-sidebar-bottom">
          <div className="gp-sidebar-user">
            <span>AD</span>
            <div>
              <strong>Admin</strong>
              <small>admin@getprospekt.co</small>
            </div>
          </div>
          <button onClick={logout}>Logout</button>
        </div>
      </aside>

      <main className="gp-dashboard-main">
        <header className="gp-dashboard-header">
          <div className="gp-header-left">
            <button
              className="gp-menu-button"
              aria-label="Dashboard menu"
              onClick={() =>
                document.querySelector(".gp-dashboard-sidebar")?.classList.toggle("mobile-open")
              }
            >
              ☰
            </button>
            <div>
              <strong>GETprospeKt</strong>
              <small>Publication Admin</small>
            </div>
          </div>

          <div className="gp-header-actions">
            <button
              className="gp-add-content-button"
              onClick={() => setShowAddContent(true)}
            >
              + Add Content
            </button>
            <div className="gp-admin-profile">
              <div>
              <strong>Admin</strong>
              <small>Super Admin</small>
            </div>
              <span>AD</span>
            </div>
          </div>
        </header>

        <section className="gp-dashboard-content">
          <div className="gp-dashboard-heading">
            <h1>{activeSection === "Dashboard" ? "Dashboard Overview" : activeSection}</h1>
            <p>
              {activeSection === "Dashboard"
                ? "Welcome back! Here's what's happening with your publication."
                : sectionDescription[activeSection]}
            </p>
          </div>

          {renderSection()}
        </section>
      </main>


      {showAddContent && (
        <div className="gp-modal-backdrop" onClick={() => setShowAddContent(false)}>
          <div className="gp-add-modal" onClick={(e) => e.stopPropagation()}>
            <div className="gp-modal-header">
              <div>
                <h2>Add Content</h2>
                <p>Create a new publication item in the admin demo.</p>
              </div>
              <button
                className="gp-modal-close"
                aria-label="Close"
                onClick={() => setShowAddContent(false)}
              >
                ×
              </button>
            </div>

            <div className="gp-modal-type">
              <button
                className={addType === "Article" ? "selected" : ""}
                onClick={() => setAddType("Article")}
              >
                Article
              </button>
              <button
                className={addType === "Case Study" ? "selected" : ""}
                onClick={() => setAddType("Case Study")}
              >
                Case Study
              </button>
              <button
                className={addType === "Resource" ? "selected" : ""}
                onClick={() => setAddType("Resource")}
              >
                Resource
              </button>
            </div>

            <div className="gp-form-grid">
              <div className="gp-form-field gp-form-wide">
                <label>Title</label>
                <input
                  value={articleTitle}
                  onChange={(e) => setArticleTitle(e.target.value)}
                  placeholder={`Enter ${addType.toLowerCase()} title`}
                />
              </div>

              <div className="gp-form-field">
                <label>Category</label>
                <select value={articleCategory} onChange={(e) => setArticleCategory(e.target.value)}>
                  <option>Technology</option>
                  <option>B2B Lead Generation</option>
                  <option>Business</option>
                  <option>Marketing</option>
                </select>
              </div>

              <div className="gp-form-field">
                <label>Author</label>
                <select value={articleAuthor} onChange={(e) => setArticleAuthor(e.target.value)}>
                  <option>Admin</option>
                  <option>GETprospeKt</option>
                  <option>Guest Author</option>
                </select>
              </div>

              <div className="gp-form-field gp-form-wide">
                <label>Description</label>
                <textarea value={articleDescription} onChange={(e) => setArticleDescription(e.target.value)} placeholder="Enter a short description" rows={4} />
              </div>
            </div>

            <div className="gp-modal-footer">
              <button
                className="gp-secondary-button"
                onClick={() => setShowAddContent(false)}
              >
                Cancel
              </button>
              <button
                className="gp-primary-button gp-create-button"
                onClick={() => {
                  if (addType === "Article") {
                    const title = articleTitle.trim() || "New Demo Article";
                    setArticles((current) => [
                      {
                        title,
                        category: articleCategory,
                        date: "Sep 12, 2026",
                        image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=900&q=85",
                      },
                      ...current,
                    ]);
                  }
                  setDemoAdded(true);
                  setShowAddContent(false);
                  setArticleTitle("");
                  setArticleDescription("");
                }}
              >
                Add {addType}
              </button>
            </div>
          </div>
        </div>
      )}

      {demoAdded && (
        <div className="gp-demo-toast">
          Demo {addType.toLowerCase()} added successfully. Backend will save
          real content after integration.
          <button onClick={() => setDemoAdded(false)}>×</button>
        </div>
      )}
      <style>{`
        *{box-sizing:border-box}
        .gp-dashboard{min-height:100vh;display:flex;background:#f5f7fb;color:#111827;font-family: Garamond, serif}
        .gp-dashboard-sidebar{width:250px;min-height:100vh;flex-shrink:0;display:flex;flex-direction:column;background:#071019;color:#fff;position:sticky;top:0;z-index:30;box-shadow:5px 0 18px rgba(0,0,0,.08)}
        .gp-dashboard-brand{min-height:91px;padding:20px 21px 17px;border-bottom:1px solid rgba(255,255,255,.08)}
        .gp-dashboard-brand img{width:160px;max-width:100%;height:auto;display:block;margin-bottom:8px;object-fit:contain}
        .gp-dashboard-brand span{color:#aeb8ca;font-size:11px;letter-spacing:.2px}
        .gp-dashboard-sidebar nav{padding:15px 13px;display:flex;flex-direction:column;gap:5px}
        .gp-side-item{width:100%;min-height:44px;display:flex;align-items:center;gap:12px;padding:10px 13px;border:0;border-radius:7px;background:transparent;color:#d5dbe7;text-align:left;font-size:14px;font-weight:700;cursor:pointer;transition:.2s ease}
        .gp-side-item span{width:20px;text-align:center;font-size:18px;color:#cbd3e1}
        .gp-side-item:hover{background:rgba(150,174,252,.12);color:#fff}
        .gp-side-item.active{background:#96AEFC;color:#fff;box-shadow:0 5px 16px rgba(150,174,252,.12)}
        .gp-side-item.active span{color:#fff}
        .gp-sidebar-bottom{margin-top:auto;padding:16px 14px;border-top:1px solid rgba(255,255,255,.08)}
        .gp-sidebar-user{display:flex;align-items:center;gap:10px;margin-bottom:13px}
        .gp-sidebar-user>span{width:34px;height:34px;display:grid;place-items:center;flex-shrink:0;border-radius:50%;background:#96AEFC;color:#111827;font-size:11px;font-weight:900}
        .gp-sidebar-user div{min-width:0;display:flex;flex-direction:column}
        .gp-sidebar-user strong{font-size:12px}
        .gp-sidebar-user small{margin-top:3px;color:#8995a9;font-size:10px;overflow:hidden;text-overflow:ellipsis}
        .gp-sidebar-bottom>button{width:100%;padding:9px;border:1px solid rgba(255,255,255,.15);border-radius:6px;background:transparent;color:#fff;font-size:12px;cursor:pointer}
        .gp-dashboard-main{flex:1;min-width:0}
        .gp-dashboard-header{height:62px;display:flex;align-items:center;justify-content:space-between;padding:0 24px;background:rgba(255,255,255,.97);border-bottom:1px solid #e5e9f0}
        .gp-header-left{display:flex;align-items:center;gap:17px}
        .gp-header-left>div{display:flex;flex-direction:column;gap:3px}
        .gp-header-left strong{font-size:16px;color:#111827}
        .gp-header-left small{font-size:11px;color:#7d8492}
        .gp-menu-button{border:0;background:transparent;color:#5e6879;font-size:20px;cursor:pointer;display:none}
        .gp-admin-profile{display:flex;align-items:center;gap:10px}
        .gp-admin-profile div{display:flex;flex-direction:column;text-align:right}
        .gp-admin-profile strong{font-size:12px}
        .gp-admin-profile small{margin-top:2px;color:#7f8795;font-size:10px}
        .gp-admin-profile>span{width:36px;height:36px;display:grid;place-items:center;border-radius:50%;background:#96AEFC;color:#111827;font-size:11px;font-weight:900}
        .gp-dashboard-content{padding:28px 25px 42px;max-width:1500px;margin:0 auto}
        .gp-dashboard-heading{margin-bottom:19px}
        .gp-dashboard-heading h1{margin:0 0 6px;color:#101827;font-size:30px;line-height:1.15}
        .gp-dashboard-heading p{margin:0;color:#6f7786;font-size:15px}
        .gp-filter-bar{display:grid;grid-template-columns:1.1fr 1.1fr 1fr 1fr 1fr;gap:12px;margin-bottom:17px}
        .gp-filter-field{display:flex;flex-direction:column;gap:6px}
        .gp-filter-field label{color:#303846;font-size:15px;font-weight:700}
        .gp-filter-field select,.gp-filter-field input{width:100%;height:36px;padding:0 10px;border:1px solid #d8dde6;border-radius:5px;background:#fff;color:#333b49;font-size:15px;outline:none}
        .gp-filter-field select:focus,.gp-filter-field input:focus{border-color:#96AEFC;box-shadow:0 0 0 2px rgba(150,174,252,.12)}
        .gp-stats-grid{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:12px;margin-bottom:17px}
        .gp-stat-card{min-height:120px;padding:14px;background:#fff;border:1px solid #e2e6ed;border-radius:7px;box-shadow:0 2px 8px rgba(15,23,42,.025)}
        .gp-stat-top{display:flex;align-items:center;justify-content:space-between;gap:8px}
        .gp-stat-top>span{color:#586171;font-size:14px;font-weight:600}
        .gp-stat-top i{width:34px;height:34px;display:grid;place-items:center;border:1px solid #bfd0ff;border-radius:6px;background:#f5f7ff;color:#527dff;font-size:15px;font-style:normal}
        .gp-stat-top i.green{color:#16a36a;border-color:#b8ecd6;background:#f1fcf7}
        .gp-stat-top i.purple{color:#8c5cff;border-color:#dfd0ff;background:#faf7ff}
        .gp-stat-top i.orange{color:#ff8b2c;border-color:#ffd7b6;background:#fff9f4}
        .gp-stat-top i.red{color:#f04f5f;border-color:#ffc9ce;background:#fff6f7}
        .gp-stat-top i.blue{color:#527dff}
        .gp-stat-card strong{display:block;margin-top:9px;color:#101827;font-size:31px;line-height:1.05}
        .gp-stat-card small{display:block;margin-top:7px;color:#89909e;font-size:13px}
        .gp-analytics-grid{display:grid;grid-template-columns:1.45fr .8fr;gap:16px;margin-bottom:16px}
        .gp-panel{background:#fff;border:1px solid #e2e6ed;border-radius:8px;padding:24px;box-shadow:0 2px 8px rgba(15,23,42,.025)}
        .gp-full-panel{margin-top:4px}.gp-placeholder-panel{min-height:340px}
        .gp-panel-heading{display:flex;align-items:center;justify-content:space-between;gap:15px;margin-bottom:14px}
        .gp-panel-heading h2{margin:0;color:#161d2a;font-size:23px}
        .gp-panel-heading p{margin:7px 0 0;color:#8a919e;font-size:15px}
        .gp-panel-heading>span,.gp-panel-heading>a,.gp-panel-heading>button{color:#5c73d8;font-size:14px;font-weight:700;text-decoration:none;border:0;background:none;cursor:pointer}
        .gp-panel-heading>strong{min-width:38px;height:31px;display:grid;place-items:center;border-radius:6px;background:#f2f5ff;color:#526fe0;font-size:13px}
        .gp-chart{height:205px;display:flex;align-items:flex-end;justify-content:space-around;gap:20px;padding:12px 18px 0;border-top:1px solid #f0f2f5;background:repeating-linear-gradient(to top,transparent 0,transparent 39px,#f0f2f5 40px)}
        .gp-chart-column{height:100%;flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:7px;min-width:35px}
        .gp-chart-value{color:#4e5870;font-size:14px;font-weight:700}
        .gp-chart-bar{width:min(48px,65%);min-height:14px;display:flex;align-items:flex-start;justify-content:center;padding-top:6px;border-radius:6px 6px 2px 2px;background:#96AEFC}
        .gp-chart-bar span{width:16px;height:2px;border-radius:5px;background:#fff;opacity:.8}
        .gp-chart-column small{color:#747c8b;font-size:13px;text-align:center;white-space:nowrap}
        .gp-rings{min-height:205px;display:flex;align-items:center;justify-content:center;gap:16px;padding:10px 0 4px}
        .gp-ring{width:82px;height:82px;display:grid;place-items:center;border-radius:50%;background:radial-gradient(circle at center,#fff 0 55%,transparent 56%),conic-gradient(#3e82f5 0 78%,#edf0f4 78% 100%)}
        .gp-ring.ring-two{background:radial-gradient(circle at center,#fff 0 55%,transparent 56%),conic-gradient(#8b5cf6 0 54%,#edf0f4 54% 100%)}
        .gp-ring.ring-three{background:radial-gradient(circle at center,#fff 0 55%,transparent 56%),conic-gradient(#16b88a 0 82%,#edf0f4 82% 100%)}
        .gp-ring div{display:flex;flex-direction:column;align-items:center}
        .gp-ring strong{font-size:19px;color:#202838}.gp-ring small{margin-top:4px;color:#7d8594;font-size:12px}
        .gp-legend{display:flex;justify-content:center;flex-wrap:wrap;gap:18px;color:#6f7785;font-size:13px}
        .gp-legend span{display:flex;align-items:center;gap:5px}.gp-legend i{width:7px;height:7px;display:block;border-radius:50%;background:#3e82f5}
        .gp-legend span:nth-child(2) i{background:#8b5cf6}.gp-legend span:nth-child(3) i{background:#16b88a}
        .gp-dashboard-grid{display:grid;grid-template-columns:1.35fr 1fr;gap:16px}
        .gp-article-row{min-height:72px;display:grid;grid-template-columns:48px minmax(0,1fr) auto;align-items:center;gap:11px;padding:9px 0;border-bottom:1px solid #edf0f4}
        .gp-article-row:last-child{border-bottom:0}
        .gp-delete-button{border:1px solid #f1c5ca;background:#fff7f8;color:#d63d4c;border-radius:5px;padding:6px 9px;font-size:11px;font-weight:700;cursor:pointer}
        .gp-delete-button:hover{background:#fff0f2;border-color:#e99ca5}
        .gp-card-actions{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:8px}
        .gp-row-image{width:48px;height:43px;overflow:hidden;border-radius:5px;background:#e9edf5}
        .gp-demo-thumb{height:100%;display:grid;place-items:center;background:#96AEFC;color:#fff;font-size:11px;font-weight:800}
        .gp-demo-large-thumb img{width:100%;height:100%;display:block;object-fit:cover}
        .gp-row-image img{width:100%;height:100%;display:block;object-fit:cover}
        .gp-row-copy{min-width:0;display:flex;flex-direction:column;gap:5px}.gp-row-copy strong{overflow:hidden;color:#222a38;font-size:18px;line-height:1.3;text-overflow:ellipsis;white-space:nowrap}.gp-row-copy small{color:#8a919e;font-size:14px}
        .gp-status{padding:7px 11px;border-radius:15px;background:#eaf8f0;color:#178447;font-size:12px;font-weight:700;white-space:nowrap}.gp-status.draft{background:#fff5df;color:#b87400}
        .gp-simple-row{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:12px 0;border-bottom:1px solid #edf0f4}.gp-simple-row:last-child{border-bottom:0}
        .gp-simple-row div{min-width:0;display:flex;flex-direction:column;gap:4px}.gp-simple-row small{color:#6877bd;font-size:13px;font-weight:800}.gp-simple-row strong{color:#252c3a;font-size:18px}.gp-simple-row p{margin:0;color:#8a919e;font-size:14px}.gp-simple-row>span{color:#6379dd;font-size:19px}
        .gp-admin-content-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}
        .gp-content-card{display:flex;gap:15px;min-width:0;padding:16px;border:1px solid #e4e8ef;border-radius:7px;background:#fff;color:inherit;transition:.2s ease}
        .gp-content-card:hover{border-color:#aebcff;background:#fafbff;transform:translateY(-1px)}
        .gp-demo-large-thumb{width:105px;height:76px;flex-shrink:0;display:grid;place-items:center;border-radius:5px;background:#96AEFC;color:#fff;font-size:10px;font-weight:800}
        .gp-content-card>div:last-child{min-width:0}.gp-content-card small{color:#6976b3;font-size:13px;font-weight:800}.gp-content-card h3{margin:7px 0;color:#222a38;font-size:21px;line-height:1.3}.gp-content-card p{margin:0 0 10px;color:#7e8694;font-size:14px;line-height:1.4}.gp-content-card b{color:#5e73d8;font-size:14px}.gp-simple-card{min-height:120px}.gp-simple-card>div{width:100%}
        .gp-empty-box{min-height:255px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;border:1px dashed #d8dde7;border-radius:8px;background:#fafbfe;padding:28px}
        .gp-empty-icon{width:48px;height:48px;display:grid;place-items:center;margin-bottom:12px;border-radius:50%;background:#eef2ff;color:#6278df;font-size:20px;font-weight:800}.gp-empty-box h3{margin:0 0 9px;color:#2a3140;font-size:23px}.gp-empty-box p{max-width:500px;margin:0;color:#858d9b;font-size:15px;line-height:1.6}
        .gp-primary-button{display:inline-block;margin-top:15px;padding:10px 14px;border-radius:6px;background:#96AEFC;color:#fff;text-decoration:none;font-size:11px;font-weight:700}

        .gp-header-actions{display:flex;align-items:center;gap:18px}
        .gp-add-content-button{
          border:0;
          border-radius:6px;
          padding:9px 14px;
          background:#96AEFC;
          color:#fff;
          font-size:12px;
          font-weight:700;
          cursor:pointer;
          box-shadow:0 4px 12px rgba(74,91,160,.16);
        }
        .gp-add-content-button:hover{transform:translateY(-1px)}
        .gp-modal-backdrop{
          position:fixed;
          inset:0;
          z-index:100;
          display:flex;
          align-items:center;
          justify-content:center;
          padding:20px;
          background:rgba(8,13,25,.58);
          backdrop-filter:blur(3px);
        }
        .gp-add-modal{
          width:min(600px,100%);
          max-height:90vh;
          overflow:auto;
          padding:22px;
          border-radius:10px;
          background:#fff;
          box-shadow:0 20px 60px rgba(0,0,0,.25);
        }
        .gp-modal-header{display:flex;align-items:flex-start;justify-content:space-between;gap:15px;margin-bottom:18px}
        .gp-modal-header h2{margin:0;color:#161d2a;font-size:24px}
        .gp-modal-header p{margin:6px 0 0;color:#7e8795;font-size:13px}
        .gp-modal-close{
          width:32px;height:32px;border:0;border-radius:6px;
          background:#f1f3f7;color:#555f70;font-size:23px;line-height:1;cursor:pointer
        }
        .gp-modal-type{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:18px}
        .gp-modal-type button{
          padding:11px;border:1px solid #dce1ea;border-radius:6px;
          background:#fff;color:#596274;font-size:13px;font-weight:700;cursor:pointer
        }
        .gp-modal-type button.selected{
          border-color:#7189df;
          background:#f0f3ff;
          color:#526bc9
        }
        .gp-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:13px}
        .gp-form-field{display:flex;flex-direction:column;gap:6px}
        .gp-form-wide{grid-column:1/-1}
        .gp-form-field label{font-size:12px;color:#394252;font-weight:700}
        .gp-form-field input,.gp-form-field select,.gp-form-field textarea{
          width:100%;border:1px solid #d9dee7;border-radius:6px;
          padding:10px 11px;background:#fff;color:#293241;font:inherit;font-size:13px;outline:none
        }
        .gp-form-field textarea{resize:vertical}
        .gp-modal-footer{display:flex;justify-content:flex-end;gap:9px;margin-top:20px;padding-top:15px;border-top:1px solid #edf0f4}
        .gp-secondary-button{
          padding:10px 15px;border:1px solid #d9dee7;border-radius:6px;
          background:#fff;color:#555f70;font-size:13px;font-weight:700;cursor:pointer
        }
        .gp-create-button{border:0;margin-top:0;cursor:pointer}
        .gp-demo-toast{
          position:fixed;right:22px;bottom:22px;z-index:120;
          max-width:380px;padding:14px 42px 14px 16px;border-radius:8px;
          background:#111827;color:#fff;box-shadow:0 10px 30px rgba(0,0,0,.22);
          font-size:13px;line-height:1.5
        }
        .gp-demo-toast button{
          position:absolute;right:10px;top:9px;border:0;background:none;
          color:#fff;font-size:18px;cursor:pointer
        }
        @media(max-width:1100px){.gp-dashboard-sidebar{width:220px}.gp-filter-bar{grid-template-columns:repeat(3,1fr)}.gp-stats-grid{grid-template-columns:repeat(3,1fr)}.gp-analytics-grid{grid-template-columns:1fr}}
        @media(max-width:800px){.gp-dashboard-sidebar{position:fixed;left:-250px;top:0;bottom:0;width:240px;transition:left .25s ease}.gp-dashboard-sidebar.mobile-open{left:0}.gp-menu-button{display:block}.gp-dashboard-header{padding:0 16px}.gp-dashboard-content{padding:20px 14px 30px}.gp-filter-bar{grid-template-columns:repeat(2,1fr)}.gp-stats-grid{grid-template-columns:repeat(2,1fr)}.gp-dashboard-grid{grid-template-columns:1fr}.gp-admin-content-grid{grid-template-columns:1fr}}
        @media(max-width:520px){.gp-header-actions{gap:8px}.gp-add-content-button{padding:8px 9px;font-size:10px}.gp-admin-profile>span{width:32px;height:32px}.gp-form-grid{grid-template-columns:1fr}.gp-form-wide{grid-column:auto}.gp-modal-type{grid-template-columns:1fr}.gp-dashboard-heading h1{font-size:28px}.gp-dashboard-heading p{font-size:13px}.gp-filter-bar{grid-template-columns:1fr}.gp-stats-grid{grid-template-columns:1fr 1fr;gap:8px}.gp-stat-card{min-height:91px;padding:11px}.gp-stat-card strong{font-size:24px}.gp-stat-top>span{font-size:12px}.gp-stat-card small{font-size:11px}.gp-chart{gap:7px;padding-left:5px;padding-right:5px}.gp-chart-bar{width:30px}.gp-chart-column small{font-size:8px;white-space:normal}.gp-rings{gap:7px}.gp-ring{width:68px;height:68px}.gp-article-row{grid-template-columns:40px minmax(0,1fr)}.gp-status{display:none}.gp-content-card{padding:13px}.gp-content-card h3{font-size:18px}.gp-content-card p{font-size:13px}.gp-content-card small{font-size:12px}.gp-row-copy strong{font-size:15px}.gp-row-copy small{font-size:12px}.gp-demo-large-thumb{width:82px;height:65px}}
      `}</style>
    </div>
  );
};

export default Dashboard;

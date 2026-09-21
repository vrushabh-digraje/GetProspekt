import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import gettLogo from "../assets/images/gett.png";
import {
  articlesApi,
  caseStudiesApi,
  enquiriesApi,
  resourcesApi,
  newslettersApi,
  authApi,
} from "../services/api";

const initialDemoArticles = [
  {
    _id: "demo-1",
    title: "Better Data Starts with Verification",
    category: "B2B Technology",
    date: "Sep 11, 2026",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=85",
  },
  {
    _id: "demo-2",
    title: "MQL: Marketing-Qualified Leads",
    category: "Enterprise Technology",
    date: "Sep 11, 2026",
    image:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=85",
  },
  {
    _id: "demo-3",
    title: "SQL: Sales-Qualified Leads",
    category: "Cloud",
    date: "Sep 11, 2026",
    image:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=85",
  },
];

const demoCaseStudies = [
  {
    _id: "cs-1",
    title: "Enterprise Lead Generation",
    description: "Demo case study for publication management.",
  },
  {
    _id: "cs-2",
    title: "B2B Campaign Performance",
    description: "Demo case study showing campaign outcomes.",
  },
  {
    _id: "cs-3",
    title: "Qualified Pipeline Growth",
    description: "Demo case study for business growth content.",
  },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [showAddContent, setShowAddContent] = useState(false);
  const [addType, setAddType] = useState<"Article" | "Case Study" | "Resource" | "Newsletter">("Article");
  const [toastMessage, setToastMessage] = useState("");

  // Data state
  const [articles, setArticles] = useState<any[]>(initialDemoArticles);
  const [caseStudies, setCaseStudies] = useState<any[]>(demoCaseStudies);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [newsletters, setNewsletters] = useState<any[]>([]);

  // Add Content Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("B2B Technology");
  const [author, setAuthor] = useState("GETprospeKt");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [resourceType, setResourceType] = useState("Playbook");
  const [newsletterFreq, setNewsletterFreq] = useState("Weekly");

  // Edit Content Form State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editType, setEditType] = useState<"Article" | "Case Study" | "Resource" | "Newsletter">("Article");
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("B2B Technology");
  const [editAuthor, setEditAuthor] = useState("GETprospeKt");
  const [editDescription, setEditDescription] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editImagePreview, setEditImagePreview] = useState("");
  const [editResourceType, setEditResourceType] = useState("Playbook");
  const [editNewsletterFreq, setEditNewsletterFreq] = useState("Weekly");

  const navItems = [
    ["Dashboard", "⌂"],
    ["Articles", "▤"],
    ["Case Studies", "◫"],
    ["Resources", "▣"],
    ["Newsletters", "✉"],
    ["Enquiries", "📥"],
  ];

  // Fetch live data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [arts, studies, enqs, res, news] = await Promise.all([
          articlesApi.getAll(),
          caseStudiesApi.getAll(),
          enquiriesApi.getAll(),
          resourcesApi.getAll(),
          newslettersApi.getAll(),
        ]);

        if (arts && arts.length > 0) setArticles(arts);
        if (studies && studies.length > 0) setCaseStudies(studies);
        if (enqs && enqs.length > 0) setEnquiries(enqs);
        if (res && res.length > 0) setResources(res);
        if (news && news.length > 0) setNewsletters(news);
      } catch (err) {
        console.warn("[Dashboard Data Load]", err);
      }
    };

    fetchData();
  }, []);

  const logout = () => {
    authApi.logout();
    navigate("/login", { replace: true });
  };

  const selectSection = (item: string) => {
    setActiveSection(item);
    if (window.innerWidth <= 800) {
      document.querySelector(".gp-dashboard-sidebar")?.classList.remove("mobile-open");
    }
  };

  const handleAddContent = async () => {
    if (!title.trim()) {
      alert("Please enter a title.");
      return;
    }

    try {
      const finalImage = imageUrl.trim() || imagePreview;

      if (addType === "Article") {
        const newArt = {
          title: title.trim(),
          category,
          author,
          description: description || "New article added via CMS",
          date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          image: finalImage || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=900&q=85",
        };
        try {
          const res = await articlesApi.create(newArt);
          setArticles((prev) => [res, ...prev]);
        } catch {
          setArticles((prev) => [{ ...newArt, _id: `local_${Date.now()}` }, ...prev]);
        }
      } else if (addType === "Case Study") {
        const newCs = {
          title: title.trim(),
          description: description || "New case study added via CMS",
          image: finalImage || "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=90",
          profile: "Enterprise B2B client",
          objective: "Generate verified leads and qualified pipeline.",
        };
        try {
          const res = await caseStudiesApi.create(newCs);
          setCaseStudies((prev) => [res, ...prev]);
        } catch {
          setCaseStudies((prev) => [{ ...newCs, _id: `local_${Date.now()}` }, ...prev]);
        }
      } else if (addType === "Resource") {
        const newRes = {
          title: title.trim(),
          type: resourceType,
          category,
          summary: description || "Resource published via CMS",
        };
        try {
          const res = await resourcesApi.create(newRes);
          setResources((prev) => [res, ...prev]);
        } catch {
          setResources((prev) => [{ ...newRes, _id: `local_${Date.now()}` }, ...prev]);
        }
      } else if (addType === "Newsletter") {
        const newNews = {
          title: title.trim(),
          frequency: newsletterFreq,
          summary: description || "Weekly newsletter issue",
        };
        try {
          const res = await newslettersApi.create(newNews);
          setNewsletters((prev) => [res, ...prev]);
        } catch {
          setNewsletters((prev) => [{ ...newNews, _id: `local_${Date.now()}` }, ...prev]);
        }
      }

      setToastMessage(`${addType} added successfully.`);
      setShowAddContent(false);
      setTitle("");
      setDescription("");
      setImageUrl("");
      setImagePreview("");
    } catch (err: any) {
      alert(`Error adding ${addType}: ${err.message}`);
    }
  };

  const handleOpenEdit = (
    type: "Article" | "Case Study" | "Resource" | "Newsletter",
    item: any
  ) => {
    setEditingItem(item);
    setEditType(type);
    setEditTitle(item.title || "");
    setEditCategory(item.category || "B2B Technology");
    setEditAuthor(item.author || "GETprospeKt");
    setEditDescription(item.description || item.summary || "");
    const img = item.image || item.heroImage || "";
    setEditImageUrl(img);
    setEditImagePreview(img);
    setEditResourceType(item.type || "Playbook");
    setEditNewsletterFreq(item.frequency || "Weekly");
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim()) {
      alert("Please enter a title.");
      return;
    }

    try {
      const finalImage = editImageUrl.trim() || editImagePreview;
      const itemId = editingItem._id;

      if (editType === "Article") {
        const updated = {
          title: editTitle.trim(),
          category: editCategory,
          author: editAuthor,
          description: editDescription,
          image: finalImage || undefined,
        };
        try {
          await articlesApi.update(itemId, updated);
        } catch (e) {
          console.warn("Backend update failed, updating local state:", e);
        }
        setArticles((prev) =>
          prev.map((a) => (a._id === itemId ? { ...a, ...updated } : a))
        );
      } else if (editType === "Case Study") {
        const updated = {
          title: editTitle.trim(),
          description: editDescription,
          image: finalImage || undefined,
        };
        try {
          await caseStudiesApi.update(itemId, updated);
        } catch (e) {
          console.warn("Backend update failed, updating local state:", e);
        }
        setCaseStudies((prev) =>
          prev.map((c) => (c._id === itemId ? { ...c, ...updated } : c))
        );
      } else if (editType === "Resource") {
        const updated = {
          title: editTitle.trim(),
          type: editResourceType,
          category: editCategory,
          summary: editDescription,
        };
        try {
          await resourcesApi.update(itemId, updated);
        } catch (e) {
          console.warn("Backend update failed, updating local state:", e);
        }
        setResources((prev) =>
          prev.map((r) => (r._id === itemId ? { ...r, ...updated } : r))
        );
      } else if (editType === "Newsletter") {
        const updated = {
          title: editTitle.trim(),
          frequency: editNewsletterFreq,
          summary: editDescription,
        };
        try {
          await newslettersApi.update(itemId, updated);
        } catch (e) {
          console.warn("Backend update failed, updating local state:", e);
        }
        setNewsletters((prev) =>
          prev.map((n) => (n._id === itemId ? { ...n, ...updated } : n))
        );
      }

      setToastMessage(`${editType} updated successfully.`);
      setShowEditModal(false);
      setEditingItem(null);
    } catch (err: any) {
      alert(`Error updating ${editType}: ${err.message}`);
    }
  };

  const handleDeleteItem = async (
    type: "Article" | "Case Study" | "Resource" | "Newsletter",
    id: string
  ) => {
    if (!confirm(`Are you sure you want to delete this ${type.toLowerCase()}?`)) return;

    try {
      if (type === "Article") {
        try {
          await articlesApi.delete(id);
        } catch (e) {
          console.warn("Backend delete failed, removing from local state:", e);
        }
        setArticles((prev) => prev.filter((a) => a._id !== id));
      } else if (type === "Case Study") {
        try {
          await caseStudiesApi.delete(id);
        } catch (e) {
          console.warn("Backend delete failed, removing from local state:", e);
        }
        setCaseStudies((prev) => prev.filter((c) => c._id !== id));
      } else if (type === "Resource") {
        try {
          await resourcesApi.delete(id);
        } catch (e) {
          console.warn("Backend delete failed, removing from local state:", e);
        }
        setResources((prev) => prev.filter((r) => r._id !== id));
      } else if (type === "Newsletter") {
        try {
          await newslettersApi.delete(id);
        } catch (e) {
          console.warn("Backend delete failed, removing from local state:", e);
        }
        setNewsletters((prev) => prev.filter((n) => n._id !== id));
      }

      setToastMessage(`${type} deleted successfully.`);
    } catch (err: any) {
      alert(`Error deleting ${type}: ${err.message}`);
    }
  };

  const handleUpdateEnquiry = async (id: string, status: string) => {
    await enquiriesApi.updateStatus(id, status);
    setEnquiries((prev) =>
      prev.map((item) => (item._id === id ? { ...item, status } : item))
    );
  };

  const handleDeleteEnquiry = async (id: string) => {
    if (!confirm("Are you sure you want to delete this enquiry?")) return;
    await enquiriesApi.delete(id);
    setEnquiries((prev) => prev.filter((item) => item._id !== id));
  };

  const stats = [
    ["Total Articles", String(articles.length), "Published & active", ""],
    ["Case Studies", String(caseStudies.length), "Case studies in library", "orange"],
    ["Resources", String(resources.length), "Playbooks & whitepapers", "red"],
    ["Newsletters", String(newsletters.length), "Published issues", "purple"],
    ["Enquiries", String(enquiries.length), "Contact submissions", "blue"],
  ];

  const renderSection = () => {
    if (activeSection === "Dashboard") {
      return (
        <>
          <div className="gp-stats-grid">
            {stats.map(([title, value, text, iconClass], index) => (
              <div className="gp-stat-card" key={title}>
                <div className="gp-stat-top">
                  <span>{title}</span>
                  <i className={iconClass}>{["▤", "◫", "▣", "✉", "📥"][index]}</i>
                </div>
                <strong>{value}</strong>
                <small>{text}</small>
              </div>
            ))}
          </div>

          <div className="gp-dashboard-grid">
            <section className="gp-panel">
              <div className="gp-panel-heading">
                <div>
                  <h2>Recent Content</h2>
                  <p>Latest articles and insights.</p>
                </div>
                <button onClick={() => setActiveSection("Articles")}>View All →</button>
              </div>

              {articles.slice(0, 4).map((article) => (
                <div className="gp-article-row" key={article._id || article.title}>
                  <div className="gp-row-image">
                    <img src={article.image || article.heroImage} alt={article.title} />
                  </div>
                  <div className="gp-row-copy">
                    <strong>{article.title}</strong>
                    <small>{article.category} · {article.date || "Sep 2026"}</small>
                  </div>
                </div>
              ))}
            </section>

            <section className="gp-panel">
              <div className="gp-panel-heading">
                <div>
                  <h2>Latest Enquiries</h2>
                  <p>Messages from the Contact Us form.</p>
                </div>
                <button onClick={() => setActiveSection("Enquiries")}>View All →</button>
              </div>

              {enquiries.length === 0 ? (
                <p style={{ padding: "20px", color: "#6b7280" }}>No enquiries received yet.</p>
              ) : (
                enquiries.slice(0, 4).map((item) => (
                  <div className="gp-simple-row" key={item._id}>
                    <div>
                      <small>{item.subject || "General"} · {new Date(item.createdAt).toLocaleDateString()}</small>
                      <strong>{item.firstName} {item.lastName} ({item.email})</strong>
                      <p>{item.message}</p>
                    </div>
                    <span className={`gp-status-pill ${item.status?.toLowerCase()}`}>{item.status || "New"}</span>
                  </div>
                ))
              )}
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
              <h2>Articles & Insights</h2>
              <p>Publication content categorized by Industry.</p>
            </div>
            <span>{articles.length} Total</span>
          </div>

          <div className="gp-admin-content-grid">
            {articles.map((article) => (
              <div className="gp-content-card" key={article._id || article.title}>
                <div className="gp-demo-large-thumb">
                  <img src={article.image || article.heroImage} alt={article.title} />
                </div>
                <div>
                  <small>{article.category}</small>
                  <h3>{article.title}</h3>
                  <p>{article.date || "2026"} · By {article.author || "GETprospeKt"}</p>
                  <div className="gp-card-actions">
                    <button
                      className="gp-card-edit-btn"
                      onClick={() => handleOpenEdit("Article", article)}
                      title="Edit Article"
                    >
                      ✎ Edit
                    </button>
                    <button
                      className="gp-card-delete-btn"
                      onClick={() => handleDeleteItem("Article", article._id)}
                      title="Delete Article"
                    >
                      🗑 Delete
                    </button>
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
              <p>Client success stories and lead generation metrics.</p>
            </div>
            <span>{caseStudies.length} Total</span>
          </div>

          <div className="gp-admin-content-grid">
            {caseStudies.map((item) => (
              <div className="gp-content-card gp-simple-card" key={item._id || item.title}>
                <div>
                  <small>CASE STUDY</small>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <b>Published</b>
                  <div className="gp-card-actions">
                    <button
                      className="gp-card-edit-btn"
                      onClick={() => handleOpenEdit("Case Study", item)}
                      title="Edit Case Study"
                    >
                      ✎ Edit
                    </button>
                    <button
                      className="gp-card-delete-btn"
                      onClick={() => handleDeleteItem("Case Study", item._id)}
                      title="Delete Case Study"
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      );
    }

    if (activeSection === "Enquiries") {
      return (
        <section className="gp-panel gp-full-panel">
          <div className="gp-panel-heading">
            <div>
              <h2>Contact Form Enquiries</h2>
              <p>Direct lead capture from the public Contact Us page.</p>
            </div>
            <span>{enquiries.length} Enquiries</span>
          </div>

          {enquiries.length === 0 ? (
            <div className="gp-empty-box">
              <div className="gp-empty-icon">📥</div>
              <h3>No enquiries yet</h3>
              <p>When visitors submit the form on the Contact Us page, their messages will appear here.</p>
              <Link to="/contact" className="gp-primary-button">Open Contact Page →</Link>
            </div>
          ) : (
            <div className="gp-enquiries-table-wrap">
              <table className="gp-enquiries-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Company</th>
                    <th>Subject</th>
                    <th>Message</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {enquiries.map((enq) => (
                    <tr key={enq._id}>
                      <td>{new Date(enq.createdAt).toLocaleDateString()}</td>
                      <td><strong>{enq.firstName} {enq.lastName}</strong></td>
                      <td><a href={`mailto:${enq.email}`}>{enq.email}</a></td>
                      <td>{enq.company || "—"}</td>
                      <td><span className="gp-subject-badge">{enq.subject}</span></td>
                      <td className="gp-message-cell">{enq.message}</td>
                      <td>
                        <select
                          value={enq.status || "New"}
                          onChange={(e) => handleUpdateEnquiry(enq._id, e.target.value)}
                          className={`gp-status-select ${enq.status?.toLowerCase()}`}
                        >
                          <option>New</option>
                          <option>Read</option>
                          <option>Replied</option>
                          <option>Archived</option>
                        </select>
                      </td>
                      <td>
                        <button
                          className="gp-delete-btn"
                          onClick={() => handleDeleteEnquiry(enq._id)}
                          title="Delete Enquiry"
                        >
                          🗑
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      );
    }

    if (activeSection === "Resources") {
      return (
        <section className="gp-panel gp-full-panel">
          <div className="gp-panel-heading">
            <div>
              <h2>Resources & Research</h2>
              <p>Playbooks, Whitepapers, and Industry Reports.</p>
            </div>
            <span>{resources.length} Total</span>
          </div>

          <div className="gp-admin-content-grid">
            {resources.length === 0 ? (
              <p style={{ padding: "20px", color: "#6b7280" }}>No resources created yet. Click "+ Add Content" to create one.</p>
            ) : (
              resources.map((item) => (
                <div className="gp-content-card gp-simple-card" key={item._id || item.title}>
                  <div>
                    <small>{item.type} · {item.category}</small>
                    <h3>{item.title}</h3>
                    <p>{item.summary}</p>
                    <b>Published</b>
                    <div className="gp-card-actions">
                      <button
                        className="gp-card-edit-btn"
                        onClick={() => handleOpenEdit("Resource", item)}
                        title="Edit Resource"
                      >
                        ✎ Edit
                      </button>
                      <button
                        className="gp-card-delete-btn"
                        onClick={() => handleDeleteItem("Resource", item._id)}
                        title="Delete Resource"
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      );
    }

    if (activeSection === "Newsletters") {
      return (
        <section className="gp-panel gp-full-panel">
          <div className="gp-panel-heading">
            <div>
              <h2>Newsletters</h2>
              <p>Weekly and Monthly publication issues.</p>
            </div>
            <span>{newsletters.length} Total</span>
          </div>

          <div className="gp-admin-content-grid">
            {newsletters.length === 0 ? (
              <p style={{ padding: "20px", color: "#6b7280" }}>No newsletters created yet. Click "+ Add Content" to draft an issue.</p>
            ) : (
              newsletters.map((item) => (
                <div className="gp-content-card gp-simple-card" key={item._id || item.title}>
                  <div>
                    <small>{item.frequency || "Weekly"} Newsletter</small>
                    <h3>{item.title}</h3>
                    <p>{item.summary}</p>
                    <b>Active</b>
                    <div className="gp-card-actions">
                      <button
                        className="gp-card-edit-btn"
                        onClick={() => handleOpenEdit("Newsletter", item)}
                        title="Edit Newsletter"
                      >
                        ✎ Edit
                      </button>
                      <button
                        className="gp-card-delete-btn"
                        onClick={() => handleDeleteItem("Newsletter", item._id)}
                        title="Delete Newsletter"
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      );
    }

    return null;
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
          <Link to="/" className="gp-sidebar-website-link" title="Open Main Website">
            <span>🌐</span> Go to Website ↗
          </Link>
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
            <Link to="/" className="gp-view-website-button" title="View Public Website">
              🌐 View Website ↗
            </Link>
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
            <p>Welcome back! Manage your publication, content, and client enquiries.</p>
          </div>

          {renderSection()}
        </section>
      </main>

      {/* ================= ADD CONTENT MODAL ================= */}
      {showAddContent && (
        <div className="gp-modal-backdrop" onClick={() => setShowAddContent(false)}>
          <div className="gp-add-modal" onClick={(e) => e.stopPropagation()}>
            <div className="gp-modal-header">
              <div>
                <h2>Add Content</h2>
                <p>Create a new publication item with updated taxonomy.</p>
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
              {(["Article", "Case Study", "Resource", "Newsletter"] as const).map((t) => (
                <button
                  key={t}
                  className={addType === t ? "selected" : ""}
                  onClick={() => setAddType(t)}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="gp-form-grid">
              <div className="gp-form-field gp-form-wide">
                <label>Title *</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={`Enter ${addType.toLowerCase()} title`}
                />
              </div>

              {addType === "Article" && (
                <>
                  <div className="gp-form-field">
                    <label>Industry / Category</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                      <option>B2B Technology</option>
                      <option>Enterprise Technology</option>
                      <option>Cloud</option>
                      <option>Cybersecurity</option>
                      <option>AI</option>
                      <option>SaaS</option>
                      <option>Digital Transformation</option>
                    </select>
                  </div>

                  <div className="gp-form-field">
                    <label>Author</label>
                    <input
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="Author name"
                    />
                  </div>
                </>
              )}

              {addType === "Resource" && (
                <>
                  <div className="gp-form-field">
                    <label>Resource Type</label>
                    <select value={resourceType} onChange={(e) => setResourceType(e.target.value)}>
                      <option>Playbook</option>
                      <option>Whitepaper</option>
                      <option>Industry Report</option>
                      <option>Enterprise Technology Trends</option>
                      <option>Buyer Insights</option>
                    </select>
                  </div>

                  <div className="gp-form-field">
                    <label>Industry</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                      <option>B2B Technology</option>
                      <option>Enterprise Technology</option>
                      <option>Cloud</option>
                      <option>Cybersecurity</option>
                      <option>AI</option>
                      <option>SaaS</option>
                    </select>
                  </div>
                </>
              )}

              {addType === "Newsletter" && (
                <div className="gp-form-field">
                  <label>Frequency</label>
                  <select value={newsletterFreq} onChange={(e) => setNewsletterFreq(e.target.value)}>
                    <option>Weekly</option>
                    <option>Monthly</option>
                  </select>
                </div>
              )}

              <div className="gp-form-field gp-form-wide">
                <label>Featured Image (Optional)</label>
                <div className="gp-image-input-row">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      if (e.target.value) setImagePreview(e.target.value);
                    }}
                    placeholder="Paste image URL (e.g. https://images.unsplash.com/...)"
                  />
                  <span className="gp-or-divider">OR</span>
                  <label className="gp-file-upload-btn">
                    Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            const result = reader.result as string;
                            setImagePreview(result);
                            setImageUrl(result);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
                {imagePreview && (
                  <div className="gp-image-preview-wrap">
                    <img src={imagePreview} alt="Preview" />
                    <button
                      type="button"
                      onClick={() => {
                        setImageUrl("");
                        setImagePreview("");
                      }}
                    >
                      ✕ Remove Image
                    </button>
                  </div>
                )}
              </div>

              <div className="gp-form-field gp-form-wide">
                <label>Description / Summary</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter summary or overview"
                  rows={4}
                />
              </div>
            </div>

            <div className="gp-modal-footer">
              <button className="gp-secondary-button" onClick={() => setShowAddContent(false)}>
                Cancel
              </button>
              <button className="gp-primary-button gp-create-button" onClick={handleAddContent}>
                Add {addType}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= EDIT CONTENT MODAL ================= */}
      {showEditModal && editingItem && (
        <div className="gp-modal-backdrop" onClick={() => setShowEditModal(false)}>
          <div className="gp-add-modal" onClick={(e) => e.stopPropagation()}>
            <div className="gp-modal-header">
              <div>
                <h2>Edit {editType}</h2>
                <p>Update publication details and metadata.</p>
              </div>
              <button
                className="gp-modal-close"
                aria-label="Close"
                onClick={() => setShowEditModal(false)}
              >
                ×
              </button>
            </div>

            <div className="gp-form-grid">
              <div className="gp-form-field gp-form-wide">
                <label>Title *</label>
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder={`Enter ${editType.toLowerCase()} title`}
                />
              </div>

              {editType === "Article" && (
                <>
                  <div className="gp-form-field">
                    <label>Industry / Category</label>
                    <select value={editCategory} onChange={(e) => setEditCategory(e.target.value)}>
                      <option>B2B Technology</option>
                      <option>Enterprise Technology</option>
                      <option>Cloud</option>
                      <option>Cybersecurity</option>
                      <option>AI</option>
                      <option>SaaS</option>
                      <option>Digital Transformation</option>
                    </select>
                  </div>

                  <div className="gp-form-field">
                    <label>Author</label>
                    <input
                      value={editAuthor}
                      onChange={(e) => setEditAuthor(e.target.value)}
                      placeholder="Author name"
                    />
                  </div>
                </>
              )}

              {editType === "Resource" && (
                <>
                  <div className="gp-form-field">
                    <label>Resource Type</label>
                    <select value={editResourceType} onChange={(e) => setEditResourceType(e.target.value)}>
                      <option>Playbook</option>
                      <option>Whitepaper</option>
                      <option>Industry Report</option>
                      <option>Enterprise Technology Trends</option>
                      <option>Buyer Insights</option>
                    </select>
                  </div>

                  <div className="gp-form-field">
                    <label>Industry</label>
                    <select value={editCategory} onChange={(e) => setEditCategory(e.target.value)}>
                      <option>B2B Technology</option>
                      <option>Enterprise Technology</option>
                      <option>Cloud</option>
                      <option>Cybersecurity</option>
                      <option>AI</option>
                      <option>SaaS</option>
                    </select>
                  </div>
                </>
              )}

              {editType === "Newsletter" && (
                <div className="gp-form-field">
                  <label>Frequency</label>
                  <select value={editNewsletterFreq} onChange={(e) => setEditNewsletterFreq(e.target.value)}>
                    <option>Weekly</option>
                    <option>Monthly</option>
                  </select>
                </div>
              )}

              {(editType === "Article" || editType === "Case Study") && (
                <div className="gp-form-field gp-form-wide">
                  <label>Featured Image (Optional)</label>
                  <div className="gp-image-input-row">
                    <input
                      type="url"
                      value={editImageUrl}
                      onChange={(e) => {
                        setEditImageUrl(e.target.value);
                        if (e.target.value) setEditImagePreview(e.target.value);
                      }}
                      placeholder="Paste image URL (e.g. https://images.unsplash.com/...)"
                    />
                    <span className="gp-or-divider">OR</span>
                    <label className="gp-file-upload-btn">
                      Upload Image
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              const result = reader.result as string;
                              setEditImagePreview(result);
                              setEditImageUrl(result);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                  {editImagePreview && (
                    <div className="gp-image-preview-wrap">
                      <img src={editImagePreview} alt="Preview" />
                      <button
                        type="button"
                        onClick={() => {
                          setEditImageUrl("");
                          setEditImagePreview("");
                        }}
                      >
                        ✕ Remove Image
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="gp-form-field gp-form-wide">
                <label>Description / Summary</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Enter summary or overview"
                  rows={4}
                />
              </div>
            </div>

            <div className="gp-modal-footer">
              <button className="gp-secondary-button" onClick={() => setShowEditModal(false)}>
                Cancel
              </button>
              <button className="gp-primary-button gp-create-button" onClick={handleSaveEdit}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="gp-demo-toast">
          {toastMessage}
          <button onClick={() => setToastMessage("")}>×</button>
        </div>
      )}

      <style>{`
        *{box-sizing:border-box}
        .gp-dashboard{min-height:100vh;display:flex;background:#f5f7fb;color:#111827;font-family: var(--font-sans)}
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
        .gp-sidebar-bottom{margin-top:auto;padding:18px 16px;border-top:1px solid rgba(255,255,255,.08)}
        .gp-sidebar-user{display:flex;align-items:center;gap:10px;margin-bottom:13px}
        .gp-sidebar-user span{width:34px;height:34px;border-radius:50%;background:#96AEFC;color:#071019;display:grid;place-items:center;font-size:11px;font-weight:700}
        .gp-sidebar-user strong{display:block;font-size:13px;color:#fff}
        .gp-sidebar-user small{color:#9aa7bd;font-size:11px}
        .gp-sidebar-website-link{display:flex;align-items:center;gap:10px;width:100%;padding:10px 12px;margin-bottom:14px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:6px;color:#e2e8f0;text-decoration:none;font-size:13px;font-weight:700;transition:.2s ease}
        .gp-sidebar-website-link:hover{background:rgba(255,255,255,.14);color:#fff}
        .gp-sidebar-bottom button{width:100%;padding:8px 10px;border:1px solid rgba(255,255,255,.14);background:transparent;color:#fff;border-radius:6px;cursor:pointer;font-size:12px;font-weight:700}
        .gp-sidebar-bottom button:hover{background:rgba(255,255,255,.08)}
        .gp-dashboard-main{flex:1;min-width:0;display:flex;flex-direction:column}
        .gp-dashboard-header{height:91px;padding:0 30px;background:#fff;border-bottom:1px solid #e7ebf3;display:flex;align-items:center;justify-content:space-between;gap:20px}
        .gp-header-left{display:flex;align-items:center;gap:14px}
        .gp-menu-button{display:none;font-size:22px;border:0;background:transparent;cursor:pointer}
        .gp-header-left strong{display:block;font-size:18px}
        .gp-header-left small{color:#6b7280;font-size:12px}
        .gp-header-actions{display:flex;align-items:center;gap:14px}
        .gp-view-website-button{display:inline-flex;align-items:center;gap:6px;padding:9px 15px;border-radius:7px;font-size:13px;font-weight:600;color:#334155;background:#f8fafc;border:1px solid #cbd5e1;text-decoration:none;transition:.2s ease}
        .gp-view-website-button:hover{background:#f1f5f9;color:#0f172a;border-color:#94a3b8}
        .gp-add-content-button{background:#7568E8;color:#fff;border:0;padding:10px 18px;border-radius:7px;font-size:13px;font-weight:700;cursor:pointer;transition:.2s ease}
        .gp-add-content-button:hover{background:#6757D9}
        .gp-admin-profile{display:flex;align-items:center;gap:10px}
        .gp-admin-profile span{width:36px;height:36px;border-radius:50%;background:#F0EEFF;color:#6757D9;display:grid;place-items:center;font-size:12px;font-weight:700}
        .gp-dashboard-content{padding:26px 30px 40px;flex:1}
        .gp-dashboard-heading{margin-bottom:24px}
        .gp-dashboard-heading h1{font-size:28px;margin-bottom:6px;font-family:var(--font-serif)}
        .gp-dashboard-heading p{color:#6b7280;font-size:14px}
        .gp-stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:16px;margin-bottom:25px}
        .gp-stat-card{background:#fff;border:1px solid #e6ebf4;border-radius:10px;padding:18px 20px;box-shadow:0 2px 5px rgba(0,0,0,.02)}
        .gp-stat-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;color:#6b7280;font-size:13px}
        .gp-stat-top i{font-style:normal;font-size:16px}
        .gp-stat-card strong{display:block;font-size:28px;font-weight:700;color:#111827;margin-bottom:4px}
        .gp-stat-card small{color:#9ca3af;font-size:12px}
        .gp-dashboard-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}
        .gp-panel{background:#fff;border:1px solid #e6ebf4;border-radius:10px;padding:22px 24px;box-shadow:0 2px 6px rgba(0,0,0,.02)}
        .gp-full-panel{width:100%}
        .gp-panel-heading{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:20px}
        .gp-panel-heading h2{font-size:18px;margin-bottom:4px;font-family:var(--font-serif)}
        .gp-panel-heading p{color:#6b7280;font-size:13px}
        .gp-panel-heading button{background:transparent;border:0;color:#7568E8;font-weight:700;cursor:pointer;font-size:13px}
        .gp-article-row{display:flex;align-items:center;gap:14px;padding:12px 0;border-bottom:1px solid #f1f5f9}
        .gp-row-image img{width:60px;height:45px;border-radius:6px;object-fit:cover}
        .gp-row-copy strong{display:block;font-size:14px;color:#111827}
        .gp-row-copy small{color:#6b7280;font-size:12px}
        .gp-simple-row{display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid #f1f5f9;gap:10px}
        .gp-simple-row small{color:#7568E8;font-size:11px;font-weight:700;display:block}
        .gp-simple-row strong{font-size:14px;color:#111827;display:block}
        .gp-simple-row p{font-size:12px;color:#6b7280;margin:3px 0 0;max-width:320px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .gp-status-pill{padding:4px 9px;border-radius:12px;font-size:11px;font-weight:700;background:#E0E7FF;color:#4338CA}
        .gp-status-pill.read{background:#F3F4F6;color:#4B5563}
        .gp-status-pill.replied{background:#D1FAE5;color:#065F46}
        .gp-admin-content-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:18px}
        .gp-content-card{background:#fafbfc;border:1px solid #e7ebf3;border-radius:8px;overflow:hidden}
        .gp-demo-large-thumb img{width:100%;height:140px;object-fit:cover}
        .gp-content-card div{padding:14px}
        .gp-content-card small{color:#7568E8;font-size:11px;font-weight:700}
        .gp-content-card h3{font-size:15px;margin:5px 0 6px;line-height:1.3;font-family:var(--font-serif)}
        .gp-content-card p{color:#6b7280;font-size:12px}
        .gp-card-actions{display:flex;align-items:center;gap:8px;margin-top:12px;padding-top:10px;border-top:1px solid #eef2f6}
        .gp-card-edit-btn{padding:5px 10px;border:1px solid #cbd5e1;background:#fff;border-radius:5px;color:#334155;font-size:12px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:4px;transition:0.15s ease}
        .gp-card-edit-btn:hover{background:#F0EEFF;color:#6757D9;border-color:#7568E8}
        .gp-card-delete-btn{padding:5px 10px;border:1px solid #fecdd3;background:#fff;border-radius:5px;color:#e11d48;font-size:12px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:4px;transition:0.15s ease}
        .gp-card-delete-btn:hover{background:#ffe4e6;border-color:#fda4af}
        .gp-enquiries-table-wrap{overflow-x:auto}
        .gp-enquiries-table{width:100%;border-collapse:collapse;font-size:13px;text-align:left}
        .gp-enquiries-table th{padding:12px 14px;background:#f8fafc;border-bottom:2px solid #e2e8f0;color:#475569;font-weight:700}
        .gp-enquiries-table td{padding:12px 14px;border-bottom:1px solid #f1f5f9;color:#334155}
        .gp-subject-badge{display:inline-block;padding:3px 8px;border-radius:4px;background:#ede9fe;color:#5b21b6;font-size:11px;font-weight:600}
        .gp-message-cell{max-width:240px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .gp-status-select{padding:4px 6px;border-radius:4px;border:1px solid #cbd5e1;font-size:12px;font-weight:600}
        .gp-delete-btn{border:0;background:transparent;cursor:pointer;font-size:15px;color:#94a3b8}
        .gp-delete-btn:hover{color:#e11d48}
        .gp-empty-box{padding:50px 20px;text-align:center}
        .gp-empty-icon{font-size:36px;margin-bottom:12px}
        .gp-empty-box h3{font-size:18px;margin-bottom:8px}
        .gp-empty-box p{color:#6b7280;font-size:14px;margin-bottom:18px}
        .gp-primary-button{display:inline-block;background:#7568E8;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none;font-weight:700;font-size:13px}
        .gp-modal-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.5);display:grid;place-items:center;z-index:1000;padding:20px}
        .gp-add-modal{background:#fff;width:min(600px,100%);border-radius:10px;padding:26px;box-shadow:0 10px 30px rgba(0,0,0,.15)}
        .gp-modal-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:18px}
        .gp-modal-header h2{font-size:20px;margin-bottom:4px;font-family:var(--font-serif)}
        .gp-modal-header p{color:#6b7280;font-size:13px}
        .gp-modal-close{border:0;background:transparent;font-size:22px;cursor:pointer;color:#9ca3af}
        .gp-modal-type{display:flex;gap:8px;margin-bottom:20px;border-bottom:1px solid #e5e7eb;padding-bottom:12px}
        .gp-modal-type button{padding:7px 14px;border-radius:6px;border:1px solid #d1d5db;background:#fff;font-size:13px;font-weight:600;cursor:pointer}
        .gp-modal-type button.selected{background:#7568E8;color:#fff;border-color:#7568E8}
        .gp-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
        .gp-form-wide{grid-column:1/-1}
        .gp-form-field label{display:block;font-size:12px;font-weight:700;color:#374151;margin-bottom:6px}
        .gp-form-field input, .gp-form-field select, .gp-form-field textarea{width:100%;padding:9px 12px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;outline:none}
        .gp-image-input-row{display:flex;gap:10px;align-items:center}
        .gp-or-divider{font-size:11px;color:#9ca3af;font-weight:700;flex-shrink:0}
        .gp-file-upload-btn{display:inline-flex;align-items:center;justify-content:center;padding:9px 14px;background:#F0EEFF;color:#6757D9;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap;border:1px solid #7568E8;flex-shrink:0}
        .gp-file-upload-btn:hover{background:#e3e0ff}
        .gp-image-preview-wrap{margin-top:10px;display:flex;align-items:center;gap:14px;padding:8px 12px;background:#f8fafc;border-radius:6px;border:1px solid #e2e8f0}
        .gp-image-preview-wrap img{width:70px;height:50px;border-radius:6px;object-fit:cover;border:1px solid #cbd5e1}
        .gp-image-preview-wrap button{background:transparent;border:0;color:#e11d48;font-size:12px;font-weight:700;cursor:pointer}
        .gp-modal-footer{display:flex;justify-content:flex-end;gap:10px;margin-top:20px}
        .gp-secondary-button{padding:9px 16px;border:1px solid #d1d5db;background:#fff;border-radius:6px;font-size:13px;font-weight:600;cursor:pointer}
        .gp-create-button{border:0;cursor:pointer}
        .gp-demo-toast{position:fixed;bottom:24px;right:24px;background:#10b981;color:#fff;padding:12px 18px;border-radius:6px;box-shadow:0 4px 12px rgba(0,0,0,.15);display:flex;align-items:center;gap:12px;font-size:13px;font-weight:600;z-index:2000}
        .gp-demo-toast button{border:0;background:transparent;color:#fff;font-size:16px;cursor:pointer}
        @media(max-width:800px){
          .gp-dashboard-sidebar{position:fixed;left:-250px;transition:.3s ease}
          .gp-dashboard-sidebar.mobile-open{left:0}
          .gp-menu-button{display:block}
          .gp-dashboard-grid{grid-template-columns:1fr}
        }
      `}</style>
    </div>
  );
};

export default Dashboard;

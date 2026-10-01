import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  homepageShowcaseApi,
  type HomepageArticle,
} from "../../services/api";

interface LatestPopularManagerProps {
  showToast: (msg: string) => void;
}

const PRESET_COVERS = [
  { label: "Lead Gen Team", url: "https://plus.unsplash.com/premium_photo-1661340603772-1ae4ff9afcb1?q=80&w=1472&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { label: "Data Analytics", url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=90" },
  { label: "Office Strategy", url: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=90" },
  { label: "Meeting Room", url: "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=1600&q=90" },
  { label: "Tech AI", url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=90" },
  { label: "Business Meeting", url: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=90" },
];

const PRESET_CATEGORIES = [
  "B2B Lead Generation",
  "Lead-Generation Solution",
  "Enterprise Technology",
  "Cloud & Infrastructure",
  "Cybersecurity",
  "Demand Generation",
  "Appointment Generation",
  "Webinar Campaigns",
];

const PRESET_LINKS = [
  { label: "Better Pipeline", path: "/article/better-pipeline-starts-with-better-decisions" },
  { label: "Human-Verified Data", path: "/article/human-verified-data" },
  { label: "MQL Generation", path: "/article/mql-generation" },
  { label: "SQL Generation", path: "/article/sql-generation" },
  { label: "BANT Qualified Leads", path: "/article/bant-qualified-leads" },
  { label: "Appointment Generation", path: "/article/appointment-generation" },
  { label: "Webinar Campaigns", path: "/article/webinar-campaigns" },
];

export const LatestPopularManager: React.FC<LatestPopularManagerProps> = ({ showToast }) => {
  const [activeTab, setActiveTab] = useState<"latest" | "popular">("latest");
  const [latestArticles, setLatestArticles] = useState<HomepageArticle[]>([]);
  const [popularArticles, setPopularArticles] = useState<HomepageArticle[]>([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [targetTab, setTargetTab] = useState<"latest" | "popular">("latest");

  // Form Fields
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState("B2B Lead Generation");
  const [formAuthor, setFormAuthor] = useState("GETprospeKt");
  const [formDate, setFormDate] = useState("Sep 2026");
  const [formLink, setFormLink] = useState("/article/better-pipeline-starts-with-better-decisions");
  const [formImage, setFormImage] = useState("");
  const [formDescription, setFormDescription] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLatestArticles(homepageShowcaseApi.getLatest());
    setPopularArticles(homepageShowcaseApi.getPopular());
  };

  const openAddModal = (tab: "latest" | "popular") => {
    setIsEditing(false);
    setEditingId(null);
    setTargetTab(tab);
    setFormTitle("");
    setFormCategory("Lead-Generation Solution");
    setFormAuthor("GETprospeKt");
    setFormDate(tab === "latest" ? "Sep 2026" : "Trending");
    setFormLink("/article/mql-generation");
    setFormImage(PRESET_COVERS[0].url);
    setFormDescription("");
    setIsModalOpen(true);
  };

  const openEditModal = (article: HomepageArticle, tab: "latest" | "popular") => {
    setIsEditing(true);
    setEditingId(article._id);
    setTargetTab(tab);
    setFormTitle(article.title);
    setFormCategory(article.category || "Lead-Generation Solution");
    setFormAuthor(article.author || "GETprospeKt");
    setFormDate(article.date || "");
    setFormLink(article.link || "/");
    setFormImage(article.image || PRESET_COVERS[0].url);
    setFormDescription(article.description || "");
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      alert("Please enter a title.");
      return;
    }

    const payload: HomepageArticle = {
      _id: isEditing && editingId ? editingId : `art_${Date.now()}`,
      title: formTitle.trim(),
      category: formCategory,
      author: formAuthor.trim() || "GETprospeKt",
      date: formDate.trim(),
      link: formLink.trim() || "/article/better-pipeline-starts-with-better-decisions",
      image:
        formImage.trim() ||
        "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=90",
      description: formDescription.trim(),
    };

    if (targetTab === "latest") {
      let updated: HomepageArticle[];
      if (isEditing && editingId) {
        updated = latestArticles.map((a) => (a._id === editingId ? payload : a));
      } else {
        updated = [...latestArticles, payload];
      }
      setLatestArticles(updated);
      homepageShowcaseApi.saveLatest(updated);
      showToast(`Updated "${payload.title}" in Latest showcase!`);
    } else {
      let updated: HomepageArticle[];
      if (isEditing && editingId) {
        updated = popularArticles.map((a) => (a._id === editingId ? payload : a));
      } else {
        updated = [...popularArticles, payload];
      }
      setPopularArticles(updated);
      homepageShowcaseApi.savePopular(updated);
      showToast(`Updated "${payload.title}" in Popular showcase!`);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, tab: "latest" | "popular", title: string) => {
    if (!window.confirm(`Remove "${title}" from the ${tab === "latest" ? "Latest" : "Popular"} section?`)) return;

    if (tab === "latest") {
      if (latestArticles.length <= 1) {
        alert("You must keep at least one article for the Latest section.");
        return;
      }
      const updated = latestArticles.filter((a) => a._id !== id);
      setLatestArticles(updated);
      homepageShowcaseApi.saveLatest(updated);
      showToast("Article removed from Latest section.");
    } else {
      if (popularArticles.length <= 1) {
        alert("You must keep at least one article for the Popular section.");
        return;
      }
      const updated = popularArticles.filter((a) => a._id !== id);
      setPopularArticles(updated);
      homepageShowcaseApi.savePopular(updated);
      showToast("Article removed from Popular section.");
    }
  };

  const handleMove = (index: number, direction: "up" | "down", tab: "latest" | "popular") => {
    const list = tab === "latest" ? [...latestArticles] : [...popularArticles];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;

    const [moved] = list.splice(index, 1);
    list.splice(targetIndex, 0, moved);

    if (tab === "latest") {
      setLatestArticles(list);
      homepageShowcaseApi.saveLatest(list);
    } else {
      setPopularArticles(list);
      homepageShowcaseApi.savePopular(list);
    }
  };

  const handleResetDefaults = () => {
    if (!window.confirm("Reset both Latest and Popular sections back to website demo defaults?")) return;
    const res = homepageShowcaseApi.resetDefaults();
    setLatestArticles(res.latest);
    setPopularArticles(res.popular);
    showToast("Reset to website defaults successfully!");
  };

  const currentList = activeTab === "latest" ? latestArticles : popularArticles;

  return (
    <section className="showcase-manager">
      {/* Header */}
      <div className="showcase-header">
        <div className="showcase-header-left">
          <div className="showcase-tag">
            <span className="showcase-dot" /> HOMEPAGE CONTENT MANAGEMENT
          </div>
          <h2>Latest &amp; Popular Showcase</h2>
          <p>
            Control the hero featured story and the articles appearing under the{" "}
            <strong>"Latest"</strong> and <strong>"Popular"</strong> tabs on the homepage.
          </p>
        </div>

        <div className="showcase-header-actions">
          <button className="showcase-reset-btn" onClick={handleResetDefaults} title="Revert to original demo articles">
            ↺ Reset Defaults
          </button>
          <button className="showcase-add-btn" onClick={() => openAddModal(activeTab)}>
            <span>+</span> Add to {activeTab === "latest" ? "Latest" : "Popular"}
          </button>
        </div>
      </div>

      {/* Main Tab Switcher */}
      <div className="showcase-tabs-bar">
        <div className="showcase-tabs">
          <button
            className={`showcase-tab ${activeTab === "latest" ? "active" : ""}`}
            onClick={() => setActiveTab("latest")}
          >
            <span>Latest Articles</span>
            <span className="count-pill">{latestArticles.length}</span>
          </button>
          <button
            className={`showcase-tab ${activeTab === "popular" ? "active" : ""}`}
            onClick={() => setActiveTab("popular")}
          >
            <span>Popular Articles</span>
            <span className="count-pill">{popularArticles.length}</span>
          </button>
        </div>

        <div className="showcase-tab-hint">
          {activeTab === "latest"
            ? "First article acts as the big Featured Story on the left. The rest appear in the Latest sidebar."
            : "These articles appear in the sidebar when visitors click the 'Popular' tab."}
        </div>
      </div>

      {/* Hero Featured Story Banner (Only on Latest tab) */}
      {activeTab === "latest" && latestArticles.length > 0 && (
        <div className="showcase-hero-card">
          <div className="hero-card-badge">★ MAIN HOMEPAGE FEATURED HERO STORY (Position #1)</div>
          <div className="hero-card-content">
            <div className="hero-card-image">
              <img src={latestArticles[0].image} alt={latestArticles[0].title} />
            </div>
            <div className="hero-card-details">
              <span className="hero-category">{latestArticles[0].category}</span>
              <h3>{latestArticles[0].title}</h3>
              <p>{latestArticles[0].description}</p>
              <div className="hero-meta">
                <span>By {latestArticles[0].author}</span>
                <span>•</span>
                <span>Link: <code>{latestArticles[0].link}</code></span>
              </div>
              <div className="hero-actions">
                <Link
                  to={latestArticles[0].link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero-view-link"
                >
                  View on Website ↗
                </Link>
                <button
                  className="hero-edit-btn"
                  onClick={() => openEditModal(latestArticles[0], "latest")}
                >
                  ✎ Edit Hero Story
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Articles Cards List */}
      <div className="showcase-list-header">
        <h3>
          {activeTab === "latest" ? "Sidebar Latest Articles" : "Sidebar Popular Articles"} ({currentList.length})
        </h3>
        <small>Order matters: Top items appear first on the website. Use ▲ / ▼ to reorder.</small>
      </div>

      <div className="showcase-grid">
        {currentList.map((item, index) => {
          const isFirstHero = activeTab === "latest" && index === 0;
          return (
            <div
              className={`showcase-card ${isFirstHero ? "is-hero-card" : ""}`}
              key={item._id || item.link + index}
            >
              <div className="card-thumb-wrap">
                <img src={item.image} alt={item.title} />
                <span className="card-pos-badge">#{index + 1}</span>
                {isFirstHero && <span className="card-hero-tag">Homepage Hero</span>}
              </div>

              <div className="card-body">
                <span className="card-cat">{item.category}</span>
                <h4 title={item.title}>{item.title}</h4>
                <p>{item.description}</p>
                <div className="card-meta">
                  <span className="card-author">By {item.author}</span>
                  {item.date && <span className="card-date">{item.date}</span>}
                </div>

                <div className="card-link-row">
                  <small>Target:</small>
                  <code>{item.link}</code>
                </div>

                <div className="card-footer-actions">
                  <div className="reorder-btns">
                    <button
                      disabled={index === 0}
                      onClick={() => handleMove(index, "up", activeTab)}
                      title="Move up"
                    >
                      ▲
                    </button>
                    <button
                      disabled={index === currentList.length - 1}
                      onClick={() => handleMove(index, "down", activeTab)}
                      title="Move down"
                    >
                      ▼
                    </button>
                  </div>

                  <div className="crud-btns">
                    <button
                      className="btn-edit"
                      onClick={() => openEditModal(item, activeTab)}
                    >
                      ✎ Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(item._id, activeTab, item.title)}
                    >
                      🗑
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= MODAL: ADD / EDIT HOMEPAGE ARTICLE ================= */}
      {isModalOpen && (
        <div className="showcase-modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="showcase-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="showcase-modal-header">
              <div>
                <span className="modal-kicker">
                  {isEditing ? "UPDATE HOMEPAGE STORY" : "ADD NEW HOMEPAGE STORY"}
                </span>
                <h2>
                  {isEditing ? "Edit Article" : "Add Article"} to {targetTab === "latest" ? "Latest" : "Popular"}
                </h2>
                <p>Changes will immediately reflect on the homepage under the {targetTab} section.</p>
              </div>
              <button
                className="modal-close-btn"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="showcase-form">
              {/* Target Tab Switcher inside Modal */}
              <div className="form-field full-width">
                <label>Target Section on Homepage</label>
                <div className="modal-tab-pills">
                  <button
                    type="button"
                    className={`modal-tab-pill ${targetTab === "latest" ? "selected" : ""}`}
                    onClick={() => setTargetTab("latest")}
                  >
                    📌 Latest Section
                  </button>
                  <button
                    type="button"
                    className={`modal-tab-pill ${targetTab === "popular" ? "selected" : ""}`}
                    onClick={() => setTargetTab("popular")}
                  >
                    🔥 Popular Section
                  </button>
                </div>
              </div>

              {/* Title */}
              <div className="form-field full-width">
                <label htmlFor="art-title">
                  Article Title <span className="req">*</span>
                </label>
                <input
                  id="art-title"
                  type="text"
                  required
                  placeholder="e.g. Better pipeline starts with better decisions."
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                />
              </div>

              {/* Category */}
              <div className="form-field">
                <label htmlFor="art-cat">Category / Taxonomy</label>
                <input
                  id="art-cat"
                  type="text"
                  placeholder="e.g. B2B Lead Generation"
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  list="category-suggestions"
                />
                <datalist id="category-suggestions">
                  {PRESET_CATEGORIES.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>

              {/* Author */}
              <div className="form-field">
                <label htmlFor="art-author">Author / Byline</label>
                <input
                  id="art-author"
                  type="text"
                  placeholder="GETprospeKt"
                  value={formAuthor}
                  onChange={(e) => setFormAuthor(e.target.value)}
                />
              </div>

              {/* Date / Status Tag */}
              <div className="form-field">
                <label htmlFor="art-date">Date / Badge Tag</label>
                <input
                  id="art-date"
                  type="text"
                  placeholder="e.g. Sep 2026, Trending, Most Read"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                />
              </div>

              {/* Article Link */}
              <div className="form-field">
                <label htmlFor="art-link">Article Link Path</label>
                <input
                  id="art-link"
                  type="text"
                  placeholder="/article/slug"
                  value={formLink}
                  onChange={(e) => setFormLink(e.target.value)}
                  list="link-suggestions"
                />
                <datalist id="link-suggestions">
                  {PRESET_LINKS.map((l) => (
                    <option key={l.path} value={l.path}>
                      {l.label}
                    </option>
                  ))}
                </datalist>
              </div>

              {/* Cover Image with System Upload */}
              <div className="form-field full-width">
                <label htmlFor="art-image">Cover Image</label>
                <div className="modal-image-row">
                  <input
                    id="art-image"
                    type="url"
                    placeholder="Paste image URL (https://...)"
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    className="modal-image-input"
                  />
                  <span className="or-divider">OR</span>
                  <label className="upload-btn" title="Pick an image from your computer">
                    <span>📁</span> Upload from System
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setFormImage(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>

                {/* Preset Chips */}
                <div className="presets-row">
                  <span className="presets-label">Pick a Preset:</span>
                  {PRESET_COVERS.map((preset) => (
                    <button
                      type="button"
                      key={preset.label}
                      className={`preset-chip ${formImage === preset.url ? "selected" : ""}`}
                      onClick={() => setFormImage(preset.url)}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                {/* Preview */}
                {formImage && (
                  <div className="image-preview-bar">
                    <img
                      src={formImage}
                      alt="Preview"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=90";
                      }}
                    />
                    <div className="preview-info">
                      <strong>Image Selected</strong>
                      <small>
                        {formImage.startsWith("data:")
                          ? "Custom image uploaded from your computer."
                          : "Web image URL selected."}
                      </small>
                    </div>
                    <button
                      type="button"
                      className="remove-img-btn"
                      onClick={() => setFormImage("")}
                    >
                      ✕ Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="form-field full-width">
                <label htmlFor="art-desc">Description / Snippet</label>
                <textarea
                  id="art-desc"
                  rows={4}
                  placeholder="Short description displayed on the homepage card..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                />
              </div>

              {/* Modal Footer */}
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  {isEditing ? "Save Changes" : "Add to Showcase"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Scoped CSS Styles */}
      <style>{`
        .showcase-manager {
          display: flex;
          flex-direction: column;
          gap: 22px;
          color: #D5DBE7;
          width: 100%;
        }

        .showcase-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          background: #0D1522;
          border: 1px solid rgba(203, 213, 225, 0.12);
          border-radius: 12px;
          padding: 24px 28px;
        }

        .showcase-header-left {
          max-width: 650px;
        }

        .showcase-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.8px;
          color: #00D2FF;
          margin-bottom: 8px;
        }

        .showcase-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #00D2FF;
          box-shadow: 0 0 8px #00D2FF;
        }

        .showcase-header h2 {
          font-size: 24px;
          font-family: var(--font-serif);
          color: #FFFFFF;
          margin: 0 0 6px;
        }

        .showcase-header p {
          color: #94A3B8;
          font-size: 14px;
          line-height: 1.5;
          margin: 0;
        }

        .showcase-header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .showcase-reset-btn {
          padding: 11px 16px;
          background: #111C2D;
          border: 1px solid rgba(203, 213, 225, 0.16);
          color: #CBD5E1;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .showcase-reset-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #FFFFFF;
        }

        .showcase-add-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #0046FC;
          color: #FFFFFF;
          border: none;
          padding: 11px 20px;
          border-radius: 8px;
          font-size: 13.5px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 14px rgba(0, 70, 252, 0.35);
        }

        .showcase-add-btn:hover {
          background: #0038D1;
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(0, 70, 252, 0.45);
        }

        /* Tabs Bar */
        .showcase-tabs-bar {
          background: #0D1522;
          border: 1px solid rgba(203, 213, 225, 0.12);
          border-radius: 10px;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 14px;
        }

        .showcase-tabs {
          display: flex;
          gap: 10px;
        }

        .showcase-tab {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 700;
          background: #111C2D;
          color: #94A3B8;
          border: 1px solid rgba(203, 213, 225, 0.12);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .showcase-tab:hover {
          color: #FFFFFF;
          border-color: rgba(203, 213, 225, 0.25);
        }

        .showcase-tab.active {
          background: #0046FC;
          color: #FFFFFF;
          border-color: #0046FC;
          box-shadow: 0 4px 12px rgba(0, 70, 252, 0.3);
        }

        .count-pill {
          background: rgba(255, 255, 255, 0.18);
          padding: 2px 7px;
          border-radius: 10px;
          font-size: 11px;
        }

        .showcase-tab-hint {
          font-size: 13px;
          color: #94A3B8;
        }

        /* Hero Featured Card */
        .showcase-hero-card {
          background: #0D1522;
          border: 2px solid #0046FC;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 70, 252, 0.18);
        }

        .hero-card-badge {
          background: linear-gradient(135deg, #0046FC 0%, #00D2FF 100%);
          color: #FFFFFF;
          font-size: 11.5px;
          font-weight: 800;
          letter-spacing: 0.6px;
          padding: 8px 18px;
          text-transform: uppercase;
        }

        .hero-card-content {
          display: grid;
          grid-template-columns: 260px 1fr;
          gap: 24px;
          padding: 22px;
          align-items: center;
        }

        @media (max-width: 800px) {
          .hero-card-content {
            grid-template-columns: 1fr;
          }
        }

        .hero-card-image {
          height: 170px;
          border-radius: 8px;
          overflow: hidden;
          background: #060B12;
        }

        .hero-card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .hero-card-details {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .hero-category {
          font-size: 11px;
          font-weight: 800;
          color: #00D2FF;
          text-transform: uppercase;
          letter-spacing: 0.6px;
        }

        .hero-card-details h3 {
          font-size: 20px;
          font-weight: 700;
          color: #FFFFFF;
          margin: 0;
          font-family: var(--font-serif);
        }

        .hero-card-details p {
          color: #94A3B8;
          font-size: 13.5px;
          line-height: 1.5;
          margin: 0;
        }

        .hero-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #64748B;
        }

        .hero-meta code {
          background: #060B12;
          padding: 2px 6px;
          border-radius: 4px;
          color: #00D2FF;
        }

        .hero-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 6px;
        }

        .hero-view-link {
          color: #00D2FF;
          text-decoration: none;
          font-size: 13px;
          font-weight: 700;
        }

        .hero-view-link:hover {
          text-decoration: underline;
        }

        .hero-edit-btn {
          padding: 6px 14px;
          background: #111C2D;
          border: 1px solid rgba(203, 213, 225, 0.2);
          color: #FFFFFF;
          border-radius: 6px;
          font-size: 12.5px;
          font-weight: 700;
          cursor: pointer;
        }

        .hero-edit-btn:hover {
          background: #0046FC;
        }

        /* List Header */
        .showcase-list-header {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;
        }

        .showcase-list-header h3 {
          font-size: 18px;
          color: #FFFFFF;
          margin: 0;
          font-family: var(--font-serif);
        }

        .showcase-list-header small {
          color: #94A3B8;
          font-size: 12.5px;
        }

        /* Grid of Cards */
        .showcase-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
          gap: 20px;
        }

        .showcase-card {
          background: #0D1522;
          border: 1px solid rgba(203, 213, 225, 0.14);
          border-top: 3px solid #0046FC;
          border-radius: 10px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: all 0.25s ease;
        }

        .showcase-card:hover {
          transform: translateY(-4px);
          border-color: #00D2FF;
          border-top-color: #00D2FF;
          box-shadow: 0 12px 30px rgba(0, 70, 252, 0.25);
        }

        .showcase-card.is-hero-card {
          border-top-color: #00D2FF;
          background: #0e1828;
        }

        .card-thumb-wrap {
          position: relative;
          height: 160px;
          overflow: hidden;
          background: #060B12;
        }

        .card-thumb-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .showcase-card:hover .card-thumb-wrap img {
          transform: scale(1.05);
        }

        .card-pos-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          background: rgba(6, 11, 18, 0.85);
          color: #00D2FF;
          font-size: 11px;
          font-weight: 800;
          padding: 3px 8px;
          border-radius: 4px;
          border: 1px solid rgba(0, 210, 255, 0.3);
        }

        .card-hero-tag {
          position: absolute;
          top: 10px;
          right: 10px;
          background: linear-gradient(135deg, #0046FC, #00D2FF);
          color: #FFFFFF;
          font-size: 10.5px;
          font-weight: 800;
          padding: 3px 8px;
          border-radius: 4px;
        }

        .card-body {
          padding: 16px 18px 18px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .card-cat {
          font-size: 11px;
          font-weight: 800;
          color: #00D2FF;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 6px;
        }

        .card-body h4 {
          margin: 0 0 8px;
          font-size: 16px;
          font-weight: 700;
          color: #FFFFFF;
          line-height: 1.35;
          font-family: var(--font-serif);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .card-body p {
          font-size: 12.5px;
          color: #94A3B8;
          line-height: 1.45;
          margin: 0 0 12px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .card-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 11.5px;
          color: #64748B;
          margin-bottom: 8px;
        }

        .card-link-row {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          color: #64748B;
          margin-bottom: 14px;
        }

        .card-link-row code {
          background: #060B12;
          padding: 2px 6px;
          border-radius: 4px;
          color: #94A3B8;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .card-footer-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 10px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          margin-top: auto;
        }

        .reorder-btns {
          display: flex;
          gap: 4px;
        }

        .reorder-btns button {
          background: #111C2D;
          border: 1px solid rgba(203, 213, 225, 0.16);
          color: #CBD5E1;
          width: 28px;
          height: 28px;
          border-radius: 4px;
          font-size: 11px;
          cursor: pointer;
          display: grid;
          place-items: center;
          transition: all 0.15s ease;
        }

        .reorder-btns button:hover:not(:disabled) {
          background: #0046FC;
          color: #FFFFFF;
          border-color: #0046FC;
        }

        .reorder-btns button:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .crud-btns {
          display: flex;
          gap: 6px;
        }

        .crud-btns .btn-edit {
          padding: 5px 12px;
          background: #111C2D;
          border: 1px solid rgba(203, 213, 225, 0.2);
          color: #D5DBE7;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .crud-btns .btn-edit:hover {
          background: #0046FC;
          color: #FFFFFF;
          border-color: #0046FC;
        }

        .crud-btns .btn-delete {
          padding: 5px 10px;
          background: rgba(225, 29, 72, 0.1);
          border: 1px solid rgba(225, 29, 72, 0.25);
          color: #FECDD3;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .crud-btns .btn-delete:hover {
          background: rgba(225, 29, 72, 0.25);
          color: #FFFFFF;
        }

        /* ================= MODAL ================= */
        .showcase-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(6, 11, 18, 0.75);
          backdrop-filter: blur(8px);
          display: grid;
          place-items: center;
          z-index: 2000;
          padding: 20px;
          overflow-y: auto;
        }

        .showcase-modal-box {
          background: #0D1522;
          border: 1px solid rgba(203, 213, 225, 0.18);
          border-radius: 12px;
          width: min(720px, 100%);
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
          color: #D5DBE7;
          padding: 28px;
        }

        .showcase-modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding-bottom: 18px;
          margin-bottom: 20px;
        }

        .modal-kicker {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.6px;
          color: #00D2FF;
          display: block;
          margin-bottom: 4px;
        }

        .showcase-modal-header h2 {
          font-size: 22px;
          font-family: var(--font-serif);
          color: #FFFFFF;
          margin: 0 0 4px;
        }

        .showcase-modal-header p {
          color: #94A3B8;
          font-size: 13px;
          margin: 0;
        }

        .modal-close-btn {
          background: transparent;
          border: none;
          color: #94A3B8;
          font-size: 20px;
          cursor: pointer;
        }

        .modal-close-btn:hover {
          color: #FFFFFF;
        }

        .showcase-form {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .form-field.full-width {
          grid-column: 1 / -1;
        }

        .form-field label {
          display: block;
          font-size: 12px;
          font-weight: 700;
          color: #D5DBE7;
          margin-bottom: 6px;
        }

        .form-field label .req {
          color: #F43F5E;
        }

        .form-field input,
        .form-field select,
        .form-field textarea {
          width: 100%;
          padding: 10px 14px;
          background: #060B12;
          border: 1px solid rgba(203, 213, 225, 0.16);
          border-radius: 8px;
          color: #FFFFFF;
          font-size: 13px;
          outline: none;
          font-family: inherit;
          transition: border-color 0.2s ease;
        }

        .form-field input:focus,
        .form-field select:focus,
        .form-field textarea:focus {
          border-color: #00D2FF;
          box-shadow: 0 0 0 3px rgba(0, 210, 255, 0.12);
        }

        .modal-tab-pills {
          display: flex;
          gap: 10px;
        }

        .modal-tab-pill {
          flex: 1;
          padding: 10px 16px;
          background: #111C2D;
          border: 1px solid rgba(203, 213, 225, 0.16);
          border-radius: 8px;
          color: #94A3B8;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .modal-tab-pill.selected {
          background: #0046FC;
          color: #FFFFFF;
          border-color: #0046FC;
        }

        .modal-image-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .modal-image-input {
          flex: 1;
        }

        .or-divider {
          font-size: 11px;
          font-weight: 800;
          color: #94A3B8;
          flex-shrink: 0;
        }

        .upload-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 16px;
          background: #111C2D;
          color: #00D2FF;
          border: 1px solid rgba(0, 210, 255, 0.4);
          border-radius: 8px;
          font-size: 12.5px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          flex-shrink: 0;
          transition: all 0.2s ease;
        }

        .upload-btn:hover {
          background: rgba(0, 210, 255, 0.15);
          border-color: #00D2FF;
          color: #FFFFFF;
          box-shadow: 0 0 14px rgba(0, 210, 255, 0.25);
        }

        .presets-row {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 8px;
        }

        .presets-label {
          font-size: 11px;
          color: #94A3B8;
          font-weight: 700;
        }

        .preset-chip {
          background: #111C2D;
          border: 1px solid rgba(203, 213, 225, 0.12);
          border-radius: 4px;
          padding: 3px 8px;
          font-size: 11px;
          color: #CBD5E1;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .preset-chip:hover {
          background: rgba(0, 210, 255, 0.15);
          color: #00D2FF;
        }

        .preset-chip.selected {
          background: #0046FC;
          color: #FFFFFF;
          border-color: #0046FC;
        }

        .image-preview-bar {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-top: 10px;
          padding: 8px 12px;
          background: #060B12;
          border: 1px solid rgba(203, 213, 225, 0.12);
          border-radius: 8px;
        }

        .image-preview-bar img {
          width: 70px;
          height: 48px;
          object-fit: cover;
          border-radius: 4px;
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .preview-info {
          flex: 1;
        }

        .preview-info strong {
          display: block;
          font-size: 12px;
          color: #FFFFFF;
        }

        .preview-info small {
          font-size: 11px;
          color: #94A3B8;
        }

        .remove-img-btn {
          background: transparent;
          border: 1px solid rgba(225, 29, 72, 0.3);
          color: #FECDD3;
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
        }

        .remove-img-btn:hover {
          background: rgba(225, 29, 72, 0.25);
          color: #FFFFFF;
        }

        .modal-footer {
          grid-column: 1 / -1;
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 12px;
          padding-top: 18px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .btn-cancel {
          padding: 10px 18px;
          border-radius: 8px;
          background: #111C2D;
          border: 1px solid rgba(203, 213, 225, 0.16);
          color: #D5DBE7;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-cancel:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #FFFFFF;
        }

        .btn-save {
          padding: 10px 22px;
          border-radius: 8px;
          background: #0046FC;
          border: none;
          color: #FFFFFF;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 70, 252, 0.35);
        }

        .btn-save:hover {
          background: #0038D1;
        }

        @media (max-width: 640px) {
          .showcase-form {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};

export default LatestPopularManager;

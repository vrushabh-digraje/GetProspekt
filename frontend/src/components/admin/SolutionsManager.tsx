import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  solutionsStorageApi,
  type SolutionData,
  type GatedFormConfig,
} from "../../services/api";
import { ItemFormSettingsModal } from "./ItemFormSettingsModal";

interface SolutionsManagerProps {
  showToast: (msg: string) => void;
}

const PRESET_COVERS = [
  {
    label: "Data & Verification",
    url: "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1200&q=90",
  },
  {
    label: "Demand Generation",
    url: "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=1200&q=90",
  },
  {
    label: "Pipeline & Analytics",
    url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=90",
  },
  {
    label: "Enterprise Closing",
    url: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=90",
  },
  {
    label: "Calendars & Meetings",
    url: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=90",
  },
  {
    label: "Webinar & Virtual Event",
    url: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=90",
  },
];

const SOLUTION_CATEGORIES = [
  "Demand Generation",
  "Sales Pipeline",
  "High Intent",
  "Meeting Booking",
  "Data Verification",
  "Event Marketing",
];

export const SolutionsManager: React.FC<SolutionsManagerProps> = ({ showToast }) => {
  const [solutions, setSolutions] = useState<SolutionData[]>(() => solutionsStorageApi.getAll());
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formCategory, setFormCategory] = useState("Demand Generation");
  const [formTag, setFormTag] = useState("Marketing Qualified");
  const [formBadge, setFormBadge] = useState("Custom ICP Filter");
  const [formSubtitle, setFormSubtitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formDeliverablesText, setFormDeliverablesText] = useState("");
  const [formImage, setFormImage] = useState("");

  // Individual Form Settings Modal State
  const [itemFormSettingsTarget, setItemFormSettingsTarget] = useState<SolutionData | null>(null);
  const [isItemFormSettingsOpen, setIsItemFormSettingsOpen] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      setSolutions(solutionsStorageApi.getAll());
    };
    window.addEventListener("gp_solutions_updated", handleUpdate);
    return () => window.removeEventListener("gp_solutions_updated", handleUpdate);
  }, []);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleTitleChange = (val: string) => {
    setFormTitle(val);
    if (!isEditing) {
      setFormSlug(generateSlug(val));
    }
  };

  const openCreateModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormTitle("");
    setFormSlug("");
    setFormCategory("Demand Generation");
    setFormTag("Marketing Qualified");
    setFormBadge("Custom ICP Filter");
    setFormSubtitle("");
    setFormDescription("");
    setFormDeliverablesText(
      "Verified content syndication engagement & opt-in\nCustom ICP tiering across employee size and revenue\nEnriched firmographic data ready for automated nurture"
    );
    setFormImage(PRESET_COVERS[1].url);
    setIsModalOpen(true);
  };

  const openEditModal = (item: SolutionData) => {
    setIsEditing(true);
    setEditingId(item.id);
    setFormTitle(item.title);
    setFormSlug(item.slug);
    setFormCategory(item.category);
    setFormTag(item.tag || "");
    setFormBadge(item.badge || "");
    setFormSubtitle(item.subtitle || "");
    setFormDescription(item.description || "");
    setFormDeliverablesText((item.deliverables || []).join("\n"));
    setFormImage(item.image || PRESET_COVERS[0].url);
    setIsModalOpen(true);
  };

  const handleSaveSolution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      alert("Please enter a solution title.");
      return;
    }

    const deliverables = formDeliverablesText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const slug = formSlug.trim() || generateSlug(formTitle);

    if (isEditing && editingId) {
      const updated = solutions.map((s) => {
        if (s.id === editingId) {
          return {
            ...s,
            title: formTitle.trim(),
            slug,
            category: formCategory,
            tag: formTag.trim(),
            badge: formBadge.trim(),
            subtitle: formSubtitle.trim(),
            description: formDescription.trim(),
            deliverables,
            image: formImage.trim() || PRESET_COVERS[0].url,
            path: `/article/${slug}`,
          };
        }
        return s;
      });
      solutionsStorageApi.saveAll(updated);
      setSolutions(updated);
      showToast("Solution updated successfully.");
    } else {
      const newSol: SolutionData = {
        id: `sol-${Date.now()}`,
        title: formTitle.trim(),
        slug,
        category: formCategory,
        tag: formTag.trim(),
        badge: formBadge.trim(),
        subtitle: formSubtitle.trim(),
        description: formDescription.trim(),
        deliverables,
        image: formImage.trim() || PRESET_COVERS[0].url,
        path: `/article/${slug}`,
      };
      const updated = [newSol, ...solutions];
      solutionsStorageApi.saveAll(updated);
      setSolutions(updated);
      showToast("New solution added successfully.");
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    const updated = solutions.filter((s) => s.id !== id);
    solutionsStorageApi.saveAll(updated);
    setSolutions(updated);
    showToast(`Deleted "${title}".`);
  };

  const handleResetDefaults = () => {
    if (
      !window.confirm(
        "Reset all solutions to default? Custom solutions will be lost."
      )
    )
      return;
    const defs = solutionsStorageApi.resetDefaults();
    setSolutions(defs);
    showToast("Solutions reset to defaults.");
  };

  // Open Manage Form Modal
  const openFormSettings = (item: SolutionData) => {
    setItemFormSettingsTarget(item);
    setIsItemFormSettingsOpen(true);
  };

  // Save Manage Form Modal
  const handleSaveItemFormConfig = (savedConfig: GatedFormConfig) => {
    if (!itemFormSettingsTarget) return;
    const updated = solutions.map((s) => {
      if (s.id === itemFormSettingsTarget.id) {
        return {
          ...s,
          formConfig: savedConfig,
        };
      }
      return s;
    });
    solutionsStorageApi.saveAll(updated);
    setSolutions(updated);
    showToast(`Form settings saved for "${itemFormSettingsTarget.title}"`);
    setIsItemFormSettingsOpen(false);
    setItemFormSettingsTarget(null);
  };

  // Filter list
  const filteredSolutions = solutions.filter((item) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      item.title.toLowerCase().includes(q) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
      item.category.toLowerCase().includes(q) ||
      (item.tag && item.tag.toLowerCase().includes(q)) ||
      (item.description && item.description.toLowerCase().includes(q));

    const matchesCategory =
      categoryFilter === "All" || item.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="solutions-manager-root">
      {/* HEADER BAR */}
      <div className="sol-mgr-header">
        <div>
          <h2>Solutions Management</h2>
          <p>
            Manage B2B lead generation solutions, deliverables, target criteria,
            and individualized inquiry form settings.
          </p>
        </div>
        <div className="sol-mgr-header-actions">
          <button
            type="button"
            className="btn-sol-reset"
            onClick={handleResetDefaults}
            title="Reset to default solutions"
          >
            ↻ Reset Defaults
          </button>
          <button
            type="button"
            className="btn-sol-create"
            onClick={openCreateModal}
          >
            + Add New Solution
          </button>
        </div>
      </div>

      {/* STATS STRIP */}
      <div className="sol-mgr-stats">
        <div className="sol-stat-card">
          <span className="sol-stat-num">{solutions.length}</span>
          <span className="sol-stat-lbl">Active Solutions</span>
        </div>
        <div className="sol-stat-card">
          <span className="sol-stat-num">
            {new Set(solutions.map((s) => s.category)).size}
          </span>
          <span className="sol-stat-lbl">Categories</span>
        </div>
        <div className="sol-stat-card">
          <span className="sol-stat-num">
            {solutions.filter((s) => Boolean(s.formConfig)).length}
          </span>
          <span className="sol-stat-lbl">Custom Form Overrides</span>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="sol-mgr-filters">
        <div className="sol-search-wrap">
          <span className="sol-search-icon">🔍</span>
          <input
            type="text"
            className="sol-search-input"
            placeholder="Search solutions by title, deliverable, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="sol-search-clear"
              onClick={() => setSearchQuery("")}
            >
              ×
            </button>
          )}
        </div>

        <div className="sol-cat-pills">
          <button
            type="button"
            className={`sol-cat-pill ${categoryFilter === "All" ? "active" : ""}`}
            onClick={() => setCategoryFilter("All")}
          >
            All Solutions ({solutions.length})
          </button>
          {SOLUTION_CATEGORIES.map((cat) => {
            const count = solutions.filter((s) => s.category === cat).length;
            return (
              <button
                key={cat}
                type="button"
                className={`sol-cat-pill ${categoryFilter === cat ? "active" : ""}`}
                onClick={() => setCategoryFilter(cat)}
              >
                {cat} {count > 0 && `(${count})`}
              </button>
            );
          })}
        </div>
      </div>

      {/* SOLUTIONS GRID */}
      <div className="sol-grid">
        {filteredSolutions.length === 0 ? (
          <div className="sol-empty-state">
            <p>No solutions match your search or filter.</p>
            <button
              className="btn-sol-create"
              style={{ marginTop: 12 }}
              onClick={() => {
                setSearchQuery("");
                setCategoryFilter("All");
              }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          filteredSolutions.map((item) => (
            <div className="sol-card" key={item.id}>
              <div className="sol-card-thumb-wrap">
                <img
                  src={item.image}
                  alt={item.title}
                  className="sol-card-thumb"
                  loading="lazy"
                />
                <span className="sol-card-badge">{item.badge || item.category}</span>
                {item.formConfig && (
                  <span className="sol-custom-form-pill" title="Has customized form controls">
                    ⚙ Custom Form
                  </span>
                )}
              </div>

              <div className="sol-card-body">
                <div className="sol-card-meta">
                  <span className="sol-card-cat">{item.category}</span>
                  {item.tag && <span className="sol-card-tag">{item.tag}</span>}
                </div>

                <h3 className="sol-card-title">{item.title}</h3>
                {item.subtitle && (
                  <p className="sol-card-subtitle">{item.subtitle}</p>
                )}
                <p className="sol-card-desc">{item.description}</p>

                {item.deliverables && item.deliverables.length > 0 && (
                  <div className="sol-card-delivs">
                    <strong>Key Deliverables:</strong>
                    <ul>
                      {item.deliverables.map((deliv, idx) => (
                        <li key={idx}>✓ {deliv}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="sol-card-actions">
                <button
                  type="button"
                  className="btn-card-form"
                  onClick={() => openFormSettings(item)}
                  title="Configure inquiry/gated form fields specifically for this solution"
                >
                  ⚙ Manage Form
                </button>
                <div className="sol-card-actions-right">
                  <Link
                    to={item.path || `/article/${item.slug}`}
                    className="btn-card-view"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="View live page"
                  >
                    ↗ View
                  </Link>
                  <button
                    type="button"
                    className="btn-card-edit"
                    onClick={() => openEditModal(item)}
                    title="Edit solution details"
                  >
                    ✎ Edit
                  </button>
                  <button
                    type="button"
                    className="btn-card-delete"
                    onClick={() => handleDelete(item.id, item.title)}
                    title="Delete solution"
                  >
                    🗑
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* CREATE / EDIT SOLUTION MODAL */}
      {isModalOpen && (
        <div className="sol-modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="sol-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="sol-modal-header">
              <div>
                <h2>{isEditing ? "Edit Solution" : "Add New Solution"}</h2>
                <p>
                  Configure solution headline, category, deliverables, and cover image.
                </p>
              </div>
              <button
                type="button"
                className="sol-modal-close"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSolution} className="sol-modal-body">
              <div className="sol-form-row">
                <div className="sol-form-field" style={{ flex: 2 }}>
                  <label>Solution Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MQL Generation"
                    value={formTitle}
                    onChange={(e) => handleTitleChange(e.target.value)}
                  />
                </div>
                <div className="sol-form-field" style={{ flex: 1 }}>
                  <label>URL Slug *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. mql-generation"
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                  />
                </div>
              </div>

              <div className="sol-form-row">
                <div className="sol-form-field">
                  <label>Category *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                  >
                    {SOLUTION_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sol-form-field">
                  <label>Badge Highlight</label>
                  <input
                    type="text"
                    placeholder="e.g. 100% Verified, Custom ICP Filter"
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                  />
                </div>
                <div className="sol-form-field">
                  <label>Pill Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. High Accuracy, Sales Qualified"
                    value={formTag}
                    onChange={(e) => setFormTag(e.target.value)}
                  />
                </div>
              </div>

              <div className="sol-form-field">
                <label>Target Audience / Subtitle</label>
                <input
                  type="text"
                  placeholder="e.g. For Revenue Teams Requiring Accurate Prospect Records"
                  value={formSubtitle}
                  onChange={(e) => setFormSubtitle(e.target.value)}
                />
              </div>

              <div className="sol-form-field">
                <label>Description Overview</label>
                <textarea
                  rows={3}
                  placeholder="Summary of how this solution generates and validates pipeline..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                />
              </div>

              <div className="sol-form-field">
                <label>
                  Key Deliverables <small>(One deliverable bullet per line)</small>
                </label>
                <textarea
                  rows={4}
                  placeholder="Direct phone numbers & verified corporate emails&#10;Active seniority and decision-maker check&#10;100% replacement guarantee"
                  value={formDeliverablesText}
                  onChange={(e) => setFormDeliverablesText(e.target.value)}
                />
              </div>

              <div className="sol-form-field">
                <label>Cover Image URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                />
                <div className="sol-presets-row">
                  <small>Preset Themes:</small>
                  {PRESET_COVERS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      className={`btn-preset ${formImage === preset.url ? "active" : ""}`}
                      onClick={() => setFormImage(preset.url)}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="sol-modal-footer">
                <button
                  type="button"
                  className="btn-modal-cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-modal-save">
                  {isEditing ? "💾 Save Changes" : "➕ Create Solution"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INDIVIDUAL FORM SETTINGS MODAL */}
      {isItemFormSettingsOpen && itemFormSettingsTarget && (
        <ItemFormSettingsModal
          isOpen={isItemFormSettingsOpen}
          onClose={() => {
            setIsItemFormSettingsOpen(false);
            setItemFormSettingsTarget(null);
          }}
          itemTitle={itemFormSettingsTarget.title}
          itemTypeLabel={itemFormSettingsTarget.category || "Solutions"}
          initialConfig={itemFormSettingsTarget.formConfig}
          onSave={handleSaveItemFormConfig}
          showToast={showToast}
        />
      )}

      <style>{`
        /* =========================================
           SOLUTIONS MANAGER STYLES
        ========================================= */
        .solutions-manager-root {
          display: flex;
          flex-direction: column;
          gap: 24px;
          color: #E2E8F0;
        }

        .sol-mgr-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          border-bottom: 1px solid rgba(203, 213, 225, 0.1);
          padding-bottom: 20px;
        }

        .sol-mgr-header h2 {
          font-size: 22px;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0 0 6px 0;
          letter-spacing: -0.02em;
        }

        .sol-mgr-header p {
          font-size: 13.5px;
          color: #94A3B8;
          margin: 0;
        }

        .sol-mgr-header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .btn-sol-reset {
          padding: 9px 16px;
          background: #1E293B;
          border: 1px solid rgba(203, 213, 225, 0.2);
          border-radius: 8px;
          color: #94A3B8;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-sol-reset:hover {
          background: #334155;
          color: #FFFFFF;
        }

        .btn-sol-create {
          padding: 10px 20px;
          background: linear-gradient(135deg, #00D2FF 0%, #0046FC 100%);
          border: none;
          border-radius: 8px;
          color: #FFFFFF;
          font-size: 13.5px;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(0, 70, 252, 0.35);
          transition: all 0.2s ease;
        }

        .btn-sol-create:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(0, 70, 252, 0.5);
        }

        /* STATS STRIP */
        .sol-mgr-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .sol-stat-card {
          background: #0B1220;
          border: 1px solid rgba(203, 213, 225, 0.1);
          border-radius: 12px;
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .sol-stat-num {
          font-size: 26px;
          font-weight: 800;
          color: #00D2FF;
          letter-spacing: -0.02em;
        }

        .sol-stat-lbl {
          font-size: 12px;
          font-weight: 700;
          color: #94A3B8;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* FILTERS & SEARCH */
        .sol-mgr-filters {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .sol-search-wrap {
          position: relative;
          width: 100%;
        }

        .sol-search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 14px;
          opacity: 0.6;
        }

        .sol-search-input {
          width: 100%;
          box-sizing: border-box;
          padding: 12px 40px 12px 42px;
          background: #0B1220;
          border: 1px solid rgba(203, 213, 225, 0.15);
          border-radius: 10px;
          color: #FFFFFF;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
        }

        .sol-search-input:focus {
          border-color: #00D2FF;
        }

        .sol-search-clear {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          color: #94A3B8;
          font-size: 18px;
          cursor: pointer;
        }

        .sol-cat-pills {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .sol-cat-pill {
          padding: 7px 14px;
          background: #0B1220;
          border: 1px solid rgba(203, 213, 225, 0.15);
          border-radius: 20px;
          color: #94A3B8;
          font-size: 12.5px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .sol-cat-pill:hover {
          color: #FFFFFF;
          border-color: rgba(0, 210, 255, 0.4);
        }

        .sol-cat-pill.active {
          background: rgba(0, 210, 255, 0.15);
          border-color: #00D2FF;
          color: #00D2FF;
        }

        /* GRID */
        .sol-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
          gap: 22px;
        }

        .sol-empty-state {
          grid-column: 1 / -1;
          padding: 60px 20px;
          text-align: center;
          background: #0B1220;
          border: 1px dashed rgba(203, 213, 225, 0.2);
          border-radius: 12px;
          color: #94A3B8;
        }

        .sol-card {
          background: #0B1220;
          border: 1px solid rgba(203, 213, 225, 0.12);
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: transform 0.2s ease, border-color 0.2s ease;
        }

        .sol-card:hover {
          transform: translateY(-2px);
          border-color: rgba(0, 210, 255, 0.35);
        }

        .sol-card-thumb-wrap {
          position: relative;
          width: 100%;
          height: 180px;
          background: #060B12;
          overflow: hidden;
        }

        .sol-card-thumb {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .sol-card:hover .sol-card-thumb {
          transform: scale(1.03);
        }

        .sol-card-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          padding: 4px 10px;
          background: rgba(0, 70, 252, 0.85);
          backdrop-filter: blur(8px);
          color: #FFFFFF;
          font-size: 11px;
          font-weight: 800;
          border-radius: 4px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .sol-custom-form-pill {
          position: absolute;
          top: 12px;
          right: 12px;
          padding: 4px 10px;
          background: rgba(0, 212, 170, 0.2);
          border: 1px solid #00D4AA;
          color: #00D4AA;
          font-size: 11px;
          font-weight: 800;
          border-radius: 4px;
          letter-spacing: 0.04em;
          backdrop-filter: blur(8px);
        }

        .sol-card-body {
          padding: 20px;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .sol-card-meta {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .sol-card-cat {
          font-size: 11px;
          font-weight: 800;
          color: #00D2FF;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .sol-card-tag {
          font-size: 11px;
          color: #94A3B8;
          background: rgba(255, 255, 255, 0.05);
          padding: 2px 8px;
          border-radius: 4px;
        }

        .sol-card-title {
          font-size: 18px;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0;
          line-height: 1.3;
        }

        .sol-card-subtitle {
          font-size: 12.5px;
          color: #00D4AA;
          margin: 0;
          font-weight: 600;
        }

        .sol-card-desc {
          font-size: 13px;
          line-height: 1.5;
          color: #94A3B8;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .sol-card-delivs {
          margin-top: 6px;
          padding-top: 12px;
          border-top: 1px solid rgba(203, 213, 225, 0.08);
          font-size: 12px;
        }

        .sol-card-delivs strong {
          color: #CBD5E1;
          display: block;
          margin-bottom: 6px;
        }

        .sol-card-delivs ul {
          margin: 0;
          padding: 0;
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .sol-card-delivs li {
          color: #94A3B8;
        }

        .sol-card-actions {
          padding: 14px 20px;
          background: #080E1A;
          border-top: 1px solid rgba(203, 213, 225, 0.08);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .btn-card-form {
          padding: 7px 12px;
          background: rgba(0, 210, 255, 0.12);
          border: 1px solid rgba(0, 210, 255, 0.35);
          color: #00D2FF;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-card-form:hover {
          background: rgba(0, 210, 255, 0.25);
          border-color: #00D2FF;
        }

        .sol-card-actions-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-card-view {
          padding: 6px 10px;
          background: #1E293B;
          border: 1px solid rgba(203, 213, 225, 0.15);
          color: #CBD5E1;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.2s;
        }

        .btn-card-view:hover {
          color: #FFFFFF;
          background: #334155;
        }

        .btn-card-edit {
          padding: 6px 12px;
          background: #1E293B;
          border: 1px solid rgba(203, 213, 225, 0.15);
          color: #FFFFFF;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-card-edit:hover {
          background: #0046FC;
          border-color: #0046FC;
        }

        .btn-card-delete {
          padding: 6px 10px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.25);
          color: #EF4444;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-card-delete:hover {
          background: #EF4444;
          color: #FFFFFF;
        }

        /* MODAL STYLES */
        .sol-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(4, 8, 16, 0.85);
          backdrop-filter: blur(8px);
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .sol-modal-box {
          background: #0B1220;
          border: 1px solid rgba(0, 210, 255, 0.35);
          border-radius: 14px;
          width: min(720px, 100%);
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
          display: flex;
          flex-direction: column;
        }

        .sol-modal-header {
          padding: 20px 24px;
          border-bottom: 1px solid rgba(203, 213, 225, 0.1);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .sol-modal-header h2 {
          font-size: 18px;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0 0 4px 0;
        }

        .sol-modal-header p {
          font-size: 12.5px;
          color: #94A3B8;
          margin: 0;
        }

        .sol-modal-close {
          background: #1E293B;
          border: 1px solid rgba(203, 213, 225, 0.2);
          color: #94A3B8;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          font-size: 15px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sol-modal-close:hover {
          color: #EF4444;
          background: rgba(239, 68, 68, 0.15);
        }

        .sol-modal-body {
          padding: 22px 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .sol-form-row {
          display: flex;
          gap: 14px;
        }

        .sol-form-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
        }

        .sol-form-field label {
          font-size: 11.5px;
          font-weight: 800;
          color: #94A3B8;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .sol-form-field input,
        .sol-form-field select,
        .sol-form-field textarea {
          padding: 10px 14px;
          background: #060B12;
          border: 1px solid rgba(203, 213, 225, 0.18);
          border-radius: 8px;
          color: #FFFFFF;
          font-size: 13.5px;
          outline: none;
          transition: border-color 0.2s;
        }

        .sol-form-field input:focus,
        .sol-form-field select:focus,
        .sol-form-field textarea:focus {
          border-color: #00D2FF;
        }

        .sol-presets-row {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
          margin-top: 6px;
        }

        .sol-presets-row small {
          color: #64748B;
          font-size: 11px;
          font-weight: 700;
        }

        .btn-preset {
          padding: 4px 8px;
          background: #1E293B;
          border: 1px solid rgba(203, 213, 225, 0.15);
          color: #94A3B8;
          font-size: 11px;
          border-radius: 4px;
          cursor: pointer;
        }

        .btn-preset.active {
          border-color: #00D2FF;
          color: #00D2FF;
          background: rgba(0, 210, 255, 0.1);
        }

        .sol-modal-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
          padding-top: 12px;
          border-top: 1px solid rgba(203, 213, 225, 0.1);
        }

        .btn-modal-cancel {
          padding: 10px 18px;
          background: #1E293B;
          border: 1px solid rgba(203, 213, 225, 0.2);
          border-radius: 8px;
          color: #CBD5E1;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
        }

        .btn-modal-save {
          padding: 10px 22px;
          background: linear-gradient(135deg, #00D2FF, #0046FC);
          border: none;
          border-radius: 8px;
          color: #FFFFFF;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(0, 70, 252, 0.4);
        }
      `}</style>
    </div>
  );
};

export default SolutionsManager;

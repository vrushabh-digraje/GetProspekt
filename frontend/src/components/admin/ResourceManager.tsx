import React, { useState } from "react";
import { Link } from "react-router-dom";
import { resourcesApi } from "../../services/api";
import { downloadPdfDocument } from "../../utils/pdfGenerator";

export interface ResourceItem {
  _id: string;
  title: string;
  type: string;
  category: string;
  coverImage?: string;
  summary?: string;
  content?: string;
  fileUrl?: string;
  downloadCount?: number;
  status?: string;
  createdAt?: string;
}

interface ResourceManagerProps {
  resources: ResourceItem[];
  onResourcesChange: (updated: ResourceItem[]) => void;
  showToast: (msg: string) => void;
}

const PRESET_COVERS = [
  { label: "Data & AI", url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=85" },
  { label: "Analytics", url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=85" },
  { label: "Cloud", url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=85" },
  { label: "Security", url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=85" },
  { label: "Sales Cadence", url: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=800&q=85" },
  { label: "Hardware", url: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=85" },
];

const RESOURCE_TYPES = [
  "Buyer Insights",
  "Whitepaper",
  "Playbook",
  "Industry Report",
];

const CATEGORIES = [
  "Enterprise Technology",
  "AI & Decision Intelligence",
  "Cloud & Infrastructure",
  "B2B Technology",
  "Cybersecurity",
  "Sales Development",
  "Marketing Operations",
];

export const ResourceManager: React.FC<ResourceManagerProps> = ({
  resources,
  onResourcesChange,
  showToast,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState("All");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("All");

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState("");
  const [formType, setFormType] = useState("Whitepaper");
  const [formCategory, setFormCategory] = useState("Enterprise Technology");
  const [formSummary, setFormSummary] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formCoverImage, setFormCoverImage] = useState("");
  const [saving, setSaving] = useState(false);

  // Stats
  const totalResources = resources.length;
  const totalDownloads = resources.reduce((acc, r) => acc + (r.downloadCount || 0), 0);
  const buyerInsightsCount = resources.filter((r) =>
    (r.type || "").toLowerCase().includes("buyer")
  ).length;
  const whitepapersCount = resources.filter((r) =>
    (r.type || "").toLowerCase().includes("whitepaper")
  ).length;

  // Filtered List
  const filteredResources = resources.filter((item) => {
    const matchesSearch =
      !searchQuery.trim() ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.summary || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.category || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      selectedTypeFilter === "All" ||
      (item.type || "").toLowerCase().includes(selectedTypeFilter.toLowerCase());

    const matchesCategory =
      selectedCategoryFilter === "All" || item.category === selectedCategoryFilter;

    return matchesSearch && matchesType && matchesCategory;
  });

  const openCreateModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormTitle("");
    setFormType("Whitepaper");
    setFormCategory("Enterprise Technology");
    setFormSummary("");
    setFormContent("");
    setFormCoverImage(PRESET_COVERS[0].url);
    setIsModalOpen(true);
  };

  const openEditModal = (item: ResourceItem) => {
    setIsEditing(true);
    setEditingId(item._id);
    setFormTitle(item.title);
    setFormType(item.type || "Whitepaper");
    setFormCategory(item.category || "Enterprise Technology");
    setFormSummary(item.summary || "");
    setFormContent(item.content || "");
    setFormCoverImage(
      item.coverImage ||
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=85"
    );
    setIsModalOpen(true);
  };

  const handleSaveResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      alert("Please enter a title for the resource.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: formTitle.trim(),
        type: formType,
        category: formCategory,
        summary: formSummary.trim(),
        content:
          formContent.trim() ||
          formSummary.trim() ||
          "Executive research publication overview and tactical strategic implementation guide.",
        coverImage:
          formCoverImage.trim() ||
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=85",
        fileUrl: "/sample-whitepaper.pdf",
        status: "Published",
      };

      if (isEditing && editingId) {
        await resourcesApi.update(editingId, payload);
        const updated = resources.map((r) =>
          r._id === editingId ? { ...r, ...payload } : r
        );
        onResourcesChange(updated);
        showToast("Resource updated successfully!");
      } else {
        const created = await resourcesApi.create(payload);
        onResourcesChange([created, ...resources]);
        showToast("New resource created and published!");
      }

      setIsModalOpen(false);
    } catch (err: any) {
      alert("Failed to save resource: " + (err.message || "Unknown error"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      await resourcesApi.delete(id);
      const remaining = resources.filter((r) => r._id !== id);
      onResourcesChange(remaining);
      showToast("Resource deleted successfully.");
    } catch (err: any) {
      alert("Failed to delete resource: " + (err.message || "Unknown error"));
    }
  };

  const handleDownloadPDF = (resource: ResourceItem) => {
    downloadPdfDocument({
      title: resource.title,
      type: resource.type,
      category: resource.category,
      summary: resource.summary,
      content: resource.content,
      coverImage: resource.coverImage,
    });
    showToast(`Downloading PDF for "${resource.title}"...`);
  };

  const getTypeBadgeClass = (type: string) => {
    const t = (type || "").toLowerCase();
    if (t.includes("buyer")) return "type-buyer";
    if (t.includes("whitepaper")) return "type-whitepaper";
    if (t.includes("playbook")) return "type-playbook";
    if (t.includes("report")) return "type-report";
    return "type-default";
  };

  return (
    <section className="res-manager">
      {/* Top Banner / Metrics */}
      <div className="res-manager-header">
        <div className="res-header-info">
          <div className="res-tag-label">
            <span className="res-dot" /> RESOURCE CONTENT MANAGEMENT
          </div>
          <h2>Resources & Intelligence Hub</h2>
          <p>
            Create, update, and manage all download materials including Whitepapers,
            Playbooks, Buyer Insights, and Industry Reports.
          </p>
        </div>

        <button className="res-create-btn" onClick={openCreateModal}>
          <span className="res-btn-icon">+</span> Add New Resource
        </button>
      </div>

      {/* KPI Stats Bar */}
      <div className="res-kpi-bar">
        <div className="res-kpi-card">
          <span className="kpi-label">Total Resources</span>
          <strong className="kpi-value">{totalResources}</strong>
          <small className="kpi-sub">Active in library</small>
        </div>
        <div className="res-kpi-card">
          <span className="kpi-label">Total Downloads</span>
          <strong className="kpi-value text-cyan">{totalDownloads.toLocaleString()}</strong>
          <small className="kpi-sub">Direct PDF downloads</small>
        </div>
        <div className="res-kpi-card">
          <span className="kpi-label">Buyer Insights</span>
          <strong className="kpi-value text-blue">{buyerInsightsCount}</strong>
          <small className="kpi-sub">High-intent assets</small>
        </div>
        <div className="res-kpi-card">
          <span className="kpi-label">Whitepapers & Reports</span>
          <strong className="kpi-value text-emerald">{whitepapersCount}</strong>
          <small className="kpi-sub">Executive deep-dives</small>
        </div>
      </div>

      {/* Interactive Controls: Search & Filters */}
      <div className="res-controls-panel">
        <div className="res-search-wrap">
          <span className="res-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search resources by title, topic, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="res-search-input"
          />
          {searchQuery && (
            <button
              className="res-clear-search"
              onClick={() => setSearchQuery("")}
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        <div className="res-filter-row">
          <div className="res-type-pills">
            {["All", "Buyer Insights", "Whitepaper", "Playbook", "Industry Report"].map(
              (filterType) => (
                <button
                  key={filterType}
                  className={`res-pill ${
                    selectedTypeFilter === filterType ? "active" : ""
                  }`}
                  onClick={() => setSelectedTypeFilter(filterType)}
                >
                  {filterType}
                </button>
              )
            )}
          </div>

          <div className="res-category-select-wrap">
            <label htmlFor="cat-filter">Category:</label>
            <select
              id="cat-filter"
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="res-cat-dropdown"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Resource Count Indicator */}
      <div className="res-results-meta">
        <span>
          Showing <strong>{filteredResources.length}</strong> of{" "}
          <strong>{resources.length}</strong> resources
        </span>
        {(searchQuery || selectedTypeFilter !== "All" || selectedCategoryFilter !== "All") && (
          <button
            className="res-reset-filter-btn"
            onClick={() => {
              setSearchQuery("");
              setSelectedTypeFilter("All");
              setSelectedCategoryFilter("All");
            }}
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Resources Cards Grid */}
      {filteredResources.length === 0 ? (
        <div className="res-empty-state">
          <div className="res-empty-icon">📂</div>
          <h3>No resources match your filters</h3>
          <p>Try searching for a different keyword or create a new resource.</p>
          <button className="res-create-btn" onClick={openCreateModal}>
            + Create New Resource
          </button>
        </div>
      ) : (
        <div className="res-grid">
          {filteredResources.map((item) => (
            <div className="res-card" key={item._id}>
              {/* Card Image Thumbnail */}
              <div className="res-card-image-wrap">
                <img
                  src={
                    item.coverImage ||
                    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=85"
                  }
                  alt={item.title}
                  className="res-card-thumb"
                  loading="lazy"
                />
                <span className={`res-badge ${getTypeBadgeClass(item.type)}`}>
                  {item.type || "Resource"}
                </span>
                <span className="res-status-tag">Published</span>
              </div>

              {/* Card Body */}
              <div className="res-card-body">
                <span className="res-category-tag">{item.category}</span>
                <h3 className="res-card-title" title={item.title}>
                  {item.title}
                </h3>
                <p className="res-card-summary">
                  {item.summary || "No summary provided."}
                </p>

                {/* Card Meta */}
                <div className="res-card-meta">
                  <span className="res-downloads-count">
                    📥 <strong>{item.downloadCount || 0}</strong> downloads
                  </span>
                  <span className="res-format-pill">PDF Document</span>
                </div>

                {/* Card Actions */}
                <div className="res-card-actions">
                  <Link
                    to={`/resources/view/${item._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="res-action-btn btn-view"
                    title="View public live page in a new tab"
                  >
                    👁️ View Page ↗
                  </Link>

                  <button
                    onClick={() => handleDownloadPDF(item)}
                    className="res-action-btn btn-pdf"
                    title="Download generated PDF file directly"
                  >
                    📥 PDF
                  </button>

                  <button
                    onClick={() => openEditModal(item)}
                    className="res-action-btn btn-edit"
                    title="Edit resource details"
                  >
                    ✎ Edit
                  </button>

                  <button
                    onClick={() => handleDelete(item._id, item.title)}
                    className="res-action-btn btn-delete"
                    title="Delete resource permanently"
                  >
                    🗑
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT RESOURCE ================= */}
      {isModalOpen && (
        <div className="res-modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="res-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="res-modal-header">
              <div>
                <span className="res-modal-kicker">
                  {isEditing ? "UPDATE EXISTING CONTENT" : "CREATE NEW CONTENT"}
                </span>
                <h2>{isEditing ? "Edit Resource" : "Add New Resource"}</h2>
                <p>
                  Manage publication details, document type, summary, and download assets.
                </p>
              </div>
              <button
                className="res-modal-close-btn"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveResource} className="res-modal-form">
              <div className="res-form-grid">
                {/* Title */}
                <div className="res-form-field full-width">
                  <label htmlFor="res-title">
                    Resource Title <span className="req">*</span>
                  </label>
                  <input
                    id="res-title"
                    type="text"
                    required
                    placeholder="e.g. 2026 Enterprise Pipeline Benchmark Report"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                  />
                </div>

                {/* Type */}
                <div className="res-form-field">
                  <label htmlFor="res-type">Resource Type</label>
                  <select
                    id="res-type"
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                  >
                    {RESOURCE_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category */}
                <div className="res-form-field">
                  <label htmlFor="res-category">Industry / Category</label>
                  <select
                    id="res-category"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Cover Image with Upload Button from System */}
                <div className="res-form-field full-width">
                  <label htmlFor="res-image">Cover Image</label>
                  <div className="res-image-input-row">
                    <input
                      id="res-image"
                      type="url"
                      placeholder="Paste image URL (e.g. https://images.unsplash.com/...)"
                      value={formCoverImage}
                      onChange={(e) => setFormCoverImage(e.target.value)}
                      className="res-image-url-input"
                    />
                    <span className="res-or-divider">OR</span>
                    <label className="res-upload-system-btn" title="Upload image from your computer">
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
                              const result = reader.result as string;
                              setFormCoverImage(result);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>

                  {/* Preset Image Quick Selector */}
                  <div className="res-presets-row">
                    <span className="res-presets-label">Or Pick a Preset:</span>
                    {PRESET_COVERS.map((preset) => (
                      <button
                        type="button"
                        key={preset.label}
                        className={`res-preset-chip ${
                          formCoverImage === preset.url ? "selected" : ""
                        }`}
                        onClick={() => setFormCoverImage(preset.url)}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>

                  {/* Image Preview Box */}
                  {formCoverImage && (
                    <div className="res-image-preview-box">
                      <img
                        src={formCoverImage}
                        alt="Preview"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=85";
                        }}
                      />
                      <div className="res-preview-text">
                        <strong>Cover Image Selected</strong>
                        <small>
                          {formCoverImage.startsWith("data:")
                            ? "Custom image uploaded from your computer."
                            : "Web image URL selected."}
                        </small>
                      </div>
                      <button
                        type="button"
                        className="res-remove-img-btn"
                        onClick={() => setFormCoverImage("")}
                        title="Remove image"
                      >
                        ✕ Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* Summary */}
                <div className="res-form-field full-width">
                  <label htmlFor="res-summary">
                    Short Summary / Card Description <span className="req">*</span>
                  </label>
                  <textarea
                    id="res-summary"
                    rows={3}
                    required
                    placeholder="Brief 1-2 sentence overview visible on the resources card grid..."
                    value={formSummary}
                    onChange={(e) => setFormSummary(e.target.value)}
                  />
                </div>

                {/* Detailed Description */}
                <div className="res-form-field full-width">
                  <label htmlFor="res-content">
                    Detailed Description
                  </label>
                  <textarea
                    id="res-content"
                    rows={5}
                    placeholder="Enter detailed description, key highlights, target audience, and methodology..."
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="res-modal-footer">
                <button
                  type="button"
                  className="res-cancel-btn"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="res-submit-btn"
                >
                  {saving
                    ? "Saving..."
                    : isEditing
                    ? "Save Changes"
                    : "Publish Resource"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Scoped CSS Styles for Resource Management */}
      <style>{`
        .res-manager {
          display: flex;
          flex-direction: column;
          gap: 20px;
          color: #D5DBE7;
          width: 100%;
        }

        .res-manager-header {
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

        .res-header-info {
          max-width: 680px;
        }

        .res-tag-label {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.8px;
          color: #00D2FF;
          margin-bottom: 8px;
        }

        .res-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #00D2FF;
          box-shadow: 0 0 8px #00D2FF;
        }

        .res-header-info h2 {
          font-size: 24px;
          font-family: var(--font-serif);
          color: #FFFFFF;
          margin: 0 0 6px;
        }

        .res-header-info p {
          color: #94A3B8;
          font-size: 14px;
          line-height: 1.5;
          margin: 0;
        }

        .res-create-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #0046FC;
          color: #FFFFFF;
          border: none;
          padding: 12px 22px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 14px rgba(0, 70, 252, 0.35);
        }

        .res-create-btn:hover {
          background: #0038D1;
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(0, 70, 252, 0.45);
        }

        .res-btn-icon {
          font-size: 18px;
          line-height: 1;
        }

        /* KPI Stats Bar */
        .res-kpi-bar {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .res-kpi-card {
          background: #0D1522;
          border: 1px solid rgba(203, 213, 225, 0.12);
          border-radius: 10px;
          padding: 18px 20px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .kpi-label {
          font-size: 12px;
          font-weight: 700;
          color: #94A3B8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .kpi-value {
          font-size: 28px;
          font-weight: 800;
          color: #FFFFFF;
        }

        .text-cyan { color: #00D2FF; }
        .text-blue { color: #38BDF8; }
        .text-emerald { color: #34D399; }

        .kpi-sub {
          font-size: 11px;
          color: #64748B;
        }

        /* Controls Panel */
        .res-controls-panel {
          background: #0D1522;
          border: 1px solid rgba(203, 213, 225, 0.12);
          border-radius: 10px;
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .res-search-wrap {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
        }

        .res-search-icon {
          position: absolute;
          left: 14px;
          font-size: 14px;
          color: #64748B;
          pointer-events: none;
        }

        .res-search-input {
          width: 100%;
          padding: 11px 40px 11px 40px;
          background: #060B12;
          border: 1px solid rgba(203, 213, 225, 0.16);
          border-radius: 8px;
          color: #FFFFFF;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .res-search-input:focus {
          border-color: #00D2FF;
          box-shadow: 0 0 0 3px rgba(0, 210, 255, 0.15);
        }

        .res-clear-search {
          position: absolute;
          right: 14px;
          background: transparent;
          border: none;
          color: #94A3B8;
          cursor: pointer;
          font-size: 14px;
        }

        .res-filter-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }

        .res-type-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .res-pill {
          padding: 7px 14px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 700;
          background: #111C2D;
          color: #94A3B8;
          border: 1px solid rgba(203, 213, 225, 0.12);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .res-pill:hover {
          color: #FFFFFF;
          border-color: rgba(203, 213, 225, 0.25);
        }

        .res-pill.active {
          background: #0046FC;
          color: #FFFFFF;
          border-color: #0046FC;
          box-shadow: 0 2px 8px rgba(0, 70, 252, 0.3);
        }

        .res-category-select-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 700;
          color: #94A3B8;
        }

        .res-cat-dropdown {
          background: #060B12;
          color: #FFFFFF;
          border: 1px solid rgba(203, 213, 225, 0.16);
          border-radius: 6px;
          padding: 6px 12px;
          font-size: 12px;
          outline: none;
          cursor: pointer;
        }

        /* Results Meta */
        .res-results-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 13px;
          color: #94A3B8;
          padding: 0 4px;
        }

        .res-results-meta strong {
          color: #FFFFFF;
        }

        .res-reset-filter-btn {
          background: transparent;
          border: none;
          color: #00D2FF;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .res-reset-filter-btn:hover {
          text-decoration: underline;
        }

        /* Grid */
        .res-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
        }

        .res-card {
          background: #0D1522;
          border: 1px solid rgba(203, 213, 225, 0.12);
          border-radius: 10px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .res-card:hover {
          transform: translateY(-3px);
          border-color: rgba(0, 210, 255, 0.35);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
        }

        .res-card-image-wrap {
          position: relative;
          height: 160px;
          overflow: hidden;
          background: #111C2D;
        }

        .res-card-thumb {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .res-card:hover .res-card-thumb {
          transform: scale(1.05);
        }

        .res-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          font-size: 11px;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 6px;
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }

        .type-buyer {
          background: rgba(0, 210, 255, 0.9);
          color: #060B12;
        }

        .type-whitepaper {
          background: rgba(139, 92, 246, 0.9);
          color: #FFFFFF;
        }

        .type-playbook {
          background: rgba(16, 185, 129, 0.9);
          color: #FFFFFF;
        }

        .type-report {
          background: rgba(245, 158, 11, 0.9);
          color: #060B12;
        }

        .type-default {
          background: rgba(59, 130, 246, 0.9);
          color: #FFFFFF;
        }

        .res-status-tag {
          position: absolute;
          top: 12px;
          right: 12px;
          font-size: 10px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 12px;
          background: rgba(16, 185, 129, 0.2);
          border: 1px solid rgba(16, 185, 129, 0.5);
          color: #34D399;
          backdrop-filter: blur(4px);
        }

        .res-card-body {
          padding: 18px 20px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .res-category-tag {
          font-size: 11px;
          font-weight: 800;
          color: #00D2FF;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 6px;
        }

        .res-card-title {
          font-size: 17px;
          font-weight: 700;
          color: #FFFFFF;
          line-height: 1.35;
          margin: 0 0 10px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          font-family: var(--font-serif);
        }

        .res-card-summary {
          font-size: 13px;
          color: #94A3B8;
          line-height: 1.5;
          margin: 0 0 16px;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          flex: 1;
        }

        .res-card-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          font-size: 12px;
          color: #94A3B8;
          margin-bottom: 12px;
        }

        .res-downloads-count strong {
          color: #00D2FF;
        }

        .res-format-pill {
          background: rgba(255, 255, 255, 0.06);
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 700;
          color: #CBD5E1;
        }

        /* Card Actions */
        .res-card-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .res-action-btn {
          padding: 7px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: all 0.15s ease;
          border: 1px solid transparent;
        }

        .btn-view {
          background: #111C2D;
          color: #00D2FF;
          border-color: rgba(0, 210, 255, 0.25);
          flex: 1;
          justify-content: center;
        }

        .btn-view:hover {
          background: rgba(0, 210, 255, 0.15);
          border-color: #00D2FF;
        }

        .btn-pdf {
          background: #111C2D;
          color: #E2E8F0;
          border-color: rgba(203, 213, 225, 0.16);
        }

        .btn-pdf:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #FFFFFF;
        }

        .btn-edit {
          background: #111C2D;
          color: #E2E8F0;
          border-color: rgba(203, 213, 225, 0.16);
        }

        .btn-edit:hover {
          background: #0046FC;
          color: #FFFFFF;
          border-color: #0046FC;
        }

        .btn-delete {
          background: rgba(225, 29, 72, 0.1);
          color: #FECDD3;
          border-color: rgba(225, 29, 72, 0.25);
        }

        .btn-delete:hover {
          background: rgba(225, 29, 72, 0.25);
          border-color: #FDA4AF;
          color: #FFFFFF;
        }

        /* Empty State */
        .res-empty-state {
          background: #0D1522;
          border: 1px solid rgba(203, 213, 225, 0.12);
          border-radius: 10px;
          padding: 50px 20px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .res-empty-icon {
          font-size: 42px;
        }

        .res-empty-state h3 {
          font-size: 18px;
          color: #FFFFFF;
          margin: 0;
        }

        .res-empty-state p {
          color: #94A3B8;
          font-size: 14px;
          margin: 0 0 8px;
        }

        /* ================= MODAL ================= */
        .res-modal-backdrop {
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

        .res-modal-box {
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

        .res-modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding-bottom: 18px;
          margin-bottom: 20px;
        }

        .res-modal-kicker {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.6px;
          color: #00D2FF;
          display: block;
          margin-bottom: 4px;
        }

        .res-modal-header h2 {
          font-size: 22px;
          font-family: var(--font-serif);
          color: #FFFFFF;
          margin: 0 0 4px;
        }

        .res-modal-header p {
          color: #94A3B8;
          font-size: 13px;
          margin: 0;
        }

        .res-modal-close-btn {
          background: transparent;
          border: none;
          color: #94A3B8;
          font-size: 20px;
          cursor: pointer;
          padding: 4px;
          line-height: 1;
        }

        .res-modal-close-btn:hover {
          color: #FFFFFF;
        }

        .res-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .res-form-field.full-width {
          grid-column: 1 / -1;
        }

        .res-form-field label {
          display: block;
          font-size: 12px;
          font-weight: 700;
          color: #D5DBE7;
          margin-bottom: 6px;
        }

        .res-form-field label .req {
          color: #F43F5E;
        }

        .res-form-field input,
        .res-form-field select,
        .res-form-field textarea {
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

        .res-form-field input:focus,
        .res-form-field select:focus,
        .res-form-field textarea:focus {
          border-color: #00D2FF;
          box-shadow: 0 0 0 3px rgba(0, 210, 255, 0.12);
        }

        .res-image-input-row {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
        }

        .res-image-url-input {
          flex: 1;
        }

        .res-or-divider {
          font-size: 11px;
          font-weight: 800;
          color: #94A3B8;
          flex-shrink: 0;
        }

        .res-upload-system-btn {
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

        .res-upload-system-btn:hover {
          background: rgba(0, 210, 255, 0.15);
          border-color: #00D2FF;
          color: #FFFFFF;
          box-shadow: 0 0 14px rgba(0, 210, 255, 0.25);
        }

        .res-preview-text {
          flex: 1;
        }

        .res-remove-img-btn {
          background: transparent;
          border: 1px solid rgba(225, 29, 72, 0.3);
          color: #FECDD3;
          padding: 5px 12px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .res-remove-img-btn:hover {
          background: rgba(225, 29, 72, 0.25);
          color: #FFFFFF;
        }

        .res-presets-row {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 8px;
        }

        .res-presets-label {
          font-size: 11px;
          color: #94A3B8;
          font-weight: 700;
        }

        .res-preset-chip {
          background: #111C2D;
          border: 1px solid rgba(203, 213, 225, 0.12);
          border-radius: 4px;
          padding: 3px 8px;
          font-size: 11px;
          color: #CBD5E1;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .res-preset-chip:hover {
          background: rgba(0, 210, 255, 0.15);
          color: #00D2FF;
        }

        .res-preset-chip.selected {
          background: #0046FC;
          color: #FFFFFF;
          border-color: #0046FC;
        }

        .res-image-preview-box {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-top: 10px;
          padding: 8px 12px;
          background: #060B12;
          border: 1px solid rgba(203, 213, 225, 0.12);
          border-radius: 8px;
        }

        .res-image-preview-box img {
          width: 70px;
          height: 48px;
          object-fit: cover;
          border-radius: 4px;
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .res-image-preview-box strong {
          display: block;
          font-size: 12px;
          color: #FFFFFF;
        }

        .res-image-preview-box small {
          font-size: 11px;
          color: #94A3B8;
        }

        .res-field-hint {
          display: block;
          font-size: 11px;
          color: #64748B;
          margin-top: 5px;
        }

        .res-modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 24px;
          padding-top: 18px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .res-cancel-btn {
          padding: 10px 18px;
          border-radius: 8px;
          background: #111C2D;
          border: 1px solid rgba(203, 213, 225, 0.16);
          color: #D5DBE7;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }

        .res-cancel-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #FFFFFF;
        }

        .res-submit-btn {
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

        .res-submit-btn:hover:not(:disabled) {
          background: #0038D1;
        }

        .res-submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 640px) {
          .res-form-grid {
            grid-template-columns: 1fr;
          }
          .res-kpi-bar {
            grid-template-columns: 1fr 1fr;
          }
          .res-filter-row {
            flex-direction: column;
            align-items: stretch;
          }
          .res-category-select-wrap {
            justify-content: space-between;
          }
        }
      `}</style>
    </section>
  );
};

export default ResourceManager;

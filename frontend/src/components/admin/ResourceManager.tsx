import React, { useState } from "react";
import { Link } from "react-router-dom";
import { resourcesApi, type GatedFormConfig } from "../../services/api";
import { downloadResourceAsset } from "../../utils/pdfGenerator";
import ItemFormSettingsModal from "./ItemFormSettingsModal";

export interface ResourceItem {
  _id: string;
  title: string;
  type: string;
  category: string;
  coverImage?: string;
  summary?: string;
  content?: string;
  downloadContent?: string;
  fileUrl?: string;
  downloadFileName?: string;
  downloadFileType?: string;
  downloadCount?: number;
  formatBadgeText?: string;
  accessBadgeText?: string;
  showCategoryBadge?: boolean;
  showFormatBadge?: boolean;
  showAccessBadge?: boolean;
  showDownloadCount?: boolean;
  status?: string;
  createdAt?: string;
  formConfig?: GatedFormConfig;
}

interface ResourceManagerProps {
  resources: ResourceItem[];
  onResourcesChange: (updated: ResourceItem[]) => void;
  showToast: (msg: string) => void;
  mode?: "all" | "research" | "resources";
  title?: string;
  subtitle?: string;
}

const PRESET_COVERS = [
  { label: "Tech Rotation", url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=85" },
  { label: "PC as a Service", url: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800&q=85" },
  { label: "Enterprise Systems", url: "https://images.unsplash.com/photo-1597852074816-d933c4d2b988?auto=format&fit=crop&w=800&q=85" },
  { label: "Unified Workspace", url: "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=800&q=85" },
  { label: "Pipeline Benchmark", url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=85" },
  { label: "Outbound Playbook", url: "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=800&q=85" },
];

const RESEARCH_TYPES = [
  "Industry Report",
  "Enterprise Technology Trends",
  "Buyer Insights",
];

const RESOURCE_TYPES = [
  "Whitepaper",
  "Playbook",
  "Guide",
  "Buyer Insights",
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
  "ABM & Demand Generation",
  "Revenue Operations",
];

export const ResourceManager: React.FC<ResourceManagerProps> = ({
  resources,
  onResourcesChange,
  showToast,
  mode = "all",
  title,
  subtitle,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState("All");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("All");

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Individual Form Settings Modal State
  const [itemFormSettingsTarget, setItemFormSettingsTarget] = useState<ResourceItem | null>(null);
  const [isItemFormSettingsOpen, setIsItemFormSettingsOpen] = useState(false);
  const [itemFormInitialAction, setItemFormInitialAction] = useState<"checkbox" | null>(null);
  const [formCustomConfig, setFormCustomConfig] = useState<GatedFormConfig | null>(null);
  const [isModalFormSettingsOpen, setIsModalFormSettingsOpen] = useState(false);
  const [modalFormInitialAction, setModalFormInitialAction] = useState<"checkbox" | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState("");
  const [formType, setFormType] = useState("Whitepaper");
  const [formCategory, setFormCategory] = useState("Enterprise Technology");
  const [formSummary, setFormSummary] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formDownloadContent, setFormDownloadContent] = useState("");
  const [formCoverImage, setFormCoverImage] = useState("");
  const [formFileUrl, setFormFileUrl] = useState("");
  const [formDownloadFileName, setFormDownloadFileName] = useState("");
  const [formDownloadFileType, setFormDownloadFileType] = useState<string>("auto-pdf");

  // Metadata Bar Fields (for the 4 badges under the Resource Detail title)
  const [formDownloadCount, setFormDownloadCount] = useState<number>(0);
  const [formFormatBadgeText, setFormFormatBadgeText] = useState<string>("");
  const [formAccessBadgeText, setFormAccessBadgeText] = useState<string>("Enterprise Research");
  const [formShowCategoryBadge, setFormShowCategoryBadge] = useState<boolean>(true);
  const [formShowFormatBadge, setFormShowFormatBadge] = useState<boolean>(true);
  const [formShowAccessBadge, setFormShowAccessBadge] = useState<boolean>(true);
  const [formShowDownloadCount, setFormShowDownloadCount] = useState<boolean>(true);

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

  // Allowed pill types based on mode
  const allowedPillTypes =
    mode === "research"
      ? ["All", "Industry Report", "Enterprise Technology Trends", "Buyer Insights"]
      : mode === "resources"
      ? ["All", "Whitepaper", "Playbook", "Guide"]
      : ["All", "Buyer Insights", "Whitepaper", "Playbook", "Industry Report"];

  // Filtered List
  const basePool = resources.filter((item) => {
    if (mode === "research") {
      const t = (item.type || "").toLowerCase();
      return (
        t.includes("report") ||
        t.includes("insight") ||
        t.includes("trend") ||
        t.includes("research")
      );
    }
    if (mode === "resources") {
      const t = (item.type || "").toLowerCase();
      return (
        !t.includes("report") &&
        !t.includes("insight") &&
        !t.includes("trend") &&
        !t.includes("research")
      );
    }
    return true;
  });

  const filteredResources = basePool.filter((item) => {
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
    setFormType(mode === "research" ? "Industry Report" : "Whitepaper");
    setFormCategory("Enterprise Technology");
    setFormSummary("");
    setFormContent("");
    setFormDownloadContent("");
    setFormCoverImage(PRESET_COVERS[0].url);
    setFormFileUrl("");
    setFormDownloadFileName("");
    setFormDownloadFileType("auto-pdf");
    setFormDownloadCount(0);
    setFormFormatBadgeText("");
    setFormAccessBadgeText("Enterprise Research");
    setFormShowCategoryBadge(true);
    setFormShowFormatBadge(true);
    setFormShowAccessBadge(true);
    setFormShowDownloadCount(true);
    setFormCustomConfig(null);
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
    setFormDownloadContent(item.downloadContent || item.content || "");
    setFormCoverImage(
      item.coverImage ||
        "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=85"
    );
    setFormFileUrl(item.fileUrl || "");
    setFormDownloadFileName(item.downloadFileName || "");
    setFormDownloadFileType(
      item.downloadFileType ||
        (item.fileUrl && item.fileUrl !== "/sample-whitepaper.pdf"
          ? item.fileUrl.match(/\.(mp4|webm|mov)/i)
            ? "video"
            : item.fileUrl.match(/\.(doc|docx|rtf)/i)
            ? "word"
            : item.fileUrl.match(/\.(png|jpg|jpeg|webp|gif|svg)/i)
            ? "image"
            : "pdf"
          : "auto-pdf")
    );
    setFormDownloadCount(item.downloadCount ?? 0);
    setFormFormatBadgeText(item.formatBadgeText || "");
    setFormAccessBadgeText(item.accessBadgeText || "Enterprise Research");
    setFormShowCategoryBadge(item.showCategoryBadge !== false);
    setFormShowFormatBadge(item.showFormatBadge !== false);
    setFormShowAccessBadge(item.showAccessBadge !== false);
    setFormShowDownloadCount(item.showDownloadCount !== false);
    setFormCustomConfig(item.formConfig || (item as any).customFormConfig || null);
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
      const ext =
        formDownloadFileType === "image"
          ? "png"
          : formDownloadFileType === "video"
          ? "mp4"
          : formDownloadFileType === "word"
          ? "doc"
          : "pdf";
      const defaultFilename = `${formTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")}.${ext}`;

      const payload = {
        title: formTitle.trim(),
        type: formType,
        category: formCategory.trim() || "Enterprise Technology",
        summary: formSummary.trim(),
        content:
          formContent.trim() ||
          formSummary.trim() ||
          "Executive research publication overview and tactical strategic implementation guide.",
        downloadContent:
          formDownloadContent.trim() ||
          formContent.trim() ||
          formSummary.trim() ||
          "Executive research publication overview and tactical strategic implementation guide.",
        coverImage:
          formCoverImage.trim() ||
          "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=85",
        fileUrl: formFileUrl.trim() || "/sample-whitepaper.pdf",
        downloadFileName: formDownloadFileName.trim() || defaultFilename,
        downloadFileType: formDownloadFileType || "auto-pdf",
        downloadCount: Math.max(0, Number(formDownloadCount) || 0),
        formatBadgeText: formFormatBadgeText.trim(),
        accessBadgeText: formAccessBadgeText.trim() || "Enterprise Research",
        showCategoryBadge: formShowCategoryBadge,
        showFormatBadge: formShowFormatBadge,
        showAccessBadge: formShowAccessBadge,
        showDownloadCount: formShowDownloadCount,
        formConfig: formCustomConfig || undefined,
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

  const handleTestDownload = (resource: ResourceItem) => {
    downloadResourceAsset(
      {
        title: resource.title,
        type: resource.type,
        category: resource.category,
        summary: resource.summary,
        content: resource.content,
        downloadContent: resource.downloadContent || resource.content,
        coverImage: resource.coverImage,
      },
      resource.fileUrl,
      resource.downloadFileType,
      resource.downloadFileName
    );
    showToast(`Downloading asset for "${resource.title}"...`);
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
            <span className="res-dot" />{" "}
            {mode === "research"
              ? "RESEARCH & MARKET INTELLIGENCE"
              : mode === "resources"
              ? "RESOURCE ASSET REPOSITORY"
              : "RESOURCE CONTENT MANAGEMENT"}
          </div>
          <h2>
            {title ||
              (mode === "research"
                ? "Research & Market Reports"
                : mode === "resources"
                ? "Resources & Operational Assets"
                : "Resources & Intelligence Hub")}
          </h2>
          <p>
            {subtitle ||
              (mode === "research"
                ? "Manage market intelligence, buyer insight analyses, and industry benchmark reports."
                : mode === "resources"
                ? "Manage downloadable whitepapers, operational playbooks, and technical assets."
                : "Create, update, and manage all download materials including Whitepapers, Playbooks, Buyer Insights, and Industry Reports.")}
          </p>
        </div>

        <div className="res-header-action-group">
          <button className="res-create-btn" onClick={openCreateModal}>
            <span className="res-btn-icon">+</span>{" "}
            {mode === "research"
              ? "Add Research Report"
              : mode === "resources"
              ? "Add Resource"
              : "Add New Resource"}
          </button>
        </div>
      </div>

      {/* Modal: Individual Item Form Settings (Card Click) */}
      {isItemFormSettingsOpen && itemFormSettingsTarget && (
        <ItemFormSettingsModal
          isOpen={isItemFormSettingsOpen}
          onClose={() => {
            setIsItemFormSettingsOpen(false);
            setItemFormSettingsTarget(null);
            setItemFormInitialAction(null);
          }}
          itemTitle={itemFormSettingsTarget.title}
          itemTypeLabel={itemFormSettingsTarget.type || "Whitepaper"}
          initialConfig={
            itemFormSettingsTarget.formConfig ||
            (itemFormSettingsTarget as any).customFormConfig ||
            null
          }
          initialAction={itemFormInitialAction}
          onSave={async (newCfg) => {
            const updated = resources.map((r) =>
              r._id === itemFormSettingsTarget._id ? { ...r, formConfig: newCfg } : r
            );
            onResourcesChange(updated);
            try {
              await resourcesApi.update(itemFormSettingsTarget._id, {
                ...itemFormSettingsTarget,
                formConfig: newCfg,
              });
            } catch (err) {
              console.warn(err);
            }
          }}
          showToast={showToast}
        />
      )}

      {/* Modal: Form Settings from inside Resource Create/Edit Modal */}
      {isModalFormSettingsOpen && (
        <ItemFormSettingsModal
          isOpen={isModalFormSettingsOpen}
          onClose={() => {
            setIsModalFormSettingsOpen(false);
            setModalFormInitialAction(null);
          }}
          itemTitle={formTitle || "This Resource"}
          itemTypeLabel={formType || "Whitepaper"}
          initialConfig={formCustomConfig}
          initialAction={modalFormInitialAction}
          onSave={(newCfg) => {
            setFormCustomConfig(newCfg);
          }}
          showToast={showToast}
        />
      )}

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
            {allowedPillTypes.map((filterType) => (
              <button
                key={filterType}
                className={`res-pill ${
                  selectedTypeFilter === filterType ? "active" : ""
                }`}
                onClick={() => setSelectedTypeFilter(filterType)}
              >
                {filterType}
              </button>
            ))}
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
                    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=85"
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
                <div className="res-card-cat-row">
                  <span className="res-category-tag">{item.category}</span>
                  <div className="res-card-form-btns">
                    <button
                      type="button"
                      className="res-card-add-cb-btn"
                      onClick={() => {
                        setItemFormSettingsTarget(item);
                        setItemFormInitialAction("checkbox");
                        setIsItemFormSettingsOpen(true);
                      }}
                      title={`Add a consent or disclaimer checkbox for "${item.title}"`}
                    >
                      ☑️ + Checkbox
                    </button>
                    <button
                      type="button"
                      className="res-card-catform-btn"
                      onClick={() => {
                        setItemFormSettingsTarget(item);
                        setItemFormInitialAction(null);
                        setIsItemFormSettingsOpen(true);
                      }}
                      title={`Configure form fields specifically for "${item.title}"`}
                    >
                      ⚙️ Manage Form
                    </button>
                  </div>
                </div>
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
                  <span className="res-format-pill">
                    {item.downloadFileType === "image" && "🖼️ Image"}
                    {item.downloadFileType === "video" && "🎥 Video"}
                    {item.downloadFileType === "word" && "📝 Word Doc"}
                    {item.downloadFileType === "any" && "📦 Custom File"}
                    {item.downloadFileType === "pdf" && "📄 PDF"}
                    {(item.downloadFileType === "auto-pdf" || !item.downloadFileType) && "⚙️ Dynamic PDF"}
                  </span>
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
                    onClick={() => handleTestDownload(item)}
                    className="res-action-btn btn-pdf"
                    title="Download attached asset directly"
                  >
                    📥 Download
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
                    {(mode === "research"
                      ? RESEARCH_TYPES
                      : mode === "resources"
                      ? ["Whitepaper", "Playbook", "Guide"]
                      : RESOURCE_TYPES
                    ).map((t) => (
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
                    value={CATEGORIES.includes(formCategory) ? formCategory : CATEGORIES[0]}
                    onChange={(e) => setFormCategory(e.target.value)}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* ================= METADATA BAR SETTINGS (4 BADGES UNDER TITLE) ================= */}
                <div className="res-form-field full-width res-metabar-config-box">
                  <div className="res-metabar-header">
                    <div>
                      <span className="res-metabar-kicker">🏷️ RESOURCE METADATA BAR (UNDER TITLE)</span>
                      <h4 className="res-metabar-title">Manage Metadata Badges &amp; Download Counter</h4>
                      <p className="res-metabar-desc">
                        Customize or show/hide each of the 4 badges displayed directly below the resource title on the public page.
                      </p>
                    </div>
                    <button
                      type="button"
                      className="res-cat-form-quick-btn"
                      onClick={() => setIsModalFormSettingsOpen(true)}
                    >
                      ⚙️ Configure Form Fields for This {formType}
                    </button>
                  </div>

                  {/* Live Preview of the 4 Badges */}
                  <div className="res-metabar-preview-wrap">
                    <span className="res-metabar-preview-label">LIVE BAR PREVIEW:</span>
                    <div className="res-metabar-live-pills">
                      {formShowCategoryBadge && (
                        <span className="res-meta-preview-pill">
                          📁 {formCategory || "B2B Technology"}
                        </span>
                      )}
                      {formShowFormatBadge && (
                        <span className="res-meta-preview-pill">
                          {formFormatBadgeText.trim()
                            ? formFormatBadgeText.trim().match(/^(📄|🖼️|🎥|📝|📦)/)
                              ? formFormatBadgeText.trim()
                              : `${
                                  formDownloadFileType === "image"
                                    ? "🖼️"
                                    : formDownloadFileType === "video"
                                    ? "🎥"
                                    : formDownloadFileType === "word"
                                    ? "📝"
                                    : formDownloadFileType === "any"
                                    ? "📦"
                                    : "📄"
                                } ${formFormatBadgeText.trim()}`
                            : formDownloadFileType === "image"
                            ? "🖼️ Format: High-Res Image"
                            : formDownloadFileType === "video"
                            ? "🎥 Format: High-Def Video"
                            : formDownloadFileType === "word"
                            ? "📝 Format: Word Document"
                            : formDownloadFileType === "any"
                            ? "📦 Format: Custom File"
                            : "📄 Format: PDF Document"}
                        </span>
                      )}
                      {formShowAccessBadge && (
                        <span className="res-meta-preview-pill">
                          🔒 {formAccessBadgeText.trim() || "Enterprise Research"}
                        </span>
                      )}
                      {formShowDownloadCount && (
                        <span className="res-meta-preview-pill">
                          📥 {formDownloadCount || 0} Downloads
                        </span>
                      )}
                      {!formShowCategoryBadge &&
                        !formShowFormatBadge &&
                        !formShowAccessBadge &&
                        !formShowDownloadCount && (
                          <span className="res-meta-preview-empty">
                            All metadata badges hidden
                          </span>
                        )}
                    </div>
                  </div>

                  {/* 4 Badge Control Cards */}
                  <div className="res-metabar-grid">
                    {/* 1. Category Badge */}
                    <div className={`res-metabar-item ${!formShowCategoryBadge ? "is-hidden" : ""}`}>
                      <div className="res-metabar-item-top">
                        <span className="res-metabar-badge-name">📁 1. Category Badge</span>
                        <label className="res-metabar-toggle">
                          <input
                            type="checkbox"
                            checked={formShowCategoryBadge}
                            onChange={(e) => setFormShowCategoryBadge(e.target.checked)}
                          />
                          <span>{formShowCategoryBadge ? "Visible" : "Hidden"}</span>
                        </label>
                      </div>
                      <input
                        type="text"
                        placeholder="e.g. B2B Technology"
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value)}
                        disabled={!formShowCategoryBadge}
                      />
                      <small className="res-metabar-hint">
                        Select from dropdown above or type custom category text.
                      </small>
                    </div>

                    {/* 2. Format Badge */}
                    <div className={`res-metabar-item ${!formShowFormatBadge ? "is-hidden" : ""}`}>
                      <div className="res-metabar-item-top">
                        <span className="res-metabar-badge-name">📄 2. Format Badge</span>
                        <label className="res-metabar-toggle">
                          <input
                            type="checkbox"
                            checked={formShowFormatBadge}
                            onChange={(e) => setFormShowFormatBadge(e.target.checked)}
                          />
                          <span>{formShowFormatBadge ? "Visible" : "Hidden"}</span>
                        </label>
                      </div>
                      <input
                        type="text"
                        placeholder={
                          formDownloadFileType === "image"
                            ? "Format: High-Res Image (Auto)"
                            : formDownloadFileType === "video"
                            ? "Format: High-Def Video (Auto)"
                            : formDownloadFileType === "word"
                            ? "Format: Word Document (Auto)"
                            : "Format: PDF Document (Auto)"
                        }
                        value={formFormatBadgeText}
                        onChange={(e) => setFormFormatBadgeText(e.target.value)}
                        disabled={!formShowFormatBadge}
                      />
                      <div className="res-metabar-quick-chips">
                        {[
                          "Format: PDF Document",
                          "Format: Word Document",
                          "Format: High-Res Image",
                          "Format: High-Def Video",
                        ].map((chip) => (
                          <button
                            type="button"
                            key={chip}
                            className="res-mini-chip"
                            onClick={() => setFormFormatBadgeText(chip)}
                            disabled={!formShowFormatBadge}
                          >
                            {chip.replace("Format: ", "")}
                          </button>
                        ))}
                        {formFormatBadgeText && (
                          <button
                            type="button"
                            className="res-mini-chip clear"
                            onClick={() => setFormFormatBadgeText("")}
                          >
                            Auto
                          </button>
                        )}
                      </div>
                    </div>

                    {/* 3. Enterprise Research / Access Badge */}
                    <div className={`res-metabar-item ${!formShowAccessBadge ? "is-hidden" : ""}`}>
                      <div className="res-metabar-item-top">
                        <span className="res-metabar-badge-name">🔒 3. Research / Access Tag</span>
                        <label className="res-metabar-toggle">
                          <input
                            type="checkbox"
                            checked={formShowAccessBadge}
                            onChange={(e) => setFormShowAccessBadge(e.target.checked)}
                          />
                          <span>{formShowAccessBadge ? "Visible" : "Hidden"}</span>
                        </label>
                      </div>
                      <input
                        type="text"
                        placeholder="e.g. Enterprise Research"
                        value={formAccessBadgeText}
                        onChange={(e) => setFormAccessBadgeText(e.target.value)}
                        disabled={!formShowAccessBadge}
                      />
                      <div className="res-metabar-quick-chips">
                        {[
                          "Enterprise Research",
                          "Verified Whitepaper",
                          "Executive Briefing",
                          "Gated B2B Asset",
                        ].map((chip) => (
                          <button
                            type="button"
                            key={chip}
                            className={`res-mini-chip ${
                              formAccessBadgeText === chip ? "active" : ""
                            }`}
                            onClick={() => setFormAccessBadgeText(chip)}
                            disabled={!formShowAccessBadge}
                          >
                            {chip}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 4. Downloads Count Badge */}
                    <div className={`res-metabar-item ${!formShowDownloadCount ? "is-hidden" : ""}`}>
                      <div className="res-metabar-item-top">
                        <span className="res-metabar-badge-name">📥 4. Downloads Count</span>
                        <label className="res-metabar-toggle">
                          <input
                            type="checkbox"
                            checked={formShowDownloadCount}
                            onChange={(e) => setFormShowDownloadCount(e.target.checked)}
                          />
                          <span>{formShowDownloadCount ? "Visible" : "Hidden"}</span>
                        </label>
                      </div>
                      <input
                        type="number"
                        min={0}
                        placeholder="0"
                        value={formDownloadCount}
                        onChange={(e) =>
                          setFormDownloadCount(Math.max(0, parseInt(e.target.value || "0", 10)))
                        }
                        disabled={!formShowDownloadCount}
                      />
                      <small className="res-metabar-hint">
                        Set initial or custom download count (increments automatically on download).
                      </small>
                    </div>
                  </div>
                </div>

                {/* ================= FORM CONTROLS ================= */}
                <div className="res-form-field full-width res-item-form-config-box">
                  <div className="res-item-form-config-top">
                    <h4 className="res-item-form-title" style={{ margin: 0 }}>Form Controls</h4>
                    <div className="res-item-form-btns-group">
                      <button
                        type="button"
                        className="res-item-form-add-checkbox-btn"
                        onClick={() => {
                          setModalFormInitialAction("checkbox");
                          setIsModalFormSettingsOpen(true);
                        }}
                      >
                        ☑️ Add Checkbox
                      </button>
                      <button
                        type="button"
                        className="res-item-form-open-btn"
                        onClick={() => {
                          setModalFormInitialAction(null);
                          setIsModalFormSettingsOpen(true);
                        }}
                      >
                        ⚙️ Manage Form
                      </button>
                    </div>
                  </div>
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
                            "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=85";
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
                    Detailed Description (Displayed on Public Resource Page)
                  </label>
                  <textarea
                    id="res-content"
                    rows={5}
                    placeholder="Enter detailed description, key highlights, target audience, and methodology..."
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                  />
                </div>

                {/* ================= ATTACH DOCUMENT ================= */}
                <div className="res-form-field full-width res-asset-config-box">
                  <div className="res-asset-config-header">
                    <h4 className="res-asset-title">
                      Attach Document
                    </h4>
                  </div>

                  {/* Format Selector Pills */}
                  <div className="res-asset-format-selector">
                    <label className="res-asset-format-label">Select Download Format:</label>
                    <div className="res-format-btn-group">
                      <button
                        type="button"
                        className={`res-format-btn ${formDownloadFileType === "auto-pdf" ? "active" : ""}`}
                        onClick={() => {
                          setFormDownloadFileType("auto-pdf");
                          const slug = formTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "resource";
                          if (!formDownloadFileName || !formDownloadFileName.endsWith(".pdf")) {
                            setFormDownloadFileName(`${slug}.pdf`);
                          }
                        }}
                      >
                        ⚙️ Auto-Generated PDF
                      </button>
                      <button
                        type="button"
                        className={`res-format-btn ${formDownloadFileType === "pdf" ? "active" : ""}`}
                        onClick={() => {
                          setFormDownloadFileType("pdf");
                          const slug = formTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "resource";
                          if (!formDownloadFileName || !formDownloadFileName.endsWith(".pdf")) {
                            setFormDownloadFileName(`${slug}.pdf`);
                          }
                        }}
                      >
                        📄 Custom PDF (.pdf)
                      </button>
                      <button
                        type="button"
                        className={`res-format-btn ${formDownloadFileType === "word" ? "active" : ""}`}
                        onClick={() => {
                          setFormDownloadFileType("word");
                          const slug = formTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "resource";
                          if (!formDownloadFileName || (!formDownloadFileName.endsWith(".doc") && !formDownloadFileName.endsWith(".docx"))) {
                            setFormDownloadFileName(`${slug}.doc`);
                          }
                        }}
                      >
                        📝 Word (.doc, .docx)
                      </button>
                      <button
                        type="button"
                        className={`res-format-btn ${formDownloadFileType === "image" ? "active" : ""}`}
                        onClick={() => {
                          setFormDownloadFileType("image");
                          const slug = formTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "resource";
                          if (!formDownloadFileName || !/\.(png|jpg|jpeg|webp|gif|svg)$/i.test(formDownloadFileName)) {
                            setFormDownloadFileName(`${slug}.png`);
                          }
                        }}
                      >
                        🖼️ Image (.png, .jpg, .webp)
                      </button>
                      <button
                        type="button"
                        className={`res-format-btn ${formDownloadFileType === "video" ? "active" : ""}`}
                        onClick={() => {
                          setFormDownloadFileType("video");
                          const slug = formTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "resource";
                          if (!formDownloadFileName || !/\.(mp4|webm|mov)$/i.test(formDownloadFileName)) {
                            setFormDownloadFileName(`${slug}.mp4`);
                          }
                        }}
                      >
                        🎥 Video (.mp4, .webm)
                      </button>
                      <button
                        type="button"
                        className={`res-format-btn ${formDownloadFileType === "any" ? "active" : ""}`}
                        onClick={() => {
                          setFormDownloadFileType("any");
                        }}
                      >
                        📦 Any File (.xlsx, .pptx, .zip)
                      </button>
                    </div>
                  </div>

                  {/* File Upload & URL Input (always available for custom files, or optional override) */}
                  {formDownloadFileType !== "auto-pdf" && (
                    <div className="res-asset-source-row">
                      <div className="res-file-upload-block">
                        <label className="res-file-input-btn" title="Choose file from your local storage">
                          <span>📁</span> Upload{" "}
                          {formDownloadFileType === "word"
                            ? "Word (.doc / .docx)"
                            : formDownloadFileType === "any"
                            ? "Any Format"
                            : formDownloadFileType.toUpperCase()}{" "}
                          File from Computer
                          <input
                            type="file"
                            accept={
                              formDownloadFileType === "image"
                                ? "image/*"
                                : formDownloadFileType === "video"
                                ? "video/*"
                                : formDownloadFileType === "word"
                                ? ".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                : formDownloadFileType === "pdf"
                                ? ".pdf,application/pdf"
                                : "*/*,.pdf,.doc,.docx,image/*,video/*,.xlsx,.pptx,.zip,.csv,.txt"
                            }
                            style={{ display: "none" }}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  const result = reader.result as string;
                                  setFormFileUrl(result);
                                  setFormDownloadFileName(file.name);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                        <span className="res-file-note">
                          Upload PDF, Image, Word (.doc/.docx), Video (.mp4), or any file from your system, or paste a direct URL.
                        </span>
                      </div>

                      <div className="res-asset-url-field">
                        <label htmlFor="res-file-url">Or Paste Direct File / Media URL:</label>
                        <input
                          id="res-file-url"
                          type="text"
                          placeholder={
                            formDownloadFileType === "image"
                              ? "https://example.com/infographic.png"
                              : formDownloadFileType === "video"
                              ? "https://example.com/explainer-video.mp4"
                              : formDownloadFileType === "word"
                              ? "https://example.com/enterprise-guide.docx"
                              : "https://example.com/whitepaper.pdf"
                          }
                          value={formFileUrl}
                          onChange={(e) => setFormFileUrl(e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {/* Custom Download Filename */}
                  <div className="res-asset-filename-row">
                    <div className="res-filename-field">
                      <label htmlFor="res-filename">
                        Saved Filename on Download:
                      </label>
                      <input
                        id="res-filename"
                        type="text"
                        placeholder="e.g. enterprise-security-brief.pdf"
                        value={formDownloadFileName}
                        onChange={(e) => setFormDownloadFileName(e.target.value)}
                      />
                      <small className="res-filename-hint">
                        This is the filename shown in the visitor&#39;s browser download bar.
                      </small>
                    </div>
                  </div>
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

        /* ================= DOWNLOAD ASSET CONFIGURATION STYLES ================= */
        .res-asset-config-box {
          background: #060B12;
          border: 1px solid rgba(0, 210, 255, 0.28);
          border-radius: 10px;
          padding: 20px;
          margin-top: 10px;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.35);
        }

        .res-asset-config-header {
          margin-bottom: 16px;
        }

        .res-asset-tag {
          display: inline-block;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: #00D2FF;
          background: rgba(0, 210, 255, 0.1);
          border: 1px solid rgba(0, 210, 255, 0.3);
          padding: 3px 10px;
          border-radius: 12px;
          margin-bottom: 6px;
        }

        .res-asset-title {
          font-size: 16px;
          font-weight: 700;
          color: #FFFFFF;
          margin: 0 0 12px;
        }

        .res-asset-desc {
          font-size: 12.5px;
          color: #94A3B8;
          margin: 0;
          line-height: 1.45;
        }

        .res-asset-format-selector {
          margin-bottom: 18px;
        }

        .res-asset-format-label {
          display: block;
          font-size: 12px;
          font-weight: 700;
          color: #D5DBE7;
          margin-bottom: 8px;
        }

        .res-format-btn-group {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .res-format-btn {
          background: #0D1522;
          border: 1px solid rgba(203, 213, 225, 0.16);
          color: #CBD5E1;
          padding: 8px 14px;
          border-radius: 6px;
          font-size: 12.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .res-format-btn:hover {
          border-color: #00D2FF;
          color: #00D2FF;
          background: rgba(0, 210, 255, 0.08);
        }

        .res-format-btn.active {
          background: linear-gradient(135deg, #0046FC 0%, #0077FE 100%);
          border-color: #00D2FF;
          color: #FFFFFF;
          box-shadow: 0 2px 10px rgba(0, 70, 252, 0.4);
        }

        .res-asset-source-row {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 14px;
          margin-bottom: 16px;
          padding: 14px;
          background: rgba(13, 21, 34, 0.6);
          border: 1px dashed rgba(203, 213, 225, 0.18);
          border-radius: 8px;
        }

        @media (max-width: 680px) {
          .res-asset-source-row {
            grid-template-columns: 1fr;
          }
        }

        .res-file-upload-block {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .res-file-input-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 11px 16px;
          background: #111C2D;
          border: 1px solid rgba(0, 210, 255, 0.45);
          color: #00D2FF;
          border-radius: 8px;
          font-size: 12.5px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: center;
        }

        .res-file-input-btn:hover {
          background: rgba(0, 210, 255, 0.16);
          color: #FFFFFF;
          border-color: #00D2FF;
          box-shadow: 0 0 12px rgba(0, 210, 255, 0.3);
        }

        .res-file-note {
          font-size: 11px;
          color: #64748B;
        }

        .res-asset-url-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .res-asset-url-field label {
          font-size: 11.5px;
          font-weight: 700;
          color: #94A3B8;
        }

        .res-asset-filename-row {
          display: flex;
          align-items: flex-end;
          gap: 14px;
          margin-bottom: 14px;
        }

        .res-filename-field {
          flex: 1;
        }

        .res-filename-hint {
          display: block;
          font-size: 11px;
          color: #64748B;
          margin-top: 4px;
        }

        .res-test-btn-wrap {
          flex-shrink: 0;
        }

        .res-test-download-btn {
          padding: 10px 18px;
          background: rgba(0, 210, 255, 0.12);
          border: 1px solid rgba(0, 210, 255, 0.45);
          color: #00D2FF;
          font-size: 12.5px;
          font-weight: 700;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .res-test-download-btn:hover {
          background: #00D2FF;
          color: #060B12;
          box-shadow: 0 0 14px rgba(0, 210, 255, 0.4);
        }

        .res-asset-status-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: rgba(0, 210, 255, 0.05);
          border: 1px solid rgba(0, 210, 255, 0.15);
          border-radius: 6px;
          font-size: 12px;
          color: #94A3B8;
        }

        .res-asset-status-pill .status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #10B981;
          box-shadow: 0 0 8px #10B981;
          flex-shrink: 0;
        }

        .res-asset-status-pill strong {
          color: #00D2FF;
          flex-shrink: 0;
        }

        .res-asset-status-pill span {
          color: #E2E8F0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* ================= METADATA BAR SETTINGS STYLES ================= */
        .res-metabar-config-box {
          background: #060B12;
          border: 1px solid rgba(0, 210, 255, 0.28);
          border-radius: 10px;
          padding: 18px 20px;
          margin-top: 4px;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.35);
        }

        .res-metabar-header {
          margin-bottom: 14px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 10px;
        }

        .res-cat-form-quick-btn {
          background: rgba(0, 210, 255, 0.12);
          border: 1px solid rgba(0, 210, 255, 0.4);
          color: #00D2FF;
          padding: 7px 12px;
          border-radius: 7px;
          font-size: 11.5px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.18s ease;
        }

        .res-cat-form-quick-btn:hover {
          background: #00D2FF;
          color: #060B12;
          box-shadow: 0 0 12px rgba(0, 210, 255, 0.35);
        }

        .res-card-cat-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 2px;
        }

        .res-card-catform-btn {
          background: rgba(0, 210, 255, 0.08);
          border: 1px solid rgba(0, 210, 255, 0.25);
          color: #00D2FF;
          padding: 3px 8px;
          border-radius: 5px;
          font-size: 10.5px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .res-card-catform-btn:hover {
          background: #00D2FF;
          color: #060B12;
        }

        .res-metabar-kicker {
          display: inline-block;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: #00D2FF;
          background: rgba(0, 210, 255, 0.1);
          border: 1px solid rgba(0, 210, 255, 0.3);
          padding: 3px 10px;
          border-radius: 12px;
          margin-bottom: 6px;
        }

        .res-metabar-title {
          font-size: 15.5px;
          font-weight: 700;
          color: #FFFFFF;
          margin: 0 0 4px;
        }

        .res-metabar-desc {
          font-size: 12.5px;
          color: #94A3B8;
          margin: 0;
          line-height: 1.45;
        }

        .res-metabar-preview-wrap {
          background: #0A111D;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          padding: 12px 14px;
          margin-bottom: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .res-metabar-preview-label {
          font-size: 10.5px;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: #10B981;
        }

        .res-metabar-live-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          align-items: center;
        }

        .res-meta-preview-pill {
          background: #0D1522;
          border: 1px solid rgba(203, 213, 225, 0.16);
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12.5px;
          font-weight: 600;
          color: #CBD5E1;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .res-meta-preview-empty {
          font-size: 12px;
          color: #64748B;
          font-style: italic;
        }

        .res-metabar-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        @media (max-width: 680px) {
          .res-metabar-grid {
            grid-template-columns: 1fr;
          }
        }

        .res-metabar-item {
          background: #0D1522;
          border: 1px solid rgba(203, 213, 225, 0.12);
          border-radius: 8px;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          transition: opacity 0.2s ease, border-color 0.2s ease;
        }

        .res-metabar-item:hover {
          border-color: rgba(0, 210, 255, 0.35);
        }

        .res-metabar-item.is-hidden {
          opacity: 0.55;
        }

        .res-metabar-item-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .res-metabar-badge-name {
          font-size: 12px;
          font-weight: 700;
          color: #E2E8F0;
        }

        .res-metabar-toggle {
          display: inline-flex !important;
          align-items: center;
          gap: 5px;
          margin: 0 !important;
          font-size: 11px !important;
          font-weight: 700 !important;
          color: #00D2FF !important;
          cursor: pointer;
          user-select: none;
        }

        .res-metabar-toggle input {
          width: 14px !important;
          height: 14px !important;
          padding: 0 !important;
          margin: 0 !important;
          accent-color: #00D2FF;
          cursor: pointer;
        }

        .res-metabar-hint {
          font-size: 11px;
          color: #64748B;
          line-height: 1.35;
        }

        .res-metabar-quick-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
        }

        .res-mini-chip {
          background: #111C2D;
          border: 1px solid rgba(203, 213, 225, 0.14);
          border-radius: 4px;
          padding: 3px 7px;
          font-size: 10.5px;
          font-weight: 600;
          color: #CBD5E1;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .res-mini-chip:hover:not(:disabled) {
          border-color: #00D2FF;
          color: #00D2FF;
          background: rgba(0, 210, 255, 0.12);
        }

        .res-mini-chip.active {
          background: #0046FC;
          border-color: #00D2FF;
          color: #FFFFFF;
        }

        .res-mini-chip.clear {
          border-color: rgba(244, 63, 94, 0.35);
          color: #FDA4AF;
        }

        .res-item-form-config-box {
          background: linear-gradient(145deg, rgba(13, 21, 34, 0.95), rgba(7, 16, 29, 0.98));
          border: 1px solid rgba(0, 210, 255, 0.28);
          border-radius: 10px;
          padding: 16px 18px;
          margin: 6px 0 16px;
        }

        .res-item-form-config-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 14px;
        }

        .res-item-form-tag {
          display: inline-block;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: #00D2FF;
          background: rgba(0, 210, 255, 0.12);
          border: 1px solid rgba(0, 210, 255, 0.3);
          padding: 3px 10px;
          border-radius: 12px;
          margin-bottom: 6px;
        }

        .res-item-form-title {
          font-size: 15px;
          font-weight: 700;
          color: #FFFFFF;
          margin: 0 0 4px;
        }

        .res-item-form-desc {
          font-size: 12.5px;
          color: #94A3B8;
          margin: 0;
          line-height: 1.45;
        }

        .res-item-form-open-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #0046FC;
          color: #FFFFFF;
          border: 1px solid rgba(0, 210, 255, 0.4);
          padding: 9px 16px;
          border-radius: 7px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(0, 70, 252, 0.25);
          white-space: nowrap;
        }

        .res-item-form-open-btn:hover {
          background: #0038D1;
          border-color: #00D2FF;
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(0, 210, 255, 0.35);
        }

        .res-item-form-btns-group {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .res-item-form-add-checkbox-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(16, 185, 129, 0.15);
          color: #34D399;
          border: 1px solid rgba(16, 185, 129, 0.4);
          padding: 9px 16px;
          border-radius: 7px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .res-item-form-add-checkbox-btn:hover {
          background: #10B981;
          color: #040914;
          border-color: #10B981;
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);
        }

        .res-card-form-btns {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }

        .res-card-add-cb-btn {
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.35);
          color: #34D399;
          font-size: 11px;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: 5px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .res-card-add-cb-btn:hover {
          background: #10B981;
          color: #040914;
          border-color: #10B981;
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

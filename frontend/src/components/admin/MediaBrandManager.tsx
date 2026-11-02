import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  mediaBrandsStorageApi,
  type MediaBrandData,
  type ReferenceWebsite,
} from "../../services/api";

interface MediaBrandManagerProps {
  showToast: (msg: string) => void;
  articles?: any[];
  onAddArticle?: () => void;
  onEditArticle?: (art: any) => void;
  onDeleteArticle?: (id: string) => void;
}

const BRAND_COLOR_PRESETS = [
  { name: "Cyan / Electric Blue (Cyber)", color: "#00D2FF", accent: "#0088CC" },
  { name: "Orange / Amber (Enterprise)", color: "#FB923C", accent: "#E65100" },
  { name: "Purple / Violet (Cloud)", color: "#C084FC", accent: "#662E8A" },
  { name: "Pink / Rose (Growth/MarTech)", color: "#F472B6", accent: "#E60067" },
  { name: "Sky Blue (AI Brief)", color: "#38BDF8", accent: "#00D2FF" },
  { name: "Emerald Green (Fintech)", color: "#34D399", accent: "#00A86B" },
];

const PRESET_COVERS = [
  {
    label: "Cybersecurity & SOC",
    url: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1600&q=90",
  },
  {
    label: "Enterprise IT & Datacenter",
    url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=90",
  },
  {
    label: "Cloud & Distributed Systems",
    url: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1600&q=90",
  },
  {
    label: "Growth Marketing & Strategy",
    url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1600&q=90",
  },
  {
    label: "Enterprise AI & Neural Networks",
    url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1600&q=90",
  },
  {
    label: "Fintech & Banking Infrastructure",
    url: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1600&q=90",
  },
];

export const MediaBrandManager: React.FC<MediaBrandManagerProps> = ({
  showToast,
  articles = [],
  onAddArticle,
  onEditArticle,
  onDeleteArticle,
}) => {
  const [mediaBrands, setMediaBrands] = useState<MediaBrandData[]>(() =>
    mediaBrandsStorageApi.getAll()
  );
  const [activeTab, setActiveTab] = useState<"brands" | "articles">("brands");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrandFilter, setSelectedBrandFilter] = useState("All");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formTagline, setFormTagline] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formAudienceDesc, setFormAudienceDesc] = useState("");
  const [formColor, setFormColor] = useState("#00D2FF");
  const [formAccentColor, setFormAccentColor] = useState("#0088CC");
  const [formEditor, setFormEditor] = useState("");
  const [formFrequency, setFormFrequency] = useState("Weekly Executive Dispatch");
  const [formSubscriberCount, setFormSubscriberCount] = useState("20,000+ Leaders");
  const [formCoverImage, setFormCoverImage] = useState("");
  const [formKeyTopicsText, setFormKeyTopicsText] = useState("");
  const [formStatus, setFormStatus] = useState<"Active" | "Draft" | "Archived">("Active");

  // Dynamic Reference Websites Form State
  const [refWebsites, setRefWebsites] = useState<ReferenceWebsite[]>([]);
  const [newRefName, setNewRefName] = useState("");
  const [newRefUrl, setNewRefUrl] = useState("");
  const [newRefNote, setNewRefNote] = useState("");

  useEffect(() => {
    const handleUpdate = () => {
      setMediaBrands(mediaBrandsStorageApi.getAll());
    };
    window.addEventListener("gp_media_brands_updated", handleUpdate);
    return () => window.removeEventListener("gp_media_brands_updated", handleUpdate);
  }, []);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const openCreateModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormName("");
    setFormSlug("");
    setFormTagline("EXECUTIVE TECHNOLOGY PUBLICATION");
    setFormDescription("");
    setFormAudienceDesc("Enterprise Leaders & Buying Committees");
    setFormColor("#00D2FF");
    setFormAccentColor("#0088CC");
    setFormEditor("Editorial Team");
    setFormFrequency("Weekly Executive Brief");
    setFormSubscriberCount("15,000+ Executives");
    setFormCoverImage(PRESET_COVERS[0].url);
    setFormKeyTopicsText("Architecture & Governance\nCompliance & Auditing\nEnterprise Scalability");
    setFormStatus("Active");
    setRefWebsites([
      { name: "Dark Reading", url: "https://www.darkreading.com", note: "Security telemetry & news" },
      { name: "CSO Online", url: "https://www.csoonline.com", note: "Executive leadership strategy" },
    ]);
    setIsModalOpen(true);
  };

  const openEditModal = (brand: MediaBrandData) => {
    setIsEditing(true);
    setEditingId(brand.id);
    setFormName(brand.name);
    setFormSlug(brand.slug);
    setFormTagline(brand.tagline);
    setFormDescription(brand.description);
    setFormAudienceDesc(brand.audienceDesc || "");
    setFormColor(brand.color);
    setFormAccentColor(brand.accentColor);
    setFormEditor(brand.editor);
    setFormFrequency(brand.frequency);
    setFormSubscriberCount(brand.subscriberCount);
    setFormCoverImage(brand.coverImage);
    setFormKeyTopicsText((brand.keyTopics || []).join("\n"));
    setFormStatus(brand.status || "Active");
    setRefWebsites(
      Array.isArray(brand.referenceWebsites)
        ? JSON.parse(JSON.stringify(brand.referenceWebsites))
        : []
    );
    setIsModalOpen(true);
  };

  const handleAddReference = () => {
    if (!newRefName.trim()) {
      alert("Please enter a reference publication or website name.");
      return;
    }
    const cleanUrl = newRefUrl.trim()
      ? newRefUrl.trim().startsWith("http")
        ? newRefUrl.trim()
        : `https://${newRefUrl.trim()}`
      : "https://google.com";

    setRefWebsites((prev) => [
      ...prev,
      {
        name: newRefName.trim(),
        url: cleanUrl,
        note: newRefNote.trim() || "Industry research source",
      },
    ]);
    setNewRefName("");
    setNewRefUrl("");
    setNewRefNote("");
  };

  const handleRemoveReference = (index: number) => {
    setRefWebsites((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert("Please enter a publication brand name.");
      return;
    }

    const keyTopics = formKeyTopicsText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const slug = formSlug.trim() || generateSlug(formName);
    const articlePath = `/article/${slug}`;

    if (isEditing && editingId) {
      const updated = mediaBrands.map((b) => {
        if (b.id === editingId) {
          return {
            ...b,
            name: formName.trim(),
            slug,
            tagline: formTagline.trim(),
            description: formDescription.trim(),
            audienceDesc: formAudienceDesc.trim(),
            color: formColor,
            accentColor: formAccentColor,
            articlePath,
            editor: formEditor.trim(),
            frequency: formFrequency.trim(),
            subscriberCount: formSubscriberCount.trim(),
            coverImage: formCoverImage,
            keyTopics,
            referenceWebsites: refWebsites,
            status: formStatus,
          };
        }
        return b;
      });
      mediaBrandsStorageApi.saveAll(updated);
      setMediaBrands(updated);
      showToast(`Updated "${formName}" successfully!`);
    } else {
      const newBrand: MediaBrandData = {
        id: `mb-${Date.now()}`,
        name: formName.trim(),
        slug,
        tagline: formTagline.trim(),
        description: formDescription.trim(),
        audienceDesc: formAudienceDesc.trim(),
        color: formColor,
        accentColor: formAccentColor,
        articlePath,
        editor: formEditor.trim(),
        frequency: formFrequency.trim(),
        subscriberCount: formSubscriberCount.trim(),
        coverImage: formCoverImage || PRESET_COVERS[0].url,
        keyTopics,
        referenceWebsites: refWebsites,
        status: formStatus,
        order: mediaBrands.length + 1,
      };
      const updated = [...mediaBrands, newBrand];
      mediaBrandsStorageApi.saveAll(updated);
      setMediaBrands(updated);
      showToast(`Created new Media Brand "${formName}"!`);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove the Media Brand "${name}"?`)) {
      const filtered = mediaBrands.filter((b) => b.id !== id);
      mediaBrandsStorageApi.saveAll(filtered);
      setMediaBrands(filtered);
      showToast(`Removed "${name}".`);
    }
  };

  const handleToggleStatus = (id: string) => {
    const updated = mediaBrands.map((b) => {
      if (b.id === id) {
        const nextStatus = b.status === "Active" ? "Draft" : "Active";
        return { ...b, status: nextStatus as any };
      }
      return b;
    });
    mediaBrandsStorageApi.saveAll(updated);
    setMediaBrands(updated);
    showToast("Updated brand status.");
  };

  const handleResetDefaults = () => {
    if (
      window.confirm(
        "Reset all 6 canonical Media Brands to factory default configuration (including reference websites like Dark Reading, CSO Online, The Hacker News, etc.)?"
      )
    ) {
      const defaults = mediaBrandsStorageApi.resetDefaults();
      setMediaBrands(defaults);
      showToast("Reset all 6 Media Brands to default configuration.");
    }
  };

  // Filtered Media Brands
  const filteredBrands = mediaBrands.filter((b) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      b.name.toLowerCase().includes(q) ||
      b.tagline.toLowerCase().includes(q) ||
      b.description.toLowerCase().includes(q) ||
      b.editor.toLowerCase().includes(q) ||
      (b.referenceWebsites || []).some(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.note.toLowerCase().includes(q) ||
          r.url.toLowerCase().includes(q)
      );
    return matchesSearch;
  });

  // Filtered Articles (if user switches to articles tab)
  const filteredArticles = articles.filter((art) => {
    const q = searchQuery.toLowerCase();
    const brandName = selectedBrandFilter;
    const cat = (art.category || "").toLowerCase();
    const title = (art.title || "").toLowerCase();

    let matchesBrand = true;
    if (brandName !== "All") {
      if (brandName === "Enterprise Current") {
        matchesBrand = cat.includes("enterprise") || cat.includes("leadership") || title.includes("procurement");
      } else if (brandName === "CyberDefense Journal") {
        matchesBrand = cat.includes("cyber") || cat.includes("security") || title.includes("cyber") || title.includes("ciso");
      } else if (brandName === "Cloud Enterprise") {
        matchesBrand = cat.includes("cloud") || cat.includes("devops") || title.includes("infrastructure");
      } else if (brandName === "Growth Marketer") {
        matchesBrand = cat.includes("marketing") || cat.includes("demand") || cat.includes("growth") || title.includes("b2b");
      } else if (brandName === "Enterprise AI Brief") {
        matchesBrand = cat.includes("ai") || title.includes("ai") || title.includes("agentic");
      } else if (brandName === "Fintech Perspective") {
        matchesBrand = cat.includes("fintech") || cat.includes("banking") || title.includes("banking");
      } else {
        matchesBrand = cat.includes(brandName.toLowerCase());
      }
    }

    const matchesQuery =
      !q ||
      art.title.toLowerCase().includes(q) ||
      (art.description && art.description.toLowerCase().includes(q)) ||
      (art.author && art.author.toLowerCase().includes(q));

    return matchesBrand && matchesQuery;
  });

  return (
    <div className="mb-manager-wrap">
      {/* ================= HEADER SECTION ================= */}
      <div className="mb-header-card">
        <div className="mb-header-content">
          <div className="mb-header-title-row">
            <span className="mb-header-badge">PUBLISHING NETWORK</span>
            <span className="mb-network-status-live">● Network Operational</span>
          </div>
          <h2>Media Brands Management</h2>
          <p>
            Configure GETprospeKt's official editorial publications, assign target buyer personas, customize visual accents, and maintain accredited industry reference research websites.
          </p>

          <div className="mb-quick-stats-row">
            <div className="mb-stat-pill">
              <span className="stat-num">{mediaBrands.length}</span>
              <span className="stat-label">Official Media Brands</span>
            </div>
            <div className="mb-stat-pill">
              <span className="stat-num">
                {mediaBrands.reduce((acc, b) => acc + (b.referenceWebsites?.length || 0), 0)}
              </span>
              <span className="stat-label">Accredited Reference Sites</span>
            </div>
            <div className="mb-stat-pill">
              <span className="stat-num">
                {mediaBrands.filter((b) => b.status === "Active").length} / {mediaBrands.length}
              </span>
              <span className="stat-label">Active Publications</span>
            </div>
          </div>
        </div>

        <div className="mb-header-actions">
          <button className="mb-btn-primary" onClick={openCreateModal}>
            <span>+</span> Add Media Brand
          </button>
          <button className="mb-btn-secondary" onClick={handleResetDefaults} title="Restore original 6 media brands with standard reference sites">
            <span>↺</span> Reset Defaults
          </button>
        </div>
      </div>

      {/* ================= NAVIGATION TABS & SEARCH ================= */}
      <div className="mb-controls-bar">
        <div className="mb-tabs-switch">
          <button
            className={`mb-tab-btn ${activeTab === "brands" ? "active" : ""}`}
            onClick={() => setActiveTab("brands")}
          >
            <span className="tab-icon">📰</span>
            Media Brand Profiles ({mediaBrands.length})
          </button>
          <button
            className={`mb-tab-btn ${activeTab === "articles" ? "active" : ""}`}
            onClick={() => setActiveTab("articles")}
          >
            <span className="tab-icon">📑</span>
            Publication Articles ({articles.length})
          </button>
        </div>

        <div className="mb-search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder={
              activeTab === "brands"
                ? "Search by brand name, topic, editor, or reference site (e.g. Dark Reading)..."
                : "Search articles by title, author, or keyword..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="search-clear-btn" onClick={() => setSearchQuery("")}>
              ×
            </button>
          )}
        </div>
      </div>

      {/* ================= TAB 1: MEDIA BRAND PROFILES ================= */}
      {activeTab === "brands" && (
        <div className="mb-cards-grid">
          {filteredBrands.length === 0 ? (
            <div className="mb-empty-state">
              <div className="empty-icon">📰</div>
              <h3>No Media Brands match your search</h3>
              <p>Try searching for a different keyword or create a new Media Brand.</p>
              <button className="mb-btn-primary" onClick={openCreateModal}>
                + Create Media Brand
              </button>
            </div>
          ) : (
            filteredBrands.map((brand) => (
              <div key={brand.id} className="mb-brand-card">
                {/* Top Accent Color Bar */}
                <div
                  className="mb-brand-top-stripe"
                  style={{
                    background: `linear-gradient(90deg, ${brand.accentColor || brand.color} 0%, ${brand.color} 100%)`,
                  }}
                />

                <div className="mb-brand-card-inner">
                  {/* Category Pill & Status Badge */}
                  <div className="mb-card-header-row">
                    <span
                      className="mb-brand-pill"
                      style={{
                        color: brand.color,
                        borderColor: `${brand.color}44`,
                        background: `${brand.color}18`,
                      }}
                    >
                      {brand.tagline}
                    </span>
                    <button
                      className={`mb-status-badge ${brand.status.toLowerCase()}`}
                      onClick={() => handleToggleStatus(brand.id)}
                      title="Click to toggle Active / Draft"
                    >
                      {brand.status}
                    </button>
                  </div>

                  {/* Title & Description */}
                  <h3 className="mb-brand-title">{brand.name}</h3>
                  <p className="mb-brand-desc">{brand.description}</p>

                  {/* Target Audience Bar */}
                  {brand.audienceDesc && (
                    <div className="mb-audience-box">
                      <span className="audience-label">TARGET AUDIENCE:</span>
                      <span className="audience-val">{brand.audienceDesc}</span>
                    </div>
                  )}

                  {/* Editor & Frequency Specs */}
                  <div className="mb-meta-grid">
                    <div className="mb-meta-item">
                      <span className="meta-k">Editor-in-Chief</span>
                      <span className="meta-v">{brand.editor || "Editorial Staff"}</span>
                    </div>
                    <div className="mb-meta-item">
                      <span className="meta-k">Dispatch Schedule</span>
                      <span className="meta-v">{brand.frequency || "Weekly"}</span>
                    </div>
                    <div className="mb-meta-item">
                      <span className="meta-k">Circulation</span>
                      <span className="meta-v text-highlight" style={{ color: brand.color }}>
                        {brand.subscriberCount || "10,000+"}
                      </span>
                    </div>
                    <div className="mb-meta-item">
                      <span className="meta-k">Canonical Route</span>
                      <span className="meta-v route-code">{brand.articlePath}</span>
                    </div>
                  </div>

                  {/* Accredited Reference Websites Section */}
                  <div className="mb-references-section">
                    <div className="references-header">
                      <span>🔗 Content Research Reference Websites:</span>
                      <span className="ref-count-tag">
                        {brand.referenceWebsites?.length || 0} Sources
                      </span>
                    </div>
                    <div className="references-list">
                      {(!brand.referenceWebsites || brand.referenceWebsites.length === 0) ? (
                        <span className="no-refs">No reference websites linked yet.</span>
                      ) : (
                        brand.referenceWebsites.map((ref, idx) => (
                          <a
                            key={idx}
                            href={ref.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ref-chip"
                            title={ref.note ? `${ref.name}: ${ref.note}` : ref.name}
                          >
                            <span className="ref-name">{ref.name}</span>
                            <span className="ref-ext-icon">↗</span>
                          </a>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Key Topic Pillars */}
                  {brand.keyTopics && brand.keyTopics.length > 0 && (
                    <div className="mb-topics-section">
                      <span className="topics-label">Core Pillars:</span>
                      <div className="topics-pills">
                        {brand.keyTopics.map((topic, i) => (
                          <span key={i} className="topic-pill">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Card Action Buttons */}
                  <div className="mb-card-actions">
                    <button
                      className="mb-card-edit-btn"
                      onClick={() => openEditModal(brand)}
                    >
                      ✏ Edit Brand &amp; References
                    </button>
                    <Link
                      to={brand.articlePath}
                      target="_blank"
                      className="mb-card-view-btn"
                      style={{ color: brand.color }}
                    >
                      View Live Article ↗
                    </Link>
                    <button
                      className="mb-card-del-btn"
                      onClick={() => handleDelete(brand.id, brand.name)}
                      title="Delete Media Brand"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ================= TAB 2: ARTICLES MAPPED TO MEDIA BRANDS ================= */}
      {activeTab === "articles" && (
        <div className="mb-articles-view">
          {/* Brand Filter Pills */}
          <div className="mb-article-brand-pills">
            <span className="filter-lead">Filter by Publication:</span>
            {["All", ...mediaBrands.map((b) => b.name)].map((bName) => (
              <button
                key={bName}
                className={`mb-filter-pill ${selectedBrandFilter === bName ? "active" : ""}`}
                onClick={() => setSelectedBrandFilter(bName)}
              >
                {bName}
              </button>
            ))}
          </div>

          <div className="mb-articles-table-wrap">
            <div className="mb-articles-table-header">
              <h3>Editorial Articles ({filteredArticles.length})</h3>
              {onAddArticle && (
                <button className="mb-btn-primary small" onClick={onAddArticle}>
                  + Add Article
                </button>
              )}
            </div>

            {filteredArticles.length === 0 ? (
              <div className="mb-empty-state">
                <p>No articles found for this filter.</p>
              </div>
            ) : (
              <table className="mb-articles-table">
                <thead>
                  <tr>
                    <th>Article Title</th>
                    <th>Publication Brand</th>
                    <th>Author / Editor</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredArticles.map((art) => (
                    <tr key={art._id || art.slug || art.title}>
                      <td className="art-title-cell">
                        <strong>{art.title}</strong>
                        {art.description && (
                          <p className="art-sub-desc">{art.description}</p>
                        )}
                      </td>
                      <td>
                        <span className="art-cat-badge">{art.category}</span>
                      </td>
                      <td className="art-author">{art.author || "GETprospeKt Editorial"}</td>
                      <td className="art-date">{art.date || "Oct 2026"}</td>
                      <td style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <Link
                          to={`/article/${art.slug || ""}`}
                          target="_blank"
                          className="art-action-link"
                        >
                          Read ↗
                        </Link>
                        {onEditArticle && (
                          <button
                            type="button"
                            className="art-action-edit-btn"
                            onClick={() => onEditArticle(art)}
                            title="Edit Article"
                          >
                            ✎
                          </button>
                        )}
                        {onDeleteArticle && (
                          <button
                            type="button"
                            className="art-action-del-btn"
                            onClick={() => onDeleteArticle(art._id)}
                            title="Delete Article"
                          >
                            🗑
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* ================= ADD / EDIT MODAL ================= */}
      {isModalOpen && (
        <div className="mb-modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="mb-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="mb-modal-header">
              <div>
                <span className="mb-modal-badge">
                  {isEditing ? "EDIT PUBLICATION BRAND" : "CREATE NEW MEDIA BRAND"}
                </span>
                <h2>{isEditing ? `Edit ${formName}` : "Add Media Brand"}</h2>
              </div>
              <button className="mb-modal-close" onClick={() => setIsModalOpen(false)}>
                ×
              </button>
            </div>

            <form onSubmit={handleSave} className="mb-modal-form">
              <div className="mb-form-grid-2">
                {/* Brand Name */}
                <div className="mb-form-field">
                  <label>Media Brand Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CyberDefense Journal"
                    value={formName}
                    onChange={(e) => {
                      setFormName(e.target.value);
                      if (!isEditing) setFormSlug(generateSlug(e.target.value));
                    }}
                  />
                </div>

                {/* Slug / Route */}
                <div className="mb-form-field">
                  <label>Article Route Slug *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. cybersecurity-pipeline"
                    value={formSlug}
                    onChange={(e) => setFormSlug(generateSlug(e.target.value))}
                  />
                  <small className="field-hint">Generates route: /article/{formSlug || "your-slug"}</small>
                </div>
              </div>

              {/* Tagline / Badge */}
              <div className="mb-form-field">
                <label>Header Tagline / Domain Badge *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CYBERSECURITY & RISK MANAGEMENT"
                  value={formTagline}
                  onChange={(e) => setFormTagline(e.target.value)}
                />
              </div>

              {/* Description */}
              <div className="mb-form-field">
                <label>Brand Editorial Description *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Summarize the core focus of this media brand..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                />
              </div>

              <div className="mb-form-grid-2">
                {/* Target Audience */}
                <div className="mb-form-field">
                  <label>Target Audience Personas</label>
                  <input
                    type="text"
                    placeholder="e.g. CISOs, SecOps Teams & Compliance Committees"
                    value={formAudienceDesc}
                    onChange={(e) => setFormAudienceDesc(e.target.value)}
                  />
                </div>

                {/* Editor-in-Chief */}
                <div className="mb-form-field">
                  <label>Editor-in-Chief / Lead Contributor</label>
                  <input
                    type="text"
                    placeholder="e.g. Marcus Vance (Editor-in-Chief)"
                    value={formEditor}
                    onChange={(e) => setFormEditor(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-form-grid-3">
                {/* Publication Frequency */}
                <div className="mb-form-field">
                  <label>Dispatch Frequency</label>
                  <input
                    type="text"
                    placeholder="e.g. Weekly Executive Brief"
                    value={formFrequency}
                    onChange={(e) => setFormFrequency(e.target.value)}
                  />
                </div>

                {/* Subscriber Count */}
                <div className="mb-form-field">
                  <label>Reader Base / Metric</label>
                  <input
                    type="text"
                    placeholder="e.g. 19,200+ Leaders"
                    value={formSubscriberCount}
                    onChange={(e) => setFormSubscriberCount(e.target.value)}
                  />
                </div>

                {/* Status */}
                <div className="mb-form-field">
                  <label>Publication Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                  >
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* Brand Accent Color Swatches */}
              <div className="mb-form-field">
                <label>Brand Theme Color</label>
                <div className="mb-swatches-row">
                  {BRAND_COLOR_PRESETS.map((p) => (
                    <button
                      key={p.color}
                      type="button"
                      className={`mb-swatch-btn ${formColor === p.color ? "active" : ""}`}
                      style={{ background: p.color }}
                      title={p.name}
                      onClick={() => {
                        setFormColor(p.color);
                        setFormAccentColor(p.accent);
                      }}
                    />
                  ))}
                  <div className="mb-custom-color-input">
                    <input
                      type="color"
                      value={formColor}
                      onChange={(e) => setFormColor(e.target.value)}
                    />
                    <span>Custom</span>
                  </div>
                </div>
              </div>

              {/* Cover Image Selector */}
              <div className="mb-form-field">
                <label>Cover Banner Image URL</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={formCoverImage}
                  onChange={(e) => setFormCoverImage(e.target.value)}
                />
                <div className="mb-preset-covers-row">
                  {PRESET_COVERS.map((cov, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`mb-cover-thumb-btn ${formCoverImage === cov.url ? "selected" : ""}`}
                      onClick={() => setFormCoverImage(cov.url)}
                      title={cov.label}
                    >
                      <img src={cov.url} alt={cov.label} />
                      <span>{cov.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* ================= REFERENCE WEBSITES SUB-MANAGER ================= */}
              <div className="mb-reference-builder-box">
                <div className="builder-header">
                  <h4>Accredited Research Reference Websites</h4>
                  <small>Add external authority sites (e.g. Dark Reading, CSO Online, NIST, etc.)</small>
                </div>

                {refWebsites.length > 0 && (
                  <div className="builder-ref-list">
                    {refWebsites.map((ref, idx) => (
                      <div key={idx} className="builder-ref-item">
                        <div className="builder-ref-info">
                          <span className="ref-bold">{ref.name}</span>
                          <span className="ref-url">{ref.url}</span>
                          {ref.note && <span className="ref-note">({ref.note})</span>}
                        </div>
                        <button
                          type="button"
                          className="builder-ref-del-btn"
                          onClick={() => handleRemoveReference(idx)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="builder-add-row">
                  <input
                    type="text"
                    placeholder="Website Name (e.g. Dark Reading)"
                    value={newRefName}
                    onChange={(e) => setNewRefName(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="URL (e.g. https://www.darkreading.com)"
                    value={newRefUrl}
                    onChange={(e) => setNewRefUrl(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Research focus (e.g. Threat telemetry & SOC alerts)"
                    value={newRefNote}
                    onChange={(e) => setNewRefNote(e.target.value)}
                  />
                  <button
                    type="button"
                    className="builder-add-btn"
                    onClick={handleAddReference}
                  >
                    + Add Reference
                  </button>
                </div>
              </div>

              {/* Key Topics List */}
              <div className="mb-form-field">
                <label>Key Coverage Topics (one per line)</label>
                <textarea
                  rows={3}
                  placeholder="e.g.&#10;Zero Trust Architecture&#10;SecOps Alert Fatigue&#10;SEC 4-Day Incident Disclosures"
                  value={formKeyTopicsText}
                  onChange={(e) => setFormKeyTopicsText(e.target.value)}
                />
              </div>

              {/* Modal Buttons */}
              <div className="mb-modal-footer">
                <button
                  type="button"
                  className="mb-btn-cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="mb-btn-primary">
                  {isEditing ? "Save Brand Changes" : "Create Media Brand"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= COMPONENT STYLES ================= */}
      <style>{`
        .mb-manager-wrap {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .mb-header-card {
          background: linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(10, 16, 28, 0.98) 100%);
          border: 1px solid rgba(0, 210, 255, 0.25);
          border-radius: 16px;
          padding: 28px 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
          box-shadow: 0 12px 36px rgba(0, 0, 0, 0.45);
        }

        .mb-header-title-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
        }

        .mb-header-badge {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1px;
          color: #00D2FF;
          background: rgba(0, 210, 255, 0.12);
          border: 1px solid rgba(0, 210, 255, 0.3);
          border-radius: 4px;
          padding: 3px 8px;
        }

        .mb-network-status-live {
          font-size: 12px;
          font-weight: 600;
          color: #10B981;
        }

        .mb-header-content h2 {
          font-size: 26px;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0 0 8px 0;
        }

        .mb-header-content p {
          font-size: 14px;
          color: #94A3B8;
          max-width: 680px;
          margin: 0 0 20px 0;
          line-height: 1.5;
        }

        .mb-quick-stats-row {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .mb-stat-pill {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          padding: 6px 14px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .mb-stat-pill .stat-num {
          font-size: 15px;
          font-weight: 800;
          color: #00D2FF;
        }

        .mb-stat-pill .stat-label {
          font-size: 12px;
          color: #CBD5E1;
        }

        .mb-header-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
          flex-shrink: 0;
        }

        .mb-btn-primary {
          background: linear-gradient(135deg, #0046FC 0%, #0099FF 100%);
          color: #FFFFFF;
          border: none;
          border-radius: 8px;
          padding: 12px 22px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s ease;
          box-shadow: 0 4px 14px rgba(0, 70, 252, 0.4);
        }

        .mb-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 70, 252, 0.6);
        }

        .mb-btn-primary.small {
          padding: 8px 16px;
          font-size: 12px;
        }

        .mb-btn-secondary {
          background: rgba(255, 255, 255, 0.05);
          color: #CBD5E1;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 8px;
          padding: 10px 18px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all 0.2s ease;
        }

        .mb-btn-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #FFFFFF;
        }

        /* CONTROLS BAR */
        .mb-controls-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .mb-tabs-switch {
          display: flex;
          background: rgba(15, 23, 42, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          padding: 4px;
          gap: 4px;
        }

        .mb-tab-btn {
          background: transparent;
          border: none;
          color: #94A3B8;
          font-size: 13.5px;
          font-weight: 600;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s ease;
        }

        .mb-tab-btn.active {
          background: #0046FC;
          color: #FFFFFF;
          box-shadow: 0 2px 8px rgba(0, 70, 252, 0.35);
        }

        .mb-search-box {
          position: relative;
          min-width: 380px;
        }

        .mb-search-box .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 14px;
          color: #64748B;
        }

        .mb-search-box input {
          width: 100%;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 9px;
          padding: 9px 36px 9px 36px;
          color: #FFFFFF;
          font-size: 13.5px;
        }

        .mb-search-box input:focus {
          border-color: #00D2FF;
          outline: none;
        }

        .search-clear-btn {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #94A3B8;
          font-size: 18px;
          cursor: pointer;
        }

        /* BRANDS GRID */
        .mb-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
          gap: 22px;
        }

        .mb-brand-card {
          background: rgba(15, 23, 42, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          overflow: hidden;
          transition: all 0.25s ease;
          display: flex;
          flex-direction: column;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
        }

        .mb-brand-card:hover {
          border-color: rgba(0, 210, 255, 0.35);
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5);
        }

        .mb-brand-top-stripe {
          height: 5px;
          width: 100%;
        }

        .mb-brand-card-inner {
          padding: 22px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .mb-card-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .mb-brand-pill {
          font-size: 10.5px;
          font-weight: 800;
          letter-spacing: 0.8px;
          border: 1px solid;
          border-radius: 4px;
          padding: 3px 8px;
          text-transform: uppercase;
        }

        .mb-status-badge {
          font-size: 11px;
          font-weight: 700;
          border-radius: 12px;
          padding: 2px 10px;
          cursor: pointer;
          border: none;
        }

        .mb-status-badge.active {
          background: rgba(16, 185, 129, 0.15);
          color: #10B981;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .mb-status-badge.draft {
          background: rgba(245, 158, 11, 0.15);
          color: #F59E0B;
          border: 1px solid rgba(245, 158, 11, 0.3);
        }

        .mb-status-badge.archived {
          background: rgba(100, 116, 139, 0.2);
          color: #94A3B8;
        }

        .mb-brand-title {
          font-size: 20px;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0 0 8px 0;
        }

        .mb-brand-desc {
          font-size: 13px;
          color: #94A3B8;
          line-height: 1.5;
          margin: 0 0 16px 0;
        }

        .mb-audience-box {
          background: rgba(255, 255, 255, 0.03);
          border-left: 3px solid #00D2FF;
          padding: 8px 12px;
          border-radius: 0 6px 6px 0;
          margin-bottom: 16px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .audience-label {
          font-size: 10px;
          font-weight: 800;
          color: #64748B;
          letter-spacing: 0.5px;
        }

        .audience-val {
          font-size: 12px;
          color: #E2E8F0;
          font-weight: 600;
        }

        .mb-meta-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 16px;
        }

        .mb-meta-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .meta-k {
          font-size: 10.5px;
          color: #64748B;
          font-weight: 600;
        }

        .meta-v {
          font-size: 12px;
          color: #CBD5E1;
          font-weight: 700;
        }

        .meta-v.route-code {
          font-family: monospace;
          color: #38BDF8;
          font-size: 11px;
        }

        /* REFERENCES SECTION */
        .mb-references-section {
          background: rgba(0, 70, 252, 0.07);
          border: 1px solid rgba(0, 210, 255, 0.18);
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 16px;
        }

        .references-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 11.5px;
          font-weight: 700;
          color: #00D2FF;
          margin-bottom: 8px;
        }

        .ref-count-tag {
          font-size: 10px;
          color: #94A3B8;
          background: rgba(255, 255, 255, 0.06);
          padding: 1px 6px;
          border-radius: 4px;
        }

        .references-list {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .ref-chip {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 6px;
          padding: 3px 8px;
          font-size: 11.5px;
          color: #F1F5F9;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: all 0.2s ease;
        }

        .ref-chip:hover {
          background: rgba(0, 210, 255, 0.2);
          border-color: #00D2FF;
          color: #FFFFFF;
        }

        .ref-ext-icon {
          font-size: 10px;
          color: #00D2FF;
        }

        .no-refs {
          font-size: 11.5px;
          color: #64748B;
          font-style: italic;
        }

        /* KEY TOPICS */
        .mb-topics-section {
          margin-bottom: 20px;
        }

        .topics-label {
          display: block;
          font-size: 11px;
          font-weight: 700;
          color: #64748B;
          margin-bottom: 6px;
        }

        .topics-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
        }

        .topic-pill {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 4px;
          padding: 2px 7px;
          font-size: 11px;
          color: #94A3B8;
        }

        /* CARD ACTIONS */
        .mb-card-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: auto;
          padding-top: 14px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }

        .mb-card-edit-btn {
          flex: 1;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #FFFFFF;
          border-radius: 7px;
          padding: 8px 12px;
          font-size: 12.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .mb-card-edit-btn:hover {
          background: rgba(0, 70, 252, 0.3);
          border-color: #0046FC;
        }

        .mb-card-view-btn {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 7px;
          padding: 8px 12px;
          font-size: 12px;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .mb-card-view-btn:hover {
          background: rgba(255, 255, 255, 0.08);
        }

        .mb-card-del-btn {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.25);
          color: #EF4444;
          border-radius: 7px;
          padding: 8px 10px;
          cursor: pointer;
          font-size: 13px;
          transition: all 0.2s ease;
        }

        .mb-card-del-btn:hover {
          background: rgba(239, 68, 68, 0.25);
        }

        /* TAB 2: ARTICLES */
        .mb-articles-view {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .mb-article-brand-pills {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .filter-lead {
          font-size: 12px;
          font-weight: 700;
          color: #64748B;
        }

        .mb-filter-pill {
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #94A3B8;
          font-size: 12px;
          font-weight: 600;
          padding: 5px 12px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .mb-filter-pill.active {
          background: #00D2FF;
          color: #060B12;
          border-color: #00D2FF;
          font-weight: 700;
        }

        .mb-articles-table-wrap {
          background: rgba(15, 23, 42, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 20px;
          overflow-x: auto;
        }

        .mb-articles-table-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .mb-articles-table-header h3 {
          font-size: 16px;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0;
        }

        .mb-articles-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .mb-articles-table th {
          padding: 10px 14px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.5px;
          color: #64748B;
          text-transform: uppercase;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .mb-articles-table td {
          padding: 14px;
          font-size: 13px;
          color: #CBD5E1;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }

        .art-title-cell strong {
          color: #FFFFFF;
          display: block;
          font-size: 13.5px;
          margin-bottom: 4px;
        }

        .art-sub-desc {
          font-size: 11.5px;
          color: #94A3B8;
          margin: 0;
          line-height: 1.4;
          max-width: 520px;
        }

        .art-cat-badge {
          background: rgba(0, 210, 255, 0.12);
          border: 1px solid rgba(0, 210, 255, 0.25);
          color: #00D2FF;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 4px;
          display: inline-block;
        }

        .art-action-link {
          color: #00D2FF;
          text-decoration: none;
          font-weight: 700;
          font-size: 12px;
        }

        .art-action-link:hover {
          text-decoration: underline;
        }

        .art-action-edit-btn,
        .art-action-del-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #CBD5E1;
          border-radius: 6px;
          padding: 4px 8px;
          font-size: 11px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .art-action-edit-btn:hover {
          background: rgba(0, 85, 255, 0.25);
          border-color: #0055FF;
          color: #FFFFFF;
        }

        .art-action-del-btn:hover {
          background: rgba(239, 68, 68, 0.25);
          border-color: #EF4444;
          color: #FCA5A5;
        }

        /* MODAL */
        .mb-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(8px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .mb-modal-container {
          background: #0B1322;
          border: 1px solid rgba(0, 210, 255, 0.3);
          border-radius: 16px;
          width: 100%;
          max-width: 780px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.8);
        }

        .mb-modal-header {
          padding: 20px 26px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .mb-modal-badge {
          font-size: 10px;
          font-weight: 800;
          color: #00D2FF;
          letter-spacing: 1px;
        }

        .mb-modal-header h2 {
          font-size: 20px;
          color: #FFFFFF;
          margin: 4px 0 0 0;
        }

        .mb-modal-close {
          background: none;
          border: none;
          color: #94A3B8;
          font-size: 24px;
          cursor: pointer;
        }

        .mb-modal-form {
          padding: 24px 26px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .mb-form-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .mb-form-grid-3 {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 16px;
        }

        .mb-form-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .mb-form-field label {
          font-size: 12px;
          font-weight: 700;
          color: #CBD5E1;
        }

        .mb-form-field input,
        .mb-form-field textarea,
        .mb-form-field select {
          background: rgba(15, 23, 42, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 8px;
          padding: 9px 12px;
          color: #FFFFFF;
          font-size: 13px;
        }

        .mb-form-field input:focus,
        .mb-form-field textarea:focus,
        .mb-form-field select:focus {
          border-color: #00D2FF;
          outline: none;
        }

        .field-hint {
          font-size: 11px;
          color: #64748B;
        }

        /* SWATCHES */
        .mb-swatches-row {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .mb-swatch-btn {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 2px solid transparent;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .mb-swatch-btn:hover {
          transform: scale(1.15);
        }

        .mb-swatch-btn.active {
          border-color: #FFFFFF;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
          transform: scale(1.15);
        }

        .mb-custom-color-input {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #94A3B8;
        }

        .mb-custom-color-input input[type="color"] {
          width: 28px;
          height: 28px;
          padding: 0;
          border: none;
          background: none;
          cursor: pointer;
        }

        /* PRESET COVERS */
        .mb-preset-covers-row {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 8px;
          margin-top: 6px;
        }

        .mb-cover-thumb-btn {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          overflow: hidden;
          cursor: pointer;
          padding: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: all 0.2s ease;
        }

        .mb-cover-thumb-btn.selected {
          border-color: #00D2FF;
          box-shadow: 0 0 8px rgba(0, 210, 255, 0.4);
        }

        .mb-cover-thumb-btn img {
          width: 100%;
          height: 44px;
          object-fit: cover;
        }

        .mb-cover-thumb-btn span {
          font-size: 9px;
          color: #94A3B8;
          padding: 3px 2px;
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 100%;
        }

        /* REFERENCE BUILDER */
        .mb-reference-builder-box {
          background: rgba(0, 70, 252, 0.08);
          border: 1px solid rgba(0, 210, 255, 0.25);
          border-radius: 10px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .builder-header h4 {
          font-size: 13.5px;
          font-weight: 700;
          color: #00D2FF;
          margin: 0;
        }

        .builder-header small {
          font-size: 11px;
          color: #94A3B8;
        }

        .builder-ref-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .builder-ref-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 6px;
          padding: 7px 12px;
        }

        .builder-ref-info {
          display: flex;
          gap: 8px;
          align-items: center;
          font-size: 12px;
          flex-wrap: wrap;
        }

        .ref-bold {
          color: #FFFFFF;
          font-weight: 700;
        }

        .ref-url {
          color: #38BDF8;
          font-size: 11px;
        }

        .ref-note {
          color: #94A3B8;
          font-size: 11px;
        }

        .builder-ref-del-btn {
          background: none;
          border: none;
          color: #EF4444;
          font-size: 14px;
          cursor: pointer;
          padding: 2px 6px;
        }

        .builder-add-row {
          display: grid;
          grid-template-columns: 1fr 1.2fr 1.5fr auto;
          gap: 8px;
        }

        .builder-add-row input {
          background: rgba(15, 23, 42, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 6px;
          padding: 7px 10px;
          color: #FFFFFF;
          font-size: 12px;
        }

        .builder-add-btn {
          background: #0046FC;
          color: #FFFFFF;
          border: none;
          border-radius: 6px;
          padding: 7px 14px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
        }

        .builder-add-btn:hover {
          background: #0036CC;
        }

        .mb-modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          padding-top: 14px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .mb-btn-cancel {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #CBD5E1;
          border-radius: 8px;
          padding: 9px 18px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }

        .mb-empty-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: 50px 20px;
          background: rgba(15, 23, 42, 0.5);
          border: 1px dashed rgba(255, 255, 255, 0.1);
          border-radius: 12px;
        }

        .empty-icon {
          font-size: 36px;
          margin-bottom: 12px;
        }

        .mb-empty-state h3 {
          color: #FFFFFF;
          font-size: 18px;
          margin-bottom: 6px;
        }

        .mb-empty-state p {
          color: #94A3B8;
          font-size: 13px;
          margin-bottom: 18px;
        }

        @media (max-width: 900px) {
          .mb-header-card {
            flex-direction: column;
            align-items: flex-start;
          }
          .mb-search-box {
            min-width: 100%;
          }
          .builder-add-row {
            grid-template-columns: 1fr;
          }
          .mb-preset-covers-row {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>
    </div>
  );
};

export default MediaBrandManager;

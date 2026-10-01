import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  caseStudiesStorageApi,
  type CaseStudyData,
} from "../../services/api";

interface CaseStudyManagerProps {
  caseStudies: any[];
  onCaseStudiesChange: (updated: any[]) => void;
  showToast: (msg: string) => void;
}

const PRESET_COVERS = [
  {
    label: "Team Collaboration",
    url: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=90",
  },
  {
    label: "Modern Office",
    url: "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=1600&q=90",
  },
  {
    label: "Conference Room",
    url: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=90",
  },
  {
    label: "Analytics & Data",
    url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=90",
  },
  {
    label: "Tech Workspace",
    url: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1600&q=90",
  },
];

export const CaseStudyManager: React.FC<CaseStudyManagerProps> = ({
  caseStudies,
  onCaseStudiesChange,
  showToast,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [client, setClient] = useState("");
  const [metric, setMetric] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [profile, setProfile] = useState("");
  const [objective, setObjective] = useState("");
  const [owned, setOwned] = useState("");
  const [clientOwned, setClientOwned] = useState("");

  // Stats (4 key metrics)
  const [stat1Val, setStat1Val] = useState("1,500+");
  const [stat1Lbl, setStat1Lbl] = useState("Prospects identified and engaged");
  const [stat2Val, setStat2Val] = useState("192");
  const [stat2Lbl, setStat2Lbl] = useState("Webinar registrations");
  const [stat3Val, setStat3Val] = useState("23");
  const [stat3Lbl, setStat3Lbl] = useState("Attendees");
  const [stat4Val, setStat4Val] = useState("12%");
  const [stat4Lbl, setStat4Lbl] = useState("Attendance rate");

  // Multiline specs & execution
  const [specText, setSpecText] = useState("");
  const [executedText, setExecutedText] = useState("");

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEditing) {
      setSlug(generateSlug(val));
    }
  };

  const openAddModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setTitle("");
    setSlug("");
    setClient("Enterprise Technology Client");
    setMetric("100+ Qualified Leads");
    setDescription("");
    setImage(PRESET_COVERS[0].url);
    setProfile("Enterprise B2B technology provider targeting IT and Operations decision-makers.");
    setObjective("Generate sales-ready pipeline through targeted outreach and qualification.");
    setOwned("Prospect identification, outreach, follow-up, and lead delivery.");
    setClientOwned("Sales follow-up after lead handoff, demo presentations, and contract negotiations.");
    setStat1Val("1,200+");
    setStat1Lbl("Contacts Validated");
    setStat2Val("150");
    setStat2Lbl("Qualified Leads");
    setStat3Val("35");
    setStat3Lbl("Meetings Booked");
    setStat4Val("98%");
    setStat4Lbl("Data Accuracy");
    setSpecText(
      "Audience: Technology professionals in North America\nSeniority: Director and VP-level\nCompany size: 250+ employees\nChannel: Tele-calling and email outreach"
    );
    setExecutedText(
      "Verified target prospect database against custom criteria\nExecuted multi-touch personalized outreach cadence\nApplied qualification framework before lead handoff\nDelivered structured lead reporting to client"
    );
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setIsEditing(true);
    setEditingId(item._id || item.slug);
    setTitle(item.title || "");
    setSlug(item.slug || generateSlug(item.title || ""));
    setClient(item.client || item.profile || "Enterprise Client");
    setMetric(item.metric || (item.stats && item.stats[0] ? item.stats[0][0] : "Verified Result"));
    setDescription(item.description || "");
    setImage(item.image || PRESET_COVERS[0].url);
    setProfile(item.profile || "");
    setObjective(item.objective || "");
    setOwned(item.owned || "Prospect identification, outreach, and lead delivery.");
    setClientOwned(item.clientOwned || item.client || "Sales follow-up after lead handoff.");

    const stats = item.stats || [];
    setStat1Val(stats[0] ? stats[0][0] : "");
    setStat1Lbl(stats[0] ? stats[0][1] : "");
    setStat2Val(stats[1] ? stats[1][0] : "");
    setStat2Lbl(stats[1] ? stats[1][1] : "");
    setStat3Val(stats[2] ? stats[2][0] : "");
    setStat3Lbl(stats[2] ? stats[2][1] : "");
    setStat4Val(stats[3] ? stats[3][0] : "");
    setStat4Lbl(stats[3] ? stats[3][1] : "");

    setSpecText(Array.isArray(item.spec) ? item.spec.join("\n") : (item.spec || ""));
    setExecutedText(Array.isArray(item.executed) ? item.executed.join("\n") : (item.executed || ""));
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Please enter a case study title.");
      return;
    }

    const finalSlug = slug.trim() || generateSlug(title);
    const finalImage =
      image.trim() ||
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=90";

    const statsList: [string, string][] = [];
    if (stat1Val.trim()) statsList.push([stat1Val.trim(), stat1Lbl.trim() || "Result"]);
    if (stat2Val.trim()) statsList.push([stat2Val.trim(), stat2Lbl.trim() || "Metric"]);
    if (stat3Val.trim()) statsList.push([stat3Val.trim(), stat3Lbl.trim() || "Metric"]);
    if (stat4Val.trim()) statsList.push([stat4Val.trim(), stat4Lbl.trim() || "Rate"]);

    const specLines = specText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    const execLines = executedText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const studyPayload: CaseStudyData = {
      _id: isEditing && editingId ? editingId : `cs_${Date.now()}`,
      slug: finalSlug,
      title: title.trim(),
      client: client.trim() || "Enterprise Client",
      metric: metric.trim() || (statsList[0] ? statsList[0][0] : "Verified"),
      description: description.trim() || "Verified B2B lead generation case study.",
      image: finalImage,
      profile: profile.trim() || "B2B Technology Client",
      objective: objective.trim() || "Pipeline generation and lead qualification.",
      stats: statsList.length > 0 ? statsList : [["100+", "Verified Leads"]],
      spec: specLines.length > 0 ? specLines : ["Target: B2B Technology Decision-Makers"],
      executed: execLines.length > 0 ? execLines : ["Executed targeted multi-channel outreach cadence"],
      owned: owned.trim() || "Audience research, tele-calling, and qualification.",
      clientOwned: clientOwned.trim() || "Sales engagement after lead delivery.",
    };

    let updatedList: any[];
    if (isEditing && editingId) {
      updatedList = caseStudies.map((cs) =>
        (cs._id && cs._id === editingId) || cs.slug === editingId || cs.slug === finalSlug
          ? { ...cs, ...studyPayload }
          : cs
      );
      showToast(`Updated "${studyPayload.title}"!`);
    } else {
      updatedList = [studyPayload, ...caseStudies];
      showToast(`Added new case study "${studyPayload.title}"!`);
    }

    onCaseStudiesChange(updatedList);
    caseStudiesStorageApi.saveAll(updatedList);
    setIsModalOpen(false);
  };

  const handleDelete = (item: any) => {
    const name = item.title || "this case study";
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    if (caseStudies.length <= 1) {
      alert("You must keep at least one case study published.");
      return;
    }

    const updated = caseStudies.filter(
      (cs) => cs._id !== item._id && cs.slug !== item.slug
    );
    onCaseStudiesChange(updated);
    caseStudiesStorageApi.saveAll(updated);
    showToast(`Deleted "${name}".`);
  };

  const handleResetDefaults = () => {
    if (
      !window.confirm(
        "Reset all case studies back to original publication default studies?"
      )
    )
      return;

    const reset = caseStudiesStorageApi.resetDefaults();
    onCaseStudiesChange(reset);
    showToast("Reset case studies to defaults successfully!");
  };

  // Filter list
  const filteredStudies = caseStudies.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (item.title || "").toLowerCase().includes(q) ||
      (item.client || "").toLowerCase().includes(q) ||
      (item.metric || "").toLowerCase().includes(q) ||
      (item.description || "").toLowerCase().includes(q)
    );
  });

  return (
    <section className="cs-manager-panel">
      {/* Top Banner */}
      <div className="cs-manager-header">
        <div className="cs-header-left">
          <span className="cs-header-badge">PROVEN CLIENT RESULTS</span>
          <h2>Case Studies Management</h2>
          <p>
            Create, edit, and organize verified client success stories and pipeline performance metrics published across the website.
          </p>
        </div>

        <div className="cs-header-actions">
          <button
            type="button"
            className="cs-btn-reset"
            onClick={handleResetDefaults}
            title="Restore original case study showcase"
          >
            ↺ Reset Defaults
          </button>
          <button type="button" className="cs-btn-add" onClick={openAddModal}>
            + Add Case Study
          </button>
        </div>
      </div>

      {/* Metrics Highlights Bar */}
      <div className="cs-stats-bar">
        <div className="cs-stat-box">
          <span className="cs-stat-num">{caseStudies.length}</span>
          <span className="cs-stat-lbl">Published Studies</span>
        </div>
        <div className="cs-stat-box">
          <span className="cs-stat-num">
            {caseStudies.reduce((acc, curr) => {
              const s = curr.stats && curr.stats[0] ? curr.stats[0][0] : "";
              return s ? acc + 1 : acc;
            }, 0)}
          </span>
          <span className="cs-stat-lbl">Verified KPI Sets</span>
        </div>
        <div className="cs-stat-box">
          <span className="cs-stat-num">100%</span>
          <span className="cs-stat-lbl">Client Anonymized / Verified</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="cs-search-row">
        <div className="cs-search-input-wrap">
          <span className="cs-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by case study title, client, or metric..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="cs-search-clear"
              onClick={() => setSearchQuery("")}
            >
              ✕
            </button>
          )}
        </div>
        <span className="cs-count-tag">
          Showing {filteredStudies.length} of {caseStudies.length}
        </span>
      </div>

      {/* 3-Column Case Studies Cards Grid (Matching Website UI) */}
      <div className="cs-grid">
        {filteredStudies.length === 0 ? (
          <div className="cs-empty-state">
            <p>No case studies match your search "{searchQuery}".</p>
            <button onClick={() => setSearchQuery("")}>Clear Search</button>
          </div>
        ) : (
          filteredStudies.map((item, index) => {
            const displayMetric =
              item.metric ||
              (item.stats && item.stats[0] ? item.stats[0][0] : "Verified");

            return (
              <article className="cs-card" key={item._id || item.slug || index}>
                <div className="cs-card-image-wrap">
                  <img
                    src={
                      item.image ||
                      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=90"
                    }
                    alt={item.title}
                    loading="lazy"
                  />
                  <span className="cs-card-badge-tag">CASE STUDY</span>
                  {displayMetric && (
                    <span className="cs-card-stat-pill">{displayMetric}</span>
                  )}
                </div>

                <div className="cs-card-body">
                  <span className="cs-card-kicker">
                    {item.client || "Client Success Story"}
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>

                  {item.stats && item.stats.length > 0 && (
                    <div className="cs-metrics-row">
                      {item.stats.slice(0, 2).map(([val, lbl]: [string, string], i: number) => (
                        <div key={val + lbl + i} className="cs-mini-metric">
                          <strong>{val}</strong>
                          <small>{lbl}</small>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="cs-card-actions">
                    <Link
                      to={`/case-studies/${item.slug || ""}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cs-card-view-btn"
                      title="View case study on live website"
                    >
                      🌐 View Live ↗
                    </Link>

                    <div className="cs-btn-group">
                      <button
                        type="button"
                        className="cs-edit-btn"
                        onClick={() => openEditModal(item)}
                        title="Edit Case Study"
                      >
                        ✎ Edit
                      </button>
                      <button
                        type="button"
                        className="cs-delete-btn"
                        onClick={() => handleDelete(item)}
                        title="Delete Case Study"
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* ================= MODAL: ADD / EDIT CASE STUDY ================= */}
      {isModalOpen && (
        <div className="cs-modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="cs-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="cs-modal-header">
              <div>
                <span className="cs-modal-tag">
                  {isEditing ? "EDIT CASE STUDY" : "NEW CASE STUDY"}
                </span>
                <h2>
                  {isEditing ? "Edit Case Study" : "Add New Case Study"}
                </h2>
                <p>
                  Updates will immediately reflect on the live website under Case Studies.
                </p>
              </div>
              <button
                className="cs-modal-close"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="cs-modal-form">
              {/* Title & Slug */}
              <div className="form-field full-width">
                <label htmlFor="cs-title">
                  Case Study Title <span className="req">*</span>
                </label>
                <input
                  id="cs-title"
                  type="text"
                  required
                  placeholder="e.g. Targeted BANT Lead Generation for Enterprise Platform"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label htmlFor="cs-client">Client / Industry Tag</label>
                <input
                  id="cs-client"
                  type="text"
                  placeholder="e.g. Global Automation Software"
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label htmlFor="cs-metric">Top-Right Stat Pill</label>
                <input
                  id="cs-metric"
                  type="text"
                  placeholder="e.g. 125 BANT Leads, 1,500+, 92 SQLs"
                  value={metric}
                  onChange={(e) => setMetric(e.target.value)}
                />
              </div>

              <div className="form-field full-width">
                <label htmlFor="cs-slug">URL Slug</label>
                <input
                  id="cs-slug"
                  type="text"
                  placeholder="e.g. bant-lead-generation-enterprise-automation"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                />
                <small className="field-hint">
                  Live link: <code>/case-studies/{slug || "slug"}</code>
                </small>
              </div>

              {/* Cover Image with System Upload */}
              <div className="form-field full-width">
                <label htmlFor="cs-image">Cover Image</label>
                <div className="modal-image-row">
                  <input
                    id="cs-image"
                    type="url"
                    placeholder="Paste image URL (https://...)"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
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
                            setImage(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>

                {/* Preset Chips */}
                <div className="presets-row">
                  <span className="presets-label">Quick Presets:</span>
                  {PRESET_COVERS.map((preset) => (
                    <button
                      type="button"
                      key={preset.label}
                      className={`preset-chip ${image === preset.url ? "selected" : ""}`}
                      onClick={() => setImage(preset.url)}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                {/* Image Preview */}
                {image && (
                  <div className="image-preview-bar">
                    <img
                      src={image}
                      alt="Cover Preview"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=90";
                      }}
                    />
                    <div className="preview-info">
                      <span>Cover Preview</span>
                      <small>Resolution adapts automatically</small>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="form-field full-width">
                <label htmlFor="cs-desc">Summary Description</label>
                <textarea
                  id="cs-desc"
                  rows={3}
                  placeholder="Overview of the client problem, GETprospeKt execution, and final delivered results..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Key Verified Stats (4 slots) */}
              <div className="form-field full-width stats-subform">
                <label>Verified Metrics (Up to 4 Metrics)</label>
                <div className="stats-inputs-grid">
                  <div className="stat-input-pair">
                    <input
                      type="text"
                      placeholder="Value (e.g. 1,500+)"
                      value={stat1Val}
                      onChange={(e) => setStat1Val(e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Label (e.g. Prospects identified)"
                      value={stat1Lbl}
                      onChange={(e) => setStat1Lbl(e.target.value)}
                    />
                  </div>
                  <div className="stat-input-pair">
                    <input
                      type="text"
                      placeholder="Value (e.g. 192)"
                      value={stat2Val}
                      onChange={(e) => setStat2Val(e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Label (e.g. Webinar registrations)"
                      value={stat2Lbl}
                      onChange={(e) => setStat2Lbl(e.target.value)}
                    />
                  </div>
                  <div className="stat-input-pair">
                    <input
                      type="text"
                      placeholder="Value (e.g. 23)"
                      value={stat3Val}
                      onChange={(e) => setStat3Val(e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Label (e.g. Attendees)"
                      value={stat3Lbl}
                      onChange={(e) => setStat3Lbl(e.target.value)}
                    />
                  </div>
                  <div className="stat-input-pair">
                    <input
                      type="text"
                      placeholder="Value (e.g. 12%)"
                      value={stat4Val}
                      onChange={(e) => setStat4Val(e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Label (e.g. Attendance rate)"
                      value={stat4Lbl}
                      onChange={(e) => setStat4Lbl(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Detailed Editorial Sections */}
              <div className="form-field">
                <label htmlFor="cs-profile">Client Profile</label>
                <textarea
                  id="cs-profile"
                  rows={2}
                  placeholder="Organizer or company background..."
                  value={profile}
                  onChange={(e) => setProfile(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label htmlFor="cs-objective">Campaign Objective</label>
                <textarea
                  id="cs-objective"
                  rows={2}
                  placeholder="Target goal or challenge..."
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label htmlFor="cs-spec">
                  Audience &amp; Specification (One per line)
                </label>
                <textarea
                  id="cs-spec"
                  rows={3}
                  placeholder="Audience: Technology professionals in the United States&#10;Seniority: Director and VP&#10;Company size: 500+ employees"
                  value={specText}
                  onChange={(e) => setSpecText(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label htmlFor="cs-exec">
                  Execution &amp; Delivery (One per line)
                </label>
                <textarea
                  id="cs-exec"
                  rows={3}
                  placeholder="Identified and reviewed prospect data&#10;Personalized email and tele-calling outreach&#10;Delivered qualified leads"
                  value={executedText}
                  onChange={(e) => setExecutedText(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label htmlFor="cs-owned">GETprospeKt Owned Scope</label>
                <input
                  id="cs-owned"
                  type="text"
                  placeholder="Prospect identification, outreach, and qualification."
                  value={owned}
                  onChange={(e) => setOwned(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label htmlFor="cs-client-owned">Client Owned Scope</label>
                <input
                  id="cs-client-owned"
                  type="text"
                  placeholder="Sales follow-up after lead handoff."
                  value={clientOwned}
                  onChange={(e) => setClientOwned(e.target.value)}
                />
              </div>

              {/* Actions */}
              <div className="modal-actions-bar full-width">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  {isEditing ? "Save Changes" : "Publish Case Study"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Scoped CSS */}
      <style>{`
        .cs-manager-panel {
          width: 100%;
          animation: csFadeIn 0.3s ease-out;
        }

        @keyframes csFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .cs-manager-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .cs-header-badge {
          display: inline-block;
          font-size: 11px;
          font-weight: 800;
          color: #00D2FF;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          background: rgba(0, 70, 252, 0.14);
          border: 1px solid rgba(0, 210, 255, 0.25);
          padding: 4px 12px;
          border-radius: 12px;
          margin-bottom: 8px;
        }

        .cs-header-left h2 {
          font-size: 24px;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0 0 6px;
        }

        .cs-header-left p {
          color: #94A3B8;
          font-size: 13.5px;
          margin: 0;
          max-width: 620px;
        }

        .cs-header-actions {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .cs-btn-reset {
          padding: 10px 16px;
          background: #0B1120;
          border: 1px solid rgba(203, 213, 225, 0.18);
          border-radius: 8px;
          color: #94A3B8;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .cs-btn-reset:hover {
          color: #FFFFFF;
          border-color: rgba(203, 213, 225, 0.4);
          background: #111827;
        }

        .cs-btn-add {
          padding: 10px 20px;
          background: #0046FC;
          border: none;
          border-radius: 8px;
          color: #FFFFFF;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(0, 70, 252, 0.4);
          transition: all 0.2s ease;
        }

        .cs-btn-add:hover {
          background: #0038D1;
          transform: translateY(-1px);
        }

        /* Stats Bar */
        .cs-stats-bar {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        @media (max-width: 768px) {
          .cs-stats-bar {
            grid-template-columns: 1fr;
          }
        }

        .cs-stat-box {
          background: #0B1120;
          border: 1px solid rgba(203, 213, 225, 0.12);
          border-radius: 8px;
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
        }

        .cs-stat-num {
          font-size: 24px;
          font-weight: 800;
          color: #00D2FF;
          line-height: 1.2;
        }

        .cs-stat-lbl {
          font-size: 12px;
          color: #94A3B8;
          margin-top: 4px;
        }

        /* Search Row */
        .cs-search-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 22px;
          flex-wrap: wrap;
        }

        .cs-search-input-wrap {
          flex: 1;
          min-width: 260px;
          max-width: 500px;
          position: relative;
        }

        .cs-search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 14px;
          color: #64748B;
        }

        .cs-search-input-wrap input {
          width: 100%;
          background: #0B1120;
          border: 1px solid rgba(203, 213, 225, 0.16);
          border-radius: 8px;
          padding: 10px 36px 10px 36px;
          color: #FFFFFF;
          font-size: 13.5px;
          outline: none;
          transition: border-color 0.2s;
        }

        .cs-search-input-wrap input:focus {
          border-color: #00D2FF;
        }

        .cs-search-clear {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          color: #94A3B8;
          cursor: pointer;
          font-size: 13px;
        }

        .cs-count-tag {
          font-size: 12px;
          color: #64748B;
          font-weight: 600;
        }

        /* Cards Grid */
        .cs-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
        }

        @media (max-width: 1100px) {
          .cs-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 680px) {
          .cs-grid {
            grid-template-columns: 1fr;
          }
        }

        .cs-card {
          background: #0B1120;
          border: 1px solid rgba(203, 213, 225, 0.12);
          border-top: 3px solid #0046FC;
          border-radius: 8px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.35);
          transition: all 0.25s ease;
        }

        .cs-card:hover {
          transform: translateY(-4px);
          border-color: #00D2FF;
          border-top-color: #00D2FF;
          box-shadow: 0 12px 28px rgba(0, 70, 252, 0.25);
        }

        .cs-card-image-wrap {
          position: relative;
          height: 180px;
          overflow: hidden;
          background: #060B12;
        }

        .cs-card-image-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .cs-card:hover .cs-card-image-wrap img {
          transform: scale(1.05);
        }

        .cs-card-badge-tag {
          position: absolute;
          top: 10px;
          left: 10px;
          background: rgba(0, 70, 252, 0.92);
          color: #FFFFFF;
          font-size: 10.5px;
          font-weight: 800;
          letter-spacing: 0.5px;
          padding: 3px 9px;
          border-radius: 4px;
        }

        .cs-card-stat-pill {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(0, 210, 255, 0.95);
          color: #060B12;
          font-size: 11.5px;
          font-weight: 800;
          padding: 3px 10px;
          border-radius: 12px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
        }

        .cs-card-body {
          padding: 18px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .cs-card-kicker {
          font-size: 11px;
          font-weight: 800;
          color: #00D2FF;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 6px;
        }

        .cs-card-body h3 {
          margin: 0 0 8px;
          font-size: 16px;
          font-weight: 700;
          color: #FFFFFF;
          line-height: 1.35;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .cs-card-body p {
          margin: 0 0 14px;
          font-size: 13px;
          color: #94A3B8;
          line-height: 1.45;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .cs-metrics-row {
          display: flex;
          gap: 10px;
          margin-bottom: 16px;
          padding: 8px 10px;
          background: #060B12;
          border: 1px solid rgba(203, 213, 225, 0.08);
          border-radius: 6px;
        }

        .cs-mini-metric {
          flex: 1;
        }

        .cs-mini-metric strong {
          display: block;
          font-size: 13px;
          color: #00D2FF;
          font-weight: 800;
        }

        .cs-mini-metric small {
          font-size: 10px;
          color: #94A3B8;
          display: block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .cs-card-actions {
          margin-top: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding-top: 12px;
          border-top: 1px solid rgba(203, 213, 225, 0.1);
        }

        .cs-card-view-btn {
          color: #00D2FF;
          font-size: 12px;
          font-weight: 700;
          text-decoration: none;
          padding: 6px 10px;
          border-radius: 5px;
          background: rgba(0, 70, 252, 0.1);
          border: 1px solid rgba(0, 210, 255, 0.25);
          transition: all 0.2s;
        }

        .cs-card-view-btn:hover {
          background: rgba(0, 70, 252, 0.25);
          border-color: #00D2FF;
          color: #FFFFFF;
        }

        .cs-btn-group {
          display: flex;
          gap: 6px;
        }

        .cs-edit-btn {
          padding: 6px 12px;
          background: #1E293B;
          border: 1px solid rgba(203, 213, 225, 0.2);
          border-radius: 5px;
          color: #FFFFFF;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }

        .cs-edit-btn:hover {
          background: #0046FC;
          border-color: #0046FC;
        }

        .cs-delete-btn {
          padding: 6px 9px;
          background: rgba(239, 68, 68, 0.12);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 5px;
          color: #F87171;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .cs-delete-btn:hover {
          background: rgba(239, 68, 68, 0.3);
          color: #FFFFFF;
        }

        .cs-empty-state {
          grid-column: 1 / -1;
          padding: 50px 20px;
          text-align: center;
          color: #94A3B8;
        }

        .cs-empty-state button {
          margin-top: 10px;
          padding: 8px 16px;
          background: #0046FC;
          border: none;
          border-radius: 6px;
          color: #FFFFFF;
          cursor: pointer;
        }

        /* Modal Styles */
        .cs-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(3, 7, 18, 0.85);
          backdrop-filter: blur(6px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .cs-modal-box {
          background: #0B1120;
          border: 1px solid rgba(0, 210, 255, 0.3);
          border-radius: 12px;
          width: 100%;
          max-width: 820px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7);
        }

        .cs-modal-header {
          padding: 24px 28px 18px;
          border-bottom: 1px solid rgba(203, 213, 225, 0.12);
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
        }

        .cs-modal-tag {
          font-size: 10.5px;
          font-weight: 800;
          color: #00D2FF;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .cs-modal-header h2 {
          font-size: 20px;
          font-weight: 800;
          color: #FFFFFF;
          margin: 4px 0 4px;
        }

        .cs-modal-header p {
          color: #94A3B8;
          font-size: 13px;
          margin: 0;
        }

        .cs-modal-close {
          background: transparent;
          border: none;
          color: #94A3B8;
          font-size: 18px;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 4px;
        }

        .cs-modal-close:hover {
          color: #FFFFFF;
          background: rgba(255, 255, 255, 0.08);
        }

        .cs-modal-form {
          padding: 24px 28px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        @media (max-width: 640px) {
          .cs-modal-form {
            grid-template-columns: 1fr;
          }
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-field.full-width {
          grid-column: 1 / -1;
        }

        .form-field label {
          font-size: 12px;
          font-weight: 700;
          color: #CBD5E1;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .form-field .req {
          color: #F87171;
        }

        .form-field input,
        .form-field textarea {
          background: #060B12;
          border: 1px solid rgba(203, 213, 225, 0.16);
          border-radius: 6px;
          padding: 9px 12px;
          color: #FFFFFF;
          font-size: 13px;
          outline: none;
          font-family: inherit;
        }

        .form-field input:focus,
        .form-field textarea:focus {
          border-color: #00D2FF;
        }

        .field-hint {
          font-size: 11px;
          color: #64748B;
        }

        .field-hint code {
          color: #00D2FF;
        }

        /* Image upload row */
        .modal-image-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .modal-image-input {
          flex: 1;
        }

        .or-divider {
          font-size: 11px;
          font-weight: 800;
          color: #64748B;
        }

        .upload-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #1E293B;
          border: 1px solid rgba(0, 210, 255, 0.3);
          border-radius: 6px;
          padding: 9px 14px;
          color: #00D2FF;
          font-size: 12.5px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s;
        }

        .upload-btn:hover {
          background: rgba(0, 70, 252, 0.25);
          border-color: #00D2FF;
          color: #FFFFFF;
        }

        .presets-row {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 8px;
        }

        .presets-label {
          font-size: 11.5px;
          color: #94A3B8;
        }

        .preset-chip {
          padding: 4px 10px;
          background: #060B12;
          border: 1px solid rgba(203, 213, 225, 0.16);
          border-radius: 12px;
          color: #CBD5E1;
          font-size: 11px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .preset-chip:hover,
        .preset-chip.selected {
          border-color: #00D2FF;
          color: #00D2FF;
          background: rgba(0, 70, 252, 0.12);
        }

        .image-preview-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px;
          background: #060B12;
          border: 1px solid rgba(203, 213, 225, 0.1);
          border-radius: 6px;
          margin-top: 10px;
        }

        .image-preview-bar img {
          width: 60px;
          height: 42px;
          object-fit: cover;
          border-radius: 4px;
        }

        .preview-info span {
          display: block;
          font-size: 12px;
          font-weight: 700;
          color: #CBD5E1;
        }

        .preview-info small {
          font-size: 10.5px;
          color: #64748B;
        }

        /* Stats Subform */
        .stats-subform {
          background: #060B12;
          border: 1px solid rgba(203, 213, 225, 0.1);
          border-radius: 8px;
          padding: 14px;
        }

        .stats-inputs-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 8px;
        }

        @media (max-width: 640px) {
          .stats-inputs-grid {
            grid-template-columns: 1fr;
          }
        }

        .stat-input-pair {
          display: grid;
          grid-template-columns: 100px 1fr;
          gap: 6px;
        }

        .stat-input-pair input {
          padding: 7px 10px;
          font-size: 12px;
        }

        /* Modal Actions */
        .modal-actions-bar {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
          padding-top: 16px;
          border-top: 1px solid rgba(203, 213, 225, 0.1);
          margin-top: 8px;
        }

        .btn-cancel {
          padding: 10px 20px;
          background: #1E293B;
          border: 1px solid rgba(203, 213, 225, 0.2);
          border-radius: 6px;
          color: #CBD5E1;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
        }

        .btn-cancel:hover {
          color: #FFFFFF;
          background: #334155;
        }

        .btn-save {
          padding: 10px 24px;
          background: #0046FC;
          border: none;
          border-radius: 6px;
          color: #FFFFFF;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(0, 70, 252, 0.4);
        }

        .btn-save:hover {
          background: #0038D1;
        }
      `}</style>
    </section>
  );
};

export default CaseStudyManager;

import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  podcastStorageApi,
  type PodcastEpisode,
  articlesApi,
} from "../../services/api";

interface PodcastManagerProps {
  showToast: (msg: string) => void;
}

const PRESET_AVATARS = [
  {
    label: "Leader 1",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=90",
  },
  {
    label: "Leader 2",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=90",
  },
  {
    label: "Leader 3",
    url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=90",
  },
  {
    label: "Leader 4",
    url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=90",
  },
  {
    label: "Leader 5",
    url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=90",
  },
  {
    label: "Leader 6",
    url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=90",
  },
  {
    label: "Leader 7",
    url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=90",
  },
  {
    label: "Leader 8",
    url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=90",
  },
];

const SUGGESTED_TOPICS = [
  "Security Operations & AI Automation",
  "Agentic AI Governance",
  "Zero Trust Identity",
  "Executive Strategy & Compliance",
  "Third-Party Risk Management",
  "Cloud Native & Kubernetes Security",
  "Threat Intelligence & Telemetry",
  "B2B Demand Gen & Pipeline Growth",
];

export default function PodcastManager({ showToast }: PodcastManagerProps) {
  const [podcasts, setPodcasts] = useState<PodcastEpisode[]>(() =>
    podcastStorageApi.getAll()
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("All");

  // Available articles for quick link picker
  const [availableArticles, setAvailableArticles] = useState<
    { title: string; link: string }[]
  >([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formNumber, setFormNumber] = useState("");
  const [formDuration, setFormDuration] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formGuest, setFormGuest] = useState("");
  const [formRole, setFormRole] = useState("");
  const [formTopic, setFormTopic] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formLink, setFormLink] = useState("");
  const [formImage, setFormImage] = useState("");

  // Delete Confirm Modal State
  const [deletingEpisode, setDeletingEpisode] = useState<PodcastEpisode | null>(
    null
  );

  // Load articles for linking
  useEffect(() => {
    let isMounted = true;
    articlesApi
      .getAll()
      .then((res: any) => {
        if (!isMounted) return;
        const list = Array.isArray(res) ? res : res?.articles || [];
        const mapped = list
          .filter((a: any) => a.title && a.slug)
          .map((a: any) => ({
            title: a.title,
            link: `/article/${a.slug}`,
          }));
        setAvailableArticles(mapped);
      })
      .catch((err) => {
        console.warn("[PodcastManager] Failed to load articles for link helper", err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Listen for storage updates
  useEffect(() => {
    const handleUpdate = () => {
      setPodcasts(podcastStorageApi.getAll());
    };
    window.addEventListener("gp_podcasts_updated", handleUpdate);
    return () => {
      window.removeEventListener("gp_podcasts_updated", handleUpdate);
    };
  }, []);

  // Filtered podcasts
  const filteredPodcasts = useMemo(() => {
    return podcasts.filter((ep) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        ep.title.toLowerCase().includes(q) ||
        ep.guest.toLowerCase().includes(q) ||
        ep.role.toLowerCase().includes(q) ||
        ep.topic.toLowerCase().includes(q) ||
        ep.number.toLowerCase().includes(q);

      const matchesTopic =
        selectedTopic === "All" || ep.topic === selectedTopic;

      return matchesQuery && matchesTopic;
    });
  }, [podcasts, searchQuery, selectedTopic]);

  // Unique topics
  const uniqueTopics = useMemo(() => {
    const set = new Set<string>();
    podcasts.forEach((ep) => {
      if (ep.topic) set.add(ep.topic);
    });
    return Array.from(set);
  }, [podcasts]);

  // Open Create Modal
  const openCreateModal = () => {
    setIsEditing(false);
    setEditingId(null);
    const nextEpNumber = `EPISODE ${String(podcasts.length + 1).padStart(2, "0")}`;
    setFormNumber(nextEpNumber);
    setFormDuration("40 MIN");
    setFormTitle("");
    setFormGuest("");
    setFormRole("");
    setFormTopic("Security Operations & AI Automation");
    setFormDescription("");
    setFormLink("/article/guest-soc-alert-fatigue-automation");
    setFormImage(PRESET_AVATARS[0].url);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (ep: PodcastEpisode) => {
    setIsEditing(true);
    setEditingId(ep.id);
    setFormNumber(ep.number);
    setFormDuration(ep.duration);
    setFormTitle(ep.title);
    setFormGuest(ep.guest);
    setFormRole(ep.role);
    setFormTopic(ep.topic);
    setFormDescription(ep.description);
    setFormLink(ep.link);
    setFormImage(ep.image || PRESET_AVATARS[0].url);
    setIsModalOpen(true);
  };

  // Image file upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      showToast("Avatar image must be under 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setFormImage(reader.result);
        showToast("Guest avatar uploaded");
      }
    };
    reader.readAsDataURL(file);
  };

  // Save Modal (Create / Edit)
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      showToast("Please enter an episode title");
      return;
    }
    if (!formGuest.trim()) {
      showToast("Please enter the guest full name");
      return;
    }

    const cleanedEpisode: PodcastEpisode = {
      id: isEditing && editingId ? editingId : `ep-${Date.now()}`,
      number: formNumber.trim() || `EPISODE ${String(podcasts.length + 1).padStart(2, "0")}`,
      duration: formDuration.trim() || "35 MIN",
      title: formTitle.trim(),
      guest: formGuest.trim(),
      role: formRole.trim(),
      topic: formTopic.trim() || "Enterprise Strategy",
      description: formDescription.trim(),
      link: formLink.trim() || "/",
      image: formImage.trim() || PRESET_AVATARS[0].url,
    };

    let updatedList: PodcastEpisode[];
    if (isEditing && editingId) {
      updatedList = podcasts.map((p) => (p.id === editingId ? cleanedEpisode : p));
      showToast(`Updated "${cleanedEpisode.title}"`);
    } else {
      updatedList = [...podcasts, cleanedEpisode];
      showToast(`Published "${cleanedEpisode.title}"`);
    }

    setPodcasts(updatedList);
    podcastStorageApi.saveAll(updatedList);
    setIsModalOpen(false);
  };

  // Delete Action
  const confirmDelete = () => {
    if (!deletingEpisode) return;
    const updated = podcasts.filter((p) => p.id !== deletingEpisode.id);
    setPodcasts(updated);
    podcastStorageApi.saveAll(updated);
    showToast(`Deleted "${deletingEpisode.title}"`);
    setDeletingEpisode(null);
  };

  // Reset to Defaults
  const handleResetDefaults = () => {
    if (
      window.confirm(
        "Are you sure you want to reset all podcasts to the default 6 Executive Audio episodes? Any custom episodes will be cleared."
      )
    ) {
      const defaults = podcastStorageApi.resetDefaults();
      setPodcasts(defaults);
      showToast("Podcasts reset to default 6 episodes");
    }
  };

  return (
    <div className="podcast-manager-root">
      {/* HEADER BAR */}
      <div className="pm-header">
        <div className="pm-header-left">
          <div className="pm-badge">🎙 EXECUTIVE AUDIO</div>
          <h2>Podcast Management</h2>
          <p>
            Curate and publish executive audio episodes for the GETprospeKt Executive
            Audio Series on the homepage.
          </p>
        </div>

        <div className="pm-header-actions">
          <button
            type="button"
            className="pm-btn pm-btn-secondary"
            onClick={handleResetDefaults}
            title="Restore original 6 episodes"
          >
            <span>↺</span> Reset Defaults
          </button>
          <button
            type="button"
            className="pm-btn pm-btn-primary"
            onClick={openCreateModal}
          >
            <span>+</span> Add Episode
          </button>
        </div>
      </div>

      {/* METRICS STRIP */}
      <div className="pm-stats-grid">
        <div className="pm-stat-card">
          <span className="pm-stat-label">Total Episodes</span>
          <strong className="pm-stat-val">{podcasts.length}</strong>
          <span className="pm-stat-sub">Live on homepage</span>
        </div>
        <div className="pm-stat-card">
          <span className="pm-stat-label">Guest Leaders</span>
          <strong className="pm-stat-val">
            {new Set(podcasts.map((p) => p.guest)).size}
          </strong>
          <span className="pm-stat-sub">Industry experts</span>
        </div>
        <div className="pm-stat-card">
          <span className="pm-stat-label">Topics Covered</span>
          <strong className="pm-stat-val">
            {new Set(podcasts.map((p) => p.topic)).size}
          </strong>
          <span className="pm-stat-sub">Strategic disciplines</span>
        </div>
        <div className="pm-stat-card">
          <span className="pm-stat-label">Series Rating</span>
          <strong className="pm-stat-val" style={{ color: "#38bdf8" }}>
            4.9 ★
          </strong>
          <span className="pm-stat-sub">Audience benchmark</span>
        </div>
      </div>

      {/* SEARCH & FILTER BAR */}
      <div className="pm-toolbar">
        <div className="pm-search-box">
          <span className="pm-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by episode title, guest name, company role, or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="pm-clear-btn"
              onClick={() => setSearchQuery("")}
            >
              ✕
            </button>
          )}
        </div>

        {/* Topic Pills */}
        <div className="pm-topic-pills">
          <button
            type="button"
            className={`pm-pill ${selectedTopic === "All" ? "active" : ""}`}
            onClick={() => setSelectedTopic("All")}
          >
            All Topics ({podcasts.length})
          </button>
          {uniqueTopics.map((topic) => {
            const count = podcasts.filter((p) => p.topic === topic).length;
            return (
              <button
                key={topic}
                type="button"
                className={`pm-pill ${selectedTopic === topic ? "active" : ""}`}
                onClick={() => setSelectedTopic(topic)}
              >
                {topic} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* PODCAST EPISODES GRID */}
      {filteredPodcasts.length === 0 ? (
        <div className="pm-empty-state">
          <div className="pm-empty-icon">🎙</div>
          <h3>No episodes found</h3>
          <p>Try adjusting your search query or topic filter.</p>
          <button
            type="button"
            className="pm-btn pm-btn-secondary"
            onClick={() => {
              setSearchQuery("");
              setSelectedTopic("All");
            }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="pm-grid">
          {filteredPodcasts.map((ep) => (
            <div className="pm-card" key={ep.id}>
              <div className="pm-card-top">
                <div className="pm-card-badges">
                  <span className="pm-badge-number">{ep.number}</span>
                  <span className="pm-badge-duration">⏱ {ep.duration}</span>
                </div>
                <div className="pm-card-play-icon" title="Audio Episode">
                  <span>▶</span>
                </div>
              </div>

              <span className="pm-card-topic">{ep.topic}</span>

              <h3 className="pm-card-title">{ep.title}</h3>

              <p className="pm-card-desc">{ep.description}</p>

              <div className="pm-guest-row">
                <img
                  src={ep.image}
                  alt={ep.guest}
                  className="pm-guest-avatar"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = PRESET_AVATARS[0].url;
                  }}
                />
                <div className="pm-guest-info">
                  <strong className="pm-guest-name">{ep.guest}</strong>
                  <span className="pm-guest-role">{ep.role}</span>
                </div>
              </div>

              <div className="pm-card-link-preview">
                <span className="pm-link-label">Target Link:</span>
                <Link to={ep.link} className="pm-link-url" target="_blank" rel="noreferrer">
                  {ep.link} ↗
                </Link>
              </div>

              <div className="pm-card-actions">
                <button
                  type="button"
                  className="pm-btn-action pm-btn-edit"
                  onClick={() => openEditModal(ep)}
                >
                  ✏️ Edit Episode
                </button>
                <button
                  type="button"
                  className="pm-btn-action pm-btn-delete"
                  onClick={() => setDeletingEpisode(ep)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="pm-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div
            className="pm-modal-dialog"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="pm-modal-header">
              <div>
                <span className="pm-modal-tag">
                  {isEditing ? "EDIT PODCAST" : "NEW PODCAST"}
                </span>
                <h3>
                  {isEditing
                    ? `Edit: ${formTitle || "Episode"}`
                    : "Create New Podcast Episode"}
                </h3>
              </div>
              <button
                type="button"
                className="pm-modal-close"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="pm-modal-form">
              <div className="pm-modal-body">
                {/* Row 1: Episode Number & Duration */}
                <div className="pm-form-row">
                  <div className="pm-form-group">
                    <label>Episode Number / Label *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. EPISODE 07"
                      value={formNumber}
                      onChange={(e) => setFormNumber(e.target.value)}
                    />
                  </div>
                  <div className="pm-form-group">
                    <label>Duration *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 45 MIN"
                      value={formDuration}
                      onChange={(e) => setFormDuration(e.target.value)}
                    />
                  </div>
                </div>

                {/* Row 2: Title */}
                <div className="pm-form-group">
                  <label>Episode Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Eliminating SOC Alert Fatigue with Autonomous AI Triage"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                  />
                </div>

                {/* Row 3: Topic & Quick Topic Suggestions */}
                <div className="pm-form-group">
                  <label>Topic / Strategic Discipline *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Security Operations & AI Automation"
                    value={formTopic}
                    onChange={(e) => setFormTopic(e.target.value)}
                  />
                  <div className="pm-suggestions-row">
                    <span className="pm-sugg-label">Quick topics:</span>
                    {SUGGESTED_TOPICS.map((topic) => (
                      <button
                        key={topic}
                        type="button"
                        className="pm-sugg-pill"
                        onClick={() => setFormTopic(topic)}
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Row 4: Guest Name & Guest Role */}
                <div className="pm-form-row">
                  <div className="pm-form-group">
                    <label>Guest Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ahmed Achchak"
                      value={formGuest}
                      onChange={(e) => setFormGuest(e.target.value)}
                    />
                  </div>
                  <div className="pm-form-group">
                    <label>Guest Role &amp; Organization *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. CEO & Co-Founder, Qevlar AI"
                      value={formRole}
                      onChange={(e) => setFormRole(e.target.value)}
                    />
                  </div>
                </div>

                {/* Row 5: Executive Description */}
                <div className="pm-form-group">
                  <label>Executive Description / Key Takeaways *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="How autonomous AI investigation engines eliminate 80% of Tier-1 alert noise, accelerate MTTI from hours to seconds..."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                  />
                </div>

                {/* Row 6: Target Link & Article / Audio / Video Selector */}
                <div className="pm-form-group">
                  <label>Podcast Audio, Video, or Article Link *</label>
                  <p style={{ fontSize: 12, color: "#94a3b8", margin: "0 0 6px 0", lineHeight: 1.4 }}>
                    Enter any internal article route (e.g. <code>/article/slug</code>), YouTube video URL (e.g. <code>https://youtube.com/watch?v=...</code>), Spotify / Apple Podcast link, or direct audio link (.mp3).
                  </p>
                  <input
                    type="text"
                    required
                    placeholder="e.g. https://youtube.com/... or https://open.spotify.com/... or /article/slug"
                    value={formLink}
                    onChange={(e) => setFormLink(e.target.value)}
                  />
                  {availableArticles.length > 0 && (
                    <div className="pm-link-helper">
                      <span className="pm-sugg-label">Or choose an internal published article:</span>
                      <select
                        className="pm-select-helper"
                        onChange={(e) => {
                          if (e.target.value) setFormLink(e.target.value);
                        }}
                        defaultValue=""
                      >
                        <option value="" disabled>
                          -- Choose from published articles --
                        </option>
                        {availableArticles.map((art) => (
                          <option key={art.link} value={art.link}>
                            {art.title.length > 60
                              ? art.title.substring(0, 60) + "..."
                              : art.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Row 7: Guest Photo / Avatar */}
                <div className="pm-form-group">
                  <label>Guest Avatar Image URL / Upload *</label>
                  <div className="pm-image-input-row">
                    <input
                      type="text"
                      required
                      placeholder="https://images.unsplash.com/..."
                      value={formImage}
                      onChange={(e) => setFormImage(e.target.value)}
                    />
                    <label className="pm-upload-btn">
                      📁 Upload Photo
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>

                  {/* Preset Avatars */}
                  <div className="pm-avatar-presets">
                    <span className="pm-sugg-label">Preset Avatars:</span>
                    <div className="pm-preset-avatars-row">
                      {PRESET_AVATARS.map((av, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className={`pm-avatar-btn ${formImage === av.url ? "selected" : ""}`}
                          onClick={() => setFormImage(av.url)}
                          title={av.label}
                        >
                          <img src={av.url} alt={av.label} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* LIVE PREVIEW BOX */}
                <div className="pm-preview-box">
                  <div className="pm-preview-title">LIVE HOMEPAGE PREVIEW</div>
                  <div className="pm-card" style={{ maxWidth: 440, margin: "0 auto" }}>
                    <div className="pm-card-top">
                      <div className="pm-card-badges">
                        <span className="pm-badge-number">
                          {formNumber || "EPISODE 01"}
                        </span>
                        <span className="pm-badge-duration">
                          ⏱ {formDuration || "35 MIN"}
                        </span>
                      </div>
                      <div className="pm-card-play-icon">
                        <span>▶</span>
                      </div>
                    </div>

                    <span className="pm-card-topic">
                      {formTopic || "Enterprise Security"}
                    </span>

                    <h3 className="pm-card-title">
                      {formTitle || "Episode Title will appear here"}
                    </h3>

                    <p className="pm-card-desc">
                      {formDescription ||
                        "Brief description and key executive discussion takeaways will display here."}
                    </p>

                    <div className="pm-guest-row">
                      <img
                        src={formImage || PRESET_AVATARS[0].url}
                        alt="Preview"
                        className="pm-guest-avatar"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = PRESET_AVATARS[0].url;
                        }}
                      />
                      <div className="pm-guest-info">
                        <strong className="pm-guest-name">
                          {formGuest || "Guest Name"}
                        </strong>
                        <span className="pm-guest-role">
                          {formRole || "Guest Title & Company"}
                        </span>
                      </div>
                    </div>

                    <div className="pm-live-listen-tag">
                      Listen &amp; Read Full Transcript
                    </div>
                  </div>
                </div>
              </div>

              <div className="pm-modal-footer">
                <button
                  type="button"
                  className="pm-btn pm-btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="pm-btn pm-btn-primary">
                  {isEditing ? "Save Changes" : "Publish Episode"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingEpisode && (
        <div
          className="pm-modal-overlay"
          onClick={() => setDeletingEpisode(null)}
        >
          <div
            className="pm-confirm-dialog"
            onClick={(e) => e.stopPropagation()}
            role="alertdialog"
          >
            <div className="pm-confirm-icon">⚠️</div>
            <h3>Delete Episode?</h3>
            <p>
              Are you sure you want to delete{" "}
              <strong>"{deletingEpisode.title}"</strong> ({deletingEpisode.number})?
              This will remove the episode from the homepage immediately.
            </p>
            <div className="pm-confirm-actions">
              <button
                type="button"
                className="pm-btn pm-btn-secondary"
                onClick={() => setDeletingEpisode(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="pm-btn pm-btn-danger"
                onClick={confirmDelete}
              >
                Yes, Delete Episode
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SCOPED STYLING */}
      <style>{`
        .podcast-manager-root {
          display: flex;
          flex-direction: column;
          gap: 24px;
          color: #E2E8F0;
        }

        .pm-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .pm-badge {
          display: inline-block;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #38bdf8;
          background: rgba(56, 189, 248, 0.12);
          border: 1px solid rgba(56, 189, 248, 0.25);
          padding: 3px 10px;
          border-radius: 999px;
          margin-bottom: 8px;
        }

        .pm-header h2 {
          font-size: 26px;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0 0 6px 0;
          letter-spacing: -0.02em;
        }

        .pm-header p {
          font-size: 14px;
          color: #94A3B8;
          margin: 0;
          max-width: 680px;
          line-height: 1.5;
        }

        .pm-header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .pm-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border-radius: 8px;
          font-size: 13.5px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }

        .pm-btn-primary {
          background: #0046FC;
          color: #FFFFFF;
          box-shadow: 0 4px 14px rgba(0, 70, 252, 0.35);
        }

        .pm-btn-primary:hover {
          background: #0037c7;
          transform: translateY(-1px);
        }

        .pm-btn-secondary {
          background: rgba(255, 255, 255, 0.06);
          color: #CBD5E1;
          border-color: rgba(255, 255, 255, 0.12);
        }

        .pm-btn-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #FFFFFF;
        }

        .pm-btn-danger {
          background: #ef4444;
          color: #FFFFFF;
        }

        .pm-btn-danger:hover {
          background: #dc2626;
        }

        /* Stats Grid */
        .pm-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .pm-stat-card {
          background: #0f172a;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .pm-stat-label {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #64748B;
        }

        .pm-stat-val {
          font-size: 28px;
          font-weight: 800;
          color: #F8FAFC;
        }

        .pm-stat-sub {
          font-size: 12px;
          color: #94A3B8;
        }

        /* Toolbar */
        .pm-toolbar {
          display: flex;
          flex-direction: column;
          gap: 14px;
          background: #0b132b;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 16px;
        }

        .pm-search-box {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #0f172a;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 8px;
          padding: 0 14px;
          height: 44px;
        }

        .pm-search-icon {
          font-size: 14px;
          opacity: 0.6;
        }

        .pm-search-box input {
          flex: 1;
          background: transparent;
          border: 0;
          color: #FFFFFF;
          font-size: 14px;
          outline: none;
        }

        .pm-clear-btn {
          background: transparent;
          border: 0;
          color: #94A3B8;
          cursor: pointer;
          font-size: 13px;
        }

        .pm-topic-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .pm-pill {
          padding: 6px 13px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #94A3B8;
          font-size: 12.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .pm-pill:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #FFFFFF;
        }

        .pm-pill.active {
          background: #0046FC;
          color: #FFFFFF;
          border-color: #0046FC;
        }

        /* Grid */
        .pm-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 20px;
        }

        .pm-card {
          background: #0b132b;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          padding: 22px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .pm-card:hover {
          transform: translateY(-2px);
          border-color: rgba(56, 189, 248, 0.3);
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.35);
        }

        .pm-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .pm-card-badges {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .pm-badge-number {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: #38bdf8;
          background: rgba(56, 189, 248, 0.12);
          padding: 3px 8px;
          border-radius: 6px;
        }

        .pm-badge-duration {
          font-size: 11px;
          font-weight: 700;
          color: #94A3B8;
          background: rgba(255, 255, 255, 0.05);
          padding: 3px 8px;
          border-radius: 6px;
        }

        .pm-card-play-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #0046FC;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
        }

        .pm-card-topic {
          font-size: 11.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #a78bfa;
        }

        .pm-card-title {
          font-size: 16px;
          font-weight: 700;
          color: #F8FAFC;
          line-height: 1.4;
          margin: 0;
        }

        .pm-card-desc {
          font-size: 13px;
          color: #94A3B8;
          line-height: 1.55;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .pm-guest-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .pm-guest-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid rgba(56, 189, 248, 0.3);
        }

        .pm-guest-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }

        .pm-guest-name {
          font-size: 13.5px;
          font-weight: 700;
          color: #F1F5F9;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .pm-guest-role {
          font-size: 12px;
          color: #94A3B8;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .pm-card-link-preview {
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 6px;
          color: #64748B;
        }

        .pm-link-url {
          color: #38bdf8;
          text-decoration: none;
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .pm-link-url:hover {
          text-decoration: underline;
        }

        .pm-card-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: auto;
          padding-top: 8px;
        }

        .pm-btn-action {
          flex: 1;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 12.5px;
          font-weight: 600;
          cursor: pointer;
          border: 1px solid transparent;
          transition: all 0.2s ease;
        }

        .pm-btn-edit {
          background: rgba(0, 70, 252, 0.15);
          color: #60a5fa;
          border-color: rgba(0, 70, 252, 0.3);
        }

        .pm-btn-edit:hover {
          background: #0046FC;
          color: #FFFFFF;
        }

        .pm-btn-delete {
          background: rgba(239, 68, 68, 0.12);
          color: #f87171;
          border-color: rgba(239, 68, 68, 0.25);
        }

        .pm-btn-delete:hover {
          background: #ef4444;
          color: #FFFFFF;
        }

        .pm-live-listen-tag {
          font-size: 12px;
          font-weight: 700;
          color: #38bdf8;
          text-align: center;
          padding: 8px;
          background: rgba(56, 189, 248, 0.08);
          border-radius: 6px;
        }

        /* Empty State */
        .pm-empty-state {
          text-align: center;
          padding: 60px 20px;
          background: #0b132b;
          border: 1px dashed rgba(255, 255, 255, 0.12);
          border-radius: 14px;
        }

        .pm-empty-icon {
          font-size: 40px;
          margin-bottom: 12px;
          opacity: 0.6;
        }

        .pm-empty-state h3 {
          font-size: 18px;
          font-weight: 700;
          color: #FFFFFF;
          margin: 0 0 8px 0;
        }

        .pm-empty-state p {
          color: #94A3B8;
          font-size: 14px;
          margin: 0 0 16px 0;
        }

        /* Modal Dialog */
        .pm-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 20px;
        }

        .pm-modal-dialog {
          background: #0b132b;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 16px;
          width: 100%;
          max-width: 760px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
          overflow: hidden;
        }

        .pm-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .pm-modal-tag {
          font-size: 11px;
          font-weight: 800;
          color: #38bdf8;
          letter-spacing: 0.08em;
        }

        .pm-modal-header h3 {
          font-size: 18px;
          font-weight: 800;
          color: #FFFFFF;
          margin: 2px 0 0 0;
        }

        .pm-modal-close {
          background: transparent;
          border: 0;
          color: #94A3B8;
          font-size: 20px;
          cursor: pointer;
        }

        .pm-modal-form {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .pm-modal-body {
          padding: 24px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 18px;
          max-height: calc(90vh - 140px);
        }

        .pm-form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .pm-form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .pm-form-group label {
          font-size: 12.5px;
          font-weight: 700;
          color: #CBD5E1;
        }

        .pm-form-group input,
        .pm-form-group textarea,
        .pm-select-helper {
          background: #0f172a;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 8px;
          padding: 10px 14px;
          color: #FFFFFF;
          font-size: 13.5px;
          outline: none;
          font-family: inherit;
        }

        .pm-form-group input:focus,
        .pm-form-group textarea:focus,
        .pm-select-helper:focus {
          border-color: #0046FC;
          box-shadow: 0 0 0 2px rgba(0, 70, 252, 0.25);
        }

        .pm-suggestions-row {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 6px;
        }

        .pm-sugg-label {
          font-size: 11px;
          color: #64748B;
          font-weight: 600;
        }

        .pm-sugg-pill {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #94A3B8;
          font-size: 11px;
          padding: 3px 8px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .pm-sugg-pill:hover {
          background: rgba(56, 189, 248, 0.15);
          color: #38bdf8;
          border-color: rgba(56, 189, 248, 0.3);
        }

        .pm-link-helper {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 6px;
        }

        .pm-image-input-row {
          display: flex;
          gap: 10px;
        }

        .pm-image-input-row input {
          flex: 1;
        }

        .pm-upload-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 16px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          color: #CBD5E1;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s ease;
        }

        .pm-upload-btn:hover {
          background: rgba(255, 255, 255, 0.14);
          color: #FFFFFF;
        }

        .pm-avatar-presets {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 8px;
          flex-wrap: wrap;
        }

        .pm-preset-avatars-row {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .pm-avatar-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.15);
          padding: 0;
          cursor: pointer;
          background: transparent;
          overflow: hidden;
          transition: all 0.2s ease;
        }

        .pm-avatar-btn img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .pm-avatar-btn:hover,
        .pm-avatar-btn.selected {
          border-color: #0046FC;
          transform: scale(1.1);
        }

        .pm-preview-box {
          background: rgba(0, 0, 0, 0.35);
          border: 1px dashed rgba(255, 255, 255, 0.12);
          border-radius: 12px;
          padding: 16px;
        }

        .pm-preview-title {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: #64748B;
          margin-bottom: 12px;
          text-align: center;
        }

        .pm-modal-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
          padding: 16px 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          background: #0f172a;
        }

        /* Confirm Dialog */
        .pm-confirm-dialog {
          background: #0b132b;
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 16px;
          padding: 28px;
          max-width: 440px;
          width: 100%;
          text-align: center;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
        }

        .pm-confirm-icon {
          font-size: 36px;
          margin-bottom: 10px;
        }

        .pm-confirm-dialog h3 {
          font-size: 20px;
          color: #FFFFFF;
          margin: 0 0 10px 0;
        }

        .pm-confirm-dialog p {
          font-size: 14px;
          color: #94A3B8;
          line-height: 1.5;
          margin: 0 0 20px 0;
        }

        .pm-confirm-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
        }
      `}</style>
    </div>
  );
}

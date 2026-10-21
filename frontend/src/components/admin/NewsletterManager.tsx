import React, { useState, useEffect } from "react";
import {
  newslettersStorageApi,
  newslettersApi,
  type NewsletterData,
  type GatedFormConfig,
} from "../../services/api";
import { ItemFormSettingsModal } from "./ItemFormSettingsModal";

interface NewsletterManagerProps {
  showToast: (msg: string) => void;
}

const PRESET_COVERS = [
  {
    label: "B2B Pipeline Dispatch",
    url: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=90",
  },
  {
    label: "Enterprise Tech Pulse",
    url: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=1200&q=90",
  },
  {
    label: "Cybersecurity & SaaS",
    url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=90",
  },
  {
    label: "AI Demand Dynamics",
    url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=90",
  },
  {
    label: "Revenue Architecture",
    url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=90",
  },
  {
    label: "B2B Intent Dynamics",
    url: "https://images.unsplash.com/photo-1543286386-2e659306dc6c?auto=format&fit=crop&w=1200&q=90",
  },
];

const INDUSTRIES = [
  "B2B Technology",
  "Enterprise Technology",
  "Cloud",
  "Cybersecurity",
  "AI",
  "SaaS",
  "Digital Transformation",
];

export const NewsletterManager: React.FC<NewsletterManagerProps> = ({ showToast }) => {
  const [newsletters, setNewsletters] = useState<NewsletterData[]>(() =>
    newslettersStorageApi.getAll()
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [frequencyFilter, setFrequencyFilter] = useState<string>("All");

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formFrequency, setFormFrequency] = useState<"Weekly" | "Monthly" | "Bi-Weekly">("Weekly");
  const [formCategory, setFormCategory] = useState("B2B Technology");
  const [formAuthor, setFormAuthor] = useState("GETprospeKt Editorial");
  const [formDate, setFormDate] = useState("Sep 2026");
  const [formReadTime, setFormReadTime] = useState("4 min read");
  const [formSummary, setFormSummary] = useState("");
  const [formHighlightsText, setFormHighlightsText] = useState("");
  const [formImage, setFormImage] = useState("");
  const [formStatus, setFormStatus] = useState<"Published" | "Draft">("Published");
  const [formSubscribers, setFormSubscribers] = useState("1,250 subscribers");

  // Individual Form Settings Modal State
  const [itemFormSettingsTarget, setItemFormSettingsTarget] = useState<NewsletterData | null>(null);
  const [isItemFormSettingsOpen, setIsItemFormSettingsOpen] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      setNewsletters(newslettersStorageApi.getAll());
    };
    window.addEventListener("gp_newsletters_updated", handleUpdate);
    return () => window.removeEventListener("gp_newsletters_updated", handleUpdate);
  }, []);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormTitle("");
    setFormSlug("");
    setFormFrequency("Weekly");
    setFormCategory("B2B Technology");
    setFormAuthor("GETprospeKt Editorial");
    setFormDate(new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }));
    setFormReadTime("4 min read");
    setFormSummary("");
    setFormHighlightsText("High-intent account scoring\nICP qualification checklists\nPipeline velocity benchmarks");
    setFormImage(PRESET_COVERS[0].url);
    setFormStatus("Published");
    setFormSubscribers("1,200 subscribers");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: NewsletterData) => {
    setIsEditing(true);
    setEditingId(item._id);
    setFormTitle(item.title);
    setFormSlug(item.slug || generateSlug(item.title));
    setFormFrequency(item.frequency || "Weekly");
    setFormCategory(item.category || "B2B Technology");
    setFormAuthor(item.author || "GETprospeKt Editorial");
    setFormDate(item.date || "Sep 2026");
    setFormReadTime(item.readTime || "4 min read");
    setFormSummary(item.summary || "");
    setFormHighlightsText((item.highlights || []).join("\n"));
    setFormImage(item.image || PRESET_COVERS[0].url);
    setFormStatus(item.status || "Published");
    setFormSubscribers(item.subscribersCount || "1,200 subscribers");
    setIsModalOpen(true);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      alert("Please enter a newsletter title.");
      return;
    }
    if (!formSummary.trim()) {
      alert("Please enter a summary for this newsletter edition.");
      return;
    }

    const highlights = formHighlightsText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const slug = formSlug.trim() || generateSlug(formTitle);

    if (isEditing && editingId) {
      const existing = newsletters.find((n) => n._id === editingId);
      const updatedItem: NewsletterData = {
        ...existing,
        _id: editingId,
        title: formTitle.trim(),
        slug,
        frequency: formFrequency,
        category: formCategory,
        author: formAuthor.trim() || "GETprospeKt Editorial",
        date: formDate.trim() || "Sep 2026",
        readTime: formReadTime.trim() || "4 min read",
        summary: formSummary.trim(),
        highlights: highlights.length > 0 ? highlights : ["Curated market intelligence", "Enterprise pipeline signals"],
        image: formImage || PRESET_COVERS[0].url,
        status: formStatus,
        subscribersCount: formSubscribers.trim() || "1,200 subscribers",
        formConfig: existing?.formConfig,
      };

      const updatedList = newsletters.map((n) => (n._id === editingId ? updatedItem : n));
      newslettersStorageApi.saveAll(updatedList);
      setNewsletters(updatedList);
      try {
        await newslettersApi.update(editingId, updatedItem);
      } catch {
        // storage fallback
      }
      showToast("Newsletter edition updated successfully.");
    } else {
      const newItem: NewsletterData = {
        _id: `nl_${Date.now()}`,
        title: formTitle.trim(),
        slug,
        frequency: formFrequency,
        category: formCategory,
        author: formAuthor.trim() || "GETprospeKt Editorial",
        date: formDate.trim() || "Sep 2026",
        readTime: formReadTime.trim() || "4 min read",
        summary: formSummary.trim(),
        highlights: highlights.length > 0 ? highlights : ["Curated market intelligence", "Enterprise pipeline signals"],
        image: formImage || PRESET_COVERS[0].url,
        status: formStatus,
        subscribersCount: formSubscribers.trim() || "1,200 subscribers",
      };

      const updatedList = [newItem, ...newsletters];
      newslettersStorageApi.saveAll(updatedList);
      setNewsletters(updatedList);
      try {
        await newslettersApi.create(newItem);
      } catch {
        // storage fallback
      }
      showToast("New newsletter edition created successfully.");
    }

    setIsModalOpen(false);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }
    const updated = newsletters.filter((n) => n._id !== id);
    newslettersStorageApi.saveAll(updated);
    setNewsletters(updated);
    try {
      await newslettersApi.delete(id);
    } catch {
      // storage fallback
    }
    showToast(`Deleted newsletter: ${title}`);
  };

  const handleResetDefaults = () => {
    if (window.confirm("Reset all newsletters back to default publication issues? Custom editions will be replaced.")) {
      const reset = newslettersStorageApi.resetDefaults();
      setNewsletters(reset);
      showToast("Reset newsletters to default publication issues.");
    }
  };

  const handleOpenFormSettings = (item: NewsletterData) => {
    setItemFormSettingsTarget(item);
    setIsItemFormSettingsOpen(true);
  };

  const handleSaveFormConfig = (newConfig: GatedFormConfig) => {
    if (!itemFormSettingsTarget) return;
    const updated = newsletters.map((n) => {
      if (n._id === itemFormSettingsTarget._id) {
        return { ...n, formConfig: newConfig };
      }
      return n;
    });
    newslettersStorageApi.saveAll(updated);
    setNewsletters(updated);
    setIsItemFormSettingsOpen(false);
    setItemFormSettingsTarget(null);
    showToast(`Updated subscriber form controls for "${itemFormSettingsTarget.title}"`);
  };

  // Filtered newsletters
  const filtered = newsletters.filter((item) => {
    const matchesFrequency =
      frequencyFilter === "All" || item.frequency === frequencyFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      item.title.toLowerCase().includes(q) ||
      (item.summary && item.summary.toLowerCase().includes(q)) ||
      (item.category && item.category.toLowerCase().includes(q)) ||
      (item.highlights && item.highlights.some((h) => h.toLowerCase().includes(q)));
    return matchesFrequency && matchesQuery;
  });

  const weeklyCount = newsletters.filter((n) => n.frequency === "Weekly").length;
  const monthlyCount = newsletters.filter((n) => n.frequency === "Monthly").length;
  const biweeklyCount = newsletters.filter((n) => n.frequency === "Bi-Weekly").length;

  return (
    <>
      <style>{`
        /* =========================================
           NEWSLETTER MANAGER STYLES
        ========================================= */
        .nl-manager {
          width: 100%;
        }

        .nl-header-card {
          background: #0D1522;
          border: 1px solid rgba(203, 213, 225, 0.12);
          border-radius: 12px;
          padding: 24px 28px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
        }

        .nl-header-info h2 {
          font-family: var(--font-serif);
          font-size: 24px;
          font-weight: 700;
          color: #FFFFFF;
          margin: 0 0 6px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .nl-header-info h2 span.nl-badge {
          font-family: var(--font-sans);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          background: rgba(0, 210, 255, 0.15);
          color: #00D2FF;
          padding: 3px 10px;
          border-radius: 12px;
          border: 1px solid rgba(0, 210, 255, 0.3);
        }

        .nl-header-info p {
          color: #94A3B8;
          font-size: 14px;
          margin: 0;
          max-width: 650px;
          line-height: 1.5;
        }

        .nl-header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .nl-reset-btn {
          background: transparent;
          border: 1px solid rgba(203, 213, 225, 0.2);
          color: #94A3B8;
          padding: 10px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .nl-reset-btn:hover {
          color: #FFFFFF;
          border-color: rgba(203, 213, 225, 0.4);
          background: rgba(255, 255, 255, 0.05);
        }

        .nl-add-btn {
          background: #0046FC;
          color: #FFFFFF;
          border: 0;
          padding: 11px 22px;
          border-radius: 8px;
          font-size: 13.5px;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s ease;
          box-shadow: 0 4px 14px rgba(0, 70, 252, 0.35);
        }

        .nl-add-btn:hover {
          background: #0038D1;
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(0, 70, 252, 0.45);
        }

        /* Filter Controls */
        .nl-filter-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 22px;
          flex-wrap: wrap;
        }

        .nl-tabs {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #0D1522;
          padding: 4px;
          border-radius: 10px;
          border: 1px solid rgba(203, 213, 225, 0.12);
        }

        .nl-tab {
          background: transparent;
          border: 0;
          color: #94A3B8;
          padding: 8px 16px;
          border-radius: 7px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .nl-tab:hover {
          color: #FFFFFF;
        }

        .nl-tab.active {
          background: #111C2D;
          color: #00D2FF;
          font-weight: 700;
          border: 1px solid rgba(0, 210, 255, 0.25);
        }

        .nl-tab-count {
          font-size: 11px;
          padding: 2px 7px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.08);
          color: inherit;
        }

        .nl-search {
          position: relative;
          min-width: 280px;
          flex: 1;
          max-width: 380px;
        }

        .nl-search input {
          width: 100%;
          background: #0D1522;
          border: 1px solid rgba(203, 213, 225, 0.16);
          border-radius: 8px;
          padding: 10px 36px 10px 14px;
          font-size: 13.5px;
          color: #FFFFFF;
          outline: none;
          transition: border-color 0.2s ease;
          box-sizing: border-box;
        }

        .nl-search input:focus {
          border-color: #00D2FF;
        }

        .nl-search .nl-search-icon {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #64748B;
          pointer-events: none;
          font-size: 14px;
        }

        /* Cards Grid */
        .nl-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
          gap: 22px;
        }

        .nl-card {
          background: #0D1522;
          border: 1px solid rgba(203, 213, 225, 0.12);
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: all 0.25s ease;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        }

        .nl-card:hover {
          border-color: rgba(0, 210, 255, 0.35);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
        }

        .nl-card-cover {
          position: relative;
          width: 100%;
          height: 180px;
          background: #111C2D;
          overflow: hidden;
        }

        .nl-card-cover img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .nl-card:hover .nl-card-cover img {
          transform: scale(1.04);
        }

        .nl-cover-badges {
          position: absolute;
          top: 12px;
          left: 12px;
          right: 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          pointer-events: none;
        }

        .nl-freq-badge {
          background: rgba(6, 11, 18, 0.85);
          backdrop-filter: blur(8px);
          color: #00D2FF;
          border: 1px solid rgba(0, 210, 255, 0.4);
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 6px;
          letter-spacing: 0.04em;
        }

        .nl-status-pill {
          background: rgba(6, 11, 18, 0.85);
          backdrop-filter: blur(8px);
          font-size: 11px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 6px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .nl-status-pill.published {
          color: #10B981;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .nl-status-pill.draft {
          color: #F59E0B;
          border: 1px solid rgba(245, 158, 11, 0.3);
        }

        .nl-card-body {
          padding: 20px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .nl-card-category {
          color: #00D2FF;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .nl-card-title {
          color: #FFFFFF;
          font-family: var(--font-serif);
          font-size: 17.5px;
          font-weight: 700;
          line-height: 1.35;
          margin: 0 0 10px;
        }

        .nl-card-summary {
          color: #94A3B8;
          font-size: 13.5px;
          line-height: 1.5;
          margin: 0 0 16px;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .nl-highlights-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 18px;
          padding-top: 12px;
          border-top: 1px solid rgba(203, 213, 225, 0.08);
        }

        .nl-highlight-item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 12.5px;
          color: #CBD5E1;
          line-height: 1.4;
        }

        .nl-highlight-item span.bullet {
          color: #0046FC;
          font-weight: 700;
        }

        .nl-card-meta {
          margin-top: auto;
          padding-top: 14px;
          border-top: 1px solid rgba(203, 213, 225, 0.08);
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 12px;
          color: #64748B;
        }

        .nl-card-meta span.date-read {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .nl-card-meta span.subscribers {
          color: #00D2FF;
          font-weight: 600;
        }

        .nl-card-actions {
          padding: 12px 20px 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          border-top: 1px solid rgba(203, 213, 225, 0.08);
          background: rgba(0, 0, 0, 0.15);
        }

        .nl-btn-edit {
          flex: 1;
          background: #111C2D;
          color: #FFFFFF;
          border: 1px solid rgba(203, 213, 225, 0.18);
          padding: 8px 12px;
          border-radius: 7px;
          font-size: 12.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .nl-btn-edit:hover {
          background: rgba(0, 210, 255, 0.1);
          border-color: #00D2FF;
          color: #00D2FF;
        }

        .nl-btn-form {
          background: #111C2D;
          color: #00D2FF;
          border: 1px solid rgba(0, 210, 255, 0.25);
          padding: 8px 12px;
          border-radius: 7px;
          font-size: 12.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .nl-btn-form:hover {
          background: rgba(0, 210, 255, 0.15);
          border-color: #00D2FF;
        }

        .nl-btn-delete {
          background: transparent;
          color: #EF4444;
          border: 1px solid rgba(239, 68, 68, 0.2);
          padding: 8px 10px;
          border-radius: 7px;
          font-size: 12.5px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .nl-btn-delete:hover {
          background: rgba(239, 68, 68, 0.12);
          border-color: #EF4444;
        }

        /* Empty State */
        .nl-empty-box {
          grid-column: 1 / -1;
          text-align: center;
          padding: 60px 20px;
          background: #0D1522;
          border: 1px dashed rgba(203, 213, 225, 0.2);
          border-radius: 12px;
        }

        .nl-empty-icon {
          font-size: 42px;
          margin-bottom: 12px;
        }

        .nl-empty-box h3 {
          color: #FFFFFF;
          font-size: 18px;
          margin: 0 0 6px;
        }

        .nl-empty-box p {
          color: #94A3B8;
          font-size: 14px;
          margin: 0 0 20px;
        }

        /* Modal Styles */
        .nl-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(3, 7, 18, 0.78);
          backdrop-filter: blur(6px);
          z-index: 1000;
          display: grid;
          place-items: center;
          padding: 24px;
          overflow-y: auto;
        }

        .nl-modal {
          background: #0D1522;
          border: 1px solid rgba(203, 213, 225, 0.2);
          border-radius: 14px;
          width: 100%;
          max-width: 720px;
          box-shadow: 0 20px 48px rgba(0, 0, 0, 0.6);
          overflow: hidden;
          margin: auto;
        }

        .nl-modal-header {
          padding: 22px 28px;
          border-bottom: 1px solid rgba(203, 213, 225, 0.12);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .nl-modal-header h3 {
          font-family: var(--font-serif);
          font-size: 20px;
          color: #FFFFFF;
          margin: 0 0 4px;
        }

        .nl-modal-header p {
          color: #94A3B8;
          font-size: 13px;
          margin: 0;
        }

        .nl-modal-close {
          background: transparent;
          border: 0;
          color: #94A3B8;
          font-size: 22px;
          cursor: pointer;
          width: 32px;
          height: 32px;
          display: grid;
          place-items: center;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .nl-modal-close:hover {
          color: #FFFFFF;
          background: rgba(255, 255, 255, 0.08);
        }

        .nl-modal-body {
          padding: 24px 28px;
          max-height: 70vh;
          overflow-y: auto;
        }

        .nl-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .nl-form-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .nl-form-field.full {
          grid-column: 1 / -1;
        }

        .nl-form-field label {
          color: #CBD5E1;
          font-size: 12.5px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .nl-form-field input,
        .nl-form-field select,
        .nl-form-field textarea {
          background: #111C2D;
          border: 1px solid rgba(203, 213, 225, 0.18);
          border-radius: 8px;
          padding: 10px 14px;
          color: #FFFFFF;
          font-size: 13.5px;
          outline: none;
          transition: border-color 0.2s ease;
          font-family: inherit;
        }

        .nl-form-field input:focus,
        .nl-form-field select:focus,
        .nl-form-field textarea:focus {
          border-color: #00D2FF;
        }

        .nl-form-field textarea {
          resize: vertical;
          min-height: 80px;
        }

        /* Preset covers */
        .nl-presets-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-top: 6px;
        }

        .nl-preset-thumb {
          position: relative;
          height: 70px;
          border-radius: 6px;
          overflow: hidden;
          cursor: pointer;
          border: 2px solid transparent;
          transition: all 0.2s ease;
        }

        .nl-preset-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .nl-preset-thumb span {
          position: absolute;
          inset: auto 0 0 0;
          background: rgba(0, 0, 0, 0.7);
          color: #FFFFFF;
          font-size: 10.5px;
          font-weight: 600;
          padding: 3px 6px;
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .nl-preset-thumb.selected {
          border-color: #00D2FF;
          box-shadow: 0 0 10px rgba(0, 210, 255, 0.4);
        }

        .nl-modal-footer {
          padding: 18px 28px;
          border-top: 1px solid rgba(203, 213, 225, 0.12);
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
          background: rgba(0, 0, 0, 0.15);
        }

        .nl-btn-cancel {
          background: transparent;
          border: 1px solid rgba(203, 213, 225, 0.2);
          color: #94A3B8;
          padding: 9px 18px;
          border-radius: 7px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }

        .nl-btn-cancel:hover {
          color: #FFFFFF;
          border-color: rgba(203, 213, 225, 0.4);
        }

        .nl-btn-submit {
          background: #0046FC;
          color: #FFFFFF;
          border: 0;
          padding: 10px 22px;
          border-radius: 7px;
          font-size: 13.5px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .nl-btn-submit:hover {
          background: #0038D1;
        }
      `}</style>

      <div className="nl-manager">
        {/* Header showcase */}
        <div className="nl-header-card">
          <div className="nl-header-info">
            <h2>
              Newsletters & Editorial Briefs
              <span className="nl-badge">{newsletters.length} Total Issues</span>
            </h2>
            <p>
              Draft and publish weekly executive briefs, monthly industry pulses, and bi-weekly market intelligence dispatches. Configure gated form controls per issue.
            </p>
          </div>
          <div className="nl-header-actions">
            <button className="nl-reset-btn" onClick={handleResetDefaults} title="Restore default newsletter issues">
              ↺ Reset Defaults
            </button>
            <button className="nl-add-btn" onClick={handleOpenAddModal} title="Create a new newsletter edition">
              <span>+</span> Add Newsletter
            </button>
          </div>
        </div>

        {/* Filters and search */}
        <div className="nl-filter-bar">
          <div className="nl-tabs">
            <button
              className={`nl-tab ${frequencyFilter === "All" ? "active" : ""}`}
              onClick={() => setFrequencyFilter("All")}
            >
              All Frequencies <span className="nl-tab-count">{newsletters.length}</span>
            </button>
            <button
              className={`nl-tab ${frequencyFilter === "Weekly" ? "active" : ""}`}
              onClick={() => setFrequencyFilter("Weekly")}
            >
              Weekly <span className="nl-tab-count">{weeklyCount}</span>
            </button>
            <button
              className={`nl-tab ${frequencyFilter === "Monthly" ? "active" : ""}`}
              onClick={() => setFrequencyFilter("Monthly")}
            >
              Monthly <span className="nl-tab-count">{monthlyCount}</span>
            </button>
            <button
              className={`nl-tab ${frequencyFilter === "Bi-Weekly" ? "active" : ""}`}
              onClick={() => setFrequencyFilter("Bi-Weekly")}
            >
              Bi-Weekly <span className="nl-tab-count">{biweeklyCount}</span>
            </button>
          </div>

          <div className="nl-search">
            <input
              type="text"
              placeholder="Search newsletters by title or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="nl-search-icon">🔍</span>
          </div>
        </div>

        {/* Grid */}
        <div className="nl-grid">
          {filtered.length === 0 ? (
            <div className="nl-empty-box">
              <div className="nl-empty-icon">✉️</div>
              <h3>No newsletters match your filter</h3>
              <p>Try clearing your search or add a new newsletter edition right now.</p>
              <button className="nl-add-btn" onClick={handleOpenAddModal}>
                + Add Newsletter
              </button>
            </div>
          ) : (
            filtered.map((item) => (
              <div className="nl-card" key={item._id}>
                <div className="nl-card-cover">
                  <img src={item.image} alt={item.title} loading="lazy" />
                  <div className="nl-cover-badges">
                    <span className="nl-freq-badge">{item.frequency || "Weekly"}</span>
                    <span className={`nl-status-pill ${item.status === "Published" ? "published" : "draft"}`}>
                      {item.status === "Published" ? "● Published" : "○ Draft"}
                    </span>
                  </div>
                </div>

                <div className="nl-card-body">
                  <span className="nl-card-category">{item.category}</span>
                  <h3 className="nl-card-title">{item.title}</h3>
                  <p className="nl-card-summary">{item.summary}</p>

                  {item.highlights && item.highlights.length > 0 && (
                    <div className="nl-highlights-list">
                      {item.highlights.slice(0, 3).map((h, idx) => (
                        <div className="nl-highlight-item" key={idx}>
                          <span className="bullet">▸</span>
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="nl-card-meta">
                    <span className="date-read">
                      📅 {item.date} · ⏱ {item.readTime || "4 min read"}
                    </span>
                    <span className="subscribers">👥 {item.subscribersCount || "1,200+ Readers"}</span>
                  </div>
                </div>

                <div className="nl-card-actions">
                  <button
                    className="nl-btn-edit"
                    onClick={() => handleOpenEditModal(item)}
                    title="Edit issue details"
                  >
                    ✎ Edit
                  </button>
                  <button
                    className="nl-btn-form"
                    onClick={() => handleOpenFormSettings(item)}
                    title="Configure gated subscribe form fields for this edition"
                  >
                    ⚙ Form Controls
                  </button>
                  <button
                    className="nl-btn-delete"
                    onClick={() => handleDelete(item._id, item.title)}
                    title="Delete newsletter issue"
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add / Edit Modal */}
        {isModalOpen && (
          <div className="nl-modal-backdrop" onClick={() => setIsModalOpen(false)}>
            <div className="nl-modal" onClick={(e) => e.stopPropagation()}>
              <div className="nl-modal-header">
                <div>
                  <h3>{isEditing ? "✎ Edit Newsletter Issue" : "+ Add Newsletter Issue"}</h3>
                  <p>
                    {isEditing
                      ? "Update metadata, industry categorization, and highlights."
                      : "Create a new edition for your publication subscriber base."}
                  </p>
                </div>
                <button
                  className="nl-modal-close"
                  onClick={() => setIsModalOpen(false)}
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveModal}>
                <div className="nl-modal-body">
                  <div className="nl-form-grid">
                    <div className="nl-form-field full">
                      <label>Newsletter Title *</label>
                      <input
                        type="text"
                        required
                        value={formTitle}
                        onChange={(e) => {
                          setFormTitle(e.target.value);
                          if (!isEditing) {
                            setFormSlug(generateSlug(e.target.value));
                          }
                        }}
                        placeholder="e.g. Weekly B2B Pipeline Dispatch: Issue #44"
                      />
                    </div>

                    <div className="nl-form-field">
                      <label>Frequency</label>
                      <select
                        value={formFrequency}
                        onChange={(e) =>
                          setFormFrequency(e.target.value as "Weekly" | "Monthly" | "Bi-Weekly")
                        }
                      >
                        <option value="Weekly">Weekly</option>
                        <option value="Monthly">Monthly</option>
                        <option value="Bi-Weekly">Bi-Weekly</option>
                      </select>
                    </div>

                    <div className="nl-form-field">
                      <label>Industry / Topic</label>
                      <select
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value)}
                      >
                        {INDUSTRIES.map((ind) => (
                          <option key={ind} value={ind}>
                            {ind}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="nl-form-field">
                      <label>Author / Editorial</label>
                      <input
                        type="text"
                        value={formAuthor}
                        onChange={(e) => setFormAuthor(e.target.value)}
                        placeholder="GETprospeKt Editorial"
                      />
                    </div>

                    <div className="nl-form-field">
                      <label>Publication Date</label>
                      <input
                        type="text"
                        value={formDate}
                        onChange={(e) => setFormDate(e.target.value)}
                        placeholder="e.g. Sep 2026"
                      />
                    </div>

                    <div className="nl-form-field">
                      <label>Read Time</label>
                      <input
                        type="text"
                        value={formReadTime}
                        onChange={(e) => setFormReadTime(e.target.value)}
                        placeholder="e.g. 4 min read"
                      />
                    </div>

                    <div className="nl-form-field">
                      <label>Status</label>
                      <select
                        value={formStatus}
                        onChange={(e) =>
                          setFormStatus(e.target.value as "Published" | "Draft")
                        }
                      >
                        <option value="Published">Published</option>
                        <option value="Draft">Draft</option>
                      </select>
                    </div>

                    <div className="nl-form-field">
                      <label>Subscriber Footprint</label>
                      <input
                        type="text"
                        value={formSubscribers}
                        onChange={(e) => setFormSubscribers(e.target.value)}
                        placeholder="e.g. 1,450 subscribers"
                      />
                    </div>

                    <div className="nl-form-field full">
                      <label>Issue Summary / Abstract *</label>
                      <textarea
                        required
                        value={formSummary}
                        onChange={(e) => setFormSummary(e.target.value)}
                        placeholder="Brief summary explaining what subscribers will learn in this issue..."
                      />
                    </div>

                    <div className="nl-form-field full">
                      <label>Key Highlights / Takeaways (One per line)</label>
                      <textarea
                        value={formHighlightsText}
                        onChange={(e) => setFormHighlightsText(e.target.value)}
                        placeholder="Account intent signal triggers&#10;BANT qualification benchmarks&#10;Weekly enterprise buyer shifts"
                      />
                    </div>

                    <div className="nl-form-field full">
                      <label>Cover Image URL</label>
                      <input
                        type="url"
                        value={formImage}
                        onChange={(e) => setFormImage(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                      />
                      <label style={{ marginTop: "10px", fontSize: "11.5px" }}>
                        Or Choose From Curated Presets:
                      </label>
                      <div className="nl-presets-row">
                        {PRESET_COVERS.map((preset) => (
                          <div
                            key={preset.label}
                            className={`nl-preset-thumb ${formImage === preset.url ? "selected" : ""}`}
                            onClick={() => setFormImage(preset.url)}
                          >
                            <img src={preset.url} alt={preset.label} />
                            <span>{preset.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="nl-modal-footer">
                  <button
                    type="button"
                    className="nl-btn-cancel"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="nl-btn-submit">
                    {isEditing ? "Save Changes" : "+ Create Newsletter"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Individual Form Settings Modal */}
        {isItemFormSettingsOpen && itemFormSettingsTarget && (
          <ItemFormSettingsModal
            isOpen={isItemFormSettingsOpen}
            onClose={() => {
              setIsItemFormSettingsOpen(false);
              setItemFormSettingsTarget(null);
            }}
            itemTitle={itemFormSettingsTarget.title}
            itemTypeLabel="Newsletter"
            initialConfig={itemFormSettingsTarget.formConfig || null}
            onSave={handleSaveFormConfig}
            showToast={showToast}
          />
        )}
      </div>
    </>
  );
};

export default NewsletterManager;

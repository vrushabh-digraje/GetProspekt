import React, { useState, useEffect } from "react";
import {
  newslettersStorageApi,
  newslettersApi,
  relatedContentStorageApi,
  type NewsletterData,
  type RelatedContentItem,
  type GatedFormConfig,
} from "../../services/api";
import { ItemFormSettingsModal } from "./ItemFormSettingsModal";

interface NewsletterManagerProps {
  showToast: (msg: string) => void;
}

const PRESET_ARTICLES = [
  {
    title: "The Trust Premium of AI in Personalization for Brands",
    category: "AI & Personalization",
    author: "Aafreen Shaikh",
    date: "Sep 2, 2026",
    link: "/article/trust-premium-ai-personalization",
    description: "Explore the role of AI in creating personalized experiences that build trust with consumers.",
  },
  {
    title: "Activating High-Value Audiences With First Party Data",
    category: "First-Party Data",
    author: "Aafreen Shaikh",
    date: "Jul 2, 2026",
    link: "/article/guest-first-party-data",
    description: "Discover effective strategies to activate high-value audiences while safeguarding sensitive customer information.",
  },
  {
    title: "How CMOs Are Driving Success in an AI-Driven World",
    category: "Executive Strategy",
    author: "Aafreen Shaikh",
    date: "May 20, 2026",
    link: "/article/guest-ai-driven-cmos",
    description: "Discover how CMOs leverage AI to enhance brand success and drive innovation across enterprise marketing.",
  },
  {
    title: "From AI Tools to AI-Native Marketing",
    category: "AI Marketing",
    author: "Aafreen Shaikh",
    date: "May 4, 2026",
    link: "/article/guest-ai-native-marketing",
    description: "Learn how CMOs are building marketing organizations for the next era of growth and automation.",
  },
  {
    title: "How AI Is Transforming Marketing and Advertising",
    category: "Advertising & AI",
    author: "Aafreen Shaikh",
    date: "Apr 30, 2026",
    link: "/article/guest-ai-marketing-advertising",
    description: "Explore the transformative impact of AI across modern marketing and advertising.",
  },
  {
    title: "Better pipeline starts with better decisions",
    category: "B2B Lead Generation",
    author: "GETprospeKt",
    date: "Sep 2026",
    link: "/article/better-pipeline-starts-with-better-decisions",
    description: "GETprospeKt is a B2B lead-generation partner helping marketing teams turn their target market into qualified leads.",
  },
  {
    title: "Human-Verified Data",
    category: "Lead-Generation Solution",
    author: "GETprospeKt",
    date: "Sep 2026",
    link: "/article/human-verified-data",
    description: "Prospect data manually reviewed and verified for accuracy, completeness and recency.",
  },
  {
    title: "Building Customer Trust Through Data Integrity",
    category: "Data Integrity",
    author: "Aafreen Shaikh",
    date: "Apr 15, 2026",
    link: "/article/guest-customer-trust",
    description: "How modern enterprises establish lasting customer trust through ethical data handling and verified compliance.",
  },
  {
    title: "Data-Driven Leadership in B2B Organizations",
    category: "Leadership",
    author: "Aafreen Shaikh",
    date: "Mar 28, 2026",
    link: "/article/guest-data-driven-leadership",
    description: "Strategic frameworks for modern revenue leaders to transition from reactive sales to predictive outbound orchestration.",
  },
];

const DEFAULT_COVER = "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=90";

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
  // Top Level Section: Newsletters vs Related Content
  const [managerSection, setManagerSection] = useState<"newsletters" | "related">("newsletters");

  const [newsletters, setNewsletters] = useState<NewsletterData[]>(() =>
    newslettersStorageApi.getAll()
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [frequencyFilter, setFrequencyFilter] = useState<string>("All");

  // Related Content State
  const [relatedItems, setRelatedItems] = useState<RelatedContentItem[]>(() =>
    relatedContentStorageApi.getAll()
  );
  const [relatedSearchQuery, setRelatedSearchQuery] = useState("");

  // Related Modal State for Add / Edit
  const [isRelatedModalOpen, setIsRelatedModalOpen] = useState(false);
  const [isEditingRelated, setIsEditingRelated] = useState(false);
  const [editingRelatedId, setEditingRelatedId] = useState<string | null>(null);

  // Form Fields for Related Content
  const [relTitle, setRelTitle] = useState("");
  const [relCategory, setRelCategory] = useState("AI & Personalization");
  const [relAuthor, setRelAuthor] = useState("Aafreen Shaikh");
  const [relDate, setRelDate] = useState("Sep 2, 2026");
  const [relLink, setRelLink] = useState("/article/trust-premium-ai-personalization");
  const [relDescription, setRelDescription] = useState("");

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
    const handleRelatedUpdate = () => {
      setRelatedItems(relatedContentStorageApi.getAll());
    };
    window.addEventListener("gp_newsletters_updated", handleUpdate);
    window.addEventListener("gp_related_content_updated", handleRelatedUpdate);
    return () => {
      window.removeEventListener("gp_newsletters_updated", handleUpdate);
      window.removeEventListener("gp_related_content_updated", handleRelatedUpdate);
    };
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
    setFormImage(DEFAULT_COVER);
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
    setFormImage(item.image || DEFAULT_COVER);
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
        image: formImage || DEFAULT_COVER,
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
        image: formImage || DEFAULT_COVER,
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

  // ================= RELATED CONTENT HANDLERS =================
  const handleOpenAddRelatedModal = () => {
    setIsEditingRelated(false);
    setEditingRelatedId(null);
    setRelTitle("");
    setRelCategory("AI & Personalization");
    setRelAuthor("Aafreen Shaikh");
    setRelDate(new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }));
    setRelLink("/article/");
    setRelDescription("");
    setIsRelatedModalOpen(true);
  };

  const handleOpenEditRelatedModal = (item: RelatedContentItem) => {
    setIsEditingRelated(true);
    setEditingRelatedId(item._id || item.id || "");
    setRelTitle(item.title);
    setRelCategory(item.category || "AI & Personalization");
    setRelAuthor(item.author || "Aafreen Shaikh");
    setRelDate(item.date || "Sep 2, 2026");
    setRelLink(item.link || "");
    setRelDescription(item.description || "");
    setIsRelatedModalOpen(true);
  };

  const handleSelectPresetArticle = (presetIndex: number) => {
    if (presetIndex < 0 || presetIndex >= PRESET_ARTICLES.length) return;
    const p = PRESET_ARTICLES[presetIndex];
    setRelTitle(p.title);
    setRelCategory(p.category);
    setRelAuthor(p.author);
    setRelDate(p.date);
    setRelLink(p.link);
    setRelDescription(p.description);
  };

  const handleSaveRelated = (e: React.FormEvent) => {
    e.preventDefault();
    if (!relTitle.trim()) {
      alert("Please provide an article title.");
      return;
    }
    if (!relLink.trim()) {
      alert("Please provide a destination link.");
      return;
    }

    if (isEditingRelated && editingRelatedId) {
      const updated = relatedItems.map((item) => {
        if (item._id === editingRelatedId || item.id === editingRelatedId) {
          return {
            ...item,
            title: relTitle.trim(),
            category: relCategory.trim(),
            author: relAuthor.trim(),
            date: relDate.trim(),
            link: relLink.trim(),
            description: relDescription.trim(),
          };
        }
        return item;
      });
      relatedContentStorageApi.saveAll(updated);
      setRelatedItems(updated);
      showToast(`Updated related content: "${relTitle.trim()}"`);
    } else {
      const newItem: RelatedContentItem = {
        _id: `rc-${Date.now()}`,
        id: `rc-${Date.now()}`,
        title: relTitle.trim(),
        category: relCategory.trim(),
        author: relAuthor.trim(),
        date: relDate.trim(),
        link: relLink.trim(),
        description: relDescription.trim(),
      };
      const updated = [...relatedItems, newItem];
      relatedContentStorageApi.saveAll(updated);
      setRelatedItems(updated);
      showToast(`Added related content: "${relTitle.trim()}"`);
    }

    setIsRelatedModalOpen(false);
  };

  const handleDeleteRelated = (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}" from Related Content?`)) {
      return;
    }
    const updated = relatedItems.filter((i) => i._id !== id && i.id !== id);
    relatedContentStorageApi.saveAll(updated);
    setRelatedItems(updated);
    showToast(`Removed from related content: ${title}`);
  };

  const handleMoveRelated = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= relatedItems.length) return;
    const reordered = [...relatedItems];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);
    relatedContentStorageApi.saveAll(reordered);
    setRelatedItems(reordered);
    showToast(`Updated order: "${moved.title}" moved ${direction}`);
  };

  const handleResetRelatedDefaults = () => {
    if (window.confirm("Reset Related Content recommendations back to the 5 default canonical articles?")) {
      const reset = relatedContentStorageApi.resetDefaults();
      setRelatedItems(reset);
      showToast("Reset Related Content to default articles.");
    }
  };

  const filteredRelated = relatedItems.filter((item) => {
    const q = relatedSearchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      item.author.toLowerCase().includes(q) ||
      (item.category && item.category.toLowerCase().includes(q)) ||
      item.link.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q)
    );
  });

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
          flex-wrap: wrap;
        }

        .nl-btn-view {
          background: rgba(0, 70, 252, 0.2);
          color: #60A5FA;
          border: 1px solid rgba(96, 165, 250, 0.4);
          padding: 8px 12px;
          border-radius: 7px;
          font-size: 12.5px;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .nl-btn-view:hover {
          background: #0046FC;
          border-color: #0046FC;
          color: #FFFFFF;
        }

        .nl-title-live-link {
          color: #FFFFFF;
          text-decoration: none;
          transition: color 0.15s;
        }

        .nl-title-live-link:hover {
          color: #00D2FF;
          text-decoration: underline;
        }

        .nl-card-cover-link {
          display: block;
          text-decoration: none;
          cursor: pointer;
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

        /* Cover Image Upload & Input */
        .nl-image-input-group {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .nl-image-text-input {
          flex: 1;
          min-width: 260px;
        }

        .nl-upload-btn {
          background: #111C2D;
          color: #00D2FF;
          border: 1px solid rgba(0, 210, 255, 0.35);
          padding: 10px 18px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s ease;
          white-space: nowrap;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .nl-upload-btn:hover {
          background: rgba(0, 210, 255, 0.15);
          border-color: #00D2FF;
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(0, 210, 255, 0.25);
        }

        .nl-image-preview-box {
          margin-top: 12px;
          background: #090E17;
          border: 1px solid rgba(203, 213, 225, 0.14);
          border-radius: 10px;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .nl-image-preview-box img {
          width: 90px;
          height: 60px;
          border-radius: 6px;
          object-fit: cover;
          border: 1px solid rgba(0, 210, 255, 0.3);
          background: #111C2D;
        }

        .nl-image-preview-info {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          font-size: 13px;
          color: #94A3B8;
        }

        .nl-image-clear-btn {
          background: transparent;
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #EF4444;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .nl-image-clear-btn:hover {
          background: rgba(239, 68, 68, 0.15);
          border-color: #EF4444;
          color: #F87171;
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

        /* =========================================
           TOP LEVEL SUB-NAV SWITCHER
        ========================================= */
        .nl-top-nav {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #090E17;
          border: 1px solid rgba(203, 213, 225, 0.12);
          border-radius: 12px;
          padding: 6px;
          margin-bottom: 24px;
        }

        .nl-top-tab {
          background: transparent;
          border: 1px solid transparent;
          color: #94A3B8;
          padding: 11px 22px;
          border-radius: 9px;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          transition: all 0.2s ease;
        }

        .nl-top-tab:hover {
          color: #FFFFFF;
          background: rgba(255, 255, 255, 0.04);
        }

        .nl-top-tab.active {
          background: #111C2D;
          color: #FFFFFF;
          border-color: rgba(0, 210, 255, 0.35);
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);
        }

        .nl-top-tab .tab-icon {
          font-size: 16px;
        }

        .nl-top-tab .tab-pill {
          font-size: 11px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.08);
          color: #94A3B8;
        }

        .nl-top-tab.active .tab-pill {
          background: rgba(0, 210, 255, 0.15);
          color: #00D2FF;
        }

        .nl-top-tab .tab-pill.highlight {
          background: rgba(0, 70, 252, 0.25);
          color: #60A5FA;
        }

        .nl-top-tab.active .tab-pill.highlight {
          background: rgba(0, 210, 255, 0.2);
          color: #00D2FF;
        }

        /* =========================================
           RELATED CONTENT STYLES
        ========================================= */
        .rc-section {
          width: 100%;
        }

        .rc-info-banner {
          background: linear-gradient(135deg, rgba(0, 70, 252, 0.12) 0%, rgba(0, 210, 255, 0.06) 100%);
          border: 1px solid rgba(0, 210, 255, 0.22);
          border-radius: 10px;
          padding: 14px 18px;
          margin-bottom: 22px;
          display: flex;
          align-items: center;
          gap: 14px;
          color: #CBD5E1;
          font-size: 13px;
          line-height: 1.5;
        }

        .rc-info-banner-icon {
          font-size: 24px;
          flex-shrink: 0;
        }

        .rc-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .rc-card {
          background: #0D1522;
          border: 1px solid rgba(203, 213, 225, 0.12);
          border-radius: 12px;
          padding: 22px;
          display: flex;
          flex-direction: column;
          transition: all 0.2s ease;
          position: relative;
        }

        .rc-card:hover {
          border-color: rgba(0, 210, 255, 0.35);
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(0, 0, 0, 0.35);
        }

        .rc-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .rc-order-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 3px 8px;
          border-radius: 6px;
          background: rgba(0, 70, 252, 0.18);
          color: #60A5FA;
          border: 1px solid rgba(0, 70, 252, 0.3);
        }

        .rc-reorder-group {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .rc-reorder-btn {
          background: #111C2D;
          border: 1px solid rgba(203, 213, 225, 0.16);
          color: #CBD5E1;
          width: 28px;
          height: 28px;
          border-radius: 6px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .rc-reorder-btn:hover:not(:disabled) {
          background: #0046FC;
          color: #FFFFFF;
          border-color: #0046FC;
        }

        .rc-reorder-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .rc-category-tag {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #00D2FF;
          margin-bottom: 8px;
          display: inline-block;
        }

        .rc-card-title {
          color: #FFFFFF;
          font-size: 16px;
          font-weight: 700;
          line-height: 1.4;
          margin: 0 0 10px;
        }

        .rc-card-meta {
          font-size: 12px;
          color: #94A3B8;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .rc-card-meta strong {
          color: #CBD5E1;
        }

        .rc-card-desc {
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

        .rc-card-link-box {
          background: #111C2D;
          border: 1px solid rgba(203, 213, 225, 0.1);
          border-radius: 8px;
          padding: 8px 12px;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          font-size: 12px;
        }

        .rc-card-link-text {
          color: #00D2FF;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-family: monospace;
          max-width: 250px;
        }

        .rc-card-link-btn {
          color: #94A3B8;
          text-decoration: none;
          font-size: 11px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: color 0.2s ease;
          flex-shrink: 0;
        }

        .rc-card-link-btn:hover {
          color: #FFFFFF;
        }

        .rc-card-footer {
          display: flex;
          align-items: center;
          gap: 8px;
          padding-top: 14px;
          border-top: 1px solid rgba(203, 213, 225, 0.08);
        }

        /* Sidebar Preview inside modal */
        .rc-live-preview {
          background: #090E17;
          border: 1px dashed rgba(0, 210, 255, 0.35);
          border-radius: 10px;
          padding: 16px;
          margin-top: 6px;
        }

        .rc-live-preview-title {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #00D2FF;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .rc-preview-widget {
          background: #FFFFFF;
          color: #0F172A;
          border-radius: 8px;
          padding: 16px;
          border-left: 4px solid #0046FC;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
        }

        .rc-preview-category {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #0046FC;
          margin-bottom: 4px;
        }

        .rc-preview-head {
          font-size: 15px;
          font-weight: 700;
          color: #0F172A;
          margin: 0 0 6px;
          line-height: 1.35;
        }

        .rc-preview-meta {
          font-size: 12px;
          color: #64748B;
          margin-bottom: 8px;
        }

        .rc-preview-desc {
          font-size: 12.5px;
          color: #475569;
          line-height: 1.45;
          margin: 0;
        }
      `}</style>

      <div className="nl-manager">
        {/* Top-Level Section Switcher */}
        <div className="nl-top-nav">
          <button
            type="button"
            className={`nl-top-tab ${managerSection === "newsletters" ? "active" : ""}`}
            onClick={() => setManagerSection("newsletters")}
          >
            <span className="tab-icon">✉</span>
            <span>Newsletter Issues & Dispatches</span>
            <span className="tab-pill">{newsletters.length}</span>
          </button>
          <button
            type="button"
            className={`nl-top-tab ${managerSection === "related" ? "active" : ""}`}
            onClick={() => setManagerSection("related")}
          >
            <span className="tab-icon">🔗</span>
            <span>Related Content</span>
            <span className="tab-pill highlight">{relatedItems.length} Sidebar Articles</span>
          </button>
        </div>

        {/* NEWSLETTERS MANAGEMENT VIEW */}
        {managerSection === "newsletters" && (
          <>
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
                <a
                  href={`/newsletter/${item.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nl-card-cover-link"
                  title={`Open live landing page for ${item.title}`}
                >
                  <div className="nl-card-cover">
                    <img src={item.image} alt={item.title} loading="lazy" />
                    <div className="nl-cover-badges">
                      <span className="nl-freq-badge">{item.frequency || "Weekly"}</span>
                      <span className={`nl-status-pill ${item.status === "Published" ? "published" : "draft"}`}>
                        {item.status === "Published" ? "● Published" : "○ Draft"}
                      </span>
                    </div>
                  </div>
                </a>

                <div className="nl-card-body">
                  <span className="nl-card-category">{item.category}</span>
                  <h3 className="nl-card-title">
                    <a
                      href={`/newsletter/${item.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="nl-title-live-link"
                      title={`Open live landing page for ${item.title}`}
                    >
                      {item.title} <span style={{ fontSize: "12px", color: "#60A5FA" }}>↗</span>
                    </a>
                  </h3>
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
                  <a
                    href={`/newsletter/${item.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nl-btn-view"
                    title="Open live public landing page in new tab"
                  >
                    🔗 Explore ↗
                  </a>
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
          </>
        )}

        {/* RELATED CONTENT MANAGEMENT VIEW */}
        {managerSection === "related" && (
          <div className="rc-section">
            {/* Header showcase */}
            <div className="nl-header-card">
              <div className="nl-header-info">
                <h2>
                  Related Content Management
                  <span className="nl-badge">{relatedItems.length} Recommendations</span>
                </h2>
                <p>
                  Curate the "Related Content" articles displayed in the right-hand sidebar widget across all article reading experiences. Readers see these recommendations as next reads to explore further research and solutions.
                </p>
              </div>
              <div className="nl-header-actions">
                <button
                  className="nl-reset-btn"
                  onClick={handleResetRelatedDefaults}
                  title="Restore default canonical related articles"
                >
                  ↺ Reset Defaults
                </button>
                <button
                  className="nl-add-btn"
                  onClick={handleOpenAddRelatedModal}
                  title="Add a new article to sidebar recommendations"
                >
                  <span>+</span> Add Related Content
                </button>
              </div>
            </div>

            {/* Visual placement helper banner */}
            <div className="rc-info-banner">
              <div className="rc-info-banner-icon">💡</div>
              <div>
                <strong>Public Placement:</strong> This widget appears in the right sidebar of every article page (e.g. <em>The Trust Premium of AI</em>, <em>Better Pipeline Starts with Better Decisions</em>). Use the ▲ and ▼ buttons on any card below to change the order in which readers encounter recommendations.
              </div>
            </div>

            {/* Search and item count bar */}
            <div className="nl-filter-bar">
              <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#94A3B8", fontSize: "13.5px" }}>
                <span>Showing <strong>{filteredRelated.length}</strong> of <strong>{relatedItems.length}</strong> sidebar recommendations</span>
              </div>

              <div className="nl-search">
                <input
                  type="text"
                  placeholder="Filter by title, author, category, or URL..."
                  value={relatedSearchQuery}
                  onChange={(e) => setRelatedSearchQuery(e.target.value)}
                />
                <span className="nl-search-icon">🔍</span>
              </div>
            </div>

            {/* Related Cards Grid */}
            <div className="rc-cards-grid">
              {filteredRelated.length === 0 ? (
                <div className="nl-empty-box" style={{ gridColumn: "1 / -1" }}>
                  <div className="nl-empty-icon">🔗</div>
                  <h3>No related articles match your search</h3>
                  <p>Try clearing your search query or add a new recommendation to public article sidebars.</p>
                  <button className="nl-add-btn" onClick={handleOpenAddRelatedModal} style={{ margin: "0 auto" }}>
                    + Add Related Article
                  </button>
                </div>
              ) : (
                filteredRelated.map((item, idx) => {
                  const originalIndex = relatedItems.findIndex((r) => (r._id || r.id) === (item._id || item.id));
                  return (
                    <div className="rc-card" key={item._id || item.id || idx}>
                      <div className="rc-card-top">
                        <span className="rc-order-tag">
                          Sidebar Position #{originalIndex + 1}
                        </span>
                        <div className="rc-reorder-group">
                          <button
                            type="button"
                            className="rc-reorder-btn"
                            disabled={originalIndex === 0}
                            onClick={() => handleMoveRelated(originalIndex, "up")}
                            title="Move Up in Sidebar"
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            className="rc-reorder-btn"
                            disabled={originalIndex === relatedItems.length - 1}
                            onClick={() => handleMoveRelated(originalIndex, "down")}
                            title="Move Down in Sidebar"
                          >
                            ▼
                          </button>
                        </div>
                      </div>

                      {item.category && (
                        <span className="rc-category-tag">{item.category}</span>
                      )}

                      <h3 className="rc-card-title">
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "inherit", textDecoration: "none" }}
                          title={`Open ${item.title}`}
                        >
                          {item.title} <span style={{ fontSize: "12px", color: "#60A5FA" }}>↗</span>
                        </a>
                      </h3>

                      <div className="rc-card-meta">
                        <span>By <strong>{item.author}</strong></span>
                        <span>•</span>
                        <span>{item.date}</span>
                      </div>

                      <p className="rc-card-desc">{item.description}</p>

                      <div className="rc-card-link-box">
                        <span className="rc-card-link-text" title={item.link}>
                          🔗 {item.link}
                        </span>
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rc-card-link-btn"
                          title="Open article in new tab"
                        >
                          Open ↗
                        </a>
                      </div>

                      <div className="rc-card-footer">
                        <button
                          type="button"
                          className="nl-btn-edit"
                          onClick={() => handleOpenEditRelatedModal(item)}
                        >
                          ✎ Edit
                        </button>
                        <button
                          type="button"
                          className="nl-btn-delete"
                          onClick={() => handleDeleteRelated(item._id || item.id || "", item.title)}
                          title="Remove from Related Content"
                        >
                          🗑
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Add / Edit Newsletter Modal */}
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
                      <label>Cover Image</label>
                      <div className="nl-image-input-group">
                        <input
                          type="text"
                          value={formImage}
                          onChange={(e) => setFormImage(e.target.value)}
                          placeholder="Paste image URL (https://...) or click Upload from device"
                          className="nl-image-text-input"
                        />
                        <label className="nl-upload-btn" title="Pick an image file from your computer">
                          <span>📁</span> Upload Image
                          <input
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  if (reader.result) {
                                    setFormImage(reader.result as string);
                                    showToast("Cover image uploaded successfully.");
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                      </div>

                      {/* Cover Image Preview */}
                      {formImage && (
                        <div className="nl-image-preview-box">
                          <img
                            src={formImage}
                            alt="Cover preview"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.opacity = "0.3";
                            }}
                          />
                          <div className="nl-image-preview-info">
                            <span>Image active for this newsletter issue</span>
                            <button
                              type="button"
                              onClick={() => setFormImage("")}
                              className="nl-image-clear-btn"
                              title="Clear current cover image"
                            >
                              ✕ Remove
                            </button>
                          </div>
                        </div>
                      )}
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

        {/* Add / Edit Related Content Modal */}
        {isRelatedModalOpen && (
          <div className="nl-modal-backdrop" onClick={() => setIsRelatedModalOpen(false)}>
            <div className="nl-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "700px" }}>
              <div className="nl-modal-header">
                <div>
                  <h3>{isEditingRelated ? "✎ Edit Related Content" : "+ Add Related Content"}</h3>
                  <p>Configure article recommendation displayed in public article sidebars.</p>
                </div>
                <button
                  type="button"
                  className="nl-modal-close"
                  onClick={() => setIsRelatedModalOpen(false)}
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveRelated}>
                <div className="nl-modal-body">
                  <div className="nl-form-grid">
                    {/* Autofill helper dropdown */}
                    <div className="nl-form-field full" style={{ background: "rgba(0, 210, 255, 0.05)", padding: "12px", borderRadius: "8px", border: "1px dashed rgba(0, 210, 255, 0.25)" }}>
                      <label style={{ color: "#00D2FF" }}>
                        ⚡ Quick Autofill from Published Articles:
                      </label>
                      <select
                        onChange={(e) => {
                          const idx = parseInt(e.target.value, 10);
                          if (!isNaN(idx)) handleSelectPresetArticle(idx);
                        }}
                        defaultValue=""
                      >
                        <option value="" disabled>-- Select an article to auto-fill details --</option>
                        {PRESET_ARTICLES.map((p, pIdx) => (
                          <option key={p.link} value={pIdx}>
                            {p.title} ({p.category})
                          </option>
                        ))}
                      </select>
                      <span style={{ fontSize: "11px", color: "#94A3B8" }}>
                        Selecting an article will pre-populate the title, author, link, category, and summary below. You can customize them freely.
                      </span>
                    </div>

                    <div className="nl-form-field full">
                      <label>Article Title *</label>
                      <input
                        type="text"
                        placeholder="e.g. Activating High-Value Audiences With First Party Data"
                        value={relTitle}
                        onChange={(e) => setRelTitle(e.target.value)}
                        required
                      />
                    </div>

                    <div className="nl-form-field">
                      <label>Category Tag</label>
                      <input
                        type="text"
                        placeholder="e.g. AI & Personalization, First-Party Data"
                        value={relCategory}
                        onChange={(e) => setRelCategory(e.target.value)}
                      />
                    </div>

                    <div className="nl-form-field">
                      <label>Author Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Aafreen Shaikh or GETprospeKt"
                        value={relAuthor}
                        onChange={(e) => setRelAuthor(e.target.value)}
                      />
                    </div>

                    <div className="nl-form-field">
                      <label>Publication Date</label>
                      <input
                        type="text"
                        placeholder="e.g. Sep 2, 2026"
                        value={relDate}
                        onChange={(e) => setRelDate(e.target.value)}
                      />
                    </div>

                    <div className="nl-form-field">
                      <label>Destination Link / URL *</label>
                      <input
                        type="text"
                        placeholder="/article/guest-first-party-data"
                        value={relLink}
                        onChange={(e) => setRelLink(e.target.value)}
                        required
                      />
                    </div>

                    <div className="nl-form-field full">
                      <label>Description / Teaser Summary *</label>
                      <textarea
                        rows={3}
                        placeholder="Discover effective strategies to activate high-value audiences while safeguarding sensitive data..."
                        value={relDescription}
                        onChange={(e) => setRelDescription(e.target.value)}
                      />
                    </div>

                    {/* Live Sidebar Preview */}
                    <div className="nl-form-field full">
                      <div className="rc-live-preview">
                        <div className="rc-live-preview-title">
                          <span>👁️</span> Live Article Sidebar Preview
                        </div>
                        <div className="rc-preview-widget">
                          {relCategory && (
                            <div className="rc-preview-category">{relCategory}</div>
                          )}
                          <div className="rc-preview-head">
                            {relTitle || "Article Title Preview"}
                          </div>
                          <div className="rc-preview-meta">
                            By <strong>{relAuthor || "Author Name"}</strong> | {relDate || "Date"}
                          </div>
                          <p className="rc-preview-desc">
                            {relDescription || "Teaser description will be rendered here as readers browse related recommendations."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="nl-modal-footer">
                  <button
                    type="button"
                    className="nl-btn-cancel"
                    onClick={() => setIsRelatedModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="nl-btn-submit">
                    {isEditingRelated ? "Save Changes" : "+ Add to Sidebar"}
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

import { useState, useMemo } from "react";
import { enquiriesApi } from "../../services/api";

export type LeadType = "contact" | "download" | "subscription";
export type TabFilter = "all" | "download" | "contact" | "subscription";
export type SortOption = "newest" | "oldest" | "name_asc" | "company_asc";

interface EnquiryManagerProps {
  enquiries: any[];
  onEnquiriesChange: (updated: any[]) => void;
  showToast: (msg: string) => void;
}

export interface FormattedDateInfo {
  date: string;
  time: string;
  timeWithSeconds: string;
  relative: string;
  fullISO: string;
}

// --- Professional Clean SVG Icons (replacing unicode emojis/symbols) ---
const IconFileText = ({ size = 13, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ flexShrink: 0, display: "inline-block" }}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

const IconMail = ({ size = 13, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ flexShrink: 0, display: "inline-block" }}>
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const IconNewspaper = ({ size = 13, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ flexShrink: 0, display: "inline-block" }}>
    <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
    <path d="M18 14h-8" />
    <path d="M15 18h-5" />
    <path d="M10 6h8v4h-8V6Z" />
  </svg>
);

const IconClock = ({ size = 12, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ flexShrink: 0, display: "inline-block" }}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const IconPhone = ({ size = 12, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ flexShrink: 0, display: "inline-block" }}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const IconUsers = ({ size = 11, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ flexShrink: 0, display: "inline-block" }}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconBuilding = ({ size = 11, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ flexShrink: 0, display: "inline-block" }}>
    <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
    <path d="M9 22v-4h6v4" />
    <path d="M8 6h.01" />
    <path d="M16 6h.01" />
    <path d="M12 6h.01" />
    <path d="M12 10h.01" />
    <path d="M12 14h.01" />
    <path d="M16 10h.01" />
    <path d="M16 14h.01" />
    <path d="M8 10h.01" />
    <path d="M8 14h.01" />
  </svg>
);

const IconSearch = ({ size = 13, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ flexShrink: 0, display: "inline-block" }}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const IconEye = ({ size = 13, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ flexShrink: 0, display: "inline-block" }}>
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconTrash = ({ size = 13, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ flexShrink: 0, display: "inline-block" }}>
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

const IconUser = ({ size = 13, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ flexShrink: 0, display: "inline-block" }}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconMapPin = ({ size = 13, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ flexShrink: 0, display: "inline-block" }}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const IconShield = ({ size = 13, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ flexShrink: 0, display: "inline-block" }}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

export function formatLeadTimestamp(dateInput?: string | Date | number): FormattedDateInfo {
  if (!dateInput) {
    return {
      date: "—",
      time: "—",
      timeWithSeconds: "—",
      relative: "",
      fullISO: "",
    };
  }

  const d = new Date(dateInput);
  if (isNaN(d.getTime())) {
    return {
      date: String(dateInput),
      time: "",
      timeWithSeconds: "",
      relative: "",
      fullISO: "",
    };
  }

  const date = d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const time = d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const timeWithSeconds = d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const diffSec = Math.floor((Date.now() - d.getTime()) / 1000);
  let relative = "";
  if (diffSec < 60) {
    relative = "Just now";
  } else if (diffSec < 3600) {
    const mins = Math.max(1, Math.floor(diffSec / 60));
    relative = `${mins}m ago`;
  } else if (diffSec < 86400) {
    const hours = Math.floor(diffSec / 3600);
    relative = `${hours}h ago`;
  } else if (diffSec < 604800) {
    const days = Math.floor(diffSec / 86400);
    relative = `${days}d ago`;
  } else {
    relative = date;
  }

  return {
    date,
    time,
    timeWithSeconds,
    relative,
    fullISO: d.toISOString(),
  };
}

export function getLeadType(enq: any): LeadType {
  // Check download signatures first (takes priority over legacy default 'contact' types)
  if (
    enq.resourceId ||
    enq.resourceTitle ||
    enq.assetTitle ||
    enq.assetType ||
    (enq.subject && /download|resource|whitepaper|playbook|case study/i.test(enq.subject)) ||
    (enq.message && /downloaded/i.test(enq.message))
  ) {
    return "download";
  }

  // Check subscription signatures
  if (
    (enq.subject && /newsletter|subscri/i.test(enq.subject)) ||
    (enq.message && /subscribed/i.test(enq.message))
  ) {
    return "subscription";
  }

  if (enq.type === "download" || enq.type === "subscription" || enq.type === "contact") {
    return enq.type;
  }

  return "contact";
}

export default function EnquiryManager({
  enquiries,
  onEnquiriesChange,
  showToast,
}: EnquiryManagerProps) {
  const [activeTab, setActiveTab] = useState<TabFilter>("contact");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  // Categorize leads
  const categorized = useMemo(() => {
    const all = enquiries.map((e) => ({
      ...e,
      _resolvedType: getLeadType(e),
      _ts: formatLeadTimestamp(e.createdAt),
    }));

    const downloads = all.filter((e) => e._resolvedType === "download");
    const contacts = all.filter((e) => e._resolvedType === "contact");
    const subscriptions = all.filter((e) => e._resolvedType === "subscription");

    return { all, downloads, contacts, subscriptions };
  }, [enquiries]);

  // Filter & sort
  const filteredLeads = useMemo(() => {
    let list =
      activeTab === "all"
        ? categorized.all
        : activeTab === "download"
        ? categorized.downloads
        : activeTab === "contact"
        ? categorized.contacts
        : categorized.subscriptions;

    if (statusFilter !== "all") {
      list = list.filter((e) => (e.status || "New").toLowerCase() === statusFilter.toLowerCase());
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((e) => {
        const fullName = `${e.firstName || ""} ${e.lastName || ""}`.toLowerCase();
        const email = (e.email || "").toLowerCase();
        const comp = (e.company || "").toLowerCase();
        const role = (e.jobTitle || "").toLowerCase();
        const phone = (e.telephone || "").toLowerCase();
        const sub = (e.subject || "").toLowerCase();
        const asset = (e.assetTitle || e.resourceTitle || "").toLowerCase();
        const msg = (e.message || "").toLowerCase();
        return (
          fullName.includes(q) ||
          email.includes(q) ||
          comp.includes(q) ||
          role.includes(q) ||
          phone.includes(q) ||
          sub.includes(q) ||
          asset.includes(q) ||
          msg.includes(q)
        );
      });
    }

    return [...list].sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      }
      if (sortBy === "oldest") {
        return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
      }
      if (sortBy === "name_asc") {
        const nameA = `${a.firstName || ""} ${a.lastName || ""}`.trim().toLowerCase();
        const nameB = `${b.firstName || ""} ${b.lastName || ""}`.trim().toLowerCase();
        return nameA.localeCompare(nameB);
      }
      if (sortBy === "company_asc") {
        const compA = (a.company || "").trim().toLowerCase();
        const compB = (b.company || "").trim().toLowerCase();
        return compA.localeCompare(compB);
      }
      return 0;
    });
  }, [categorized, activeTab, statusFilter, searchQuery, sortBy]);

  // Status updates
  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await enquiriesApi.updateStatus(id, status);
      const updated = enquiries.map((e) => (e._id === id ? { ...e, status } : e));
      onEnquiriesChange(updated);
      if (selectedLead && selectedLead._id === id) {
        setSelectedLead({ ...selectedLead, status });
      }
      showToast(`Updated status to "${status}"`);
    } catch (err: any) {
      showToast("Failed to update status");
    }
  };

  // Delete enquiry
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this lead entry?")) return;
    try {
      await enquiriesApi.delete(id);
      const updated = enquiries.filter((e) => e._id !== id);
      onEnquiriesChange(updated);
      if (selectedLead && selectedLead._id === id) {
        setSelectedLead(null);
      }
      showToast("Lead entry deleted");
    } catch (err: any) {
      showToast("Failed to delete lead");
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredLeads.length === 0) {
      showToast("No leads to export.");
      return;
    }

    const headers = [
      "Lead Type",
      "Created Date",
      "Created Time",
      "Full Timestamp",
      "Status",
      "First Name",
      "Last Name",
      "Email",
      "Telephone",
      "Company",
      "Job Title",
      "Company Size",
      "Industry",
      "Country",
      "City",
      "Asset Title",
      "Asset Type",
      "File Format",
      "Subject",
      "Message",
    ];

    const escapeCSV = (val: any) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = filteredLeads.map((e) => {
      const typeLabel =
        e._resolvedType === "download"
          ? "PDF / Asset Download"
          : e._resolvedType === "subscription"
          ? "Newsletter Subscription"
          : "Contact Us Form";

      const assetTitle = e.assetTitle || e.resourceTitle || "";
      const assetType = e.assetType || (e._resolvedType === "download" ? "Whitepaper" : "");
      const format = e.downloadFileType || (e._resolvedType === "download" ? "PDF" : "");

      return [
        escapeCSV(typeLabel),
        escapeCSV(e._ts.date),
        escapeCSV(e._ts.time),
        escapeCSV(e._ts.fullISO),
        escapeCSV(e.status || "New"),
        escapeCSV(e.firstName || ""),
        escapeCSV(e.lastName || ""),
        escapeCSV(e.email || ""),
        escapeCSV(e.telephone || ""),
        escapeCSV(e.company || ""),
        escapeCSV(e.jobTitle || ""),
        escapeCSV(e.companySize || ""),
        escapeCSV(e.industry || ""),
        escapeCSV(e.country || ""),
        escapeCSV(e.city || ""),
        escapeCSV(assetTitle),
        escapeCSV(assetType),
        escapeCSV(format),
        escapeCSV(e.subject || ""),
        escapeCSV(e.message || ""),
      ].join(",");
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    const dateStr = new Date().toISOString().split("T")[0];
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `getprospekt-leads-${activeTab}-${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${filteredLeads.length} leads to CSV.`);
  };

  // Copy Lead summary to clipboard
  const handleCopyLeadDetails = (lead: any) => {
    const summary = [
      `GETprospeKt Lead Record:`,
      `Type: ${lead._resolvedType === "download" ? "PDF Download" : lead._resolvedType === "subscription" ? "Newsletter Subscriber" : "Contact Us"}`,
      `Date & Time: ${lead._ts.date} at ${lead._ts.time} (${lead._ts.fullISO})`,
      `Status: ${lead.status || "New"}`,
      `Name: ${lead.firstName} ${lead.lastName}`,
      `Email: ${lead.email}`,
      lead.telephone ? `Phone: ${lead.telephone}` : null,
      lead.company ? `Company: ${lead.company}` : null,
      lead.jobTitle ? `Job Title: ${lead.jobTitle}` : null,
      lead.companySize ? `Company Size: ${lead.companySize}` : null,
      lead.industry ? `Industry: ${lead.industry}` : null,
      lead.country ? `Country: ${lead.country}` : null,
      lead.city ? `City: ${lead.city}` : null,
      (lead.assetTitle || lead.resourceTitle) ? `Asset: ${lead.assetTitle || lead.resourceTitle} (${lead.assetType || "PDF"})` : null,
      lead.subject ? `Subject: ${lead.subject}` : null,
      lead.message ? `Message: ${lead.message}` : null,
    ].filter(Boolean).join("\n");

    navigator.clipboard.writeText(summary);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
    showToast("Lead details copied to clipboard!");
  };

  const newCount = categorized.all.filter((e) => (e.status || "New").toLowerCase() === "new").length;

  return (
    <div className="gp-lead-manager">
      {/* Top Header & Metrics */}
      <div className="gp-lm-header">
        <div>
          <div className="gp-lm-eyebrow">
            <span>LEAD CAPTURE & CONVERSION</span>
            {newCount > 0 && <span className="gp-lm-new-alert">● {newCount} New Unreviewed</span>}
          </div>
          <h2 className="gp-lm-title">Enquiries & Qualified Leads</h2>
          <p className="gp-lm-subtitle">
            Track, sort, and segment inbound prospects from gated PDF downloads, contact messages, and newsletter subscribers.
          </p>
        </div>

        <div className="gp-lm-header-actions">
          <button
            type="button"
            className="gp-lm-btn-secondary"
            onClick={handleExportCSV}
            title="Download CSV report of current view"
          >
            <span>📥</span> Export CSV ({filteredLeads.length})
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="gp-lm-stats-strip">
        <div
          className={`gp-lm-stat-card ${activeTab === "all" ? "active" : ""}`}
          onClick={() => setActiveTab("all")}
          role="button"
          tabIndex={0}
        >
          <div className="gp-lm-stat-icon gp-stat-all">📊</div>
          <div className="gp-lm-stat-body">
            <span className="gp-lm-stat-num">{categorized.all.length}</span>
            <span className="gp-lm-stat-label">All Submissions</span>
          </div>
        </div>

        <div
          className={`gp-lm-stat-card ${activeTab === "download" ? "active" : ""}`}
          onClick={() => setActiveTab("download")}
          role="button"
          tabIndex={0}
        >
          <div className="gp-lm-stat-icon gp-stat-pdf"><IconFileText size={18} /></div>
          <div className="gp-lm-stat-body">
            <span className="gp-lm-stat-num">{categorized.downloads.length}</span>
            <span className="gp-lm-stat-label">PDF & Asset Downloads</span>
          </div>
        </div>

        <div
          className={`gp-lm-stat-card ${activeTab === "contact" ? "active" : ""}`}
          onClick={() => setActiveTab("contact")}
          role="button"
          tabIndex={0}
        >
          <div className="gp-lm-stat-icon gp-stat-contact"><IconMail size={18} /></div>
          <div className="gp-lm-stat-body">
            <span className="gp-lm-stat-num">{categorized.contacts.length}</span>
            <span className="gp-lm-stat-label">Contact Us Inquiries</span>
          </div>
        </div>

        <div
          className={`gp-lm-stat-card ${activeTab === "subscription" ? "active" : ""}`}
          onClick={() => setActiveTab("subscription")}
          role="button"
          tabIndex={0}
        >
          <div className="gp-lm-stat-icon gp-stat-news"><IconNewspaper size={18} /></div>
          <div className="gp-lm-stat-body">
            <span className="gp-lm-stat-num">{categorized.subscriptions.length}</span>
            <span className="gp-lm-stat-label">Newsletter Subscriptions</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs & Filter Toolbar */}
      <div className="gp-lm-toolbar-panel">
        {/* Segmented Switcher Control */}
        <div className="gp-segmented-switcher-bar" role="tablist">
          <button
            type="button"
            className={`gp-switch-tab ${activeTab === "contact" ? "active" : ""}`}
            onClick={() => setActiveTab("contact")}
          >
            <span>✉️</span>
            <span>Contact Us ({categorized.contacts.length})</span>
          </button>
          <button
            type="button"
            className={`gp-switch-tab ${activeTab === "download" ? "active" : ""}`}
            onClick={() => setActiveTab("download")}
          >
            <span>📄</span>
            <span>PDF Downloads ({categorized.downloads.length})</span>
          </button>
          <button
            type="button"
            className={`gp-switch-tab ${activeTab === "subscription" ? "active" : ""}`}
            onClick={() => setActiveTab("subscription")}
          >
            <span>📰</span>
            <span>Subscriptions ({categorized.subscriptions.length})</span>
          </button>
          <button
            type="button"
            className={`gp-switch-tab ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            <span>📋</span>
            <span>All Leads ({categorized.all.length})</span>
          </button>
        </div>

        <div className="gp-lm-filters-row">
          <div className="gp-lm-search-wrap">
            <span className="gp-search-ico"><IconSearch size={14} /></span>
            <input
              type="text"
              placeholder="Search by name, email, company, asset title, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="gp-lm-search-input"
            />
            {searchQuery && (
              <button
                type="button"
                className="gp-clear-search-btn"
                onClick={() => setSearchQuery("")}
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          <div className="gp-lm-filter-group">
            <label>View:</label>
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as TabFilter)}
              className="gp-lm-select"
            >
              <option value="contact">✉️ Contact Us ({categorized.contacts.length})</option>
              <option value="download">📄 PDF Downloads ({categorized.downloads.length})</option>
              <option value="subscription">📰 Subscriptions ({categorized.subscriptions.length})</option>
              <option value="all">📋 All Leads ({categorized.all.length})</option>
            </select>
          </div>

          <div className="gp-lm-filter-group">
            <label>Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="gp-lm-select"
            >
              <option value="all">All Statuses</option>
              <option value="new">New ({categorized.all.filter((e) => (e.status || "New").toLowerCase() === "new").length})</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="gp-lm-filter-group">
            <label>Sort By:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="gp-lm-select"
            >
              <option value="newest">Newest First (Latest Timestamp)</option>
              <option value="oldest">Oldest First</option>
              <option value="name_asc">Lead Name (A → Z)</option>
              <option value="company_asc">Company Name (A → Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table Content */}
      {filteredLeads.length === 0 ? (
        <div className="gp-lm-empty-state">
          <div className="gp-lm-empty-icon">
            {activeTab === "download" ? <IconFileText size={32} /> : activeTab === "subscription" ? <IconNewspaper size={32} /> : <IconMail size={32} />}
          </div>
          <h3>No records found</h3>
          <p>
            {searchQuery || statusFilter !== "all"
              ? "No submissions matched your search and filter criteria. Try adjusting your query."
              : activeTab === "download"
              ? "No PDF or asset download leads captured yet. Download form submissions will automatically sort here."
              : activeTab === "subscription"
              ? "No newsletter subscriptions recorded yet."
              : "No contact submissions received yet."}
          </p>
          {(searchQuery || statusFilter !== "all") && (
            <button
              type="button"
              className="gp-lm-btn-secondary"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
              }}
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="gp-lm-table-wrap">
          <table className="gp-lm-table">
            <thead>
              <tr>
                <th style={{ width: "145px" }}>Date</th>
                <th>Lead Name & Email</th>
                <th>Company & Position</th>
                <th>Subject / Asset</th>
                <th style={{ width: "115px" }}>Status</th>
                <th style={{ width: "115px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((enq) => {
                const ts = enq._ts;
                const leadType = enq._resolvedType;
                const assetTitle = enq.assetTitle || enq.resourceTitle || "";
                const rawTitle = assetTitle || enq.subject || "";
                const subjectOrAsset =
                  leadType === "download"
                    ? (rawTitle.replace(/^Resource Download:\s*/i, "") || "Resource Download")
                    : leadType === "subscription"
                    ? "Weekly Publication Newsletter"
                    : enq.subject || "General Enquiry";

                return (
                  <tr
                    key={enq._id}
                    className={`gp-lm-row gp-row-${leadType}`}
                    onClick={() => setSelectedLead(enq)}
                    title="Click to view all lead data"
                  >
                    {/* Important Data: Date & Time */}
                    <td>
                      <div className="gp-lm-timestamp-block">
                        <div className="gp-lm-ts-date">{ts.date}</div>
                        <div className="gp-lm-ts-time-row">
                          <span className="gp-lm-clock-icon"><IconClock size={11} /></span>
                          <span className="gp-lm-time-text">{ts.time}</span>
                        </div>
                      </div>
                    </td>

                    {/* Important Data: Lead Name & Email */}
                    <td>
                      <div className="gp-lm-lead-info">
                        <span className="gp-lm-lead-name">
                          {enq.firstName || enq.lastName
                            ? `${enq.firstName || ""} ${enq.lastName || ""}`.trim()
                            : "Anonymous Lead"}
                        </span>
                        {enq.email && (
                          <a
                            href={`mailto:${enq.email}`}
                            className="gp-lm-lead-email"
                            onClick={(e) => e.stopPropagation()}
                            title={`Email ${enq.email}`}
                          >
                            <IconMail size={12} /> {enq.email}
                          </a>
                        )}
                      </div>
                    </td>

                    {/* Important Data: Company & Position */}
                    <td>
                      <div className="gp-lm-comp-info">
                        <strong className="gp-lm-comp-name">{enq.company || "—"}</strong>
                        {enq.jobTitle && <span className="gp-lm-job-title">{enq.jobTitle}</span>}
                      </div>
                    </td>

                    {/* Important Data: Subject / Asset */}
                    <td>
                      <div className="gp-lm-subject-cell">
                        <span className="gp-lm-subject-text" title={subjectOrAsset}>
                          {subjectOrAsset}
                        </span>
                        <span className={`gp-type-pill-sm gp-pill-${leadType === "download" ? "emerald" : leadType === "subscription" ? "purple" : "blue"}`}>
                          {leadType === "download" ? "PDF Download" : leadType === "subscription" ? "Subscription" : "Contact Us"}
                        </span>
                      </div>
                    </td>

                    {/* Important Data: Status */}
                    <td onClick={(e) => e.stopPropagation()}>
                      <select
                        value={enq.status || "New"}
                        onChange={(e) => handleUpdateStatus(enq._id, e.target.value)}
                        className={`gp-lm-status-select ${(enq.status || "New").toLowerCase()}`}
                      >
                        <option value="New">New</option>
                        <option value="Read">Read</option>
                        <option value="Replied">Replied</option>
                        <option value="Archived">Archived</option>
                      </select>
                    </td>

                    {/* Actions: Dedicated View Button & Delete */}
                    <td onClick={(e) => e.stopPropagation()}>
                      <div className="gp-lm-action-btns">
                        <button
                          type="button"
                          className="gp-lm-view-btn"
                          onClick={() => setSelectedLead(enq)}
                          title="View all data for this lead"
                        >
                          <IconEye size={12} />
                          <span>View</span>
                        </button>
                        <button
                          type="button"
                          className="gp-lm-action-icon gp-delete-ico"
                          onClick={() => handleDelete(enq._id)}
                          title="Delete Lead"
                        >
                          <IconTrash size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Slide-over / Modal for Full Lead Details */}
      {selectedLead && (
        <div className="gp-lm-modal-backdrop" onClick={() => setSelectedLead(null)}>
          <div className="gp-lm-lead-modal" onClick={(e) => e.stopPropagation()}>
            <div className="gp-lm-modal-header">
              <div>
                <div className="gp-lm-modal-type-tag">
                  {selectedLead._resolvedType === "download" ? (
                    <span className="gp-type-pill gp-pill-emerald"><IconFileText size={12} /> Gated Asset Download Lead</span>
                  ) : selectedLead._resolvedType === "subscription" ? (
                    <span className="gp-type-pill gp-pill-purple"><IconNewspaper size={12} /> Newsletter Subscriber Lead</span>
                  ) : (
                    <span className="gp-type-pill gp-pill-blue"><IconMail size={12} /> Contact Us Submission</span>
                  )}
                  <span className="gp-lead-id-label">ID: {selectedLead._id}</span>
                </div>
                <h2>
                  {selectedLead.firstName || selectedLead.lastName
                    ? `${selectedLead.firstName || ""} ${selectedLead.lastName || ""}`.trim()
                    : "Lead Profile"}
                </h2>
                <div className="gp-lm-modal-timestamp">
                  <span><IconClock size={11} /> Submitted on: </span>
                  <strong>{selectedLead._ts.date} at {selectedLead._ts.timeWithSeconds}</strong>
                  {selectedLead._ts.relative && <span className="gp-ts-rel-badge">({selectedLead._ts.relative})</span>}
                </div>
              </div>

              <button
                type="button"
                className="gp-lm-modal-close"
                onClick={() => setSelectedLead(null)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="gp-lm-modal-body">
              {/* Quick Status Bar */}
              <div className="gp-lm-modal-status-bar">
                <span className="gp-bar-label">Current Pipeline Status:</span>
                <div className="gp-status-options">
                  {(["New", "Read", "Replied", "Archived"] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      className={`gp-status-toggle-btn ${st.toLowerCase()} ${
                        (selectedLead.status || "New") === st ? "selected" : ""
                      }`}
                      onClick={() => handleUpdateStatus(selectedLead._id, st)}
                    >
                      {st === "New" ? "New" : st === "Read" ? "Read" : st === "Replied" ? "Replied" : "Archived"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Data Grid */}
              <div className="gp-lm-modal-sections">
                {/* Contact Information */}
                <div className="gp-lm-detail-card">
                  <h4><IconUser size={14} /> Contact Details</h4>
                  <div className="gp-lm-kv-grid">
                    <div>
                      <span className="gp-kv-label">Full Name</span>
                      <strong className="gp-kv-val">{selectedLead.firstName} {selectedLead.lastName}</strong>
                    </div>
                    <div>
                      <span className="gp-kv-label">Work Email</span>
                      <strong className="gp-kv-val">
                        <a href={`mailto:${selectedLead.email}`}>{selectedLead.email}</a>
                      </strong>
                    </div>
                    <div>
                      <span className="gp-kv-label">Telephone</span>
                      {selectedLead.telephone ? (
                        <strong className="gp-kv-val">
                          <a
                            href={`tel:${selectedLead.telephone}`}
                            style={{
                              color: "#00D2FF",
                              textDecoration: "none",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <IconPhone size={12} /> {selectedLead.telephone}
                          </a>
                        </strong>
                      ) : (
                        <span className="gp-kv-val">Not provided</span>
                      )}
                    </div>
                    <div>
                      <span className="gp-kv-label">Country / Region</span>
                      <span className="gp-kv-val">{selectedLead.country || "—"}</span>
                    </div>
                  </div>
                </div>

                {/* Firmographic & Professional Details */}
                <div className="gp-lm-detail-card">
                  <h4><IconBuilding size={14} /> Company & Firmographics</h4>
                  <div className="gp-lm-kv-grid">
                    <div>
                      <span className="gp-kv-label">Company Name</span>
                      <strong className="gp-kv-val">{selectedLead.company || "—"}</strong>
                    </div>
                    <div>
                      <span className="gp-kv-label">Job Title / Seniority</span>
                      <span className="gp-kv-val">{selectedLead.jobTitle || "—"}</span>
                    </div>
                    <div>
                      <span className="gp-kv-label">Company Size</span>
                      <span className="gp-kv-val" style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                        <IconUsers size={12} /> {selectedLead.companySize || "—"}
                      </span>
                    </div>
                    <div>
                      <span className="gp-kv-label">Industry</span>
                      <span className="gp-kv-val">{selectedLead.industry || "—"}</span>
                    </div>
                  </div>
                </div>

                {/* Downloaded Asset info (if download or asset info available) */}
                {(selectedLead.assetTitle || selectedLead.resourceTitle || selectedLead.downloadFileType || selectedLead._resolvedType === "download") && (
                  <div className="gp-lm-detail-card gp-card-highlight">
                    <h4><IconFileText size={14} /> Downloaded Asset Information</h4>
                    <div className="gp-lm-kv-grid">
                      <div style={{ gridColumn: "1/-1" }}>
                        <span className="gp-kv-label">Asset Title</span>
                        <strong className="gp-kv-val" style={{ color: "#00D2FF" }}>
                          {selectedLead.assetTitle || selectedLead.resourceTitle || "Resource Download"}
                        </strong>
                      </div>
                      <div>
                        <span className="gp-kv-label">Asset Type</span>
                        <span className="gp-kv-val">{selectedLead.assetType || "Whitepaper / Playbook"}</span>
                      </div>
                      <div>
                        <span className="gp-kv-label">Download Format</span>
                        <span className="gp-kv-val">{selectedLead.downloadFileType || "PDF"}</span>
                      </div>
                      {selectedLead.resourceId && (
                        <div>
                          <span className="gp-kv-label">Asset Reference ID</span>
                          <span className="gp-kv-val" style={{ fontFamily: "monospace" }}>{selectedLead.resourceId}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Address & Geographic Information */}
                {(selectedLead.city || selectedLead.address || selectedLead.postalCode || selectedLead.country) && (
                  <div className="gp-lm-detail-card">
                    <h4><IconMapPin size={14} /> Geographic & Address Details</h4>
                    <div className="gp-lm-kv-grid">
                      <div>
                        <span className="gp-kv-label">Country</span>
                        <span className="gp-kv-val">{selectedLead.country || "—"}</span>
                      </div>
                      <div>
                        <span className="gp-kv-label">City</span>
                        <span className="gp-kv-val">{selectedLead.city || "—"}</span>
                      </div>
                      <div>
                        <span className="gp-kv-label">Postal / Zip Code</span>
                        <span className="gp-kv-val">{selectedLead.postalCode || "—"}</span>
                      </div>
                      <div style={{ gridColumn: "1/-1" }}>
                        <span className="gp-kv-label">Street Address</span>
                        <span className="gp-kv-val">{selectedLead.address || "—"}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Opt-Ins */}
                <div className="gp-lm-detail-card">
                  <h4><IconShield size={14} /> Consent & Permissions</h4>
                  <div className="gp-lm-kv-grid">
                    <div>
                      <span className="gp-kv-label">Marketing Communications</span>
                      <span className={`gp-consent-pill ${selectedLead.optInMarketing ? "yes" : "no"}`}>
                        {selectedLead.optInMarketing ? "✓ Opted-In (Yes)" : "✕ Not Opted-In"}
                      </span>
                    </div>
                    <div>
                      <span className="gp-kv-label">Partner / Sponsor Contact</span>
                      <span className={`gp-consent-pill ${selectedLead.optInPartner ? "yes" : "no"}`}>
                        {selectedLead.optInPartner ? "✓ Opted-In (Yes)" : "✕ Not Opted-In"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Custom dynamic fields if present */}
                {selectedLead.customFields && Object.keys(selectedLead.customFields).length > 0 && (
                  <div className="gp-lm-detail-card">
                    <h4>📝 Custom Gated Form Responses</h4>
                    <div className="gp-lm-kv-grid">
                      {Object.entries(selectedLead.customFields).map(([key, val]) => (
                        <div key={key}>
                          <span className="gp-kv-label">{key}</span>
                          <span className="gp-kv-val">{String(val) || "—"}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Message / Content Body */}
                <div className="gp-lm-detail-card gp-card-wide">
                  <h4>💬 Subject & Lead Message</h4>
                  <div style={{ marginBottom: "8px" }}>
                    <span className="gp-kv-label">Subject Line</span>
                    <strong className="gp-kv-val">{selectedLead.subject || "General Enquiry"}</strong>
                  </div>
                  <div>
                    <span className="gp-kv-label">Full Message / Lead Log</span>
                    <div className="gp-lm-full-message">{selectedLead.message || "No message content provided."}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="gp-lm-modal-footer">
              <button
                type="button"
                className="gp-lm-btn-secondary"
                onClick={() => handleCopyLeadDetails(selectedLead)}
              >
                {copySuccess ? "✓ Copied to Clipboard!" : "📋 Copy Lead Record"}
              </button>
              <button
                type="button"
                className="gp-lm-btn-delete"
                onClick={() => handleDelete(selectedLead._id)}
              >
                <IconTrash size={13} /> Delete Lead
              </button>
              <button
                type="button"
                className="gp-lm-btn-primary"
                onClick={() => setSelectedLead(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scoped CSS Styles */}
      <style>{`
        .gp-lead-manager {
          display: flex;
          flex-direction: column;
          gap: 20px;
          color: #D5DBE7;
          font-family: inherit;
        }

        .gp-lm-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
          padding: 22px 26px;
          background: #0D1522;
          border-radius: 10px;
          border: 1px solid rgba(203, 213, 225, 0.12);
        }

        .gp-lm-eyebrow {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 11px;
          font-weight: 800;
          color: #00D2FF;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .gp-lm-new-alert {
          background: rgba(16, 185, 129, 0.2);
          color: #34D399;
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 11px;
          font-weight: 700;
          border: 1px solid rgba(16, 185, 129, 0.4);
        }

        .gp-lm-title {
          font-size: 22px;
          font-weight: 700;
          color: #FFFFFF;
          margin: 0 0 6px 0;
          font-family: var(--font-serif, serif);
        }

        .gp-lm-subtitle {
          font-size: 13px;
          color: #94A3B8;
          margin: 0;
          max-width: 720px;
          line-height: 1.5;
        }

        .gp-lm-header-actions {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        /* KPI Strip */
        .gp-lm-stats-strip {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }

        .gp-lm-stat-card {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px 18px;
          background: #0D1522;
          border-radius: 8px;
          border: 1px solid rgba(203, 213, 225, 0.1);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .gp-lm-stat-card:hover {
          border-color: rgba(0, 210, 255, 0.4);
          transform: translateY(-1px);
        }

        .gp-lm-stat-card.active {
          border-color: #00D2FF;
          background: rgba(0, 70, 252, 0.12);
        }

        .gp-lm-stat-icon {
          width: 42px;
          height: 42px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          flex-shrink: 0;
        }

        .gp-stat-all { background: rgba(255, 255, 255, 0.08); }
        .gp-stat-pdf { background: rgba(16, 185, 129, 0.18); }
        .gp-stat-contact { background: rgba(0, 85, 255, 0.2); }
        .gp-stat-news { background: rgba(168, 85, 247, 0.2); }

        .gp-lm-stat-body {
          display: flex;
          flex-direction: column;
        }

        .gp-lm-stat-num {
          font-size: 22px;
          font-weight: 800;
          color: #FFFFFF;
          line-height: 1.1;
        }

        .gp-lm-stat-label {
          font-size: 11.5px;
          color: #94A3B8;
          margin-top: 3px;
          font-weight: 600;
        }

        /* Toolbar Panel */
        .gp-lm-toolbar-panel {
          background: #0D1522;
          border-radius: 8px;
          border: 1px solid rgba(203, 213, 225, 0.1);
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .gp-segmented-switcher-bar {
          display: flex;
          align-items: center;
          background: #060B12;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 5px;
          gap: 6px;
          overflow-x: auto;
        }

        .gp-switch-tab {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 18px;
          border-radius: 6px;
          font-size: 13.5px;
          font-weight: 700;
          color: #94A3B8;
          background: transparent;
          border: 1px solid transparent;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          flex: 1;
        }

        .gp-switch-tab:hover {
          color: #FFFFFF;
          background: rgba(255, 255, 255, 0.06);
        }

        .gp-switch-tab.active {
          color: #FFFFFF;
          background: #0046FC;
          border-color: #0046FC;
          box-shadow: 0 4px 14px rgba(0, 70, 252, 0.4);
        }

        .gp-lm-filters-row {
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
        }

        .gp-lm-search-wrap {
          position: relative;
          flex: 1;
          min-width: 260px;
        }

        .gp-search-ico {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 14px;
          color: #64748B;
        }

        .gp-lm-search-input {
          width: 100%;
          padding: 9px 34px 9px 36px;
          background: #060B12;
          border: 1px solid rgba(203, 213, 225, 0.16);
          border-radius: 6px;
          color: #FFFFFF;
          font-size: 13px;
          outline: none;
          box-sizing: border-box;
        }

        .gp-lm-search-input:focus {
          border-color: #00D2FF;
        }

        .gp-clear-search-btn {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: 0;
          color: #94A3B8;
          cursor: pointer;
          font-size: 13px;
          padding: 4px;
        }

        .gp-lm-filter-group {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12.5px;
          color: #94A3B8;
          font-weight: 600;
        }

        .gp-lm-select {
          background: #060B12;
          color: #FFFFFF;
          border: 1px solid rgba(203, 213, 225, 0.16);
          border-radius: 6px;
          padding: 8px 12px;
          font-size: 12.5px;
          font-weight: 600;
          outline: none;
          cursor: pointer;
        }

        .gp-lm-select:focus {
          border-color: #00D2FF;
        }

        /* Buttons */
        .gp-lm-btn-primary {
          background: #0046FC;
          color: #FFFFFF;
          padding: 9px 18px;
          border-radius: 6px;
          border: 0;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
        }

        .gp-lm-btn-primary:hover {
          background: #0036CC;
        }

        .gp-lm-btn-secondary {
          background: #111C2D;
          color: #00D2FF;
          border: 1px solid rgba(0, 210, 255, 0.3);
          padding: 8px 14px;
          border-radius: 6px;
          font-size: 12.5px;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .gp-lm-btn-secondary:hover {
          background: rgba(0, 210, 255, 0.1);
          border-color: #00D2FF;
        }

        .gp-lm-btn-delete {
          background: rgba(239, 68, 68, 0.15);
          color: #F87171;
          border: 1px solid rgba(239, 68, 68, 0.3);
          padding: 9px 16px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
        }

        .gp-lm-btn-delete:hover {
          background: rgba(239, 68, 68, 0.3);
        }

        /* Table & Data Rows */
        .gp-lm-table-wrap {
          background: #0D1522;
          border-radius: 8px;
          border: 1px solid rgba(203, 213, 225, 0.12);
          overflow-x: auto;
        }

        .gp-lm-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
          text-align: left;
        }

        .gp-lm-table th {
          padding: 14px 16px;
          background: #111C2D;
          border-bottom: 2px solid rgba(203, 213, 225, 0.12);
          color: #AEB8CA;
          font-weight: 700;
          font-size: 11.5px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .gp-lm-table td {
          padding: 14px 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
          color: #D5DBE7;
          vertical-align: middle;
        }

        .gp-lm-row {
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .gp-lm-row:hover td {
          background: rgba(0, 210, 255, 0.04);
        }

        /* Timestamp Cell */
        .gp-lm-timestamp-block {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .gp-lm-ts-date {
          font-size: 13px;
          font-weight: 700;
          color: #FFFFFF;
        }

        .gp-lm-ts-time-row {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 11.5px;
          color: #94A3B8;
          font-weight: 600;
        }

        .gp-lm-clock-icon {
          font-size: 11px;
          opacity: 0.8;
        }

        .gp-lm-time-text {
          color: #00D2FF;
          font-family: monospace;
          font-size: 11px;
        }

        .gp-lm-ts-rel {
          font-size: 10.5px;
          color: #64748B;
        }

        /* Lead Info */
        .gp-lm-lead-info {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .gp-lm-lead-name {
          font-size: 13.5px;
          font-weight: 700;
          color: #FFFFFF;
        }

        .gp-lm-lead-email {
          color: #00D2FF;
          text-decoration: none;
          font-size: 12px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .gp-lm-lead-email:hover {
          text-decoration: underline;
        }

        .gp-lm-lead-phone {
          color: #94A3B8;
          text-decoration: none;
          font-size: 11.5px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .gp-lm-lead-phone:hover {
          color: #FFFFFF;
        }

        /* Company Info */
        .gp-lm-comp-info {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .gp-lm-comp-name {
          font-size: 13px;
          color: #FFFFFF;
        }

        .gp-lm-job-title {
          font-size: 11.5px;
          color: #94A3B8;
        }

        .gp-lm-tag-row {
          display: flex;
          gap: 6px;
          margin-top: 3px;
          flex-wrap: wrap;
        }

        .gp-lm-meta-pill {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #CBD5E1;
          font-size: 10.5px;
          padding: 2px 7px;
          border-radius: 4px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          line-height: 1.2;
        }

        /* Type Pills */
        .gp-type-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.3px;
        }

        .gp-pill-emerald {
          background: rgba(16, 185, 129, 0.15);
          color: #34D399;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .gp-pill-blue {
          background: rgba(0, 85, 255, 0.15);
          color: #60A5FA;
          border: 1px solid rgba(0, 85, 255, 0.3);
        }

        .gp-pill-purple {
          background: rgba(168, 85, 247, 0.15);
          color: #C084FC;
          border: 1px solid rgba(168, 85, 247, 0.3);
        }

        /* Subject / Asset Important Cell */
        .gp-lm-subject-cell {
          display: flex;
          flex-direction: column;
          gap: 4px;
          max-width: 270px;
        }

        .gp-lm-subject-text {
          font-size: 13px;
          font-weight: 700;
          color: #FFFFFF;
          line-height: 1.35;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .gp-type-pill-sm {
          display: inline-flex;
          align-items: center;
          padding: 2px 7px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.3px;
          width: fit-content;
          margin-top: 3px;
        }

        /* Asset Info */
        .gp-lm-asset-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
          max-width: 280px;
        }

        .gp-lm-asset-title {
          font-size: 13px;
          font-weight: 700;
          color: #FFFFFF;
          line-height: 1.35;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .gp-lm-asset-tags {
          display: flex;
          gap: 6px;
        }

        .gp-asset-type-badge {
          background: #111C2D;
          color: #00D2FF;
          border: 1px solid rgba(0, 210, 255, 0.3);
          font-size: 10.5px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .gp-format-badge {
          background: rgba(239, 68, 68, 0.15);
          color: #F87171;
          border: 1px solid rgba(239, 68, 68, 0.3);
          font-size: 10px;
          font-weight: 800;
          padding: 2px 5px;
          border-radius: 3px;
        }

        .gp-lm-location-info {
          font-size: 12.5px;
          color: #94A3B8;
        }

        /* Contact Details */
        .gp-lm-subject-badge {
          display: inline-block;
          padding: 3px 8px;
          border-radius: 4px;
          background: #111C2D;
          color: #00D2FF;
          border: 1px solid rgba(255, 255, 255, 0.08);
          font-size: 11px;
          font-weight: 600;
          max-width: 190px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .gp-lm-message-snippet {
          max-width: 260px;
          font-size: 12.5px;
          color: #CBD5E1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          cursor: pointer;
        }

        .gp-lm-message-snippet:hover {
          color: #00D2FF;
          text-decoration: underline;
        }

        /* Subscription info */
        .gp-lm-sub-source {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .gp-sub-source-badge {
          display: inline-block;
          background: rgba(168, 85, 247, 0.15);
          color: #C084FC;
          border: 1px solid rgba(168, 85, 247, 0.3);
          font-size: 11px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 4px;
          width: fit-content;
        }

        .gp-sub-note {
          font-size: 11px;
          color: #64748B;
        }

        /* All detail preview */
        .gp-lm-all-detail {
          max-width: 250px;
        }

        .gp-lm-asset-link {
          color: #FFFFFF;
          font-size: 12.5px;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .gp-lm-msg-preview {
          font-size: 11.5px;
          color: #94A3B8;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-top: 2px;
        }

        /* Status Select */
        .gp-lm-status-select {
          padding: 5px 8px;
          border-radius: 6px;
          font-size: 11.5px;
          font-weight: 700;
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: #060B12;
          cursor: pointer;
          outline: none;
        }

        .gp-lm-status-select.new {
          color: #34D399;
          border-color: rgba(16, 185, 129, 0.4);
          background: rgba(16, 185, 129, 0.1);
        }

        .gp-lm-status-select.read {
          color: #60A5FA;
          border-color: rgba(96, 165, 250, 0.4);
          background: rgba(96, 165, 250, 0.1);
        }

        .gp-lm-status-select.replied {
          color: #C084FC;
          border-color: rgba(192, 132, 252, 0.4);
          background: rgba(192, 132, 252, 0.1);
        }

        .gp-lm-status-select.archived {
          color: #94A3B8;
          border-color: rgba(148, 163, 184, 0.3);
          background: rgba(148, 163, 184, 0.08);
        }

        /* Action Buttons */
        .gp-lm-action-btns {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 6px;
        }

        .gp-lm-view-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: rgba(0, 210, 255, 0.12);
          color: #00D2FF;
          border: 1px solid rgba(0, 210, 255, 0.4);
          padding: 5px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          white-space: nowrap;
        }

        .gp-lm-view-btn:hover {
          background: #00D2FF;
          color: #060B12;
          border-color: #00D2FF;
          box-shadow: 0 2px 10px rgba(0, 210, 255, 0.35);
          transform: translateY(-1px);
        }

        .gp-lm-action-icon {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #94A3B8;
          padding: 5px 8px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
          transition: all 0.15s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .gp-lm-action-icon:hover {
          color: #00D2FF;
          border-color: #00D2FF;
          background: rgba(0, 210, 255, 0.1);
        }

        .gp-lm-action-icon.gp-delete-ico:hover {
          color: #F87171;
          border-color: #F87171;
          background: rgba(239, 68, 68, 0.15);
        }

        /* Empty State */
        .gp-lm-empty-state {
          padding: 60px 20px;
          text-align: center;
          background: #0D1522;
          border-radius: 8px;
          border: 1px solid rgba(203, 213, 225, 0.1);
        }

        .gp-lm-empty-icon {
          font-size: 40px;
          margin-bottom: 12px;
        }

        .gp-lm-empty-state h3 {
          font-size: 18px;
          color: #FFFFFF;
          margin: 0 0 8px 0;
        }

        .gp-lm-empty-state p {
          color: #94A3B8;
          font-size: 13.5px;
          max-width: 500px;
          margin: 0 auto 16px;
          line-height: 1.5;
        }

        /* Modal Styles */
        .gp-lm-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(3, 7, 18, 0.8);
          backdrop-filter: blur(8px);
          display: grid;
          place-items: center;
          z-index: 2500;
          padding: 20px;
        }

        .gp-lm-lead-modal {
          background: #0D1522;
          border: 1px solid rgba(0, 210, 255, 0.3);
          border-radius: 12px;
          width: min(780px, 100%);
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
          overflow: hidden;
        }

        .gp-lm-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 22px 26px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          background: #111C2D;
        }

        .gp-lm-modal-type-tag {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }

        .gp-lead-id-label {
          font-size: 11px;
          color: #64748B;
          font-family: monospace;
        }

        .gp-lm-modal-header h2 {
          font-size: 22px;
          color: #FFFFFF;
          margin: 0 0 6px 0;
          font-family: var(--font-serif, serif);
        }

        .gp-lm-modal-timestamp {
          font-size: 12px;
          color: #94A3B8;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .gp-lm-modal-timestamp strong {
          color: #00D2FF;
        }

        .gp-ts-rel-badge {
          background: rgba(255, 255, 255, 0.08);
          padding: 1px 6px;
          border-radius: 4px;
          font-size: 11px;
        }

        .gp-lm-modal-close {
          background: transparent;
          border: 0;
          color: #94A3B8;
          font-size: 22px;
          cursor: pointer;
          padding: 4px 8px;
          line-height: 1;
        }

        .gp-lm-modal-close:hover {
          color: #FFFFFF;
        }

        .gp-lm-modal-body {
          padding: 22px 26px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .gp-lm-modal-status-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          background: #060B12;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          flex-wrap: wrap;
          gap: 10px;
        }

        .gp-bar-label {
          font-size: 12.5px;
          font-weight: 700;
          color: #CBD5E1;
        }

        .gp-status-options {
          display: flex;
          gap: 8px;
        }

        .gp-status-toggle-btn {
          background: #111C2D;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #94A3B8;
          padding: 5px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .gp-status-toggle-btn.selected.new {
          background: rgba(16, 185, 129, 0.2);
          color: #34D399;
          border-color: #10B981;
        }

        .gp-status-toggle-btn.selected.read {
          background: rgba(96, 165, 250, 0.2);
          color: #60A5FA;
          border-color: #3B82F6;
        }

        .gp-status-toggle-btn.selected.replied {
          background: rgba(192, 132, 252, 0.2);
          color: #C084FC;
          border-color: #A855F7;
        }

        .gp-status-toggle-btn.selected.archived {
          background: rgba(148, 163, 184, 0.2);
          color: #CBD5E1;
          border-color: #94A3B8;
        }

        .gp-lm-modal-sections {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .gp-lm-detail-card {
          background: #060B12;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          padding: 16px;
        }

        .gp-card-wide {
          grid-column: 1 / -1;
        }

        .gp-card-highlight {
          border-color: rgba(0, 210, 255, 0.35);
          background: rgba(0, 70, 252, 0.08);
        }

        .gp-lm-detail-card h4 {
          font-size: 13px;
          font-weight: 700;
          color: #FFFFFF;
          margin: 0 0 12px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding-bottom: 8px;
        }

        .gp-lm-kv-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .gp-kv-label {
          display: block;
          font-size: 11px;
          font-weight: 700;
          color: #64748B;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 3px;
        }

        .gp-kv-val {
          font-size: 13px;
          color: #E2E8F0;
          word-break: break-word;
        }

        .gp-kv-val a {
          color: #00D2FF;
          text-decoration: none;
        }

        .gp-kv-val a:hover {
          text-decoration: underline;
        }

        .gp-consent-pill {
          display: inline-block;
          font-size: 11px;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 4px;
        }

        .gp-consent-pill.yes {
          background: rgba(16, 185, 129, 0.15);
          color: #34D399;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .gp-consent-pill.no {
          background: rgba(239, 68, 68, 0.15);
          color: #F87171;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .gp-lm-full-message {
          background: #111C2D;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 6px;
          padding: 12px 14px;
          font-size: 13px;
          color: #E2E8F0;
          line-height: 1.55;
          white-space: pre-wrap;
          word-break: break-word;
        }

        .gp-lm-modal-footer {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 10px;
          padding: 16px 26px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          background: #111C2D;
        }

        @media (max-width: 800px) {
          .gp-lm-stats-strip {
            grid-template-columns: 1fr 1fr;
          }
          .gp-lm-modal-sections {
            grid-template-columns: 1fr;
          }
          .gp-lm-kv-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

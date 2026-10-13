import React, { useState, useEffect } from "react";
import {
  formConfigApi,
  getCategoryDefaultFormConfig,
  ALL_RESOURCE_CATEGORIES,
  defaultGatedFormConfig,
  type GatedFormConfig,
} from "../../services/api";
import { downloadResourceAsset } from "../../utils/pdfGenerator";

interface FormFieldsManagerProps {
  showToast: (msg: string) => void;
  onClose?: () => void;
  initialCategory?: string;
  onAddDocumentForCategory?: (category: string) => void;
}

const INDUSTRY_CATEGORIES = [
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

const TYPE_CATEGORIES = [
  "Buyer Insights",
  "Whitepaper",
  "Playbook",
  "Industry Report",
];

export const FormFieldsManager: React.FC<FormFieldsManagerProps> = ({
  showToast,
  onClose,
  initialCategory,
  onAddDocumentForCategory,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    if (initialCategory && initialCategory !== "All") {
      return initialCategory;
    }
    return "B2B Technology";
  });

  const [config, setConfig] = useState<GatedFormConfig>(() =>
    formConfigApi.get(
      initialCategory && initialCategory !== "All" ? initialCategory : "B2B Technology"
    )
  );
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeSectionTab, setActiveSectionTab] = useState<"fields" | "download" | "badges" | "all">("all");
  const [customCategoryInput, setCustomCategoryInput] = useState("");
  const [extraCategories, setExtraCategories] = useState<string[]>(() => {
    const savedMap = formConfigApi.getAllCategoryMap();
    return Object.keys(savedMap).filter(
      (k) => !ALL_RESOURCE_CATEGORIES.includes(k) && k !== "GLOBAL"
    );
  });

  useEffect(() => {
    setConfig(formConfigApi.get(selectedCategory));
  }, [selectedCategory]);

  useEffect(() => {
    const handleUpdate = () => {
      setConfig(formConfigApi.get(selectedCategory));
    };
    window.addEventListener("gp_form_config_updated", handleUpdate);
    return () => window.removeEventListener("gp_form_config_updated", handleUpdate);
  }, [selectedCategory]);

  const handleToggleEnabled = (key: keyof GatedFormConfig["fields"]) => {
    setConfig((prev) => ({
      ...prev,
      fields: {
        ...prev.fields,
        [key]: {
          ...prev.fields[key],
          enabled: !prev.fields[key].enabled,
        },
      },
    }));
  };

  const handleToggleRequired = (key: keyof GatedFormConfig["fields"]) => {
    setConfig((prev) => ({
      ...prev,
      fields: {
        ...prev.fields,
        [key]: {
          ...prev.fields[key],
          required: !prev.fields[key].required,
        },
      },
    }));
  };

  const handleLabelChange = (key: keyof GatedFormConfig["fields"], newLabel: string) => {
    setConfig((prev) => ({
      ...prev,
      fields: {
        ...prev.fields,
        [key]: {
          ...prev.fields[key],
          label: newLabel,
        },
      },
    }));
  };

  const applyPreset = (preset: "full" | "short" | "minimal") => {
    const catDefault = getCategoryDefaultFormConfig(selectedCategory);
    if (preset === "full") {
      setConfig({
        ...catDefault,
        headerTitle: config.headerTitle || catDefault.headerTitle,
        subtitle: config.subtitle || catDefault.subtitle,
        submitButtonText: config.submitButtonText || catDefault.submitButtonText,
        fields: JSON.parse(JSON.stringify(defaultGatedFormConfig.fields)),
      });
      showToast(
        `Applied Full B2B Form (12 Fields) to ${
          selectedCategory === "GLOBAL" ? "All Categories" : selectedCategory
        }`
      );
      return;
    }

    if (preset === "short") {
      setConfig({
        ...config,
        fields: {
          firstName: { ...config.fields.firstName, enabled: true, required: true },
          lastName: { ...config.fields.lastName, enabled: true, required: true },
          email: { ...config.fields.email, enabled: true, required: true },
          telephone: { ...config.fields.telephone, enabled: true, required: true },
          companyName: { ...config.fields.companyName, enabled: true, required: true },
          jobTitle: { ...config.fields.jobTitle, enabled: true, required: false },
          industry: { ...config.fields.industry, enabled: false, required: false },
          companySize: { ...config.fields.companySize, enabled: false, required: false },
          country: { ...config.fields.country, enabled: true, required: false },
          city: { ...config.fields.city, enabled: false, required: false },
          address: { ...config.fields.address, enabled: false, required: false },
          postalCode: { ...config.fields.postalCode, enabled: false, required: false },
          optInMarketing: { ...config.fields.optInMarketing, enabled: true, required: false },
          optInPartner: { ...config.fields.optInPartner, enabled: true, required: false },
        },
      });
      showToast(
        `Applied Short Form (5 Core Fields) to ${
          selectedCategory === "GLOBAL" ? "All Categories" : selectedCategory
        }`
      );
      return;
    }

    if (preset === "minimal") {
      setConfig({
        ...config,
        fields: {
          firstName: { ...config.fields.firstName, enabled: true, required: true },
          lastName: { ...config.fields.lastName, enabled: false, required: false },
          email: { ...config.fields.email, enabled: true, required: true },
          telephone: { ...config.fields.telephone, enabled: false, required: false },
          companyName: { ...config.fields.companyName, enabled: true, required: true },
          jobTitle: { ...config.fields.jobTitle, enabled: false, required: false },
          industry: { ...config.fields.industry, enabled: false, required: false },
          companySize: { ...config.fields.companySize, enabled: false, required: false },
          country: { ...config.fields.country, enabled: false, required: false },
          city: { ...config.fields.city, enabled: false, required: false },
          address: { ...config.fields.address, enabled: false, required: false },
          postalCode: { ...config.fields.postalCode, enabled: false, required: false },
          optInMarketing: { ...config.fields.optInMarketing, enabled: true, required: false },
          optInPartner: { ...config.fields.optInPartner, enabled: false, required: false },
        },
      });
      showToast(
        `Applied Minimal Fast Gate (3 Fields) to ${
          selectedCategory === "GLOBAL" ? "All Categories" : selectedCategory
        }`
      );
    }
  };

  const handleSave = () => {
    formConfigApi.save(config, selectedCategory);
    setSavedSuccess(true);
    showToast(
      selectedCategory === "GLOBAL"
        ? "Global form fields updated successfully!"
        : `Form controls saved for "${selectedCategory}" category!`
    );
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleApplyToAll = () => {
    if (
      !window.confirm(
        "Apply this exact form configuration across ALL categories and resource types?"
      )
    )
      return;
    formConfigApi.saveToAllCategories(config);
    setSavedSuccess(true);
    showToast("Form configuration applied to all categories!");
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleReset = () => {
    const label =
      selectedCategory === "GLOBAL" ? "all categories" : `"${selectedCategory}" category`;
    if (!window.confirm(`Reset form controls for ${label} back to default configuration?`))
      return;
    const res = formConfigApi.reset(selectedCategory);
    setConfig(res);
    showToast(`Form controls reset for ${label}.`);
  };

  const handleAddCustomCategory = () => {
    const trimmed = customCategoryInput.trim();
    if (!trimmed) return;
    if (!INDUSTRY_CATEGORIES.includes(trimmed) && !TYPE_CATEGORIES.includes(trimmed) && !extraCategories.includes(trimmed)) {
      setExtraCategories((prev) => [...prev, trimmed]);
    }
    setSelectedCategory(trimmed);
    setCustomCategoryInput("");
    showToast(`Switched to "${trimmed}" category form controls.`);
  };

  const fieldKeys: (keyof GatedFormConfig["fields"])[] = [
    "firstName",
    "lastName",
    "email",
    "telephone",
    "companyName",
    "jobTitle",
    "industry",
    "companySize",
    "country",
    "city",
    "address",
    "postalCode",
    "optInMarketing",
    "optInPartner",
  ];

  const totalEnabled = fieldKeys.filter((k) => config.fields[k]?.enabled).length;
  const totalRequired = fieldKeys.filter(
    (k) => config.fields[k]?.enabled && config.fields[k]?.required
  ).length;
  const activeScopeLabel =
    selectedCategory === "GLOBAL" ? "Global Default (All Categories)" : selectedCategory;

  return (
    <div className="ffm-wrapper">
      {/* Header Bar */}
      <div className="ffm-header">
        <div>
          <div className="ffm-pill">
            <span className="ffm-dot" /> CATEGORY-SPECIFIC DOWNLOAD FORM BUILDER
          </div>
          <h2>Manage Gated Form Controls by Category</h2>
          <p>
            Select any Industry Category or Resource Type below to customize its exact download form fields, required validation, header text, and metadata badges independently.
          </p>
        </div>
        <div className="ffm-header-actions">
          {onClose && (
            <button type="button" onClick={onClose} className="ffm-btn-secondary">
              Back to Resources
            </button>
          )}
          <button type="button" onClick={handleReset} className="ffm-btn-danger">
            ↺ Reset {selectedCategory === "GLOBAL" ? "All" : "Category"}
          </button>
          <button
            type="button"
            onClick={handleApplyToAll}
            className="ffm-btn-secondary"
            title="Copy and apply this form configuration to every category"
          >
            🌐 Apply to All Categories
          </button>
          <button type="button" onClick={handleSave} className="ffm-btn-primary">
            {savedSuccess
              ? "✓ Saved!"
              : `💾 Save for ${selectedCategory === "GLOBAL" ? "Global" : selectedCategory}`}
          </button>
        </div>
      </div>

      {/* ================= CATEGORY SELECTOR MATRIX ================= */}
      <div className="ffm-category-selector-box">
        <div className="ffm-cat-box-top">
          <div>
            <span className="ffm-cat-kicker">📂 SELECT TARGET CATEGORY</span>
            <h4>Choose a Category to Configure Its Specific Form Controls</h4>
          </div>
          <div className="ffm-custom-cat-add">
            <input
              type="text"
              placeholder="Or type custom category name..."
              value={customCategoryInput}
              onChange={(e) => setCustomCategoryInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddCustomCategory();
                }
              }}
            />
            <button type="button" onClick={handleAddCustomCategory}>
              + Select Category
            </button>
          </div>
        </div>

        {/* Industry Categories Row */}
        <div className="ffm-cat-group">
          <span className="ffm-cat-group-label">🏷️ Industry / Topic Categories:</span>
          <div className="ffm-cat-pills-wrap">
            {[...INDUSTRY_CATEGORIES, ...extraCategories].map((cat) => {
              const isSelected = selectedCategory === cat;
              const isCustomized = formConfigApi.hasCategoryOverride(cat);
              return (
                <button
                  type="button"
                  key={cat}
                  className={`ffm-cat-tab ${isSelected ? "active" : ""}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  <span>📁 {cat}</span>
                  {isCustomized && <span className="ffm-cat-custom-dot" title="Custom form saved" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Resource Type Categories + Global Row */}
        <div className="ffm-cat-group">
          <span className="ffm-cat-group-label">📑 Resource Type Categories &amp; Global:</span>
          <div className="ffm-cat-pills-wrap">
            {TYPE_CATEGORIES.map((typeCat) => {
              const isSelected = selectedCategory === typeCat;
              const isCustomized = formConfigApi.hasCategoryOverride(typeCat);
              return (
                <button
                  type="button"
                  key={typeCat}
                  className={`ffm-cat-tab type-tab ${isSelected ? "active" : ""}`}
                  onClick={() => setSelectedCategory(typeCat)}
                >
                  <span>📄 {typeCat}</span>
                  {isCustomized && <span className="ffm-cat-custom-dot" title="Custom form saved" />}
                </button>
              );
            })}
            <button
              type="button"
              className={`ffm-cat-tab global-tab ${selectedCategory === "GLOBAL" ? "active" : ""}`}
              onClick={() => setSelectedCategory("GLOBAL")}
            >
              🌐 Global Default (Fallback)
            </button>
          </div>
        </div>

        {/* Active Editing Scope Banner */}
        <div className="ffm-active-scope-banner">
          <div className="ffm-scope-left">
            <span className="ffm-scope-icon">🎯</span>
            <div>
              <strong>Selected Category: </strong>
              <span className="ffm-scope-highlight">{activeScopeLabel}</span>
              <div style={{ fontSize: "11.5px", color: "#94A3B8", marginTop: "2px" }}>
                {selectedCategory === "GLOBAL"
                  ? "Fallback config for uncategorized resources"
                  : formConfigApi.hasCategoryOverride(selectedCategory)
                  ? "✓ Custom Saved Configuration Active for this Category"
                  : "⚡ Category Preset Active (Click Save to lock custom changes)"}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            {onAddDocumentForCategory && selectedCategory !== "GLOBAL" && (
              <button
                type="button"
                className="ffm-add-doc-cat-btn"
                onClick={() => onAddDocumentForCategory(selectedCategory)}
                title={`Add a new document (PDF, Word, Image, Video) directly into "${selectedCategory}"`}
              >
                📄 + Add New Document in &quot;{selectedCategory}&quot;
              </button>
            )}
            <button
              type="button"
              onClick={handleSave}
              className="ffm-btn-primary"
              style={{ padding: "8px 16px", fontSize: "12.5px" }}
            >
              {savedSuccess ? "✓ Saved!" : `💾 Save "${activeScopeLabel}"`}
            </button>
          </div>
        </div>
      </div>

      {/* ================= SIMPLE STEP-BY-STEP TABS FOR THIS CATEGORY ================= */}
      <div className="ffm-step-tabs-bar">
        <button
          type="button"
          className={`ffm-step-tab-btn ${activeSectionTab === "all" ? "active" : ""}`}
          onClick={() => setActiveSectionTab("all")}
        >
          <span>✨</span> All Controls ({activeScopeLabel})
        </button>
        <button
          type="button"
          className={`ffm-step-tab-btn ${activeSectionTab === "fields" ? "active" : ""}`}
          onClick={() => setActiveSectionTab("fields")}
        >
          <span>📋</span> 1. Form Fields &amp; Button ({totalEnabled} Active)
        </button>
        <button
          type="button"
          className={`ffm-step-tab-btn ${activeSectionTab === "download" ? "active" : ""}`}
          onClick={() => setActiveSectionTab("download")}
        >
          <span>📥</span> 2. &quot;DOWNLOAD NOW!&quot; Document &amp; File (PDF / Word / Image / Video)
        </button>
        <button
          type="button"
          className={`ffm-step-tab-btn ${activeSectionTab === "badges" ? "active" : ""}`}
          onClick={() => setActiveSectionTab("badges")}
        >
          <span>🏷️</span> 3. Page Badges Under Title
        </button>
      </div>

      {/* Stats & Presets Bar */}
      <div className="ffm-stats-row">
        <div className="ffm-stat-card">
          <span className="ffm-stat-num">{totalEnabled} / 14</span>
          <span className="ffm-stat-label">Active Fields in {activeScopeLabel}</span>
        </div>
        <div className="ffm-stat-card">
          <span className="ffm-stat-num">{totalRequired}</span>
          <span className="ffm-stat-label">Mandatory (Required *)</span>
        </div>
        <div className="ffm-presets-card">
          <span className="ffm-presets-title">
            ⚡ Quick Form Presets for &quot;{activeScopeLabel}&quot;:
          </span>
          <div className="ffm-presets-btns">
            <button type="button" onClick={() => applyPreset("full")} className="ffm-preset-btn">
              Full B2B (12 Fields)
            </button>
            <button type="button" onClick={() => applyPreset("short")} className="ffm-preset-btn">
              Short Form (5 Fields)
            </button>
            <button type="button" onClick={() => applyPreset("minimal")} className="ffm-preset-btn">
              Minimal (3 Fields)
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Controls, Right Live Preview */}
      <div className="ffm-main-grid">
        {/* Left: Configuration Column */}
        <div className="ffm-controls-col">
          {/* Header & CTA customization */}
          {(activeSectionTab === "all" || activeSectionTab === "fields") && (
            <div className="ffm-section-card">
              <h3>📝 Step 1A: Form Header &amp; Submit Button ({activeScopeLabel})</h3>
              <div className="ffm-field-grid">
                <div>
                  <label className="ffm-input-label">Form Header Title</label>
                  <input
                    type="text"
                    className="ffm-text-input"
                    value={config.headerTitle}
                    onChange={(e) => setConfig({ ...config, headerTitle: e.target.value })}
                    placeholder="e.g. GET IT NOW!"
                  />
                </div>
                <div>
                  <label className="ffm-input-label">Form Subtitle</label>
                  <input
                    type="text"
                    className="ffm-text-input"
                    value={config.subtitle}
                    onChange={(e) => setConfig({ ...config, subtitle: e.target.value })}
                    placeholder="e.g. Instant Access • Verified Research"
                  />
                </div>
                <div className="ffm-full-span">
                  <label className="ffm-input-label">Submit Button Label</label>
                  <input
                    type="text"
                    className="ffm-text-input"
                    value={config.submitButtonText}
                    onChange={(e) => setConfig({ ...config, submitButtonText: e.target.value })}
                    placeholder="e.g. DOWNLOAD NOW! →"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ================= "DOWNLOAD NOW!" TARGET CONTENT & FILE FORMAT ================= */}
          {(activeSectionTab === "all" || activeSectionTab === "download") && (
            <div className="ffm-section-card ffm-download-asset-card">
              <div className="ffm-card-title-row">
                <div>
                  <span className="ffm-cat-kicker">📥 STEP 2: WHEN VISITOR CLICKS &quot;DOWNLOAD NOW!&quot;</span>
                  <h3>Add Document / File &amp; Content for &quot;{activeScopeLabel}&quot;</h3>
                </div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {onAddDocumentForCategory && selectedCategory !== "GLOBAL" && (
                    <button
                      type="button"
                      className="ffm-add-doc-cat-btn"
                      onClick={() => onAddDocumentForCategory(selectedCategory)}
                    >
                      📄 + Create New Resource Card in &quot;{selectedCategory}&quot;
                    </button>
                  )}
                  <button
                    type="button"
                    className="ffm-test-dl-btn"
                    onClick={() => {
                      const dl = config.downloadAsset || defaultGatedFormConfig.downloadAsset!;
                      downloadResourceAsset(
                        {
                          title: `${activeScopeLabel} Executive Research`,
                          type: "Whitepaper",
                          category: activeScopeLabel,
                          summary: config.subtitle || "Verified Enterprise Research",
                          content:
                            dl.downloadContent ||
                            "Executive research overview and strategic framework prepared by GETprospeKt.",
                          downloadContent: dl.downloadContent || "",
                        },
                        dl.fileUrl,
                        dl.fileType || "auto-pdf",
                        dl.fileName
                      );
                      showToast(`Testing download for "${activeScopeLabel}"...`);
                    }}
                  >
                    ⚡ Test &quot;Download Now&quot; File
                  </button>
                </div>
              </div>
              <p className="ffm-dl-helper">
                Choose what file format and content will download when a user clicks the &quot;DOWNLOAD NOW!&quot; button in <strong>{activeScopeLabel}</strong>. Supports <strong>PDF, Image, Word (.doc/.docx), Video (.mp4), or Any File</strong>.
              </p>

              {/* Format Selector Pills */}
              <div className="ffm-dl-format-group">
                {[
                  { id: "auto-pdf", label: "⚙️ Auto PDF (From Content)" },
                  { id: "pdf", label: "📄 Custom PDF (.pdf)" },
                  { id: "word", label: "📝 Word Document (.doc / .docx)" },
                  { id: "image", label: "🖼️ Image (.png / .jpg / .webp)" },
                  { id: "video", label: "🎥 Video (.mp4 / .webm)" },
                  { id: "any", label: "📦 Any File (.xlsx, .pptx, .zip)" },
                ].map((fmt) => {
                  const activeType = config.downloadAsset?.fileType || "auto-pdf";
                  return (
                    <button
                      type="button"
                      key={fmt.id}
                      className={`ffm-dl-format-btn ${activeType === fmt.id ? "active" : ""}`}
                      onClick={() =>
                        setConfig({
                          ...config,
                          downloadAsset: {
                            ...(config.downloadAsset || defaultGatedFormConfig.downloadAsset!),
                            fileType: fmt.id,
                          },
                        })
                      }
                    >
                      {fmt.label}
                    </button>
                  );
                })}
              </div>

              {/* File Upload from Computer + External URL */}
              <div className="ffm-dl-upload-box">
                <div className="ffm-dl-upload-col">
                  <label className="ffm-input-label">
                    1. Upload Document / Media File from Computer (PDF, Image, Word, Video, Any Format)
                  </label>
                  <div className="ffm-dl-upload-row">
                    <label className="ffm-upload-trigger-btn">
                      📁 Choose File to Upload
                      <input
                        type="file"
                        accept="*/*,.pdf,.doc,.docx,.png,.jpg,.jpeg,.webp,.mp4,.webm,.xlsx,.pptx,.zip"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            const dataUrl = reader.result as string;
                            const ext = file.name.split(".").pop()?.toLowerCase() || "";
                            let detectedType = config.downloadAsset?.fileType || "any";
                            if (ext === "pdf") detectedType = "pdf";
                            else if (["doc", "docx", "rtf"].includes(ext)) detectedType = "word";
                            else if (["png", "jpg", "jpeg", "webp", "gif", "svg"].includes(ext))
                              detectedType = "image";
                            else if (["mp4", "webm", "mov"].includes(ext)) detectedType = "video";
                            else detectedType = "any";

                            setConfig({
                              ...config,
                              downloadAsset: {
                                ...(config.downloadAsset || defaultGatedFormConfig.downloadAsset!),
                                fileType: detectedType,
                                fileUrl: dataUrl,
                                fileName: file.name,
                              },
                            });
                            showToast(`Attached "${file.name}" (${detectedType.toUpperCase()})`);
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                    </label>
                    {config.downloadAsset?.fileUrl && (
                      <button
                        type="button"
                        className="ffm-clear-file-btn"
                        onClick={() =>
                          setConfig({
                            ...config,
                            downloadAsset: {
                              ...(config.downloadAsset || defaultGatedFormConfig.downloadAsset!),
                              fileUrl: "",
                              fileName: "",
                            },
                          })
                        }
                      >
                        ✕ Clear File
                      </button>
                    )}
                  </div>
                  {config.downloadAsset?.fileName && (
                    <span className="ffm-attached-badge">
                      ✓ Attached File: <strong>{config.downloadAsset.fileName}</strong>
                    </span>
                  )}
                </div>

                <div className="ffm-field-grid" style={{ marginTop: "10px" }}>
                  <div>
                    <label className="ffm-input-label">Or Paste File / Media URL</label>
                    <input
                      type="text"
                      className="ffm-text-input"
                      placeholder="https://example.com/document.pdf (or .docx, .png, .mp4)"
                      value={
                        config.downloadAsset?.fileUrl?.startsWith("data:")
                          ? ""
                          : config.downloadAsset?.fileUrl || ""
                      }
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          downloadAsset: {
                            ...(config.downloadAsset || defaultGatedFormConfig.downloadAsset!),
                            fileUrl: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="ffm-input-label">Saved Filename on Download</label>
                    <input
                      type="text"
                      className="ffm-text-input"
                      placeholder="e.g. enterprise-report.pdf / guide.doc / video.mp4"
                      value={config.downloadAsset?.fileName || ""}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          downloadAsset: {
                            ...(config.downloadAsset || defaultGatedFormConfig.downloadAsset!),
                            fileName: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>

                <div style={{ marginTop: "12px" }}>
                  <label className="ffm-input-label">
                    2. Or Write / Paste Downloadable Document Content (Included in Downloaded PDF or Word .doc)
                  </label>
                  <textarea
                    rows={4}
                    className="ffm-text-input"
                    style={{ resize: "vertical", fontFamily: "inherit" }}
                    placeholder="Type or paste the exact content, research data, or body text that will be inside the downloaded PDF or Word (.doc) file when the visitor clicks 'DOWNLOAD NOW!'..."
                    value={config.downloadAsset?.downloadContent || ""}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        downloadAsset: {
                          ...(config.downloadAsset || defaultGatedFormConfig.downloadAsset!),
                          downloadContent: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {/* Field Toggles Table */}
          {(activeSectionTab === "all" || activeSectionTab === "fields") && (
            <div className="ffm-section-card">
              <div className="ffm-card-title-row">
                <h3>📋 Step 1B: Form Fields &amp; Validation Rules ({activeScopeLabel})</h3>
                <span className="ffm-subtitle-tag">Toggle switches to show/hide or require</span>
              </div>

              <div className="ffm-fields-table">
                <div className="ffm-table-header">
                  <span className="col-field">Field</span>
                  <span className="col-label">Display Label</span>
                  <span className="col-toggle">Visible</span>
                  <span className="col-toggle">Required *</span>
                </div>

                {fieldKeys.map((key) => {
                  const item = config.fields[key];
                  if (!item) return null;
                  const isEmail = key === "email";
                  const isCheckbox = key.startsWith("optIn");

                  return (
                    <div
                      key={key}
                      className={`ffm-table-row ${item.enabled ? "row-enabled" : "row-disabled"}`}
                    >
                      <div className="col-field">
                        <span className="ffm-field-code">{key}</span>
                        {isCheckbox && <span className="ffm-badge-checkbox">Consent</span>}
                      </div>

                      <div className="col-label">
                        <input
                          type="text"
                          className="ffm-inline-input"
                          value={item.label}
                          onChange={(e) => handleLabelChange(key, e.target.value)}
                          placeholder="Label"
                        />
                      </div>

                      <div className="col-toggle">
                        <label className="ffm-switch">
                          <input
                            type="checkbox"
                            checked={item.enabled}
                            onChange={() => handleToggleEnabled(key)}
                            disabled={isEmail}
                          />
                          <span className="ffm-slider" />
                        </label>
                      </div>

                      <div className="col-toggle">
                        <label className="ffm-switch">
                          <input
                            type="checkbox"
                            checked={item.required}
                            onChange={() => handleToggleRequired(key)}
                            disabled={!item.enabled || isCheckbox}
                          />
                          <span className="ffm-slider required-slider" />
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Resource Metadata Bar (Global Visibility & Defaults) */}
          {(activeSectionTab === "all" || activeSectionTab === "badges") && (
            <div className="ffm-section-card">
              <div className="ffm-card-title-row">
                <h3>🏷️ Step 3: Resource Metadata Bar Under Title ({activeScopeLabel})</h3>
                <span className="ffm-subtitle-tag">Visibility &amp; default badge labels</span>
              </div>

              <div className="ffm-field-grid" style={{ marginBottom: "14px" }}>
                <div>
                  <label className="ffm-input-label">Default Research / Access Badge</label>
                  <input
                    type="text"
                    className="ffm-text-input"
                    value={config.metaBar?.defaultAccessBadgeText ?? "Enterprise Research"}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        metaBar: {
                          ...(config.metaBar || defaultGatedFormConfig.metaBar),
                          defaultAccessBadgeText: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g. Enterprise Research"
                  />
                </div>
                <div>
                  <label className="ffm-input-label">Downloads Counter Label</label>
                  <input
                    type="text"
                    className="ffm-text-input"
                    value={config.metaBar?.downloadsSuffix ?? "Downloads"}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        metaBar: {
                          ...(config.metaBar || defaultGatedFormConfig.metaBar),
                          downloadsSuffix: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g. Downloads"
                  />
                </div>
              </div>

              <div className="ffm-fields-table">
                {[
                  {
                    key: "showCategory" as const,
                    icon: "📁",
                    label: "Category Badge (e.g. B2B Technology)",
                  },
                  {
                    key: "showFormat" as const,
                    icon: "📄",
                    label: "Format Badge (e.g. Format: PDF Document)",
                  },
                  {
                    key: "showAccessBadge" as const,
                    icon: "🔒",
                    label: `Research / Access Badge (${
                      config.metaBar?.defaultAccessBadgeText || "Enterprise Research"
                    })`,
                  },
                  {
                    key: "showDownloadCount" as const,
                    icon: "📥",
                    label: `Downloads Counter Badge (e.g. 1 ${
                      config.metaBar?.downloadsSuffix || "Downloads"
                    })`,
                  },
                ].map((badge) => {
                  const isEnabled = config.metaBar?.[badge.key] !== false;
                  return (
                    <div
                      key={badge.key}
                      className={`ffm-table-row ${isEnabled ? "row-enabled" : "row-disabled"}`}
                      style={{ gridTemplateColumns: "40px 1fr 80px" }}
                    >
                      <div className="col-field">
                        <span style={{ fontSize: "15px" }}>{badge.icon}</span>
                      </div>
                      <div className="col-label" style={{ fontSize: "13px", color: "#E2E8F0" }}>
                        {badge.label}
                      </div>
                      <div className="col-toggle" style={{ textAlign: "right" }}>
                        <label className="ffm-switch">
                          <input
                            type="checkbox"
                            checked={isEnabled}
                            onChange={() =>
                              setConfig({
                                ...config,
                                metaBar: {
                                  ...(config.metaBar || defaultGatedFormConfig.metaBar),
                                  [badge.key]: !isEnabled,
                                },
                              })
                            }
                          />
                          <span className="ffm-slider" />
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right: Live Interactive Form Preview */}
        <div className="ffm-preview-col">
          <div className="ffm-preview-header">
            <span className="ffm-preview-badge">LIVE PREVIEW</span>
            <span>
              Category: <strong style={{ color: "#00D2FF" }}>{activeScopeLabel}</strong>
            </span>
          </div>

          <div className="ffm-preview-phone-card">
            <div className="preview-form-header">
              <h3>{config.headerTitle || "GET IT NOW!"}</h3>
              <p>
                <span className="pulse-dot" /> {config.subtitle || "Instant Access • Verified Research"}
              </p>
            </div>

            <div className="preview-form-body">
              {/* Name Row */}
              {(config.fields.firstName?.enabled || config.fields.lastName?.enabled) && (
                <div className="preview-grid-2">
                  {config.fields.firstName?.enabled && (
                    <div className="preview-field-box">
                      <label>
                        {config.fields.firstName.label}
                        {config.fields.firstName.required && <span className="req">*</span>}
                      </label>
                      <input type="text" placeholder="John" disabled readOnly />
                    </div>
                  )}
                  {config.fields.lastName?.enabled && (
                    <div className="preview-field-box">
                      <label>
                        {config.fields.lastName.label}
                        {config.fields.lastName.required && <span className="req">*</span>}
                      </label>
                      <input type="text" placeholder="Doe" disabled readOnly />
                    </div>
                  )}
                </div>
              )}

              {/* Email & Phone */}
              {(config.fields.email?.enabled || config.fields.telephone?.enabled) && (
                <div className="preview-grid-2">
                  {config.fields.email?.enabled && (
                    <div className="preview-field-box">
                      <label>
                        {config.fields.email.label}
                        {config.fields.email.required && <span className="req">*</span>}
                      </label>
                      <input type="email" placeholder="name@company.com" disabled readOnly />
                    </div>
                  )}
                  {config.fields.telephone?.enabled && (
                    <div className="preview-field-box">
                      <label>
                        {config.fields.telephone.label}
                        {config.fields.telephone.required && <span className="req">*</span>}
                      </label>
                      <input type="tel" placeholder="+1 (555) 000-0000" disabled readOnly />
                    </div>
                  )}
                </div>
              )}

              {/* Company & Job Title */}
              {(config.fields.companyName?.enabled || config.fields.jobTitle?.enabled) && (
                <div className="preview-grid-2">
                  {config.fields.companyName?.enabled && (
                    <div className="preview-field-box">
                      <label>
                        {config.fields.companyName.label}
                        {config.fields.companyName.required && <span className="req">*</span>}
                      </label>
                      <input type="text" placeholder="Acme Corp" disabled readOnly />
                    </div>
                  )}
                  {config.fields.jobTitle?.enabled && (
                    <div className="preview-field-box">
                      <label>
                        {config.fields.jobTitle.label}
                        {config.fields.jobTitle.required && <span className="req">*</span>}
                      </label>
                      <select disabled>
                        <option>Director / Head of Department</option>
                      </select>
                    </div>
                  )}
                </div>
              )}

              {/* Industry & Size */}
              {(config.fields.industry?.enabled || config.fields.companySize?.enabled) && (
                <div className="preview-grid-2">
                  {config.fields.industry?.enabled && (
                    <div className="preview-field-box">
                      <label>
                        {config.fields.industry.label}
                        {config.fields.industry.required && <span className="req">*</span>}
                      </label>
                      <select disabled>
                        <option>B2B Technology & Software</option>
                      </select>
                    </div>
                  )}
                  {config.fields.companySize?.enabled && (
                    <div className="preview-field-box">
                      <label>
                        {config.fields.companySize.label}
                        {config.fields.companySize.required && <span className="req">*</span>}
                      </label>
                      <select disabled>
                        <option>51 - 200 employees</option>
                      </select>
                    </div>
                  )}
                </div>
              )}

              {/* Country & City */}
              {(config.fields.country?.enabled || config.fields.city?.enabled) && (
                <div className="preview-grid-2">
                  {config.fields.country?.enabled && (
                    <div className="preview-field-box">
                      <label>
                        {config.fields.country.label}
                        {config.fields.country.required && <span className="req">*</span>}
                      </label>
                      <select disabled>
                        <option>United States</option>
                      </select>
                    </div>
                  )}
                  {config.fields.city?.enabled && (
                    <div className="preview-field-box">
                      <label>
                        {config.fields.city.label}
                        {config.fields.city.required && <span className="req">*</span>}
                      </label>
                      <input type="text" placeholder="New York" disabled readOnly />
                    </div>
                  )}
                </div>
              )}

              {/* Address & Postal Code */}
              {(config.fields.address?.enabled || config.fields.postalCode?.enabled) && (
                <div className="preview-grid-2">
                  {config.fields.address?.enabled && (
                    <div className="preview-field-box">
                      <label>
                        {config.fields.address.label}
                        {config.fields.address.required && <span className="req">*</span>}
                      </label>
                      <input type="text" placeholder="123 Market St" disabled readOnly />
                    </div>
                  )}
                  {config.fields.postalCode?.enabled && (
                    <div className="preview-field-box">
                      <label>
                        {config.fields.postalCode.label}
                        {config.fields.postalCode.required && <span className="req">*</span>}
                      </label>
                      <input type="text" placeholder="10001" disabled readOnly />
                    </div>
                  )}
                </div>
              )}

              {/* Checkboxes */}
              {config.fields.optInMarketing?.enabled && (
                <div className="preview-checkbox">
                  <input type="checkbox" defaultChecked disabled />
                  <span>
                    Yes, I would like to subscribe to updates. GETprospeKt would love to stay in touch.
                  </span>
                </div>
              )}

              {config.fields.optInPartner?.enabled && (
                <div className="preview-checkbox">
                  <input type="checkbox" defaultChecked disabled />
                  <span>
                    I agree that GETprospeKt can share my contact data with partners.
                  </span>
                </div>
              )}

              {/* Submit CTA button */}
              <button
                type="button"
                className="preview-submit-btn"
                title="Click to test downloading the configured file/content"
                onClick={() => {
                  const dl = config.downloadAsset || defaultGatedFormConfig.downloadAsset!;
                  downloadResourceAsset(
                    {
                      title: `${activeScopeLabel} Executive Research`,
                      type: "Whitepaper",
                      category: activeScopeLabel,
                      summary: config.subtitle || "Verified Enterprise Research",
                      content:
                        dl.downloadContent ||
                        "Executive research overview and strategic framework prepared by GETprospeKt.",
                      downloadContent: dl.downloadContent || "",
                    },
                    dl.fileUrl,
                    dl.fileType || "auto-pdf",
                    dl.fileName
                  );
                  showToast(`Triggered test download (${(dl.fileType || "PDF").toUpperCase()})!`);
                }}
              >
                {config.submitButtonText || "DOWNLOAD NOW! →"}
              </button>

              <div className="preview-footer-note">
                🔒 256-Bit Encrypted • Confidential Enterprise Access
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .ffm-wrapper {
          padding: 24px 0 60px;
          color: #E2E8F0;
        }

        /* Download Asset Card Styles */
        .ffm-download-asset-card {
          border-color: rgba(0, 210, 255, 0.35) !important;
          background: linear-gradient(180deg, #081226 0%, #0B132B 100%) !important;
        }

        .ffm-dl-helper {
          font-size: 12.5px;
          color: #94A3B8;
          margin: 0 0 12px;
          line-height: 1.45;
        }

        .ffm-dl-format-group {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 14px;
        }

        .ffm-dl-format-btn {
          background: #060B18;
          border: 1px solid rgba(203, 213, 225, 0.16);
          color: #CBD5E1;
          padding: 7px 12px;
          border-radius: 7px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.18s ease;
        }

        .ffm-dl-format-btn:hover {
          border-color: #00D2FF;
          color: #FFFFFF;
        }

        .ffm-dl-format-btn.active {
          background: linear-gradient(135deg, #0046FC 0%, #0084FF 100%);
          border-color: #00D2FF;
          color: #FFFFFF;
          box-shadow: 0 3px 12px rgba(0, 70, 252, 0.4);
        }

        .ffm-dl-upload-box {
          background: rgba(6, 11, 24, 0.65);
          border: 1px dashed rgba(0, 210, 255, 0.28);
          border-radius: 8px;
          padding: 14px;
        }

        .ffm-dl-upload-row {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .ffm-upload-trigger-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #111C33;
          border: 1px solid rgba(0, 210, 255, 0.45);
          color: #00D2FF;
          padding: 8px 14px;
          border-radius: 7px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.18s ease;
        }

        .ffm-upload-trigger-btn:hover {
          background: #00D2FF;
          color: #040914;
        }

        .ffm-clear-file-btn {
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.35);
          color: #FCA5A5;
          padding: 7px 12px;
          border-radius: 6px;
          font-size: 11.5px;
          font-weight: 600;
          cursor: pointer;
        }

        .ffm-attached-badge {
          display: inline-block;
          margin-top: 8px;
          font-size: 12px;
          color: #10B981;
          background: rgba(16, 185, 129, 0.12);
          padding: 4px 10px;
          border-radius: 6px;
        }

        .ffm-test-dl-btn {
          background: rgba(0, 210, 255, 0.14);
          border: 1px solid rgba(0, 210, 255, 0.45);
          color: #00D2FF;
          font-size: 11.5px;
          font-weight: 700;
          padding: 7px 12px;
          border-radius: 7px;
          cursor: pointer;
          white-space: nowrap;
        }

        .ffm-test-dl-btn:hover {
          background: #00D2FF;
          color: #040914;
        }

        /* Category Selector Box */
        .ffm-category-selector-box {
          background: #081124;
          border: 1px solid rgba(0, 210, 255, 0.28);
          border-radius: 12px;
          padding: 18px 20px;
          margin-bottom: 20px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
        }

        .ffm-cat-box-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          padding-bottom: 10px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .ffm-cat-kicker {
          display: inline-block;
          font-size: 10.5px;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: #00D2FF;
          margin-bottom: 3px;
        }

        .ffm-cat-box-top h4 {
          margin: 0;
          font-size: 15px;
          font-weight: 700;
          color: #FFFFFF;
        }

        .ffm-custom-cat-add {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .ffm-custom-cat-add input {
          background: #040914;
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 6px;
          color: #FFFFFF;
          padding: 7px 12px;
          font-size: 12px;
          min-width: 210px;
        }

        .ffm-custom-cat-add input:focus {
          border-color: #00D2FF;
          outline: none;
        }

        .ffm-custom-cat-add button {
          background: rgba(0, 210, 255, 0.14);
          border: 1px solid rgba(0, 210, 255, 0.4);
          color: #00D2FF;
          font-size: 12px;
          font-weight: 700;
          padding: 7px 12px;
          border-radius: 6px;
          cursor: pointer;
          white-space: nowrap;
        }

        .ffm-custom-cat-add button:hover {
          background: #00D2FF;
          color: #040914;
        }

        .ffm-cat-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .ffm-cat-group-label {
          font-size: 11.5px;
          font-weight: 700;
          color: #94A3B8;
        }

        .ffm-cat-pills-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .ffm-cat-tab {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #0D172E;
          border: 1px solid rgba(203, 213, 225, 0.14);
          color: #CBD5E1;
          padding: 7px 13px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.18s ease;
        }

        .ffm-cat-tab:hover {
          border-color: #00D2FF;
          color: #FFFFFF;
          background: rgba(0, 210, 255, 0.1);
        }

        .ffm-cat-tab.active {
          background: linear-gradient(135deg, #0046FC 0%, #0084FF 100%);
          border-color: #00D2FF;
          color: #FFFFFF;
          box-shadow: 0 4px 14px rgba(0, 70, 252, 0.45);
        }

        .ffm-cat-tab.global-tab.active {
          background: linear-gradient(135deg, #059669 0%, #10B981 100%);
          border-color: #34D399;
        }

        .ffm-cat-custom-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #10B981;
          box-shadow: 0 0 6px #10B981;
        }

        .ffm-active-scope-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 10px;
          background: rgba(0, 210, 255, 0.08);
          border: 1px solid rgba(0, 210, 255, 0.25);
          border-radius: 8px;
          padding: 10px 14px;
        }

        .ffm-scope-left {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #E2E8F0;
        }

        .ffm-scope-highlight {
          color: #00D2FF;
          font-weight: 800;
          font-size: 13.5px;
        }

        .ffm-scope-status {
          font-size: 11.5px;
          font-weight: 700;
          color: #10B981;
          background: rgba(16, 185, 129, 0.12);
          padding: 4px 10px;
          border-radius: 12px;
        }

        .ffm-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 18px;
          margin-bottom: 24px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .ffm-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 700;
          color: #00D2FF;
          background: rgba(0, 210, 255, 0.1);
          padding: 4px 10px;
          border-radius: 20px;
          margin-bottom: 8px;
          letter-spacing: 0.5px;
        }

        .ffm-dot {
          width: 6px;
          height: 6px;
          background: #00D2FF;
          border-radius: 50%;
        }

        .ffm-header h2 {
          font-size: 24px;
          font-weight: 700;
          color: #FFFFFF;
          margin: 0 0 6px;
        }

        .ffm-header p {
          margin: 0;
          color: #94A3B8;
          font-size: 13.5px;
          max-width: 620px;
          line-height: 1.5;
        }

        .ffm-header-actions {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .ffm-btn-primary {
          background: linear-gradient(135deg, #00D2FF 0%, #0084FF 100%);
          color: #040914;
          font-weight: 700;
          font-size: 13px;
          padding: 9px 18px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }

        .ffm-btn-primary:hover {
          filter: brightness(1.1);
          transform: translateY(-1px);
        }

        .ffm-btn-secondary {
          background: rgba(255, 255, 255, 0.08);
          color: #E2E8F0;
          font-weight: 600;
          font-size: 13px;
          padding: 9px 15px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          cursor: pointer;
        }

        .ffm-btn-danger {
          background: rgba(239, 68, 68, 0.12);
          color: #F87171;
          font-weight: 600;
          font-size: 13px;
          padding: 9px 15px;
          border-radius: 8px;
          border: 1px solid rgba(239, 68, 68, 0.25);
          cursor: pointer;
        }

        .ffm-btn-danger:hover {
          background: rgba(239, 68, 68, 0.2);
        }

        /* Stats Row */
        .ffm-stats-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .ffm-stat-card {
          background: #0B132B;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .ffm-stat-num {
          font-size: 24px;
          font-weight: 800;
          color: #00D2FF;
        }

        .ffm-stat-label {
          font-size: 12px;
          color: #94A3B8;
        }

        .ffm-presets-card {
          grid-column: span 2;
          background: #0B132B;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          padding: 14px 20px;
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
        }

        .ffm-presets-title {
          font-size: 13px;
          font-weight: 700;
          color: #E2E8F0;
        }

        .ffm-presets-btns {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .ffm-preset-btn {
          background: rgba(0, 210, 255, 0.1);
          color: #00D2FF;
          border: 1px solid rgba(0, 210, 255, 0.25);
          border-radius: 6px;
          padding: 6px 12px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .ffm-preset-btn:hover {
          background: rgba(0, 210, 255, 0.2);
          border-color: #00D2FF;
        }

        /* Main Grid */
        .ffm-main-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.4fr) minmax(360px, 1fr);
          gap: 24px;
          align-items: start;
        }

        @media (max-width: 1080px) {
          .ffm-main-grid {
            grid-template-columns: 1fr;
          }
          .ffm-presets-card {
            grid-column: span 1;
          }
        }

        .ffm-section-card {
          background: #0B132B;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
        }

        .ffm-section-card h3 {
          font-size: 15.5px;
          font-weight: 700;
          color: #FFFFFF;
          margin: 0 0 16px;
        }

        .ffm-card-title-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
        }

        .ffm-card-title-row h3 {
          margin: 0;
        }

        .ffm-subtitle-tag {
          font-size: 11.5px;
          color: #94A3B8;
        }

        .ffm-field-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .ffm-full-span {
          grid-column: span 2;
        }

        .ffm-input-label {
          display: block;
          font-size: 11.5px;
          font-weight: 600;
          color: #94A3B8;
          margin-bottom: 5px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .ffm-text-input {
          width: 100%;
          background: #060B18;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 6px;
          color: #FFFFFF;
          padding: 8px 12px;
          font-size: 13px;
          box-sizing: border-box;
        }

        .ffm-text-input:focus {
          border-color: #00D2FF;
          outline: none;
        }

        /* Table */
        .ffm-fields-table {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .ffm-table-header {
          display: grid;
          grid-template-columns: 140px 1fr 70px 80px;
          gap: 12px;
          padding: 8px 12px;
          font-size: 11px;
          font-weight: 700;
          color: #94A3B8;
          text-transform: uppercase;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .ffm-table-row {
          display: grid;
          grid-template-columns: 140px 1fr 70px 80px;
          gap: 12px;
          align-items: center;
          padding: 8px 12px;
          border-radius: 8px;
          background: #070E20;
          border: 1px solid rgba(255, 255, 255, 0.04);
          transition: background 0.15s;
        }

        .row-disabled {
          opacity: 0.55;
        }

        .ffm-table-row:hover {
          background: #0E1A38;
        }

        .ffm-field-code {
          font-family: monospace;
          font-size: 12px;
          color: #CBD5E1;
        }

        .ffm-badge-checkbox {
          font-size: 9.5px;
          padding: 2px 6px;
          background: rgba(168, 85, 247, 0.15);
          color: #C084FC;
          border-radius: 4px;
          margin-left: 6px;
        }

        .ffm-inline-input {
          width: 100%;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 4px;
          color: #F1F5F9;
          font-size: 12.5px;
          padding: 5px 8px;
          box-sizing: border-box;
        }

        .ffm-inline-input:focus {
          border-color: #00D2FF;
          background: #060B18;
          outline: none;
        }

        /* Toggle Switches */
        .ffm-switch {
          position: relative;
          display: inline-block;
          width: 36px;
          height: 20px;
        }

        .ffm-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .ffm-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #1E293B;
          border-radius: 20px;
          transition: 0.2s;
        }

        .ffm-slider:before {
          position: absolute;
          content: "";
          height: 14px;
          width: 14px;
          left: 3px;
          bottom: 3px;
          background-color: #94A3B8;
          border-radius: 50%;
          transition: 0.2s;
        }

        .ffm-switch input:checked + .ffm-slider {
          background-color: #00D2FF;
        }

        .ffm-switch input:checked + .ffm-slider:before {
          transform: translateX(16px);
          background-color: #040914;
        }

        .ffm-switch input:checked + .required-slider {
          background-color: #EF4444;
        }

        .ffm-switch input:checked + .required-slider:before {
          background-color: #FFFFFF;
        }

        /* Live Preview Column */
        .ffm-preview-col {
          position: sticky;
          top: 20px;
        }

        .ffm-preview-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
          font-size: 12px;
          color: #94A3B8;
        }

        .ffm-preview-badge {
          background: rgba(0, 212, 170, 0.15);
          color: #00D4AA;
          font-weight: 800;
          font-size: 10.5px;
          padding: 3px 8px;
          border-radius: 4px;
          letter-spacing: 0.5px;
        }

        .ffm-preview-phone-card {
          background: #08101E;
          border: 1px solid rgba(0, 210, 255, 0.25);
          border-radius: 16px;
          padding: 24px 20px;
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.6);
        }

        .preview-form-header {
          text-align: center;
          margin-bottom: 20px;
        }

        .preview-form-header h3 {
          margin: 0 0 6px;
          font-size: 20px;
          font-weight: 800;
          letter-spacing: 1.5px;
          color: #E2E8F0;
        }

        .preview-form-header p {
          margin: 0;
          font-size: 11.5px;
          color: #94A3B8;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .pulse-dot {
          width: 7px;
          height: 7px;
          background: #00D4AA;
          border-radius: 50%;
          box-shadow: 0 0 8px #00D4AA;
        }

        .preview-form-body {
          display: flex;
          flex-direction: column;
          gap: 11px;
        }

        .preview-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .preview-field-box {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .preview-field-box label {
          font-size: 9.5px;
          font-weight: 700;
          color: #CBD5E1;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .preview-field-box label .req {
          color: #EF4444;
          margin-left: 2px;
        }

        .preview-field-box input,
        .preview-field-box select {
          background: #040914;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 6px;
          color: #94A3B8;
          padding: 7px 10px;
          font-size: 11.5px;
          box-sizing: border-box;
          width: 100%;
        }

        .preview-checkbox {
          display: flex;
          gap: 8px;
          align-items: flex-start;
          font-size: 9.5px;
          color: #94A3B8;
          line-height: 1.35;
          margin-top: 4px;
        }

        .preview-checkbox input {
          margin-top: 2px;
          accent-color: #00D2FF;
        }

        .preview-submit-btn {
          margin-top: 10px;
          width: 100%;
          background: linear-gradient(135deg, #00D2FF 0%, #0084FF 100%);
          border: none;
          color: #040914;
          font-weight: 800;
          font-size: 13px;
          letter-spacing: 0.5px;
          padding: 12px;
          border-radius: 24px;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(0, 210, 255, 0.3);
        }

        .preview-footer-note {
          text-align: center;
          font-size: 9.5px;
          color: #64748B;
          margin-top: 6px;
        }

        .ffm-step-tabs-bar {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 18px;
          background: rgba(15, 23, 42, 0.75);
          padding: 10px;
          border-radius: 12px;
          border: 1px solid rgba(56, 189, 248, 0.2);
        }

        .ffm-step-tab-btn {
          flex: 1;
          min-width: 190px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 14px;
          border-radius: 9px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(30, 41, 59, 0.7);
          color: #CBD5E1;
          font-size: 12.5px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.18s ease;
        }

        .ffm-step-tab-btn:hover {
          border-color: rgba(0, 210, 255, 0.45);
          color: #FFFFFF;
          background: rgba(30, 41, 59, 0.95);
        }

        .ffm-step-tab-btn.active {
          background: linear-gradient(135deg, #00D2FF 0%, #0284C7 100%);
          color: #040914;
          border-color: transparent;
          box-shadow: 0 4px 14px rgba(0, 210, 255, 0.3);
        }

        .ffm-add-doc-cat-btn {
          background: linear-gradient(135deg, #10B981 0%, #059669 100%);
          color: #FFFFFF;
          border: none;
          padding: 8px 15px;
          border-radius: 8px;
          font-size: 12.5px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 3px 12px rgba(16, 185, 129, 0.3);
          transition: all 0.18s ease;
        }

        .ffm-add-doc-cat-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(16, 185, 129, 0.45);
        }
      `}</style>
    </div>
  );
};

export default FormFieldsManager;

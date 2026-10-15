import React, { useState, useEffect } from "react";
import {
  defaultGatedFormConfig,
  type GatedFormConfig,
  type FormFieldSetting,
} from "../../services/api";

interface ItemFormSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemTitle: string;
  itemTypeLabel: string; // e.g. "Case Study", "Whitepaper", "Resource"
  initialConfig?: GatedFormConfig | null;
  initialAction?: "checkbox" | "field" | null;
  onSave: (newConfig: GatedFormConfig) => void;
  showToast?: (msg: string) => void;
}

const STANDARD_METADATA: Record<
  string,
  { label: string; icon: string; group: string; hint: string; type: FormFieldSetting["type"] }
> = {
  firstName: { label: "First Name", icon: "👤", group: "Identity", hint: "Visitor personal identity", type: "text" },
  lastName: { label: "Last Name", icon: "👤", group: "Identity", hint: "Visitor family name", type: "text" },
  email: { label: "Corporate Email", icon: "✉️", group: "Contact", hint: "Business email address", type: "email" },
  telephone: { label: "Telephone / Direct Dial", icon: "📞", group: "Contact", hint: "Direct phone number", type: "tel" },
  companyName: { label: "Company Name", icon: "🏢", group: "Company", hint: "Employer / Organization", type: "text" },
  jobTitle: { label: "Job Title", icon: "💼", group: "Company", hint: "Seniority and functional role", type: "text" },
  industry: { label: "Industry", icon: "🏭", group: "Company", hint: "Target market sector", type: "select" },
  companySize: { label: "Company Size", icon: "👥", group: "Company", hint: "Employee headcount tier", type: "select" },
  country: { label: "Country", icon: "🌍", group: "Location", hint: "Geographic territory", type: "select" },
  city: { label: "City", icon: "🏙️", group: "Location", hint: "Metropolitan headquarters", type: "text" },
  address: { label: "Street Address", icon: "📍", group: "Location", hint: "Physical office location", type: "text" },
  postalCode: { label: "Postal / ZIP Code", icon: "📮", group: "Location", hint: "Postal verification", type: "text" },
  optInMarketing: {
    label: "I would like to receive information from suppliers sponsoring this content and willing to share the information above with OnDot Media.",
    icon: "☑️",
    group: "Consent",
    hint: "Supplier & Sponsoring Communications Opt-in",
    type: "checkbox",
  },
  optInPartner: {
    label: "By checking this box, I agree that OnDot Media can share my data with Partners so that Partners can contact me by email or phone and provide more information about this content.",
    icon: "🤝",
    group: "Consent",
    hint: "Partner Data Sharing & Outreach Consent",
    type: "checkbox",
  },
};

const getFieldIcon = (f: FormFieldSetting): string => {
  if (f.icon) return f.icon;
  if (STANDARD_METADATA[f.id]?.icon) return STANDARD_METADATA[f.id].icon;
  switch (f.type) {
    case "email": return "✉️";
    case "tel": return "📞";
    case "number": return "🔢";
    case "select": return "📋";
    case "textarea": return "📑";
    case "checkbox": return "☑️";
    default: return "📝";
  }
};

const getFieldTypeBadge = (type?: string): string => {
  switch (type) {
    case "select": return "DROPDOWN";
    case "textarea": return "TEXTAREA";
    case "checkbox": return "CHECKBOX";
    case "email": return "EMAIL";
    case "tel": return "PHONE";
    case "number": return "NUMBER";
    default: return "TEXT";
  }
};

export const ItemFormSettingsModal: React.FC<ItemFormSettingsModalProps> = ({
  isOpen,
  onClose,
  itemTitle,
  itemTypeLabel,
  initialConfig,
  initialAction,
  onSave,
  showToast,
}) => {
  const [config, setConfig] = useState<GatedFormConfig>(() => {
    if (initialConfig && initialConfig.fields) {
      return JSON.parse(JSON.stringify(initialConfig));
    }
    return JSON.parse(JSON.stringify(defaultGatedFormConfig));
  });

  const [activeGroup, setActiveGroup] = useState<string>("All");

  // Modal Sub-states for Add, Edit, and Delete
  const [isAddFieldOpen, setIsAddFieldOpen] = useState(false);
  const [newField, setNewField] = useState<{
    label: string;
    type: NonNullable<FormFieldSetting["type"]>;
    placeholder: string;
    optionsString: string;
    group: string;
    enabled: boolean;
    required: boolean;
  }>({
    label: "",
    type: "text",
    placeholder: "",
    optionsString: "",
    group: "Custom",
    enabled: true,
    required: false,
  });

  const openAddCheckboxModal = () => {
    setNewField({
      label: "",
      type: "checkbox",
      placeholder: "",
      optionsString: "",
      group: "Consent",
      enabled: true,
      required: false,
    });
    setIsAddFieldOpen(true);
  };

  const openAddFieldModal = () => {
    setNewField({
      label: "",
      type: "text",
      placeholder: "",
      optionsString: "",
      group: activeGroup !== "All" && activeGroup !== "Consent" ? activeGroup : "Custom",
      enabled: true,
      required: false,
    });
    setIsAddFieldOpen(true);
  };

  const [editDraft, setEditDraft] = useState<{
    id: string;
    label: string;
    type: NonNullable<FormFieldSetting["type"]>;
    placeholder: string;
    optionsString: string;
    group: string;
    enabled: boolean;
    required: boolean;
  } | null>(null);

  const [fieldToDelete, setFieldToDelete] = useState<FormFieldSetting | null>(null);

  useEffect(() => {
    if (initialConfig && initialConfig.fields) {
      setConfig(JSON.parse(JSON.stringify(initialConfig)));
    } else {
      setConfig(JSON.parse(JSON.stringify(defaultGatedFormConfig)));
    }
    if (isOpen && initialAction === "checkbox") {
      openAddCheckboxModal();
    }
  }, [initialConfig, isOpen, initialAction]);

  if (!isOpen) return null;

  // Toggle Visibility
  const handleToggleEnabled = (key: string) => {
    setConfig((prev) => {
      const current = prev.fields[key] || {
        id: key,
        label: STANDARD_METADATA[key]?.label || key,
        enabled: false,
        required: false,
      };
      const nextEnabled = !current.enabled;
      return {
        ...prev,
        fields: {
          ...prev.fields,
          [key]: {
            ...current,
            enabled: nextEnabled,
            required: nextEnabled ? current.required : false,
          },
        },
      };
    });
  };

  // Toggle Required
  const handleToggleRequired = (key: string) => {
    setConfig((prev) => {
      const current = prev.fields[key] || {
        id: key,
        label: STANDARD_METADATA[key]?.label || key,
        enabled: true,
        required: false,
      };
      return {
        ...prev,
        fields: {
          ...prev.fields,
          [key]: {
            ...current,
            required: !current.required,
          },
        },
      };
    });
  };

  // Inline Quick Label Change
  const handleLabelChange = (key: string, newLabel: string) => {
    setConfig((prev) => {
      const current = prev.fields[key] || {
        id: key,
        label: newLabel,
        enabled: true,
        required: false,
      };
      return {
        ...prev,
        fields: {
          ...prev.fields,
          [key]: {
            ...current,
            label: newLabel,
          },
        },
      };
    });
  };

  // ADD FIELD HANDLER
  const handleCreateField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newField.label.trim()) {
      showToast?.(
        newField.type === "checkbox"
          ? "Please enter the checkbox disclaimer text"
          : "Please enter a field label"
      );
      return;
    }

    const isConsent = newField.type === "checkbox" || newField.group === "Consent";
    const fieldKey =
      (isConsent ? "optInCustom_" : "custom_") +
      Date.now().toString(36) +
      "_" +
      Math.random().toString(36).substring(2, 6);
    const parsedOptions =
      newField.type === "select"
        ? newField.optionsString
            .split(/[,\n]/)
            .map((s) => s.trim())
            .filter(Boolean)
        : undefined;

    const createdField: FormFieldSetting = {
      id: fieldKey,
      label: newField.label.trim(),
      type: newField.type,
      placeholder: newField.placeholder.trim() || undefined,
      options: parsedOptions,
      group: newField.group || (isConsent ? "Consent" : "Custom"),
      enabled: newField.enabled,
      required: newField.required,
      isCustom: true,
    };

    setConfig((prev) => {
      const nextDeleted = (prev.deletedFieldKeys || []).filter((k) => k !== fieldKey);
      return {
        ...prev,
        deletedFieldKeys: nextDeleted,
        fields: {
          ...prev.fields,
          [fieldKey]: createdField,
        },
      };
    });

    setIsAddFieldOpen(false);
    showToast?.(
      isConsent
        ? "Added new consent checkbox to form!"
        : `Added field "${createdField.label}" to form!`
    );
    setNewField({
      label: "",
      type: "text",
      placeholder: "",
      optionsString: "",
      group: "Custom",
      enabled: true,
      required: false,
    });
  };

  // OPEN EDIT MODAL
  const openEditModal = (f: FormFieldSetting) => {
    setEditDraft({
      id: f.id,
      label: f.label,
      type: f.type || STANDARD_METADATA[f.id]?.type || "text",
      placeholder: f.placeholder || "",
      optionsString: (f.options || []).join(", "),
      group: f.group || STANDARD_METADATA[f.id]?.group || "General",
      enabled: f.enabled,
      required: f.required,
    });
  };

  // SAVE EDITED FIELD
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editDraft || !editDraft.label.trim()) {
      showToast?.("Field label cannot be empty");
      return;
    }

    const parsedOptions =
      editDraft.type === "select"
        ? editDraft.optionsString
            .split(/[,\n]/)
            .map((s) => s.trim())
            .filter(Boolean)
        : undefined;

    setConfig((prev) => {
      const existing = prev.fields[editDraft.id] || { id: editDraft.id };
      return {
        ...prev,
        fields: {
          ...prev.fields,
          [editDraft.id]: {
            ...existing,
            id: editDraft.id,
            label: editDraft.label.trim(),
            type: editDraft.type,
            placeholder: editDraft.placeholder.trim() || undefined,
            options: parsedOptions,
            group: editDraft.group,
            enabled: editDraft.enabled,
            required: editDraft.required,
          },
        },
      };
    });

    showToast?.(`Updated field "${editDraft.label}"!`);
    setEditDraft(null);
  };

  // DELETE FIELD HANDLER
  const confirmDeleteField = () => {
    if (!fieldToDelete) return;
    const fieldId = fieldToDelete.id;
    const fieldLabel = fieldToDelete.label;

    setConfig((prev) => {
      const nextFields = { ...prev.fields };
      delete nextFields[fieldId];
      const nextDeleted = Array.from(new Set([...(prev.deletedFieldKeys || []), fieldId]));
      return {
        ...prev,
        fields: nextFields,
        deletedFieldKeys: nextDeleted,
      };
    });

    showToast?.(`Deleted field "${fieldLabel}" from this form.`);
    setFieldToDelete(null);
  };

  // RESTORE DEFAULT FIELDS
  const handleRestoreDefaults = () => {
    if (window.confirm("Restore standard default fields? Custom added fields will be preserved.")) {
      setConfig((prev) => {
        // preserve any custom added fields
        const customOnly: Record<string, FormFieldSetting> = {};
        Object.entries(prev.fields || {}).forEach(([k, f]) => {
          if (f && (f.isCustom || !STANDARD_METADATA[k])) {
            customOnly[k] = f;
          }
        });
        return {
          ...prev,
          deletedFieldKeys: [],
          fields: {
            ...defaultGatedFormConfig.fields,
            ...customOnly,
          },
        };
      });
      showToast?.("Default standard form fields restored!");
    }
  };

  // Presets
  const applyPreset = (preset: "minimal" | "standard" | "enterprise") => {
    if (preset === "minimal") {
      const newFields = { ...config.fields };
      Object.keys(newFields).forEach((k) => {
        const isCore = ["firstName", "email", "companyName"].includes(k);
        if (newFields[k]) {
          newFields[k] = { ...newFields[k]!, enabled: isCore, required: isCore };
        }
      });
      setConfig((prev) => ({
        ...prev,
        headerTitle: prev.headerTitle || "QUICK DOWNLOAD",
        subtitle: prev.subtitle || "Instant Access • 1-Minute Gate",
        submitButtonText: prev.submitButtonText || "DOWNLOAD NOW! →",
        fields: newFields,
      }));
      showToast?.("Applied Minimal Gate (3 Fields)");
      return;
    }

    if (preset === "standard") {
      const newFields = { ...config.fields };
      Object.keys(newFields).forEach((k) => {
        const isStandard = ["firstName", "lastName", "email", "companyName", "jobTitle"].includes(k);
        const isReq = ["firstName", "lastName", "email", "companyName"].includes(k);
        if (newFields[k]) {
          newFields[k] = { ...newFields[k]!, enabled: isStandard, required: isReq };
        }
      });
      setConfig((prev) => ({
        ...prev,
        headerTitle: prev.headerTitle || `DOWNLOAD ${itemTypeLabel.toUpperCase()}`,
        subtitle: prev.subtitle || "Verified Research • Executive Access",
        submitButtonText: prev.submitButtonText || "DOWNLOAD NOW! →",
        fields: newFields,
      }));
      showToast?.("Applied Standard B2B Form (5 Fields)");
      return;
    }

    if (preset === "enterprise") {
      const newFields = { ...config.fields };
      Object.keys(newFields).forEach((k) => {
        if (newFields[k]) {
          newFields[k] = { ...newFields[k]!, enabled: true, required: true };
        }
      });
      if (newFields.optInMarketing) newFields.optInMarketing.required = false;
      if (newFields.optInPartner) newFields.optInPartner.required = false;
      setConfig((prev) => ({
        ...prev,
        headerTitle: prev.headerTitle || "ENTERPRISE RESEARCH CLEARANCE",
        subtitle: prev.subtitle || "Complete Verified Information Required",
        submitButtonText: prev.submitButtonText || "REQUEST CLEARANCE & DOWNLOAD →",
        fields: newFields,
      }));
      showToast?.("Applied Full Enterprise Form (All Fields)");
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(config);
    showToast?.(`Saved form settings specifically for "${itemTitle}"!`);
    onClose();
  };

  // Active fields list & filters
  const allFieldEntries = Object.entries(config.fields || {}).filter(
    ([_, f]) => Boolean(f)
  ) as [string, FormFieldSetting][];

  const enabledCount = allFieldEntries.filter(([_, f]) => f.enabled).length;
  const requiredCount = allFieldEntries.filter(([_, f]) => f.enabled && f.required).length;

  const groups = ["All", "Identity", "Contact", "Company", "Location", "Consent", "Custom"];
  const filteredEntries = allFieldEntries.filter(([key, f]) => {
    if (activeGroup === "All") return true;
    const grp = f.group || STANDARD_METADATA[key]?.group || "Custom";
    return grp === activeGroup;
  });

  return (
    <div className="item-form-modal-backdrop" onClick={onClose}>
      <div className="item-form-modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="item-form-modal-header">
          <div className="item-form-header-title-row">
            <h2 style={{ margin: 0 }}>Manage Form</h2>
            <div className="item-form-header-actions">
              <button
                type="button"
                className="btn-add-field-action"
                onClick={() => setIsAddFieldOpen(true)}
              >
                ➕ Add Field
              </button>
              <button
                type="button"
                className="btn-restore-fields-action"
                onClick={handleRestoreDefaults}
                title="Restore standard default form fields"
              >
                🔄 Restore Defaults
              </button>
            </div>
          </div>
          <button
            type="button"
            className="item-form-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Quick Presets Bar */}
        <div className="item-form-presets-bar">
          <span className="presets-label">⚡ QUICK PRESETS:</span>
          <button
            type="button"
            className="preset-btn"
            onClick={() => applyPreset("minimal")}
          >
            ⚡ Minimal Gate (3 Fields)
          </button>
          <button
            type="button"
            className="preset-btn"
            onClick={() => applyPreset("standard")}
          >
            📋 Standard B2B (5 Fields)
          </button>
          <button
            type="button"
            className="preset-btn"
            onClick={() => applyPreset("enterprise")}
          >
            🏢 Full Enterprise Gate
          </button>
          <div className="presets-stat">
            <strong>{enabledCount}</strong> Active Fields · <strong>{requiredCount}</strong> Required
          </div>
        </div>

        <form onSubmit={handleSave} className="item-form-modal-body">
          {/* Header Title & Button Text Customization */}
          <div className="item-form-text-custom-grid">
            <div className="form-subfield">
              <label htmlFor="ifm-header">Form Header Title</label>
              <input
                id="ifm-header"
                type="text"
                value={config.headerTitle}
                onChange={(e) => setConfig({ ...config, headerTitle: e.target.value })}
                placeholder="e.g. GET IT NOW! or DOWNLOAD CASE STUDY"
              />
            </div>
            <div className="form-subfield">
              <label htmlFor="ifm-subtitle">Form Subtitle</label>
              <input
                id="ifm-subtitle"
                type="text"
                value={config.subtitle}
                onChange={(e) => setConfig({ ...config, subtitle: e.target.value })}
                placeholder="e.g. Instant Access • Verified Research"
              />
            </div>
            <div className="form-subfield">
              <label htmlFor="ifm-btn">Submit Button Text</label>
              <input
                id="ifm-btn"
                type="text"
                value={config.submitButtonText}
                onChange={(e) => setConfig({ ...config, submitButtonText: e.target.value })}
                placeholder="e.g. DOWNLOAD NOW! →"
              />
            </div>
          </div>

          {/* Quick Apply OnDot Disclaimers Banner */}
          <div className="item-form-consent-banner">
            <div className="consent-banner-text">
              <span className="consent-icon">📜</span>
              <div>
                <strong>Consent Checkboxes &amp; Legal Disclaimers:</strong>
                <span> Manage sponsor opt-in, partner data sharing, and custom checkboxes shown to visitors.</span>
              </div>
            </div>
            <div className="consent-banner-actions">
              <button
                type="button"
                className="btn-banner-add-checkbox"
                onClick={openAddCheckboxModal}
                title="Add a custom consent or disclaimer checkbox"
              >
                ☑️ + Add Checkbox
              </button>
              <button
                type="button"
                className="btn-apply-ondot-banner"
                onClick={() => {
                  setConfig((prev) => ({
                    ...prev,
                    fields: {
                      ...prev.fields,
                      optInMarketing: {
                        ...(prev.fields.optInMarketing || defaultGatedFormConfig.fields.optInMarketing),
                        label: "I would like to receive information from suppliers sponsoring this content and willing to share the information above with OnDot Media.",
                        enabled: true,
                        type: "checkbox",
                        group: "Consent",
                      },
                      optInPartner: {
                        ...(prev.fields.optInPartner || defaultGatedFormConfig.fields.optInPartner),
                        label: "By checking this box, I agree that OnDot Media can share my data with Partners so that Partners can contact me by email or phone and provide more information about this content.",
                        enabled: true,
                        type: "checkbox",
                        group: "Consent",
                      },
                    },
                  }));
                  showToast?.("Loaded OnDot Media disclaimers for both checkboxes!");
                }}
              >
                ⚡ Set OnDot Media Disclaimers (Both Checkboxes)
              </button>
            </div>
          </div>

          {/* Group Filter Tabs & Add Field button */}
          <div className="item-form-group-tabs-row">
            <div className="item-form-group-tabs">
              {groups.map((grp) => (
                <button
                  type="button"
                  key={grp}
                  className={`group-tab ${activeGroup === grp ? "active" : ""}`}
                  onClick={() => setActiveGroup(grp)}
                >
                  {grp === "Consent" ? "☑️ Consent" : grp}
                </button>
              ))}
            </div>
            <div className="item-form-add-actions">
              <button
                type="button"
                className="btn-add-checkbox-sm"
                onClick={openAddCheckboxModal}
                title="Add a consent, opt-in, or legal disclaimer checkbox"
              >
                ☑️ Add Checkbox
              </button>
              <button
                type="button"
                className="btn-add-field-sm"
                onClick={openAddFieldModal}
                title="Add a text, dropdown, or custom field"
              >
                ➕ Add Field
              </button>
            </div>
          </div>

          {/* Consent Tab Info Header */}
          {activeGroup === "Consent" && (
            <div className="item-consent-tab-header">
              <div className="consent-tab-info">
                <strong>Consent &amp; Legal Disclaimer Checkboxes</strong>
                <p>Visitors see these checkboxes before downloading content. Customize disclaimer wording, toggle mandatory rules, or add custom checkboxes.</p>
              </div>
              <button
                type="button"
                className="btn-add-checkbox-sm"
                onClick={openAddCheckboxModal}
              >
                ☑️ + Add Another Checkbox
              </button>
            </div>
          )}

          {/* Fields List */}
          <div className="item-form-fields-list">
            {filteredEntries.length === 0 ? (
              <div className="item-fields-empty">
                <p>No fields found in &quot;{activeGroup}&quot; group.</p>
                {activeGroup === "Consent" ? (
                  <button
                    type="button"
                    className="btn-add-checkbox-action"
                    onClick={openAddCheckboxModal}
                  >
                    ☑️ Add New Checkbox
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn-add-field-action"
                    onClick={openAddFieldModal}
                  >
                    ➕ Add New Field
                  </button>
                )}
              </div>
            ) : (
              filteredEntries.map(([key, fConfig]) => {
                const icon = getFieldIcon(fConfig);
                const typeBadge = getFieldTypeBadge(fConfig.type || STANDARD_METADATA[key]?.type);
                const groupName = fConfig.group || STANDARD_METADATA[key]?.group || "General";
                const hint = fConfig.hint || STANDARD_METADATA[key]?.hint || "";
                const isConsentCheckbox =
                  fConfig.type === "checkbox" || key.startsWith("optIn") || groupName === "Consent";

                return (
                  <div
                    key={key}
                    className={`item-field-row ${isConsentCheckbox ? "is-consent-row" : ""} ${!fConfig.enabled ? "is-disabled" : ""}`}
                  >
                    <div className="field-info-col">
                      <span className="field-icon">{icon}</span>
                      <div className="field-labels" style={{ width: "100%" }}>
                        <div className="field-title-line">
                          {isConsentCheckbox ? (
                            <strong className="field-consent-heading">
                              {key === "optInMarketing"
                                ? "Checkbox 1: Sponsoring Suppliers Opt-in Disclaimer"
                                : key === "optInPartner"
                                ? "Checkbox 2: Partner Data Sharing Consent Disclaimer"
                                : fConfig.placeholder || "Consent Checkbox Disclaimer"}
                            </strong>
                          ) : (
                            <input
                              type="text"
                              className="field-label-edit"
                              value={fConfig.label}
                              onChange={(e) => handleLabelChange(key, e.target.value)}
                              placeholder={STANDARD_METADATA[key]?.label || fConfig.label}
                              disabled={!fConfig.enabled}
                            />
                          )}
                          <span className="field-type-pill">{typeBadge}</span>
                          {fConfig.isCustom && <span className="field-custom-pill">CUSTOM</span>}
                        </div>

                        {isConsentCheckbox && (
                          <>
                            <textarea
                              className="field-disclaimer-textarea"
                              value={fConfig.label}
                              onChange={(e) => handleLabelChange(key, e.target.value)}
                              placeholder="Type or paste exact legal consent disclaimer shown to visitors..."
                              disabled={!fConfig.enabled}
                              rows={2}
                            />
                            <div className="disclaimer-template-row">
                              <span className="template-label">⚡ Templates:</span>
                              <button
                                type="button"
                                className="btn-disclaimer-pill"
                                onClick={() =>
                                  handleLabelChange(
                                    key,
                                    key === "optInMarketing"
                                      ? "I would like to receive information from suppliers sponsoring this content and willing to share the information above with OnDot Media."
                                      : "By checking this box, I agree that OnDot Media can share my data with Partners so that Partners can contact me by email or phone and provide more information about this content."
                                  )
                                }
                              >
                                📋 OnDot Media
                              </button>
                              <button
                                type="button"
                                className="btn-disclaimer-pill"
                                onClick={() =>
                                  handleLabelChange(
                                    key,
                                    key === "optInMarketing"
                                      ? "Yes, I would like to subscribe to email and phone updates. GETprospeKt and its group partners would love to stay in touch to keep you updated on solutions, research, exclusive offers, and events."
                                      : "By checking this box, I agree that GETprospeKt can share my contact data with partners so that partners can contact me by email or phone and provide more information about this content."
                                  )
                                }
                              >
                                📋 GETprospeKt
                              </button>
                              <button
                                type="button"
                                className="btn-disclaimer-pill"
                                onClick={() =>
                                  handleLabelChange(
                                    key,
                                    key === "optInMarketing"
                                      ? "I would like to receive information from suppliers sponsoring this content and willing to share my contact information above."
                                      : "By checking this box, I agree that content partners can contact me by email or phone and provide more information about this publication."
                                  )
                                }
                              >
                                📋 Co-Sponsor
                              </button>
                            </div>
                          </>
                        )}

                        <small className="field-group-hint">
                          {groupName}
                          {hint ? ` · ${hint}` : ""}
                          {fConfig.placeholder && !isConsentCheckbox ? ` · Placeholder: "${fConfig.placeholder}"` : ""}
                          {fConfig.type === "select" && fConfig.options?.length
                            ? ` · ${fConfig.options.length} options`
                            : ""}
                        </small>
                      </div>
                    </div>

                    <div className="field-toggles-col">
                      <label className="toggle-switch-label" title="Show or hide this field in the form">
                        <input
                          type="checkbox"
                          checked={fConfig.enabled}
                          onChange={() => handleToggleEnabled(key)}
                        />
                        <span className="toggle-text">
                          {fConfig.enabled ? "✅ Visible" : "Hidden"}
                        </span>
                      </label>

                      <label
                        className={`toggle-switch-label req-toggle ${
                          !fConfig.enabled ? "is-locked" : ""
                        }`}
                        title="Make this field mandatory before submission"
                      >
                        <input
                          type="checkbox"
                          checked={fConfig.required && fConfig.enabled}
                          disabled={!fConfig.enabled}
                          onChange={() => handleToggleRequired(key)}
                        />
                        <span className="toggle-text req">
                          {fConfig.required && fConfig.enabled ? "🔴 Required" : "Optional"}
                        </span>
                      </label>

                      <button
                        type="button"
                        className="btn-field-edit"
                        onClick={() => openEditModal(fConfig)}
                        title={`Edit field "${fConfig.label}"`}
                      >
                        ✏️ Edit
                      </button>

                      <button
                        type="button"
                        className="btn-field-delete"
                        onClick={() => setFieldToDelete(fConfig)}
                        title={`Delete field "${fConfig.label}"`}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Modal Actions */}
          <div className="item-form-actions-bar">
            <button
              type="button"
              className="btn-modal-cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn-modal-save">
              💾 Save Form Controls for This {itemTypeLabel}
            </button>
          </div>
        </form>

        {/* SUBMODAL: ADD NEW FIELD */}
        {isAddFieldOpen && (
          <div className="item-submodal-backdrop" onClick={() => setIsAddFieldOpen(false)}>
            <div className="item-submodal-box" onClick={(e) => e.stopPropagation()}>
              <div className="item-submodal-header">
                <div>
                  <h3 className="submodal-title">
                    {newField.type === "checkbox" ? "☑️ Add New Checkbox" : "➕ Add New Field"}
                  </h3>
                  <p className="submodal-subtitle">
                    {newField.type === "checkbox"
                      ? `Add a consent, opt-in, or legal disclaimer checkbox to this ${itemTypeLabel}'s visitor form.`
                      : `Add a custom field to this ${itemTypeLabel}'s visitor form.`}
                  </p>
                </div>
                <button
                  type="button"
                  className="submodal-close-btn"
                  onClick={() => setIsAddFieldOpen(false)}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateField} className="item-submodal-body">
                {/* Field Type Quick Selector */}
                <div className="submodal-quick-type-selector">
                  <label className="submodal-label">Choose What to Add:</label>
                  <div className="quick-type-buttons">
                    <button
                      type="button"
                      className={`btn-type-pill ${newField.type === "checkbox" ? "active" : ""}`}
                      onClick={() =>
                        setNewField({
                          ...newField,
                          type: "checkbox",
                          group: "Consent",
                        })
                      }
                    >
                      ☑️ Consent Checkbox
                    </button>
                    <button
                      type="button"
                      className={`btn-type-pill ${newField.type === "text" ? "active" : ""}`}
                      onClick={() =>
                        setNewField({
                          ...newField,
                          type: "text",
                          group: newField.group === "Consent" ? "Custom" : newField.group,
                        })
                      }
                    >
                      📝 Text Field
                    </button>
                    <button
                      type="button"
                      className={`btn-type-pill ${newField.type === "select" ? "active" : ""}`}
                      onClick={() =>
                        setNewField({
                          ...newField,
                          type: "select",
                          group: newField.group === "Consent" ? "Custom" : newField.group,
                        })
                      }
                    >
                      📋 Dropdown Select
                    </button>
                    <button
                      type="button"
                      className={`btn-type-pill ${newField.type === "textarea" ? "active" : ""}`}
                      onClick={() =>
                        setNewField({
                          ...newField,
                          type: "textarea",
                          group: newField.group === "Consent" ? "Custom" : newField.group,
                        })
                      }
                    >
                      📄 Textarea
                    </button>
                  </div>
                </div>

                {/* Field Label / Disclaimer */}
                <div className="submodal-field-group">
                  <label className="submodal-label">
                    {newField.type === "checkbox" ? "Checkbox Disclaimer / Opt-in Text *" : "Field Label *"}
                  </label>
                  {newField.type === "checkbox" ? (
                    <>
                      <textarea
                        required
                        className="submodal-input submodal-textarea"
                        rows={3}
                        value={newField.label}
                        onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                        placeholder="Type exact legal disclaimer..."
                      />
                      <div className="submodal-disclaimer-quick">
                        <button
                          type="button"
                          className="btn-quick-disclaimer"
                          onClick={() =>
                            setNewField({
                              ...newField,
                              label:
                                "I would like to receive information from suppliers sponsoring this content and willing to share the information above with OnDot Media.",
                            })
                          }
                        >
                          📋 Template: Sponsor Opt-in
                        </button>
                        <button
                          type="button"
                          className="btn-quick-disclaimer"
                          onClick={() =>
                            setNewField({
                              ...newField,
                              label:
                                "By checking this box, I agree that OnDot Media can share my data with Partners so that Partners can contact me by email or phone and provide more information about this content.",
                            })
                          }
                        >
                          📋 Template: Partner Data Sharing
                        </button>
                        <button
                          type="button"
                          className="btn-quick-disclaimer"
                          onClick={() =>
                            setNewField({
                              ...newField,
                              label:
                                "I consent to sharing my contact details with co-sponsoring technology partners for relevant product insights and follow-up communications.",
                            })
                          }
                        >
                          📋 Template: Co-Sponsor Consent
                        </button>
                        <button
                          type="button"
                          className="btn-quick-disclaimer"
                          onClick={() =>
                            setNewField({
                              ...newField,
                              label:
                                "I agree to the Terms of Service and understand my data will be processed in accordance with the Privacy Policy.",
                            })
                          }
                        >
                          📋 Template: Terms &amp; Privacy
                        </button>
                      </div>
                    </>
                  ) : (
                    <input
                      type="text"
                      required
                      className="submodal-input"
                      value={newField.label}
                      onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                      placeholder="e.g. Department, LinkedIn Profile, Budget Tier"
                      autoFocus
                    />
                  )}
                </div>

                {/* Grid: Type & Group */}
                <div className="submodal-grid-2">
                  <div className="submodal-field-group">
                    <label className="submodal-label">Field Type</label>
                    <select
                      className="submodal-select"
                      value={newField.type}
                      onChange={(e) =>
                        setNewField({
                          ...newField,
                          type: (e.target.value as NonNullable<FormFieldSetting["type"]>) || "text",
                          group: e.target.value === "checkbox" ? "Consent" : newField.group,
                        })
                      }
                    >
                      <option value="checkbox">Checkbox (Consent / Opt-in)</option>
                      <option value="text">Text (Single-line)</option>
                      <option value="email">Email Address</option>
                      <option value="tel">Phone / Telephone</option>
                      <option value="number">Numeric</option>
                      <option value="select">Dropdown / Select</option>
                      <option value="textarea">Textarea (Multi-line)</option>
                    </select>
                  </div>

                  <div className="submodal-field-group">
                    <label className="submodal-label">Category Group</label>
                    <select
                      className="submodal-select"
                      value={newField.group}
                      onChange={(e) => setNewField({ ...newField, group: e.target.value })}
                    >
                      <option value="Consent">Consent</option>
                      <option value="Custom">Custom</option>
                      <option value="Identity">Identity</option>
                      <option value="Contact">Contact</option>
                      <option value="Company">Company</option>
                      <option value="Location">Location</option>
                    </select>
                  </div>
                </div>

                {/* Placeholder (only for non-checkbox) */}
                {newField.type !== "checkbox" && (
                  <div className="submodal-field-group">
                    <label className="submodal-label">
                      Placeholder Text <span className="submodal-opt">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      className="submodal-input"
                      value={newField.placeholder}
                      onChange={(e) => setNewField({ ...newField, placeholder: e.target.value })}
                      placeholder="e.g. Enter placeholder text"
                    />
                  </div>
                )}

                {/* Dropdown Options if Select */}
                {newField.type === "select" && (
                  <div className="submodal-field-group">
                    <label className="submodal-label">
                      Dropdown Choices <span className="req-star">*</span>
                    </label>
                    <span className="submodal-hint-text">
                      Enter options separated by commas or each on a new line:
                    </span>
                    <textarea
                      rows={3}
                      className="submodal-textarea"
                      value={newField.optionsString}
                      onChange={(e) =>
                        setNewField({ ...newField, optionsString: e.target.value })
                      }
                      placeholder="e.g. Engineering, Sales, Marketing, Executive, Other"
                    />
                  </div>
                )}

                {/* Behavior & Validation Card */}
                <div className="submodal-behavior-card">
                  <span className="submodal-behavior-title">Field Settings &amp; Rules</span>
                  
                  <label className="submodal-toggle-row">
                    <div className="toggle-info">
                      <strong>👁️ Visible in Form</strong>
                      <span>Display this field to visitors when downloading this {itemTypeLabel}</span>
                    </div>
                    <input
                      type="checkbox"
                      className="submodal-checkbox"
                      checked={newField.enabled}
                      onChange={(e) => setNewField({ ...newField, enabled: e.target.checked })}
                    />
                  </label>

                  <label className="submodal-toggle-row">
                    <div className="toggle-info">
                      <strong style={{ color: newField.required ? "#F87171" : "#E2E8F0" }}>
                        🔴 Required / Mandatory
                      </strong>
                      <span>Visitor must complete this field before the document download starts</span>
                    </div>
                    <input
                      type="checkbox"
                      className="submodal-checkbox"
                      checked={newField.required}
                      onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
                    />
                  </label>
                </div>

                <div className="submodal-actions">
                  <button
                    type="button"
                    className="btn-submodal-cancel"
                    onClick={() => setIsAddFieldOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-submodal-submit">
                    {newField.type === "checkbox" ? "☑️ Add Checkbox to Form" : "➕ Add Field to Form"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* SUBMODAL: EDIT FIELD */}
        {editDraft && (
          <div className="item-submodal-backdrop" onClick={() => setEditDraft(null)}>
            <div className="item-submodal-box" onClick={(e) => e.stopPropagation()}>
              <div className="item-submodal-header">
                <div>
                  <h3 className="submodal-title">✏️ Edit Field: &quot;{editDraft.label}&quot;</h3>
                  <p className="submodal-subtitle">Modify field label, input type, choices, and rules.</p>
                </div>
                <button
                  type="button"
                  className="submodal-close-btn"
                  onClick={() => setEditDraft(null)}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="item-submodal-body">
                {/* Field Label */}
                <div className="submodal-field-group">
                  <label className="submodal-label">
                    {editDraft.type === "checkbox" ? "Checkbox Legal Disclaimer Text *" : "Field Label *"}
                  </label>
                  {editDraft.type === "checkbox" ? (
                    <>
                      <textarea
                        required
                        className="submodal-input submodal-textarea"
                        rows={3}
                        value={editDraft.label}
                        onChange={(e) => setEditDraft({ ...editDraft, label: e.target.value })}
                        placeholder="Type exact legal disclaimer..."
                      />
                      <div className="submodal-disclaimer-quick">
                        <button
                          type="button"
                          className="btn-quick-disclaimer"
                          onClick={() =>
                            setEditDraft({
                              ...editDraft,
                              label:
                                "I would like to receive information from suppliers sponsoring this content and willing to share the information above with OnDot Media.",
                            })
                          }
                        >
                          📋 Template: Sponsor Opt-in
                        </button>
                        <button
                          type="button"
                          className="btn-quick-disclaimer"
                          onClick={() =>
                            setEditDraft({
                              ...editDraft,
                              label:
                                "By checking this box, I agree that OnDot Media can share my data with Partners so that Partners can contact me by email or phone and provide more information about this content.",
                            })
                          }
                        >
                          📋 Template: Partner Data Sharing
                        </button>
                      </div>
                    </>
                  ) : (
                    <input
                      type="text"
                      required
                      className="submodal-input"
                      value={editDraft.label}
                      onChange={(e) => setEditDraft({ ...editDraft, label: e.target.value })}
                    />
                  )}
                </div>

                {/* Grid: Type & Group */}
                <div className="submodal-grid-2">
                  <div className="submodal-field-group">
                    <label className="submodal-label">Field Type</label>
                    <select
                      className="submodal-select"
                      value={editDraft.type}
                      onChange={(e) =>
                        setEditDraft({
                          ...editDraft,
                          type: (e.target.value as NonNullable<FormFieldSetting["type"]>) || "text",
                        })
                      }
                    >
                      <option value="text">Text (Single-line)</option>
                      <option value="email">Email Address</option>
                      <option value="tel">Phone / Telephone</option>
                      <option value="number">Numeric</option>
                      <option value="select">Dropdown / Select</option>
                      <option value="textarea">Textarea (Multi-line)</option>
                      <option value="checkbox">Checkbox (Consent / Opt-in)</option>
                    </select>
                  </div>

                  <div className="submodal-field-group">
                    <label className="submodal-label">Category Group</label>
                    <select
                      className="submodal-select"
                      value={editDraft.group}
                      onChange={(e) => setEditDraft({ ...editDraft, group: e.target.value })}
                    >
                      <option value="Custom">Custom</option>
                      <option value="Identity">Identity</option>
                      <option value="Contact">Contact</option>
                      <option value="Company">Company</option>
                      <option value="Location">Location</option>
                      <option value="Consent">Consent</option>
                    </select>
                  </div>
                </div>

                {/* Placeholder */}
                <div className="submodal-field-group">
                  <label className="submodal-label">
                    Placeholder Text <span className="submodal-opt">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    className="submodal-input"
                    value={editDraft.placeholder}
                    onChange={(e) => setEditDraft({ ...editDraft, placeholder: e.target.value })}
                    placeholder="e.g. Enter placeholder text"
                  />
                </div>

                {/* Dropdown Options if Select */}
                {editDraft.type === "select" && (
                  <div className="submodal-field-group">
                    <label className="submodal-label">
                      Dropdown Choices <span className="req-star">*</span>
                    </label>
                    <span className="submodal-hint-text">
                      Enter options separated by commas or each on a new line:
                    </span>
                    <textarea
                      rows={3}
                      className="submodal-textarea"
                      value={editDraft.optionsString}
                      onChange={(e) =>
                        setEditDraft({ ...editDraft, optionsString: e.target.value })
                      }
                      placeholder="e.g. Option 1, Option 2, Option 3"
                    />
                  </div>
                )}

                {/* Behavior & Validation Card */}
                <div className="submodal-behavior-card">
                  <span className="submodal-behavior-title">Field Settings &amp; Rules</span>

                  <label className="submodal-toggle-row">
                    <div className="toggle-info">
                      <strong>👁️ Visible in Form</strong>
                      <span>Display this field to visitors when downloading this {itemTypeLabel}</span>
                    </div>
                    <input
                      type="checkbox"
                      className="submodal-checkbox"
                      checked={editDraft.enabled}
                      onChange={(e) => setEditDraft({ ...editDraft, enabled: e.target.checked })}
                    />
                  </label>

                  <label className="submodal-toggle-row">
                    <div className="toggle-info">
                      <strong style={{ color: editDraft.required ? "#F87171" : "#E2E8F0" }}>
                        🔴 Required / Mandatory
                      </strong>
                      <span>Visitor must complete this field before the document download starts</span>
                    </div>
                    <input
                      type="checkbox"
                      className="submodal-checkbox"
                      checked={editDraft.required}
                      onChange={(e) => setEditDraft({ ...editDraft, required: e.target.checked })}
                    />
                  </label>
                </div>

                <div className="submodal-actions">
                  <button
                    type="button"
                    className="btn-submodal-cancel"
                    onClick={() => setEditDraft(null)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-submodal-submit">
                    💾 Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* SUBMODAL: CONFIRM DELETE */}
        {fieldToDelete && (
          <div className="item-submodal-backdrop" onClick={() => setFieldToDelete(null)}>
            <div className="item-submodal-box modal-danger-box" onClick={(e) => e.stopPropagation()}>
              <div className="item-submodal-header">
                <div>
                  <h3 className="submodal-title" style={{ color: "#EF4444" }}>🗑️ Delete Field</h3>
                  <p className="submodal-subtitle">Are you sure you want to delete this field?</p>
                </div>
                <button
                  type="button"
                  className="submodal-close-btn"
                  onClick={() => setFieldToDelete(null)}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              <div className="item-submodal-body">
                <p style={{ color: "#FFFFFF", fontSize: "14px", lineHeight: "1.5", margin: "0 0 8px" }}>
                  Are you sure you want to remove <strong>&quot;{fieldToDelete.label}&quot;</strong> from this form?
                </p>
                <p style={{ color: "#94A3B8", fontSize: "12px", margin: "0 0 20px" }}>
                  This field will be deleted and will no longer appear when visitors download this {itemTypeLabel}.
                </p>

                <div className="submodal-actions">
                  <button
                    type="button"
                    className="btn-submodal-cancel"
                    onClick={() => setFieldToDelete(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn-submodal-delete"
                    onClick={confirmDeleteField}
                  >
                    🗑️ Yes, Delete Field
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Styles */}
        <style>{`
          .item-form-modal-backdrop {
            position: fixed;
            inset: 0;
            background: rgba(3, 7, 18, 0.85);
            backdrop-filter: blur(8px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 99999;
            padding: 20px;
            overflow-y: auto;
          }

          .item-form-modal-box {
            background: #0B1220;
            border: 1.5px solid rgba(0, 210, 255, 0.35);
            border-radius: 14px;
            width: 100%;
            max-width: 900px;
            max-height: 92vh;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(0, 70, 252, 0.2);
            animation: ifmFadeIn 0.25s ease-out;
          }

          @keyframes ifmFadeIn {
            from { opacity: 0; transform: scale(0.97); }
            to { opacity: 1; transform: scale(1); }
          }

          .item-form-modal-header {
            padding: 18px 24px;
            border-bottom: 1px solid rgba(203, 213, 225, 0.12);
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            background: #070D18;
          }

          .item-form-header-title-row {
            display: flex;
            align-items: center;
            gap: 18px;
            flex-wrap: wrap;
          }

          .item-form-modal-header h2 {
            font-size: 20px;
            font-weight: 800;
            color: #FFFFFF;
          }

          .item-form-header-actions {
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .btn-add-field-action {
            background: linear-gradient(135deg, #00D2FF, #0046FC);
            border: none;
            color: #FFFFFF;
            padding: 6px 14px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 800;
            cursor: pointer;
            box-shadow: 0 2px 10px rgba(0, 210, 255, 0.3);
            transition: all 0.2s;
          }

          .btn-add-field-action:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 14px rgba(0, 210, 255, 0.5);
          }

          .btn-restore-fields-action {
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid rgba(203, 213, 225, 0.2);
            color: #94A3B8;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 11.5px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s;
          }

          .btn-restore-fields-action:hover {
            background: rgba(255, 255, 255, 0.12);
            color: #FFFFFF;
          }

          .item-form-close-btn {
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid rgba(255, 255, 255, 0.15);
            color: #CBD5E1;
            font-size: 16px;
            width: 32px;
            height: 32px;
            border-radius: 6px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
          }

          .item-form-close-btn:hover {
            background: rgba(239, 68, 68, 0.2);
            color: #EF4444;
            border-color: rgba(239, 68, 68, 0.4);
          }

          .item-form-presets-bar {
            padding: 12px 24px;
            background: rgba(0, 70, 252, 0.08);
            border-bottom: 1px solid rgba(203, 213, 225, 0.1);
            display: flex;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
          }

          .presets-label {
            font-size: 11px;
            font-weight: 800;
            color: #00D2FF;
            letter-spacing: 0.05em;
          }

          .preset-btn {
            background: #0B1426;
            border: 1px solid rgba(0, 210, 255, 0.3);
            color: #E2E8F0;
            padding: 5px 12px;
            border-radius: 6px;
            font-size: 11.5px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s;
          }

          .preset-btn:hover {
            background: #0046FC;
            color: #FFFFFF;
            border-color: #0046FC;
          }

          .presets-stat {
            margin-left: auto;
            font-size: 11.5px;
            color: #94A3B8;
          }

          .presets-stat strong {
            color: #00D2FF;
          }

          .item-form-modal-body {
            padding: 20px 24px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 16px;
          }

          .item-form-text-custom-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 12px;
            background: #070D18;
            padding: 14px;
            border: 1px solid rgba(203, 213, 225, 0.1);
            border-radius: 8px;
          }

          @media (max-width: 768px) {
            .item-form-text-custom-grid {
              grid-template-columns: 1fr;
            }
          }

          .form-subfield label {
            display: block;
            font-size: 11px;
            font-weight: 700;
            color: #CBD5E1;
            margin-bottom: 5px;
            text-transform: uppercase;
            letter-spacing: 0.04em;
          }

          .form-subfield input {
            width: 100%;
            padding: 8px 10px;
            background: #0B1220;
            border: 1px solid rgba(203, 213, 225, 0.2);
            border-radius: 6px;
            color: #FFFFFF;
            font-size: 12px;
          }

          .item-form-consent-banner {
            background: linear-gradient(135deg, rgba(0, 70, 252, 0.12) 0%, rgba(0, 210, 255, 0.08) 100%);
            border: 1px solid rgba(0, 210, 255, 0.3);
            border-radius: 8px;
            padding: 10px 14px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            flex-wrap: wrap;
          }

          .consent-banner-text {
            display: flex;
            align-items: center;
            gap: 10px;
            color: #CBD5E1;
            font-size: 12px;
          }

          .consent-banner-text strong {
            color: #00D2FF;
          }

          .consent-icon {
            font-size: 18px;
          }

          .consent-banner-actions {
            display: flex;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
          }

          .btn-banner-add-checkbox {
            background: rgba(16, 185, 129, 0.15);
            border: 1px solid rgba(16, 185, 129, 0.4);
            color: #34D399;
            padding: 6px 14px;
            border-radius: 6px;
            font-size: 11.5px;
            font-weight: 800;
            cursor: pointer;
            transition: all 0.2s ease;
            display: inline-flex;
            align-items: center;
            gap: 5px;
          }

          .btn-banner-add-checkbox:hover {
            background: #10B981;
            color: #040914;
            border-color: #10B981;
            transform: translateY(-1px);
          }

          .btn-apply-ondot-banner {
            background: #0046FC;
            color: #FFFFFF;
            border: 0;
            padding: 6px 14px;
            border-radius: 6px;
            font-size: 11.5px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 2px 8px rgba(0, 70, 252, 0.35);
          }

          .btn-apply-ondot-banner:hover {
            background: #0038D1;
            transform: translateY(-1px);
          }

          .item-field-row.is-consent-row {
            border-color: rgba(0, 210, 255, 0.25);
            background: rgba(13, 21, 34, 0.85);
            padding: 12px 14px;
          }

          .field-consent-heading {
            font-size: 12.5px;
            font-weight: 700;
            color: #00D2FF;
          }

          .field-disclaimer-textarea {
            width: 100%;
            background: #0B1220;
            border: 1px solid rgba(203, 213, 225, 0.2);
            border-radius: 6px;
            padding: 8px 10px;
            color: #FFFFFF;
            font-size: 12px;
            line-height: 1.45;
            resize: vertical;
            margin-top: 4px;
            font-family: inherit;
            outline: none;
            transition: border-color 0.2s;
            box-sizing: border-box;
          }

          .field-disclaimer-textarea:focus {
            border-color: #00D2FF;
          }

          .disclaimer-template-row {
            display: flex;
            align-items: center;
            gap: 6px;
            margin-top: 4px;
            flex-wrap: wrap;
          }

          .template-label {
            font-size: 10.5px;
            color: #94A3B8;
            font-weight: 700;
          }

          .btn-disclaimer-pill {
            background: rgba(0, 210, 255, 0.08);
            border: 1px solid rgba(0, 210, 255, 0.25);
            color: #00D2FF;
            font-size: 10.5px;
            font-weight: 700;
            padding: 2px 8px;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.15s ease;
          }

          .btn-disclaimer-pill:hover {
            background: rgba(0, 210, 255, 0.2);
            border-color: #00D2FF;
            color: #FFFFFF;
          }

          .submodal-disclaimer-quick {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-top: 6px;
            flex-wrap: wrap;
          }

          .btn-quick-disclaimer {
            background: rgba(0, 210, 255, 0.1);
            border: 1px solid rgba(0, 210, 255, 0.3);
            color: #00D2FF;
            font-size: 11px;
            font-weight: 700;
            padding: 4px 10px;
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.2s;
          }

          .btn-quick-disclaimer:hover {
            background: #00D2FF;
            color: #070D18;
          }

          .item-form-group-tabs-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            border-bottom: 1px solid rgba(203, 213, 225, 0.1);
            padding-bottom: 8px;
            flex-wrap: wrap;
          }

          .item-form-group-tabs {
            display: flex;
            gap: 6px;
            flex-wrap: wrap;
          }

          .group-tab {
            background: #070D18;
            border: 1px solid rgba(203, 213, 225, 0.15);
            color: #94A3B8;
            padding: 5px 12px;
            border-radius: 6px;
            font-size: 11.5px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s;
          }

          .group-tab:hover {
            color: #FFFFFF;
            border-color: rgba(0, 210, 255, 0.35);
          }

          .group-tab.active {
            background: #0046FC;
            color: #FFFFFF;
            border-color: #0046FC;
          }

          .item-form-add-actions {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .btn-add-checkbox-sm {
            background: rgba(16, 185, 129, 0.14);
            border: 1px solid rgba(16, 185, 129, 0.4);
            color: #34D399;
            padding: 5px 12px;
            border-radius: 6px;
            font-size: 11.5px;
            font-weight: 800;
            cursor: pointer;
            transition: all 0.2s;
            display: inline-flex;
            align-items: center;
            gap: 4px;
          }

          .btn-add-checkbox-sm:hover {
            background: #10B981;
            color: #040914;
            border-color: #10B981;
          }

          .btn-add-field-sm {
            background: rgba(0, 210, 255, 0.12);
            border: 1px solid rgba(0, 210, 255, 0.35);
            color: #00D2FF;
            padding: 5px 12px;
            border-radius: 6px;
            font-size: 11.5px;
            font-weight: 800;
            cursor: pointer;
            transition: all 0.2s;
          }

          .btn-add-field-sm:hover {
            background: #00D2FF;
            color: #070D18;
          }

          .item-consent-tab-header {
            background: rgba(16, 185, 129, 0.08);
            border: 1px solid rgba(16, 185, 129, 0.25);
            border-radius: 8px;
            padding: 12px 16px;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            flex-wrap: wrap;
          }

          .consent-tab-info strong {
            display: block;
            font-size: 13px;
            color: #34D399;
            margin-bottom: 2px;
          }

          .consent-tab-info p {
            margin: 0;
            font-size: 11.5px;
            color: #94A3B8;
            line-height: 1.4;
          }

          .btn-add-checkbox-action {
            background: rgba(16, 185, 129, 0.15);
            border: 1px solid rgba(16, 185, 129, 0.4);
            color: #34D399;
            padding: 8px 16px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 800;
            cursor: pointer;
            transition: all 0.2s;
          }

          .btn-add-checkbox-action:hover {
            background: #10B981;
            color: #040914;
          }

          .item-form-fields-list {
            display: flex;
            flex-direction: column;
            gap: 8px;
            max-height: 440px;
            overflow-y: auto;
            padding-right: 4px;
          }

          .item-fields-empty {
            padding: 30px;
            text-align: center;
            background: #070D18;
            border: 1px dashed rgba(203, 213, 225, 0.15);
            border-radius: 8px;
            color: #94A3B8;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 12px;
          }

          .item-field-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            padding: 10px 14px;
            background: #070D18;
            border: 1px solid rgba(203, 213, 225, 0.12);
            border-radius: 8px;
            transition: all 0.2s;
          }

          .item-field-row.is-disabled {
            opacity: 0.5;
            background: rgba(7, 13, 24, 0.4);
          }

          .field-info-col {
            display: flex;
            align-items: center;
            gap: 12px;
            flex: 1;
            min-width: 0;
          }

          .field-icon {
            font-size: 18px;
            flex-shrink: 0;
          }

          .field-labels {
            display: flex;
            flex-direction: column;
            gap: 3px;
            flex: 1;
            min-width: 0;
          }

          .field-title-line {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-wrap: wrap;
          }

          .field-label-edit {
            background: transparent;
            border: 1px solid transparent;
            color: #FFFFFF;
            font-size: 13.5px;
            font-weight: 700;
            padding: 2px 6px;
            border-radius: 4px;
            width: auto;
            max-width: 250px;
            transition: all 0.2s;
          }

          .field-label-edit:focus {
            background: #0B1220;
            border-color: #00D2FF;
            outline: none;
          }

          .field-type-pill {
            font-size: 9.5px;
            font-weight: 800;
            padding: 2px 6px;
            border-radius: 4px;
            background: rgba(0, 210, 255, 0.1);
            color: #00D2FF;
            border: 1px solid rgba(0, 210, 255, 0.25);
            letter-spacing: 0.05em;
          }

          .field-custom-pill {
            font-size: 9.5px;
            font-weight: 800;
            padding: 2px 6px;
            border-radius: 4px;
            background: rgba(168, 85, 247, 0.15);
            color: #C084FC;
            border: 1px solid rgba(168, 85, 247, 0.35);
            letter-spacing: 0.05em;
          }

          .field-group-hint {
            font-size: 11px;
            color: #64748B;
            padding-left: 6px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .field-toggles-col {
            display: flex;
            align-items: center;
            gap: 10px;
            flex-shrink: 0;
          }

          .toggle-switch-label {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            font-size: 11.5px;
            font-weight: 700;
            cursor: pointer;
            user-select: none;
          }

          .toggle-text {
            color: #CBD5E1;
          }

          .toggle-switch-label.req-toggle .toggle-text.req {
            color: #F87171;
          }

          .toggle-switch-label.is-locked {
            opacity: 0.35;
            cursor: not-allowed;
          }

          .btn-field-edit {
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid rgba(255, 255, 255, 0.15);
            color: #CBD5E1;
            padding: 4px 9px;
            border-radius: 5px;
            font-size: 11.5px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s;
          }

          .btn-field-edit:hover {
            background: rgba(0, 210, 255, 0.15);
            color: #00D2FF;
            border-color: rgba(0, 210, 255, 0.35);
          }

          .btn-field-delete {
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.25);
            color: #F87171;
            padding: 4px 9px;
            border-radius: 5px;
            font-size: 11.5px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s;
          }

          .btn-field-delete:hover {
            background: rgba(239, 68, 68, 0.25);
            color: #EF4444;
            border-color: #EF4444;
          }

          .item-form-actions-bar {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            gap: 12px;
            padding-top: 14px;
            border-top: 1px solid rgba(203, 213, 225, 0.1);
          }

          .btn-modal-cancel {
            padding: 9px 18px;
            background: #1E293B;
            border: 1px solid rgba(203, 213, 225, 0.2);
            border-radius: 6px;
            color: #CBD5E1;
            font-size: 12px;
            font-weight: 700;
            cursor: pointer;
          }

          .btn-modal-cancel:hover {
            color: #FFFFFF;
            background: #334155;
          }

          .btn-modal-save {
            padding: 9px 22px;
            background: #0046FC;
            border: none;
            border-radius: 6px;
            color: #FFFFFF;
            font-size: 12px;
            font-weight: 800;
            cursor: pointer;
            box-shadow: 0 4px 14px rgba(0, 70, 252, 0.4);
            transition: all 0.2s;
          }

          .btn-modal-save:hover {
            background: #0038D1;
            transform: translateY(-1px);
          }

          /* Submodal overlay styles */
          .item-submodal-backdrop {
            position: fixed;
            inset: 0;
            background: rgba(3, 7, 18, 0.85);
            backdrop-filter: blur(8px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 100000;
            padding: 20px;
            animation: ifmFadeIn 0.2s ease-out;
          }

          .item-submodal-box {
            background: #0B1220;
            border: 1.5px solid rgba(0, 210, 255, 0.35);
            border-radius: 12px;
            width: 100%;
            max-width: 540px;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 70, 252, 0.25);
          }

          .item-submodal-box.modal-danger-box {
            border-color: rgba(239, 68, 68, 0.45);
            box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(239, 68, 68, 0.25);
          }

          .item-submodal-header {
            padding: 18px 24px;
            border-bottom: 1px solid rgba(203, 213, 225, 0.12);
            background: #070D18;
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 16px;
          }

          .submodal-title {
            margin: 0;
            font-size: 16px;
            font-weight: 800;
            color: #FFFFFF;
          }

          .submodal-subtitle {
            margin: 4px 0 0;
            font-size: 12px;
            color: #94A3B8;
            line-height: 1.4;
          }

          .submodal-close-btn {
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid rgba(255, 255, 255, 0.15);
            color: #CBD5E1;
            font-size: 14px;
            width: 28px;
            height: 28px;
            border-radius: 6px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            transition: all 0.2s;
          }

          .submodal-close-btn:hover {
            background: rgba(239, 68, 68, 0.2);
            color: #EF4444;
            border-color: rgba(239, 68, 68, 0.4);
          }

          .item-submodal-body {
            padding: 22px 24px;
            display: flex;
            flex-direction: column;
            gap: 16px;
          }

          .submodal-quick-type-selector {
            background: #060B14;
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 8px;
            padding: 12px;
          }

          .quick-type-buttons {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
            margin-top: 6px;
          }

          .btn-type-pill {
            background: #0B1324;
            border: 1px solid rgba(255, 255, 255, 0.12);
            color: #94A3B8;
            padding: 7px 12px;
            border-radius: 6px;
            font-size: 11.5px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .btn-type-pill:hover {
            border-color: #00D2FF;
            color: #FFFFFF;
          }

          .btn-type-pill.active {
            background: #0046FC;
            border-color: #00D2FF;
            color: #FFFFFF;
            box-shadow: 0 0 10px rgba(0, 210, 255, 0.25);
          }

          .submodal-field-group {
            display: flex;
            flex-direction: column;
            gap: 6px;
          }

          .submodal-label {
            font-size: 11px;
            font-weight: 800;
            color: #94A3B8;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            display: flex;
            align-items: center;
            gap: 4px;
          }

          .submodal-opt {
            font-size: 10px;
            color: #64748B;
            font-weight: 600;
            text-transform: none;
          }

          .submodal-hint-text {
            font-size: 11px;
            color: #64748B;
            margin-bottom: 2px;
          }

          .submodal-input,
          .submodal-select,
          .submodal-textarea {
            width: 100%;
            background: #070D18 !important;
            border: 1px solid rgba(203, 213, 225, 0.18) !important;
            border-radius: 7px;
            padding: 10px 12px;
            color: #FFFFFF !important;
            font-size: 13px;
            font-family: inherit;
            outline: none;
            transition: border-color 0.2s, box-shadow 0.2s;
            box-sizing: border-box;
          }

          .submodal-input:focus,
          .submodal-select:focus,
          .submodal-textarea:focus {
            border-color: #00D2FF !important;
            box-shadow: 0 0 0 2px rgba(0, 210, 255, 0.2);
          }

          .submodal-select {
            cursor: pointer;
            appearance: none;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394A3B8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 12px center;
            background-size: 14px;
            padding-right: 36px;
          }

          .submodal-select option {
            background: #0B1220;
            color: #FFFFFF;
          }

          .submodal-grid-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 14px;
          }

          @media (max-width: 540px) {
            .submodal-grid-2 {
              grid-template-columns: 1fr;
            }
          }

          .submodal-behavior-card {
            background: #070D18;
            border: 1px solid rgba(203, 213, 225, 0.12);
            border-radius: 8px;
            padding: 14px;
            display: flex;
            flex-direction: column;
            gap: 10px;
          }

          .submodal-behavior-title {
            font-size: 10.5px;
            font-weight: 800;
            color: #00D2FF;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            margin-bottom: 2px;
          }

          .submodal-toggle-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 14px;
            padding: 10px 12px;
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(203, 213, 225, 0.08);
            border-radius: 6px;
            cursor: pointer;
            user-select: none;
            transition: background 0.15s;
          }

          .submodal-toggle-row:hover {
            background: rgba(255, 255, 255, 0.05);
          }

          .toggle-info {
            display: flex;
            flex-direction: column;
            gap: 2px;
          }

          .toggle-info strong {
            font-size: 12.5px;
            color: #FFFFFF;
            font-weight: 700;
          }

          .toggle-info span {
            font-size: 11px;
            color: #64748B;
          }

          .submodal-checkbox {
            width: 18px;
            height: 18px;
            cursor: pointer;
            accent-color: #00D2FF;
          }

          .submodal-actions {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 8px;
            padding-top: 14px;
            border-top: 1px solid rgba(203, 213, 225, 0.1);
          }

          .btn-submodal-cancel {
            padding: 9px 18px;
            background: #1E293B;
            border: 1px solid rgba(203, 213, 225, 0.2);
            border-radius: 6px;
            color: #CBD5E1;
            font-size: 12px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s;
          }

          .btn-submodal-cancel:hover {
            color: #FFFFFF;
            background: #334155;
          }

          .btn-submodal-submit {
            padding: 9px 20px;
            background: linear-gradient(135deg, #00D2FF, #0046FC);
            border: none;
            border-radius: 6px;
            color: #FFFFFF;
            font-size: 12px;
            font-weight: 800;
            cursor: pointer;
            box-shadow: 0 4px 14px rgba(0, 70, 252, 0.4);
            transition: all 0.2s;
          }

          .btn-submodal-submit:hover {
            transform: translateY(-1px);
            box-shadow: 0 6px 18px rgba(0, 70, 252, 0.6);
          }

          .btn-submodal-delete {
            padding: 9px 20px;
            background: #EF4444;
            border: none;
            border-radius: 6px;
            color: #FFFFFF;
            font-size: 12px;
            font-weight: 800;
            cursor: pointer;
            box-shadow: 0 4px 14px rgba(239, 68, 68, 0.4);
            transition: all 0.2s;
          }

          .btn-submodal-delete:hover {
            background: #DC2626;
            transform: translateY(-1px);
          }
        `}</style>
      </div>
    </div>
  );
};

export default ItemFormSettingsModal;

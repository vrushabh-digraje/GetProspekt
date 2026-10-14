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
  onSave: (newConfig: GatedFormConfig) => void;
  showToast?: (msg: string) => void;
}

const FIELD_METADATA: Record<
  keyof GatedFormConfig["fields"],
  { label: string; icon: string; group: string; hint: string }
> = {
  firstName: { label: "First Name", icon: "👤", group: "Identity", hint: "Visitor personal identity" },
  lastName: { label: "Last Name", icon: "👤", group: "Identity", hint: "Visitor family name" },
  email: { label: "Corporate Email", icon: "✉️", group: "Contact", hint: "Business email address" },
  telephone: { label: "Telephone / Direct Dial", icon: "📞", group: "Contact", hint: "Direct phone number" },
  companyName: { label: "Company Name", icon: "🏢", group: "Company", hint: "Employer / Organization" },
  jobTitle: { label: "Job Title", icon: "💼", group: "Company", hint: "Seniority and functional role" },
  industry: { label: "Industry", icon: "🏭", group: "Company", hint: "Target market sector" },
  companySize: { label: "Company Size", icon: "👥", group: "Company", hint: "Employee headcount tier" },
  country: { label: "Country", icon: "🌍", group: "Location", hint: "Geographic territory" },
  city: { label: "City", icon: "🏙️", group: "Location", hint: "Metropolitan headquarters" },
  address: { label: "Street Address", icon: "📍", group: "Location", hint: "Physical office location" },
  postalCode: { label: "Postal / ZIP Code", icon: "📮", group: "Location", hint: "Postal verification" },
  optInMarketing: { label: "Marketing Subscription Opt-in", icon: "📰", group: "Consent", hint: "Newsletter / communications agreement" },
  optInPartner: { label: "Partner Data Sharing Consent", icon: "🤝", group: "Consent", hint: "Third-party co-marketing opt-in" },
};

export const ItemFormSettingsModal: React.FC<ItemFormSettingsModalProps> = ({
  isOpen,
  onClose,
  itemTitle,
  itemTypeLabel,
  initialConfig,
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

  useEffect(() => {
    if (initialConfig && initialConfig.fields) {
      setConfig(JSON.parse(JSON.stringify(initialConfig)));
    } else {
      setConfig(JSON.parse(JSON.stringify(defaultGatedFormConfig)));
    }
  }, [initialConfig, isOpen]);

  if (!isOpen) return null;

  const handleToggleEnabled = (key: keyof GatedFormConfig["fields"]) => {
    setConfig((prev) => {
      const current = prev.fields[key] || { id: key, label: FIELD_METADATA[key].label, enabled: false, required: false };
      const nextEnabled = !current.enabled;
      return {
        ...prev,
        fields: {
          ...prev.fields,
          [key]: {
            ...current,
            enabled: nextEnabled,
            // If disabled, cannot be required
            required: nextEnabled ? current.required : false,
          },
        },
      };
    });
  };

  const handleToggleRequired = (key: keyof GatedFormConfig["fields"]) => {
    setConfig((prev) => {
      const current = prev.fields[key] || { id: key, label: FIELD_METADATA[key].label, enabled: true, required: false };
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

  const handleLabelChange = (key: keyof GatedFormConfig["fields"], newLabel: string) => {
    setConfig((prev) => {
      const current = prev.fields[key] || { id: key, label: newLabel, enabled: true, required: false };
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

  // Presets
  const applyPreset = (preset: "minimal" | "standard" | "enterprise") => {
    const base = JSON.parse(JSON.stringify(defaultGatedFormConfig)) as GatedFormConfig;

    if (preset === "minimal") {
      const newFields = { ...base.fields };
      (Object.keys(newFields) as (keyof GatedFormConfig["fields"])[]).forEach((k) => {
        const isCore = ["firstName", "email", "companyName"].includes(k);
        newFields[k] = { ...newFields[k], enabled: isCore, required: isCore };
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
      const newFields = { ...base.fields };
      (Object.keys(newFields) as (keyof GatedFormConfig["fields"])[]).forEach((k) => {
        const isStandard = ["firstName", "lastName", "email", "companyName", "jobTitle"].includes(k);
        const isReq = ["firstName", "lastName", "email", "companyName"].includes(k);
        newFields[k] = { ...newFields[k], enabled: isStandard, required: isReq };
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
      const newFields = { ...base.fields };
      (Object.keys(newFields) as (keyof GatedFormConfig["fields"])[]).forEach((k) => {
        newFields[k] = { ...newFields[k], enabled: true, required: true };
      });
      newFields.optInMarketing.required = false;
      newFields.optInPartner.required = false;
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

  const fieldKeys = Object.keys(FIELD_METADATA) as (keyof GatedFormConfig["fields"])[];
  const enabledCount = fieldKeys.filter((k) => config.fields[k]?.enabled).length;
  const requiredCount = fieldKeys.filter((k) => config.fields[k]?.enabled && config.fields[k]?.required).length;

  const groups = ["All", "Identity", "Contact", "Company", "Location", "Consent"];
  const filteredKeys = fieldKeys.filter((k) => {
    if (activeGroup === "All") return true;
    return FIELD_METADATA[k].group === activeGroup;
  });

  return (
    <div className="item-form-modal-backdrop" onClick={onClose}>
      <div className="item-form-modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="item-form-modal-header">
          <div>
            <span className="item-form-tag">
              ⚙️ SPECIFIC FORM CONTROLS · {itemTypeLabel.toUpperCase()}
            </span>
            <h2>Manage Form Fields for &quot;{itemTitle}&quot;</h2>
            <p>
              Customize exactly which fields appear and which are required when visitors click to download this specific {itemTypeLabel}. Changes apply only to this item.
            </p>
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

          {/* Group Tabs */}
          <div className="item-form-group-tabs">
            {groups.map((grp) => (
              <button
                type="button"
                key={grp}
                className={`group-tab ${activeGroup === grp ? "active" : ""}`}
                onClick={() => setActiveGroup(grp)}
              >
                {grp}
              </button>
            ))}
          </div>

          {/* Fields List */}
          <div className="item-form-fields-list">
            {filteredKeys.map((key) => {
              const meta = FIELD_METADATA[key];
              const fConfig: FormFieldSetting = config.fields[key] || {
                id: key,
                label: meta.label,
                enabled: false,
                required: false,
              };

              return (
                <div
                  key={key}
                  className={`item-field-row ${!fConfig.enabled ? "is-disabled" : ""}`}
                >
                  <div className="field-info-col">
                    <span className="field-icon">{meta.icon}</span>
                    <div className="field-labels">
                      <input
                        type="text"
                        className="field-label-edit"
                        value={fConfig.label}
                        onChange={(e) => handleLabelChange(key, e.target.value)}
                        placeholder={meta.label}
                        disabled={!fConfig.enabled}
                      />
                      <small className="field-group-hint">
                        {meta.group} · {meta.hint}
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
                  </div>
                </div>
              );
            })}
          </div>

          {/* Live Preview Bar */}
          <div className="item-form-preview-box">
            <span className="preview-heading">👀 VISITOR FORM PREVIEW FOR THIS {itemTypeLabel.toUpperCase()}:</span>
            <div className="preview-form-card">
              <h4>{config.headerTitle || "DOWNLOAD NOW"}</h4>
              <p>{config.subtitle || "Instant Access"}</p>
              <div className="preview-chips-flow">
                {fieldKeys
                  .filter((k) => config.fields[k]?.enabled)
                  .map((k) => (
                    <span key={k} className="preview-field-chip">
                      {FIELD_METADATA[k].icon} {config.fields[k]?.label || FIELD_METADATA[k].label}
                      {config.fields[k]?.required && <strong className="req-star">*</strong>}
                    </span>
                  ))}
              </div>
              <button type="button" className="preview-cta-btn" disabled>
                {config.submitButtonText || "DOWNLOAD NOW! →"}
              </button>
            </div>
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

        {/* Styles */}
        <style>{`
          .item-form-modal-backdrop {
            position: fixed;
            inset: 0;
            background: rgba(3, 7, 18, 0.82);
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
            max-width: 860px;
            max-height: 90vh;
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
            padding: 20px 24px 16px;
            border-bottom: 1px solid rgba(203, 213, 225, 0.12);
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 16px;
            background: #070D18;
          }

          .item-form-tag {
            display: inline-block;
            font-size: 10.5px;
            font-weight: 800;
            color: #00D2FF;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            background: rgba(0, 210, 255, 0.12);
            border: 1px solid rgba(0, 210, 255, 0.25);
            padding: 3px 10px;
            border-radius: 12px;
            margin-bottom: 6px;
          }

          .item-form-modal-header h2 {
            font-size: 20px;
            font-weight: 800;
            color: #FFFFFF;
            margin: 0 0 6px;
          }

          .item-form-modal-header p {
            font-size: 12px;
            color: #94A3B8;
            margin: 0;
            line-height: 1.4;
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

          .item-form-group-tabs {
            display: flex;
            gap: 6px;
            border-bottom: 1px solid rgba(203, 213, 225, 0.1);
            padding-bottom: 8px;
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

          .item-form-fields-list {
            display: flex;
            flex-direction: column;
            gap: 8px;
            max-height: 280px;
            overflow-y: auto;
            padding-right: 4px;
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
          }

          .field-icon {
            font-size: 18px;
          }

          .field-labels {
            display: flex;
            flex-direction: column;
            gap: 3px;
            flex: 1;
          }

          .field-label-edit {
            background: transparent;
            border: 1px solid transparent;
            color: #FFFFFF;
            font-size: 13px;
            font-weight: 700;
            padding: 2px 6px;
            border-radius: 4px;
            width: 100%;
            max-width: 280px;
          }

          .field-label-edit:focus {
            background: #0B1220;
            border-color: #00D2FF;
            outline: none;
          }

          .field-group-hint {
            font-size: 10.5px;
            color: #64748B;
            padding-left: 6px;
          }

          .field-toggles-col {
            display: flex;
            align-items: center;
            gap: 14px;
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

          .item-form-preview-box {
            background: #060B12;
            border: 1px dashed rgba(0, 210, 255, 0.25);
            border-radius: 8px;
            padding: 12px 16px;
          }

          .preview-heading {
            display: block;
            font-size: 10.5px;
            font-weight: 800;
            color: #00D2FF;
            letter-spacing: 0.08em;
            margin-bottom: 8px;
          }

          .preview-form-card {
            background: #0B1220;
            border: 1px solid rgba(203, 213, 225, 0.12);
            border-radius: 6px;
            padding: 12px;
          }

          .preview-form-card h4 {
            font-size: 13px;
            font-weight: 800;
            color: #FFFFFF;
            margin: 0 0 2px;
          }

          .preview-form-card p {
            font-size: 11px;
            color: #94A3B8;
            margin: 0 0 10px;
          }

          .preview-chips-flow {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin-bottom: 10px;
          }

          .preview-field-chip {
            background: rgba(0, 70, 252, 0.15);
            border: 1px solid rgba(0, 70, 252, 0.35);
            color: #CBD5E1;
            font-size: 11px;
            padding: 3px 8px;
            border-radius: 4px;
            display: inline-flex;
            align-items: center;
            gap: 4px;
          }

          .req-star {
            color: #F87171;
          }

          .preview-cta-btn {
            background: linear-gradient(135deg, #00D2FF, #0046FC);
            border: none;
            color: #FFFFFF;
            font-size: 11.5px;
            font-weight: 800;
            padding: 7px 14px;
            border-radius: 4px;
            opacity: 0.9;
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
        `}</style>
      </div>
    </div>
  );
};

export default ItemFormSettingsModal;

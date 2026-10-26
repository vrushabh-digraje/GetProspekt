import React, { useState, useEffect } from "react";
import {
  faqStorageApi,
  type FaqGroup,
  type FaqItem,
} from "../../services/api";

interface FaqManagerProps {
  showToast: (msg: string) => void;
}

const FaqManager: React.FC<FaqManagerProps> = ({ showToast }) => {
  const [groups, setGroups] = useState<FaqGroup[]>(() => faqStorageApi.getAll());
  const [selectedSection, setSelectedSection] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modal States
  const [isAddQaOpen, setIsAddQaOpen] = useState(false);
  const [isEditQaOpen, setIsEditQaOpen] = useState(false);
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);
  const [isEditSectionOpen, setIsEditSectionOpen] = useState(false);

  // Form States for Add / Edit Q&A
  const [targetSection, setTargetSection] = useState<string>("");
  const [newSectionName, setNewSectionName] = useState<string>("");
  const [questionInput, setQuestionInput] = useState<string>("");
  const [answerInput, setAnswerInput] = useState<string>("");

  // Current editing pointer
  const [editingSectionTitle, setEditingSectionTitle] = useState<string>("");
  const [editingItemIndex, setEditingItemIndex] = useState<number>(-1);

  // Section editing
  const [sectionTitleInput, setSectionTitleInput] = useState<string>("");

  useEffect(() => {
    const handleSync = () => {
      setGroups(faqStorageApi.getAll());
    };
    window.addEventListener("storage", handleSync);
    window.addEventListener("gp_faqs_updated", handleSync);
    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("gp_faqs_updated", handleSync);
    };
  }, []);

  const totalQuestions = groups.reduce((acc, g) => acc + (g.items?.length || 0), 0);

  // Filter groups according to selected section and search query
  const displayedGroups = groups
    .filter((g) => selectedSection === "All" || g.title === selectedSection)
    .map((g) => {
      if (!searchQuery.trim()) return g;
      const q = searchQuery.toLowerCase();
      const filteredItems = g.items.filter(
        (it) =>
          it.question.toLowerCase().includes(q) ||
          it.answer.toLowerCase().includes(q)
      );
      return {
        ...g,
        items: filteredItems,
      };
    })
    .filter((g) => g.items.length > 0 || !searchQuery.trim());

  // ================= SAVE HELPER =================
  const saveAndSync = (nextGroups: FaqGroup[], toastMsg: string) => {
    setGroups(nextGroups);
    faqStorageApi.saveAll(nextGroups);
    showToast(toastMsg);
  };

  // ================= ADD Q&A FIELD =================
  const handleOpenAddQa = (defaultSec?: string) => {
    const chosenSec = defaultSec || (selectedSection !== "All" ? selectedSection : groups[0]?.title || "GENERAL");
    setTargetSection(chosenSec);
    setNewSectionName("");
    setQuestionInput("");
    setAnswerInput("");
    setIsAddQaOpen(true);
  };

  const handleSaveNewQa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionInput.trim()) {
      alert("Please enter a question.");
      return;
    }
    if (!answerInput.trim()) {
      alert("Please enter an answer.");
      return;
    }

    const finalSection = targetSection === "__NEW__"
      ? newSectionName.trim().toUpperCase()
      : targetSection.trim();

    if (!finalSection) {
      alert("Please select or enter a section title.");
      return;
    }

    const nextGroups = [...groups];
    const existingGroupIdx = nextGroups.findIndex(
      (g) => g.title.toUpperCase() === finalSection.toUpperCase()
    );

    const newItem: FaqItem = {
      question: questionInput.trim(),
      answer: answerInput.trim(),
    };

    if (existingGroupIdx !== -1) {
      nextGroups[existingGroupIdx] = {
        ...nextGroups[existingGroupIdx],
        items: [...nextGroups[existingGroupIdx].items, newItem],
      };
    } else {
      nextGroups.push({
        title: finalSection,
        items: [newItem],
      });
    }

    saveAndSync(nextGroups, `Added Question & Answer field to "${finalSection}"!`);
    setIsAddQaOpen(false);
  };

  // ================= EDIT Q&A FIELD =================
  const handleOpenEditQa = (sectionTitle: string, itemIdx: number) => {
    const group = groups.find((g) => g.title === sectionTitle);
    if (!group || !group.items[itemIdx]) return;
    const it = group.items[itemIdx];
    setEditingSectionTitle(sectionTitle);
    setEditingItemIndex(itemIdx);
    setTargetSection(sectionTitle);
    setQuestionInput(it.question);
    setAnswerInput(it.answer);
    setIsEditQaOpen(true);
  };

  const handleSaveEditQa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionInput.trim() || !answerInput.trim()) {
      alert("Please fill in both the question and answer fields.");
      return;
    }

    const nextGroups = [...groups];
    const currentGroupIdx = nextGroups.findIndex((g) => g.title === editingSectionTitle);
    if (currentGroupIdx === -1) return;

    const currentItems = [...nextGroups[currentGroupIdx].items];
    const editedItem: FaqItem = {
      question: questionInput.trim(),
      answer: answerInput.trim(),
    };

    if (targetSection === editingSectionTitle) {
      // Just update in place
      currentItems[editingItemIndex] = editedItem;
      nextGroups[currentGroupIdx] = {
        ...nextGroups[currentGroupIdx],
        items: currentItems,
      };
    } else {
      // Moved to a different section
      currentItems.splice(editingItemIndex, 1);
      nextGroups[currentGroupIdx] = {
        ...nextGroups[currentGroupIdx],
        items: currentItems,
      };

      const targetGroupIdx = nextGroups.findIndex((g) => g.title === targetSection);
      if (targetGroupIdx !== -1) {
        nextGroups[targetGroupIdx] = {
          ...nextGroups[targetGroupIdx],
          items: [...nextGroups[targetGroupIdx].items, editedItem],
        };
      } else {
        nextGroups.push({
          title: targetSection,
          items: [editedItem],
        });
      }
    }

    saveAndSync(nextGroups, "Question & Answer field updated successfully!");
    setIsEditQaOpen(false);
  };

  // ================= REMOVE Q&A FIELD =================
  const handleRemoveQa = (sectionTitle: string, itemIdx: number) => {
    const group = groups.find((g) => g.title === sectionTitle);
    if (!group || !group.items[itemIdx]) return;
    const qText = group.items[itemIdx].question;

    if (!confirm(`Are you sure you want to remove this Question & Answer field?\n\n"${qText}"`)) {
      return;
    }

    const nextGroups = groups.map((g) => {
      if (g.title === sectionTitle) {
        const nextItems = [...g.items];
        nextItems.splice(itemIdx, 1);
        return { ...g, items: nextItems };
      }
      return g;
    });

    saveAndSync(nextGroups, "Removed Question & Answer field.");
  };

  // ================= REORDER Q&A =================
  const handleMoveQa = (sectionTitle: string, itemIdx: number, direction: "up" | "down") => {
    const groupIdx = groups.findIndex((g) => g.title === sectionTitle);
    if (groupIdx === -1) return;

    const items = [...groups[groupIdx].items];
    const targetIdx = direction === "up" ? itemIdx - 1 : itemIdx + 1;
    if (targetIdx < 0 || targetIdx >= items.length) return;

    const temp = items[itemIdx];
    items[itemIdx] = items[targetIdx];
    items[targetIdx] = temp;

    const nextGroups = [...groups];
    nextGroups[groupIdx] = { ...nextGroups[groupIdx], items };
    saveAndSync(nextGroups, `Moved question ${direction}!`);
  };

  // ================= SECTION MANAGEMENT =================
  const handleOpenAddSection = () => {
    setSectionTitleInput("");
    setIsAddSectionOpen(true);
  };

  const handleSaveNewSection = (e: React.FormEvent) => {
    e.preventDefault();
    const title = sectionTitleInput.trim().toUpperCase();
    if (!title) {
      alert("Please enter a section title.");
      return;
    }
    if (groups.some((g) => g.title.toUpperCase() === title)) {
      alert("A section with this title already exists.");
      return;
    }

    const nextGroups = [...groups, { title, items: [] }];
    saveAndSync(nextGroups, `Created new specific section "${title}"!`);
    setIsAddSectionOpen(false);
    setSelectedSection(title);
  };

  const handleOpenEditSection = (currentTitle: string) => {
    setEditingSectionTitle(currentTitle);
    setSectionTitleInput(currentTitle);
    setIsEditSectionOpen(true);
  };

  const handleSaveEditSection = (e: React.FormEvent) => {
    e.preventDefault();
    const newTitle = sectionTitleInput.trim().toUpperCase();
    if (!newTitle) {
      alert("Please enter a section title.");
      return;
    }

    const nextGroups = groups.map((g) => {
      if (g.title === editingSectionTitle) {
        return { ...g, title: newTitle };
      }
      return g;
    });

    saveAndSync(nextGroups, `Updated section title to "${newTitle}"!`);
    if (selectedSection === editingSectionTitle) {
      setSelectedSection(newTitle);
    }
    setIsEditSectionOpen(false);
  };

  const handleRemoveSection = (sectionTitle: string) => {
    const group = groups.find((g) => g.title === sectionTitle);
    const count = group?.items?.length || 0;
    if (
      !confirm(
        `Are you sure you want to remove the section "${sectionTitle}" and all ${count} Question & Answer fields inside it?`
      )
    ) {
      return;
    }

    const nextGroups = groups.filter((g) => g.title !== sectionTitle);
    saveAndSync(nextGroups, `Removed section "${sectionTitle}".`);
    if (selectedSection === sectionTitle) {
      setSelectedSection("All");
    }
  };

  const handleResetDefaults = () => {
    if (
      !confirm(
        "Are you sure you want to reset all FAQ sections and Question & Answer fields to default settings? Any custom questions will be overwritten."
      )
    ) {
      return;
    }
    const def = faqStorageApi.resetDefaults();
    setGroups(def);
    setSelectedSection("All");
    showToast("Reset Question & Answer fields to defaults!");
  };

  return (
    <div className="gp-faq-manager">
      <style>{`
        .gp-faq-manager {
          color: #D5DBE7;
          font-family: var(--font-sans);
        }

        .gp-faq-panel {
          background: #0D1522;
          border: 1px solid rgba(203, 213, 225, 0.12);
          border-radius: 12px;
          padding: 24px 28px;
          margin-bottom: 24px;
        }

        .gp-faq-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 18px;
          border-bottom: 1px solid rgba(203, 213, 225, 0.1);
          padding-bottom: 20px;
          margin-bottom: 22px;
        }

        .gp-faq-header h2 {
          font-size: 24px;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0 0 6px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .gp-faq-header p {
          color: #94A3B8;
          font-size: 14px;
          margin: 0;
          max-width: 680px;
          line-height: 1.5;
        }

        .gp-faq-actions-top {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .gp-btn-primary {
          background: linear-gradient(135deg, #0046FC 0%, #00D2FF 100%);
          color: #FFFFFF;
          border: 0;
          padding: 10px 18px;
          border-radius: 6px;
          font-size: 13.5px;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s ease;
          box-shadow: 0 4px 14px rgba(0, 70, 252, 0.35);
        }

        .gp-btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(0, 210, 255, 0.45);
          filter: brightness(1.08);
        }

        .gp-btn-secondary {
          background: #060B12;
          color: #D5DBE7;
          border: 1px solid rgba(0, 210, 255, 0.35);
          padding: 9px 16px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s ease;
        }

        .gp-btn-secondary:hover {
          border-color: #00D2FF;
          color: #FFFFFF;
          background: rgba(0, 70, 252, 0.15);
        }

        .gp-btn-danger-outline {
          background: transparent;
          color: #F87171;
          border: 1px solid rgba(239, 68, 68, 0.3);
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .gp-btn-danger-outline:hover {
          background: rgba(239, 68, 68, 0.15);
          border-color: #EF4444;
          color: #FFFFFF;
        }

        /* STATS BAR */
        .gp-faq-stats-bar {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 14px;
          margin-bottom: 24px;
        }

        .gp-faq-stat-box {
          background: rgba(6, 11, 18, 0.7);
          border: 1px solid rgba(203, 213, 225, 0.1);
          border-radius: 8px;
          padding: 14px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .gp-faq-stat-box strong {
          font-size: 22px;
          color: #FFFFFF;
          font-weight: 800;
          display: block;
        }

        .gp-faq-stat-box span {
          font-size: 12px;
          color: #94A3B8;
        }

        .gp-faq-stat-icon {
          font-size: 24px;
          color: #00D2FF;
        }

        /* SECTION TABS & SEARCH */
        .gp-faq-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 14px;
          background: #060B12;
          border: 1px solid rgba(203, 213, 225, 0.12);
          border-radius: 8px;
          padding: 12px 16px;
          margin-bottom: 26px;
        }

        .gp-faq-section-pills {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .gp-section-pill {
          background: transparent;
          border: 1px solid rgba(203, 213, 225, 0.15);
          color: #94A3B8;
          font-size: 12.5px;
          font-weight: 600;
          padding: 6px 14px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .gp-section-pill:hover {
          color: #FFFFFF;
          border-color: rgba(0, 210, 255, 0.4);
        }

        .gp-section-pill.active {
          background: #0046FC;
          color: #FFFFFF;
          border-color: #00D2FF;
          box-shadow: 0 2px 10px rgba(0, 70, 252, 0.5);
        }

        .gp-section-pill .count-badge {
          background: rgba(0, 0, 0, 0.35);
          padding: 1px 6px;
          border-radius: 10px;
          font-size: 11px;
        }

        .gp-faq-search {
          position: relative;
          min-width: 260px;
        }

        .gp-faq-search input {
          width: 100%;
          background: #0D1522;
          border: 1px solid rgba(203, 213, 225, 0.18);
          border-radius: 6px;
          padding: 8px 12px 8px 32px;
          font-size: 13px;
          color: #FFFFFF;
          outline: none;
          box-sizing: border-box;
          transition: all 0.2s ease;
        }

        .gp-faq-search input:focus {
          border-color: #00D2FF;
          box-shadow: 0 0 0 2px rgba(0, 210, 255, 0.2);
        }

        .gp-faq-search-icon {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: #64748B;
          font-size: 13px;
          pointer-events: none;
        }

        /* SECTION CARD & Q&A LIST */
        .gp-faq-section-card {
          background: rgba(6, 11, 18, 0.55);
          border: 1px solid rgba(203, 213, 225, 0.12);
          border-radius: 10px;
          margin-bottom: 28px;
          overflow: hidden;
        }

        .gp-section-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          background: rgba(13, 21, 34, 0.95);
          border-bottom: 1px solid rgba(203, 213, 225, 0.1);
          flex-wrap: wrap;
          gap: 12px;
        }

        .gp-section-card-title {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .gp-section-card-title h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 800;
          color: #FFFFFF;
          letter-spacing: 0.04em;
        }

        .gp-section-card-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .gp-qa-list {
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .gp-qa-card {
          background: #0D1522;
          border: 1px solid rgba(203, 213, 225, 0.1);
          border-left: 3px solid #00D2FF;
          border-radius: 8px;
          padding: 16px 18px;
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .gp-qa-card:hover {
          border-color: rgba(0, 210, 255, 0.35);
          background: rgba(16, 27, 46, 0.7);
        }

        .gp-qa-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 14px;
        }

        .gp-qa-q-row {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          flex: 1;
        }

        .gp-qa-q-badge {
          width: 24px;
          height: 24px;
          border-radius: 5px;
          background: rgba(0, 70, 252, 0.25);
          border: 1px solid rgba(0, 210, 255, 0.4);
          color: #00D2FF;
          font-size: 11px;
          font-weight: 800;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .gp-qa-q-text {
          font-size: 15px;
          font-weight: 700;
          color: #FFFFFF;
          line-height: 1.4;
          margin: 0;
        }

        .gp-qa-controls-row {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
        }

        .gp-icon-btn {
          background: rgba(6, 11, 18, 0.6);
          border: 1px solid rgba(203, 213, 225, 0.15);
          color: #94A3B8;
          width: 28px;
          height: 28px;
          border-radius: 5px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.2s ease;
        }

        .gp-icon-btn:hover {
          color: #00D2FF;
          border-color: #00D2FF;
          background: rgba(0, 70, 252, 0.2);
        }

        .gp-icon-btn.delete:hover {
          color: #EF4444;
          border-color: #EF4444;
          background: rgba(239, 68, 68, 0.15);
        }

        .gp-qa-answer-row {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding-left: 34px;
        }

        .gp-qa-a-text {
          font-size: 13.5px;
          color: #CBD5E1;
          line-height: 1.6;
          margin: 0;
        }

        .gp-empty-state {
          text-align: center;
          padding: 38px 20px;
          color: #94A3B8;
        }

        /* MODAL OVERLAY */
        .gp-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(3, 7, 18, 0.85);
          backdrop-filter: blur(8px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .gp-modal-box {
          background: #0D1522;
          border: 1px solid rgba(0, 210, 255, 0.35);
          border-radius: 12px;
          width: 100%;
          max-width: 620px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7);
          overflow: hidden;
          animation: gpModalFadeIn 0.25s ease;
        }

        @keyframes gpModalFadeIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }

        .gp-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 24px;
          background: rgba(6, 11, 18, 0.6);
          border-bottom: 1px solid rgba(203, 213, 225, 0.1);
        }

        .gp-modal-header h3 {
          margin: 0;
          font-size: 17px;
          font-weight: 800;
          color: #FFFFFF;
        }

        .gp-modal-close {
          background: transparent;
          border: 0;
          color: #94A3B8;
          font-size: 20px;
          cursor: pointer;
          line-height: 1;
        }

        .gp-modal-close:hover {
          color: #FFFFFF;
        }

        .gp-modal-body {
          padding: 22px 24px;
        }

        .gp-form-field {
          margin-bottom: 18px;
        }

        .gp-form-field label {
          display: block;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #00D2FF;
          margin-bottom: 8px;
        }

        .gp-form-field input,
        .gp-form-field select,
        .gp-form-field textarea {
          width: 100%;
          background: #060B12;
          border: 1px solid rgba(203, 213, 225, 0.2);
          border-radius: 6px;
          padding: 10px 14px;
          font-size: 14px;
          color: #FFFFFF;
          box-sizing: border-box;
          outline: none;
          font-family: inherit;
        }

        .gp-form-field input:focus,
        .gp-form-field select:focus,
        .gp-form-field textarea:focus {
          border-color: #00D2FF;
          box-shadow: 0 0 0 2px rgba(0, 210, 255, 0.25);
        }

        .gp-modal-footer {
          padding: 14px 24px 20px;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          border-top: 1px solid rgba(203, 213, 225, 0.1);
        }
      `}</style>

      {/* TOP HEADER */}
      <div className="gp-faq-panel">
        <div className="gp-faq-header">
          <div>
            <h2>
              <span>❓</span> Questions & Answers (FAQ) Management
            </h2>
            <p>
              Manage questions and answers across specific sections of your website.
              Add or remove Q&A fields in specific categories with instant live updates on the public FAQ page.
            </p>
          </div>
          <div className="gp-faq-actions-top">
            <button
              type="button"
              className="gp-btn-primary"
              onClick={() => handleOpenAddQa()}
            >
              + Add Question & Answer Field
            </button>
            <button
              type="button"
              className="gp-btn-secondary"
              onClick={handleOpenAddSection}
            >
              + Add Specific Section
            </button>
            <button
              type="button"
              className="gp-btn-danger-outline"
              onClick={handleResetDefaults}
              title="Reset all questions and sections to canonical defaults"
            >
              ↺ Reset to Defaults
            </button>
          </div>
        </div>

        {/* STATS BAR */}
        <div className="gp-faq-stats-bar">
          <div className="gp-faq-stat-box">
            <div>
              <strong>{totalQuestions}</strong>
              <span>Total Question & Answer Fields</span>
            </div>
            <span className="gp-faq-stat-icon">💬</span>
          </div>
          <div className="gp-faq-stat-box">
            <div>
              <strong>{groups.length}</strong>
              <span>Specific Question Sections</span>
            </div>
            <span className="gp-faq-stat-icon">📁</span>
          </div>
          <div className="gp-faq-stat-box">
            <div>
              <strong>{selectedSection === "All" ? "All Sections" : selectedSection}</strong>
              <span>Active Filter</span>
            </div>
            <span className="gp-faq-stat-icon">🔍</span>
          </div>
        </div>

        {/* SECTION FILTER TABS & SEARCH */}
        <div className="gp-faq-controls">
          <div className="gp-faq-section-pills">
            <button
              type="button"
              className={`gp-section-pill ${selectedSection === "All" ? "active" : ""}`}
              onClick={() => setSelectedSection("All")}
            >
              All Sections <span className="count-badge">{totalQuestions}</span>
            </button>
            {groups.map((g) => (
              <button
                key={g.title}
                type="button"
                className={`gp-section-pill ${selectedSection === g.title ? "active" : ""}`}
                onClick={() => setSelectedSection(g.title)}
              >
                {g.title} <span className="count-badge">{g.items.length}</span>
              </button>
            ))}
            <button
              type="button"
              className="gp-section-pill"
              onClick={handleOpenAddSection}
              style={{ borderStyle: "dashed" }}
            >
              + New Section
            </button>
          </div>

          <div className="gp-faq-search">
            <span className="gp-faq-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search questions or answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* DISPLAYED SECTIONS */}
        {displayedGroups.length === 0 ? (
          <div className="gp-empty-state">
            <p>No questions found matching your filter or search query.</p>
            <button
              type="button"
              className="gp-btn-primary"
              onClick={() => handleOpenAddQa(selectedSection !== "All" ? selectedSection : undefined)}
            >
              + Add Question & Answer Field
            </button>
          </div>
        ) : (
          displayedGroups.map((group) => (
            <div className="gp-faq-section-card" key={group.title}>
              {/* SECTION HEADER */}
              <div className="gp-section-card-header">
                <div className="gp-section-card-title">
                  <span style={{ color: "#00D2FF" }}>📁</span>
                  <h3>{group.title}</h3>
                  <span className="count-badge">{group.items.length} Questions</span>
                </div>
                <div className="gp-section-card-actions">
                  <button
                    type="button"
                    className="gp-btn-primary"
                    style={{ padding: "6px 12px", fontSize: "12px" }}
                    onClick={() => handleOpenAddQa(group.title)}
                  >
                    + Add Q&A Field
                  </button>
                  <button
                    type="button"
                    className="gp-btn-secondary"
                    style={{ padding: "6px 10px", fontSize: "12px" }}
                    onClick={() => handleOpenEditSection(group.title)}
                    title="Rename Section"
                  >
                    ✎ Rename
                  </button>
                  <button
                    type="button"
                    className="gp-btn-danger-outline"
                    onClick={() => handleRemoveSection(group.title)}
                    title="Remove Section"
                  >
                    🗑 Remove Section
                  </button>
                </div>
              </div>

              {/* LIST OF QUESTION & ANSWER FIELDS */}
              <div className="gp-qa-list">
                {group.items.length === 0 ? (
                  <div className="gp-empty-state" style={{ padding: "20px" }}>
                    <p>No question fields in this section yet.</p>
                    <button
                      type="button"
                      className="gp-btn-primary"
                      onClick={() => handleOpenAddQa(group.title)}
                    >
                      + Add First Q&A Field
                    </button>
                  </div>
                ) : (
                  group.items.map((item, idx) => (
                    <div className="gp-qa-card" key={idx}>
                      <div className="gp-qa-top">
                        <div className="gp-qa-q-row">
                          <span className="gp-qa-q-badge">Q{idx + 1}</span>
                          <h4 className="gp-qa-q-text">{item.question}</h4>
                        </div>
                        <div className="gp-qa-controls-row">
                          <button
                            type="button"
                            className="gp-icon-btn"
                            disabled={idx === 0}
                            onClick={() => handleMoveQa(group.title, idx, "up")}
                            title="Move Up"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            className="gp-icon-btn"
                            disabled={idx === group.items.length - 1}
                            onClick={() => handleMoveQa(group.title, idx, "down")}
                            title="Move Down"
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            className="gp-icon-btn"
                            onClick={() => handleOpenEditQa(group.title, idx)}
                            title="Edit Question & Answer Field"
                          >
                            ✎
                          </button>
                          <button
                            type="button"
                            className="gp-icon-btn delete"
                            onClick={() => handleRemoveQa(group.title, idx)}
                            title="Remove Question & Answer Field"
                          >
                            🗑
                          </button>
                        </div>
                      </div>

                      <div className="gp-qa-answer-row">
                        <p className="gp-qa-a-text">{item.answer}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* ================= MODAL: ADD QUESTION & ANSWER FIELD ================= */}
      {isAddQaOpen && (
        <div className="gp-modal-backdrop" onClick={() => setIsAddQaOpen(false)}>
          <div className="gp-modal-box" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSaveNewQa}>
              <div className="gp-modal-header">
                <h3>+ Add Question & Answer Field</h3>
                <button
                  type="button"
                  className="gp-modal-close"
                  onClick={() => setIsAddQaOpen(false)}
                >
                  ✕
                </button>
              </div>

              <div className="gp-modal-body">
                <div className="gp-form-field">
                  <label>Specific Section</label>
                  <select
                    value={targetSection}
                    onChange={(e) => setTargetSection(e.target.value)}
                  >
                    {groups.map((g) => (
                      <option key={g.title} value={g.title}>
                        {g.title}
                      </option>
                    ))}
                    <option value="__NEW__">+ Create New Specific Section...</option>
                  </select>
                </div>

                {targetSection === "__NEW__" && (
                  <div className="gp-form-field">
                    <label>New Section Title</label>
                    <input
                      type="text"
                      placeholder="e.g. ABOUT ENTERPRISE SECURITY"
                      value={newSectionName}
                      onChange={(e) => setNewSectionName(e.target.value)}
                      required
                    />
                  </div>
                )}

                <div className="gp-form-field">
                  <label>Question Field</label>
                  <input
                    type="text"
                    placeholder="e.g. How do you verify and qualify prospect data?"
                    value={questionInput}
                    onChange={(e) => setQuestionInput(e.target.value)}
                    required
                  />
                </div>

                <div className="gp-form-field">
                  <label>Answer Field</label>
                  <textarea
                    rows={4}
                    placeholder="Enter the detailed answer for this question..."
                    value={answerInput}
                    onChange={(e) => setAnswerInput(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="gp-modal-footer">
                <button
                  type="button"
                  className="gp-btn-secondary"
                  onClick={() => setIsAddQaOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="gp-btn-primary">
                  Save Q&A Field
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT QUESTION & ANSWER FIELD ================= */}
      {isEditQaOpen && (
        <div className="gp-modal-backdrop" onClick={() => setIsEditQaOpen(false)}>
          <div className="gp-modal-box" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSaveEditQa}>
              <div className="gp-modal-header">
                <h3>✎ Edit Question & Answer Field</h3>
                <button
                  type="button"
                  className="gp-modal-close"
                  onClick={() => setIsEditQaOpen(false)}
                >
                  ✕
                </button>
              </div>

              <div className="gp-modal-body">
                <div className="gp-form-field">
                  <label>Target Specific Section</label>
                  <select
                    value={targetSection}
                    onChange={(e) => setTargetSection(e.target.value)}
                  >
                    {groups.map((g) => (
                      <option key={g.title} value={g.title}>
                        {g.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="gp-form-field">
                  <label>Question Field</label>
                  <input
                    type="text"
                    value={questionInput}
                    onChange={(e) => setQuestionInput(e.target.value)}
                    required
                  />
                </div>

                <div className="gp-form-field">
                  <label>Answer Field</label>
                  <textarea
                    rows={5}
                    value={answerInput}
                    onChange={(e) => setAnswerInput(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="gp-modal-footer">
                <button
                  type="button"
                  className="gp-btn-secondary"
                  onClick={() => setIsEditQaOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="gp-btn-primary">
                  Update Q&A Field
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD SPECIFIC SECTION ================= */}
      {isAddSectionOpen && (
        <div className="gp-modal-backdrop" onClick={() => setIsAddSectionOpen(false)}>
          <div className="gp-modal-box" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSaveNewSection}>
              <div className="gp-modal-header">
                <h3>+ Add Specific Section</h3>
                <button
                  type="button"
                  className="gp-modal-close"
                  onClick={() => setIsAddSectionOpen(false)}
                >
                  ✕
                </button>
              </div>

              <div className="gp-modal-body">
                <div className="gp-form-field">
                  <label>Section Title (Category Name)</label>
                  <input
                    type="text"
                    placeholder="e.g. ABOUT DATA SECURITY & COMPLIANCE"
                    value={sectionTitleInput}
                    onChange={(e) => setSectionTitleInput(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="gp-modal-footer">
                <button
                  type="button"
                  className="gp-btn-secondary"
                  onClick={() => setIsAddSectionOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="gp-btn-primary">
                  Create Section
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT SPECIFIC SECTION ================= */}
      {isEditSectionOpen && (
        <div className="gp-modal-backdrop" onClick={() => setIsEditSectionOpen(false)}>
          <div className="gp-modal-box" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSaveEditSection}>
              <div className="gp-modal-header">
                <h3>✎ Rename Section</h3>
                <button
                  type="button"
                  className="gp-modal-close"
                  onClick={() => setIsEditSectionOpen(false)}
                >
                  ✕
                </button>
              </div>

              <div className="gp-modal-body">
                <div className="gp-form-field">
                  <label>Section Title</label>
                  <input
                    type="text"
                    value={sectionTitleInput}
                    onChange={(e) => setSectionTitleInput(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="gp-modal-footer">
                <button
                  type="button"
                  className="gp-btn-secondary"
                  onClick={() => setIsEditSectionOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="gp-btn-primary">
                  Update Title
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FaqManager;

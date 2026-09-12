import { useState } from "react";

const tabs = [
  { key: "all", label: "All Events" },
  { key: "upcoming", label: "Upcoming Events" },
  { key: "past", label: "Past Events" },
] as const;

function Events() {
  const [activeTab, setActiveTab] =
    useState<(typeof tabs)[number]["key"]>("upcoming");

  return (
    <main className="events-page">
      <div className="events-container">
        <div className="events-tabs" role="tablist" aria-label="Events">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.key}
              className={`events-tab ${
                activeTab === tab.key ? "active" : ""
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="events-divider" />

        <div className="events-empty">
          <h2>No events have been posted yet.</h2>
        </div>
      </div>

      <style>{`
        * {
          box-sizing: border-box;
        }

        .events-page {
          width: 100%;
          min-height: 650px;
          background: #fff;
          color: #17192B;
         font-family: Garamond, serif;
          padding: 18px 0 70px;
        }

        .events-container {
          width: min(1240px, calc(100% - 48px));
          margin: 0 auto;
        }

        .events-tabs {
          display: flex;
          align-items: flex-end;
          gap: 5px;
          overflow-x: auto;
          scrollbar-width: none;
        }

        .events-tabs::-webkit-scrollbar {
          display: none;
        }

        .events-tab {
          border: 0;
          background: #E4E8FF;
          color: #17192B;
          padding: 16px 17px;
          min-height: 54px;
          border-radius: 7px 7px 0 0;
          font-size: 16px;
          font-weight: 700;
          white-space: nowrap;
          cursor: pointer;
          position: relative;
        }

        .events-tab:hover {
          background: #D8DEFF;
        }

        .events-tab.active::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 3px;
          background: #6675F5;
        }

        .events-divider {
          width: 100%;
          height: 1px;
          background: #C9CEE3;
        }

        .events-empty {
          min-height: 470px;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 55px;
          text-align: center;
        }

        .events-empty h2 {
          margin: 0;
          color: #17192B;
          font-size: 27px;
          line-height: 1.3;
          font-weight: 400;
        }

        @media (max-width: 640px) {
          .events-page {
            padding-top: 12px;
          }

          .events-container {
            width: calc(100% - 24px);
          }

          .events-tab {
            padding: 13px 14px;
            min-height: 52px;
            font-size: 14px;
          }

          .events-empty {
            min-height: 430px;
            padding-top: 45px;
          }

          .events-empty h2 {
            font-size: 22px;
          }
        }

        @media (max-width: 400px) {
          .events-tab {
            padding: 12px 11px;
            font-size: 13px;
          }
        }
      `}</style>
    </main>
  );
}

export default Events;

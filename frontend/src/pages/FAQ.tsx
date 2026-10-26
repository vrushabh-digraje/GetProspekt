import { useState, useEffect } from "react";
import { faqStorageApi, type FaqGroup } from "../services/api";

function FAQ() {
  const [faqGroups, setFaqGroups] = useState<FaqGroup[]>(() => faqStorageApi.getAll());
  const [open, setOpen] = useState<string | null>(() => {
    const initial = faqStorageApi.getAll();
    return initial[0]?.items[0]?.question || null;
  });

  useEffect(() => {
    const handleSync = () => {
      setFaqGroups(faqStorageApi.getAll());
    };
    window.addEventListener("storage", handleSync);
    window.addEventListener("gp_faqs_updated", handleSync);
    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("gp_faqs_updated", handleSync);
    };
  }, []);

  return (
    <main className="faq-page">
      <div className="faq-shell">
        <button
          type="button"
          className="faq-back"
          onClick={() =>
            window.history.length > 1
              ? window.history.back()
              : (window.location.href = "/")
          }
        >
          ← Back
        </button>

        <header className="faq-header">
          <div className="faq-eyebrow">Frequently Asked Questions</div>
          <h1>Frequently Asked Questions</h1>
          <p>Questions decision-makers ask about working with GETprospeKt.</p>
        </header>

        <div className="faq-content">
          {faqGroups.map((group) => (
            <section className="faq-group" key={group.title}>
              <h2>{group.title}</h2>

              <div className="faq-list">
                {group.items.map(({ question, answer }) => {
                  const isOpen = open === question;

                  return (
                    <div
                      className={`faq-item ${isOpen ? "open" : ""}`}
                      key={question}
                    >
                      <button
                        type="button"
                        className="faq-question"
                        onClick={() => setOpen(isOpen ? null : question)}
                        aria-expanded={isOpen}
                      >
                        <span className="faq-q-text">{question}</span>
                        <span className={`faq-icon ${isOpen ? "is-open" : ""}`}>
                          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                        </span>
                      </button>

                      {isOpen && (
                        <div className="faq-answer">
                          <p>{answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>

      <style>{`
        .faq-page {
          width: 100%;
          min-height: 70vh;
          background: transparent;
          color: #D5DBE7;
          font-family: var(--font-sans);
        }

        .faq-shell {
          width: min(1380px, calc(100% - 48px));
          margin: 0 auto;
          padding: 22px 0 80px;
        }

        .faq-back {
          border: 0;
          background: transparent;
          padding: 6px 0;
          margin-bottom: 28px;
          color: #D5DBE7;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
        }

        .faq-back:hover {
          color: #00D2FF;
        }

        .faq-header {
          max-width: 820px;
          padding-bottom: 42px;
        }

        .faq-eyebrow {
          color: #00D2FF;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: .1em;
          text-transform: uppercase;
          margin-bottom: 12px;
        }

        .faq-header h1 {
          margin: 0;
          color: #FFFFFF;
          font-size: clamp(38px, 5vw, 64px);
          line-height: 1.03;
          letter-spacing: -.035em;
        }

        .faq-header p {
          margin: 18px 0 0;
          font-size: 19px;
          line-height: 1.55;
          color: #AEB8CA;
        }

        /*
          BLACK -> #0046FC
          Decorative gradient only in the CENTER of the page.
          It does not wrap, center, or constrain the FAQ content.
        */
        .faq-page{
          position:relative;
          overflow:hidden;
        }

        .faq-page::before{
          content:"";
          position:absolute;
          z-index:0;
          left:50%;
          top:300px;
          width:760px;
          height:420px;
          transform:translateX(-50%);
          border-radius:50%;
          background:linear-gradient(
            115deg,
            #000000 0%,
            #000000 42%,
            #0046FC 100%
          );
          opacity:.18;
          filter:blur(55px);
          pointer-events:none;
        }

        .faq-content {
          position:relative;
          z-index:1;
          width: 100%;
          box-sizing: border-box;
          padding: 34px 42px 42px;
          border-radius: 22px;
          background: #0D1522;
          border: 1px solid rgba(203, 213, 225, 0.12);
        }

        .faq-group {
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding: 34px 0 8px;
        }

        .faq-group:first-child {
          border-top: 0;
          padding-top: 8px;
        }

        .faq-group h2 {
          margin: 0 0 18px;
          color: #00D2FF;
          font-size: 13px;
          letter-spacing: .09em;
          font-weight: 800;
        }

        .faq-list {
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .faq-item {
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .faq-question {
          width: 100%;
          min-height: 66px;
          padding: 16px 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          border: 0;
          background: transparent;
          color: #FFFFFF;
          text-align: left;
          font-size: 18px;
          font-weight: 700;
          cursor: pointer;
        }

        .faq-q-text {
          flex: 1;
        }

        .faq-question:hover {
          color: #00D2FF;
        }

        .faq-icon {
          flex: 0 0 auto;
          width: 30px;
          height: 30px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(203, 213, 225, 0.2);
          border-radius: 50%;
          color: #00D2FF;
          transition: transform 0.25s ease, border-color 0.2s ease, background 0.2s ease;
        }

        .faq-icon.is-open {
          transform: rotate(180deg);
          border-color: #00D2FF;
          background: rgba(0, 210, 255, 0.12);
        }

        .faq-answer {
          padding: 8px 48px 22px 0;
        }

        .faq-answer p {
          margin: 0;
          color: #D5DBE7;
          font-size: 15.5px;
          line-height: 1.7;
        }

        @media (max-width: 700px) {
          .faq-shell {
            width: calc(100% - 28px);
            padding-top: 16px;
          }

          .faq-header {
            padding-bottom: 30px;
          }

          .faq-header h1 {
            font-size: 38px;
          }

          .faq-header p {
            font-size: 16px;
          }

          .faq-gradient-wrap {
            border-radius: 18px;
          }

          .faq-content {
            padding: 26px 22px 30px;
            border-radius: 16px;
          }

          .faq-group {
            padding-top: 27px;
          }

          .faq-group:first-child {
            padding-top: 4px;
          }

          .faq-question {
            min-height: 60px;
            font-size: 16px;
            padding: 14px 0;
          }

          .faq-answer {
            padding-right: 38px;
          }
        }

        @media (max-width: 450px) {
          .faq-header h1 {
            font-size: 32px;
          }

          .faq-question {
            font-size: 15px;
            gap: 12px;
          }

          .faq-icon {
            width: 27px;
            height: 27px;
            font-size: 18px;
          }
        }
        @media (max-width:700px){
          .faq-page::before{
            top:280px;
            width:520px;
            height:360px;
            opacity:.11;
            filter:blur(45px);
          }
        }

      `}</style>
    </main>
  );
}

export default FAQ;

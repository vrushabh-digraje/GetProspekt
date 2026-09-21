import { useState } from "react";

const faqGroups = [
  {
    title: "ABOUT GETPROSPEKT'S APPROACH",
    items: [
      "How do you work with our team?",
      "What's your process for understanding our target market?",
      "How do you establish qualification criteria?",
      "Can we adjust our strategy mid-campaign?",
    ],
  },
  {
    title: "ABOUT DELIVERY & RESULTS",
    items: [
      "What can we expect to receive?",
      "How do you measure success?",
      "What's your typical timeline to start seeing results?",
      "What if we're not satisfied with the leads we're receiving?",
    ],
  },
  {
    title: "ABOUT WORKING RELATIONSHIP",
    items: [
      "Do you work with multiple lead-gen vendors or exclusively?",
      "What's your communication cadence?",
      "How transparent is your reporting?",
      "What if we need to pause or end the engagement?",
    ],
  },
  {
    title: "ABOUT DIFFERENTIATION",
    items: [
      "How are you different from other lead-gen vendors?",
      "Do we have to buy all six solutions?",
      "Can we start with one service and add others later?",
    ],
  },
  {
    title: "ABOUT PARTNERSHIP",
    items: [
      "How do you handle data privacy and compliance?",
      "Do you have experience with our industry?",
      "Do you work with companies our size?",
      "What's the best way to get started?",
    ],
  },
];

function FAQ() {
  const [open, setOpen] = useState<string | null>(null);

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
                  {group.items.map((question) => {
                    const isOpen = open === question;

                    return (
                      <div
                        className={`faq-item ${isOpen ? "open" : ""}`}
                        key={question}
                      >
                        <button
                          type="button"
                          className="faq-question"
                          onClick={() =>
                            setOpen(isOpen ? null : question)
                          }
                          aria-expanded={isOpen}
                        >
                          <span>{question}</span>
                          <span className="faq-icon">
                            {isOpen ? "−" : "+"}
                          </span>
                        </button>

                        {isOpen && (
                          <div className="faq-answer">
                            <p>
                              Please contact GETprospeKt to discuss this
                              requirement and get an answer based on your
                              campaign specification.
                            </p>
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
          background: #fff;
          color: #17152a;
          font-family: var(--font-sans);
        }

        .faq-shell {
          width: min(1180px, calc(100% - 48px));
          margin: 0 auto;
          padding: 22px 0 80px;
        }

        .faq-back {
          border: 0;
          background: transparent;
          padding: 6px 0;
          margin-bottom: 28px;
          color: #17152a;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
        }

        .faq-back:hover {
          color: #6757d9;
        }

        .faq-header {
          max-width: 820px;
          padding-bottom: 42px;
        }

        .faq-eyebrow {
          color: #6757d9;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: .1em;
          text-transform: uppercase;
          margin-bottom: 12px;
        }

        .faq-header h1 {
          margin: 0;
          font-size: clamp(38px, 5vw, 64px);
          line-height: 1.03;
          letter-spacing: -.035em;
        }

        .faq-header p {
          margin: 18px 0 0;
          font-size: 19px;
          line-height: 1.55;
          color: #555262;
        }

        /*
          BLACK -> #A8A8F5
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
            #A8A8F5 100%
          );
          opacity:.12;
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
          background: #fff;
        }

        .faq-group {
          border-top: 1px solid #dcd9e5;
          padding: 34px 0 8px;
        }

        .faq-group:first-child {
          border-top: 0;
          padding-top: 8px;
        }

        .faq-group h2 {
          margin: 0 0 18px;
          color: #6757d9;
          font-size: 13px;
          letter-spacing: .09em;
          font-weight: 800;
        }

        .faq-list {
          border-top: 1px solid #e4e1eb;
        }

        .faq-item {
          border-bottom: 1px solid #e4e1eb;
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
          color: #17152a;
          text-align: left;
          font-size: 18px;
          font-weight: 700;
          cursor: pointer;
        }

        .faq-question:hover {
          color: #6757d9;
        }

        .faq-icon {
          flex: 0 0 auto;
          width: 30px;
          height: 30px;
          display: grid;
          place-items: center;
          border: 1px solid #c9c5db;
          border-radius: 50%;
          font-size: 20px;
          font-weight: 400;
        }

        .faq-answer {
          padding: 0 52px 20px 0;
        }

        .faq-answer p {
          margin: 0;
          color: #555262;
          font-size: 15px;
          line-height: 1.65;
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

import { useState } from "react";

const faqGroups: {
  title: string;
  items: { question: string; answer: string }[];
}[] = [
  {
    title: "ABOUT GETPROSPEKT'S APPROACH",
    items: [
      {
        question: "How do you work with our team?",
        answer:
          "We operate as a structured extension of your marketing and revenue organization. Before launching any outreach, we align with your stakeholders on target market parameters, buyer personas, qualification thresholds, and handoff workflows so every lead we deliver plugs directly into your existing sales or nurture process.",
      },
      {
        question: "What's your process for understanding our target market?",
        answer:
          "We start with a collaborative discovery and specification phase where we document your Ideal Customer Profile (ICP)—including industries, company size, geographic regions, technology stack, and buying committee roles. Our research team then builds and human-verifies a prospect universe strictly matched to those parameters.",
      },
      {
        question: "How do you establish qualification criteria?",
        answer:
          "Qualification criteria are defined jointly with your team before campaign launch. Whether you need MQLs (ICP fit plus verified engagement), SQLs (validated pain points and sales-readiness), or full BANT-qualified leads (confirmed Budget, Authority, Need, and Timing), we document the exact questions and thresholds required for sign-off.",
      },
      {
        question: "Can we adjust our strategy mid-campaign?",
        answer:
          "Yes. Because we monitor outreach engagement, objection patterns, and conversion rates continuously, we can refine targeting segments, messaging angles, or persona priorities mid-campaign in coordination with your team to maximize pipeline quality.",
      },
    ],
  },
  {
    title: "ABOUT DELIVERY & RESULTS",
    items: [
      {
        question: "What can we expect to receive?",
        answer:
          "Depending on your selected solution, you receive human-verified contact records, engaged MQLs, sales-ready SQLs, BANT-verified opportunities, confirmed calendar appointments, or qualified webinar registrations—each accompanied by complete firmographic data and qualification notes.",
      },
      {
        question: "How do you measure success?",
        answer:
          "We measure success against the exact campaign specification agreed upfront: 100% adherence to your ICP and qualification criteria, on-schedule lead or appointment delivery, verified contact accuracy, and downstream conversion into active sales conversations.",
      },
      {
        question: "What's your typical timeline to start seeing results?",
        answer:
          "Campaign setup, prospect research, and human verification typically take 5 to 10 business days. Initial qualified leads, registrations, or appointments begin flowing within the first 2 to 3 weeks of live outreach, with steady weekly delivery thereafter.",
      },
      {
        question: "What if we're not satisfied with the leads we're receiving?",
        answer:
          "Every lead is backed by our specification guarantee. If any delivered lead fails to meet a single agreed ICP or qualification requirement, we replace it promptly at no additional cost and recalibrate our QA filters immediately.",
      },
    ],
  },
  {
    title: "ABOUT WORKING RELATIONSHIP",
    items: [
      {
        question: "Do you work with multiple lead-gen vendors or exclusively?",
        answer:
          "We can work either as your exclusive outbound and demand-generation partner or alongside your internal SDR team and existing agencies. We coordinate suppression lists and account territories so there is never overlap or prospect fatigue.",
      },
      {
        question: "What's your communication cadence?",
        answer:
          "You are assigned a dedicated campaign manager who provides weekly performance updates, lead delivery batches, and campaign insights, along with scheduled review calls and on-demand Slack or email access whenever you need adjustments.",
      },
      {
        question: "How transparent is your reporting?",
        answer:
          "Completely transparent. Our reports detail how many accounts and prospects were researched, outreach volume across email and tele-calling, engagement metrics, qualification pass/fail breakdowns, and complete prospect-level notes for every delivered lead.",
      },
      {
        question: "What if we need to pause or end the engagement?",
        answer:
          "We build flexible campaign structures designed around clear milestones. If your product launch shifts or internal sales capacity changes, you can pause or reschedule campaign pacing with advance notice to align with your team's bandwidth.",
      },
    ],
  },
  {
    title: "ABOUT DIFFERENTIATION",
    items: [
      {
        question: "How are you different from other lead-gen vendors?",
        answer:
          "Most vendors optimize for raw lead volume using outdated static databases. GETprospeKt focuses on decision quality: every contact is human-verified prior to outreach, every campaign is built around your exact qualification level, and we never hand off unverified contacts.",
      },
      {
        question: "Do we have to buy all six solutions?",
        answer:
          "No. Our six core solutions—Human-Verified Data, MQL Generation, SQL Generation, BANT-Qualified Leads, Appointment Generation, and Webinar Campaigns—are completely modular. You only invest in the specific qualification level your pipeline needs right now.",
      },
      {
        question: "Can we start with one service and add others later?",
        answer:
          "Absolutely. Many clients begin with a focused pilot—such as Human-Verified Data or a single MQL/BANT campaign—and later expand into Appointment Generation or Webinar Campaigns once they see the quality of our targeting and execution.",
      },
    ],
  },
  {
    title: "ABOUT PARTNERSHIP",
    items: [
      {
        question: "How do you handle data privacy and compliance?",
        answer:
          "We adhere strictly to global data protection and outreach regulations, including GDPR, CCPA, and CAN-SPAM. All prospect research, verification, and multi-channel engagement follow compliant B2B legitimate-interest, opt-out, and suppression standards.",
      },
      {
        question: "Do you have experience with our industry?",
        answer:
          "We have extensive experience executing B2B campaigns across Enterprise SaaS, Cloud Infrastructure, Cybersecurity, FinTech, Manufacturing, Healthcare IT, Supply Chain, and MarTech—targeting C-suite, VP, Director, and technical decision-makers.",
      },
      {
        question: "Do you work with companies our size?",
        answer:
          "We partner with growth-stage B2B companies, mid-market leaders, and global enterprise organizations alike. Whether you need 35 executive sales appointments or 8,500 enterprise MQLs, we right-size the campaign specification to your goals.",
      },
      {
        question: "What's the best way to get started?",
        answer:
          "Reach out through our Contact page to schedule a brief specification call. Tell us about your target market, ideal buyer personas, and desired qualification level, and we will put together a tailored campaign plan and delivery timeline.",
      },
    ],
  },
];

function FAQ() {
  const [open, setOpen] = useState<string | null>(
    faqGroups[0]?.items[0]?.question || null
  );

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
                        <span className="faq-q-left">
                          <span className="faq-q-badge">Q</span>
                          <span>{question}</span>
                        </span>
                        <span className="faq-icon">
                          {isOpen ? "−" : "+"}
                        </span>
                      </button>

                      {isOpen && (
                        <div className="faq-answer">
                          <span className="faq-a-badge">A</span>
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

        .faq-q-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .faq-q-badge {
          flex-shrink: 0;
          width: 28px;
          height: 28px;
          border-radius: 7px;
          background: rgba(0, 210, 255, 0.14);
          border: 1px solid rgba(0, 210, 255, 0.35);
          color: #00D2FF;
          font-size: 13px;
          font-weight: 800;
          display: inline-flex;
          align-items: center;
          justify-content: center;
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
          font-size: 20px;
          font-weight: 400;
          color: #00D2FF;
        }

        .faq-answer {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 4px 52px 22px 0;
        }

        .faq-a-badge {
          flex-shrink: 0;
          width: 28px;
          height: 28px;
          border-radius: 7px;
          background: rgba(0, 212, 170, 0.14);
          border: 1px solid rgba(0, 212, 170, 0.35);
          color: #00D4AA;
          font-size: 13px;
          font-weight: 800;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-top: 2px;
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

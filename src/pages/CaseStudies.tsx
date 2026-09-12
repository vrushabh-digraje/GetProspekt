import { useMemo } from "react";

type CaseStudy = {
  slug: string; label: string; title: string; description: string; image: string;
  stats: [string, string][]; profile: string; objective: string;
  spec: string[]; executed: string[]; owned: string; client: string;
};

const caseStudies: CaseStudy[] = [
  {
    slug: "webinar-registrations-ai-business-process", label: "Case Study 1", title: "Targeted Outreach for an AI and Business-Process Webinar",
    description: "A US-focused webinar organizer targeting technology decision-makers needed high-quality registrations from a defined audience. GETprospeKt identified and engaged 1,500+ prospects matching the target specification, resulting in 192 webinar registrations and 23 attendees, with a 12% attendance rate.", image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=90",
    stats: [["1,500+", "Prospects identified and engaged"], ["192", "Webinar registrations"], ["23", "Attendees"], ["12%", "Attendance rate"]], profile: "Organizer of a US-focused webinar on AI in business processes, targeting technology professionals in managerial and senior-level roles.", objective: "Generate high-quality webinar registrations from a defined audience of technology decision-makers and influencers, not generic traffic.",
    spec: ["Audience: Technology professionals in the United States", "Seniority: Managerial and senior-level contacts", "Company size: 500+ employees", "Industries: Finance, manufacturing, retail, hospitality, and other technology-oriented business environments", "Relevance: Prospects whose roles made the webinar topic directly meaningful"], executed: ["Identified and reviewed prospects against the agreed audience specification", "Ran personalized email outreach focused on the webinar's core question", "Executed sequential follow-up through email and tele-calling", "Maintained strict adherence to the agreed audience and campaign criteria throughout"], owned: "Prospect identification, outreach, follow-up, and registration generation against the agreed specification.", client: "Event experience, content delivery, attendee engagement, and all downstream activity after registration."
  },
  {
    slug: "bant-lead-generation-enterprise-automation", label: "Case Study 2", title: "Targeted BANT Lead Generation for an Enterprise Automation Platform",
    description: "A global software company needed BANT-qualified leads over three months to feed their US sales team. GETprospeKt identified and qualified Technology and Marketing decision-makers using tele-calling, delivering 125 BANT-qualified leads across CIOs, CTOs, CMOs, and Marketing/IT Directors.", image: "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=1600&q=90",
    stats: [["125", "BANT-qualified leads delivered"], ["USA", "Geography"], ["3 months", "Campaign duration"], ["BANT", "Budget, Authority, Need, Timing verified"]], profile: "A global software company offering an enterprise automation platform designed for organizations seeking to improve workflow efficiency and operational productivity.", objective: "Generate 125 BANT-qualified leads over a three-month campaign from a defined audience of Technology and Marketing decision-makers in the United States.",
    spec: ["Geography: USA", "Company size: 250+ employees", "Campaign duration: 3 months", "Lead type: BANT-qualified leads", "BANT qualification: Budget, Authority, Need, Timing verified", "Outreach channel: Tele-calling", "Target audience: Technology and Marketing decision-makers", "Target roles: CIOs, CTOs, CMOs, Marketing Directors, IT Directors"], executed: ["Identified and researched Technology and Marketing decision-makers", "Executed targeted tele-calling against the defined prospect universe", "Conducted follow-up conversations and applied the agreed BANT qualification criteria", "Delivered leads with Budget, Authority, Need, and Timing verified"], owned: "Prospect identification, audience matching, tele-calling and follow-up, BANT qualification, and lead delivery.", client: "Sales follow-up after lead handoff."
  },
  {
    slug: "mql-generation-marcom-platform", label: "Case Study 3", title: "MQL Generation for a Marketing Communications Management Solution",
    description: "A MarCom platform provider needed high-volume MQLs within a 60-day campaign to feed their sales and nurture pipelines. GETprospeKt executed outreach to Marketing Communications professionals across enterprise and mid-market organizations in the USA, delivering 8,500 MQLs.", image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=90",
    stats: [["USA", "Geography"], ["MarCom", "Target audience"], ["60 days", "Campaign duration"], ["8,500", "MQLs delivered"]], profile: "A provider of a Marketing Communications Management platform designed for MarCom teams managing content planning, brand governance, campaign execution, and performance measurement.", objective: "Generate a consistent flow of marketing-qualified leads among Marketing Communications professionals across enterprise and mid-market organizations in the United States.",
    spec: ["Audience: Marketing Communications and related marketing professionals", "Seniority: VP/SVP, Director/Sr. Director, Manager/Sr. Manager", "Geography: USA", "Company segment: Enterprise and mid-market organizations", "Campaign period: 60 days", "Lead type: MQL (Marketing-Qualified Leads)", "Qualification criteria: ICP fit + demonstrated engagement with outreach", "Channel: Email and tele-calling outreach and follow-up"], executed: ["Identified and targeted Marketing Communications professionals", "Executed outreach to prospects matching the defined USA market", "Followed up through email and tele-calling", "Qualified prospects who demonstrated engagement", "Delivered MQLs against the campaign specification"], owned: "Audience targeting, prospect identification, outreach execution, follow-up, engagement qualification, and MQL delivery.", client: "Sales engagement after handoff, downstream nurture, opportunity management, and revenue generation."
  },
  {
    slug: "sql-generation-multi-cloud", label: "Case Study 4", title: "Survey-Led SQL Generation for a Multi-Cloud Management Platform",
    description: "A cloud storage solutions provider needed to identify and qualify enterprise decision-makers with active cloud migration requirements. GETprospeKt used a structured Value-Add Assessment to capture qualification data from 3,000+ prospects, delivering 92 SQLs.", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=90",
    stats: [["USA", "Target market"], ["Mid-to-large", "Target company segment"], ["3 months", "Campaign duration"], ["92", "SQLs delivered"]], profile: "A cloud storage solutions provider offering a Hybrid Multi-Cloud Management Platform for mid-to-large enterprises.", objective: "Generate and qualify leads by identifying decision-makers with active cloud migration or optimization requirements.",
    spec: ["Audience: Decision-makers involved in cloud infrastructure and management", "Target market: Mid-to-large enterprises", "Industries: Financial services, healthcare, manufacturing, logistics", "Geography: USA", "Campaign duration: 3 months", "Qualification approach: Structured Value-Add Assessment", "Lead type: Sales Qualified Leads (SQL)"], executed: ["Identified prospects within the agreed enterprise audience", "Used a structured Value-Add Assessment", "Captured qualification information", "Evaluated responses against agreed criteria", "Distinguished higher-intent prospects from information seekers", "Delivered SQLs to the client"], owned: "Audience targeting, prospect identification, assessment execution, qualification data collection, SQL identification, and handoff.", client: "Sales follow-up after handoff, opportunity management, further nurture, negotiation and closing."
  },
  {
    slug: "appointment-generation-engineering", label: "Case Study 5", title: "Appointment Generation for a Cloud-Based Design and Engineering Solution",
    description: "An engineering software provider needed qualified sales appointments with manufacturing design and engineering decision-makers. GETprospeKt executed targeted cold calling across 4,000 validated contacts, delivering 35 confirmed appointments (110% of KPI).", image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=90",
    stats: [["USA", "Region"], ["4 months", "Campaign duration"], ["4,000", "Initial database"], ["35", "Appointments booked"], ["110%", "KPI achievement"]], profile: "A global engineering software provider offering a cloud-based design and engineering platform for the manufacturing sector.", objective: "Generate qualified sales appointments in the US manufacturing market for a cloud-based design and engineering solution.",
    spec: ["Campaign type: Appointment generation", "Region: USA", "Industry: SaaS / Engineering Software", "Target sector: Manufacturing", "Target segments: Furniture and consumer product manufacturing", "Target personas: Design and Engineering decision-makers", "Campaign duration: 4 months", "Initial database: 4,000 contacts", "Outreach channel: Cold calling"], executed: ["Audited the initial database against the agreed target profile", "Validated contacts and filtered out prospects that did not match", "Researched and enriched relevant contacts", "Developed persona-specific calling approaches", "Built objection-handling approaches", "Executed targeted cold calling and repeated follow-up", "Generated qualified appointments and handed them to the sales team"], owned: "Database validation, ICP filtering, contact research, persona identification, calling execution, follow-up, and appointment generation.", client: "Sales conversations after appointment handoff, opportunity management, demonstrations, negotiation and closing."
  }
];

function CaseStudies() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/case-studies";
  const slug = path.startsWith("/case-studies/") ? path.replace("/case-studies/", "") : "";
  const selected = useMemo(
    () => caseStudies.find((item) => item.slug === slug) || caseStudies[0],
    [slug]
  );

  const related = caseStudies.filter((item) => item.slug !== selected.slug).slice(0, 4);

  return (
    <main className="case-page">
      <div className="case-container">
        <div className="case-grid">

          <article className="case-article">

            {/* ================= ARTICLE HEADER ================= */}
            <header className="case-header">
              <h1>{selected.title}</h1>

              <div className="case-byline">
                By <strong>GETprospeKt</strong>
                <span>|</span>
                Case Study
                <span>|</span>
                Sep 10, 2026
              </div>

              <div className="case-social">
                <button className="share-symbol" aria-label="Share">●</button>
                <button aria-label="Facebook">f</button>
                <button aria-label="Twitter">♥</button>
                <button
                  aria-label="LinkedIn"
                  onClick={() =>
                    window.open(
                      "https://www.linkedin.com/sharing/share-offsite/?url=" +
                        encodeURIComponent(window.location.href),
                      "_blank"
                    )
                  }
                >
                  in
                </button>
              </div>
            </header>

            {/* ================= REFERENCE HERO ================= */}
            <section className="reference-hero">

              {/* Right-side editorial image */}
              <div className="reference-media">
                <img src={selected.image} alt={selected.title} />
              </div>

              {/* White editorial content */}
              <div className="reference-copy">
                <div className="reference-label">CASE STUDY</div>

                {/* Title is deliberately placed in the black
                    horizontal editorial panel, matching the reference. */}
                <div className="reference-title-panel">
                  <h2>{selected.title}</h2>
                </div>

                <div className="reference-divider" />

                <p>{selected.description}</p>
              </div>

            </section>

            {/* ================= EXISTING CASE STUDY CONTENT ================= */}

            <p className="case-intro">{selected.description}</p>

            <section className="case-section">
              <h2>Client Profile</h2>
              <p>{selected.profile}</p>
            </section>

            <section className="case-section">
              <h2>Objective</h2>
              <p>{selected.objective}</p>
            </section>

            <section className="case-section">
              <h2>Campaign Specification</h2>
              <ul>
                {selected.spec.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="case-section">
              <h2>What GETprospeKt Executed</h2>
              <ul>
                {selected.executed.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="case-section">
              <h2>Results</h2>

              <div className="case-stats">
                {selected.stats.map(([value, label]) => (
                  <div className="case-stat" key={value + label}>
                    <strong>{value}</strong>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="case-section">
              <h2>Ownership &amp; Handoff</h2>

              <div className="ownership-grid">
                <div>
                  <h3>GETprospeKt owned:</h3>
                  <p>{selected.owned}</p>
                </div>

                <div>
                  <h3>Client owned:</h3>
                  <p>{selected.client}</p>
                </div>
              </div>
            </section>

            <section className="case-cta">
              <h2>Want results like this?</h2>
              <p>Let's discuss your campaign specification.</p>
              <a href="/contact">Get in Touch</a>
            </section>

          </article>

          {/* ================= RELATED CONTENT ================= */}
          <aside className="related-content">
            <h2>Related Content</h2>

            {related.map((item) => (
              <article className="related-card" key={item.slug}>
                <h3>
                  <a href={"/case-studies/" + item.slug}>
                    {item.title}
                  </a>
                </h3>

                <div className="related-byline">
                  By <strong>GETprospeKt</strong> | Case Study
                </div>

                <p>{item.description}</p>
              </article>
            ))}
          </aside>

        </div>
      </div>

      <style>{`
        /* =========================================================
           CASE STUDY PAGE — REFERENCE SCREENSHOT STRUCTURE
           ========================================================= */

        .case-page{
          width:100%;
          min-height:100vh;
          background:#fff;
          color:#111;
         font-family: Garamond, serif;
          overflow-x:hidden;
        }

        .case-container{
          width:min(1530px,calc(100% - 64px));
          margin:0 auto;
          padding:22px 0 80px;
        }

        .case-grid{
          display:grid;
          grid-template-columns:minmax(0,1fr) 375px;
          column-gap:16px;
          align-items:start;
        }

        .case-article{
          min-width:0;
        }

        /* =========================================================
           HEADER
           ========================================================= */

        .case-header{
          position:relative;
          min-height:163px;
          padding:0 0 18px;
        }

        .case-header h1{
          margin:0;
          max-width:1120px;
          color:#17273c;
          font-size:44px;
          line-height:1.075;
          letter-spacing:-1.5px;
          font-weight:700;
        }

        .case-byline{
          display:flex;
          align-items:center;
          flex-wrap:wrap;
          gap:8px;
          margin-top:20px;
          color:#111;
          font-size:14px;
          line-height:1.4;
        }

        .case-byline strong{
          font-weight:800;
        }

        .case-social{
          position:absolute;
          right:0;
          bottom:25px;
          display:flex;
          align-items:center;
          gap:7px;
        }

        .case-social button{
          width:32px;
          height:32px;
          padding:0;
          border:0;
          border-radius:0;
          background:#1688dc;
          color:#fff;
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:17px;
          font-weight:800;
          cursor:pointer;
        }

        .case-social .share-symbol{
          width:28px;
          background:#fff;
          color:#111;
          font-size:18px;
        }

        /* =========================================================
           HERO
           ========================================================= */

        /* =========================================================
           REFERENCE HERO — SAME EDITORIAL STRUCTURE
           ========================================================= */

        .reference-hero{
          position:relative;
          width:100%;
          height:690px;
          overflow:hidden;
          background:#fff;
        }

        /*
         * RIGHT IMAGE
         * Large portrait/editorial image, flush to the right.
         */
        .reference-media{
          position:absolute;
          z-index:1;
          right:0;
          top:0;
          width:43%;
          height:100%;
          overflow:hidden;
          background:#eee;
        }

        .reference-media img{
          display:block;
          width:100%;
          height:100%;
          object-fit:cover;
          object-position:center;
        }

        /*
         * LEFT WHITE CONTENT AREA
         */
        .reference-copy{
          position:absolute;
          z-index:5;
          left:0;
          top:0;
          width:100%;
          height:100%;
          pointer-events:none;
        }

        .reference-label{
          position:absolute;
          left:42px;
          top:42px;
          margin:0;
          padding:0 0 10px;

          color:#111;
          font-size:18px;
          line-height:1;
          font-weight:800;
          letter-spacing:.1px;

          border-bottom:2px solid #111;
          pointer-events:auto;
        }

        /*
         * BLACK TITLE PANEL
         *
         * It intentionally crosses from the white area into the
         * photograph, exactly like the supplied reference screenshot.
         */
        .reference-title-panel{
          position:absolute;
          left:0;
          top:275px;

          width:58%;
          min-height:150px;

          box-sizing:border-box;
          padding:38px 42px;

          background:linear-gradient(115deg, #000000 0%, #000000 42%, #96AEFC 100%);
          display:flex;
          align-items:center;

          pointer-events:auto;
        }

        .reference-copy h2{
          margin:0;
          max-width:760px;

          color:#fff;
          font-size:32px;
          line-height:1.16;
          letter-spacing:-.4px;
          font-weight:700;
        }

        /*
         * Divider belongs below the black title panel on the white
         * side, matching the editorial layout.
         */
        .reference-divider{
          position:absolute;
          left:42px;
          top:455px;

          width:390px;
          height:2px;

          margin:0;
          background:linear-gradient(
            90deg,
            #111 0%,
            #111 55%,
            rgba(17,17,17,.22) 82%,
            transparent 100%
          );
        }

        .reference-copy p{
          position:absolute;
          left:42px;
          top:505px;

          width:475px;
          max-width:calc(100% - 70px);

          margin:0;

          color:#2b2b2b;
          font-size:18px;
          line-height:1.5;
          font-weight:600;

          pointer-events:auto;
        }

        /*
         * No circular ring is used here. The reference screenshot's
         * key visual is the black horizontal editorial title panel.
         */
        .reference-ring,
        .reference-ring-cutout,
        .media-ring-tail{
          display:none !important;
        }

        /* =========================================================
           EXISTING CONTENT
           ========================================================= */

        .case-intro{
          margin:30px 0 45px;
          color:#30313b;
          font-size:18px;
          line-height:1.65;
        }

        .case-section{
          padding:30px 0;
          border-top:1px solid #e3e3e3;
        }

        .case-section h2{
          margin:0 0 15px;
          color:#111;
          font-size:28px;
          line-height:1.15;
        }

        .case-section p{
          margin:0;
          color:#3d3d47;
          font-size:16px;
          line-height:1.7;
        }

        .case-section ul{
          margin:0;
          padding-left:22px;
        }

        .case-section li{
          margin:10px 0;
          color:#3d3d47;
          font-size:16px;
          line-height:1.55;
        }

        .case-stats{
          display:grid;
          grid-template-columns:repeat(4,1fr);
          gap:12px;
        }

        .case-stat{
          min-height:110px;
          padding:20px 16px;
          border:1px solid #dedaf0;
          border-radius:8px;
          background:#faf9ff;
          display:flex;
          flex-direction:column;
          justify-content:center;
        }

        .case-stat strong{
          margin-bottom:8px;
          color:#6757d9;
          font-size:28px;
          line-height:1;
        }

        .case-stat span{
          color:#4d4a5b;
          font-size:13px;
          line-height:1.35;
        }

        .ownership-grid{
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:18px;
        }

        .ownership-grid>div{
          padding:20px;
          background:#f7f6fd;
          border-radius:8px;
        }

        .ownership-grid h3{
          margin:0 0 8px;
          font-size:16px;
        }

        .case-cta{
          margin-top:30px;
          padding:34px;
          border-radius:10px;
          background:linear-gradient(
            115deg,
            #000 0%,
            #111 35%,
            #676b8b 70%,
            #b7bfff 100%
          );
          color:#fff;
        }

        .case-cta h2{
          margin:0 0 8px;
        }

        .case-cta p{
          margin:0 0 20px;
          color:#fff;
        }

        .case-cta a{
          display:inline-flex;
          padding:11px 18px;
          border-radius:5px;
          background:#fff;
          color:#111;
          text-decoration:none;
          font-weight:800;
        }

        /* =========================================================
           RELATED CONTENT
           ========================================================= */

        .related-content{
          min-width:0;
          border-left:1px solid #d7d7d7;
          padding-left:14px;
          position:sticky;
          top:0;
        }

        .related-content>h2{
          margin:0;
          padding:0 0 12px;
          border-bottom:1px solid #c9c9c9;
          color:#111;
          font-size:27px;
          line-height:1.1;
          font-weight:700;
        }

        .related-card{
          padding:36px 0 17px;
          margin:0;
          border-bottom:1px solid #dedede;
        }

        .related-card h3{
          margin:0 0 11px;
          color:#111;
          font-size:21px;
          line-height:1.08;
          font-weight:700;
        }

        .related-card h3 a{
          color:#111;
          text-decoration:none;
        }

        .related-card h3 a:hover{
          color:#6757d9;
        }

        .related-byline{
          margin-bottom:9px;
          color:#111;
          font-size:13px;
          line-height:1.35;
        }

        .related-card p{
          margin:0;
          color:#171717;
          font-size:14px;
          line-height:1.43;
          display:-webkit-box;
          -webkit-line-clamp:3;
          -webkit-box-orient:vertical;
          overflow:hidden;
        }

        /* =========================================================
           TABLET
           ========================================================= */

        @media(max-width:1100px){
          .case-container{
            width:calc(100% - 36px);
          }

          .case-grid{
            grid-template-columns:1fr;
          }

          .related-content{
            position:static;
            border-left:0;
            border-top:1px solid #d7d7d7;
            padding:28px 0 0;
          }
        }

        /* =========================================================
           MOBILE
           ========================================================= */

        @media(max-width:700px){
          .case-container{
            width:calc(100% - 24px);
            padding-top:14px;
          }

          .case-header{
            min-height:0;
            padding-bottom:18px;
          }

          .case-header h1{
            font-size:31px;
            line-height:1.08;
            letter-spacing:-.6px;
          }

          .case-byline{
            margin-top:14px;
            font-size:13px;
          }

          .case-social{
            position:static;
            justify-content:flex-start;
            margin-top:15px;
          }

          .reference-hero{
            height:auto;
            min-height:0;
            overflow:hidden;
          }

          .reference-copy{
            position:absolute;
            left:0;
            top:0;
            width:100%;
            height:100%;
          }

          .reference-label{
            margin-bottom:42px;
            font-size:16px;
          }

          .reference-copy h2{
            max-width:100%;
            font-size:30px;
          }

          .reference-divider{
            width:88%;
            margin:28px 0 30px;
          }

          .reference-copy p{
            max-width:100%;
            font-size:16px;
          }

          .reference-media{
            position:absolute;
            top:0;
            right:0;
            width:100%;
            height:100%;
          }

          .reference-media img{
            width:100%;
            height:100%;
            object-fit:cover;
            object-position:center;
          }

          .reference-ring{
            left:0;
            right:0;
            top:0;
            width:100%;
            height:100%;
            border-radius:0;
            transform:none;
          }

          .reference-ring-cutout{
            display:none;
          }

          .media-ring-tail{
            left:8%;
            bottom:350px;
            width:105px;
            height:72px;
          }

          .case-intro{
            margin:25px 0 35px;
            font-size:16px;
          }

          .case-section{
            padding:24px 0;
          }

          .case-section h2{
            font-size:21px;
          }

          .case-stats,
          .ownership-grid{
            grid-template-columns:1fr;
          }

          .related-card{
            padding-top:25px;
          }

          .related-card h3{
            font-size:20px;
          }
        }
        @media(max-width:700px){
          .reference-hero{
            height:620px;
          }

          .reference-media{
            width:100%;
            height:100%;
          }

          .reference-copy{
            width:100%;
            height:100%;
          }

          .reference-label{
            left:24px;
            top:28px;
            font-size:15px;
          }

          .reference-title-panel{
            left:0;
            top:250px;
            width:88%;
            min-height:130px;
            padding:28px 24px;
          }

          .reference-copy h2{
            font-size:22px;
            line-height:1.15;
          }

          .reference-divider{
            left:24px;
            top:405px;
            width:75%;
          }

          .reference-copy p{
            left:24px;
            top:445px;
            width:78%;
            max-width:78%;
            font-size:16px;
            line-height:1.45;
          }
        }
      `}
        </style>
    </main>
  );
}

export { caseStudies };
export default CaseStudies;

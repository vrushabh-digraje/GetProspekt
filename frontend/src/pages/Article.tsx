import { Link, useParams } from "react-router-dom";

type Section = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  faqs?: { question: string; answer: string }[];
};

type ArticleData = {
  slug: string;
  category: string;
  title: string;
  author: string;
  date: string;
  description: string;

  heroImage?: string;

  heroAuthorImage?: string;
  heroAuthorName?: string;
  heroAuthorRole?: string;
  company?: string;

  isGuestAuthor?: boolean;

  intro?: string;

  sections: Section[];

  authorBio?: string;
};

export const articles: ArticleData[] = [

  /* =====================================================
     GUEST AUTHOR 1
     ===================================================== */

  {
    slug: "guest-first-party-data",

    category: "Guest Author",

    title:
      "Activating High-Value Audiences With First Party Data",

    author: "Aafreen Shaikh",

    date: "Jul 2, 2026",

    description:
      "Discover effective strategies to activate high-value audiences while safeguarding sensitive customer information and improving marketing relevance.",

    heroAuthorImage:
      "https://randomuser.me/api/portraits/men/32.jpg",

    heroAuthorName:
      "Nick Henthorn",

    heroAuthorRole:
      "Global Head of InfoSum, WPP",

    company: "INFOSUM",

    isGuestAuthor: true,

    intro:
      "As brands work to create more relevant customer experiences, first-party data has become one of the most important foundations for modern marketing. In this interview, Nick Henthorn discusses how organizations can activate valuable audiences while maintaining strong privacy and governance practices.",

    sections: [

      {
        heading:
          "Why First-Party Data Matters",

        paragraphs: [
          "First-party data gives organizations direct insight into the people and businesses interacting with their products, services and digital experiences.",

          "Unlike data collected from unknown external sources, first-party information is generated through relationships that brands already have with their customers. This makes it particularly valuable for understanding intent, preferences and engagement.",

          "As the digital advertising ecosystem becomes more privacy-conscious, organizations are increasingly looking for ways to make their own customer relationships more useful."
        ]
      },

      {
        heading:
          "Activating High-Value Audiences",

        paragraphs: [
          "Audience activation starts with identifying the customer signals that matter most to a particular business.",

          "Purchase history, engagement behavior, product interest and customer lifecycle information can be combined to create audience groups that are more meaningful than broad demographic segments.",

          "The objective is to help marketing teams focus resources on audiences that are most likely to create measurable business value."
        ],

        bullets: [
          "Identify valuable customer signals",
          "Create meaningful audience segments",
          "Connect audience insights with campaign activation",
          "Measure performance continuously",
          "Improve audiences using new first-party signals"
        ]
      },

      {
        heading:
          "Privacy and Responsible Data Use",

        paragraphs: [
          "Effective first-party data strategies require more than collecting information. Organizations also need clear rules around consent, governance, access and usage.",

          "Customers increasingly expect brands to explain how their information is being used. Transparent practices can therefore become an important part of the overall customer relationship.",

          "Responsible activation allows organizations to create more useful experiences without treating personalization as an excuse for unnecessary data collection."
        ]
      },

      {
        heading:
          "Creating Better Customer Experiences",

        paragraphs: [
          "When first-party information is used responsibly, marketing teams can move from generic communication toward experiences that reflect a customer's actual relationship with the brand.",

          "This can improve message relevance, reduce wasted impressions and create stronger connections across channels.",

          "The most effective programs combine technology with human judgment. Data should support decisions rather than completely replace the understanding marketers have of their customers."
        ]
      }
    ],

    authorBio:
      "Aafreen Shaikh is an experienced technology and business writer who focuses on emerging marketing technologies, digital transformation, AI and evolving customer experience strategies."
  },


  /* =====================================================
     GUEST AUTHOR 2
     ===================================================== */

  {
    slug: "guest-ai-driven-cmos",

    category: "Guest Author",

    title:
      "How CMOs Are Driving Success in an AI-Driven World",

    author: "Aafreen Shaikh",

    date: "May 20, 2026",

    description:
      "Discover how modern CMOs are leveraging AI to improve customer understanding, accelerate innovation and create measurable business impact.",

    heroAuthorImage:
      "https://randomuser.me/api/portraits/men/41.jpg",

    heroAuthorName:
      "Charlie Parker",

    heroAuthorRole:
      "Chief Marketing Officer at Medallia",

    company: "MEDALLIA",

    isGuestAuthor: true,

    intro:
      "Artificial intelligence is moving from experimentation into the core of marketing operations. For CMOs, the challenge is no longer simply deciding whether to use AI, but determining where it can create meaningful business value.",

    sections: [

      {
        heading:
          "The Changing Role of the CMO",

        paragraphs: [
          "Marketing leaders are increasingly expected to understand technology, customer data and business performance at the same time.",

          "AI adds another layer to this responsibility by giving marketing organizations new ways to analyze customer behavior and automate repetitive work.",

          "The strongest leaders are approaching AI as an organizational capability rather than a collection of disconnected tools."
        ]
      },

      {
        heading:
          "Using AI to Understand Customers",

        paragraphs: [
          "Customer interactions generate enormous amounts of information across websites, applications, support channels, campaigns and physical experiences.",

          "AI can help marketing teams organize these signals and identify patterns that may be difficult to detect manually.",

          "This creates opportunities to understand customer needs earlier and respond with more relevant experiences."
        ],

        bullets: [
          "Customer sentiment analysis",
          "Predictive customer behavior",
          "Automated audience analysis",
          "Campaign optimization",
          "Personalized engagement"
        ]
      },

      {
        heading:
          "Building an AI-Ready Marketing Organization",

        paragraphs: [
          "Technology alone does not create an AI-ready marketing organization. Teams also need processes, governance and clear ownership.",

          "CMOs must determine which decisions should be automated and which require human oversight.",

          "A practical AI strategy therefore combines automation with accountability."
        ]
      },

      {
        heading:
          "Measuring Business Impact",

        paragraphs: [
          "The success of AI initiatives should ultimately be evaluated against business outcomes.",

          "Marketing teams need to understand whether AI is improving efficiency, increasing engagement, reducing costs or contributing to revenue growth.",

          "This requires measurement frameworks that connect technology adoption with measurable performance."
        ]
      }
    ],

    authorBio:
      "Aafreen Shaikh covers technology, marketing leadership and emerging business trends, with a focus on how innovation changes the role of modern marketing organizations."
  },


  /* =====================================================
     GUEST AUTHOR 3
     ===================================================== */

  {
    slug: "guest-ai-native-marketing",

    category: "Guest Author",

    title:
      "From AI Tools to AI-Native Marketing: How CMOs Are Building for the Next Era of Growth",

    author: "Aafreen Shaikh",

    date: "May 4, 2026",

    description:
      "Learn how marketing leaders are moving beyond isolated AI tools and preparing their organizations for an AI-native operating model.",

    heroAuthorImage:
      "https://randomuser.me/api/portraits/men/45.jpg",

    heroAuthorName:
      "Jason Widup",

    heroAuthorRole:
      "Interim CMO at Archive",

    company: "ARCHIVE",

    isGuestAuthor: true,

    intro:
      "The marketing industry is moving from isolated AI experiments toward broader AI-native operating models. This transition requires CMOs to rethink processes, people, technology and measurement.",

    sections: [

      {
        heading:
          "Beyond AI Experiments",

        paragraphs: [
          "Many marketing organizations began their AI journey by experimenting with individual productivity tools.",

          "These experiments can produce useful results, but they often operate independently from the larger marketing technology stack.",

          "AI-native marketing requires a deeper integration between intelligence, workflows and decision-making."
        ]
      },

      {
        heading:
          "Designing AI-Native Workflows",

        paragraphs: [
          "AI-native organizations redesign processes around what intelligent systems can do rather than simply inserting AI into existing workflows.",

          "This can change how teams conduct research, develop content, analyze performance and manage customer engagement.",

          "The result is a marketing organization that can move faster while keeping strategic decisions under human control."
        ],

        bullets: [
          "Automated research",
          "Intelligent content workflows",
          "Real-time campaign analysis",
          "Predictive recommendations",
          "Human-in-the-loop decision making"
        ]
      },

      {
        heading:
          "The New Role of Marketing Teams",

        paragraphs: [
          "As repetitive work becomes increasingly automated, marketers can spend more time on strategy, creativity and customer understanding.",

          "This does not eliminate the need for marketing expertise. Instead, it changes where expertise is applied."
        ]
      },

      {
        heading:
          "Preparing for the Next Era",

        paragraphs: [
          "The organizations that benefit most from AI will be those that prepare their people and operating models alongside their technology.",

          "CMOs therefore have an important role in defining the principles that determine how AI is adopted across marketing."
        ]
      }
    ],

    authorBio:
      "Aafreen Shaikh writes about marketing leadership, AI adoption, technology strategy and the changing operating models of modern businesses."
  },


  /* =====================================================
     GUEST AUTHOR 4
     ===================================================== */

  {
    slug: "guest-ai-marketing-advertising",

    category: "Guest Author",

    title:
      "How AI Is Transforming Marketing and Advertising",

    author: "Aafreen Shaikh",

    date: "Apr 30, 2026",

    description:
      "Explore how artificial intelligence is transforming campaign planning, advertising operations, customer engagement and marketing measurement.",

    heroAuthorImage:
      "https://randomuser.me/api/portraits/women/44.jpg",

    heroAuthorName:
      "Erin McCallion",

    heroAuthorRole:
      "Chief Marketing Officer of Perion",

    company: "PERION",

    isGuestAuthor: true,

    intro:
      "AI is reshaping advertising and marketing by enabling teams to process more information, automate complex operations and make faster decisions.",

    sections: [

      {
        heading:
          "AI and Modern Advertising",

        paragraphs: [
          "Advertising organizations operate across an increasingly fragmented ecosystem of platforms, audiences and formats.",

          "AI can help marketing teams analyze campaign signals and identify opportunities across these environments.",

          "The technology is also changing how creative assets are developed, tested and optimized."
        ]
      },

      {
        heading:
          "Improving Campaign Performance",

        paragraphs: [
          "AI systems can evaluate large volumes of campaign data and surface patterns that may otherwise take marketing teams significant time to discover.",

          "These insights can be used to improve targeting, creative selection, budget allocation and campaign timing."
        ],

        bullets: [
          "Automated campaign analysis",
          "Creative optimization",
          "Audience intelligence",
          "Budget recommendations",
          "Performance forecasting"
        ]
      },

      {
        heading:
          "Balancing Automation With Human Judgment",

        paragraphs: [
          "While AI can automate many operational tasks, human expertise remains essential for brand strategy and creative direction.",

          "The most effective marketing organizations use AI to increase the capabilities of their teams rather than completely remove human decision-making."
        ]
      },

      {
        heading:
          "What Comes Next",

        paragraphs: [
          "As AI capabilities continue to develop, marketing organizations will increasingly compete on how effectively they combine technology, data and human creativity.",

          "The organizations that establish clear governance and strong operating models will be better positioned to capture the benefits of intelligent marketing."
        ]
      }
    ],

    authorBio:
      "Aafreen Shaikh covers the intersection of technology, marketing and business strategy, with particular interest in AI-driven transformation."
  },


  /* =====================================================
     GUEST AUTHOR 5
     ===================================================== */

  {
    slug: "guest-customer-trust",

    category: "Guest Author",

    title:
      "Building Customer Trust in an Era of Intelligent Personalization",

    author: "Aafreen Shaikh",

    date: "Apr 18, 2026",

    description:
      "Explore how brands can balance intelligent personalization with transparency, consent and meaningful customer relationships.",

    heroAuthorImage:
      "https://randomuser.me/api/portraits/women/49.jpg",

    heroAuthorName:
      "Tilman Harmeling",

    heroAuthorRole:
      "Staff of Strategy and Market Intelligence at Usercentrics",

    company: "USERCENTRICS",

    isGuestAuthor: true,

    intro:
      "Personalization has become one of the most important applications of customer data and AI. At the same time, brands must ensure that personalization does not compromise consumer trust.",

    sections: [

      {
        heading:
          "The Personalization Opportunity",

        paragraphs: [
          "Modern brands can use customer signals to create experiences that are more relevant to individual needs and interests.",

          "Machine learning can analyze browsing behavior, purchase history and contextual signals to support more personalized journeys.",

          "However, better personalization also creates greater expectations around responsible data use."
        ]
      },

      {
        heading:
          "Why Transparency Matters",

        paragraphs: [
          "Customers want useful experiences, but they also want to understand how information about them is being used.",

          "Transparency helps customers make informed decisions and can become an important part of a trustworthy digital relationship."
        ],

        bullets: [
          "Clear privacy communication",
          "Meaningful consent",
          "Responsible personalization",
          "Strong data governance",
          "Customer control"
        ]
      },

      {
        heading:
          "The Trust Premium",

        paragraphs: [
          "Trust can influence how customers perceive a brand's use of technology.",

          "When customers understand and value the experience being created, personalization can become a competitive advantage rather than a source of concern."
        ]
      },

      {
        heading:
          "Building Responsible Personalization",

        paragraphs: [
          "Responsible personalization requires collaboration between marketing, legal, technology and customer experience teams.",

          "Organizations that build privacy and transparency into their personalization strategy from the beginning can create stronger long-term relationships."
        ]
      }
    ],

    authorBio:
      "Aafreen Shaikh is a technology and business writer covering AI, marketing, customer experience and digital transformation."
  },


  /* =====================================================
     GUEST AUTHOR 6
     ===================================================== */

  {
    slug: "guest-data-driven-leadership",

    category: "Guest Author",

    title:
      "The Future of Data-Driven Marketing Leadership",

    author: "Aafreen Shaikh",

    date: "Apr 8, 2026",

    description:
      "Marketing leaders are combining data, technology and human judgment to build stronger customer experiences and more accountable growth strategies.",

    heroAuthorImage:
      "https://randomuser.me/api/portraits/women/65.jpg",

    heroAuthorName:
      "Erin McCallion",

    heroAuthorRole:
      "Chief Marketing Officer",

    company: "MARKETING LEADERS",

    isGuestAuthor: true,

    intro:
      "Data has become central to marketing leadership. But effective data-driven organizations do more than collect information: they create systems that turn information into decisions.",

    sections: [

      {
        heading:
          "From Data Collection to Decision Making",

        paragraphs: [
          "Marketing organizations have access to more data than ever before.",

          "The challenge is no longer simply obtaining information but determining which signals should influence business decisions.",

          "Strong measurement frameworks help leaders separate useful insights from noise."
        ]
      },

      {
        heading:
          "Connecting Marketing to Business Outcomes",

        paragraphs: [
          "Marketing leaders increasingly need to demonstrate how campaigns contribute to broader organizational objectives.",

          "This requires measurement systems that connect customer activity with commercial outcomes."
        ],

        bullets: [
          "Revenue contribution",
          "Customer acquisition",
          "Customer retention",
          "Engagement quality",
          "Campaign efficiency"
        ]
      },

      {
        heading:
          "The Human Side of Data",

        paragraphs: [
          "Data does not replace leadership judgment.",

          "Experienced marketing leaders use quantitative evidence together with customer understanding, market knowledge and creative thinking.",

          "The combination of technology and human judgment remains essential."
        ]
      },

      {
        heading:
          "The Next Generation of Marketing Leadership",

        paragraphs: [
          "Future marketing leaders will need to be comfortable working across technology, analytics, customer experience and business strategy.",

          "The ability to turn complex information into clear action will become one of the most valuable leadership skills."
        ]
      }
    ],

    authorBio:
      "Aafreen Shaikh focuses on technology, marketing leadership and the evolving relationship between data, customer experience and business growth."
  },


  /* =====================================================
     NORMAL ARTICLES
     ===================================================== */


  {
    slug: "better-pipeline-starts-with-better-decisions",
    category: "B2B Lead Generation",
    title: "Better Pipeline Starts with Better Decisions",
    author: "GETprospeKt",
    date: "Sep 11, 2026",
    description:
      "GETprospeKt helps marketing teams turn their target market into qualified leads through human-verified data, targeted research, qualification and campaign execution.",
    heroImage:
      "https://plus.unsplash.com/premium_photo-1661340603772-1ae4ff9afcb1?q=80&w=1472&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    intro:
      "Better pipeline starts with better decisions. Instead of treating lead generation as a race for lead volume, GETprospeKt focuses on the right target market, the right decision-makers, the right qualification criteria and the right execution.",
    sections: [
      {
        heading: "Who We Work With",
        paragraphs: [
          "GETprospeKt works with Director-level and above marketing, growth and demand-generation leaders at B2B companies who need reliable, qualified lead generation.",
          "The focus is on teams that are accountable for pipeline growth, revenue contribution and measurable marketing outcomes—not simply lead volume."
        ]
      },
      {
        heading: "Built Around Business Outcomes",
        paragraphs: [
          "Lead generation becomes more useful when every campaign is connected to a clear business requirement. We help marketing teams create a more predictable flow of relevant prospects through human-verified data, targeted audience research, qualification and campaign execution.",
          "The objective is to improve lead quality, reduce wasted sales effort and create stronger alignment between marketing-generated opportunities and sales requirements."
        ],
        bullets: [
          "Build a consistent and scalable pipeline",
          "Reach the right decision-makers within target accounts",
          "Improve lead quality instead of chasing unverified contacts",
          "Reduce wasted sales effort",
          "Support targeted outbound, ABM, webinar and demand-generation campaigns",
          "Create repeatable and measurable pipeline-development processes"
        ]
      },
      {
        heading: "Six Standalone Lead-Generation Solutions",
        paragraphs: [
          "GETprospeKt offers six independent solutions designed around different pipeline goals. You can select the solution that matches the outcome you need rather than being forced through a mandatory sequence."
        ],
        bullets: [
          "Human-Verified Data — prospect data manually reviewed and verified for accuracy, completeness and recency.",
          "MQL Generation — marketing-qualified leads generated and qualified against your agreed criteria.",
          "SQL Generation — sales-qualified leads that meet your agreed fit, need and sales-readiness criteria.",
          "BANT-Qualified Leads — leads qualified against Budget, Authority, Need and Timing.",
          "Appointment Generation — confirmed meetings with your agreed target personas.",
          "Webinar Campaigns — targeted campaigns designed to drive relevant registrations and engagement."
        ]
      },
      {
        heading: "You Define What Qualified Means",
        paragraphs: [
          "There is no universal definition of a qualified lead. Your business decides what qualified means, and the campaign is built around those requirements.",
          "Your target accounts, buyer personas, qualification criteria and selected solution determine how the work is researched, executed and delivered."
        ]
      },
      {
        heading: "We Generate and Qualify",
        paragraphs: [
          "Our team identifies prospects, engages them and conducts the qualification required for the solution you selected before delivering the lead to your team.",
          "This approach is designed to give your sales team better information and more relevant opportunities to work with."
        ]
      },
      {
        heading: "How We Work",
        paragraphs: [
          "Discovery: We align on your target market, ideal buyer profile, selected solution and qualification criteria.",
          "Execution: We research, identify and engage prospects according to the agreed specification and campaign requirements.",
          "Qualification: We apply the qualification criteria you define and verify the information required for the selected solution.",
          "Handoff: We deliver the qualified output to your team in the agreed format so your sales or marketing team can take the next step.",
          "Optimization: We use campaign feedback and performance information to improve targeting, messaging and execution where appropriate."
        ]
      },
      {
        heading: "Better Data. Better Qualification. Better Conversations.",
        paragraphs: [
          "The GETprospeKt approach is simple: better data, better qualification, better conversations and ultimately a stronger, more predictable pipeline.",
          "The goal is not to add another layer of complexity to your marketing operation. It is to create a focused process that helps your team reach the right prospects and move qualified opportunities forward."
        ]
      },
      {
        heading: "Questions We Often Hear",
        faqs: [
          {
            question: "Do you define the qualification criteria, or do we?",
            answer: "You define what qualified means. We execute against your agreed criteria."
          },
          {
            question: "Who conducts the qualification conversations?",
            answer: "Our team identifies prospects, engages them and conducts the qualification conversations. We deliver leads that meet your agreed criteria."
          },
          {
            question: "Can I buy just one solution, or do I have to buy multiple?",
            answer: "You can buy just one solution. The six solutions are independent and are not mandatory stages of a single program."
          },
          {
            question: "What happens after you deliver a qualified lead?",
            answer: "Your team takes the next step after we deliver a qualified lead against the agreed criteria."
          },
          {
            question: "For appointment generation, what happens after the meeting is booked?",
            answer: "The meeting is confirmed with the agreed target persona, and your team takes the next step."
          }
        ]
      }
    ],
    authorBio:
      "GETprospeKt is a B2B lead-generation partner focused on helping marketing teams build a more predictable pipeline through targeted prospecting, qualification and campaign execution."
  },

  {
    slug: "human-verified-data",
    category: "B2B Lead Generation",
    title: "Better Data Starts with Verification",
    author: "GETprospeKt",
    date: "Sep 11, 2026",
    description:
      "We provide prospect data that has been manually reviewed and verified for accuracy and current business relevance. Six core fields per prospect, delivered as CSV.",
    heroImage:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=90",
    sections: [
      {
        heading: "Quick Fit",
        paragraphs: [
          "Human-Verified Data works best when you have a specific target audience and need accurate prospect information to begin your outreach. If you're building custom lists or need verified contact details for your campaigns, this is a good fit.",
          "If your situation is different, or you're unsure, that's exactly why we should talk."
        ]
      },
      {
        heading: "What You'll Receive",
        paragraphs: [
          "We deliver prospect data that includes six core fields: prospect name, job title, company name, email address, phone number (if available and verified), and company information. Each prospect record has been manually reviewed and verified by our team for accuracy.",
          "Verification means we confirm:",
          "All data is delivered as CSV, formatted and ready to use."
        ],
        bullets: [
          "The prospect exists in the organization",
          "The contact information is accurate",
          "The company information is current"
        ]
      },
      {
        heading: "The Handoff",
        paragraphs: [
          "We verify the data before delivery. Your team then uses it within your own outreach process. We are accountable for data quality at the point of handoff. What your team does with that data is your responsibility."
        ]
      },
      {
        heading: "How We Approach Human-Verified Data",
        paragraphs: [
          "Your Specifications Define Our Work",
          "We begin by understanding which prospects you want to reach—your target companies, industries, geographies, and prospect roles. You define the universe; we work within it.",
          "Research and Verification",
          "We identify prospects matching your specifications and manually verify each record. We research and verify the information so your team doesn't have to. Every prospect in your data set has been reviewed by a human to confirm accuracy.",
          "Current Company Information",
          "Company information is verified to be current within six months. Contact details are verified for accuracy. The result is prospect data you can trust to begin your outreach.",
          "Ready-to-Use Delivery",
          "You receive the data in CSV format with all core fields present (phone number included when available and verified). Your team can use it immediately within your systems."
        ]
      },
      {
        heading: "Questions We Often Hear",
        paragraphs: [
          "What are the six core fields you provide?",
          "What does “verified” mean? How is the data checked?",
          "Is phone number included on every record?",
          "What format is the data delivered in?",
          "Can we use Human-Verified Data for specific campaigns or segments?"
        ]
      }
    ]
  },

  {
    slug: "mql-generation",
    category: "B2B Lead Generation",
    title: "MQL: Marketing-Qualified Leads",
    author: "GETprospeKt",
    date: "Sep 11, 2026",
    description:
      "We generate leads matching your defined ICP and buyer persona, engage them through outreach, and deliver those who respond.",
    heroImage:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=90",
    sections: [
      {
        heading: "Quick Fit",
        paragraphs: [
          "MQL Generation works best when you want to build pipeline through direct outreach to prospects in your target market. If you're looking for leads that match your ICP and persona specifications and have shown they're open to conversation, this is a good fit.",
          "If your situation is different, or you're unsure, that's exactly why we should talk."
        ]
      },
      {
        heading: "What We Deliver",
        paragraphs: [
          "WHAT YOU'LL RECEIVE",
          "We deliver MQL leads that meet two criteria:",
          "Each prospect is qualified against these criteria before delivery."
        ],
        bullets: [
          "Match your agreed target company profile and buyer persona",
          "Have demonstrated engagement with our outreach (email reply, or conversation initiated)"
        ]
      },
      {
        heading: "The Handoff",
        paragraphs: [
          "We identify prospects matching your specification, engage them, and deliver those who demonstrate engagement. Your team then determines next steps—whether that's scheduling a meeting, continuing the conversation, or moving them into your own process. We are accountable for generating leads that fit your criteria and have engaged with us. What happens after delivery is your responsibility."
        ]
      },
      {
        heading: "How We Approach MQL Generation",
        paragraphs: [
          "Your Specification Drives Execution",
          "We begin by aligning with you on your target company profiles and buyer personas. You define who you want to reach; we execute the outreach against that specification.",
          "Targeted Outreach",
          "We identify prospects matching your criteria and engage them directly through outreach.",
          "Qualification on Engagement",
          "Demonstrated engagement means the prospect has responded—they've replied to our outreach, or initiated a conversation. We verify that engagement before delivery.",
          "Delivery",
          "You receive the lead with contact information and prospect details. Your team takes it from there."
        ]
      },
      {
        heading: "Questions We Often Hear",
        paragraphs: [
          "How do you ensure the prospects you deliver match our ICP and persona criteria?",
          "We work from the target company profiles and buyer personas you define. We align on those criteria upfront, identify prospects matching your specification, and qualify them against those agreed criteria before delivery.",
          "What constitutes \"demonstrated engagement\"?",
          "What information do we receive with each MQL?",
          "Can we refine our ICP, persona, or targeting criteria during a campaign?",
          "How is MQL Generation different from SQL Generation or BANT-Qualified Leads?"
        ]
      }
    ]
  },

  {
    slug: "sql-generation",
    category: "B2B Lead Generation",
    title: "SQL: Sales-Qualified Leads",
    author: "GETprospeKt",
    date: "Sep 11, 2026",
    description:
      "We generate leads matching your defined ICP and buyer persona, qualify them on relevant business problems and sales readiness, and deliver those who meet your agreed criteria.",
    heroImage:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1600&q=90",
    sections: [
      {
        heading: "Quick Fit",
        paragraphs: [
          "SQL Generation works best when you have a sales team ready to engage with prospects who fit your target market, understand their business problem, and have shown they're open to a sales conversation. If you want leads qualified beyond fit—leads where the prospect has articulated a relevant problem and demonstrated sales readiness—this is a good fit.",
          "If your situation is different, or you're unsure, that's exactly why we should talk."
        ]
      },
      {
        heading: "What We Deliver",
        paragraphs: [
          "WHAT YOU'LL RECEIVE",
          "We deliver SQL leads that meet three criteria:",
          "Each prospect is qualified against all three criteria before delivery. You receive the lead with contact information, prospect and company details, context from the qualification conversation, the business problem they articulated, and the sales-readiness signals that confirmed they meet your SQL criteria."
        ],
        bullets: [
          "Match your agreed target company profile and buyer persona",
          "Have articulated a relevant business problem during our conversation",
          "Have demonstrated sales readiness"
        ]
      },
      {
        heading: "The Handoff",
        paragraphs: [
          "We qualify the prospect against your agreed criteria. Your sales team then owns the conversation, negotiation, and close. We are accountable for delivering leads that meet your three SQL criteria and include qualification context. What your sales team does with that lead is your responsibility."
        ]
      },
      {
        heading: "How We Approach SQL Generation",
        paragraphs: [
          "Your Specification Drives Qualification",
          "We begin by aligning with you on your target company profiles, buyer personas, and what sales readiness means in your business. You define the criteria; we execute the qualification against that specification.",
          "Research and Engagement",
          "We identify prospects matching your ICP and persona, engage them in conversations to understand their business situation, and assess whether they have a relevant problem and openness to a sales discussion.",
          "Qualification on Three Criteria",
          "We qualify each prospect on ICP/persona fit, relevant business problem articulated in conversation, and demonstrated sales readiness. Only prospects who meet all three criteria are delivered as SQL.",
          "Delivery With Qualification Context",
          "You receive the lead with relevant qualification context: the business problem they articulated, the signals that indicated sales readiness, and the information your sales team needs to begin the conversation informed."
        ]
      },
      {
        heading: "Questions We Often Hear",
        paragraphs: [
          "How do you determine if a prospect has a \"relevant business problem\"?",
          "We align with you on the type of business problem relevant to your solution. During our conversation with the prospect, we listen for whether they articulate that relevant problem. We only qualify a prospect as SQL if they've actually stated a problem relevant to what you solve.",
          "What does \"demonstrated sales readiness\" mean?",
          "How do you ensure the prospects you deliver match our ICP and persona criteria?",
          "What information comes with each SQL?",
          "How is SQL Generation different from MQL Generation or BANT-Qualified Leads?"
        ]
      }
    ]
  },

  {
    slug: "bant-qualified-leads",
    category: "B2B Lead Generation",
    title: "BANT: BANT-Qualified Leads",
    author: "GETprospeKt",
    date: "Sep 11, 2026",
    description:
      "We generate leads matching your defined ICP and buyer persona, verify Budget, Authority, Need, and Timing in conversation, and deliver those who meet all four criteria.",
    heroImage:
      "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=1600&q=90",
    sections: [
      {
        heading: "Quick Fit",
        paragraphs: [
          "BANT-Qualified Leads works best when sales time is valuable and you want prospects qualified against Budget, Authority, Need, and Timing before delivery. If you need to know that budget exists, authority is confirmed, business need is a priority, and timeline is realistic, this is a good fit.",
          "If your situation is different, or you're unsure, that's exactly why we should talk."
        ]
      },
      {
        heading: "What We Deliver",
        paragraphs: [
          "WHAT YOU'LL RECEIVE",
          "We deliver BANT-Qualified Leads that meet five criteria:",
          "Each prospect is qualified against all five criteria before delivery. You receive the lead with contact information, prospect and company details, context from the qualification conversation, and the specific Budget, Authority, Need, and Timing verification that confirmed they meet all BANT criteria."
        ],
        bullets: [
          "Match your agreed target company profile and buyer persona",
          "Have verified Budget (existence, allocation, approximate range, or availability confirmed)",
          "Have verified Authority (the prospect is the decision-maker or has direct influence over the purchasing decision)",
          "Have verified Need (specific business problem articulated and acknowledged as a priority)",
          "Have verified Timing (realistic purchasing timeline indicated)"
        ]
      },
      {
        heading: "The Handoff",
        paragraphs: [
          "We verify all four BANT criteria in conversation with the prospect. Your sales team then owns the negotiation and close. We are accountable for delivering leads that match your agreed ICP/persona criteria and meet all four BANT criteria. What your sales team does with that lead is your responsibility."
        ]
      },
      {
        heading: "How We Approach BANT-Qualified Leads",
        paragraphs: [
          "Your Specification Drives Qualification",
          "We begin by aligning with you on your target company profiles, buyer personas, and what each BANT criterion means in your business. You define the criteria; we execute the qualification against that specification.",
          "Research and Engagement",
          "We identify prospects matching your ICP and persona and engage them in conversation to understand their business situation and buying environment.",
          "Verification of All Four Criteria",
          "We verify Budget—that funding exists or is being allocated for a solution like yours. We verify Authority—that the prospect is the decision-maker or has direct influence over the purchasing decision and is involved in the buying process. We verify Need—that they've articulated a specific business problem relevant to your solution and acknowledged it as a priority. We verify Timing—that they have a realistic timeline for evaluation or decision. We only deliver prospects who meet all four criteria.",
          "Delivery With BANT Context",
          "You receive the lead with qualification context: what the prospect confirmed about budget, their role and involvement in the decision, the specific business problem they identified as a priority, and their purchasing timeline. Your sales team has the information needed to continue the conversation."
        ]
      },
      {
        heading: "Questions We Often Hear",
        paragraphs: [
          "What does \"verified Budget\" mean?",
          "We confirm that budget exists or is being allocated. This may mean the prospect confirmed the existence of budget, the approximate range available, or their expectation of funding allocation. We verify that money is or will be available—not that they've committed a specific amount.",
          "What does \"verified Authority\" mean?",
          "What does \"verified Need\" mean?",
          "What does \"verified Timing\" mean?",
          "How is BANT-Qualified Leads different from SQL Generation or MQL Generation?"
        ]
      }
    ]
  },

  {
    slug: "appointment-generation",
    category: "B2B Lead Generation",
    title: "Appointment Generation: Confirmed Meetings",
    author: "GETprospeKt",
    date: "Sep 11, 2026",
    description:
      "We generate leads matching your defined ICP and buyer persona, engage them, and deliver confirmed appointments with your sales team.",
    heroImage:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=90",
    sections: [
      {
        heading: "Quick Fit",
        paragraphs: [
          "Appointment Generation works best when you want to move qualified prospects directly to conversations with your sales team. If you're looking for prospects who fit your target market and have confirmed they'll meet with you, this is a good fit.",
          "If your situation is different, or you're unsure, that's exactly why we should talk."
        ]
      },
      {
        heading: "What We Deliver",
        paragraphs: [
          "WHAT YOU'LL RECEIVE",
          "We deliver confirmed appointments that meet two criteria:",
          "Each appointment includes prospect contact information, company information, prospect role and background, and relevant qualification context. The appointment is confirmed on your sales representative's calendar.",
          "We facilitate the introduction—the GETprospeKt team member who conducted the qualification introduces your sales representative to the prospect at the scheduled time."
        ],
        bullets: [
          "The prospect matches your agreed target company profile and buyer persona",
          "The prospect has confirmed an appointment with your sales representative"
        ]
      },
      {
        heading: "The Handoff",
        paragraphs: [
          "We identify prospects matching your specification, engage them, and confirm they'll meet with your sales team. We facilitate the introduction. Your sales team then owns the conversation and relationship. We are accountable for delivering confirmed appointments with prospects who match your criteria and facilitating the introduction. What your sales team does with that conversation is your responsibility."
        ]
      },
      {
        heading: "How We Approach Appointment Generation",
        paragraphs: [
          "Your Specification Drives Targeting",
          "We begin by aligning with you on your target company profiles and buyer personas. You define who you want to meet; we execute the outreach against that specification.",
          "Engagement and Confirmation",
          "We identify prospects matching your criteria, engage them directly, and work with them to confirm the appointment.",
          "Introduction and Handoff",
          "The GETprospeKt team member who engaged the prospect facilitates the introduction to your sales representative. Your sales team then takes the conversation from there."
        ]
      },
      {
        heading: "Questions We Often Hear",
        paragraphs: [],
        faqs: [
          {
            question: "How do you confirm the prospect will actually attend the meeting?",
            answer:
              "We secure confirmation directly with the prospect that they'll meet with your sales representative at the scheduled time. A confirmed appointment means the prospect has confirmed their attendance for the scheduled meeting."
          },
          {
            question: "What happens if the prospect doesn't show up?",
            answer:
              "The appointment is confirmed directly with the prospect before the scheduled meeting. The current service information focuses on delivering confirmed appointments and facilitating the introduction; any separate no-show or replacement policy can be defined as part of the engagement."
          },
          {
            question: "What information comes with each appointment?",
            answer:
              "Each appointment includes prospect contact information, company information, the prospect's role and background, and relevant qualification context so your sales team has the information needed to continue the conversation."
          },
          {
            question: "Who introduces the prospect to our sales team?",
            answer:
              "The GETprospeKt team member who engaged and qualified the prospect facilitates the introduction to your sales representative at the scheduled time. Your sales team then takes the conversation from there."
          },
          {
            question: "How is Appointment Generation different from SQL Generation or BANT-Qualified Leads?",
            answer:
              "Appointment Generation takes the process one step further by securing and confirming a meeting between a prospect who matches your target criteria and your sales representative. SQL Generation focuses on delivering prospects who meet your agreed sales-qualification criteria, while BANT-Qualified Leads are additionally verified for Budget, Authority, Need, and Timing."
          }
        ]
      }
    ]
  },

  {
    slug: "webinar-campaigns",
    category: "B2B Lead Generation",
    title: "Webinar Campaigns: Qualified Registrations",
    author: "GETprospeKt",
    date: "Sep 11, 2026",
    description:
      "We identify prospects matching your defined criteria, engage them, and deliver registrations for your webinar from prospects who fit your target audience.",
    heroImage:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1600&q=90",
    sections: [
      {
        heading: "Quick Fit",
        paragraphs: [
          "Webinar Campaigns works best when you're running a webinar and want to fill it with prospects matching your target market and criteria. If you need qualified registrations from a defined audience, this is a good fit.",
          "If your situation is different, or you're unsure, that's exactly why we should talk."
        ]
      },
      {
        heading: "What We Deliver",
        paragraphs: [
          "WHAT YOU'LL RECEIVE",
          "We deliver webinar registrations from prospects who match your defined criteria. Each prospect has registered for your webinar and meets the target audience specifications you've established.",
          "We handle the identification, engagement, and registration process. You own the webinar content, topic, and what happens during and after the event."
        ]
      },
      {
        heading: "The Handoff",
        paragraphs: [
          "We deliver prospects who have registered for your webinar. Your team then owns the webinar execution, attendee experience, and any follow-up. We are accountable for delivering registrations that match your target criteria. What you do with those registrations and attendees is your responsibility."
        ]
      },
      {
        heading: "How We Approach Webinar Campaigns",
        paragraphs: [
          "Your Specification Drives Targeting",
          "We begin by aligning with you on your target audience—the company profiles, personas, industries, and prospect characteristics relevant to your webinar. You define who should attend; we execute the outreach to reach them.",
          "Prospect Identification and Engagement",
          "We identify prospects matching your target specifications and engage them with information about your webinar. We focus on reaching the right audience for your event.",
          "Registration Delivery",
          "Prospects who are interested register for your webinar. We deliver those registrations to you, ensuring they match your defined target criteria.",
          "Your Webinar Execution",
          "You manage the webinar content, promotion, attendee experience, and any follow-up activity. We've delivered the qualified registrations; the rest is yours to execute."
        ]
      },
      {
        heading: "Questions We Often Hear",
        paragraphs: [
          "How do you determine who to target for webinar registration?",
          "We work from the target audience specifications you define—company profiles, personas, industries, roles, and other criteria relevant to your webinar. You tell us who should attend; we identify and engage prospects matching that definition.",
          "What information do we receive with the registrations?",
          "Can we use Webinar Campaigns for a specific industry or audience segment?",
          "What happens after prospects register?",
          "How is Webinar Campaigns different from MQL Generation or SQL Generation?"
        ]
      }
    ]
  },
];

/* =========================================================
   RELATED CONTENT
   ========================================================= */

const relatedArticles = [
  {
    title:
      "The Trust Premium of AI in Personalization for Brands",
    author: "Aafreen Shaikh",
    date: "Sep 2, 2026",
    description:
      "Explore the role of AI in creating personalized experiences that build trust with consumers.",
    link:
      "/article/trust-premium-ai-personalization"
  },

  {
    title:
      "Activating High-Value Audiences With First Party Data",
    author: "Aafreen Shaikh",
    date: "Jul 2, 2026",
    description:
      "Discover effective strategies to activate high-value audiences while safeguarding sensitive data.",
    link:
      "/article/guest-first-party-data"
  },

  {
    title:
      "How CMOs Are Driving Success in an AI-Driven World",
    author: "Aafreen Shaikh",
    date: "May 20, 2026",
    description:
      "Discover how CMOs leverage AI to enhance brand success and drive innovation.",
    link:
      "/article/guest-ai-driven-cmos"
  },

  {
    title:
      "From AI Tools to AI-Native Marketing",
    author: "Aafreen Shaikh",
    date: "May 4, 2026",
    description:
      "Learn how CMOs are building marketing organizations for the next era of growth.",
    link:
      "/article/guest-ai-native-marketing"
  },

  {
    title:
      "How AI Is Transforming Marketing and Advertising",
    author: "Aafreen Shaikh",
    date: "Apr 30, 2026",
    description:
      "Explore the transformative impact of AI across modern marketing and advertising.",
    link:
      "/article/guest-ai-marketing-advertising"
  }
];


/* =========================================================
   COMPONENT
   ========================================================= */

function Article() {

  // React Router provides the article slug without a full page reload.
  const { slug = "" } = useParams<{ slug: string }>();

  const article = articles.find(
    (item) => item.slug === slug
  );


  if (!article) {
    return (
      <main className="article-not-found">

        <h1>
          Article Not Found
        </h1>

        <p>
          The article you are looking for
          could not be found.
        </p>

        <Link to="/">
          ← Back to Home
        </Link>

        <style>{`

          .article-not-found {
            min-height: 60vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            font-family: var(--font-sans);
          }

          .article-not-found h1 {
            font-size: 47.2px;
            margin-bottom: 10px;
          }

          .article-not-found p {
            color: #686477;
          }

          .article-not-found a {
            color: #6857E8;
            text-decoration: none;
            font-weight: 700;
          }

        `}</style>

      </main>
    );
  }


  return article.isGuestAuthor
    ? (
      <GuestAuthorArticle
        article={article}
      />
    )
    : (
      <NormalArticle
        article={article}
      />
    );
}


/* =========================================================
   GUEST AUTHOR ARTICLE
   ========================================================= */

function GuestAuthorArticle({
  article
}: {
  article: ArticleData;
}) {


  return (
    <main className="guest-article-page">

      <div className="guest-article-container">

        {/* TOP META */}

        <div className="guest-article-top">

          <div className="guest-article-meta">
            By{" "}
            <strong>
              {article.author}
            </strong>

            <span>|</span>

            {article.date}
          </div>


          <div className="article-share">

            <span className="share-symbol">
              ●
            </span>

            <a href="#">
              f
            </a>

            <a href="#">
              t
            </a>

            <a href="#">
              in
            </a>

          </div>

        </div>


        {/* HERO */}

        <section className="guest-hero">

          <div className="guest-hero-left">

            <div className="guest-brand">

              <span>TALK</span>

              <strong>
                CMO
              </strong>

              <i />

            </div>


            <div className="hero-decoration hero-decoration-one" />


            <h1>
              {article.title}
            </h1>


            <div className="expert-name">
              {article.heroAuthorName}
            </div>


            <div className="expert-role">
              {article.heroAuthorRole}
            </div>


            <div className="expert-company">
              {article.company}
            </div>


            <div className="hero-decoration hero-decoration-two" />

          </div>


          <div className="guest-hero-right">

            <div className="hero-blue-shape" />

            <div className="hero-photo">

              <img
                src={article.heroAuthorImage}
                alt={
                  article.heroAuthorName ||
                  "Guest Author"
                }
              />

            </div>

          </div>

        </section>


        {/* TABLE OF CONTENTS */}

        <section className="guest-toc">

          <div className="guest-toc-header">

            <h2>
              Table of Contents
            </h2>

            <button
              type="button"
              aria-label="Table of contents"
            >
              ☰
            </button>

          </div>


          <div className="guest-toc-items">

            {article.sections.map(
              (section, index) => (

                <a
                  key={section.heading}
                  href={`#guest-section-${index}`}
                >
                  {index + 1}.{" "}
                  {section.heading}
                </a>

              )
            )}

          </div>

        </section>


        {/* MAIN CONTENT */}

        <div className="guest-article-layout">

          <article className="guest-main-content">

            <p className="guest-lead">
              {article.intro}
            </p>


            {article.sections.map(
              (section, index) => (

                <section
                  className="guest-content-section"
                  id={`guest-section-${index}`}
                  key={section.heading}
                >

                  <h2>
                    {section.heading}
                  </h2>


                  {(section.paragraphs ?? []).map(
                    (paragraph) => (

                      <p key={paragraph}>
                        {paragraph}
                      </p>

                    )
                  )}


                  {section.bullets && (

                    <ul>

                      {section.bullets.map(
                        (bullet) => (

                          <li key={bullet}>
                            {bullet}
                          </li>

                        )
                      )}

                    </ul>

                  )}

                  {section.faqs && section.faqs.length > 0 && (

                    <div className="article-faq-accordion">

                      {section.faqs.map((faq, index) => (

                        <details
                          className="article-faq-item"
                          key={faq.question}
                          open={index === 0}
                        >

                          <summary>
                            <span>{faq.question}</span>
                            <span className="article-faq-icon" aria-hidden="true">
                              +
                            </span>
                          </summary>

                          <div className="article-faq-answer">
                            <p>{faq.answer}</p>
                          </div>

                        </details>

                      ))}

                    </div>

                  )}

                </section>

              )
            )}


            {/* AUTHOR BOX */}

            <div className="guest-author-box">

              <div className="guest-author-box-image">

                <img
                  src={
                    article.heroAuthorImage ||
                    "https://randomuser.me/api/portraits/women/44.jpg"
                  }
                  alt={article.author}
                />

              </div>


              <div>

                <h3>
                  {article.author}
                </h3>

                <p>
                  {article.authorBio ||
                    "A technology and business writer covering marketing, AI, customer experience and digital transformation."}
                </p>

              </div>

            </div>


            {/* MORE FROM */}

            <section className="guest-more-section">

              <div className="guest-more-title">

                <h2>
                  More from Talk CMO
                </h2>

                <div />

              </div>


              <div className="guest-more-list">

                {[
                  {
                    title:
                      "Raptive Launches Raptive Community for the Next Era of Creator Growth",
                    date: "Sep 10, 2026",
                    image:
                      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=700&q=90"
                  },

                  {
                    title:
                      "Planon Appoints Clarinda Dobbelaar as Chief Marketing Officer",
                    date: "Sep 10, 2026",
                    image:
                      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=700&q=90"
                  },

                  {
                    title:
                      "PulsePoint Brings Verified NPI Targeting to YouTube",
                    date: "Sep 9, 2026",
                    image:
                      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=700&q=90"
                  },

                  {
                    title:
                      "Comcast Technology Solutions Selected for Premium Content Distribution",
                    date: "Sep 8, 2026",
                    image:
                      "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=700&q=90"
                  }
                ].map((item) => (

                  <a
                    href="#"
                    className="guest-more-item"
                    key={item.title}
                  >

                    <img
                      src={item.image}
                      alt={item.title}
                    />

                    <div>

                      <h3>
                        {item.title}
                      </h3>

                      <div className="guest-more-meta">
                        By TCMO Bureau
                        <span>|</span>
                        {item.date}
                      </div>

                      <p>
                        Explore the latest developments,
                        leadership updates and technology
                        insights from the marketing industry.
                      </p>

                    </div>

                  </a>

                ))}

              </div>

            </section>

          </article>


          {/* RELATED CONTENT */}

          <aside className="guest-related">

            <h2>
              Related Content
            </h2>


            {relatedArticles.map(
              (related) => (

                <article
                  className="related-item"
                  key={related.link}
                >

                  <h3>
                    <Link to={related.link}>
                      {related.title}
                    </Link>
                  </h3>

                  <div className="related-meta">
                    By{" "}
                    <strong>
                      {related.author}
                    </strong>

                    <span>|</span>

                    {related.date}
                  </div>

                  <p>
                    {related.description}
                  </p>

                </article>

              )
            )}

          </aside>

        </div>

      </div>


      <style>{`

        * {
          box-sizing: border-box;
        }

        .guest-article-page {
          width: 100%;
          background: transparent;
          color: #D5DBE7;
          font-family: var(--font-sans);
        }

        .article-back-button {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          margin: 22px 0 8px;
          padding: 9px 16px;
          border: 1px solid #0046FC;
          border-radius: 4px;
          background: transparent;
          color: #00D2FF;
          font-family: var(--font-sans);
          font-size: 15.3px;
          font-weight: 700;
          line-height: 1;
          cursor: pointer;
          transition: background .2s ease, color .2s ease;
        }

        .article-back-button:hover {
          background: #0046FC;
          color: #fff;
        }

        .article-back-button:focus-visible {
          outline: 2px solid #0055FF;
          outline-offset: 2px;
        }

        .guest-article-container {
          width: min(
            1380px,
            calc(100% - 48px)
          );
          margin: 0 auto;
        }

        /* TOP */

        .guest-article-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 26px 0 18px;
        }

        .guest-article-meta {
          font-size: 15.3px;
          line-height: 1.4;
          color: #AEB8CA;
        }

        .guest-article-meta span {
          margin: 0 8px;
        }

        .article-share {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .share-symbol {
          margin-right: 8px;
          font-size: 23.6px;
          color: #AEB8CA;
        }

        .article-share a {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          background: #0046FC;
          text-decoration: none;
          font-size: 17.7px;
          font-weight: 700;
          border-radius: 4px;
        }

        .article-share a:nth-child(3) {
          background: #0055FF;
        }

        .article-share a:nth-child(4) {
          background: #0038D1;
        }

        /* HERO */

        .guest-hero {
          min-height: 630px;
          display: grid;
          grid-template-columns:
            minmax(0, 1.3fr)
            minmax(380px, .75fr);
          position: relative;
        }

        .guest-hero-left {
          position: relative;
          overflow: hidden;
          padding: 50px 35px 45px 25px;
          background: #0D1522;
        }

        .guest-brand {
          display: flex;
          align-items: center;
          gap: 3px;
          color: #AEB8CA;
          font-size: 26px;
          font-weight: 300;
          position: relative;
          z-index: 3;
        }

        .guest-brand strong {
          color: #00D2FF;
          font-weight: 800;
        }

        .guest-brand i {
          width: 31px;
          height: 31px;
          border-radius: 50%;
          background: #0046FC;
          display: inline-block;
          margin-left: 3px;
          position: relative;
        }

        .guest-brand i::after {
          content: "";
          width: 11px;
          height: 11px;
          position: absolute;
          left: 10px;
          top: 10px;
          background: #fff;
          border-radius: 50%;
        }

        .guest-hero-left h1 {
          position: relative;
          z-index: 3;
          max-width: 590px;
          margin: 125px 0 95px 10px;
          font-size: 49.6px;
          line-height: 1.08;
          letter-spacing: -.9px;
          font-weight: 800;
          color: #FFFFFF;
        }

        .hero-decoration {
          position: absolute;
          background: rgba(0, 70, 252, 0.12);
        }

        .hero-decoration-one {
          width: 105px;
          height: 105px;
          top: 0;
          left: 55%;
          border-radius: 0 0 52px 52px;
        }

        .hero-decoration-two {
          width: 115px;
          height: 105px;
          right: 20px;
          bottom: 0;
          border-radius: 58px 58px 0 0;
        }

        .expert-name {
          position: relative;
          z-index: 4;
          width: fit-content;
          margin-left: 10px;
          padding: 8px 16px;
          background: #0046FC;
          color: #fff;
          font-size: 29.5px;
          line-height: 1.15;
          font-weight: 800;
        }

        .expert-role {
          position: relative;
          z-index: 4;
          margin: 7px 0 0 15px;
          font-size: 18.9px;
          line-height: 1.35;
          color: #AEB8CA;
        }

        .expert-company {
          position: relative;
          z-index: 4;
          margin: 62px 0 0 10px;
          font-size: 29.5px;
          font-weight: 900;
          letter-spacing: .4px;
          color: #FFFFFF;
        }

        .guest-hero-right {
          position: relative;
          min-height: 630px;
          background: #111C2D;
          overflow: hidden;
        }

        .hero-blue-shape {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 475px;
          background: #0046FC;
          border-radius: 0 0 50% 50%;
        }

        .hero-photo {
          position: absolute;
          z-index: 4;
          left: 50%;
          top: 135px;
          transform: translateX(-50%);
          width: 340px;
          height: 340px;
          padding: 7px;
          background: #0046FC;
          border-radius: 50%;
          box-shadow: 0 0 0 4px #0D1522;
        }

        .hero-photo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
          border: 5px solid #0D1522;
          display: block;
        }

        /* TOC */

        .guest-toc {
          position: relative;
          z-index: 10;
          margin: 15px 0 25px;
        }

        .guest-toc-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 16px;
          background: #0D1522;
          color: #FFFFFF;
          box-shadow: 0 4px 10px rgba(0,0,0,.4);
        }

        .guest-toc-header h2 {
          margin: 0;
          font-size: 31.9px;
          line-height: 1.2;
          color: #FFFFFF;
        }

        .guest-toc-header button {
          border: 0;
          background: transparent;
          font-size: 29.5px;
          cursor: pointer;
          color: #AEB8CA;
        }

        .guest-toc-items {
          display: none;
          padding: 15px;
          background: #111C2D;
          border: 1px solid rgba(255, 255, 255, 0.12);
        }

        .guest-toc-items a {
          display: block;
          padding: 8px 0;
          color: #D5DBE7;
          text-decoration: none;
          font-size: 16.5px;
        }

        /* MAIN */

        .guest-article-layout {
          display: grid;
          grid-template-columns:
            minmax(0, 1fr)
            330px;
          gap: 30px;
          align-items: start;
        }

        .guest-main-content {
          min-width: 0;
        }

        .guest-lead {
          margin: 0 0 22px;
          font-size: 18.9px;
          line-height: 1.7;
          font-weight: 700;
          font-style: italic;
          color: #FFFFFF;
        }

        .guest-content-section {
          margin-bottom: 34px;
        }

        .guest-content-section h2 {
          margin: 0 0 13px;
          color: #FFFFFF;
          font-size: 37.8px;
          line-height: 1.15;
        }

        .guest-content-section p {
          margin: 0 0 16px;
          font-size: 18.9px;
          line-height: 1.72;
          text-align: justify;
          color: #D5DBE7;
        }

        .guest-content-section ul {
          margin: 8px 0 20px;
          padding-left: 28px;
          color: #D5DBE7;
        }

        .guest-content-section li {
          margin-bottom: 9px;
          font-size: 17.7px;
          line-height: 1.5;
        }

        /* RELATED */

        .guest-related {
          border-left: 1px solid rgba(255, 255, 255, 0.12);
          padding-left: 18px;
          position: sticky;
          top: 15px;
        }

        .guest-related > h2 {
          margin: 0;
          padding-bottom: 10px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
          font-size: 28.3px;
          color: #FFFFFF;
        }

        .related-item {
          padding: 14px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
        }

        .related-item h3 {
          margin: 0 0 9px;
          font-size: 22.4px;
          line-height: 1.15;
        }

        .related-item h3 a {
          color: #FFFFFF;
          text-decoration: none;
        }

        .related-item h3 a:hover {
          color: #00D2FF;
        }

        .related-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          font-size: 13px;
          color: #AEB8CA;
        }

        .related-item p {
          margin: 8px 0 0;
          font-size: 14.2px;
          line-height: 1.45;
          color: #D5DBE7;
        }

        /* AUTHOR BOX */

        .guest-author-box {
          display: grid;
          grid-template-columns: 170px minmax(0, 1fr);
          gap: 25px;
          align-items: center;
          margin: 45px 0;
          padding: 20px;
          border-radius: 15px;
          background: #0D1522;
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 5px 18px rgba(0,0,0,.4);
        }

        .guest-author-box-image {
          width: 170px;
          height: 170px;
          overflow: hidden;
          border-radius: 15px;
        }

        .guest-author-box-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .guest-author-box h3 {
          margin: 0 0 10px;
          font-size: 23.6px;
          color: #FFFFFF;
        }

        .guest-author-box p {
          margin: 0;
          font-size: 17.7px;
          line-height: 1.65;
          color: #D5DBE7;
        }

        /* MORE */

        .guest-more-section {
          margin-top: 50px;
        }

        .guest-more-title {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 20px;
        }

        .guest-more-title h2 {
          margin: 0;
          font-size: 34.2px;
          white-space: nowrap;
          color: #FFFFFF;
        }

        .guest-more-title div {
          flex: 1;
          height: 1px;
          background: rgba(255, 255, 255, 0.12);
        }

        .guest-more-list {
          display: flex;
          flex-direction: column;
        }

        .guest-more-item {
          display: grid;
          grid-template-columns: 255px minmax(0, 1fr);
          gap: 25px;
          padding: 0 0 17px;
          margin-bottom: 18px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
          color: inherit;
          text-decoration: none;
        }

        .guest-more-item img {
          width: 255px;
          height: 150px;
          object-fit: cover;
          border-radius: 7px;
          background: #0D1522;
        }

        .guest-more-item h3 {
          margin: 0 0 8px;
          font-size: 23.6px;
          line-height: 1.18;
          color: #FFFFFF;
        }

        .guest-more-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          font-size: 13px;
          color: #AEB8CA;
        }

        .guest-more-item p {
          margin: 8px 0 0;
          font-size: 14.2px;
          line-height: 1.45;
          color: #D5DBE7;
        }

        /* =================================================
           RESPONSIVE
           ================================================= */

        @media (max-width: 1100px) {

          .guest-hero {
            grid-template-columns:
              minmax(0, 1fr)
              360px;
          }

          .guest-hero-left h1 {
            font-size: 42.5px;
          }

          .hero-photo {
            width: 285px;
            height: 285px;
          }

          .guest-article-layout {
            grid-template-columns:
              minmax(0, 1fr)
              285px;
          }

        }

        @media (max-width: 850px) {

          .guest-article-container {
            width: calc(100% - 30px);
          }

          .guest-hero {
            grid-template-columns: 1fr;
            min-height: auto;
          }

          .guest-hero-left {
            min-height: 560px;
          }

          .guest-hero-right {
            height: 420px;
            min-height: 420px;
          }

          .hero-blue-shape {
            height: 300px;
          }

          .hero-photo {
            top: 55px;
            width: 280px;
            height: 280px;
          }

          .guest-article-layout {
            grid-template-columns: 1fr;
          }

          .guest-related {
            border-left: 0;
            border-top: 1px solid #DDD9E7;
            padding: 25px 0 0;
            position: static;
          }

        }

        @media (max-width: 600px) {

          .guest-article-container {
            width: calc(100% - 20px);
          }

          .guest-article-top {
            padding: 18px 0 12px;
            align-items: flex-start;
            gap: 12px;
          }

          .guest-article-meta {
            font-size: 13px;
          }

          .article-share a {
            width: 28px;
            height: 28px;
            font-size: 14.2px;
          }

          .share-symbol {
            display: none;
          }

          .guest-hero-left {
            min-height: 480px;
            padding: 30px 18px;
          }

          .guest-brand {
            font-size: 21.2px;
          }

          .guest-brand i {
            width: 25px;
            height: 25px;
          }

          .guest-hero-left h1 {
            margin:
              95px
              0
              70px
              0;
            font-size: 34.2px;
            line-height: 1.1;
          }

          .expert-name {
            margin-left: 0;
            font-size: 23.6px;
            padding: 7px 11px;
          }

          .expert-role {
            margin-left: 4px;
            font-size: 15.3px;
          }

          .expert-company {
            margin: 40px 0 0;
            font-size: 23.6px;
          }

          .hero-decoration-one {
            left: 70%;
            width: 75px;
            height: 75px;
          }

          .hero-decoration-two {
            width: 80px;
            height: 75px;
          }

          .guest-hero-right {
            height: 340px;
            min-height: 340px;
          }

          .hero-blue-shape {
            height: 245px;
          }

          .hero-photo {
            width: 230px;
            height: 230px;
            top: 42px;
          }

          .guest-toc-header {
            padding: 10px 12px;
          }

          .guest-toc-header h2 {
            font-size: 26px;
          }

          .guest-lead {
            font-size: 16.5px;
            line-height: 1.6;
          }

          .guest-content-section h2 {
            font-size: 30.7px;
          }

          .guest-content-section p {
            font-size: 16.5px;
            line-height: 1.65;
            text-align: left;
          }

          .guest-author-box {
            grid-template-columns: 95px minmax(0, 1fr);
            gap: 15px;
            padding: 14px;
            margin: 30px 0;
          }

          .guest-author-box-image {
            width: 95px;
            height: 120px;
          }

          .guest-author-box h3 {
            font-size: 20.1px;
          }

          .guest-author-box p {
            font-size: 14.2px;
            line-height: 1.5;
          }

          .guest-more-title h2 {
            font-size: 27.1px;
          }

          .guest-more-item {
            grid-template-columns: 110px minmax(0, 1fr);
            gap: 14px;
          }

          .guest-more-item img {
            width: 110px;
            height: 85px;
          }

          .guest-more-item h3 {
            font-size: 17.7px;
          }

          .guest-more-item p {
            display: none;
          }

        }

        @media (max-width: 390px) {

          .guest-article-meta {
            font-size: 11.8px;
          }

          .article-share {
            gap: 3px;
          }

          .guest-hero-left {
            min-height: 440px;
          }

          .guest-hero-left h1 {
            font-size: 29.5px;
            margin-top: 85px;
          }

          .expert-name {
            font-size: 20.1px;
          }

          .expert-role {
            font-size: 13px;
          }

          .guest-hero-right {
            height: 300px;
            min-height: 300px;
          }

          .hero-photo {
            width: 200px;
            height: 200px;
          }

          .guest-content-section h2 {
            font-size: 27.1px;
          }

        }

      `}</style>

    </main>
  );
}


/* =========================================================
   NORMAL ARTICLE
   ========================================================= */

function NormalArticle({
  article
}: {
  article: ArticleData;
}) {


  return (
    <main className="normal-article-page">

      <div className="normal-article-container">

        <div className="normal-article-layout">

          <article className="normal-main">

            <div className="normal-category">
              {article.category}
            </div>

            <h1>
              {article.title}
            </h1>

            <div className="normal-meta">
              By{" "}
              <strong>
                {article.author}
              </strong>

              <span>|</span>

              {article.date}
            </div>

            {article.heroImage && (

              <div className="normal-hero">

                <img
                  src={article.heroImage}
                  alt={article.title}
                />

              </div>

            )}

            <p className="normal-intro">
              {article.description}
            </p>


            {article.sections.map(
              (section) => (

                <section
                  className="normal-section"
                  key={section.heading}
                >

                  <h2>
                    {section.heading}
                  </h2>

                  {(section.paragraphs ?? []).map(
                    (paragraph) => (

                      <p key={paragraph}>
                        {paragraph}
                      </p>

                    )
                  )}

                  {section.bullets && (

                    <ul>

                      {section.bullets.map(
                        (bullet) => (

                          <li key={bullet}>
                            {bullet}
                          </li>

                        )
                      )}

                    </ul>

                  )}

                </section>

              )
            )}

          </article>


          <aside className="normal-related">

            <h2>
              Related Content
            </h2>

            {relatedArticles.map(
              (related) => (

                <article
                  key={related.link}
                  className="normal-related-item"
                >

                  <h3>
                    <Link to={related.link}>
                      {related.title}
                    </Link>
                  </h3>

                  <div>
                    By {related.author}
                    {" | "}
                    {related.date}
                  </div>

                  <p>
                    {related.description}
                  </p>

                </article>

              )
            )}

          </aside>

        </div>

      </div>


      <style>{`

        .normal-article-page {
          width: 100%;
          background: transparent;
          font-family: var(--font-sans);
          color: #D5DBE7;
        }

        .normal-article-page .article-back-button {
          margin: 22px 0 18px;
        }

        .normal-article-container {
          width: min(
            1380px,
            calc(100% - 48px)
          );
          margin: 0 auto;
          padding: 25px 0 70px;
        }

        .normal-article-layout {
          display: grid;
          grid-template-columns:
            minmax(0, 1fr)
            330px;
          gap: 30px;
        }

        .normal-category {
          color: #00D2FF;
          font-size: 13px;
          font-weight: 800;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .normal-main h1 {
          margin: 0 0 12px;
          font-size: 49.6px;
          line-height: 1.1;
          color: #FFFFFF;
        }

        .normal-meta {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          font-size: 14.2px;
          margin-bottom: 20px;
          color: #AEB8CA;
        }

        .normal-hero {
          width: 100%;
          height: 430px;
          overflow: hidden;
          border-radius: 7px;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .normal-hero img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .normal-intro {
          margin: 24px 0;
          font-size: 20.1px;
          line-height: 1.7;
          font-weight: 600;
          color: #D5DBE7;
        }

        .normal-section {
          margin-bottom: 30px;
        }

        .normal-section h2 {
          font-size: 33px;
          color: #FFFFFF;
        }

        .normal-section p {
          font-size: 18.9px;
          line-height: 1.7;
          color: #D5DBE7;
        }

        .normal-section li {
          margin-bottom: 8px;
          line-height: 1.5;
          color: #D5DBE7;
        }

        .normal-related {
          border-left: 1px solid rgba(255, 255, 255, 0.08);
          padding-left: 18px;
        }

        .normal-related > h2 {
          margin: 0 0 10px;
          font-size: 27.1px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
          padding-bottom: 10px;
          color: #FFFFFF;
        }

        .normal-related-item {
          padding: 14px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .normal-related-item h3 {
          margin: 0 0 8px;
          font-size: 21.2px;
          line-height: 1.2;
          color: #FFFFFF;
        }

        .normal-related-item h3 a {
          color: inherit;
          text-decoration: none;
        }

        .normal-related-item h3 a:hover {
          color: #00D2FF;
        }

        .normal-related-item div {
          font-size: 13px;
          color: #AEB8CA;
        }

        .normal-related-item p {
          font-size: 14.2px;
          line-height: 1.45;
          color: #D5DBE7;
        }

        @media (max-width: 850px) {

          .normal-article-container {
            width: calc(100% - 30px);
          }

          .normal-article-layout {
            grid-template-columns: 1fr;
          }

          .normal-related {
            border-left: 0;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            padding: 25px 0 0;
          }

        }

        @media (max-width: 600px) {

          .normal-article-container {
            width: calc(100% - 20px);
          }

          .normal-main h1 {
            font-size: 34.2px;
          }

          .normal-hero {
            height: 240px;
          }

          .normal-intro {
            font-size: 17.7px;
          }

          .normal-section h2 {
            font-size: 28.3px;
          }

          .normal-section p {
            font-size: 16.5px;
          }

        }


      .article-faq-accordion {
        margin-top: 18px;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
      }

      .article-faq-item {
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        background: #0D1522;
        border-radius: 8px;
        margin-bottom: 8px;
        padding: 0 16px;
      }

      .article-faq-item summary {
        list-style: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        padding: 18px 4px;
        font-size: 18.9px;
        line-height: 1.45;
        font-weight: 700;
        color: #FFFFFF;
      }

      .article-faq-item summary::-webkit-details-marker {
        display: none;
      }

      .article-faq-icon {
        flex: 0 0 auto;
        width: 28px;
        height: 28px;
        display: grid;
        place-items: center;
        border-radius: 50%;
        background: #111C2D;
        border: 1px solid rgba(255, 255, 255, 0.08);
        color: #00D2FF;
        font-size: 23.6px;
        font-weight: 500;
        transition: transform 0.2s ease;
      }

      .article-faq-item[open] .article-faq-icon {
        transform: rotate(45deg);
      }

      .article-faq-answer {
        padding: 0 48px 18px 4px;
      }

      .article-faq-answer p {
        margin: 0;
        color: #D5DBE7;
        font-size: 17.7px;
        line-height: 1.7;
      }

      @media (max-width: 768px) {
        .article-faq-item summary {
          padding: 15px 2px;
          font-size: 17.7px;
        }

        .article-faq-answer {
          padding: 0 38px 16px 2px;
        }

        .article-faq-answer p {
          font-size: 16.5px;
        }
      }

      `}

</style>

    </main>
  );
}

export default Article;
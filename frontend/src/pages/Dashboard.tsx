import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import gettLogo from "../assets/images/gett.png";
import {
  articlesApi,
  caseStudiesApi,
  enquiriesApi,
  resourcesApi,
  newslettersApi,
  authApi,
  caseStudiesStorageApi,
  solutionsStorageApi,
  newslettersStorageApi,
  type SolutionData,
  type NewsletterData,
} from "../services/api";
import ResourceManager from "../components/admin/ResourceManager";
import LatestPopularManager from "../components/admin/LatestPopularManager";
import CaseStudyManager from "../components/admin/CaseStudyManager";
import SolutionsManager from "../components/admin/SolutionsManager";
import NewsletterManager from "../components/admin/NewsletterManager";

const initialDemoArticles = [
  {
    _id: "demo-1",
    title: "The B2B Technology Growth Framework: Precision Prospecting & Pipeline Quality",
    category: "B2B Technology",
    date: "Oct 14, 2026",
    author: "David Sterling",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=85",
    description:
      "How high-growth B2B technology companies replace raw volume scraping with human-verified contact discovery.",
  },
  {
    _id: "demo-2",
    title: "Enterprise Technology Procurement in 2026: Multi-Stakeholder Consensus & Compliance",
    category: "Enterprise Technology",
    date: "Oct 15, 2026",
    author: "Elena Rostova",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=85",
    description:
      "Navigating complex buying committees, security compliance vetting, and budget approval cycles across Fortune 1000 buyers.",
  },
  {
    _id: "demo-3",
    title: "Cloud Infrastructure & Data Stack: Demand Generation for Technical Evaluators",
    category: "Cloud",
    date: "Oct 10, 2026",
    author: "GETprospeKt Research",
    image:
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=900&q=85",
    description:
      "How cloud vendors map infrastructure decision-makers and qualify high-value engineering opportunities.",
  },
  {
    _id: "demo-4",
    title: "Cybersecurity Outbound Playbook: Engaging CISOs and Security Decision-Makers",
    category: "Cybersecurity",
    date: "Oct 12, 2026",
    author: "Marcus Vance",
    image:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=900&q=85",
    description:
      "Strategies for penetrating zero-trust, identity governance, and perimeter defense committees with verified outreach.",
  },
  {
    _id: "demo-5",
    title: "AI-Driven Demand Generation: Machine Intelligence in Modern Enterprise Pipelines",
    category: "AI",
    date: "Oct 13, 2026",
    author: "Aafreen Shaikh",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=900&q=85",
    description:
      "Deploying intelligent automation, real-time trigger tracking, and predictive qualification to accelerate pipeline velocity.",
  },
  {
    _id: "demo-6",
    title: "Scaling SaaS Pipeline: Net Retention, Expansion Signals, and SQL Qualification",
    category: "SaaS",
    date: "Oct 11, 2026",
    author: "GETprospeKt Editorial",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=85",
    description:
      "How subscription software companies combine intent triggers and telephone qualification to drive high-LTV customer acquisition.",
  },
  {
    _id: "demo-7",
    title: "Digital Transformation & Legacy Modernization: Reaching Enterprise Change-Makers",
    category: "Digital Transformation",
    date: "Oct 09, 2026",
    author: "David Sterling",
    image:
      "https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?auto=format&fit=crop&w=900&q=85",
    description:
      "Engaging operational leadership and IT modernization directors navigating enterprise digital adoption.",
  },
];

const demoCaseStudies = [
  {
    _id: "cs-1",
    slug: "webinar-registrations-ai-business-process",
    eyebrow: "CASE STUDY 1 — WEBINAR REGISTRATIONS FOR AI AND BUSINESS PROCESS WEBINAR",
    title: "Targeted Outreach for an AI and Business-Process Webinar",
    description: "A US-focused webinar organizer targeting technology decision-makers needed high-quality registrations from a defined audience. GETprospeKt identified and engaged 1,500+ prospects matching the target specification, resulting in 192 webinar registrations and 23 attendees, with a 12% attendance rate.",
    image: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?auto=format&fit=crop&w=1600&q=90",
    client: "US Enterprise AI Webinar Organizer",
    metric: "192 Registrations",
  },
  {
    _id: "cs-2",
    slug: "bant-lead-generation-enterprise-automation",
    eyebrow: "CASE STUDY 2 — TARGETED BANT LEAD GENERATION FOR AN ENTERPRISE AUTOMATION PLATFORM",
    title: "Targeted BANT Lead Generation for an Enterprise Automation Platform",
    description: "A global software company needed BANT-qualified leads over three months to feed their US sales team. GETprospeKt identified and qualified Technology and Marketing decision-makers using tele-calling, delivering 125 BANT-qualified leads (Budget, Authority, Need, Timing verified) across CIOs, CTOs, CMOs, and Marketing/IT Directors in 3 months.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1600&q=90",
    client: "Global Automation Software",
    metric: "125 BANT Leads",
  },
  {
    _id: "cs-3",
    slug: "mql-generation-marcom-platform",
    eyebrow: "CASE STUDY 3 — MQL GENERATION FOR A MARKETING COMMUNICATIONS MANAGEMENT SOLUTION",
    title: "MQL Generation for a Marketing Communications Management Solution",
    description: "A MarCom platform provider needed high-volume MQLs within a 60-day campaign to feed their sales and nurture pipelines. GETprospeKt executed outreach to Marketing Communications professionals across enterprise and mid-market organizations in the USA, delivering 8,500 MQLs with maintained audience and seniority relevance.",
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1600&q=90",
    client: "Enterprise MarCom Provider",
    metric: "8,500 MQLs",
  },
  {
    _id: "cs-4",
    slug: "sql-generation-multi-cloud",
    eyebrow: "CASE STUDY 4 — SURVEY-LED SQL GENERATION FOR A MULTI-CLOUD MANAGEMENT PLATFORM",
    title: "Survey-Led SQL Generation for a Multi-Cloud Management Platform",
    description: "A cloud storage solutions provider needed to identify and qualify enterprise decision-makers with active cloud migration requirements. GETprospeKt used a structured Value-Add Assessment to capture qualification data from 3,000+ prospects across financial services, healthcare, manufacturing, and logistics, delivering 92 SQLs qualified against infrastructure, cloud strategy, and budget criteria.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=90",
    client: "Cloud Infrastructure Firm",
    metric: "92 SQLs",
  },
  {
    _id: "cs-5",
    slug: "appointment-generation-engineering",
    eyebrow: "CASE STUDY 5 — APPOINTMENT GENERATION FOR A CLOUD-BASED DESIGN AND ENGINEERING SOLUTION",
    title: "Appointment Generation for a Cloud-Based Design and Engineering Solution",
    description: "An engineering software provider needed qualified sales appointments with manufacturing design and engineering decision-makers, including prospects using competing solutions. GETprospeKt executed targeted cold calling across 4,000 validated contacts, delivering 35 confirmed appointments (110% of KPI) with persona-specific handling of competitive objections.",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1600&q=90",
    client: "Global Engineering Software Provider",
    metric: "35 Appointments (110%)",
  },
  {
    _id: "cs-6",
    slug: "appointment-generation-healthcare-buyer-personas",
    eyebrow: "CASE STUDY 6 — APPOINTMENT GENERATION ACROSS NEW HEALTHCARE BUYER PERSONAS",
    title: "Appointment Generation Across New Healthcare Buyer Personas",
    description: "A healthcare technology provider needed to expand beyond their traditional nursing audience into IT, Population Health, and Director+ decision-makers at hospital systems. GETprospeKt mapped complex healthcare account structures and executed targeted cold calling across ~200 hospital accounts, delivering 44 confirmed meetings with 72% from previously unreached buyer personas.",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1600&q=90",
    client: "Healthcare Technology Provider",
    metric: "44 Confirmed Meetings",
  },
];

interface DashboardProps {
  initialSection?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ initialSection }) => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(() => {
    if (initialSection) {
      if (initialSection === "Articles") return "Insights / Industries";
      return initialSection;
    }
    const urlParams = new URLSearchParams(window.location.search);
    const sec = urlParams.get("section") || urlParams.get("tab");
    if (sec) {
      if (sec.toLowerCase() === "articles") return "Insights / Industries";
      if (sec.toLowerCase() === "solutions") return "Solutions";
      if (sec.toLowerCase() === "research") return "Research";
      if (sec.toLowerCase() === "resources") return "Resources";
      if (sec.toLowerCase() === "newsletters") return "Newsletters";
      if (sec.toLowerCase() === "casestudies" || sec.toLowerCase() === "case studies") return "Case Studies";
      if (sec.toLowerCase() === "latest-popular" || sec.toLowerCase() === "latest & popular") return "Latest & Popular";
      if (sec.toLowerCase() === "enquiries") return "Enquiries";
      if ([
        "Dashboard",
        "Solutions",
        "Insights / Industries",
        "Research",
        "Resources",
        "Newsletters",
        "Case Studies",
        "Latest & Popular",
        "Enquiries",
      ].includes(sec)) {
        return sec;
      }
    }
    if (window.location.pathname.includes("/solutions")) return "Solutions";
    if (window.location.pathname.includes("/case-studies")) return "Case Studies";
    if (window.location.pathname.includes("/resources")) return "Resources";
    if (window.location.pathname.includes("/latest-popular")) return "Latest & Popular";
    return "Dashboard";
  });
  const [showAddContent, setShowAddContent] = useState(false);
  const [addType, setAddType] = useState<"Solution" | "Article" | "Research" | "Resource" | "Case Study" | "Newsletter">("Article");
  const [toastMessage, setToastMessage] = useState("");
  const [currentUser] = useState<any>(() => {
    try {
      const u = localStorage.getItem("user");
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  });

  // Data state
  const [articles, setArticles] = useState<any[]>(initialDemoArticles);
  const [solutions, setSolutions] = useState<SolutionData[]>(() => solutionsStorageApi.getAll());
  const [caseStudies, setCaseStudies] = useState<any[]>(() => {
    try {
      const saved = caseStudiesStorageApi.getAll();
      return saved && saved.length > 0 ? saved : demoCaseStudies;
    } catch {
      return demoCaseStudies;
    }
  });
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [newsletters, setNewsletters] = useState<NewsletterData[]>(() => {
    try {
      return newslettersStorageApi.getAll();
    } catch {
      return [];
    }
  });

  // Insights / Articles search and filter state
  const [selectedArticleIndustry, setSelectedArticleIndustry] = useState<string>("All");
  const [articleSearchQuery, setArticleSearchQuery] = useState<string>("");

  // Add Content Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("B2B Technology");
  const [solutionCategory, setSolutionCategory] = useState("Demand Generation");
  const [author, setAuthor] = useState("GETprospeKt");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [resourceType, setResourceType] = useState("Playbook");
  const [newsletterFreq, setNewsletterFreq] = useState("Weekly");

  // Edit Content Form State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editType, setEditType] = useState<"Article" | "Case Study" | "Resource" | "Newsletter">("Article");
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("B2B Technology");
  const [editAuthor, setEditAuthor] = useState("GETprospeKt");
  const [editDescription, setEditDescription] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editImagePreview, setEditImagePreview] = useState("");
  const [editResourceType, setEditResourceType] = useState("Playbook");
  const [editNewsletterFreq, setEditNewsletterFreq] = useState("Weekly");

  // Fetch live data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [arts, studies, enqs, res, news] = await Promise.all([
          articlesApi.getAll(),
          caseStudiesApi.getAll(),
          enquiriesApi.getAll(),
          resourcesApi.getAll(),
          newslettersApi.getAll(),
        ]);

        if (arts && arts.length > 0) setArticles(arts);
        if (studies && studies.length > 0) setCaseStudies(studies);
        if (enqs && enqs.length > 0) setEnquiries(enqs);
        if (res && res.length > 0) setResources(res);
        if (news && news.length > 0) setNewsletters(news);
      } catch (err) {
        console.warn("[Dashboard Data Load]", err);
      }
    };

    fetchData();

    const handleSolUpdate = () => {
      setSolutions(solutionsStorageApi.getAll());
    };
    const handleNewsUpdate = () => {
      setNewsletters(newslettersStorageApi.getAll());
    };
    window.addEventListener("gp_solutions_updated", handleSolUpdate);
    window.addEventListener("gp_newsletters_updated", handleNewsUpdate);
    return () => {
      window.removeEventListener("gp_solutions_updated", handleSolUpdate);
      window.removeEventListener("gp_newsletters_updated", handleNewsUpdate);
    };
  }, []);

  const logout = () => {
    authApi.logout();
    navigate("/login", { replace: true });
  };

  const selectSection = (item: string) => {
    setActiveSection(item);
    if (window.innerWidth <= 800) {
      document.querySelector(".gp-dashboard-sidebar")?.classList.remove("mobile-open");
    }
  };

  const handleAddContent = async () => {
    if (!title.trim()) {
      alert("Please enter a title.");
      return;
    }

    try {
      const finalImage = imageUrl.trim() || imagePreview;

      if (addType === "Solution") {
        const slug = title
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, "")
          .replace(/[\s_-]+/g, "-");
        const newSol: SolutionData = {
          id: `sol-${Date.now()}`,
          title: title.trim(),
          slug,
          category: solutionCategory || "Demand Generation",
          tag: "Verified",
          badge: "New Solution",
          subtitle: description || "For Revenue Teams",
          description: description || "GTM Solution added via Admin",
          deliverables: [
            "Custom ICP targeting",
            "Dedicated campaign management",
            "Verified pipeline delivery",
          ],
          image:
            finalImage ||
            "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?auto=format&fit=crop&w=1200&q=90",
          path: `/article/${slug}`,
        };
        const updated = [newSol, ...solutions];
        solutionsStorageApi.saveAll(updated);
        setSolutions(updated);
      } else if (addType === "Article") {
        const newArt = {
          title: title.trim(),
          category,
          author,
          description: description || "New article added via CMS",
          date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          image: finalImage || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=900&q=85",
        };
        try {
          const res = await articlesApi.create(newArt);
          setArticles((prev) => [res, ...prev]);
        } catch {
          setArticles((prev) => [{ ...newArt, _id: `local_${Date.now()}` }, ...prev]);
        }
      } else if (addType === "Research") {
        const newRes = {
          title: title.trim(),
          type: resourceType || "Industry Report",
          category,
          summary: description || "Research report published via CMS",
          coverImage:
            finalImage ||
            "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=85",
          fileUrl: "/sample-whitepaper.pdf",
        };
        try {
          const res = await resourcesApi.create(newRes);
          setResources((prev) => [res, ...prev]);
        } catch {
          setResources((prev) => [{ ...newRes, _id: `local_${Date.now()}` }, ...prev]);
        }
      } else if (addType === "Case Study") {
        const newCs = {
          title: title.trim(),
          description: description || "New case study added via CMS",
          image: finalImage || "https://images.unsplash.com/photo-1591115765373-5207764f72e7?auto=format&fit=crop&w=1600&q=90",
          profile: "Enterprise B2B client",
          objective: "Generate verified leads and qualified pipeline.",
        };
        try {
          const res = await caseStudiesApi.create(newCs);
          setCaseStudies((prev) => [res, ...prev]);
        } catch {
          setCaseStudies((prev) => [{ ...newCs, _id: `local_${Date.now()}` }, ...prev]);
        }
      } else if (addType === "Resource") {
        const newRes = {
          title: title.trim(),
          type: resourceType,
          category,
          summary: description || "Resource published via CMS",
          coverImage: finalImage || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=85",
          fileUrl: "/sample-whitepaper.pdf",
        };
        try {
          const res = await resourcesApi.create(newRes);
          setResources((prev) => [res, ...prev]);
        } catch {
          setResources((prev) => [{ ...newRes, _id: `local_${Date.now()}` }, ...prev]);
        }
      } else if (addType === "Newsletter") {
        const newNews: NewsletterData = {
          _id: `nl_${Date.now()}`,
          title: title.trim(),
          slug: title.trim().toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-"),
          frequency: (newsletterFreq as any) || "Weekly",
          category: category || "B2B Technology",
          summary: description || "Curated publication briefing and industry highlights.",
          author: author || "GETprospeKt Editorial",
          date: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
          readTime: "4 min read",
          image: finalImage || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=90",
          status: "Published",
          highlights: ["Executive market takeaways", "Conversion and buyer trends"],
          subscribersCount: "1,200+ subscribers",
        };
        const currentList = newslettersStorageApi.getAll();
        const updatedList = [newNews, ...currentList];
        newslettersStorageApi.saveAll(updatedList);
        setNewsletters(updatedList);
        try {
          await newslettersApi.create(newNews);
        } catch {
          // offline resilient
        }
      }

      setToastMessage(`${addType} added successfully.`);
      setShowAddContent(false);
      setTitle("");
      setDescription("");
      setImageUrl("");
      setImagePreview("");
    } catch (err: any) {
      alert(`Error adding ${addType}: ${err.message}`);
    }
  };

  const handleOpenEdit = (
    type: "Article" | "Case Study" | "Resource" | "Newsletter",
    item: any
  ) => {
    setEditingItem(item);
    setEditType(type);
    setEditTitle(item.title || "");
    setEditCategory(item.category || "B2B Technology");
    setEditAuthor(item.author || "GETprospeKt");
    setEditDescription(item.description || item.summary || "");
    const img = item.coverImage || item.image || item.heroImage || "";
    setEditImageUrl(img);
    setEditImagePreview(img);
    setEditResourceType(item.type || "Playbook");
    setEditNewsletterFreq(item.frequency || "Weekly");
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim()) {
      alert("Please enter a title.");
      return;
    }

    try {
      const finalImage = editImageUrl.trim() || editImagePreview;
      const itemId = editingItem._id;

      if (editType === "Article") {
        const updated = {
          title: editTitle.trim(),
          category: editCategory,
          author: editAuthor,
          description: editDescription,
          image: finalImage || undefined,
        };
        try {
          await articlesApi.update(itemId, updated);
        } catch (e) {
          console.warn("Backend update failed, updating local state:", e);
        }
        setArticles((prev) =>
          prev.map((a) => (a._id === itemId ? { ...a, ...updated } : a))
        );
      } else if (editType === "Case Study") {
        const updated = {
          title: editTitle.trim(),
          description: editDescription,
          image: finalImage || undefined,
        };
        try {
          await caseStudiesApi.update(itemId, updated);
        } catch (e) {
          console.warn("Backend update failed, updating local state:", e);
        }
        setCaseStudies((prev) =>
          prev.map((c) => (c._id === itemId ? { ...c, ...updated } : c))
        );
      } else if (editType === "Resource") {
        const updated = {
          title: editTitle.trim(),
          type: editResourceType,
          category: editCategory,
          summary: editDescription,
          coverImage: finalImage || editingItem.coverImage,
        };
        try {
          await resourcesApi.update(itemId, updated);
        } catch (e) {
          console.warn("Backend update failed, updating local state:", e);
        }
        setResources((prev) =>
          prev.map((r) => (r._id === itemId ? { ...r, ...updated } : r))
        );
      } else if (editType === "Newsletter") {
        const currentList = newslettersStorageApi.getAll();
        const existing = currentList.find((n) => n._id === itemId);
        const updatedItem: NewsletterData = {
          ...existing,
          _id: itemId,
          title: editTitle.trim(),
          slug: existing?.slug || editTitle.trim().toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-"),
          frequency: (editNewsletterFreq as any) || "Weekly",
          category: editCategory || "B2B Technology",
          author: editAuthor || "GETprospeKt Editorial",
          date: existing?.date || "Sep 2026",
          readTime: existing?.readTime || "4 min read",
          summary: editDescription.trim(),
          image: finalImage || existing?.image || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=90",
          status: existing?.status || "Published",
          highlights: existing?.highlights || ["Executive market takeaways", "Conversion and buyer trends"],
          subscribersCount: existing?.subscribersCount || "1,200+ subscribers",
        };
        const updatedList = currentList.map((n) => (n._id === itemId ? updatedItem : n));
        newslettersStorageApi.saveAll(updatedList);
        setNewsletters(updatedList);
        try {
          await newslettersApi.update(itemId, updatedItem);
        } catch (e) {
          console.warn("Backend update failed, updated local state:", e);
        }
      }

      setToastMessage(`${editType} updated successfully.`);
      setShowEditModal(false);
      setEditingItem(null);
    } catch (err: any) {
      alert(`Error updating ${editType}: ${err.message}`);
    }
  };

  const handleDeleteItem = async (
    type: "Article" | "Case Study" | "Resource" | "Newsletter",
    id: string
  ) => {
    if (!confirm(`Are you sure you want to delete this ${type.toLowerCase()}?`)) return;

    try {
      if (type === "Article") {
        try {
          await articlesApi.delete(id);
        } catch (e) {
          console.warn("Backend delete failed, removing from local state:", e);
        }
        setArticles((prev) => prev.filter((a) => a._id !== id));
      } else if (type === "Case Study") {
        try {
          await caseStudiesApi.delete(id);
        } catch (e) {
          console.warn("Backend delete failed, removing from local state:", e);
        }
        setCaseStudies((prev) => prev.filter((c) => c._id !== id));
      } else if (type === "Resource") {
        try {
          await resourcesApi.delete(id);
        } catch (e) {
          console.warn("Backend delete failed, removing from local state:", e);
        }
        setResources((prev) => prev.filter((r) => r._id !== id));
      } else if (type === "Newsletter") {
        const currentList = newslettersStorageApi.getAll();
        const updatedList = currentList.filter((n) => n._id !== id);
        newslettersStorageApi.saveAll(updatedList);
        setNewsletters(updatedList);
        try {
          await newslettersApi.delete(id);
        } catch (e) {
          console.warn("Backend delete failed, removing from local state:", e);
        }
      }

      setToastMessage(`${type} deleted successfully.`);
    } catch (err: any) {
      alert(`Error deleting ${type}: ${err.message}`);
    }
  };

  const handleUpdateEnquiry = async (id: string, status: string) => {
    await enquiriesApi.updateStatus(id, status);
    setEnquiries((prev) =>
      prev.map((item) => (item._id === id ? { ...item, status } : item))
    );
  };

  const handleDeleteEnquiry = async (id: string) => {
    if (!confirm("Are you sure you want to delete this enquiry?")) return;
    await enquiriesApi.delete(id);
    setEnquiries((prev) => prev.filter((item) => item._id !== id));
  };

  const stats = [
    ["Total Articles", String(articles.length), "Published & active", ""],
    ["Case Studies", String(caseStudies.length), "Case studies in library", "orange"],
    ["Resources", String(resources.length), "Playbooks & whitepapers", "red"],
    ["Newsletters", String(newsletters.length), "Published issues", "blue"],
    ["Enquiries", String(enquiries.length), "Contact submissions", "blue"],
  ];

  const renderSection = () => {
    if (activeSection === "Dashboard") {
      const researchCount = resources.filter((r) => {
        const t = (r.type || "").toLowerCase();
        return (
          t.includes("report") ||
          t.includes("insight") ||
          t.includes("trend") ||
          t.includes("research")
        );
      }).length;

      const resourceAssetsCount = resources.filter((r) => {
        const t = (r.type || "").toLowerCase();
        return (
          !t.includes("report") &&
          !t.includes("insight") &&
          !t.includes("trend") &&
          !t.includes("research")
        );
      }).length;

      const mainCategoryCards = [
        {
          key: "Solutions",
          title: "Solutions",
          count: solutions.length,
          desc: "Go-to-market pipeline & data solutions",
          icon: "❖",
          badge: "Lead Gen",
        },
        {
          key: "Insights / Industries",
          title: "Insights / Industries",
          count: articles.length,
          desc: "Industry articles & editorial insights",
          icon: "▤",
          badge: "Articles",
        },
        {
          key: "Research",
          title: "Research",
          count: researchCount,
          desc: "Industry reports & buyer insights",
          icon: "🔬",
          badge: "Reports",
        },
        {
          key: "Resources",
          title: "Resources",
          count: resourceAssetsCount,
          desc: "Whitepapers, playbooks & guides",
          icon: "▣",
          badge: "Assets",
        },
        {
          key: "Newsletters",
          title: "Newsletters",
          count: newsletters.length,
          desc: "Issues, dispatches & article related content",
          icon: "✉",
          badge: "Dispatches & Sidebar",
        },
      ];

      return (
        <>
          {/* Main Categories Section Header */}
          <div className="gp-main-categories-panel">
            <div className="gp-panel-heading" style={{ marginBottom: 14 }}>
              <div>
                <h2>Main Publication Categories</h2>
                <p>Manage content across the website's 5 core pillars matching the public navigation.</p>
              </div>
            </div>

            <div className="gp-main-categories-grid">
              {mainCategoryCards.map((cat) => (
                <div
                  key={cat.key}
                  className="gp-main-cat-card"
                  onClick={() => selectSection(cat.key)}
                >
                  <div className="gp-cat-card-top">
                    <span className="gp-cat-icon">{cat.icon}</span>
                    <span className="gp-cat-badge">{cat.badge}</span>
                  </div>
                  <div className="gp-cat-card-center">
                    <strong>{cat.count}</strong>
                    <h3>{cat.title}</h3>
                    <p>{cat.desc}</p>
                  </div>
                  <div className="gp-cat-card-action">
                    <span>Manage {cat.title} →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="gp-stats-grid">
            {stats.map(([title, value, text, iconClass], index) => (
              <div className="gp-stat-card" key={title}>
                <div className="gp-stat-top">
                  <span>{title}</span>
                  <i className={iconClass}>{["▤", "◫", "▣", "✉", "📥"][index]}</i>
                </div>
                <strong>{value}</strong>
                <small>{text}</small>
              </div>
            ))}
          </div>

          <div className="gp-dashboard-grid">
            <section className="gp-panel">
              <div className="gp-panel-heading">
                <div>
                  <h2>Recent Insights & Articles</h2>
                  <p>Latest articles and industry commentary.</p>
                </div>
                <button onClick={() => setActiveSection("Insights / Industries")}>View All →</button>
              </div>

              {articles.slice(0, 4).map((article) => (
                <div className="gp-article-row" key={article._id || article.title}>
                  <div className="gp-row-image">
                    <img src={article.image || article.heroImage} alt={article.title} />
                  </div>
                  <div className="gp-row-copy">
                    <strong>{article.title}</strong>
                    <small>{article.category} · {article.date || "Sep 2026"}</small>
                  </div>
                </div>
              ))}
            </section>

            <section className="gp-panel">
              <div className="gp-panel-heading">
                <div>
                  <h2>Latest Enquiries & Submissions</h2>
                  <p>Messages from Contact Us & Lead Capture forms.</p>
                </div>
                <button onClick={() => setActiveSection("Enquiries")}>View All →</button>
              </div>

              {enquiries.length === 0 ? (
                <p style={{ padding: "20px", color: "#6b7280" }}>No enquiries received yet.</p>
              ) : (
                enquiries.slice(0, 4).map((item) => (
                  <div className="gp-simple-row" key={item._id}>
                    <div>
                      <small>{item.subject || "General"} · {new Date(item.createdAt).toLocaleDateString()}</small>
                      <strong>{item.firstName} {item.lastName} ({item.email})</strong>
                      <p>{item.message}</p>
                    </div>
                    <span className={`gp-status-pill ${item.status?.toLowerCase()}`}>{item.status || "New"}</span>
                  </div>
                ))
              )}
            </section>
          </div>
        </>
      );
    }

    if (activeSection === "Solutions") {
      return <SolutionsManager showToast={(msg) => setToastMessage(msg)} />;
    }

    if (activeSection === "Insights / Industries" || activeSection === "Articles") {
      const INDUSTRIES = [
        "All",
        "B2B Technology",
        "Enterprise Technology",
        "Cloud",
        "Cybersecurity",
        "AI",
        "SaaS",
        "Digital Transformation",
      ];

      const filteredArticles = articles.filter((art) => {
        const matchesIndustry =
          selectedArticleIndustry === "All" || art.category === selectedArticleIndustry;
        const q = articleSearchQuery.toLowerCase();
        const matchesQuery =
          !q ||
          art.title.toLowerCase().includes(q) ||
          (art.description && art.description.toLowerCase().includes(q)) ||
          (art.category && art.category.toLowerCase().includes(q)) ||
          (art.author && art.author.toLowerCase().includes(q));
        return matchesIndustry && matchesQuery;
      });

      return (
        <section className="gp-panel gp-full-panel">
          <div className="gp-panel-heading">
            <div>
              <h2>Insights & Industry Articles</h2>
              <p>Publication content categorized by Industry across B2B Tech, Enterprise Tech, Cloud, Cybersecurity, AI, SaaS, and Digital Transformation.</p>
            </div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <span className="gp-results-badge">{filteredArticles.length} Articles</span>
              <button
                className="gp-add-content-button"
                onClick={() => {
                  setAddType("Article");
                  setShowAddContent(true);
                }}
              >
                + Add Article
              </button>
            </div>
          </div>

          {/* Industry Filter Pills & Search */}
          <div className="gp-article-filters-wrap">
            <div className="gp-article-search">
              <span>🔍</span>
              <input
                type="text"
                placeholder="Search articles by title, industry, or author..."
                value={articleSearchQuery}
                onChange={(e) => setArticleSearchQuery(e.target.value)}
              />
              {articleSearchQuery && (
                <button onClick={() => setArticleSearchQuery("")}>×</button>
              )}
            </div>
            <div className="gp-industry-pills">
              {INDUSTRIES.map((ind) => (
                <button
                  key={ind}
                  className={`gp-industry-pill ${selectedArticleIndustry === ind ? "active" : ""}`}
                  onClick={() => setSelectedArticleIndustry(ind)}
                >
                  {ind}
                </button>
              ))}
            </div>
          </div>

          <div className="gp-admin-content-grid" style={{ marginTop: "20px" }}>
            {filteredArticles.length === 0 ? (
              <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px", color: "#94A3B8" }}>
                No articles found in this industry filter.
              </div>
            ) : (
              filteredArticles.map((article) => (
                <div className="gp-content-card" key={article._id || article.title}>
                  <div className="gp-demo-large-thumb">
                    <img src={article.image || article.heroImage} alt={article.title} />
                  </div>
                  <div>
                    <small>{article.category}</small>
                    <h3>{article.title}</h3>
                    <p>{article.date || "2026"} · By {article.author || "GETprospeKt"}</p>
                    <div className="gp-card-actions">
                      <button
                        className="gp-card-edit-btn"
                        onClick={() => handleOpenEdit("Article", article)}
                        title="Edit Article"
                      >
                        ✎ Edit
                      </button>
                      <button
                        className="gp-card-delete-btn"
                        onClick={() => handleDeleteItem("Article", article._id)}
                        title="Delete Article"
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      );
    }

    if (activeSection === "Research") {
      return (
        <ResourceManager
          resources={resources}
          onResourcesChange={(updated) => setResources(updated)}
          showToast={(msg) => setToastMessage(msg)}
          mode="research"
          title="Research & Market Reports"
          subtitle="Manage market intelligence, buyer insight analyses, and industry benchmark reports."
        />
      );
    }

    if (activeSection === "Case Studies") {
      return (
        <CaseStudyManager
          caseStudies={caseStudies}
          onCaseStudiesChange={(updated) => setCaseStudies(updated)}
          showToast={(msg) => setToastMessage(msg)}
        />
      );
    }

    if (activeSection === "Enquiries") {
      return (
        <section className="gp-panel gp-full-panel">
          <div className="gp-panel-heading">
            <div>
              <h2>Contact Form Enquiries</h2>
              <p>Direct lead capture from the public Contact Us page.</p>
            </div>
            <span>{enquiries.length} Enquiries</span>
          </div>

          {enquiries.length === 0 ? (
            <div className="gp-empty-box">
              <div className="gp-empty-icon">📥</div>
              <h3>No enquiries yet</h3>
              <p>When visitors submit the form on the Contact Us page, their messages will appear here.</p>
              <Link to="/contact" className="gp-primary-button">Open Contact Page →</Link>
            </div>
          ) : (
            <div className="gp-enquiries-table-wrap">
              <table className="gp-enquiries-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Company</th>
                    <th>Subject</th>
                    <th>Message</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {enquiries.map((enq) => (
                    <tr key={enq._id}>
                      <td>{new Date(enq.createdAt).toLocaleDateString()}</td>
                      <td><strong>{enq.firstName} {enq.lastName}</strong></td>
                      <td>
                        <a href={`mailto:${enq.email}`}>{enq.email}</a>
                        {enq.telephone && <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "2px" }}>📞 {enq.telephone}</div>}
                      </td>
                      <td>
                        <strong>{enq.company || "—"}</strong>
                        {enq.jobTitle && <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "2px" }}>{enq.jobTitle}</div>}
                      </td>
                      <td><span className="gp-subject-badge">{enq.subject}</span></td>
                      <td className="gp-message-cell">{enq.message}</td>
                      <td>
                        <select
                          value={enq.status || "New"}
                          onChange={(e) => handleUpdateEnquiry(enq._id, e.target.value)}
                          className={`gp-status-select ${enq.status?.toLowerCase()}`}
                        >
                          <option>New</option>
                          <option>Read</option>
                          <option>Replied</option>
                          <option>Archived</option>
                        </select>
                      </td>
                      <td>
                        <button
                          className="gp-delete-btn"
                          onClick={() => handleDeleteEnquiry(enq._id)}
                          title="Delete Enquiry"
                        >
                          🗑
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      );
    }

    if (activeSection === "Resources") {
      return (
        <ResourceManager
          resources={resources}
          onResourcesChange={(updated) => setResources(updated)}
          showToast={(msg) => setToastMessage(msg)}
          mode="resources"
          title="Resources & Operational Assets"
          subtitle="Manage downloadable whitepapers, operational playbooks, and technical assets."
        />
      );
    }

    if (activeSection === "Latest & Popular") {
      return <LatestPopularManager showToast={(msg) => setToastMessage(msg)} />;
    }

    if (activeSection === "Newsletters") {
      return (
        <NewsletterManager
          showToast={(msg) => setToastMessage(msg)}
        />
      );
    }

    return null;
  };

  return (
    <div className="gp-dashboard">
      <aside className="gp-dashboard-sidebar">
        <div className="gp-dashboard-brand">
          <img src={gettLogo} alt="GETprospeKt" />
          <span>Publication Management</span>
        </div>

        <nav className="gp-sidebar-nav-groups">
          <div className="gp-nav-section-title">OVERVIEW</div>
          <button
            className={`gp-side-item ${activeSection === "Dashboard" ? "active" : ""}`}
            onClick={() => selectSection("Dashboard")}
          >
            <span>⌂</span>
            Dashboard Overview
          </button>

          <div className="gp-nav-section-title">MAIN CATEGORIES</div>
          <button
            className={`gp-side-item ${activeSection === "Solutions" ? "active" : ""}`}
            onClick={() => selectSection("Solutions")}
          >
            <span>❖</span>
            Solutions
          </button>
          <button
            className={`gp-side-item ${activeSection === "Insights / Industries" || activeSection === "Articles" ? "active" : ""}`}
            onClick={() => selectSection("Insights / Industries")}
          >
            <span>▤</span>
            Insights / Industries
          </button>
          <button
            className={`gp-side-item ${activeSection === "Research" ? "active" : ""}`}
            onClick={() => selectSection("Research")}
          >
            <span>🔬</span>
            Research
          </button>
          <button
            className={`gp-side-item ${activeSection === "Resources" ? "active" : ""}`}
            onClick={() => selectSection("Resources")}
          >
            <span>▣</span>
            Resources
          </button>
          <button
            className={`gp-side-item ${activeSection === "Newsletters" ? "active" : ""}`}
            onClick={() => selectSection("Newsletters")}
          >
            <span>✉</span>
            Newsletters
          </button>

          <div className="gp-nav-section-title">MANAGEMENT & LEADS</div>
          <button
            className={`gp-side-item ${activeSection === "Case Studies" ? "active" : ""}`}
            onClick={() => selectSection("Case Studies")}
          >
            <span>◫</span>
            Case Studies
          </button>
          <button
            className={`gp-side-item ${activeSection === "Latest & Popular" ? "active" : ""}`}
            onClick={() => selectSection("Latest & Popular")}
          >
            <span>★</span>
            Latest & Popular
          </button>
          <button
            className={`gp-side-item ${activeSection === "Enquiries" ? "active" : ""}`}
            onClick={() => selectSection("Enquiries")}
          >
            <span>📥</span>
            Enquiries
          </button>
        </nav>

        <div className="gp-sidebar-bottom">
          <Link to="/" className="gp-sidebar-website-link" title="Open Main Website">
            <span>🌐</span> Go to Website ↗
          </Link>
          <div className="gp-sidebar-user">
            <span>
              {currentUser?.name
                ? currentUser.name.substring(0, 2).toUpperCase()
                : "AD"}
            </span>
            <div>
              <strong>{currentUser?.name || "Admin"}</strong>
              <small>{currentUser?.email || "admin@getprospekt.co"}</small>
            </div>
          </div>
          <button onClick={logout}>Logout</button>
        </div>
      </aside>

      <main className="gp-dashboard-main">
        <header className="gp-dashboard-header">
          <div className="gp-header-left">
            <button
              className="gp-menu-button"
              aria-label="Dashboard menu"
              onClick={() =>
                document.querySelector(".gp-dashboard-sidebar")?.classList.toggle("mobile-open")
              }
            >
              ☰
            </button>
            <div>
              <strong>GETprospeKt</strong>
              <small>Publication Admin</small>
            </div>
          </div>

          <div className="gp-header-actions">
            <Link to="/" className="gp-view-website-button" title="View Public Website">
              🌐 View Website ↗
            </Link>
            <button
              className="gp-add-content-button"
              onClick={() => setShowAddContent(true)}
            >
              + Add Content
            </button>
            <div className="gp-admin-profile">
              <div className="gp-admin-profile-info">
                <strong>{currentUser?.name || "Admin"}</strong>
                <small>{currentUser?.role === "admin" ? "Super Admin" : (currentUser?.role || "Super Admin")}</small>
              </div>
              <span className="gp-admin-avatar">
                {currentUser?.name
                  ? currentUser.name.substring(0, 2).toUpperCase()
                  : "AD"}
              </span>
            </div>
          </div>
        </header>

        <section className="gp-dashboard-content">
          <div className="gp-dashboard-heading">
            <h1>{activeSection === "Dashboard" ? "Dashboard Overview" : activeSection}</h1>
            <p>Welcome back! Manage your publication, content, and client enquiries.</p>
          </div>

          {renderSection()}
        </section>
      </main>

      {/* ================= ADD CONTENT MODAL ================= */}
      {showAddContent && (
        <div className="gp-modal-backdrop" onClick={() => setShowAddContent(false)}>
          <div className="gp-add-modal" onClick={(e) => e.stopPropagation()}>
            <div className="gp-modal-header">
              <div>
                <h2>Add Content</h2>
                <p>Create a new publication item with updated taxonomy.</p>
              </div>
              <button
                className="gp-modal-close"
                aria-label="Close"
                onClick={() => setShowAddContent(false)}
              >
                ×
              </button>
            </div>

            <div className="gp-modal-type">
              {(["Solution", "Article", "Research", "Resource", "Case Study", "Newsletter"] as const).map((t) => (
                <button
                  key={t}
                  className={addType === t ? "selected" : ""}
                  onClick={() => setAddType(t)}
                >
                  {t === "Article" ? "Insight / Article" : t === "Research" ? "Research Report" : t}
                </button>
              ))}
            </div>

            <div className="gp-form-grid">
              <div className="gp-form-field gp-form-wide">
                <label>Title *</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={`Enter ${addType.toLowerCase()} title`}
                />
              </div>

              {addType === "Solution" && (
                <>
                  <div className="gp-form-field">
                    <label>Solution Category</label>
                    <select
                      value={solutionCategory}
                      onChange={(e) => setSolutionCategory(e.target.value)}
                    >
                      <option>Demand Generation</option>
                      <option>Sales Pipeline</option>
                      <option>High Intent</option>
                      <option>Meeting Booking</option>
                      <option>Data Verification</option>
                      <option>Event Marketing</option>
                    </select>
                  </div>

                  <div className="gp-form-field">
                    <label>Target Subtitle</label>
                    <input
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="e.g. For Revenue Teams Requiring Accurate Prospect Records"
                    />
                  </div>
                </>
              )}

              {addType === "Article" && (
                <>
                  <div className="gp-form-field">
                    <label>Industry / Category</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                      <option>B2B Technology</option>
                      <option>Enterprise Technology</option>
                      <option>Cloud</option>
                      <option>Cybersecurity</option>
                      <option>AI</option>
                      <option>SaaS</option>
                      <option>Digital Transformation</option>
                    </select>
                  </div>

                  <div className="gp-form-field">
                    <label>Author</label>
                    <input
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="Author name"
                    />
                  </div>
                </>
              )}

              {addType === "Research" && (
                <>
                  <div className="gp-form-field">
                    <label>Research Type</label>
                    <select value={resourceType} onChange={(e) => setResourceType(e.target.value)}>
                      <option>Industry Report</option>
                      <option>Enterprise Technology Trends</option>
                      <option>Buyer Insights</option>
                    </select>
                  </div>

                  <div className="gp-form-field">
                    <label>Industry</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                      <option>B2B Technology</option>
                      <option>Enterprise Technology</option>
                      <option>Cloud</option>
                      <option>Cybersecurity</option>
                      <option>AI</option>
                      <option>SaaS</option>
                    </select>
                  </div>
                </>
              )}

              {addType === "Resource" && (
                <>
                  <div className="gp-form-field">
                    <label>Resource Type</label>
                    <select value={resourceType} onChange={(e) => setResourceType(e.target.value)}>
                      <option>Whitepaper</option>
                      <option>Playbook</option>
                      <option>Guide</option>
                    </select>
                  </div>

                  <div className="gp-form-field">
                    <label>Industry</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                      <option>B2B Technology</option>
                      <option>Enterprise Technology</option>
                      <option>Cloud</option>
                      <option>Cybersecurity</option>
                      <option>AI</option>
                      <option>SaaS</option>
                    </select>
                  </div>
                </>
              )}

              {addType === "Newsletter" && (
                <div className="gp-form-field">
                  <label>Frequency</label>
                  <select value={newsletterFreq} onChange={(e) => setNewsletterFreq(e.target.value)}>
                    <option>Weekly</option>
                    <option>Monthly</option>
                  </select>
                </div>
              )}

              <div className="gp-form-field gp-form-wide">
                <label>Featured Image (Optional)</label>
                <div className="gp-image-input-row">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      if (e.target.value) setImagePreview(e.target.value);
                    }}
                    placeholder="Paste image URL (e.g. https://images.unsplash.com/...)"
                  />
                  <span className="gp-or-divider">OR</span>
                  <label className="gp-file-upload-btn">
                    Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            const result = reader.result as string;
                            setImagePreview(result);
                            setImageUrl(result);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
                {imagePreview && (
                  <div className="gp-image-preview-wrap">
                    <img src={imagePreview} alt="Preview" />
                    <button
                      type="button"
                      onClick={() => {
                        setImageUrl("");
                        setImagePreview("");
                      }}
                    >
                      ✕ Remove Image
                    </button>
                  </div>
                )}
              </div>

              <div className="gp-form-field gp-form-wide">
                <label>Description / Summary</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter summary or overview"
                  rows={4}
                />
              </div>
            </div>

            <div className="gp-modal-footer">
              <button className="gp-secondary-button" onClick={() => setShowAddContent(false)}>
                Cancel
              </button>
              <button className="gp-primary-button gp-create-button" onClick={handleAddContent}>
                Add {addType}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= EDIT CONTENT MODAL ================= */}
      {showEditModal && editingItem && (
        <div className="gp-modal-backdrop" onClick={() => setShowEditModal(false)}>
          <div className="gp-add-modal" onClick={(e) => e.stopPropagation()}>
            <div className="gp-modal-header">
              <div>
                <h2>Edit {editType}</h2>
                <p>Update publication details and metadata.</p>
              </div>
              <button
                className="gp-modal-close"
                aria-label="Close"
                onClick={() => setShowEditModal(false)}
              >
                ×
              </button>
            </div>

            <div className="gp-form-grid">
              <div className="gp-form-field gp-form-wide">
                <label>Title *</label>
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder={`Enter ${editType.toLowerCase()} title`}
                />
              </div>

              {editType === "Article" && (
                <>
                  <div className="gp-form-field">
                    <label>Industry / Category</label>
                    <select value={editCategory} onChange={(e) => setEditCategory(e.target.value)}>
                      <option>B2B Technology</option>
                      <option>Enterprise Technology</option>
                      <option>Cloud</option>
                      <option>Cybersecurity</option>
                      <option>AI</option>
                      <option>SaaS</option>
                      <option>Digital Transformation</option>
                    </select>
                  </div>

                  <div className="gp-form-field">
                    <label>Author</label>
                    <input
                      value={editAuthor}
                      onChange={(e) => setEditAuthor(e.target.value)}
                      placeholder="Author name"
                    />
                  </div>
                </>
              )}

              {editType === "Resource" && (
                <>
                  <div className="gp-form-field">
                    <label>Resource Type</label>
                    <select value={editResourceType} onChange={(e) => setEditResourceType(e.target.value)}>
                      <option>Buyer Insights</option>
                      <option>Whitepaper</option>
                      <option>Playbook</option>
                      <option>Industry Report</option>
                    </select>
                  </div>

                  <div className="gp-form-field">
                    <label>Industry</label>
                    <select value={editCategory} onChange={(e) => setEditCategory(e.target.value)}>
                      <option>B2B Technology</option>
                      <option>Enterprise Technology</option>
                      <option>Cloud</option>
                      <option>Cybersecurity</option>
                      <option>AI</option>
                      <option>SaaS</option>
                    </select>
                  </div>
                </>
              )}

              {editType === "Newsletter" && (
                <div className="gp-form-field">
                  <label>Frequency</label>
                  <select value={editNewsletterFreq} onChange={(e) => setEditNewsletterFreq(e.target.value)}>
                    <option>Weekly</option>
                    <option>Monthly</option>
                  </select>
                </div>
              )}

              {(editType === "Article" || editType === "Case Study") && (
                <div className="gp-form-field gp-form-wide">
                  <label>Featured Image (Optional)</label>
                  <div className="gp-image-input-row">
                    <input
                      type="url"
                      value={editImageUrl}
                      onChange={(e) => {
                        setEditImageUrl(e.target.value);
                        if (e.target.value) setEditImagePreview(e.target.value);
                      }}
                      placeholder="Paste image URL (e.g. https://images.unsplash.com/...)"
                    />
                    <span className="gp-or-divider">OR</span>
                    <label className="gp-file-upload-btn">
                      Upload Image
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              const result = reader.result as string;
                              setEditImagePreview(result);
                              setEditImageUrl(result);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                  {editImagePreview && (
                    <div className="gp-image-preview-wrap">
                      <img src={editImagePreview} alt="Preview" />
                      <button
                        type="button"
                        onClick={() => {
                          setEditImageUrl("");
                          setEditImagePreview("");
                        }}
                      >
                        ✕ Remove Image
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="gp-form-field gp-form-wide">
                <label>Description / Summary</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Enter summary or overview"
                  rows={4}
                />
              </div>
            </div>

            <div className="gp-modal-footer">
              <button className="gp-secondary-button" onClick={() => setShowEditModal(false)}>
                Cancel
              </button>
              <button className="gp-primary-button gp-create-button" onClick={handleSaveEdit}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="gp-demo-toast">
          {toastMessage}
          <button onClick={() => setToastMessage("")}>×</button>
        </div>
      )}

      <style>{`
        *{box-sizing:border-box}
        .gp-dashboard{min-height:100vh;display:flex;background:#060B12;color:#D5DBE7;font-family: var(--font-sans)}
        .gp-dashboard-sidebar{width:250px;min-height:100vh;flex-shrink:0;display:flex;flex-direction:column;background:#060B12;color:#fff;position:sticky;top:0;z-index:30;border-right:1px solid rgba(203, 213, 225, 0.12);box-shadow:5px 0 18px rgba(0,0,0,.15)}
        .gp-dashboard-brand{min-height:91px;padding:20px 21px 17px;border-bottom:1px solid rgba(203, 213, 225, 0.12)}
        .gp-dashboard-brand img{width:160px;max-width:100%;height:auto;display:block;margin-bottom:8px;object-fit:contain}
        .gp-dashboard-brand span{color:#aeb8ca;font-size:11px;letter-spacing:.2px}
        .gp-dashboard-sidebar nav{padding:15px 13px;display:flex;flex-direction:column;gap:5px}
        .gp-sidebar-nav-groups{padding:12px 10px;display:flex;flex-direction:column;gap:3px}
        .gp-nav-section-title{font-size:10px;font-weight:800;color:#64748B;letter-spacing:0.08em;text-transform:uppercase;padding:12px 12px 4px}
        .gp-side-item{width:100%;min-height:42px;display:flex;align-items:center;gap:12px;padding:9px 12px;border:0;border-radius:7px;background:transparent;color:#d5dbe7;text-align:left;font-size:13.5px;font-weight:700;cursor:pointer;transition:.2s ease}
        .gp-side-item span{width:20px;text-align:center;font-size:17px;color:#cbd3e1}
        .gp-side-item:hover{background:rgba(0, 70, 252, 0.15);color:#fff}
        .gp-side-item.active{background:#0046FC;color:#FFFFFF;box-shadow:0 5px 16px rgba(0, 70, 252, 0.25)}
        .gp-side-item.active span{color:#FFFFFF}
        .gp-main-categories-panel{background:#0D1522;border:1px solid rgba(203, 213, 225, 0.12);border-radius:12px;padding:22px 24px;margin-bottom:24px}
        .gp-main-categories-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:16px}
        .gp-main-cat-card{background:#060B12;border:1px solid rgba(203, 213, 225, 0.12);border-radius:10px;padding:18px 20px;display:flex;flex-direction:column;justify-content:space-between;cursor:pointer;transition:all .2s ease}
        .gp-main-cat-card:hover{transform:translateY(-2px);border-color:#00D2FF;box-shadow:0 8px 24px rgba(0,70,252,.25)}
        .gp-cat-card-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
        .gp-cat-icon{font-size:22px;color:#00D2FF}
        .gp-cat-badge{font-size:10px;font-weight:800;color:#00D4AA;background:rgba(0,212,170,.12);border:1px solid rgba(0,212,170,.25);padding:3px 8px;border-radius:12px;text-transform:uppercase}
        .gp-cat-card-center strong{display:block;font-size:28px;font-weight:800;color:#FFFFFF;margin-bottom:2px}
        .gp-cat-card-center h3{font-size:15px;font-weight:700;color:#FFFFFF;margin:0 0 4px 0}
        .gp-cat-card-center p{font-size:12px;color:#94A3B8;margin:0 0 14px 0;line-height:1.4}
        .gp-cat-card-action{border-top:1px solid rgba(203,213,225,.08);padding-top:10px;font-size:12px;font-weight:700;color:#00D2FF}
        .gp-article-filters-wrap{display:flex;flex-direction:column;gap:12px;margin:16px 0}
        .gp-article-search{position:relative;width:100%}
        .gp-article-search span{position:absolute;left:12px;top:50%;transform:translateY(-50%);font-size:13px;opacity:.6}
        .gp-article-search input{width:100%;box-sizing:border-box;padding:10px 36px 10px 36px;background:#060B12;border:1px solid rgba(203,213,225,.15);border-radius:8px;color:#FFFFFF;font-size:13.5px;outline:none}
        .gp-article-search button{position:absolute;right:12px;top:50%;transform:translateY(-50%);background:transparent;border:0;color:#94A3B8;font-size:16px;cursor:pointer}
        .gp-industry-pills{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
        .gp-industry-pill{padding:6px 12px;background:#060B12;border:1px solid rgba(203,213,225,.15);border-radius:20px;color:#94A3B8;font-size:12px;font-weight:700;cursor:pointer;transition:all .2s ease}
        .gp-industry-pill:hover{color:#FFFFFF;border-color:rgba(0,210,255,.4)}
        .gp-industry-pill.active{background:rgba(0,210,255,.15);border-color:#00D2FF;color:#00D2FF}
        .gp-results-badge{font-size:12px;font-weight:700;color:#94A3B8;background:rgba(255,255,255,.06);padding:6px 12px;border-radius:6px}
        .gp-sidebar-bottom{margin-top:auto;padding:18px 16px;border-top:1px solid rgba(255,255,255,.08)}
        .gp-sidebar-user{display:flex;align-items:center;gap:10px;margin-bottom:13px}
        .gp-sidebar-user span{width:34px;height:34px;border-radius:50%;background:#00D2FF;color:#060B12;display:grid;place-items:center;font-size:11px;font-weight:700}
        .gp-sidebar-user strong{display:block;font-size:13px;color:#fff}
        .gp-sidebar-user small{color:#9aa7bd;font-size:11px}
        .gp-sidebar-website-link{display:flex;align-items:center;gap:10px;width:100%;padding:10px 12px;margin-bottom:14px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:6px;color:#e2e8f0;text-decoration:none;font-size:13px;font-weight:700;transition:.2s ease}
        .gp-sidebar-website-link:hover{background:rgba(255,255,255,.14);color:#fff}
        .gp-sidebar-bottom button{width:100%;padding:8px 10px;border:1px solid rgba(255,255,255,.14);background:transparent;color:#fff;border-radius:6px;cursor:pointer;font-size:12px;font-weight:700}
        .gp-sidebar-bottom button:hover{background:rgba(255,255,255,.08)}
        .gp-dashboard-main{flex:1;min-width:0;display:flex;flex-direction:column}
        .gp-dashboard-header{height:91px;padding:0 30px;background:#0D1522;border-bottom:1px solid rgba(203, 213, 225, 0.12);display:flex;align-items:center;justify-content:space-between;gap:20px}
        .gp-header-left{display:flex;align-items:center;gap:14px}
        .gp-menu-button{display:none;font-size:22px;border:0;background:transparent;color:#FFFFFF;cursor:pointer}
        .gp-header-left strong{display:block;font-size:18px;color:#FFFFFF}
        .gp-header-left small{color:#AEB8CA;font-size:12px}
        .gp-header-actions{display:flex;align-items:center;gap:14px}
        .gp-view-website-button{display:inline-flex;align-items:center;gap:6px;padding:9px 15px;border-radius:7px;font-size:13px;font-weight:600;color:#D5DBE7;background:#111C2D;border:1px solid rgba(203, 213, 225, 0.16);text-decoration:none;transition:.2s ease}
        .gp-view-website-button:hover{background:rgba(203, 213, 225, 0.14);color:#FFFFFF;border-color:#00D2FF}
        .gp-add-content-button{background:#0046FC;color:#fff;border:0;padding:10px 18px;border-radius:7px;font-size:13px;font-weight:700;cursor:pointer;transition:.2s ease}
        .gp-admin-profile{display:flex;align-items:center;gap:12px;background:rgba(255,255,255,0.03);padding:6px 14px 6px 12px;border-radius:30px;border:1px solid rgba(203, 213, 225, 0.12)}
        .gp-admin-profile .gp-admin-profile-info{display:flex;flex-direction:column;align-items:flex-end;text-align:right;line-height:1.2}
        .gp-admin-profile strong{display:block;font-size:13.5px;font-weight:700;color:#FFFFFF;margin-bottom:2px}
        .gp-admin-profile small{display:block;font-size:11px;font-weight:600;color:#00D2FF;text-transform:uppercase;letter-spacing:0.5px}
        .gp-admin-profile span,
        .gp-admin-profile .gp-admin-avatar{width:36px;height:36px;border-radius:50%;background:#111C2D;color:#00D2FF;border:1px solid rgba(0, 210, 255, 0.35);display:grid;place-items:center;font-size:12px;font-weight:700;box-shadow:0 0 10px rgba(0, 210, 255, 0.15)}
        .gp-dashboard-content{padding:26px 30px 40px;flex:1}
        .gp-dashboard-heading{margin-bottom:24px}
        .gp-dashboard-heading h1{font-size:28px;margin-bottom:6px;font-family:var(--font-serif);color:#FFFFFF}
        .gp-dashboard-heading p{color:#AEB8CA;font-size:14px}
        .gp-stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:16px;margin-bottom:25px}
        .gp-stat-card{background:#0D1522;border:1px solid rgba(203, 213, 225, 0.12);border-radius:10px;padding:18px 20px;box-shadow:none}
        .gp-stat-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;color:#AEB8CA;font-size:13px}
        .gp-stat-top i{font-style:normal;font-size:16px}
        .gp-stat-card strong{display:block;font-size:28px;font-weight:700;color:#FFFFFF;margin-bottom:4px}
        .gp-stat-card small{color:#AEB8CA;font-size:12px}
        .gp-dashboard-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}
        .gp-panel{background:#0D1522;border:1px solid rgba(203, 213, 225, 0.12);border-radius:10px;padding:22px 24px;box-shadow:none}
        .gp-full-panel{width:100%}
        .gp-panel-heading{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:20px}
        .gp-panel-heading h2{font-size:18px;margin-bottom:4px;font-family:var(--font-serif);color:#FFFFFF}
        .gp-panel-heading p{color:#AEB8CA;font-size:13px}
        .gp-panel-heading button{background:transparent;border:0;color:#00D2FF;font-weight:700;cursor:pointer;font-size:13px}
        .gp-article-row{display:flex;align-items:center;gap:14px;padding:12px 0;border-bottom:1px solid rgba(255,255,255,.08)}
        .gp-row-image img{width:60px;height:45px;border-radius:6px;object-fit:cover}
        .gp-row-copy strong{display:block;font-size:14px;color:#FFFFFF}
        .gp-row-copy small{color:#AEB8CA;font-size:12px}
        .gp-simple-row{display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid rgba(255,255,255,.08);gap:10px}
        .gp-simple-row small{color:#00D2FF;font-size:11px;font-weight:700;display:block}
        .gp-simple-row strong{font-size:14px;color:#FFFFFF;display:block}
        .gp-simple-row p{font-size:12px;color:#AEB8CA;margin:3px 0 0;max-width:320px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .gp-status-pill{padding:4px 9px;border-radius:12px;font-size:11px;font-weight:700;background:#111C2D;color:#00D2FF;border:1px solid rgba(255,255,255,.08)}
        .gp-status-pill.read{background:rgba(255,255,255,.06);color:#AEB8CA}
        .gp-status-pill.replied{background:rgba(16, 185, 129, 0.15);color:#6ee7b7}
        .gp-admin-content-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:18px}
        .gp-content-card{background:#0D1522;border:1px solid rgba(203, 213, 225, 0.12);border-radius:8px;overflow:hidden}
        .gp-demo-large-thumb img{width:100%;height:140px;object-fit:cover}
        .gp-content-card div{padding:14px}
        .gp-content-card small{color:#00D2FF;font-size:11px;font-weight:700}
        .gp-content-card h3{font-size:15px;margin:5px 0 6px;line-height:1.3;font-family:var(--font-serif);color:#FFFFFF}
        .gp-content-card p{color:#AEB8CA;font-size:12px}
        .gp-card-actions{display:flex;align-items:center;gap:8px;margin-top:12px;padding-top:10px;border-top:1px solid rgba(255,255,255,.08)}
        .gp-card-edit-btn{padding:5px 10px;border:1px solid rgba(255,255,255,.16);background:#111C2D;border-radius:5px;color:#D5DBE7;font-size:12px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:4px;transition:0.15s ease}
        .gp-card-edit-btn:hover{background:#0046FC;color:#FFFFFF;border-color:#0046FC}
        .gp-card-delete-btn{padding:5px 10px;border:1px solid rgba(225,29,72,.3);background:rgba(225,29,72,.12);border-radius:5px;color:#fecdd3;font-size:12px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:4px;transition:0.15s ease}
        .gp-card-delete-btn:hover{background:rgba(225,29,72,.25);border-color:#fda4af}
        .gp-case-study-card{background:#0D1522;border:1px solid rgba(203, 213, 225, 0.14);border-top:3px solid #0046FC;border-radius:10px;overflow:hidden;display:flex;flex-direction:column;transition:all .25s ease}
        .gp-case-study-card:hover{transform:translateY(-4px);border-color:#00D2FF;border-top-color:#00D2FF;box-shadow:0 12px 30px rgba(0, 70, 252, 0.25)}
        .gp-case-card-thumb{position:relative;height:145px;overflow:hidden;background:#060B12}
        .gp-case-card-thumb img{width:100%;height:100%;object-fit:cover;transition:transform .4s ease}
        .gp-case-study-card:hover .gp-case-card-thumb img{transform:scale(1.05)}
        .gp-case-card-type-tag{position:absolute;top:10px;left:10px;background:rgba(0, 70, 252, 0.9);color:#fff;font-size:10px;font-weight:800;letter-spacing:.5px;padding:3px 8px;border-radius:4px}
        .gp-case-card-metric-badge{position:absolute;top:10px;right:10px;background:rgba(0, 210, 255, 0.95);color:#060B12;font-size:11px;font-weight:800;padding:3px 8px;border-radius:10px}
        .gp-case-card-content{padding:16px;display:flex;flex-direction:column;flex:1}
        .gp-case-client-tag{font-size:11px;font-weight:800;color:#00D2FF;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px;display:block}
        .gp-case-card-content h3{font-size:15.5px;font-weight:700;color:#FFFFFF;margin:0 0 8px;line-height:1.35;font-family:var(--font-serif)}
        .gp-case-card-content p{font-size:12.5px;color:#94A3B8;line-height:1.45;margin:0 0 12px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
        .gp-case-meta-row{display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-top:1px solid rgba(255, 255, 255, 0.08);font-size:12px;margin-top:auto}
        .gp-published-pill{background:rgba(16, 185, 129, 0.15);color:#34D399;font-size:11px;font-weight:700;padding:2px 8px;border-radius:4px;border:1px solid rgba(16, 185, 129, 0.3)}
        .gp-case-view-link{color:#00D2FF;text-decoration:none;font-weight:700;font-size:12px}
        .gp-case-view-link:hover{text-decoration:underline}
        .gp-enquiries-table-wrap{overflow-x:auto}
        .gp-enquiries-table{width:100%;border-collapse:collapse;font-size:13px;text-align:left}
        .gp-enquiries-table th{padding:12px 14px;background:#111C2D;border-bottom:2px solid rgba(203, 213, 225, 0.12);color:#AEB8CA;font-weight:700}
        .gp-enquiries-table td{padding:12px 14px;border-bottom:1px solid rgba(255,255,255,.08);color:#D5DBE7}
        .gp-subject-badge{display:inline-block;padding:3px 8px;border-radius:4px;background:#111C2D;color:#00D2FF;border:1px solid rgba(255,255,255,.08);font-size:11px;font-weight:600}
        .gp-message-cell{max-width:240px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .gp-status-select{padding:4px 6px;border-radius:4px;border:1px solid rgba(203, 213, 225, 0.16);background:#060B12;color:#FFFFFF;font-size:12px;font-weight:600}
        .gp-delete-btn{border:0;background:transparent;cursor:pointer;font-size:15px;color:#AEB8CA}
        .gp-delete-btn:hover{color:#fecdd3}
        .gp-empty-box{padding:50px 20px;text-align:center}
        .gp-empty-icon{font-size:36px;margin-bottom:12px}
        .gp-empty-box h3{font-size:18px;margin-bottom:8px;color:#FFFFFF}
        .gp-empty-box p{color:#AEB8CA;font-size:14px;margin-bottom:18px}
        .gp-primary-button{display:inline-block;background:#0046FC;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none;font-weight:700;font-size:13px}
        .gp-modal-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.65);backdrop-filter:blur(6px);display:grid;place-items:center;z-index:1000;padding:20px}
        .gp-add-modal{background:#0D1522;border:1px solid rgba(203, 213, 225, 0.12);width:min(600px,100%);border-radius:10px;padding:26px;box-shadow:0 10px 30px rgba(0,0,0,.5);color:#D5DBE7}
        .gp-modal-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:18px}
        .gp-modal-header h2{font-size:20px;margin-bottom:4px;font-family:var(--font-serif);color:#FFFFFF}
        .gp-modal-header p{color:#AEB8CA;font-size:13px}
        .gp-modal-close{border:0;background:transparent;font-size:22px;cursor:pointer;color:#AEB8CA}
        .gp-modal-close:hover{color:#FFFFFF}
        .gp-modal-type{display:flex;gap:8px;margin-bottom:20px;border-bottom:1px solid rgba(255,255,255,.08);padding-bottom:12px}
        .gp-modal-type button{padding:7px 14px;border-radius:6px;border:1px solid rgba(203, 213, 225, 0.16);background:#111C2D;color:#D5DBE7;font-size:13px;font-weight:600;cursor:pointer}
        .gp-modal-type button.selected{background:#0046FC;color:#fff;border-color:#0046FC}
        .gp-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
        .gp-form-wide{grid-column:1/-1}
        .gp-form-field label{display:block;font-size:12px;font-weight:700;color:#D5DBE7;margin-bottom:6px}
        .gp-form-field input, .gp-form-field select, .gp-form-field textarea{width:100%;padding:9px 12px;border:1px solid rgba(203, 213, 225, 0.16);background:#060B12;color:#FFFFFF;border-radius:6px;font-size:13px;outline:none}
        .gp-form-field input:focus, .gp-form-field select:focus, .gp-form-field textarea:focus{border-color:#0055FF}
        .gp-image-input-row{display:flex;gap:10px;align-items:center}
        .gp-or-divider{font-size:11px;color:#AEB8CA;font-weight:700;flex-shrink:0}
        .gp-file-upload-btn{display:inline-flex;align-items:center;justify-content:center;padding:9px 14px;background:#111C2D;color:#00D2FF;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap;border:1px solid #0046FC;flex-shrink:0}
        .gp-file-upload-btn:hover{background:rgba(255,255,255,.1)}
        .gp-image-preview-wrap{margin-top:10px;display:flex;align-items:center;gap:14px;padding:8px 12px;background:#111C2D;border-radius:6px;border:1px solid rgba(203, 213, 225, 0.12)}
        .gp-image-preview-wrap img{width:70px;height:50px;border-radius:6px;object-fit:cover;border:1px solid rgba(255,255,255,.16)}
        .gp-image-preview-wrap button{background:transparent;border:0;color:#fecdd3;font-size:12px;font-weight:700;cursor:pointer}
        .gp-modal-footer{display:flex;justify-content:flex-end;gap:10px;margin-top:20px}
        .gp-secondary-button{padding:9px 16px;border:1px solid rgba(203, 213, 225, 0.16);background:#111C2D;color:#D5DBE7;border-radius:6px;font-size:13px;font-weight:600;cursor:pointer}
        .gp-secondary-button:hover{background:rgba(255,255,255,.14);color:#FFFFFF}
        .gp-create-button{border:0;cursor:pointer}
        .gp-demo-toast{position:fixed;bottom:24px;right:24px;background:#10b981;color:#fff;padding:12px 18px;border-radius:6px;box-shadow:0 4px 12px rgba(0,0,0,.15);display:flex;align-items:center;gap:12px;font-size:13px;font-weight:600;z-index:2000}
        .gp-demo-toast button{border:0;background:transparent;color:#fff;font-size:16px;cursor:pointer}
        @media(max-width:800px){
          .gp-dashboard-sidebar{position:fixed;left:-250px;transition:.3s ease}
          .gp-dashboard-sidebar.mobile-open{left:0}
          .gp-menu-button{display:block}
          .gp-dashboard-grid{grid-template-columns:1fr}
        }
      `}</style>
    </div>
  );
};

export default Dashboard;

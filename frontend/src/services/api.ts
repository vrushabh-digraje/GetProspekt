const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getHeaders = (includeAuth = false) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (includeAuth) {
    const token = localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return headers;
};

// ================= AUTH API =================
export const authApi = {
  login: async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to log in.");
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      return data;
    } catch (error: any) {
      // Fallback for standalone demo when backend server is offline
      if (email === "admin@getprospekt.co" && password === "admin123") {
        localStorage.setItem("token", "mock_jwt_token_2026");
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem(
          "user",
          JSON.stringify({ name: "Admin", email, role: "admin" })
        );
        return {
          token: "mock_jwt_token_2026",
          user: { name: "Admin", email, role: "admin" },
        };
      }
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
  },

  getMe: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getHeaders(true),
    });
    return response.json();
  },
};

// ================= ARTICLES API =================
export const articlesApi = {
  getAll: async (category?: string) => {
    try {
      const url = category
        ? `${API_BASE_URL}/articles?category=${encodeURIComponent(category)}`
        : `${API_BASE_URL}/articles`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch articles");
      return await response.json();
    } catch (error) {
      console.warn("[API Warning] Using local article fallback:", error);
      return [];
    }
  },

  getBySlug: async (slug: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/articles/${slug}`);
      if (!response.ok) throw new Error("Article not found");
      return await response.json();
    } catch (error) {
      return null;
    }
  },

  create: async (articleData: any) => {
    const response = await fetch(`${API_BASE_URL}/articles`, {
      method: "POST",
      headers: getHeaders(true),
      body: JSON.stringify(articleData),
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || "Failed to create article");
    }
    return response.json();
  },

  update: async (id: string, articleData: any) => {
    const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
      method: "PUT",
      headers: getHeaders(true),
      body: JSON.stringify(articleData),
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || "Failed to update article");
    }
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
      method: "DELETE",
      headers: getHeaders(true),
    });
    return response.json();
  },
};

// ================= CASE STUDIES API =================
export const caseStudiesApi = {
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/case-studies`);
      if (!response.ok) throw new Error("Failed to fetch case studies");
      return await response.json();
    } catch (error) {
      return [];
    }
  },

  create: async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/case-studies`, {
      method: "POST",
      headers: getHeaders(true),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || "Failed to create case study");
    }
    return response.json();
  },

  update: async (id: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}/case-studies/${id}`, {
      method: "PUT",
      headers: getHeaders(true),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || "Failed to update case study");
    }
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/case-studies/${id}`, {
      method: "DELETE",
      headers: getHeaders(true),
    });
    return response.json();
  },
};

// ================= ENQUIRIES API =================
export const enquiriesApi = {
  submit: async (enquiryData: {
    firstName: string;
    lastName: string;
    email: string;
    company?: string;
    telephone?: string;
    country?: string;
    companySize?: string;
    city?: string;
    address?: string;
    postalCode?: string;
    industry?: string;
    jobTitle?: string;
    resourceId?: string;
    resourceTitle?: string;
    optInMarketing?: boolean;
    optInPartner?: boolean;
    subject?: string;
    message?: string;
    [key: string]: any;
  }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/enquiries`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(enquiryData),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Failed to submit enquiry");
      }

      return await response.json();
    } catch (error) {
      // Offline fallback: save to localStorage so it still appears in the dashboard
      const local = JSON.parse(localStorage.getItem("local_enquiries") || "[]");
      const newEnquiry = {
        _id: `local_${Date.now()}`,
        ...enquiryData,
        status: "New",
        createdAt: new Date().toISOString(),
      };
      local.unshift(newEnquiry);
      localStorage.setItem("local_enquiries", JSON.stringify(local));
      return { message: "Enquiry submitted successfully (offline saved).", enquiry: newEnquiry };
    }
  },

  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/enquiries`, {
        headers: getHeaders(true),
      });
      if (!response.ok) throw new Error("Failed to fetch enquiries");
      const serverEnquiries = await response.json();
      const local = JSON.parse(localStorage.getItem("local_enquiries") || "[]");
      return [...local, ...serverEnquiries];
    } catch (error) {
      return JSON.parse(localStorage.getItem("local_enquiries") || "[]");
    }
  },

  updateStatus: async (id: string, status: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/enquiries/${id}`, {
        method: "PATCH",
        headers: getHeaders(true),
        body: JSON.stringify({ status }),
      });
      return await response.json();
    } catch (error) {
      const local = JSON.parse(localStorage.getItem("local_enquiries") || "[]");
      const updated = local.map((item: any) =>
        item._id === id ? { ...item, status } : item
      );
      localStorage.setItem("local_enquiries", JSON.stringify(updated));
      return { success: true };
    }
  },

  delete: async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/enquiries/${id}`, {
        method: "DELETE",
        headers: getHeaders(true),
      });
      return await response.json();
    } catch (error) {
      const local = JSON.parse(localStorage.getItem("local_enquiries") || "[]");
      const updated = local.filter((item: any) => item._id !== id);
      localStorage.setItem("local_enquiries", JSON.stringify(updated));
      return { success: true };
    }
  },
};

export const initialDemoResources = [
  {
    _id: "res-1",
    title: "Get ahead and stay ahead",
    type: "Whitepaper",
    category: "Enterprise Technology",
    coverImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=85",
    summary: "Pay less, be more productive and maximize sustainability throughout the lifecycle with our Technology Rotation promotions.",
    content: "Explore how Dell Technologies and modern enterprise infrastructure rotation models lower acquisition costs by up to 12.5% while optimizing hardware refresh cycles. Includes total economic impact analysis, deployment timetables, and energy sustainability metrics.",
    fileUrl: "/sample-whitepaper.pdf",
    downloadCount: 428,
    status: "Published",
    createdAt: "2026-09-15T10:00:00.000Z",
  },
  {
    _id: "res-2",
    title: "PC-as-a-Service: Unlocking New IT Capabilities To Improve Employee Experience",
    type: "Whitepaper",
    category: "Cloud & Infrastructure",
    coverImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=85",
    summary: "A Forrester Consulting Thought Leadership Paper on how modern device-as-a-service frameworks accelerate deployment, reduce IT overhead, and empower hybrid workforces.",
    content: "Modern IT departments face increasing pressure to provide secure, seamless computing experiences across distributed teams. Learn how transitioning from capex procurement to PC-as-a-Service cuts support tickets by 34% and accelerates new hire onboarding.",
    fileUrl: "/sample-whitepaper.pdf",
    downloadCount: 312,
    status: "Published",
    createdAt: "2026-09-18T10:00:00.000Z",
  },
  {
    _id: "res-3",
    title: "PRODUCT CATALOGUE: Next-Gen Enterprise Systems",
    type: "Whitepaper",
    category: "B2B Technology",
    coverImage: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=85",
    summary: "Comprehensive catalogue of enterprise technology solutions, storage platforms, and security services engineered to keep business operations fast and efficient.",
    content: "Discover next-generation server clusters, hyper-converged infrastructure, enterprise storage architectures, and perimeter defense systems tailored for mission-critical workloads.",
    fileUrl: "/sample-whitepaper.pdf",
    downloadCount: 567,
    status: "Published",
    createdAt: "2026-09-20T10:00:00.000Z",
  },
  {
    _id: "res-4",
    title: "A Technical Brief Framework For Dell Technologies' Unified Workspace",
    type: "Whitepaper",
    category: "Cybersecurity",
    coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=85",
    summary: "A Forrester Total Economic Impact Study detailing step-by-step methodologies to maximize ROI through unified workspace and automated endpoint management.",
    content: "Unified Workspace integrates cloud-first deployment, intelligent security, and proactive support across your entire fleet. Read the technical architecture guide and compliance checklist for zero-trust endpoint deployment.",
    fileUrl: "/sample-whitepaper.pdf",
    downloadCount: 295,
    status: "Published",
    createdAt: "2026-09-22T10:00:00.000Z",
  },
  {
    _id: "res-5",
    title: "2026 Enterprise B2B Pipeline Benchmark Report",
    type: "Industry Report",
    category: "B2B Technology",
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=85",
    summary: "In-depth research on conversion rates, qualification criteria, and lead acquisition costs across 500+ enterprise software companies.",
    content: "Analyzes benchmark data from over 2.4 million enterprise sales conversations. Benchmark your MQL-to-SQL conversion ratios, BANT qualification thresholds, and average sales cycle length against top-quartile performers.",
    fileUrl: "/sample-whitepaper.pdf",
    downloadCount: 780,
    status: "Published",
    createdAt: "2026-09-24T10:00:00.000Z",
  },
  {
    _id: "res-6",
    title: "The Definitive B2B Outbound Playbook: Qualification & Scripting",
    type: "Playbook",
    category: "Sales Development",
    coverImage: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=800&q=85",
    summary: "A step-by-step operational playbook covering multi-touch outreach cadence, gatekeeper navigation, and objection handling for high-ticket solutions.",
    content: "Get the battle-tested objection handling frameworks, multi-channel cadences (phone, email, social), and SDR call scripts that generated $42M in enterprise pipeline.",
    fileUrl: "/sample-whitepaper.pdf",
    downloadCount: 640,
    status: "Published",
    createdAt: "2026-09-26T10:00:00.000Z",
  },
  {
    _id: "res-7",
    title: "Enterprise Buyer Intent Signals & Purchasing Cycles",
    type: "Buyer Insights",
    category: "AI & Decision Intelligence",
    coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=85",
    summary: "Comprehensive market analysis on how enterprise buying committees evaluate, budget for, and adopt next-gen AI and data solutions in 2026.",
    content: "Enterprise technology procurement has fundamentally shifted. Buying committees now involve an average of 6.8 decision-makers spanning IT, InfoSec, Procurement, and Business Unit leadership. This research brief analyzes verified behavioral intent signals, budget approval trigger events, consensus-building friction points, and vendor evaluation matrices that predict closed-won software deals.",
    fileUrl: "/sample-whitepaper.pdf",
    downloadCount: 520,
    status: "Published",
    createdAt: "2026-09-28T10:00:00.000Z",
  },
];

// ================= RESOURCES & RESEARCH API =================
export const resourcesApi = {
  getAll: async (type?: string) => {
    try {
      const url = type
        ? `${API_BASE_URL}/resources?type=${encodeURIComponent(type)}`
        : `${API_BASE_URL}/resources`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch server resources");
      const serverResources = await response.json();
      if (serverResources && serverResources.length > 0) {
        return serverResources;
      }
    } catch (error) {
      // Fallback to local
    }

    const local = JSON.parse(localStorage.getItem("local_resources") || "null");
    let pool = local || initialDemoResources;
    if (local) {
      // Ensure missing demo items (like Buyer Insights) are synced automatically
      const missing = initialDemoResources.filter(
        (demo) => !local.some((l: any) => l._id === demo._id || l.title === demo.title)
      );
      if (missing.length > 0) {
        pool = [...local, ...missing];
        localStorage.setItem("local_resources", JSON.stringify(pool));
      }
    } else {
      localStorage.setItem("local_resources", JSON.stringify(initialDemoResources));
    }

    if (type) {
      const normalizedType = type.toLowerCase().trim();
      return pool.filter((r: any) =>
        (r.type || "").toLowerCase().includes(normalizedType) ||
        normalizedType.includes((r.type || "").toLowerCase())
      );
    }
    return pool;
  },

  getById: async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/resources/${id}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      // Fallback
    }

    const local = JSON.parse(localStorage.getItem("local_resources") || "null") || initialDemoResources;
    return local.find((r: any) => r._id === id || r.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") === id) || local[0];
  },

  create: async (data: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/resources`, {
        method: "POST",
        headers: getHeaders(true),
        body: JSON.stringify(data),
      });
      if (response.ok) return await response.json();
    } catch (error) {
      // Fallback
    }

    const local = JSON.parse(localStorage.getItem("local_resources") || "null") || [...initialDemoResources];
    const newRes = {
      _id: `local_res_${Date.now()}`,
      ...data,
      downloadCount: 0,
      createdAt: new Date().toISOString(),
    };
    local.unshift(newRes);
    localStorage.setItem("local_resources", JSON.stringify(local));
    return newRes;
  },

  update: async (id: string, data: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/resources/${id}`, {
        method: "PUT",
        headers: getHeaders(true),
        body: JSON.stringify(data),
      });
      if (response.ok) return await response.json();
    } catch (error) {
      // Fallback
    }

    const local = JSON.parse(localStorage.getItem("local_resources") || "null") || [...initialDemoResources];
    const updated = local.map((item: any) => (item._id === id ? { ...item, ...data } : item));
    localStorage.setItem("local_resources", JSON.stringify(updated));
    return { success: true, item: data };
  },

  delete: async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/resources/${id}`, {
        method: "DELETE",
        headers: getHeaders(true),
      });
      if (response.ok) return await response.json();
    } catch (error) {
      // Fallback
    }

    const local = JSON.parse(localStorage.getItem("local_resources") || "null") || [...initialDemoResources];
    const updated = local.filter((item: any) => item._id !== id);
    localStorage.setItem("local_resources", JSON.stringify(updated));
    return { success: true };
  },
};

// ================= NEWSLETTERS API =================
export const newslettersApi = {
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/newsletters`);
      return await response.json();
    } catch (error) {
      return [];
    }
  },

  create: async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/newsletters`, {
      method: "POST",
      headers: getHeaders(true),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  update: async (id: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}/newsletters/${id}`, {
      method: "PUT",
      headers: getHeaders(true),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/newsletters/${id}`, {
      method: "DELETE",
      headers: getHeaders(true),
    });
    return response.json();
  },
};

// ================= HOMEPAGE LATEST & POPULAR API =================
export interface HomepageArticle {
  _id: string;
  title: string;
  author: string;
  date: string;
  category: string;
  link: string;
  description: string;
  image: string;
}

export const initialLatestArticles: HomepageArticle[] = [
  {
    _id: "latest-1",
    image: "https://plus.unsplash.com/premium_photo-1661340603772-1ae4ff9afcb1?q=80&w=1472&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Better pipeline starts with better decisions.",
    author: "GETprospeKt",
    date: "Sep 2026",
    category: "B2B Lead Generation",
    link: "/article/better-pipeline-starts-with-better-decisions",
    description: "GETprospeKt is a B2B lead-generation partner helping marketing teams turn their target market into qualified leads — at the qualification level their business requires.",
  },
  {
    _id: "latest-2",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=90",
    title: "Human-Verified Data",
    author: "GETprospeKt",
    date: "Sep 2026",
    category: "Lead-Generation Solution",
    link: "/article/human-verified-data",
    description: "Prospect data manually reviewed and verified for accuracy, completeness and recency.",
  },
  {
    _id: "latest-3",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=90",
    title: "MQL Generation",
    author: "GETprospeKt",
    date: "Sep 2026",
    category: "Lead-Generation Solution",
    link: "/article/mql-generation",
    description: "Marketing-qualified leads generated and qualified against your agreed criteria.",
  },
  {
    _id: "latest-4",
    image: "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=1600&q=90",
    title: "SQL Generation",
    author: "GETprospeKt",
    date: "Sep 2026",
    category: "Lead-Generation Solution",
    link: "/article/sql-generation",
    description: "Sales-qualified leads that meet your agreed fit, need and sales-readiness criteria.",
  },
];

export const initialPopularArticles: HomepageArticle[] = [
  {
    _id: "pop-1",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=90",
    title: "BANT-Qualified Leads",
    author: "GETprospeKt",
    date: "Trending",
    category: "Lead-Generation Solution",
    link: "/article/bant-qualified-leads",
    description: "Leads qualified against Budget, Authority, Need and Timing.",
  },
  {
    _id: "pop-2",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=90",
    title: "Appointment Generation",
    author: "GETprospeKt",
    date: "Most Read",
    category: "Lead-Generation Solution",
    link: "/article/appointment-generation",
    description: "Confirmed meetings with your agreed target personas.",
  },
  {
    _id: "pop-3",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=90",
    title: "Webinar Campaigns",
    author: "GETprospeKt",
    date: "Popular",
    category: "Lead-Generation Solution",
    link: "/article/webinar-campaigns",
    description: "Targeted webinar campaigns designed to drive relevant registrations and engagement.",
  },
];

export const homepageShowcaseApi = {
  getLatest: (): HomepageArticle[] => {
    try {
      const saved = localStorage.getItem("gp_homepage_latest");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialLatestArticles;
  },
  saveLatest: (items: HomepageArticle[]) => {
    localStorage.setItem("gp_homepage_latest", JSON.stringify(items));
    window.dispatchEvent(new Event("gp_homepage_updated"));
    return items;
  },
  getPopular: (): HomepageArticle[] => {
    try {
      const saved = localStorage.getItem("gp_homepage_popular");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialPopularArticles;
  },
  savePopular: (items: HomepageArticle[]) => {
    localStorage.setItem("gp_homepage_popular", JSON.stringify(items));
    window.dispatchEvent(new Event("gp_homepage_updated"));
    return items;
  },
  resetDefaults: () => {
    localStorage.removeItem("gp_homepage_latest");
    localStorage.removeItem("gp_homepage_popular");
    window.dispatchEvent(new Event("gp_homepage_updated"));
    return { latest: initialLatestArticles, popular: initialPopularArticles };
  },
};

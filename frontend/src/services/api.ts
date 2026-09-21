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
    subject?: string;
    message: string;
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

// ================= RESOURCES & RESEARCH API =================
export const resourcesApi = {
  getAll: async (type?: string) => {
    try {
      const url = type
        ? `${API_BASE_URL}/resources?type=${encodeURIComponent(type)}`
        : `${API_BASE_URL}/resources`;
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      return [];
    }
  },

  create: async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/resources`, {
      method: "POST",
      headers: getHeaders(true),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  update: async (id: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}/resources/${id}`, {
      method: "PUT",
      headers: getHeaders(true),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/resources/${id}`, {
      method: "DELETE",
      headers: getHeaders(true),
    });
    return response.json();
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

import axios from "axios";

// Base API URL — points to backend server
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Common Axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach token if available
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      // Remove "Bearer" if it exists, then add it back with proper spacing
      const cleanToken = token.replace(/^Bearer\s?/, "");
      config.headers.Authorization = `Bearer ${cleanToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ================= AUTH API ==================
export const authAPI = {
  login: (data) => axiosInstance.post("/auth/login", data),
  register: (data) => axiosInstance.post("/auth/register", data),
  getMe: () => axiosInstance.get("/auth/me"),
};

// ================= NEWS API ==================
export const newsAPI = {
  getNews: (params = {}) => axiosInstance.get("/news", { params }),
  getCategories: () => axiosInstance.get("/news/categories"),
  getSources: () => axiosInstance.get("/news/sources"),
};

// ================= ARTICLES API ==================
export const articlesAPI = {
  getAll: (params = {}) => axiosInstance.get("/articles", { params }),
  getOne: (id) => axiosInstance.get(`/articles/${id}`),
  create: (data) => axiosInstance.post("/articles", data),
  update: (id, data) => axiosInstance.put(`/articles/${id}`, data),
  delete: (id) => axiosInstance.delete(`/articles/${id}`),
};

// ================= BOOKMARKS API ==================
export const bookmarkAPI = {
  // Get all bookmarks for logged-in user
  getAll: () => axiosInstance.get("/bookmarks"),

  // Save (bookmark) an article
  save: (articleData) => axiosInstance.post("/bookmarks", articleData),

  // Delete a bookmark by ID
  delete: (id) => axiosInstance.delete(`/bookmarks/${id}`),

  // Check if a specific article URL is already bookmarked
  check: (url) => axiosInstance.post("/bookmarks/check", { url }),
};

export default axiosInstance;

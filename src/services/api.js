import axios from "axios";

/**
 * IMPORTANT RULES:
 * 1. Backend base URL MUST NOT end with /
 * 2. Backend already has `/api` in controller
 * 3. VITE_API_URL must be set in production
 */

const API_BASE_URL =
  import.meta.env.VITE_API_URL ??
  "https://super-market-backend-test.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // prevent infinite waiting
});


/* =======================
   PRODUCT API
   ======================= */
export const productAPI = {
  getAll: () => api.get("/products"),

  getById: (id) => api.get(`/products/${id}`),

  getByBarcode: (barcode) =>
    api.get(`/products/barcode/${barcode}`),

  search: (keyword) =>
    api.get(`/products/search`, {
      params: { keyword },
    }),

  getByCategory: (category) =>
    api.get(`/products/category/${category}`),

  getCategories: () =>
    api.get("/products/categories"),

  getLowStock: () =>
    api.get("/products/low-stock"),

  getOutOfStock: () =>
    api.get("/products/out-of-stock"),

  create: (data) =>
    api.post("/products", data),

  update: (id, data) =>
    api.put(`/products/${id}`, data),

  delete: (id) =>
    api.delete(`/products/${id}`),

  adjustStock: (id, adjustment, notes) =>
    api.patch(`/products/${id}/adjust-stock`, {
      adjustment,
      notes,
    }),

  getStockMovements: (id) =>
    api.get(`/products/${id}/stock-movements`),
};

/* =======================
   BILLING API
   ======================= */
export const billingAPI = {
  create: (data) =>
    api.post("/bills", data),

  getAll: () =>
    api.get("/bills"),

  getById: (id) =>
    api.get(`/bills/${id}`),

  getByNumber: (billNumber) =>
    api.get(`/bills/number/${billNumber}`),

  getByDateRange: (start, end) =>
    api.get("/bills/date-range", {
      params: { start, end },
    }),
};

/* =======================
   REPORT API
   ======================= */
export const reportAPI = {
  getDashboard: () =>
    api.get("/reports/dashboard"),

  getDailyReport: () =>
    api.get("/reports/sales/daily"),

  getMonthlyReport: () =>
    api.get("/reports/sales/monthly"),

  getCustomReport: (startDate, endDate) =>
    api.get("/reports/sales/custom", {
      params: { startDate, endDate },
    }),
};

export default api;

import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Product API
export const productAPI = {
  getAll: () => api.get("/products"),
  getById: (id) => api.get(`/products/${id}`),
  getByBarcode: (barcode) => api.get(`/products/barcode/${barcode}`),
  search: (keyword) => api.get(`/products/search?keyword=${keyword}`),
  getByCategory: (category) => api.get(`/products/category/${category}`),
  getCategories: () => api.get("/products/categories"),
  getLowStock: () => api.get("/products/low-stock"),
  getOutOfStock: () => api.get("/products/out-of-stock"),
  create: (data) => api.post("/products", data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  adjustStock: (id, adjustment, notes) => api.patch(`/products/${id}/adjust-stock`, { adjustment, notes }),
  getStockMovements: (id) => api.get(`/products/${id}/stock-movements`),
}

// Billing API
export const billingAPI = {
  create: (data) => api.post("/bills", data),
  getAll: () => api.get("/bills"),
  getById: (id) => api.get(`/bills/${id}`),
  getByNumber: (billNumber) => api.get(`/bills/number/${billNumber}`),
  getByDateRange: (start, end) => api.get(`/bills/date-range?start=${start}&end=${end}`),
}

// Reports API
export const reportAPI = {
  getDashboard: () => api.get("/reports/dashboard"),
  getDailyReport: () => api.get("/reports/sales/daily"),
  getMonthlyReport: () => api.get("/reports/sales/monthly"),
  getCustomReport: (startDate, endDate) => api.get(`/reports/sales/custom?startDate=${startDate}&endDate=${endDate}`),
}

export default api

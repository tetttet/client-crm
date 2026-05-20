export const API_ENDPOINTS = {
  auth: {
    login: "/api/auth/login",
    me: "/api/auth/me",
    register: "/api/auth/register",
  },
  companies: {
    me: "/api/companies/me",
  },
  companyPages: {
    bySlug: (slug: string) =>
      `/api/company-pages/slug/${encodeURIComponent(slug)}`,
    me: "/api/company-pages/me",
    root: "/api/company-pages",
  },
  employeeAuth: {
    login: "/api/employee-auth/login",
    me: "/api/employee-auth/me",
    register: "/api/employee-auth/register",
  },
  employees: {
    byId: (id: number | string) => `/api/employees/${encodeURIComponent(String(id))}`,
    me: "/api/employees/me",
    root: "/api/employees",
  },
  products: {
    byId: (id: string) => `/api/products/${encodeURIComponent(id)}`,
    bySlug: (slug: string) => `/api/products/slug/${encodeURIComponent(slug)}`,
    root: "/api/products",
  },
} as const;

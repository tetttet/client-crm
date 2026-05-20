import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  CompanyPageResponse,
  CreateCompanyPageBody,
  UpdateMyCompanyPageBody,
} from "@/lib/api/types/company-page.types";

const PUBLIC_COMPANY_PAGE_CACHE_TTL_MS = 5 * 60 * 1000;

export function createCompanyPage(body: CreateCompanyPageBody) {
  return apiClient.post<CompanyPageResponse, CreateCompanyPageBody>(
    API_ENDPOINTS.companyPages.root,
    {
      body,
    },
  );
}

export function getMyCompanyPage() {
  return apiClient.get<CompanyPageResponse>(API_ENDPOINTS.companyPages.me);
}

export function updateMyCompanyPage(body: UpdateMyCompanyPageBody) {
  return apiClient.patch<CompanyPageResponse, UpdateMyCompanyPageBody>(
    API_ENDPOINTS.companyPages.me,
    {
      body,
    },
  );
}

export function deleteMyCompanyPage() {
  return apiClient.delete(API_ENDPOINTS.companyPages.me);
}

export function getCompanyPageBySlug(slug: string) {
  return apiClient.get<CompanyPageResponse>(API_ENDPOINTS.companyPages.bySlug(slug), {
    auth: false,
    cache: {
      key: `company-page:${slug}`,
      ttlMs: PUBLIC_COMPANY_PAGE_CACHE_TTL_MS,
    },
  });
}

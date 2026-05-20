import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  CompanyResponse,
  UpdateCompanyMeBody,
} from "@/lib/api/types/company.types";

export function getCompanyMe() {
  return apiClient.get<CompanyResponse>(API_ENDPOINTS.auth.me);
}

export function updateCompanyMe(body: UpdateCompanyMeBody) {
  return apiClient.patch<CompanyResponse, UpdateCompanyMeBody>(
    API_ENDPOINTS.companies.me,
    {
      body,
    },
  );
}

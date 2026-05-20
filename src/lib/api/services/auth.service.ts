import {
  setCompanySession,
} from "@/lib/auth/auth-session";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { AuthResponse } from "@/lib/api/types/auth.types";
import type {
  LoginCompanyBody,
  RegisterCompanyBody,
} from "@/lib/api/types/company.types";

import {
  getCompanyMe,
  updateCompanyMe,
} from "./companies.service";

export async function registerCompany(body: RegisterCompanyBody) {
  const response = await apiClient.post<AuthResponse, RegisterCompanyBody>(
    API_ENDPOINTS.auth.register,
    {
      body,
      auth: false,
    },
  );

  setCompanySession({
    accessToken: response.accessToken,
    companyId: response.company.id,
  });

  return response;
}

export async function loginCompany(body: LoginCompanyBody) {
  const response = await apiClient.post<AuthResponse, LoginCompanyBody>(
    API_ENDPOINTS.auth.login,
    {
      body,
      auth: false,
    },
  );

  setCompanySession({
    accessToken: response.accessToken,
    companyId: response.company.id,
  });

  return response;
}

export { getCompanyMe, updateCompanyMe };

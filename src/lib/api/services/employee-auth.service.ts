import {
  setEmployeeSession,
} from "@/lib/auth/auth-session";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { EmployeeAuthResponse } from "@/lib/api/types/auth.types";
import type {
  CreateEmployeeBody,
  EmployeeResponse,
  LoginEmployeeBody,
} from "@/lib/api/types/employee.types";

export async function loginEmployee(body: LoginEmployeeBody) {
  const response = await apiClient.post<
    EmployeeAuthResponse,
    LoginEmployeeBody
  >(API_ENDPOINTS.employeeAuth.login, {
    auth: false,
    body,
  });

  setEmployeeSession({
    accessToken: response.accessToken,
    companyId: response.employee.companyId,
    role: response.employee.role,
  });

  return response;
}

export function getEmployeeMe() {
  return apiClient.get<EmployeeResponse>(API_ENDPOINTS.employeeAuth.me);
}

export function registerEmployeeShortcut(body: CreateEmployeeBody) {
  return apiClient.post<EmployeeResponse, CreateEmployeeBody>(
    API_ENDPOINTS.employeeAuth.register,
    {
      body,
    },
  );
}

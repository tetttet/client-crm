import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  CreateEmployeeBody,
  EmployeeResponse,
  EmployeesQuery,
  EmployeesResponse,
  UpdateEmployeeBody,
  UpdateEmployeeMeBody,
} from "@/lib/api/types/employee.types";

export function getEmployees(query?: EmployeesQuery) {
  return apiClient.get<EmployeesResponse>(API_ENDPOINTS.employees.root, {
    query,
  });
}

export function getEmployeeById(id: number | string) {
  return apiClient.get<EmployeeResponse>(API_ENDPOINTS.employees.byId(id));
}

export function createEmployee(body: CreateEmployeeBody) {
  return apiClient.post<EmployeeResponse, CreateEmployeeBody>(
    API_ENDPOINTS.employees.root,
    {
      body,
    },
  );
}

export function updateEmployee(
  id: number | string,
  body: UpdateEmployeeBody,
) {
  return apiClient.patch<EmployeeResponse, UpdateEmployeeBody>(
    API_ENDPOINTS.employees.byId(id),
    {
      body,
    },
  );
}

export function deleteEmployee(id: number | string) {
  return apiClient.delete(API_ENDPOINTS.employees.byId(id));
}

export function updateMe(body: UpdateEmployeeMeBody) {
  return apiClient.patch<EmployeeResponse, UpdateEmployeeMeBody>(
    API_ENDPOINTS.employees.me,
    {
      body,
    },
  );
}

export function deleteMe() {
  return apiClient.delete(API_ENDPOINTS.employees.me);
}

import { MANAGERIAL_EMPLOYEE_ROLES } from "@/lib/constants/roles";

import {
  getAuthType,
  getEmployeeRole,
} from "./auth-session";

export function isCompanyAuth() {
  return getAuthType() === "company";
}

export function isEmployeeAuth() {
  return getAuthType() === "employee";
}

export function isAdminOrManager() {
  const employeeRole = getEmployeeRole();

  return employeeRole !== null && MANAGERIAL_EMPLOYEE_ROLES.includes(employeeRole);
}

export function canManageEmployees() {
  return isCompanyAuth() || (isEmployeeAuth() && isAdminOrManager());
}

export function canManageProduct(
  productCreatedByEmployeeId: number | string | null | undefined,
  currentEmployeeId: number | string | null | undefined,
) {
  if (isCompanyAuth()) {
    return true;
  }

  if (!isEmployeeAuth()) {
    return false;
  }

  if (isAdminOrManager()) {
    return true;
  }

  if (productCreatedByEmployeeId === null || productCreatedByEmployeeId === undefined) {
    return false;
  }

  if (currentEmployeeId === null || currentEmployeeId === undefined) {
    return false;
  }

  return String(productCreatedByEmployeeId) === String(currentEmployeeId);
}

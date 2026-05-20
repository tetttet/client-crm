import type { EmployeeRole } from "@/lib/api/types/employee.types";
import { STORAGE_KEYS } from "@/lib/constants/storage-keys";

import {
  clearAccessToken,
  getAccessToken,
  getStoredValue,
  removeStoredValue,
  setAccessToken,
  setStoredValue,
} from "./token-storage";

export type AuthType = "company" | "employee";

export type CompanySessionInput = {
  accessToken: string;
  companyId: string;
};

export type EmployeeSessionInput = {
  accessToken: string;
  companyId: string;
  role: EmployeeRole;
};

export type AuthSessionSnapshot = {
  accessToken: string | null;
  authType: AuthType | null;
  companyId: string | null;
  employeeRole: EmployeeRole | null;
};

const SESSION_CHANGE_EVENT = "crm:session-change";
const EMPTY_SESSION_SNAPSHOT: AuthSessionSnapshot = {
  accessToken: null,
  authType: null,
  companyId: null,
  employeeRole: null,
};

let cachedSessionSnapshot: AuthSessionSnapshot = EMPTY_SESSION_SNAPSHOT;

function isBrowser() {
  return typeof window !== "undefined";
}

function notifySessionChanged() {
  if (!isBrowser()) {
    return;
  }

  window.dispatchEvent(new Event(SESSION_CHANGE_EVENT));
}

export function setCompanySession({
  accessToken,
  companyId,
}: CompanySessionInput) {
  setAccessToken(accessToken);
  setStoredValue(STORAGE_KEYS.companyId, companyId);
  setStoredValue(STORAGE_KEYS.authType, "company");
  removeStoredValue(STORAGE_KEYS.employeeRole);
  notifySessionChanged();
}

export function setEmployeeSession({
  accessToken,
  companyId,
  role,
}: EmployeeSessionInput) {
  setAccessToken(accessToken);
  setStoredValue(STORAGE_KEYS.companyId, companyId);
  setStoredValue(STORAGE_KEYS.authType, "employee");
  setStoredValue(STORAGE_KEYS.employeeRole, role);
  notifySessionChanged();
}

export function clearSession() {
  clearAccessToken();
  removeStoredValue(STORAGE_KEYS.authType);
  removeStoredValue(STORAGE_KEYS.companyId);
  removeStoredValue(STORAGE_KEYS.employeeRole);
  notifySessionChanged();
}

export function getAuthType(): AuthType | null {
  const authType = getStoredValue(STORAGE_KEYS.authType);

  if (authType === "company" || authType === "employee") {
    return authType;
  }

  return null;
}

export function getCompanyId() {
  return getStoredValue(STORAGE_KEYS.companyId);
}

export function getEmployeeRole(): EmployeeRole | null {
  const role = getStoredValue(STORAGE_KEYS.employeeRole);

  if (role === "admin" || role === "manager" || role === "user") {
    return role;
  }

  return null;
}

function readCurrentSessionSnapshot(): AuthSessionSnapshot {
  return {
    accessToken: getAccessToken(),
    authType: getAuthType(),
    companyId: getCompanyId(),
    employeeRole: getEmployeeRole(),
  };
}

function isSameSessionSnapshot(
  left: AuthSessionSnapshot,
  right: AuthSessionSnapshot,
) {
  return (
    left.accessToken === right.accessToken &&
    left.authType === right.authType &&
    left.companyId === right.companyId &&
    left.employeeRole === right.employeeRole
  );
}

export function getSessionSnapshot(): AuthSessionSnapshot {
  const nextSnapshot = readCurrentSessionSnapshot();

  if (isSameSessionSnapshot(cachedSessionSnapshot, nextSnapshot)) {
    return cachedSessionSnapshot;
  }

  cachedSessionSnapshot = nextSnapshot;
  return cachedSessionSnapshot;
}

export function subscribeToSessionChanges(listener: () => void) {
  if (!isBrowser()) {
    return () => {};
  }

  const handleStorage = (event: StorageEvent) => {
    if (
      event.key !== null &&
      !Object.values(STORAGE_KEYS).includes(event.key as (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS])
    ) {
      return;
    }

    listener();
  };

  window.addEventListener(SESSION_CHANGE_EVENT, listener);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(SESSION_CHANGE_EVENT, listener);
    window.removeEventListener("storage", handleStorage);
  };
}

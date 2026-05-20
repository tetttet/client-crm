export const STORAGE_KEYS = {
  accessToken: "crm.accessToken",
  authType: "crm.authType",
  companyId: "crm.companyId",
  employeeRole: "crm.employeeRole",
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

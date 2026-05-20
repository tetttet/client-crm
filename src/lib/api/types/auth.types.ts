import type { ApiSuccess } from "./api.types";
import type { Company } from "./company.types";
import type { EmployeeAuthSubject } from "./employee.types";

export type AuthResponse = ApiSuccess<{
  accessToken: string;
  company: Company;
}>;

export type EmployeeAuthResponse = ApiSuccess<{
  accessToken: string;
  employee: EmployeeAuthSubject;
}>;

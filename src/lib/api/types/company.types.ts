import type { ApiSuccess } from "./api.types";

export type Company = {
  adminLogin: string;
  createdAt: string;
  employeesCount: number;
  id: string;
  name: string;
};

export type RegisterCompanyBody = {
  adminLogin: string;
  name: string;
  password: string;
};

export type LoginCompanyBody = {
  adminLogin: string;
  password: string;
};

export type UpdateCompanyMeBody = {
  name: string;
};

export type CompanyResponse = ApiSuccess<{
  company: Company;
}>;

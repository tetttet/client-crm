import type {
  ApiSuccess,
  EntityData,
  PaginatedData,
  PaginationQuery,
} from "./api.types";

export type EmployeeRole = "admin" | "manager" | "user";

export type EmployeeSex = "female" | "male";

export type Employee = {
  age: number;
  avatarUrl: string | null;
  companyId: string;
  createdAt: string;
  email: string;
  id: number;
  isWorking: boolean;
  name: string;
  phone: string;
  role: EmployeeRole;
  sex: EmployeeSex;
  startDate: string;
  updatedAt: string;
};

export type EmployeeAuthSubject = Pick<
  Employee,
  "companyId" | "email" | "id" | "isWorking" | "name" | "role"
>;

export type LoginEmployeeBody = {
  companyId: string;
  email: string;
  password: string;
};

export type EmployeesQuery = PaginationQuery & {
  isWorking?: boolean;
  role?: EmployeeRole;
  search?: string;
};

export type CreateEmployeeBody = {
  age: number;
  avatarUrl?: string | null;
  email: string;
  isWorking: boolean;
  name: string;
  password: string;
  phone: string;
  role: EmployeeRole;
  sex: EmployeeSex;
  startDate: string;
};

export type UpdateEmployeeBody = Partial<CreateEmployeeBody>;

export type UpdateEmployeeMeBody = Partial<
  Omit<CreateEmployeeBody, "role">
>;

export type EmployeeResponse = ApiSuccess<EntityData<"employee", Employee>>;

export type EmployeesResponse = ApiSuccess<PaginatedData<"employees", Employee>>;

import type {
  Employee,
  EmployeeRole,
  EmployeeSex,
} from "@/lib/api/types/employee.types";

export type DashboardEmployeeSex = "Male" | "Female";

export type DashboardEmployee = {
  avatarUrl: string | null;
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  date: string;
  isWorking: boolean;
  age: number;
  sex: DashboardEmployeeSex;
};

const EMPLOYEE_ROLE_LABELS: Record<EmployeeRole, string> = {
  admin: "Admin",
  manager: "Manager",
  user: "User",
};

const EMPLOYEE_SEX_LABELS: Record<EmployeeSex, DashboardEmployeeSex> = {
  female: "Female",
  male: "Male",
};

export function formatEmployeeDate(dateValue: string) {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function mapEmployeeToDashboardEmployee(
  employee: Employee,
): DashboardEmployee {
  return {
    age: employee.age,
    avatarUrl: employee.avatarUrl,
    date: formatEmployeeDate(employee.startDate),
    email: employee.email,
    id: String(employee.id),
    isWorking: employee.isWorking,
    name: employee.name,
    phone: employee.phone,
    role: EMPLOYEE_ROLE_LABELS[employee.role],
    sex: EMPLOYEE_SEX_LABELS[employee.sex],
  };
}

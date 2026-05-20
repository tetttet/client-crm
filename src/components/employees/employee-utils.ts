import type { DashboardEmployee } from "@/components/employees/employees-data";

export function getEmployeeAvatar(employee: DashboardEmployee) {
  return employee.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

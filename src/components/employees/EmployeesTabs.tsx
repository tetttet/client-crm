"use client";

import { useState } from "react";
import type { SyntheticEvent } from "react";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import TableRowsRoundedIcon from "@mui/icons-material/TableRowsRounded";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";

import { CreateEmployeeForm } from "@/components/employees/CreateEmployeeForm";
import { DashboardEmployeesTable } from "@/components/employees/DashboardEmployeesTable";
import { EmployeeDetailsDrawer } from "@/components/employees/EmployeeDetailsDrawer";
import { EmployeesTabPanel } from "@/components/employees/EmployeesTabPanel";
import {
  dashboardEmployees,
  type DashboardEmployee,
} from "@/components/employees/employees-data";

function formatEmployeeDate(dateValue: string) {
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

function getNextEmployeeId(employees: ReadonlyArray<DashboardEmployee>) {
  const nextEmployeeNumber =
    employees.reduce((maxValue, employee) => {
      const employeeNumber = Number.parseInt(employee.id.replace("EMP-", ""), 10);

      if (Number.isNaN(employeeNumber)) {
        return maxValue;
      }

      return Math.max(maxValue, employeeNumber);
    }, 1000) + 1;

  return `EMP-${nextEmployeeNumber}`;
}

export function EmployeesTabs() {
  const [tabValue, setTabValue] = useState(0);
  const [employees, setEmployees] =
    useState<ReadonlyArray<DashboardEmployee>>(dashboardEmployees);
  const [selectedEmployee, setSelectedEmployee] =
    useState<DashboardEmployee | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleTabChange = (_event: SyntheticEvent, nextValue: number) => {
    setTabValue(nextValue);
    setSuccessMessage(null);
  };

  const handleCreateEmployee = (employee: Omit<DashboardEmployee, "id">) => {
    const createdEmployee: DashboardEmployee = {
      ...employee,
      date: formatEmployeeDate(employee.date),
      id: getNextEmployeeId(employees),
    };

    setEmployees((currentEmployees) => [createdEmployee, ...currentEmployees]);
    setSuccessMessage(
      `${createdEmployee.name} добавлен(а) в таблицу сотрудников.`,
    );
    setTabValue(0);
  };

  return (
    <Stack spacing={2.5}>
      <Card
        sx={{
          border: 1,
          borderColor: "white",
          borderRadius: 0,
          px: { xs: 2.5, md: 3 },
          py: { xs: 2, md: 2.5 },
        }}
      >
        <Stack spacing={2}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={1.5}
            sx={{ alignItems: { xs: "flex-start", md: "center" } }}
          >
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography color="text.secondary" variant="subtitle2">
                Employees workspace
              </Typography>
              <Typography sx={{ mt: 0.75, fontWeight: 600 }} variant="h5">
                Управление сотрудниками
              </Typography>
              <Typography
                color="text.secondary"
                sx={{ mt: 0.75 }}
                variant="body2"
              >
                Переключайся между таблицей и формой создания пользователя.
              </Typography>
            </Box>

            <Chip
              color="primary"
              label={`${employees.length} всего`}
              size="small"
              sx={{ borderRadius: 999, fontWeight: 700 }}
            />
          </Stack>

          <Tabs
            aria-label="Employees tabs"
            onChange={handleTabChange}
            value={tabValue}
            variant="scrollable"
          >
            <Tab
              icon={<TableRowsRoundedIcon fontSize="small" />}
              iconPosition="start"
              id="employees-tab-0"
              label="Таблица"
              sx={{ alignItems: "center" }}
            />
            <Tab
              icon={<PersonAddAlt1RoundedIcon fontSize="small" />}
              iconPosition="start"
              id="employees-tab-1"
              label="Создать Сотрудника"
              sx={{ alignItems: "center" }}
            />
          </Tabs>
        </Stack>
      </Card>

      {successMessage ? <Alert severity="success">{successMessage}</Alert> : null}

      <EmployeesTabPanel index={0} value={tabValue}>
        <DashboardEmployeesTable
          employees={employees}
          fillHeight={false}
          onViewEmployee={setSelectedEmployee}
          viewportHeight={520}
        />
      </EmployeesTabPanel>

      <EmployeesTabPanel index={1} value={tabValue}>
        <CreateEmployeeForm
          onCancel={() => setTabValue(0)}
          onCreateEmployee={handleCreateEmployee}
        />
      </EmployeesTabPanel>

      <EmployeeDetailsDrawer
        employee={selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
        open={Boolean(selectedEmployee)}
      />
    </Stack>
  );
}

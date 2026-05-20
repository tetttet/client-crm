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
  mapEmployeeToDashboardEmployee,
  type DashboardEmployee,
} from "@/components/employees/employees-data";
import { useAuthSession } from "@/hooks/use-auth-session";
import { useEmployees } from "@/hooks/use-employees";
import type { CreateEmployeeBody } from "@/lib/api/types/employee.types";

export function EmployeesTabs() {
  const session = useAuthSession();
  const {
    createEmployee,
    employees: employeeRecords,
    error,
    isLoading,
    isMutating,
    total,
  } = useEmployees();
  const [tabValue, setTabValue] = useState(0);
  const [selectedEmployee, setSelectedEmployee] =
    useState<DashboardEmployee | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const employees = employeeRecords.map(mapEmployeeToDashboardEmployee);
  const canCreateEmployees =
    session.authType === "company" ||
    (session.authType === "employee" &&
      (session.employeeRole === "admin" || session.employeeRole === "manager"));
  const totalEmployees = total || employees.length;

  const handleTabChange = (_event: SyntheticEvent, nextValue: number) => {
    setTabValue(nextValue);
    setSuccessMessage(null);
  };

  const handleCreateEmployee = async (employee: CreateEmployeeBody) => {
    const response = await createEmployee(employee);
    const createdEmployee = mapEmployeeToDashboardEmployee(response.employee);
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
              label={`${totalEmployees} всего`}
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
              disabled={!canCreateEmployees}
              iconPosition="start"
              id="employees-tab-1"
              label="Создать Сотрудника"
              sx={{ alignItems: "center" }}
            />
          </Tabs>
        </Stack>
      </Card>

      {successMessage ? <Alert severity="success">{successMessage}</Alert> : null}
      {!session.accessToken ? (
        <Alert severity="warning">
          Чтобы увидеть реальную таблицу сотрудников, сначала войди в компанию
          или под сотрудником.
        </Alert>
      ) : null}
      {error ? <Alert severity="error">{error.message}</Alert> : null}

      <EmployeesTabPanel index={0} value={tabValue}>
        <DashboardEmployeesTable
          employees={employees}
          emptyMessage="Сервер пока не вернул сотрудников для этой компании."
          fillHeight={false}
          isLoading={isLoading}
          onViewEmployee={setSelectedEmployee}
          viewportHeight={520}
        />
      </EmployeesTabPanel>

      <EmployeesTabPanel index={1} value={tabValue}>
        {canCreateEmployees ? (
          <CreateEmployeeForm
            isSubmitting={isMutating}
            onCancel={() => setTabValue(0)}
            onCreateEmployee={handleCreateEmployee}
          />
        ) : (
          <Alert severity="info">
            Создание сотрудников доступно компании, а также ролям admin и
            manager.
          </Alert>
        )}
      </EmployeesTabPanel>

      <EmployeeDetailsDrawer
        employee={selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
        open={Boolean(selectedEmployee)}
      />
    </Stack>
  );
}

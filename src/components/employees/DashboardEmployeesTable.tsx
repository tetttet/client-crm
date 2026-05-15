import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

import type { DashboardEmployee } from "@/components/employees/employees-data";

type DashboardEmployeesTableProps = {
  employees: ReadonlyArray<DashboardEmployee>;
  fillHeight?: boolean;
  viewportHeight?: number;
};

function getEmployeeAvatar(employee: DashboardEmployee) {
  if (employee.avatar) {
    return employee.avatar;
  }

  return employee.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function DashboardEmployeesTable({
  employees,
  fillHeight = true,
  viewportHeight,
}: DashboardEmployeesTableProps) {
  return (
    <Card
      sx={{
        display: "flex",
        height: fillHeight ? "100%" : "auto",
        minHeight: 0,
        flexDirection: "column",
        border: 1,
        borderColor: "white",
        borderRadius: 0,
        gap: 2.5,
        px: { xs: 2.5, md: 3 },
        py: { xs: 2.5, md: 3 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box>
          <Typography color="text.secondary" variant="subtitle2">
            Команда фирмы
          </Typography>
          <Typography sx={{ mt: 0.75, fontWeight: 600 }} variant="h5">
            Сотрудники
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.75 }} variant="body2">
            Список команды в дашборде и новые пользователи из формы
          </Typography>
        </Box>

        <Chip
          label={`${employees.length} employees`}
          size="small"
          sx={{
            borderRadius: 999,
            bgcolor: "primary.light",
            color: "primary.main",
            fontWeight: 700,
          }}
        />
      </Box>

      <Box
        sx={{
          flex: fillHeight ? 1 : "0 0 auto",
          minHeight: 0,
          maxHeight: viewportHeight,
          overflowX: "auto",
          overflowY: "auto",
        }}
      >
        <Table
          size="small"
          sx={{
            minWidth: 980,
            "& .MuiTableCell-root": {
              py: 1.5,
            },
          }}
        >
          <TableHead
            sx={{
              bgcolor: "rgba(26, 115, 232, 0.04)",
            }}
          >
            <TableRow>
              <TableCell>avatar</TableCell>
              <TableCell>id</TableCell>
              <TableCell>name</TableCell>
              <TableCell>email</TableCell>
              <TableCell>phone</TableCell>
              <TableCell>role</TableCell>
              <TableCell>date</TableCell>
              <TableCell>isWorking</TableCell>
              <TableCell>age</TableCell>
              <TableCell>sex</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {employees.map((employee) => (
              <TableRow
                hover
                key={employee.id}
                sx={{
                  "&:last-child .MuiTableCell-root": {
                    borderBottom: 0,
                  },
                }}
              >
                <TableCell>
                  <Avatar
                    sx={{
                      bgcolor: "primary.main",
                      fontSize: 13,
                      fontWeight: 700,
                      height: 36,
                      width: 36,
                    }}
                  >
                    {getEmployeeAvatar(employee)}
                  </Avatar>
                </TableCell>
                <TableCell sx={{ fontWeight: 600, whiteSpace: "nowrap" }}>
                  {employee.id}
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  {employee.name}
                </TableCell>
                <TableCell
                  sx={{ color: "text.secondary", whiteSpace: "nowrap" }}
                >
                  {employee.email}
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  {employee.phone}
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  <Chip
                    label={employee.role}
                    size="small"
                    variant="outlined"
                    sx={{ borderRadius: 999, fontWeight: 600 }}
                  />
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  {employee.date}
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  <Chip
                    color={employee.isWorking ? "success" : "default"}
                    label={employee.isWorking ? "Active" : "Offline"}
                    size="small"
                    sx={{ borderRadius: 999, fontWeight: 700 }}
                  />
                </TableCell>
                <TableCell>{employee.age}</TableCell>
                <TableCell>
                  <Chip
                    label={employee.sex}
                    size="small"
                    sx={{
                      borderRadius: 999,
                      bgcolor:
                        employee.sex === "Female"
                          ? "rgba(244, 114, 182, 0.12)"
                          : "rgba(96, 165, 250, 0.14)",
                      color: employee.sex === "Female" ? "#be185d" : "#1d4ed8",
                      fontWeight: 700,
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Card>
  );
}

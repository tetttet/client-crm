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

type DashboardEmployee = {
  avatar: string;
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  date: string;
  isWorking: boolean;
  age: number;
  sex: "Male" | "Female";
};

type DashboardEmployeesTableProps = {
  fillHeight?: boolean;
  viewportHeight?: number;
};

const employees: ReadonlyArray<DashboardEmployee> = [
  {
    avatar: "AK",
    id: "EMP-1001",
    name: "Ariana Kim",
    email: "ariana.kim@clientcrm.io",
    phone: "+1 (202) 555-0189",
    role: "Chief Executive",
    date: "Jan 16, 2026",
    isWorking: true,
    age: 34,
    sex: "Female",
  },
  {
    avatar: "MR",
    id: "EMP-1002",
    name: "Marcus Reed",
    email: "marcus.reed@clientcrm.io",
    phone: "+1 (202) 555-0114",
    role: "Operations Lead",
    date: "Feb 03, 2026",
    isWorking: true,
    age: 41,
    sex: "Male",
  },
  {
    avatar: "SP",
    id: "EMP-1003",
    name: "Sophia Patel",
    email: "sophia.patel@clientcrm.io",
    phone: "+1 (202) 555-0138",
    role: "Finance Manager",
    date: "Feb 24, 2026",
    isWorking: true,
    age: 29,
    sex: "Female",
  },
  {
    avatar: "JT",
    id: "EMP-1004",
    name: "Jordan Tran",
    email: "jordan.tran@clientcrm.io",
    phone: "+1 (202) 555-0156",
    role: "Product Designer",
    date: "Mar 11, 2026",
    isWorking: false,
    age: 27,
    sex: "Male",
  },
  {
    avatar: "EL",
    id: "EMP-1005",
    name: "Emma Lopez",
    email: "emma.lopez@clientcrm.io",
    phone: "+1 (202) 555-0172",
    role: "HR Partner",
    date: "Apr 01, 2026",
    isWorking: true,
    age: 32,
    sex: "Female",
  },
  {
    avatar: "DK",
    id: "EMP-1006",
    name: "Daniel Kim",
    email: "daniel.kim@clientcrm.io",
    phone: "+1 (202) 555-0107",
    role: "Sales Manager",
    date: "Apr 14, 2026",
    isWorking: true,
    age: 36,
    sex: "Male",
  },
  {
    avatar: "NB",
    id: "EMP-1007",
    name: "Nina Brooks",
    email: "nina.brooks@clientcrm.io",
    phone: "+1 (202) 555-0146",
    role: "Account Lead",
    date: "Apr 23, 2026",
    isWorking: true,
    age: 30,
    sex: "Female",
  },
  {
    avatar: "TW",
    id: "EMP-1008",
    name: "Theo Walker",
    email: "theo.walker@clientcrm.io",
    phone: "+1 (202) 555-0194",
    role: "Support Lead",
    date: "May 02, 2026",
    isWorking: false,
    age: 39,
    sex: "Male",
  },
  {
    avatar: "LC",
    id: "EMP-1009",
    name: "Lila Chen",
    email: "lila.chen@clientcrm.io",
    phone: "+1 (202) 555-0128",
    role: "Customer Success",
    date: "May 06, 2026",
    isWorking: true,
    age: 28,
    sex: "Female",
  },
];

export function DashboardEmployeesTable({
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
            Статичный список команды для дашборда
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
                    {employee.avatar}
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

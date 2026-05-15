import { EmployeesTabs } from "@/components/employees/EmployeesTabs";
import { Box } from "@mui/material";

export default function EmployeesPage() {
  return (
    <Box sx={{ minWidth: 0, minHeight: 0, flex: "0 0 auto" }}>
      <EmployeesTabs />
    </Box>
  );
}

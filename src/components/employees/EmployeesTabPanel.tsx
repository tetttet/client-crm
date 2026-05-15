import Box from "@mui/material/Box";

type EmployeesTabPanelProps = Readonly<{
  children: React.ReactNode;
  index: number;
  value: number;
}>;

export function EmployeesTabPanel({
  children,
  index,
  value,
}: EmployeesTabPanelProps) {
  return (
    <Box
      aria-labelledby={`employees-tab-${index}`}
      hidden={value !== index}
      id={`employees-tabpanel-${index}`}
      role="tabpanel"
      sx={{ minWidth: 0 }}
    >
      {value === index ? children : null}
    </Box>
  );
}

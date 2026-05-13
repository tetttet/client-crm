import Box from "@mui/material/Box";

import { DashboardEmployeesTable } from "@/components/main/DashboardEmployeesTable";
import { DashboardFinanceChart } from "@/components/main/DashboardFinanceChart";
import { DashboardTeamNotes } from "@/components/main/DashboardTeamNotes";

export default function DashboardPage() {
  return (
    <Box
      sx={{
        display: "grid",
        width: "100%",
        gap: 3,
        gridTemplateColumns: {
          xs: "1fr",
          md: "minmax(0, 0.95fr) minmax(0, 1.35fr)",
        },
        alignItems: { xs: "start", md: "stretch" },
      }}
    >
      <Box sx={{ minWidth: 0, minHeight: 0 }}>
        <DashboardFinanceChart />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          minHeight: 0,
          height: "100%",
          gap: 3,
        }}
      >
        <Box sx={{ minWidth: 0, minHeight: 0, flex: "0 0 auto" }}>
          <DashboardEmployeesTable fillHeight={false} viewportHeight={466} />
        </Box>

        <Box sx={{ minWidth: 0, minHeight: 0, flex: 1 }}>
          <DashboardTeamNotes />
        </Box>
      </Box>
    </Box>
  );
}

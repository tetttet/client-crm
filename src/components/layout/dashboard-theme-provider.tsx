"use client";

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";

import { dashboardTheme } from "@/theme/dashboard-theme";

type DashboardThemeProviderProps = Readonly<{
  children: React.ReactNode;
}>;

export function DashboardThemeProvider({
  children,
}: DashboardThemeProviderProps) {
  return (
    <ThemeProvider theme={dashboardTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

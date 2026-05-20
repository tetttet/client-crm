"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import MenuOpenRoundedIcon from "@mui/icons-material/MenuOpenRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import { getDashboardPageTitle } from "@/components/layout/dashboard-navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { useCompanyAuth } from "@/hooks/use-company-auth";
import { useEmployeeAuth } from "@/hooks/use-employee-auth";
import { clearSession } from "@/lib/auth/auth-session";

type DashboardShellProps = Readonly<{
  children: React.ReactNode;
}>;

export function DashboardShell({ children }: DashboardShellProps) {
  const theme = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"), {
    noSsr: true,
  });
  const [isDesktopExpanded, setIsDesktopExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const {
    company,
    companyId: companySessionId,
    isAuthenticated: isCompanyAuthenticated,
    isLoading: isCompanyLoading,
  } = useCompanyAuth();
  const {
    companyId: employeeCompanyId,
    employee,
    isAuthenticated: isEmployeeAuthenticated,
    isLoading: isEmployeeLoading,
    role,
  } = useEmployeeAuth();

  const pageTitle = getDashboardPageTitle(pathname);

  const handleToggleSidebar = () => {
    if (isDesktop) {
      setIsDesktopExpanded((currentValue) => !currentValue);
      return;
    }

    setIsMobileOpen((currentValue) => !currentValue);
  };

  const handleNavigation = () => {
    if (!isDesktop) {
      setIsMobileOpen(false);
    }
  };

  const handleLogout = () => {
    clearSession();
    setIsMobileOpen(false);
    router.push("/");
    router.refresh();
  };

  const showCompanySummary = isCompanyAuthenticated && Boolean(company);
  const showEmployeeSummary = isEmployeeAuthenticated && Boolean(employee);
  const isSessionLoading =
    (isCompanyAuthenticated && isCompanyLoading) ||
    (isEmployeeAuthenticated && isEmployeeLoading);

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <Sidebar
        isDesktopExpanded={isDesktopExpanded}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
        onExpandDesktop={() => setIsDesktopExpanded(true)}
        onLogout={handleLogout}
        onNavigate={handleNavigation}
        pathname={pathname}
      />

      <Box
        sx={{ display: "flex", flex: 1, flexDirection: "column", minWidth: 0 }}
      >
        <AppBar
          color="inherit"
          position="sticky"
          sx={{
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Toolbar
            sx={{
              alignItems: {
                xs: "flex-start",
                md: "center",
              },
              flexWrap: "wrap",
              justifyContent: "space-between",
              minHeight: "64px !important",
              gap: 1.5,
              px: {
                xs: 2,
                md: 3,
              },
            }}
          >
            <IconButton
              aria-label={
                isDesktop && isDesktopExpanded
                  ? "Collapse menu"
                  : "Open menu"
              }
              color="primary"
              edge="start"
              onClick={handleToggleSidebar}
              size="small"
              sx={{
                border: 1,
                borderColor: "divider",
                borderRadius: 2,
              }}
            >
              {isDesktop && isDesktopExpanded ? (
                <MenuOpenRoundedIcon fontSize="small" />
              ) : (
                <MenuRoundedIcon fontSize="small" />
              )}
            </IconButton>

              <Box sx={{ minWidth: 0 }}>
                <Typography color="text.secondary" variant="subtitle2">
                  Client CRM
                </Typography>
                <Typography noWrap variant="h5">
                  {pageTitle}
                </Typography>
              </Box>

              <Box sx={{ flex: 1 }} />

              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={1}
                sx={{
                  alignItems: {
                    xs: "flex-start",
                    md: "center",
                  },
                  minWidth: 0,
                }}
              >
                {showCompanySummary ? (
                  <>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography color="text.secondary" variant="subtitle2">
                        Компания
                      </Typography>
                      <Typography noWrap sx={{ fontWeight: 700 }} variant="body1">
                        {company?.name}
                      </Typography>
                    </Box>
                    <Chip
                      label={`@${company?.adminLogin ?? "admin"}`}
                      size="small"
                      sx={{ borderRadius: 0 }}
                    />
                    <Chip
                      label={company?.id ?? companySessionId ?? ""}
                      size="small"
                      sx={{ borderRadius: 0 }}
                      variant="outlined"
                    />
                    <Chip
                      label={`${company?.employeesCount ?? 0} сотрудников`}
                      size="small"
                      sx={{ borderRadius: 0 }}
                      variant="outlined"
                    />
                  </>
                ) : null}

                {showEmployeeSummary ? (
                  <>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography color="text.secondary" variant="subtitle2">
                        Сотрудник
                      </Typography>
                      <Typography noWrap sx={{ fontWeight: 700 }} variant="body1">
                        {employee?.name}
                      </Typography>
                    </Box>
                    <Chip
                      label={`Роль: ${role ?? "user"}`}
                      size="small"
                      sx={{ borderRadius: 0, textTransform: "capitalize" }}
                    />
                    <Chip
                      label={employeeCompanyId ?? ""}
                      size="small"
                      sx={{ borderRadius: 0 }}
                      variant="outlined"
                    />
                  </>
                ) : null}

                {isSessionLoading ? (
                  <Chip
                    label="Загрузка данных компании..."
                    size="small"
                    sx={{ borderRadius: 0 }}
                    variant="outlined"
                  />
                ) : null}
              </Stack>
            </Toolbar>
          </AppBar>

        <Box component="main">
          <Paper
            sx={{
              bgcolor: "background.default",
              minHeight: "calc(100vh - 112px)",
              px: 3,
              py: 2,
            }}
          >
            {children}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}

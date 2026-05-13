"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import MenuOpenRoundedIcon from "@mui/icons-material/MenuOpenRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import { getDashboardPageTitle } from "@/components/layout/dashboard-navigation";
import { Sidebar } from "@/components/layout/sidebar";

type DashboardShellProps = Readonly<{
  children: React.ReactNode;
}>;

export function DashboardShell({ children }: DashboardShellProps) {
  const theme = useTheme();
  const pathname = usePathname();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"), {
    noSsr: true,
  });
  const [isDesktopExpanded, setIsDesktopExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

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
                  ? "Свернуть меню"
                  : "Открыть меню"
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

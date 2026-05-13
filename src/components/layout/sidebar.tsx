import Link from "next/link";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { alpha, useTheme } from "@mui/material/styles";

import {
  dashboardNavigationItems,
  isDashboardPathActive,
} from "@/components/layout/dashboard-navigation";

type SidebarProps = {
  isDesktopExpanded: boolean;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  onNavigate: () => void;
  pathname: string;
};

const desktopExpandedWidth = 248;
const desktopCollapsedWidth = 80;
const mobileDrawerWidth = 248;

export function Sidebar({
  isDesktopExpanded,
  isMobileOpen,
  onCloseMobile,
  onNavigate,
  pathname,
}: SidebarProps) {
  const theme = useTheme();
  const desktopWidth = isDesktopExpanded
    ? desktopExpandedWidth
    : desktopCollapsedWidth;

  const navigationContent = (collapsed: boolean) => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          minHeight: 64,
          px: collapsed ? 1.5 : 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
            width: "100%",
            minWidth: 0,
          }}
        >
          <Link
            href="/dashboard"
            onClick={onNavigate}
            style={{ color: "inherit" }}
          >
            <Typography
              sx={{
                color: "text.primary",
                fontSize: collapsed ? "0.95rem" : "1rem",
                fontWeight: 500,
                letterSpacing: collapsed ? "0.02em" : "0",
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              {collapsed ? "CC" : "Client CRM"}
            </Typography>
          </Link>
        </Box>
      </Box>

      <Divider />

      <List
        disablePadding
      >
        {dashboardNavigationItems.map((item) => {
          const isActive = isDashboardPathActive(pathname, item.href);
          const Icon = item.icon;

          return (
            <ListItem disablePadding key={item.href}>
              <Tooltip
                arrow
                disableHoverListener={!collapsed}
                placement="right"
                title={item.label}
              >
                <ListItemButton
                  component={Link}
                  href={item.href}
                  onClick={onNavigate}
                  selected={isActive}
                  sx={{
                    alignItems: "center",
                    justifyContent: collapsed ? "center" : "flex-start",
                    gap: collapsed ? 0 : 1.25,
                    minHeight: 44,
                    px: collapsed ? 0 : 1.5,
                    py: 0.75,

                    borderRadius: 0,

                    color: isActive ? "#fff" : "text.secondary",

                    "&.Mui-selected": {
                      backgroundColor: "#1b75d2",
                      color: "#fff",
                      borderRadius: 0,
                    },

                    "&.Mui-selected:hover": {
                      backgroundColor: "#1665b8",
                    },

                    "&:hover": {
                      backgroundColor: isActive
                        ? "#1665b8"
                        : alpha("#1b75d2", 0.08),
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: "inherit",
                      justifyContent: "center",
                      minWidth: collapsed ? 0 : 36,
                    }}
                  >
                    <Icon fontSize="small" />
                  </ListItemIcon>
                  {!collapsed ? (
                    <ListItemText
                      primary={
                        <Typography
                          sx={{
                            fontSize: 14,
                            fontWeight: isActive ? 500 : 400,
                          }}
                        >
                          {item.label}
                        </Typography>
                      }
                    />
                  ) : null}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <>
      <Drawer
        open
        sx={{
          display: {
            xs: "none",
            md: "block",
          },
          flexShrink: 0,
          width: desktopWidth,
          "& .MuiDrawer-paper": {
            width: desktopWidth,
            borderRight: `1px solid ${theme.palette.divider}`,
            boxSizing: "border-box",
            overflowX: "hidden",
            transition: theme.transitions.create("width", {
              duration: theme.transitions.duration.shortest,
            }),
          },
        }}
        variant="permanent"
      >
        {navigationContent(!isDesktopExpanded)}
      </Drawer>

      <Drawer
        ModalProps={{
          keepMounted: true,
        }}
        onClose={onCloseMobile}
        open={isMobileOpen}
        sx={{
          display: {
            xs: "block",
            md: "none",
          },
          "& .MuiDrawer-paper": {
            width: mobileDrawerWidth,
            borderRight: `1px solid ${theme.palette.divider}`,
            boxSizing: "border-box",
          },
        }}
        variant="temporary"
      >
        {navigationContent(false)}
      </Drawer>
    </>
  );
}

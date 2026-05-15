import { Fragment, useState } from "react";
import Link from "next/link";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
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
  onExpandDesktop: () => void;
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
  onExpandDesktop,
  onNavigate,
  pathname,
}: SidebarProps) {
  const theme = useTheme();
  const desktopWidth = isDesktopExpanded
    ? desktopExpandedWidth
    : desktopCollapsedWidth;
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {},
  );

  const handleToggleGroup = (
    href: string,
    collapsed: boolean,
    isExpanded: boolean,
  ) => {
    setExpandedGroups((currentGroups) => ({
      ...currentGroups,
      [href]: collapsed ? true : !isExpanded,
    }));

    if (collapsed) {
      onExpandDesktop();
    }
  };

  const getNavigationItemSx = (isActive: boolean, collapsed: boolean) => ({
    alignItems: "center",
    justifyContent: collapsed ? "center" : "flex-start",
    gap: collapsed ? 0 : 1.25,
    minHeight: 20,
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
      backgroundColor: isActive ? "#1665b8" : alpha("#1b75d2", 0.08),
    },
  });

  const getNavigationIconSx = (collapsed: boolean) => ({
    color: "inherit",
    justifyContent: "center",
    minWidth: collapsed ? 0 : 36,
  });

  const getNavigationLabelSx = (isActive: boolean) => ({
    fontSize: 14,
    fontWeight: isActive ? 500 : 400,
  });

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
          const hasSubItems = Boolean(item.subItems?.length);
          const isActiveSubItem = item.subItems?.some((subItem) =>
            isDashboardPathActive(pathname, subItem.href),
          );
          const isActive =
            Boolean(isActiveSubItem) || isDashboardPathActive(pathname, item.href);
          const isExpanded =
            Boolean(isActiveSubItem) || Boolean(expandedGroups[item.href]);
          const Icon = item.icon;

          return (
            <Fragment key={item.href}>
              <ListItem disablePadding>
                <Tooltip
                  arrow
                  disableHoverListener={!collapsed}
                  placement="right"
                  title={item.label}
                >
                  {hasSubItems ? (
                    <ListItemButton
                      aria-expanded={isExpanded}
                      onClick={() =>
                        handleToggleGroup(item.href, collapsed, isExpanded)
                      }
                      selected={isActive}
                      sx={getNavigationItemSx(isActive, collapsed)}
                    >
                      <ListItemIcon sx={getNavigationIconSx(collapsed)}>
                        <Icon fontSize="small" />
                      </ListItemIcon>
                      {!collapsed ? (
                        <>
                          <ListItemText
                            primary={
                              <Typography sx={getNavigationLabelSx(isActive)}>
                                {item.label}
                              </Typography>
                            }
                          />
                          {isExpanded ? (
                            <KeyboardArrowDownRoundedIcon fontSize="small" />
                          ) : (
                            <KeyboardArrowRightRoundedIcon fontSize="small" />
                          )}
                        </>
                      ) : null}
                    </ListItemButton>
                  ) : (
                    <ListItemButton
                      component={Link}
                      href={item.href}
                      onClick={onNavigate}
                      selected={isActive}
                      sx={getNavigationItemSx(isActive, collapsed)}
                    >
                      <ListItemIcon sx={getNavigationIconSx(collapsed)}>
                        <Icon fontSize="small" />
                      </ListItemIcon>
                      {!collapsed ? (
                        <ListItemText
                          primary={
                            <Typography sx={getNavigationLabelSx(isActive)}>
                              {item.label}
                            </Typography>
                          }
                        />
                      ) : null}
                    </ListItemButton>
                  )}
                </Tooltip>
              </ListItem>

              {hasSubItems ? (
                <Collapse in={!collapsed && isExpanded} timeout="auto" unmountOnExit>
                  <List disablePadding>
                    {item.subItems?.map((subItem) => {
                      const isSubItemActive = isDashboardPathActive(
                        pathname,
                        subItem.href,
                      );
                      const SubItemIcon = subItem.icon;

                      return (
                        <ListItem disablePadding key={subItem.href}>
                          <ListItemButton
                            component={Link}
                            href={subItem.href}
                            onClick={onNavigate}
                            selected={isSubItemActive}
                            sx={{
                              ...getNavigationItemSx(isSubItemActive, false),
                              pl: 4.5,
                            }}
                          >
                            <ListItemIcon sx={getNavigationIconSx(false)}>
                              <SubItemIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Typography
                                  sx={getNavigationLabelSx(isSubItemActive)}
                                >
                                  {subItem.label}
                                </Typography>
                              }
                            />
                          </ListItemButton>
                        </ListItem>
                      );
                    })}
                  </List>
                </Collapse>
              ) : null}
            </Fragment>
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

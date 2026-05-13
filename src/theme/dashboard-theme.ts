import { createTheme } from "@mui/material/styles";

export const dashboardTheme = createTheme({
  palette: {
    primary: {
      main: "#1a73e8",
      dark: "#1557b0",
      light: "#e8f0fe",
    },
    background: {
      default: "#f5f7fb",
      paper: "#ffffff",
    },
    text: {
      primary: "#202124",
      secondary: "#5f6368",
    },
    divider: "#d7dce3",
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontSize: "1.25rem",
      fontWeight: 500,
      letterSpacing: "-0.01em",
    },
    subtitle2: {
      fontSize: "0.8125rem",
      fontWeight: 500,
      letterSpacing: "0.01em",
    },
    body2: {
      fontSize: "0.875rem",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#f5f7fb",
          color: "#202124",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          boxShadow: "none",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundImage: "none",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          boxShadow: "none",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },
  },
});

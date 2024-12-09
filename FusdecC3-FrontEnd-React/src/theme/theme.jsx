import { createTheme } from "@mui/material/styles";

const getTheme = (darkMode) => createTheme({
  palette: {
    mode: darkMode ? "dark" : "light",
    primary: {
      main: "#1d526eff",
    },
    secondary: {
      main: "#1d526eff",
    },
    error: {
      main: "#f44336",
    },
    background: {
      default: darkMode ? "#121212" : "#ffffff", // Color de fondo
      paper: darkMode ? "#1e1e1e" : "#ffffff", // Color de papel
    },
    text: {
      primary: darkMode ? "#ffffff" : "#000000", // Color del texto
      secondary: darkMode ? "#b0b0b0" : "#555555", // Color del texto secundario
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
    h1: {
      fontSize: "2.5rem",
    },
    h2: {
      fontSize: "2rem",
    },
    body1: {
      fontSize: "1rem",
    },
  },
  spacing: 8,
  shape: {
    borderRadius: 8,
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
  },
});

export default getTheme;

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1d526eff", 
    },
    secondary: {
      main: "#1d526eff", 
    },
    error: {
      main: "#f44336", // Color de error
    },
    background: {
      default: "#ffffff", // Color de fondo por defecto
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
  spacing: 8, // Define la unidad de espaciado (8px es el valor predeterminado)
  shape: {
    borderRadius: 8, // Define el radio de las esquinas de los elementos
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
          textTransform: "none", // Desactiva la capitalización automática de los botones
        },
      },
    },
  },
});

export default theme;
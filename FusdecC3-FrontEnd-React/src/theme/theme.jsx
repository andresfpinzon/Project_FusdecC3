import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#30a000", // Verde institucional
    },
    secondary: {
      main: "#007832", // Color secundario
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
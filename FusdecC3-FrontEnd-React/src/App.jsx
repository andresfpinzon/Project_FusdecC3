/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import "./App.css";

import Navbar from "./components/navbar/NavBar";
import NavbarRoutes from "./routes/NavBarRoutes";
import Footer from "./components/footer/Footer";
import getTheme from "./theme/theme";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const theme = getTheme(darkMode);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <Router>
          <Navbar />
          <button onClick={toggleDarkMode} style={{ margin: '20px' }}>
            {darkMode ? "Modo Claro" : "Modo Oscuro"}
          </button>
          <div className="content">
            <NavbarRoutes />
          </div>
          <Footer />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;

/* eslint-disable no-unused-vars */
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import "./App.css";

import Navbar from "./components/navbar/NavBar";
import NavbarRoutes from "./routes/NavBarRoutes";
import Footer from "./components/footer/Footer";
import theme from "./theme/theme";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <Router>
          <Navbar />
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

/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedRoles = JSON.parse(localStorage.getItem("roles"));

    if (token) {
      const isTokenValid = checkTokenValidity(token);

      if (isTokenValid) {
        setIsAuthenticated(true);
        setRoles(storedRoles || []);
      } else {
        logout();
      }
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem("token");
      if (token && !checkTokenValidity(token)) {
        logout();
      }
    }, 60000); 

    return () => clearInterval(interval); 
  }, []);

  const checkTokenValidity = (token) => {
    try {
      const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decodificar el payload del token
      const currentTime = Math.floor(Date.now() / 1000); // Tiempo actual en segundos
      return decodedToken.exp > currentTime; // Comparar con el tiempo de expiración
    } catch (error) {
      console.error("Error al verificar el token:", error);
      return false;
    }
  };

  const login = (token, roles) => {
    localStorage.setItem("token", token);
    localStorage.setItem("roles", JSON.stringify(roles));
    setIsAuthenticated(true);
    setRoles(roles);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("roles");
    setIsAuthenticated(false);
    setRoles([]);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, roles, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


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
      setIsAuthenticated(true);
      setRoles(storedRoles || []);
    }
  }, []);

  const login = (token, roles) => {
    console.log("Guardando token y roles:", token, roles);
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


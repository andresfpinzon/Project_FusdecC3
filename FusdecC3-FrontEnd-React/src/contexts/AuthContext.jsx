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
      // More robust token validation
      if (!token) return false;

      // Check basic token structure
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        console.error('Invalid token format');
        return false;
      }

      // Attempt to decode payload
      const base64Url = tokenParts[1];
      const base64 = base64Url.replace('-', '+').replace('_', '/');
      const payload = JSON.parse(window.atob(base64));

      // Check expiration
      const currentTime = Math.floor(Date.now() / 1000);
      const isValid = payload.exp > currentTime;

      if (!isValid) {
        console.warn('Token has expired');
        logout(); // Automatically logout if token is expired
      }

      return isValid;
    } catch (error) {
      console.error("Token validation error:", error);
      logout(); // Logout on any token parsing error
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

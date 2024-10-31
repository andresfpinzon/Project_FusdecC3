import React from "react";
import { Navigate } from "react-router-dom";
import AccesoDenegado from "../../pages/accesoDenegado/AccesoDenegado";

const ProtectedRoute = ({ element: Element, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const roles = JSON.parse(localStorage.getItem("roles") || "[]");

  if (!token) {
    // Si no hay token, redirige a la página de login
    return <Navigate to="/login" />;
  }

  // Verifica si el usuario tiene al menos uno de los roles permitidos
  const hasAccess = allowedRoles.some((role) => roles.includes(role));
  
  return hasAccess ? <Element /> : <AccesoDenegado />;
};

export default ProtectedRoute;


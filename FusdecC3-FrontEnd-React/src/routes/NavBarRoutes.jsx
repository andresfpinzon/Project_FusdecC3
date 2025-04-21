/* eslint-disable no-unused-vars */
import React from "react";
import { Route, Routes } from "react-router-dom";

import Home from "../pages/home/Home";
import Cursos from "../pages/cursos/Cursos";
import Usuarios from "../pages/usuarios/Usuarios";
import Ediciones from "../pages/ediciones/Ediciones";
import MasInformacion from "../pages/masinformacion/MasInformacion";
import Estudiantes from "../pages/estudiantes/Estudiantes"
import Asistencias from "../pages/asistencias/Asistencias";
import Login from "../pages/login/Login";
import Auditorias from "../pages/auditorias/Auditorias";
import Comandos from "../pages/comandos/Comandos";
import Certificados from "../pages/certificados/Certificados";
import Brigadas from "../pages/brigadas/Brigadas";
import Unidades from "../pages/unidades/Unidades";
import Colegios from "../pages/colegios/Colegios";
import ProtectedRoute from "../components/protectedRoute/ProtectedRoute";



const NavbarRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/masinformacion" element={<MasInformacion />} />
      <Route path="/login" element={<Login />} />
      {/* Rutas Protegidas */}
      <Route path="/auditorias" element={<ProtectedRoute element={Auditorias} allowedRoles={["Administrativo","Root"]} />} />
      <Route path="/brigadas" element={<ProtectedRoute element={Brigadas} allowedRoles={["Administrativo","Root"]} />} />
      <Route path="/certificados" element={<ProtectedRoute element={Certificados} allowedRoles={["Administrativo","Root"]} />} />
      <Route path="/colegios" element={<ProtectedRoute element={Colegios} allowedRoles={["Administrativo","Root"]} />} />
      <Route path="/comandos" element={<ProtectedRoute element={Comandos} allowedRoles={["Administrativo","Root"]} />} />
      <Route path="/cursos" element={<ProtectedRoute element={Cursos} allowedRoles={["Secretario", "Administrativo","Root"]} />} />
      <Route path="/ediciones" element={<ProtectedRoute element={Ediciones} allowedRoles={["Secretario","Root"]} />} />
      <Route path="/unidades" element={<ProtectedRoute element={Unidades} allowedRoles={["Administrativo","Root"]} />} />
      <Route path="/usuarios" element={<ProtectedRoute element={Usuarios} allowedRoles={["Administrativo","Root"]} />} />
      <Route path="/estudiantes" element={<ProtectedRoute element={Estudiantes} allowedRoles={["Instructor", "Secretario","Root"]} />} />
      <Route path="/asistencias" element={<ProtectedRoute element={Asistencias} allowedRoles={["Instructor", "Administrativo","Root"]} />} />
    </Routes>
  );
};


export default NavbarRoutes;

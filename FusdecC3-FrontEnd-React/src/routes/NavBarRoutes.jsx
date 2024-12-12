/* eslint-disable no-unused-vars */
import React from "react";
import { Route, Routes } from "react-router-dom";

import Home from "../pages/home/Home";
import Cursos from "../pages/cursos/Cursos";
import Usuarios from "../pages/usuarios/Usuarios";
import Ediciones from "../pages/ediciones/Ediciones";
import Horarios from "../pages/horarios/Horarios";
import MasInformacion from "../pages/masinformacion/MasInformacion";
import Roles from "../pages/roles/Roles";
import Estudiantes from "../pages/estudiantes/Estudiantes"
import Asistencias from "../pages/asistencias/Asistencias";
import Inasistencias from "../pages/inasistencias/Inasistencias";
import Login from "../pages/login/Login";
import Auditorias from "../pages/auditorias/Auditorias";
import Comandos from "../pages/comandos/Comandos";
import Certificados from "../pages/certificados/Certificados";
import Brigadas from "../pages/brigadas/Brigadas";
import Unidades from "../pages/unidades/Unidades";
import Calificaciones from "../pages/calificaciones/Calificaciones";
import Colegios from "../pages/colegios/Colegios";
import Fundaciones from "../pages/fundaciones/Fundaciones";
import ProtectedRoute from "../components/protectedRoute/ProtectedRoute";



const NavbarRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/masinformacion" element={<MasInformacion />} />
      <Route path="/login" element={<Login />} />
      {/* Rutas Protegidas */}
      <Route path="/fundaciones" element={<ProtectedRoute element={Fundaciones} allowedRoles={["Administrador","Root"]} />} />
      <Route path="/auditorias" element={<ProtectedRoute element={Auditorias} allowedRoles={["Administrador","Root"]} />} />
      <Route path="/brigadas" element={<ProtectedRoute element={Brigadas} allowedRoles={["Administrador","Root"]} />} />
      <Route path="/certificados" element={<ProtectedRoute element={Certificados} allowedRoles={["Administrador","Root"]} />} />
      <Route path="/colegios" element={<ProtectedRoute element={Colegios} allowedRoles={["Administrador","Root"]} />} />
      <Route path="/comandos" element={<ProtectedRoute element={Comandos} allowedRoles={["Administrador","Root"]} />} />
      <Route path="/cursos" element={<ProtectedRoute element={Cursos} allowedRoles={["Secretario", "Administrador","Root"]} />} />
      <Route path="/ediciones" element={<ProtectedRoute element={Ediciones} allowedRoles={["Secretario","Root"]} />} />
      <Route path="/horarios" element={<ProtectedRoute element={Horarios} allowedRoles={["Secretario","Root"]} />} />
      <Route path="/unidades" element={<ProtectedRoute element={Unidades} allowedRoles={["Administrador","Root"]} />} />
      <Route path="/usuarios" element={<ProtectedRoute element={Usuarios} allowedRoles={["Administrador","Root"]} />} />
      <Route path="/roles" element={<ProtectedRoute element={Roles} allowedRoles={["Administrador","Root"]} />} />
      <Route path="/estudiantes" element={<ProtectedRoute element={Estudiantes} allowedRoles={["Instructor", "Secretario","Root"]} />} />
      <Route path="/asistencias" element={<ProtectedRoute element={Asistencias} allowedRoles={["Instructor", "Administrador","Root"]} />} />
      <Route path="/inasistencias" element={<ProtectedRoute element={Inasistencias} allowedRoles={["Instructor", "Administrador","Root"]} />} />
      <Route path="/calificaciones" element={<ProtectedRoute element={Calificaciones} allowedRoles={["Instructor", "Administrador","Root"]} />} />
    </Routes>
  );
};


export default NavbarRoutes;

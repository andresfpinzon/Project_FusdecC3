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



const NavbarRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="auditorias" element={<Auditorias />} />
      <Route path="/brigadas" element={<Brigadas />} />
      <Route path="/calificaciones" element={<Calificaciones />} />
      <Route path="/certificados" element={<Certificados />} />
      <Route path="/comandos" element={<Comandos />} />
      <Route path="/cursos" element={<Cursos />} />
      <Route path="/ediciones" element={<Ediciones />} />
      <Route path="/horarios" element={<Horarios />} />
      <Route path="/unidades" element={<Unidades />} />
      <Route path="/usuarios" element={<Usuarios />} />
      <Route path="/masinformacion" element={<MasInformacion />} />
      <Route path="/roles" element={<Roles />} />
      <Route path="/estudiantes" element={<Estudiantes />} />
      <Route path="/asistencias" element={<Asistencias />} />
      <Route path="/inasistencias" element={<Inasistencias/>}/>
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default NavbarRoutes;

import React from "react";
import { Route, Routes } from "react-router-dom";

import Home from "../pages/home/Home";
import Cursos from "../pages/cursos/Cursos";
import Usuarios from "../pages/usuarios/Usuarios";
import MasInformacion from "../pages/masinformacion/MasInformacion";
import Roles from "../pages/roles/Roles";
import Estudiantes from "../pages/estudiantes/Estudiantes"
import Login from "../pages/login/Login";


const NavbarRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/cursos" element={<Cursos />} />
      <Route path="/usuarios" element={<Usuarios />} />
      <Route path="/masinformacion" element={<MasInformacion />} />
      <Route path="/login" element={<Login />} />
      <Route path="/roles" element={<Roles />} />
      <Route path="/Estudiantes" element={<Estudiantes />} />
    </Routes>
  );
};

export default NavbarRoutes;

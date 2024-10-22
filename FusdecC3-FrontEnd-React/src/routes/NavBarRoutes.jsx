import React from "react";
import { Route, Routes } from "react-router-dom";

import Home from "../pages/home/Home";
import Cursos from "../pages/cursos/Cursos";
import Usuarios from "../pages/usuarios/Usuarios";
import MasInformacion from "../pages/masinformacion/MasInformacion";
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
    </Routes>
  );
};

export default NavbarRoutes;
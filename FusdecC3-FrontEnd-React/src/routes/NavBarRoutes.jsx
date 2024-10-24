import React from "react";
import { Route, Routes } from "react-router-dom";

import Home from "../pages/home/Home";
import Cursos from "../pages/cursos/Cursos";
import Usuarios from "../pages/usuarios/Usuarios";
import MasInformacion from "../pages/masinformacion/MasInformacion";
import Login from "../pages/login/Login";
import Comandos from "../pages/comandos/Comandos";
import Certificados from "../pages/certificados/Certificados";
import Brigadas from "../pages/brigadas/Brigadas";
import Unidades from "../pages/unidades/Unidades"; // Asegúrate de que la ruta sea correcta

const NavbarRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/brigadas" element={<Brigadas />} />
      <Route path="/certificados" element={<Certificados />} />
      <Route path="/comandos" element={<Comandos />} />
      <Route path="/cursos" element={<Cursos />} />
      <Route path="/unidades" element={<Unidades />} />
      <Route path="/usuarios" element={<Usuarios />} />
      <Route path="/masinformacion" element={<MasInformacion />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default NavbarRoutes;

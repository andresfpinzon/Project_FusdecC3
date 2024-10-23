import React from "react";
import Carrusel from "../../components/carrusel/Carrusel";

export default function Home() {
  return (
    <>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: "bold" }}>FUSDEC</h1>
        <p>Fundacion dedicada a formar estudiantes en primeros auxilios</p>
      </div>
      <Carrusel />
    </>
  );
}



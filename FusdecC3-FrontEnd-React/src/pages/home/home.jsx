import React from "react";
import Carrusel from "../../components/carrusel/Carrusel";

export default function Home() {
  return (
    <div style={{ textAlign: "center", fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <h1 style={{ fontSize: "3rem", fontWeight: "bold", color: "#1d526eff" }}>FUSDEC</h1>
      <p style={{ fontSize: "1.25rem", color: "#333", marginBottom: "20px" }}>
        Fundación dedicada a formar estudiantes en primeros auxilios
      </p>
      <Carrusel />
    </div>
  );
}




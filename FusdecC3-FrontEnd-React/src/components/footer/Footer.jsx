import React from "react";
import "./Footer.css"; // Si deseas aplicar estilos específicos al footer

const Footer = () => {
  const currentYear = new Date().getFullYear(); // Obtener el año actual dinámicamente

  return (
    <footer className="footer">
      <p>© {currentYear} Fusdec. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
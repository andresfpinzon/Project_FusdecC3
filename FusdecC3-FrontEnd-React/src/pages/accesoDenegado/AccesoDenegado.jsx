import React from "react";
import { Container, Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", mt: 5 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" color="error">
          Acceso Denegado
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          No tiene permiso para ver esta página.
        </Typography>
      </Box>
      <Button variant="contained" color="primary" onClick={() => navigate("/home")}>
        Volver al Inicio
      </Button>
    </Container>
  );
};

export default AccessDenied;

import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  Snackbar,
  Alert,
  Link,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formValues, setFormValues] = useState({
    correo: "",
    contraseña: "",
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/autenticaciones/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });

      if (response.ok) {
        // Lógica para redirigir o guardar el token
        navigate("/home");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al iniciar sesión");
      }
    } catch (error) {
      setErrorMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  return (
    <Container maxWidth="sm" style={{ display: "flex", alignItems: "center", minHeight: "100vh" }}>
      <Paper elevation={3} style={{ padding: "30px", width: "100%" }}>
        <Typography variant="h4" align="center" gutterBottom>
          Iniciar Sesión
        </Typography>
        <TextField
          label="Correo"
          name="correo"
          value={formValues.correo}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Contraseña"
          name="contraseña"
          type="password"
          value={formValues.contraseña}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <Box marginTop={3}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleLogin}
          >
            Iniciar Sesión
          </Button>
        </Box>
        <Box marginTop={2} textAlign="center">
          <Link href="/home" color="secondary">
            Volver
          </Link>
        </Box>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={() => setOpenSnackbar(false)}
        >
          <Alert severity="error" onClose={() => setOpenSnackbar(false)}>
            {errorMessage}
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
};

export default Login;


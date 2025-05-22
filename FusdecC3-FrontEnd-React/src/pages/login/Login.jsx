/* eslint-disable no-unused-vars */
import React, { useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
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
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formValues, setFormValues] = useState({
    correo: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Usar AuthContext
  const { login } = useContext(AuthContext);

  const handleInputChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });

      if (response.ok) {
        const data = await response.json();
        const { token } = data;

        // Decodificar payload del token
        const payload = JSON.parse(atob(token.split(".")[1]));

        // Convertir roles a formato sin "ROLE_"
        const rolesNormalizados = payload.roles.map((rol) => {
          const sinPrefijo = rol.replace("ROLE_", "");
          return sinPrefijo.charAt(0).toUpperCase() + sinPrefijo.slice(1).toLowerCase();
        });


        // Llamar la función `login` del contexto
        login(token, rolesNormalizados);

        window.location.href = "/home";
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
      <Paper
        elevation={5}
        style={{
          padding: "40px",
          borderRadius: "10px",
          width: "100%",
          backgroundColor: "#f9f9f9",
        }}
      >
        <Typography variant="h4" align="center" gutterBottom style={{ color: "#1d526eff" }}>
          Iniciar Sesión
        </Typography>
        <TextField
          label="Correo"
          name="correo"
          value={formValues.correo}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <TextField
          label="Contraseña"
          name="password"
          type={showPassword ? "text" : "password"}
          value={formValues.password}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          variant="outlined"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Box marginTop={3}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            onClick={handleLogin}
            style={{ padding: "10px", fontWeight: "bold" }}
          >
            Iniciar Sesión
          </Button>
        </Box>
        <Box marginTop={2} textAlign="center">
          <Link href="/home" color="secondary" underline="hover">
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





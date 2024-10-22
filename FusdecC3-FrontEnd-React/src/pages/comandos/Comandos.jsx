import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  Switch,
  FormControlLabel,
  Box,
} from "@mui/material";

const ComandosPage = () => {
  const [comandos, setComandos] = useState([]);
  const [selectedComando, setSelectedComando] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [formValues, setFormValues] = useState({
    nombreComando: "",
    ubicacionComando: "",
    estadoComando: true,
    fundacionId: "",
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchComandos();
  }, []);

  const fetchComandos = async () => {
    try {
      const response = await fetch("https://localhost:3000/api/comandos");
      if (!response.ok) throw new Error("Error al obtener comandos");
      const data = await response.json();
      setComandos(data);
    } catch (error) {
      console.error("Error al obtener comandos:", error);
      setErrorMessage("Error al obtener comandos");
      setOpenSnackbar(true);
    }
  };

  const handleCardClick = (comando) => {
    setSelectedComando(comando);
    setFormValues(comando);
    setIsEditing(true);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedComando(null);
    setFormValues({
      nombreComando: "",
      ubicacionComando: "",
      estadoComando: true,
      fundacionId: "",
    });
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormValues({
      ...formValues,
      [e.target.name]: value,
    });
  };

  const handleCreateComando = () => {
    setIsEditing(false);
    setFormValues({
      nombreComando: "",
      ubicacionComando: "",
      estadoComando: true,
      fundacionId: "",
    });
    setOpenModal(true);
  };

  const handleSubmit = async () => {
    try {
      const url = isEditing
        ? `https://localhost:3000/api/comandos/${selectedComando._id}`
        : "https://localhost:3000/api/comandos";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al procesar la solicitud");
      }

      setErrorMessage(isEditing ? "Comando actualizado con éxito" : "Comando creado con éxito");
      setOpenSnackbar(true);
      handleCloseModal();
      fetchComandos();
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setErrorMessage("");
  };

  return (
    <Container maxWidth="lg" sx={{ pl: 0 }}>
      <Box sx={{ textAlign: 'left', mb: 3, ml: 0 }}>
        <Typography variant="h4" gutterBottom>
          Gestión de Comandos
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleCreateComando}
          sx={{ mt: 2 }}
        >
          Crear Nuevo Comando
        </Button>
      </Box>
      <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={3} sx={{ ml: 0 }}>
        {comandos.map((comando) => (
          <Box gridColumn={{ xs: "span 12", sm: "span 6", md: "span 4" }} key={comando._id}>
            <Card onClick={() => handleCardClick(comando)}>
              <CardContent>
                <Typography variant="h6" component="div">
                  {comando.nombreComando}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Ubicación: {comando.ubicacionComando}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Estado: {comando.estadoComando ? "Activo" : "Inactivo"}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
      
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{isEditing ? "Editar Comando" : "Crear Nuevo Comando"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre del Comando"
            name="nombreComando"
            value={formValues.nombreComando}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Ubicación del Comando"
            name="ubicacionComando"
            value={formValues.ubicacionComando}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <FormControlLabel
            control={
              <Switch
                checked={formValues.estadoComando}
                onChange={handleInputChange}
                name="estadoComando"
                color="primary"
              />
            }
            label="Estado del Comando"
          />
          <TextField
            label="ID de la Fundación"
            name="fundacionId"
            value={formValues.fundacionId}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {isEditing ? "Actualizar" : "Crear"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={errorMessage.includes("éxito") ? "success" : "error"}
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ComandosPage;

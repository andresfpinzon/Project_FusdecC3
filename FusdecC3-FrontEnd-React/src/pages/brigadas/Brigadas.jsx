src/pages/brigadas/Brigadas.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const Brigadas = () => {
  const [brigadas, setBrigadas] = useState([]);
  const [formValues, setFormValues] = useState({
    nombreBrigada: "",
    ubicacionBrigada: "",
    estadoBrigada: true,
    comandoId: "",
  });
  const [openModal, setOpenModal] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBrigada, setSelectedBrigada] = useState(null);

  useEffect(() => {
    fetchBrigadas();
  }, []);

  const fetchBrigadas = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/brigadas");
      if (!response.ok) throw new Error("Error al obtener brigadas");
      const data = await response.json();
      setBrigadas(data);
    } catch (error) {
      console.error("Error al obtener brigadas:", error);
      setErrorMessage("Error al obtener brigadas");
      setOpenSnackbar(true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleCreateBrigada = () => {
    setIsEditing(false);
    setFormValues({
      nombreBrigada: "",
      ubicacionBrigada: "",
      estadoBrigada: true,
      comandoId: "",
    });
    setOpenModal(true);
  };

  const handleSubmit = async () => {
    try {
      const url = isEditing
        ? `http://localhost:3000/api/brigadas/${selectedBrigada._id}`
        : "http://localhost:3000/api/brigadas";
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

      setErrorMessage(isEditing ? "Brigada actualizada con éxito" : "Brigada creada con éxito");
      setOpenSnackbar(true);
      handleCloseModal();
      fetchBrigadas();
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedBrigada(null);
    setFormValues({
      nombreBrigada: "",
      ubicacionBrigada: "",
      estadoBrigada: true,
      comandoId: "",
    });
    setIsEditing(false);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setErrorMessage("");
  };

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>
            Lista de Brigadas
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Ubicación</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {brigadas.map((brigada) => (
                  <TableRow key={brigada._id}>
                    <TableCell>{brigada.nombreBrigada}</TableCell>
                    <TableCell>{brigada.ubicacionBrigada}</TableCell>
                    <TableCell>{brigada.estadoBrigada ? "Activo" : "Inactivo"}</TableCell>
                    <TableCell>
                      <Button onClick={() => {
                        setSelectedBrigada(brigada);
                        setFormValues(brigada);
                        setIsEditing(true);
                        setOpenModal(true);
                      }}>
                        Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ textAlign: "left", mb: 3 }}>
            <Typography variant="h4" gutterBottom>
              {isEditing ? "Editar Brigada" : "Crear Nueva Brigada"}
            </Typography>
            <Button variant="contained" color="primary" onClick={handleCreateBrigada}>
              Crear Nueva Brigada
            </Button>
          </Box>
          <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
            <DialogTitle>{isEditing ? "Editar Brigada" : "Crear Nueva Brigada"}</DialogTitle>
            <DialogContent>
              <TextField
                label="Nombre de la Brigada"
                name="nombreBrigada"
                value={formValues.nombreBrigada}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Ubicación de la Brigada"
                name="ubicacionBrigada"
                value={formValues.ubicacionBrigada}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Comando ID"
                name="comandoId"
                value={formValues.comandoId}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={formValues.estadoBrigada}
                    onChange={(e) => setFormValues({ ...formValues, estadoBrigada: e.target.checked })}
                    name="estadoBrigada"
                    color="primary"
                  />
                }
                label="Estado de la Brigada"
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
          <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
            <Alert onClose={handleCloseSnackbar} severity={errorMessage.includes("éxito") ? "success" : "error"} sx={{ width: "100%" }}>
              {errorMessage}
            </Alert>
          </Snackbar>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Brigadas;
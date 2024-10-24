import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Switch,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const Brigadas = () => {
  const [brigadas, setBrigadas] = useState([]);
  const [selectedBrigada, setSelectedBrigada] = useState(null);
  const [formValues, setFormValues] = useState({
    nombreBrigada: "",
    ubicacionBrigada: "",
    estadoBrigada: true,
    comandoId: "",
  });
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

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
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleSwitchChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.checked,
    });
  };

  const handleCreateBrigada = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/brigadas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });

      if (response.ok) {
        const nuevaBrigada = await response.json();
        setBrigadas([...brigadas, nuevaBrigada]);
        clearForm();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al crear brigada");
      }
    } catch (error) {
      console.error("Error al crear brigada:", error);
      setErrorMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  const handleUpdateBrigada = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/brigadas/${selectedBrigada._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formValues),
        }
      );

      if (response.ok) {
        const brigadaActualizada = await response.json();
        setBrigadas(
          brigadas.map((brigada) =>
            brigada._id === selectedBrigada._id ? brigadaActualizada : brigada
          )
        );
        clearForm();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar brigada");
      }
    } catch (error) {
      console.error("Error al actualizar brigada:", error);
      setErrorMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  const handleDeleteBrigada = async () => {
    if (!selectedBrigada) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/brigadas/${selectedBrigada._id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setBrigadas(brigadas.filter((brigada) => brigada._id !== selectedBrigada._id));
        handleCloseDeleteDialog(); // Cierra el modal de confirmación después de eliminar
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar brigada");
      }
    } catch (error) {
      console.error("Error al eliminar brigada:", error);
      setErrorMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  const handleEditClick = (brigada) => {
    setSelectedBrigada(brigada);
    setFormValues({
      nombreBrigada: brigada.nombreBrigada || "",
      ubicacionBrigada: brigada.ubicacionBrigada || "",
      estadoBrigada: brigada.estadoBrigada !== undefined ? brigada.estadoBrigada : true,
      comandoId: brigada.comandoId || "",
    });
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedBrigada(null);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setErrorMessage(null);
  };

  const clearForm = () => {
    setFormValues({
      nombreBrigada: "",
      ubicacionBrigada: "",
      estadoBrigada: true,
      comandoId: "",
    });
    setSelectedBrigada(null);
  };

  return (
    <Container>
      <h1>Gestión de Brigadas</h1>
      <form noValidate autoComplete="off">
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
        <Box marginTop={2} marginBottom={2}>
          <Switch
            checked={formValues.estadoBrigada}
            onChange={handleSwitchChange}
            name="estadoBrigada"
            color="primary"
          />
          Estado Activo
        </Box>
        <TextField
          label="Comando ID"
          name="comandoId"
          value={formValues.comandoId}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={selectedBrigada ? handleUpdateBrigada : handleCreateBrigada}
        >
          {selectedBrigada ? "Actualizar Brigada" : "Crear Brigada"}
        </Button>
      </form>
      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
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
                  <IconButton onClick={() => handleEditClick(brigada)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => {
                    setSelectedBrigada(brigada);
                    setOpenDeleteDialog(true);
                  }} color="secondary">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal de Confirmación de Eliminación */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent dividers>
          <Typography>
            ¿Estás seguro de que quieres eliminar la brigada{" "}
            <strong>{selectedBrigada?.nombreBrigada}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="default">
            Cancelar
          </Button>
          <Button onClick={handleDeleteBrigada} color="secondary">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para mensajes de error */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Brigadas;
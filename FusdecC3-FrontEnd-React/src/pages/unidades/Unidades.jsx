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

const Unidades = () => {
  const [unidades, setUnidades] = useState([]);
  const [selectedUnidad, setSelectedUnidad] = useState(null);
  const [formValues, setFormValues] = useState({
    nombreUnidad: "",
    estadoUnidad: true,
    brigadaId: "",
    usuarioId: "",
    estudiantes: [],
  });
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    fetchUnidades();
  }, []);

  const fetchUnidades = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/unidades");
      if (!response.ok) throw new Error("Error al obtener unidades");
      const data = await response.json();
      setUnidades(data);
    } catch (error) {
      console.error("Error al obtener unidades:", error);
      setErrorMessage("Error al obtener unidades");
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

  const handleCreateUnidad = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/unidades", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });

      if (response.ok) {
        const nuevaUnidad = await response.json();
        setUnidades([...unidades, nuevaUnidad]);
        clearForm();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al crear unidad");
      }
    } catch (error) {
      console.error("Error al crear unidad:", error);
      setErrorMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  const handleUpdateUnidad = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/unidades/${selectedUnidad._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formValues),
        }
      );

      if (response.ok) {
        const unidadActualizada = await response.json();
        setUnidades(
          unidades.map((unidad) =>
            unidad._id === selectedUnidad._id ? unidadActualizada : unidad
          )
        );
        clearForm();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar unidad");
      }
    } catch (error) {
      console.error("Error al actualizar unidad:", error);
      setErrorMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  const handleDeleteUnidad = async () => {
    if (!selectedUnidad) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/unidades/${selectedUnidad._id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setUnidades(unidades.filter((unidad) => unidad._id !== selectedUnidad._id));
        handleCloseDeleteDialog(); // Cierra el modal de confirmación después de eliminar
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar unidad");
      }
    } catch (error) {
      console.error("Error al eliminar unidad:", error);
      setErrorMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  const handleEditClick = (unidad) => {
    setSelectedUnidad(unidad);
    setFormValues({
      nombreUnidad: unidad.nombreUnidad || "",
      estadoUnidad: unidad.estadoUnidad !== undefined ? unidad.estadoUnidad : true,
      brigadaId: unidad.brigadaId || "",
      usuarioId: unidad.usuarioId || "",
      estudiantes: unidad.estudiantes || [],
    });
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedUnidad(null);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setErrorMessage(null);
  };

  const clearForm = () => {
    setFormValues({
      nombreUnidad: "",
      estadoUnidad: true,
      brigadaId: "",
      usuarioId: "",
      estudiantes: [],
    });
    setSelectedUnidad(null);
  };

  return (
    <Container>
      <h1>Gestión de Unidades</h1>
      <form noValidate autoComplete="off">
        <TextField
          label="Nombre de la Unidad"
          name="nombreUnidad"
          value={formValues.nombreUnidad}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <Box marginTop={2} marginBottom={2}>
          <Switch
            checked={formValues.estadoUnidad}
            onChange={handleSwitchChange}
            name="estadoUnidad"
            color="primary"
          />
          Estado Activo
        </Box>
        <TextField
          label="Brigada ID"
          name="brigadaId"
          value={formValues.brigadaId}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Usuario ID"
          name="usuarioId"
          value={formValues.usuarioId}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={selectedUnidad ? handleUpdateUnidad : handleCreateUnidad}
        >
          {selectedUnidad ? "Actualizar Unidad" : "Crear Unidad"}
        </Button>
      </form>
      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Brigada ID</TableCell>
              <TableCell>Usuario ID</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {unidades.map((unidad) => (
              <TableRow key={unidad._id}>
                <TableCell>{unidad.nombreUnidad}</TableCell>
                <TableCell>{unidad.estadoUnidad ? "Activo" : "Inactivo"}</TableCell>
                <TableCell>{unidad.brigadaId}</TableCell>
                <TableCell>{unidad.usuarioId}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditClick(unidad)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => {
                    setSelectedUnidad(unidad);
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
            ¿Estás seguro de que quieres eliminar la unidad{" "}
            <strong>{selectedUnidad?.nombreUnidad}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="default">
            Cancelar
          </Button>
          <Button onClick={handleDeleteUnidad} color="secondary">
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

export default Unidades;
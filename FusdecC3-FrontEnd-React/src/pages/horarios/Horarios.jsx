/* eslint-disable no-unused-vars */
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
  TablePagination
} from "@mui/material";

import { Edit, Delete, Info, Class,AccessTime, ToggleOn } from "@mui/icons-material";

const token = localStorage.getItem("token");

const Horarios = () => {
  const [horarios, setHorarios] = useState([]);
  const [selectedHorario, setSelectedHorario] = useState(null);
  const [formValues, setFormValues] = useState({
    tituloHorario: "",
    horaInicio: "",
    horaFin: "",
    estadoHorario: true,
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [horarioToDelete, setHorarioToDelete] = useState(null);
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const [infoHorario, setInfoHorario] = useState(null);

  // Paginación y búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchHorarios = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/horarios",{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token 
        }
    });
      if (!response.ok) throw new Error("Error al obtener horarios");
      const data = await response.json();

      // Condicion que verifica si el arreglo de horarios está vacío
      if (data.length === 0) {
        setErrorMessage("No hay horarios registrados.");
        setOpenSnackbar(true);
        setHorarios([]); // esto mantiene el estado vacío para evitar errores
      } else {
        setHorarios(data);
      }
    } catch (error) {
      console.error("Error al obtener horarios:", error);
      setErrorMessage("Error al obtener horarios");
      setOpenSnackbar(true);
    }
  };

  useEffect(() => {
    fetchHorarios();
  }, []);

  // Filtrar usuarios según el término de búsqueda
  const filteredHorarios = horarios.filter((horario) =>
    horario.tituloHorario.toLowerCase().includes(searchTerm.toLowerCase()) ||
    horario.horaInicio.toLowerCase().includes(searchTerm.toLowerCase()) ||
    horario.horaFin.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Cambiar página
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Cambiar filas por página
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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

  const handleCreateHorario = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/Horarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token 
        },
        body: JSON.stringify(formValues),
      });

      if (response.ok) {
        const nuevoHorario = await response.json();
        setHorarios([...horarios, nuevoHorario]);
        setFormValues({
          tituloHorario: "",
          horaInicio: "",
          horaFin: "",
          estadoHorario: true,
        });

        // Muestra un mensaje de éxito
        setSuccessMessage("Horario creado exitosamente.");
        setOpenSnackbar(true);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al crear el horario");
      }
    } catch (error) {
      console.error("Error al crear el horario:", error);
      setErrorMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  const handleUpdateHorario = async () => {
    if (!selectedHorario) return;
    try {
      const response = await fetch(
        `http://localhost:3000/api/horarios/${selectedHorario._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token 
          },
          body: JSON.stringify(formValues),
        }
      );

      if (response.ok) {
        const horarioActualizado = await response.json();
        setHorarios(
          horarios.map((horario) =>
            horario._id === selectedHorario._id ? horarioActualizado : horario
          )
        );
        setSelectedHorario(null);
        setFormValues({
          tituloHorario: "",
          horaInicio: "",
          horaFin: "",
          estadoHorario: true,
        });

        // Mostrar mensaje de éxito
        setSuccessMessage("El horario se actualizó correctamente");
        setOpenSnackbar(true); 
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar el  horario");
      }
    } catch (error) {
      console.error("Error al actualizar el horario:", error);
      setErrorMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  const handleDeleteHorario = async () => {
    if (!horarioToDelete) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/horarios/${horarioToDelete._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token 
        }
        }
      );

      if (response.ok) {
        setHorarios(horarios.filter((horario) => horario._id !== horarioToDelete._id));
        handleCloseDeleteDialog(); // Cierra el modal de confirmación después de eliminar

        // Mostrar mensaje de éxito
        setSuccessMessage("El horario se eliminó correctamente");
        setOpenSnackbar(true);

      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar el horario");
      }
    } catch (error) {
      console.error("Error al eliminar el horario:", error);
      setErrorMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  const handleEditClick = (horario) => {
    setSelectedHorario(horario);
    setFormValues({
      tituloHorario: horario.tituloHorario || "",
      horaInicio: horario.horaInicio || "",
      horaFin: horario.horaFin || "",
      estadoHorario: horario.estadoHorario !== undefined ? horario.estadoHorario : true,
    });
  };

  const handleInfoClick = async (horario) => {
    const response = await fetch(`http://localhost:3000/api/horarios/${horario._id}`,{
      method: "GET",
      headers: {
          "Content-Type": "application/json",
          "Authorization": token 
      }
  });
    const data = await response.json();
    setInfoHorario(data);
    setOpenInfoDialog(true);
  };

  const handleDeleteClick = (horario) => {
    setHorarioToDelete(horario);
    setOpenDeleteDialog(true);
  };

  const handleCloseInfoDialog = () => {
    setOpenInfoDialog(false);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setHorarioToDelete(null);
  };

  return (
    <Container>
      <h1>Gestión de Horarios:</h1>
      <form noValidate autoComplete="off">
        <TextField
          label="Título del horario"
          name="tituloHorario"
          value={formValues.tituloHorario}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Hora de inicio"
          name="horaInicio"
          value={formValues.horaInicio}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Hora de fin"
          name="horaFin"
          value={formValues.horaFin}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <Box marginTop={2} marginBottom={2}>
          <Switch
            checked={formValues.estadoHorario}
            onChange={handleSwitchChange}
            name="estadoHorario"
            color="primary"
          />
          Estado Activo
        </Box>
        <Box marginTop={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={selectedHorario ? handleUpdateHorario : handleCreateHorario}
          >
            {selectedHorario ? "Actualizar Horario" : "Crear Horario"}
          </Button>
        </Box>
      </form>

      {/* Busqueda */}
      <TextField
        label="Buscar horarios"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Título</TableCell>
              <TableCell>Hora-inicio</TableCell>
              <TableCell>Hora-fin</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {filteredHorarios
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((horario) => (
              <TableRow key={horario._id}>
                <TableCell>{horario.tituloHorario}</TableCell>
                <TableCell>{horario.horaInicio}</TableCell>
                <TableCell>{horario.horaFin}</TableCell>
                <TableCell>{horario.estadoHorario ? "Activo" : "Inactivo"}
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleEditClick(horario)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleInfoClick(horario)} color="primary">
                    <Info />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteClick(horario)}
                    color="secondary"
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Paginación */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredHorarios.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

      </TableContainer>
      
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Eliminar horario</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro de que deseas eliminar a {horarioToDelete?.tituloHorario}?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">Cancelar</Button>
          <Button onClick={handleDeleteHorario} color="secondary">Eliminar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openInfoDialog} onClose={handleCloseInfoDialog} maxWidth="sm" fullWidth>
  <DialogTitle sx={{ backgroundColor: '#1d526eff', color: '#fff', textAlign: 'center' }}>
    Información del Horario
  </DialogTitle>
  <DialogContent dividers sx={{ padding: '20px' }}>
    {infoHorario && (
      <div>
        {/* Título */}
        <Box display="flex" alignItems="center" mb={2}>
          <Class color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Título:</Typography>
          <Typography variant="body1" sx={{ ml: 1 }}>{infoHorario.tituloHorario || "Título no disponible"}</Typography>
        </Box>

        {/* Hora de Inicio */}
        <Box display="flex" alignItems="center" mb={2}>
          <AccessTime color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Hora de Inicio:</Typography>
          <Typography variant="body1" sx={{ ml: 1 }}>{infoHorario.horaInicio || "Hora no disponible"}</Typography>
        </Box>

        {/* Hora de Finalización */}
        <Box display="flex" alignItems="center" mb={2}>
          <AccessTime color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Hora de Finalización:</Typography>
          <Typography variant="body1" sx={{ ml: 1 }}>{infoHorario.horaFin || "Hora no disponible"}</Typography>
        </Box>

        {/* Estado */}
        <Box display="flex" alignItems="center" mb={2}>
          <ToggleOn color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Estado:</Typography>
          <Typography variant="body1" sx={{ ml: 1 }}>{infoHorario.estadoHorario ? "Activa" : "Inactiva"}</Typography>
        </Box>
      </div>
    )}
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseInfoDialog} variant="contained" color="primary">
      Cerrar
    </Button>
  </DialogActions>
</Dialog>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Horarios;
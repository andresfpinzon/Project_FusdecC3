/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput,
  Checkbox,
  ListItemText,
  TablePagination
} from "@mui/material";

import { Edit, Delete, Info, Grade, CheckCircle, Person, ToggleOn, Group } from "@mui/icons-material";

const token = localStorage.getItem("token");

const Calificaciones = () => {
  const [calificaciones, setCalificaciones] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [Usuarios, setUsuarios] = useState([]);
  const [selectedCalificacion, setSelectedCalificacion] = useState(null);
  const [formValues, setFormValues] = useState({
    tituloCalificacion: "",
    aprobado: true,
    usuarioId: "",
    estudiantes: [],
    estadoCalificacion: true,
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [calificacionToDelete, setCalificacionToDelete] = useState(null);
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const [infoCalificacion, setInfoCalificacion] = useState(null);

  // Paginación y búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchCalificaciones = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/calificaciones",{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token 
        }
    });
      if (!response.ok) throw new Error("Error al obtener calificaciones");
      const data = await response.json();

      // Condicion que verifica si el arreglo de calificaciones está vacío
      if (data.length === 0) {
        setErrorMessage("No hay calificaciones registradas.");
        setOpenSnackbar(true);
        setCalificaciones([]); // esto mantiene el estado vacío para evitar errores
      } else {
        setCalificaciones(data);
      }
      
    } catch (error) {
      console.error("Error al obtener calificaciones:", error);
      setErrorMessage("Error al obtener calificaciones");
      setOpenSnackbar(true);
    }
  };

  const fetchEstudiantes = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/estudiantes",{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token 
        }
    });
      if (!response.ok) throw new Error("Error al obtener estudiantes");
      const data = await response.json();
      
      // Condicion que verifica si el arreglo de estudiantes está vacío
      if (data.length === 0) {
        setErrorMessage("No hay estudiantes registradas.");
        setOpenSnackbar(true);
        setEstudiantes([]); // esto mantiene el estado vacío para evitar errores
      } else {
        setEstudiantes(data);
      }
    } catch (error) {
      console.error("Error al obtener estudiantes:", error);
      setErrorMessage("Error al obtener estudiantes");
      setOpenSnackbar(true);
    }
  };

  const fetchUsuarios = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/usuarios",{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token 
        }
    });
      if (!response.ok) throw new Error("Error al obtener usuarios");
      const data = await response.json();

      // Condicion que verifica si el arreglo de usuarios está vacío
      if (data.length === 0) {
        setErrorMessage("No hay usuarios registradas.");
        setOpenSnackbar(true);
        setUsuarios([]); // esto mantiene el estado vacío para evitar errores
      } else {
        setUsuarios(data);
      }
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      setErrorMessage("Error al obtener usuarios");
      setOpenSnackbar(true);
    }
  };

  useEffect(() => {
    fetchCalificaciones();
    fetchEstudiantes();
    fetchUsuarios();
    // Decodificar el token y obtener el ID de usuario
    if (token) {
      const decodedToken = jwtDecode(token);
      setFormValues((prevFormValues) => ({
        ...prevFormValues,
        usuarioId: decodedToken.id, 
      }));
    }
  }, []);

  // Filtrar usuarios según el término de búsqueda
  const filteredCalificaciones = calificaciones.filter((calificacion) =>
    calificacion.tituloCalificacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    calificacion.aprobado.toLowerCase().includes(searchTerm.toLowerCase())
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
  
  const handleError = (message) => {
    setErrorMessage(message);
    setOpenSnackbar(true);
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

  const handleCreateCalificacion = async () => {
    try {
        const response = await fetch("http://localhost:3000/api/calificaciones", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token 
            },
            body: JSON.stringify(formValues),
        });

        // Maneja la respuesta
        if (response.ok) {
            const nuevaCalificacion = await response.json();
            setCalificaciones([...calificaciones, nuevaCalificacion]);

          // Muestra un mensaje de éxito
          setSuccessMessage("calificación creada exitosamente.");
          setOpenSnackbar(true);

            setFormValues({
              tituloCalificacion: "",
              aprobado: true,
              usuarioId: formValues.usuarioId,
              estudiantes: [],
              estadoCalificacion: true,
            });
            console.log('Calificación creada exitosamente:', nuevaCalificacion);
        } else {
            const errorData = await response.json();
            throw new Error(errorData.error || "Error al crear calificación");
        }
    } catch (error) {
        handleError("Error al crear calificación", error);
    }
  };

  const handleUpdateCalificacion = async () => {
    if (!selectedCalificacion) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/calificaciones/${selectedCalificacion._id}`,
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
        const calificacionActualizada = await response.json();
        setCalificaciones(
          calificaciones.map((calificacion) =>
            calificacion._id === selectedCalificacion._id ? calificacionActualizada : calificacion
          )
        );
        setSelectedCalificacion(null);
        setFormValues({
          tituloCalificacion: "",
          aprobado: true,
          usuarioId: "",
          estudiantes: [],
          estadoCalificacion: true,
        });

        // Mostrar mensaje de éxito
        setSuccessMessage("La calificación se actualizó correctamente");
        setOpenSnackbar(true); 
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar calificación");
      }
    } catch (error) {
      handleError("Error al actualizar calificación", error);
    }
  };

  const handleDeleteCalificacion = async () => {
    if (!calificacionToDelete) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/calificaciones/${calificacionToDelete._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token 
        }
        }
      );

      if (response.ok) {
        setCalificaciones(calificaciones.filter((calificacion) => calificacion._id !== calificacionToDelete._id));
        handleCloseDeleteDialog(); // Cierra el modal de confirmación después de eliminar

        // Mostrar mensaje de éxito
        setSuccessMessage("La calificación se eliminó correctamente");
        setOpenSnackbar(true);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar calificación");
      }
    } catch (error) {
      handleError("Error al eliminar calificación", error);
    }
  };

  const handleEditClick = (calificacion) => {
    setSelectedCalificacion(calificacion);
    setFormValues({
      tituloCalificacion: calificacion.tituloCalificacion,
      aprobado: calificacion.aprobado,
      usuarioId: calificacion.usuarioId,
      estudiantes: calificacion.estudiantes || [],
      estadoCalificacion: calificacion.estadoCalificacion,
    });
  };
  
  const handleEstudianteChange = (e) => {
    const { target: { value } } = e;
    setFormValues({
      ...formValues,
      estudiantes: typeof value === "string" ? value.split(",") : value,
    });
  };

  const handleDeleteClick = (calificacion) => {
    setCalificacionToDelete(calificacion);
    setOpenDeleteDialog(true);
  };

  const handleInfoClick = async (calificacion) => {
    const response = await fetch(`http://localhost:3000/api/calificaciones/${calificacion._id}`,{
      method: "GET",
      headers: {
          "Content-Type": "application/json",
          "Authorization": token 
      }
  });
    const data = await response.json();
    setInfoCalificacion(data);
    setOpenInfoDialog(true);
  };

  const handleCloseInfoDialog = () => {
    setOpenInfoDialog(false);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setCalificacionToDelete(null);
  };

  return (
    <Container>
      <h1>Gestión de Calificaciones:</h1>
      <form noValidate autoComplete="off">
        <TextField
          label="Título de la calificación"
          name="tituloCalificacion"
          value={formValues.tituloCalificacion}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <Box marginTop={2} marginBottom={2}>
          <Switch
            checked={formValues.aprobado}
            onChange={handleSwitchChange}
            name="aprobado"
            color="primary"
          />
          Aprobaron
        </Box>

        <FormControl fullWidth margin="normal">
          <InputLabel>Estudiantes</InputLabel>
          <Select
            multiple
            value={formValues.estudiantes}
            onChange={handleEstudianteChange}
            input={<OutlinedInput label="Estudiantes" />}
            renderValue={(selected) =>
              estudiantes
                .filter((estudiante) => selected.includes(estudiante._id))
                .map((estudiante) => estudiante.nombreEstudiante)
                .join(", ")
            }
          >
            
            {estudiantes.map((estudiante) => (
              <MenuItem key={estudiante._id} value={estudiante._id}>
                <Checkbox checked={formValues.estudiantes.indexOf(estudiante._id) > -1} />
                <ListItemText primary={estudiante.nombreEstudiante} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        

        <Box marginTop={2} marginBottom={2}>
          <Switch
            checked={formValues.estadoCalificacion}
            onChange={handleSwitchChange}
            name="estadoCalificacion"
            color="primary"
          />
          Estado Activo
        </Box>
        
        <Box marginTop={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={selectedCalificacion ? handleUpdateCalificacion : handleCreateCalificacion}
          >
            {selectedCalificacion? "Actualizar calificación" : "Crear calificación"}
          </Button>
        </Box>
      </form>

      {/* Busqueda */}
      <TextField
        label="Buscar calificaciones"
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
              <TableCell>Aprobado</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {filteredCalificaciones
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((calificacion) => (
              <TableRow key={calificacion._id}>
                <TableCell>{calificacion.tituloCalificacion}</TableCell>
                <TableCell>{calificacion.aprobado  ? "Si" : "No"}</TableCell>
                <TableCell>{calificacion.estadoCalificacion ? "Activa" : "Inactiva"}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditClick(calificacion)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleInfoClick(calificacion)} color="primary">
                    <Info />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteClick(calificacion)}
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
          count={filteredCalificaciones.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

      </TableContainer>

      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Eliminar calificación</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro de que deseas eliminar a {calificacionToDelete?.tituloCalificacion}?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">Cancelar</Button>
          <Button onClick={handleDeleteCalificacion} color="secondary">Eliminar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openInfoDialog} onClose={handleCloseInfoDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: '#1d526eff', color: '#fff', textAlign: 'center' }}>
          Información de la Calificación
        </DialogTitle>
        <DialogContent dividers sx={{ padding: '20px' }}>
          {infoCalificacion && (
            <div>
              {/* Título de la Calificación */}
              <Box display="flex" alignItems="center" mb={2}>
                <Grade color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Título:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>{infoCalificacion.tituloCalificacion || "Título no disponible"}</Typography>
              </Box>
              
              {/* Aprobado */}
              <Box display="flex" alignItems="center" mb={2}>
                <CheckCircle color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Aprobado:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>{infoCalificacion.aprobado ? "Sí" : "No"}</Typography>
              </Box>
              
              {/* Usuario */}
              <Box display="flex" alignItems="center" mb={2}>
                <Person color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Usuario:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>
                  {infoCalificacion.usuario?.nombreUsuario || "Usuario no encontrado"}
                </Typography>
              </Box>
              
              {/* Estado */}
              <Box display="flex" alignItems="center" mb={2}>
                <ToggleOn color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Estado:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>{infoCalificacion.estadoCalificacion ? "Activa" : "Inactiva"}</Typography>
              </Box>
              
              {/* Estudiantes */}
              <Box display="flex" alignItems="center" mb={2}>
                <Group color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Estudiantes:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>
                  {infoCalificacion.estudiantes?.map((es) => es.nombreEstudiante).join(", ") || "Sin estudiantes"}
                </Typography>
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

export default Calificaciones;
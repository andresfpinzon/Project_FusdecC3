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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput,
} from "@mui/material";

import { Edit, Delete, Info } from "@mui/icons-material";

const Calificaciones = () => {
  const [calificaciones, setCalificaciones] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [Usuarios, setUsuarios] = useState([]);
  const [selectedCalificacion, setSelectedCalificacion] = useState(null);
  const [formValues, setFormValues] = useState({
    tituloCalificacion: "",
    aprobado: true,
    //usuarioId: "",
    //estudiantes: [],
    estadoCalificacion: true,
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [calificacionToDelete, setCalificacionToDelete] = useState(null);
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const [infoCalificacion, setInfoCalificacion] = useState(null);

  
  

  //constante con promise.all para que se ejecuten en paralelo los fetch de calificaciones, estudiantes y usuarios
  const fetchData = async () => {
    try {
      const [calificacionesData, estudiantesData, usuariosData] = await Promise.all([
        fetch("http://localhost:3000/api/calificaciones").then((res) => res.json()),
        //fetch("http://localhost:3000/api/estudiantes").then((res) => res.json()),
        //fetch("http://localhost:3000/api/usuarios").then((res) => res.json()),
      ]);
      setCalificaciones(calificacionesData);
      setEstudiantes(estudiantesData);
      setUsuarios(usuariosData);
    } catch (error) {
      handleError("Error al cargar los datos");
    } 
  };

  /*const fetchData = async () => {
    try {
      const results = await Promise.allSettled([
        fetch("http://localhost:3000/api/calificaciones"),
        fetch("http://localhost:3000/api/estudiantes"),
        fetch("http://localhost:3000/api/usuarios"),
      ]);
  
      // Función auxiliar para procesar las respuestas json
      const processResponse = async (result) => {
        if (result.status === "fulfilled" && result.value.ok) {
          try {
            return await result.value.json();
          } catch {
            console.warn("La respuesta no contiene un JSON válido.");
            return null; // Si no hay JSON válido, devolvemos null
          }
        }
        return null; // Si la solicitud falló o no es ok, devolvemos null
      };
  
      // Procesamos cada resultado
      const calificaciones = await processResponse(results[0]);
      const estudiantes = await processResponse(results[1]);
      const usuarios = await processResponse(results[2]);
  
      // Actualizamos los estados solo si los datos fueron obtenidos
      if (calificaciones) setCalificaciones(calificaciones);
      if (estudiantes) setEstudiantes(estudiantes);
      if (usuarios) setUsuarios(usuarios);
  
    } catch (error) {
      console.error("Error inesperado:", error);
      handleError("Error al cargar los datos");
    }
  };  
  */
  
  useEffect(() => {
    fetchData();
  }, []);
  
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
    /*
    if (!formValues.tituloEdicion || !formValues.fechaInicioEdicion || !formValues.fechaFinEdicion || !formValues.cursoId) {
      setErrorMessage("Todos los campos son obligatorios");
      setOpenSnackbar(true);
      return;
      }
    */
    try {
        const response = await fetch("http://localhost:3000/api/calificaciones", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formValues),
        });

        // Maneja la respuesta
        if (response.ok) {
            const nuevaCalificacion = await response.json();
            setCalificaciones([...calificaciones, nuevaCalificacion]);
            setFormValues({
              tituloCalificacion: "",
              aprobado: true,
              //usuarioId: "",
              //estudiantes: [],
              estadoCalificacion: true,
            });
            console.log('Calificación creada exitosamente:', nuevaCalificacion);
        } else {
            const errorData = await response.json();
            throw new Error(errorData.error || "Error al crear calificación");
        }
    } catch (error) {
        handleError("Error al crear calificación");
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
          //usuarioId: "",
          //estudiantes: [],
          estadoCalificacion: true,
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar calificación");
      }
    } catch (error) {
      handleError("Error al actualizar calificación");
    }
  };

  const handleDeleteCalificacion = async () => {
    if (!calificacionToDelete) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/calificaciones/${calificacionToDelete._id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setCalificaciones(calificaciones.filter((calificacion) => calificacion._id !== calificacionToDelete._id));
        handleCloseDeleteDialog(); // Cierra el modal de confirmación después de eliminar
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar calificación");
      }
    } catch (error) {
      handleError("Error al eliminar calificación");
    }
  };

  const handleEditClick = (calificacion) => {
    setSelectedCalificacion(calificacion);
    setFormValues({
      tituloCalificacion: calificacion.tituloCalificacion,
      aprobado: calificacion.aprobado,
      //usuarioId: calificacion.usuarioId,
      //estudiantes: edicion.estudiantes || [],
      estadoCalificacion: calificacion.estadoCalificacion,
    });
  };

  const handleDeleteClick = (calificacion) => {
    setCalificacionToDelete(calificacion);
    setOpenDeleteDialog(true);
  };

  const handleInfoClick = async (calificacion) => {
    const response = await fetch(`http://localhost:3000/api/calificaciones/${calificacion._id}`,);
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

        {/* 
        <FormControl fullWidth margin="normal">
          <InputLabel>Usuario</InputLabel>
          <Select
            name="usuarioId"
            value={formValues.usuarioId}
            onChange={handleInputChange}
            input={<OutlinedInput label="Usuario" />}
          >
            {usuarios.map((usuario) => (
              <MenuItem key={usuario._id} value={usuario._id}>
                {usuario.nombreUsuario}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        */}

        {/*
        <FormControl fullWidth margin="normal">
          <InputLabel>Estudiantes</InputLabel>
          <Select
            multiple
            value={formValues.estudiantes}
            onChange={handleEditionChange}
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
        */}

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
          {calificaciones.map((calificacion) => (
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

      <Dialog open={openInfoDialog} onClose={handleCloseInfoDialog}>
      <DialogTitle>Información de la Calificación</DialogTitle>
        <DialogContent>
          <Typography>Título: {infoCalificacion?.tituloCalificacion || "Título no disponible"}</Typography>
          <Typography>Aprobado: {infoCalificacion?.aprobado  ? "Si" : "No"}</Typography>
          <Typography>Usuario: {infoCalificacion?.usuario?.nombreUsuario || "Usuario no encontrado"}</Typography>
          <Typography>Estado: {infoCalificacion?.estadoCalificacion ? "Activa" : "Inactiva"}</Typography>
          <Typography> 
            calificaciones: {infoCalificacion?.estudiantes?.map((ca) => es.estudiantes).join(", ") || "Sin estudiantes"} 
          </Typography>
           
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseInfoDialog} color="primary">Cerrar</Button>
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
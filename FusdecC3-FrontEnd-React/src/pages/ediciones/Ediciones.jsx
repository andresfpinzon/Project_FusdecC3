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

const Ediciones = () => {
  const [ediciones, setEdiciones] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [selectedEdicion, setSelectedEdicion] = useState(null);
  const [formValues, setFormValues] = useState({
    tituloEdicion: "",
    fechaInicioEdicion: "",
    fechaFinEdicion: "",
    estadoEdicion: true,
    //cursoId: "",
    //horarios: [],
    //estudiantes: [],
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [edicionToDelete, setEdicionToDelete] = useState(null);
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const [infoEdicion, setInfoEdicion] = useState(null);

  
  

  //constante con promise.all para que se ejecuten en paralelo los fetch de ediciones, cursos, horarios y estudiantes
  const fetchData = async () => {
    try {
      const [edicionesData, cursosData, horariosData, estudiantesData] = await Promise.all([
        fetch("http://localhost:3000/api/ediciones").then((res) => res.json()),
        //fetch("http://localhost:3000/api/cursos").then((res) => res.json()),
        fetch("http://localhost:3000/api/horarios").then((res) => res.json()),
        //fetch("http://localhost:3000/api/estudiantes").then((res) => res.json()),
      ]);
      setEdiciones(edicionesData);
      setCursos(cursosData);
      setHorarios(horariosData);
      setEstudiantes(estudiantesData);
    } catch (error) {
      handleError("Error al cargar los datos");
    } 
  };
  
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

  const handleCreateEdicion = async () => {
    /*
    if (!formValues.tituloEdicion || !formValues.fechaInicioEdicion || !formValues.fechaFinEdicion || !formValues.cursoId) {
      setErrorMessage("Todos los campos son obligatorios");
      setOpenSnackbar(true);
      return;
      }
    */
    try {
        const response = await fetch("http://localhost:3000/api/ediciones", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formValues),
        });

        // Maneja la respuesta
        if (response.ok) {
            const nuevaEdicion = await response.json();
            setEdiciones([...ediciones, nuevaEdicion]);
            setFormValues({
              tituloEdicion: "",
              fechaInicioEdicion: "",
              fechaFinEdicion: "",
              estadoEdicion: true,
              //cursoId: "",
              //horarios: [],
              //estudiantes: [],
            });
            console.log('Edicion creada exitosamente:', nuevaEdicion);
        } else {
            const errorData = await response.json();
            throw new Error(errorData.error || "Error al crear edicion");
        }
    } catch (error) {
        handleError("Error al crear edicion");
    }
};

  const handleUpdateEdicion = async () => {
    if (!selectedEdicion) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/ediciones/${selectedEdicion._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formValues),
        }
      );

      if (response.ok) {
        const edicionActualizada = await response.json();
        setEdiciones(
          ediciones.map((edicion) =>
            edicion._id === selectedEdicion._id ? edicionActualizada : edicion
          )
        );
        setSelectedEdicion(null);
        setFormValues({
          tituloEdicion: "",
          fechaInicioEdicion: "",
          fechaFinEdicion: "",
          estadoEdicion: true,
          //cursoId: "",
          //horarios: [],
          //estudiantes: [],
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar edicion");
      }
    } catch (error) {
      handleError("Error al actualizar edicion");
    }
  };

  const handleDeleteEdicion = async () => {
    if (!edicionToDelete) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/ediciones/${edicionToDelete._id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setEdiciones(ediciones.filter((edicion) => edicion._id !== edicionToDelete._id));
        handleCloseDeleteDialog(); // Cierra el modal de confirmación después de eliminar
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar edicion");
      }
    } catch (error) {
      handleError("Error al eliminar edicion");
    }
  };

  const handleEditClick = (edicion) => {
    setSelectedEdicion(edicion);
    setFormValues({
      tituloEdicion: edicion.tituloEdicion,
      fechaInicioEdicion: edicion.fechaInicioEdicion,
      fechaFinEdicion: edicion.fechaFinEdicion,
      estadoEdicion: edicion.estadoEdicion,
      //cursoId: edicion.cursoId || "",
      //horarios: edicion.horarios || [],
      //estudiantes: edicion.estudiantes || [],
    });
  };

  const handleDeleteClick = (edicion) => {
    setEdicionToDelete(edicion);
    setOpenDeleteDialog(true);
  };

  const handleInfoClick = async (edicion) => {
    const response = await fetch(`http://localhost:3000/api/ediciones/${edicion._id}`,);
    const data = await response.json();
    setInfoEdicion(data);
    setOpenInfoDialog(true);
  };

  const handleCloseInfoDialog = () => {
    setOpenInfoDialog(false);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setEdicionToDelete(null);
  };

  return (
    <Container>
      <h1>Gestión de Ediciones:</h1>
      <form noValidate autoComplete="off">
        <TextField
          label="Título de la Edición"
          name="tituloEdicion"
          value={formValues.tituloEdicion}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Fecha de inicio"
          type="date"
          name="fechaInicioEdicion"
          value={formValues.fechaInicioEdicion}
          onChange={handleInputChange}
          sx={{ "& .MuiInputLabel-root": { transform: "translateY(2px)", shrink: true } }}
        />
        <br /><br />
        <TextField
          label="Fecha de Fin"
          type="date"
          name="fechaFinEdicion"
          value={formValues.fechaFinEdicion}
          onChange={handleInputChange}
          sx={{ "& .MuiInputLabel-root": { transform: "translateY(2px)", shrink: true } }}
        />

        {/* 
        <FormControl fullWidth margin="normal">
          <InputLabel>Curso</InputLabel>
          <Select
            name="cursoId"
            value={formValues.cursoId}
            onChange={handleInputChange}
            input={<OutlinedInput label="Curso" />}
          >
            {cursos.map((curso) => (
              <MenuItem key={curso._id} value={curso._id}>
                {curso.nombreCurso}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        */}

        <Box marginTop={2} marginBottom={2}>
          <Switch
            checked={formValues.estadoEdicion}
            onChange={handleSwitchChange}
            name="estadoEdicion"
            color="primary"
          />
          Estado Activo
        </Box>
        
        <Box marginTop={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={selectedEdicion ? handleUpdateEdicion : handleCreateEdicion}
          >
            {selectedEdicion? "Actualizar Edicion" : "Crear Edicion"}
          </Button>
        </Box>
      </form>
      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
            <TableCell>Título</TableCell>
              <TableCell>Fecha Inicio</TableCell>
              <TableCell>Fecha Fin</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {ediciones.map((edicion) => (
              <TableRow key={edicion._id}>
                <TableCell>{edicion.tituloEdicion}</TableCell>
                <TableCell>{edicion.fechaInicioEdicion}</TableCell>
                <TableCell>{edicion.fechaFinEdicion}</TableCell>
                <TableCell>
                  {edicion.estadoEdicion ? "Activa" : "Inactiva"}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditClick(edicion)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleInfoClick(edicion)} color="primary">
                    <Info />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteClick(edicion)}
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
        <DialogTitle>Eliminar Edición</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro de que deseas eliminar a {edicionToDelete?.tituloEdicion}?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">Cancelar</Button>
          <Button onClick={handleDeleteEdicion} color="secondary">Eliminar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openInfoDialog} onClose={handleCloseInfoDialog}>
      <DialogTitle>Información de la Edición</DialogTitle>
        <DialogContent>
          <Typography>Título: {infoEdicion?.tituloEdicion || "Título no disponible"}</Typography>
          <Typography>Fecha de Inicio: {infoEdicion?.fechaInicioEdicion || "Fecha no disponible"}</Typography>
          <Typography>Fecha de Finalización: {infoEdicion?.fechaFinEdicion || "Fecha no disponible"}</Typography>
          <Typography>Estado: {infoEdicion?.estadoEdicion ? "Activa" : "Inactiva"}</Typography>
          <Typography>Curso: {infoEdicion?.curso?.nombreCurso || "Curso no encontrado"}</Typography>
          <Typography> 
            calificaciones: {infoEdicion?.estudiantes?.map((ca) => es.estudiantes).join(", ") || "Sin estudiantes"} 
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

export default Ediciones;
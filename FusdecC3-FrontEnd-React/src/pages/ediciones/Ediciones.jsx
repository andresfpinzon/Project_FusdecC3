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
  Checkbox,
  ListItemText
} from "@mui/material";

import { Edit, Delete, Info, School, DateRange, EventAvailable, ToggleOn, Class, Grade } from "@mui/icons-material";

const token = localStorage.getItem("token");

const Ediciones = () => {
  const [ediciones, setEdiciones] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [selectedEdicion, setSelectedEdicion] = useState(null);
  const [formValues, setFormValues] = useState({
    tituloEdicion: "",
    fechaInicioEdicion: "",
    fechaFinEdicion: "",
    estadoEdicion: true,
    cursoId: "",
    horarios: [],
    estudiantes: [],
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [edicionToDelete, setEdicionToDelete] = useState(null);
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const [infoEdicion, setInfoEdicion] = useState(null);

  const fetchEdiciones = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/ediciones",{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token 
        }
    });
      if (!response.ok) throw new Error("Error al obtener ediciones");
      const data = await response.json();
      setEdiciones(data);
    } catch (error) {
      console.error("Error al obtener ediciones:", error);
      setErrorMessage("Error al obtener ediciones");
      setOpenSnackbar(true);
    }
  };

  const fetchCursos = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/cursos",{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token 
        }
    });
      if (!response.ok) throw new Error("Error al obtener cursos");
      const data = await response.json();
      setCursos(data);
    } catch (error) {
      console.error("Error al obtener cursos:", error);
      setErrorMessage("Error al obtener cursos");
      setOpenSnackbar(true);
    }
  };

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
      setHorarios(data);
    } catch (error) {
      console.error("Error al obtener horarios:", error);
      setErrorMessage("Error al obtener horarios");
      setOpenSnackbar(true);
    }
  };

  useEffect(() => {
    fetchEdiciones();
    fetchCursos();
    fetchHorarios();
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

  const handleHorarioChange = (e) => {
    const { target: { value } } = e;
    setFormValues({
      ...formValues,
      horarios: typeof value === "string" ? value.split(",") : value,
    });
  };

  const handleCreateEdicion = async () => {
    try {
        const response = await fetch("http://localhost:3000/api/ediciones", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token 
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
              cursoId: "",
              horarios: [],
              estudiantes: [],
            });
            console.log('Edicion creada exitosamente:', nuevaEdicion);
        } else {
            const errorData = await response.json();
            throw new Error(errorData.error || "Error al crear edicion");
        }
    } catch (error) {
        handleError("Error al crear edicion", error);
        setErrorMessage(error.message);
        setOpenSnackbar(true);
    }
};

const handleUpdateEdicion = async () => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/ediciones/${selectedEdicion._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token 
        },
        
        body: JSON.stringify(formValues),
      }
      
    );
    console.log(formValues);

    if (response.ok) {
      const updatedEdicion = await response.json();
      const updatedEdiciones = ediciones.map((edicion) =>
        edicion._id === updatedEdicion._id ? updatedEdicion : edicion
      );
      setEdiciones(updatedEdiciones);
      setSelectedEdicion(null);
      setFormValues({
        tituloEdicion: "",
        fechaInicioEdicion: "",
        fechaFinEdicion: "",
        estadoEdicion: true,
        cursoId: "",
        horarios: [],
        estudiantes: [],
      });
    } else {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al actualizar edición");
    }
  } catch (error) {
    console.error("Error al actualizar edición:", error);
    setErrorMessage(error.message);
    setOpenSnackbar(true);
  }
};


  const handleDeleteEdicion = async () => {
    if (!edicionToDelete) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/ediciones/${edicionToDelete._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token 
        }
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
      handleError("Error al eliminar edicion", error);
    }
  };

  const handleEditClick = (edicion) => {
    setSelectedEdicion(edicion);
    setFormValues({
      tituloEdicion: edicion.tituloEdicion,
      fechaInicioEdicion: edicion.fechaInicioEdicion,
      fechaFinEdicion: edicion.fechaFinEdicion,
      estadoEdicion: edicion.estadoEdicion,
      cursoId: edicion.cursoId?._id || "",
      horarios: edicion.horarios.map((horario) => horario._id),
    });
  };

  const handleDeleteClick = (edicion) => {
    setEdicionToDelete(edicion);
    setOpenDeleteDialog(true);
  };

  const handleInfoClick = async (edicion) => {
    const response = await fetch(`http://localhost:3000/api/ediciones/${edicion._id}`,{
      method: "GET",
      headers: {
          "Content-Type": "application/json",
          "Authorization": token 
      }
  });
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

        <FormControl fullWidth margin="normal">
          <InputLabel>Horarios</InputLabel>
          <Select
            multiple
            value={formValues.horarios}
            onChange={handleHorarioChange}
            input={<OutlinedInput label="Horarios" />}
            renderValue={(selected) =>
              horarios
                .filter((hor) => selected.includes(hor._id))
                .map((ho) => ho.tituloHorario)
                .join(", ")
            }
          >
            {horarios.map((hor) => (
              <MenuItem key={hor._id} value={hor._id}>
                <Checkbox checked={formValues.horarios.indexOf(hor._id) > -1} />
                <ListItemText primary={hor.tituloHorario} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

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

      <Dialog open={openInfoDialog} onClose={handleCloseInfoDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: '#1d526eff', color: '#fff', textAlign: 'center' }}>
          Información de la Edición
        </DialogTitle>
        <DialogContent dividers sx={{ padding: '20px' }}>
          {infoEdicion && (
            <div>
              {/* Título */}
              <Box display="flex" alignItems="center" mb={2}>
                <Class color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Título:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>{infoEdicion.tituloEdicion || "Título no disponible"}</Typography>
              </Box>
              
              {/* Fecha de Inicio */}
              <Box display="flex" alignItems="center" mb={2}>
                <DateRange color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Fecha de Inicio:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>{infoEdicion.fechaInicioEdicion || "Fecha no disponible"}</Typography>
              </Box>
              
              {/* Fecha de Finalización */}
              <Box display="flex" alignItems="center" mb={2}>
                <EventAvailable color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Fecha de Finalización:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>{infoEdicion.fechaFinEdicion || "Fecha no disponible"}</Typography>
              </Box>
              
              {/* Estado */}
              <Box display="flex" alignItems="center" mb={2}>
                <ToggleOn color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Estado:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>{infoEdicion.estadoEdicion ? "Activa" : "Inactiva"}</Typography>
              </Box>
              
              {/* Curso */}
              <Box display="flex" alignItems="center" mb={2}>
                <School color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Curso:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>{infoEdicion.cursoId?.nombreCurso || "Curso no encontrado"}</Typography>
              </Box>

              {/* Horarios */}
              <Box display="flex" alignItems="center" mb={2}>
                <Grade color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Horarios:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>
                  {infoEdicion.horarios?.map((horario) => horario.tituloHorario).join(", ") || "Sin horarios"}
                </Typography>
              </Box>
              
              {/* Estudiantes */}
              <Box display="flex" alignItems="center" mb={2}>
                <Grade color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Estudiantes:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>
                  {infoEdicion.estudiantes?.map((estudiante) => estudiante.nombreEstudiante).join(", ") || "Sin estudiantes"}
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

export default Ediciones;
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
  Checkbox,
  ListItemText,
  OutlinedInput,
  Autocomplete,
} from "@mui/material";
import { Edit, Delete, Info } from "@mui/icons-material";

const token = localStorage.getItem("token");

const Unidades = () => {
  const [unidades, setUnidades] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [brigadas, setBrigadas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [formValues, setFormValues] = useState({
    nombreUnidad: "",
    estadoUnidad: true,
    brigadaId: "",
    usuarioId: "",
    estudiantes: [],
  });
  const [selectedUnidad, setSelectedUnidad] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [unidadToDelete, setUnidadToDelete] = useState(null);
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const [infoUnidad, setInfoUnidad] = useState(null);

  useEffect(() => {
    fetchUnidades();
    fetchEstudiantes();
    fetchBrigadas();
    fetchUsuarios();
  }, []);

  const fetchUnidades = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/unidades",{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token 
        }
    });
      if (!response.ok) throw new Error("Error al obtener unidades");
      const data = await response.json();
      setUnidades(data);
    } catch (error) {
      console.error("Error al obtener unidades:", error);
      setErrorMessage("Error al obtener unidades");
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
      setEstudiantes(data);
    } catch (error) {
      console.error("Error al obtener estudiantes:", error);
      setErrorMessage("Error al obtener estudiantes");
      setOpenSnackbar(true);
    }
  };

  const fetchBrigadas = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/brigadas",{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token 
        }
    });
      if (!response.ok) throw new Error("Error al obtener brigadas");
      const data = await response.json();
      setBrigadas(data);
    } catch (error) {
      console.error("Error al obtener brigadas:", error);
      setErrorMessage("Error al obtener brigadas");
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
      setUsuarios(data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      setErrorMessage("Error al obtener usuarios");
      setOpenSnackbar(true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value, // Esto debe actualizar correctamente el estado
    });
  };

  const handleSwitchChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.checked,
    });
  };

  const handleStudentChange = (e) => {
    const {
      target: { value },
    } = e;
    setFormValues({
      ...formValues,
      estudiantes: typeof value === "string" ? value.split(",") : value,
    });
  };

  const handleCreateUnidad = async () => {
    console.log("Valores del formulario antes de enviar:", formValues); // Agrega esta línea
    try {
      if (!formValues.brigadaId) {
        setErrorMessage("El campo Brigada es obligatorio.");
        setOpenSnackbar(true);
        return; // Detiene la ejecución si brigadaId está vacío
      }
      const response = await fetch("http://localhost:3000/api/unidades", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token 
        },
        body: JSON.stringify(formValues),
      });

      if (response.ok) {
        const nuevaUnidad = await response.json();
        setUnidades([...unidades, nuevaUnidad]);
        setFormValues({
          nombreUnidad: "",
          estadoUnidad: true,
          brigadaId: "", // Asegúrate de que esto se reinicie correctamente
          usuarioId: "",
          estudiantes: [],
        });
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
            "Authorization": token 
          },
          body: JSON.stringify(formValues),
        }
      );

      if (response.ok) {
        const unidadActualizada = await response.json();
        const updatedUnidades = unidades.map((unidad) =>
          unidad._id === unidadActualizada._id ? unidadActualizada : unidad
        );
        setUnidades(updatedUnidades);
        setSelectedUnidad(null);
        setFormValues({
          nombreUnidad: "",
          estadoUnidad: true,
          brigadaId: "",
          usuarioId: "",
          estudiantes: [],
        });
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
    if (!unidadToDelete) return;
    try {
      const response = await fetch(
        `http://localhost:3000/api/unidades/${unidadToDelete._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token 
        }
        }
      );
      if (response.ok) {
        setUnidades(unidades.filter((unidad) => unidad._id !== unidadToDelete._id));
        handleCloseDeleteDialog();
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
      nombreUnidad: unidad.nombreUnidad,
      estadoUnidad: unidad.estadoUnidad,
      brigadaId: unidad.brigadaId?._id || "",
      usuarioId: unidad.usuarioId?._id || "",
      estudiantes: unidad.estudiantes.map((estudiante) => estudiante._id),
    });
  };

  const handleDeleteClick = (unidad) => {
    setUnidadToDelete(unidad);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setUnidadToDelete(null);
  };

  const handleInfoClick = async (unidad) => {
    const response = await fetch(`http://localhost:3000/api/unidades/${unidad._id}`,{
      method: "GET",
      headers: {
          "Content-Type": "application/json",
          "Authorization": token 
      }
  });
    const data = await response.json();
    setInfoUnidad(data);
    setOpenInfoDialog(true);
  };

  const handleCloseInfoDialog = () => {
    setOpenInfoDialog(false);
    setInfoUnidad(null);
  };

  return (
    <Container>
      <h1>Gestión de Unidades:</h1>
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
        <FormControl fullWidth margin="normal">
          <InputLabel id="brigada-select-label">Brigada</InputLabel>
          <Select
            labelId="brigada-select-label"
            name="brigadaId" // Asegúrate de que el nombre coincida
            value={formValues.brigadaId} // Debe estar vinculado a formValues.brigadaId
            onChange={handleInputChange}
            input={<OutlinedInput label="Brigada" />}
          >
            {brigadas.map((brigada) => (
              <MenuItem key={brigada._id} value={brigada._id}>
                {brigada.nombreBrigada} {/* Asegúrate de que 'nombreBrigada' es la propiedad correcta */}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
        <FormControl fullWidth margin="normal">
          <Autocomplete
            multiple
            options={estudiantes}
            getOptionLabel={(option) => `${option.nombreEstudiante} ${option.apellidoEstudiante}`}
            value={formValues.estudiantes.map((id) => estudiantes.find(est => est._id === id))}
            onChange={(event, newValue) => {
              setFormValues({
                ...formValues,
                estudiantes: newValue.map((est) => est._id),
              });
            }}
            renderInput={(params) => (
              <TextField 
                {...params} 
                label="Estudiantes" 
                placeholder="Selecciona estudiantes" 
              />
            )}
            renderOption={(props, option) => (
              <li {...props}>
                {option.nombreEstudiante} {option.apellidoEstudiante} - {option.tipoDocumento}: {option.numeroDocumento}
              </li>
            )}
          />
        </FormControl>
        <Box marginTop={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={selectedUnidad ? handleUpdateUnidad : handleCreateUnidad}
          >
            {selectedUnidad ? "Actualizar Unidad" : "Crear Unidad"}
          </Button>
        </Box>
      </form>

      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre de la Unidad</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Brigada</TableCell>
              <TableCell>Usuario</TableCell>
              <TableCell>Estudiantes</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {unidades.map((unidad) => (
              <TableRow key={unidad._id}>
                <TableCell>{unidad.nombreUnidad}</TableCell>
                <TableCell>{unidad.estadoUnidad ? "Activo" : "Inactivo"}</TableCell>
                <TableCell>
                  {unidad.brigadaId?.nombreBrigada || "Brigada no encontrada"}
                </TableCell>
                <TableCell>
                  {unidad.usuarioId?.nombreUsuario || "Usuario no encontrado"}
                </TableCell>
                <TableCell>
                  {unidad.estudiantes.length > 0
                    ? unidad.estudiantes.map(est => (
                        <div key={est._id}>
                          {est.nombreEstudiante} {est.apellidoEstudiante} - {est.tipoDocumento}: {est.numeroDocumento}
                        </div>
                      )).reduce((prev, curr) => [prev, ', ', curr])
                    : "Sin estudiantes"}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditClick(unidad)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteClick(unidad)} color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Eliminar Unidad</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro de que deseas eliminar la unidad {unidadToDelete?.nombreUnidad}?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">Cancelar</Button>
          <Button onClick={handleDeleteUnidad} color="secondary">Eliminar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openInfoDialog} onClose={handleCloseInfoDialog}>
        <DialogTitle>Información de la Unidad</DialogTitle>
        <DialogContent>
          <Typography>Nombre: {infoUnidad?.nombreUnidad}</Typography>
          <Typography>Estado: {infoUnidad?.estadoUnidad ? "Activo" : "Inactivo"}</Typography>
          <Typography>Brigada: {infoUnidad?.brigadaId?.nombre || "Brigada no encontrada"}</Typography>
          <Typography>Usuario: {infoUnidad?.usuarioId?.nombre || "Usuario no encontrado"}</Typography>
          
          {/* Aquí se muestra la información del estudiante */}
          <Typography>Estudiantes:</Typography>
          {infoUnidad?.estudiantes?.map((estudiante) => (
            <div key={estudiante._id}>
              <Typography>
                Nombre: {estudiante.nombreEstudiante} {estudiante.apellidoEstudiante} {/* Mostrar nombre y apellido */}
              </Typography>
              <Typography>Tipo de Documento: {estudiante.tipoDocumento}</Typography> {/* Mostrar tipo de documento */}
              <Typography>Número de Documento: {estudiante.numeroDocumento}</Typography> {/* Mostrar número de documento */}
            </div>
          )) || <Typography>Sin estudiantes</Typography>}
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

export default Unidades;

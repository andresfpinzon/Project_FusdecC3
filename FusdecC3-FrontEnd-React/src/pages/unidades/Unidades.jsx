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
  Snackbar,
  Alert,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  OutlinedInput,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Checkbox,
  ListItemText,
  Card,
  CardContent,
  Tooltip,
  Switch,
  Box,
} from "@mui/material";
import { Edit, Delete, School, Group, Person, Info } from "@mui/icons-material";

const Unidades = () => {
  const [unidades, setUnidades] = useState([]);
  const [brigadas, setBrigadas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [formValues, setFormValues] = useState({
    nombreUnidad: "",
    estadoUnidad: true,
    brigadaId: "",
    usuarioId: "",
    estudiantes: [],
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [unidadToDelete, setUnidadToDelete] = useState(null);
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const [infoUnidad, setInfoUnidad] = useState(null);
  const [selectedUnidad, setSelectedUnidad] = useState(null);

  useEffect(() => {
    fetchUnidades();
    fetchBrigadas();
    fetchUsuarios();
    fetchEstudiantes();
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

  const fetchUsuarios = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/usuarios");
      if (!response.ok) throw new Error("Error al obtener usuarios");
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      setErrorMessage("Error al obtener usuarios");
      setOpenSnackbar(true);
    }
  };

  const fetchEstudiantes = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/estudiantes");
      if (!response.ok) throw new Error("Error al obtener estudiantes");
      const data = await response.json();
      setEstudiantes(data);
    } catch (error) {
      console.error("Error al obtener estudiantes:", error);
      setErrorMessage("Error al obtener estudiantes");
      setOpenSnackbar(true);
    }
  };

  const handleInputChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
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
        setFormValues({
          nombreUnidad: "",
          estadoUnidad: true,
          brigadaId: "",
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

  const handleDeleteUnidad = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/unidades/${unidadToDelete._id}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar unidad");
      }
      const updatedUnidades = unidades.filter(
        (unidad) => unidad._id !== unidadToDelete._id
      );
      setUnidades(updatedUnidades);
      setOpenDeleteDialog(false);
      setUnidadToDelete(null);
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
      estudiantes: unidad.estudiantes.map((est) => est._id),
    });
  };

  const handleInfoClick = async (unidad) => {
    const response = await fetch(`http://localhost:3000/api/unidades/${unidad._id}`);
    const data = await response.json();
    setInfoUnidad(data);
    setOpenInfoDialog(true);
  };

  const handleCloseInfoDialog = () => {
    setOpenInfoDialog(false);
    setInfoUnidad(null);
  };

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4, mb: 4 }}>
        Gestión de Unidades
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                {selectedUnidad ? "Editar Unidad" : "Crear Nueva Unidad"}
              </Typography>
              <form noValidate autoComplete="off">
                <TextField
                  label="Nombre de la Unidad"
                  name="nombreUnidad"
                  value={formValues.nombreUnidad}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                />
                <FormControl fullWidth margin="normal" variant="outlined">
                  <InputLabel>Brigada</InputLabel>
                  <Select
                    name="brigadaId"
                    value={formValues.brigadaId}
                    onChange={handleInputChange}
                    input={<OutlinedInput label="Brigada" />}
                    startAdornment={<Group sx={{ mr: 1 }} />}
                  >
                    {brigadas.map((brigada) => (
                      <MenuItem key={brigada._id} value={brigada._id}>
                        {brigada.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="normal" variant="outlined">
                  <InputLabel>Usuario</InputLabel>
                  <Select
                    name="usuarioId"
                    value={formValues.usuarioId}
                    onChange={handleInputChange}
                    input={<OutlinedInput label="Usuario" />}
                    startAdornment={<Person sx={{ mr: 1 }} />}
                  >
                    {usuarios.map((usuario) => (
                      <MenuItem key={usuario._id} value={usuario._id}>
                        {usuario.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="normal" variant="outlined">
                  <InputLabel>Estudiantes</InputLabel>
                  <Select
                    multiple
                    name="estudiantes"
                    value={formValues.estudiantes}
                    onChange={handleStudentChange}
                    input={<OutlinedInput label="Estudiantes" />}
                    renderValue={(selected) =>
                      `${selected.length} estudiante(s) seleccionado(s)`
                    }
                    startAdornment={<School sx={{ mr: 1 }} />}
                  >
                    {estudiantes.map((estudiante) => (
                      <MenuItem key={estudiante._id} value={estudiante._id}>
                        <Checkbox checked={formValues.estudiantes.indexOf(estudiante._id) > -1} />
                        <ListItemText primary={estudiante.nombre} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Box display="flex" alignItems="center" marginTop={2} marginBottom={2}>
                  <Switch
                    checked={formValues.estadoUnidad}
                    onChange={(e) => setFormValues({ ...formValues, estadoUnidad: e.target.checked })}
                    name="estadoUnidad"
                    color="primary"
                  />
                  <Typography>Estado Activo</Typography>
                </Box>
                <Box marginTop={3}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={selectedUnidad ? handleUpdateUnidad : handleCreateUnidad}
                    fullWidth
                  >
                    {selectedUnidad ? "Actualizar Unidad" : "Crear Unidad"}
                  </Button>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                Listado de Unidades
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Nombre</TableCell>
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
                        <TableCell>
                          <Tooltip title={unidad.estadoUnidad ? "Activo" : "Inactivo"}>
                            <Switch
                              checked={unidad.estadoUnidad}
                              size="small"
                              readOnly
                            />
                          </Tooltip>
                        </TableCell>
                        <TableCell>{unidad.brigadaId?.nombre || "No asignada"}</TableCell>
                        <TableCell>{unidad.usuarioId?.nombre || "No asignado"}</TableCell>
                        <TableCell>
                          {unidad.estudiantes.length} estudiante(s)
                        </TableCell>
                        <TableCell>
                          <Tooltip title="Editar">
                            <IconButton onClick={() => handleEditClick(unidad)} color="primary" size="small">
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Información">
                            <IconButton onClick={() => handleInfoClick(unidad)} color="info" size="small">
                              <Info />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Eliminar">
                            <IconButton onClick={() => {
                              setUnidadToDelete(unidad);
                              setOpenDeleteDialog(true);
                            }} color="error" size="small">
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Snackbar para mensajes de error */}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>

      {/* Diálogo de confirmación de eliminación */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Eliminar Unidad</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar la unidad {unidadToDelete?.nombreUnidad}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">Cancelar</Button>
          <Button onClick={handleDeleteUnidad} color="error">Eliminar</Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de información de la unidad */}
      <Dialog open={openInfoDialog} onClose={handleCloseInfoDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Información de la Unidad</DialogTitle>
        <DialogContent>
          <Typography><strong>Nombre:</strong> {infoUnidad?.nombreUnidad}</Typography>
          <Typography><strong>Estado:</strong> {infoUnidad?.estadoUnidad ? "Activo" : "Inactivo"}</Typography>
          <Typography><strong>Brigada:</strong> {infoUnidad?.brigadaId?.nombre || "No asignada"}</Typography>
          <Typography><strong>Usuario:</strong> {infoUnidad?.usuarioId?.nombre || "No asignado"}</Typography>
          <Typography><strong>Estudiantes:</strong></Typography>
          <ul>
            {infoUnidad?.estudiantes?.map((est) => (
              <li key={est._id}>{est.nombre}</li>
            )) || <li>Sin estudiantes</li>}
          </ul>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseInfoDialog} color="primary">Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Unidades;

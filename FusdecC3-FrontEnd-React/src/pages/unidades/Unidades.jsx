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
  TablePagination,
  Chip,
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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [successMessage, setSuccessMessage] = useState("");

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
      [name]: value,
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
    try {
      const response = await fetch("http://localhost:3000/api/unidades", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token 
        },
        body: JSON.stringify(formValues),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al crear unidad");
      }

      const nuevaUnidad = await response.json();
      setUnidades([...unidades, nuevaUnidad]);
      setFormValues({
        nombreUnidad: "",
        estadoUnidad: true,
        brigadaId: "", 
        usuarioId: "",
        estudiantes: [],
      });
      setSuccessMessage("Unidad guardada exitosamente!");
      setOpenSnackbar(true);
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
        setSuccessMessage("Unidad actualizada exitosamente!");
        setOpenSnackbar(true);
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
        setSuccessMessage("Unidad eliminada exitosamente!");
        setOpenSnackbar(true);
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

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const renderEstudiantes = (estudiantes) => {
    if (estudiantes.length === 0) {
      return "Sin estudiantes";
    }

    return estudiantes.map(est => (
      <div key={est._id}>
        {est.nombreEstudiante} {est.apellidoEstudiante} - {est.tipoDocumento}: {est.numeroDocumento}
      </div>
    ));
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
            name="brigadaId"
            value={formValues.brigadaId}
            onChange={handleInputChange}
          >
            {brigadas.map((brigada) => (
              <MenuItem key={brigada._id} value={brigada._id}>
                {brigada.nombreBrigada}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel id="usuario-select-label">Usuario</InputLabel>
          <Select
            labelId="usuario-select-label"
            name="usuarioId"
            value={formValues.usuarioId}
            onChange={handleInputChange}
          >
            {usuarios.map((usuario) => (
              <MenuItem key={usuario._id} value={usuario._id}>
                {usuario.nombreUsuario} {usuario.apellidoUsuario}
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
            onChange={(_, newValue) => {
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
            {unidades.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((unidad) => (
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
                  {renderEstudiantes(unidad.estudiantes)}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditClick(unidad)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteClick(unidad)} color="error">
                    <Delete />
                  </IconButton>
                  <IconButton onClick={() => handleInfoClick(unidad)} color="primary">
                    <Info />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={unidades.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />
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

      <Dialog open={openInfoDialog} onClose={handleCloseInfoDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: '#1d526eff', color: '#fff', textAlign: 'center' }}>
          Información de la Unidad
        </DialogTitle>
        <DialogContent sx={{ padding: '20px' }}>
          {infoUnidad && (
            <div>
              <Box display="flex" alignItems="center" mb={2}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Nombre:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>{infoUnidad.nombreUnidad || "N/A"}</Typography>
              </Box>
              
              <Box display="flex" alignItems="center" mb={2}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Estado:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>
                  {infoUnidad.estadoUnidad ? "Activo" : "Inactivo"}
                </Typography>
              </Box>
              
              <Box display="flex" alignItems="center" mb={2}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Brigada:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>
                  {infoUnidad.brigadaId?.nombreBrigada || "Brigada no encontrada"}
                </Typography>
              </Box>
              
              <Box display="flex" alignItems="center" mb={2}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Usuario:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>
                  {infoUnidad.usuarioId?.nombreUsuario || "Usuario no encontrado"}
                </Typography>
              </Box>
              
              <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', mt: 2, mb: 1 }}>
                Estudiantes Asignados
              </Typography>
              {infoUnidad.estudiantes && infoUnidad.estudiantes.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-start' }}>
                  {infoUnidad.estudiantes.map((estudiante) => (
                    <Chip
                      key={estudiante._id}
                      label={`${estudiante.nombreEstudiante} ${estudiante.apellidoEstudiante}`}
                      color="primary"
                      variant="outlined"
                      size="small"
                      sx={{ 
                        borderRadius: '16px',
                        fontSize: '1rem',
                        maxWidth: '200px',
                        width: '100%',
                        color: 'black',
                        '&:hover': {
                          backgroundColor: 'rgba(25, 118, 210, 0.04)',
                        },
                      }}
                    />
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  Sin estudiantes asignados
                </Typography>
              )}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseInfoDialog} variant="contained" color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Unidades;

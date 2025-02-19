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
import { Edit, Delete, Info, Description, Comment, AssignmentTurnedIn, People } from "@mui/icons-material";

const token = localStorage.getItem("token");

const Inasistencias = () => {
  const [asistencias, setAsistencias] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [inasistencias, setInasistencias] = useState([]);
  const [selectedInasistencia, setSelectedInasistencia] = useState(null);
  const [formValues, setFormValues] = useState({
    tituloInasistencia: "",
    observacion: "",
    usuarioId: "",
    asistenciaId: "",
    estadoInasistencia: true,
    estudiantes: [],
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [inasistenciaToDelete, setInasistenciaToDelete] = useState(null);
  const [openInfoDialog, setOpenInfoDialog] = useState(false);

  // Paginación y búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchAsistencias();
    fetchEstudiantes();
    fetchInasistencias();

    if (token) {
      const decodedToken = jwtDecode(token);
      setFormValues((prevFormValues) => ({
        ...prevFormValues,
        usuarioId: decodedToken.id, 
      }));
    }
  }, []);

  const fetchAsistencias = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/asistencias",{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token 
        }
    });
      if (!response.ok) throw new Error("Error al obtener asistencias");
      const data = await response.json();

      // Condicion que verifica si el arreglo de asistencias está vacío
      if (data.length === 0) {
        setErrorMessage("No hay asistencias registradas.");
        setOpenSnackbar(true);
        setAsistencias([]); // esto mantiene el estado vacío para evitar errores
      } else {
        setAsistencias(data);
      }
    } catch (error) {
      setErrorMessage("Error al obtener asistencias", error);
      setOpenSnackbar(true);
    }
  };

  const fetchInasistencias = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/inasistencias",{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token 
        }
    });
      if (!response.ok) throw new Error("Error al obtener inasistencias");
      const data = await response.json();

      // Condicion que verifica si el arreglo de inasistencias está vacío
      if (data.length === 0) {
        setErrorMessage("No hay inasistencias registradas.");
        setOpenSnackbar(true);
        setInasistencias([]); // esto mantiene el estado vacío para evitar errores
      } else {
        setInasistencias(data);
      }
    } catch (error) {
      setErrorMessage("Error al obtener inasistencias", error);
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
        setErrorMessage("No hay estudiantes registrados.");
        setOpenSnackbar(true);
        setEstudiantes([]); // esto mantiene el estado vacío para evitar errores
      } else {
        setEstudiantes(data);
      }
    } catch (error) {
      setErrorMessage("Error al obtener estudiantes", error);
      setOpenSnackbar(true);
    }
  };

  // Filtrar inasistencias según el término de búsqueda
  const filteredInasistencias = inasistencias.filter((inasistencia) =>
    (inasistencia.tituloInasistencia?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (inasistencia.asistenciaId?.tituloAsistencia?.toLowerCase() || "").includes(searchTerm.toLowerCase())
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

  const handleEstudianteChange = (e) => {
    const { target: { value } } = e;
    setFormValues({
      ...formValues,
      estudiantes: typeof value === "string" ? value.split(",") : value,
    });
  };

  const handleCreateInasistencia = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/inasistencias", {
        method: "POST",
        headers: { "Content-Type": "application/json",
          "Authorization": token 
         },
        body: JSON.stringify(formValues),
      });

      if (response.ok) {
        await fetchInasistencias();

        // Muestra un mensaje de éxito
        setSuccessMessage("Inasistencia creada exitosamente.");
        setOpenSnackbar(true);

        setFormValues({
          tituloInasistencia: "",
          observacion: "",
          usuarioId: formValues.usuarioId,
          asistenciaId: "",
          estadoInasistencia: true,
          estudiantes: [],
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al crear inasistencia");
      }
    } catch (error) {
      setErrorMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  const handleUpdateInasistencia = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/inasistencias/${selectedInasistencia._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json",
          "Authorization": token 
         },
        body: JSON.stringify(formValues),
      });

      if (response.ok) {
        await fetchInasistencias();
        const updatedInasistencia = await response.json();
        const updatedInasistencias = inasistencias.map((inasistencia) =>
          inasistencia._id === updatedInasistencia._id ? updatedInasistencia : inasistencia
        );
        setAsistencias(updatedInasistencias);
        setSelectedInasistencia(null);
        setFormValues({
          tituloInasistencia: "",
          observacion: "",
          usuarioId: "",
          asistenciaId: "",
          estadoInasistencia: true,
          estudiantes: [],
        });

        // Mostrar mensaje de éxito
        setSuccessMessage("La inasistencia se actualizó correctamente");
        setOpenSnackbar(true); 

      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar Inasistencia");
      }
    } catch (error) {
      setErrorMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  const handleDeleteInasistencia = async () => {
    if (!inasistenciaToDelete) return;
    try {
      const response = await fetch(`http://localhost:3000/api/inasistencias/${inasistenciaToDelete._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token 
      }
      });
      if (response.ok) {
        setAsistencias(asistencias.filter((inasistencia) => inasistencia._id !== inasistenciaToDelete._id));
        handleCloseDeleteDialog();

        // Mostrar mensaje de éxito
        setSuccessMessage("La asistencia se eliminó correctamente");
        setOpenSnackbar(true);
        
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar asistencia");
      }
    } catch (error) {
      setErrorMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  const handleEditClick = (inasistencia) => {
    setSelectedInasistencia(inasistencia);
    setFormValues({
      tituloInasistencia: inasistencia.tituloInasistencia,
      observacion: inasistencia.observacion,
      usuarioId: inasistencia.usuarioId,
      asistenciaId: inasistencia.asistenciaId?._id || "",
      estadoInasistencia: inasistencia.estadoInasistencia,
      estudiantes: inasistencia.estudiantes.map((estudiante) => estudiante._id),
    });
  };

  const handleInfoClick = (inasistencia) => {
    setSelectedInasistencia(inasistencia);
    setOpenInfoDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setInasistenciaToDelete(null);
  };

  const handleCloseInfoDialog = () => {
    setOpenInfoDialog(false);
  };

  return (
    <Container>
      <h1>Gestión de Inasistencias</h1>
      <form noValidate autoComplete="off">
        <TextField
          label="Título de Inasistencia"
          name="tituloInasistencia"
          value={formValues.tituloInasistencia}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Observacion"
          name="observacion"
          value={formValues.observacion}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Asistencia</InputLabel>
          <Select
            name="asistenciaId"
            value={formValues.asistenciaId}
            onChange={handleInputChange}
            input={<OutlinedInput label="Asistencia" />}
          >
            {asistencias.map((asistencia) => (
              <MenuItem key={asistencia._id} value={asistencia._id}>
                {asistencia.tituloAsistencia}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Estudiantes</InputLabel>
          <Select
            multiple
            value={formValues.estudiantes}
            onChange={handleEstudianteChange}
            input={<OutlinedInput label="Estudiantes" />}
            renderValue={(selected) =>
              estudiantes
                .filter((est) => selected.includes(est._id))
                .map((est) => est.nombreEstudiante)
                .join(", ")
            }
          >
            {estudiantes.map((est) => (
              <MenuItem key={est._id} value={est._id}>
                <Checkbox checked={formValues.estudiantes.indexOf(est._id) > -1} />
                <ListItemText primary={est.nombreEstudiante} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box marginTop={2} marginBottom={2}>
          <Switch
            checked={formValues.estadoInasistencia}
            onChange={handleSwitchChange}
            name="estadoInasistencia"
            color="primary"
          />
          Estado Activo
        </Box>
        <Box marginTop={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={selectedInasistencia ? handleUpdateInasistencia : handleCreateInasistencia}
          >
            {selectedInasistencia ? "Actualizar Inasistencia" : "Crear Inasistencia"}
          </Button>
        </Box>
      </form>
      <br></br>
      {/* Busqueda */}
      <TextField
        label="Buscar usuarios"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* cuerpo */}
      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Título</TableCell>
              <TableCell>asistencia</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {filteredInasistencias
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((inasistencia) => (
              <TableRow key={inasistencia._id}>
                <TableCell>{inasistencia.tituloInasistencia}</TableCell>
                <TableCell>{inasistencia.asistenciaId?.tituloAsistencia || "Asistencia no encontrada"}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditClick(inasistencia)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleInfoClick(inasistencia)} color="primary">
                    <Info />
                  </IconButton>
                  <IconButton onClick={() => setOpenDeleteDialog(true) & setInasistenciaToDelete(inasistencia)} color="error">
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
          count={filteredInasistencias.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      <Dialog open={openInfoDialog} onClose={handleCloseInfoDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: '#1d526eff', color: '#fff', textAlign: 'center' }}>
          Detalles de la Inasistencia
        </DialogTitle>
        <DialogContent dividers sx={{ padding: '20px' }}>
          {selectedInasistencia && (
            <div>
              {/* Título de la Inasistencia */}
              <Box display="flex" alignItems="center" mb={2}>
                <Description color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Título:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>{selectedInasistencia.tituloInasistencia || "Título no disponible"}</Typography>
              </Box>
              
              {/* Observación */}
              <Box display="flex" alignItems="center" mb={2}>
                <Comment color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Observación:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>{selectedInasistencia.observacion || "Sin observaciones"}</Typography>
              </Box>
              
              {/* Asistencia */}
              <Box display="flex" alignItems="center" mb={2}>
                <AssignmentTurnedIn color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Asistencia:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>
                  {selectedInasistencia.asistenciaId?.tituloAsistencia || "Asistencia no encontrada"}
                </Typography>
              </Box>
              
              {/* Estudiantes */}
              <Box display="flex" alignItems="center" mb={2}>
                <People color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Estudiantes:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>
                  {selectedInasistencia.estudiantes?.map((est) => est.nombreEstudiante).join(", ") || "Sin estudiantes"}
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

      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Eliminar Asistencia</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro de que quieres eliminar esta Inasistencia {inasistenciaToDelete?.tituloInasistencia}?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">Cancelar</Button>
          <Button onClick={handleDeleteInasistencia} color="error">Eliminar</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity="error" onClose={() => setOpenSnackbar(false)}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Inasistencias;

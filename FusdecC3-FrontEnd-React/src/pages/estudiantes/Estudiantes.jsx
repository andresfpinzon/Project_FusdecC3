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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput,
  Checkbox,
  ListItemText,
  TablePagination
} from "@mui/material";
import { Edit, Delete, Info, Person, Description, CreditCard, Cake, Email, School, ToggleOn, CheckCircle, Cancel, Star, ConfirmationNumber } from "@mui/icons-material";

const token = localStorage.getItem("token");

const Estudiantes = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [colegios, setColegios] = useState([]);
  const [ediciones, setEdiciones] = useState([]);
  const [selectedEstudiante, setSelectedEstudiante] = useState(null);
  const [formValues, setFormValues] = useState({
    nombreEstudiante: "",
    apellidoEstudiante: "",
    numeroDocumento: "",
    correoEstudiante: "",
    tipoDocumento: "",
    fechaNacimiento: "",
    generoEstudiante: "",
    unidadId: "",
    colegioId: "",
    estadoEstudiante: true,
    ediciones: [],
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [estudianteToDelete, setEstudianteToDelete] = useState(null);
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const [infoEstudiante, setInfoEstudiante] = useState(null);

  // Paginación y búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchEstudiantes();
    fetchUnidades();
    fetchColegios();
    fetchEdiciones();
  }, []);

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
      console.error("Error al obtener estudiantes:", error);
      setErrorMessage("Error al obtener estudiantes");
      setOpenSnackbar(true);
    }
  };

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

      // Condicion que verifica si el arreglo de unidades está vacío
      if (data.length === 0) {
        setErrorMessage("No hay unidades registradas.");
        setOpenSnackbar(true);
        setUnidades([]); // esto mantiene el estado vacío para evitar errores
      } else {
        setUnidades(data);
      }
    } catch (error) {
      console.error("Error al obtener unidades:", error);
      setErrorMessage("Error al obtener unidades");
      setOpenSnackbar(true);
    }
  };

  const fetchColegios = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/colegios",{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token 
        }
    });
      if (!response.ok) throw new Error("Error al obtener colegios");
      const data = await response.json();

      // Condicion que verifica si el arreglo de colegios está vacío
      if (data.length === 0) {
        setErrorMessage("No hay colegios registrados.");
        setOpenSnackbar(true);
        setColegios([]); // esto mantiene el estado vacío para evitar errores
      } else {
        setColegios(data);
      }
    } catch (error) {
      console.error("Error al obtener colegios:", error);
      setErrorMessage("Error al obtener colegios");
      setOpenSnackbar(true);
    }
  };

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

      // Condicion que verifica si el arreglo de ediciones está vacío
      if (data.length === 0) {
        setErrorMessage("No hay ediciones registradas.");
        setOpenSnackbar(true);
        setEdiciones([]); // esto mantiene el estado vacío para evitar errores
      } else {
        setEdiciones(data);
      }
    } catch (error) {
      console.error("Error al obtener ediciones:", error);
      setErrorMessage("Error al obtener ediciones");
      setOpenSnackbar(true);
    }
  };

  // Filtrar usuarios según el término de búsqueda
  const filteredEstudiantes = estudiantes.filter((estudiante) =>
    estudiante.nombreEstudiante.toLowerCase().includes(searchTerm.toLowerCase()) ||
    estudiante.apellidoEstudiante.toLowerCase().includes(searchTerm.toLowerCase()) ||
    estudiante.tipoDocumento.toLowerCase().includes(searchTerm.toLowerCase()) ||
    estudiante.numeroDocumento.toLowerCase().includes(searchTerm.toLowerCase()) ||
    estudiante.correoEstudiante.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (estudiante.unidadId?.nombreUnidad?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
    (estudiante.colegioId?.nombreColegio?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
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

  const handleEditionChange = (e) => {
    const {
      target: { value },
    } = e;
    setFormValues({
      ...formValues,
      ediciones: typeof value === "string" ? value.split(",") : value,
    });
  };

  const handleCreateEstudiante = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/estudiantes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token 
        },
        body: JSON.stringify(formValues),
      });

      if (response.ok) {
        await fetchEstudiantes();

        // Muestra un mensaje de éxito
        setSuccessMessage("Estudiante creado exitosamente.");
        setOpenSnackbar(true);

        setFormValues({
          nombreEstudiante: "",
          apellidoEstudiante: "",
          numeroDocumento: "",
          correoEstudiante: "",
          tipoDocumento: "",
          fechaNacimiento: "",
          generoEstudiante: "",
          unidadId: "",
          colegioId: "",
          estadoEstudiante: true,
          ediciones: [],
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al crear estudiante");
      }
    } catch (error) {
      console.error("Error al crear estudiante:", error);
      setErrorMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  const handleUpdateEstudiante = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/estudiantes/${selectedEstudiante._id}`,
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
        await fetchEstudiantes()
        setSelectedEstudiante(null);
        setFormValues({
          nombreEstudiante: "",
          apellidoEstudiante: "",
          numeroDocumento: "",
          correoEstudiante: "",
          tipoDocumento: "",
          fechaNacimiento: "",
          generoEstudiante: "",
          unidadId: "",
          colegioId: "",
          estadoEstudiante: true,
          ediciones: [],
        });

        // Mostrar mensaje de éxito
        setSuccessMessage("El estudiante se actualizó correctamente");
        setOpenSnackbar(true); 
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar estudiante");
      }
    } catch (error) {
      console.error("Error al actualizar estudiante:", error);
      setErrorMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  const handleDeleteEstudiante = async () => {
    if (!estudianteToDelete) return;
    try {
      const response = await fetch(
        `http://localhost:3000/api/estudiantes/${estudianteToDelete._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token 
        }
        }
      );
      if (response.ok) {
        setEstudiantes(estudiantes.filter((estudiante) => estudiante._id !== estudianteToDelete._id));
        handleCloseDeleteDialog();

        // Mostrar mensaje de éxito
        setSuccessMessage("El estudiante se eliminó correctamente");
        setOpenSnackbar(true);

      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar estudiante");
      }
    } catch (error) {
      console.error("Error al eliminar estudiante:", error);
      setErrorMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  const handleEditClick = (estudiante) => {
    setSelectedEstudiante(estudiante);
    setFormValues({
      nombreEstudiante: estudiante.nombreEstudiante,
      apellidoEstudiante: estudiante.apellidoEstudiante,
      numeroDocumento: estudiante.numeroDocumento,
      correoEstudiante: estudiante.correoEstudiante,
      tipoDocumento: estudiante.tipoDocumento,
      fechaNacimiento: estudiante.fechaNacimiento,
      generoEstudiante: estudiante.generoEstudiante,
      unidadId: estudiante.unidadId?._id || "", 
      colegioId: estudiante.colegioId?._id || "", 
      estadoEstudiante: estudiante.estadoEstudiante,
      ediciones: estudiante.ediciones.map((edicion) => edicion._id),
    });
  };

  const handleDeleteClick = (estudiante) => {
    setEstudianteToDelete(estudiante);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setEstudianteToDelete(null);
  };

  const handleInfoClick = async (estudiante) => {
    const response = await fetch(`http://localhost:3000/api/estudiantes/${estudiante._id}`,{
      method: "GET",
      headers: {
          "Content-Type": "application/json",
          "Authorization": token 
      }
  });
    const data = await response.json();
    setInfoEstudiante(data);
    setOpenInfoDialog(true);
  };

  const handleCloseInfoDialog = () => {
    setOpenInfoDialog(false);
    setInfoEstudiante(null);
  };

  return (
    <Container>
      <h1>Gestión de Estudiantes:</h1>
      <form noValidate autoComplete="off">
        <TextField
          label="Nombre"
          name="nombreEstudiante"
          value={formValues.nombreEstudiante}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Apellido"
          name="apellidoEstudiante"
          value={formValues.apellidoEstudiante}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Tipo de Documento</InputLabel>
          <Select
            name="tipoDocumento"
            value={formValues.tipoDocumento}
            onChange={handleInputChange}
            input={<OutlinedInput label="Tipo de Documento" />}
          >
            <MenuItem value="T.I">T.I</MenuItem>
            <MenuItem value="C.C">C.C</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Número de Documento"
          name="numeroDocumento"
          value={formValues.numeroDocumento}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Correo Electrónico"
          name="correoEstudiante"
          value={formValues.correoEstudiante}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Fecha de Nacimiento"
          type="date"
          name="fechaNacimiento"
          value={formValues.fechaNacimiento}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Género</InputLabel>
          <Select
            name="generoEstudiante"
            value={formValues.generoEstudiante}
            onChange={handleInputChange}
            input={<OutlinedInput label="Género" />}
          >
            <MenuItem value="Masculino">Masculino</MenuItem>
            <MenuItem value="Femenino">Femenino</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Unidad</InputLabel>
          <Select
            name="unidadId"
            value={formValues.unidadId}
            onChange={handleInputChange}
            input={<OutlinedInput label="Unidad" />}
          >
            {unidades.map((unidad) => (
              <MenuItem key={unidad._id} value={unidad._id}>
                {unidad.nombreUnidad}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Colegio</InputLabel>
          <Select
            name="colegioId"
            value={formValues.colegioId}
            onChange={handleInputChange}
            input={<OutlinedInput label="Colegio" />}
          >
            {colegios.map((colegio) => (
              <MenuItem key={colegio._id} value={colegio._id}>
                {colegio.nombreColegio}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Ediciones</InputLabel>
          <Select
            multiple
            value={formValues.ediciones}
            onChange={handleEditionChange}
            input={<OutlinedInput label="Ediciones" />}
            renderValue={(selected) =>
              ediciones
                .filter((edicion) => selected.includes(edicion._id))
                .map((edicion) => edicion.tituloEdicion)
                .join(", ")
            }
          >
            {ediciones.map((edicion) => (
              <MenuItem key={edicion._id} value={edicion._id}>
                <Checkbox checked={formValues.ediciones.indexOf(edicion._id) > -1} />
                <ListItemText primary={edicion.tituloEdicion} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box marginTop={2} marginBottom={2}>
          <Switch
            checked={formValues.estadoEstudiante}
            onChange={handleSwitchChange}
            name="estadoEstudiante"
            color="primary"
          />
          Estado Activo
        </Box>
        <Box marginTop={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={selectedEstudiante ? handleUpdateEstudiante : handleCreateEstudiante}
          >
            {selectedEstudiante ? "Actualizar Estudiante" : "Crear Estudiante"}
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
              <TableCell>Nombre</TableCell>
              <TableCell>Apellido</TableCell>
              <TableCell>Tipo de Documento</TableCell>
              <TableCell>Número de Documento</TableCell>
              <TableCell>Correo</TableCell>
              <TableCell>Unidad</TableCell>
              <TableCell>Colegio</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {filteredEstudiantes
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((estudiante) => (
              <TableRow key={estudiante._id}>
                <TableCell>{estudiante.nombreEstudiante}</TableCell>
                <TableCell>{estudiante.apellidoEstudiante}</TableCell>
                <TableCell>{estudiante.tipoDocumento}</TableCell>
                <TableCell>{estudiante.numeroDocumento}</TableCell>
                <TableCell>{estudiante.correoEstudiante}</TableCell>
                <TableCell>{estudiante.unidadId?.nombreUnidad || "Unidad no encontrada"}</TableCell>
                <TableCell>{estudiante.colegioId?.nombreColegio || "Colegio no encontrado"}</TableCell>
                <TableCell>{estudiante.estadoEstudiante ? "Activo" : "Inactivo"}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditClick(estudiante)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleInfoClick(estudiante)} color="primary">
                    <Info />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteClick(estudiante)} color="error">
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
          count={filteredEstudiantes.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Eliminar Estudiante</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro de que deseas eliminar a {estudianteToDelete?.nombreEstudiante}?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">Cancelar</Button>
          <Button onClick={handleDeleteEstudiante} color="secondary">Eliminar</Button>
        </DialogActions>
      </Dialog>

      
      <Dialog open={openInfoDialog} onClose={handleCloseInfoDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: '#1d526eff', color: '#fff', textAlign: 'center' }}>
          Información del Estudiante
        </DialogTitle>
        <DialogContent dividers sx={{ padding: '20px' }}>
          {infoEstudiante && (
            <div>
              {/* Nombre */}
              <Box display="flex" alignItems="center" mb={2}>
                <Person color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Nombre:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>{infoEstudiante.nombreEstudiante || "Nombre no disponible"}</Typography>
              </Box>

              {/* Apellido */}
              <Box display="flex" alignItems="center" mb={2}>
                <Person color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Apellido:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>{infoEstudiante.apellidoEstudiante || "Apellido no disponible"}</Typography>
              </Box>

              {/* Tipo de Documento */}
              <Box display="flex" alignItems="center" mb={2}>
                <Description color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Tipo de Documento:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>{infoEstudiante.tipoDocumento || "Tipo no disponible"}</Typography>
              </Box>

              {/* Número de Documento */}
              <Box display="flex" alignItems="center" mb={2}>
                <CreditCard color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Número de Documento:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>{infoEstudiante.numeroDocumento || "Número no disponible"}</Typography>
              </Box>

              {/* Fecha de Nacimiento */}
              <Box display="flex" alignItems="center" mb={2}>
                <Cake color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Fecha de Nacimiento:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>{infoEstudiante.fechaNacimiento || "Fecha no disponible"}</Typography>
              </Box>

              {/* Correo */}
              <Box display="flex" alignItems="center" mb={2}>
                <Email color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Correo:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>{infoEstudiante.correoEstudiante || "Correo no disponible"}</Typography>
              </Box>

              {/* Unidad */}
              <Box display="flex" alignItems="center" mb={2}>
                <School color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Unidad:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>{infoEstudiante.unidadId?.nombreUnidad || "Unidad no encontrada"}</Typography>
              </Box>

              {/* Colegio */}
              <Box display="flex" alignItems="center" mb={2}>
                <School color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Colegio:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>{infoEstudiante.colegioId?.nombreColegio || "Colegio no encontrado"}</Typography>
              </Box>

              {/* Estado */}
              <Box display="flex" alignItems="center" mb={2}>
                <ToggleOn color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Estado:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>{infoEstudiante.estadoEstudiante ? "Activo" : "Inactivo"}</Typography>
              </Box>

              {/* Ediciones */}
              <Box display="flex" alignItems="center" mb={2}>
                <Edit color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Ediciones:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>{infoEstudiante.ediciones?.map((ed) => ed.tituloEdicion).join(", ") || "Sin ediciones"}</Typography>
              </Box>

              {/* Asistencias */}
              <Box display="flex" alignItems="center" mb={2}>
                <CheckCircle color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Asistencias:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>{infoEstudiante.asistencias?.map((as) => as.tituloAsistencia).join(", ") || "Sin asistencias"}</Typography>
              </Box>
              
              {/* Calificaciones */}
              <Box display="flex" alignItems="center" mb={2}>
                <Star color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Calificaciones:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>{infoEstudiante.calificaciones?.map((ca) => ca.tituloCalificacion).join(", ") || "Sin calificaciones"}</Typography>
              </Box>

              {/* Certificados */}
              <Box display="flex" alignItems="center" mb={2}>
                <ConfirmationNumber color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Certificados:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>{infoEstudiante.certificados?.map((ce) => ce.codigoVerificacion).join(", ") || "Sin certificados"}</Typography>
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

export default Estudiantes;

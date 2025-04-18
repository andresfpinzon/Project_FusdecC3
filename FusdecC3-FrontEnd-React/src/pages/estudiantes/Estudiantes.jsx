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
  Chip,
  TablePagination
} from "@mui/material";
import { Edit, Delete, Info, Person, Description, CreditCard, School, ToggleOn, CheckCircle, Star } from "@mui/icons-material";

const token = localStorage.getItem("token");

const Estudiantes = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  /*const [unidades, setUnidades] = useState([]);
  const [colegios, setColegios] = useState([]);
  const [ediciones, setEdiciones] = useState([]);*/
  const [selectedEstudiante, setSelectedEstudiante] = useState(null);
  const [formValues, setFormValues] = useState({
    numeroDocumento: "",
    nombre: "",
    apellido: "",
    tipoDocumento: "",
    genero: "",
    unidad: "",
    colegio: "",
    edicion: "",
    grado: "",
    estado: true
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

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
    /*fetchUnidades();
    fetchColegios();
    fetchEdiciones();*/
  }, []);

  const fetchEstudiantes = async () => {
    try {
      const response = await fetch("http://localhost:8080/estudiantes", {
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

  /*const fetchUnidades = async () => {
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
  };*/

  /*const fetchColegios = async () => {
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
  };*/

  /*const fetchEdiciones = async () => {
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
  };*/

  // Filtrar usuarios según el término de búsqueda
  const filteredEstudiantes = estudiantes.filter((estudiante) =>
    estudiante.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    estudiante.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
    estudiante.tipoDocumento.toLowerCase().includes(searchTerm.toLowerCase()) ||
    estudiante.numeroDocumento.toLowerCase().includes(searchTerm.toLowerCase()) ||
    estudiante.unidad?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    estudiante.colegio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    estudiante.edicion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    estudiante.grado?.toLowerCase().includes(searchTerm.toLowerCase())
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

  /*const handleEditionChange = (e) => {
    const {
      target: { value },
    } = e;
    setFormValues({
      ...formValues,
      ediciones: typeof value === "string" ? value.split(",") : value,
    });
  };*/

  const handleCreateEstudiante = async () => {
    try {
      const response = await fetch("http://localhost:8080/estudiantes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token 
        },
        body: JSON.stringify(formValues)
      });

      if (response.ok) {
        await fetchEstudiantes();

        // Muestra un mensaje de éxito
        setSuccessMessage("Estudiante creado exitosamente.");
        setOpenSnackbar(true);

        setFormValues({
          numeroDocumento: "",
          nombre: "",
          apellido: "",
          tipoDocumento: "",
          genero: "",
          unidad: "",
          colegio: "",
          edicion: "",
          grado: "",
          estado: true
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
        `http://localhost:8080/estudiantes/${selectedEstudiante.numeroDocumento}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token 
          },
          body: JSON.stringify(formValues)
        }
      );

      if (response.ok) {
        await fetchEstudiantes()
        setSelectedEstudiante(null);
        setFormValues({
          numeroDocumento: "",
          nombre: "",
          apellido: "",
          tipoDocumento: "",
          genero: "",
          unidad: "",
          colegio: "",
          edicion: "",
          grado: "",
          estado: true
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
        `http://localhost:8080/estudiantes/${estudianteToDelete.numeroDocumento}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token 
          }
        }
      );
      if (response.ok) {
        setEstudiantes(estudiantes.filter((est) => est.numeroDocumento !== estudianteToDelete.numeroDocumento));
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
      numeroDocumento: estudiante.numeroDocumento,
      nombre: estudiante.nombre,
      apellido: estudiante.apellido,
      tipoDocumento: estudiante.tipoDocumento,
      genero: estudiante.genero,
      unidad: estudiante.unidad,
      colegio: estudiante.colegio,
      edicion: estudiante.edicion,
      grado: estudiante.grado,
      estado: estudiante.estado
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
    const response = await fetch(`http://localhost:8080/estudiantes/${estudiante.numeroDocumento}`, {
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
        {/* Número de Documento */}
        <TextField
          label="Número de Documento"
          name="numeroDocumento"
          value={formValues.numeroDocumento}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          required
        />

        {/* Nombre */}
        <TextField
          label="Nombre"
          name="nombre"
          value={formValues.nombre}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          required
        />

        {/* Apellido */}
        <TextField
          label="Apellido"
          name="apellido"
          value={formValues.apellido}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          required
        />

        {/* Tipo de Documento */}
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Tipo de Documento</InputLabel>
          <Select
            name="tipoDocumento"
            value={formValues.tipoDocumento}
            onChange={handleInputChange}
            input={<OutlinedInput label="Tipo de Documento" />}
          >
            <MenuItem value="C.C">Cédula de Ciudadanía</MenuItem>
            <MenuItem value="T.I">Tarjeta de Identidad</MenuItem>
            <MenuItem value="C.E">Cédula de Extranjería</MenuItem>
          </Select>
        </FormControl>

        {/* Género */}
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Género</InputLabel>
          <Select
            name="genero"
            value={formValues.genero}
            onChange={handleInputChange}
            input={<OutlinedInput label="Género" />}
          >
            <MenuItem value="Masculino">Masculino</MenuItem>
            <MenuItem value="Femenino">Femenino</MenuItem>
            <MenuItem value="Otro">Otro</MenuItem>
          </Select>
        </FormControl>

        {/* Unidad */}
        <TextField
          label="Unidad"
          name="unidad"
          value={formValues.unidad}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          required
        />

        {/* Colegio */}
        <TextField
          label="Colegio"
          name="colegio"
          value={formValues.colegio}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          required
        />

        {/* Edición */}
        <TextField
          label="Edición"
          name="edicion"
          value={formValues.edicion}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          required
        />

        {/* Grado */}
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Grado</InputLabel>
          <Select
            name="grado"
            value={formValues.grado}
            onChange={handleInputChange}
            input={<OutlinedInput label="Grado" />}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((grado) => (
              <MenuItem key={grado} value={`${grado}°`}>
                {grado}° Grado
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Estado */}
        <Box marginTop={2} marginBottom={2}>
          <Switch
            checked={formValues.estado}
            onChange={handleSwitchChange}
            name="estado"
            color="primary"
          />
          <Typography component="span">Estado Activo</Typography>
        </Box>

        {/* Botón de enviar */}
        <Box marginTop={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={selectedEstudiante ? handleUpdateEstudiante : handleCreateEstudiante}
            disabled={
              !formValues.numeroDocumento ||
              !formValues.nombre ||
              !formValues.apellido ||
              !formValues.tipoDocumento ||
              !formValues.genero ||
              !formValues.unidad ||
              !formValues.colegio ||
              !formValues.edicion ||
              !formValues.grado
            }
          >
            {selectedEstudiante ? "Actualizar Estudiante" : "Crear Estudiante"}
          </Button>
          {selectedEstudiante && (
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => {
                setSelectedEstudiante(null);
                setFormValues({
                  numeroDocumento: "",
                  nombre: "",
                  apellido: "",
                  tipoDocumento: "",
                  genero: "",
                  unidad: "",
                  colegio: "",
                  edicion: "",
                  grado: "",
                  estado: true
                });
              }}
              style={{ marginLeft: '10px' }}
            >
              Cancelar Edición
            </Button>
          )}
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
              <TableCell>N° Documento</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Apellido</TableCell>
              <TableCell>Tipo Documento</TableCell>
              <TableCell>Unidad</TableCell>
              <TableCell>Colegio</TableCell>
              <TableCell>Edición</TableCell>
              <TableCell>Grado</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEstudiantes
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((estudiante) => (
                <TableRow key={estudiante.numeroDocumento}>
                  <TableCell>{estudiante.numeroDocumento}</TableCell>
                  <TableCell>{estudiante.nombre}</TableCell>
                  <TableCell>{estudiante.apellido}</TableCell>
                  <TableCell>{estudiante.tipoDocumento}</TableCell>
                  <TableCell>{estudiante.unidad || "Sin unidad"}</TableCell>
                  <TableCell>{estudiante.colegio || "Sin colegio"}</TableCell>
                  <TableCell>{estudiante.edicion || "Sin edición"}</TableCell>
                  <TableCell>{estudiante.grado || "Sin grado"}</TableCell>
                  <TableCell>
                    {estudiante.estado ? (
                      <Chip label="Activo" color="success" size="small" />
                    ) : (
                      <Chip label="Inactivo" color="error" size="small" />
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      onClick={() => handleEditClick(estudiante)} 
                      color="primary"
                      aria-label="editar"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton 
                      onClick={() => handleInfoClick(estudiante)} 
                      color="info"
                      aria-label="información"
                    >
                      <Info />
                    </IconButton>
                    <IconButton 
                      onClick={() => handleDeleteClick(estudiante)} 
                      color="error"
                      aria-label="eliminar"
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
          <Typography>¿Estás seguro de que deseas eliminar a {estudianteToDelete?.nombre}?</Typography>
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
              {/* Número de Documento */}
              <Box display="flex" alignItems="center" mb={2}>
                <CreditCard color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>N° Documento:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>{infoEstudiante.numeroDocumento || "No disponible"}</Typography>
              </Box>

              {/* Nombre */}
              <Box display="flex" alignItems="center" mb={2}>
                <Person color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Nombre:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>{infoEstudiante.nombre || "No disponible"}</Typography>
              </Box>

              {/* Apellido */}
              <Box display="flex" alignItems="center" mb={2}>
                <Person color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Apellido:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>{infoEstudiante.apellido || "No disponible"}</Typography>
              </Box>

              {/* Tipo de Documento */}
              <Box display="flex" alignItems="center" mb={2}>
                <Description color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Tipo Documento:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>{infoEstudiante.tipoDocumento || "No disponible"}</Typography>
              </Box>

              {/* Género */}
              <Box display="flex" alignItems="center" mb={2}>
                <Person color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Género:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>{infoEstudiante.genero || "No disponible"}</Typography>
              </Box>

              {/* Unidad */}
              <Box display="flex" alignItems="center" mb={2}>
                <School color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Unidad:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>{infoEstudiante.unidad || "No disponible"}</Typography>
              </Box>

              {/* Colegio */}
              <Box display="flex" alignItems="center" mb={2}>
                <School color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Colegio:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>{infoEstudiante.colegio || "No disponible"}</Typography>
              </Box>

              {/* Edición */}
              <Box display="flex" alignItems="center" mb={2}>
                <Edit color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Edición:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>{infoEstudiante.edicion || "No disponible"}</Typography>
              </Box>

              {/* Grado */}
              <Box display="flex" alignItems="center" mb={2}>
                <School color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Grado:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>{infoEstudiante.grado || "No disponible"}</Typography>
              </Box>

              {/* Estado */}
              <Box display="flex" alignItems="center" mb={2}>
                <ToggleOn color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Estado:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>
                  {infoEstudiante.estado ? (
                    <Chip label="Activo" color="success" size="small" />
                  ) : (
                    <Chip label="Inactivo" color="error" size="small" />
                  )}
                </Typography>
              </Box>

              {/* Asistencias Registradas */}
              <Box display="flex" alignItems="center" mb={2}>
                <CheckCircle color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Asistencias:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>
                  {infoEstudiante.asistenciasRegistradas || 0} registradas
                </Typography>
              </Box>

              {/* Aprobado */}
              <Box display="flex" alignItems="center" mb={2}>
                <Star color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Estado Académico:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>
                  {infoEstudiante.aprobado ? (
                    <Chip label="Aprobado" color="success" size="small" />
                  ) : (
                    <Chip label="En curso" color="warning" size="small" />
                  )}
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


      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={6000} 
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert 
          onClose={() => setOpenSnackbar(false)} 
          severity={errorMessage ? "error" : "success"}
        >
          {errorMessage || successMessage}
        </Alert>
      </Snackbar>
      
    </Container>
  );
};

export default Estudiantes;
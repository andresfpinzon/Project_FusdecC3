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
  const [unidades, setUnidades] = useState([]);
  const [ediciones, setEdiciones] = useState([]);
  const [colegios, setColegios] = useState([]);
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
    fetchUnidades();
    fetchColegios();
    fetchEdiciones();
  }, []);

  const fetchEstudiantes = async () => {
    try {
      const response = await fetch("http://localhost:8080/estudiantes", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error("Error al obtener estudiantes");
      const data = await response.json();
      
      // Condicion que verifica si el arreglo de estudiantes está vacío
      if (data.length === 0) {
        setErrorMessage("No hay estudiantes registrados.");
        setOpenSnackbar(true);
        setEstudiantes([]); 
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
      const response = await fetch("http://localhost:3000/api/unidades", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error("Error al obtener unidades");
      const data = await response.json();
      
      if (data.length === 0) {
        setErrorMessage("No hay unidades registradas.");
        setOpenSnackbar(true);
        setUnidades([]);
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
      const response = await fetch("http://localhost:3000/api/colegios", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });
  
      // Manejo de errores detallado
      if (response.status === 401) {
        const errorData = await response.json();
        console.error("Detalles error 401:", errorData);
        throw new Error(errorData.message || "No autorizado");
      }
  
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
  
      const data = await response.json();
      setColegios(data);
    } catch (error) {
      console.error("Error en fetchColegios:", error);
      setErrorMessage(error.message);
      setOpenSnackbar(true);
      
      // Redirigir a login si es error de autenticación
      if (error.message.includes("No autorizado") || error.message.includes("401")) {
        localStorage.removeItem("token");
        // window.location.href = "/login"; // Descomenta si necesitas redirección
      }
    }
  };

  const fetchEdiciones = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/ediciones", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error("Error al obtener ediciones");
      const data = await response.json();
      
      if (data.length === 0) {
        setErrorMessage("No hay ediciones registradas.");
        setOpenSnackbar(true);
        setEdiciones([]);
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

  const handleCreateEstudiante = async () => {
    try {
      const response = await fetch("http://localhost:8080/estudiantes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
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
            "Authorization": `Bearer ${token}`
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
            "Authorization": `Bearer ${token}`
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
    try {
      // Obtener todas las relaciones asistencia-estudiante
      const relacionesResponse = await fetch("http://localhost:8080/asistencia-estudiantes", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!relacionesResponse.ok) throw new Error("Error al obtener relaciones");
      
      const relaciones = await relacionesResponse.json();
      
      // Filtrar las relaciones de este estudiante
      const relacionesDelEstudiante = relaciones.filter(
        rel => rel.estudianteId === estudiante.numeroDocumento
      );
      
      // Obtener los detalles de cada asistencia
      const asistenciasResponse = await fetch("http://localhost:8080/asistencias", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!asistenciasResponse.ok) throw new Error("Error al obtener asistencias");
      
      const todasAsistencias = await asistenciasResponse.json();
      
      // Filtrar las asistencias de este estudiante
      const asistenciasDelEstudiante = todasAsistencias.filter(asistencia => 
        relacionesDelEstudiante.some(rel => rel.asistenciaId === asistencia.id)
      );
      
      // Actualizar el estado con la información
      setInfoEstudiante({
        ...estudiante,
        asistencias: asistenciasDelEstudiante
      });
      setOpenInfoDialog(true);
      
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Error al obtener las asistencias del estudiante");
      setOpenSnackbar(true);
    }
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
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Unidad</InputLabel>
          <Select
            value={unidades.find(u => u.nombreUnidad === formValues.unidad)?._id || ""}
            onChange={(e) => {
              const unidadSeleccionada = unidades.find(u => u._id === e.target.value);
              setFormValues({
                ...formValues,
                unidad: unidadSeleccionada?.nombreUnidad || ""
              });
            }}
            input={<OutlinedInput label="Unidad" />}
          >
            {unidades.map((unidad) => (
              <MenuItem key={unidad._id} value={unidad._id}>
                {unidad.nombreUnidad}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Colegio */}
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Colegio</InputLabel>
          <Select
            value={colegios.find(c => c.nombreColegio === formValues.colegio)?._id || ""}
            onChange={(e) => {
              const colegioSeleccionado = colegios.find(c => c._id === e.target.value);
              setFormValues({
                ...formValues,
                colegio: colegioSeleccionado?.nombreColegio || ""
              });
            }}
            input={<OutlinedInput label="Colegio" />}
          >
            {colegios.map((colegio) => (
              <MenuItem key={colegio._id} value={colegio._id}>
                {colegio.nombreColegio}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Edición - Versión más robusta */}
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Edición</InputLabel>
          <Select
            value={
              ediciones.find(e => 
                e.tituloEdicion === formValues.edicion || 
                e._id === formValues.edicion
              )?._id || ""
            }
            onChange={(e) => {
              const selectedId = e.target.value;
              const edicionSeleccionada = ediciones.find(e => e._id === selectedId);
              
              if (edicionSeleccionada) {
                setFormValues({
                  ...formValues,
                  edicion: edicionSeleccionada.tituloEdicion
                });
              } else {
                // Opcional: resetear si no se encuentra
                setFormValues({
                  ...formValues,
                  edicion: ""
                });
              }
            }}
            input={<OutlinedInput label="Edición" />}
          >
            <MenuItem value="" disabled>
              Seleccione una edición
            </MenuItem>
            {ediciones.map((edicion) => (
              <MenuItem key={edicion._id} value={edicion._id}>
                {edicion.tituloEdicion}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Grado */}
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Grado</InputLabel>
          <Select
            name="grado"
            value={formValues.grado}
            onChange={handleInputChange}
            input={<OutlinedInput label="Grado" />}
          >
            {[ 8, 9, 10, 11].map((grado) => (
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

      
      <Dialog open={openInfoDialog} onClose={handleCloseInfoDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ backgroundColor: '#1d526eff', color: '#fff', textAlign: 'center' }}>
          Asistencias de {infoEstudiante?.nombre} {infoEstudiante?.apellido}
        </DialogTitle>
        <DialogContent dividers sx={{ padding: '20px' }}>
          {infoEstudiante && (
            <div>
              <Box display="flex" alignItems="center" mb={3}>
                <CreditCard color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Documento: {infoEstudiante.numeroDocumento}</Typography>
              </Box>

              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Registro de Asistencias ({infoEstudiante.asistencias?.length || 0})
              </Typography>
              
              {infoEstudiante.asistencias?.length > 0 ? (
                <TableContainer component={Paper} sx={{ maxHeight: 400, overflow: 'auto' }}>
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Fecha</TableCell>
                        <TableCell>Título</TableCell>
                        <TableCell>Estado</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {infoEstudiante.asistencias
                        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha)) // Ordenar por fecha descendente
                        .map((asistencia) => (
                          <TableRow key={asistencia.id}>
                            <TableCell>{asistencia.id}</TableCell>
                            <TableCell>
                              {new Date(asistencia.fecha + 'T00:00:00').toLocaleDateString('es-ES')}
                            </TableCell>
                            <TableCell>{asistencia.titulo}</TableCell>
                            <TableCell>
                              <Chip 
                                label={asistencia.estado ? "Activa" : "Inactiva"} 
                                color={asistencia.estado ? "success" : "error"} 
                                size="small" 
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="body1" sx={{ fontStyle: 'italic', textAlign: 'center', py: 2 }}>
                  El estudiante no tiene asistencias registradas
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
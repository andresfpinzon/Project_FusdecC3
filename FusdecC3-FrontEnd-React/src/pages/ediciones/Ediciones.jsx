/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Chip,
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
  TablePagination
} from "@mui/material";

import { Edit, Delete, Info, School, DateRange, EventAvailable, ToggleOn, Class, Grade } from "@mui/icons-material";

const token = localStorage.getItem("token");

const formatDate = (dateString) => {
  if (!dateString) return "No disponible";

  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'UTC' // Asegura que no se ajuste por zona horaria
  };

  return new Date(dateString).toLocaleDateString('es-ES', options);
};

const Ediciones = () => {
  const [ediciones, setEdiciones] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [selectedEdicion, setSelectedEdicion] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null); // Agrégalo junto a los otros estados
  const [formValues, setFormValues] = useState({
    titulo: "",
    fechaInicio: "",
    fechaFin: "",
    estado: true,
    cursoId: "",
    estudiantes: [],
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [edicionToDelete, setEdicionToDelete] = useState(null);
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const [infoEdicion, setInfoEdicion] = useState(null);

  // Paginación y búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchEdiciones = async () => {
    try {
      const response = await fetch("http://localhost:8080/ediciones", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
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

  const fetchCursos = async () => {
    try {
      const response = await fetch("http://localhost:8080/cursos", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error("Error al obtener cursos");
      const data = await response.json();

      // Condicion que verifica si el arreglo de cursos está vacío
      if (data.length === 0) {
        setErrorMessage("No hay cursos registrados.");
        setOpenSnackbar(true);
        setCursos([]); // esto mantiene el estado vacío para evitar errores
      } else {
        setCursos(data);
      }
    } catch (error) {
      console.error("Error al obtener cursos:", error);
      setErrorMessage("Error al obtener cursos");
      setOpenSnackbar(true);
    }
  };

  const fetchEstudiantes = async (edicionId) => {
    try {
      const response = await fetch(`http://localhost:8080/ediciones/${edicionId}/estudiantes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error("Error al obtener estudiantes del colegio");
      return await response.json();
    } catch (error) {
      console.error("Error al obtener estudiantes del colegio:", error);
      setErrorMessage("Error al obtener estudiantes del colegio");
      setOpenSnackbar(true);
      return [];
    }
  };

  useEffect(() => {
    fetchEdiciones();
    fetchCursos();
  }, []);

  // Filtrar usuarios según el término de búsqueda
  const filteredEdiciones = ediciones.filter((edicion) =>
    edicion.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    edicion.fechaFin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    edicion.fechaInicio.toLowerCase().includes(searchTerm.toLowerCase())
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
    try {
      // Validación básica del formulario
      if (!formValues.titulo || !formValues.fechaInicio || !formValues.fechaFin || !formValues.cursoId) {
        throw new Error("Por favor complete todos los campos obligatorios");
      }

      const response = await fetch("http://localhost:8080/ediciones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          titulo: formValues.titulo,
          fechaInicio: formValues.fechaInicio,
          fechaFin: formValues.fechaFin,
          cursoId: parseInt(formValues.cursoId)
        })
      });

      const responseData = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 400 && responseData.errors) {
          const errorMessages = Object.values(responseData.errors).join('\n');
          throw new Error(errorMessages);
        }
        throw new Error(responseData.error || responseData.message || "Error al crear la edición");
      }

      await fetchEdiciones();
      setFormValues({
        titulo: "",
        fechaInicio: "",
        fechaFin: "",
        estado: true,
        cursoId: "",
        estudiantes: [],
      });
      setErrorMessage(null);
      setSuccessMessage("Edición creada correctamente");
      setOpenSnackbar(true);

    } catch (error) {
      console.error('Error al crear edición:', error);
      setErrorMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  const handleUpdateEdicion = async () => {
    try {
      if (!selectedEdicion) {
        throw new Error("No se ha seleccionado ninguna edición para actualizar");
      }

      // Preparar datos para actualización
      const updateData = {};
      if (formValues.titulo) updateData.titulo = formValues.titulo;
      if (formValues.fechaInicio) updateData.fechaInicio = formValues.fechaInicio;
      if (formValues.fechaFin) updateData.fechaFin = formValues.fechaFin;
      if (formValues.cursoId) updateData.cursoId = parseInt(formValues.cursoId);
      if (formValues.estado !== undefined) updateData.estado = formValues.estado;

      if (Object.keys(updateData).length === 0) {
        throw new Error("No se proporcionaron datos para actualizar");
      }

      const response = await fetch(
        `http://localhost:8080/ediciones/${selectedEdicion.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(updateData)
        }
      );

      const responseData = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 400 && responseData.errors) {
          const errorMessages = Object.values(responseData.errors).join('\n');
          throw new Error(errorMessages);
        }
        throw new Error(responseData.error || responseData.message || "Error al actualizar la edición");
      }

      await fetchEdiciones();
      setSelectedEdicion(null);
      setFormValues({
        titulo: "",
        fechaInicio: "",
        fechaFin: "",
        estado: true,
        cursoId: "",
        estudiantes: [],
      });
      setErrorMessage(null);
      setSuccessMessage("Edición actualizada correctamente");
      setOpenSnackbar(true);

    } catch (error) {
      console.error('Error al actualizar edición:', error);
      setErrorMessage(error.message);
      setOpenSnackbar(true);
    }
  };


  const handleDeleteEdicion = async () => {
    if (!edicionToDelete) return;

    try {
      const response = await fetch(
        `http://localhost:8080/ediciones/${edicionToDelete.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar edición");
      }

      setEdiciones(ediciones.filter(edicion => edicion.id !== edicionToDelete.id));
      handleCloseDeleteDialog();

      setSuccessMessage("Edición eliminada exitosamente.");
      setErrorMessage(null);
      setOpenSnackbar(true);

    } catch (error) {
      setErrorMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  const handleEditClick = (edicion) => {
    setSelectedEdicion(edicion);
    setFormValues({
      titulo: edicion.titulo,
      fechaInicio: edicion.fechaInicio,
      fechaFin: edicion.fechaFin,
      estado: edicion.estado,
      cursoId: edicion.cursoId || "",
    });
  };

  const handleDeleteClick = (edicion) => {
    setEdicionToDelete(edicion);
    setOpenDeleteDialog(true);
  };

  const handleInfoClick = async (edicion) => {
    try {
      const estudiantesDelaEdicion = await fetchEstudiantes(edicion.id);

      setInfoEdicion({
        ...edicion,
        estudiantes: estudiantesDelaEdicion,
        curso: edicion.cursoId ?
          (cursos.find(c => c.id === edicion.cursoId)?.nombre || "Curso no encontrado")
          : "No asignado"
      });
      setOpenInfoDialog(true);

    } catch (error) {
      console.error("Error al cargar estudiantes:", error);
      setErrorMessage("Error al cargar estudiantes. Por favor, revisa la consola para más detalles.");
      setOpenSnackbar(true);
    }
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
          id="titulo"
          label="Título de la Edición"
          name="titulo"
          value={formValues.titulo}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          id="fechaInicio"
          label="Fecha de inicio"
          type="date"
          name="fechaInicio"
          value={formValues.fechaInicio}
          onChange={handleInputChange}
          sx={{ 
            width: '300px',
            "& .MuiInputLabel-root": { 
              transform: "translateY(2px)", 
              shrink: true 
            }
          }}
        />
        <br /><br />
        <TextField
          id="fechaFin"
          label="Fecha de Fin"
          type="date"
          name="fechaFin"
          value={formValues.fechaFin}
          onChange={handleInputChange}
          sx={{ 
            width: '300px',
            "& .MuiInputLabel-root": { 
              transform: "translateY(2px)", 
              shrink: true 
            }
          }}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Curso</InputLabel>
          <Select
            id="cursoId"
            name="cursoId"
            value={formValues.cursoId}
            onChange={handleInputChange}
            input={<OutlinedInput label="Curso" />}
          >
            {cursos.map((curso) => (
              <MenuItem key={curso.id} value={curso.id}>
                {curso.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box marginTop={2} marginBottom={2}>
          <Switch
            checked={formValues.estado}
            onChange={handleSwitchChange}
            name="estado"
            color="primary"
          />
          Estado Activo
        </Box>

        <Box marginTop={3} sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={selectedEdicion ? handleUpdateEdicion : handleCreateEdicion}
            disabled={
              !formValues.titulo.trim() ||
              !formValues.fechaInicio ||
              !formValues.fechaFin ||
              !formValues.cursoId
            }
          >
            {selectedEdicion ? "Actualizar Edición" : "Crear Edición"}
          </Button>

          {selectedEdicion && (
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => {
                setSelectedEdicion(null);
                setFormValues({
                  titulo: "",
                  fechaInicio: "",
                  fechaFin: "",
                  estado: true,
                  cursoId: "",
                  estudiantes: [],
                });
              }}
            >
              Cancelar Edición
            </Button>
          )}
        </Box>

      </form>

      {/* Busqueda */}
      <TextField
        id="busquedaEdicion"
        label="Buscar ediciones"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

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
            {filteredEdiciones
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((edicion) => (
                <TableRow key={edicion.id}>
                  <TableCell>{edicion.titulo}</TableCell>
                  <TableCell>{formatDate(edicion.fechaInicio)}</TableCell>
                  <TableCell>{formatDate(edicion.fechaFin)}</TableCell>
                  <TableCell>
                    {edicion.estado ? (
                      <Chip label="Activo" color="success" size="small" />
                    ) : (
                      <Chip label="Inactivo" color="error" size="small" />
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditClick(edicion)} color="primary">
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleInfoClick(edicion)} color="primary">
                      <Info />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteClick(edicion)}
                      color="error"
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
          id="paginacionEdicion"
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredEdiciones.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

      </TableContainer>

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{
          backgroundColor: '#1d526eff',
          color: '#fff',
          textAlign: 'center',
          padding: '16px 24px'
        }}>
          Confirmar Eliminación
        </DialogTitle>
        <DialogContent dividers sx={{ padding: '20px' }}>
          <Typography variant="body1" sx={{ textAlign: 'center', fontSize: '1.1rem' }}>
            ¿Estás seguro que deseas eliminar la edición <strong>{edicionToDelete?.titulo}</strong>?
          </Typography>
          <Typography variant="body2" sx={{
            textAlign: 'center',
            color: 'text.secondary',
            marginTop: '8px'
          }}>
            Curso: {edicionToDelete?.cursoNombre || 'No asignado'}
          </Typography>
        </DialogContent>
        <DialogActions sx={{
          justifyContent: 'center',
          padding: '16px 24px',
          gap: '16px'
        }}>
          <Button
            onClick={() => setOpenDeleteDialog(false)}
            variant="outlined"
            sx={{
              minWidth: '120px',
              borderColor: '#1d526eff',
              color: '#1d526eff',
              '&:hover': {
                backgroundColor: '#f0f7ff',
                borderColor: '#1a4863'
              }
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDeleteEdicion}
            variant="contained"
            sx={{
              minWidth: '120px',
              backgroundColor: '#d32f2f',
              '&:hover': {
                backgroundColor: '#b71c1c'
              }
            }}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openInfoDialog} onClose={handleCloseInfoDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{
          backgroundColor: '#1d526eff',
          color: '#fff',
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <School sx={{ mr: 1 }} />
          Detalles de la Edición: {infoEdicion?.titulo}
        </DialogTitle>

        <DialogContent dividers sx={{ padding: '20px' }}>
          {infoEdicion && (
            <Box>
              {/* Información del Curso */}
              <Box mb={3} sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Curso Asociado:
                </Typography>
                <Typography>{infoEdicion.curso}</Typography>
              </Box>

              {/* Lista de Estudiantes */}
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Estudiantes Inscritos ({infoEdicion.estudiantes?.length || 0}):
                </Typography>

                {infoEdicion.estudiantes?.length > 0 ? (
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Documento</TableCell>
                          <TableCell>Nombre</TableCell>
                          <TableCell>Apellido</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {infoEdicion.estudiantes.map((estudiante, index) => (
                          <TableRow key={index}>
                            <TableCell>{estudiante.numeroDocumento}</TableCell>
                            <TableCell>{estudiante.nombre}</TableCell>
                            <TableCell>{estudiante.apellido}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                    No hay estudiantes inscritos en esta edición
                  </Typography>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleCloseInfoDialog}
            variant="contained"
            color="primary"
            sx={{ mb: 1, mr: 1 }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={openSnackbar} autoHideDuration={20000} onClose={() => setOpenSnackbar(false)}>
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={errorMessage ? "error" : "success"}
          sx={{ width: '100%' }}
        >
          {errorMessage || successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Ediciones;
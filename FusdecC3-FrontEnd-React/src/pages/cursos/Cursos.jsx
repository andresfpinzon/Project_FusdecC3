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
  TablePagination
} from "@mui/material";

import { Edit, Delete, Info, School, Description, AccessTime, ToggleOn, Foundation, EventNote } from "@mui/icons-material";

const token = localStorage.getItem("token");

const Cursos = () => {
  const [fundaciones, setFundaciones] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [selectedCurso, setSelectedCurso] = useState(null);
  const [formValues, setFormValues] = useState({
    nombre: "",
    descripcion: "",
    intensidadHoraria: "",
    estado: true,
    fundacionId: "",
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [cursoToDelete, setCursoToDelete] = useState(null);
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [infoCurso, setInfoCurso] = useState(null);

  // Paginación y búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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

      // Obtener nombres de relaciones
      const cursosConNombres = await Promise.all(data.map(async (est) => {
        const fundacionNombre = est.fundacionId ? await getFundacionNombre(est.fundacionId) : "Sin fundacion";

        return {
          ...est,
          fundacionNombre
        };
      }));

      // Condicion que verifica si el arreglo de cursos está vacío
      if (cursosConNombres.length === 0) {
        setErrorMessage("No hay cursos registrados.");
        setOpenSnackbar(true);
        setCursos([]); // esto mantiene el estado vacío para evitar errores
      } else {
        setCursos(cursosConNombres);
      }
    } catch (error) {
      console.error("Error al obtener cursos:", error);
      setErrorMessage("Error al obtener cursos");
      setOpenSnackbar(true);
    }
  };

  const fetchFundaciones = async () => {
    try {
      const response = await fetch("http://localhost:8080/fundaciones", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error("Error al obtener fundaciones");
      const data = await response.json();

      // Condicion que verifica si el arreglo de fundaciones está vacío
      if (data.length === 0) {
        setErrorMessage("No hay fundaciones registradas.");
        setOpenSnackbar(true);
        setFundaciones([]); // esto mantiene el estado vacío para evitar errores
      } else {
        setFundaciones(data);
      }
    } catch (error) {
      console.error("Error al obtener fundaciones:", error);
      setErrorMessage("Error al obtener fundaciones");
      setOpenSnackbar(true);
    }
  };

  const getFundacionNombre = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/fundaciones/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (!response.ok) return "Sin fundación";
      const data = await response.json();
      return data.nombre || "Sin fundación";
    } catch (error) {
      return "Sin fundación";
    }
  };

  useEffect(() => {
    fetchFundaciones();
    fetchCursos();
  }, []);

  // Filtrar usuarios según el término de búsqueda
  const filteredCursos = cursos.filter((curso) =>
    curso.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    curso.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleCreateCurso = async () => {
    try {
      // Validación básica del formulario
      if (!formValues.nombre || !formValues.descripcion || !formValues.intensidadHoraria || !formValues.fundacionId) {
        throw new Error("Por favor complete todos los campos obligatorios");
      }

      // Validar formato de intensidad horaria
      if (!/^\d+ horas?$/i.test(formValues.intensidadHoraria)) {
        throw new Error("La intensidad horaria debe estar en formato 'X horas'");
      }

      const response = await fetch("http://localhost:8080/cursos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formValues)
      });

      const responseData = await response.json().catch(() => ({}));

      if (!response.ok) {
        // Manejo de errores de validación (400 con estructura específica)
        if (response.status === 400 && responseData.errors) {
          const errorMessages = Object.values(responseData.errors).join('\n');
          throw new Error(errorMessages);
        }
        // Manejo de errores de negocio (409 u otros)
        throw new Error(responseData.error || responseData.message || "Error al crear el curso");
      }

      await fetchCursos();
      setFormValues({
        nombre: "",
        descripcion: "",
        intensidadHoraria: "",
        estado: true,
        fundacionId: ""
      });
      setErrorMessage(null);
      setSuccessMessage("Curso creado correctamente");
      setOpenSnackbar(true);

    } catch (error) {
      console.error('Error al crear curso:', error);
      setErrorMessage(error.message);
      setOpenSnackbar(true);
    }
};

const handleUpdateCurso = async () => {
    try {
      if (!selectedCurso) {
        throw new Error("No se ha seleccionado ningún curso para actualizar");
      }

      // Validar formato de intensidad horaria si se está actualizando
      if (formValues.intensidadHoraria && !/^\d+ horas?$/i.test(formValues.intensidadHoraria)) {
        throw new Error("La intensidad horaria debe estar en formato 'X horas'");
      }

      // Preparar datos para actualización
      const updateData = {};
      if (formValues.nombre) updateData.nombre = formValues.nombre;
      if (formValues.descripcion) updateData.descripcion = formValues.descripcion;
      if (formValues.intensidadHoraria) updateData.intensidadHoraria = formValues.intensidadHoraria;
      if (formValues.estado !== undefined) updateData.estado = formValues.estado;
      if (formValues.fundacionId) updateData.fundacionId = formValues.fundacionId;

      // Verificar que hay datos para actualizar
      if (Object.keys(updateData).length === 0) {
        throw new Error("No se proporcionaron datos para actualizar");
      }

      const response = await fetch(
        `http://localhost:8080/cursos/${selectedCurso.id}`,
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
        // Manejo de errores de validación (400 con estructura específica)
        if (response.status === 400 && responseData.errors) {
          const errorMessages = Object.values(responseData.errors).join('\n');
          throw new Error(errorMessages);
        }
        // Manejo de errores de negocio (409 u otros)
        throw new Error(responseData.error || responseData.message || "Error al actualizar el curso");
      }

      await fetchCursos();
      setSelectedCurso(null);
      setFormValues({
        nombre: "",
        descripcion: "",
        intensidadHoraria: "",
        estado: true,
        fundacionId: ""
      });
      setErrorMessage(null);
      setSuccessMessage("Curso actualizado correctamente");
      setOpenSnackbar(true);

    } catch (error) {
      console.error('Error al actualizar curso:', error);
      setErrorMessage(error.message);
      setOpenSnackbar(true);
    }
};

  const handleDeleteCurso = async () => {
    if (!cursoToDelete) return;

    try {
      const response = await fetch(
        `http://localhost:8080/cursos/${cursoToDelete.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        setCursos(cursos.filter((curso) => curso.id !== cursoToDelete.id));
        handleCloseDeleteDialog(); // Cierra el modal de confirmación después de eliminar

        // Mostrar mensaje de éxito
        setSuccessMessage("El curso se eliminó correctamente");
        setOpenSnackbar(true);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar curso");
      }
    } catch (error) {
      handleError("Error al eliminar curso", error);
    }
  };

  const handleEditClick = (curso) => {
    setSelectedCurso(curso);
    setFormValues({
      nombre: curso.nombre,
      descripcion: curso.descripcion,
      intensidadHoraria: curso.intensidadHoraria,
      estado: curso.estado !== undefined ? curso.estado : true,
      fundacionId: curso.fundacionId || "",
    });
  };

  const handleDeleteClick = (curso) => {
    setCursoToDelete(curso);
    setOpenDeleteDialog(true);
  };

  const handleInfoClick = async (curso) => {
    const fundacion = fundaciones.find(f => f.id === curso.fundacionId);
    const cursoInfo = {
      ...curso,
      fundacionNombre: fundacion?.nombre || "Sin fundación",
      edicionesInfo: "No hay ediciones registradas" // Texto por defecto
    };

    setInfoCurso(cursoInfo);
    setOpenInfoDialog(true);
  };

  const handleCloseInfoDialog = () => {
    setOpenInfoDialog(false);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setCursoToDelete(null);
  };

  return (
    <Container>
      <h1>Gestión de Cursos:</h1>
      <form noValidate autoComplete="off">
        <TextField
          id="nombre"
          label="Nombre del Curso"
          name="nombre"
          value={formValues.nombre}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          id="descripcion"
          label="Descripción"
          name="descripcion"
          value={formValues.descripcion}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          id="intensidadHoraria"
          label="Intensidad Horaria"
          name="intensidadHoraria"
          value={formValues.intensidadHoraria}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Fundacion</InputLabel>
          <Select
            name="fundacionId"
            value={formValues.fundacionId}
            onChange={handleInputChange}
            input={<OutlinedInput label="Fundacion" />}
          >
            {fundaciones.map((fundacion) => (
              <MenuItem key={fundacion.id} value={fundacion.id}>
                {fundacion.nombre}
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
            onClick={selectedCurso ? handleUpdateCurso : handleCreateCurso}
            disabled={
              !formValues.nombre.trim() ||
              !formValues.descripcion.trim() ||
              !formValues.intensidadHoraria.trim()
            }
          >
            {selectedCurso ? "Actualizar Curso" : "Crear Curso"}
          </Button>

          {selectedCurso && (
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => {
                setSelectedCurso(null);
                setFormValues({
                  nombre: "",
                  descripcion: "",
                  intensidadHoraria: "",
                  estado: true,
                  fundacionId: ""
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
        id="busquedaCurso"
        label="Buscar cursos"
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
              <TableCell>Nombre del Curso</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Intensidad Horaria</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCursos
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((curso) => (
                <TableRow key={curso.id}>
                  <TableCell>{curso.nombre}</TableCell>
                  <TableCell>{curso.descripcion}</TableCell>
                  <TableCell>{curso.intensidadHoraria}</TableCell>
                  <TableCell>{curso.estado ? "Activo" : "Inactivo"}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleEditClick(curso)} color="primary">
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleInfoClick(curso)} color="primary">
                      <Info />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteClick(curso)} color="error">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        {/* Paginación */}
        <TablePagination
          id="paginacionCurso"
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredCursos.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

      </TableContainer>

      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Eliminar Curso</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro de que deseas eliminar a {cursoToDelete?.nombre}?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">Cancelar</Button>
          <Button onClick={handleDeleteCurso} color="secondary">Eliminar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openInfoDialog} onClose={handleCloseInfoDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: '#1d526eff', color: '#fff', textAlign: 'center' }}>
          Información del Curso
        </DialogTitle>
        <DialogContent dividers sx={{ padding: '20px' }}>
          {infoCurso && (
            <div>
              <Box display="flex" alignItems="center" mb={2}>
                <Foundation color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Fundación:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>
                  {infoCurso.fundacionNombre || "Fundación no asignada"}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" mb={2}>
                <EventNote color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Ediciones:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>
                  {infoCurso.edicionesInfo || "No hay ediciones registradas"}
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

export default Cursos;
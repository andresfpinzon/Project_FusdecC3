import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Table,
  TableBody,
  Chip,
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
  TablePagination
} from "@mui/material";

import { Edit, Delete, Info } from "@mui/icons-material";

const token = localStorage.getItem("token");

const Colegios = () => {
  const [colegios, setColegios] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [selectedColegio, setSelectedColegio] = useState(null);
  const [formValues, setFormValues] = useState({
    nombre: "",
    email: "",
    estado: true,
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [colegioToDelete, setColegioToDelete] = useState(null);
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const [infoColegio, setInfoColegio] = useState({
    nombre: "",
    estudiantes: [] // Ahora almacenará objetos completos de estudiantes
  });

  // Paginación y búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchColegios = async () => {
    try {
      const response = await fetch("https://qf5sx04q-8080.use2.devtunnels.ms/colegios", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
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

  const fetchEstudiantes = async (colegioId) => {
    try {
      const response = await fetch(`https://qf5sx04q-8080.use2.devtunnels.ms/colegios/${colegioId}/estudiantes`, {
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
    fetchColegios();
  }, []);

  // Filtrar usuarios según el término de búsqueda
  const filteredColegios = colegios.filter((colegio) =>
    colegio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    colegio.email.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleError = (message, error = null) => {
  if (error) console.error(message, error);
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

  const handleCreateColegio = async (e) => {
    e.preventDefault();

    // Validación básica del formulario
    if (!formValues.nombre || !formValues.email) {
      setErrorMessage("Por favor complete todos los campos obligatorios");
      setOpenSnackbar(true);
      return;
    }

    // Validación de formato de email
    if (!isValidEmail(formValues.email)) {
      setErrorMessage("Por favor ingrese un email válido");
      setOpenSnackbar(true);
      return;
    }

    try {
      const colegioData = {
        nombre: formValues.nombre.trim(),
        email: formValues.email.trim().toLowerCase()
      };

      const response = await fetch("https://qf5sx04q-8080.use2.devtunnels.ms/colegios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(colegioData),
      });

      const responseData = await response.json().catch(() => ({}));

      if (!response.ok) {
        // Manejo de errores de validación (400 con estructura específica)
        if (response.status === 400 && responseData.errors) {
          const errorMessages = Object.values(responseData.errors).join('\n');
          throw new Error(errorMessages);
        }
        // Manejo de errores de negocio (409 u otros)
        throw new Error(responseData.error || responseData.message || "Error al crear el colegio");
      }

      setColegios([...colegios, responseData]);
      setFormValues({
        nombre: "",
        email: "",
        estado: true,
      });
      setErrorMessage(null); 
      setSuccessMessage("Colegio creado correctamente");
      setOpenSnackbar(true);

    } catch (error) {
      console.error('Error en Crear Colegio:', error);
      setErrorMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  const handleUpdateColegio = async (e) => {
    e.preventDefault();

    if (!selectedColegio) {
      setErrorMessage("No se ha seleccionado ningún colegio para actualizar");
      setOpenSnackbar(true);
      return;
    }

    // Validación de formato de email si se está actualizando
    if (formValues.email && !isValidEmail(formValues.email)) {
      setErrorMessage("Por favor ingrese un email válido");
      setOpenSnackbar(true);
      return;
    }

    try {
      // Preparar datos para actualización
      const updateData = {};
      if (formValues.nombre) updateData.nombre = formValues.nombre.trim();
      if (formValues.email) updateData.email = formValues.email.trim().toLowerCase();
      if (formValues.estado !== undefined) updateData.estado = formValues.estado;

      // Verificar que hay datos para actualizar
      if (Object.keys(updateData).length === 0) {
        setErrorMessage("No se proporcionaron datos para actualizar");
        setOpenSnackbar(true);
        return;
      }

      const response = await fetch(`https://qf5sx04q-8080.use2.devtunnels.ms/colegios/${selectedColegio.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updateData),
      });

      const responseData = await response.json().catch(() => ({}));

      if (!response.ok) {
        // Manejo de errores de validación (400 con estructura específica)
        if (response.status === 400 && responseData.errors) {
          const errorMessages = Object.values(responseData.errors).join('\n');
          throw new Error(errorMessages);
        }
        // Manejo de errores de negocio (409 u otros)
        throw new Error(responseData.error || responseData.message || "Error al actualizar el colegio");
      }

      // Éxito - Actualizar estado
      setColegios(prevColegios =>
        prevColegios.map(colegio =>
          colegio.id === selectedColegio.id ? { ...colegio, ...responseData } : colegio
        )
      );
      setSelectedColegio(null);
      setFormValues({
        nombre: "",
        email: "",
        estado: true,
      });
      setErrorMessage(null);
      setSuccessMessage("Colegio actualizado correctamente");
      setOpenSnackbar(true);

    } catch (error) {
      console.error('Error al actualizar colegio:', error);
      setErrorMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  // Función auxiliar para validar email
  const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleDeleteColegio = async () => {
    if (!colegioToDelete) return;

    try {
      const response = await fetch(
        `https://qf5sx04q-8080.use2.devtunnels.ms/colegios/${colegioToDelete.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        setColegios(colegios.filter((colegio) => colegio.id !== colegioToDelete.id));
        // Muestra un mensaje de éxito
        setSuccessMessage("Colegio eliminado exitosamente");
        setOpenSnackbar(true);
        handleCloseDeleteDialog(); // Cierra el modal de confirmación después de eliminar
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar el colegio");
      }
    } catch (error) {
      console.error("Error al eliminar el colegio:", error);
      setErrorMessage("Error al eliminar el colegio");
      setOpenSnackbar(true);
    }
  };

  const handleEditClick = (colegio) => {
    setSelectedColegio(colegio);
    setFormValues({
      nombre: colegio.nombre,
      email: colegio.email,
      estado: colegio.estado,
    });
  };

  const handleDeleteClick = (colegio) => {
    setColegioToDelete(colegio);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setColegioToDelete(null);
  };

  const handleInfoClick = async (colegio) => {
    try {
      const estudiantesDelColegio = await fetchEstudiantes(colegio.id);

      setInfoColegio({
        nombre: colegio.nombre,
        estudiantes: estudiantesDelColegio
      });
      setOpenInfoDialog(true);
    } catch (error) {
      console.error("Error al cargar estudiantes del colegio:", error);
      setErrorMessage("Error al cargar información de estudiantes");
      setOpenSnackbar(true);
    }
  };

  const handleCloseInfoDialog = () => {
    setOpenInfoDialog(false);
    setInfoColegio(null);
  };

  return (
    <Container>
      <h1>Gestión de Colegio:</h1>
      <form noValidate autoComplete="off">
        <TextField
          label="Nombre del colegio"
          name="nombre"
          value={formValues.nombre}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email del colegio"
          name="email"
          value={formValues.email}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />

        <Box marginTop={2} marginBottom={2}>
          <Switch
            checked={formValues.estado}
            onChange={handleSwitchChange}
            name="estado"
            color="primary"
          />
          Estado Activo
        </Box>

        <Box marginTop={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={selectedColegio ? handleUpdateColegio : handleCreateColegio}
            disabled={!formValues.nombre.trim() || !formValues.email.trim()}
          >
            {selectedColegio ? "Actualizar colegio" : "Crear colegio"}
          </Button>

          {selectedColegio && (
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => {
                setSelectedColegio(null);
                setFormValues({
                  nombre: "",
                  email: "",
                  estado: true,
                });
              }}
              style={{ marginLeft: '10px' }}
            >
              Cancelar Edición
            </Button>
          )}
        </Box>
      </form>

      {/* Busqueda */}
      <TextField
        label="Buscar colegios"
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
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredColegios
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((colegio) => (
                <TableRow key={colegio.id}>
                  <TableCell>{colegio.nombre}</TableCell>
                  <TableCell>{colegio.email}</TableCell>
                  <TableCell>
                    {colegio.estado ? (
                      <Chip label="Activo" color="success" size="small" />
                    ) : (
                      <Chip label="Inactivo" color="error" size="small" />
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditClick(colegio)} color="primary">
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleInfoClick(colegio)} color="primary">
                      <Info />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteClick(colegio)}
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
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredColegios.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

      </TableContainer>

      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Eliminar colegio</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro de que deseas eliminar a {colegioToDelete?.nombre}?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">Cancelar</Button>
          <Button onClick={handleDeleteColegio} color="error">Eliminar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openInfoDialog} onClose={handleCloseInfoDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ backgroundColor: '#1d526eff', color: '#fff', textAlign: 'center' }}>
          Estudiantes de {infoColegio?.nombre}
        </DialogTitle>

        <DialogContent sx={{ padding: '20px' }}>
          {infoColegio && (
            <Box>
              {infoColegio.estudiantes.length > 0 ? (
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
                      {infoColegio.estudiantes.map((estudiante, index) => (
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
                <Typography variant="body1" align="center" sx={{ marginTop: 2 }}>
                  No hay estudiantes registrados en este colegio
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseInfoDialog} variant="contained" color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity={errorMessage ? "error" : "success"}>
          {errorMessage || successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Colegios;
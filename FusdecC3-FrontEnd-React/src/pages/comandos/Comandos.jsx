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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  TablePagination,
  Chip,
} from "@mui/material";
import { Edit, Delete, Info, LocationOn, Assignment, VerifiedUser, History } from "@mui/icons-material";

const token = localStorage.getItem("token");

const Comandos = () => {
  const [comandos, setComandos] = useState([]);
  const [fundaciones, setFundaciones] = useState([]);
  const [brigadasActivas, setBrigadasActivas] = useState([]);
  const [selectedComando, setSelectedComando] = useState(null);
  const [formValues, setFormValues] = useState({
    nombreComando: "",
    ubicacionComando: "",
    estadoComando: true,
    fundacionId: "",
  });
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const [infoComando, setInfoComando] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [successMessage, setSuccessMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchComandos();
    fetchFundaciones();
  }, []);

  const fetchComandos = async () => {
    try {
      const response = await fetch("http://localhost:8080/comandos", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error("Error al obtener comandos");
      const data = await response.json();

      // Obtener nombres de relaciones
      const comandosConNombres = await Promise.all(data.map(async (est) => {
        const fundacionNombre = est.fundacionId ? await getFundacionNombre(est.fundacionId) : "Sin fundacion";

        return {
          ...est,
          fundacionNombre
        };
      }));

      // Condicion que verifica si el arreglo de comandos está vacío
      if (comandosConNombres.length === 0) {
        setErrorMessage("No hay comandos registrados.");
        setOpenSnackbar(true);
        setComandos([]); // esto mantiene el estado vacío para evitar errores
      } else {
        setComandos(comandosConNombres);
      }
    } catch (error) {
      console.error("Error al obtener comandos:", error);
      setErrorMessage("Error al obtener comandos");
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

  const fetchBrigadasActivas = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/comandos/${id}/brigadas-asignadas`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Error al obtener brigadas activas");
      }

      return await response.json();
    } catch (error) {
      console.error("Error:", error);
      return [];
    }
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

  const handleCreateComando = async (e) => {
    e.preventDefault();

    // Validación básica del formulario
    if (!formValues.nombreComando || !formValues.ubicacionComando || !formValues.fundacionId) {
      setErrorMessage("Por favor complete todos los campos obligatorios");
      setOpenSnackbar(true);
      return;
    }

    // Validación link para Google Maps
    if (!isValidGoogleMapsLink(formValues.ubicacionComando)) {
      setErrorMessage("Por favor ingrese un enlace válido de Google Maps");
      setOpenSnackbar(true);
      return;
    }

    try {
      const comandoData = {
        nombreComando: formValues.nombreComando.trim().toLowerCase(),
        ubicacionComando: formValues.ubicacionComando.trim(),
        fundacionId: formValues.fundacionId
      };

      const response = await fetch("http://localhost:8080/comandos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(comandoData),
      });

      const responseData = await response.json().catch(() => ({}));

      if (!response.ok) {
        // Manejo de errores de validación (400 con estructura específica)
        if (response.status === 400 && responseData.errors) {
          const errorMessages = Object.values(responseData.errors).join('\n');
          throw new Error(errorMessages);
        }
        // Manejo de errores de negocio (409 u otros)
        throw new Error(responseData.error || responseData.message || "Error al crear el comando");
      }

      await fetchComandos();
      clearForm(); 

      setSuccessMessage("Comando creado correctamente");
      setOpenSnackbar(true);

    } catch (error) {
      console.error('Error en Crear:', error);
      setErrorMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  const handleUpdateComando = async (e) => {
    e.preventDefault();

    if (!selectedComando) {
      setErrorMessage("No se ha seleccionado ningún comando para actualizar");
      setOpenSnackbar(true);
      return;
    }

    // Validación link para Google Maps si se está actualizando
    if (formValues.ubicacionComando && !isValidGoogleMapsLink(formValues.ubicacionComando)) {
      setErrorMessage("Por favor ingrese un enlace válido de Google Maps");
      setOpenSnackbar(true);
      return;
    }

    try {
      // Preparar datos para actualización
      const updateData = {};
      if (formValues.nombreComando) updateData.nombreComando = formValues.nombreComando.trim().toLowerCase();
      if (formValues.ubicacionComando) updateData.ubicacionComando = formValues.ubicacionComando.trim();
      if (formValues.estadoComando !== undefined) updateData.estadoComando = formValues.estadoComando;
      if (formValues.fundacionId) updateData.fundacionId = formValues.fundacionId;

      // Verificar que hay datos para actualizar
      if (Object.keys(updateData).length === 0) {
        setErrorMessage("No se proporcionaron datos para actualizar");
        setOpenSnackbar(true);
        return;
      }

      const response = await fetch(`http://localhost:8080/comandos/${selectedComando.id}`, {
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
        throw new Error(responseData.error || responseData.message || "Error al actualizar el comando");
      }

      // Éxito - Actualizar estado
      await fetchComandos();
      clearForm();

      setSuccessMessage("Comando actualizado correctamente");
      setOpenSnackbar(true);

    } catch (error) {
      console.error('Error en al actualizar:', error);
      setErrorMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  const handleDeleteComando = async () => {
    if (!selectedComando) return;

    try {
      const response = await fetch(
        `http://localhost:8080/comandos/${selectedComando.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        setComandos(comandos.filter((comando) => comando.id !== selectedComando.id));
        handleCloseDeleteDialog();

        // Muestra un mensaje de éxito
        setSuccessMessage("Comando eliminado exitosamente!");
        setOpenSnackbar(true);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar comando");
      }
    } catch (error) {
      console.error("Error al eliminar comando:", error);
      setErrorMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  const handleEditClick = (comando) => {
    setSelectedComando(comando);
    setFormValues({
      nombreComando: comando.nombreComando || "",
      ubicacionComando: comando.ubicacionComando || "",
      estadoComando: comando.estadoComando !== undefined ? comando.estadoComando : true,
      fundacionId: comando.fundacionId || "",
    });
  };

  // Modifica el handler para abrir el diálogo de información
  const handleInfoClick = async (comando) => {
    setInfoComando(comando);
    setOpenInfoDialog(true);

    // Cargar brigadas activas cuando se abre el diálogo
    const brigadas = await fetchBrigadasActivas(comando.id);
    setBrigadasActivas(brigadas);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedComando(null);
  };

  const handleCloseInfoDialog = () => {
    setOpenInfoDialog(false);
    setInfoComando(null);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setErrorMessage(null);
  };

  const clearForm = () => {
    setFormValues({
      nombreComando: "",
      ubicacionComando: "",
      estadoComando: true,
      fundacionId: ""
    });
    setSelectedComando(null);
  };

  // Función para validar el enlace de Google Maps
  const isValidGoogleMapsLink = (link) => {
    const regex = /^(https?:\/\/)?(www\.)?(google\.com\/maps|maps\.google\.com|maps\.app\.goo\.gl)/;
    return regex.test(link);
  };

  const filteredComandos = comandos.filter((comando) =>
    comando.nombreComando.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comando.ubicacionComando.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (comando.estadoComando ? "Activo" : "Inactivo").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Gestión de Comandos</h1>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12} style={{ paddingLeft: '20px' }}>
          <form noValidate autoComplete="off">
            <TextField
              label="Nombre del Comando"
              name="nombreComando"
              value={formValues.nombreComando}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Ubicación del Comando"
              name="ubicacionComando"
              value={formValues.ubicacionComando}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <Box marginTop={2} marginBottom={2}>
              <Switch
                checked={formValues.estadoComando}
                onChange={handleSwitchChange}
                name="estadoComando"
                color="primary"
              />
              Estado Activo
            </Box>
            <FormControl fullWidth margin="normal">
              <InputLabel id="fundacion-select-label">Fundación</InputLabel>
              <Select
                labelId="fundacion-select-label"
                name="fundacionId"
                value={formValues.fundacionId}
                onChange={handleInputChange}
                required
              >
                {fundaciones.map((fundacion) => (
                  <MenuItem key={fundacion.id} value={fundacion.id}>
                    {fundacion.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box marginTop={3}>
              <Button
                variant="contained"
                color="primary"
                onClick={selectedComando ? handleUpdateComando : handleCreateComando}
                disabled={
                  !formValues.nombreComando.trim() ||
                  !isValidGoogleMapsLink(formValues.ubicacionComando) ||
                  !formValues.fundacionId
                }
              >
                {selectedComando ? "Actualizar Comando" : "Crear Comando"}
              </Button>

              {selectedComando && (
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    setSelectedComando(null);
                    setFormValues({
                      nombreComando: "",
                      ubicacionComando: "",
                      estadoComando: true,
                      fundacionId: ""
                    });
                  }}
                  style={{ marginLeft: '10px' }}
                >
                  Cancelar Edición
                </Button>
              )}
            </Box>
          </form>
        </Grid>
        <Grid item xs={12} md={12}>
          <TextField
            label="Buscar comandos"
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
                  <TableCell>Ubicación</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Fundación</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredComandos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((comando) => (
                  <TableRow key={comando.id}>
                    <TableCell>{comando.nombreComando}</TableCell>
                    <TableCell>{comando.ubicacionComando}</TableCell>
                    <TableCell>{comando.estadoComando ? "Activo" : "Inactivo"}</TableCell>
                    <TableCell>{comando.fundacionNombre || "No asignada"}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEditClick(comando)} color="primary">
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => handleInfoClick(comando)} color="primary">
                        <Info />
                      </IconButton>
                      <IconButton onClick={() => {
                        setSelectedComando(comando);
                        setOpenDeleteDialog(true);
                      }} color="error">
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredComandos.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(event, newPage) => setPage(newPage)}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(parseInt(event.target.value, 10));
                setPage(0);
              }}
            />
          </TableContainer>
        </Grid>
      </Grid>

      {/* Modal de Confirmación de Eliminación */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent dividers>
          <Typography>
            ¿Estás seguro de que quieres eliminar el comando{" "}
            <strong>{selectedComando?.nombreComando}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="default">
            Cancelar
          </Button>
          <Button onClick={handleDeleteComando} color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Información del Comando */}
      <Dialog open={openInfoDialog} onClose={handleCloseInfoDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: '#1d526eff', color: '#fff', textAlign: 'center' }}>
          Información del Comando
        </DialogTitle>
        <DialogContent dividers sx={{ padding: '20px' }}>
          {infoComando && (
            <div>
              {/* Nombre del Comando */}
              <Box display="flex" alignItems="center" mb={2}>
                <Assignment color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Nombre:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>{infoComando.nombreComando || "Nombre no disponible"}</Typography>
              </Box>

              {/* Ubicación del Comando */}
              <Box display="flex" alignItems="center" mb={2}>
                <LocationOn color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Ubicación:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>
                  <a
                    href={infoComando.ubicacionComando}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#3f51b5', textDecoration: 'none' }}
                  >
                    {infoComando.ubicacionComando}
                  </a>
                </Typography>
              </Box>

              {/* Estado del Comando */}
              <Box display="flex" alignItems="center" mb={2}>
                <VerifiedUser color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Estado:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>
                  {infoComando.estadoComando ? "Activo" : "Inactivo"}
                </Typography>
              </Box>

              {/* Fundación del Comando */}
              <Box display="flex" alignItems="center" mb={2}>
                <History color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Fundación:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>
                  {infoComando.fundacionNombre || "No asignada"}
                </Typography>
              </Box>

              {/* Brigadas Asignadas */}
              <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2, mb: 1 }}>
                Brigadas Activas Asignadas
              </Typography>
              {brigadasActivas.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {brigadasActivas.map((nombreBrigada, index) => (
                    <Chip
                      key={index}
                      label={nombreBrigada || "Brigada no encontrada"}
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
                  No hay brigadas activas asignadas
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

      {/* Snackbar para mensajes de error */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={errorMessage ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {errorMessage || successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Comandos;

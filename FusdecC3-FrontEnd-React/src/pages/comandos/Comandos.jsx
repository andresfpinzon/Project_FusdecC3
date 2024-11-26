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


  useEffect(() => {
    fetchComandos();
    //fetchFundaciones();
  }, []);

  const fetchComandos = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/comandos",{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token 
        }
    });
      if (!response.ok) throw new Error("Error al obtener comandos");
      const data = await response.json();
      setComandos(data);
    } catch (error) {
      console.error("Error al obtener comandos:", error);
      setErrorMessage("Error al obtener comandos");
      setOpenSnackbar(true);
    }
  };

  const fetchFundaciones = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/fundaciones");
      if (!response.ok) throw new Error("Error al obtener fundaciones");
      const data = await response.json();
      setFundaciones(data);
    } catch (error) {
      console.error("Error al obtener fundaciones:", error);
      setErrorMessage("Error al obtener fundaciones");
      setOpenSnackbar(true);
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

  const handleCreateComando = async () => {
    // Validar que los campos requeridos no estén vacíos
    if (!formValues.nombreComando || !isValidGoogleMapsLink(formValues.ubicacionComando)) {
        setErrorMessage("Por favor, ingresa un enlace válido de Google Maps en la ubicación.");
        setOpenSnackbar(true);
        return;
    }

    if (!formValues.fundacionId) {
        delete formValues.fundacionId; // Eliminar el campo si está vacío
    }

    try {
      const response = await fetch("http://localhost:3000/api/comandos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token 
        },
        body: JSON.stringify(formValues),
      });

      if (response.ok) {
        const nuevoComando = await response.json();
        setComandos([...comandos, nuevoComando]);
        clearForm();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al crear comando");
      }
    } catch (error) {
      console.error("Error al crear comando:", error);
      setErrorMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  const handleUpdateComando = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/comandos/${selectedComando._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token 
          },
          body: JSON.stringify(formValues),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar comando");
      }

      const comandoActualizado = await response.json();
      setComandos(
        comandos.map((comando) =>
          comando._id === selectedComando._id ? comandoActualizado : comando
        )
      );
      clearForm();
    } catch (error) {
      console.error("Error al actualizar comando:", error);
      setErrorMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  const handleDeleteComando = async () => {
    if (!selectedComando) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/comandos/${selectedComando._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token 
        }
        }
      );

      if (response.ok) {
        setComandos(comandos.filter((comando) => comando._id !== selectedComando._id));
        handleCloseDeleteDialog();
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

  const handleInfoClick = (comando) => {
    setInfoComando(comando);
    setOpenInfoDialog(true);
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
      fundacionId: "",
    });
    setSelectedComando(null);
  };

  // Función para validar el enlace de Google Maps
  const isValidGoogleMapsLink = (link) => {
    const regex = /^(https?:\/\/)?(www\.)?(google\.com\/maps|maps\.google\.com|maps\.app\.goo\.gl)/;
    return regex.test(link);
  };

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
              <InputLabel id="fundacion-select-label">Fundación (Opcional)</InputLabel>
              <Select
                labelId="fundacion-select-label"
                name="fundacionId"
                value={formValues.fundacionId}
                onChange={handleInputChange}
              >
                <MenuItem value="">Ninguna</MenuItem>
                {fundaciones.map((fundacion) => (
                  <MenuItem key={fundacion._id} value={fundacion._id}>
                    {fundacion.nombreFundacion}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              onClick={selectedComando ? handleUpdateComando : handleCreateComando}
            >
              {selectedComando ? "Actualizar Comando" : "Crear Comando"}
            </Button>
          </form>
        </Grid>
        <Grid item xs={12} md={12}>
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
                {comandos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((comando) => (
                  <TableRow key={comando._id}>
                    <TableCell>{comando.nombreComando}</TableCell>
                    <TableCell>{comando.ubicacionComando}</TableCell>
                    <TableCell>{comando.estadoComando ? "Activo" : "Inactivo"}</TableCell>
                    <TableCell>{fundaciones.find(fundacion => fundacion._id === comando.fundacionId)?.nombreFundacion || "No asignada"}</TableCell>
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
              count={comandos.length}
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
          <Button onClick={handleDeleteComando} color="secondary">
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
                    onClick={handleLocationClick}
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
                  {fundaciones.find(fundacion => fundacion._id === infoComando.fundacionId)?.nombreFundacion || "No asignada"}
                </Typography>
              </Box>

              {/* Brigadas Asignadas */}
              <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2, mb: 1 }}>
                Brigadas Asignadas
              </Typography>
              {infoComando.brigadas && infoComando.brigadas.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {infoComando.brigadas.map((brigada) => (
                    <Chip
                      key={brigada._id}
                      label={brigada.nombreBrigada || "Brigada no encontrada"}
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
                  Sin brigadas asignadas
                </Typography>
              )}

              {/* Mostrar el mapa si showMap es true */}
              {showMap && mapLocation && <MapComponent location={mapLocation} />}
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
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Comandos;

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
  Snackbar,
  Alert,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Switch,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  OutlinedInput,
  Box,
  Chip,
  List,
  ListItem,
  ListItemText,
  TablePagination,
} from "@mui/material";
import { Edit, Delete, Info, LocationOn, Group, Assignment, CheckCircle, Cancel, Shield } from "@mui/icons-material";

const token = localStorage.getItem("token");

export default function Brigadas() {
  const [brigadas, setBrigadas] = useState([]);
  const [comandos, setComandos] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [selectedBrigada, setSelectedBrigada] = useState(null);
  const [formValues, setFormValues] = useState({
    nombreBrigada: "",
    ubicacionBrigada: "",
    comandoId: "",
    estadoBrigada: true,
    unidades: [],
  });
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const [infoBrigada, setInfoBrigada] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchBrigadas();
    fetchComandos();
    fetchUnidades();
  }, []);

  const fetchBrigadas = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/brigadas", {
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

  const fetchComandos = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/comandos", {
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

  const fetchUnidades = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/unidades", {
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

  const isValidGoogleMapsLink = (link) => {
    const regex = /^(https?:\/\/)?(www\.)?(google\.com\/maps|maps\.google\.com|maps\.app\.goo\.gl)/;
    return regex.test(link);
  };

  const handleCreateBrigada = async () => {
    if (!formValues.nombreBrigada || !isValidGoogleMapsLink(formValues.ubicacionBrigada)) {
      setErrorMessage("Por favor, ingresa un enlace válido de Google Maps en la ubicación.");
      setOpenSnackbar(true);
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/brigadas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
        body: JSON.stringify(formValues),
      });

      if (response.ok) {
        const nuevaBrigada = await response.json();
        setBrigadas([...brigadas, nuevaBrigada]);
        clearForm();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al crear brigada");
      }
    } catch (error) {
      console.error("Error al crear brigada:", error);
      setErrorMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  const handleUpdateBrigada = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/brigadas/${selectedBrigada._id}`,
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
        const brigadaActualizada = await response.json();
        setBrigadas(
          brigadas.map((brigada) =>
            brigada._id === selectedBrigada._id ? brigadaActualizada : brigada
          )
        );
        clearForm();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar brigada");
      }
    } catch (error) {
      console.error("Error al actualizar brigada:", error);
      setErrorMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  const handleDeleteBrigada = async () => {
    if (!selectedBrigada) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/brigadas/${selectedBrigada._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token 
          }
        }
      );

      if (response.ok) {
        setBrigadas(brigadas.filter((brigada) => brigada._id !== selectedBrigada._id));
        handleCloseDeleteDialog();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar brigada");
      }
    } catch (error) {
      console.error("Error al eliminar brigada:", error);
      setErrorMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  const handleEditClick = (brigada) => {
    setSelectedBrigada(brigada);
    setFormValues({
      nombreBrigada: brigada.nombreBrigada || "",
      ubicacionBrigada: brigada.ubicacionBrigada || "",
      comandoId: brigada.comandoId?._id || "",
      estadoBrigada: brigada.estadoBrigada !== undefined ? brigada.estadoBrigada : true,
    });
  };

  const handleInfoClick = (brigada) => {
    setInfoBrigada(brigada);
    setOpenInfoDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedBrigada(null);
  };

  const handleCloseInfoDialog = () => {
    setOpenInfoDialog(false);
    setInfoBrigada(null);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setErrorMessage(null);
  };

  const clearForm = () => {
    setFormValues({
      nombreBrigada: "",
      ubicacionBrigada: "",
      comandoId: "",
      estadoBrigada: true,
    });
    setSelectedBrigada(null);
  };

  return (
    <Container maxWidth="lg">
      <h1>Gestión de Brigadas</h1>
      <Grid container spacing={2} component="section">
        <Grid item xs={12} md={12}>
          <h2>Información de Brigada</h2>
          <TextField
            label="Nombre de la Brigada"
            name="nombreBrigada"
            value={formValues.nombreBrigada}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Ubicación de la Brigada"
            name="ubicacionBrigada"
            value={formValues.ubicacionBrigada}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="comando-select-label">Comando</InputLabel>
            <Select
              labelId="comando-select-label"
              name="comandoId"
              value={formValues.comandoId}
              onChange={handleInputChange}
              input={<OutlinedInput label="Comando" />}
            >
              {comandos.map((comando) => (
                <MenuItem key={comando._id} value={comando._id}>
                  {comando.nombreComando}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <div>
            <label>Estado de Brigada</label>
            <Switch
              name="estadoBrigada"
              checked={formValues.estadoBrigada}
              onChange={handleSwitchChange}
              color="primary"
            />
          </div>
          <Button
            variant="contained"
            color="primary"
            onClick={selectedBrigada ? handleUpdateBrigada : handleCreateBrigada}
          >
            {selectedBrigada ? "Actualizar Brigada" : "Crear Brigada"}
          </Button>
        </Grid>
        <Grid item xs={12} md={12}>
          <h2>Lista de Brigadas</h2>
          <TableContainer component={Paper} style={{ marginTop: "20px", width: "100%" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Ubicación</TableCell>
                  <TableCell>Comando</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {brigadas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((brigada) => (
                  <TableRow key={brigada._id}>
                    <TableCell>{brigada.nombreBrigada}</TableCell>
                    <TableCell>{brigada.ubicacionBrigada}</TableCell>
                    <TableCell>
                      {brigada.comandoId.nombreComando}
                    </TableCell>
                    <TableCell>{brigada.estadoBrigada ? "Activo" : "Inactivo"}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEditClick(brigada)} color="primary">
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => {
                        setSelectedBrigada(brigada);
                        setOpenDeleteDialog(true);
                      }} color="error">
                        <Delete />
                      </IconButton>
                      <IconButton onClick={() => handleInfoClick(brigada)} color="primary">
                        <Info />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={brigadas.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
          />
        </Grid>
      </Grid>

      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent dividers>
          <Typography>
            ¿Estás seguro de que quieres eliminar la brigada{" "}
            <strong>{selectedBrigada?.nombreBrigada}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="default">
            Cancelar
          </Button>
          <Button onClick={handleDeleteBrigada} color="secondary">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openInfoDialog} onClose={handleCloseInfoDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: '#1d526eff', color: '#fff', textAlign: 'center' }}>
          Información de la Brigada
        </DialogTitle>
        <DialogContent sx={{ padding: '20px' }}>
          {infoBrigada && (
            <div>
              <Box display="flex" alignItems="center" mb={2}>
                <Assignment color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Nombre:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>{infoBrigada.nombreBrigada || "N/A"}</Typography>
              </Box>
              
              <Box display="flex" alignItems="center" mb={2}>
                <LocationOn color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Ubicación:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>
                  <a href={infoBrigada.ubicacionBrigada} target="_blank" rel="noopener noreferrer" style={{ color: '#0288d1' }}>
                    {infoBrigada.ubicacionBrigada || "N/A"}
                  </a>
                </Typography>
              </Box>
              
              <Box display="flex" alignItems="center" mb={2}>
                <Group color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Comando:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>
                  {infoBrigada.comandoId?.nombreComando || "comando no encontrado"}
                </Typography>
              </Box>
              
              <Box display="flex" alignItems="center" mb={2}>
                {infoBrigada.estadoBrigada ? <CheckCircle color="success" sx={{ mr: 1 }} /> : <Cancel color="error" sx={{ mr: 1 }} />}
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Estado:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>
                  {infoBrigada.estadoBrigada ? "Activo" : "Inactivo"}
                </Typography>
              </Box>
              
              <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', mt: 2, mb: 1 }}>
                <Shield sx={{ mr: 1 }} color="primary" />
                Unidades Asignadas
              </Typography>
              {infoBrigada.unidades && infoBrigada.unidades.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-start' }}>
                  {infoBrigada.unidades.map((unidad) => (
                    <Chip
                      key={unidad._id}
                      label={unidad.nombreUnidad || "Unidad no encontrada"}
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
                  Sin unidades asignadas
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
}

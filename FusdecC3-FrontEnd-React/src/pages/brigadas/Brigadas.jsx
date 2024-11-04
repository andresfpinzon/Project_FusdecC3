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
} from "@mui/material";
import { Edit, Delete, Info } from "@mui/icons-material";

const token = localStorage.getItem("token");

export default function Brigadas() {
  const [brigadas, setBrigadas] = useState([]);
  const [comandos, setComandos] = useState([]);
  const [selectedBrigada, setSelectedBrigada] = useState(null);
  const [formValues, setFormValues] = useState({
    nombreBrigada: "",
    ubicacionBrigada: "",
    comandoId: "",
    estadoBrigada: true,
  });
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const [infoBrigada, setInfoBrigada] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    fetchBrigadas();
    fetchComandos();
  }, []);

  const fetchBrigadas = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/brigadas",{
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
      console.log(data); // Verifica que los datos se están obteniendo correctamente
    } catch (error) {
      console.error("Error al obtener comandos:", error);
      setErrorMessage("Error al obtener comandos");
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
      comandoId: brigada.comandoId || "",
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
        <Grid item xs={12} md={4}>
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
        <Grid item xs={12} md={8}>
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
                {brigadas.map((brigada) => (
                  <TableRow key={brigada._id}>
                    <TableCell>{brigada.nombreBrigada}</TableCell>
                    <TableCell>{brigada.ubicacionBrigada}</TableCell>
                    <TableCell>
                      {comandos.find(comando => comando._id === brigada.comandoId)?.nombreComando || "Sin comando"}
                    </TableCell>
                    <TableCell>{brigada.estadoBrigada ? "Activo" : "Inactivo"}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEditClick(brigada)} color="primary">
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => {
                        setSelectedBrigada(brigada);
                        setOpenDeleteDialog(true);
                      }} color="secondary">
                        <Delete />
                      </IconButton>
                      <IconButton onClick={() => handleInfoClick(brigada)} color="default">
                        <Info />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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

      {/* Modal de Información de la Brigada */}
      <Dialog
        open={openInfoDialog}
        onClose={handleCloseInfoDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Información de la Brigada</DialogTitle>
        <DialogContent dividers>
          {infoBrigada && (
            <div>
              <Typography variant="h6">Nombre: {infoBrigada.nombreBrigada}</Typography>
              <Typography variant="body1">
                Ubicación: 
                <a 
                    href={infoBrigada.ubicacionBrigada} 
                    target="_blank" 
                    rel="noopener noreferrer"
                >
                    {infoBrigada.ubicacionBrigada}
                </a>
              </Typography>
              <Typography variant="body1">
                Comando: {comandos.find(comando => comando._id === infoBrigada.comandoId)?.nombreComando || "Sin comando"}
              </Typography>
              <Typography variant="body1">Estado: {infoBrigada.estadoBrigada ? "Activo" : "Inactivo"}</Typography>
              <Typography>Unidad: {infoBrigada?.unidadId?.nombreUnidad || "Unidad no encontrada"}</Typography>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseInfoDialog} color="primary">Cerrar</Button>
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
}

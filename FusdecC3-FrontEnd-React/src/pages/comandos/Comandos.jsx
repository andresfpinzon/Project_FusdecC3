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
} from "@mui/material";
import { Edit, Delete, Info } from "@mui/icons-material";

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

  useEffect(() => {
    fetchComandos();
    //fetchFundaciones();
  }, []);

  const fetchComandos = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/comandos");
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
    if (!formValues.fundacionId) {
      delete formValues.fundacionId; // Eliminar el campo si está vacío
    }

    try {
      const response = await fetch("http://localhost:3000/api/comandos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
          },
          body: JSON.stringify(formValues),
        }
      );

      if (response.ok) {
        const comandoActualizado = await response.json();
        setComandos(
          comandos.map((comando) =>
            comando._id === selectedComando._id ? comandoActualizado : comando
          )
        );
        setFormValues({
          nombreComando: "",
          ubicacionComando: "",
          estadoComando: true,
          fundacionId: "",
          brigadas: [],
        })
        clearForm();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar comando");
      }
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

  return (
    <Container>
      <h1>Gestión de Comandos</h1>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
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
                {comandos.map((comando) => (
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
                      }} color="secondary">
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={12} md={6}>
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
      <Dialog
        open={openInfoDialog}
        onClose={handleCloseInfoDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Información del Comando</DialogTitle>
        <DialogContent dividers>
          {infoComando && (
            <div>
              <Typography variant="h6">Nombre: {infoComando.nombreComando}</Typography>
              <Typography variant="body1">Ubicacion: {infoComando.ubicacionComando}</Typography>
              <Typography variant="body1">Estado: {infoComando.estadoComando ? "Activo" : "Inactivo"}</Typography>
              <Typography variant="body1">Fundación: {fundaciones.find(fundacion => fundacion._id === infoComando.fundacionId)?.nombreFundacion || "No asignada"}</Typography>
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
};

export default Comandos;

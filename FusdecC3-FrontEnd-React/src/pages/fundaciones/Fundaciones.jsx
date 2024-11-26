/* eslint-disable no-unused-vars */
import React, { useState, useEffect }from "react";
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
} from "@mui/material"; 
 import { Edit, Info, Delete} from "@mui/icons-material";

 const token = localStorage.getItem("token");

 export default function Fundaciones() {
  const [fundaciones, setFundaciones] = useState([]);
  const [selectedFundacion, setSelectedFundacion] = useState(null);
  const [formValues, setFormValues] = useState({
    nombreFundacion: "", 
    estadoFundacion: true,
    comando: [],
  });
  
 
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const [infoFundacion, setInfoFundacion] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    fetchFundaciones();
  }, []);

  const fetchFundaciones = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/fundaciones");
      if (!response.ok) throw new Error("Error al obtener fundaciones");
      const data = await response.json();
      setFundaciones(data);
    } catch (error) {
      console.error(error);
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

  const handleCreateFundacion = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/fundaciones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
     });


     if (response.ok) {
      const nuevaFundacion = await response.json();
      setFundaciones([...fundaciones, nuevaFundacion]);
      clearForm();
    } else {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al crear fundacion");
    }
  } catch (error) {
    console.error("Error al crear fundacion:", error);
    setErrorMessage(error.message);
    setOpenSnackbar(true);
  }
};

const handleUpdateFundacion = async () => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/fundaciones/${selectedFundacion._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      }
    );

    if (response.ok) {
        const fundacionActualizada = await response.json();
        setFundaciones(
          fundaciones.map((fundacion) =>
            fundacion._id === selectedFundacion._id ? fundacionActualizada : fundacion
          )
        );
        clearForm();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar fundacion");
      }
    } catch (error) {
      console.error("Error al actualizar fundacion:", error);
      setErrorMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  const handleDeleteFundacion = async () => {
    if (!selectedFundacion) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/fundaciones/${selectedFundacion._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token 
        }
        }
      );

      if (response.ok) {
        setFundaciones(fundaciones.filter((fundacion) => fundacion._id !== selectedFundacion._id));
        handleCloseDeleteDialog();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar fundaacion");
      }
    } catch (error) {
      console.error("Error al eliminar fundacion:", error);
      setErrorMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  const handleEditClick = (fundacion) => {
    setSelectedFundacion(fundacion);
    setFormValues({
      nombreFundacion : fundacion.nombreFundacion || "",
      estadoFundacion: fundacion.estadoFundacion !== undefined ? fundacion.estadoFundacion : true,
      comando: fundacion.comando || [],
    });
  };

  const handleInfoClick = (fundacion) => {
    setInfoFundacion(fundacion);
    setOpenInfoDialog(true);
    console.log("Comando Info:", fundacion.comando);
  };
  
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedFundacion(null);
  };

  const handleCloseInfoDialog = () => {
    setOpenInfoDialog(false);
    setInfoFundacion(null);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setErrorMessage(null);
  };

  const clearForm = () => {
    setFormValues({
      nombreFundacion: "",
      estado: true,
    });
    setSelectedFundacion(null);
  };

  return (
    <Container maxWidth="lg">
      <h1>Gestión de Fundaciones</h1>
      <Grid container spacing={2} component="section">
        <Grid item xs={12} md={6}>
          <h2>Información de Fundacion</h2>
          <TextField
            label="Nombre de la Fundacion"
            name="nombreFundacion"
            value={formValues.nombreFundacion}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <div>
            <label>Estado de Fundacion</label>
            <Switch
              name="estadoFundacion"
              checked={formValues.estadoFundacion}
              onChange={handleSwitchChange}
              color="primary"
            />
          </div>
          <Button
            variant="contained"
            color="primary"
            onClick={selectedFundacion ? handleUpdateFundacion : handleCreateFundacion}
          >
            {selectedFundacion ? "Actualizar Fundacion" : "Crear Fundacion"}
          </Button>
        </Grid>
        <Grid item xs={12} md={6}>
        <h2>Lista de Fundaciones</h2>
          <TableContainer component={Paper} style={{ marginTop: "20px" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fundaciones.map((fundacion) => (
                  <TableRow key={fundacion._id}>
                    <TableCell>{fundacion.nombreFundacion}</TableCell>
                    <TableCell>{fundacion.estadoFundacion ? "Activo" : "Inactivo"}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEditClick(fundacion)} color="primary">
                        <Edit />
                        </IconButton>
                      <IconButton onClick={() => {
                        setSelectedFundacion(fundacion);
                        setOpenDeleteDialog(true);
                      }} color="secondary">
                        <Delete />
                      </IconButton>
                      <IconButton onClick={() => handleInfoClick(fundacion)} color="default">
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
        open={openDeleteDialog} onClose={handleCloseDeleteDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Eliminar Fundacion</DialogTitle>
        <DialogContent dividers>
          <Typography>
            ¿Estás seguro de que quieres eliminar la Fundacion?{" "}
            <strong>{selectedFundacion?.nombreFundacion}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="default">
            Cancelar
          </Button>
          <Button onClick={handleDeleteFundacion} color="secondary">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Información de la Fundacion */}
      <Dialog
        open={openInfoDialog}
        onClose={handleCloseInfoDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Información de la Fundacion</DialogTitle>
        <DialogContent dividers>
          {infoFundacion && (
            <div>
              <Typography variant="h6">Nombre: {infoFundacion.nombreFundacion}</Typography>
              <Typography variant="body1">
                Comandos: {infoFundacion.comando?.map((co) => co.nombreComando).join(", ") || "Sin comando"}
              </Typography>
              <Typography variant="body1">Estado: {infoFundacion.estadoFundacion ? "Activo" : "Inactivo"}</Typography>
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





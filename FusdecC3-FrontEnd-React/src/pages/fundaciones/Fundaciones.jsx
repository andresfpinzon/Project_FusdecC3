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
  TablePagination,
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
  const [successMessage, setSuccessMessage] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  
  // Paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchFundaciones();
  }, []);

  const fetchFundaciones = async () => {
    try {
        const response = await fetch("http://localhost:3000/api/fundaciones",{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token 
        }
      });
        // Verifica si la respuesta es OK
        if (!response.ok) {
            throw new Error(`Error al obtener fundaciones: ${response.statusText}`);
        }

        // Verifica si la respuesta tiene contenido
        const text = await response.text();
        if (!text) {
            throw new Error("La respuesta está vacía");
        }

        const data = JSON.parse(text); // Intenta convertir el texto a JSON
        setFundaciones(data);
    } catch (error) {
        console.error("Error al obtener fundaciones:", error);
        setErrorMessage(error.message);
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
            "Authorization": token 
        },
        body: JSON.stringify({
          nombreFundacion: formValues.nombreFundacion,
          estadoFundacion: formValues.estadoFundacion,
          comando: formValues.comando,
        }),
      });

      if (response.ok) {
        const nuevaFundacion = await response.json();
        setFundaciones([...fundaciones, nuevaFundacion]);
        clearForm();
        setSuccessMessage("Fundación guardada exitosamente!");
        setErrorMessage(null);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al crear fundacion");
      }
    } catch (error) {
      console.error("Error al crear fundacion:", error);
      setErrorMessage(error.message);
      setSuccessMessage(null);
    } finally {
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
            "Authorization": token 
            
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
        setSuccessMessage("Fundación actualizada exitosamente!");
        setErrorMessage(null);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar fundacion");
      }
    } catch (error) {
      console.error("Error al actualizar fundacion:", error);
      setErrorMessage(error.message);
      setSuccessMessage(null);
    } finally {
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
        setSuccessMessage("Fundación eliminada exitosamente!");
        setErrorMessage(null);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar fundacion");
      }
    } catch (error) {
      console.error("Error al eliminar fundacion:", error);
      setErrorMessage(error.message);
      setSuccessMessage(null);
    } finally {
      setOpenSnackbar(true);
    }
  };

  const handleEditClick = (fundacion) => {
    setSelectedFundacion(fundacion);
    setFormValues({
      nombreFundacion: fundacion.nombreFundacion || "",
      estadoFundacion: fundacion.estadoFundacion,
      comando: fundacion.comando || [],
    });
  };

  const handleInfoClick = (fundacion) => {
    setInfoFundacion(fundacion);
    setOpenInfoDialog(true);
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
    setSuccessMessage(null);
  };

  const clearForm = () => {
    setFormValues({
      nombreFundacion: "",
      estadoFundacion: true,
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
        <Grid item xs={12} md={12}>
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
                {fundaciones.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((fundacion) => (
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
                      }} color="error">
                        <Delete />
                      </IconButton>
                      <IconButton onClick={() => handleInfoClick(fundacion)} color="primary">
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
            count={fundaciones.length}
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

      {/* Snackbar para mensajes de éxito y error */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        {successMessage ? (
          <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
            {successMessage}
          </Alert>
        ) : (
          <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: "100%" }}>
            {errorMessage}
          </Alert>
        )}
      </Snackbar>

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
          <Button onClick={handleDeleteFundacion} color="error">
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
    </Container>
  );
}





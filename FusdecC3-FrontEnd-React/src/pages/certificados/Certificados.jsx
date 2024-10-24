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
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const Certificados = () => {
  const [certificados, setCertificados] = useState([]);
  const [selectedCertificado, setSelectedCertificado] = useState(null);
  const [formValues, setFormValues] = useState({
    nombre: "",
    fechaEmision: "",
    usuarioId: "",
    cursoId: "",
    estudianteId: "",
    nombreEmisorCertificado: "",
    codigoVerificacion: "",
  });
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    fetchCertificados();
  }, []);

  const fetchCertificados = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/certificados");
      if (!response.ok) throw new Error("Error al obtener certificados");
      const data = await response.json();
      setCertificados(data);
    } catch (error) {
      console.error("Error al obtener certificados:", error);
      setErrorMessage("Error al obtener certificados");
      setOpenSnackbar(true);
    }
  };

  const handleInputChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateCertificado = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/certificados", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });

      if (response.ok) {
        const nuevoCertificado = await response.json();
        setCertificados([...certificados, nuevoCertificado]);
        clearForm();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al crear certificado");
      }
    } catch (error) {
      console.error("Error al crear certificado:", error);
      setErrorMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  const handleUpdateCertificado = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/certificados/${selectedCertificado._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formValues),
        }
      );

      if (response.ok) {
        const certificadoActualizado = await response.json();
        setCertificados(
          certificados.map((certificado) =>
            certificado._id === selectedCertificado._id ? certificadoActualizado : certificado
          )
        );
        clearForm();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar certificado");
      }
    } catch (error) {
      console.error("Error al actualizar certificado:", error);
      setErrorMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  const handleDeleteCertificado = async () => {
    if (!selectedCertificado) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/certificados/${selectedCertificado._id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setCertificados(certificados.filter((certificado) => certificado._id !== selectedCertificado._id));
        handleCloseDeleteDialog(); // Cierra el modal de confirmación después de eliminar
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar certificado");
      }
    } catch (error) {
      console.error("Error al eliminar certificado:", error);
      setErrorMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  const handleEditClick = (certificado) => {
    setSelectedCertificado(certificado);
    setFormValues({
      nombre: certificado.nombre || "",
      fechaEmision: certificado.fechaEmision || "",
      usuarioId: certificado.usuarioId || "",
      cursoId: certificado.cursoId || "",
      estudianteId: certificado.estudianteId || "",
      nombreEmisorCertificado: certificado.nombreEmisorCertificado || "",
      codigoVerificacion: certificado.codigoVerificacion || "",
    });
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedCertificado(null);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setErrorMessage(null);
  };

  const clearForm = () => {
    setFormValues({
      nombre: "",
      fechaEmision: "",
      usuarioId: "",
      cursoId: "",
      estudianteId: "",
      nombreEmisorCertificado: "",
      codigoVerificacion: "",
    });
    setSelectedCertificado(null);
  };

  return (
    <Container>
      <h1>Gestión de Certificados</h1>
      <form noValidate autoComplete="off">
        <TextField
          label="Nombre"
          name="nombre"
          value={formValues.nombre}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Fecha de Emisión"
          name="fechaEmision"
          type="date"
          value={formValues.fechaEmision}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="Usuario ID"
          name="usuarioId"
          value={formValues.usuarioId}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Curso ID"
          name="cursoId"
          value={formValues.cursoId}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Estudiante ID"
          name="estudianteId"
          value={formValues.estudianteId}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Nombre del Emisor"
          name="nombreEmisorCertificado"
          value={formValues.nombreEmisorCertificado}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Código de Verificación"
          name="codigoVerificacion"
          value={formValues.codigoVerificacion}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={selectedCertificado ? handleUpdateCertificado : handleCreateCertificado}
        >
          {selectedCertificado ? "Actualizar Certificado" : "Crear Certificado"}
        </Button>
      </form>
      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Fecha de Emisión</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {certificados.map((certificado) => (
              <TableRow key={certificado._id}>
                <TableCell>{certificado.nombre}</TableCell>
                <TableCell>{new Date(certificado.fechaEmision).toLocaleDateString()}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditClick(certificado)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => {
                    setSelectedCertificado(certificado);
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
            ¿Estás seguro de que quieres eliminar el certificado{" "}
            <strong>{selectedCertificado?.nombre}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="default">
            Cancelar
          </Button>
          <Button onClick={handleDeleteCertificado} color="secondary">
            Eliminar
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

export default Certificados;
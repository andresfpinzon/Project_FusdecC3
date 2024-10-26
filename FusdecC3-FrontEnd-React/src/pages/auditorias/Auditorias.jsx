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
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  OutlinedInput,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";
import { Delete } from "@mui/icons-material";

const Auditorias = () => {
  const [formValues, setFormValues] = useState({
    fechaAuditoria: "",
    nombreEmisor: "",
    certificadoId: "",
  });
  const [certificados, setCertificados] = useState([]);
  const [auditorias, setAuditorias] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [auditoriaToDelete, setAuditoriaToDelete] = useState(null);
  const [auditoriaDetails, setAuditoriaDetails] = useState(null);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  useEffect(() => {
    fetchCertificados();
    fetchAuditorias();
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

  const fetchAuditorias = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/auditorias");
      if (!response.ok) throw new Error("Error al obtener auditorías");
      const data = await response.json();
      setAuditorias(data);
    } catch (error) {
      console.error("Error al obtener auditorías:", error);
      setErrorMessage("Error al obtener auditorías");
      setOpenSnackbar(true);
    }
  };

  const handleInputChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateAuditoria = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/auditorias", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });
      if (!response.ok) throw new Error("Error al crear auditoría");
      const newAuditoria = await response.json();
      setAuditorias([...auditorias, newAuditoria]);
      setFormValues({ fechaAuditoria: "", nombreEmisor: "", certificadoId: "" });
    } catch (error) {
      console.error("Error al crear auditoría:", error);
      setErrorMessage("Error al crear auditoría");
      setOpenSnackbar(true);
    }
  };

  const handleDeleteAuditoria = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/auditorias/${auditoriaToDelete._id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Error al eliminar auditoría");
      setAuditorias(auditorias.filter(auditoria => auditoria._id !== auditoriaToDelete._id));
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error("Error al eliminar auditoría:", error);
      setErrorMessage("Error al eliminar auditoría");
      setOpenSnackbar(true);
    }
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleOpenDetailsDialog = (auditoria) => {
    setAuditoriaDetails(auditoria);
    setOpenDetailsDialog(true);
  };

  const handleCloseDetailsDialog = () => {
    setOpenDetailsDialog(false);
    setAuditoriaDetails(null);
  };

  // Función para obtener el nombre del certificado
  const getCertificadoNombre = (certificadoId) => {
    const certificado = certificados.find(cert => cert._id === certificadoId);
    return certificado ? certificado.nombre : "Nombre no disponible";
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Crear Auditoría
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="certificado-label">Certificado</InputLabel>
            <Select
              labelId="certificado-label"
              name="certificadoId"
              value={formValues.certificadoId}
              onChange={handleInputChange}
              input={<OutlinedInput label="Certificado" />}
            >
              {certificados.map((certificado) => (
                <MenuItem key={certificado._id} value={certificado._id}>
                  {certificado.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Nombre del Emisor"
            name="nombreEmisor"
            value={formValues.nombreEmisor}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Fecha de Auditoría"
            name="fechaAuditoria"
            type="date"
            value={formValues.fechaAuditoria}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateAuditoria}
          >
            Crear Auditoría
          </Button>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>
            Lista de Auditorías
          </Typography>
          <TableContainer component={Paper} style={{ marginTop: "20px" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Emisor</TableCell>
                  <TableCell>Certificado</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {auditorias.map((auditoria) => (
                  <TableRow key={auditoria._id}>
                    <TableCell>{new Date(auditoria.fechaAuditoria).toLocaleDateString("es-ES")}</TableCell>
                    <TableCell>{auditoria.nombreEmisor}</TableCell>
                    <TableCell>{getCertificadoNombre(auditoria.certificadoId)}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpenDetailsDialog(auditoria)} color="primary">
                        Detalles
                      </IconButton>
                      <IconButton onClick={() => {
                        setAuditoriaToDelete(auditoria);
                        setOpenDeleteDialog(true);
                      }} color="error">
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      {/* Snackbar para mensajes de error */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>

      {/* Diálogo de confirmación de eliminación */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar esta auditoría?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="default">
            Cancelar
          </Button>
          <Button onClick={handleDeleteAuditoria} color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de detalles de auditoría */}
      <Dialog
        open={openDetailsDialog}
        onClose={handleCloseDetailsDialog}
      >
        <DialogTitle>Detalles de la Auditoría</DialogTitle>
        <DialogContent>
          {auditoriaDetails && (
            <div>
              <Typography><strong>Fecha:</strong> {new Date(auditoriaDetails.fechaAuditoria).toLocaleDateString("es-ES")}</Typography>
              <Typography><strong>Emisor:</strong> {auditoriaDetails.nombreEmisor}</Typography>
              <Typography><strong>Certificado:</strong> {getCertificadoNombre(auditoriaDetails.certificadoId)}</Typography>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailsDialog} color="default">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Auditorias;

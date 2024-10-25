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
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const Auditorias = () => {
  const [auditorias, setAuditorias] = useState([]);
  const [certificados, setCertificados] = useState([]);
  const [selectedAuditoria, setSelectedAuditoria] = useState(null);
  const [formValues, setFormValues] = useState({
    fechaAuditoria: "",
    nombreEmisor: "",
    certificadoId: "",
    estadoAuditoria: true,
  });
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const [infoAuditoria, setInfoAuditoria] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    fetchAuditorias();
    fetchCertificados();
  }, []);

  const fetchAuditorias = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/auditorias");
      if (!response.ok) throw new Error("Error al obtener auditorías");
      const data = await response.json();
      setAuditorias(data);
    } catch (error) {
      setErrorMessage("Error al obtener auditorías");
      setOpenSnackbar(true);
    }
  };

  const fetchCertificados = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/certificados");
      if (!response.ok) throw new Error("Error al obtener certificados");
      const data = await response.json();
      setCertificados(data);
    } catch (error) {
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

  const handleSwitchChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.checked,
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

      if (response.ok) {
        const nuevaAuditoria = await response.json();
        setAuditorias((prev) => [...prev, nuevaAuditoria]);
        clearForm();
      } else {
        throw new Error("Error al crear auditoría");
      }
    } catch (error) {
      setErrorMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  const handleUpdateAuditoria = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/auditorias/${selectedAuditoria._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });

      if (response.ok) {
        const auditoriaActualizada = await response.json();
        setAuditorias((prev) =>
          prev.map((auditoria) =>
            auditoria._id === selectedAuditoria._id ? auditoriaActualizada : auditoria
          )
        );
        clearForm();
      } else {
        throw new Error("Error al actualizar auditoría");
      }
    } catch (error) {
      setErrorMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  const handleDeleteAuditoria = async () => {
    if (!selectedAuditoria) return;

    try {
      const response = await fetch(`http://localhost:3000/api/auditorias/${selectedAuditoria._id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setAuditorias((prev) => prev.filter((auditoria) => auditoria._id !== selectedAuditoria._id));
        handleCloseDeleteDialog();
      } else {
        throw new Error("Error al eliminar auditoría");
      }
    } catch (error) {
      setErrorMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  const handleEditClick = (auditoria) => {
    setSelectedAuditoria(auditoria);
    setFormValues({
      fechaAuditoria: auditoria.fechaAuditoria || "",
      nombreEmisor: auditoria.nombreEmisor || "",
      certificadoId: auditoria.certificadoId || "",
      estadoAuditoria: auditoria.estadoAuditoria !== undefined ? auditoria.estadoAuditoria : true,
    });
  };

  const handleInfoClick = (auditoria) => {
    setInfoAuditoria(auditoria);
    setOpenInfoDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedAuditoria(null);
  };

  const handleCloseInfoDialog = () => {
    setOpenInfoDialog(false);
    setInfoAuditoria(null);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setErrorMessage(null);
  };

  const clearForm = () => {
    setFormValues({
      fechaAuditoria: "",
      nombreEmisor: "",
      certificadoId: "",
      estadoAuditoria: true,
    });
    setSelectedAuditoria(null);
  };

  return (
    <Container maxWidth="lg">
      <h1>Gestión de Auditorías</h1>
      <Grid container spacing={2} component="section">
        <Grid item xs={12} md={6}>
          <h2>Información de Auditoría</h2>
          <TextField
            label="Fecha de Auditoría"
            name="fechaAuditoria"
            type="date"
            value={formValues.fechaAuditoria}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Nombre del Emisor"
            name="nombreEmisor"
            value={formValues.nombreEmisor}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="certificado-select-label">Certificado</InputLabel>
            <Select
              labelId="certificado-select-label"
              name="certificadoId"
              value={formValues.certificadoId}
              onChange={handleInputChange}
            >
              {certificados.map((certificado) => (
                <MenuItem key={certificado._id} value={certificado._id}>
                  {certificado.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <div>
            <label>Estado de Auditoría</label>
            <Switch
              name="estadoAuditoria"
              checked={formValues.estadoAuditoria}
              onChange={handleSwitchChange}
              color="primary"
            />
          </div>
          <Button
            variant="contained"
            color="primary"
            onClick={selectedAuditoria ? handleUpdateAuditoria : handleCreateAuditoria}
          >
            {selectedAuditoria ? "Actualizar Auditoría" : "Crear Auditoría"}
          </Button>
        </Grid>
        <Grid item xs={12} md={6}>
          <h2>Lista de Auditorías</h2>
          <TableContainer component={Paper} style={{ marginTop: "20px" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Emisor</TableCell>
                  <TableCell>Certificado</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {auditorias.map((auditoria) => (
                  <TableRow key={auditoria._id}>
                    <TableCell>
                      {new Date(auditoria.fechaAuditoria).toLocaleDateString("es-ES")}
                    </TableCell>
                    <TableCell>{auditoria.nombreEmisor}</TableCell>
                    <TableCell>{auditoria.certificadoId?.nombre || "Sin certificado"}</TableCell>
                    <TableCell>
                      {auditoria.estadoAuditoria ? "Activo" : "Inactivo"}
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEditClick(auditoria)} color="primary">
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => {
                        setSelectedAuditoria(auditoria);
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
            ¿Estás seguro de que quieres eliminar la auditoría <strong>{selectedAuditoria?.nombreEmisor}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="default">
            Cancelar
          </Button>
          <Button onClick={handleDeleteAuditoria} color="secondary">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Información de la Auditoría */}
      <Dialog
        open={openInfoDialog}
        onClose={handleCloseInfoDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Información de la Auditoría</DialogTitle>
        <DialogContent dividers>
          {infoAuditoria && (
            <div>
              <Typography variant="h6">Fecha: {new Date(infoAuditoria.fechaAuditoria).toLocaleString()}</Typography>
              <Typography variant="body1">Emisor: {infoAuditoria.nombreEmisor}</Typography>
              <Typography variant="body1">Certificado ID: {infoAuditoria.certificadoId}</Typography>
              <Typography variant="body1">Estado: {infoAuditoria.estadoAuditoria ? "Activo" : "Inactivo"}</Typography>
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

export default Auditorias;

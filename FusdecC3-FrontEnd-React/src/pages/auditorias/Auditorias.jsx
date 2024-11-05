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
import { Delete, Info } from "@mui/icons-material";

const token = localStorage.getItem("token");

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

  //fech de auditorias
  const fetchCertificados = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/certificados",{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token 
        }
    });
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
      const response = await fetch("http://localhost:3000/api/auditorias",
        {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
              "Authorization": token 
          }
      }
      );
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
          "Authorization": token 
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
        headers: {
          "Content-Type": "application/json",
          "Authorization": token 
        },
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
    return certificado ? certificado.codigoVerificacion : "Código no disponible";
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Lista de Auditorías
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TableContainer component={Paper} style={{ marginTop: "20px", width: "100%" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Fecha de Auditoría</TableCell>
                  <TableCell>Nombre del Emisor</TableCell>
                  <TableCell>Código de Verificación</TableCell>
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

      {/* Diálogo de detalles de auditoría */}
      <Dialog
        open={openDetailsDialog}
        onClose={handleCloseDetailsDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Detalles de la Auditoría</DialogTitle>
        <DialogContent>
          {auditoriaDetails && (
            <div>
              <Typography><strong>Fecha:</strong> {new Date(auditoriaDetails.fechaAuditoria).toLocaleDateString("es-ES")}</Typography>
              <Typography><strong>Certificado:</strong> {getCertificadoNombre(auditoriaDetails.certificadoId).codigoVerificacion}</Typography>
              <Typography><strong>Nombre del Emisor:</strong> {auditoriaDetails.nombreEmisor}</Typography>
              <Typography><strong>Descripción:</strong> {auditoriaDetails.descripcion}</Typography>
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

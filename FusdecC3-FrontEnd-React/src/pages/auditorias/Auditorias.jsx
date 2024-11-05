import React, { useState, useEffect } from "react";
import {
  Container,
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
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { Info } from "@mui/icons-material";

const token = localStorage.getItem("token");

const Auditorias = () => {
  const [auditorias, setAuditorias] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [auditoriaDetails, setAuditoriaDetails] = useState(null);

  useEffect(() => {
    fetchAuditorias();
  }, []);

  const fetchAuditorias = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/auditorias", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token,
        },
      });
      if (!response.ok) throw new Error("Error al obtener auditorías");
      const data = await response.json();
      setAuditorias(data);
    } catch (error) {
      console.error("Error al obtener auditorías:", error);
      setErrorMessage("Error al obtener auditorías");
      setOpenSnackbar(true);
    }
  };

  const handleOpenDetailsDialog = (auditoria) => {
    setAuditoriaDetails(auditoria);
    setOpenDetailsDialog(true);
  };

  const handleCloseDetailsDialog = () => {
    setOpenDetailsDialog(false);
    setAuditoriaDetails(null);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom style={{ fontFamily: 'Roboto', fontWeight: 'bold' }}>
        Gestión de Auditorías
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
                    <TableCell>{auditoria.codigoVerificacion}</TableCell>
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
              <Typography><strong>Código de Verificación:</strong> {auditoriaDetails.codigoVerificacion}</Typography>
              <Typography><strong>Nombre del Emisor:</strong> {auditoriaDetails.nombreEmisor}</Typography>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailsDialog} color="default">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para mensajes de error */}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Auditorias;

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
  Snackbar,
  Alert,
  Grid,
  Typography,
  TablePagination,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from "@mui/material";
import { Info } from "@mui/icons-material";

const Auditorias = () => {
  const [auditorias, setAuditorias] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");
  const [selectedAuditoria, setSelectedAuditoria] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAuditorias();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "Fecha no disponible";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES');
    } catch (error) {
      return dateString;
    }
  };

  const fetchAuditorias = async () => {
    try {
      const response = await fetch("http://localhost:8080/auditorias", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error("Error al obtener auditorías");

      const data = await response.json();
      console.log('Datos de auditorías recibidos:', data);
      setAuditorias(data);
    } catch (error) {
      console.error('Error al obtener auditorías:', error);
      setMessage("Error al cargar las auditorías");
      setSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleViewDetails = async (auditoria) => {
    try {
      console.log('Datos de la auditoría:', auditoria);

      // Obtener todos los certificados
      const certificadosResponse = await fetch(`http://localhost:8080/certificados`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!certificadosResponse.ok) {
        throw new Error('No se pudo obtener la información de los certificados');
      }

      const certificados = await certificadosResponse.json();
      // Encontrar el certificado específico
      const certificadoData = certificados.find(cert => cert.id === auditoria.certificadoId);

      if (!certificadoData) {
        throw new Error('No se encontró el certificado asociado');
      }

      console.log('Datos del certificado:', certificadoData);

      // Obtener todos los estudiantes
      const estudiantesResponse = await fetch(`http://localhost:8080/estudiantes`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!estudiantesResponse.ok) {
        throw new Error('No se pudo obtener la información de los estudiantes');
      }

      const estudiantes = await estudiantesResponse.json();
      // Encontrar el estudiante específico por número de documento
      const estudianteData = estudiantes.find(est => est.numeroDocumento === certificadoData.estudianteId);

      if (!estudianteData) {
        throw new Error('No se encontró el estudiante asociado');
      }

      console.log('Datos del estudiante:', estudianteData);

      // Combinar toda la información
      const auditoriaConDetalles = {
        ...auditoria,
        certificadoInfo: {
          estudiante: `${estudianteData.nombre} ${estudianteData.apellido}`,
          documento: estudianteData.numeroDocumento,
          horas: certificadoData.horasCompletadas || "80",
          fecha: certificadoData.fechaEmision,
          codigoVerificacion: certificadoData.codigoVerificacion
        }
      };

      setSelectedAuditoria(auditoriaConDetalles);
      setOpenDialog(true);

    } catch (error) {
      console.error('Error completo al obtener detalles:', error);
      // Mostrar el diálogo con la información básica
      setSelectedAuditoria(auditoria);
      setOpenDialog(true);
      setMessage("No se pudieron cargar todos los detalles del certificado");
      setSeverity("warning");
      setOpenSnackbar(true);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom color="primary">
        Registro de Auditorías
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Emisor</TableCell>
              <TableCell>Certificado ID</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {auditorias
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((auditoria) => (
                <TableRow key={auditoria.id}>
                  <TableCell>{auditoria.id}</TableCell>
                  <TableCell>{formatDate(auditoria.fecha)}</TableCell>
                  <TableCell>{auditoria.nombreEmisor}</TableCell>
                  <TableCell>{auditoria.certificadoId}</TableCell>
                  <TableCell>{auditoria.estado ? "Activo" : "Inactivo"}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleViewDetails(auditoria)}
                      color="primary"
                      title="Ver detalles"
                    >
                      <Info />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={auditorias.length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          labelRowsPerPage="Filas por página"
          rowsPerPageOptions={[10, 25, 50, 100]}
        />
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h5" component="div">
            Detalles de la Auditoría #{selectedAuditoria?.id}
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedAuditoria && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper elevation={2} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom color="primary">
                    Información de la Auditoría
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography><strong>ID de Auditoría:</strong> {selectedAuditoria.id}</Typography>
                      <Typography><strong>Fecha:</strong> {formatDate(selectedAuditoria.fecha)}</Typography>
                      <Typography><strong>Nombre del Emisor:</strong> {selectedAuditoria.nombreEmisor}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography><strong>ID del Certificado:</strong> {selectedAuditoria.certificadoId}</Typography>
                      <Typography><strong>Estado:</strong> {selectedAuditoria.estado ? "Activo" : "Inactivo"}</Typography>
                      <Typography><strong>Fecha de Creación:</strong> {formatDate(selectedAuditoria.createdAt)}</Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {selectedAuditoria.certificadoInfo && (
                <Grid item xs={12}>
                  <Paper elevation={2} sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom color="primary">
                      Información del Certificado
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography><strong>Estudiante:</strong> {selectedAuditoria.certificadoInfo.estudiante}</Typography>
                        <Typography><strong>Documento:</strong> {selectedAuditoria.certificadoInfo.documento}</Typography>
                        <Typography><strong>Horas:</strong> {selectedAuditoria.certificadoInfo.horas}</Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography><strong>Fecha de Emisión:</strong> {formatDate(selectedAuditoria.certificadoInfo.fecha)}</Typography>
                        <Typography><strong>Código de Verificación:</strong> {selectedAuditoria.certificadoInfo.codigoVerificacion}</Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary" variant="contained">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Auditorias;
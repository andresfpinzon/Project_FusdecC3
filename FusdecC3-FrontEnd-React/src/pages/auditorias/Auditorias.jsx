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
  IconButton,
  TextField,
  Box
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
  const [searchTerm, setSearchTerm] = useState("");
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

      <TextField
        label="Buscar Auditorías"
        variant="outlined"
        fullWidth
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2 }}
      />

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
              .filter(auditoria => 
                auditoria.nombreEmisor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                auditoria.id.toString().includes(searchTerm)
              )
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((auditoria) => (
                <TableRow key={auditoria.id} id={`auditoria-row-${auditoria.id}`}>
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
          count={auditorias.filter(auditoria => 
            auditoria.nombreEmisor.toLowerCase().includes(searchTerm.toLowerCase()) || 
            auditoria.id.toString().includes(searchTerm)
          ).length}
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

      {/*pop-up de mas información*/}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle sx={{ 
          backgroundColor: '#1d526eff', 
          color: '#fff', 
          textAlign: 'center',
          padding: '16px 24px',
          fontSize: '1.25rem',
          fontWeight: '500'
        }}>
          Detalles de la Auditoría #{selectedAuditoria?.id}
        </DialogTitle>
        
        <DialogContent sx={{ 
          padding: '20px',
          '&.MuiDialogContent-root': {
            paddingTop: '24px'
          }
        }}>
          {selectedAuditoria && (
            <Box sx={{ marginTop: 1 }}>
              <Grid container spacing={3}>
                {/* Sección de Información de Auditoría */}
                <Grid item xs={12}>
                  <Paper elevation={3} sx={{ 
                    p: 3,
                    borderRadius: '12px',
                    borderLeft: '4px solid #1d526eff'
                  }}>
                    <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: '600' }}>
                      Información de la Auditoría
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography sx={{ mb: 1 }}>
                          <Box component="span" sx={{ fontWeight: '600' }}>ID de Auditoría:</Box> {selectedAuditoria.id}
                        </Typography>
                        <Typography sx={{ mb: 1 }}>
                          <Box component="span" sx={{ fontWeight: '600' }}>Fecha:</Box> {formatDate(selectedAuditoria.fecha)}
                        </Typography>
                        <Typography sx={{ mb: 1 }}>
                          <Box component="span" sx={{ fontWeight: '600' }}>Nombre del Emisor:</Box> {selectedAuditoria.nombreEmisor}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography sx={{ mb: 1 }}>
                          <Box component="span" sx={{ fontWeight: '600' }}>ID del Certificado:</Box> {selectedAuditoria.certificadoId}
                        </Typography>
                        <Typography sx={{ mb: 1 }}>
                          <Box component="span" sx={{ fontWeight: '600' }}>Estado:</Box> 
                          <Box 
                            component="span" 
                            sx={{ 
                              color: selectedAuditoria.estado ? '#2e7d32' : '#d32f2f',
                              fontWeight: '500',
                              ml: 1
                            }}
                          >
                            {selectedAuditoria.estado ? "Activo" : "Inactivo"}
                          </Box>
                        </Typography>
                        <Typography sx={{ mb: 1 }}>
                          <Box component="span" sx={{ fontWeight: '600' }}>Fecha de Creación:</Box> {formatDate(selectedAuditoria.createdAt)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                {/* Sección de Información del Certificado (condicional) */}
                {selectedAuditoria.certificadoInfo && (
                  <Grid item xs={12}>
                    <Paper elevation={3} sx={{ 
                      p: 3,
                      borderRadius: '12px',
                      borderLeft: '4px solid #1d526eff'
                    }}>
                      <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: '600' }}>
                        Información del Certificado
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Typography sx={{ mb: 1 }}>
                            <Box component="span" sx={{ fontWeight: '600' }}>Estudiante:</Box> {selectedAuditoria.certificadoInfo.estudiante}
                          </Typography>
                          <Typography sx={{ mb: 1 }}>
                            <Box component="span" sx={{ fontWeight: '600' }}>Documento:</Box> {selectedAuditoria.certificadoInfo.documento}
                          </Typography>
                          <Typography sx={{ mb: 1 }}>
                            <Box component="span" sx={{ fontWeight: '600' }}>Horas:</Box> {selectedAuditoria.certificadoInfo.horas}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography sx={{ mb: 1 }}>
                            <Box component="span" sx={{ fontWeight: '600' }}>Fecha de Emisión:</Box> {formatDate(selectedAuditoria.certificadoInfo.fecha)}
                          </Typography>
                          <Typography sx={{ mb: 1 }}>
                            <Box component="span" sx={{ fontWeight: '600' }}>Código de Verificación:</Box> 
                            <Box 
                              component="span" 
                              sx={{ 
                                fontFamily: 'monospace',
                                backgroundColor: '#f5f5f5',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                ml: 1
                              }}
                            >
                              {selectedAuditoria.certificadoInfo.codigoVerificacion}
                            </Box>
                          </Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ 
          padding: '16px 24px',
          borderTop: '1px solid rgba(0, 0, 0, 0.12)'
        }}>
          <Button 
            onClick={() => setOpenDialog(false)} 
            variant="contained" 
            color="primary"
            sx={{
              textTransform: 'none',
              fontWeight: '600',
              padding: '8px 20px',
              borderRadius: '8px'
            }}
          >
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
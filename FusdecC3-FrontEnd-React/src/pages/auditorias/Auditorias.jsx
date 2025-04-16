/* eslint-disable no-unused-vars */
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

const token = localStorage.getItem("token");

const Auditorias = () => {
  const [auditorias, setAuditorias] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [selectedAuditoria, setSelectedAuditoria] = useState(null);
  const [openCertificadoDialog, setOpenCertificadoDialog] = useState(false);

  useEffect(() => {
    fetchAuditorias();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "Fecha no disponible";
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString;
      }
      return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  const fetchAuditorias = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/auditorias", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener auditorías");
      }
      
      const data = await response.json();

      if (!Array.isArray(data) || data.length === 0) {
        setErrorMessage("No hay auditorías disponibles");
        setOpenSnackbar(true);
        setAuditorias([]);
        return;
      }

      const auditoriasProcessed = data.map(auditoria => {
        const fechaFormateada = formatDate(auditoria.fechaAuditoria);
        return {
          ...auditoria,
          fechaFormateada,
          certificadoInfo: auditoria.certificadoInfo || null
        };
      });

      setAuditorias(auditoriasProcessed);
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Error al cargar las auditorías");
      setOpenSnackbar(true);
    }
  };

  const handleViewCertificado = async (auditoria) => {
    try {
      if (!auditoria) {
        throw new Error("No se pudo cargar la información del certificado");
      }

      // Primero establecemos la auditoría seleccionada con la información que tenemos
      setSelectedAuditoria(auditoria);
      setOpenCertificadoDialog(true);

      // Si ya tenemos la información del certificado completa, no necesitamos hacer la petición
      if (auditoria.certificadoInfo?.estudianteInfo) {
        return;
      }

      // Obtenemos el ID del certificado
      const certificadoId = typeof auditoria.certificadoId === 'object' ? 
        auditoria.certificadoId._id : auditoria.certificadoId;

      if (!certificadoId) {
        throw new Error("ID del certificado no disponible");
      }

      // Obtenemos la información detallada del certificado
      const certResponse = await fetch(`http://localhost:3000/api/certificados/${certificadoId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!certResponse.ok) {
        throw new Error("Error al obtener detalles del certificado");
      }

      const certificado = await certResponse.json();
      
      // Actualizamos la auditoría seleccionada con la información completa
      setSelectedAuditoria(prev => ({
        ...prev,
        certificadoInfo: {
          ...certificado,
          fechaEmision: formatDate(certificado.fechaEmision),
          estudianteInfo: certificado.estudianteId || { nombreEstudiante: "No disponible" }
        }
      }));

    } catch (error) {
      console.error("Error:", error);
      setErrorMessage(error.message || "Error al cargar los detalles del certificado");
      setOpenSnackbar(true);
    }
  };

  const handleCloseCertificadoDialog = () => {
    setOpenCertificadoDialog(false);
    setSelectedAuditoria(null);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography
        variant="h4"
        style={{
          marginBottom: "20px",
          color: "#1976d2",
          fontWeight: "bold",
        }}
      >
        Registro de Auditorías
      </Typography>

      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Fecha</TableCell>
              <TableCell>Emisor</TableCell>
              <TableCell>Código de Verificación</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {auditorias
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((auditoria) => (
                <TableRow key={auditoria._id}>
                  <TableCell>{auditoria.fechaFormateada}</TableCell>
                  <TableCell>{auditoria.nombreEmisor}</TableCell>
                  <TableCell>
                    {auditoria.certificadoId?.codigoVerificacion || "No disponible"}
                  </TableCell>
                  <TableCell>
                    {auditoria.estadoAuditoria ? "Activo" : "Inactivo"}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleViewCertificado(auditoria)}
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
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={auditorias.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
          labelRowsPerPage="Filas por página:"
        />
      </TableContainer>

      <Dialog 
        open={openCertificadoDialog} 
        onClose={handleCloseCertificadoDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
            Detalles de la Auditoría
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedAuditoria && (
            <div>
              {/* Información de la Auditoría */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>
                    Información de la Auditoría
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography><strong>Fecha:</strong> {selectedAuditoria.fechaFormateada}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography><strong>Emisor:</strong> {selectedAuditoria.nombreEmisor}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>
                    <strong>Estado:</strong> {selectedAuditoria.estadoAuditoria ? "Activo" : "Inactivo"}
                  </Typography>
                </Grid>
              </Grid>

              {/* Información del Certificado */}
              {selectedAuditoria.certificadoInfo && (
                <>
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>
                        Información del Certificado
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography>
                        <strong>Código de Verificación:</strong> {selectedAuditoria.certificadoInfo.codigoVerificacion || "No disponible"}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography>
                        <strong>Fecha de Emisión:</strong> {formatDate(selectedAuditoria.certificadoInfo.fechaEmision)}
                      </Typography>
                    </Grid>
                  </Grid>

                  {/* Información del Estudiante */}
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>
                        Información del Estudiante
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography>
                        <strong>Nombre:</strong> {selectedAuditoria.certificadoInfo.estudianteInfo?.nombreEstudiante || "No disponible"}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography>
                        <strong>Identificación:</strong> {selectedAuditoria.certificadoInfo.estudianteInfo?.identificacion || "No disponible"}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography>
                        <strong>Email:</strong> {selectedAuditoria.certificadoInfo.estudianteInfo?.email || "No disponible"}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography>
                        <strong>Teléfono:</strong> {selectedAuditoria.certificadoInfo.estudianteInfo?.telefono || "No disponible"}
                      </Typography>
                    </Grid>
                  </Grid>
                </>
              )}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCloseCertificadoDialog}
            variant="contained"
            color="primary"
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message={errorMessage}
      />
    </Container>
  );
};

export default Auditorias;

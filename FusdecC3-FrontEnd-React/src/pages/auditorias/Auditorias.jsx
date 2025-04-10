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
  DialogContentText,
  DialogActions,
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
    
    // If the date is already in DD/MM/YYYY format, return it as is
    if (dateString.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      return dateString;
    }

    // Otherwise, try to parse and format the date
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString; // If parsing fails, return original string
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

      // Process each auditoria
      const auditoriasProcessed = data.map(auditoria => {
        const fechaFormateada = formatDate(auditoria.fechaAuditoria);
        console.log('Procesando auditoria:', auditoria); // Debug log
        return {
          ...auditoria,
          fechaFormateada,
          certificado: auditoria.certificadoInfo || null
        };
      });

      console.log('Auditorias procesadas:', auditoriasProcessed); // Debug log
      setAuditorias(auditoriasProcessed);
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Error al cargar las auditorías");
      setOpenSnackbar(true);
    }
  };

  const handleViewCertificado = async (auditoria) => {
    try {
      setSelectedAuditoria(auditoria);
      setOpenCertificadoDialog(true);

      // If we already have the certificate info in the audit, use it
      if (auditoria.certificadoInfo) {
        return;
      }

      // Get the certificate ID correctly
      const certificadoId = typeof auditoria.certificadoId === 'object' ? 
        auditoria.certificadoId._id : auditoria.certificadoId;

      if (!certificadoId) {
        throw new Error("ID del certificado no disponible");
      }

      console.log("Obteniendo certificado con ID:", certificadoId); // Debug log

      // If we don't have certificate info, fetch it
      const certResponse = await fetch(`http://localhost:3000/api/certificados/${certificadoId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!certResponse.ok) {
        const errorText = await certResponse.text();
        throw new Error(errorText || "Error al obtener detalles del certificado");
      }

      const certificado = await certResponse.json();
      console.log("Certificado obtenido:", certificado); // Debug log
      
      setSelectedAuditoria(prev => ({
        ...prev,
        certificadoInfo: {
          ...certificado,
          fechaEmision: formatDate(certificado.fechaEmision)
        }
      }));

    } catch (error) {
      console.error("Error completo al obtener detalles:", error);
      setErrorMessage(error.message || "Error al cargar los detalles del certificado");
      setOpenSnackbar(true);
      handleCloseCertificadoDialog();
    }
  };

  const handleCloseCertificadoDialog = () => {
    setOpenCertificadoDialog(false);
    setSelectedAuditoria(null);
  };

  return (
    <Container>
      <Typography
        variant="h4"
        style={{
          fontFamily: 'Times New Roman, serif',
          fontWeight: 'bold',
          color: '#000',
          marginBottom: '20px'
        }}
      >
        Gestión de Auditorías
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TableContainer component={Paper} style={{ marginTop: "20px", width: "100%", borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            <Table>
              <TableHead style={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Emisor</TableCell>
                  <TableCell>Código de Verificación</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {auditorias
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((auditoria) => (
                    <TableRow key={auditoria._id}>
                      <TableCell>{auditoria.fechaFormateada || 'Fecha no disponible'}</TableCell>
                      <TableCell>{auditoria.certificadoInfo?.nombreEmisorCertificado || auditoria.nombreEmisor || 'No disponible'}</TableCell>
                      <TableCell>
                        {auditoria.certificadoInfo?.codigoVerificacion || 'No disponible'}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          startIcon={<Info />}
                          onClick={() => handleViewCertificado(auditoria)}
                        >
                          Ver Detalles
                        </Button>
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
            />
          </TableContainer>
        </Grid>
      </Grid>

      <Dialog 
        open={openCertificadoDialog} 
        onClose={handleCloseCertificadoDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Detalles del Certificado</DialogTitle>
        <DialogContent>
          {selectedAuditoria ? (
            <DialogContentText>
              {selectedAuditoria.certificadoInfo ? (
                <>
                  <Typography variant="h6" gutterBottom>Información del Estudiante</Typography>
                  <strong>Nombre:</strong> {selectedAuditoria.certificadoInfo.estudianteInfo?.nombreEstudiante || 'No disponible'}<br />
                  <strong>Identificación:</strong> {selectedAuditoria.certificadoInfo.estudianteInfo?.identificacion || 'No disponible'}<br />
                  <strong>Tipo de Documento:</strong> {selectedAuditoria.certificadoInfo.estudianteInfo?.tipoDocumento || 'No disponible'}<br />
                  <strong>Género:</strong> {selectedAuditoria.certificadoInfo.estudianteInfo?.generoEstudiante || 'No disponible'}<br />
                  <strong>Colegio:</strong> {selectedAuditoria.certificadoInfo.estudianteInfo?.colegio || 'No disponible'}<br />
                  
                  <Typography variant="h6" style={{ marginTop: '20px' }} gutterBottom>Información del Certificado</Typography>
                  <strong>Código de Verificación:</strong> {selectedAuditoria.certificadoInfo.codigoVerificacion || 'No disponible'}<br />
                  <strong>Fecha de Emisión:</strong> {formatDate(selectedAuditoria.certificadoInfo.fechaEmision) || 'No disponible'}<br />
                  <strong>Emisor:</strong> {selectedAuditoria.certificadoInfo.nombreEmisorCertificado || selectedAuditoria.nombreEmisor || 'No disponible'}<br />
                  <strong>Estado:</strong> {selectedAuditoria.certificadoInfo.estadoCertificado ? 'Activo' : 'Inactivo'}<br />
                </>
              ) : (
                <Typography color="error">No se pudo cargar la información del certificado</Typography>
              )}
              
              <Typography variant="h6" style={{ marginTop: '20px' }} gutterBottom>Información de la Auditoría</Typography>
              <strong>Fecha de Auditoría:</strong> {selectedAuditoria.fechaFormateada}<br />
              <strong>Emisor de Auditoría:</strong> {selectedAuditoria.nombreEmisor}<br />
            </DialogContentText>
          ) : (
            <DialogContentText>
              Cargando información...
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCertificadoDialog}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Auditorias;

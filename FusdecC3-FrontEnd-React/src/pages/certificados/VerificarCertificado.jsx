import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  Snackbar,
  Alert
} from '@mui/material';
import jsPDF from 'jspdf';

const VerificarCertificado = () => {
  const [documento, setDocumento] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('info');

  const handleVerificar = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/estudiantes/verificar/${documento}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Certificado no encontrado');
      }

      const estudiante = await response.json();
      
      // Generate certificate if student is found
      generateCertificate(estudiante);
      
      setMessage('Certificado encontrado y descargado');
      setSeverity('success');
    } catch (error) {
      setMessage(error.message);
      setSeverity('error');
    }
    setOpenSnackbar(true);
  };

  const generateCertificate = (estudiante) => {
    // Use the same certificate generation logic as in Certificados.jsx
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "letter"
    });

    // Header
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text("FUNDACIÓN SOCORRISTAS DE COLOMBIA", pdf.internal.pageSize.width / 2, 80, { align: "center" });
    // ... rest of the certificate generation code

    const fileName = `certificado_${estudiante.nombreEstudiante}_${estudiante.apellidoEstudiante}.pdf`;
    pdf.save(fileName);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" color="primary" gutterBottom>
            Verificar Certificado
          </Typography>
          <Typography variant="body1" gutterBottom>
            Digite su número de documento para verificar su certificado
          </Typography>
        </Box>

        <TextField
          fullWidth
          label="Número de documento"
          value={documento}
          onChange={(e) => setDocumento(e.target.value)}
          margin="normal"
          variant="outlined"
        />

        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleVerificar}
          sx={{ mt: 2 }}
        >
          Verificar
        </Button>
      </Paper>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity={severity} onClose={() => setOpenSnackbar(false)}>
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default VerificarCertificado;
import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import {
  Container,
  TextField,
  Button,
  Grid,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Box,
} from "@mui/material";
import { School } from "@mui/icons-material";
import jsPDF from "jspdf";
import encabezadoCertificado from "../../assets/images/encabezadocertificado.png";
import firmaPresenteCertificado from "../../assets/images/firmapresidentecertificado.png";

const Certificados = () => {
  const [formValues, setFormValues] = useState({
    estudianteId: "",
    horasCompletadas: "80",
    fechaEmision: new Date().toISOString().split("T")[0],
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");
  const [estudiantes, setEstudiantes] = useState([]);
  const [usuarioActual, setUsuarioActual] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const inicializarDatos = async () => {
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          console.log('Token decodificado:', decodedToken);
          
          if (decodedToken.exp * 1000 < Date.now()) {
            handleSessionError("Su sesión ha expirado");
            return;
          }

          // Verificar si el usuario tiene el rol ROOT
          const isRoot = decodedToken.roles && decodedToken.roles.includes('ROLE_ROOT');
          console.log('Es usuario ROOT:', isRoot);

          // Obtener el número de documento del usuario del token
          const numeroDocumento = decodedToken.id;
          if (numeroDocumento) {
            console.log('Iniciando carga de datos con número de documento:', numeroDocumento);
            try {
              await Promise.all([
                fetchEstudiantes(),
                fetchUsuarioActual(numeroDocumento)
              ]);
            } catch (error) {
              console.error('Error en la carga de datos:', error);
              if (error.message.includes('401')) {
                handleSessionError("Su sesión ha expirado");
              } else {
                handleError("Error al cargar los datos: " + error.message);
              }
            }
          } else {
            console.log('No se encontró número de documento en el token, continuando sin usuario actual');
            await fetchEstudiantes();
          }
        } catch (error) {
          console.error('Error al decodificar token:', error);
          handleSessionError("Error con el token de sesión");
        }
      }
    };

    inicializarDatos();
  }, []);

  const fetchUsuarioActual = async (numeroDocumento) => {
    try {
      console.log('Buscando usuario con número de documento:', numeroDocumento);
      
      const response = await fetch(`http://localhost:8080/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const usuarios = await response.json();
      const usuario = usuarios.find(u => u.numeroDocumento === numeroDocumento);
      
      if (usuario) {
        console.log('Usuario encontrado:', usuario);
        setUsuarioActual(usuario);
        return;
      }

      throw new Error("No se encontró el usuario en el sistema");
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      handleError("No se pudo obtener la información del usuario actual");
    }
  };

  const fetchEstudiantes = async () => {
    try {
      const response = await fetch("http://localhost:8080/estudiantes", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setEstudiantes(data.filter(est => est.estado));
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener estudiantes');
      }
    } catch (error) {
      console.error('Error al obtener estudiantes:', error);
      handleError(error.message || "Error al cargar los estudiantes");
    }
  };

  const handleEstudianteChange = (e) => {
    setFormValues({
      ...formValues,
      estudianteId: e.target.value
    });
  };

  const generateCertificate = async () => {
    try {
      // Validación básica
      if (!formValues.estudianteId || !formValues.fechaEmision) {
        handleError("Complete todos los campos requeridos");
        return;
      }

      const decodedToken = jwtDecode(token);
      console.log('Token decodificado:', decodedToken);

      // Si no tenemos usuarioActual, usamos datos del token o valores por defecto
      let nombreEmisor = "Usuario Sistema";
      if (usuarioActual && usuarioActual.nombre && usuarioActual.apellido) {
        nombreEmisor = `${usuarioActual.nombre} ${usuarioActual.apellido}`;
      } else if (decodedToken.nombre && decodedToken.apellido) {
        nombreEmisor = `${decodedToken.nombre} ${decodedToken.apellido}`;
      }

      // Generar código de verificación
      const codigoVerificacion = `FSC-${Date.now().toString(36).slice(-4)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      console.log('Código de verificación generado:', codigoVerificacion);

      // Formatear la fecha para el backend (YYYY-MM-DD)
      const fechaISO = new Date(formValues.fechaEmision).toISOString().split('T')[0];
      console.log('Fecha ISO:', fechaISO);

      // Preparar datos del certificado
      const certificadoData = {
        fechaEmision: fechaISO,
        usuarioId: decodedToken.id,
        estudianteId: formValues.estudianteId,
        nombreEmisor: nombreEmisor,
        codigoVerificacion: codigoVerificacion
      };

      console.log('Datos del certificado a enviar:', certificadoData);

      // Enviar solicitud al backend
      const response = await fetch("http://localhost:8080/certificados", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(certificadoData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error del servidor:', errorData);
        throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
      }

      const certificadoCreado = await response.json();
      console.log('Certificado creado:', certificadoCreado);

      // Obtener el estudiante seleccionado para el PDF
      const estudianteSeleccionado = estudiantes.find(est => est.numeroDocumento === formValues.estudianteId);
      if (!estudianteSeleccionado) {
        throw new Error("No se encontró la información del estudiante");
      }

      // Generar PDF
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "letter"
      });

      // Configuración del PDF
      doc.addImage(encabezadoCertificado, "PNG", 30, 10, 150, 30);
      
      // Título principal
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("LA FUNDACIÓN SOCORRISTAS DE", doc.internal.pageSize.width / 2, 80, { align: "center" });
      doc.text("COLOMBIA", doc.internal.pageSize.width / 2, 90, { align: "center" });
      
      // Subtítulo CERTIFICA
      doc.setFontSize(14);
      doc.text("CERTIFICA", doc.internal.pageSize.width / 2, 110, { align: "center" });

      // Contenido del certificado
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      
      // Texto del certificado con formato justificado
      const textoCompleto = `Que ${estudianteSeleccionado.nombre} ${estudianteSeleccionado.apellido} identificado(a) con C.C ${estudianteSeleccionado.numeroDocumento} del\n\n${estudianteSeleccionado.colegio} del curso ${estudianteSeleccionado.grado} prestó ${formValues.horasCompletadas} horas de servicio social\n\nestudiantil en nuestra entidad. De acuerdo a lo establecido en\n\nla resolución 4210 del ministerio de educación nacional y\n\nnormas concordantes.`;

      // Dividir el texto en líneas y centrarlo
      const lineas = textoCompleto.split('\n');
      let y = 130;
      lineas.forEach(linea => {
        doc.text(linea.trim(), doc.internal.pageSize.width / 2, y, { align: "center" });
        y += 7;
      });

      // Fecha para el certificado en formato largo
      const fechaLarga = new Date(formValues.fechaEmision).toLocaleDateString('es-CO', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      doc.text(`Dada en Bogotá a los ${fechaLarga}`, doc.internal.pageSize.width / 2, y + 20, { align: "center" });

      // Firma
      doc.addImage(firmaPresenteCertificado, "PNG", doc.internal.pageSize.width / 2 - 30, y + 40, 60, 30);
      
      // Texto debajo de la firma
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("BRIGADIER G.", doc.internal.pageSize.width / 2, y + 85, { align: "center" });
      doc.text("FERNELLY GÓMEZ GONZÁLEZ", doc.internal.pageSize.width / 2, y + 90, { align: "center" });
      doc.text("PRESIDENTE", doc.internal.pageSize.width / 2, y + 95, { align: "center" });
      doc.text("WWW.FUSDEC.COM", doc.internal.pageSize.width / 2, y + 100, { align: "center" });

      // Código de verificación en la parte inferior
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.text(`Código de Verificación: ${codigoVerificacion}`, doc.internal.pageSize.width / 2, y + 110, { align: "center" });

      // Guardar PDF
      doc.save(`certificado_${estudianteSeleccionado.nombre}_${estudianteSeleccionado.apellido}.pdf`);

      // Mostrar mensaje de éxito y reset form
      handleSuccess();
      resetForm();

    } catch (error) {
      console.error('Error al generar certificado:', error);
      handleError(error.message || "Error al generar el certificado");
    }
  };

  const validateForm = () => {
    if (!formValues.estudianteId || !formValues.fechaEmision) {
      handleError("Complete todos los campos requeridos");
      return false;
    }
    return true;
  };

  const generateVerificationCode = () => {
    return `FSC-${Date.now().toString(36).slice(-4)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  };

  const generatePDF = (certificado, estudiante) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "letter"
    });

    doc.addImage(encabezadoCertificado, "PNG", 30, 10, 150, 30);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("CERTIFICADO DE SERVICIO SOCIAL", doc.internal.pageSize.width / 2, 60, { align: "center" });

    doc.setFontSize(12);
    doc.text(`Estudiante: ${estudiante.nombre} ${estudiante.apellido}`, 20, 80);
    doc.text(`Documento: ${estudiante.numeroDocumento}`, 20, 90);
    doc.text(`Colegio: ${estudiante.colegio}`, 20, 100);
    doc.text(`Grado: ${estudiante.grado}`, 20, 110);
    doc.text(`Horas Completadas: ${formValues.horasCompletadas}`, 20, 120);
    doc.text(`Fecha de Emisión: ${certificado.fechaEmision}`, 20, 130);
    doc.text(`Código de Verificación: ${certificado.codigoVerificacion}`, 20, 140);
    doc.text(`Emisor: ${certificado.nombreEmisor}`, 20, 150);

    doc.addImage(firmaPresenteCertificado, "PNG", doc.internal.pageSize.width / 2 - 30, 170, 60, 30);

    doc.save(`certificado_${estudiante.nombre}_${estudiante.apellido}.pdf`);
  };

  const handleSuccess = () => {
    setOpenSnackbar(true);
    setMessage("Certificado generado exitosamente");
    setSeverity("success");
  };

  const handleError = (message) => {
    setOpenSnackbar(true);
    setMessage(message);
    setSeverity("error");
  };

  const handleSessionError = (message) => {
    setOpenSnackbar(true);
    setMessage(message);
    setSeverity("error");
    localStorage.removeItem("token");
  };

  const resetForm = () => {
    setFormValues({
      estudianteId: "",
      horasCompletadas: "80",
      fechaEmision: new Date().toISOString().split("T")[0],
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
        <Typography variant="h6" gutterBottom>
          Generación de Certificados
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Estudiante</InputLabel>
              <Select
                value={formValues.estudianteId}
                onChange={handleEstudianteChange}
                label="Estudiante"
              >
                {estudiantes.map((estudiante) => (
                  <MenuItem key={estudiante.numeroDocumento} value={estudiante.numeroDocumento}>
                    {`${estudiante.nombre} ${estudiante.apellido} - ${estudiante.numeroDocumento}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Horas Completadas</InputLabel>
              <Select
                value={formValues.horasCompletadas}
                onChange={(e) => setFormValues({...formValues, horasCompletadas: e.target.value})}
                label="Horas Completadas"
              >
                <MenuItem value="80">80 Horas</MenuItem>
                <MenuItem value="120">120 Horas</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="date"
              label="Fecha de Emisión"
              value={formValues.fechaEmision}
              onChange={(e) => setFormValues({...formValues, fechaEmision: e.target.value})}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              startIcon={<School />}
              onClick={generateCertificate}
              sx={{ mt: 2 }}
            >
              Generar Certificado
            </Button>
          </Grid>
        </Grid>
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

export default Certificados;
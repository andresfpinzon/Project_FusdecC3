/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
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
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Snackbar,
  Alert,
  Grid,
  IconButton,
  DialogContentText,
} from "@mui/material";
import { Edit, Delete, Info, CalendarToday, VerifiedUser, School, Person } from "@mui/icons-material";
import jsPDF from "jspdf";
import encabezadoCertificado from '../../assets/images/encabezadocertificado.png';
import firmaPresenteCertificado from '../../assets/images/firmapresidentecertificado.png';
import { useNavigate } from 'react-router-dom';

const Certificados = () => {
  const [formValues, setFormValues] = useState({
    estudianteId: "",
    nombreEstudiante: "",
    cursoEstudiante: "",
    horasCompletadas: "",
    fechaEmision: new Date().toISOString().split("T")[0],
    colegio: "",
    identificacion: "",
    tipoDocumento: "",
    generoEstudiante: ""
  });

  const [codigoVerificacion, setCodigoVerificacion] = useState("");
  const [mostrarCodigo, setMostrarCodigo] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");

  const [estudiantes, setEstudiantes] = useState([]);
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);

  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();

  useEffect(() => {
    // Solo intentar obtener estudiantes si hay token
    if (token) {
      try {
        // Decodificar token sin redirigir automáticamente
        const decodedToken = jwtDecode(token);
        
        // Verificar si el token está expirado
        if (decodedToken.exp * 1000 < Date.now()) {
          // Token expirado, solicitar renovación
          setOpenSnackbar(true);
          setMessage("Su sesión ha expirado. Por favor, inicie sesión nuevamente.");
          setSeverity("warning");
          localStorage.removeItem('token');
          setToken(null);
          return;
        }

        fetchEstudiantes();
      } catch (error) {
        console.error("Error al validar token:", error);
        // No redirigir automáticamente, solo mostrar mensaje
        setOpenSnackbar(true);
        setMessage("Hubo un problema con su sesión. Por favor, inicie sesión nuevamente.");
        setSeverity("warning");
        localStorage.removeItem('token');
        setToken(null);
      }
    }
  }, [token]);

  const fetchEstudiantes = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/estudiantes", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error("Error al obtener estudiantes");

      const data = await response.json();
      
      const estudiantesFormateados = data.map(estudiante => ({
        _id: estudiante._id,
        nombreEstudiante: estudiante.nombreEstudiante || "",
        apellidoEstudiante: estudiante.apellidoEstudiante || "",
        curso: estudiante.curso || "Sin curso especificado",
        colegio: estudiante.colegioId?.nombreColegio || "Sin colegio",  
        numeroDocumento: estudiante.numeroDocumento || "",     
        tipoDocumento: estudiante.tipoDocumento || "",       
        generoEstudiante: estudiante.generoEstudiante || "" 
      }));
  
      setEstudiantes(estudiantesFormateados);
    } catch (error) {
      console.error("Error:", error);
      setOpenSnackbar(true);
      setMessage(error.message);
      setSeverity("error");
    }
  };

  const handleEstudianteChange = (e) => {
    const selectedEstudiante = estudiantes.find(est => est._id === e.target.value);
    if (selectedEstudiante) {
      setFormValues(prev => ({
        ...prev,
        estudianteId: e.target.value,
        nombreEstudiante: `${selectedEstudiante.nombreEstudiante} ${selectedEstudiante.apellidoEstudiante}`,
        cursoEstudiante: selectedEstudiante.curso || 'Curso no especificado', 
        colegio: selectedEstudiante.colegio || 'Colegio no especificado',
        identificacion: selectedEstudiante.numeroDocumento,
        tipoDocumento: selectedEstudiante.tipoDocumento,
        generoEstudiante: selectedEstudiante.generoEstudiante
      }));
      setEstudianteSeleccionado(selectedEstudiante);
    }
  };

  const generateUniqueVerificationCode = () => {
    // Generate a shorter, unique verification code
    const timestamp = Date.now().toString(36); // Convert timestamp to base 36
    const randomStr = Math.random().toString(36).substring(2, 7); // Random 5-char string
    return `FSC-${timestamp.slice(-4)}-${randomStr.toUpperCase()}`;
  };

  const generateCertificate = () => {
    const { 
      nombreEstudiante, 
      cursoEstudiante, 
      horasCompletadas, 
      fechaEmision, 
      colegio, 
      identificacion,
      tipoDocumento,
      estudianteId
    } = formValues;
  
    if (!nombreEstudiante || !horasCompletadas) {
      setOpenSnackbar(true);
      setMessage("Por favor, complete todos los campos requeridos");
      setSeverity("error");
      return;
    }
  
    // Validar que las horas sean 80 o 120
    if (horasCompletadas !== "80" && horasCompletadas !== "120") {
      setOpenSnackbar(true);
      setMessage("Las horas completadas deben ser 80 o 120");
      setSeverity("error");
      return;
    }
  
    // Generate unique verification code
    const codigoVerificacion = generateUniqueVerificationCode();
  
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'letter'
    });
  
    // Añadir imagen de encabezado (más pequeña)
    doc.addImage(encabezadoCertificado, 'PNG', 30, 10, 150, 30);
  
    // Configurar fuente y estilo
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
  
    // Texto de certificación
    doc.text('LA FUNDACIÓN SOCORRISTAS DE', doc.internal.pageSize.width / 2, 60, { align: 'center' });
    doc.text('COLOMBIA', doc.internal.pageSize.width / 2, 70, { align: 'center' });
    
    doc.text('CERTIFICA', doc.internal.pageSize.width / 2, 90, { align: 'center' });
  
    // Contenido principal
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    
    const mainText = [
      `Que ${nombreEstudiante} identificado(a) con ${tipoDocumento} ${identificacion} del`,
      `${colegio} del curso ${cursoEstudiante} prestó ${horasCompletadas} horas de servicio social`,
      'estudiantil en nuestra entidad. De acuerdo a lo establecido en',
      'la resolución 4210 del ministerio de educación nacional y',
      'normas concordantes.'
    ];
  
    let y = 110;
    mainText.forEach(line => {
      doc.text(line, doc.internal.pageSize.width / 2, y, { align: 'center' });
      y += 10;
    });
  
    // Fecha
    const date = new Date(fechaEmision);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('es-ES', { month: 'long' });
    const year = date.getFullYear();
    
    doc.text(`Dada en Bogotá a los ${day} días del mes de ${month} de ${year}`, 
      doc.internal.pageSize.width / 2, y + 20, { align: 'center' });
  
    // Añadir firma del presidente
    doc.addImage(firmaPresenteCertificado, 'PNG', 70, y + 40, 80, 40);
  
    // Añadir código de verificación en la parte inferior
    doc.setFontSize(10);
    doc.text(`Código de Verificación: ${codigoVerificacion}`, 
      doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 20, { align: 'center' });
  
    // Generar y guardar
    const fileName = `certificado_${nombreEstudiante.replace(/\s+/g, '_')}_${fechaEmision}.pdf`;
    doc.save(fileName);
  
    // Preparar datos para envío
    const decodedToken = jwtDecode(token);
    
    const estudianteSeleccionado = estudiantes.find(est => est._id === estudianteId);
    
    if (!estudianteSeleccionado) {
      setOpenSnackbar(true);
      setMessage("No se encontró el estudiante seleccionado");
      setSeverity("error");
      return;
    }

    if (!nombreEstudiante || !horasCompletadas) {
      setOpenSnackbar(true);
      setMessage("Por favor, complete todos los campos requeridos");
      setSeverity("error");
      return;
    }

    if (horasCompletadas !== "80" && horasCompletadas !== "120") {
      setOpenSnackbar(true);
      setMessage("Las horas completadas deben ser 80 o 120");
      setSeverity("error");
      return;
    }

    const fetchDefaultCursoId = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/cursos", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error("Error al obtener cursos");
        }
        
        const cursos = await response.json();
        
        if (cursos.length === 0) {
          throw new Error("No hay cursos disponibles");
        }
        
        return cursos[0]._id;
      } catch (error) {
        console.error("Error al obtener curso por defecto:", error);
        setOpenSnackbar(true);
        setMessage("No se pudo obtener un curso por defecto");
        setSeverity("error");
        return null;
      }
    };

    const sendCertificado = async () => {
      try {
        if (!estudianteId || !estudianteSeleccionado) {
          throw new Error("Información del estudiante incompleta");
        }

        if (!token) {
          throw new Error("No se encontró el token de autenticación");
        }

        let decodedToken;
        try {
          decodedToken = jwtDecode(token);
        } catch (error) {
          console.error("Error decodificando token:", error);
          throw new Error("Token de autenticación inválido");
        }
        
        if (!decodedToken || !decodedToken.nombreUsuario || !decodedToken.apellidoUsuario) {
          throw new Error("No se pudo obtener la información del usuario del token");
        }

        const nombreEmisor = `${decodedToken.nombreUsuario} ${decodedToken.apellidoUsuario}`.trim();

        // Get course information
        const cursoId = await fetchDefaultCursoId();
        if (!cursoId) {
          throw new Error("No se pudo obtener un curso por defecto");
        }

        // Create certificate
        const certificadoData = {
          estudianteId: estudianteId,
          cursoId: cursoId,
          codigoVerificacion,
          fechaEmision,
          usuarioId: decodedToken.id,
          estadoCertificado: true,
          nombreEmisorCertificado: nombreEmisor,
          estudianteInfo: {
            nombreEstudiante: estudianteSeleccionado.nombreEstudiante,
            identificacion: estudianteSeleccionado.identificacion,
            tipoDocumento: estudianteSeleccionado.tipoDocumento,
            generoEstudiante: estudianteSeleccionado.generoEstudiante,
            colegio: estudianteSeleccionado.colegio
          }
        };

        console.log("Enviando certificado:", certificadoData); // Debug log

        const response = await fetch('http://localhost:3000/api/certificados', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(certificadoData)
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || 'Error al crear certificado');
        }

        const certificado = await response.json();
        console.log("Certificado creado:", certificado); // Debug log

        // Create audit
        const auditData = {
          fechaAuditoria: new Date().toISOString(),
          nombreEmisor: nombreEmisor,
          certificadoId: certificado._id,
          certificadoInfo: {
            codigoVerificacion: certificado.codigoVerificacion,
            fechaEmision: certificado.fechaEmision,
            nombreEmisorCertificado: nombreEmisor,
            estadoCertificado: true,
            estudianteInfo: certificadoData.estudianteInfo
          },
          estadoAuditoria: true
        };

        console.log("Enviando auditoría:", auditData); // Debug log

        const auditResponse = await fetch('http://localhost:3000/api/auditorias', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(auditData)
        });

        if (!auditResponse.ok) {
          const errorText = await auditResponse.text();
          throw new Error(errorText || 'Error al crear auditoría');
        }

        setOpenSnackbar(true);
        setMessage(`Certificado generado exitosamente. Código de Verificación: ${codigoVerificacion}`);
        setSeverity("success");

        // Reset form
        setFormValues({
          estudianteId: "",
          nombreEstudiante: "",
          cursoEstudiante: "",
          horasCompletadas: "",
          fechaEmision: new Date().toISOString().split("T")[0],
          colegio: "",
          identificacion: "",
          tipoDocumento: "",
          generoEstudiante: ""
        });

      } catch (error) {
        console.error("Error completo:", error);
        setOpenSnackbar(true);
        setMessage(`Error: ${error.message}`);
        setSeverity("error");
      }
    };

    sendCertificado();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === "identificacion" && value) {
      // generateVerificationCode();
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
        <Typography component="h1" variant="h4" align="center" color="primary" gutterBottom>
          Generar Certificado de Servicio Social
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="estudiante-label">Estudiante</InputLabel>
              <Select
                labelId="estudiante-label"
                id="estudiante"
                value={formValues.estudianteId}
                label="Estudiante"
                onChange={handleEstudianteChange}
                name="estudianteId"
              >
                <MenuItem value="">Seleccionar estudiante</MenuItem>
                {estudiantes.map((estudiante) => (
                  <MenuItem key={estudiante._id} value={estudiante._id}>
                    {`${estudiante.nombreEstudiante} ${estudiante.apellidoEstudiante} - ${estudiante.numeroDocumento} - ${estudiante.colegio} - Curso: ${estudiante.curso || "Sin curso"}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="nombreEstudiante"
              name="nombreEstudiante"
              label="Nombre Completo"
              fullWidth
              autoComplete="given-name"
              value={formValues.nombreEstudiante}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="horasCompletadas"
              name="horasCompletadas"
              label="Horas Completadas"
              fullWidth
              type="number"
              value={formValues.horasCompletadas}
              onChange={handleInputChange}
              inputProps={{ min: 80, max: 120 }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              id="fechaEmision"
              label="Fecha de Emisión"
              type="date"
              fullWidth
              name="fechaEmision"
              value={formValues.fechaEmision}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>

        {estudianteSeleccionado && (
          <div className="estudiante-info">
            <p><strong>Nombre:</strong> {formValues.nombreEstudiante}</p>
            <p><strong>Curso:</strong> {formValues.cursoEstudiante}</p>
            <p><strong>Colegio:</strong> {formValues.colegio}</p>
            <p><strong>Identificación:</strong> {formValues.identificacion}</p>
          </div>
        )}

        {mostrarCodigo && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Código de verificación: {codigoVerificacion}
          </Alert>
        )}

        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={generateCertificate}
            startIcon={<School />}
          >
            Generar Certificado
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={severity}
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Certificados;
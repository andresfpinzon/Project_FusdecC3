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
import "./Certificados.css";

const Certificados = () => {
  const [formValues, setFormValues] = useState({
    estudianteId: "",
    horasCompletadas: "80",
    fechaEmision: new Date().toISOString().split('T')[0], // Formato YYYY-MM-DD
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");
  const [estudiantes, setEstudiantes] = useState([]);
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const inicializarDatos = async () => {
      if (token) {
        try {
          const decodedToken = jwtDecode(token);

          if (decodedToken.exp * 1000 < Date.now()) {
            handleSessionError("Su sesión ha expirado");
            return;
          }

          const numeroDocumento = decodedToken.id;
          if (numeroDocumento) {
            setLoading(true);
            try {
              await Promise.all([
                fetchEstudiantes(),
                fetchUsuarioActual(numeroDocumento)
              ]);
            } catch (error) {
              if (error.message.includes('401')) {
                handleSessionError("Su sesión ha expirado");
              } else {
                handleError("Error al cargar los datos: " + error.message);
              }
            } finally {
              setLoading(false);
            }
          } else {
            setLoading(true);
            await fetchEstudiantes();
            setLoading(false);
          }
        } catch (error) {
          handleSessionError("Error con el token de sesión");
          setLoading(false);
        }
      }
    };

    inicializarDatos();
  }, [token]);

  const obtenerColegioPorId = async (colegioId) => {
  try {
    const response = await fetch(`http://localhost:8080/colegios/${colegioId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        return { nombre: "Colegio no encontrado" };
      }
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const colegio = await response.json();
    return colegio;
  } catch (error) {
    handleError("Error al obtener el colegio: " + error.message);
    return { nombre: "Error al cargar colegio" };
  }
};

  const fetchUsuarioActual = async (numeroDocumento) => {
    try {
      const response = await fetch(`http://localhost:8080/usuarios`, {
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

      if (!usuario) {
        return;
      }

      setUsuarioActual(usuario);
    } catch (error) {
      handleError("Error al obtener usuario: " + error.message);
    }
  };

  const fetchEstudiantes = async () => {
    try {
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const response = await fetch("http://localhost:8080/estudiantes", {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const estudiantes = await response.json();

      if (!Array.isArray(estudiantes)) {
        throw new Error('Formato de respuesta inválido');
      }

      const estudiantesAprobados = estudiantes
        .filter(est => est.estado && est.asistenciasRegistradas >= 15)
        .sort((a, b) => {
          const nombreA = `${a.nombre} ${a.apellido}`.toLowerCase();
          const nombreB = `${b.nombre} ${b.apellido}`.toLowerCase();
          return nombreA.localeCompare(nombreB);
        });

      if (estudiantesAprobados.length === 0) {
        handleError("No hay estudiantes con los 15 sábados completados");
        setEstudiantes([]);
        return;
      }

      setEstudiantes(estudiantesAprobados);
    } catch (error) {
      handleError("Error al cargar los estudiantes: " + error.message);
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
      setLoading(true);

      if (!formValues.estudianteId || !formValues.fechaEmision) {
        handleError("Por favor complete todos los campos requeridos");
        setLoading(false);
        return;
      }

      const estudianteSeleccionado = estudiantes.find(est => est.numeroDocumento === formValues.estudianteId);
      if (!estudianteSeleccionado) {
        handleError("No se encontró la información del estudiante");
        setLoading(false);
        return;
      }

      if (!token) {
        handleSessionError("No hay token de autenticación");
        setLoading(false);
        return;
      }

      let decodedToken;
      try {
        decodedToken = jwtDecode(token);
        if (!decodedToken?.id) {
          handleError("Token inválido o sin ID de usuario");
          setLoading(false);
          return;
        }
      } catch (error) {
        handleSessionError("Error al decodificar el token");
        setLoading(false);
        return;
      }

      const fechaEmision = formValues.fechaEmision;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaEmision)) {
        handleError("Formato de fecha inválido. Debe ser YYYY-MM-DD");
        setLoading(false);
        return;
      }

      const certificadoData = {
        fechaEmision: formValues.fechaEmision,
        usuarioId: String(decodedToken.id),
        estudianteId: String(estudianteSeleccionado.numeroDocumento),
        nombreEmisor: "Fundacion Fusdec",
        codigoVerificacion: `FSC-${Date.now().toString(36).slice(-4)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
      };

      try {
        const certificadoResponse = await fetch("http://localhost:8080/certificados", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(certificadoData)
        });

        const responseText = await certificadoResponse.text();
        let responseData;
        try {
          responseData = JSON.parse(responseText);
        } catch (e) {
          throw new Error('Respuesta del servidor no válida');
        }

        if (!certificadoResponse.ok) {
          if (certificadoResponse.status === 400) {
            throw new Error(responseData.message || "Datos inválidos enviados al servidor");
          } else if (certificadoResponse.status === 401) {
            handleSessionError("Sesión expirada o no autorizada");
            return;
          } else if (certificadoResponse.status === 500) {
            throw new Error(responseData.message || "Error interno del servidor");
          } else {
            throw new Error(responseData.message || `Error del servidor: ${certificadoResponse.status}`);
          }
        }

        if (!responseData || !responseData.id) {
          throw new Error("El servidor no devolvió un certificado válido");
        }

        generatePDF(responseData, estudianteSeleccionado);
        handleSuccess("Certificado generado exitosamente");
        resetForm();

      } catch (error) {
        if (error.message.includes('Failed to fetch')) {
          handleError("Error de conexión con el servidor. Verifique su conexión a internet.");
        } else {
          handleError(error.message);
        }
      }

    } catch (error) {
      handleError("Ocurrió un error inesperado al procesar la solicitud");
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = async (certificado, estudiante) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "letter"
    });

    const colegio = await obtenerColegioPorId(estudiante.colegioId);
    const nombreColegio = colegio.nombre || "Colegio no especificado";

    // Configuración del PDF
    doc.addImage(encabezadoCertificado, "PNG", 30, 15, 150, 25);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("LA FUNDACIÓN SOCORRISTAS DE", doc.internal.pageSize.width / 2, 65, { align: "center" });
    doc.text("COLOMBIA", doc.internal.pageSize.width / 2, 72, { align: "center" });

    doc.setFontSize(12);
    doc.text("CERTIFICA", doc.internal.pageSize.width / 2, 85, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    const textoCompleto = `Que ${estudiante.nombre} ${estudiante.apellido} identificado(a) con ${estudiante.tipoDocumento} ${estudiante.numeroDocumento} del colegio\n${nombreColegio} del grado ${estudiante.grado} prestó ${formValues.horasCompletadas} horas de servicio social\nestudiantil en nuestra entidad. De acuerdo a lo establecido en\nla resolución 4210 del ministerio de educación nacional y\nnormas concordantes.`;

    const lineas = textoCompleto.split('\n');
    let y = 100;
    lineas.forEach(linea => {
      doc.text(linea.trim(), doc.internal.pageSize.width / 2, y, { align: "center" });
      y += 6;
    });

    const fechaEmisionFormateada = new Date(certificado.fechaEmision).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    doc.text(`Dada en Bogotá a los ${fechaEmisionFormateada}`, doc.internal.pageSize.width / 2, y + 8, { align: "center" });

    doc.addImage(firmaPresenteCertificado, "PNG", doc.internal.pageSize.width / 2 - 30, y + 15, 60, 30);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("BRIGADIER G.", doc.internal.pageSize.width / 2, y + 50, { align: "center" });
    doc.text("FERNELLY GÓMEZ GONZÁLEZ", doc.internal.pageSize.width / 2, y + 55, { align: "center" });
    doc.text("PRESIDENTE", doc.internal.pageSize.width / 2, y + 60, { align: "center" });
    doc.text("WWW.FUSDEC.COM", doc.internal.pageSize.width / 2, y + 65, { align: "center" });

    doc.setFontSize(9);
    doc.text(`Código de Verificación: ${certificado.codigoVerificacion}`, doc.internal.pageSize.width / 2, y + 75, { align: "center" });

    doc.save(`certificado_${estudiante.nombre}_${estudiante.apellido}.pdf`);
  };

  const generateVerificationCode = () => {
    return `FSC-${Date.now().toString(36).slice(-4)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  };

  const handleSuccess = (msg) => {
    setMessage(msg);
    setSeverity("success");
    setOpenSnackbar(true);
  };

  const handleError = (msg) => {
    setMessage(msg);
    setSeverity("error");
    setOpenSnackbar(true);
  };

  const handleSessionError = (message) => {
    setMessage(message);
    setSeverity("error");
    setOpenSnackbar(true);
    localStorage.removeItem("token");
    // Redirigir a login
    window.location.href = '/login';
  };

  const resetForm = () => {
    setFormValues({
      estudianteId: "",
      horasCompletadas: "80",
      fechaEmision: new Date().toISOString().split('T')[0]
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
              <InputLabel id="estudiante-label">Estudiante</InputLabel>
              <Select
                value={formValues.estudianteId}
                onChange={handleEstudianteChange}
                label="Estudiante"
                disabled={loading || estudiantes.length === 0}
              >
                {estudiantes.length === 0 ? (
                  <MenuItem value="" disabled>
                    No hay estudiantes disponibles
                  </MenuItem>
                ) : (
                  estudiantes.map((estudiante) => (
                    <MenuItem
                      key={estudiante.numeroDocumento}
                      value={estudiante.numeroDocumento}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        '& > *': { width: '100%' }
                      }}
                    >
                      <Typography variant="subtitle1">
                        {`${estudiante.nombre} ${estudiante.apellido} - ${estudiante.numeroDocumento}`}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {`${estudiante.colegio} - ${estudiante.grado}`}
                      </Typography>
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Horas Completadas</InputLabel>
              <Select
                value={formValues.horasCompletadas}
                onChange={(e) => setFormValues({ ...formValues, horasCompletadas: e.target.value })}
                label="Horas Completadas"
                disabled={loading}
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
              onChange={(e) => setFormValues({ ...formValues, fechaEmision: e.target.value })}
              InputLabelProps={{ shrink: true }}
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              startIcon={<School />}
              onClick={generateCertificate}
              sx={{ mt: 2 }}
              disabled={loading || !formValues.estudianteId || estudiantes.length === 0}
            >
              {loading ? 'Generando...' : 'Generar Certificado'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          severity={severity}
          onClose={() => setOpenSnackbar(false)}
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Certificados;
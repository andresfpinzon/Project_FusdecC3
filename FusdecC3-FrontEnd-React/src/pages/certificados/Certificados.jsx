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
  Box,
  TablePagination,
} from "@mui/material";
import { Edit, Delete, Info, CalendarToday, VerifiedUser, School, Person } from "@mui/icons-material";

const token = localStorage.getItem("token");

const Certificados = () => {
  // Estado para almacenar los valores del formulario
  const [formValues, setFormValues] = useState({
    fechaEmision: "",
    usuarioId: "",
    cursoId: "",
    estudianteId: "",
    nombreEmisorCertificado: "", 
    codigoVerificacion: "",
  });
  
  // Estados para almacenar datos de usuarios, cursos, estudiantes y certificados
  const [usuarios, setUsuarios] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [certificados, setCertificados] = useState([]);
  const [auditorias, setAuditorias] = useState([]);
  
  // Estados para manejar la selección y visualización de certificados
  const [selectedCertificado, setSelectedCertificado] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [certificadoToDelete, setCertificadoToDelete] = useState(null);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [certificadoDetails, setCertificadoDetails] = useState(null);
  
  // Estados para paginación y mensajes
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success"); // "success" o "error"

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      const usuarioId = decodedToken.id;
  
      // Obtener nombre y apellido del usuario
      const fetchNombreApellido = async () => {
        try {
          const response = await fetch(`http://localhost:3000/api/usuarios/${usuarioId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": token
            }
          });
  
          if (!response.ok) throw new Error("Error al obtener datos del usuario");
          
          const data = await response.json();
          setFormValues((prevFormValues) => ({
            ...prevFormValues,
            usuarioId: usuarioId,
            nombreEmisorCertificado: data.nombreUsuario + " " + data.apellidoUsuario
          }));
        } catch (error) {
          console.error("Error al obtener datos del usuario:", error);
          setErrorMessage("Error al obtener datos del usuario");
          setOpenSnackbar(true);
        }
      };
  
      fetchNombreApellido();
    }
  }, []);
  
  useEffect(() => {
    // Llamadas a las funciones para obtener datos al cargar el componente
    fetchUsuarios();
    fetchCursos();
    fetchEstudiantes();
    fetchCertificados();
    fetchAuditorias();
  }, []);

  // Obtener nombre y apellido del usuario
  const fetchNombreApellido = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/usuarios/${usuarioId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        }
      });

      if (!response.ok) throw new Error("Error al obtener datos del usuario");
      
      const data = await response.json();
      setFormValues((prevFormValues) => ({
        ...prevFormValues,
        usuarioId: usuarioId,
        nombreEmisorCertificado: data.nombreUsuario + " " + data.apellidoUsuario
      }));
    } catch (error) {
      console.error("Error al obtener datos del usuario:", error);
      setErrorMessage("Error al obtener datos del usuario");
      setOpenSnackbar(true);
    }
  };

  // Función para obtener usuarios
  const fetchUsuarios = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/usuarios", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token 
        }
      });
      if (!response.ok) throw new Error("Error al obtener usuarios");
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      setErrorMessage("Error al obtener usuarios");
      setOpenSnackbar(true);
    }
  };

  // Función para obtener cursos
  const fetchCursos = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/cursos", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token 
        }
      });
      if (!response.ok) throw new Error("Error al obtener cursos");
      const data = await response.json();
      setCursos(data);
    } catch (error) {
      console.error("Error al obtener cursos:", error);
      setErrorMessage("Error al obtener cursos");
      setOpenSnackbar(true);
    }
  };

  // Función para obtener estudiantes
  const fetchEstudiantes = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/estudiantes", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token 
        }
      });
      if (!response.ok) throw new Error("Error al obtener estudiantes");
      const data = await response.json();
      setEstudiantes(data);
    } catch (error) {
      console.error("Error al obtener estudiantes:", error);
      setErrorMessage("Error al obtener estudiantes");
      setOpenSnackbar(true);
    }
  };

  // Función para obtener certificados
  const fetchCertificados = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/certificados", {
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

  // Función para obtener auditorías
  const fetchAuditorias = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/auditorias", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token 
        }
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

  // Manejar cambios en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  // Función para crear un nuevo certificado
  const handleCreateCertificado = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/certificados", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token 
        },
        body: JSON.stringify({
          ...formValues,
          fechaEmision: formValues.fechaEmision,
        }),
      });

      if (response.ok) {
        await fetchCertificados();
        setFormValues({
          fechaEmision: "",
          usuarioId: formValues.usuarioId,
          cursoId: "",
          estudianteId: "",
          nombreEmisorCertificado: formValues.nombreEmisorCertificado,
          codigoVerificacion: "",
        });
        clearForm();
        setMessage("Certificado guardado exitosamente!");
        setSeverity("success");
        setOpenSnackbar(true);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al crear certificado");
      }
    } catch (error) {
      console.error("Error al crear certificado:", error);
      setErrorMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  // Función para actualizar un certificado existente
  const handleUpdateCertificado = async () => {
    if (!selectedCertificado) return;
    try {
      const response = await fetch(`http://localhost:3000/api/certificados/${selectedCertificado._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token 
        },
        body: JSON.stringify({
          fechaEmision: formValues.fechaEmision,
          usuarioId: formValues.usuarioId,
          cursoId: formValues.cursoId,
          estudianteId: formValues.estudianteId,
          nombreEmisorCertificado: formValues.nombreEmisorCertificado,
          codigoVerificacion: formValues.codigoVerificacion,
        }),
      });

      if (response.ok) {
        await fetchCertificados();
        clearForm();
        setMessage("Certificado actualizado exitosamente!");
        setSeverity("success");
        setOpenSnackbar(true);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar certificado");
      }
    } catch (error) {
      console.error("Error al actualizar certificado:", error);
      setErrorMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  // Manejar clic en el botón de editar
  const handleEditClick = (certificado) => {
    setSelectedCertificado(certificado);
    setFormValues({
      fechaEmision: certificado.fechaEmision,
      usuarioId: certificado.usuarioId,
      cursoId: certificado.cursoId._id,
      estudianteId: certificado.estudianteId._id,
      nombreEmisorCertificado: certificado.nombreEmisorCertificado, 
      codigoVerificacion: certificado.codigoVerificacion,
    });
  };

  // Manejar el cierre del diálogo de eliminación
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setCertificadoToDelete(null);
  };

  // Función para eliminar un certificado
  const handleDeleteCertificado = async () => {
    if (!certificadoToDelete) return;
    try {
      const response = await fetch(
        `http://localhost:3000/api/certificados/${certificadoToDelete._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token 
          }
        }
      );
      if (response.ok) {
        setCertificados(certificados.filter(certificado => certificado._id !== certificadoToDelete._id));
        handleCloseDeleteDialog();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar certificado");
      }
    } catch (error) {
      console.error("Error al eliminar certificado:", error);
      setErrorMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  // Limpiar el formulario
  const clearForm = () => {
    setFormValues({
      fechaEmision: "",
      usuarioId: "",
      cursoId: "",
      estudianteId: "",
      nombreEmisorCertificado: "",
      codigoVerificacion: "",
    });
    setSelectedCertificado(null);
  };

  // Manejar auditoría
  const handleAuditoria = (id) => {
    const auditoria = auditorias.find(aud => aud.certificadoId === id);
    if (auditoria) {
      console.log(`Auditoría para el certificado con ID: ${id}`, auditoria);
    } else {
      console.log(`No se encontró auditoría para el certificado con ID: ${id}`);
    }
  };

  // Manejar clic en detalles del certificado
  const handleDetailsClick = (certificado) => {
    setCertificadoDetails(certificado);
    setOpenDetailsDialog(true);
  };

  // Cerrar el Snackbar
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="lg">
      <h1>Gestión de Certificados</h1>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12} xl={12}>
          <TextField
            label="Fecha de Emisión"
            type="date"
            name="fechaEmision"
            value={formValues.fechaEmision}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="curso-select-label">Curso</InputLabel>
            <Select
              labelId="curso-select-label"
              name="cursoId"
              value={formValues.cursoId}
              onChange={handleInputChange}
              input={<OutlinedInput label="Curso" />}
            >
              {cursos.map((curso) => (
                <MenuItem key={curso._id} value={curso._id}>
                  {curso.nombreCurso}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel id="estudiante-select-label">Estudiante</InputLabel>
            <Select
              labelId="estudiante-select-label"
              name="estudianteId"
              value={formValues.estudianteId}
              onChange={handleInputChange}
              input={<OutlinedInput label="Estudiante" />}
            >
              {estudiantes.map((estudiante) => (
                <MenuItem key={estudiante._id} value={estudiante._id}>
                  {estudiante.nombreEstudiante}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Código de Verificación"
            name="codigoVerificacion"
            value={formValues.codigoVerificacion}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={selectedCertificado ? handleUpdateCertificado : handleCreateCertificado}
          >
            {selectedCertificado ? "Actualizar Certificado" : "Crear Certificado"}
          </Button>
        </Grid>
        <Grid item xs={12} md={12}>
          <h2>Lista de Certificados</h2>
          <TableContainer component={Paper} style={{ marginTop: "20px" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Codigo</TableCell>
                  <TableCell>Fecha de Emisión</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {certificados.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((certificado) => (
                  <TableRow key={certificado._id}>
                    <TableCell>
                      {certificado.codigoVerificacion}
                    </TableCell>
                    <TableCell>
                      {certificado.fechaEmision}
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEditClick(certificado)} color="primary">
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => {
                        setCertificadoToDelete(certificado);
                        setOpenDeleteDialog(true);
                      }} color="error">
                        <Delete />
                      </IconButton>
                      <IconButton onClick={() => handleDetailsClick(certificado)} color="primary">
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
              count={certificados.length}
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

      {/* Snackbar para mensajes de error */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={severity} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>

      {/* Diálogo de confirmación de eliminación */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar este certificado?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="default">
            Cancelar
          </Button>
          <Button onClick={handleDeleteCertificado} color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para mostrar detalles del certificado */}
      <Dialog open={openDetailsDialog} onClose={() => setOpenDetailsDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: '#208DC7FF', color: '#fff', textAlign: 'center' }}>
          Detalles del Certificado
        </DialogTitle>
        <DialogContent sx={{ padding: '20px' }}>
          {certificadoDetails && (
            <div>
              {/* Código de Verificación */}
              <Box display="flex" alignItems="center" mb={2}>
                <VerifiedUser color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Código de Verificación:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>{certificadoDetails.codigoVerificacion || "N/A"}</Typography>
              </Box>
              
              {/* Fecha de Emisión */}
              <Box display="flex" alignItems="center" mb={2}>
                <CalendarToday color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Fecha de Emisión:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>
                  {certificadoDetails.fechaEmision ? new Date(certificadoDetails.fechaEmision).toLocaleDateString() : "N/A"}
                </Typography>
              </Box>
              
              {/* Nombre del Emisor */}
              <Box display="flex" alignItems="center" mb={2}>
                <Person color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Nombre del Emisor:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>{certificadoDetails.nombreEmisorCertificado || "N/A"}</Typography>
              </Box>
              
              {/* Nombre del Curso */}
              {certificadoDetails.cursoId && (
                <Box display="flex" alignItems="center" mb={2}>
                  <School color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Nombre del Curso:</Typography>
                  <Typography variant="body1" sx={{ ml: 1 }}>{certificadoDetails.cursoId.nombreCurso || "N/A"}</Typography>
                </Box>
              )}
              
              {/* Nombre del Estudiante */}
              {certificadoDetails.estudianteId && (
                <Box display="flex" alignItems="center" mb={2}>
                  <Person color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Nombre del Estudiante:</Typography>
                  <Typography variant="body1" sx={{ ml: 1 }}>
                    {`${certificadoDetails.estudianteId.nombreEstudiante} ${certificadoDetails.estudianteId.apellidoEstudiante}`}
                  </Typography>
                </Box>
              )}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetailsDialog(false)} variant="contained" color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Certificados;
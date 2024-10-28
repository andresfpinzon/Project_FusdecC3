import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const Certificados = () => {
  const [formValues, setFormValues] = useState({
    nombre: "",
    fechaEmision: "",
    usuarioId: "",
    cursoId: "",
    estudianteId: "",
    nombreEmisor: "", // Cambiado a nombreEmisor para que coincida con el backend
    codigoVerificacion: "",
  });
  const [usuarios, setUsuarios] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [certificados, setCertificados] = useState([]);
  const [selectedCertificado, setSelectedCertificado] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [certificadoToDelete, setCertificadoToDelete] = useState(null);

  useEffect(() => {
    fetchUsuarios();
    fetchCursos();
    fetchEstudiantes();
    fetchCertificados();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/usuarios");
      if (!response.ok) throw new Error("Error al obtener usuarios");
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      setErrorMessage("Error al obtener usuarios");
      setOpenSnackbar(true);
    }
  };

  const fetchCursos = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/cursos");
      if (!response.ok) throw new Error("Error al obtener cursos");
      const data = await response.json();
      setCursos(data);
    } catch (error) {
      console.error("Error al obtener cursos:", error);
      setErrorMessage("Error al obtener cursos");
      setOpenSnackbar(true);
    }
  };

  const fetchEstudiantes = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/estudiantes");
      if (!response.ok) throw new Error("Error al obtener estudiantes");
      const data = await response.json();
      setEstudiantes(data);
    } catch (error) {
      console.error("Error al obtener estudiantes:", error);
      setErrorMessage("Error al obtener estudiantes");
      setOpenSnackbar(true);
    }
  };

  const fetchCertificados = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/certificados");
      if (!response.ok) throw new Error("Error al obtener certificados");
      const data = await response.json();
      setCertificados(data);
    } catch (error) {
      console.error("Error al obtener certificados:", error);
      setErrorMessage("Error al obtener certificados");
      setOpenSnackbar(true);
    }
  };

  const handleInputChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateCertificado = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/certificados", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formValues,
          fechaEmision: new Date(formValues.fechaEmision).toISOString(),
        }),
      });

      if (response.ok) {
        const nuevoCertificado = await response.json();
        setCertificados([...certificados, nuevoCertificado]);
        clearForm();
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

  const handleUpdateCertificado = async () => {
    if (!selectedCertificado) return;
    try {
      const response = await fetch(`http://localhost:3000/api/certificados/${selectedCertificado._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: formValues.nombre,
          fechaEmision: new Date(formValues.fechaEmision).toISOString(),
          usuarioId: formValues.usuarioId,
          cursoId: formValues.cursoId,
          estudianteId: formValues.estudianteId,
          nombreEmisor: formValues.nombreEmisor, // Asegúrate de que este campo sea válido
          codigoVerificacion: formValues.codigoVerificacion,
        }),
      });

      if (response.ok) {
        const updatedCertificado = await response.json();
        setCertificados(certificados.map(certificado => 
          certificado._id === updatedCertificado._id ? updatedCertificado : certificado
        ));
        clearForm();
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

  const handleEditClick = (certificado) => {
    setSelectedCertificado(certificado);
    setFormValues({
      nombre: certificado.nombre,
      fechaEmision: certificado.fechaEmision,
      usuarioId: certificado.usuarioId,
      cursoId: certificado.cursoId,
      estudianteId: certificado.estudianteId,
      nombreEmisor: certificado.nombreEmisor, // Asegúrate de que este campo coincida
      codigoVerificacion: certificado.codigoVerificacion,
    });
  };


  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setCertificadoToDelete(null);
  };

  const handleDeleteCertificado = async () => {
    if (!certificadoToDelete) return;
    try {
      const response = await fetch(
        `http://localhost:3000/api/certificados/${certificadoToDelete._id}`,
        {
          method: "DELETE",
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

  const clearForm = () => {
    setFormValues({
      nombre: "",
      fechaEmision: "",
      usuarioId: "",
      cursoId: "",
      estudianteId: "",
      nombreEmisor: "", // Cambiado a nombreEmisor
      codigoVerificacion: "",
    });
    setSelectedCertificado(null);
  };

  return (
    <Container maxWidth="lg">
      <h1>Gestión de Certificados</h1>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Nombre"
            name="nombre"
            value={formValues.nombre}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
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
            <InputLabel id="usuario-select-label">Usuario</InputLabel>
            <Select
              labelId="usuario-select-label"
              name="usuarioId"
              value={formValues.usuarioId}
              onChange={handleInputChange}
              input={<OutlinedInput label="Usuario" />}
            >
              {usuarios.map((usuario) => (
                <MenuItem key={usuario._id} value={usuario._id}>
                  {usuario.nombreUsuario}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
            label="Nombre del Emisor"
            name="nombreEmisor"
            value={formValues.nombreEmisor}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
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
        <Grid item xs={12} md={6}>
          <h2>Lista de Certificados</h2>
          <TableContainer component={Paper} style={{ marginTop: "20px" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Fecha de Emisión</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {certificados.map((certificado) => (
                  <TableRow key={certificado._id}>
                    <TableCell>{certificado.nombre || "Nombre no disponible"}</TableCell>
                    <TableCell>
                      {certificado.fechaEmision ? new Date(certificado.fechaEmision).toLocaleDateString("es-ES") : "Fecha no válida"}
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      {/* Snackbar para mensajes de error */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="error">
          {errorMessage}
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
    </Container>
  );
};

export default Certificados;

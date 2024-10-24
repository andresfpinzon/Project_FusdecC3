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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Snackbar,
  Alert,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { Edit, Delete, Info } from "@mui/icons-material";

const Certificados = () => {
  const [certificados, setCertificados] = useState([]);
  const [selectedCertificado, setSelectedCertificado] = useState(null);
  const [formValues, setFormValues] = useState({
    nombre: "",
    fechaEmision: "",
    usuarioId: "",
    cursoId: "",
    estudianteId: "",
    nombreEmisorCertificado: "",
    codigoVerificacion: "",
  });
  const [usuarios, setUsuarios] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    fetchCertificados();
    fetchUsuarios();
    fetchCursos();
    fetchEstudiantes();
  }, []);

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

  const fetchUsuarios = async () => {
    const response = await fetch("http://localhost:3000/api/usuarios");
    const data = await response.json();
    setUsuarios(data);
  };

  const fetchCursos = async () => {
    const response = await fetch("http://localhost:3000/api/cursos");
    const data = await response.json();
    setCursos(data);
  };

  const fetchEstudiantes = async () => {
    const response = await fetch("http://localhost:3000/api/estudiantes");
    const data = await response.json();
    setEstudiantes(data);
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
        body: JSON.stringify(formValues),
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
    try {
      const response = await fetch(
        `http://localhost:3000/api/certificados/${selectedCertificado._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formValues),
        }
      );

      if (response.ok) {
        const certificadoActualizado = await response.json();
        setCertificados(
          certificados.map((certificado) =>
            certificado._id === selectedCertificado._id ? certificadoActualizado : certificado
          )
        );
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

  const handleDeleteCertificado = async () => {
    if (!selectedCertificado) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/certificados/${selectedCertificado._id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setCertificados(certificados.filter((certificado) => certificado._id !== selectedCertificado._id));
        handleCloseDeleteDialog(); // Cierra el modal de confirmación después de eliminar
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

  const handleEditClick = (certificado) => {
    setSelectedCertificado(certificado);
    setFormValues({
      nombre: certificado.nombre || "",
      fechaEmision: certificado.fechaEmision || "",
      usuarioId: certificado.usuarioId || "",
      cursoId: certificado.cursoId || "",
      estudianteId: certificado.estudianteId || "",
      nombreEmisorCertificado: certificado.nombreEmisorCertificado || "",
      codigoVerificacion: certificado.codigoVerificacion || "",
    });
  };

  const handleDetailsClick = (certificado) => {
    setSelectedCertificado(certificado);
    setOpenDetailsDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedCertificado(null);
  };

  const handleCloseDetailsDialog = () => {
    setOpenDetailsDialog(false);
    setSelectedCertificado(null);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setErrorMessage(null);
  };

  const clearForm = () => {
    setFormValues({
      nombre: "",
      fechaEmision: "",
      usuarioId: "",
      cursoId: "",
      estudianteId: "",
      nombreEmisorCertificado: "",
      codigoVerificacion: "",
    });
    setSelectedCertificado(null);
  };

  return (
    <Container>
      <h1>Gestión de Certificados</h1>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
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
                    <TableCell>{certificado.nombre}</TableCell>
                    <TableCell>{new Date(certificado.fechaEmision).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEditClick(certificado)} color="primary">
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => handleDetailsClick(certificado)} color="default">
                        <Info />
                      </IconButton>
                      <IconButton onClick={() => {
                        setSelectedCertificado(certificado);
                        setOpenDeleteDialog(true);
                      }} color="secondary">
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={12} md={6}>
          <form noValidate autoComplete="off">
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
              name="fechaEmision"
              type="date"
              value={formValues.fechaEmision}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
            {/* Campo de selección para Usuario */}
            <FormControl fullWidth margin="normal">
              <InputLabel id="usuario-label">Usuario</InputLabel>
              <Select
                labelId="usuario-label"
                name="usuarioId"
                value={formValues.usuarioId}
                onChange={handleInputChange}
              >
                {usuarios.map((usuario) => (
                  <MenuItem key={usuario._id} value={usuario._id}>
                    {usuario.nombre} {/* Asegúrate de que 'nombre' sea el campo correcto */}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Campo de selección para Curso */}
            <FormControl fullWidth margin="normal">
              <InputLabel id="curso-label">Curso</InputLabel>
              <Select
                labelId="curso-label"
                name="cursoId"
                value={formValues.cursoId}
                onChange={handleInputChange}
              >
                {cursos.map((curso) => (
                  <MenuItem key={curso._id} value={curso._id}>
                    {curso.nombre} {/* Asegúrate de que 'nombre' sea el campo correcto */}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Campo de selección para Estudiante */}
            <FormControl fullWidth margin="normal">
              <InputLabel id="estudiante-label">Estudiante</InputLabel>
              <Select
                labelId="estudiante-label"
                name="estudianteId"
                value={formValues.estudianteId}
                onChange={handleInputChange}
              >
                {estudiantes.map((estudiante) => (
                  <MenuItem key={estudiante._id} value={estudiante._id}>
                    {estudiante.nombre} {/* Asegúrate de que 'nombre' sea el campo correcto */}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Nombre del Emisor"
              name="nombreEmisorCertificado"
              value={formValues.nombreEmisorCertificado}
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
          </form>
        </Grid>
      </Grid>

      {/* Modal de Confirmación de Eliminación */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent dividers>
          <Typography>
            ¿Estás seguro de que quieres eliminar el certificado{" "}
            <strong>{selectedCertificado?.nombre}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="default">
            Cancelar
          </Button>
          <Button onClick={handleDeleteCertificado} color="secondary">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Detalles del Certificado */}
      <Dialog
        open={openDetailsDialog}
        onClose={handleCloseDetailsDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Detalles del Certificado</DialogTitle>
        <DialogContent dividers>
          {selectedCertificado && (
            <div>
              <Typography variant="h6">Nombre: {selectedCertificado.nombre}</Typography>
              <Typography variant="body1">Fecha de Emisión: {new Date(selectedCertificado.fechaEmision).toLocaleDateString()}</Typography>
              <Typography variant="body1">Usuario ID: {selectedCertificado.usuarioId}</Typography>
              <Typography variant="body1">Curso ID: {selectedCertificado.cursoId}</Typography>
              <Typography variant="body1">Estudiante ID: {selectedCertificado.estudianteId}</Typography>
              <Typography variant="body1">Nombre del Emisor: {selectedCertificado.nombreEmisorCertificado}</Typography>
              <Typography variant="body1">Código de Verificación: {selectedCertificado.codigoVerificacion}</Typography>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailsDialog} color="default">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para mensajes de error */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Certificados;

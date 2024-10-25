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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { Edit, Delete, Info } from "@mui/icons-material";

const Certificados = () => {
  const [certificados, setCertificados] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
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
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [certificadoToDelete, setCertificadoToDelete] = useState(null);
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const [infoCertificado, setInfoCertificado] = useState(null);

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
      console.log(data); // Verifica la estructura de los datos
      setCertificados(data);
    } catch (error) {
      console.error("Error al obtener certificados:", error);
      setErrorMessage("Error al obtener certificados");
      setOpenSnackbar(true);
    }
  };

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
    try {
      const response = await fetch(
        `http://localhost:3000/api/certificados/${selectedCertificado._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formValues,
            fechaEmision: new Date(formValues.fechaEmision).toISOString(),
          }),
        }
      );

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

  const handleEditClick = (certificado) => {
    setSelectedCertificado(certificado);
    setFormValues({
      nombre: certificado.nombre,
      fechaEmision: certificado.fechaEmision,
      usuarioId: certificado.usuarioId,
      cursoId: certificado.cursoId,
      estudianteId: certificado.estudianteId,
      nombreEmisorCertificado: certificado.nombreEmisorCertificado,
      codigoVerificacion: certificado.codigoVerificacion,
    });
  };

  const handleDeleteClick = (certificado) => {
    setCertificadoToDelete(certificado);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setCertificadoToDelete(null);
  };

  const handleInfoClick = async (certificado) => {
    const response = await fetch(`http://localhost:3000/api/certificados/${certificado._id}`);
    const data = await response.json();
    setInfoCertificado(data);
    setOpenInfoDialog(true);
  };

  const handleCloseInfoDialog = () => {
    setOpenInfoDialog(false);
    setInfoCertificado(null);
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
          type="date"
          name="fechaEmision"
          value={formValues.fechaEmision}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Usuario</InputLabel>
          <Select
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
          <InputLabel>Curso</InputLabel>
          <Select
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
          <InputLabel>Estudiante</InputLabel>
          <Select
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
                  <IconButton onClick={() => handleInfoClick(certificado)} color="primary">
                    <Info />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteClick(certificado)} color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Eliminar Certificado</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro de que deseas eliminar el certificado {certificadoToDelete?.nombre}?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">Cancelar</Button>
          <Button onClick={handleDeleteCertificado} color="secondary">Eliminar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openInfoDialog} onClose={handleCloseInfoDialog}>
        <DialogTitle>Información del Certificado</DialogTitle>
        <DialogContent>
          <Typography>Nombre: {infoCertificado?.nombre}</Typography>
          <Typography>Fecha de Emisión: {infoCertificado?.fechaEmision}</Typography>
          <Typography>Usuario: {infoCertificado?.usuarioId?.nombreUsuario || "Usuario no encontrado"}</Typography>
          <Typography>Curso: {infoCertificado?.cursoId?.nombreCurso || "Curso no encontrado"}</Typography>
          <Typography>Estudiante: {infoCertificado?.estudianteId?.nombreEstudiante || "Estudiante no encontrado"}</Typography>
          <Typography>Nombre del Emisor: {infoCertificado?.nombreEmisorCertificado}</Typography>
          <Typography>Código de Verificación: {infoCertificado?.codigoVerificacion}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseInfoDialog} color="primary">Cerrar</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Certificados;

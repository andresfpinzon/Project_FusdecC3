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
} from "@mui/material";
import { Edit, Delete, Description, Info } from "@mui/icons-material";

const token = localStorage.getItem("token");

const Certificados = () => {
  const [formValues, setFormValues] = useState({
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
  const [certificados, setCertificados] = useState([]);
  const [auditorias, setAuditorias] = useState([]);
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
    fetchAuditorias();
    // Decodificar el token y obtener el ID de usuario
    if (token) {
      const decodedToken = jwtDecode(token);
      setFormValues((prevFormValues) => ({
        ...prevFormValues,
        usuarioId: decodedToken.id,
        nombreEmisorCertificado: decodedToken.nombre + " " + decodedToken.apellido, 
      }));
    }
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/usuarios",{
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

  const fetchEstudiantes = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/estudiantes",{
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

  const fetchCertificados = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/certificados",{
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

  const fetchAuditorias = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/auditorias",{
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

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
        }),
      });

      if (response.ok) {
        const nuevoCertificado = await response.json();
        setCertificados([...certificados, nuevoCertificado]);
        setFormValues({
          fechaEmision: "",
          usuarioId: formValues.usuarioId,
          cursoId: "",
          estudianteId: "",
          nombreEmisorCertificado: formValues.nombreEmisorCertificado,
          codigoVerificacion: "",
        });
        setAuditorias([...auditorias, nuevoCertificado.nuevaAuditoria]);
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
      fechaEmision: certificado.fechaEmision,
      usuarioId: certificado.usuarioId,
      cursoId: certificado.cursoId,
      estudianteId: certificado.estudianteId,
      nombreEmisorCertificado: certificado.nombreEmisorCertificado, 
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

  const handleAuditoria = (id) => {
    const auditoria = auditorias.find(aud => aud.certificadoId === id);
    if (auditoria) {
      console.log(`Auditoría para el certificado con ID: ${id}`, auditoria);
    } else {
      console.log(`No se encontró auditoría para el certificado con ID: ${id}`);
    }
  };

  return (
    <Container maxWidth="lg">
      <h1>Gestión de Certificados</h1>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
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
        <Grid item xs={12} md={6}>
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
                {certificados.map((certificado) => (
                  <TableRow key={certificado._id}>
                    <TableCell>
                      {certificado.codigoVerificacion}
                    </TableCell>
                    <TableCell>
                      {new Date(certificado.fechaEmision).toLocaleDateString()}
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
                      <IconButton
                        onClick={() => handleAuditoria(certificado._id)}
                        sx={{ color: 'purple' }}
                      >
                        <Description />
                      </IconButton>
                      <IconButton onClick={() => handleDetailsClick(certificado)} color="success">
                        <Info />
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

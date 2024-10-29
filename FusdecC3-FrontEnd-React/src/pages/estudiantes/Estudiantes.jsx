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
  Switch,
  Box,
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
  Checkbox,
  ListItemText,
} from "@mui/material";
import { Edit, Delete, Info } from "@mui/icons-material";

const Estudiantes = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [colegios, setColegios] = useState([]);
  const [ediciones, setEdiciones] = useState([]);
  const [calificaciones, setCalificaciones] = useState([]);
  const [certificados, setCertificados] = useState([]);
  const [asistencias, setAsistencias] = useState([]);
  const [inasistencias, setInasistencias] = useState([]);
  const [selectedEstudiante, setSelectedEstudiante] = useState(null);
  const [formValues, setFormValues] = useState({
    nombreEstudiante: "",
    apellidoEstudiante: "",
    numeroDocumento: "",
    correoEstudiante: "",
    tipoDocumento: "",
    fechaNacimiento: "",
    generoEstudiante: "",
    unidadId: "",
    colegioId: "",
    estadoEstudiante: true,
    ediciones: [],
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [estudianteToDelete, setEstudianteToDelete] = useState(null);
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const [infoEstudiante, setInfoEstudiante] = useState(null);

  useEffect(() => {
    fetchEstudiantes();
    fetchUnidades();
    fetchColegios();
    fetchEdiciones();
    fetchCertificados();
    fetchAsistencias();
    fetchInasistencias();
    fetchCalificaciones();
  }, []);

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

  const fetchUnidades = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/unidades");
      if (!response.ok) throw new Error("Error al obtener unidades");
      const data = await response.json();
      setUnidades(data);
    } catch (error) {
      console.error("Error al obtener unidades:", error);
      setErrorMessage("Error al obtener unidades");
      setOpenSnackbar(true);
    }
  };

  const fetchColegios = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/colegios");
      if (!response.ok) throw new Error("Error al obtener colegios");
      const data = await response.json();
      setColegios(data);
    } catch (error) {
      console.error("Error al obtener colegios:", error);
      setErrorMessage("Error al obtener colegios");
      setOpenSnackbar(true);
    }
  };

  const fetchEdiciones = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/ediciones");
      if (!response.ok) throw new Error("Error al obtener ediciones");
      const data = await response.json();
      setEdiciones(data);
    } catch (error) {
      console.error("Error al obtener ediciones:", error);
      setErrorMessage("Error al obtener ediciones");
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

  const fetchAsistencias = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/asistencias");
      if (!response.ok) throw new Error("Error al obtener asistencias");
      const data = await response.json();
      setAsistencias(data);
    } catch (error) {
      console.error("Error al obtener asistencias:", error);
      setErrorMessage("Error al obtener asistencias");
      setOpenSnackbar(true);
    }
  };

  const fetchInasistencias = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/inasistencias");
      if (!response.ok) throw new Error("Error al obtener inasistencias");
      const data = await response.json();
      setInasistencias(data);
    } catch (error) {
      console.error("Error al obtener inasistencias:", error);
      setErrorMessage("Error al obtener inasistencias");
      setOpenSnackbar(true);
    }
  };

  const fetchCalificaciones = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/calificaciones");
      if (!response.ok) throw new Error("Error al obtener calificaciones");
      const data = await response.json();
      setCalificaciones(data);
    } catch (error) {
      console.error("Error al obtener calificaciones:", error);
      setErrorMessage("Error al obtener calificaciones");
      setOpenSnackbar(true);
    }
  };

  const handleInputChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleSwitchChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.checked,
    });
  };

  const handleEditionChange = (e) => {
    const {
      target: { value },
    } = e;
    setFormValues({
      ...formValues,
      ediciones: typeof value === "string" ? value.split(",") : value,
    });
  };

  const handleCreateEstudiante = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/estudiantes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });

      if (response.ok) {
        const nuevoEstudiante = await response.json();
        setEstudiantes([...estudiantes, nuevoEstudiante]);
        setFormValues({
          nombreEstudiante: "",
          apellidoEstudiante: "",
          numeroDocumento: "",
          correoEstudiante: "",
          tipoDocumento: "",
          fechaNacimiento: "",
          generoEstudiante: "",
          unidadId: "",
          colegioId: "",
          estadoEstudiante: true,
          ediciones: [],
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al crear estudiante");
      }
    } catch (error) {
      console.error("Error al crear estudiante:", error);
      setErrorMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  const handleUpdateEstudiante = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/estudiantes/${selectedEstudiante._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formValues),
        }
      );

      if (response.ok) {
        const updatedEstudiante = await response.json();
        const updatedEstudiantes = estudiantes.map((estudiante) =>
          estudiante._id === updatedEstudiante._id ? updatedEstudiante : estudiante
        );
        setEstudiantes(updatedEstudiantes);
        setSelectedEstudiante(null);
        setFormValues({
          nombreEstudiante: "",
          apellidoEstudiante: "",
          numeroDocumento: "",
          correoEstudiante: "",
          tipoDocumento: "",
          fechaNacimiento: "",
          generoEstudiante: "",
          unidadId: "",
          colegioId: "",
          estadoEstudiante: true,
          ediciones: [],
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar estudiante");
      }
    } catch (error) {
      console.error("Error al actualizar estudiante:", error);
      setErrorMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  const handleDeleteEstudiante = async () => {
    if (!estudianteToDelete) return;
    try {
      const response = await fetch(
        `http://localhost:3000/api/estudiantes/${estudianteToDelete._id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        setEstudiantes(estudiantes.filter((estudiante) => estudiante._id !== estudianteToDelete._id));
        handleCloseDeleteDialog();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar estudiante");
      }
    } catch (error) {
      console.error("Error al eliminar estudiante:", error);
      setErrorMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  const handleEditClick = (estudiante) => {
    setSelectedEstudiante(estudiante);
    setFormValues({
      nombreEstudiante: estudiante.nombreEstudiante,
      apellidoEstudiante: estudiante.apellidoEstudiante,
      numeroDocumento: estudiante.numeroDocumento,
      correoEstudiante: estudiante.correoEstudiante,
      tipoDocumento: estudiante.tipoDocumento,
      fechaNacimiento: estudiante.fechaNacimiento,
      generoEstudiante: estudiante.generoEstudiante,
      unidadId: estudiante.unidadId?._id || "", 
      colegioId: estudiante.colegioId?._id || "", 
      estadoEstudiante: estudiante.estadoEstudiante,
      ediciones: estudiante.ediciones.map((edicion) => edicion._id),
    });
  };

  const handleDeleteClick = (estudiante) => {
    setEstudianteToDelete(estudiante);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setEstudianteToDelete(null);
  };

  const handleInfoClick = async (estudiante) => {
    const response = await fetch(`http://localhost:3000/api/estudiantes/${estudiante._id}`);
    const data = await response.json();
    setInfoEstudiante(data);
    setOpenInfoDialog(true);
  };

  const handleCloseInfoDialog = () => {
    setOpenInfoDialog(false);
    setInfoEstudiante(null);
  };

  return (
    <Container>
      <h1>Gestión de Estudiantes:</h1>
      <form noValidate autoComplete="off">
        <TextField
          label="Nombre"
          name="nombreEstudiante"
          value={formValues.nombreEstudiante}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Apellido"
          name="apellidoEstudiante"
          value={formValues.apellidoEstudiante}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Tipo de Documento</InputLabel>
          <Select
            name="tipoDocumento"
            value={formValues.tipoDocumento}
            onChange={handleInputChange}
            input={<OutlinedInput label="Tipo de Documento" />}
          >
            <MenuItem value="T.I">T.I</MenuItem>
            <MenuItem value="C.C">C.C</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Número de Documento"
          name="numeroDocumento"
          value={formValues.numeroDocumento}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Correo Electrónico"
          name="correoEstudiante"
          value={formValues.correoEstudiante}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Fecha de Nacimiento"
          type="date"
          name="fechaNacimiento"
          value={formValues.fechaNacimiento}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Género</InputLabel>
          <Select
            name="generoEstudiante"
            value={formValues.generoEstudiante}
            onChange={handleInputChange}
            input={<OutlinedInput label="Género" />}
          >
            <MenuItem value="Masculino">Masculino</MenuItem>
            <MenuItem value="Femenino">Femenino</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Unidad</InputLabel>
          <Select
            name="unidadId"
            value={formValues.unidadId}
            onChange={handleInputChange}
            input={<OutlinedInput label="Unidad" />}
          >
            {unidades.map((unidad) => (
              <MenuItem key={unidad._id} value={unidad._id}>
                {unidad.nombreUnidad}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Colegio</InputLabel>
          <Select
            name="colegioId"
            value={formValues.colegioId}
            onChange={handleInputChange}
            input={<OutlinedInput label="Colegio" />}
          >
            {colegios.map((colegio) => (
              <MenuItem key={colegio._id} value={colegio._id}>
                {colegio.nombreColegio}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Ediciones</InputLabel>
          <Select
            multiple
            value={formValues.ediciones}
            onChange={handleEditionChange}
            input={<OutlinedInput label="Ediciones" />}
            renderValue={(selected) =>
              ediciones
                .filter((edicion) => selected.includes(edicion._id))
                .map((edicion) => edicion.tituloEdicion)
                .join(", ")
            }
          >
            {ediciones.map((edicion) => (
              <MenuItem key={edicion._id} value={edicion._id}>
                <Checkbox checked={formValues.ediciones.indexOf(edicion._id) > -1} />
                <ListItemText primary={edicion.tituloEdicion} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box marginTop={2} marginBottom={2}>
          <Switch
            checked={formValues.estadoEstudiante}
            onChange={handleSwitchChange}
            name="estadoEstudiante"
            color="primary"
          />
          Estado Activo
        </Box>
        <Box marginTop={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={selectedEstudiante ? handleUpdateEstudiante : handleCreateEstudiante}
          >
            {selectedEstudiante ? "Actualizar Estudiante" : "Crear Estudiante"}
          </Button>
        </Box>
      </form>

      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Apellido</TableCell>
              <TableCell>Tipo de Documento</TableCell>
              <TableCell>Número de Documento</TableCell>
              <TableCell>Correo</TableCell>
              <TableCell>Unidad</TableCell>
              <TableCell>Colegio</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {estudiantes.map((estudiante) => (
              <TableRow key={estudiante._id}>
                <TableCell>{estudiante.nombreEstudiante}</TableCell>
                <TableCell>{estudiante.apellidoEstudiante}</TableCell>
                <TableCell>{estudiante.tipoDocumento}</TableCell>
                <TableCell>{estudiante.numeroDocumento}</TableCell>
                <TableCell>{estudiante.correoEstudiante}</TableCell>
                <TableCell>{estudiante.unidadId?.nombreUnidad || "Unidad no encontrada"}</TableCell>
                <TableCell>{estudiante.colegioId?.nombreColegio || "Colegio no encontrado"}</TableCell>
                <TableCell>{estudiante.estadoEstudiante ? "Activo" : "Inactivo"}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditClick(estudiante)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleInfoClick(estudiante)} color="primary">
                    <Info />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteClick(estudiante)} color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Eliminar Estudiante</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro de que deseas eliminar a {estudianteToDelete?.nombreEstudiante}?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">Cancelar</Button>
          <Button onClick={handleDeleteEstudiante} color="secondary">Eliminar</Button>
        </DialogActions>
      </Dialog>

      
      <Dialog open={openInfoDialog} onClose={handleCloseInfoDialog}>
        <DialogTitle>Información del Estudiante</DialogTitle>
        <DialogContent>
          <Typography>Nombre: {infoEstudiante?.nombreEstudiante}</Typography>
          <Typography>Apellido: {infoEstudiante?.apellidoEstudiante}</Typography>
          <Typography>Tipo de Docoumento: {infoEstudiante?.tipoDocumento}</Typography>
          <Typography>Número de Documento: {infoEstudiante?.numeroDocumento}</Typography>
          <Typography>Fecha de Nacimiento: {infoEstudiante?.fechaNacimiento}</Typography>
          <Typography>Correo: {infoEstudiante?.correoEstudiante}</Typography>
          <Typography>Unidad: {infoEstudiante?.unidadId?.nombreUnidad || "Unidad no encontrada"}</Typography>
          <Typography>Colegio: {infoEstudiante?.colegioId?.nombreColegio || "Colegio no encontrado"}</Typography>
          <Typography>Estado: {infoEstudiante?.estadoEstudiante ? "Activo" : "Inactivo"}</Typography>
          <Typography>
          Ediciones: {infoEstudiante?.ediciones?.map((ed) => ed.tituloEdicion).join(", ") || "Sin ediciones"}
          </Typography>
          <Typography>
          asistencias: {infoEstudiante?.asistencias?.map((as) => as.tituloAsistencia).join(", ") || "Sin asistencias"}
          </Typography>
          <Typography>
          inasistencias: {infoEstudiante?.inasistencias?.map((ina) => ina.tituloInasistencia).join(", ") || "Sin inasistencias"}
          </Typography>
          <Typography>
          calificaciones: {infoEstudiante?.calificaciones?.map((ca) => ca.tituloCalificacion).join(", ") || "Sin calificaciones"}
          </Typography>
          <Typography>
          certificados: {infoEstudiante?.certificados?.map((ce) => ce.codigoVerificacion).join(", ") || "Sin certificados"}
          </Typography>
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

export default Estudiantes;

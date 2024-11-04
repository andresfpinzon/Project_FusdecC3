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

const token = localStorage.getItem("token");

const Asistencias = () => {
  const [asistencias, setAsistencias] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [selectedAsistencia, setSelectedAsistencia] = useState(null);
  const [formValues, setFormValues] = useState({
    tituloAsistencia: "",
    fechaAsistencia: "",
    usuarioId: "", 
    estadoAsistencia: true,
    estudiantes: [],
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [asistenciaToDelete, setAsistenciaToDelete] = useState(null);
  const [openInfoDialog, setOpenInfoDialog] = useState(false);

  useEffect(() => {
    fetchAsistencias();
    fetchEstudiantes();
     // Decodificar el token y obtener el ID de usuario
     if (token) {
      const decodedToken = jwtDecode(token);
      console.log(decodedToken);
      setFormValues((prevFormValues) => ({
        ...prevFormValues,
        usuarioId: decodedToken.id, 
      }));
    }
  }, []);

  const fetchAsistencias = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/asistencias", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token 
        }
    });
      if (!response.ok) throw new Error("Error al obtener asistencias");
      const data = await response.json();
      setAsistencias(data);
    } catch (error) {
      setErrorMessage("Error al obtener asistencias", error);
      setOpenSnackbar(true);
    }
  };

  const fetchEstudiantes = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/estudiantes",
        {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
              "Authorization": token 
          }
      }
      );
      if (!response.ok) throw new Error("Error al obtener estudiantes");
      const data = await response.json();
      setEstudiantes(data);
    } catch (error) {
      setErrorMessage("Error al obtener estudiantes", error);
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

  const handleEstudianteChange = (e) => {
    const { target: { value } } = e;
    setFormValues({
      ...formValues,
      estudiantes: typeof value === "string" ? value.split(",") : value,
    });
  };

  const handleCreateAsistencia = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/asistencias", {
        method: "POST",
        headers: { "Content-Type": "application/json",
          "Authorization": token 
         },
        body: JSON.stringify(formValues),
      });

      if (response.ok) {
        const nuevaAsistencia = await response.json();
        setAsistencias([...asistencias, nuevaAsistencia]);
        setFormValues({
          tituloAsistencia: "",
          fechaAsistencia: "",
          usuarioId: formValues.usuarioId,
          estadoAsistencia: true,
          estudiantes: [],
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al crear asistencia");
      }
    } catch (error) {
      setErrorMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  const handleUpdateAsistencia = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/asistencias/${selectedAsistencia._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json",
          "Authorization": token 
         },
        body: JSON.stringify(formValues),
      });

      if (response.ok) {
        const updatedAsistencia = await response.json();
        const updatedAsistencias = asistencias.map((asistencia) =>
          asistencia._id === updatedAsistencia._id ? updatedAsistencia : asistencia
        );
        setAsistencias(updatedAsistencias);
        setSelectedAsistencia(null);
        setFormValues({
          tituloAsistencia: "",
          fechaAsistencia: "",
          usuarioId: "",
          estadoAsistencia: true,
          estudiantes: [],
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar asistencia");
      }
    } catch (error) {
      setErrorMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  const handleDeleteAsistencia = async () => {
    if (!asistenciaToDelete) return;
    try {
      const response = await fetch(`http://localhost:3000/api/asistencias/${asistenciaToDelete._id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json",
          "Authorization": token 
         },
      });
      if (response.ok) {
        setAsistencias(asistencias.filter((asistencia) => asistencia._id !== asistenciaToDelete._id));
        handleCloseDeleteDialog();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar asistencia");
      }
    } catch (error) {
      setErrorMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  const handleEditClick = (asistencia) => {
    setSelectedAsistencia(asistencia);
    setFormValues({
      tituloAsistencia: asistencia.tituloAsistencia,
      fechaAsistencia: asistencia.fechaAsistencia,
      usuarioId: asistencia.usuarioId,
      estadoAsistencia: asistencia.estadoAsistencia,
      estudiantes: asistencia.estudiantes.map((estudiante) => estudiante._id),
    });
  };

  const handleInfoClick = (asistencia) => {
    setSelectedAsistencia(asistencia);
    setOpenInfoDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setAsistenciaToDelete(null);
  };

  const handleCloseInfoDialog = () => {
    setOpenInfoDialog(false);
  };

  return (
    <Container>
      <h1>Gestión de Asistencias</h1>
      <form noValidate autoComplete="off">
        <TextField
          label="Título de Asistencia"
          name="tituloAsistencia"
          value={formValues.tituloAsistencia}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Fecha de Asistencia"
          name="fechaAsistencia"
          type="date"
          value={formValues.fechaAsistencia}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Estudiantes</InputLabel>
          <Select
            multiple
            value={formValues.estudiantes}
            onChange={handleEstudianteChange}
            input={<OutlinedInput label="Estudiantes" />}
            renderValue={(selected) =>
              estudiantes
                .filter((est) => selected.includes(est._id))
                .map((est) => est.nombreEstudiante)
                .join(", ")
            }
          >
            {estudiantes.map((est) => (
              <MenuItem key={est._id} value={est._id}>
                <Checkbox checked={formValues.estudiantes.indexOf(est._id) > -1} />
                <ListItemText primary={est.nombreEstudiante} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box marginTop={2} marginBottom={2}>
          <Switch
            checked={formValues.estadoAsistencia}
            onChange={handleSwitchChange}
            name="estadoAsistencia"
            color="primary"
          />
          Estado Activo
        </Box>
        <Box marginTop={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={selectedAsistencia ? handleUpdateAsistencia : handleCreateAsistencia}
          >
            {selectedAsistencia ? "Actualizar Asistencia" : "Crear Asistencia"}
          </Button>
        </Box>
      </form>

      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Título</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {asistencias.map((asistencia) => (
              <TableRow key={asistencia._id}>
                <TableCell>{asistencia.tituloAsistencia}</TableCell>
                <TableCell>{asistencia.fechaAsistencia}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditClick(asistencia)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleInfoClick(asistencia)} color="primary">
                    <Info />
                  </IconButton>
                  <IconButton onClick={() => setOpenDeleteDialog(true) & setAsistenciaToDelete(asistencia)} color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openInfoDialog} onClose={handleCloseInfoDialog}>
        <DialogTitle>Detalles de la Asistencia</DialogTitle>
        <DialogContent>
          <Typography>Título: {selectedAsistencia?.tituloAsistencia}</Typography>
          <Typography>Fecha: {selectedAsistencia?.fechaAsistencia}</Typography>
          <Typography>Estudiantes: {selectedAsistencia?.estudiantes?.map((est) => est.nombreEstudiante).join(", ")|| "Sin estudiantes"}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseInfoDialog} color="primary">Cerrar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Eliminar Asistencia</DialogTitle>
        <DialogContent>
          ¿Estás seguro de que quieres eliminar esta asistencia?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">Cancelar</Button>
          <Button onClick={handleDeleteAsistencia} color="error">Eliminar</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity="error" onClose={() => setOpenSnackbar(false)}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Asistencias;

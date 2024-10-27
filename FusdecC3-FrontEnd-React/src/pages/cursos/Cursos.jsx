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
} from "@mui/material";

import { Edit, Delete, Info } from "@mui/icons-material";

const Cursos = () => {
  const [fundaciones, setFundaciones] = useState([]);
  const [ediciones, setEdiciones] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [selectedCurso, setSelectedCurso] = useState(null);
  const [formValues, setFormValues] = useState({
    nombreCurso: "",
    descripcionCurso: "",
    intensidadHorariaCurso: "",
    estadoCurso: true,
    //fundacionId: "",
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [cursoToDelete, setCursoToDelete] = useState(null);
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const [infoCurso, setInfoCurso] = useState(null);

  
  

  //constante con promise.all para que se ejecuten en paralelo los fetch de cursos, funaciones y ediciones
  const fetchData = async () => {
    try {
      const [cursosData, fundacionesData, edicionesData] = await Promise.all([
        fetch("http://localhost:3000/api/cursos").then((res) => res.json()),
        //fetch("http://localhost:3000/api/fundaciones").then((res) => res.json()),
        fetch("http://localhost:3000/api/ediciones").then((res) => res.json()),
      ]);
      setCursos(cursosData);
      setFundaciones(fundacionesData);
      setEdiciones(edicionesData);
    } catch (error) {
      handleError("Error al cargar los datos");
    } 
  };
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const handleError = (message) => {
    setErrorMessage(message);
    setOpenSnackbar(true);
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

  const handleCreateCurso = async () => {
    if (!formValues.nombreCurso || !formValues.descripcionCurso || !formValues.intensidadHorariaCurso) {
        setErrorMessage("Todos los campos son obligatorios");
        setOpenSnackbar(true);
        return;
    }
    try {
        const response = await fetch("http://localhost:3000/api/cursos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formValues),
        });

        // Maneja la respuesta
        if (response.ok) {
            const nuevoCurso = await response.json();
            setCursos([...cursos, nuevoCurso]);
            setFormValues({
                nombreCurso: "",
                descripcionCurso: "",
                intensidadHorariaCurso: "",
                estadoCurso: true,
                //fundacionId: "",
            });
            console.log('Curso creado exitosamente:', nuevoCurso);
        } else {
            const errorData = await response.json();
            throw new Error(errorData.error || "Error al crear curso");
        }
    } catch (error) {
        handleError("Error al crear cursos");
    }
};

  const handleUpdateCurso = async () => {
    if (!selectedCurso) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/cursos/${selectedCurso._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formValues),
        }
      );

      if (response.ok) {
        const cursoActualizado = await response.json();
        setCursos(
          cursos.map((curso) =>
            curso._id === selectedCurso._id ? cursoActualizado : curso
          )
        );
        setSelectedCurso(null);
        setFormValues({
          nombreCurso: "",
          descripcionCurso: "",
          intensidadHorariaCurso: "",
          estadoCurso: true,
          //fundacionId: "",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar curso");
      }
    } catch (error) {
      handleError("Error al actualizar cursos");
    }
  };

  const handleDeleteCurso = async () => {
    if (!cursoToDelete) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/cursos/${cursoToDelete._id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setCursos(cursos.filter((curso) => curso._id !== cursoToDelete._id));
        handleCloseDeleteDialog(); // Cierra el modal de confirmación después de eliminar
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar curso");
      }
    } catch (error) {
      handleError("Error al eliminar curso");
    }
  };

  const handleEditClick = (curso) => {
    setSelectedCurso(curso);
    setFormValues({
      nombreCurso: curso.nombreCurso || "",
      descripcionCurso: curso.descripcionCurso || "",
      intensidadHorariaCurso: curso.intensidadHorariaCurso || "",
      estadoCurso: curso.estadoCurso !== undefined ? curso.estadoCurso : true,
      //fundacionId: curso.fundacionId || "",
    });
  };  

  const handleDeleteClick = (curso) => {
    setCursoToDelete(curso);
    setOpenDeleteDialog(true);
  };

  const handleInfoClick = async (curso) => {
    const response = await fetch(`http://localhost:3000/api/cursos/${curso._id}`,);
    const data = await response.json();
    setInfoCurso(data);
    setOpenInfoDialog(true);
  };

  const handleCloseInfoDialog = () => {
    setOpenInfoDialog(false);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setCursoToDelete(null);
  };

  return (
    <Container>
      <h1>Gestión de Cursos:</h1>
      <form noValidate autoComplete="off">
        <TextField
          label="Nombre del Curso"
          name="nombreCurso"
          value={formValues.nombreCurso}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Descripción"
          name="descripcionCurso"
          value={formValues.descripcionCurso}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Intensidad Horaria"
          name="intensidadHorariaCurso"
          value={formValues.intensidadHorariaCurso}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
       {/*
        <FormControl fullWidth margin="normal">
          <InputLabel>Fundacion</InputLabel>
          <Select
            name="fundacionId"
            value={formValues.fundacionId}
            onChange={handleInputChange}
            input={<OutlinedInput label="Fundacion" />}
          >
            {fundaciones.map((fundacion) => (
              <MenuItem key={fundacion._id} value={fundacion._id}>
                {fundacion.nombreFundacion}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        */}
        
        <Box marginTop={2} marginBottom={2}>
          <Switch
            checked={formValues.estadoCurso}
            onChange={handleSwitchChange}
            name="estadoCurso"
            color="primary"
          />
          Estado Activo
        </Box>
        
        <Box marginTop={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={selectedCurso ? handleUpdateCurso : handleCreateCurso}
          >
            {selectedCurso ? "Actualizar Curso" : "Crear Curso"}
          </Button>
        </Box>
      </form>
      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre del Curso</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Intensidad Horaria</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cursos.map((curso) => (
              <TableRow key={curso._id}>
                <TableCell>{curso.nombreCurso}</TableCell>
                <TableCell>{curso.descripcionCurso}</TableCell>
                <TableCell>{curso.intensidadHorariaCurso}</TableCell>
                <TableCell>{curso.estadoCurso ? "Activo" : "Inactivo"}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleEditClick(curso)}
                    color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleInfoClick(curso)} color="primary">
                    <Info />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteClick(curso)}
                    color="secondary"
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Eliminar Curso</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro de que deseas eliminar a {cursoToDelete?.nombreCurso}?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">Cancelar</Button>
          <Button onClick={handleDeleteCurso} color="secondary">Eliminar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openInfoDialog} onClose={handleCloseInfoDialog}>
        <DialogTitle>Información del Curso</DialogTitle>
        <DialogContent>
          <Typography>Nombre: {infoCurso?.nombreCurso}</Typography>
          <Typography>Descripcion: {infoCurso?.descripcionCurso}</Typography>
          <Typography>Intensidad horaria: {infoCurso?.intensidadHorariaCurso}</Typography>
          <Typography>Estado: {infoCurso?.estadoCurso ? "Activo" : "Inactivo"}</Typography>
          <Typography>Fundacion: {infoCurso?.fundacionId?.nombreFundacion || "Fundacion no encontrada"}</Typography>
          <Typography>Ediciones: {infoCurso?.ediciones?.length > 0? infoCurso.ediciones.map((edicion) => 
            edicion.tituloEdicion).join(", "): "Ediciones no encontradas"}</Typography>
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

export default Cursos;
/* eslint-disable no-unused-vars */
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
  TablePagination
} from "@mui/material";

import { Edit, Delete, Info, School, Description, AccessTime, ToggleOn, Foundation, EventNote } from "@mui/icons-material";

const token = localStorage.getItem("token");

const Cursos = () => {
  const [fundaciones, setFundaciones] = useState([]);
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

  // Paginación y búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchCursos = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/cursos",{
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

  useEffect(() => {
    fetchCursos();
  }, []);

  // Filtrar usuarios según el término de búsqueda
  const filteredCursos = cursos.filter((curso) =>
    curso.nombreCurso.toLowerCase().includes(searchTerm.toLowerCase()) ||
    curso.descripcionCurso.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Cambiar página
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Cambiar filas por página
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
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
                "Authorization": token 
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
        handleError("Error al crear cursos", error);
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
            "Authorization": token 
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
      handleError("Error al actualizar cursos", error);
    }
  };

  const handleDeleteCurso = async () => {
    if (!cursoToDelete) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/cursos/${cursoToDelete._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token 
        }
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
      handleError("Error al eliminar curso", error);
    }
  };

  const handleEditClick = (curso) => {
    setSelectedCurso(curso);
    setFormValues({
      nombreCurso: curso.nombreCurso,
      descripcionCurso: curso.descripcionCurso,
      intensidadHorariaCurso: curso.intensidadHorariaCurso,
      estadoCurso: curso.estadoCurso !== undefined ? curso.estadoCurso : true,
      //fundacionId: curso.fundacionId || "",
    });
  };  

  const handleDeleteClick = (curso) => {
    setCursoToDelete(curso);
    setOpenDeleteDialog(true);
  };

  const handleInfoClick = async (curso) => {
    const response = await fetch(`http://localhost:3000/api/cursos/${curso._id}`,{
      method: "GET",
      headers: {
          "Content-Type": "application/json",
          "Authorization": token 
      }
  });
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

      {/* Busqueda */}
      <TextField
        label="Buscar cursos"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

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
          {filteredCursos
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((curso) => (
              <TableRow key={curso._id}>
                <TableCell>{curso.nombreCurso}</TableCell>
                <TableCell>{curso.descripcionCurso}</TableCell>
                <TableCell>{curso.intensidadHorariaCurso}</TableCell>
                <TableCell>{curso.estadoCurso ? "Activo" : "Inactivo"}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleEditClick(curso)}color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleInfoClick(curso)} color="primary">
                    <Info />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteClick(curso)}color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Paginación */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredCursos.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

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

      <Dialog open={openInfoDialog} onClose={handleCloseInfoDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: '#1d526eff', color: '#fff', textAlign: 'center' }}>
          Información del Curso
        </DialogTitle>
        <DialogContent dividers sx={{ padding: '20px' }}>
          {infoCurso && (
            <div>
              {/* Nombre del Curso */}
              <Box display="flex" alignItems="center" mb={2}>
                <School color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Nombre:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>{infoCurso.nombreCurso || "No disponible"}</Typography>
              </Box>
              
              {/* Descripción */}
              <Box display="flex" alignItems="center" mb={2}>
                <Description color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Descripción:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>{infoCurso.descripcionCurso || "No disponible"}</Typography>
              </Box>
              
              {/* Intensidad Horaria */}
              <Box display="flex" alignItems="center" mb={2}>
                <AccessTime color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Intensidad horaria:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>{infoCurso.intensidadHorariaCurso || "No disponible"}</Typography>
              </Box>
              
              {/* Estado */}
              <Box display="flex" alignItems="center" mb={2}>
                <ToggleOn color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Estado:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>{infoCurso.estadoCurso ? "Activo" : "Inactivo"}</Typography>
              </Box>
              
              {/* Fundación */}
              <Box display="flex" alignItems="center" mb={2}>
                <Foundation color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Fundación:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>
                  {infoCurso.fundacionId?.nombreFundacion || "Fundación no encontrada"}
                </Typography>
              </Box>
              
              {/* Ediciones */}
              <Box display="flex" alignItems="center" mb={2}>
                <EventNote color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Ediciones:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>
                  {infoCurso.ediciones?.length > 0 ? infoCurso.ediciones.map((edicion) => edicion.tituloEdicion).join(", ") : "Ediciones no encontradas"}
                </Typography>
              </Box>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseInfoDialog} variant="contained" color="primary">
            Cerrar
          </Button>
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
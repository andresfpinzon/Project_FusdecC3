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
  TablePagination
} from "@mui/material";

import { Edit, Delete, Info, School, Description, AccessTime, ToggleOn, Foundation, EventNote } from "@mui/icons-material";

const token = localStorage.getItem("token");

const Objetivos = () => {
  const [objetivos, setObjetivos] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [selectedObjetivo, setSelectedObjetivo] = useState(null);
  const [formValues, setFormValues] = useState({
    tituloObjetivo: "",
    descripcionObjetivo: "",
    estadoObjetivo: true,
    cursoId: "",
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [objetivoToDelete, setObjetivoToDelete] = useState(null);
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const [infoObjetivo, setInfoObjetivo] = useState(null);

  // Paginación y búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchObjetivos = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/objetivos",{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token 
        }
    });
      if (!response.ok) throw new Error("Error al obtener objetivos");
      const data = await response.json();
      setObjetivos(data);
    } catch (error) {
      console.error("Error al obtener objetivos:", error);
      setErrorMessage("Error al obtener objetivos");
      setOpenSnackbar(true);
    }
  };

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
    fetchObjetivos();
    fetchCursos();
  }, []);

  // Filtrar objetivos según el término de búsqueda
  const filteredObjetivos = objetivos.filter((objetivo) =>
    objetivo.tituloObjetivo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    objetivo.descripcionObjetivo.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleCreateObjetivo = async () => {
    if (!formValues.tituloObjetivo || !formValues.descripcionObjetivo) {
        setErrorMessage("Todos los campos son obligatorios");
        setOpenSnackbar(true);
        return;
    }
    try {
        const response = await fetch("http://localhost:3000/api/objetivos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token 
            },
            body: JSON.stringify(formValues),
        });

        // Maneja la respuesta
        if (response.ok) {
            const nuevoObjetivo = await response.json();
            setObjetivos([...objetivos, nuevoObjetivo]);
            setFormValues({
                tituloObjetivo: "",
                descripcionObjetivo: "",
                estadoObjetivo: true,
                cursoId: "",
            });
            console.log('Objetivo creado exitosamente:', nuevoObjetivo);
        } else {
            const errorData = await response.json();
            throw new Error(errorData.error || "Error al crear objetivo");
        }
    } catch (error) {
        handleError("Error al crear objetivos", error);
    }
};

  const handleUpdateObjetivo = async () => {
    if (!selectedObjetivo) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/objetivos/${selectedObjetivo._id}`,
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
        await fetchObjetivos();
        const objetivoActualizado = await response.json();
        setObjetivos(
          objetivos.map((objetivo) =>
            objetivo._id === selectedObjetivo._id ? objetivoActualizado : objetivo
          )
        );
        setSelectedObjetivo(null);
        setFormValues({
            tituloObjetivo: "",
            descripcionObjetivo: "",
            estadoObjetivo: true,
            cursoId: "",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar objetivo");
      }
    } catch (error) {
      handleError("Error al actualizar objetivos", error);
    }
  };

  const handleDeleteObjetivo = async () => {
    if (!objetivoToDelete) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/objetivos/${objetivoToDelete._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token 
        }
        }
      );

      if (response.ok) {
        setObjetivos(objetivos.filter((objetivo) => objetivo._id !== objetivoToDelete._id));
        handleCloseDeleteDialog(); // Cierra el modal de confirmación después de eliminar
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar objetivo");
      }
    } catch (error) {
      handleError("Error al eliminar objetivo", error);
    }
  };

  const handleEditClick = (objetivo) => {
    setSelectedObjetivo(objetivo);
    setFormValues({
      tituloObjetivo: objetivo.tituloObjetivo,
      descripcionObjetivo: objetivo.descripcionObjetivo,
      estadoObjetivo: objetivo.estadoObjetivo !== undefined ? objetivo.estadoObjetivo : true,
      cursoId: objetivo.cursoId?.id_ || "",
    });
  };  

  const handleDeleteClick = (objetivo) => {
    setObjetivoToDelete(objetivo);
    setOpenDeleteDialog(true);
  };

  const handleInfoClick = async (objetivo) => {
    const response = await fetch(`http://localhost:3000/api/objetivos/${objetivo._id}`,{
      method: "GET",
      headers: {
          "Content-Type": "application/json",
          "Authorization": token 
      }
  });
    const data = await response.json();
    setInfoObjetivo(data);
    setOpenInfoDialog(true);
  };

  const handleCloseInfoDialog = () => {
    setOpenInfoDialog(false);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setObjetivoToDelete(null);
  };

  return (
    <Container>
      <h1>Gestión de Objetivos:</h1>
      <form noValidate autoComplete="off">
        <TextField
          label="Titulo del objetivo"
          name="tituloObjetivo"
          value={formValues.tituloObjetivo}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Descripción"
          name="descripcionObjetivo"
          value={formValues.descripcionObjetivo}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
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
                {curso.nombrecurso}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        
        <Box marginTop={2} marginBottom={2}>
          <Switch
            checked={formValues.estadoObjetivo}
            onChange={handleSwitchChange}
            name="estadoObjetivo"
            color="primary"
          />
          Estado Activo
        </Box>
        
        <Box marginTop={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={selectedObjetivo ? handleUpdateObjetivo : handleCreateObjetivo}
          >
            {selectedObjetivo ? "Actualizar Objetivo" : "Crear Objetivo"}
          </Button>
        </Box>
      </form>

      {/* Busqueda */}
      <TextField
        label="Buscar objetivos"
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
              <TableCell>Titulo del Objetivo</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {filteredObjetivos
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((objetivo) => (
              <TableRow key={objetivo._id}>
                <TableCell>{objetivo.tituloObjetivo}</TableCell>
                <TableCell>{objetivo.descripcionObjetivo}</TableCell>
                <TableCell>{objetivo.estadoObjetivo ? "Activo" : "Inactivo"}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleEditClick(objetivo)}color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleInfoClick(objetivo)} color="primary">
                    <Info />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteClick(objetivo)}color="error">
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
          count={filteredObjetivos.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

      </TableContainer>

      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Eliminar Objetivo</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro de que deseas eliminar a {objetivoToDelete?.tituloObjetivo}?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">Cancelar</Button>
          <Button onClick={handleDeleteObjetivo} color="secondary">Eliminar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openInfoDialog} onClose={handleCloseInfoDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: '#1d526eff', color: '#fff', textAlign: 'center' }}>
          Información del Objetivo
        </DialogTitle>
        <DialogContent dividers sx={{ padding: '20px' }}>
          {infoObjetivo && (
            <div>
              {/* Titulo del objetivo */}
              <Box display="flex" alignItems="center" mb={2}>
                <School color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Nombre:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>{infoObjetivo.tituloObjetivo || "No disponible"}</Typography>
              </Box>
              
              {/* Descripción */}
              <Box display="flex" alignItems="center" mb={2}>
                <Description color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Descripción:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>{infoobjetivo.descripcionObjetivo || "No disponible"}</Typography>
              </Box>

              {/* Estado */}
              <Box display="flex" alignItems="center" mb={2}>
                <ToggleOn color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Estado:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>{infoObjetivo.estadoObjetivo ? "Activo" : "Inactivo"}</Typography>
              </Box>
              
              {/* Curso */}
              <Box display="flex" alignItems="center" mb={2}>
                <Foundation color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Fundación:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>{infoObjetivo.cursoId?.nombreFundacion || "Fundación no encontrada"}
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

export default Objetivos;
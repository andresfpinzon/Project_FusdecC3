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

import { Edit, Delete, Info, School, Email, VerifiedUser, People } from "@mui/icons-material";

const token = localStorage.getItem("token");

const Colegios = () => {
  const [colegios, setColegios] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [selectedColegio, setSelectedColegio] = useState(null);
  const [formValues, setFormValues] = useState({
    nombreColegio: "",
    emailColegio: "",
    estadoColegio: true,
    estudiantes: [],
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [colegioToDelete, setColegioToDelete] = useState(null);
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const [infoColegio, setInfoColegio] = useState(null);

  // Paginación y búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchColegios = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/colegios",{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token 
        }
    });
      if (!response.ok) throw new Error("Error al obtener colegios");
      const data = await response.json();

      // Condicion que verifica si el arreglo de colegios está vacío
      if (data.length === 0) {
        setErrorMessage("No hay colegios registrados.");
        setOpenSnackbar(true);
        setColegios([]); // esto mantiene el estado vacío para evitar errores
      } else {
        setColegios(data);
      }
    } catch (error) {
      console.error("Error al obtener colegios:", error);
      setErrorMessage("Error al obtener colegios");
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

      // Condicion que verifica si el arreglo de estudiantes está vacío
      if (data.length === 0) {
        setErrorMessage("No hay estudiantes registrados.");
        setOpenSnackbar(true);
        setEstudiantes([]); // esto mantiene el estado vacío para evitar errores
      } else {
        setEstudiantes(data);
      }
    } catch (error) {
      console.error("Error al obtener estudiantes:", error);
      setErrorMessage("Error al obtener estudiantes");
      setOpenSnackbar(true);
    }
  };
  
  useEffect(() => {
    fetchColegios();
    fetchEstudiantes();
  }, []);

  // Filtrar usuarios según el término de búsqueda
  const filteredColegios = colegios.filter((colegio) =>
    colegio.nombreColegio.toLowerCase().includes(searchTerm.toLowerCase()) ||
    colegio.emailColegio.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleCreateColegio = async () => {
    try {
        const response = await fetch("http://localhost:3000/api/colegios", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token 
            },
            body: JSON.stringify(formValues),
        });

        // Maneja la respuesta
        if (response.ok) {
            const nuevoColegio = await response.json();
            setColegios([...colegios, nuevoColegio]);
            setFormValues({
              nombreColegio: "",
              emailColegio: "",
              estadoColegio: true,
              estudiantes: [],
            });
            // Muestra un mensaje de éxito
            setSuccessMessage("Colegio creado exitosamente");
            setOpenSnackbar(true);
        } else {
            const errorData = await response.json();
            throw new Error(errorData.error || "Error al crear colegio");
        }
    } catch (error) {
        handleError("Error al crear el colegio", error);
    }
};

  const handleUpdateColegio = async () => {
    if (!selectedColegio) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/colegios/${selectedColegio._id}`,
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
        const colegioActualizado = await response.json();
        setColegios(
          colegios.map((colegio) =>
            colegio._id === selectedColegio._id ? colegioActualizado : colegio
          )
        );
        setSelectedColegio(null);
        setFormValues({
          nombreColegio: "",
          emailColegio: "",
          estadoColegio: true,
          estudiantes: [],
        });
        // Muestra un mensaje de éxito
        setSuccessMessage("Colegio actualizado exitosamente");
        setOpenSnackbar(true);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar el colegio");
      }
    } catch (error) {
      handleError("Error al actualizar el colegio", error);
    }
  };

  const handleDeleteColegio = async () => {
    if (!colegioToDelete) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/colegios/${colegioToDelete._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token 
        }
        }
      );

      if (response.ok) {
        setColegios(colegios.filter((colegio) => colegio._id !== colegioToDelete._id));
        // Muestra un mensaje de éxito
        setSuccessMessage("Colegio eliminado exitosamente");
        setOpenSnackbar(true);
        handleCloseDeleteDialog(); // Cierra el modal de confirmación después de eliminar
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar el colegio");
      }
    } catch (error) {
      handleError("Error al eliminar el colegio", error);
    }
  };

  const handleEditClick = (colegio) => {
    setSelectedColegio(colegio);
    setFormValues({
      nombreColegio: colegio.nombreColegio,
      emailColegio: colegio.emailColegio,
      estadoColegio: colegio.estadoColegio,
      estudiantes: colegio.estudiantes || [],
    });
  };

  const handleDeleteClick = (colegio) => {
    setColegioToDelete(colegio);
    setOpenDeleteDialog(true);
  };

  const handleInfoClick = async (colegio) => {
    const response = await fetch(`http://localhost:3000/api/colegios/${colegio._id}`, {
      method: "GET",
      headers: {
          "Content-Type": "application/json",
          "Authorization": token 
      }
  });
    const data = await response.json();
    setInfoColegio(data);
    setOpenInfoDialog(true);
  };

  const handleCloseInfoDialog = () => {
    setOpenInfoDialog(false);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setColegioToDelete(null);
  };

  return (
    <Container>
      <h1>Gestión de Colegio:</h1>
      <form noValidate autoComplete="off">
        <TextField
          label="Nombre del colegio"
          name="nombreColegio"
          value={formValues.nombreColegio}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email del colegio"
          name="emailColegio"
          value={formValues.emailColegio}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />

        <Box marginTop={2} marginBottom={2}>
          <Switch
            checked={formValues.estadoColegio}
            onChange={handleSwitchChange}
            name="estadoColegio"
            color="primary"
          />
          Estado Activo
        </Box>
        
        <Box marginTop={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={selectedColegio ? handleUpdateColegio : handleCreateColegio}
          >
            {selectedColegio? "Actualizar colegio" : "Crear colegio"}
          </Button>
        </Box>
      </form>

      {/* Busqueda */}
      <TextField
        label="Buscar colegios"
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
            <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {filteredColegios
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((colegio) => (
              <TableRow key={colegio._id}>
                <TableCell>{colegio.nombreColegio}</TableCell>
                <TableCell>{colegio.emailColegio}</TableCell>
                <TableCell>{colegio.estadoColegio ? "Activo" : "Inactivo"}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditClick(colegio)}color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleInfoClick(colegio)} color="primary">
                    <Info />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteClick(colegio)}
                    color="error"
                  >
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
          count={filteredColegios.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

      </TableContainer>

      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Eliminar colegio</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro de que deseas eliminar a {colegioToDelete?.nombreColegio}?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">Cancelar</Button>
          <Button onClick={handleDeleteColegio} color="error">Eliminar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openInfoDialog} onClose={handleCloseInfoDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: '#1d526eff', color: '#fff', textAlign: 'center' }}>
          Información del Colegio
        </DialogTitle>
        <DialogContent sx={{ padding: '20px' }}>
          {infoColegio && (
            <div>
              {/* Nombre del Colegio */}
              <Box display="flex" alignItems="center" mb={2}>
                <School color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Nombre:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>{infoColegio.nombreColegio || "Nombre no disponible"}</Typography>
              </Box>
              
              {/* Email del Colegio */}
              <Box display="flex" alignItems="center" mb={2}>
                <Email color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Email:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>{infoColegio.emailColegio || "Email no disponible"}</Typography>
              </Box>
              
              {/* Estado del Colegio */}
              <Box display="flex" alignItems="center" mb={2}>
                <VerifiedUser color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Estado:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>
                  {infoColegio.estadoColegio ? "Activo" : "Inactivo"}
                </Typography>
              </Box>
              
              {/* Estudiantes del Colegio */}
              <Box display="flex" alignItems="center" mb={2}>
                <People color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Estudiantes:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>
                  {infoColegio.estudiantes?.map((es) => es.nombreEstudiante).join(", ") || "Sin estudiantes"}
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
        <Alert onClose={() => setOpenSnackbar(false)} severity={errorMessage ? "error" : "success"}>
          {errorMessage || successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Colegios;
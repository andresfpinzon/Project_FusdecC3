import React, { useState, useEffect } from "react";
  import {
    Container,
    TextField,
    Button,
    Table,
    TableBody,
    Chip,
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

  import { Edit, Delete, Info } from "@mui/icons-material";

  const token = localStorage.getItem("token");

  const Colegios = () => {
    const [colegios, setColegios] = useState([]);
    const [estudiantes, setEstudiantes] = useState([]);
    const [selectedColegio, setSelectedColegio] = useState(null);
    const [formValues, setFormValues] = useState({
      nombre: "",
      email: "",
      estado: true,
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
        const response = await fetch("http://localhost:8080/colegios",{
          method: "GET",
          headers: {
              "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
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
        const response = await fetch("http://localhost:8080/estudiantes", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error("Error al obtener estudiantes");
        const data = await response.json();
        
        // Condicion que verifica si el arreglo de estudiantes está vacío
        if (data.length === 0) {
          setErrorMessage("No hay estudiantes registrados.");
          setOpenSnackbar(true);
          setEstudiantes([]); 
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
      colegio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      colegio.email.toLowerCase().includes(searchTerm.toLowerCase())
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
          const response = await fetch("http://localhost:8080/colegios", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`
              },
              body: JSON.stringify(formValues),
          });

          // Maneja la respuesta
          if (response.ok) {
              const nuevoColegio = await response.json();
              setColegios([...colegios, nuevoColegio]);
              setFormValues({
                nombre: "",
                email: "",
                estado: true,
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
        `http://localhost:8080/colegios/${selectedColegio.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(formValues),
        }
      );
  
      const data = await response.json(); // Mover esto fuera del if
  
      if (!response.ok) {
        throw new Error(data.error || "Error al actualizar el colegio");
      }
  
      // Actualización optimizada del estado
      setColegios(prevColegios => 
        prevColegios.map(colegio => 
          colegio.id === selectedColegio.id ? { ...colegio, ...data } : colegio
        )
      );
      
      setSelectedColegio(null);
      setFormValues({
        nombre: "",
        email: "",
        estado: true,
      });
      
      setSuccessMessage("Colegio actualizado exitosamente");
      setOpenSnackbar(true);
  
    } catch (error) {
      console.error("Error en handleUpdateColegio:", error);
      setErrorMessage(error.message || "Error al actualizar el colegio");
      setOpenSnackbar(true);
    }
  };

    const handleDeleteColegio = async () => {
      if (!colegioToDelete) return;

      try {
        const response = await fetch(
          `http://localhost:8080/colegios/${colegioToDelete.id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
          }
          }
        );

        if (response.ok) {
          setColegios(colegios.filter((colegio) => colegio.id !== colegioToDelete.id));
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
        nombre: colegio.nombre,
        email: colegio.email,
        estado: colegio.estado,
      });
    };

    const handleDeleteClick = (colegio) => {
      setColegioToDelete(colegio);
      setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
      setOpenDeleteDialog(false);
      setColegioToDelete(null);
    };

    const handleInfoClick = (colegio) => {
      try {
        const estudiantesFiltrados = estudiantes
          .filter(est => est.colegioId === colegio.id)
          .map(est => `${est.nombre} ${est.apellido}`);
        
        setInfoColegio({
          nombre: colegio.nombre,
          estudiantes: estudiantesFiltrados
        });
        setOpenInfoDialog(true);
      } catch (error) {
        console.error("Error al filtrar estudiantes:", error);
        setErrorMessage("Error al cargar información de estudiantes");
        setOpenSnackbar(true);
      }
    };

    const handleCloseInfoDialog = () => {
      setOpenInfoDialog(false);
      setInfoColegio(null);
    };

    return (
      <Container>
        <h1>Gestión de Colegio:</h1>
        <form noValidate autoComplete="off">
          <TextField
            label="Nombre del colegio"
            name="nombre" 
            value={formValues.nombre}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email del colegio"
            name="email" 
            value={formValues.email}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />

          <Box marginTop={2} marginBottom={2}>
            <Switch
              checked={formValues.estado}
              onChange={handleSwitchChange}
              name="estado"
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
                <TableRow key={colegio.id}>
                  <TableCell>{colegio.nombre}</TableCell>
                  <TableCell>{colegio.email}</TableCell>
                  <TableCell>
                      {colegio.estado ? (
                        <Chip label="Activo" color="success" size="small" />
                      ) : (
                        <Chip label="Inactivo" color="error" size="small" />
                      )}
                    </TableCell>
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
            <Typography>¿Estás seguro de que deseas eliminar a {colegioToDelete?.nombre}?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog} color="primary">Cancelar</Button>
            <Button onClick={handleDeleteColegio} color="error">Eliminar</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openInfoDialog} onClose={handleCloseInfoDialog} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ backgroundColor: '#1d526eff', color: '#fff', textAlign: 'center' }}>
            Estudiantes de {infoColegio?.nombre}
          </DialogTitle>
          
          <DialogContent sx={{ padding: '20px' }}>
            {infoColegio && (
              <Box>
                <Typography variant="body1">
                  <strong>Estudiantes:</strong> {infoColegio.estudiantes.length > 0 
                    ? infoColegio.estudiantes.join(", ") 
                    : "No hay estudiantes registrados"}
                </Typography>
              </Box>
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
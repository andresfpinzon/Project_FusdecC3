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
  Snackbar,
  Alert,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Switch,
  TablePagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Box
} from "@mui/material";
import { Edit, Info, Delete } from "@mui/icons-material";

const token = localStorage.getItem("token");

export default function Fundaciones() {
  const [fundaciones, setFundaciones] = useState([]);
  const [comandos, setComandos] = useState([]);
  const [selectedFundacion, setSelectedFundacion] = useState(null);
  const [formValues, setFormValues] = useState({
    nombreFundacion: "",
    estadoFundacion: true
  });

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const [infoFundacion, setInfoFundacion] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Filtro
  const [filter, setFilter] = useState("activa");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fundacionesRes, comandosRes] = await Promise.all([
          fetch("http://localhost:3000/api/fundaciones", {
            headers: { "Authorization": token }
          }),
          fetch("http://localhost:3000/api/comandos", {
            headers: { "Authorization": token }
          })
        ]);

        if (fundacionesRes.ok && comandosRes.ok) {
          const [fundacionesData, comandosData] = await Promise.all([
            fundacionesRes.json(),
            comandosRes.json()
          ]);
          setFundaciones(fundacionesData);
          setComandos(comandosData);
        }
      } catch (error) {
        console.error("Error al cargar datos:", error);
        setErrorMessage("Error al cargar los datos. Por favor, inténtalo de nuevo.");
        setOpenSnackbar(true);
      }
    };

    fetchData();
  }, []);

  // Función para manejar el cambio de filtro
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPage(0); // Reiniciar la paginación al cambiar el filtro
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

  const handleCreateFundacion = async () => {
    try {
      if (!formValues.nombreFundacion.trim()) {
        throw new Error("El nombre de la fundación es requerido");
      }

      const response = await fetch("http://localhost:3000/api/fundaciones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
        body: JSON.stringify({
          nombreFundacion: formValues.nombreFundacion.trim(),
          estadoFundacion: formValues.estadoFundacion
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error al crear la fundación");
      }

      const nuevaFundacion = await response.json();
      setFundaciones([...fundaciones, nuevaFundacion]);
      clearForm();
      setSuccessMessage("Fundación creada exitosamente!");
      setErrorMessage(null);
    } catch (error) {
      console.error("Error al crear fundación:", error);
      setErrorMessage(error.message);
      setSuccessMessage(null);
    } finally {
      setOpenSnackbar(true);
    }
  };

  const handleUpdateFundacion = async () => {
    if (!selectedFundacion) return;

    try {
      if (!formValues.nombreFundacion.trim()) {
        throw new Error("El nombre de la fundación es requerido");
      }

      const dataToSend = {
        nombreFundacion: formValues.nombreFundacion.trim(),
        estadoFundacion: formValues.estadoFundacion
      };

      const response = await fetch(`http://localhost:3000/api/fundaciones/${selectedFundacion._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error al actualizar la fundación");
      }

      const updatedFundacion = await response.json();
      setFundaciones(fundaciones.map(f => 
        f._id === selectedFundacion._id ? updatedFundacion : f
      ));
      clearForm();
      setSuccessMessage("Fundación actualizada exitosamente!");
      setErrorMessage(null);
    } catch (error) {
      console.error("Error al actualizar fundación:", error);
      setErrorMessage(error.message);
      setSuccessMessage(null);
    } finally {
      setOpenSnackbar(true);
    }
  };

  const handleDeleteFundacion = async () => {
    if (!selectedFundacion) return;

    try {
      const response = await fetch(`http://localhost:3000/api/fundaciones/${selectedFundacion._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error al eliminar la fundación");
      }

      setFundaciones(fundaciones.filter(f => f._id !== selectedFundacion._id));
      handleCloseDeleteDialog();
      setSuccessMessage("Fundación eliminada exitosamente!");
      setErrorMessage(null);
    } catch (error) {
      console.error("Error al eliminar fundación:", error);
      setErrorMessage(error.message);
      setSuccessMessage(null);
    } finally {
      setOpenSnackbar(true);
    }
  };

  const handleAssignCommand = async (fundacionId, comandoId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/fundaciones/${fundacionId}/comandos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
        body: JSON.stringify({ comandoId })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error al asignar comando");
      }

      // Actualizar los datos locales
      const updatedFundacion = await response.json();
      setFundaciones(fundaciones.map(f => 
        f._id === fundacionId ? updatedFundacion : f
      ));

      setSuccessMessage("Comando asignado exitosamente!");
      setErrorMessage(null);
    } catch (error) {
      console.error("Error al asignar comando:", error);
      setErrorMessage(error.message);
      setSuccessMessage(null);
    } finally {
      setOpenSnackbar(true);
    }
  };

  const handleUnassignCommand = async (fundacionId, comandoId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/fundaciones/${fundacionId}/comandos/${comandoId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error al desasignar comando");
      }

      // Actualizar los datos locales
      const updatedFundacion = await response.json();
      setFundaciones(fundaciones.map(f => 
        f._id === fundacionId ? updatedFundacion : f
      ));

      setSuccessMessage("Comando desasignado exitosamente!");
      setErrorMessage(null);
    } catch (error) {
      console.error("Error al desasignar comando:", error);
      setErrorMessage(error.message);
      setSuccessMessage(null);
    } finally {
      setOpenSnackbar(true);
    }
  };

  const clearForm = () => {
    setFormValues({
      nombreFundacion: "",
      estadoFundacion: true
    });
    setSelectedFundacion(null);
  };

  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    clearForm();
  };

  const handleOpenInfoDialog = (fundacion) => {
    setInfoFundacion(fundacion);
    setOpenInfoDialog(true);
  };

  const handleCloseInfoDialog = () => {
    setOpenInfoDialog(false);
    setInfoFundacion(null);
  };

  const handleEdit = (fundacion) => {
    setSelectedFundacion(fundacion);
    setFormValues({
      nombreFundacion: fundacion.nombreFundacion,
      estadoFundacion: fundacion.estadoFundacion
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredFundaciones = fundaciones.filter(fundacion =>
    fundacion.estadoFundacion === (filter === "activa")
  );

  const paginatedFundaciones = filteredFundaciones.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const columns = [
    { field: 'nombreFundacion', headerName: 'Nombre', flex: 1 },
    { 
      field: 'estadoFundacion', 
      headerName: 'Estado', 
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Activa' : 'Inactiva'}
          color={params.value ? 'success' : 'error'}
          size="small"
        />
      )
    },
    { 
      field: 'comando', 
      headerName: 'Comandos Asignados', 
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {params.value?.map((comando) => (
            <Chip
              key={comando._id}
              label={comando.nombreComando}
              variant="outlined"
              size="small"
            />
          ))}
        </Box>
      )
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={() => handleEdit(params.row)}>
            <Edit />
          </IconButton>
          <IconButton onClick={handleOpenDeleteDialog}>
            <Delete />
          </IconButton>
          <IconButton onClick={() => handleOpenInfoDialog(params.row)}>
            <Info />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                {/* Select para el filtro */}
                <FormControl fullWidth>
                  <InputLabel>Filtrar</InputLabel>
                  <Select
                    value={filter}
                    onChange={(e) => handleFilterChange(e.target.value)}
                    label="Filtrar"
                  >
                    <MenuItem value="activa">Activas</MenuItem>
                    <MenuItem value="inactiva">Inactivas</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nombre de la Fundación"
                  name="nombreFundacion"
                  value={formValues.nombreFundacion}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Estado</InputLabel>
                  <Select
                    label="Estado"
                    name="estadoFundacion"
                    value={formValues.estadoFundacion}
                    onChange={handleInputChange}
                  >
                    <MenuItem value={true}>Activa</MenuItem>
                    <MenuItem value={false}>Inactiva</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Button
              variant="contained"
              color="primary"
              onClick={selectedFundacion ? handleUpdateFundacion : handleCreateFundacion}
              sx={{ mt: 2, mb: 2 }}
            >
              {selectedFundacion ? "Actualizar Fundación" : "Crear Fundación"}
            </Button>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Comandos Asignados</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedFundaciones.map((fundacion) => (
                    <TableRow key={fundacion._id}>
                      <TableCell>{fundacion.nombreFundacion}</TableCell>
                      <TableCell>
                        <Switch
                          checked={fundacion.estadoFundacion}
                          onChange={(e) => handleEdit({
                            ...fundacion,
                            estadoFundacion: e.target.checked
                          })}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {fundacion.comando?.map((comandoId) => {
                            const comando = comandos.find(c => c._id === comandoId);
                            return comando ? (
                              <Chip
                                key={comando._id}
                                label={comando.nombreComando}
                                variant="outlined"
                                size="small"
                              />
                            ) : null;
                          })}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleOpenInfoDialog(fundacion)}>
                          <Info />
                        </IconButton>
                        <IconButton onClick={() => handleEdit(fundacion)}>
                          <Edit />
                        </IconButton>
                        <IconButton onClick={handleOpenDeleteDialog}>
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredFundaciones.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar esta fundación?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
          <Button onClick={handleDeleteFundacion} color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openInfoDialog} onClose={handleCloseInfoDialog}>
        <DialogTitle>Información de la Fundación</DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            Nombre: {infoFundacion?.nombreFundacion}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Estado: {infoFundacion?.estadoFundacion ? "Activa" : "Inactiva"}
          </Typography>
          <Typography variant="h6" gutterBottom>
            Comandos Asignados:
          </Typography>
          <Grid container spacing={1}>
            {infoFundacion?.comando?.length > 0 ? (
              infoFundacion.comando.map((comando) => (
                <Grid item key={comando._id}>
                  <Chip
                    label={comando.nombreComando}
                    variant="outlined"
                    size="small"
                  />
                </Grid>
              ))
            ) : (
              <Typography variant="body1" color="textSecondary">
                No hay comandos asignados
              </Typography>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseInfoDialog}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          severity={errorMessage ? "error" : "success"}
          onClose={() => setOpenSnackbar(false)}
        >
          {errorMessage || successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}

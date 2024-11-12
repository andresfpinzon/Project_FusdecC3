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

import { Edit, Delete } from "@mui/icons-material";

const token = localStorage.getItem("token");

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [selectedRol, setSelectedRol] = useState(null);
  const [formValues, setFormValues] = useState({
    nombreRol: "",
    estadoRol: true,
  });
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  
  // Paginacion y busqueda
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/roles",{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token 
        }
    });
      if (!response.ok) throw new Error("Error al obtener roles");
      const data = await response.json();
      setRoles(data);
    } catch (error) {
      console.error("Error al obtener roles:", error);
      setErrorMessage("Error al obtener roles");
      setOpenSnackbar(true);
    }
  };
  
  const filteredRoles = roles.filter((rol) =>
    rol.nombreRol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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

  const handleCreateRol = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/roles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token 
        },
        body: JSON.stringify(formValues),
      });

      if (response.ok) {
        const nuevoRol = await response.json();
        setRoles([...roles, nuevoRol]);
        setFormValues({
          nombreRol: "",
          estadoRol: true,
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al crear rol");
      }
    } catch (error) {
      console.error("Error al crear rol:", error);
      setErrorMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  const handleUpdateRol = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/roles/${selectedRol._id}`,
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
        const rolActualizado = await response.json();
        setRoles(
          roles.map((rol) =>
            rol._id === selectedRol._id ? rolActualizado : rol
          )
        );
        setSelectedRol(null);
        setFormValues({
          nombreRol: "",
          estadoRol: true,
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar rol");
      }
    } catch (error) {
      console.error("Error al actualizar rol:", error);
      setErrorMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  const handleDeleteRol = async () => {
    if (!selectedRol) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/roles/${selectedRol._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token 
        }
        }
      );

      if (response.ok) {
        setRoles(roles.filter((rol) => rol._id !== selectedRol._id));
        handleCloseDeleteDialog(); // Cierra el modal de confirmación después de eliminar
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar rol");
      }
    } catch (error) {
      console.error("Error al eliminar rol:", error);
      setErrorMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  const handleEditClick = (rol) => {
    setSelectedRol(rol);
    setFormValues({
      nombreRol: rol.nombreRol || "",
      estadoRol: rol.estadoRol !== undefined ? rol.estadoRol : true,
    });
  };

  const handleDeleteClick = (rol) => {
    setSelectedRol(rol);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedRol(null);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setErrorMessage(null);
  };

  return (
    <Container>
      <h1>Gestión de Roles:</h1>
      <form noValidate autoComplete="off">
        <TextField
          label="Nombre del Rol"
          name="nombreRol"
          value={formValues.nombreRol}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <Box marginTop={2} marginBottom={2}>
          <Switch
            checked={formValues.estadoRol}
            onChange={handleSwitchChange}
            name="estadoRol"
            color="primary"
          />
          Estado Activo
        </Box>
        <Box marginTop={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={selectedRol ? handleUpdateRol : handleCreateRol}
          >
            {selectedRol ? "Actualizar Rol" : "Crear Rol"}
          </Button>
        </Box>
      </form>
      {/* Input de búsqueda */}
      <TextField
        label="Buscar Rol"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}   
      />

      {/* Tabla con paginación */}
      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre del Rol</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRoles
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((rol) => (
                <TableRow key={rol._id}>
                  <TableCell>{rol.nombreRol}</TableCell>
                  <TableCell>{rol.estadoRol ? "Activo" : "Inactivo"}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditClick(rol)} color="primary">
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteClick(rol)} color="error">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
        rowsPerPageOptions={[5, 10, 15]}
        component="div"
        count={filteredRoles.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      </TableContainer>

      {/* Modal de Confirmación de Eliminación */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent dividers>
          <Typography>
            ¿Estás seguro de que quieres eliminar el rol{" "}
            <strong>{selectedRol?.nombreRol}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="default">
            Cancelar
          </Button>
          <Button onClick={handleDeleteRol} color="secondary">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para mensajes de error */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Roles;

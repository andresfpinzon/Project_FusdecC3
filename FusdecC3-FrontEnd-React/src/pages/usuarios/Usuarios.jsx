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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput,
  Checkbox,
  ListItemText,
  TablePagination
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const token = localStorage.getItem("token");

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formValues, setFormValues] = useState({
    nombreUsuario: "",
    apellidoUsuario: "",
    numeroDocumento: "",
    correo: "",
    contraseñaHash: "",
    estadoUsuario: true,
    roles: [],
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Paginación y búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchUsuarios();
    fetchRoles();
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

  // Filtrar usuarios según el término de búsqueda
  const filteredUsuarios = usuarios.filter((usuario) =>
    usuario.nombreUsuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.apellidoUsuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.correo.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleRoleChange = (e) => {
    const {
      target: { value },
    } = e;
    setFormValues({
      ...formValues,
      roles: typeof value === "string" ? value.split(",") : value,
    });
  };

  const handleCreateUser = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token 
        },
        body: JSON.stringify(formValues),
      });

      if (response.ok) {
        const nuevoUsuario = await response.json();
        setUsuarios([...usuarios, nuevoUsuario]);
        setFormValues({
          nombreUsuario: "",
          apellidoUsuario: "",
          numeroDocumento: "",
          correo: "",
          contraseñaHash: "",
          estadoUsuario: true,
          roles: [],
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al crear usuario");
      }
    } catch (error) {
      console.error("Error al crear usuario:", error);
      setErrorMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  const handleUpdateUser = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/usuarios/${selectedUser._id}`,
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
        const updatedUser = await response.json();
        const updatedUsuarios = usuarios.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        );
        setUsuarios(updatedUsuarios);
        setSelectedUser(null);
        setFormValues({
          nombreUsuario: "",
          apellidoUsuario: "",
          numeroDocumento: "",
          correo: "",
          contraseñaHash: "",
          estadoUsuario: true,
          roles: [],
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar usuario");
      }
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      setErrorMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      const response = await fetch(
        `http://localhost:3000/api/usuarios/${userToDelete._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token 
        }
        }
      );
      if (response.ok) {
        setUsuarios(usuarios.filter((user) => user._id !== userToDelete._id));
        handleCloseDeleteDialog();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar Usuario");
      }
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      setErrorMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  const handleEditClick = (usuario) => {
    setSelectedUser(usuario);
    setFormValues({
      nombreUsuario: usuario.nombreUsuario,
      apellidoUsuario: usuario.apellidoUsuario,
      numeroDocumento: usuario.numeroDocumento,
      correo: usuario.correo,
      contraseñaHash: "",
      estadoUsuario: usuario.estadoUsuario,
      roles: usuario.roles.map((rol) => rol._id),
    });
  };

  const handleDeleteClick = (usuario) => {
    setUserToDelete(usuario);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setUserToDelete(null);
  };

  return (
    <Container>
      <h1>Gestión de Usuarios:</h1>
      <form noValidate autoComplete="off">
        <TextField
          label="Nombre"
          name="nombreUsuario"
          value={formValues.nombreUsuario}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Apellido"
          name="apellidoUsuario"
          value={formValues.apellidoUsuario}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
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
          name="correo"
          value={formValues.correo}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          disabled={!!selectedUser} // Deshabilita el campo si se está actualizando
        />
        <TextField
          label="Contraseña"
          name="contraseñaHash"
          type="password"
          value={formValues.contraseñaHash}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Roles</InputLabel>
          <Select
            multiple
            value={formValues.roles} // Los roles preseleccionados
            onChange={handleRoleChange}
            input={<OutlinedInput label="Roles" />}
            renderValue={(selected) =>
              roles
                .filter((rol) => selected.includes(rol._id))
                .map((rol) => rol.nombreRol)
                .join(", ")
            }
          >
            {roles.map((rol) => (
              <MenuItem key={rol._id} value={rol._id}>
                <Checkbox checked={formValues.roles.indexOf(rol._id) > -1} />
                <ListItemText primary={rol.nombreRol} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box marginTop={2} marginBottom={2}>
          <Switch
            checked={formValues.estadoUsuario}
            onChange={handleSwitchChange}
            name="estadoUsuario"
            color="primary"
          />
          Estado Activo
        </Box>
        <Box marginTop={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={selectedUser ? handleUpdateUser : handleCreateUser}
          >
            {selectedUser ? "Actualizar Usuario" : "Crear Usuario"}
          </Button>
        </Box>
      </form>
      <br></br>
      
       {/* Busqueda */}
      <TextField
        label="Buscar usuarios"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
       {/* cuerpo */}
      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Apellido</TableCell>
              <TableCell>Correo</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Roles</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsuarios
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((usuario) => (
                <TableRow key={usuario._id}>
                  <TableCell>{usuario.nombreUsuario}</TableCell>
                  <TableCell>{usuario.apellidoUsuario}</TableCell>
                  <TableCell>{usuario.correo}</TableCell>
                  <TableCell>{usuario.estadoUsuario ? "Activo" : "Inactivo"}</TableCell>
                  <TableCell>
                    {usuario.roles.map((rol) => rol.nombreRol).join(", ")}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditClick(usuario)} color="primary">
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteClick(usuario)} color="error">
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
          count={filteredUsuarios.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Confirmar eliminación */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Eliminar Usuario</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro que deseas eliminar al usuario{" "}
            {userToDelete?.nombreUsuario}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDeleteUser} color="secondary">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notificación de errores */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Usuarios;
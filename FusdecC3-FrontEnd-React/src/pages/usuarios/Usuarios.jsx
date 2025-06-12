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
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  Typography,
  Checkbox,
  ListItemText,
  Chip,
  IconButton,
  FormControl,
  InputLabel,
  Box,
  FormHelperText,
  TablePagination
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import WarningIcon from '@mui/icons-material/Warning';
import { useNavigate } from "react-router-dom";

const Usuarios = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [rolesDisponibles, setRolesDisponibles] = useState([]);
  const [formValues, setFormValues] = useState({
    numeroDocumento: "",
    nombre: "",
    apellido: "",
    correo: "",
    password: "",
    estado: true,
    roles: [],
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [usuarioToDelete, setUsuarioToDelete] = useState(null);

  // Paginación y búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      fetchUsuarios();
      fetchRolesDisponibles();
    } else {
      setErrorMessage("Token no encontrado. Por favor, inicia sesión.");
      setOpenSnackbar(true);
      navigate("/login");
    }
  }, [token, navigate]);

  const fetchRolesDisponibles = async () => {
    try {
      const response = await fetch("http://localhost:8080/roles", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || "Error al obtener roles disponibles");
      }

      const data = await response.json();
      const rolesFiltrados = data.filter(rol => rol.nombre !== "Root");
      setRolesDisponibles(rolesFiltrados);
    } catch (error) {
      console.error("Error en fetchRolesDisponibles:", error);
      setErrorMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  const fetchUsuarios = async () => {
    try {
      const response = await fetch("http://localhost:8080/usuarios", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || "Error al obtener usuarios");
      }

      const data = await response.json();

      const usuariosConRoles = await Promise.all(
        data.map(async (usuario) => {
          try {
            const rolesResponse = await fetch(
              `http://localhost:8080/rolesAsignados/${usuario.numeroDocumento}/detallado`,
              {
                headers: {
                  "Authorization": `Bearer ${token}`,
                  "Content-Type": "application/json"
                }
              }
            );

            let rolesData = [];
            if (rolesResponse.ok) {
              rolesData = await rolesResponse.json();
            }

            return {
              ...usuario,
              roles: rolesData.map(rolObj => rolObj.rolNombre)
            };
          } catch (error) {
            return {
              ...usuario,
              roles: []
            };
          }
        })
      );

      const usuariosFiltrados = usuariosConRoles.filter(usuario =>
        !usuario.roles.includes("Root")
      );

      setUsuarios(usuariosFiltrados);
    } catch (error) {
      console.error("Error en fetchUsuarios:", error);
      setErrorMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  const fetchRolesAsignados = async (documento) => {
    if (!documento) return;

    try {
      const response = await fetch(
        `http://localhost:8080/rolesAsignados/${documento}/detallado`,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || `Error al obtener roles asignados: ${response.status}`);
      }

      const rolesData = await response.json();
      const rolesAsignados = rolesData.map(rolObj => rolObj.rolNombre);

      setFormValues(prev => ({
        ...prev,
        roles: rolesAsignados
      }));

    } catch (error) {
      console.error("Error en fetchRolesAsignados:", error);
      setErrorMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  // Filtrar usuarios según el término de búsqueda
  const filteredUsuarios = usuarios.filter((usuario) =>
    usuario.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.numeroDocumento?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.correo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (usuario.roles && usuario.roles.some(rol =>
      rol.toLowerCase().includes(searchTerm.toLowerCase())
    ))
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
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleRoleChange = (event) => {
    const { value } = event.target;
    const selectedRoles = rolesDisponibles
      .filter(rol => value.includes(rol.id))
      .map(rol => rol.nombre);

    setFormValues({ ...formValues, roles: selectedRoles });
  };

  const handleCreateUser = async () => {
    // Validaciones básicas del frontend
    if (!formValues.numeroDocumento || !formValues.correo || !formValues.password) {
      setErrorMessage("Documento, correo y contraseña son obligatorios");
      setOpenSnackbar(true);
      return;
    }

    if (formValues.password.length < 6) {
      setErrorMessage("La contraseña debe tener al menos 6 caracteres");
      setOpenSnackbar(true);
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/usuarios-management/con-roles", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          usuario: {
            numeroDocumento: formValues.numeroDocumento,
            nombre: formValues.nombre || "",
            apellido: formValues.apellido || "",
            correo: formValues.correo,
            password: formValues.password
          },
          rolesIds: formValues.roles
            .map(rolNombre => rolesDisponibles.find(r => r.nombre === rolNombre)?.id)
            .filter(id => id !== undefined)
        })
      });

      const responseData = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 400) {
          if (responseData.errors) {
            const errorMessages = Object.entries(responseData.errors)
              .map(([field, message]) => `${field}: ${message}`)
              .join('\n');
            throw new Error(errorMessages);
          } else if (responseData.error) {
            throw new Error(responseData.error);
          }
        }
        throw new Error(responseData.message || "Error al crear el usuario");
      }

      setSuccessMessage("Usuario creado correctamente con sus roles");
      setOpenSnackbar(true);
      resetForm();
      await fetchUsuarios();
    } catch (error) {
      console.error("Error al crear usuario:", error);
      setErrorMessage(error.message || "Ocurrió un error al crear el usuario");
      setOpenSnackbar(true);
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) {
      setErrorMessage("No se ha seleccionado ningún usuario para actualizar");
      setOpenSnackbar(true);
      return;
    }

    if (!formValues.numeroDocumento || !formValues.correo) {
      setErrorMessage("Documento y correo son obligatorios");
      setOpenSnackbar(true);
      return;
    }

    try {
      const updateData = {
        usuarioUpdate: {
          nombre: formValues.nombre || null,
          apellido: formValues.apellido || null,
          correo: formValues.correo,
          password: formValues.password || null,
          estado: formValues.estado
        },
        rolesIds: formValues.roles
          .map(rolNombre => rolesDisponibles.find(r => r.nombre === rolNombre)?.id)
          .filter(id => id !== undefined)
      };

      const response = await fetch(
        `http://localhost:8080/usuarios-management/${formValues.numeroDocumento}/con-roles`,
        {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(updateData)
        }
      );

      const responseData = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 400 || response.status === 409) {
          if (responseData.errors) {
            const errorMessages = Object.entries(responseData.errors)
              .map(([field, message]) => `${field}: ${message}`)
              .join('\n');
            throw new Error(errorMessages);
          } else if (responseData.error) {
            throw new Error(responseData.error);
          }
        }
        throw new Error(responseData.message || "Error al actualizar el usuario");
      }

      setSuccessMessage("Usuario actualizado correctamente");
      setOpenSnackbar(true);
      resetForm();
      await fetchUsuarios();
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      setErrorMessage(error.message || "Ocurrió un error al actualizar el usuario");
      setOpenSnackbar(true);
    }
  };

  const handleDeleteUser = async () => {
    if (!usuarioToDelete) {
      setErrorMessage("No se ha seleccionado ningún usuario para eliminar");
      setOpenSnackbar(true);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/usuarios/${usuarioToDelete.numeroDocumento}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      const responseData = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error(responseData.mensaje);
        }
        throw new Error(responseData.error || responseData.message || "Error al eliminar el usuario");
      }

      setSuccessMessage("Usuario eliminado correctamente");
      setOpenSnackbar(true);
      setOpenDeleteDialog(false);
      await fetchUsuarios();
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
      setOpenSnackbar(true);
      setOpenDeleteDialog(false);
    }
  };

  const handleEdit = (usuario) => {
    setSelectedUser(usuario);
    setFormValues({
      ...usuario,
      password: "",
      roles: []
    });
    fetchRolesAsignados(usuario.numeroDocumento);
  };

  const resetForm = () => {
    setFormValues({
      numeroDocumento: "",
      nombre: "",
      apellido: "",
      correo: "",
      password: "",
      estado: true,
      roles: [],
    });
    setSelectedUser(null);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setErrorMessage(null);
    setSuccessMessage("");
  };

  const handleDeleteClick = (usuario) => {
    setUsuarioToDelete(usuario);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setUsuarioToDelete(null);
    setOpenDeleteDialog(false);
  };

  return (
    <Container>
      <h1>Gestión de Usuarios</h1>
      <form>
        <TextField
          id= "numeroDocumento"
          label="Número de Documento *"
          name="numeroDocumento"
          value={formValues.numeroDocumento}
          onChange={handleInputChange}
          fullWidth
          margin="dense"
          disabled={!!selectedUser}
          helperText="Campo obligatorio"
        />
        <TextField
          id= "nombre"
          label="Nombre"
          name="nombre"
          value={formValues.nombre}
          onChange={handleInputChange}
          fullWidth
          margin="dense"
          inputProps={{ style: { textTransform: 'capitalize' } }}
        />
        <TextField
          id= "apellido"
          label="Apellido"
          name="apellido"
          value={formValues.apellido}
          onChange={handleInputChange}
          fullWidth
          margin="dense"
          inputProps={{ style: { textTransform: 'capitalize' } }}
        />
        <TextField
          id= "correo"
          label="Correo Electrónico *"
          name="correo"
          value={formValues.correo}
          onChange={handleInputChange}
          fullWidth
          margin="dense"
          helperText="Campo obligatorio"
          type="email"
        />
        <TextField
          id= "password"
          label="Contraseña"
          name="password"
          type="password"
          value={formValues.password}
          onChange={handleInputChange}
          fullWidth
          margin="dense"
          helperText={selectedUser ? "Dejar en blanco para mantener la contraseña actual" : "Mínimo 6 caracteres"}
        />

        <FormControl fullWidth margin="dense">
          <InputLabel id="roles-label">Roles</InputLabel>
          <Select
            labelId="roles-label"
            multiple
            value={formValues.roles.map(r => rolesDisponibles.find(rd => rd.nombre === r)?.id || [])}
            onChange={handleRoleChange}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map(rolId => {
                  const rol = rolesDisponibles.find(r => r.id === rolId);
                  if (!rol) return null;
                  return (
                    <Chip
                      key={`selected-${rol.id}`}
                      label={rol.nombre}
                      onDelete={() => {
                        setFormValues(prev => ({
                          ...prev,
                          roles: prev.roles.filter(name => name !== rol.nombre)
                        }));
                      }}
                      onMouseDown={(event) => event.stopPropagation()}
                      sx={{
                        backgroundColor: rol.nombre === 'Administrativo' ? '#2196f3' :
                          rol.nombre === 'Instructor' ? '#4caf50' :
                            rol.nombre === 'Secretario' ? '#9c27b0' : '#757575',
                        color: 'white',
                        '& .MuiChip-deleteIcon': {
                          color: 'white',
                          '&:hover': { color: '#ffebee' }
                        }
                      }}
                    />
                  );
                })}
              </Box>
            )}
            disabled={!formValues.numeroDocumento}
          >
            {rolesDisponibles.map((rol) => (
              <MenuItem key={`rol-${rol.id}`} value={rol.id}>
                <Checkbox checked={formValues.roles.includes(rol.nombre)} />
                <ListItemText primary={rol.nombre} />
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>
            {!formValues.numeroDocumento ?
              "Debe crear o seleccionar un usuario antes de asignar roles" :
              "Seleccione los roles para el usuario"}
          </FormHelperText>
        </FormControl>

        <Box sx={{ display: 'flex', gap: 2, marginTop: "20px" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={selectedUser ? handleUpdateUser : handleCreateUser}
            disabled={
              !formValues.numeroDocumento ||
              !formValues.correo ||
              (!selectedUser && !formValues.password) ||
              (formValues.password && formValues.password.length < 6)
            }
          >
            {selectedUser ? "Actualizar Usuario" : "Crear Usuario"}
          </Button>

          {selectedUser && (
            <Button
              variant="outlined"
              color="secondary"
              onClick={resetForm}
            >
              Cancelar
            </Button>
          )}
        </Box>
      </form>
      <br></br>

      {/* Busqueda */}
      <TextField
        id="busquedaUsuario"
        label="Buscar usuarios"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <TableContainer component={Paper} sx={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>Documento</TableCell>
              <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>Nombre</TableCell>
              <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>Apellido</TableCell>
              <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>Correo</TableCell>
              <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>Roles</TableCell>
              <TableCell sx={{ fontWeight: 'bold', width: '10%' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsuarios
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((usuario) => (
                <TableRow
                  key={usuario.numeroDocumento}
                  sx={{
                    '&:hover': { backgroundColor: '#f8f8f8' },
                    backgroundColor: usuario.estado ? 'inherit' : '#fafafa'
                  }}
                >
                  <TableCell>{usuario.numeroDocumento}</TableCell>
                  <TableCell sx={{ textTransform: 'capitalize' }}>{usuario.nombre || '-'}</TableCell>
                  <TableCell sx={{ textTransform: 'capitalize' }}>{usuario.apellido || '-'}</TableCell>
                  <TableCell>{usuario.correo}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {usuario.roles && usuario.roles.length > 0 ? (
                        usuario.roles.map((rol, index) => {
                          const rolInfo = rolesDisponibles.find(r => r.nombre === rol);
                          if (!rolInfo) return null;
                          return (
                            <Chip
                              key={`${usuario.numeroDocumento}-${rol}-${index}`}
                              label={rol}
                              size="small"
                              sx={{
                                backgroundColor: rol === 'Administrativo' ? '#2196f3' :
                                  rol === 'Instructor' ? '#4caf50' :
                                    rol === 'Secretario' ? '#9c27b0' : '#757575',
                                color: 'white'
                              }}
                            />
                          );
                        })
                      ) : (
                        <Chip label="Sin roles" size="small" sx={{ backgroundColor: '#e0e0e0' }} />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleEdit(usuario)}
                        sx={{ minWidth: 'auto' }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleDeleteClick(usuario)}
                        sx={{ minWidth: 'auto' }}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        {/* Paginación */}
        <TablePagination
          id="paginacionUsuario"
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredUsuarios.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Modal de Confirmación de Eliminación - Versión Corregida */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{
          backgroundColor: '#1d526eff',
          color: '#fff',
          textAlign: 'center',
          padding: '16px 24px'
        }}>
          Confirmar Eliminación de Usuario
        </DialogTitle>
        <DialogContent dividers sx={{ padding: '20px' }}>
          <Typography variant="body1" sx={{ textAlign: 'center', fontSize: '1.1rem', mb: 2 }}>
            ¿Estás seguro que deseas eliminar al usuario <strong>{usuarioToDelete?.nombre} {usuarioToDelete?.apellido}</strong>?
          </Typography>
          
          <Box sx={{
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '16px',
            borderLeft: '4px solid #1d526eff'
          }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              Detalles del usuario:
            </Typography>
            <Typography variant="body2">
              Documento: {usuarioToDelete?.numeroDocumento}
            </Typography>
            <Typography variant="body2">
              Correo: {usuarioToDelete?.correo}
            </Typography>
            <Typography variant="body2">
              Estado: 
              <Chip 
                label={usuarioToDelete?.estado ? "Activo" : "Inactivo"} 
                size="small" 
                color={usuarioToDelete?.estado ? "success" : "error"}
                sx={{ ml: 1 }}
              />
            </Typography>
          </Box>

          {usuarioToDelete?.estado && (
            <Box sx={{
              backgroundColor: '#fff3e0',
              borderRadius: '4px',
              padding: '10px',
              marginTop: '10px',
              borderLeft: '4px solid #ffa000'
            }}>
              <Box display="flex" alignItems="center">
                <WarningIcon color="warning" sx={{ mr: 1 }} /> {/* Icono corregido */}
                <Typography variant="body2" color="text.secondary">
                  <strong>Advertencia:</strong> Este usuario está actualmente activo. Al eliminarlo, perderá acceso al sistema inmediatamente.
                </Typography>
              </Box>
            </Box>
          )}

          <Typography variant="body2" sx={{
            textAlign: 'center',
            color: 'text.secondary',
            marginTop: '16px',
            fontStyle: 'italic'
          }}>
            Esta acción no se puede deshacer y eliminará permanentemente todos los datos asociados.
          </Typography>
        </DialogContent>
        <DialogActions sx={{
          justifyContent: 'center',
          padding: '16px 24px',
          gap: '16px'
        }}>
          <Button
            onClick={() => setOpenDeleteDialog(false)}
            variant="outlined"
            sx={{
              minWidth: '120px',
              borderColor: '#1d526eff',
              color: '#1d526eff',
              '&:hover': {
                backgroundColor: '#f0f7ff',
                borderColor: '#1a4863'
              }
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDeleteUser}
            variant="contained"
            sx={{
              minWidth: '120px',
              backgroundColor: '#d32f2f',
              '&:hover': {
                backgroundColor: '#b71c1c'
              }
            }}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={errorMessage ? "error" : "success"}
          variant="filled"
          sx={{ width: '100%', whiteSpace: 'pre-line' }}
        >
          {errorMessage || successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Usuarios;
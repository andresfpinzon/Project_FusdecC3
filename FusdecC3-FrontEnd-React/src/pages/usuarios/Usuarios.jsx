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
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Chip,
  FormControl,
  InputLabel,
  Box,
  FormHelperText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Usuarios = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [rolesDisponibles, setRolesDisponibles] = useState([]);
  const [rolesAsignados, setRolesAsignados] = useState([]);
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
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      fetchUsuarios();
      fetchRolesDisponibles();
    } else {
      setMessage("Token no encontrado. Por favor, inicia sesión.");
      setSeverity("error");
      setOpenSnackbar(true);
    }
  }, [token]);

  const fetchRolesDisponibles = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/roles/enum", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("No autorizado. Por favor, inicia sesión nuevamente.");
        }
        throw new Error("Error al obtener roles disponibles");
      }
      
      const data = await response.json();
      setRolesDisponibles(data);
      setRoles(data);
    } catch (error) {
      console.error("Error en fetchRolesDisponibles:", error);
      setMessage("Error al obtener roles disponibles. Por favor, intente nuevamente.");
      setSeverity("error");
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
        if (response.status === 401) {
          throw new Error("No autorizado. Por favor, inicia sesión nuevamente.");
        }
        throw new Error("Error al obtener usuarios");
      }
      
      const data = await response.json();
      
      // Obtener roles para cada usuario
      const usuariosConRoles = await Promise.all(
        data.map(async (usuario) => {
          try {
            const rolesResponse = await fetch(`http://localhost:8080/roles/${usuario.numeroDocumento}`, {
              headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
              }
            });

            if (rolesResponse.ok) {
              const rolesData = await rolesResponse.json();
              return {
                ...usuario,
                roles: rolesData.map(rolObj => rolObj.rol)
              };
            }
            return {
              ...usuario,
              roles: []
            };
          } catch (error) {
            return {
              ...usuario,
              roles: []
            };
          }
        })
      );

      setUsuarios(usuariosConRoles);
    } catch (error) {
      console.error("Error en fetchUsuarios:", error);
      setMessage("Error al obtener usuarios. Por favor, intente nuevamente.");
      setSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const fetchRolesAsignados = async (documento) => {
    if (!documento) {
      console.error("No se proporcionó un número de documento");
      return;
    }

    try {
      if (!token) {
        setMessage("No hay token de autenticación. Por favor, inicie sesión nuevamente.");
        setSeverity("error");
        setOpenSnackbar(true);
        return;
      }

      const response = await fetch(`http://localhost:8080/roles/${documento}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Sesión expirada. Por favor, inicie sesión nuevamente.");
        } else if (response.status === 403) {
          throw new Error("No tienes permisos para ver los roles asignados.");
        } else {
          throw new Error(`Error al obtener roles asignados: ${response.status}`);
        }
      }

      const rolesData = await response.json();
      const rolesAsignados = rolesData.map(rolObj => rolObj.rol);
      setRoles(rolesAsignados);

      // Si estamos en modo edición, actualizar también formValues.roles
      if (formValues.numeroDocumento === documento) {
        setFormValues(prev => ({
          ...prev,
          roles: rolesAsignados
        }));
      }

    } catch (error) {
      console.error("Error en fetchRolesAsignados:", error);
      setMessage(error.message);
      setSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const sincronizarRoles = async (numeroDocumento) => {
    await Promise.all([
      fetchRolesDisponibles(),
      fetchRolesAsignados(numeroDocumento)
    ]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleRoleChange = async (event) => {
    const { value } = event.target;
    const selectedRole = value[value.length - 1];

    if (!formValues.numeroDocumento) {
      setMessage("Debe crear o seleccionar un usuario antes de asignar roles");
      setSeverity("warning");
      setOpenSnackbar(true);
      return;
    }

    // Verificar que el rol no sea undefined y sea válido
    if (!selectedRole || !rolesDisponibles.includes(selectedRole)) {
      setMessage("Debe seleccionar un rol válido");
      setSeverity("warning");
      setOpenSnackbar(true);
      return;
    }

    // Verificar si el rol ya está asignado
    if (formValues.roles && formValues.roles.includes(selectedRole)) {
      setMessage("Este rol ya está asignado al usuario");
      setSeverity("warning");
      setOpenSnackbar(true);
      return;
    }

    try {
      // Verificar si el token existe
      if (!token) {
        setMessage("No hay token de autenticación. Por favor, inicie sesión nuevamente.");
        setSeverity("error");
        setOpenSnackbar(true);
        return;
      }

      const requestData = {
        usuarioNumeroDocumento: formValues.numeroDocumento,
        rol: selectedRole
      };

      const response = await fetch("http://localhost:8080/roles", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.log("Error response:", errorText);
        
        if (response.status === 403) {
          throw new Error("No tienes permisos para asignar roles. Verifica que tengas el rol Root o Administrativo.");
        } else if (response.status === 401) {
          throw new Error("Sesión expirada. Por favor, inicie sesión nuevamente.");
        } else {
          throw new Error(errorText || "Error al asignar el rol");
        }
      }

      // Actualizar el estado local
      setFormValues(prev => ({
        ...prev,
        roles: [...(prev.roles || []), selectedRole]
      }));

      setMessage("Rol asignado correctamente");
      setSeverity("success");
      setOpenSnackbar(true);

      // Recargar los roles del usuario
      await fetchRolesAsignados(formValues.numeroDocumento);
      // Recargar la lista de usuarios para actualizar la vista
      await fetchUsuarios();

    } catch (error) {
      console.error("Error en handleRoleChange:", error);
      setMessage(error.message);
      setSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleRemoveRole = async (documento, rol) => {
    if (!documento || !rol) {
      setMessage("Se requiere documento y rol para eliminar un rol");
      setSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    try {
      if (!token) {
        setMessage("No hay token de autenticación. Por favor, inicie sesión nuevamente.");
        setSeverity("error");
        setOpenSnackbar(true);
        return;
      }

      const response = await fetch(`http://localhost:8080/roles/${documento}/${rol}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Sesión expirada. Por favor, inicie sesión nuevamente.");
        } else if (response.status === 403) {
          throw new Error("No tienes permisos para eliminar roles.");
        } else {
          throw new Error(`Error al eliminar el rol: ${response.status}`);
        }
      }

      // Actualizar el estado local
      setRoles(prevRoles => prevRoles.filter(r => r !== rol));
      
      // Si estamos en modo edición, actualizar también formValues.roles
      if (formValues.numeroDocumento === documento) {
        setFormValues(prev => ({
          ...prev,
          roles: prev.roles.filter(r => r !== rol)
        }));
      }

      setMessage("Rol eliminado exitosamente");
      setSeverity("success");
      setOpenSnackbar(true);

      // Recargar la lista de usuarios y roles asignados
      await fetchUsuarios();
      await fetchRolesAsignados(documento);

    } catch (error) {
      console.error("Error en handleRemoveRole:", error);
      setMessage(error.message);
      setSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleCreateOrUpdateUser = async () => {
    // Validación de campos
    if (!formValues.numeroDocumento || !formValues.correo) {
      setMessage("Por favor complete los campos obligatorios");
      setSeverity("warning");
      setOpenSnackbar(true);
      return;
    }

    // Validar formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formValues.correo)) {
      setMessage("Por favor ingrese un correo electrónico válido");
      setSeverity("warning");
      setOpenSnackbar(true);
      return;
    }

    try {
      const method = selectedUser ? "PUT" : "POST";
      const url = selectedUser
        ? `http://localhost:8080/usuarios/${formValues.numeroDocumento}`
        : "http://localhost:8080/usuarios";
        
      // Preparar el cuerpo de la petición según sea creación o actualización
      const requestBody = selectedUser ? {
        nombre: formValues.nombre ? formValues.nombre.trim() : null,
        apellido: formValues.apellido ? formValues.apellido.trim() : null,
        correo: formValues.correo ? formValues.correo.trim().toLowerCase() : null,
        password: formValues.password || null,
        estado: formValues.estado
      } : {
        ...formValues,
        nombre: formValues.nombre ? formValues.nombre.trim() : "",
        apellido: formValues.apellido ? formValues.apellido.trim() : "",
        correo: formValues.correo.trim().toLowerCase()
      };

      // Eliminar campos nulos o vacíos en caso de actualización
      if (selectedUser) {
        Object.keys(requestBody).forEach(key => {
          if (requestBody[key] === null || requestBody[key] === "") {
            delete requestBody[key];
          }
        });
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        if (response.status === 403) {
          setMessage("No tienes permisos para realizar esta acción");
          setSeverity("warning");
          setOpenSnackbar(true);
          return;
        }
        const errorData = await response.text();
        throw new Error(errorData || "Error al guardar el usuario");
      }

      setMessage(selectedUser ? "Usuario actualizado correctamente" : "Usuario creado correctamente");
      setSeverity("success");
      setOpenSnackbar(true);
      
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
      
      await fetchUsuarios();
    } catch (error) {
      console.error(error);
      setMessage(error.message);
      setSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleDeleteUser = async (numeroDocumento) => {
    if (!numeroDocumento) {
      console.error("Número de documento no proporcionado");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/usuarios/${numeroDocumento}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error("No tienes permisos para eliminar este usuario");
        }
        throw new Error("Error al eliminar el usuario");
      }

      setMessage("Usuario eliminado correctamente");
      setSeverity("success");
      setOpenSnackbar(true);
      
      // Actualizar la lista de usuarios
      await fetchUsuarios();
    } catch (error) {
      console.error(error);
      setMessage(error.message);
      setSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleEdit = (usuario) => {
    setSelectedUser(usuario);
    setFormValues({ 
      ...usuario, 
      password: "", 
      roles: [] // Inicializar con array vacío, se cargarán los roles reales en sincronizarRoles
    });
    sincronizarRoles(usuario.numeroDocumento);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container>
      <h1>Gestión de Usuarios y Roles</h1>
      <form>
        <TextField
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
          label="Nombre"
          name="nombre"
          value={formValues.nombre}
          onChange={handleInputChange}
          fullWidth
          margin="dense"
          inputProps={{ style: { textTransform: 'capitalize' } }}
        />
        <TextField
          label="Apellido"
          name="apellido"
          value={formValues.apellido}
          onChange={handleInputChange}
          fullWidth
          margin="dense"
          inputProps={{ style: { textTransform: 'capitalize' } }}
        />
        <TextField
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
            value={formValues.roles || []}
            onChange={handleRoleChange}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value, index) => (
                  <Chip 
                    key={`selected-${value}-${index}`} 
                    label={value}
                    onDelete={() => handleRemoveRole(formValues.numeroDocumento, value)}
                    onMouseDown={(event) => {
                      event.stopPropagation();
                    }}
                    sx={{
                      backgroundColor: value === 'Root' ? '#ff9800' :
                                     value === 'Administrativo' ? '#2196f3' :
                                     value === 'Instructor' ? '#4caf50' :
                                     value === 'Secretario' ? '#9c27b0' : '#757575',
                      color: 'white',
                      '& .MuiChip-deleteIcon': {
                        color: 'white',
                        '&:hover': { color: '#ffebee' }
                      }
                    }}
                  />
                ))}
              </Box>
            )}
            disabled={!formValues.numeroDocumento}
          >
            {rolesDisponibles.map((rol, index) => (
              <MenuItem key={`rol-${rol}-${index}`} value={rol}>
                <Checkbox checked={(formValues.roles || []).includes(rol)} />
                <ListItemText primary={rol} />
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>
            {!formValues.numeroDocumento ? 
              "Debe crear o seleccionar un usuario antes de asignar roles" : 
              "Seleccione los roles para el usuario"}
          </FormHelperText>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateOrUpdateUser}
          sx={{ marginTop: "20px" }}
        >
          {selectedUser ? "Actualizar Usuario" : "Crear Usuario"}
        </Button>
      </form>

      <TableContainer component={Paper} sx={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>Número de Documento</TableCell>
              <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>Nombre</TableCell>
              <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>Apellido</TableCell>
              <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>Correo</TableCell>
              <TableCell sx={{ fontWeight: 'bold', width: '10%' }}>Estado</TableCell>
              <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>Roles</TableCell>
              <TableCell sx={{ fontWeight: 'bold', width: '10%' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuarios.map((usuario) => (
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
                  <Chip
                    label={usuario.estado ? "Activo" : "Inactivo"}
                    color={usuario.estado ? "success" : "default"}
                    size="small"
                    sx={{ width: '80px' }}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {usuario.roles && usuario.roles.length > 0 ? (
                      usuario.roles.map((rol, index) => (
                        <Chip
                          key={`${usuario.numeroDocumento}-${rol}-${index}`}
                          label={rol}
                          onDelete={() => handleRemoveRole(usuario.numeroDocumento, rol)}
                          size="small"
                          sx={{
                            backgroundColor: rol === 'Root' ? '#ff9800' :
                                           rol === 'Administrativo' ? '#2196f3' :
                                           rol === 'Instructor' ? '#4caf50' :
                                           rol === 'Secretario' ? '#9c27b0' : '#757575',
                            color: 'white',
                            '& .MuiChip-deleteIcon': {
                              color: 'white',
                              '&:hover': { color: '#ffebee' }
                            }
                          }}
                        />
                      ))
                    ) : (
                      <Chip label="Sin roles" size="small" sx={{ backgroundColor: '#e0e0e0' }} />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      color="info"
                      size="small"
                      onClick={() => handleEdit(usuario)}
                      sx={{ minWidth: 'auto' }}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => handleDeleteUser(usuario.numeroDocumento)}
                      sx={{ minWidth: 'auto' }}
                    >
                      Eliminar
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={severity} variant="filled">
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Usuarios;
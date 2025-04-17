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
} from "@mui/material";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
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
      fetchRoles();
    } else {
      setMessage("Token no encontrado. Por favor, inicia sesión.");
      setSeverity("error");
      setOpenSnackbar(true);
    }
  }, [token]);

  const fetchUsuarios = async () => {
    try {
      const response = await fetch("http://localhost:8080/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Error al obtener usuarios");
      const data = await response.json();

      const usuariosConRoles = await Promise.all(
        data.map(async (usuario) => {
          const rolesResponse = await fetch(
            `http://localhost:8080/roles/${usuario.numeroDocumento}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (!rolesResponse.ok) throw new Error("Error al obtener roles del usuario");
          const rolesData = await rolesResponse.json();
          return { ...usuario, roles: rolesData.map((r) => r.rol) };
        })
      );

      setUsuarios(usuariosConRoles);
    } catch (error) {
      console.error(error);
      setMessage(error.message);
      setSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await fetch("http://localhost:8080/roles", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Error al obtener roles");
      const data = await response.json();
      const uniqueRoles = [...new Set(data.map((rol) => rol.rol))];
      setRoles(uniqueRoles);
    } catch (error) {
      console.error(error);
      setMessage(error.message);
      setSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleRoleChange = async (event) => {
    const { value } = event.target;
    const selectedRole = value[value.length - 1];

    try {
      const response = await fetch("http://localhost:8080/roles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          usuarioNumeroDocumento: formValues.numeroDocumento,
          rol: selectedRole,
        }),
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error("No tienes permisos para asignar este rol");
        }
        throw new Error("Error al asignar el rol");
      }

      setFormValues((prev) => ({
        ...prev,
        roles: [...prev.roles, selectedRole],
      }));
      setMessage("Rol asignado correctamente");
      setSeverity("success");
      setOpenSnackbar(true);
    } catch (error) {
      console.error(error);
      setMessage(error.message);
      setSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleCreateOrUpdateUser = async () => {
    try {
      const method = selectedUser ? "PUT" : "POST";
      const url = selectedUser
        ? `http://localhost:8080/${formValues.numeroDocumento}`
        : "http://localhost:8080/";
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formValues),
      });

      if (!response.ok) {
        if (response.status === 403) {
          setMessage("No tienes permisos para realizar esta acción");
          setSeverity("warning");
          setOpenSnackbar(true);
          return;
        }
        throw new Error("Error al guardar el usuario");
      }

      const data = await response.json();
      if (selectedUser) {
        setUsuarios((prev) =>
          prev.map((user) =>
            user.numeroDocumento === data.numeroDocumento ? data : user
          )
        );
      } else {
        setUsuarios((prev) => [...prev, data]);
      }

      setMessage("Usuario guardado correctamente");
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
    } catch (error) {
      console.error(error);
      setMessage(error.message);
      setSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleDeleteUser = async (numeroDocumento) => {
    try {
      const response = await fetch(`http://localhost:8080/${numeroDocumento}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error("No tienes permisos para eliminar este usuario");
        }
        throw new Error("Error al eliminar el usuario");
      }

      setUsuarios((prev) => prev.filter((user) => user.numeroDocumento !== numeroDocumento));
      setMessage("Usuario eliminado correctamente");
      setSeverity("success");
      setOpenSnackbar(true);
    } catch (error) {
      console.error(error);
      setMessage(error.message);
      setSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleEdit = (usuario) => {
    setSelectedUser(usuario);
    setFormValues({ ...usuario, password: "", roles: usuario.roles });
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container>
      <h1>Gestión de Usuarios y Roles</h1>
      <form>
        <TextField
          label="Número de Documento"
          name="numeroDocumento"
          value={formValues.numeroDocumento}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          disabled={!!selectedUser}
        />
        <TextField
          label="Nombre"
          name="nombre"
          value={formValues.nombre}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Apellido"
          name="apellido"
          value={formValues.apellido}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Correo"
          name="correo"
          value={formValues.correo}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Contraseña"
          name="password"
          type="password"
          value={formValues.password}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <Select
          multiple
          value={formValues.roles}
          onChange={handleRoleChange}
          renderValue={(selected) => selected.join(", ")}
          fullWidth
          margin="normal"
        >
          {roles.map((rol) => (
            <MenuItem key={rol} value={rol}>
              <Checkbox checked={formValues.roles.includes(rol)} />
              <ListItemText primary={rol} />
            </MenuItem>
          ))}
        </Select>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateOrUpdateUser}
          style={{ marginTop: "20px" }}
        >
          {selectedUser ? "Actualizar Usuario" : "Crear Usuario"}
        </Button>
      </form>

      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Número de Documento</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Apellido</TableCell>
              <TableCell>Correo</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Roles</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuarios.map((usuario) => (
              <TableRow key={usuario.numeroDocumento}>
                <TableCell>{usuario.numeroDocumento}</TableCell>
                <TableCell>{usuario.nombre}</TableCell>
                <TableCell>{usuario.apellido}</TableCell>
                <TableCell>{usuario.correo}</TableCell>
                <TableCell>{usuario.estado ? "Activo" : "Inactivo"}</TableCell>
                <TableCell>
                  {Array.isArray(usuario.roles)
                    ? usuario.roles.join(", ")
                    : "Sin roles"}
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleEdit(usuario)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDeleteUser(usuario.numeroDocumento)}
                    style={{ marginLeft: "10px" }}
                  >
                    Eliminar
                  </Button>
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
      >
        <Alert onClose={handleCloseSnackbar} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Usuarios;
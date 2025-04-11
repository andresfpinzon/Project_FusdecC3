"use client"

import { useState, useEffect } from "react"
import { jwtDecode } from "jwt-decode"
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Switch,
  IconButton,
  Chip,
} from "@mui/material"
import SaveIcon from "@mui/icons-material/Save"
import HistoryIcon from "@mui/icons-material/History"
import Info from "@mui/icons-material/Info"
import { styled } from "@mui/material/styles"
import Add from "@mui/icons-material/Add"
import CheckCircle from "@mui/icons-material/CheckCircle"
import Cancel from "@mui/icons-material/Cancel"
import Person from "@mui/icons-material/Person"
import Assignment from "@mui/icons-material/Assignment"
import Group from "@mui/icons-material/Group"

const AsistenciaCheck = ({ isPresent, onToggle }) => {
  return (
    <Box
      sx={{
        width: 24,
        height: 24,
        borderRadius: '50%',
        border: '2px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          border: '2px solid #007bff',
        },
        ...(isPresent ? {
          backgroundColor: '#00c853',
          border: '2px solid #00c853',
        } : {
          backgroundColor: '#ff1744',
          border: '2px solid #ff1744',
        }),
      }}
      onClick={onToggle}
    >
      {isPresent ? (
        <CheckCircle sx={{ color: 'white' }} />
      ) : (
        <Cancel sx={{ color: 'white' }} />
      )}
    </Box>
  )
}

const Asistencias = () => {
  // Estado para almacenar el token JWT
  const [token, setToken] = useState(localStorage.getItem("token"))

  // Estados para manejar la interfaz y los datos
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [students, setStudents] = useState([])
  const [attendance, setAttendance] = useState({})
  const [searchTerm, setSearchTerm] = useState("")
  const [openHistory, setOpenHistory] = useState(false)
  const [attendanceHistory, setAttendanceHistory] = useState([])
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" })
  const [userId, setUserId] = useState(null)
  const [openInfoDialog, setOpenInfoDialog] = useState(false)
  const [selectedAsistencia, setSelectedAsistencia] = useState(null)

  // Efecto para cargar datos iniciales
  useEffect(() => {
    // Verificar si hay token
    if (!token) {
      setSnackbar({ open: true, message: "No hay sesión iniciada", severity: "error" })
      return
    }

    try {
      const decodedToken = jwtDecode(token)
      setUserId(decodedToken.id)
      fetchStudents()
      fetchAttendanceHistory()
    } catch (error) {
      setSnackbar({ open: true, message: "Token inválido", severity: "error" })
    }
  }, [token])

  const fetchStudents = async () => {
    try {
      if (!token) {
        throw new Error("No hay sesión iniciada")
      }

      const response = await fetch("http://localhost:3000/api/estudiantes/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al obtener estudiantes")
      }

      const data = await response.json()
      if (data.length === 0) {
        setSnackbar({ open: true, message: "No hay estudiantes registrados", severity: "warning" })
      }

      // Limpiar y establecer nuevos estudiantes
      setStudents([])
      setStudents(data)

      // Limpiar y establecer nuevo estado de asistencia
      setAttendance({})
      setAttendance(data.reduce((acc, student) => ({ ...acc, [student._id]: false }), {}))
    } catch (error) {
      console.error('Error detallado:', error)
      setSnackbar({ open: true, message: error.message, severity: "error" })
    }
  }

  // Manejador para cambiar el estado de asistencia
  const handleAttendanceChange = (studentId) => {
    setAttendance((prev) => ({ ...prev, [studentId]: !prev[studentId] }))
  }

  // Función para guardar la asistencia
  const handleSaveAttendance = async () => {
    try {
      const presentStudents = Object.entries(attendance)
        .filter(([_, present]) => present)
        .map(([id]) => id);

      console.log('Estudiantes presentes:', presentStudents); // Para depuración

      const attendanceData = {
        tituloAsistencia: `Asistencia ${selectedDate}`,
        fechaAsistencia: new Date(selectedDate).toISOString(),
        usuarioId: userId,
        estudiantes: presentStudents,
        estadoAsistencia: true
      };

      const response = await fetch("http://localhost:3000/api/asistencias", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token,
        },
        body: JSON.stringify(attendanceData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al guardar asistencia");
      }

      setSnackbar({ open: true, message: "Asistencia guardada exitosamente", severity: "success" });
      fetchAttendanceHistory();
      setAttendance(students.reduce((acc, student) => ({ ...acc, [student._id]: false }), {}));
    } catch (error) {
      console.error('Error detallado:', error);
      setSnackbar({ open: true, message: error.message, severity: "error" });
    }
  };

  // Función para obtener el historial de asistencias
  const fetchAttendanceHistory = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/asistencias", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Error al obtener historial");
      const data = await response.json();
      
      // Obtener los nombres de los usuarios que crearon las asistencias
      const userIds = data.map(record => record.usuarioId);
      const usersResponse = await fetch("http://localhost:3000/api/usuarios", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const users = await usersResponse.json();
      
      // Crear un mapa de usuarios para fácil acceso
      const usersMap = new Map(users.map(user => [user._id, user]));
      
      // Agregar el nombre del usuario a cada registro de asistencia
      const attendanceWithUser = data.map(record => ({
        ...record,
        usuarioNombre: usersMap.get(record.usuarioId)?.nombreUsuario || "Usuario no encontrado"
      }));
      
      setAttendanceHistory(attendanceWithUser);
    } catch (error) {
      console.error('Error detallado:', error);
      setSnackbar({ open: true, message: "Error al cargar historial", severity: "error" });
    }
  }

  // Filtrar estudiantes basado en el término de búsqueda
  const filteredStudents = students.filter((student) =>
    student.nombreEstudiante?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.apellidoEstudiante?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.documentoEstudiante?.includes(searchTerm),
  )

  const handleOpenInfoDialog = async (asistencia) => {
    try {
      // Verificar que tengamos estudiantes para procesar
      if (!asistencia.estudiantes || asistencia.estudiantes.length === 0) {
        setSelectedAsistencia({
          ...asistencia,
          fecha: asistencia.fechaAsistencia,
          estudiantes: []
        });
        setOpenInfoDialog(true);
        return;
      }

      console.log('IDs de estudiantes:', asistencia.estudiantes); // Para depuración

      // Obtener los detalles de los estudiantes
      const estudiantesPromises = asistencia.estudiantes.map(async (estudianteId) => {
        try {
          // Asegurarnos de que estamos usando el ID correcto
          const id = typeof estudianteId === 'object' ? estudianteId._id : estudianteId;
          
          const response = await fetch(`http://localhost:3000/api/estudiantes/${id}`, {
            headers: {
              "Content-Type": "application/json",
              "Authorization": token, // Quitamos el 'Bearer' ya que puede estar causando problemas
            },
          });

          if (!response.ok) {
            console.error(`Error en la respuesta para estudiante ${id}:`, response.status);
            return null;
          }

          const estudiante = await response.json();
          return {
            _id: estudiante._id,
            nombreEstudiante: estudiante.nombreEstudiante,
            apellidoEstudiante: estudiante.apellidoEstudiante,
            numeroDocumento: estudiante.numeroDocumento,
            presente: true
          };
        } catch (error) {
          console.error(`Error al procesar estudiante:`, error);
          return null;
        }
      });

      // Esperar todas las promesas y filtrar los nulls
      const estudiantes = (await Promise.all(estudiantesPromises))
        .filter(estudiante => estudiante !== null);

      console.log('Estudiantes obtenidos:', estudiantes); // Para depuración

      // Actualizar el estado con los estudiantes obtenidos
      setSelectedAsistencia({
        ...asistencia,
        fecha: asistencia.fechaAsistencia,
        estudiantes: estudiantes
      });
      
      setOpenInfoDialog(true);
    } catch (error) {
      console.error('Error al obtener detalles de estudiantes:', error);
      setSnackbar({
        open: true,
        message: "Error al obtener detalles de los estudiantes",
        severity: "error"
      });
    }
  };

  const handleCloseInfoDialog = () => {
    setSelectedAsistencia(null)
    setOpenInfoDialog(false)
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Control de Asistencia
        </Typography>

        <Box sx={{ display: "flex", gap: 2, mb: 4, alignItems: "center" }}>
          <TextField
            label="Fecha"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSaveAttendance} color="primary">
            Guardar Asistencia
          </Button>
          <Button variant="outlined" startIcon={<HistoryIcon />} onClick={() => setOpenHistory(true)}>
            Ver Historial
          </Button>
        </Box>

        <TextField
          fullWidth
          label="Buscar estudiantes"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 3 }}
        />

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Apellido</TableCell>
                <TableCell>Tipo de Documento</TableCell>
                <TableCell>Número de Documento</TableCell>
                <TableCell>Asistencia</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student._id}>
                  <TableCell>{student.nombreEstudiante}</TableCell>
                  <TableCell>{student.apellidoEstudiante}</TableCell>
                  <TableCell>{student.tipoDocumento}</TableCell>
                  <TableCell>{student.numeroDocumento}</TableCell>
                  <TableCell>
                    <AsistenciaCheck
                      isPresent={attendance[student._id]}
                      onToggle={() => handleAttendanceChange(student._id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={openHistory} onClose={() => setOpenHistory(false)} maxWidth="md" fullWidth>
        <DialogTitle>Historial de Asistencias</DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Título</TableCell>
                  <TableCell align="center">Presentes</TableCell>
                  <TableCell>Realizado por</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendanceHistory.map((record) => (
                  <TableRow key={record._id}>
                    <TableCell>{new Date(record.fechaAsistencia).toLocaleDateString()}</TableCell>
                    <TableCell>{record.tituloAsistencia}</TableCell>
                    <TableCell align="center">{record.estudiantes?.length || 0}</TableCell>
                    <TableCell>{record.usuarioNombre}</TableCell>
                    <TableCell>
                      <IconButton 
                        onClick={() => handleOpenInfoDialog(record)}
                        color="primary"
                      >
                        <Info />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenHistory(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openInfoDialog} onClose={handleCloseInfoDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: '#1d526eff', color: '#fff', textAlign: 'center' }}>
          Historial de Asistencia
        </DialogTitle>
        <DialogContent dividers sx={{ padding: '20px' }}>
          {selectedAsistencia && (
            <div>
              {/* Información de la Asistencia */}
              <Box display="flex" alignItems="center" mb={2}>
                <Assignment color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Fecha:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>
                  {new Date(selectedAsistencia.fecha).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Typography>
              </Box>

              {/* Nombres de los estudiantes en chips */}
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 1,
                mb: 2,
                p: 2,
                backgroundColor: '#f8f9fa',
                borderRadius: '8px'
              }}>
                {selectedAsistencia.estudiantes && selectedAsistencia.estudiantes.length > 0 ? (
                  selectedAsistencia.estudiantes.map((estudiante) => (
                    <Chip
                      key={estudiante._id}
                      icon={<Person />}
                      label={`${estudiante.nombreEstudiante || ''} ${estudiante.apellidoEstudiante || ''}`}
                      color="primary"
                      variant="outlined"
                      sx={{
                        '& .MuiChip-icon': {
                          color: '#1d526eff'
                        }
                      }}
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No hay estudiantes registrados en esta asistencia
                  </Typography>
                )}
              </Box>

              {/* Lista detallada de Estudiantes */}
              <Typography variant="h6" sx={{ 
                fontWeight: 'bold', 
                display: 'flex', 
                alignItems: 'center', 
                mt: 2, 
                mb: 1 
              }}>
                <Group sx={{ mr: 1 }} color="primary" />
                Detalles de Asistencia
              </Typography>

              <Box sx={{ 
                maxHeight: '300px', 
                overflowY: 'auto',
                backgroundColor: '#f5f5f5',
                borderRadius: '8px',
                p: 2
              }}>
                {selectedAsistencia.estudiantes?.map((estudiante) => (
                  <Box 
                    key={estudiante._id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: 'white',
                      mb: 1,
                      p: 2,
                      borderRadius: '8px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      '&:hover': {
                        transform: 'translateX(4px)',
                        transition: 'all 0.3s ease',
                        backgroundColor: '#f8f9fa'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Person sx={{ mr: 2, color: '#1d526eff' }} />
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: '500' }}>
                          {estudiante.nombreEstudiante} {estudiante.apellidoEstudiante}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ID: {estudiante.numeroDocumento}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip
                      label="Presente"
                      color="success"
                      size="small"
                      sx={{ ml: 2 }}
                    />
                  </Box>
                ))}
              </Box>

              {/* Resumen de Asistencia */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-around', 
                mt: 2,
                p: 2,
                backgroundColor: '#f8f9fa',
                borderRadius: '8px'
              }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" color="success.main">
                    {selectedAsistencia.estudiantes?.length || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">Total de Presentes</Typography>
                </Box>
              </Box>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCloseInfoDialog} 
            variant="contained" 
            sx={{ 
              backgroundColor: '#1d526eff',
              '&:hover': {
                backgroundColor: '#16405a'
              }
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default Asistencias

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
} from "@mui/material"
import SaveIcon from "@mui/icons-material/Save"
import HistoryIcon from "@mui/icons-material/History"
import Info from "@mui/icons-material/Info"
import { styled } from "@mui/material/styles"
import Add from "@mui/icons-material/Add"
import CheckCircle from "@mui/icons-material/CheckCircle"
import Cancel from "@mui/icons-material/Cancel"
import Person from "@mui/icons-material/Person"

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
      const presentStudents = Object.entries(attendance).filter(([_, present]) => present).map(([id]) => id);
      const absentStudents = Object.entries(attendance).filter(([_, present]) => !present).map(([id]) => id);

      // Usar la fecha actual del sistema
      const date = new Date();
      date.setHours(0, 0, 0, 0);

      // Formatear la fecha para Colombia
      const formattedDate = date.toLocaleString('es-CO', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });

      const attendanceData = {
        tituloAsistencia: `Asistencia ${formattedDate}`,
        fechaAsistencia: date.toISOString(),
        usuarioId: userId,
        estudiantes: presentStudents,
        estadoAsistencia: true
      };

      const response = await fetch("http://localhost:3000/api/asistencias", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
                </TableRow>
              </TableHead>
              <TableBody>
                {attendanceHistory.map((record) => (
                  <TableRow key={record._id}>
                    <TableCell>{new Date(record.fechaAsistencia).toLocaleDateString()}</TableCell>
                    <TableCell>{record.tituloAsistencia}</TableCell>
                    <TableCell align="center">{record.estudiantes?.length || 0}</TableCell>
                    <TableCell>{record.usuarioNombre}</TableCell>
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

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default Asistencias

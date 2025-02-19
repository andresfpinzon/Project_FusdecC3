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
} from "@mui/material"
import SaveIcon from "@mui/icons-material/Save"
import HistoryIcon from "@mui/icons-material/History"

const Asistencias = () => {
  // Estado para almacenar el token JWT
  const token = localStorage.getItem("token")

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
    if (token) {
      try {
        const decodedToken = jwtDecode(token)
        setUserId(decodedToken.id)
        fetchStudents()
        fetchAttendanceHistory()
      } catch (error) {
        setSnackbar({ open: true, message: "Error al decodificar el token", severity: "error" })
      }
    }
  }, [token])

  const fetchStudents = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/estudiantes", {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      })
      if (!response.ok) throw new Error("Error al obtener estudiantes")
      const data = await response.json()
      if (data.length === 0) {
        setSnackbar({ open: true, message: "No hay estudiantes registrados", severity: "warning" })
      }
      setStudents(data)
      setAttendance(data.reduce((acc, student) => ({ ...acc, [student._id]: false }), {}))
    } catch (error) {
      setSnackbar({ open: true, message: "Error al cargar estudiantes", severity: "error" })
    }
  }

  // Función para obtener el historial de asistencias
  const fetchAttendanceHistory = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/asistencias", {
        headers: { Authorization: token },
      })
      if (!response.ok) throw new Error("Error al obtener historial")
      const data = await response.json()
      setAttendanceHistory(data)
    } catch (error) {
      setSnackbar({ open: true, message: "Error al cargar historial", severity: "error" })
    }
  }


  // Manejador para cambiar el estado de asistencia
  const handleAttendanceChange = (studentId) => {
    setAttendance((prev) => ({ ...prev, [studentId]: !prev[studentId] }))
  }


  // Función para guardar la asistencia
  const handleSaveAttendance = async () => {
    try {
      const presentStudents = Object.entries(attendance).filter(([_, present]) => present).map(([id]) => id)
      const absentStudents = Object.entries(attendance).filter(([_, present]) => !present).map(([id]) => id)

      const attendanceData = {
        tituloAsistencia: `Asistencia ${selectedDate}`,
        fechaAsistencia: selectedDate,
        usuarioId: userId,
        estudiantes: presentStudents,
        inasistencias: absentStudents,
      }

      const response = await fetch("http://localhost:3000/api/asistencias", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(attendanceData),
      })
      if (!response.ok) throw new Error("Error al guardar asistencia")
      setSnackbar({ open: true, message: "Asistencia guardada exitosamente", severity: "success" })
      fetchAttendanceHistory()
    } catch (error) {
      setSnackbar({ open: true, message: "Error al guardar asistencia", severity: "error" })
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
                <TableCell>Documento</TableCell>
                <TableCell align="center">Asistencia</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student._id}>
                  <TableCell>{student.nombreEstudiante}</TableCell>
                  <TableCell>{student.apellidoEstudiante}</TableCell>
                  <TableCell>{student.documentoEstudiante}</TableCell>
                  <TableCell align="center">
                    <Checkbox
                      checked={attendance[student._id] || false}
                      onChange={() => handleAttendanceChange(student._id)}
                      color="primary"
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
                  <TableCell align="center">Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendanceHistory.map((record) => (
                  <TableRow key={record._id}>
                    <TableCell>{new Date(record.fechaAsistencia).toLocaleDateString()}</TableCell>
                    <TableCell>{record.tituloAsistencia}</TableCell>
                    <TableCell align="center">{record.estudiantes?.length || 0}</TableCell>
                    <TableCell align="center">{record.estadoAsistencia ? "Activa" : "Inactiva"}</TableCell>
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


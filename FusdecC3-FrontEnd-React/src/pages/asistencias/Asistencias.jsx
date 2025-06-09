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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
} from "@mui/material"
import SaveIcon from "@mui/icons-material/Save"
import HistoryIcon from "@mui/icons-material/History"
import InfoIcon from "@mui/icons-material/Info"
import Delete from "@mui/icons-material/Delete";

const Asistencias = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [openHistory, setOpenHistory] = useState(false);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [userId, setUserId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [attendanceToDelete, setAttendanceToDelete] = useState(null);
  const token = localStorage.getItem("token");

  // Nuevos estados para el diálogo de estudiantes
  const [openStudentsDialog, setOpenStudentsDialog] = useState(false);
  const [currentAttendanceStudents, setCurrentAttendanceStudents] = useState([]);
  const [currentAttendanceInfo, setCurrentAttendanceInfo] = useState(null);

  // Función para mostrar notificaciones
  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  // Efecto para cargar datos iniciales
  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token)
        setUserId(decodedToken.id)
        fetchStudents()
        fetchAttendanceHistory()
      } catch (error) {
        showSnackbar("Error al decodificar el token", "error")
      }
    }
  }, [token])

  // Cargar estudiantes
  const fetchStudents = async () => {
    try {
      const response = await fetch("http://localhost:8080/estudiantes", {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!response.ok) throw new Error(await response.text());

      const data = await response.json();
      const initialAttendance = {};
      data.forEach(student => {
        initialAttendance[student.numeroDocumento] = false;
      });

      setStudents(data);
      setAttendance(initialAttendance);
    } catch (error) {
      showSnackbar("Error al cargar estudiantes: " + error.message, "error");
    }
  };

  // Obtener historial de asistencias
  const fetchAttendanceHistory = async () => {
    try {
      const response = await fetch("http://localhost:8080/asistencias", {
        headers: {
          "Authorization": `Bearer ${token}`
        },
      })

      if (!response.ok) throw new Error("Error al obtener historial")

      const data = await response.json()
      setAttendanceHistory(data)
    } catch (error) {
      showSnackbar("Error al cargar historial: " + error.message, "error")
    }
  }

  // Obtener estudiantes de una asistencia específica
  const fetchStudentsForAttendance = async (attendanceId) => {
  try {
    const response = await fetch(
      `http://localhost:8080/estudiantes/por-asistencia/${attendanceId}`,
      {
        headers: { "Authorization": `Bearer ${token}` }
      }
    );

    if (!response.ok) throw new Error("Error al obtener estudiantes");

    const studentsData = await response.json();
    setCurrentAttendanceStudents(studentsData);
  } catch (error) {
    showSnackbar("Error al cargar estudiantes: " + error.message, "error");
  }
};

  // Manejar cambio en checkbox de asistencia
  const handleAttendanceChange = (studentId) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }))
  }

  // Guardar asistencia 
  const handleSaveAttendance = async () => {
    try {
      // Validación
      if (!userId) throw new Error("No se identificó al usuario");
      if (Object.values(attendance).every(v => !v)) {
        return showSnackbar("Marque al menos un estudiante presente", "warning");
      }

      // Crear asistencia
      const asistenciaRes = await fetch("http://localhost:8080/asistencias", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          titulo: `Asistencia ${selectedDate}`,
          fecha: selectedDate,
          usuarioId: userId,
        }),
      });

      if (!asistenciaRes.ok) throw new Error(await asistenciaRes.text());

      const asistencia = await asistenciaRes.json();

      // Registrar estudiantes presentes
      const presentes = Object.entries(attendance)
        .filter(([_, presente]) => presente)
        .map(([doc]) => doc);

      await Promise.all(
        presentes.map(doc =>
          fetch("http://localhost:8080/asistencia-estudiantes", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
              asistenciaId: asistencia.id,
              estudianteId: doc,
            }),
          })
        )
      );

      showSnackbar("Asistencia registrada correctamente", "success");
      fetchAttendanceHistory();
    } catch (error) {
      showSnackbar("Error: " + error.message, "error");
      console.error("Error al guardar:", error);
    }
  };

  // Función para eliminar asistencia
  const handleDeleteAttendance = async () => {
    if (!attendanceToDelete) return;

    try {
      const response = await fetch(`http://localhost:8080/asistencias/${attendanceToDelete.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error("Error al eliminar asistencia");

      const result = await response.text();
      showSnackbar(result, "success");
      fetchAttendanceHistory(); // Refrescar el historial
      handleCloseDeleteDialog();
    } catch (error) {
      showSnackbar(error.message, "error");
      console.error("Error al eliminar asistencia:", error);
    }
  };

  // Función para abrir el diálogo de confirmación
  const handleOpenDeleteDialog = (attendance) => {
    setAttendanceToDelete(attendance);
    setOpenDeleteDialog(true);
  };

  // Función para cerrar el diálogo
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setAttendanceToDelete(null);
  };

  // Filtrar estudiantes basado en el término de búsqueda
  const filteredStudents = students.filter(student =>
    student.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.numeroDocumento?.includes(searchTerm))


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
          <Button
            id="btnGuardarAsistencia"
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSaveAttendance}
            color="primary"
          >
            Guardar Asistencia
          </Button>
          <Button
            variant="outlined"
            startIcon={<HistoryIcon />}
            onClick={() => setOpenHistory(true)}
          >
            Ver Historial
          </Button>
        </Box>

        <TextField
          id="estudianteInputAsistencia"
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
                <TableCell>Documento</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Apellido</TableCell>
                <TableCell id="checkBoxAsistencia" align="center">Asistencia</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.numeroDocumento}>
                  <TableCell>{student.numeroDocumento}</TableCell>
                  <TableCell>{student.nombre}</TableCell>
                  <TableCell>{student.apellido}</TableCell>
                  <TableCell align="center">
                    <Checkbox
                      checked={attendance[student.numeroDocumento] || false}
                      onChange={() => handleAttendanceChange(student.numeroDocumento)}
                      color="primary"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Diálogo de historial */}
      <Dialog open={openHistory} onClose={() => setOpenHistory(false)} maxWidth="md" fullWidth>
        <DialogTitle>Historial de Asistencias</DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Título</TableCell>
                  <TableCell align="center">Estado</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendanceHistory.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.id}</TableCell>
                    <TableCell>{new Date(record.fecha + 'T00:00:00').toLocaleDateString('es-ES')}</TableCell>
                    <TableCell>{record.titulo}</TableCell>
                    <TableCell align="center">
                      {record.estado ? "Activa" : "Inactiva"}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={async () => {
                          setCurrentAttendanceInfo(record);
                          await fetchStudentsForAttendance(record.id);
                          setOpenStudentsDialog(true);
                        }}
                        color="info"
                        aria-label="ver estudiantes"
                      >
                        <InfoIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleOpenDeleteDialog(record)}
                        color="error"
                        aria-label="eliminar asistencia"
                        sx={{ ml: 1 }}
                      >
                        <Delete />
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

      {/* Diálogo de estudiantes de la asistencia */}
      <Dialog
        open={openStudentsDialog}
        onClose={() => setOpenStudentsDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Estudiantes en la asistencia del {currentAttendanceInfo && new Date(currentAttendanceInfo.fecha).toLocaleDateString()}
        </DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tipo Documento</TableCell>
                  <TableCell>Documento</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Apellido</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentAttendanceStudents.length > 0 ? (
                  currentAttendanceStudents.map((student) => (
                    <TableRow key={student.numeroDocumento}>
                      <TableCell>{student.tipoDocumento}</TableCell>
                      <TableCell>{student.numeroDocumento}</TableCell>
                      <TableCell>{student.nombre}</TableCell>
                      <TableCell>{student.apellido}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No hay estudiantes registrados en esta asistencia
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenStudentsDialog(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Eliminar Asistencia</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar la asistencia del día {attendanceToDelete && new Date(attendanceToDelete.fecha).toLocaleDateString()}?
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={2}>
            Título: {attendanceToDelete?.titulo}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDeleteAttendance} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para notificaciones */}
      <Snackbar
      id="snackbarAsistencias"
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert
      id="snackbarAsistencias"

          severity={snackbar.severity}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default Asistencias
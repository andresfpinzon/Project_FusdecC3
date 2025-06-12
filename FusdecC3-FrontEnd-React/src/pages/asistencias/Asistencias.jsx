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
  TablePagination,
  Snackbar,
  Chip,
} from "@mui/material"
import SaveIcon from "@mui/icons-material/Save"
import HistoryIcon from "@mui/icons-material/History"
import InfoIcon from "@mui/icons-material/Info"
import Delete from "@mui/icons-material/Delete";
import SearchIcon from '@mui/icons-material/Search';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import InputAdornment from '@mui/material/InputAdornment';

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


    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    
    const [searchStudentTerm, setSearchStudentTerm] = useState("");
    const [allStudents, setAllStudents] = useState([]);
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


    const filteredStudentsForDialog = currentAttendanceStudents.filter(student =>
    student.nombre?.toLowerCase().includes(searchStudentTerm.toLowerCase()) ||
    student.apellido?.toLowerCase().includes(searchStudentTerm.toLowerCase()) ||
    student.numeroDocumento.includes(searchStudentTerm));

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
          id='btnHistorialAsistence'
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
        <DialogTitle sx={{ pb: 1 }}>Historial de Asistencias</DialogTitle>
        <DialogContent>
          <TableContainer sx={{ maxHeight: '60vh' }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell width="10%">ID</TableCell>
                  <TableCell width="20%">Fecha</TableCell>
                  <TableCell width="40%">Título</TableCell>
                  <TableCell width="15%" align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendanceHistory
                  .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((record) => (
                    <TableRow key={record.id} hover>
                      <TableCell>{record.id}</TableCell>
                      <TableCell>
                        {new Date(record.fecha).toLocaleDateString('es-ES')}
                      </TableCell>
                      <TableCell sx={{ 
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '300px'
                      }}>
                        {record.titulo}
                      </TableCell>
                      
                      <TableCell align="center" sx={{ p: 1 }}>
                        <IconButton
                          onClick={async () => {
                            setCurrentAttendanceInfo(record);
                            await fetchStudentsForAttendance(record.id);
                            setOpenStudentsDialog(true);
                          }}
                          size="small"
                          color="primary"
                        >
                          <InfoIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          onClick={() => handleOpenDeleteDialog(record)}
                          size="small"
                          color="error"
                          sx={{ ml: 0.5 }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
              id="paginationAsistice"
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={attendanceHistory.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              labelRowsPerPage="Registros por página:"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
              sx={{
                '.MuiTablePagination-toolbar': {
                  minHeight: 'auto',
                  padding: '8px 0'
                }
              }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button 
              onClick={() => setOpenHistory(false)} 
              variant="outlined"
              size="small"
            >
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>

      {/* Diálogo de estudiantes de la asistencia */}
      <Dialog
        open={openStudentsDialog}
        onClose={() => {
          setOpenStudentsDialog(false);
          setSearchStudentTerm("");
        }}
        maxWidth="md"
        fullWidth
        sx={{
          '& .MuiPaper-root': {
            borderRadius: '12px'
          }
        }}
      >
        <DialogTitle sx={{ 
          backgroundColor: '#1d526eff', 
          color: '#fff', 
          textAlign: 'center',
          padding: '16px 24px',
          fontSize: '1.25rem',
          fontWeight: '500'
        }}>
          Estudiantes en la asistencia del {currentAttendanceInfo && 
            new Date(currentAttendanceInfo.fecha).toLocaleDateString('es-ES', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            })
          }
        </DialogTitle>

        <DialogContent sx={{ 
          padding: '20px',
          '&.MuiDialogContent-root': {
            paddingTop: '24px'
          }
        }}>
          {/* Campo de búsqueda mejorado */}
          <TextField
            id="inputIdentificacionAsistenciaValidacion"
            label="Buscar estudiante por nombre o documento"
            variant="outlined"
            fullWidth
            margin="normal"
            value={searchStudentTerm}
            onChange={(e) => setSearchStudentTerm(e.target.value)}
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px'
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              )
            }}
          />

          {/* Tabla de estudiantes con mejor estilo */}
          <TableContainer component={Paper} elevation={3} sx={{
            borderRadius: '12px',
            border: '1px solid rgba(0, 0, 0, 0.12)',
            maxHeight: '400px',
            overflow: 'auto'
          }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ 
                    fontWeight: '600', 
                    backgroundColor: '#f5f5f5'
                  }}>Tipo Documento</TableCell>
                  <TableCell sx={{ 
                    fontWeight: '600', 
                    backgroundColor: '#f5f5f5'
                  }}>Documento</TableCell>
                  <TableCell sx={{ 
                    fontWeight: '600', 
                    backgroundColor: '#f5f5f5'
                  }}>Nombre</TableCell>
                  <TableCell sx={{ 
                    fontWeight: '600', 
                    backgroundColor: '#f5f5f5'
                  }}>Apellido</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredStudentsForDialog.length > 0 ? (
                  filteredStudentsForDialog.map((student) => (
                    <TableRow 
                      key={student.numeroDocumento}
                      hover
                      sx={{ 
                        '&:nth-of-type(even)': {
                          backgroundColor: 'rgba(0, 0, 0, 0.02)'
                        },
                        '&:last-child td': {
                          borderBottom: 0
                        }
                      }}
                    >
                      <TableCell>{student.tipoDocumento}</TableCell>
                      <TableCell sx={{ fontFamily: 'monospace' }}>
                        {student.numeroDocumento}
                      </TableCell>
                      <TableCell>{student.nombre}</TableCell>
                      <TableCell>{student.apellido}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                      <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        color: 'text.secondary'
                      }}>
                        <SearchOffIcon sx={{ fontSize: 40, mb: 1 }} />
                        <Typography variant="body1">
                          No se encontraron estudiantes
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          Intenta con otro término de búsqueda
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>

        <DialogActions sx={{ 
          padding: '16px 24px',
          borderTop: '1px solid rgba(0, 0, 0, 0.12)'
        }}>
          <Button 
            onClick={() => {
              setOpenStudentsDialog(false);
              setSearchStudentTerm("");
            }}
            variant="contained" 
            color="primary"
            sx={{
              textTransform: 'none',
              fontWeight: '600',
              padding: '8px 20px',
              borderRadius: '8px'
            }}
          >
            Cerrar
          </Button>
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
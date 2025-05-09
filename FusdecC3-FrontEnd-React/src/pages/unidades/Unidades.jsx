/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Chart } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './Unidades.css';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Chip, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { Assignment, LocationOn, Group, CheckCircle, Cancel, Shield, Person } from '@mui/icons-material';
import { Snackbar, Alert, CircularProgress } from '@mui/material';

ChartJS.register(ArcElement, Tooltip, Legend);

const token = localStorage.getItem("token");

const Unidades = () => {
  const [unidades, setUnidades] = useState([]);
  const [brigadas, setBrigadas] = useState([]);
  const [selectedUnidad, setSelectedUnidad] = useState(null);
  const [formValues, setFormValues] = useState({
    nombreUnidad: '',
    brigadaId: '',
    usuarioId: '',
    estadoUnidad: true,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info' // 'error', 'warning', 'info', 'success'
  });
  const [estudiantes, setEstudiantes] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsInitialLoading(true);
        // Cargar las brigadas primero
        await fetchBrigadas();
        // Luego cargar el resto de los datos
        await Promise.all([
          fetchUnidades(),
          fetchUsuarios(),
          fetchEstudiantes()
        ]);
      } catch (error) {
        console.error('Error al cargar datos iniciales:', error);
        setSnackbar({
          open: true,
          message: 'Error al cargar los datos. Por favor, verifique su conexión e intente nuevamente.',
          severity: 'error'
        });
      } finally {
        setIsInitialLoading(false);
      }
    };

    loadData();
  }, []);

  const fetchUnidades = async () => {
    try {
      const response = await fetch('http://localhost:8080/unidades', {
        headers: { "Authorization": `Bearer ${token}` },
      });

      if (!response.ok) throw new Error(`Error ${response.status} al obtener unidades`);

      const data = await response.json();
      console.log("Unidades recibidas:", data);

      // Obtener nombres de relaciones
      const unidadesConNombres = await Promise.all(data.map(async (unidad) => {
        const brigadaNombre = unidad.brigadaId ? await getBrigadaNombre(unidad.brigadaId) : "Sin brigada";
        const usuarioNombre = unidad.usuarioId ? await getUsuarioNombre(unidad.usuarioId) : "Sin instructor";

        return {
          ...unidad,
          brigadaNombre,
          usuarioNombre
        };
      }));

      setUnidades(unidadesConNombres);
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Error al cargar las unidades: ${error.message}`,
        severity: 'error'
      });
    }
  };


  const fetchBrigadas = async () => {
    try {
      const response = await fetch('http://localhost:8080/brigadas', {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status} al obtener brigadas`);
      }

      const data = await response.json();

      // Filtrar solo brigadas activas y ordenar por nombre
      const brigadasActivas = data
        .filter(brigada => brigada.estadoBrigada)
        .sort((a, b) => a.nombreBrigada.localeCompare(b.nombreBrigada));

      setBrigadas(brigadasActivas);
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Error al cargar las brigadas: ${error.message}`,
        severity: 'error'
      });
      throw error;
    }
  };

  const getUsuarioNombre = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/usuarios/numero-documento/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (!response.ok) return "Sin usuario";
      const data = await response.json();
      return data.nombre || "Sin usuario";
    } catch (error) {
      return "Sin usuario";
    }
  };

  const getBrigadaNombre = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/brigadas/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (!response.ok) return "Sin brigada";
      const data = await response.json();
      return data.nombreBrigada || "Sin brigada";
    } catch (error) {
      return "Sin brigada";
    }
  };

  const fetchUsuarios = async () => {
    try {
      const response = await fetch('http://localhost:8080/usuarios', {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener usuarios');
      }

      const data = await response.json();

      // Obtener roles para cada usuario usando el nuevo endpoint
      const usuariosConRoles = await Promise.all(
        data.map(async (usuario) => {
          try {
            const rolesResponse = await fetch(
              `http://localhost:8080/rolesAsignados/${usuario.numeroDocumento}/detallado`,
              {
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`
                }
              }
            );

            if (rolesResponse.ok) {
              const rolesData = await rolesResponse.json();
              // Verificar si tiene rol de Instructor (ahora viene en rolNombre)
              const esInstructor = rolesData.some(rol => rol.rolNombre === 'Instructor');

              if (esInstructor) {
                return {
                  id: usuario.numeroDocumento,
                  nombre: `${usuario.nombre} ${usuario.apellido}`,
                  roles: rolesData.map(rol => rol.rolNombre)
                };
              }
              return null;
            }
            return null;
          } catch (error) {
            console.error('Error al obtener roles:', error);
            return null;
          }
        })
      );

      // Filtrar usuarios nulos y ordenar por nombre
      const instructores = usuariosConRoles
        .filter(usuario => usuario !== null)
        .sort((a, b) => a.nombre.localeCompare(b.nombre));

      setUsuarios(instructores);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      setSnackbar({
        open: true,
        message: 'Error al cargar usuarios',
        severity: 'error'
      });
    }
  };

  const fetchEstudiantes = async (unidadId) => {
    try {
      const response = await fetch("http://localhost:8080/estudiantes", {
        headers: { "Authorization": `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Error al obtener estudiantes");

      const data = await response.json();

      // Filtrar estudiantes por unidadId
      const estudiantesFiltrados = data.filter(estudiante =>
        estudiante.unidadId === unidadId
      );

      return estudiantesFiltrados.map(estudiante => ({
        id: estudiante.id,
        nombre: `${estudiante.nombre} ${estudiante.apellido}`,
        documento: estudiante.numeroDocumento
      }));
    } catch (error) {
      console.error("Error al obtener estudiantes:", error);
      return [];
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validación de campos
      if (!formValues.nombreUnidad || !formValues.brigadaId || !formValues.usuarioId) {
        setSnackbar({
          open: true,
          message: 'Todos los campos son obligatorios',
          severity: 'error'
        });
        return;
      }

      const url = selectedUnidad
        ? `http://localhost:8080/unidades/${selectedUnidad.id}`
        : 'http://localhost:8080/unidades';

      const method = selectedUnidad ? 'PUT' : 'POST';

      // Preparar datos para enviar
      const dataToSend = {
        nombreUnidad: formValues.nombreUnidad.trim(),
        brigadaId: formValues.brigadaId,
        usuarioId: formValues.usuarioId,
        estadoUnidad: formValues.estadoUnidad
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend),
      });

      const responseText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch (e) {
        errorData = { message: responseText };
      }

      if (!response.ok) {
        throw new Error(errorData.message || `Error ${response.status} al guardar la unidad`);
      }

      setSnackbar({
        open: true,
        message: selectedUnidad ? "Unidad actualizada correctamente" : "Unidad creada correctamente",
        severity: 'success'
      });

      setFormValues({
        nombreUnidad: '',
        brigadaId: '',
        usuarioId: '',
        estadoUnidad: true
      });
      setSelectedUnidad(null);
      setShowForm(false);

      await fetchUnidades();

    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Error al guardar la unidad. Por favor, intente nuevamente.',
        severity: 'error'
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta unidad?')) return;
    try {
      const response = await fetch(`http://localhost:8080/unidades/${id}`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });
      if (!response.ok) throw new Error('Error al eliminar unidad');
      await fetchUnidades();
      setSnackbar({
        open: true,
        message: 'Unidad eliminada con éxito',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error al eliminar la unidad',
        severity: 'error'
      });
    }
  };

  const handleEdit = (unidad) => {
    setSelectedUnidad(unidad);
    setFormValues({
      nombreUnidad: unidad.nombreUnidad || '',
      brigadaId: unidad.brigadaId?.id || unidad.brigadaId || '',
      estadoUnidad: unidad.estadoUnidad || true,
      usuarioId: unidad.usuarioId?.id || unidad.usuarioId || ''
    });
    setShowForm(true);
  };

  const handleInfoClick = async (unidad) => {
    try {
      const estudiantesUnidad = await fetchEstudiantes(unidad.id);

      setSelectedUnidad({
        ...unidad,
        estudiantes: estudiantesUnidad
      });

      setOpenInfoDialog(true);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error al cargar los estudiantes de la unidad",
        severity: "error"
      });
    }
  };

  const handleCloseInfoDialog = () => {
    setOpenInfoDialog(false);
    setSelectedUnidad(null);
  };

  const handleAddUnidad = () => {
    setSelectedUnidad(null);
    setFormValues({
      nombreUnidad: '',
      brigadaId: '',
      estadoUnidad: true
    });
    setShowForm(true);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(unidades);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setUnidades(items);
  };

  const filteredUnidades = unidades.filter(unidad =>
    unidad?.nombreUnidad?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const chartData = {
    labels: ['Activas', 'Inactivas'],
    datasets: [
      {
        data: [
          unidades.filter(u => u.estadoUnidad).length,
          unidades.filter(u => !u.estadoUnidad).length
        ],
        backgroundColor: ['#2ecc71', '#e74c3c'],
        hoverBackgroundColor: ['#27ae60', '#c0392b']
      }
    ]
  };

  if (isInitialLoading) return (
    <div className="loading-container">
      <CircularProgress />
      <Typography variant="h6" sx={{ mt: 2 }}>Cargando datos...</Typography>
    </div>
  );
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="unit-management">
      <header className="header">
        <h1>Gestión de Unidades</h1>
        <div className="header-actions">
          <button className="add-button" onClick={handleAddUnidad}>
            <i className="fas fa-plus"></i> Agregar Unidad
          </button>
          <button className="stats-button" onClick={() => setShowStats(!showStats)}>
            <i className="fas fa-chart-pie"></i> {showStats ? 'Ocultar Estadísticas' : 'Mostrar Estadísticas'}
          </button>
        </div>
      </header>

      {showStats && (
        <div className="stats-container">
          <h2>Estadísticas de Unidades</h2>
          <div className="chart-container">
            <Chart type="doughnut" data={chartData} />
          </div>
        </div>
      )}

      <div className="search-container">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar unidades..."
          className="search-input"
        />
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{selectedUnidad ? 'Editar Unidad' : 'Nueva Unidad'}</h2>
              <button
                className="close-button"
                onClick={() => setShowForm(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Nombre de la Unidad</label>
                <input
                  type="text"
                  value={formValues.nombreUnidad}
                  onChange={(e) => setFormValues({ ...formValues, nombreUnidad: e.target.value })}
                  className="form-input"
                  placeholder="Ingrese el nombre de la unidad"
                />
              </div>

              <div className="form-group">
                <FormControl fullWidth margin="normal">
                  <InputLabel id="brigada-select-label">Brigada</InputLabel>
                  <Select
                    labelId="brigada-select-label"
                    id="brigada-select"
                    value={formValues.brigadaId}
                    onChange={(e) => {
                      setFormValues(prev => ({
                        ...prev,
                        brigadaId: e.target.value
                      }));
                    }}
                    label="Brigada"
                    required
                  >
                    <MenuItem value="" disabled>
                      <em>Seleccione una brigada</em>
                    </MenuItem>
                    {brigadas.map((brigada) => (
                      <MenuItem
                        key={brigada.id}
                        value={brigada.id}
                        sx={{
                          padding: '10px 15px'
                        }}
                      >
                        <Box sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          width: '100%'
                        }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                            {brigada.nombreBrigada}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    {formValues.brigadaId ?
                      `Brigada seleccionada: ${brigadas.find(b => b.id === formValues.brigadaId)?.nombreBrigada}` :
                      'Debe seleccionar una brigada para la unidad'}
                  </FormHelperText>
                </FormControl>
              </div>

              <div className="form-group">
                <FormControl fullWidth margin="normal">
                  <InputLabel id="usuario-select-label">Instructor Responsable</InputLabel>
                  <Select
                    labelId="usuario-select-label"
                    id="usuario-select"
                    value={formValues.usuarioId}
                    onChange={(e) => {
                      setFormValues(prev => ({
                        ...prev,
                        usuarioId: e.target.value
                      }));
                    }}
                    label="Instructor Responsable"
                    required
                  >
                    <MenuItem value="" disabled>
                      <em>Seleccione un instructor</em>
                    </MenuItem>
                    {usuarios.map((usuario) => (
                      <MenuItem
                        key={usuario.id}
                        value={usuario.id}
                        sx={{
                          padding: '10px 15px'
                        }}
                      >
                        <Box sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          width: '100%'
                        }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                            {usuario.nombre}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {usuario.id}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    {formValues.usuarioId ?
                      `Instructor seleccionado: ${usuarios.find(u => u.id === formValues.usuarioId)?.nombre}` :
                      'Debe seleccionar un instructor para la unidad'}
                  </FormHelperText>
                </FormControl>
              </div>

              <div className="form-group-inline">
                <label>Estado de la Unidad</label>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={formValues.estadoUnidad}
                    onChange={(e) => setFormValues({ ...formValues, estadoUnidad: e.target.checked })}
                  />
                  <span className="slider round"></span>
                </label>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="button-secondary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="button-primary"
                >
                  {selectedUnidad ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="units">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="unit-list">
              {filteredUnidades.map((unidad, index) => (
                unidad && unidad.id ? (
                  <Draggable key={unidad.id} draggableId={unidad.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`unit-card ${snapshot.isDragging ? 'dragging' : ''}`}
                        onClick={() => handleInfoClick(unidad)}
                      >
                        <div className="unit-header">
                          <h3>{unidad.nombreUnidad}</h3>
                          <span className={`status-badge ${unidad.estadoUnidad ? 'active' : 'inactive'}`}>
                            {unidad.estadoUnidad ? 'Activo' : 'Inactivo'}
                          </span>
                        </div>
                        <p className="unit-brigada">
                          <i className="fas fa-flag"></i>
                          {unidad.brigadaNombre || 'Sin brigada asignada'}
                        </p>
                        <div className="unit-actions">
                          <button onClick={(e) => { e.stopPropagation(); handleEdit(unidad); }} className="edit-button">
                            <i className="fas fa-edit"></i> Editar
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); handleDelete(unidad.id); }} className="delete-button">
                            <i className="fas fa-trash-alt"></i> Eliminar
                          </button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ) : null
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <Dialog open={openInfoDialog} onClose={handleCloseInfoDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: '#1d526eff', color: '#fff', textAlign: 'center' }}>
          Información de la Unidad
        </DialogTitle>
        <DialogContent sx={{ padding: '20px' }}>
          {selectedUnidad && (
            <div>
              <Box display="flex" alignItems="center" mb={2}>
                <Assignment color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Nombre:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>{selectedUnidad.nombreUnidad || "N/A"}</Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={2}>
                <Group color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Brigada:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>
                  {selectedUnidad.brigadaNombre || 'Sin brigada asignada'}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={2}>
                <Group color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Usario:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>
                  {selectedUnidad.usuarioNombre || 'Sin brigada asignada'}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={2}>
                {selectedUnidad.estadoUnidad ? <CheckCircle color="success" sx={{ mr: 1 }} /> : <Cancel color="error" sx={{ mr: 1 }} />}
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Estado:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>
                  {selectedUnidad.estadoUnidad ? "Activo" : "Inactivo"}
                </Typography>
              </Box>

              <Typography variant="h6" sx={{
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                mt: 2,
                mb: 1
              }}>
                <Person sx={{ mr: 1 }} color="primary" />
                Estudiantes Asignados ({selectedUnidad.estudiantes?.length || 0})
              </Typography>
              {selectedUnidad.estudiantes && selectedUnidad.estudiantes.length > 0 ? (
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  maxHeight: '200px',
                  overflowY: 'auto',
                  padding: '10px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '8px'
                }}>
                  {selectedUnidad.estudiantes?.map((estudiante) => (
                    <Box
                      key={estudiante.id}
                      className="estudiante-card"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '12px',
                        backgroundColor: 'white',
                        borderRadius: '4px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                      }}
                    >
                      <Person sx={{ mr: 2, color: '#1d526eff' }} />
                      <Typography variant="body1">
                        {estudiante.nombre}
                      </Typography>
                      <Chip
                        label={`ID: ${estudiante.documento}`}
                        size="small"
                        sx={{ ml: 2 }}
                      />
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{
                  fontStyle: 'italic',
                  backgroundColor: '#f5f5f5',
                  padding: '10px',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  No hay estudiantes asignados a esta unidad
                </Typography>
              )}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseInfoDialog} variant="contained" color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Unidades;
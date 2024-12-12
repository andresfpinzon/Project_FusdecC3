/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Chart } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './Unidades.css';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Chip } from '@mui/material';
import { Assignment, LocationOn, Group, CheckCircle, Cancel, Shield, Person } from '@mui/icons-material';
import { Snackbar, Alert } from '@mui/material';

ChartJS.register(ArcElement, Tooltip, Legend);

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

  useEffect(() => {
    fetchUnidades();
    fetchBrigadas();
    fetchUsuarios();
  }, []);

  const fetchUnidades = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/unidades?populate=estudiantes', {
        headers: {
          'Authorization': localStorage.getItem('token') || '',
        },
      });
      if (!response.ok) throw new Error('Error al obtener unidades');
      const data = await response.json();
      setUnidades(data);
    } catch (error) {
      setError('Error al obtener unidades');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBrigadas = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/brigadas', {
        headers: {
          'Authorization': localStorage.getItem('token') || '',
        },
      });
      if (!response.ok) throw new Error('Error al obtener brigadas');
      const data = await response.json();
      setBrigadas(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchUsuarios = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/usuarios', {
        headers: {
          'Authorization': localStorage.getItem('token')
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUsuarios(data);
      }
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formValues.nombreUnidad || !formValues.brigadaId) {
        setSnackbar({
          open: true,
          message: 'El nombre de la unidad y la brigada son obligatorios',
          severity: 'error'
        });
        return;
      }

      const url = selectedUnidad
        ? `http://localhost:3000/api/unidades/${selectedUnidad._id}`
        : 'http://localhost:3000/api/unidades';
      
      const method = selectedUnidad ? 'PUT' : 'POST';
      
      const dataToSend = {
        nombreUnidad: formValues.nombreUnidad,
        brigadaId: formValues.brigadaId,
        estadoUnidad: formValues.estadoUnidad,
        ...(formValues.usuarioId && { usuarioId: formValues.usuarioId }),
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token') || '',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al guardar la unidad');
      }

      await fetchUnidades();
      setFormValues({ nombreUnidad: '', brigadaId: '', estadoUnidad: true });
      setSelectedUnidad(null);
      setShowForm(false);
      setSnackbar({
        open: true,
        message: selectedUnidad ? 'Unidad actualizada con éxito' : 'Unidad creada con éxito',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error detallado:', error);
      setSnackbar({
        open: true,
        message: error.message,
        severity: 'error'
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta unidad?')) return;
    try {
      const response = await fetch(`http://localhost:3000/api/unidades/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': localStorage.getItem('token') || '',
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
      nombreUnidad: unidad.nombreUnidad,
      brigadaId: unidad.brigadaId._id,
      estadoUnidad: unidad.estadoUnidad,
      usuarioId: unidad.usuarioId?._id || ''
    });
    setShowForm(true);
  };

  const handleInfoClick = (unidad) => {
    setSelectedUnidad(unidad);
    setOpenInfoDialog(true);
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

  if (isLoading) return <div className="loading">Cargando...</div>;
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
                  onChange={(e) => setFormValues({...formValues, nombreUnidad: e.target.value})}
                  className="form-input"
                  placeholder="Ingrese el nombre de la unidad"
                />
              </div>

              <div className="form-group">
                <label>Brigada</label>
                <select
                  value={formValues.brigadaId}
                  onChange={(e) => setFormValues({...formValues, brigadaId: e.target.value})}
                  className="form-select"
                >
                  <option value="">Seleccione una brigada</option>
                  {brigadas.map((brigada) => (
                    <option key={brigada._id} value={brigada._id}>
                      {brigada.nombreBrigada}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Usuario Responsable</label>
                <select
                  value={formValues.usuarioId}
                  onChange={(e) => setFormValues({...formValues, usuarioId: e.target.value})}
                  className="form-select"
                >
                  <option value="">Seleccione un usuario</option>
                  {usuarios.map((usuario) => (
                    <option key={usuario._id} value={usuario._id}>
                      {usuario.nombreUsuario} {usuario.apellidoUsuario}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group-inline">
                <label>Estado de la Unidad</label>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={formValues.estadoUnidad}
                    onChange={(e) => setFormValues({...formValues, estadoUnidad: e.target.checked})}
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
                unidad && unidad._id ? (
                  <Draggable key={unidad._id} draggableId={unidad._id} index={index}>
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
                        <p><i className="fas fa-flag"></i> {unidad.brigadaId?.nombreBrigada || 'Sin brigada asignada'}</p>
                        <div className="unit-actions">
                          <button onClick={(e) => { e.stopPropagation(); handleEdit(unidad); }} className="edit-button">
                            <i className="fas fa-edit"></i> Editar
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); handleDelete(unidad._id); }} className="delete-button">
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
                  {selectedUnidad.brigadaId?.nombreBrigada || "Sin brigada asignada"}
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
                Estudiantes Asignados
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
                  {selectedUnidad.estudiantes.map((estudiante) => (
                    <Chip
                      key={estudiante._id}
                      label={`${estudiante.nombreEstudiante} ${estudiante.apellidoEstudiante}`}
                      color="primary"
                      variant="outlined"
                      size="small"
                      icon={<Person />}
                      sx={{ 
                        borderRadius: '16px',
                        fontSize: '0.9rem',
                        maxWidth: '100%',
                        color: 'black',
                        '&:hover': {
                          backgroundColor: 'rgba(25, 118, 210, 0.04)',
                        },
                      }}
                    />
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  Sin estudiantes asignados
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


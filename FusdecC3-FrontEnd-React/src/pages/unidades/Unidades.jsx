import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Chart } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './Unidades.css';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Chip } from '@mui/material';
import { Assignment, Group, CheckCircle, Cancel, Shield } from '@mui/icons-material';

ChartJS.register(ArcElement, Tooltip, Legend);

const Unidades = () => {
  const [unidades, setUnidades] = useState([]);
  const [brigadas, setBrigadas] = useState([]);
  const [selectedUnidad, setSelectedUnidad] = useState(null);
  const [formValues, setFormValues] = useState({
    nombreUnidad: '',
    brigadaId: '',
    estadoUnidad: true,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [openInfoDialog, setOpenInfoDialog] = useState(false);

  useEffect(() => {
    fetchUnidades();
    fetchBrigadas();
  }, []);

  const fetchUnidades = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay sesión activa');
      }

      const response = await fetch('http://localhost:3000/api/unidades', {
        method: 'GET',
        headers: {
          'Authorization': token || '',
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener unidades');
      }
      const data = await response.json();
      const validatedUnidades = data.map(unidad => ({
        ...unidad,
        _id: unidad._id.toString(),
        brigadaId: unidad.brigadaId || { nombreBrigada: 'Sin brigada asignada' },
        estudiantes: unidad.estudiantes || []
      }));
      setUnidades(validatedUnidades);
    } catch (error) {
      console.error('Error completo:', error);
      setError('Error al obtener unidades');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBrigadas = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay sesión activa');
      }

      const response = await fetch('http://localhost:3000/api/brigadas', {
        method: 'GET',
        headers: {
          'Authorization': token || '',
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener brigadas');
      }
      const data = await response.json();
      setBrigadas(data);
    } catch (error) {
      console.error('Error completo:', error);
      setError('Error al obtener brigadas');
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
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay sesión activa');
      }

      const url = selectedUnidad
        ? `http://localhost:3000/api/unidades/${selectedUnidad._id}`
        : 'http://localhost:3000/api/unidades';
      
      const method = selectedUnidad ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token || '',
        },
        body: JSON.stringify(formValues),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al guardar unidad');
      }

      await fetchUnidades();
      setFormValues({ 
        nombreUnidad: '', 
        brigadaId: '', 
        estadoUnidad: true 
      });
      setSelectedUnidad(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error completo:', error);
      setError('Error al guardar unidad');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta unidad?')) return;
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay sesión activa');
      }

      const response = await fetch(`http://localhost:3000/api/unidades/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Error al eliminar unidad');
      await fetchUnidades();
    } catch (error) {
      setError('Error al eliminar unidad');
    }
  };

  const handleEdit = (unidad) => {
    setSelectedUnidad(unidad);
    setFormValues({
      nombreUnidad: unidad.nombreUnidad,
      brigadaId: unidad.brigadaId._id,
      estadoUnidad: unidad.estadoUnidad,
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
    setFormValues({ nombreUnidad: '', brigadaId: '', estadoUnidad: true });
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
        <div className="modal">
          <div className="modal-content">
            <h2>{selectedUnidad ? 'Editar' : 'Agregar'} Unidad</h2>
            <form onSubmit={handleSubmit} className="unit-form">
              <input
                type="text"
                name="nombreUnidad"
                value={formValues.nombreUnidad}
                onChange={handleInputChange}
                placeholder="Nombre de la Unidad"
                required
              />
              <select
                name="brigadaId"
                value={formValues.brigadaId}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccionar Brigada</option>
                {brigadas.map(brigada => (
                  <option key={brigada._id} value={brigada._id}>
                    {brigada.nombreBrigada}
                  </option>
                ))}
              </select>
              <label className="switch">
                <input
                  type="checkbox"
                  name="estadoUnidad"
                  checked={formValues.estadoUnidad}
                  onChange={handleInputChange}
                />
                <span className="slider round"></span>
                <span className="switch-label">Activo</span>
              </label>
              <div className="form-actions">
                <button type="submit" className="submit-button">
                  {selectedUnidad ? 'Actualizar' : 'Crear'} Unidad
                </button>
                <button type="button" className="cancel-button" onClick={() => setShowForm(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="unidades">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="unit-list">
              {filteredUnidades.map((unidad, index) => (
                unidad && unidad._id ? (
                  <Draggable 
                    key={unidad._id.toString()} 
                    draggableId={unidad._id.toString()} 
                    index={index}
                  >
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
                          <button onClick={() => handleDelete(unidad._id)} className="delete-button">
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
              <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', mt: 2, mb: 1 }}>
                <Shield sx={{ mr: 1 }} color="primary" />
                Estudiantes Asignados
              </Typography>
              {selectedUnidad.estudiantes && selectedUnidad.estudiantes.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-start' }}>
                  {selectedUnidad.estudiantes.map((estudiante) => (
                    <Chip
                      key={estudiante._id}
                      label={`${estudiante.nombreEstudiante} ${estudiante.apellidoEstudiante}`}
                      color="primary"
                      variant="outlined"
                      size="small"
                      sx={{ 
                        borderRadius: '16px',
                        fontSize: '1rem',
                        maxWidth: '200px',
                        width: '100%',
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
    </div>
  );
};

export default Unidades;

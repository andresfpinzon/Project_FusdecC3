/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Chart } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './Brigadas.css';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Chip } from '@mui/material';
import { Assignment, LocationOn, Group, CheckCircle, Cancel, Shield } from '@mui/icons-material';

ChartJS.register(ArcElement, Tooltip, Legend);

const Brigadas = () => {
  const [brigades, setBrigades] = useState([]);
  const [commands, setCommands] = useState([]);
  const [selectedBrigade, setSelectedBrigade] = useState(null);
  const [formValues, setFormValues] = useState({
    nombreBrigada: '',
    ubicacionBrigada: '',
    comandoId: '',
    estadoBrigada: true,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [openInfoDialog, setOpenInfoDialog] = useState(false);

  useEffect(() => {
    fetchBrigades();
    fetchCommands();
  }, []);

  const fetchBrigades = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/brigadas', {
        headers: {
          'Authorization': localStorage.getItem('token') || '',
        },
      });
      if (!response.ok) throw new Error('Error al obtener brigadas');
      const data = await response.json();
      const validatedBrigades = data.map(brigade => ({
        ...brigade,
        comandoId: brigade.comandoId || { nombreComando: 'Sin comando asignado' },
        unidades: brigade.unidades || []
      }));

      // Condicion que verifica si el arreglo de brigadas está vacío
      if (data.length === 0) {
        setErrorMessage("No hay brigadas registradas.");
        setOpenSnackbar(true);
        setBrigades([]); // esto mantiene el estado vacío para evitar errores
      } else {
        setBrigades(validatedBrigades);
      }
    } catch (error) {
      setError('Error al obtener brigadas');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCommands = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/comandos', {
        headers: {
          'Authorization': localStorage.getItem('token') || '',
        },
      });
      if (!response.ok) throw new Error('Error al obtener comandos');
      const data = await response.json();
      
      // Condicion que verifica si el arreglo de comandos está vacío
      if (data.length === 0) {
        setErrorMessage("No hay comandos registradas.");
        setOpenSnackbar(true);
        setCommands([]); // esto mantiene el estado vacío para evitar errores
      } else {
        setCommands(data);
      }
      
    } catch (error) {
      setError('Error al obtener comandos');
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
      const url = selectedBrigade
        ? `http://localhost:3000/api/brigadas/${selectedBrigade._id}`
        : 'http://localhost:3000/api/brigadas';
      const method = selectedBrigade ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token') || '',
        },
        body: JSON.stringify(formValues),
      });
      if (!response.ok) throw new Error('Error al guardar brigada');
      await fetchBrigades();

      // Mostrar mensaje según la acción realizada (actualizar o crear)
      if (selectedBrigade) {
        setSuccessMessage("La brigada se actualizó correctamente");
      } else {
        setSuccessMessage("La brigada se creó correctamente");
      }
    
      setOpenSnackbar(true);

      setFormValues({ nombreBrigada: '', ubicacionBrigada: '', comandoId: '', estadoBrigada: true });
      setSelectedBrigade(null);
      setShowForm(false);
    } catch (error) {
      setError('Error al guardar brigada');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta brigada?')) return;
    try {
      const response = await fetch(`http://localhost:3000/api/brigadas/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': localStorage.getItem('token') || '',
        },
      });
      if (!response.ok) throw new Error('Error al eliminar brigada');
      await fetchBrigades();

      // Mostrar mensaje de éxito
      setSuccessMessage("La brigada se eliminó correctamente");
      setOpenSnackbar(true);

    } catch (error) {
      setError('Error al eliminar brigada');
    }
  };

  const handleEdit = (brigade) => {
    setSelectedBrigade(brigade);
    setFormValues({
      nombreBrigada: brigade.nombreBrigada,
      ubicacionBrigada: brigade.ubicacionBrigada,
      comandoId: brigade.comandoId._id,
      estadoBrigada: brigade.estadoBrigada,
    });
    setShowForm(true);
  };

  const handleInfoClick = (brigade) => {
    setSelectedBrigade(brigade);
    setOpenInfoDialog(true);
  };

  const handleCloseInfoDialog = () => {
    setOpenInfoDialog(false);
    setSelectedBrigade(null);
  };

  const handleAddBrigade = () => {
    setSelectedBrigade(null);
    setFormValues({ nombreBrigada: '', ubicacionBrigada: '', comandoId: '', estadoBrigada: true });
    setShowForm(true);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(brigades);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setBrigades(items);
  };

  const filteredBrigades = brigades.filter(brigade =>
    brigade?.nombreBrigada?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const chartData = {
    labels: ['Activas', 'Inactivas'],
    datasets: [
      {
        data: [
          brigades.filter(b => b.estadoBrigada).length,
          brigades.filter(b => !b.estadoBrigada).length
        ],
        backgroundColor: ['#2ecc71', '#e74c3c'],
        hoverBackgroundColor: ['#27ae60', '#c0392b']
      }
    ]
  };

  if (isLoading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="brigade-management">
      <header className="header">
        <h1>Gestión de Brigadas</h1>
        <div className="header-actions">
          <button className="add-button" onClick={handleAddBrigade}>
            <i className="fas fa-plus"></i> Agregar Brigada
          </button>
          <button className="stats-button" onClick={() => setShowStats(!showStats)}>
            <i className="fas fa-chart-pie"></i> {showStats ? 'Ocultar Estadísticas' : 'Mostrar Estadísticas'}
          </button>
        </div>
      </header>

      {showStats && (
        <div className="stats-container">
          <h2>Estadísticas de Brigadas</h2>
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
          placeholder="Buscar brigadas..."
          className="search-input"
        />
      </div>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h2>{selectedBrigade ? 'Editar' : 'Agregar'} Brigada</h2>
            <form onSubmit={handleSubmit} className="brigade-form">
              <input
                type="text"
                name="nombreBrigada"
                value={formValues.nombreBrigada}
                onChange={handleInputChange}
                placeholder="Nombre de la Brigada"
                required
              />
              <input
                type="text"
                name="ubicacionBrigada"
                value={formValues.ubicacionBrigada}
                onChange={handleInputChange}
                placeholder="Ubicación de la Brigada"
                required
              />
              <select
                name="comandoId"
                value={formValues.comandoId}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccionar Comando</option>
                {commands.map(command => (
                  <option key={command._id} value={command._id}>
                    {command.nombreComando}
                  </option>
                ))}
              </select>
              <label className="switch">
                <input
                  type="checkbox"
                  name="estadoBrigada"
                  checked={formValues.estadoBrigada}
                  onChange={handleInputChange}
                />
                <span className="slider round"></span>
                <span className="switch-label">Activo</span>
              </label>
              <div className="form-actions">
                <button type="submit" className="submit-button">
                  {selectedBrigade ? 'Actualizar' : 'Crear'} Brigada
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
        <Droppable droppableId="brigades">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="brigade-list">
              {filteredBrigades.map((brigade, index) => (
                brigade && brigade._id ? (
                  <Draggable key={brigade._id} draggableId={brigade._id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`brigade-card ${snapshot.isDragging ? 'dragging' : ''}`}
                        onClick={() => handleInfoClick(brigade)}
                      >
                        <div className="brigade-header">
                          <h3>{brigade.nombreBrigada}</h3>
                          <span className={`status-badge ${brigade.estadoBrigada ? 'active' : 'inactive'}`}>
                            {brigade.estadoBrigada ? 'Activo' : 'Inactivo'}
                          </span>
                        </div>
                        <p><i className="fas fa-map-marker-alt"></i> {brigade.ubicacionBrigada}</p>
                        <p><i className="fas fa-flag"></i> {brigade.comandoId?.nombreComando || 'Sin comando asignado'}</p>
                        <div className="brigade-actions">
                          <button onClick={(e) => { e.stopPropagation(); handleEdit(brigade); }} className="edit-button">
                            <i className="fas fa-edit"></i> Editar
                          </button>
                          <button onClick={() => handleDelete(brigade._id)} className="delete-button">
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
          Información de la Brigada
        </DialogTitle>
        <DialogContent sx={{ padding: '20px' }}>
          {selectedBrigade && (
            <div>
              <Box display="flex" alignItems="center" mb={2}>
                <Assignment color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Nombre:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>{selectedBrigade.nombreBrigada || "N/A"}</Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={2}>
                <LocationOn color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Ubicación:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>
                  <a href={selectedBrigade.ubicacionBrigada} target="_blank" rel="noopener noreferrer" style={{ color: '#0288d1' }}>
                    {selectedBrigade.ubicacionBrigada || "N/A"}
                  </a>
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={2}>
                <Group color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Comando:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>
                  {selectedBrigade.comandoId?.nombreComando || "Sin comando asignado"}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={2}>
                {selectedBrigade.estadoBrigada ? <CheckCircle color="success" sx={{ mr: 1 }} /> : <Cancel color="error" sx={{ mr: 1 }} />}
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Estado:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>
                  {selectedBrigade.estadoBrigada ? "Activo" : "Inactivo"}
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', mt: 2, mb: 1 }}>
                <Shield sx={{ mr: 1 }} color="primary" />
                Unidades Asignadas
              </Typography>
              {selectedBrigade.unidades && selectedBrigade.unidades.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-start' }}>
                  {selectedBrigade.unidades.map((unidad) => (
                    <Chip
                      key={unidad._id}
                      label={unidad.nombreUnidad || "Unidad no encontrada"}
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
                  Sin unidades asignadas
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

export default Brigadas;


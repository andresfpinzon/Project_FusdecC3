/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Chart } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './Brigadas.css';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Chip, Grid, TextField, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Checkbox, Snackbar, Alert } from '@mui/material';
import { Assignment, LocationOn, Group, CheckCircle, Cancel, Shield } from '@mui/icons-material';

ChartJS.register(ArcElement, Tooltip, Legend);

const token = localStorage.getItem("token");

const Brigadas = () => {
  const [brigades, setBrigades] = useState([]);
  const [commands, setCommands] = useState([]);
  const [selectedBrigade, setSelectedBrigade] = useState(null);
  const [formData, setFormData] = useState({
    nombreBrigada: '',
    ubicacionBrigada: '',
    comandoId: '',
    horario: 'mañana',
    estadoBrigada: true
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchBrigades();
    fetchCommands();
  }, []);

  const fetchBrigades = async () => {
    try {
      const response = await fetch('http://localhost:8080/brigadas', {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });
      if (!response.ok) throw new Error('Error al obtener brigadas');
      const data = await response.json();
  
      // Obtener nombres de comandos y unidades asignadas
      const brigadasConNombres = await Promise.all(data.map(async (brigada) => {
        const comandoNombre = brigada.comandoId ? await getComandoNombre(brigada.comandoId) : "Sin comando asignado";
        
        return {
          ...brigada,
          comandoNombre,
          unidades: [] // Inicializamos como array vacío, se cargará al abrir el diálogo
        };
      }));
  
      if (data.length === 0) {
        setErrorMessage("No hay brigadas registradas.");
        setOpenSnackbar(true);
        setBrigades([]);
      } else {
        setBrigades(brigadasConNombres);
      }
    } catch (error) {
      console.error('Error detallado:', error);
      setError('Error al obtener brigadas');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCommands = async () => {
    try {
      const response = await fetch('http://localhost:8080/comandos', {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });
      if (!response.ok) throw new Error('Error al obtener comandos');
      const data = await response.json();

      // Condicion que verifica si el arreglo de comandos está vacío
      if (data.length === 0) {
        setErrorMessage("No hay comandos registrados.");
        setOpenSnackbar(true);
        setCommands([]); // esto mantiene el estado vacío para evitar errores
      } else {
        setCommands(data);
      }
      
    } catch (error) {
      setError('Error al obtener comandos');
    }
  };

  const fetchUnidadesAsignadas = async (brigadaId) => {
    try {
      const response = await fetch(`http://localhost:8080/brigadas/${brigadaId}/unidades-asignadas`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      console.error('Error al obtener unidades asignadas:', error);
      return [];
    }
  };

  const getComandoNombre = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/comandos/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (!response.ok) return "Sin Comando";
      const data = await response.json();
      return data.nombreComando || "Sin Comando";
    } catch (error) {
      return "Sin Comando";
    }
  };

  const handleInputChange = (field, value) => {
    // Handle nested input changes
    if (field.includes('.')) {
        const [parent, child] = field.split('.');
        setFormData(prev => ({
            ...prev,
            [parent]: {
                ...prev[parent],
                [child]: value
            }
        }));
    } else {
        // Handle regular input changes
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
        const response = await fetch(
            selectedBrigade 
                ? `http://localhost:8080/brigadas/${selectedBrigade.id}` 
                : 'http://localhost:8080/brigadas', 
            {
                method: selectedBrigade ? 'PUT' : 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            }
        );

        const responseText = await response.text();
        let errorData;
        try {
            errorData = JSON.parse(responseText);
        } catch (e) {
            errorData = { error: responseText };
        }

        if (!response.ok) {
            throw new Error(errorData.error || `Error al ${selectedBrigade ? 'actualizar' : 'crear'} la brigada`);
        }

        await fetchBrigades();
        
        resetForm();
        
        setSnackbar({
            open: true,
            message: selectedBrigade ? "Brigada actualizada correctamente" : "Brigada creada correctamente",
            severity: "success"
        });
    } catch (error) {
        console.error('Error al guardar brigada:', error);
        setSnackbar({
            open: true,
            message: error.message,
            severity: "error"
        });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta brigada?')) return;
    try {
      const response = await fetch(`http://localhost:8080/brigadas/${id}`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
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
    setFormData({
      nombreBrigada: brigade.nombreBrigada,
      ubicacionBrigada: brigade.ubicacionBrigada, 
      comandoId: brigade.comandoId || '', 
      estadoBrigada: brigade.estadoBrigada,
      horario: brigade.horario || 'mañana'
    });
    setShowForm(true);
  };

  const handleInfoClick = async (brigade) => {
    const unidades = await fetchUnidadesAsignadas(brigade.id);
    setSelectedBrigade({
      ...brigade,
      unidades
    });
    setOpenInfoDialog(true);
  };

  const handleCloseInfoDialog = () => {
    setOpenInfoDialog(false);
    setSelectedBrigade(null);
  };

  const handleAddBrigade = () => {
    setSelectedBrigade(null);
    setFormData({
        nombreBrigada: '',
        comandoId: '',
        estadoBrigada: true,
        horario: 'mañana'
    });
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

  const renderBrigadaForm = () => {
    return (
        <form onSubmit={handleSubmit} className="brigade-form">
            <input
                type="text"
                name="nombreBrigada"
                value={formData.nombreBrigada}
                onChange={(e) => handleInputChange('nombreBrigada', e.target.value)}
                placeholder="Nombre de la Brigada"
                required
            />
            <input
                type="text"
                name="ubicacionBrigada"
                value={formData.ubicacionBrigada}
                onChange={(e) => handleInputChange('ubicacionBrigada', e.target.value)}
                placeholder="URL de Google Maps de la ubicación"
                required
            />
            <select
                name="comandoId"
                value={formData.comandoId}
                onChange={(e) => handleInputChange('comandoId', e.target.value)}
                required
            >
                <option value="">Seleccionar Comando</option>
                {commands.map(command => (
                    <option key={command.id} value={command.id}>
                        {command.nombreComando}
                    </option>
                ))}
            </select>
            <select
                name="horario"
                value={formData.horario}
                onChange={(e) => handleInputChange('horario', e.target.value)}
                required
            >
                <option value="mañana">Horario de Mañana (9 AM - 12 PM)</option>
                <option value="tarde">Horario de Tarde (2 PM - 5 PM)</option>
            </select>
            <label className="switch">
                <input
                    type="checkbox"
                    name="estadoBrigada"
                    checked={formData.estadoBrigada}
                    onChange={(e) => handleInputChange('estadoBrigada', e.target.checked)}
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
    );
  };

  const resetForm = () => {
    setFormData({
        nombreBrigada: '',
        ubicacionBrigada: '',
        comandoId: '',
        horario: 'mañana',
        estadoBrigada: true
    });
    setSelectedBrigade(null);
    setShowForm(false);
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
            {renderBrigadaForm()}
          </div>
        </div>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="brigades">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="brigade-list">
              {filteredBrigades.map((brigade, index) => (
                brigade && brigade.id ? (
                  <Draggable key={brigade.id} draggableId={brigade.id} index={index}>
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
                        <p><i className="fas fa-flag"></i> {brigade.comandoNombre  || 'Sin comando asignado'}</p>
                        <div className="brigade-actions">
                          <button onClick={(e) => { e.stopPropagation(); handleEdit(brigade); }} className="edit-button">
                            <i className="fas fa-edit"></i> Editar
                          </button>
                          <button onClick={() => handleDelete(brigade.id)} className="delete-button">
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
        <DialogContent dividers sx={{ padding: '20px' }}>
          {selectedBrigade && (
            <Box>
              {/* Nombre de la Brigada */}
              <Box display="flex" alignItems="center" mb={2}>
                <Assignment color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Nombre:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>{selectedBrigade.nombreBrigada}</Typography>
              </Box>
              
              {/* Comando */}
              <Box display="flex" alignItems="center" mb={2}>
                <Shield color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Comando:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>
                  {selectedBrigade.comandoNombre  || 'Sin comando asignado'}
                </Typography>
              </Box>
              
              {/* Estado */}
              <Box display="flex" alignItems="center" mb={2}>
                {selectedBrigade.estadoBrigada ? (
                  <CheckCircle color="primary" sx={{ mr: 1 }} />
                ) : (
                  <Cancel color="error" sx={{ mr: 1 }} />
                )}
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Estado:</Typography>
                <Chip
                  label={selectedBrigade.estadoBrigada ? "Activo" : "Inactivo"}
                  color={selectedBrigade.estadoBrigada ? "success" : "error"}
                  variant="filled"
                  size="small"
                  sx={{
                    ml: 1,
                    borderRadius: '16px',
                    minWidth: '80px',
                    justifyContent: 'center'
                  }}
                />
              </Box>

              {/* Horario */}
              <Box display="flex" alignItems="center" mb={2}>
                <LocationOn color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Horario:</Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>
                  {selectedBrigade.horario === 'mañana' ? '9:00 AM - 12:00 PM' : '2:00 PM - 5:00 PM'}
                </Typography>
              </Box>
              
              {/* Unidades Asignadas */}
              <Box mb={2}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Group color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Unidades Asignadas: ({selectedBrigade.unidades?.length || 0})
                  </Typography>
                </Box>
                <Box sx={{ 
                  pl: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1
                }}>
                  {selectedBrigade.unidades && selectedBrigade.unidades.length > 0 ? (
                    selectedBrigade.unidades.map((nombreUnidad, index) => (
                      <Box 
                        key={index}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          backgroundColor: '#f5f5f5',
                          borderRadius: '8px',
                          p: 1.5,
                          border: '1px solid #e0e0e0',
                          '&:hover': {
                            backgroundColor: '#e8f4fd',
                            borderColor: '#1d526eff'
                          }
                        }}
                      >
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            fontWeight: 500,
                            color: '#1d526eff',
                            flex: 1,
                            pl: 1,
                            fontSize: '1rem'
                          }}
                        >
                          {index + 1}. {nombreUnidad}
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ 
                        pl: 2,
                        fontStyle: 'italic',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      No hay unidades asignadas
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
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
        autoHideDuration={6000} 
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Brigadas;
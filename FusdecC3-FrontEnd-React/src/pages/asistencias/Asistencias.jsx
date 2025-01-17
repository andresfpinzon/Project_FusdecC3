import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Info, Calendar, Users, CheckCircle, XCircle, School } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import './Asistencias.css';
import axios from 'axios';

const Asistencia = () => {
  // Estados principales
  const [asistencias, setAsistencias] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [selectedAsistencia, setSelectedAsistencia] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);
  
  // Estados para la fecha y selección de días
  const [weekendDates, setWeekendDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');

  // Estados de autenticación
  const token = localStorage.getItem('token');
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);

  // Formularios para asistencia e inasistencia
  const [formData, setFormData] = useState({
    tituloAsistencia: '',
    fechaAsistencia: '',
    usuarioId: '',
    estadoAsistencia: true,
    estudiantes: [],
  });

  const [inasistenciaForm, setInasistenciaForm] = useState({
    tituloInasistencia: '',
    observacion: '',
    usuarioId: '',
    asistenciaId: '',
    estadoInasistencia: true,
    estudiantes: [],
  });

  const [unidades, setUnidades] = useState([]);
  const [selectedUnidad, setSelectedUnidad] = useState('');

  // Función para obtener los próximos fines de semana
  const getUpcomingWeekends = (startDate) => {
    const dates = [];
    let currentDate = new Date(startDate);
    
    // Obtener los próximos 12 fines de semana
    while (dates.length < 24) { // 12 semanas * 2 días
      if (currentDate.getDay() === 6 || currentDate.getDay() === 0) { // 6 = Sábado, 0 = Domingo
        dates.push(new Date(currentDate));
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  // Efecto para inicializar fechas
  useEffect(() => {
    const startDate = new Date('2025-01-16'); // Fecha inicial proporcionada
    const weekends = getUpcomingWeekends(startDate);
    setWeekendDates(weekends);
    if (weekends.length > 0) {
      setSelectedDate(weekends[0].toISOString().split('T')[0]);
    }
  }, []);

  // Efecto para manejar la autenticación
  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.id);
      setUserRole(decodedToken.roles);
      setFormData(prev => ({
        ...prev,
        usuarioId: decodedToken.id
      }));
      setInasistenciaForm(prev => ({
        ...prev,
        usuarioId: decodedToken.id
      }));
    }
  }, [token]);

  // Efecto para cargar datos
  useEffect(() => {
    if (userRole && userId) {
      fetchAsistencias();
      fetchEstudiantes();
    }
  }, [userRole, userId, selectedDate]);

  // Función para obtener asistencias
  const fetchAsistencias = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/asistencias', {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Error al obtener asistencias');
      let data = await response.json();
      
      if (userRole.includes('Instructor')) {
        data = data.filter(asistencia => asistencia.usuarioId === userId);
      }
      
      setAsistencias(data);
    } catch (error) {
      setErrorMessage('Error al cargar las asistencias');
      setShowError(true);
    }
  };

  // Función para obtener estudiantes
  const fetchEstudiantes = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/estudiantes', {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Error al obtener estudiantes');
      const data = await response.json();
      setEstudiantes(data);
    } catch (error) {
      setErrorMessage('Error al cargar los estudiantes');
      setShowError(true);
    }
  };

  // Función para manejar la creación/actualización de asistencia
  const handleSubmit = async (e, estudiante) => {
    e.preventDefault();
    try {
      const date = new Date(selectedDate);
      const weekNumber = Math.ceil((date.getDate() - date.getDay()) / 7);
      const dayName = date.getDay() === 0 ? 'Domingo' : 'Sábado';
      
      const attendanceData = {
        tituloAsistencia: `Semana ${weekNumber} - ${dayName}`,
        fechaAsistencia: selectedDate,
        usuarioId: userId,
        estadoAsistencia: true,
        estudiantes: [estudiante._id]
      };

      const response = await fetch('http://localhost:3000/api/asistencias', {
        method: 'POST',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(attendanceData)
      });

      if (!response.ok) throw new Error('Error al registrar asistencia');
      await fetchAsistencias();
    } catch (error) {
      setErrorMessage(error.message);
      setShowError(true);
    }
  };

  // Función para marcar inasistencia
  const handleMarkAbsent = async (estudiante) => {
    try {
      const date = new Date(selectedDate);
      const weekNumber = Math.ceil((date.getDate() - date.getDay()) / 7);
      const dayName = date.getDay() === 0 ? 'Domingo' : 'Sábado';

      const inasistenciaData = {
        tituloInasistencia: `Inasistencia - Semana ${weekNumber} - ${dayName}`,
        observacion: 'Falta no justificada',
        usuarioId: userId,
        fechaInasistencia: selectedDate,
        estudiantes: [estudiante._id]
      };

      const response = await fetch('http://localhost:3000/api/inasistencias', {
        method: 'POST',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(inasistenciaData)
      });

      if (!response.ok) throw new Error('Error al registrar inasistencia');
      await fetchAsistencias();
    } catch (error) {
      setErrorMessage('Error al registrar inasistencia');
      setShowError(true);
    }
  };

  // Formatear fecha para mostrar
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  // Efecto para cargar unidades
  useEffect(() => {
    const fetchUnidades = async () => {
        try {
            const response = await axios.get('/api/unidades', {
                headers: {
                    'Authorization': token,
                },
            });
            if (Array.isArray(response.data)) {
                setUnidades(response.data);
            } else {
                console.error('La respuesta no es un array:', response.data);
                setUnidades([]);
            }
        } catch (error) {
            console.error('Error al obtener unidades:', error);
            setUnidades([]);
        }
    };
    fetchUnidades();
  }, [token]);

  // Efecto para cargar estudiantes al seleccionar una unidad
  useEffect(() => {
    const fetchEstudiantes = async () => {
        if (selectedUnidad) {
            try {
                const response = await axios.get(`/api/unidades/${selectedUnidad}/estudiantes`, {
                    headers: {
                        'Authorization': token,
                    },
                });
                setEstudiantes(response.data);
            } catch (error) {
                console.error('Error al obtener estudiantes:', error);
                setEstudiantes([]);
            }
        }
    };
    fetchEstudiantes();
  }, [selectedUnidad, token]);

  // Función para manejar la selección de unidad
  const handleUnidadChange = (e) => {
    setSelectedUnidad(e.target.value);
  };

  return (
    <div className="attendance-container">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Control de Asistencia - Fines de Semana</h1>
      
      {/* Selector de fecha y unidad */}
      <div className="date-selector">
        <div className="form-group">
          <label htmlFor="dateSelect">Fecha:</label>
          <select
            id="dateSelect"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="date-select"
          >
            {weekendDates.map((date) => (
              <option key={date.toISOString()} value={date.toISOString().split('T')[0]}>
                {formatDate(date)}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="unidadSelect">Unidad:</label>
          <select
            id="unidadSelect"
            onChange={handleUnidadChange}
            value={selectedUnidad}
            className="unidad-select"
          >
            <option value="">Selecciona una unidad</option>
            {unidades.map((unidad) => (
              <option key={unidad._id} value={unidad._id}>
                {unidad.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabla de asistencia */}
      <div className="attendance-grid">
        <table className="attendance-table">
          <thead>
            <tr>
              <th className="student-info">Estudiante</th>
              <th>Documento</th>
              <th>Colegio</th>
              <th>Correo</th>
              <th className="attendance-status">Estado</th>
              <th className="actions-column">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {estudiantes.map((estudiante) => {
              const isPresent = asistencias.some(a => 
                a.estudiantes.some(e => e._id === estudiante._id) &&
                a.fechaAsistencia.split('T')[0] === selectedDate
              );

              return (
                <tr key={estudiante._id} className={isPresent ? 'present' : ''}>
                  <td className="student-info">
                    <div className="student-name">
                      {estudiante.nombreEstudiante} {estudiante.apellidoEstudiante}
                    </div>
                  </td>
                  <td>{estudiante.numeroDocumento}</td>
                  <td className="college-info">
                    <School className="w-4 h-4 inline-block mr-2" />
                    {estudiante.colegioId?.nombreColegio || 'No asignado'}
                  </td>
                  <td>{estudiante.correoEstudiante}</td>
                  <td className="attendance-status">
                    {isPresent ? (
                      <span className="status-present">
                        <CheckCircle className="w-5 h-5" />
                        Presente
                      </span>
                    ) : (
                      <span className="status-absent">
                        <XCircle className="w-5 h-5" />
                        Ausente
                      </span>
                    )}
                  </td>
                  <td className="actions">
                    {!isPresent ? (
                      <button
                        onClick={(e) => handleSubmit(e, estudiante)}
                        className="mark-present-btn"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Marcar Presente
                      </button>
                    ) : (
                      <button
                        onClick={() => handleMarkAbsent(estudiante)}
                        className="mark-absent-btn"
                      >
                        <XCircle className="w-4 h-4" />
                        Marcar Ausente
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mensajes de error */}
      {showError && (
        <div className="error-message">
          {errorMessage}
          <button onClick={() => setShowError(false)} className="error-close">
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default Asistencia;
import React, { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import './Asistencias.css';

const token = localStorage.getItem("token");

const Asistencias = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [newTabData, setNewTabData] = useState({ title: '', date: '' });
  const [showNewTabModal, setShowNewTabModal] = useState(false);

  useEffect(() => {
    fetchStudents();
    if (token) {
      const decodedToken = jwtDecode(token);
      fetchAttendanceData(decodedToken.id);
    }
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/estudiantes", {
        headers: { "Authorization": token }
      });
      if (!response.ok) throw new Error("Error fetching students");
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchAttendanceData = async (userId) => {
    try {
      const [attendanceResponse, absenceResponse] = await Promise.all([
        fetch("http://localhost:3000/api/asistencias", {
          headers: { "Authorization": token }
        }),
        fetch("http://localhost:3000/api/inasistencias", {
          headers: { "Authorization": token }
        })
      ]);

      if (!attendanceResponse.ok || !absenceResponse.ok) 
        throw new Error("Error fetching attendance data");

      const attendanceData = await attendanceResponse.json();
      const absenceData = await absenceResponse.json();

      // Combine and process the data
      const combinedData = processAttendanceData(attendanceData, absenceData, userId);
      setAttendanceData(combinedData);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const processAttendanceData = (attendanceData, absenceData, userId) => {
    // Combine attendance and absence data, format it for the table
    // This is a placeholder implementation - adjust according to your data structure
    return attendanceData.map(attendance => ({
      id: attendance._id,
      date: new Date(attendance.fechaAsistencia),
      students: attendance.estudiantes.map(student => ({
        id: student._id,
        name: student.nombreEstudiante,
        status: absenceData.some(absence => 
          absence.asistenciaId === attendance._id && 
          absence.estudiantes.includes(student._id)
        ) ? 'absent' : 'present',
        participation: Math.floor(Math.random() * 5) + 1, // Placeholder - replace with actual data
        observation: ''
      }))
    }));
  };

  const handleCreateNewTab = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/asistencias", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
        body: JSON.stringify({
          tituloAsistencia: newTabData.title,
          fechaAsistencia: newTabData.date,
          usuarioId: jwtDecode(token).id,
          estadoAsistencia: true,
          estudiantes: students.map(student => student._id)
        })
      });

      if (!response.ok) throw new Error("Error creating new attendance tab");

      setShowNewTabModal(false);
      setNewTabData({ title: '', date: '' });
      fetchAttendanceData(jwtDecode(token).id);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleAttendanceChange = async (attendanceId, studentId, newStatus) => {
    try {
      if (newStatus === 'absent') {
        // Create inasistencia
        await fetch("http://localhost:3000/api/inasistencias", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token
          },
          body: JSON.stringify({
            tituloInasistencia: `Inasistencia ${new Date().toISOString()}`,
            asistenciaId: attendanceId,
            usuarioId: jwtDecode(token).id,
            estadoInasistencia: true,
            estudiantes: [studentId]
          })
        });
      } else {
        // Remove inasistencia if exists
        const inasistencias = await fetch("http://localhost:3000/api/inasistencias", {
          headers: { "Authorization": token }
        }).then(res => res.json());

        const inasistenciaToDelete = inasistencias.find(
          i => i.asistenciaId === attendanceId && i.estudiantes.includes(studentId)
        );

        if (inasistenciaToDelete) {
          await fetch(`http://localhost:3000/api/inasistencias/${inasistenciaToDelete._id}`, {
            method: "DELETE",
            headers: { "Authorization": token }
          });
        }
      }

      // Update local state
      setAttendanceData(prevData => 
        prevData.map(attendance => 
          attendance.id === attendanceId
            ? {
                ...attendance,
                students: attendance.students.map(student => 
                  student.id === studentId
                    ? { ...student, status: newStatus }
                    : student
                )
              }
            : attendance
        )
      );
    } catch (error) {
      console.error("Error updating attendance:", error);
    }
  };

  const handleParticipationChange = (attendanceId, studentId, newParticipation) => {
    setAttendanceData(prevData => 
      prevData.map(attendance => 
        attendance.id === attendanceId
          ? {
              ...attendance,
              students: attendance.students.map(student => 
                student.id === studentId
                  ? { ...student, participation: newParticipation }
                  : student
              )
            }
          : attendance
      )
    );
    // Here you would typically also update this in your backend
  };

  const handleObservationChange = (attendanceId, studentId, newObservation) => {
    setAttendanceData(prevData => 
      prevData.map(attendance => 
        attendance.id === attendanceId
          ? {
              ...attendance,
              students: attendance.students.map(student => 
                student.id === studentId
                  ? { ...student, observation: newObservation }
                  : student
              )
            }
          : attendance
      )
    );
    // Here you would typically also update this in your backend
  };

  const filteredAttendanceData = attendanceData.filter(attendance =>
    attendance.students.some(student => 
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const paginatedAttendanceData = filteredAttendanceData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const pageCount = Math.ceil(filteredAttendanceData.length / rowsPerPage);

  const renderStarRating = (value, onChange) => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= value ? 'active' : ''}`}
            onClick={() => onChange(star)}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="attendance-manager">
      <div className="header">
        <h1>Asistencia de Estudiantes</h1>
        <button className="new-tab-btn" onClick={() => setShowNewTabModal(true)}>+ New Tab</button>
      </div>

      <div className="controls">
        <input
          type="text"
          placeholder="Buscar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <div>
          <select className="filter-select">
            <option value="">Filtro</option>
          </select>
          <button className="download-btn">↓ Descargar Todo</button>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th></th>
              {paginatedAttendanceData.map(attendance => (
                <th key={attendance.id} className="date-header">
                  {new Date(attendance.date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric' }).toUpperCase()}
                </th>
              ))}
            </tr>
            <tr>
              <th></th>
              {paginatedAttendanceData.map(attendance => (
                <React.Fragment key={attendance.id}>
                  <th>Estado</th>
                  <th>Participación</th>
                  <th>Observaciones</th>
                </React.Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student._id}>
                <td>{student.nombreEstudiante}</td>
                {paginatedAttendanceData.map(attendance => {
                  const studentAttendance = attendance.students.find(s => s.id === student._id);
                  return (
                    <React.Fragment key={attendance.id}>
                      <td>
                        <select
                          value={studentAttendance?.status || 'present'}
                          onChange={(e) => handleAttendanceChange(attendance.id, student._id, e.target.value)}
                          className={`status-select ${studentAttendance?.status || 'present'}`}
                        >
                          <option value="present">Asistió</option>
                          <option value="absent">Faltó</option>
                        </select>
                      </td>
                      <td>
                        {renderStarRating(
                          studentAttendance?.participation || 0,
                          (newValue) => handleParticipationChange(attendance.id, student._id, newValue)
                        )}
                      </td>
                      <td>
                        <input
                          type="text"
                          value={studentAttendance?.observation || ''}
                          onChange={(e) => handleObservationChange(attendance.id, student._id, e.target.value)}
                          placeholder="Observaciones..."
                          className="observation-input"
                        />
                      </td>
                    </React.Fragment>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <div>
          Rows per page: 
          <select 
            value={rowsPerPage} 
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
          </select>
        </div>
        <div>
          {(currentPage - 1) * rowsPerPage + 1}-{Math.min(currentPage * rowsPerPage, filteredAttendanceData.length)} of {filteredAttendanceData.length}
        </div>
        <div>
          <button 
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            &lt;
          </button>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(pageCount, prev + 1))}
            disabled={currentPage === pageCount}
          >
            &gt;
          </button>
        </div>
      </div>

      {showNewTabModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Nueva Pestaña de Asistencia</h2>
            <input
              type="text"
              placeholder="Título"
              value={newTabData.title}
              onChange={(e) => setNewTabData({...newTabData, title: e.target.value})}
            />
            <input
              type="date"
              value={newTabData.date}
              onChange={(e) => setNewTabData({...newTabData, date: e.target.value})}
            />
            <div>
              <button onClick={handleCreateNewTab}>Crear</button>
              <button onClick={() => setShowNewTabModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Asistencias;

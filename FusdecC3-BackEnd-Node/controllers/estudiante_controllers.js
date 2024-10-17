const logic = require('../logic/estudiante_logic');
const estudianteSchemaValidation = require('../validations/estudiante_validations'); // Importa la validación

// Controlador para listar todos los estudiantes
const listarEstudiantes = async (req, res) => {
  try {
    const estudiantes = await logic.listarEstudiantes();
    if (estudiantes.length === 0) {
      return res.status(204).send(); // 204 No Content
    }
    res.json(estudiantes);
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Controlador para crear un estudiante
const crearEstudiante = async (req, res) => {
  const body = req.body;
  const { error, value } = estudianteSchemaValidation.validate({
    nombreEstudiante: body.nombreEstudiante,
    apellidoEstudiante: body.apellidoEstudiante,
    correoEstudiante: body.correoEstudiante,
    tipoDocumento: body.tipoDocumento,
    numeroDocumento: body.numeroDocumento,
    fechaNacimiento: body.fechaNacimiento,
    generoEstudiante: body.generoEstudiante,
    unidadId: body.unidadId,
    colegioId: body.colegioId,
    estadoEstudiante: body.estadoEstudiante
  });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  try {
    const nuevoEstudiante = await logic.crearEstudiante(value);
    res.status(201).json(nuevoEstudiante);
  } catch (err) {
    if (err.message === 'El correo o número de documento ya están registrados') {
      return res.status(409).json({ error: err.message });
    }
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Controlador para actualizar un estudiante
const actualizarEstudiante = async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  const { error, value } = estudianteSchemaValidation.validate({
    nombreEstudiante: body.nombreEstudiante,
    apellidoEstudiante: body.apellidoEstudiante,
    correoEstudiante: body.correoEstudiante,
    tipoDocumento: body.tipoDocumento,
    numeroDocumento: body.numeroDocumento,
    fechaNacimiento: body.fechaNacimiento,
    generoEstudiante: body.generoEstudiante,
    unidadId: body.unidadId,
    colegioId: body.colegioId,
    estadoEstudiante: body.estadoEstudiante
  });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  try {
    const estudianteActualizado = await logic.actualizarEstudiante(id, value);
    if (!estudianteActualizado) {
      return res.status(404).json({ error: 'Estudiante no encontrado' });
    }
    res.json(estudianteActualizado);
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Controlador para desactivar un estudiante
const desactivarEstudiante = async (req, res) => {
  const { id } = req.params;
  try {
    const estudianteDesactivado = await logic.desactivarEstudiante(id);
    if (!estudianteDesactivado) {
      return res.status(404).json({ error: 'Estudiante no encontrado' });
    }
    res.json(estudianteDesactivado);
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Controlador para obtener un estudiante por ID
const obtenerEstudiantePorId = async (req, res) => {
  const { id } = req.params;
  try {
    const estudiante = await logic.obtenerEstudiantePorId(id);
    if (!estudiante) {
      return res.status(404).json({ error: `Estudiante con ID ${id} no encontrado` });
    }
    res.json(estudiante);
  } catch (err) {
    res.status(500).json({ error: `Error interno del servidor al buscar el estudiante: ${err.message}` });
  }
};

// Controlador para asignar un colegio a un estudiante
const asignarColegioAEstudiante = async (req, res) => {
  const { id } = req.params;
  const { colegioId } = req.body;
  try {
    const estudiante = await logic.asignarColegioAEstudiante(id, colegioId);
    if (!estudiante) {
      return res.status(404).json({ error: 'Estudiante no encontrado' });
    }
    res.json(estudiante);
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Controlador para asignar una unidad a un estudiante
const asignarUnidadAEstudiante = async (req, res) => {
  const { id } = req.params;
  const { unidadId } = req.body;
  try {
    const estudiante = await logic.asignarUnidadAEstudiante(id, unidadId);
    if (!estudiante) {
      return res.status(404).json({ error: 'Estudiante no encontrado' });
    }
    res.json(estudiante);
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Controlador para asignar ediciones a un estudiante
const asignarEdicionesAEstudiante = async (req, res) => {
  const { id } = req.params;
  const { edicionesIds } = req.body;
  try {
    const estudiante = await logic.asignarEdicionesAEstudiante(id, edicionesIds);
    if (!estudiante) {
      return res.status(404).json({ error: 'Estudiante no encontrado' });
    }
    res.json(estudiante);
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Controlador para agregar asistencia a un estudiante
const agregarAsistenciaAEstudiante = async (req, res) => {
  const { estudianteId, asistenciaId } = req.body;
  try {
    await logic.agregarAsistenciaAEstudiante(estudianteId, asistenciaId);
    res.status(200).json({ message: 'Asistencia agregada correctamente' });
  } catch (err) {
    if (err.message === 'Estudiante no encontrado') {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Controlador para agregar inasistencia a un estudiante
const agregarInasistenciaAEstudiante = async (req, res) => {
  const { estudianteId, inasistenciaId } = req.body;
  try {
    await logic.agregarInasistenciaAEstudiante(estudianteId, inasistenciaId);
    res.status(200).json({ message: 'Inasistencia agregada correctamente' });
  } catch (err) {
    if (err.message === 'Estudiante no encontrado') {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Controlador para agregar calificación a un estudiante
const agregarCalificacionAEstudiante = async (req, res) => {
  const { estudianteId, calificacionId } = req.body;
  try {
    await logic.agregarCalificacionAEstudiante(estudianteId, calificacionId);
    res.status(200).json({ message: 'Calificación agregada correctamente' });
  } catch (err) {
    if (err.message === 'Estudiante no encontrado') {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Controlador para agregar un certificado a un estudiante
const agregarCertificadoAEstudiante = async (req, res) => {
  const { estudianteId, certificadoId } = req.body;
  try {
    await logic.agregarCertificadoAEstudiante(estudianteId, certificadoId);
    res.status(200).json({ message: 'Certificado agregado correctamente' });
  } catch (err) {
    if (err.message === 'Estudiante no encontrado') {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Exportar los controladores adicionales
module.exports = {
  listarEstudiantes,
  crearEstudiante,
  actualizarEstudiante,
  desactivarEstudiante,
  obtenerEstudiantePorId,
  asignarColegioAEstudiante,
  asignarUnidadAEstudiante,
  asignarEdicionesAEstudiante,
  agregarAsistenciaAEstudiante,
  agregarInasistenciaAEstudiante,
  agregarCalificacionAEstudiante,
  agregarCertificadoAEstudiante,
};

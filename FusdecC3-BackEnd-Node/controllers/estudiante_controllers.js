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
    estadoEstudiante: body.estadoEstudiante,
    ediciones: body.ediciones || [],
    calificaciones: body.calificaciones || [],
    inasistencias: body.inasistencias || [],
    asistencias: body.asistencias || [],
    certificados: body.certificados || []
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
    estadoEstudiante: body.estadoEstudiante,
    ediciones: body.ediciones || [],
    calificaciones: body.calificaciones || [],
    inasistencias: body.inasistencias || [],
    asistencias: body.asistencias || [],
    certificados: body.certificados || []
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


// Controlador para agregar asistencias a un estudiante
const agregarAsistenciaAEstudiante = async (req, res) => {
  const { estudianteId } = req.params;
  const { asistencias } = req.body;

  if (!Array.isArray(asistencias) || asistencias.length === 0) {
      return res.status(400).json({ error: 'Se requiere un array de IDs de asistencias' });
  }

  try {
      const estudianteActualizado = await logic.agregarAsistenciaAEstudiante(estudianteId, asistencias);
      res.json({ estudiante: estudianteActualizado });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

// Controlador para agregar inasistencias a un estudiante
const agregarInasistenciaAEstudiante = async (req, res) => {
  const { estudianteId } = req.params;
  const { inasistencias } = req.body;

  if (!Array.isArray(inasistencias) || inasistencias.length === 0) {
      return res.status(400).json({ error: 'Se requiere un array de IDs de inasistencias' });
  }

  try {
      const estudianteActualizado = await logic.agregarInasistenciaAEstudiante(estudianteId, inasistencias);
      res.json({ estudiante: estudianteActualizado });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

// Controlador para agregar certificados a un estudiante
const agregarCertificadoAEstudiante = async (req, res) => {
  const { estudianteId } = req.params;
  const { certificados } = req.body;

  if (!Array.isArray(certificados) || certificados.length === 0) {
      return res.status(400).json({ error: 'Se requiere un array de IDs de certificados' });
  }

  try {
      const estudianteActualizado = await logic.agregarCertificadoAEstudiante(estudianteId, certificados);
      res.json({ estudiante: estudianteActualizado });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

// Controlador para agregar calificaciones a un estudiante
const agregarCalificacionAEstudiante = async (req, res) => {
  const { estudianteId } = req.params;
  const { calificaciones } = req.body;

  if (!Array.isArray(calificaciones) || calificaciones.length === 0) {
      return res.status(400).json({ error: 'Se requiere un array de IDs de calificaciones' });
  }

  try {
      const estudianteActualizado = await logic.agregarCalificacionAEstudiante(estudianteId, calificaciones);
      res.json({ estudiante: estudianteActualizado });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

// Controlador para agregar ediciones a un estudiante
const agregarEdicionAEstudiante = async (req, res) => {
  const { estudianteId } = req.params;
  const { ediciones } = req.body;

  if (!Array.isArray(ediciones) || ediciones.length === 0) {
      return res.status(400).json({ error: 'Se requiere un array de IDs de ediciones' });
  }

  try {
      const estudianteActualizado = await logic.agregarEdicionAEstudiante(estudianteId, ediciones);
      res.json({ estudiante: estudianteActualizado });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};


// Exportar los controladores adicionales
module.exports = {
  listarEstudiantes,
  crearEstudiante,
  actualizarEstudiante,
  desactivarEstudiante,
  obtenerEstudiantePorId,
  agregarAsistenciaAEstudiante,
  agregarInasistenciaAEstudiante,
  agregarCertificadoAEstudiante,
  agregarCalificacionAEstudiante,
  agregarEdicionAEstudiante
};

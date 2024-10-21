const logic = require('../logic/inasistencia_logic');
const inasistenciaSchemaValidation = require('../validations/inasistencia_validations'); // Importa la validación

// Controlador para listar todas las inasistencias
const listarInasistencias = async (req, res) => {
  try {
    const inasistencias = await logic.listarInasistencias();
    if (inasistencias.length === 0) {
      return res.status(204).send(); // 204 No Content
    }
    res.json(inasistencias);
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Controlador para crear una inasistencia
const crearInasistencia = async (req, res) => {
  const body = req.body;
  const { error, value } = inasistenciaSchemaValidation.validate({
    tituloInasistencia: body.tituloInasistencia,
    observacion: body.observacion,
    usuarioId: body.usuarioId,
    asistenciaId: body.asistenciaId,
    estadoInasistencia: body.estadoInasistencia,
    estudiantes: body.estudiantes
  });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  try {
    const nuevaInasistencia = await logic.crearInasistencia(value);
    res.status(201).json(nuevaInasistencia);
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Controlador para actualizar una inasistencia
const actualizarInasistencia = async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  const { error, value } = inasistenciaSchemaValidation.validate({
    tituloInasistencia: body.tituloInasistencia,
    observacion: body.observacion,
    usuarioId: body.usuarioId,
    asistenciaId: body.asistenciaId,
    estadoInasistencia: body.estadoInasistencia,
    estudiantes: body.estudiantes
  });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  try {
    const inasistenciaActualizada = await logic.actualizarInasistencia(id, value);
    if (!inasistenciaActualizada) {
      return res.status(404).json({ error: 'Inasistencia no encontrada' });
    }
    res.json(inasistenciaActualizada);
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Controlador para eliminar una inasistencia
const desactivarInasistencia = async (req, res) => {
  const { id } = req.params;
  try {
    const inasistenciaDesactivada = await logic.desactivarInasistencia(id);
    if (!inasistenciaDesactivada) {
      return res.status(404).json({ error: 'Inasistencia no encontrada' });
    }
    res.json(inasistenciaDesactivada);
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Controlador para obtener una inasistencia por su ID
const obtenerInasistenciaPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const inasistencia = await logic.obtenerInasistenciaPorId(id);
    if (!inasistencia) {
      return res.status(404).json({ error: `Inasistencia con ID ${id} no encontrada` });
    }
    res.json(inasistencia);
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  listarInasistencias,
  crearInasistencia,
  actualizarInasistencia,
  desactivarInasistencia,
  obtenerInasistenciaPorId,
};

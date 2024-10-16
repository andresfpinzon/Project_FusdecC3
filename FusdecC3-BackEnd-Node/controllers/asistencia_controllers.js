const logic = require('../logic/asistencia_logic');
const asistenciaSchemaValidation = require('../validations/asistencia_validations'); // Importa la validación

// Controlador para listar todas las asistencias
const listarAsistencias = async (req, res) => {
  try {
    const asistencias = await logic.listarAsistencias();
    if (asistencias.length === 0) {
      return res.status(204).send(); // 204 No Content
    }
    res.json(asistencias);
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Controlador para crear una asistencia
const crearAsistencia = async (req, res) => {
  const body = req.body;
  const { error, value } = asistenciaSchemaValidation.validate({
    tituloAsistencia: body.tituloAsistencia,
    fechaAsistencia: body.fechaAsistencia,
    usuarioId: body.usuarioId,
    estudiantes: body.estudiantes
  });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  try {
    const nuevaAsistencia = await logic.crearAsistencia(value);
    res.status(201).json(nuevaAsistencia);
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Controlador para actualizar una asistencia
const actualizarAsistencia = async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  const { error, value } = asistenciaSchemaValidation.validate({
    tituloAsistencia: body.tituloAsistencia,
    fechaAsistencia: body.fechaAsistencia,
    usuarioId: body.usuarioId,
    estudiantes: body.estudiantes
  });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  try {
    const asistenciaActualizada = await logic.actualizarAsistencia(id, value);
    if (!asistenciaActualizada) {
      return res.status(404).json({ error: 'Asistencia no encontrada' });
    }
    res.json(asistenciaActualizada);
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Controlador para eliminar una asistencia
const eliminarAsistencia = async (req, res) => {
  const { id } = req.params;
  try {
    const asistenciaEliminada = await logic.eliminarAsistencia(id);
    if (!asistenciaEliminada) {
      return res.status(404).json({ error: 'Asistencia no encontrada' });
    }
    res.json(asistenciaEliminada);
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Controlador para obtener una asistencia por su ID
const obtenerAsistenciaPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const asistencia = await logic.obtenerAsistenciaPorId(id);
    if (!asistencia) {
      return res.status(404).json({ error: `Asistencia con ID ${id} no encontrada` });
    }
    res.json(asistencia);
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  listarAsistencias,
  crearAsistencia,
  actualizarAsistencia,
  eliminarAsistencia,
  obtenerAsistenciaPorId,
};

const logic = require("../logic/asistencia_logic")
const asistenciaSchemaValidation = require("../validations/asistencia_validations")

// Controlador para listar todas las asistencias
const listarAsistencias = async (req, res) => {
  try {
    const asistencias = await logic.listarAsistenciasActivas()
    if (asistencias.length === 0) {
      return res.status(204).json({ message: "No hay asistencias disponibles" })
    }
    res.json(asistencias)
  } catch (err) {
    console.error("Error al listar asistencias:", err)
    res.status(500).json({ error: "Error interno del servidor", details: err.message })
  }
}

// Controlador para crear una asistencia
const crearAsistencia = async (req, res) => {
  try {
    const { error } = asistenciaSchemaValidation.validate(req.body)
    if (error) {
      return res.status(400).json({ error: error.details[0].message })
    }
    const nuevaAsistencia = await logic.crearAsistencia(req.body)
    res.status(201).json(nuevaAsistencia)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const actualizarAsistencia = async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = asistenciaSchemaValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Si vienen objetos completos, extrae solo los IDs
    const body = {
      ...req.body,
      estudiantes: req.body.estudiantes?.map(e => e._id || e) // Extrae IDs si son objetos
    };

    const asistenciaActualizada = await logic.actualizarAsistencia(id, body);
    res.json(asistenciaActualizada);
  } catch (error) {
    console.error('Error en controlador:', error);
    res.status(500).json({ error: "Error interno del servidor", details: error.message });
  }
}

// Controlador para eliminar una asistencia
const desactivarAsistencia = async (req, res) => {
  const { id } = req.params
  try {
    const asistenciaDesactivada = await logic.desactivarAsistencia(id)
    if (!asistenciaDesactivada) {
      return res.status(404).json({ error: "Asistencia no encontrada" })
    }
    res.json(asistenciaDesactivada)
  } catch (err) {
    res.status(500).json({ error: "Error interno del servidor" })
  }
}

// Controlador para obtener una asistencia por su ID
const obtenerAsistenciaPorId = async (req, res) => {
  const { id } = req.params
  try {
    const asistencia = await logic.obtenerAsistenciaPorId(id)
    if (!asistencia) {
      return res.status(404).json({ error: `Asistencia con ID ${id} no encontrada` })
    }
    res.json(asistencia)
  } catch (err) {
    res.status(500).json({ error: "Error interno del servidor" })
  }
}

module.exports = {
  listarAsistencias,
  crearAsistencia,
  actualizarAsistencia,
  desactivarAsistencia,
  obtenerAsistenciaPorId,
}


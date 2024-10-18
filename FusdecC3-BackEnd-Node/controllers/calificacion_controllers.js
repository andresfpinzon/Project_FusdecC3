const logic = require("../logic/calificacion_logic");
const {
  calificacionSchemaValidation,
} = require("../validations/calificacion_validation");

// Controlador para crear una calificacion
const crearCalificacion = async (req, res) => {
  const body = req.body;
  const { error, value } = calificacionSchemaValidation.validate({
    tituloCalificacion: body.tituloCalificacion,
    aprobado: body.aprobado,
    usuarioId: body.usuarioId,
    estadoCalificacion: body.estadoCalificacion,
    estudiantes: body.estudiantes,
  });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  try {
    const nuevaCalificacion = await logic.crearCalificacion(value);
    res.status(201).json(nuevaCalificacion);
  } catch (err) {
    if (err.message === "La calificación con este título ya existe") {
      return res.status(409).json({ error: err.message });
    }
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Controlador para actualizar una calificación
const actualizarCalificacion = async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  const { error, value } = calificacionSchemaValidation.validate({
    tituloCalificacion: body.tituloCalificacion,
    aprobado: body.aprobado,
    usuarioId: body.usuarioId,
    estadoCalificacion: body.estadoCalificacion,
    estudiantes: body.estudiantes,
  });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  try {
    const calificacionActualizada = await logic.actualizarCalificacion(
      id,
      value
    );
    if (!calificacionActualizada) {
      return res.status(404).json({ error: "Calificacion no encontrado" });
    }
    res.json(calificacionActualizada);
  } catch (err) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Controlador para desactivar una calificacion
const desactivarCalificacion = async (req, res) => {
  const { id } = req.params;
  try {
    const calificacionDesactivada = await logic.desactivarCalificacion(id);
    if (!calificacionDesactivada) {
      return res.status(404).json({ error: "Calificación no encontrado" });
    }
    res.json(calificacionDesactivada);
  } catch (err) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Controlador para listar las calificaciones activas
const listarCalificacionesActivas = async (req, res) => {
  try {
    const calificacionesActivas = await logic.listarCalificacionesActivas();
    if (calificacionesActivas.length === 0) {
      return res.status(204).send(); // 204 No Content
    }
    res.json(calificacionesActivas);
  } catch (err) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Función asíncrona para buscar un calificacion por su ID
const obtenerCalificacionPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const calificacion = await logic.buscarCalificacionPorId(id);
    if (!calificacion) {
      return res
        .status(404)
        .json({ error: `Calificación con ID ${id} no encontrado` });
    }
    res.json(calificacion);
  } catch (err) {
    res.status(500).json({
      error: `Error interno del servidor al buscar la calificación: ${err.message}`,
    });
  }
};

// Exportar los controladores
module.exports = {
  crearCalificacion,
  actualizarCalificacion,
  desactivarCalificacion,
  listarCalificacionesActivas,
  obtenerCalificacionPorId
};

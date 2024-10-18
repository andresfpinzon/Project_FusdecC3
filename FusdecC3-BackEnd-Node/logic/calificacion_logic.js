const Calificacion = require("../models/calificacion_model");

// Función asíncrona para crear calificaciones
const crearCalificacion = async (req, res) => {
  const body = req.body;
  const { error, value } = CalificacionSchemaValidation.validate(body);
  
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const nuevaCalificacion = await logic.crearCalificacion(value);
    res.status(201).json(nuevaCalificacion);
  } catch (err) {
    if (err.message.includes("ya existe")) {
      return res.status(409).json({ error: err.message });
    }
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


// Función asíncrona para actualizar calificación
async function actualizarCalificacion(id, body) {
  let calificacion = await Calificacion.findByIdAndUpdate(
    id,
    {
      $set: {
        tituloCalificacion: body.tituloCalificacion,
        aprobado: body.aprobado,
        usuarioId: body.usuarioId,
        estadoCalificacion: body.estadoCalificacion,
        estudiantes: body.estudiantes,
      },
    },
    { new: true }
  );

  return calificacion;
}

// Función asíncrona para inactivar calificaciones
async function desactivarCalificacion(id) {
  let calificacion = await Calificacion.findByIdAndUpdate(
    id,
    {
      $set: {
        estadoCalificacion: false,
      },
    },
    { new: true }
  );

  return calificacion;
}

// Función asíncrona para listar las calificaciones activas
async function listarCalificacionesActivas() {
  let calificacion = await Calificacion.find({ estadoCalificacion: true });
  return calificacion;
}

// Función asíncrona para buscar una calificacion por su ID
async function buscarCalificacionPorId(id) {
  try {
    const calificacion = await Calificacion.findById(id);
    if (!calificacion) {
      throw new Error(`Calificación con ID ${id} no encontrado`);
    }
    return calificacion;
  } catch (err) {
    console.error(`Error al buscar la calificacion por ID: ${err.message}`);
    throw err;
  }
}

module.exports = {
  crearCalificacion,
  actualizarCalificacion,
  desactivarCalificacion,
  listarCalificacionesActivas,
  buscarCalificacionPorId
};

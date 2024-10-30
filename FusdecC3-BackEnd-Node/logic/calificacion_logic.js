const Calificacion = require("../models/calificacion_model");

// Función asíncrona para crear una calificación
async function crearCalificacion(body) {
  let calificacion = new Calificacion({
      tituloCalificacion: body.tituloCalificacion,
      aprobado: body.aprobado,
      usuarioId: body.usuarioId,
      estadoCalificacion: body.estadoCalificacion, 
      estudiantes: body.estudiantes || [], 
  });

  // Guardar la calificación en la base de datos
  return await calificacion.save();
}

module.exports = {
  crearCalificacion,
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
  )
  .populate('usuarioId')
  .populate('estudiantes');

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
  let calificacion = await Calificacion.find({ estadoCalificacion: true })
  .populate('usuarioId')
  .populate('estudiantes');
  return calificacion;
}

// Función asíncrona para buscar una calificacion por su ID
async function buscarCalificacionPorId(id) {
  try {
    const calificacion = await Calificacion.findById(id)
    .populate('usuarioId')
    .populate('estudiantes');
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

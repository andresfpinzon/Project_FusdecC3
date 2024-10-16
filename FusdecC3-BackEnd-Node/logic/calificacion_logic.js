const Calificacion = require("../models/calificacion_model");

// Función asíncrona para crear calificaciones
async function crearCalificacion(body) {
  // Verificar si ya existe una calificacion con el mismo título
  const cursoExistente = await Curso.findOne({
    tituloCalificacion: body.tituloCalificacion,
  });
  if (calificacionExistente) {
    throw new Error("La calificacion con este título ya existe");
  }

  let calificacion = new Calificacion({
    tituloCalificacion: body.tituloCalificacion,
    aprobado: body.aprobado,
    usuarioId: body.usuarioId,
    estadoCalificacion: body.estadoCalificacion,
    estudiantes: body.estudiantes,
  });

  return await calificacion.save();
}

// Función asíncrona para actualizar calificación
async function actualizarCalificacion(id, body) {
  let calificacion = await Calificacion.findByIdAndUpdate(
    id,
    {
      $set: {
        tituloCalificacion: body.tituloCalificacion,
        aprobado: body.aprobado,
        usuarioId: body.usuarioId,
        estudiantes: body.estudiantes,
      },
    },
    { new: true }
  );

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
  buscarCalificacionPorId,
};

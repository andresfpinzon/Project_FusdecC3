const Calificacion = require("../models/calificacion_model");
const Estudiante = require("../models/estudiante_model");

// Función asíncrona para crear una calificación
async function crearCalificacion(body) {
  try {
   
  // Crear una nueva calificación
  let calificacion = new Calificacion({
    tituloCalificacion: body.tituloCalificacion,
    aprobado: body.aprobado,
    usuarioId: body.usuarioId,
    estadoCalificacion: body.estadoCalificacion,
    estudiantes: body.estudiantes || [], // Array de estudiantes
});

// Guardar la calificación en la base de datos
calificacion = await calificacion.save();

// Actualizar los estudiantes seleccionados para agregar esta calificación
if (body.estudiantes && body.estudiantes.length > 0) {
    await Estudiante.updateMany(
        { _id: { $in: body.estudiantes } }, // Filtrar solo los estudiantes seleccionados
        { $push: { calificaciones: calificacion._id } } // Agregar el ID de la calificación al array
    );
}

return calificacion; 
  } catch (error) {
    console.error("Error al crear la calificación:", error);
    throw error;
  }
}

// Función asíncrona para actualizar calificación
async function actualizarCalificacion(id, body) {
  try {
  // Buscar la calificación por ID
  let calificacion = await Calificacion.findById(id);
  if (!calificacion) {
      throw new Error('Calificación no encontrada');
  }

  // Verificar si ya existe una calificación con el mismo título, excluyendo el curso actual
  const calificacionExistente = await Curso.findOne({
    tituloCalificacion: body.tituloCalificacion,
    _id: { $ne: id }, // Excluir el curso actual
  });

  

  // Obtener la lista de estudiantes originales
  const estudiantesOriginales = calificacion.estudiantes;

  // Actualizar los campos de la calificación
  calificacion.tituloCalificacion = body.tituloCalificacion || calificacion.tituloCalificacion;
  calificacion.aprobado = body.aprobado || calificacion.aprobado;
  calificacion.usuarioId = body.usuarioId || calificacion.usuarioId;
  calificacion.estadoCalificacion = body.estadoCalificacion || calificacion.estadoCalificacion;
  calificacion.estudiantes = body.estudiantes || calificacion.estudiantes;

  // Guardar los cambios de la calificación
  calificacion = await calificacion.save();

  // Remover el ID de la calificación de los estudiantes originales
  await Estudiante.updateMany(
      { _id: { $in: estudiantesOriginales } },
      { $pull: { calificaciones: calificacion._id } }
  );

  // Agregar el ID de la calificación a los nuevos estudiantes
  if (body.estudiantes && body.estudiantes.length > 0) {
      await Estudiante.updateMany(
          { _id: { $in: body.estudiantes } },
          { $push: { calificaciones: calificacion._id } }
      );
  }
  return calificacion;  
  } catch (error) {
   console.error("Error al actualizar la calificación:", error);
    throw error; 
  }
}


// Función asíncrona para inactivar calificaciones
async function desactivarCalificacion(id) {
  try {
   
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
  } catch (error) {
    console.error("Error al inactivar la calificación:", error);
    throw error;
  }
}

// Función asíncrona para listar las calificaciones activas
async function listarCalificacionesActivas() {
  try {
  let calificacion = await Calificacion.find({ estadoCalificacion: true })
  .populate('usuarioId')
  .populate('estudiantes');
  return calificacion; 
  } catch (error) {
    console.error("Error al listar las calificaciones (calificacion_logic):", error);
    throw error;
  }
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

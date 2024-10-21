const Edicion = require("../models/edicion_model");

// Función asíncrona para crear ediciones
async function crearEdicion(body) {
  // Verificar si ya existe una edicion con el mismo título
  const edicionExistente = await Edicion.findOne({
    tituloEdicion: body.tituloEdicion,
  });
  if (edicionExistente) {
    throw new Error("La edición con este título ya existe");
  }

  let edicion = new Edicion({
    tituloEdicion: body.tituloEdicion,
    fechaInicioEdicion: body.fechaInicioEdicion,
    fechaFinEdicion: body.fechaFinEdicion,
    estadoEdicion: body.estadoEdicion,
    cursoId: body.cursoId,
    horarios: body.horarios,
    estudiantes: body.estudiantes,
  });

  return await edicion.save();
}

// Función asíncrona para actualizar ediciones
async function actualizarEdicion(id, body) {
  let edicion = await Edicion.findByIdAndUpdate(
    id,
    {
      $set: {
        tituloEdicion: body.tituloEdicion,
        fechaInicioEdicion: body.fechaInicioEdicion,
        fechaFinEdicion: body.fechaFinEdicion,
        horarios: body.horarios,
        estudiantes: body.estudiantes,
      },
    },
    { new: true }
  )
  .populate('cursoId')
  .populate('horarios');

  return edicion;
}

// Función asíncrona para inactivar ediciones
async function desactivarEdicion(id) {
  let edicion = await Edicion.findByIdAndUpdate(
    id,
    {
      $set: {
        estadoEdicion: false,
      },
    },
    { new: true }
  );

  return edicion;
}

// Función asíncrona para listar las ediciones activas
async function listarEdicionesActivas() {
  let ediciones = await Edicion.find({ estadoEdicion: true })
  .populate('cursoId')
  .populate('horarios');
  return ediciones;
}

// Función asíncrona para buscar una edicion por su ID
async function buscarEdicionPorId(id) {
  try {
    const edicion = await Edicion.findById(id).populate('cursoId')
    .populate('horarios');
    if (!edicion) {
      throw new Error(`Edición con ID ${id} no encontrado`);
    }
    return edicion;
  } catch (err) {
    console.error(`Error al buscar la edición por ID: ${err.message}`);
    throw err;
  }
}

module.exports = {
  crearEdicion,
  actualizarEdicion,
  desactivarEdicion,
  listarEdicionesActivas,
  buscarEdicionPorId,
};

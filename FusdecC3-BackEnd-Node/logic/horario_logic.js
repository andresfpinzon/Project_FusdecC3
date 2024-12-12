const Horario = require("../models/horario_model");

// Función asíncrona para crear horarios
async function crearHorario(body) {
  // Verificar si ya existe un horario con el mismo titulo
  const horarioExistente = await Horario.findOne({
    tituloHorario: body.tituloHorario,
  });
  if (horarioExistente) {
    throw new Error("El horario con este título ya existe");
  }

  let horario = new Horario({
    tituloHorario: body.tituloHorario,
    horaInicio: body.horaInicio,
    horaFin: body.horaFin,
    estadoHorario: body.estadoHorario,
  });

  return await horario.save();
}

// Función asíncrona para actualizar horarios
async function actualizarHorario(id, body) {

  // Verificar si ya existe un horario con el mismo titulo
  const horarioExistente = await Horario.findOne({
    tituloHorario: body.tituloHorario, 
    _id: { $ne: id } // Excluir el horario actual
  });

  let horario = await Horario.findByIdAndUpdate(
    id,
    {
      $set: {
        tituloHorario: body.tituloHorario,
        horaInicio: body.horaInicio,
        horaFin: body.horaFin,
      },
    },
    { new: true }
  );

  return horario;
}

// Función asíncrona para inactivar horarios
async function desactivarHorario(id) {
  let horario = await Horario.findByIdAndUpdate(
    id,
    {
      $set: {
        estadoHorario: false,
      },
    },
    { new: true }
  );

  return horario;
}

// Función asíncrona para listar los cursos horarios
async function listarHorariosActivos() {
  let horarios = await Horario.find({ estadoHorario: true });
  return horarios;
}

// Función asíncrona para buscar un horario por su ID
async function buscarHorarioPorId(id) {
  try {
    const horario = await Horario.findById(id);
    if (!horario) {
      throw new Error(`Horario con ID ${id} no encontrado`);
    }
    return horario;
  } catch (err) {
    console.error(`Error al buscar el horario por ID: ${err.message}`);
    throw err;
  }
}

module.exports = {
  crearHorario,
  actualizarHorario,
  desactivarHorario,
  listarHorariosActivos,
  buscarHorarioPorId,
};

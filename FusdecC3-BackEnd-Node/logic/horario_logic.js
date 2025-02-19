const Horario = require("../models/horario_model");

// Función asíncrona para crear horarios
async function crearHorario(body) {
  const {tituloHorario} = body
  try {
    const horarioExistente = await Horario.findOne({tituloHorario})
    if (horarioExistente) throw new Error("El horario con este título ya existe")
    const newHorario = new Horario(body)
    await newHorario.save()
    return newHorario
  } catch (error) {
    console.error('Error al crear el horario (horario_logic):', error);
    throw error;
  }
}

// Función asíncrona para actualizar horarios
async function actualizarHorario(id, body) {
  const {tituloHorario} = body
    try {
      const horarioExistente = await Horario.findOne({tituloHorario: tituloHorario, _id: { $ne: id } })
      if (horarioExistente) throw new Error("El horario con este título ya existe")
      const updateHorario = await Horario.findByIdAndUpdate(id, body, { new: true })
      return updateHorario
    } catch (error) {
      console.error('Error al actualizar el horario (horario_logic):', error);
      throw error;
    }
}

// Función asíncrona para inactivar horarios
async function togglerStateLogic(id) {
  try {
    const horarioExistente = await Horario.findById(id);
    if (!horarioExistente) throw new Error("Horario no encontrado")
    const newState = !horarioExistente.estadoHorario;
    const updatedHorario = await Horario.findByIdAndUpdate(id, { estadoHorario: newState }, { new: true }).exec();
    if(!updatedHorario) throw new Error('Error al desactivar el horario');
    return updatedHorario;
  } catch (error) {
   console.error('Error al desactivar el horario (horario_logic):', error);
   throw error; 
  }
}

// Función asíncrona para listar los horarios
async function listarHorariosActivos() {
  try {
    const horarios = await Horario.find({ estadoHorario: true });
    if (horarios.length === 0) throw new Error("No se encontraron horarios activos");
    return horarios;
  } catch (error) {
    console.error('Error al listar los horarios activos (horario_logic):', error);
    throw error;
  }
}

// Función asíncrona para buscar un horario por su ID
async function buscarHorarioPorId(id) {
  try {
    const horario = await Horario.findById(id);
    if (!horario) throw new Error(`Horario con ID ${id} no encontrado`);
    return horario;
  } catch (err) {
    console.error(`Error al buscar el horario por ID: ${err.message}`);
    throw err;
  }
}

module.exports = {
  crearHorario,
  actualizarHorario,
  togglerStateLogic,
  listarHorariosActivos,
  buscarHorarioPorId,
};

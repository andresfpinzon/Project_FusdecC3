const Objetivo = require("../models/objetivo_model");
const Horario = require("../models/objetivo_model");

// Función asíncrona para crear horarios
async function crearObjetivo(body) {
  // Verificar si ya existe un objetivo con el mismo titulo
  const objetivoExistente = await Objetivo.findOne({
    tituloObjetivo: body.tituloObjetivo,
  });
  if (objetivoExistente) {
    throw new Error("El objetivo con este título ya existe");
  }

  let objetivo = new Objetivo({
    tituloObjetivo: body.tituloObjetivo,
    descripcionObjetivo: body.descripcionObjetivo,
    estadoObjetivo: body.estadoObjetivo,
    cursoId: body.cursoId,
  });

  return await objetivo.save();
}

// Función asíncrona para actualizar objetivos
async function actualizarObjetivo(id, body) {

  // Verificar si ya existe un objetivo con el mismo titulo
  const objetivoExistente = await Objetivo.findOne({
    tituloObjetivo: body.tituloObjetivo, 
    _id: { $ne: id } // Excluir el objetivo actual
  });

  let objetivo = await Objetivo.findByIdAndUpdate(
    id,
    {
      $set: {
        tituloObjetivo: body.tituloObjetivo,
        descripcionObjetivo: body.descripcionObjetivo,
        estadoObjetivo: body.estadoObjetivo,
        cursoId: body.cursoId,
      },
    },
    { new: true }
  );

  return objetivo;
}

// Función asíncrona para inactivar objetivos
async function desactivarObjetivo(id) {
  let objetivo = await Objetivo.findByIdAndUpdate(
    id,
    {
      $set: {
        estadoObjetivo: false,
      },
    },
    { new: true }
  );

  return objetivo;
}

// Función asíncrona para listar los objetivos
async function listarObjetivosActivos() {
  let objetivos = await Objetivo.find({ estadoObjetivo: true });
  return objetivos;
}

// Función asíncrona para guardar una colección de objetivos
async function guardarObjetivos(objetivos) {
  try {
    const resultados = [];
    for (let objetivoData of objetivos) {
      // Verificar si ya existe un objetivo con el mismo título
      const objetivoExistente = await Objetivo.findOne({ titulo: obtivoData.titulo });
      if (!objetivoExistente) {
        let nuevoObjetivo = new Objetivo(objetivoData);
        let objetivoGuardado = await nuevoObjetivo.save();
        resultados.push(objetivoGuardado);
      } else {
        console.log(`El objetivo con título "${objetivoData.titulo}" ya existe.`);
      }
    }
    return resultados;
  } catch (err) {
    console.error('Error al guardar la colección de objetivos:', err);
    throw err; // Re-lanza el error para manejarlo en la capa superior si es necesario
  }
}

// Función asíncrona para buscar un objetivo por su ID
async function buscarObjetivoPorId(id) {
  try {
    const objetivo = await Objetivo.findById(id);
    if (!objetivo) {
      throw new Error(`Objetivo con ID ${id} no encontrado`);
    }
    return objetivo;
  } catch (err) {
    console.error(`Error al buscar el objetivo por ID: ${err.message}`);
    throw err;
  }
}

module.exports = {
  crearObjetivo,
  actualizarObjetivo,
  desactivarObjetivo,
  listarObjetivosActivos,
  guardarObjetivos,
  buscarObjetivoPorId,
};
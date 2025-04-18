const Curso = require("../models/curso_model");
const Edicion = require("../models/edicion_model");

const Estudiante = require('../models/estudiante_model');

// Función asíncrona para crear ediciones
async function crearEdicion(body) {
  try {
   
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
  });

  // Asociar la edicion al curso correspondiente
  if (body.cursoId) {
    await Curso.findByIdAndUpdate(
        body.cursoId,
        { $push: { ediciones: edicion._id } }, // Agregar el certificado al array de certificados del estudiante
        { new: true }
    );
}

  return await edicion.save(); 
  } catch (error) {
    console.error('Error al crear la edicion (edicion_logic):', error);
    throw error;
  }
}

// Función asíncrona para actualizar ediciones
async function actualizarEdicion(id, body) {
  try {
    

  // Verificar si ya existe una edicion con el mismo título
  const edicionExistente = await Edicion.findOne({
    tituloEdicion: body.tituloEdicion, 
    _id: { $ne: id } // Excluir la edicion actual
  });
  if (edicionExistente) {
    throw new Error("La edición con este título ya existe");
  }

  let edicion = await Edicion.findByIdAndUpdate(
    id,
    {
      $set: {
        tituloEdicion: body.tituloEdicion,
        fechaInicioEdicion: body.fechaInicioEdicion,
        fechaFinEdicion: body.fechaFinEdicion,
        cursoId: body.cursoId,
      },
    },
    { new: true }
  );

  return edicion;
  } catch (error) {
    console.error('Error al actualizar la edicion (edicion_logic):', error);
    throw error;
  }
}

// Función asíncrona para inactivar ediciones
async function desactivarEdicion(id) {
  try {
    
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
  } catch (error) {
    console.error('Error al inactivar la edicion (edicion_logic):', error);
    throw error;
  }
}

// Función asíncrona para listar las ediciones activas
async function listarEdicionesActivas() {
  try {
    let ediciones = await Edicion.find({ estadoEdicion: true })
    .populate('cursoId');
    return ediciones;
  } catch (error) {
    console.error('Error al listar las ediciones (edicion_logic):', error);
    throw error;
  }
}

// Función asíncrona para buscar una edicion por su ID
async function buscarEdicionPorId(id) {
  try {
    const edicion = await Edicion.findById(id)
    .populate('cursoId')
    .populate('estudiantes');
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

const Colegio = require("../models/colegio_model");
const Estudiante = require('../models/estudiante_model');

// Función asíncrona para crear colegios
async function crearColegio(body) {
  // Verificar si ya existe un colegio con el mismo nombre
  const colegioExistente = await Colegio.findOne({
    nombreColegio: body.nombreColegio,
  });
  if (colegioExistente) {
    throw new Error("El colegio con este título ya existe");
  }

  let colegio = new Colegio({
    nombreColegio: body.nombreColegio,
    emailColegio: body.emailColegio,
    estadoColegio: body.estadoColegio,
    estudiantes: body.estudiantes,
  });

  return await colegio.save();
}

// Función asíncrona para actualizar colegios
async function actualizarColegio(id, body) {
  let colegios = await Colegio.findByIdAndUpdate(
    id,
    {
      $set: {
        nombreColegio: body.nombreColegio,
        emailColegio: body.emailColegio,
        estadoColegio: body.estadoColegio,
        estudiantes: body.estudiantes,
      },
    },
    { new: true }
  );

  return colegios;
}

// Función asíncrona para listar los colegio activos
async function listarColegios() {
  let colegios = await Colegio.find({ estadoColegio: true });
  return colegios;
}

// Función asíncrona para buscar un colegios por su ID
async function buscarColegiosPorId(id) {
  try {
    const colegio = await Colegio.findById(id);
    if (!colegio) {
      throw new Error(`Colegio con ID ${id} no encontrado`);
    }
    return colegio;
  } catch (err) {
    console.error(`Error al buscar el colegio por ID: ${err.message}`);
    throw err;
  }
}

// Función asíncrona para desactivar una brigada
async function desactivarColegio(id) {
  const colegio = await Colegio.findByIdAndUpdate(id, { estadoColegio: false }, { new: true });
  if (!colegio) {
      throw new Error(`Colegio con ID ${id} no encontrada`);
  }
  return colegio;
}

// Lógica para agregar estudiantes a un colegio
async function agregarEstudianteAColegio(colegioId, estudianteIds) {
  try {
      const colegio = await Colegio.findOne({ colegioId });
      if (!colegio) {
          throw new Error('Colegio no encontrado');
      }
      // Filtrar los estudiantes ya existentes para no duplicarlos
      const nuevosEstudiantes = estudianteIds.filter(estudianteId => !colegio.estudiantes.includes(estudianteId));
      // Agregar los nuevos estudiantes al array de estudiantes del colegio
      colegio.estudiantes = [...colegio.estudiantes, ...nuevosEstudiantes];
      await colegio.save();
      return colegio;
  } catch (error) {
      throw new Error(`Error al agregar estudiantes: ${error.message}`);
  }
}

module.exports = {
  crearColegio,
  desactivarColegio,
  actualizarColegio,
  listarColegios,
  buscarColegiosPorId,
  agregarEstudianteAColegio
};

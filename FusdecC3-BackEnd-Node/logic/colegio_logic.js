const Colegio = require("../models/colegio_model");

// Función asíncrona para crear colegios
async function crearColegio(body) {
  // Verificar si ya existe un colegio con el mismo nombre
  const colegioExistente = await Curso.findOne({
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
async function actualizarColegios(id, body) {
  let colegios = await Colegios.findByIdAndUpdate(
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

// Función asíncrona para listar los cursos activos
async function listarColegios() {
  let colegios = await Colegios.find({});
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

module.exports = {
  crearColegio,
  actualizarColegios,
  listarColegios,
  buscarColegiosPorId,
};

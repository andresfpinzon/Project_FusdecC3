const Colegio = require("../models/colegio_model");

// Función asíncrona para crear colegios
async function crearColegio(body) {
  try {
    
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
  });

  return await colegio.save();
  } catch (error) {
    console.error('Error al crear el colegio (colegio_logic):', error);
    throw error;
  }
}

// Función asíncrona para actualizar colegios
async function actualizarColegio(id, body) {
  try {
   // Verificar si ya existe un colegio con el mismo nombre
  const colegioExistente = await Colegio.findOne({
    nombreColegio: body.nombreColegio, 
    _id: { $ne: id } // Excluir el colegio actual
  });

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
  } catch (error) {
    console.error('Error al actualizar el colegio (colegio_logic):', error);
    throw error;
  }
}

// Función asíncrona para listar los colegio activos
async function listarColegios() {
  try {
  let colegios = await Colegio.find({ estadoColegio: true });
  return colegios; 
  } catch (error) {
    console.error('Error al listar los colegios (colegio_logic):', error);
    throw error;
  }
}

// Función asíncrona para buscar un colegios por su ID
async function buscarColegiosPorId(id) {
  try {
    const colegio = await Colegio.findById(id)
    .populate('estudiantes');
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
  try {
  const colegio = await Colegio.findByIdAndUpdate(id, { estadoColegio: false }, { new: true });
  if (!colegio) {
      throw new Error(`Colegio con ID ${id} no encontrada`);
  }
  return colegio; 
  } catch (error) {
    console.error('Error al desactivar el colegio (colegio_logic):', error);
    throw error;
  }
}


module.exports = {
  crearColegio,
  desactivarColegio,
  actualizarColegio,
  listarColegios,
  buscarColegiosPorId,
};

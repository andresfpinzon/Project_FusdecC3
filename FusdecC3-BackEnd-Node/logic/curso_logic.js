const Curso = require("../models/curso_model");

// Función asíncrona para crear cursos
async function crearCurso(body) {
  // Verificar si ya existe un curso con el mismo título
  const cursoExistente = await Curso.findOne({ nombreCurso: body.nombreCurso });
  if (cursoExistente) {
    throw new Error("El curso con este título ya existe");
  }

  let curso = new Curso({
    nombreCurso: body.nombreCurso,
    descripcionCurso: body.descripcionCurso,
    intensidadHorariaCurso: body.intensidadHorariaCurso,
    estadoCurso: body.estadoCurso,
    fundacionId: body.fundacionId,
    ediciones: body.ediciones,
  });

  return await curso.save();
};

// Función asíncrona para actualizar cursos
async function actualizarCurso(id, body) {
  // Verificar si ya existe un curso con el mismo título, excluyendo el curso actual
  const cursoExistente = await Curso.findOne({
    nombreCurso: body.nombreCurso,
    _id: { $ne: id }, // Excluir el curso actual
  });

  if (cursoExistente) {
    throw new Error("El curso con este título ya existe");
  }

  // Actualizar el curso
  const curso = await Curso.findByIdAndUpdate(
    id,
    {
      $set: {
        nombreCurso: body.nombreCurso,
        descripcionCurso: body.descripcionCurso,
        intensidadHorariaCurso: body.intensidadHorariaCurso,
      },
    },
    { new: true }
  );

  return curso;
}


// Función asíncrona para inactivar cursos
async function desactivarCurso(id) {
  let curso = await Curso.findByIdAndUpdate(
    id,
    {
      $set: {
        estadoCurso: false,
      },
    },
    { new: true }
  );

  return curso;
};

// Función asíncrona para listar los cursos activos
async function listarCursosActivos() {
  let cursos = await Curso.find({ estadoCurso: true })
  .populate('fundacionId')
  .populate('ediciones');
  return cursos;
};

// Función asíncrona para guardar una colección de cursos
async function guardarCursos(cursos) {
  try {
    const resultados = [];
    for (let cursoData of cursos) {
      // Verificar si ya existe un curso con el mismo título
      const cursoExistente = await Curso.findOne({
        nombreCurso: cursoData.nombreCurso 
      });
      if (!cursoExistente) {
        let nuevoCurso = new Curso(cursoData);
        let cursoGuardado = await nuevoCurso.save();
        resultados.push(cursoGuardado);
      } else {
        console.log(
          `El curso con título "${cursoData.nombreCurso}" ya existe.`
        );
      }
    }
    return resultados;
  } catch (err) {
    console.error("Error al guardar la colección de cursos:", err);
    throw err; // Re-lanza el error para manejarlo en la capa superior si es necesario
  }
};

// Función asíncrona para buscar un curso por su ID
async function buscarCursoPorId(id) {
  try {
    const curso = await Curso.findById(id)
    .populate('fundacionId')
    .populate('ediciones');
    if (!curso) {
      throw new Error(`Curso con ID ${id} no encontrado`);
    }
    return curso;
  } catch (err) {
    console.error(`Error al buscar el curso por ID: ${err.message}`);
    throw err;
  }
};

module.exports = {
  crearCurso,
  actualizarCurso,
  desactivarCurso,
  listarCursosActivos,
  guardarCursos,
  buscarCursoPorId,
};

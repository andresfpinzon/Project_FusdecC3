const Asistencia = require("../models/asistencia_model")
const Estudiante = require("../models/estudiante_model")

// Función asíncrona para crear una asistencia
async function crearAsistencia(body) {
  if (!body.tituloAsistencia || !body.fechaAsistencia || (!body.estudiantes && !body.inasistencias)) {
    throw new Error("Faltan campos requeridos: tituloAsistencia, fechaAsistencia, estudiantes o inasistencias")
  }

  let asistencia = new Asistencia({
    tituloAsistencia: body.tituloAsistencia,
    fechaAsistencia: body.fechaAsistencia,
    usuarioId: body.usuarioId,
    estadoAsistencia: true,
    estudiantes: body.estudiantes || [],
    inasistencias: body.inasistencias || [],
  })

  // Guardar la asistencia en la base de datos
  asistencia = await asistencia.save()

  // Actualizar los estudiantes seleccionados para agregar esta asistencia
  if (body.estudiantes && body.estudiantes.length > 0) {
    await Estudiante.updateMany({ _id: { $in: body.estudiantes } }, { $push: { asistencias: asistencia._id } })
  }

  // Actualizar los estudiantes seleccionados para agregar esta inasistencia
  if (body.inasistencias && body.inasistencias.length > 0) {
    await Estudiante.updateMany({ _id: { $in: body.inasistencias } }, { $push: { inasistencias: asistencia._id } })
  }

  return asistencia
}

// Función asíncrona para actualizar una asistencia
async function actualizarAsistencia(id, asistenciaData) {
  const asistencia = await Asistencia.findById(id)
  if (!asistencia) {
    throw new Error("Asistencia no encontrada")
  }

  // Actualizar los campos de la asistencia
  Object.assign(asistencia, asistenciaData)
  await asistencia.save()

  return asistencia
}

// Función asíncrona para listar las asistencias activas
async function listarAsistenciasActivas() {
  const asistencias = await Asistencia.find({ estadoAsistencia: true }).populate("estudiantes")
  return asistencias
}

// Función asíncrona para obtener una asistencia por su ID
async function obtenerAsistenciaPorId(id) {
  const asistencia = await Asistencia.findById(id).populate("estudiantes")
  if (!asistencia) {
    throw new Error("Asistencia no encontrada")
  }
  return asistencia
}

// Función asíncrona para desactivar una asistencia
async function desactivarAsistencia(id) {
  const asistencia = await Asistencia.findByIdAndUpdate(id, { estadoAsistencia: false }, { new: true })
  if (!asistencia) {
    throw new Error("Asistencia no encontrada")
  }
  return asistencia
}

module.exports = {
  crearAsistencia,
  actualizarAsistencia,
  listarAsistenciasActivas,
  obtenerAsistenciaPorId,
  desactivarAsistencia,
}


const Asistencia = require('../models/asistencia_model');
const Estudiante = require("../models/estudiante_model");

// Función asíncrona para crear una asistencia
async function crearAsistencia(body) {
    // Validar que el cuerpo tenga los campos necesarios
    if (!body.tituloAsistencia || !body.fechaAsistencia) {
        throw new Error('Faltan campos requeridos: tituloAsistencia o fechaAsistencia');
    }
    // Crear una nueva asistencia
    let asistencia = new Asistencia({
        tituloAsistencia: body.tituloAsistencia,
        fechaAsistencia: body.fechaAsistencia,
        usuarioId: body.usuarioId,
        estadoAsistencia: body.estadoAsistencia,
        estudiantes: body.estudiantes || [], // Se puede pasar un array de estudiantes
    });

     // Guardar la asistencia en la base de datos
    asistencia = await asistencia.save();

    // Actualizar los estudiantes seleccionados para agregar esta asistencia
    if (body.estudiantes && body.estudiantes.length > 0) {
        await Estudiante.updateMany(
        { _id: { $in: body.estudiantes } }, // Filtrar solo los estudiantes seleccionados
        { $push: { asistencias: asistencia._id } } // Agregar el ID de la asistencia al array
        );
    }
}

// Función asíncrona para actualizar una asistencia
async function actualizarAsistencia(id, body) {
    if (!id) {
        throw new Error('ID de asistencia es requerido');
    }
    let asistencia = await Asistencia.findById(id).populate('estudiantes');
    if (!asistencia) {
        throw new Error('Asistencia no encontrada');
    }

    // Obtener la lista de estudiantes originales
    const estudiantesOriginales = asistencia.estudiantes;

    // Actualizar los campos de la asistencia
    asistencia.tituloAsistencia = body.tituloAsistencia || asistencia.tituloAsistencia;
    asistencia.fechaAsistencia = body.fechaAsistencia || asistencia.fechaAsistencia;
    asistencia.usuarioId = body.usuarioId || asistencia.usuarioId;
    asistencia.estadoAsistencia = body.estadoAsistencia || asistencia.estadoAsistencia;
    asistencia.estudiantes = body.estudiantes || asistencia.estudiantes;

    // Guardar los cambios de la asistencia
    asistencia = await asistencia.save();

    // Remover el ID de la asistencia de los estudiantes originales
    await Estudiante.updateMany(
        { _id: { $in: estudiantesOriginales } },
        { $pull: { asistencias: asistencia._id } }
    );

    // Agregar el ID de la asistencia a los nuevos estudiantes
    if (body.estudiantes && body.estudiantes.length > 0) {
        await Estudiante.updateMany(
        { _id: { $in: body.estudiantes } },
        { $push: { asistencias: asistencia._id } }
        );
    }

    return asistencia;
}


// Función asíncrona para listar las asistencias activas
async function listarAsistenciasActivas() {
    let asistencias = await Asistencia.find({ estadoAsistencia: true })
    .populate('estudiantes');
    return asistencias;
}

// Función asíncrona para obtener una asistencia por su ID
async function obtenerAsistenciaPorId(id) {
    const asistencia = await Asistencia.findById(id)
    .populate('estudiantes');
    if (!asistencia) {
        throw new Error('Asistencia no encontrada');
    }
    return asistencia;
}

// Función asíncrona para eliminar una asistencia
async function desactivarAsistencia(id) {
    let asistencia = await Asistencia.findByIdAndUpdate(id, { estadoAsistencia: false }, { new: true });
    if (!asistencia) {
        throw new Error('Asistencia no encontrada');
    }
    return asistencia;
}

module.exports = {
    crearAsistencia,
    actualizarAsistencia,
    listarAsistenciasActivas,
    obtenerAsistenciaPorId,
    desactivarAsistencia, 
};

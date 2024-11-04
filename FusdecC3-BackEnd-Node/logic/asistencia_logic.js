const Asistencia = require('../models/asistencia_model');

// Función asíncrona para crear una asistencia
async function crearAsistencia(body) {
    // Crear una nueva asistencia
    let asistencia = new Asistencia({
        tituloAsistencia: body.tituloAsistencia,
        fechaAsistencia: body.fechaAsistencia,
        usuarioId: body.usuarioId,
        estadoAsistencia: body.estadoAsistencia,
        estudiantes: body.estudiantes || [], // Se puede pasar un array de estudiantes
    });

    return await asistencia.save();
}

// Función asíncrona para actualizar una asistencia
async function actualizarAsistencia(id, body) {
    let asistencia = await Asistencia.findById(id).populate('estudiantes');
    if (!asistencia) {
        throw new Error('Asistencia no encontrada');
    }

    asistencia.tituloAsistencia = body.tituloAsistencia || asistencia.tituloAsistencia;
    asistencia.fechaAsistencia = body.fechaAsistencia || asistencia.fechaAsistencia;
    asistencia.usuarioId = body.usuarioId || asistencia.usuarioId;
    asistencia.estadoAsistencia = body.estadoAsistencia || asistencia.estadoAsistencia;

    // Reemplaza completamente el array de estudiantes si se pasan estudiantes en el cuerpo
    if (body.estudiantes && body.estudiantes.length > 0) {
        asistencia.estudiantes = body.estudiantes;
    }

    await asistencia.save();
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

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
    let asistencia = await Asistencia.findById(id);
    if (!asistencia) {
        throw new Error('Asistencia no encontrada');
    }

    asistencia.tituloAsistencia = body.tituloAsistencia || asistencia.tituloAsistencia;
    asistencia.fechaAsistencia = body.fechaAsistencia || asistencia.fechaAsistencia;
    asistencia.usuarioId = body.usuarioId || asistencia.usuarioId;
    asistencia.estadoAsistencia = body.estadoAsistencia || asistencia.estadoAsistencia;

    // Si se pasan estudiantes, evitamos duplicados
    if (body.estudiantes && body.estudiantes.length > 0) {
        const nuevosEstudiantes = body.estudiantes.filter(estudianteId => !asistencia.estudiantes.includes(estudianteId));
        asistencia.estudiantes.push(...nuevosEstudiantes); 
    }

    await asistencia.save();
    return asistencia;
}

// Función asíncrona para listar las asistencias activas
async function listarAsistenciasActivas() {
    let asistencias = await Asistencia.find({ estadoAsistencia: true });
    return asistencias;
}

// Función asíncrona para obtener una asistencia por su ID
async function obtenerAsistenciaPorId(id) {
    const asistencia = await Asistencia.findById(id);
    if (!asistencia) {
        throw new Error('Asistencia no encontrada');
    }
    return asistencia;
}

// Función asíncrona para eliminar una asistencia
async function eliminarAsistencia(id) {
    const asistencia = await Asistencia.findByIdAndDelete(id);
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
    eliminarAsistencia, 
};

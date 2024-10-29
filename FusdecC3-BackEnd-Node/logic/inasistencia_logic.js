const Inasistencia = require('../models/inasistencia_model'); 

// Función asíncrona para crear una inasistencia
async function crearInasistencia(body) {
    // Crear una nueva inasistencia
    let inasistencia = new Inasistencia({
        tituloInasistencia: body.tituloInasistencia,
        observacion: body.observacion,
        usuarioId: body.usuarioId,
        asistenciaId: body.asistenciaId,
        estadoInasistencia: body.estadoInasistencia,
        estudiantes: body.estudiantes || [], // Se puede pasar un array de estudiantes
    });

    return await inasistencia.save();
}

// Función asíncrona para actualizar una inasistencia
async function actualizarInasistencia(id, body) {
    let inasistencia = await Inasistencia.findById(id);
    if (!inasistencia) {
        throw new Error('Inasistencia no encontrada');
    }

    inasistencia.tituloInasistencia = body.tituloInasistencia || inasistencia.tituloInasistencia;
    inasistencia.observacion = body.observacion || inasistencia.observacion;
    inasistencia.usuarioId = body.usuarioId || inasistencia.usuarioId;
    inasistencia.asistenciaId = body.asistenciaId || inasistencia.asistenciaId;
    inasistencia.estadoInasistencia = body.estadoInasistencia || inasistencia.estadoInasistencia;

    // Si se pasan estudiantes, evitamos duplicados
    if (body.estudiantes && body.estudiantes.length > 0) {
        inasistencia.estudiantes = body.estudiantes;
    }

    await inasistencia.save();
    return inasistencia;
}

// Función asíncrona para listar todas las inasistencias
async function listarInasistencias() {
    return await Inasistencia.find({})
    .populate('asistenciaId')
    .populate('estudiantes');
}

// Función asíncrona para obtener una inasistencia por su ID
async function obtenerInasistenciaPorId(id) {
    const inasistencia = await Inasistencia.findById(id)
    .populate('asistenciaId')
    .populate('estudiantes');
    if (!inasistencia) {
        throw new Error('Inasistencia no encontrada');
    }
    return inasistencia;
}


// Función asíncrona para eliminar una inasistencia
async function desactivarInasistencia(id) {
    let inasistencia = await Inasistencia.findByIdAndUpdate(id, { estadoInasistencia: false }, { new: true });
    if (!inasistencia) {
        throw new Error('Asistencia no encontrada');
    }
    return inasistencia;
}


module.exports = {
    crearInasistencia,
    actualizarInasistencia,
    listarInasistencias,
    obtenerInasistenciaPorId,
    desactivarInasistencia,
};

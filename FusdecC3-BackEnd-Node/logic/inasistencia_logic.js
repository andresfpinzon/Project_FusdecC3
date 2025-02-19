const Inasistencia = require('../models/inasistencia_model'); 
const Estudiante = require('../models/estudiante_model');

// Función asíncrona para crear una inasistencia
async function crearInasistencia(body) {
    try {
        // Crear una nueva inasistencia
    let inasistencia = new Inasistencia({
        tituloInasistencia: body.tituloInasistencia,
        observacion: body.observacion,
        usuarioId: body.usuarioId,
        asistenciaId: body.asistenciaId,
        estadoInasistencia: body.estadoInasistencia,
        estudiantes: body.estudiantes || [], // Se puede pasar un array de estudiantes
    });

    inasistencia = await inasistencia.save();

    // Actualizar los estudiantes seleccionados para agregar esta inaasistencia
    if (body.estudiantes && body.estudiantes.length > 0) {
        await Estudiante.updateMany(
        { _id: { $in: body.estudiantes } }, // Filtrar solo los estudiantes seleccionados
        { $push: { inasistencias: inasistencia._id } } // Agregar el ID de la inaasistencia al array
        );
    }

    return inasistencia;
    } catch (error) {
        console.error('Error al crear la inasistencia (inasistencia_logic):', error);
        throw error;
    }
    
}

// Función asíncrona para actualizar una inasistencia
async function actualizarInasistencia(id, body) {
    try {
       
    let inasistencia = await Inasistencia.findById(id);
    if (!inasistencia) {
        throw new Error('Inasistencia no encontrada');
    }

    // Obtener la lista de estudiantes originales
    const estudiantesOriginales = inasistencia.estudiantes;


    inasistencia.tituloInasistencia = body.tituloInasistencia || inasistencia.tituloInasistencia;
    inasistencia.observacion = body.observacion || inasistencia.observacion;
    inasistencia.usuarioId = body.usuarioId || inasistencia.usuarioId;
    inasistencia.asistenciaId = body.asistenciaId || inasistencia.asistenciaId;
    inasistencia.estadoInasistencia = body.estadoInasistencia || inasistencia.estadoInasistencia;
    inasistencia.estudiantes = body.estudiantes || inasistencia.estudiantes;

    // Guardar los cambios de la asistencia
    inasistencia = await inasistencia.save();

    // Remover el ID de la asistencia de los estudiantes originales
    await Estudiante.updateMany(
        { _id: { $in: estudiantesOriginales } },
        { $pull: { inasistencia: inasistencia._id } }
    );

    // Agregar el ID de la asistencia a los nuevos estudiantes
    if (body.estudiantes && body.estudiantes.length > 0) {
        await Estudiante.updateMany(
        { _id: { $in: body.estudiantes } },
        { $push: { inasistencias: inasistencia._id } }
        );
    }


    return inasistencia; 
    } catch (error) {
        console.error('Error al actualizar la inasistencia (inasistencia_logic):', error);
        throw error;
    }
}

// Función asíncrona para listar todas las inasistencias
async function listarInasistencias() {
    try {
    return await Inasistencia.find().populate('asistenciaId').populate('estudiantes');
    } catch (error) {
        console.error('Error al listar las inasistencias (inasistencia_logic):', error);
        throw error;
    }
}

// Función asíncrona para obtener una inasistencia por su ID
async function obtenerInasistenciaPorId(id) {
    try {
        const inasistencia = await Inasistencia.findById(id)
    .populate('asistenciaId')
    .populate('estudiantes');
    if (!inasistencia) {
        throw new Error('Inasistencia no encontrada');
    }
    return inasistencia;
    } catch (error) {
        console.error('Error al obtener la inasistencia (inasistencia_logic):', error);
        throw error;       
    }
}


// Función asíncrona para eliminar una inasistencia
async function desactivarInasistencia(id) {
    try {
        let inasistencia = await Inasistencia.findByIdAndUpdate(id, { estadoInasistencia: false }, { new: true });
    if (!inasistencia) {
        throw new Error('Asistencia no encontrada');
    }
    return inasistencia;
    } catch (error) {
        console.error('Error al desactivar la inasistencia (inasistencia_logic):', error);
        throw error;
    }
}


module.exports = {
    crearInasistencia,
    actualizarInasistencia,
    listarInasistencias,
    obtenerInasistenciaPorId,
    desactivarInasistencia,
};

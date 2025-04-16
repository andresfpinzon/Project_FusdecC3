const Asistencia = require("../models/asistencia_model");
const Estudiante = require("../models/estudiante_model");

// Función asíncrona para crear una asistencia
async function crearAsistencia(body) {
    try {
        if (!body.tituloAsistencia || !body.fechaAsistencia || !body.estudiantes) {
            throw new Error("Faltan campos requeridos: tituloAsistencia, fechaAsistencia, estudiantes");
        }

        // Crear una nueva asistencia
        let asistencia = new Asistencia({
            tituloAsistencia: body.tituloAsistencia,
            fechaAsistencia: body.fechaAsistencia,
            usuarioId: body.usuarioId,
            estadoAsistencia: body.estadoAsistencia || true,
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

        return asistencia;
    } catch (error) {
        console.error('Error al crear la asistencia (asistencia_logic):', error);
        throw error;
    }
}

// Función asíncrona para actualizar una asistencia
async function actualizarAsistencia(id, body) {
    try {
        let asistencia = await Asistencia.findById(id).populate('estudiantes');
        if (!asistencia) {
            throw new Error('Asistencia no encontrada');
        }

        // Guardar los IDs de los estudiantes originales antes de actualizar
        const estudiantesOriginales = asistencia.estudiantes.map(estudiante => estudiante._id);

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
    } catch (error) {
        console.error('Error al actualizar la asistencia (asistencia_logic):', error);
        throw error;
    }
}

// Función asíncrona para listar las asistencias activas
async function listarAsistenciasActivas() {
    try {
        let asistencias = await Asistencia.find({ estadoAsistencia: true }).populate('estudiantes');
        return asistencias;
    } catch (error) {
        console.error('Error al listar las asistencias (asistencia_logic):', error);
        throw error;
    }
}

// Función asíncrona para obtener una asistencia por su ID
async function obtenerAsistenciaPorId(id) {
    try {
        const asistencia = await Asistencia.findById(id)
            .populate('estudiantes');
        if (!asistencia) {
            throw new Error('Asistencia no encontrada');
        }
        return asistencia;
    } catch (error) {
        console.error('Error al obtener la asistencia por ID (asistencia_logic):', error);
        throw error;
    }
}

// Función asíncrona para desactivar una asistencia
async function desactivarAsistencia(id) {
    try {
        let asistencia = await Asistencia.findByIdAndUpdate(id, { estadoAsistencia: false }, { new: true });
        if (!asistencia) {
            throw new Error('Asistencia no encontrada');
        }
        return asistencia;
    } catch (error) {
        console.error('Error al desactivar la asistencia (asistencia_logic):', error);
        throw error;
    }
}

module.exports = {
    crearAsistencia,
    actualizarAsistencia,
    listarAsistenciasActivas,
    obtenerAsistenciaPorId,
    desactivarAsistencia,
};

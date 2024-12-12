const Unidad = require('../models/unidad_model');
const Brigada = require('../models/brigada_model');
const Usuario = require('../models/usuario_model');
const unidadSchemaValidation = require('../validations/unidad_validations');

// Función asíncrona para crear unidades
async function crearUnidad(data) {
    const nuevaUnidad = new Unidad(data);
    await nuevaUnidad.save();

    // Actualizar brigada con la nueva unidad
    if (body.brigadaId) {
        await Brigada.findByIdAndUpdate(
            body.brigadaId,
            { $push: { unidades: nuevaUnidad._id } },
            { new: true } // Retorna el documento actualizado
        );
    }

    return nuevaUnidad;
}

// Función asíncrona para listar unidades
async function listarUnidades() {
    return await Unidad.find()
        .populate('brigadaId') // Asegúrate de que esto esté poblado
        .populate('usuarioId') // Asegúrate de que esto esté poblado
        .populate('estudiantes'); // Asegúrate de que esto esté poblado
}

async function editarUnidad(id, body) {
    // Buscar la unidad por ID
    let unidad = await Unidad.findById(id);
    if (!unidad) {
        throw new Error(`Unidad con ID ${id} no encontrada`);
    }

    // Verificar que el brigadaId no esté en uso por otra unidad
    const unidadExistente = await Unidad.findOne({
        nombreUnidad: body.nombreUnidad,
        _id: { $ne: id }
    });
    if (unidadExistente) {
        throw new Error("La brigada ya tiene una unidad registrada con ese ID");
    }

    // Guardar el brigada original
    const brigadaOriginalId = unidad.brigadaId;

    // Actualizar los campos de la unidad
    unidad.nombreUnidad = body.nombreUnidad || unidad.nombreUnidad;
    unidad.estadoUnidad = body.estadoUnidad !== undefined ? body.estadoUnidad : unidad.estadoUnidad;
    unidad.brigadaId = body.brigadaId || unidad.brigadaId;
    unidad.usuarioId = body.usuarioId || unidad.usuarioId;

    // Guardar los cambios en la unidad
    await unidad.save();

    // Actualizar relaciones: Brigada
    if (brigadaOriginalId && brigadaOriginalId.toString() !== body.brigadaId) {
        // Eliminar la unidad de la brigada anterior
        await Brigada.findByIdAndUpdate(
            brigadaOriginalId,
            { $pull: { unidades: unidad._id } }
        );
    }
    
    if (body.brigadaId && brigadaOriginalId.toString() !== body.brigadaId) {
        // Agregar la unidad a la nueva brigada
        await Brigada.findByIdAndUpdate(
            body.brigadaId,
            { $push: { unidades: unidad._id } }
        );
    }

    return unidad;
}


// Función asíncrona para desactivar una unidad
async function desactivarUnidad(id) {
    const unidad = await Unidad.findByIdAndUpdate(id, { estadoUnidad: false }, { new: true });
    if (!unidad) {
        throw new Error(`Unidad con ID ${id} no encontrada`);
    }
    return unidad;
}

// Función asíncrona para buscar una unidad por su ID
async function buscarUnidadPorId(id) {
    return await Unidad.findById(id)
        .populate('brigadaId') // Poblamos la brigada
        .populate('usuarioId') // Poblamos el usuario
        .populate('estudiantes'); // Poblamos los estudiantes
}

// Función asíncrona para buscar unidades por brigadaId
async function buscarUnidadesPorBrigadaId(brigadaId) {
    const unidades = await Unidad.find({ brigadaId })
        .populate('brigadaId')
        .populate('usuarioId')
        .populate('estudiantes');
    if (unidades.length === 0) {
        throw new Error(`No se encontraron unidades para la brigada con ID ${brigadaId}`);
    }
    return unidades;
}

// Función asíncrona para buscar unidades por usuarioId
async function buscarUnidadesPorUsuarioId(usuarioId) {
    const unidades = await Unidad.find({ usuarioId })
        .populate('brigadaId')
        .populate('usuarioId')
        .populate('estudiantes');
    if (unidades.length === 0) {
        throw new Error(`No se encontraron unidades para el usuario con ID ${usuarioId}`);
    }
    return unidades;
}

module.exports = {
    crearUnidad,
    listarUnidades,
    buscarUnidadPorId,
    buscarUnidadesPorBrigadaId,
    buscarUnidadesPorUsuarioId,
    editarUnidad,
    desactivarUnidad 
};

const Unidad = require('../models/unidad_model');
const Brigada = require('../models/brigada_model');
const Usuario = require('../models/usuario_model');
const unidadSchemaValidation = require('../validations/unidad_validations');

// Función asíncrona para crear unidades
async function crearUnidad(data) {
    try {
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
    } catch (error) {
        console.error('Error al crear la unidad (unidad_logic):', error);    
        throw error;
    }
}

// Función asíncrona para listar unidades
async function listarUnidades() {
    try {
    return await Unidad.find()
    .populate('brigadaId') // Asegúrate de que esto esté poblado
    .populate('usuarioId') // Asegúrate de que esto esté poblado
    .populate('estudiantes'); // Asegúrate de que esto esté poblado
    } catch (error) {
        console.error('Error al listar las unidades (unidad_logic):', error);
        throw error;
    }
}

async function editarUnidad(id, body) {
    try {
     
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
    } catch (error) {
        console.error('Error al editar la unidad (unidad_logic):', error);
        throw error;
    }
}


// Función asíncrona para desactivar una unidad
async function desactivarUnidad(id) {
    try {
     
    const unidad = await Unidad.findByIdAndUpdate(id, { estadoUnidad: false }, { new: true });
    if (!unidad) {
        throw new Error(`Unidad con ID ${id} no encontrada`);
    }
    return unidad;   
    } catch (error) {
        console.error('Error al desactivar la unidad (unidad_logic):', error);
        throw error;
    }
}

// Función asíncrona para buscar una unidad por su ID
async function buscarUnidadPorId(id) {
    try {
    return await Unidad.findById(id)
    .populate('brigadaId') // Poblamos la brigada
    .populate('usuarioId') // Poblamos el usuario
    .populate('estudiantes'); // Poblamos los estudiantes   
    } catch (error) {
        console.error('Error al buscar la unidad por ID (unidad_logic):', error);
        throw error;
    }
}

// Función asíncrona para buscar unidades por brigadaId
async function buscarUnidadesPorBrigadaId(brigadaId) {
    try {
     
    const unidades = await Unidad.find({ brigadaId })
    .populate('brigadaId')
    .populate('usuarioId')
    .populate('estudiantes');
    if (unidades.length === 0) {
        throw new Error(`No se encontraron unidades para la brigada con ID ${brigadaId}`);
    }
    return unidades;   
    } catch (error) {
        console.error('Error al buscar unidades por brigadaId (unidad_logic):', error);
        throw error;
    }
}

// Función asíncrona para buscar unidades por usuarioId
async function buscarUnidadesPorUsuarioId(usuarioId) {
    try {
        
    const unidades = await Unidad.find({ usuarioId })
    .populate('brigadaId')
    .populate('usuarioId')
    .populate('estudiantes');
    if (unidades.length === 0) {
        throw new Error(`No se encontraron unidades para el usuario con ID ${usuarioId}`);
    }
    return unidades;
    } catch (error) {
        console.error('Error al buscar unidades por usuarioId (unidad_logic):', error);
        throw error;   
    }
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

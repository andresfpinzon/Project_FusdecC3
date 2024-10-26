const Unidad = require('../models/unidad_model');
const Brigada = require('../models/brigada_model');
const Usuario = require('../models/usuario_model');
const unidadSchemaValidation = require('../validations/unidad_validations');

// Función asíncrona para crear unidades
async function crearUnidad(data) {
    const nuevaUnidad = new Unidad(data);
    return await nuevaUnidad.save();
}

// Función asíncrona para listar unidades
async function listarUnidades() {
    return await Unidad.find()
        .populate('brigadaId') // Asegúrate de que esto esté poblado
        .populate('usuarioId') // Asegúrate de que esto esté poblado
        .populate('estudiantes'); // Asegúrate de que esto esté poblado
}

// Función asíncrona para editar una unidad
async function editarUnidad(id, body) {
    const unidad = await Unidad.findByIdAndUpdate(id, body, { new: true })
        .populate('brigadaId')
        .populate('usuarioId')
        .populate('estudiantes');
    if (!unidad) {
        throw new Error(`Unidad con ID ${id} no encontrada`);
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

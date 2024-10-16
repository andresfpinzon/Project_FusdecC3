const Brigada = require('../models/brigada_model');

// Función asíncrona para crear brigadas
async function crearBrigada(body) {
    const brigada = new Brigada({
        nombreBrigada: body.nombreBrigada,
        ubicacionBrigada: body.ubicacionBrigada,
        estadoBrigada: body.estadoBrigada,
        comandoId: body.comandoId,
        unidades: body.unidades || [] // Asegurarse de que unidades sea un array
    });
    return await brigada.save();
}

// Función asíncrona para listar brigadas
async function listarBrigadas() {
    let brigadas = await Brigada.find().populate('comandoId').populate('unidades');
    return brigadas;
}

// Función asíncrona para buscar una brigada por su ID
async function buscarBrigadaPorId(id) {
    const brigada = await Brigada.findById(id).populate('comandoId').populate('unidades');
    if (!brigada) {
        throw new Error(`Brigada con ID ${id} no encontrada`);
    }
    return brigada;
}

// Función asíncrona para editar una brigada
async function editarBrigada(id, body) {
    const brigada = await Brigada.findByIdAndUpdate(id, body, { new: true }).populate('comandoId').populate('unidades');
    if (!brigada) {
        throw new Error(`Brigada con ID ${id} no encontrada`);
    }
    return brigada;
}

// Función asíncrona para desactivar una brigada
async function desactivarBrigada(id) {
    const brigada = await Brigada.findByIdAndUpdate(id, { /* no se actualiza el estado */ }, { new: true });
    if (!brigada) {
        throw new Error(`Brigada con ID ${id} no encontrada`);
    }
    return brigada;
}

// Función asíncrona para buscar brigadas por comandoId
async function buscarBrigadasPorComandoId(comandoId) {
    const brigadas = await Brigada.find({ comandoId }).populate('comandoId').populate('unidades');
    if (brigadas.length === 0) {
        throw new Error(`No se encontraron brigadas para el comando con ID ${comandoId}`);
    }
    return brigadas;
}

// Función asíncrona para buscar brigadas por unidad
async function buscarBrigadasPorUnidadId(unidadId) {
    const brigadas = await Brigada.find({ unidades: unidadId }).populate('comandoId').populate('unidades');
    if (brigadas.length === 0) {
        throw new Error(`No se encontraron brigadas para la unidad con ID ${unidadId}`);
    }
    return brigadas;
}

module.exports = {
    crearBrigada,
    listarBrigadas,
    editarBrigada,
    desactivarBrigada, 
    buscarBrigadaPorId,
    buscarBrigadasPorComandoId,
    buscarBrigadasPorUnidadId
};
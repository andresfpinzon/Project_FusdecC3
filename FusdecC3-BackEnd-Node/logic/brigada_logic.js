const Brigada = require('../models/brigada_model');

// Función asíncrona para crear brigadas
async function crearBrigada(body) {
    // Verificar si ya existe una brigada con el mismo nombre y comando
    const brigadaExistente = await Brigada.findOne({
        nombreBrigada: body.nombreBrigada,
        comandoId: body.comandoId
    });

    if (brigadaExistente) {
        throw new Error(`Ya existe una brigada con el nombre "${body.nombreBrigada}" para el comando con ID ${body.comandoId}`);
    }

    const brigada = new Brigada({
        nombreBrigada: body.nombreBrigada,
        ubicacionBrigada: body.ubicacionBrigada,
        estadoBrigada: body.estadoBrigada,
        comandoId: body.comandoId, // Asegúrate de que esto esté presente
        unidades: body.unidades || [] 
    });
    return await brigada.save();
}

// Función asíncrona para listar brigadas
async function listarBrigadas() {
    return await Brigada.find()
        .populate('unidades')
        .populate('comandoId');
}

// Función asíncrona para buscar una brigada por su ID
async function buscarBrigadaPorId(id) {
    return await Brigada.findById(id)
        .populate('comandoId')
        .populate('unidades');
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
    const brigada = await Brigada.findByIdAndUpdate(id, { estadoBrigada: false }, { new: true });
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

// Lógica para agregar unidades a una brigada
async function agregarUnidadesAbrigada(brigadaId, unidadIds) {
    try {
        const brigada = await Brigada.findById(brigadaId); // Cambiado a findById
        if (!brigada) {
            throw new Error('Brigada no encontrada');
        }
        // Filtrar las unidades ya existentes para no duplicarlas
        const nuevasUnidades = unidadIds.filter(unidadId => !brigada.unidades.includes(unidadId));
        // Agregar las nuevas unidades al array de unidades de la brigada
        brigada.unidades = [...brigada.unidades, ...nuevasUnidades];
        await brigada.save();
        return brigada;
    } catch (error) {
        throw new Error(`Error al agregar unidades: ${error.message}`);
    }
}

module.exports = {
    crearBrigada,
    listarBrigadas,
    editarBrigada,
    desactivarBrigada, 
    buscarBrigadaPorId,
    buscarBrigadasPorComandoId,
    buscarBrigadasPorUnidadId,
    agregarUnidadesAbrigada
};

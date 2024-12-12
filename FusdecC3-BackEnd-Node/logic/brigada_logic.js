const Brigada = require('../models/brigada_model');
const Comando = require('../models/comando_model');

// Función asíncrona para crear brigadas
async function crearBrigada(body) {
    // Verificar si ya existe una brigada con el mismo nombre y comando
    const brigadaExistente = await Brigada.findOne({
        nombreBrigada: body.nombreBrigada
    });

    if (brigadaExistente) {
        throw new Error(`Ya existe una brigada con el nombre "${body.nombreBrigada}" para el comando con ID ${body.comandoId}`);
    }

    // Crear la nueva brigada
    const brigada = new Brigada({
        nombreBrigada: body.nombreBrigada,
        ubicacionBrigada: body.ubicacionBrigada,
        estadoBrigada: body.estadoBrigada,
        comandoId: body.comandoId, // Asegúrate de que esto esté presente
        unidades: body.unidades || []
    });

    // Guardar la brigada
    const nuevaBrigada = await brigada.save();

    // Agregar la brigada al comando correspondiente
    await Comando.findByIdAndUpdate(
        body.comandoId,
        { $push: { brigadas: nuevaBrigada._id } }
    );

    return nuevaBrigada;
}

// Función asíncrona para listar brigadas activas
async function listarBrigadas() {
    return await Brigada.find({ estadoBrigada: true }) 
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
    // Buscar la brigada existente
    const brigada = await Brigada.findById(id);
    if (!brigada) {
        throw new Error(`Brigada con ID ${id} no encontrada`);
    }

    // Guardar el comando original
    const comandoOriginalId = brigada.comandoId;

    // Actualizar la brigada
    brigada.nombreBrigada = body.nombreBrigada || brigada.nombreBrigada;
    brigada.ubicacionBrigada = body.ubicacionBrigada || brigada.ubicacionBrigada;
    brigada.estadoBrigada = body.estadoBrigada !== undefined ? body.estadoBrigada : brigada.estadoBrigada;
    brigada.comandoId = body.comandoId || brigada.comandoId;
    brigada.unidades = body.unidades || brigada.unidades;

    // Guardar los cambios
    const brigadaActualizada = await brigada.save();

    // Actualizar el comando si cambió
    if (comandoOriginalId.toString() !== body.comandoId) {
        // Remover del comando anterior
        await Comando.findByIdAndUpdate(
            comandoOriginalId,
            { $pull: { brigadas: id } }
        );

        // Agregar al nuevo comando
        await Comando.findByIdAndUpdate(
            body.comandoId,
            { $push: { brigadas: id } }
        );
    }

    return brigadaActualizada;
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

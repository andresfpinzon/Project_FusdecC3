const Brigada = require('../models/brigada_model');
const Comando = require('../models/comando_model');

// Función asíncrona para crear brigadas
async function crearBrigada(body) {
    try {
        // Verificar si ya existe una brigada con el mismo nombre y comando
        const brigadaExistente = await Brigada.findOne({
            nombreBrigada: body.nombreBrigada
        });

        if (brigadaExistente) {
            throw new Error('Ya existe una brigada con este nombre');
        }

        // Crear la nueva brigada
        const brigada = new Brigada({
            nombreBrigada: body.nombreBrigada,
            ubicacionBrigada: body.ubicacionBrigada,
            estadoBrigada: body.estadoBrigada !== undefined ? body.estadoBrigada : true,
            comandoId: body.comandoId || null,
            horario: body.horario || 'mañana',
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
    } catch (error) {
        console.error('Error al crear la brigada:', error);
        throw error;
    }
}

// Función asíncrona para listar brigadas activas
async function listarBrigadas() {
    return await Brigada.find({ estadoBrigada: true })
        .populate({
            path: 'comandoId',
            select: 'nombreComando' // Only fetch the command name
        });
}

// Función asíncrona para buscar una brigada por su ID
async function buscarBrigadaPorId(id) {
    return await Brigada.findById(id)
        .populate('comandoId')
        .populate('unidades');
}

// Función asíncrona para editar una brigada
async function editarBrigada(id, body) {
    try {
        // Buscar la brigada existente
        const brigada = await Brigada.findById(id);
        if (!brigada) {
            throw new Error(`Brigada con ID ${id} no encontrada`);
        }

        // Guardar el comando original
        const comandoOriginalId = brigada.comandoId;

        // Actualizar la brigada
        if (body.nombreBrigada) brigada.nombreBrigada = body.nombreBrigada;
        if (body.estadoBrigada !== undefined) brigada.estadoBrigada = body.estadoBrigada;
        if (body.comandoId) brigada.comandoId = body.comandoId;
        if (body.ubicacionBrigada) brigada.ubicacionBrigada = body.ubicacionBrigada;
        if (body.horario) brigada.horario = body.horario;
        if (body.unidades) brigada.unidades = body.unidades;

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
    } catch (error) {
        console.error('Error al editar la brigada:', error);
        throw error;
    }
}

// Función asíncrona para desactivar una brigada
async function desactivarBrigada(id) {
    try {
        const brigada = await Brigada.findByIdAndUpdate(id, { estadoBrigada: false }, { new: true });
        if (!brigada) {
            throw new Error(`Brigada con ID ${id} no encontrada`);
        }
        return brigada;   
    } catch (error) {
        console.error('Error al desactivar la brigada:', error);
        throw error;
    }
}

// Función asíncrona para buscar brigadas por comandoId
async function buscarBrigadasPorComandoId(comandoId) {
    try {
        const brigadas = await Brigada.find({ comandoId }).populate('comandoId').populate('unidades');
        if (brigadas.length === 0) {
            throw new Error(`No se encontraron brigadas para el comando con ID ${comandoId}`);
        }
        return brigadas;   
    } catch (error) {
        console.error('Error al buscar las brigadas por comando:', error);
        throw error;
    }
}

// Función asíncrona para buscar brigadas por unidad
async function buscarBrigadasPorUnidadId(unidadId) {
    try {
        const brigadas = await Brigada.find({ unidades: unidadId }).populate('comandoId').populate('unidades');
        if (brigadas.length === 0) {
            throw new Error(`No se encontraron brigadas para la unidad con ID ${unidadId}`);
        }
        return brigadas;   
    } catch (error) {
        console.error('Error al buscar las brigadas por unidad:', error);
        throw error;
    }
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

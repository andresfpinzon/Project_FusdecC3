const logic = require('../logic/brigada_logic');
const brigadaSchemaValidation = require('../validations/brigada_validations');

// Controlador para listar brigadas
const listarBrigadas = async (_req, res) => {
    try {
        const brigadas = await logic.listarBrigadas();
        if (brigadas.length === 0) {
            return res.status(204).send(); // 204 No Content
        }
        res.json(brigadas);
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor', details: err.message });
    }
};

// Controlador para crear una brigada
const crearBrigada = async (req, res) => {
    const { error, value } = brigadaSchemaValidation.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    try {
        const nuevaBrigada = await logic.crearBrigada(value);
        res.status(201).json(nuevaBrigada);
    } catch (err) {
        // Manejo de errores específicos
        if (err.message.includes('Ya existe una brigada')) {
            return res.status(409).json({ error: err.message }); // 409 Conflict
        }
        res.status(500).json({ error: 'Error interno del servidor', details: err.message });
    }
};

// Controlador para actualizar una brigada
const actualizarBrigada = async (req, res) => {
    const { id } = req.params;
    const { error, value } = brigadaSchemaValidation.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    try {
        const brigadaActualizada = await logic.editarBrigada(id, value);
        if (!brigadaActualizada) {
            return res.status(404).json({ error: 'Brigada no encontrada' });
        }
        res.json(brigadaActualizada);
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor', details: err.message });
    }
};

// Controlador para desactivar una brigada
const desactivarBrigada = async (req, res) => {
    const { id } = req.params;
    try {
        const brigadaDesactivada = await logic.desactivarBrigada(id);
        if (!brigadaDesactivada) {
            return res.status(404).json({ error: 'Brigada no encontrada' });
        }
        res.json(brigadaDesactivada);
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor', details: err.message });
    }
};

// Controlador para obtener una brigada por su ID
const obtenerBrigadaPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const brigada = await logic.buscarBrigadaPorId(id);
        if (!brigada) {
            return res.status(404).json({ error: `Brigada con ID ${id} no encontrada` });
        }
        res.json(brigada);
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor al buscar la brigada', details: err.message });
    }
};

// Controlador para buscar brigadas por comandoId
const buscarBrigadasPorComandoId = async (req, res) => {
    const { comandoId } = req.params;
    try {
        const brigadas = await logic.buscarBrigadasPorComandoId(comandoId);
        if (!brigadas || brigadas.length === 0) {
            return res.status(404).json({ error: `No se encontraron brigadas para el comando con ID ${comandoId}` });
        }
        res.json(brigadas);
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor al buscar brigadas por comando', details: err.message });
    }
};

// Controlador para buscar brigadas por unidadId
const buscarBrigadasPorUnidadId = async (req, res) => {
    const { unidadId } = req.params;
    try {
        const brigadas = await logic.buscarBrigadasPorUnidadId(unidadId);
        if (!brigadas || brigadas.length === 0) {
            return res.status(404).json({ error: `No se encontraron brigadas para la unidad con ID ${unidadId}` });
        }
        res.json(brigadas);
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor al buscar brigadas por unidad', details: err.message });
    }
};

// Controlador para agregar unidades a una brigada
const agregarunidades = async (req, res) => {
    const { id } = req.params; // Cambiado a id
    const { unidadIds } = req.body; // Extraer unidadIds del cuerpo de la solicitud

    // Validar que unidadIds sea un array y no esté vacío
    if (!Array.isArray(unidadIds) || unidadIds.length === 0) {
        return res.status(400).json({ error: 'Se requiere un array de IDs de unidades' });
    }

    try {
        const brigadaActualizada = await logic.agregarUnidadesAbrigada(id, unidadIds); // Llamar a la lógica para agregar unidades
        return res.status(200).json({
            message: 'Unidades agregadas con éxito',
            brigada: brigadaActualizada // Devolver la brigada actualizada
        });
    } catch (error) {
        return res.status(500).json({ error: error.message }); // Manejo de errores
    }
};

// Exportar los controladores
module.exports = {
    listarBrigadas,
    crearBrigada,
    actualizarBrigada,
    desactivarBrigada,
    obtenerBrigadaPorId,
    buscarBrigadasPorComandoId,
    buscarBrigadasPorUnidadId,
    agregarunidades
};

const logic = require('../logic/unidad_logic');
const unidadSchemaValidation = require('../validations/unidad_validations');

// Controlador para listar unidades
const listarUnidades = async (_req, res) => {
    try {
        const unidades = await logic.listarUnidades();
        if (unidades.length === 0) {
            return res.status(204).send(); // 204 No Content
        }
        res.json(unidades);
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor', details: err.message });
    }
};

// Controlador para crear una unidad
const crearUnidad = async (req, res) => {
    const { error, value } = unidadSchemaValidation.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    try {
        const nuevaUnidad = await logic.crearUnidad(value);
        res.status(201).json(nuevaUnidad);
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor', details: err.message });
    }
};

// Controlador para actualizar una unidad
const actualizarUnidad = async (req, res) => {
    const { id } = req.params;
    const { error, value } = unidadSchemaValidation.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    try {
        const unidadActualizada = await logic.editarUnidad(id, value);
        if (!unidadActualizada) {
            return res.status(404).json({ error: 'Unidad no encontrada' });
        }
        res.json(unidadActualizada);
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor', details: err.message });
    }
};

// Controlador para desactivar una unidad
const desactivarUnidad = async (req, res) => {
    const { id } = req.params;
    try {
        const unidadDesactivada = await logic.desactivarUnidad(id);
        if (!unidadDesactivada) {
            return res.status(404).json({ error: 'Unidad no encontrada' });
        }
        res.json(unidadDesactivada);
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor', details: err.message });
    }
};

// Controlador para obtener una unidad por su ID
const obtenerUnidadPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const unidad = await logic.buscarUnidadPorId(id);
        if (!unidad) {
            return res.status(404).json({ error: `Unidad con ID ${id} no encontrada` });
        }
        res.json(unidad);
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor al buscar la unidad', details: err.message });
    }
};

// Controlador para buscar unidades por brigadaId
const buscarUnidadesPorBrigadaId = async (req, res) => {
    const { brigadaId } = req.params;
    try {
        const unidades = await logic.buscarUnidadesPorBrigadaId(brigadaId);
        if (!unidades || unidades.length === 0) {
            return res.status(404).json({ error: `No se encontraron unidades para la brigada con ID ${brigadaId}` });
        }
        res.json(unidades);
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor al buscar unidades por brigada', details: err.message });
    }
};

// Controlador para buscar unidades por usuarioId
const buscarUnidadesPorUsuarioId = async (req, res) => {
    const { usuarioId } = req.params;
    try {
        const unidades = await logic.buscarUnidadesPorUsuarioId(usuarioId);
        if (!unidades || unidades.length === 0) {
            return res.status(404).json({ error: `No se encontraron unidades para el usuario con ID ${usuarioId}` });
        }
        res.json(unidades);
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor al buscar unidades por usuario', details: err.message });
    }
};

// Exportar los controladores
module.exports = {
    listarUnidades,
    crearUnidad,
    actualizarUnidad,
    desactivarUnidad,
    obtenerUnidadPorId,
    buscarUnidadesPorBrigadaId,
    buscarUnidadesPorUsuarioId
};
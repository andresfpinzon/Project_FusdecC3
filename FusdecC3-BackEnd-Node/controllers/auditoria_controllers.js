const logic = require('../logic/auditoria_logic');
const auditoriaSchemaValidation = require('../validations/auditoria_validations');
const Auditoria = require('../models/auditoria_model');
const Certificado = require('../models/certificado_model');

// Controlador para listar auditorías
const listarAuditorias = async (req, res) => {
    try {
        const auditorias = await Auditoria.find().populate('certificadoId', 'nombreEmisorCertificado');
        res.json(auditorias);
    } catch (error) {
        console.error("Error al listar auditorías:", error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Controlador para crear una nueva auditoría
const crearAuditoria = async (req, res) => {
    const { error, value } = auditoriaSchemaValidation.validate(req.body);
    
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        const nuevaAuditoria = await logic.crearAuditoria(value);
        res.status(201).json(nuevaAuditoria);  // 201 Created
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor', details: err.message });
    }
};

// Controlador para actualizar una auditoría
const actualizarAuditoria = async (req, res) => {
    const { id } = req.params;
    const { error, value } = auditoriaSchemaValidation.validate(req.body);
    
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        const auditoriaActualizada = await logic.actualizarAuditoria(id, value);
        if (!auditoriaActualizada) {
            return res.status(404).json({ error: 'Auditoría no encontrada' });
        }
        res.json(auditoriaActualizada);
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor', details: err.message });
    }
};

// Controlador para obtener una auditoría por su ID
const obtenerAuditoriaPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const auditoria = await logic.buscarAuditoriaPorId(id);
        if (!auditoria) {
            return res.status(404).json({ error: `Auditoría con ID ${id} no encontrada` });
        }
        res.json(auditoria);
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor al buscar la auditoría', details: err.message });
    }
};

// Controlador para desactivar una auditoría
const desactivarAuditoria = async (req, res) => {
    const { id } = req.params;
    try {
        const auditoriaDesactivada = await logic.desactivarAuditoria(id);
        if (!auditoriaDesactivada) {
            return res.status(404).json({ error: 'Auditoría no encontrada' });
        }
        res.json(auditoriaDesactivada);
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Exportar los controladores
module.exports = {
    listarAuditorias,
    crearAuditoria,
    actualizarAuditoria,
    obtenerAuditoriaPorId,
    desactivarAuditoria
};

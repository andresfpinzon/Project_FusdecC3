const logic = require('../logic/auditoria_logic');
const auditoriaSchemaValidation = require('../validations/auditoria_validations');
const Auditoria = require('../models/auditoria_model');
const Certificado = require('../models/certificado_model');

const listarAuditorias = async (req, res) => {
    try {
        const auditorias = await logic.listarAuditorias();
        const auditoriasConInfo = auditorias.map(auditoria => ({
            ...auditoria,
            codigoVerificacion: auditoria.certificadoId ? auditoria.certificadoId.codigoVerificacion : "No disponible",
            certificadoInfo: auditoria.certificadoInfo || null
        }));
        res.json(auditoriasConInfo);
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
        // Obtener información del certificado
        const certificado = await Certificado.findById(value.certificadoId).lean();
        if (!certificado) {
            return res.status(404).json({ error: 'Certificado no encontrado' });
        }

        // Agregar la información del certificado al crear la auditoría
        const dataToCreate = {
            ...value,
            certificadoInfo: {
                codigoVerificacion: certificado.codigoVerificacion,
                // Agregar otros campos relevantes del certificado que necesites
            }
        };

        const nuevaAuditoria = await logic.crearAuditoria(dataToCreate);
        res.status(201).json(nuevaAuditoria);
    } catch (err) {
        console.error("Error al crear auditoría:", err);
        res.status(500).json({ error: 'Error interno del servidor' });
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
        console.error("Error al actualizar auditoría:", err);
        res.status(500).json({ error: 'Error interno del servidor', details: err.message });
    }
};

// Controlador para obtener una auditoría por su ID
const obtenerAuditoriaPorId = async (req, res) => {
    try {
        const auditoria = await logic.buscarAuditoriaPorId(req.params.id);
        if (!auditoria) {
            return res.status(404).json({ error: 'Auditoría no encontrada' });
        }
        res.json(auditoria);
    } catch (error) {
        console.error("Error al obtener auditoría:", error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Controlador para desactivar una auditoría
const desactivarAuditoria = async (req, res) => {
    try {
        const auditoria = await logic.desactivarAuditoria(req.params.id);
        res.json(auditoria);
    } catch (error) {
        console.error("Error al desactivar auditoría:", error);
        if (error.message.includes('no encontrada')) {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Controlador para obtener auditorías por certificado
const obtenerAuditoriasPorCertificado = async (req, res) => {
    const { certificadoId } = req.params;
    try {
        const auditorias = await Auditoria.find({ certificadoId });
        res.json(auditorias);
    } catch (err) {
        console.error("Error al obtener auditorías por certificado:", err);
        res.status(500).json({ error: 'Error interno del servidor', details: err.message });
    }
};

// Exportar los controladores
module.exports = {
    listarAuditorias,
    crearAuditoria,
    actualizarAuditoria,
    obtenerAuditoriaPorId,
    desactivarAuditoria,
    obtenerAuditoriasPorCertificado
};

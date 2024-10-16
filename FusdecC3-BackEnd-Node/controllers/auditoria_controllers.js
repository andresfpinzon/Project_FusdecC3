const logic = require('../logic/auditoria_logic');
const auditoriaSchemaValidation = require('../validations/auditoria_validations');

// Controlador para listar auditorías
const listarAuditorias = async (_req, res) => {
    try {
        const auditorias = await logic.listarAuditorias();
        if (auditorias.length === 0) {
            return res.status(204).send(); // 204 No Content
        }
        res.json(auditorias);
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

// Controlador para buscar usuarios asociados a una auditoría
const obtenerUsuariosPorAuditoria = async (req, res) => {
    const { id } = req.params;
    try {
        const usuarios = await logic.buscarUsuariosPorAuditoria(id);
        if (!usuarios || usuarios.length === 0) {
            return res.status(404).json({ error: `No se encontraron usuarios para la auditoría con ID ${id}` });
        }
        res.json(usuarios);
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor al buscar los usuarios de la auditoría', details: err.message });
    }
};

// Exportar los controladores
module.exports = {
    listarAuditorias,
    actualizarAuditoria,
    obtenerAuditoriaPorId,
    obtenerUsuariosPorAuditoria
};

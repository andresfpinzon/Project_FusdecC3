const logic = require('../logic/certificado_logic');
const certificadoSchemaValidation = require('../validations/certificado_validations');

// Controlador para listar certificados
const listarCertificados = async (_req, res) => {
    try {
        const certificados = await logic.listarCertificados();
        if (certificados.length === 0) {
            return res.status(204).send(); // 204 No Content
        }
        res.json(certificados);
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor', details: err.message });
    }
};

// Controlador para crear un certificado
const crearCertificado = async (req, res) => {
    const { error, value } = certificadoSchemaValidation.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    try {
        const nuevoCertificado = await logic.crearCertificado(value);
        res.status(201).json(nuevoCertificado);
    } catch (err) {
        if (err.message === 'El certificado con este código de verificación ya existe') {
            return res.status(409).json({ error: err.message });
        }
        res.status(500).json({ error: 'Error interno del servidor', details: err.message });
    }
};

// Controlador para actualizar un certificado
const actualizarCertificado = async (req, res) => {
    const { id } = req.params;
    const { error, value } = certificadoSchemaValidation.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    try {
        const certificadoActualizado = await logic.editarCertificado(id, value);
        if (!certificadoActualizado) {
            return res.status(404).json({ error: 'Certificado no encontrado' });
        }
        res.json(certificadoActualizado);
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor', details: err.message });
    }
};

// Controlador para desactivar un certificado
const desactivarCertificado = async (req, res) => {
    const { id } = req.params;
    try {
        const certificadoDesactivado = await logic.desactivarCertificado(id);
        if (!certificadoDesactivado) {
            return res.status(404).json({ error: 'Certificado no encontrado' });
        }
        res.json(certificadoDesactivado);
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor', details: err.message });
    }
};

// Controlador para obtener un certificado por su ID
const obtenerCertificadoPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const certificado = await logic.buscarCertificadoPorId(id);
        if (!certificado) {
            return res.status(404).json({ error: `Certificado con ID ${id} no encontrado` });
        }
        res.json(certificado);
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor al buscar el certificado', details: err.message });
    }
};

// Exportar los controladores
module.exports = {
    listarCertificados,
    crearCertificado,
    actualizarCertificado,
    desactivarCertificado,
    obtenerCertificadoPorId
};
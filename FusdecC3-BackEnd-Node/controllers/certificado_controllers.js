const logic = require('../logic/certificado_logic');
const certificadoSchemaValidation = require('../validations/certificado_validations');
const Certificado = require('../models/certificado_model');
const mongoose = require('mongoose');

// Controlador para crear un certificado
const crearCertificado = async (req, res) => {
    const { error, value } = certificadoSchemaValidation.validate(req.body);
    
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        const nuevoCertificado = await logic.crearCertificado(value);
        res.status(201).json(nuevoCertificado);  // 201 Created
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor', details: err.message });
    }
};


/* const crearCertificado = async (req, res) => {
    try {
        // Convertir fecha de emisión
        req.body.fechaEmision = transformarFecha(req.body.fechaEmision);

        // Crear y guardar el nuevo certificado
        const nuevoCertificado = new Certificado(req.body);
        const certificadoGuardado = await nuevoCertificado.save();

        // Configurar y validar los datos de auditoría
        const datosAuditoria = {
            fechaAuditoria: certificadoGuardado.fechaEmision,
            nombreEmisor: certificadoGuardado.nombreEmisorCertificado,
            certificadoId: certificadoGuardado._id,
            estadoAuditoria: certificadoGuardado.estadoCertificado,
        };
        
        const { error, value } = auditoriaSchemaValidation.validate(datosAuditoria);
        if (error) return res.status(400).json({ error: error.details[0].message });

        // Crear y guardar la auditoría en paralelo
        const nuevaAuditoria = await logicA.crearAuditoria(value);

        res.status(201).json({ certificado: certificadoGuardado, auditoria: nuevaAuditoria });
    } catch (error) {
        if (error.code === 11000) return res.status(400).json({ error: 'El código de verificación ya existe.' });
        
        console.error("Error al crear certificado:", error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}; */


// Controlador para listar certificados
const listarCertificados = async (_req, res) => {
    try {
        const certificados = await logic.listarCertificados();
        if (certificados.length === 0) {
            return res.status(204).send(); // 204 No Content
        }
        res.json(certificados);
    } catch (err) {
        console.error(err); // Agrega un log para ver el error
        res.status(500).json({ error: 'Error interno del servidor', details: err.message });
    }
};

/*
// Controlador para actualizar un certificado
const actualizarCertificado = async (req, res) => {
    const { id } = req.params;
    const { error, value } = certificadoSchemaValidation.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        // Usa la lógica centralizada para editar el certificado
        const certificadoActualizado = await logic.editarCertificado(id, value);
        if (!certificadoActualizado) {
            return res.status(404).json({ error: 'Certificado no encontrado' });
        }
        res.json(certificadoActualizado);
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor', details: err.message });
    }
};*/

const actualizarCertificado = async (req, res) => {
    const { id } = req.params;
    const { error, value } = certificadoSchemaValidation.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        // Usa la lógica centralizada para editar el certificado
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

const logic = require('../logic/certificado_logic');
const certificadoSchemaValidation = require('../validations/certificado_validations');
const Certificado = require('../models/certificado_model');
const mongoose = require('mongoose');
//necesario para crear la uditoria autimaticamente
const Auditoria = require('../models/auditoria_model');
const auditoriaController = require('./auditoria_controllers');

// Controlador para crear un certificado
const crearCertificado = async (req, res) => {
    try {
        // Convertir la fecha a un objeto Date
        req.body.fechaEmision = new Date(req.body.fechaEmision);
        
        const nuevoCertificado = new Certificado(req.body);
        const certificadoGuardado = await nuevoCertificado.save();

        // con esto cramos la auditoria inmediatamente despues de la creacion de certificado
        const auditoriaData = {
            fechaAuditoria: new Date(req.body.fechaAuditoria),
            nombreEmisor: req.body.nombreEmisorCertificado, // o el valor correspondiente
            certificadoId: certificadoGuardado._id,
            estadoAuditoria: true
        };
  
        // Guardar la auditoría directamente en el modelo o a través del controlador
        const nuevaAuditoria = await Auditoria.create(auditoriaData);
        res.status(201).json({
            certificado: certificadoGuardado,
            auditoria: nuevaAuditoria
          });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'El código de verificación ya existe.' });
        }
        console.error("Error al crear certificado:", error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

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

// Controlador para actualizar un certificado
const actualizarCertificado = async (req, res) => {
    const { id } = req.params;
    const { error, value } = certificadoSchemaValidation.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    try {
        // Convertir la fecha a un objeto Date
        value.fechaEmision = new Date(value.fechaEmision);
        
        const certificadoActualizado = await Certificado.findByIdAndUpdate(id, value, { new: true });
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

const Auditoria = require('../models/auditoria_model');

async function crearAuditoria(body) {
    try {
     
    const auditoria = new Auditoria(body);
    return await auditoria.save();   
    } catch (error) {
        console.error('Error al crear la auditoría (auditoria_logic):', error);
        throw error;
    }
}

// Función asíncrona para listar auditorías
async function listarAuditorias() {
    try {
    return await Auditoria.find().populate('certificadoId');   
    } catch (error) {
        console.error('Error al listar las auditorías (auditoria_logic):', error);
        throw error;
    }
}

// Función asíncrona para buscar una auditoría por su ID
async function buscarAuditoriaPorId(id) { 
    try {
     
    const auditoria = await Auditoria.findById(id).populate('certificadoId');
    if (!auditoria) {
        throw new Error(`Auditoría con ID ${id} no encontrada`);
    }
    return auditoria;   
    } catch (error) {
        console.error('Error al buscar la auditoría por ID (auditoria_logic):', error);
        throw error;
    }
}

// Función asíncrona para desactivar una auditoría
async function desactivarAuditoria(id) {
    try {
    const auditoria = await Auditoria.findByIdAndUpdate(id, { estadoAuditoria: false }, { new: true });
    if (!auditoria) {
        throw new Error(`Auditoría con ID ${id} no encontrada`);
    }
    return auditoria;   
    } catch (error) {
        console.error('Error al desactivar la auditoría (auditoria_logic):', error);
        throw error;
    }
}

module.exports = {
    crearAuditoria,
    listarAuditorias,
    buscarAuditoriaPorId,
    desactivarAuditoria,
};

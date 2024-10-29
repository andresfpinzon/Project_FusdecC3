const Auditoria = require('../models/auditoria_model');

async function crearAuditoria(body) {
    const auditoria = new Auditoria(body);
    return await auditoria.save();
}

// Función asíncrona para listar auditorías
async function listarAuditorias() {
    return await Auditoria.find().populate('certificadoId');
}

// Función asíncrona para buscar una auditoría por su ID
async function buscarAuditoriaPorId(id) {
    const auditoria = await Auditoria.findById(id).populate('certificadoId');
    if (!auditoria) {
        throw new Error(`Auditoría con ID ${id} no encontrada`);
    }
    return auditoria;
}

// Función asíncrona para desactivar una auditoría
async function desactivarAuditoria(id) {
    const auditoria = await Auditoria.findByIdAndUpdate(id, { estadoAuditoria: false }, { new: true });
    if (!auditoria) {
        throw new Error(`Auditoría con ID ${id} no encontrada`);
    }
    return auditoria;
}

module.exports = {
    crearAuditoria,
    listarAuditorias,
    buscarAuditoriaPorId,
    desactivarAuditoria,
};

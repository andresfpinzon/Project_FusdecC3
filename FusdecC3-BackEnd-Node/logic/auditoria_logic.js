const Auditoria = require('../models/auditoria_model');
const Usuario = require('../models/usuario_model');
const auditoriaSchemaValidation = require('../validations/auditoria_validations'); // Asegúrate de descomentar y usar la validación adecuada

async function crearAuditoria(body) {
    // Validar si ya existe una auditoría con el mismo certificadoId
    const auditoriaExistente = await Auditoria.findOne({ certificadoId: body.certificadoId });
    
    if (auditoriaExistente) {
        throw new Error('Ya existe una auditoría con este certificado');
    }

    // Crear la nueva auditoría
    let nuevaAuditoria = new Auditoria({
        fechaAuditoria: body.fechaAuditoria,
        nombreEmisor: body.nombreEmisor,
        certificadoId: body.certificadoId,
        estadoAuditoria: body.estadoAuditoria
    });

    return await nuevaAuditoria.save();
}

// Función asíncrona para listar auditorías
async function listarAuditorias() {
    let auditorias = await Auditoria.find().populate("certificadoId");
    return auditorias;
}

// Función asíncrona para buscar una auditoría por su ID
async function buscarAuditoriaPorId(id) {
    const auditoria = await Auditoria.findById(id).populate("certificadoId");
    if (!auditoria) {
        throw new Error(`Auditoría con ID ${id} no encontrada`);
    }
    return auditoria;
}

// Función asíncrona para buscar usuarios asociados a una auditoría
async function buscarUsuariosPorAuditoria(id) {
    try {
        const usuarios = await Usuario.find({ auditorias: id }).populate('auditorias', 'nombreEmisor');
        if (!usuarios || usuarios.length === 0) {
            throw new Error(`No se encontraron usuarios asociados a la auditoría con ID ${id}`);
        }
        return usuarios.map(usuario => ({
            _id: usuario._id,
            email: usuario.email,
            nombre: usuario.nombre,
            estado: usuario.estado,
            __v: usuario.__v
        }));
    } catch (err) {
        console.error(`Error al buscar usuarios por auditoría: ${err.message}`);
        throw err;
    }
}

// Función asíncrona para desactivar una auditoría (si se requiere)
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
    buscarUsuariosPorAuditoria,
    desactivarAuditoria // Añadido para desactivar auditorías
};
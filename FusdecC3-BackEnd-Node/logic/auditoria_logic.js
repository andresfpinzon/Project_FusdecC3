const Auditoria = require('../models/auditoria_model');
const Usuario = require('../models/usuario_model');
const auditoriaSchemaValidation = require('../validations/auditoria_validations');

// Función asíncrona para crear auditorías
async function crearAuditoria(body) {
    // Validar los datos de entrada
    const { error } = auditoriaSchemaValidation.validate(body);
    if (error) {
        throw new Error(error.details[0].message);
    }

    // Verificar si ya existe una auditoría con el mismo emisor
    const auditoriaExistente = await Auditoria.findOne({ nombreEmisor: body.nombreEmisor });
    if (auditoriaExistente) {
        throw new Error('La auditoría con este emisor ya existe');
    }

    let auditoria = new Auditoria({
        fechaAuditoria: body.fechaAuditoria,
        nombreEmisor: body.nombreEmisor,
        certificadoId: body.certificadoId
    });
    return await auditoria.save();
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



module.exports = {
    crearAuditoria,
    listarAuditorias,
    buscarAuditoriaPorId,
    buscarUsuariosPorAuditoria,
};
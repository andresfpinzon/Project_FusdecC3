const Certificado = require('../models/certificado_model');
const Estudiante = require('../models/estudiante_model');
const Curso = require('../models/curso_model');
//const certificadoSchemaValidation = require('../validations/certificado_validations');

// Función asíncrona para crear certificados
async function crearCertificado(body) {
    // Validar los datos de entrada
    const { error } = certificadoSchemaValidation.validate(body);
    if (error) {
        throw new Error(error.details[0].message);
    }

    // Verificar si ya existe un certificado con el mismo código de verificación
    const certificadoExistente = await Certificado.findOne({ codigoVerificacion: body.codigoVerificacion });
    if (certificadoExistente) {
        throw new Error('El certificado con este código de verificación ya existe');
    }

    const certificado = new Certificado({
        codigoVerificacion: body.codigoVerificacion,
        nombreEmisorCertificado: body.nombreEmisorCertificado,
        estadoCertificado: body.estadoCertificado,
        estudianteId: body.estudianteId,
        cursoId: body.cursoId,
        usuarioId: body.usuarioId
    });

    return await certificado.save();
}

// Función asíncrona para listar certificados
async function listarCertificados() {
    return await Certificado.find()
        .populate('estudianteId')
        .populate('cursoId');
}

// Función asíncrona para buscar un certificado por su ID
async function buscarCertificadoPorId(id) {
    const certificado = await Certificado.findById(id)
        .populate('estudianteId')
        .populate('cursoId');
    if (!certificado) {
        throw new Error(`Certificado con ID ${id} no encontrado`);
    }
    return certificado;
}

// Función asíncrona para editar un certificado
async function editarCertificado(id, body) {
    const certificado = await Certificado.findByIdAndUpdate(id, body, { new: true })
        .populate('estudianteId')
        .populate('cursoId');
    if (!certificado) {
        throw new Error(`Certificado con ID ${id} no encontrado`);
    }
    return certificado;
}

// Función asíncrona para eliminar un certificado
async function eliminarCertificado(id) {
    const certificado = await Certificado.findByIdAndDelete(id);
    if (!certificado) {
        throw new Error(`Certificado con ID ${id} no encontrado`);
    }
    return certificado;
}

module.exports = {
    crearCertificado,
    listarCertificados,
    buscarCertificadoPorId,
    editarCertificado,
    eliminarCertificado
};
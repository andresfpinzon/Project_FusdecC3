const Certificado = require('../models/certificado_model');
const Estudiante = require('../models/estudiante_model');
const Curso = require('../models/curso_model');


// Función asíncrona para crear certificados
async function crearCertificado(body) {
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
        usuarioId: body.usuarioId,
        fechaEmision: body.fechaEmision, // Asegúrate de que la fecha esté en formato correcto
    });

    return await certificado.save();
}

// Función asíncrona para listar certificados
async function listarCertificados() {
    return await Certificado.find().populate('estudianteId cursoId');
}

// Función asíncrona para buscar un certificado por su ID
async function buscarCertificadoPorId(id) {
    const certificado = await Certificado.findById(id).populate('estudianteId cursoId');
    if (!certificado) {
        throw new Error(`Certificado con ID ${id} no encontrado`);
    }
    return certificado;
}

// Función asíncrona para editar un certificado
async function editarCertificado(id, body) {
    const certificado = await Certificado.findByIdAndUpdate(id, body, { new: true });
    if (!certificado) {
        throw new Error(`Certificado con ID ${id} no encontrado`);
    }
    return certificado;
}

// Función asíncrona para desactivar un certificado
async function desactivarCertificado(id) {
    const certificado = await Certificado.findByIdAndUpdate(id, { estadoCertificado: false }, { new: true });
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
    desactivarCertificado 
};

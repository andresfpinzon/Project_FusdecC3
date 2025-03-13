const Certificado = require('../models/certificado_model');
const Estudiante = require('../models/estudiante_model');
const Curso = require('../models/curso_model');
const Auditoria = require('../models/auditoria_model');

// Función asíncrona para crear certificados
async function crearCertificado(body) {
    try {
     
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
        fechaEmision: body.fechaEmision,
    });

    // Guardar el certificado
    const nuevoCertificado = await certificado.save();

    // Asociar el certificado al estudiante correspondiente
    if (body.estudianteId) {
        await Estudiante.findByIdAndUpdate(
            body.estudianteId,
            { $push: { certificados: nuevoCertificado._id } }, // Agregar el certificado al array de certificados del estudiante
            { new: true }
        );
    }

    // Crear auditoría automáticamente
    const nuevaAuditoria = new Auditoria({
        fechaAuditoria: new Date(),
        nombreEmisor: body.nombreEmisorCertificado,
        certificadoId: nuevoCertificado._id.toString(),
        estadoAuditoria: true,
    });
    

    await nuevaAuditoria.save(); // Guardar la auditoría

    return nuevoCertificado; // Retornar el certificado creado   
    } catch (error) {
        console.error('Error al crear el certificado (certificado_logic):', error);
        throw error;
    }
}

// Función asíncrona para listar certificados
async function listarCertificados() {
    try {
        return await Certificado.find().populate('estudianteId cursoId');

    } catch (error) {
        console.error('Error al listar los certificados (certificado_logic):', error);
        throw error;        
    }
}

// Función asíncrona para buscar un certificado por su ID
async function buscarCertificadoPorId(id) {
    try {
     
    const certificado = await Certificado.findById(id).populate('estudianteId cursoId');
    if (!certificado) {
        throw new Error(`Certificado con ID ${id} no encontrado`);
    }
    return certificado;   
    } catch (error) {
        console.error('Error al buscar el certificado por ID (certificado_logic):', error);
        throw error;
    }
}

// Función asíncrona para editar un certificado
async function editarCertificado(id, body) {
    try {
     
    // Buscar el certificado existente
    const certificado = await Certificado.findById(id);
    if (!certificado) {
        throw new Error(`Certificado con ID ${id} no encontrado`);
    }

    // Si el estudiante cambia, actualizar la referencia
    if (body.estudianteId && body.estudianteId !== certificado.estudianteId.toString()) {
        // Remover el certificado del estudiante anterior
        await Estudiante.findByIdAndUpdate(
            certificado.estudianteId,
            { $pull: { certificados: certificado._id } }
        );

        // Agregar el certificado al nuevo estudiante
        await Estudiante.findByIdAndUpdate(
            body.estudianteId,
            { $push: { certificados: certificado._id } }
        );
    }

    // Actualizar el certificado
    certificado.codigoVerificacion = body.codigoVerificacion || certificado.codigoVerificacion;
    certificado.nombreEmisorCertificado = body.nombreEmisorCertificado || certificado.nombreEmisorCertificado;
    certificado.estadoCertificado = body.estadoCertificado !== undefined ? body.estadoCertificado : certificado.estadoCertificado;
    certificado.cursoId = body.cursoId || certificado.cursoId;
    certificado.usuarioId = body.usuarioId || certificado.usuarioId;
    certificado.fechaEmision = body.fechaEmision || certificado.fechaEmision;
    certificado.estudianteId = body.estudianteId || certificado.estudianteId;

    return await certificado.save();   
    } catch (error) {
        console.error('Error al editar el certificado (certificado_logic):', error);
        throw error;
    }
}

// Función asíncrona para desactivar un certificado
async function desactivarCertificado(id) {
    try {
     
    const certificado = await Certificado.findByIdAndUpdate(id, { estadoCertificado: false }, { new: true });
    if (!certificado) {
        throw new Error(`Certificado con ID ${id} no encontrado`);
    }
    return certificado;   
    } catch (error) {
        console.error('Error al desactivar el certificado (certificado_logic):', error);
        throw error;
    }
}

module.exports = {
    crearCertificado,
    listarCertificados,
    buscarCertificadoPorId,
    editarCertificado,
    desactivarCertificado 
};

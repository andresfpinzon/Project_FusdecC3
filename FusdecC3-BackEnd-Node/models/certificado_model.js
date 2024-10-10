// models/Certificate.js
const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
    idCertificate: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId(), // Genera un nuevo ObjectId por defecto
    },
    verificationCode: {
        type: String,
        required: true, // Puedes agregar validaciones como 'required'
    },
    nameOfIssuerCert: {
        type: String,
        required: true,
    },
    certificateStatus: {
        type: Boolean,
        required: true,
    },
    idStudent: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Student', // Referencia al modelo Student
    },
    idCourse: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Course', // Referencia al modelo Course
    },
    audit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Audit', // Referencia al modelo Audit (si existe)
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student', // Referencia al modelo Student
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course', // Referencia al modelo Course
    },
});

// Exportar el modelo
module.exports = mongoose.model('Certificate', certificateSchema);
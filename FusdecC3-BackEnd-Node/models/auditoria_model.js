// models/Audit.js
const mongoose = require('mongoose');

const auditSchema = new mongoose.Schema({
    idAudit: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId(), // Genera un nuevo ObjectId por defecto
    },
    auditDate: {
        type: Date, // Mongoose maneja las fechas como tipo Date
        required: true,
    },
    nameOfIssuerAudit: {
        type: String,
        required: true,
    },
    idCertificate: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Certificate', // Referencia al modelo Certificate
    },
    certificate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Certificate', // Referencia al modelo Certificate
    },
});

// Exportar el modelo
module.exports = mongoose.model('Audit', auditSchema);
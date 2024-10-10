// models/Unit.js
const mongoose = require('mongoose');

const unitSchema = new mongoose.Schema({
    idUnit: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId(), // Genera un nuevo ObjectId por defecto
    },
    unitName: {
        type: String,
        required: true, // Puedes agregar validaciones como 'required'
    },
    unitState: {
        type: Boolean,
        required: true,
    },
    idBrigade: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Brigade', // Referencia al modelo Brigade
    },
    userId: {
        type: String,
        maxlength: 450, // Limitar la longitud del string
        default: null, // Puede ser nulo
    },
    brigade: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brigade', // Referencia al modelo Brigade
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student', // Referencia al modelo Student
    }],
});

// Exportar el modelo
module.exports = mongoose.model('Unit', unitSchema);
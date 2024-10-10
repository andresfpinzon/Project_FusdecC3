// models/Brigade.js
const mongoose = require('mongoose');

const brigadeSchema = new mongoose.Schema({
    idBrigade: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId(), // Genera un nuevo ObjectId por defecto
    },
    brigadeName: {
        type: String,
        required: true, // Puedes agregar validaciones como 'required'
    },
    brigadeLocation: {
        type: String,
        required: true,
    },
    brigadeStatus: {
        type: Boolean,
        required: true,
    },
    idCommand: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Command', // Referencia al modelo Command
    },
    units: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Unit', // Referencia al modelo Unit
    }],
});

// Exportar el modelo
module.exports = mongoose.model('Brigade', brigadeSchema);
// models/Command.js
const mongoose = require('mongoose');

const commandSchema = new mongoose.Schema({
    idCommand: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId(), // Genera un nuevo ObjectId por defecto
    },
    commandName: {
        type: String,
        required: true, // Puedes agregar validaciones como 'required'
    },
    commandStatus: {
        type: Boolean,
        required: true,
    },
    ubicacionComando: {
        type: String,
        required: true,
    },
    idFundation: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Fundation', // Referencia al modelo Fundation
    },
    brigades: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brigade', // Referencia al modelo Brigade
    }],
});

// Exportar el modelo
module.exports = mongoose.model('Command', commandSchema);
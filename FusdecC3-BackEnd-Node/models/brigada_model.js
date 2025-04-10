const mongoose = require("mongoose");
const { Schema } = mongoose;

const BrigadaSchema = new Schema({
    nombreBrigada: {
        type: String,
        required: true,
        unique: true
    },
    estadoBrigada: {
        type: Boolean,
        default: true
    },
    comandoId: {
        type: Schema.Types.ObjectId,
        ref: 'Comando',
        required: false
    },
    unidades: [{
        type: Schema.Types.ObjectId,
        ref: 'Unidad'
    }],
    horario: {
        type: String,
        enum: ['mañana', 'tarde'],
        default: 'mañana'
    }
});

const Brigada = mongoose.model("Brigada", BrigadaSchema);
module.exports = Brigada;

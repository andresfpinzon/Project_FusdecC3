const mongoose = require("mongoose");
const { Schema } = mongoose;

const BrigadaSchema = new Schema({
    nombreBrigada: {
        type: String,
        required: true,
    },
    ubicacionBrigada: {
        type: String,
        required: true,
    },
    estadoBrigada: {
        type: Boolean,
        default: true,
        required: true,
    },
    comandoId: {
        type: Schema.Types.ObjectId,
        ref: 'Comando',
        required: true,
    },
    unidades: [{
        type: Schema.Types.ObjectId,
        ref: 'Unidad',
    }],
});

const Brigada = mongoose.model("Brigada", BrigadaSchema);
module.exports = Brigada;

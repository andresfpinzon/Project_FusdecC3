const mongoose = require("mongoose");
const { Schema } = mongoose;

const BrigadaSchema = new Schema({
    brigadaId: {
        type: Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId(),
    },
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
        required: true,
        ref: "Comando", // Referencia al modelo Comando
    },
    unidades: [
        {
            type: Schema.Types.ObjectId,
            ref: "Unidad", // Referencia al modelo Unidad
        },
    ],
});

const Brigada = mongoose.model("Brigada", BrigadaSchema);
module.exports = Brigada;

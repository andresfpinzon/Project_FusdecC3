const mongoose = require("mongoose");
const { Schema } = mongoose;

const ComandoSchema = new Schema({
    /*comandoId: {
        type: Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId(),
    },*/
    nombreComando: {
        type: String,
        required: true,
    },
    estadoComando: {
        type: Boolean,
        default: true,
        required: true,
    },
    ubicacionComando: {
        type: String,
        required: true,
    },
    fundacionId: {
        type: Schema.Types.ObjectId,
        ref: "Fundacion", // Referencia al modelo Fundación
        default: null, // Permitir que fundacionId esté vacío
    },
    brigadas: [
        {
            type: Schema.Types.ObjectId,
            ref: "Brigada", // Referencia al modelo Brigada
        },
    ],
});

const Comando = mongoose.model("Comando", ComandoSchema);
module.exports = Comando;

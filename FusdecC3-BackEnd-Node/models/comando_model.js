const mongoose = require("mongoose");
const { Schema } = mongoose;

const ComandoSchema = new Schema({
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
        ref: "Fundacion",
        required: true
    },
    brigadas: [
        {
            type: Schema.Types.ObjectId,
            ref: "Brigada",
        },
    ],
});

const Comando = mongoose.model("Comando", ComandoSchema);
module.exports = Comando;

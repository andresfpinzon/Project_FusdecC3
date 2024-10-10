const mongoose = require("mongoose");
const { Schema } = mongoose;

const UnidadSchema = new Schema({
    unidadId: {
        type: Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId(),
    },
    nombreUnidad: {
        type: String,
        required: true,
    },
    estadoUnidad: {
        type: Boolean,
        default: true,
        required: true,
    },
    brigadaId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Brigada", // Referencia al modelo Brigada
    },
    estudiantes: [
        {
            type: Schema.Types.ObjectId,
            ref: "Estudiante", // Referencia al modelo Estudiante
        },
    ],
});

const Unidad = mongoose.model("Unidad", UnidadSchema);
module.exports = Unidad;

const mongoose = require("mongoose");
const { Schema } = mongoose;

const UnidadSchema = new Schema({

    nombreUnidad: {
        type: String,
        required: true,
    },
    estadoUnidad: {
        type: Boolean,
        default: true,
    },
    brigadaId: {
        type: Schema.Types.ObjectId,
        ref: 'Brigada', 
        required: true,
    },
    usuarioId: {
        type: String,
        required: true,
    },
    estudiantes: [{
        type: Schema.Types.ObjectId,
        ref: 'Estudiante'
    }]
},
    {
        timestamps: true
    });

const Unidad = mongoose.model("Unidad", UnidadSchema);
module.exports = Unidad;

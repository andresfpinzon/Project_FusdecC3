const mongoose = require("mongoose");
const { Schema } = mongoose;

const UnidadSchema = new Schema({
    /*unidadId: {
        type: Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId(),
    },*/
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
        ref: 'Brigada', // Asegúrate de que esto coincida con el modelo de Brigada
        required: true,
    },
    usuarioId: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario', // Asegúrate de que esto coincida con el modelo de Usuario
        required: true,
    },
    estudiantes: [{
        type: Schema.Types.ObjectId,
        ref: 'Estudiante', // Asegúrate de que esto coincida con el modelo de Estudiante
    }],
},
    {
        timestamps: true
    });

const Unidad = mongoose.model("Unidad", UnidadSchema);
module.exports = Unidad;

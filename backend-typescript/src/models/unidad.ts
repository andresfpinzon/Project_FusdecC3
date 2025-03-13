import { Schema, model, Types } from "mongoose";
import { IUnidad } from "@interfaces/unidad.interface";

const UnidadSchema = new Schema<IUnidad>({
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
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
    },
    estudiantes: [{
        type: Schema.Types.ObjectId,
        ref: 'Estudiante',
    }],
}, {
    timestamps: true
});

export default model<IUnidad>("Unidad", UnidadSchema);

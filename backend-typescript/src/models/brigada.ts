import { Schema, model, Types } from "mongoose";
import { IBrigada } from "@interfaces/brigada.interface";

const BrigadaSchema = new Schema<IBrigada>({
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

export default model<IBrigada>("Brigada", BrigadaSchema);

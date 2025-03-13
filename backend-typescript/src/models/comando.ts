import { Schema, model, Types } from "mongoose";
import { IComando } from "@interfaces/comando.interface";

const ComandoSchema = new Schema<IComando>({
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
        required: true,
    },
    brigadas: [
        {
            type: Schema.Types.ObjectId,
            ref: "Brigada",
        },
    ],
});

export default model<IComando>("Comando", ComandoSchema);
import { Document, Types } from "mongoose";

export interface IBrigada extends Document {
    nombreBrigada: string;
    ubicacionBrigada: string;
    estadoBrigada: boolean;
    comandoId: Types.ObjectId;
    unidades: Types.ObjectId[];
}

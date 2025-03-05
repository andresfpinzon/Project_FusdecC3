import { Document, Types } from "mongoose";

export interface IUnidad extends Document {
    nombreUnidad: string;
    estadoUnidad: boolean;
    brigadaId: Types.ObjectId;
    usuarioId: Types.ObjectId;
    estudiantes: Types.ObjectId[];
}

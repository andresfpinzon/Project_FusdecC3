import { Document, Types } from "mongoose";

export interface IComando extends Document {
    nombreComando: string;
    estadoComando: boolean;
    ubicacionComando: string;
    fundacionId: Types.ObjectId;
    brigadas: Types.ObjectId[];
}
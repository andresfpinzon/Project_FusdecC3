import {Schema, model} from "mongoose";

import { ICertifcate } from "@interfaces/certificado.interface";

const CertificateSchema = new Schema<ICertifcate>({
    nombreEmisorCertificado: {
        type: String,
        required: true,
    },
    fechaEmision: {
        type: Date,
        default: Date.now,
        required: true,
    },
    codigoVerificacion: {
        type: String,
        required: true,
    },
    estadoCertificado: {
        type: Boolean,
        default: true,
    },
    usuarioId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: false,
    },
    cursoId: {
        type: Schema.Types.ObjectId,
        ref: "Corso",
        required: false,
    },
    estudianteId:  {
        type: Schema.Types.ObjectId,
        ref: "Estudiante",
        required: false,
    },
}, {timestamps: true}) 

export default model<ICertifcate>('Certificate', CertificateSchema)
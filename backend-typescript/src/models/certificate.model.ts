import {Schema, model} from "mongoose";

import { ICertifcate } from "@interfaces/certificado.interface";

const CertificateSchema = new Schema<ICertifcate>({
    nameEmisor: {
        type: String,
        required: true,
    },
    fechaEmision: {
        type: Date,
        required: true,
    },
    codigoVerify: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: false,
    },
    curso: {
        type: Schema.Types.ObjectId,
        ref: "Course",
        required: false,
    },
    estudiante:  {
        type: Schema.Types.ObjectId,
        ref: "Student",
        required: false,
    },
}, {timestamps: true}) 

export default model<ICertifcate>('Certificate', CertificateSchema)
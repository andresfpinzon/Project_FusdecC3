import {Document, ObjectId} from 'mongoose'

export interface ICertifcate extends Document {
    nombreEmisorCertificado: string
    fechaEmision: Date
    codigoVerificacion: string
    estadoCertificado: boolean
    usuarioId: ObjectId
    cursoId: ObjectId
    estudianteId:  ObjectId
}
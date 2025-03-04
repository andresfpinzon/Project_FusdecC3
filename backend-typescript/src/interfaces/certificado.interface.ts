import {Document, ObjectId} from 'mongoose'

export interface ICertifcate extends Document {
    nameEmisor: string
    fechaEmision: Date
    codigoVerify: string
    isActive: boolean
    usuario: ObjectId
    curso: ObjectId
    estudiante:  ObjectId
}
import {Schema, model} from "mongoose";
import bcrypt from "bcrypt";

const ColegioSchema = new Schema({
  /*colegioId: {
    type: Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },*/

  nombreColegio: {
    type: String,
    required: true,
  },

  emailColegio: {
    type: String,
    required: true,
  },

  estadoColegio: {
    type: Boolean,
    default: true,
    required: true,
  },

  estudiantes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Estudiante", // Referencia a la colección de Estudiante
    },
  ],
});

export default model('Colegio', ColegioSchema)
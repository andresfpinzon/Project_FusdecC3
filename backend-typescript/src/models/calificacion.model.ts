import {Schema, model} from "mongoose";
import bcrypt from "bcrypt";

const CalificacionSchema = new Schema({
  /*calificacionId: {
    type: Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },*/

  tituloCalificacion: {
    type: String,
    required: true,
  },

  aprobado: {
    type: Boolean,
    required: true,
  },

  usuarioId: {
    type: String,
    maxlength: 450,
    default: null,
    //required: true,
  },

  estadoCalificacion: {
    type: Boolean,
    default: true,
    required: true,
  },

  estudiantes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Estudiante", // Referencia a la colección de Nota_Estudiante
    },
  ],
});

export default model('Calificacion', CalificacionSchema)
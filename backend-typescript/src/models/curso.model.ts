import {Schema, model} from "mongoose";
import bcrypt from "bcrypt";

const CursoSchema = new Schema({
  
  nombreCurso: {
    type: String,
    required: true,
  },
  descripcionCurso: {
    type: String,
  },
  intensidadHorariaCurso: {
    type: String,
    required: true,
  },
  estadoCurso: {
    type: Boolean,
    default: true,
  },
  fundacionId: {
    type: Schema.Types.ObjectId,
    ref: "Fundacion", // Referencia a la colección de Fundacion
    default: null, // permite que la fundacion en el curso sea opcional
  },
  ediciones: [
    {
      type: Schema.Types.ObjectId,
      ref: "Edicion", // Referencia a la colección de Edicion
    },
  ],
});

export default model('Curso', CursoSchema)
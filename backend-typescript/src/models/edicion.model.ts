import {Schema, model} from "mongoose";
import bcrypt from "bcrypt";

const EdicionSchema = new Schema(
  {
    
    tituloEdicion: {
      type: String,
      required: true,
    },
    fechaInicioEdicion: {
      type: Date,
      required: true,
    },
    fechaFinEdicion: {
      type: Date, 
      required: true,
    },
    estadoEdicion: {
      type: Boolean,
      default: true,
    },
    cursoId: {
      type: Schema.Types.ObjectId,
      ref: "Curso",
      default: null, // permite que el curso en la edición sea opcional
    },
    horarios: [
      {
        type: Schema.Types.ObjectId,
        ref: "Horario",
      },
    ],    
    estudiantes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Estudiante", // Referencia a la colección de EstudianteEdicion
      },
    ],
  },
);

export default model('Edicion', EdicionSchema)
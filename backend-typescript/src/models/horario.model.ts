import {Schema, model} from "mongoose";
import bcrypt from "bcrypt";

const HorarioSchema = new Schema({
    
    tituloHorario: {
      type: String,
      required: true,
    },
    horaInicio: {
      type: String,
      required: true,
    },
    horaFin: {
      type: String,
      required: true,
    },
    estadoHorario: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true
  }
  );
  
  export default model('Horario', HorarioSchema)
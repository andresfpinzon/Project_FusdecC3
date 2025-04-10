const mongoose = require("mongoose");
const { Schema } = mongoose;

const HorarioSchema = new Schema(
  {
    diaHorario: {
      type: String,
      required: true,
      enum: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
    },
    horaInicio: {
      type: String,
      required: true
    },
    horaFin: {
      type: String,
      required: true
    },
    estadoHorario: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const Horario = mongoose.model("Horario", HorarioSchema);

module.exports = Horario;

const mongoose = require("mongoose");
const { Schema } = mongoose;

const HorarioSchema = new Schema({
  /*horarioId: {
    type: Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },*/
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

const Horario = mongoose.model("Horario", HorarioSchema);
module.exports = Horario;

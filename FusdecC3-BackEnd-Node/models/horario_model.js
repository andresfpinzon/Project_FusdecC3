const mongoose = require("mongoose");
const { Schema } = mongoose;

const HorarioSchema = new Schema({
  horarioId: {
    type: Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
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
  estatusHorario: {
    type: Boolean,
    default: true,
  },
  horariosEstudiantes: [
    {
      type: Schema.Types.ObjectId,
      ref: "HorarioEdicion", // Referencia a la colección de HorarioEdicion
    },
  ],
});

const Horario = mongoose.model("Horario", HorarioSchema);

module.exports = Horario;

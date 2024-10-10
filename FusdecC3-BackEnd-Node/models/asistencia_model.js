const mongoose = require("mongoose");
const { Schema } = mongoose;

const AsistenciaSchema = new Schema({
  asistenciaId: {
    type: Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  tituloAsistencia: {
    type: String,
    required: true,
  },
  fechaAsistencia: {
    type: Date,
    required: true,
  },
  inasistencia: {
    type: Schema.Types.ObjectId,
    ref: "Inasistencia",
  },
  usuarioId: {
    type: String,
    maxlength: 450,
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
  },
  asistenciasEstudiante: [
    {
      type: Schema.Types.ObjectId, // Referencia a AsistenciaEstudiante
      ref: "AsistenciaEstudiante",
    },
  ],
});

const Asistencia = mongoose.model("Asistencia", AsistenciaSchema);
module.exports = Asistencia;

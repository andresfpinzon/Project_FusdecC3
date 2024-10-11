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
  usuarioId: {
    type: String,
    maxlength: 450,
    required: true,
  },
  estudiantes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Estudiante",
    },
  ],
});

const Asistencia = mongoose.model("Asistencia", AsistenciaSchema);
module.exports = Asistencia;

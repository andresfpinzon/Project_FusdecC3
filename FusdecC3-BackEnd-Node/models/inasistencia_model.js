const mongoose = require("mongoose");
const { Schema } = mongoose;

const InasistenciaSchema = new Schema({
  inasistenciaId: {
    type: Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  tituloInasistencia: {
    type: String,
    required: true,
  },
  observacion: {
    type: String,
    required: true,
  },
  usuarioId: {
    type: String,
    maxlength: 450,
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
  },
  idAsistencia: {
    type: Schema.Types.ObjectId,
    ref: "Asistencia",
    required: true,
  },
  estudiantesInasistencia: [
    {
      type: Schema.Types.ObjectId,
      ref: "InasistenciaEstudiante",
    },
  ],
});

const Inasistencia = mongoose.model("Inasistencia", InasistenciaSchema);
module.exports = Inasistencia;
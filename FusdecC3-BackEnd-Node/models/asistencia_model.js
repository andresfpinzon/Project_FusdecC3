const mongoose = require("mongoose")
const { Schema } = mongoose

const AsistenciaSchema = new Schema({
  tituloAsistencia: {
    type: String,
    required: true,
  },
  fechaAsistencia: {
    type: Date,
    required: true,
  },
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  estadoAsistencia: {
    type: Boolean,
    default: true,
  },
  estudiantes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Estudiante",
    },
  ],
})

// Tarea automatizada: Marcar asistencias antiguas como inactivas
AsistenciaSchema.statics.marcarAsistenciasAntiguas = async function () {
  const unMesAtras = new Date()
  unMesAtras.setMonth(unMesAtras.getMonth() - 1)

  await this.updateMany(
    { fechaAsistencia: { $lt: unMesAtras }, estadoAsistencia: true },
    { $set: { estadoAsistencia: false } },
  )
}

const Asistencia = mongoose.model("Asistencia", AsistenciaSchema)
module.exports = Asistencia


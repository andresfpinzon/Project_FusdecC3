const mongoose = require("mongoose");
const { Schema } = mongoose;

const edicionSchema = new Schema(
  {
    idEdicion: {
      type: Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
    },
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
    estatusEdicion: {
      type: Boolean,
      default: true,
    },
    CursoId: {
      type: Schema.Types.ObjectId,
      ref: "Curso", // Referencia a la colección de Curso
    },
    horarios: [
      {
        type: Schema.Types.ObjectId,
        ref: "Horario", // Referencia a la colección de HorarioEdicion
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

const Edicion = mongoose.model("Edicion", edicionSchema);

module.exports = Edicion;

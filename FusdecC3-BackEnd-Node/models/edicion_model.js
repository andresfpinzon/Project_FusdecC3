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
    horariosEdicion: [
      {
        type: Schema.Types.ObjectId,
        ref: "HorarioEdicion", // Referencia a la colección de HorarioEdicion
      },
    ],
    estudiantesEdicion: [
      {
        type: Schema.Types.ObjectId,
        ref: "EstudianteEdicion", // Referencia a la colección de EstudianteEdicion
      },
    ],
  },
);

const Edicion = mongoose.model("Edicion", edicionSchema);

module.exports = Edicion;

const mongoose = require("mongoose");
const { Schema } = mongoose;

const CalificacionSchema = new Schema({
  /*calificacionId: {
    type: Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },*/

  tituloCalificacion: {
    type: String,
    required: true,
  },

  aprobado: {
    type: Boolean,
    required: true,
  },

  usuarioId: {
    type: String,
    maxlength: 450,
    default: null,
    //required: true,
  },

  estadoCalificacion: {
    type: Boolean,
    default: true,
    required: true,
  },

  estudiantes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Estudiante", // Referencia a la colección de Nota_Estudiante
    },
  ],
});

const Calificacion = mongoose.model("Calificacion", CalificacionSchema);

module.exports = Calificacion;

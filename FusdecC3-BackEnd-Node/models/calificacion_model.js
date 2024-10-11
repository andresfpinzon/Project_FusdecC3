const mongoose = require("mongoose");
const { Schema } = mongoose;

const NotaSchema = new Schema({
  /*calificacionId: {
    type: Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },*/

  tituloNota: {
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
    required: true,
  },

  estudiantes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Estudiante", // Referencia a la colección de NotaEstudiante
    },
  ],
});

const Nota = mongoose.model("Nota", NotaSchema);

module.exports = Nota;

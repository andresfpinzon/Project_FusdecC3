const mongoose = require("mongoose");
const { Schema } = mongoose;

const CursoSchema = new Schema({
  CursoId: {
    type: Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  nombreCurso: {
    type: String,
    required: true,
  },
  descripcionCurso: {
    type: String,
  },
  intensidadHorariaCurso: {
    type: String,
    required: true,
  },
  estatusCurso: {
    type: Boolean,
    default: true,
  },
  fundacionId: {
    type: Schema.Types.ObjectId,
    ref: "Fundacion", // Referencia a la colección de Fundacion
  },
  ediciones: [
    {
      type: Schema.Types.ObjectId,
      ref: "Edicion", // Referencia a la colección de Edicion
    },
  ],
  certificados: [
    {
      type: Schema.Types.ObjectId,
      ref: "Certificado", // Referencia a la colección de Certificado
    },
  ],
});

const Curso = mongoose.model("Curso", cursoSchema);
module.exports = Curso;

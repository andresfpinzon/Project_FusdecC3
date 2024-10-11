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
    type: this.schema.type.ObjectId,
    required: true,
    Ref: "Usuario",
  },

  estudiantes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Estudiante", // Referencia a la colección de Nota_Estudiante
    },
  ],
});

const Nota = mongoose.model("Nota", NotaSchema);

module.exports = Nota;

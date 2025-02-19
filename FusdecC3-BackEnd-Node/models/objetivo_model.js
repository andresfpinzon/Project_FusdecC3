const mongoose = require("mongoose");
const { Schema } = mongoose;

const ObjetivoSchema = new Schema({

  tituloObjetivo: {
    type: String,
    required: true,
  },

  descripcionObjetivo: {
    type: String,
    required: true,
  },

  estadoObjetivo: {
    type: Boolean,
    default: true,
    required: true,
  },

  cursoId: {
    type: Schema.Types.ObjectId,
    ref: "Curso",
    required: true,
  },
});

const Objetivo = mongoose.model("Objetivo", ObjetivoSchema);
module.exports = Objetivo;
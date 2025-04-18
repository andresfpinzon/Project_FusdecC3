const mongoose = require("mongoose");
const { Schema } = mongoose;

const EdicionSchema = new Schema(
  {
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
    estadoEdicion: {
      type: Boolean,
      default: true,
    },
    cursoId: {
      type: Schema.Types.ObjectId,
      ref: "Curso",
      default: null, // permite que el curso en la edición sea opcional
    }, 
  },
);

const Edicion = mongoose.model("Edicion", EdicionSchema);

module.exports = Edicion;

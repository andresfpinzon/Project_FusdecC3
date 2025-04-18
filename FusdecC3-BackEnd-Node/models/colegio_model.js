const mongoose = require("mongoose");
const { Schema } = mongoose;

const ColegioSchema = new Schema({
  /*colegioId: {
    type: Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },*/

  nombreColegio: {
    type: String,
    required: true,
  },

  emailColegio: {
    type: String,
    required: true,
  },

  estadoColegio: {
    type: Boolean,
    default: true,
    required: true,
  },

});

const Colegio = mongoose.model("Colegio", ColegioSchema);
module.exports = Colegio;

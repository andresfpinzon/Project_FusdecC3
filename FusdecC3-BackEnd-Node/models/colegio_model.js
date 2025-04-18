const mongoose = require("mongoose");
const { Schema } = mongoose;

const ColegioSchema = new Schema({

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

const mongoose = require("mongoose");

const {ERoles} = require('../enums/rolesEnum');
const { Schema } = mongoose;

const UsuarioSchema = new Schema({
  /*usuarioId: {
    type: Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },*/
  nombreUsuario: {
    type: String,
    required: true,
  },
  apellidoUsuario: {
    type: String,
    required: true,
  },
  numeroDocumento: {
    type: String,
    required: true,
    unique: true,
  },
  correo: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: {
      type: [String],
      enum: Object.values(ERoles),
      default: [ERoles.Instructor],
    },

  estadoUsuario: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true
});

const Usuario = mongoose.model("Usuario", UsuarioSchema);
module.exports = Usuario;

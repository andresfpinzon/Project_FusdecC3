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
  contraseñaHash: {
    type: String,
    required: true,
  },
  roles: {
      type: [String],
      enum: Object.values(ERoles),
      default: [ERoles.User],
    },

  estadoUsuario: {
    type: Boolean,
    default: true,
    required: true,
  },
  creadoEn: {
    type: Date,
    default: Date.now,
  },
});

const Usuario = mongoose.model("Usuario", UsuarioSchema);
module.exports = Usuario;

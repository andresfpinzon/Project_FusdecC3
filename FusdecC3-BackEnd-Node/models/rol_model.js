const mongoose = require("mongoose");
const { Schema } = mongoose;

const RolSchema = new Schema({
  rolId: {
    type: Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  rolName: {
    type: String,
    required: true,
    unique: true,
  },
});

const Rol = mongoose.model("Rol", RolSchema);
module.exports = Rol;

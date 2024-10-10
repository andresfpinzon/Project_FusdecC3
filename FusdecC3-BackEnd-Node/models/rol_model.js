const mongoose = require('mongoose');
const { Schema } = mongoose;

const RolSchema = new Schema({
  _id: { 
    type: Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() 
}, 
  rolName: { 
    type: String, 
    required: true, 
    unique: true }
});

const Role = mongoose.model('rol', RolSchema);
module.exports = Role;

const mongoose = require("mongoose");
const { Schema } = mongoose;

const CertificadoSchema = new Schema({
   /*certificadoId: {
    type: Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },*/
  fechaEmision: {
    type: Date,
    default: new Date(),
    required: false,
  },
  usuarioId: {
    type: Schema.Types.ObjectId,
    required: false,
    ref: "Usuario",
  },
  cursoId: {
    type: Schema.Types.ObjectId,
    required: false,
    ref: "Curso",
  },
  estudianteId: {
    type: Schema.Types.ObjectId,
    required: false,
    ref: "Estudiante",
  },
  nombreEmisorCertificado: {
    type: String,
    required: true,
  },
  codigoVerificacion: {
    type: String,
    required: false,
    unique: true, // Asegura que el código de verificación sea único
  },
  estadoCertificado: {
    type: Boolean,
    default: true,
    required: false,
  },
});

// Crear el modelo
const Certificado = mongoose.model("Certificado", CertificadoSchema);
module.exports = Certificado;

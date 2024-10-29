const mongoose = require("mongoose");
const { Schema } = mongoose;

const CertificadoSchema = new Schema({
   /*certificadoId: {
    type: Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },*/
  fechaEmision: {
    type: Date,
    required: true,
  },
  usuarioId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Usuario",
  },
  cursoId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Curso",
  },
  estudianteId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Estudiante",
  },
  nombreEmisorCertificado: {
    type: String,
    required: true,
  },
  codigoVerificacion: {
    type: String,
    required: true,
    unique: true, // Asegura que el código de verificación sea único
  },
  estadoCertificado: {
    type: Boolean,
    default: true,
    required: true,
  },
});

// Crear el modelo
const Certificado = mongoose.model("Certificado", CertificadoSchema);
module.exports = Certificado;

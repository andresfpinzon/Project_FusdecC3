const mongoose = require("mongoose");
const { Schema } = mongoose;

const CertificadoSchema = new Schema({
  certificadoId: {
    type: Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  codigoVerificacion: {
    type: String,
    required: true,
  },
  nombreEmisorCertificado: {
    type: String,
    required: true,
  },
  estadoCertificado: {
    type: Boolean,
    default: true,
    required: true,
  },
  estudianteId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Estudiante", // Referencia al modelo Estudiante
  },
  cursoId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Curso", // Referencia al modelo Curso
  },
  usuarioId: {
    type: String,
    maxlength: 450,
    required: true,
  },
});

const Certificado = mongoose.model("Certificado", CertificadoSchema);
module.exports = Certificado;

const mongoose = require("mongoose");
const { Schema } = mongoose;

const EstudianteSchema = new Schema({
  estudianteId: {
    type: Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  nombreEstudiante: {
    type: String,
    required: true,
  },
  apellidoEstudiante: {
    type: String,
    required: true,
  },
  tipoDocumento: {
    type: String,
    required: true,
  },
  numeroDocumento: {
    type: String,
    required: true,
  },
  fechaNacimiento: {
    type: Date,
    required: true,
  },
  generoEstudiante: {
    type: String,
    required: true,
  },
  idUnidad: {
    type: Schema.Types.ObjectId,
    ref: "Unidad",
    required: true,
  },
  idEscuela: {
    type: Schema.Types.ObjectId,
    ref: "Escuela",
    required: true,
  },
  certificado: {
    type: Schema.Types.ObjectId,
    ref: "Certificado",
  },
  estadoEstudiante: {
    type: Boolean,
    required: true,
  },
  edicionesEstudiante: [
    {
      type: Schema.Types.ObjectId, // Referencia a EstudianteEdicion
      ref: "EdicionEstudiante",
    },
  ],
  calificacionesEstudiante: [
    {
      type: Schema.Types.ObjectId, // Referencia a EstudianteCalificacion
      ref: "CalificacionEstudiante",
    },
  ],
  inasistenciasEstudiante: [
    {
      type: Schema.Types.ObjectId, //Referencia a InasistenciaEstudiante
      ref: "InasistenciaEstudiante",
    },
  ],
  asistenciasEstudiante: [
    {
      type: Schema.Types.ObjectId, // Referencia a AsistenciaEstudiante
      ref: "AsistenciaEstudiante",
    },
  ], 
  certificados: [
    {
      type: Schema.Types.ObjectId, // Referencia a múltiples Certificados
      ref: "Certificado",
    },
  ],
});

const Estudiante = mongoose.model("Estudiante", EstudianteSchema);
module.exports = Estudiante;

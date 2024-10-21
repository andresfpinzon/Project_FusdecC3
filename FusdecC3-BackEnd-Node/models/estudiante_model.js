const mongoose = require("mongoose");
const { Schema } = mongoose;

const EstudianteSchema = new Schema({
  /*estudianteId: {
    type: Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },*/
  nombreEstudiante: {
    type: String,
    required: true,
  },
  apellidoEstudiante: {
    type: String,
    required: true,
  },
  correoEstudiante: {
    type: String,
    required: true,
    unique: true,
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
  unidadId: {
    type: Schema.Types.ObjectId,
    ref: "Unidad",
    required: true,
  },
  colegioId: {
    type: Schema.Types.ObjectId,
    ref: "Colegio",
    required: true,
  },
  estadoEstudiante: {
    type: Boolean,
    default: true,
    required: true,
  },
  ediciones: [
    {
      type: Schema.Types.ObjectId, // Referencia a múltiples Ediciones
      ref: "Edicion",
    },
  ],
  calificaciones: [
    {
      type: Schema.Types.ObjectId, // Referencia a múltiples Calificaciones
      ref: "Calificacion",
      required: false,
    },
  ],
  inasistencias: [
    {
      type: Schema.Types.ObjectId, //Referencia a múltiples Inasistencias
      ref: "Inasistencia",
      required: false,
    },
  ],
  asistencias: [
    {
      type: Schema.Types.ObjectId, // Referencia a múltiples Asistencias
      ref: "Asistencia",
      required: false,
    },
  ], 
  certificados: [
    {
      type: Schema.Types.ObjectId, // Referencia a múltiples Certificados
      ref: "Certificado",
      required: false,
    },
  ],
});

const Estudiante = mongoose.model("Estudiante", EstudianteSchema);
module.exports = Estudiante;

const mongoose = require("mongoose");
const { Schema } = mongoose;

const AuditoriaSchema = new Schema({
    /*auditoriaId: {
         type: Schema.Types.ObjectId,
         default: () => new mongoose.Types.ObjectId(),
     },*/
    fechaAuditoria: {
        type: Date,
        required: true,
    },
    nombreEmisor: {
        type: String,
        required: true,
    },
    certificadoId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Certificado", // Referencia al modelo Certificado
    },
    estadoAuditoria: {
        type: Boolean,
        default: true,
        required: true,
      },
});

const Auditoria = mongoose.model("Auditoria", AuditoriaSchema);
module.exports = Auditoria;

package models.administrativo.auditoria.model

import java.sql.Date
import java.text.SimpleDateFormat

data class AuditoriaModel(
    val _id: String,
    val fechaAuditoria: Date,
    val nombreEmisor: String,
    val certificadoId: String,
    val estadoAuditoria: Boolean
) {
    companion object {
        private val dateFormat = SimpleDateFormat("yyyy-MM-dd")

        // Auditoría 1 - Certificado de programación (CERT-001)
        val auditoria1 = AuditoriaModel(
            _id = "AUD-001",
            fechaAuditoria = Date(dateFormat.parse("2023-10-01").time),
            nombreEmisor = "Carlos Gómez",
            certificadoId = "CERT-001", // ID del certificado de programación
            estadoAuditoria = true
        )

        // Auditoría 2 - Certificado de diseño gráfico (CERT-002)
        val auditoria2 = AuditoriaModel(
            _id = "AUD-002",
            fechaAuditoria = Date(dateFormat.parse("2023-10-02").time),
            nombreEmisor = "Ana Pérez",
            certificadoId = "CERT-002", // ID del certificado de diseño gráfico
            estadoAuditoria = true
        )

        // Lista de auditorías quemadas
        val auditoriasQuemadas = listOf(auditoria1, auditoria2)
    }

    override fun toString(): String {
        val dateFormatStr = SimpleDateFormat("yyyy-MM-dd")
        return """
            |Auditoría #$_id
            |Fecha: ${dateFormatStr.format(fechaAuditoria)}
            |Emisor: $nombreEmisor
            |Certificado ID: $certificadoId
            |Estado: ${if (estadoAuditoria) "Aprobada" else "Rechazada"}
        """.trimMargin()
    }
}
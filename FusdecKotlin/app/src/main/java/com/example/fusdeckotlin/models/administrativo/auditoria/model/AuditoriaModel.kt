package models.administrativo.auditoria.model

import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.util.UUID

data class AuditoriaModel(
    private val _id: String = generarId(),
    private val fechaAuditoria: String = obtenerFechaActual(),
    private val nombreEmisor: String,
    private val certificadoId: String = generarIdCertificado(),
    private var estadoAuditoria: Boolean = true
) {

    fun getNombreEmisorAuditoria(): String = nombreEmisor
    fun getIdAuditoria() : String = _id
    fun getFechaAuditoria() : String = fechaAuditoria
    fun getCertificadoAuditoria(): String = certificadoId
    fun getEstadoAuditoria(): Boolean = estadoAuditoria

    /*
    Setters
    */
    fun setEstadoAuditoria(newState: Boolean) {
        estadoAuditoria = newState
    }

    companion object {
        // Lista de auditorías quemadas
        fun generarId(): String {
            return UUID.randomUUID().toString()
        }

        fun obtenerFechaActual(): String {
            val formato = DateTimeFormatter.ofPattern("yyyy-MM-dd")
            return LocalDate.now().format(formato)
        }

        fun generarIdCertificado(): String {
            return UUID.randomUUID().toString().substring(0, 8)
        }
    }
}
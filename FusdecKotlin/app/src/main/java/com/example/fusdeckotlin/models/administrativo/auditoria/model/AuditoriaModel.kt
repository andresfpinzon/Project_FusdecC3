package models.administrativo.auditoria.model

import com.google.gson.annotations.SerializedName
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.util.UUID

data class AuditoriaModel(
    @SerializedName("_id")
    private val _id: String? = null,
    @SerializedName("fechaAuditoria")
    private val fechaAuditoria: String = obtenerFechaActual(),
    @SerializedName("nombreEmisor")
    private val nombreEmisor: String,
    @SerializedName("certificadoId")
    private val certificadoId: String,
    @SerializedName("estadoAuditoria")
    private var estadoAuditoria: Boolean = true
) {

    fun getNombreEmisorAuditoria(): String = nombreEmisor
    fun getIdAuditoria() : String = _id.toString()
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
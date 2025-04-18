package com.example.fusdeckotlin.models.administrativo.auditoria

import com.google.gson.annotations.SerializedName
import com.example.fusdeckotlin.models.administrativo.certificado.Certificado
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.util.UUID

data class Auditoria(
    @SerializedName("_id")
    private val _id: String? = null,
    @SerializedName("fechaAuditoria")
    private val fechaAuditoria: String = obtenerFechaActual(),
    @SerializedName("nombreEmisor")
    private val nombreEmisor: String,
    @SerializedName("certificadoId")
    private val certificadoId: Any,
    @SerializedName("estadoAuditoria")
    private var estadoAuditoria: Boolean = true
) {

    fun getNombreEmisorAuditoria(): String = nombreEmisor
    fun getIdAuditoria() : String = _id.toString()
    fun getFechaAuditoria() : String = fechaAuditoria
    fun getCertificadoId(): String {
        return when(certificadoId) {
            is String -> certificadoId as String
            //is Certificado -> (certificadoId as Certificado).getIdCertificado()
            is Map<*, *> -> (certificadoId as Map<*, *>)["_id"] as? String ?: ""
            else -> ""
        }
    }

//    fun getCertificateObject(): Certificado {
//        return when(certificadoId) {
//            is Certificado -> certificadoId as Certificado
//            is String -> createCertifiacteEmpty(certificadoId as String)
//            is Map<*, *> -> convertMapToCetificate(certificadoId as Map<*, *>)
//            else -> createCertifiacteEmpty("")
//        }
//    }

//    fun createCertifiacteEmpty(id: String): Certificado {
//        return Certificado(
//            id = id,
//            usuarioId = "",
//            cursoId = "",
//            estudianteId = "",
//            nombreEmisorCertificado = ""
//        )
//    }

//    fun convertMapToCetificate(map: Map<*,*>): Certificado {
//        return Certificado(
//            id = map["_id"] as? String ?: "",
//            usuarioId = map["usuarioId"] as? String ?: "",
//            cursoId = map["cursoId"] as? String ?: "",
//            estudianteId = map["estudianteId"] as? String ?: "",
//            nombreEmisorCertificado = map["nombreEmisorCertificado"] as? String ?: ""
//
//        )
//    }

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
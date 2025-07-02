package com.example.fusdeckotlin.models.administrativo.auditoria

import com.google.gson.annotations.SerializedName
import com.example.fusdeckotlin.models.administrativo.certificado.Certificado
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.util.UUID

data class Auditoria(
    @SerializedName("id")
    private val id: String? = null,
    @SerializedName("fecha")
    private val fechaAuditoria: String,
    @SerializedName("nombreEmisor")
    private val nombreEmisor: String,
    @SerializedName("certificadoId")
    private val certificadoId: Int,
    @SerializedName("estadoAuditoria")
    private var estadoAuditoria: Boolean = true
) {

    fun getNombreEmisor(): String = nombreEmisor
    fun getIdAuditoria() : String = id.toString()
    fun getFechaAuditoria() : String = fechaAuditoria
    fun getCertificadoId(): String = certificadoId.toString()

    fun getEstado(): Boolean = estadoAuditoria

}
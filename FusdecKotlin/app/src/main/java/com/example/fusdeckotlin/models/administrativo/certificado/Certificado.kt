package com.example.fusdeckotlin.models.administrativo.certificado

import com.google.gson.annotations.SerializedName
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import kotlin.random.Random

data class Certificado(
    @SerializedName("id")
    private val id: Int,
    @SerializedName("fechaEmision")
    private val fechaEmision: String = obtenerFechaActual(),
    @SerializedName("usuarioId")
    private val usuarioId: String,
    @SerializedName("estudianteId")
    private val estudianteId: String,
    @SerializedName("nombreEmisor")
    private val nombreEmisor: String,
    @SerializedName("codigoVerificacion")
    private val codigoVerificacion: String = generarCodigoVerificacion(),
    @SerializedName("estado")
    private val estado: Boolean = true,
    @SerializedName("create_at")
    private val createdAt: String? = null
) {
    fun getId(): Int = id
    fun getFechaEmision(): String = fechaEmision
    fun getUsuarioId(): String = usuarioId
    fun getEstudiante(): String = estudianteId
    fun getNombreEmisor(): String = nombreEmisor
    fun getCodigoVerificacion(): String = codigoVerificacion
    fun getEstado(): Boolean = estado
    fun getCreateAt(): String? = createdAt

    companion object {
        // Genera un código de verificación aleatorio de 8 caracteres
        private fun generarCodigoVerificacion(): String {
            val caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
            return (1..8)
                .map { caracteres.random() }
                .joinToString("")
        }

        // Obtiene la fecha y hora actual en formato "yyyy-MM-dd HH:mm:ss"
        private fun obtenerFechaActual(): String {
            val formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")
            return LocalDateTime.now().format(formatter)
        }
    }
}
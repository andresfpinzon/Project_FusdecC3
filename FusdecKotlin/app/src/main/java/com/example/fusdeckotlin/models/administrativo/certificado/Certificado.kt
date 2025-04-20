package com.example.fusdeckotlin.models.administrativo.certificado

import com.google.gson.annotations.SerializedName


data class Certificado(
    @SerializedName("id")
    private val id: Int,
    @SerializedName("fechaEmision")
    private val fechaEmision: String,
    @SerializedName("usuarioId")
    private val usuarioId: String,
    @SerializedName("estudianteId")
    private val estudianteId: String,
    @SerializedName("nombreEmisor")
    private val nombreEmisor: String,
    @SerializedName("codigoVerificacion")
    private val codigoVerificacion: String,
    @SerializedName("estado")
    private val estado: Boolean = true,
    @SerializedName("create_at")
    private val createdAt: String?
){
    fun getId(): Int = id
    fun getFechaEmision(): String = fechaEmision
    fun getUsuarioId(): String = usuarioId
    fun getEstudiante(): String = estudianteId
    fun getNombreEmisor(): String = nombreEmisor
    fun getCodigoVerificacion(): String = codigoVerificacion
    fun getEstado(): Boolean = estado
    fun getCreateAt(): String? = createdAt
}
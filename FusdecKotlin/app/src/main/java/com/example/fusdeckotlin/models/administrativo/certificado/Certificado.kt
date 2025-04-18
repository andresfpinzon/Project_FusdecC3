package com.example.fusdeckotlin.models.administrativo.certificado

import com.google.gson.annotations.SerializedName


data class Certificado(
    @SerializedName("_id")
    private val id: String? = null,
    @SerializedName("fechaEmision")
    private val fechaEmision: String ,
    @SerializedName("usuarioId")
    private val usuarioId: Any,
    @SerializedName("usuarioId")
    private val cursoId: Any,
    @SerializedName("estudianteId")
    private val estudianteId: Any,
    @SerializedName("nombreEmisorCertificado")
    private var nombreEmisorCertificado: String,
    @SerializedName("codigoVerificacion")
    private val codigoVerificacion: String,
    @SerializedName("estadoCertificado")
    private var estadoCertificado: Boolean = true
)
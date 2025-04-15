package com.example.fusdeckotlin.dto.administrativo.certificado

import com.google.gson.annotations.SerializedName

data class UpdateCertificadoDto(
    @SerializedName("usuarioId")
    private val usuarioId: String? = null,
    @SerializedName("usuarioId")
    private val cursoId: String? = null,
    @SerializedName("estudianteId")
    private val estudianteId: String? = null,
    @SerializedName("nombreEmisorCertificado")
    private var nombreEmisorCertificado: String? = null,
)

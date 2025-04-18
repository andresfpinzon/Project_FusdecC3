package com.example.fusdeckotlin.dto.administrativo.certificado

import com.google.gson.annotations.SerializedName

data class CreateCertificadoDto(
    @SerializedName("usuarioId")
    private val usuarioId: String?,
    @SerializedName("usuarioId")
    private val cursoId: String?,
    @SerializedName("estudianteId")
    private val estudianteId: String?,
    @SerializedName("nombreEmisorCertificado")
    private var nombreEmisorCertificado: String?,
)

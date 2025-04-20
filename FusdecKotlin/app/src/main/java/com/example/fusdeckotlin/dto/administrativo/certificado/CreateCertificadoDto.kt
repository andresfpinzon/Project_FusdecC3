package com.example.fusdeckotlin.dto.administrativo.certificado

import com.google.gson.annotations.SerializedName

data class CreateCertificadoDto(
    @SerializedName("usuarioId")
    private val usuarioId: String?,
    @SerializedName("estudianteId")
    private val estudianteId: String?,
    @SerializedName("nombreEmisor")
    private var nombreEmisor: String?,
)

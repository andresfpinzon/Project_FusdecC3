package com.example.fusdeckotlin.dto.administrativo.certificado

import com.google.gson.annotations.SerializedName

data class UpdateCertificadoDto(
    @SerializedName("usuarioId") var usuarioId: String? = null,
    @SerializedName("estudianteId") var estudianteId: String? = null,
    @SerializedName("nombreEmisor") var nombreEmisor: String? = null
)

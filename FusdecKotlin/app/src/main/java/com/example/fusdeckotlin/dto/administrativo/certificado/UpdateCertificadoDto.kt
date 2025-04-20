package com.example.fusdeckotlin.dto.administrativo.certificado

import com.google.gson.annotations.SerializedName

data class UpdateCertificadoDto(
    @SerializedName("fechaEmision")
     var fechaEmision: String? = null,

    @SerializedName("usuarioId")
     var usuarioId: String? = null,

    @SerializedName("estudianteId")
     var estudianteId: String? = null,

    @SerializedName("nombreEmisor")
     var nombreEmisor: String? = null,

    @SerializedName("codigoVerificacion")
     var codigoVerificacion: String? = null,

    @SerializedName("estado")
     var estado: Boolean? = null
)

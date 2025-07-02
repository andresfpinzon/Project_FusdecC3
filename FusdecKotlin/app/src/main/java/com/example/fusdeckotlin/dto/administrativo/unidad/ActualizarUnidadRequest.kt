package com.example.fusdeckotlin.dto.administrativo.unidad

import com.google.gson.annotations.SerializedName

data class ActualizarUnidadRequest(
    @SerializedName("nombreUnidad")
    val nombreUnidad: String? = null,

    @SerializedName("brigadaId")
    val brigadaId: Int? = null,

    @SerializedName("estadoUnidad")
    val estadoUnidad: Boolean? = null,

    @SerializedName("usuarioId")
    val usuarioId: String? = null
)

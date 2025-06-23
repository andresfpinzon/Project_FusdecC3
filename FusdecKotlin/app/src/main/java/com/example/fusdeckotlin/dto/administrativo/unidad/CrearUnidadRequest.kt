package com.example.fusdeckotlin.dto.administrativo.unidad

import com.google.gson.annotations.SerializedName

data class CrearUnidadRequest(
    @SerializedName("nombreUnidad")
    val nombreUnidad: String,

    @SerializedName("brigadaId")
    val brigadaId: Int,

    @SerializedName("usuarioId")
    val usuarioId: String
)
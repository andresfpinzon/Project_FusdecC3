package com.example.fusdeckotlin.dto.administrativo.unidad

import com.google.gson.annotations.SerializedName

data class CreateUnidadDto(
    @SerializedName("nombreUnidad")
    var nombreUnidad: String,
    @SerializedName("brigadaId")
    var brigadaId: String,
    @SerializedName("usuarioId")
    var usuarioId: String,
    @SerializedName("comandos")
    var comandos: List<String>,
    @SerializedName("estudiantes")
    var estudiantes: List<String>
)

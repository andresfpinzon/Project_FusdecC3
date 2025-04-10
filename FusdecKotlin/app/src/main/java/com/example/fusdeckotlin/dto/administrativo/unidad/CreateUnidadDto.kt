package com.example.fusdeckotlin.dto.administrativo.unidad

import com.google.gson.annotations.SerializedName

data class CreateUnidadDto(
    @SerializedName("nombreUnidad")
    private var nombreUnidad: String,
    @SerializedName("brigadaId")
    private var brigadaId: String,
    @SerializedName("usuarioId")
    private var usuarioId: String,
    @SerializedName("comandos")
    private var comandos: List<String>,
    @SerializedName("estudiantes")
    private var estudiantes: List<String>
)

package com.example.fusdeckotlin.dto.administrativo.unidad

import com.google.gson.annotations.SerializedName

data class UpdateUnidadDto(
    @SerializedName("nombreUnidad")
     var nombreUnidad: String? = null,
    @SerializedName("brigadaId")
     var brigadaId: String? = null,
    @SerializedName("estadoUnidad")
     var estadoUnidad: Boolean? = null,
    @SerializedName("usuarioId")
     var usuarioId: String? = null,
    @SerializedName("comandos")
     var comandos: List<String>? = null,
    @SerializedName("estudiantes")
     var estudiantes: List<String> ? = null
)

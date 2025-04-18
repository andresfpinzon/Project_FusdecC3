package com.example.fusdeckotlin.dto.administrativo.unidad

import com.google.gson.annotations.SerializedName

data class CrearUnidadRequest(
    @SerializedName("nombreUnidad")
    var nombreUnidad: String?,
    @SerializedName("brigadaId")
    var brigadaId: String?,
    @SerializedName("usuarioId")
    var usuarioId: String?,
)

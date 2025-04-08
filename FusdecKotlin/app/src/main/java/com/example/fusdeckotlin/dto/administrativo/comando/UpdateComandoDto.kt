package com.example.fusdeckotlin.dto.administrativo.comando

import com.google.gson.annotations.SerializedName

data class UpdateComandoDto(
    @SerializedName("nombreComando")
    var nombreComando: String,

    @SerializedName("estadoComadno")
    var estadoComando: Boolean,

    @SerializedName("ubicacionComando")
    var ubicacionComando: String,

    @SerializedName("fundacionId")
    var fundacionId: String,

    @SerializedName("brigadas")
    var brigadas: List<String>
)

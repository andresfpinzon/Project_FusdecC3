package com.example.fusdeckotlin.dto.administrativo.comando

import com.google.gson.annotations.SerializedName

data class CreateComandoDto(
    @SerializedName("nombreComando")
    var nombreComando: String?,

    @SerializedName("ubicacionComando")
    var ubicacionComando: String?,

    @SerializedName("fundacionId")
    var fundacionId: String?,

    @SerializedName("brigadas")
    var brigadas: List<String>?
)

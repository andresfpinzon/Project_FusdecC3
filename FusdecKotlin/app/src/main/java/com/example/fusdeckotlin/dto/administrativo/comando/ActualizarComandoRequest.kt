package com.example.fusdeckotlin.dto.administrativo.comando

import com.google.gson.annotations.SerializedName

data class ActualizarComandoRequest(
    @SerializedName("nombreComando")
    val nombreComando: String? = null,

    @SerializedName("estadoComando")
    val estadoComando: Boolean? = null,

    @SerializedName("ubicacionComando")
    val ubicacionComando: String? = null,

    @SerializedName("fundacionId")
    val fundacionId: Int? = null
)
package com.example.fusdeckotlin.dto.administrativo.comando

import com.google.gson.annotations.SerializedName

data class CrearComandoRequest(
    @SerializedName("nombreComando")
    val nombreComando: String,

    @SerializedName("ubicacionComando")
    val ubicacionComando: String,

    @SerializedName("fundacionId")
    val fundacionId: Int
)

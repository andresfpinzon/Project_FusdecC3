package com.example.fusdeckotlin.dto.administrativo.brigada

import com.google.gson.annotations.SerializedName

data class CrearBrigadaRequest(
    @SerializedName("nombreBrigada")
    val nombreBrigada: String,

    @SerializedName("ubicacionBrigada")
    val ubicacionBrigada: String,

    @SerializedName("estadoBrigada")
    val estadoBrigada: Boolean = true,

    @SerializedName("comandoId")
    val comandoId: Int
)

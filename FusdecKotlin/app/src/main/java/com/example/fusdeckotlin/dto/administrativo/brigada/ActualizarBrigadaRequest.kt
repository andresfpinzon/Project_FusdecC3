package com.example.fusdeckotlin.dto.administrativo.brigada

import com.google.gson.annotations.SerializedName

data class ActualizarBrigadaRequest(
    @SerializedName("nombreBrigada")
    val nombreBrigada: String? = null,

    @SerializedName("ubicacionBrigada")
    val ubicacionBrigada: String? = null,

    @SerializedName("estadoBrigada")
    val estadoBrigada: Boolean? = null,

    @SerializedName("comandoId")
    val comandoId: Int? = null
)

package com.example.fusdeckotlin.dto.administrativo.brigada

import com.example.fusdeckotlin.models.administrativo.brigada.Brigada
import com.google.gson.annotations.SerializedName

data class CrearBrigadaRequest(
    @SerializedName("nombreBrigada")
    var nombreBrigada: String?,

    @SerializedName("ubicacionBrigada")
    var ubicacionBrigada: String?,

    @SerializedName("estadoBrigada")
     var estadoBrigada: Boolean? = true,

    @SerializedName("comandoId")
    var comandoId: String?,
)

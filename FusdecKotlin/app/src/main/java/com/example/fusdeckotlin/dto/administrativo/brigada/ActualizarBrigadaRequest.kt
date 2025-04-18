package com.example.fusdeckotlin.dto.administrativo.brigada

import com.example.fusdeckotlin.models.administrativo.brigada.Brigada
import com.google.gson.annotations.SerializedName

data class ActualizarBrigadaRequest(
    @SerializedName("nombreBrigada")
    var nombreBrigada: String? = null,

    @SerializedName("ubicacionBrigada")
    var ubicacionBrigada: String? = null,

    @SerializedName("estadoBrigada")
    var estadoBrigada: Boolean? = null,

    @SerializedName("comandoId")
    var comandoId: String? = null

)

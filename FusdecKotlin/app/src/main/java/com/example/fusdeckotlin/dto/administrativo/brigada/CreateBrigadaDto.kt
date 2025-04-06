package com.example.fusdeckotlin.dto.administrativo.brigada

import com.google.gson.annotations.SerializedName

data class CreateBrigadaDto(
    @SerializedName("nombreBrigada")
    var nombreBrigada: String? = null,

    @SerializedName("ubicacionBrigada")
    var ubicacionBrigada: String? = null,

    @SerializedName("estadoBrigada")
     var estadoBrigada: Boolean? = null,

    @SerializedName("comandoId")
    var comandoId: String? = null,

    @SerializedName("unidades")
    private var unidades: List<String>? = null
)

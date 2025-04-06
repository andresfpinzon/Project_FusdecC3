package com.example.fusdeckotlin.dto.administrativo.brigada

import com.google.gson.annotations.SerializedName

data class CreateBrigadaDto(
    @SerializedName("nombreBrigada")
    var nombreBrigada: String,

    @SerializedName("ubicacionBrigada")
    var ubicacionBrigada: String,

    @SerializedName("estadoBrigada")
     var estadoBrigada: Boolean = true,

    @SerializedName("comandoId")
    var comandoId: String,

    @SerializedName("unidades")
    private var unidades: List<String>
)

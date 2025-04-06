package com.example.fusdeckotlin.dto.administrativo.brigada

import com.google.gson.annotations.SerializedName

data class UpdateBrigadaDto(
    @SerializedName("nombreBrigada")
    var nombreBrigada: String? = null,

    @SerializedName("ubicacionBrigada")
    var ubicacionBrigada: String? = null,

    @SerializedName("estadoBrigada")
    var estadoBrigada: Boolean? = null,

    @SerializedName("comandoId")
    var comandoId: String? = null,

    @SerializedName("unidades")
    var unidades: List<String>? = null
){
    companion object{
        fun from(
            nombreBrigada: String? = null,
            ubicacionBrigada: String? = null,
            estadoBrigada: Boolean?= null,
            comandoId: String? = null,
            unidades: List<String>? = null
        ):UpdateBrigadaDto{
            return UpdateBrigadaDto(
                nombreBrigada = nombreBrigada,
                ubicacionBrigada = ubicacionBrigada,
                estadoBrigada = estadoBrigada,
                comandoId = comandoId,
                unidades = unidades
            )
        }
    }
}

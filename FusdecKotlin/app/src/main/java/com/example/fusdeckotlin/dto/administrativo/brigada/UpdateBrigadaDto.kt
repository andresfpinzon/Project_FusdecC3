package com.example.fusdeckotlin.dto.administrativo.brigada

import com.example.fusdeckotlin.models.administrativo.brigada.Brigada
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
        fun from(data: UpdateBrigadaDto): Brigada{
            return Brigada(
                nombreBrigada = data.nombreBrigada ?: "",
                ubicacionBrigada = data.ubicacionBrigada ?: "",
                estadoBrigada = data.estadoBrigada ?: true,
                comandoId = data.comandoId ?: "",
                unidades = data.unidades ?: emptyList()
            )
        }
    }
}

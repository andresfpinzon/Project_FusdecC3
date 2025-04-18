package com.example.fusdeckotlin.dto.administrativo.brigada

import com.example.fusdeckotlin.models.administrativo.brigada.Brigada
import com.google.gson.annotations.SerializedName

data class CreateBrigadaDto(
    @SerializedName("nombreBrigada")
    var nombreBrigada: String?,

    @SerializedName("ubicacionBrigada")
    var ubicacionBrigada: String?,

    @SerializedName("estadoBrigada")
     var estadoBrigada: Boolean? = true,

    @SerializedName("comandoId")
    var comandoId: String?,

    @SerializedName("unidades")
    var unidades: List<String>?
){
    companion object{
        fun from(data: CreateBrigadaDto): Brigada {
            return Brigada (
                nombreBrigada = data.nombreBrigada!!,
                ubicacionBrigada = data.ubicacionBrigada!!,
                estadoBrigada = data.estadoBrigada!!,
                comandoId = data.comandoId!!,
                unidades = data.unidades!!
            )
        }
    }
}

package com.example.fusdeckotlin.dto.administrativo.brigada

import com.google.gson.annotations.SerializedName

data class CrearBrigadaRequest (
    @SerializedName("nombreBrigda")
    var nombreBrigada: String,

    @SerializedName("ubicacionBrigada")
    var ubicacionBrigada: String,

    @SerializedName("estadoBrigada")
    var estadoBrigada: Boolean = true,

    @SerializedName("comandoId")
    var comandoId: String,

    @SerializedName("unidades")
    var unidades: List<String> = emptyList()
){
    companion object {
        fun from(
            nombreBrigada: String,
            ubicacionBrigada: String,
            estadoBrigada: Boolean = true,
            comandoId: String,
            unidades: List<String> = emptyList()
        ): CrearBrigadaRequest {
            return CrearBrigadaRequest(
                nombreBrigada = nombreBrigada,
                ubicacionBrigada = ubicacionBrigada,
                estadoBrigada = estadoBrigada,
                comandoId = comandoId,
                unidades = unidades
            )
        }
    }
}
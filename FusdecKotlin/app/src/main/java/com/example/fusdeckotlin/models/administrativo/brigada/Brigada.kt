package com.example.fusdeckotlin.models.administrativo.brigada

import com.google.gson.annotations.SerializedName

data class Brigada(
    @SerializedName("id") private val id: Int,
    @SerializedName("nombreBrigada") private var nombreBrigada: String,
    @SerializedName("ubicacionBrigada") private var ubicacionBrigada: String,
    @SerializedName("estadoBrigada") private var estadoBrigada: Boolean = true,
    @SerializedName("comandoId") private var comandoId: Int
) {

    fun getId(): Int = id
    fun getNombreBrigada(): String = nombreBrigada
    fun getUbicacionBrigada(): String = ubicacionBrigada
    fun getEstadoBrigada(): Boolean = estadoBrigada
    fun getComandoId(): Int = comandoId

    override fun toString(): String {
        return "Brigada(id=${getId()}, nombreBrigada='${getNombreBrigada()}', " +
                "ubicacionBrigada='${getUbicacionBrigada()}', estadoBrigada=${getEstadoBrigada()}, " +
                "comandoId=${getComandoId()})"
    }
}
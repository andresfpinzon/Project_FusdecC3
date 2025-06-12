package com.example.fusdeckotlin.models.administrativo.brigada

import com.example.fusdeckotlin.models.administrativo.comando.Comando
import com.example.fusdeckotlin.models.administrativo.unidad.Unidad
import com.google.gson.annotations.SerializedName

data class Brigada(
    @SerializedName("id")
    private val id: String? = null,
    @SerializedName("nombreBrigada")
    private var nombreBrigada: String,
    @SerializedName("ubicacionBrigada")
    private var ubicacionBrigada: String,
    @SerializedName("estadoBrigada")
    private var estadoBrigada: Boolean = true,
    @SerializedName("comandoId")
    private var comandoId: Int
) {
    // Getters básicos
    fun getId() = id.toString()
    fun getNombreBrigada() = nombreBrigada
    fun getUbicacionBrigada() = ubicacionBrigada
    fun getEstadoBrigada() = estadoBrigada
    fun getComandoId(): Int = comandoId
}
package com.example.fusdeckotlin.models.administrativo.comando

import com.google.gson.annotations.SerializedName

data class Comando(
    @SerializedName("id") private val id: Int,
    @SerializedName("nombreComando") private var nombreComando: String,
    @SerializedName("estadoComando") private var estadoComando: Boolean = true,
    @SerializedName("ubicacionComando") private var ubicacionComando: String,
    @SerializedName("fundacionId") private var fundacionId: Int
) {

    fun getId(): Int = id
    fun getNombreComando(): String = nombreComando
    fun getEstadoComando(): Boolean = estadoComando
    fun getUbicacionComando(): String = ubicacionComando
    fun getFundacionId(): Int = fundacionId

    override fun toString(): String {
        return "Comando(id=${getId()}, nombre='${getNombreComando()}', ubicación='${getUbicacionComando()}', " +
                "fundacionId=${getFundacionId()})"
    }
}

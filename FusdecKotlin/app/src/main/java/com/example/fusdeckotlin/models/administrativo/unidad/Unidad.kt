package com.example.fusdeckotlin.models.administrativo.unidad

import com.google.gson.annotations.SerializedName

data class Unidad(
    @SerializedName("id") private val id: Int,
    @SerializedName("nombreUnidad") private var nombreUnidad: String,
    @SerializedName("brigadaId") private var brigadaId: Int,
    @SerializedName("estadoUnidad") private var estadoUnidad: Boolean = true,
    @SerializedName("usuarioId") private var usuarioId: String
) {
    // Funciones get() para acceder a las propiedades
    fun getId(): Int = id
    fun getNombreUnidad(): String = nombreUnidad
    fun getBrigadaId(): Int = brigadaId
    fun getEstadoUnidad(): Boolean = estadoUnidad
    fun getUsuarioId(): String = usuarioId

    override fun toString(): String {
        return "Unidad(id=${getId()}, nombre='${getNombreUnidad()}', " +
                "brigadaId=${getBrigadaId()}, usuarioId=${getUsuarioId()})"
    }
}
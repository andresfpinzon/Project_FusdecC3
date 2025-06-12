package com.example.fusdeckotlin.models.administrativo.unidad

import com.example.fusdeckotlin.models.administrativo.brigada.Brigada
import com.google.gson.annotations.SerializedName
import com.example.fusdeckotlin.models.administrativo.user.model.Usuario

data class Unidad(
    @SerializedName("id")
    private val id: Long? = null,
    @SerializedName("nombreUnidad")
    private var nombreUnidad: String,
    @SerializedName("brigadaId")
    private var brigadaId: Int,
    @SerializedName("estadoUnidad")
    private var estadoUnidad: Boolean = true,
    @SerializedName("usuarioId")
    private var usuarioId: String,
) {
    fun getId() = id
    fun getNombreUnidad() = nombreUnidad
    fun getBrigadaId() = brigadaId
    fun getEstadoUnidad() = estadoUnidad
    fun getUsuarioId() = usuarioId

}
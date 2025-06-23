package com.example.fusdeckotlin.models.root.fundacion

import com.example.fusdeckotlin.models.administrativo.comando.Comando
import com.google.gson.annotations.SerializedName

class Fundacion(
    @SerializedName("id") private val id: Int,
    @SerializedName("nombre") private var nombreFundacion: String,
    @SerializedName("estado") private var estadoFundacion: Boolean = true,
) {
    // Getters básicos
    fun getId(): Int = id
    fun getNombreFundacion(): String = nombreFundacion
    fun getEstadoFundacion(): Boolean = estadoFundacion

    override fun toString(): String {
        return "Fundacion(id='$id', nombre='$nombreFundacion', estado=$estadoFundacion)"
    }
}
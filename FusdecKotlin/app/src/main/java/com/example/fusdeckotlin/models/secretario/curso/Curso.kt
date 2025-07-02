package com.example.fusdeckotlin.models.secretario.curso

import com.google.gson.annotations.SerializedName

data class Curso(
    @SerializedName("id") private val id: Int,
    @SerializedName("nombre") private var nombre: String,
    @SerializedName("descripcion") private var descripcion: String,
    @SerializedName("intensidadHoraria") private var intensidadHoraria: String,
    @SerializedName("fundacionId") private var fundacionId: Int,
    @SerializedName("estado") private var estado: Boolean = true
) {
    // Funciones get() para acceder a las propiedades
    fun getId(): Int = id
    fun getNombre(): String = nombre
    fun getDescripcion(): String = descripcion
    fun getIntensidadHoraria(): String = intensidadHoraria
    fun getFundacionId(): Int = fundacionId
    fun getEstado(): Boolean = estado

    override fun toString(): String {
        return "Curso(id=${getId()}, nombre='${getNombre()}', " +
                "intensidadHoraria='${getIntensidadHoraria()}', fundacionId=${getFundacionId()})"
    }
}
package com.example.fusdeckotlin.models.secretario.edicion

import com.google.gson.annotations.SerializedName
import java.time.LocalDate

data class Edicion(
    @SerializedName("id") private val id: Long,
    @SerializedName("titulo") private var nombre: String,
    @SerializedName("fechaInicio") private var fechaInicio: String,
    @SerializedName("fechaFin") private var fechaFin: String,
    @SerializedName("cursoId") private var cursoId: Int?,
    @SerializedName("estado") private var estado: Boolean = true
) {
    // Funciones get() para acceder a las propiedades
    fun getId(): Long = id
    fun getNombre(): String = nombre

    fun getFechaInicio(): LocalDate = LocalDate.parse(fechaInicio.substring(0, 10))
    fun getFechaFin(): LocalDate = LocalDate.parse(fechaFin.substring(0, 10))
    fun getCursoId(): Int? = cursoId
    fun getEstado(): Boolean = estado

    override fun toString(): String {
        return "Edicion(id=${getId()}, nombre='${getNombre()}', " +
                "fechas=${getFechaInicio()} a ${getFechaFin()}, " +
                "cursoId=${getCursoId()})"
    }
}
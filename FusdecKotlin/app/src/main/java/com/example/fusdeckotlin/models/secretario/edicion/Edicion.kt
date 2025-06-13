package com.example.fusdeckotlin.models.secretario.edicion

import com.example.fusdeckotlin.models.secretario.curso.Curso
import com.google.gson.annotations.SerializedName
import java.time.LocalDate

class Edicion(
    @SerializedName("id") private val id: String,
    @SerializedName("titulo") private var nombreEdicion: String,
    @SerializedName("fechaInicio") private var fechaInicioString: String,
    @SerializedName("fechaFin") private var fechaFinString: String,
    @SerializedName("cursoId") private var cursoId: Int,
    @SerializedName("estado") private var estadoEdicion: Boolean = true,
) {
    // Getters básicos
    fun getId(): String = id
    fun getNombreEdicion(): String = nombreEdicion

    // Getters para fechas con manejo de valores nulos
    fun getFechaInicio(): LocalDate {
        return fechaInicioString.takeIf { it.isNotBlank() }?.let {
            try {
                LocalDate.parse(it.substring(0, 10))
            } catch (e: Exception) {
                LocalDate.now()
            }
        } ?: LocalDate.now()
    }

    fun getFechaFin(): LocalDate {
        return fechaFinString.takeIf { it.isNotBlank() }?.let {
            try {
                LocalDate.parse(it.substring(0, 10))
            } catch (e: Exception) {
                LocalDate.now().plusMonths(1)
            }
        } ?: LocalDate.now().plusMonths(1)
    }

    fun getEstadoEdicion(): Boolean = estadoEdicion

    fun getCursoId(): Int = cursoId

}
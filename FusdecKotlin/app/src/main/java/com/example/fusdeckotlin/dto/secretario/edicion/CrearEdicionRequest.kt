package com.example.fusdeckotlin.dto.secretario.edicion

import com.google.gson.annotations.SerializedName
import java.time.LocalDate

data class CrearEdicionRequest(
    @SerializedName("tituloEdicion")
    val nombre: String,

    @SerializedName("fechaInicioEdicion")
    val fechaInicio: String,  // Formato: "YYYY-MM-DD"

    @SerializedName("fechaFinEdicion")
    val fechaFin: String,     // Formato: "YYYY-MM-DD"

    @SerializedName("cursoId")
    val cursoId: String,

    @SerializedName("estadoEdicion")
    val estado: Boolean = true,

    @SerializedName("estudiantes")
    val estudiantes: List<String> = emptyList()
) {
    companion object {
        fun from(
            nombre: String,
            fechaInicio: LocalDate,
            fechaFin: LocalDate,
            cursoId: String,
            estudiantes: List<String> = emptyList()
        ): CrearEdicionRequest {
            return CrearEdicionRequest(
                nombre = nombre,
                fechaInicio = fechaInicio.toString(),
                fechaFin = fechaFin.toString(),
                cursoId = cursoId,
                estado = true,
                estudiantes = estudiantes
            )
        }
    }
}
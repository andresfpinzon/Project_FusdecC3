package com.example.fusdeckotlin.dto.secretario.edicion

import com.google.gson.annotations.SerializedName
import java.time.LocalDate

data class CrearEdicionRequest(
    @SerializedName("nombreEdicion")
    val nombre: String,

    @SerializedName("fechaInicio")
    val fechaInicio: String,  // Formato: "YYYY-MM-DD"

    @SerializedName("fechaFin")
    val fechaFin: String,     // Formato: "YYYY-MM-DD"

    @SerializedName("cursoId")
    val cursoId: String,

    @SerializedName("instructorId")
    val instructorId: String,

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
            instructorId: String,
            estudiantes: List<String> = emptyList()
        ): CrearEdicionRequest {
            return CrearEdicionRequest(
                nombre = nombre,
                fechaInicio = fechaInicio.toString(),
                fechaFin = fechaFin.toString(),
                cursoId = cursoId,
                instructorId = instructorId,
                estado = true,
                estudiantes = estudiantes
            )
        }
    }
}
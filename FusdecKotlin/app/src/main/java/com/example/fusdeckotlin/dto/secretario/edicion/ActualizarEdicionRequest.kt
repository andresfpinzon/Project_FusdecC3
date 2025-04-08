package com.example.fusdeckotlin.dto.secretario.edicion

import com.google.gson.annotations.SerializedName
import java.time.LocalDate

data class ActualizarEdicionRequest(
    @SerializedName("nombreEdicion")
    val nombre: String? = null,

    @SerializedName("fechaInicio")
    val fechaInicio: String? = null,  // Formato: "YYYY-MM-DD"

    @SerializedName("fechaFin")
    val fechaFin: String? = null,     // Formato: "YYYY-MM-DD"

    @SerializedName("instructorId")
    val instructorId: String? = null,

    @SerializedName("estadoEdicion")
    val estado: Boolean? = null,

    @SerializedName("estudiantes")
    val estudiantes: List<String>? = null
) {
    companion object {
        fun from(
            nombre: String? = null,
            fechaInicio: LocalDate? = null,
            fechaFin: LocalDate? = null,
            instructorId: String? = null,
            estado: Boolean? = null,
            estudiantes: List<String>? = null
        ): ActualizarEdicionRequest {
            return ActualizarEdicionRequest(
                nombre = nombre,
                fechaInicio = fechaInicio?.toString(),
                fechaFin = fechaFin?.toString(),
                instructorId = instructorId,
                estado = estado,
                estudiantes = estudiantes
            )
        }
    }
}
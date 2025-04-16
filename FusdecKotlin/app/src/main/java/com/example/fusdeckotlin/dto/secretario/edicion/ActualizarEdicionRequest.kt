package com.example.fusdeckotlin.dto.secretario.edicion

import com.google.gson.annotations.SerializedName
import java.time.LocalDate

data class ActualizarEdicionRequest(
    @SerializedName("tituloEdicion")
    val nombre: String? = null,

    @SerializedName("fechaInicioEdicion")
    val fechaInicio: String? = null,  // Formato: "YYYY-MM-DD"

    @SerializedName("fechaFinEdicion")
    val fechaFin: String? = null,     // Formato: "YYYY-MM-DD"

    @SerializedName("cursoId")
    val cursoId: String? = null,

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
            cursoId: String? = null,
            estado: Boolean? = null,
            estudiantes: List<String>? = null
        ): ActualizarEdicionRequest {
            return ActualizarEdicionRequest(
                nombre = nombre,
                fechaInicio = fechaInicio?.toString(),
                fechaFin = fechaFin?.toString(),
                cursoId = cursoId,
                estado = estado,
                estudiantes = estudiantes
            )
        }
    }
}
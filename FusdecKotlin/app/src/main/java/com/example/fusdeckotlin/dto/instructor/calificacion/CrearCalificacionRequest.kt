package com.example.fusdeckotlin.dto.instructor.calificacion

import com.google.gson.annotations.SerializedName

data class CrearCalificacionRequest(
    @SerializedName("tituloCalificacion")
    val titulo: String,

    @SerializedName("aprobado")
    val aprobado: Boolean,

    @SerializedName("usuarioId")
    val usuarioId: String,

    @SerializedName("estadoCalificacion")
    val estado: Boolean = true,

    @SerializedName("estudiantes")
    val estudiantes: List<String> = emptyList()
) {
    companion object {
        fun from(
            titulo: String,
            aprobado: Boolean,
            usuarioId: String,
            estudiantes: List<String>,
            estado: Boolean = true
        ): CrearCalificacionRequest {
            return CrearCalificacionRequest(
                titulo = titulo,
                aprobado = aprobado,
                usuarioId = usuarioId,
                estado = estado,
                estudiantes = estudiantes
            )
        }
    }
}
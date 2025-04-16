package com.example.fusdeckotlin.dto.instructor.calificacion

import com.google.gson.annotations.SerializedName

data class ActualizarCalificacionRequest(
    @SerializedName("tituloCalificacion")
    val titulo: String? = null,

    @SerializedName("aprobado")
    val aprobado: Boolean? = null,

    @SerializedName("usuarioId")
    val usuarioId: String? = null,

    @SerializedName("estadoCalificacion")
    val estado: Boolean? = null,

    @SerializedName("estudiantes")
    val estudiantes: List<String>? = null
) {
    companion object {
        fun from(
            titulo: String? = null,
            aprobado: Boolean? = null,
            usuarioId: String? = null,
            estado: Boolean? = null,
            estudiantes: List<String>? = null
        ): ActualizarCalificacionRequest {
            return ActualizarCalificacionRequest(
                titulo = titulo,
                aprobado = aprobado,
                usuarioId = usuarioId,
                estado = estado,
                estudiantes = estudiantes
            )
        }
    }
}
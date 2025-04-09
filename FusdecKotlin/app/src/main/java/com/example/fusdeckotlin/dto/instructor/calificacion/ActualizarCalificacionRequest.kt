package com.example.fusdeckotlin.dto.instructor.calificacion

import com.google.gson.annotations.SerializedName

data class ActualizarCalificacionRequest(
    @SerializedName("tituloCalificacion")  // Cambiado de tituloAsistencia
    val titulo: String? = null,

    @SerializedName("aprobado")  // Nuevo campo específico de calificación
    val aprobado: Boolean? = null,

    @SerializedName("usuarioId")
    val usuarioId: String? = null,

    @SerializedName("estadoCalificacion")  // Cambiado de estadoAsistencia
    val estado: Boolean? = null,

    @SerializedName("estudiantes")
    val estudiantes: List<String>? = null
) {
    companion object {
        fun from(
            titulo: String? = null,
            aprobado: Boolean? = null,  // Cambiado de fecha a aprobado
            usuarioId: String? = null,
            estado: Boolean? = null,
            estudiantes: List<String>? = null
        ): ActualizarCalificacionRequest {
            return ActualizarCalificacionRequest(
                titulo = titulo,
                aprobado = aprobado,  // Ya no manejamos fecha
                usuarioId = usuarioId,
                estado = estado,
                estudiantes = estudiantes
            )
        }
    }
}
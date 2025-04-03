package com.example.fusdeckotlin.dto.instructor.asistencia

import com.google.gson.annotations.SerializedName
import java.time.LocalDate
import java.time.format.DateTimeFormatter

data class ActualizarAsistenciaRequest(
    @SerializedName("tituloAsistencia")
    val titulo: String? = null,

    @SerializedName("fechaAsistencia")
    val fecha: String? = null,

    @SerializedName("usuarioId")
    val usuarioId: String? = null,

    @SerializedName("estadoAsistencia")
    val estado: Boolean? = null,

    @SerializedName("estudiantes")
    val estudiantes: List<String>? = null
) {
    companion object {
        fun from(
            titulo: String? = null,
            fecha: LocalDate? = null,
            usuarioId: String? = null,
            estado: Boolean? = null,
            estudiantes: List<String>? = null
        ): ActualizarAsistenciaRequest {
            return ActualizarAsistenciaRequest(
                titulo = titulo,
                fecha = fecha?.format(DateTimeFormatter.ISO_DATE),
                usuarioId = usuarioId,
                estado = estado,
                estudiantes = estudiantes
            )
        }
    }
}
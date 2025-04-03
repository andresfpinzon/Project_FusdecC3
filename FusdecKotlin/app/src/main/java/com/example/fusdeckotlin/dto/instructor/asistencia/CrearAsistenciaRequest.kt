package com.example.fusdeckotlin.dto.instructor.asistencia

import com.google.gson.annotations.SerializedName
import java.time.LocalDate
import java.time.format.DateTimeFormatter

data class CrearAsistenciaRequest(
    @SerializedName("tituloAsistencia")
    val titulo: String,

    @SerializedName("fechaAsistencia")
    val fecha: String,

    @SerializedName("usuarioId")
    val usuarioId: String,

    @SerializedName("estadoAsistencia")
    val estado: Boolean = true,

    @SerializedName("estudiantes")
    val estudiantes: List<String>
) {
    companion object {

        fun from(
            titulo: String,
            fecha: LocalDate,
            usuarioId: String,
            estudiantes: List<String>,
            estado: Boolean = true
        ): CrearAsistenciaRequest {
            return CrearAsistenciaRequest(
                titulo = titulo,
                fecha = fecha.format(DateTimeFormatter.ISO_DATE),
                usuarioId = usuarioId,
                estado = estado,
                estudiantes = estudiantes
            )
        }
    }
}
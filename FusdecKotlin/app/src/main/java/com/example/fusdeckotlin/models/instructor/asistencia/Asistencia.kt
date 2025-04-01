package com.example.fusdeckotlin.models.instructor.asistencia

import com.example.fusdeckotlin.models.secretario.estudiante.Estudiante
import com.google.gson.annotations.SerializedName

data class Asistencia(
    @SerializedName("_id") val id: String? = null,
    @SerializedName("tituloAsistencia") val tituloAsistencia: String,
    @SerializedName("fechaAsistencia") val fechaAsistencia: String, // Formato ISO o "YYYY-MM-DD"
    @SerializedName("usuarioId") val usuarioId: String,
    @SerializedName("estadoAsistencia") val estadoAsistencia: Boolean = true,

    // Para enviar al backend (solo ID)
    @SerializedName("estudiantes") val estudiantesIds: List<String> = emptyList(),

    // Para recibir del backend (objetos poblados)
    @Transient val estudiantes: List<Estudiante> = emptyList()
)
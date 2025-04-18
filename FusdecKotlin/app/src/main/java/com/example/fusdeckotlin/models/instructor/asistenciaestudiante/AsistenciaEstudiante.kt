package com.example.fusdeckotlin.models.instructor.asistenciaestudiante

import com.google.gson.annotations.SerializedName

data class AsistenciaEstudiante(
    @SerializedName("asistenciaId") private val asistenciaId: Int,
    @SerializedName("estudianteId") private val estudianteId: String
) {
    fun getAsistenciaId(): Int = asistenciaId
     fun getEstudianteId(): String = estudianteId
}
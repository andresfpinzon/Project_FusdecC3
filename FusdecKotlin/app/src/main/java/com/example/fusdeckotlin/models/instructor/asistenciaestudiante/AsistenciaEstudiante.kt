package com.example.fusdeckotlin.models.instructor.asistenciaestudiante

data class AsistenciaEstudiante(
    private val asistenciaId: Int,
    private val estudianteId: String
) {
    fun getAsistenciaId(): Int = asistenciaId
    fun getEstudianteId(): String = estudianteId
}
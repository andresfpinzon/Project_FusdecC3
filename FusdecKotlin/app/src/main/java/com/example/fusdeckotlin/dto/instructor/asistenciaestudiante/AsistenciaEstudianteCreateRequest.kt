package com.example.fusdeckotlin.dto.instructor.asistenciaestudiante

import com.google.gson.annotations.SerializedName

data class AsistenciaEstudianteCreateRequest(
    @SerializedName("asistenciaId")
    val asistenciaId: Int,

    @SerializedName("estudianteId")
    val estudianteId: String
)
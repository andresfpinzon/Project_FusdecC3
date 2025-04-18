package com.example.fusdeckotlin.dto.instructor.asistencia

import com.google.gson.annotations.SerializedName

data class CrearAsistenciaRequest(
    @SerializedName("titulo")
    val titulo: String,

    @SerializedName("fecha")
    val fecha: String,

    @SerializedName("usuarioId")
    val usuarioId: String,

    @SerializedName("estado")
    val estado: Boolean = true
)
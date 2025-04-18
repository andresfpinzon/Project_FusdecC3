package com.example.fusdeckotlin.dto.instructor.asistencia

import com.google.gson.annotations.SerializedName

data class ActualizarAsistenciaRequest(
    @SerializedName("titulo")
    val titulo: String? = null,

    @SerializedName("fecha")
    val fecha: String? = null,

    @SerializedName("estado")
    val estado: Boolean? = null
)
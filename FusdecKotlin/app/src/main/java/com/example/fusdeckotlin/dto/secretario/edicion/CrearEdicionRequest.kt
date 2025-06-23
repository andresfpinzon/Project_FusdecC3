package com.example.fusdeckotlin.dto.secretario.edicion

import com.google.gson.annotations.SerializedName

data class CrearEdicionRequest(
    @SerializedName("titulo")
    val nombre: String,

    @SerializedName("fechaInicio")
    val fechaInicio: String,  // Formato: "YYYY-MM-DD"

    @SerializedName("fechaFin")
    val fechaFin: String,     // Formato: "YYYY-MM-DD"

    @SerializedName("cursoId")
    val cursoId: Int?,

    @SerializedName("estado")
    val estado: Boolean = true
)
package com.example.fusdeckotlin.dto.secretario.edicion

import com.google.gson.annotations.SerializedName

data class ActualizarEdicionRequest(
    @SerializedName("titulo")
    val nombre: String? = null,

    @SerializedName("fechaInicio")
    val fechaInicio: String? = null,  // Formato: "YYYY-MM-DD"

    @SerializedName("fechaFin")
    val fechaFin: String? = null,     // Formato: "YYYY-MM-DD"

    @SerializedName("cursoId")
    val cursoId: Int? = null,

    @SerializedName("estado")
    val estado: Boolean? = null
)
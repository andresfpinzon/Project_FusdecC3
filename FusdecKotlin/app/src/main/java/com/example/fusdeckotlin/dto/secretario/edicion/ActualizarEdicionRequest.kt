package com.example.fusdeckotlin.dto.secretario.edicion

import com.google.gson.annotations.SerializedName
import java.time.LocalDate

data class ActualizarEdicionRequest(
    @SerializedName("tituloEdicion")
    val nombre: String? = null,

    @SerializedName("fechaInicioEdicion")
    val fechaInicio: String? = null,  // Formato: "YYYY-MM-DD"

    @SerializedName("fechaFinEdicion")
    val fechaFin: String? = null,     // Formato: "YYYY-MM-DD"

    @SerializedName("cursoId")
    val cursoId: String? = null,

    @SerializedName("estadoEdicion")
    val estado: Boolean? = null,

)
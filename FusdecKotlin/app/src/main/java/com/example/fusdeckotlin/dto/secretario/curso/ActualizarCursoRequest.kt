package com.example.fusdeckotlin.dto.secretario.curso

import com.google.gson.annotations.SerializedName

data class ActualizarCursoRequest(
    @SerializedName("nombre")
    val nombre: String? = null,

    @SerializedName("descripcion")
    val descripcion: String? = null,

    @SerializedName("intensidadHoraria")
    val intensidadHoraria: String? = null,

    @SerializedName("fundacionId")
    val fundacionId: Int? = null,

    @SerializedName("estado")
    val estado: Boolean? = null
)
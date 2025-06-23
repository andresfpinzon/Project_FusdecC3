package com.example.fusdeckotlin.dto.secretario.curso

import com.google.gson.annotations.SerializedName

data class CrearCursoRequest(
    @SerializedName("nombre")
    val nombre: String,

    @SerializedName("descripcion")
    val descripcion: String,

    @SerializedName("intensidadHoraria")
    val intensidadHoraria: String,

    @SerializedName("fundacionId")
    val fundacionId: Int,

    @SerializedName("estado")
    val estado: Boolean = true
)
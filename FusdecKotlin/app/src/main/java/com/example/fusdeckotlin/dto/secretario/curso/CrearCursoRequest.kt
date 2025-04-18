package com.example.fusdeckotlin.dto.secretario.curso

import com.google.gson.annotations.SerializedName

data class CrearCursoRequest(
    @SerializedName("nombreCurso")
    val nombre: String,

    @SerializedName("descripcionCurso")
    val descripcion: String,

    @SerializedName("intensidadHorariaCurso")
    val intensidadHoraria: String,

    @SerializedName("fundacionId")
    val fundacionId: String,

    @SerializedName("estadoCurso")
    val estado: Boolean = true,
)
package com.example.fusdeckotlin.dto.secretario.curso

import com.google.gson.annotations.SerializedName

data class ActualizarCursoRequest(
    @SerializedName("nombreCurso")
    val nombre: String? = null,

    @SerializedName("descripcionCurso")
    val descripcion: String? = null,

    @SerializedName("intensidadHorariaCurso")
    val intensidadHoraria: String? = null,

    @SerializedName("fundacionId")
    val fundacionId: String? = null,

    @SerializedName("estadoCurso")
    val estado: Boolean? = null,

)
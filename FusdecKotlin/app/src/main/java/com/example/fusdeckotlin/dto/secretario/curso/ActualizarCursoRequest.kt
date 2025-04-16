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

    @SerializedName("ediciones")
    val ediciones: List<String>? = null
) {
    companion object {
        fun from(
            nombre: String? = null,
            descripcion: String? = null,
            intensidadHoraria: String? = null,
            fundacionId: String? = null,
            estado: Boolean? = null,
            ediciones: List<String>? = null
        ): ActualizarCursoRequest {
            return ActualizarCursoRequest(
                nombre = nombre,
                descripcion = descripcion,
                intensidadHoraria = intensidadHoraria,
                fundacionId = fundacionId,
                estado = estado,
                ediciones = ediciones
            )
        }
    }
}
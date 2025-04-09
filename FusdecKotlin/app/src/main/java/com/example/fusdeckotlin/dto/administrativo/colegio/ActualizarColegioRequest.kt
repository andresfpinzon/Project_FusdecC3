package com.example.fusdeckotlin.dto.administrativo.colegio

import com.google.gson.annotations.SerializedName

data class ActualizarColegioRequest(
    @SerializedName("nombreColegio")
    val nombre: String? = null,

    @SerializedName("emailColegio")
    val email: String? = null,

    @SerializedName("direccionColegio")
    val direccion: String? = null,

    @SerializedName("estadoColegio")
    val estado: Boolean? = null,

    @SerializedName("estudiantes")
    val estudiantes: List<String>? = null
) {
    companion object {
        fun from(
            nombre: String? = null,
            email: String? = null,
            direccion: String? = null,
            estado: Boolean? = null,
            estudiantes: List<String>? = null
        ): ActualizarColegioRequest {
            return ActualizarColegioRequest(
                nombre = nombre,
                email = email,
                direccion = direccion,
                estado = estado,
                estudiantes = estudiantes
            )
        }
    }
}
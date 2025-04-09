package com.example.fusdeckotlin.dto.administrativo.colegio

import com.google.gson.annotations.SerializedName

data class CrearColegioRequest(
    @SerializedName("nombreColegio")
    val nombre: String,

    @SerializedName("emailColegio")
    val email: String,

    @SerializedName("direccionColegio")
    val direccion: String,

    @SerializedName("estadoColegio")
    val estado: Boolean = true,

    @SerializedName("estudiantes")
    val estudiantes: List<String> = emptyList()
) {
    companion object {
        fun from(
            nombre: String,
            email: String,
            direccion: String,
            estudiantes: List<String> = emptyList(),
            estado: Boolean = true
        ): CrearColegioRequest {
            return CrearColegioRequest(
                nombre = nombre,
                email = email,
                direccion = direccion,
                estado = estado,
                estudiantes = estudiantes
            )
        }
    }
}
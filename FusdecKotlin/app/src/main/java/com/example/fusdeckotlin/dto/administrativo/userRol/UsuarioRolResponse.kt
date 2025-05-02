package com.example.fusdeckotlin.dto.administrativo.userRol

import com.google.gson.annotations.SerializedName

data class UsuarioRolResponse(
    @SerializedName("usuarioNumeroDocumento")
    val usuarioNumeroDocumento: String,

    @SerializedName("rolId")
    val rolId: Int,

    @SerializedName("rolNombre")
    val rolNombre: String
) {

    fun getRol(): String = rolNombre
}
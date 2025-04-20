package com.example.fusdeckotlin.models.administrativo.userRol

import com.google.gson.annotations.SerializedName

data class UserRolModel(
    @SerializedName("usuario_numero_documento") val usuarioNumeroDocumento: String,
    @SerializedName("rol") private var rol: String
){
    fun getRol(): String = rol
}

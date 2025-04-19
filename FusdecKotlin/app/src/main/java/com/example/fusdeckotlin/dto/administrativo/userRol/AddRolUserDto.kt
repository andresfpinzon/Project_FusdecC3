package com.example.fusdeckotlin.dto.administrativo.userRol

import com.google.gson.annotations.SerializedName

data class AddRolUserDto(
    @SerializedName("usuario_numero_documento") private var usuarioNumeroDocumento: String,
    @SerializedName("rol") private var rol: String
)
